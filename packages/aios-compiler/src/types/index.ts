export type CompilerStep = 1 | 2 | 3 | 4 | 5;

export type GeminiModel =
  | 'gemini-2.0-flash'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-flash-8b'
  | 'gemini-2.0-flash-lite';

export type AiProvider = 'gemini' | 'groq';

export interface CompilerConfig {
  aiProvider: AiProvider;
  geminiApiKey: string;
  geminiModel: GeminiModel;
  groqApiKey: string;
  githubToken: string;
  repoName: string;
  repoDescription: string;
  repoPrivate: boolean;
  useGroqValidation: boolean;
  groqApiKey: string;
}

export interface GeneratedFile {
  filename: string;  // e.g. "src/App.tsx"
  content: string;
  language: string;  // "typescript", "css", "json", etc.
  lineCount: number;
}

export interface GenerationResult {
  rawOutput: string;
  files: GeneratedFile[];
  model: string;
  tokensUsed?: number;
  generatedAt: string;
  passNumber: 1 | 2; // 1 = Gemini, 2 = Groq validation
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  cloneUrl: string;
  defaultBranch: string;
  private: boolean;
}

export type PushStatus = 'idle' | 'creating-repo' | 'pushing-files' | 'done' | 'error';

export interface PushResult {
  repo: GitHubRepo;
  pushedFiles: string[];
  commitSha: string;
  status: PushStatus;
}

export interface CompilerState {
  step: CompilerStep;
  prompt: string;
  config: Partial<CompilerConfig>;
  generationResult: GenerationResult | null;
  pushResult: PushResult | null;
  isLoading: boolean;
  error: string | null;
  streamingOutput: string;
}
