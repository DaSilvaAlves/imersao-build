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

function buildScaffold(repoName: string): Array<{ path: string; content: string }> {
  const pkgJson = JSON.stringify({
    name: repoName,
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
    },
    dependencies: {
      'lucide-react': '^0.469.0',
      motion: '^11.15.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
    devDependencies: {
      '@types/react': '^19.0.2',
      '@types/react-dom': '^19.0.2',
      '@vitejs/plugin-react': '^4.3.4',
      typescript: '~5.6.2',
      vite: '^6.0.5',
    },
  }, null, 2);

  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;

  const indexHtml = `<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${repoName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  const tsconfig = JSON.stringify({
    files: [],
    references: [{ path: './tsconfig.app.json' }, { path: './tsconfig.node.json' }],
  }, null, 2);

  const tsconfigApp = JSON.stringify({
    compilerOptions: {
      tsBuildInfoFile: './node_modules/.tmp/tsconfig.app.tsbuildinfo',
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      isolatedModules: true,
      moduleDetection: 'force',
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
    },
    include: ['src'],
  }, null, 2);

  const tsconfigNode = JSON.stringify({
    compilerOptions: {
      tsBuildInfoFile: './node_modules/.tmp/tsconfig.node.tsbuildinfo',
      target: 'ES2022',
      lib: ['ES2023'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      isolatedModules: true,
      moduleDetection: 'force',
      noEmit: true,
      strict: true,
    },
    include: ['vite.config.ts'],
  }, null, 2);

  const vercelJson = JSON.stringify({
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
    framework: 'vite',
    rewrites: [{ source: '/(.*)', destination: '/index.html' }],
  }, null, 2);

  const mainTsx = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;

  return [
    { path: 'package.json',       content: pkgJson },
    { path: 'vite.config.ts',     content: viteConfig },
    { path: 'index.html',         content: indexHtml },
    { path: 'tsconfig.json',      content: tsconfig },
    { path: 'tsconfig.app.json',  content: tsconfigApp },
    { path: 'tsconfig.node.json', content: tsconfigNode },
    { path: 'vercel.json',        content: vercelJson },
    { path: 'src/main.tsx',       content: mainTsx },
  ];
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

  // Init repo with README
  const readmeContent = `# ${repo.name}\n\nGerado automaticamente pelo AIOS Compiler — Imersão IA Portugal 🚀\n`;
  lastCommitSha = await pushFileToRepo(token, owner, repo.name, 'README.md', readmeContent, 'main');
  pushedFiles.push('README.md');

  // Critical files always come from scaffold — AI output NEVER overrides these
  // Root cause fix: AI-generated main.tsx/package.json often has syntax errors
  const PROTECTED = new Set([
    'src/main.tsx', 'package.json', 'vite.config.ts',
    'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json',
    'vercel.json', 'index.html',
  ]);
  const aiFilePaths = new Set(files.map(f => f.filename));
  const scaffold = buildScaffold(repo.name).filter(s => PROTECTED.has(s.path) || !aiFilePaths.has(s.path));
  for (const s of scaffold) {
    lastCommitSha = await pushFileToRepo(token, owner, repo.name, s.path, s.content, 'main');
    pushedFiles.push(s.path);
  }

  const safeFiles = files.filter(f => !PROTECTED.has(f.filename));
  for (let i = 0; i < safeFiles.length; i++) {
    const file = safeFiles[i];
    onProgress(i + 1, safeFiles.length, file.filename);
    lastCommitSha = await pushFileToRepo(
      token,
      owner,
      repo.name,
      file.filename,
      file.content,
      'main'
    );
    pushedFiles.push(file.filename);

    // Small delay to avoid rate limiting
    if (i < safeFiles.length - 1) await new Promise(r => setTimeout(r, 300));
  }

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
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50);
}
