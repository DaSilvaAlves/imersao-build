import type { GeneratedFile, GitHubRepo, PushResult } from '../../types';

const GITHUB_API = 'https://api.github.com';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
}

interface RepoCreatePayload {
  name: string;
  description: string;
  private: boolean;
  auto_init: false;
}

async function githubFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    let message = `GitHub API ${response.status}`;
    try {
      const parsed = JSON.parse(body) as { message?: string };
      if (parsed.message) message = parsed.message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getAuthenticatedUser(token: string): Promise<GitHubUser> {
  return githubFetch<GitHubUser>('/user', token);
}

export async function createRepository(
  token: string,
  name: string,
  description: string,
  isPrivate: boolean
): Promise<GitHubRepo> {
  const payload: RepoCreatePayload = {
    name,
    description,
    private: isPrivate,
    auto_init: false,
  };

  const raw = await githubFetch<{
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    clone_url: string;
    default_branch: string;
    private: boolean;
  }>('/user/repos', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    id: raw.id,
    name: raw.name,
    fullName: raw.full_name,
    htmlUrl: raw.html_url,
    cloneUrl: raw.clone_url,
    defaultBranch: raw.default_branch || 'main',
    private: raw.private,
  };
}

export async function pushFileToRepo(
  token: string,
  owner: string,
  repo: string,
  filePath: string,
  content: string,
  branch: string = 'main',
  sha?: string
): Promise<string> {
  const encoded = btoa(unescape(encodeURIComponent(content)));

  const body: Record<string, unknown> = {
    message: `feat: add ${filePath}`,
    content: encoded,
    branch,
  };
  if (sha) body['sha'] = sha;

  const result = await githubFetch<{ commit: { sha: string } }>(
    `/repos/${owner}/${repo}/contents/${filePath}`,
    token,
    { method: 'PUT', body: JSON.stringify(body) }
  );

  return result.commit.sha;
}

export async function pushAllFiles(
  token: string,
  owner: string,
  repo: GitHubRepo,
  files: GeneratedFile[],
  onProgress: (done: number, total: number, filename: string) => void
): Promise<PushResult> {
  const pushedFiles: string[] = [];
  let lastCommitSha = '';

  // 1. README
  const readmeContent = `# ${repo.name}\n\nGerado automaticamente pelo AIOS Compiler — Imersão IA Portugal 🚀\n`;
  lastCommitSha = await pushFileToRepo(token, owner, repo.name, 'README.md', readmeContent, 'main');
  pushedFiles.push('README.md');

  // 2. vercel.json — static hosting, zero build command
  const vercelJson = JSON.stringify({ cleanUrls: true }, null, 2);
  await new Promise(r => setTimeout(r, 200));
  lastCommitSha = await pushFileToRepo(token, owner, repo.name, 'vercel.json', vercelJson, 'main');
  pushedFiles.push('vercel.json');

  // 3. index.html from LLM (the only generated file)
  const htmlFile = files.find(f => f.filename === 'index.html') ?? files[0];
  if (!htmlFile) throw new Error('Nenhum ficheiro HTML gerado. Tenta regenerar.');

  await new Promise(r => setTimeout(r, 200));
  onProgress(1, 1, 'index.html');
  lastCommitSha = await pushFileToRepo(token, owner, repo.name, 'index.html', htmlFile.content, 'main');
  pushedFiles.push('index.html');

  return {
    repo,
    pushedFiles,
    commitSha: lastCommitSha,
    status: 'done',
  };
}

export function generateRepoName(projectName: string): string {
  return projectName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50);
}
