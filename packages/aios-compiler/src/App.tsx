import { useState, useCallback, useEffect } from 'react';
import { Wrench, Key, Zap, FolderOpen, Github, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import FileViewer from './features/file-viewer/FileViewer';
import { generateWithGemini, generateWithGroq, validateWithGroq, fixSyntaxWithGroq, preProcessCode, GEMINI_DEFAULT_MODEL } from './features/code-generator/GeminiService';
import { parseGeneratedFiles, sortFiles } from './features/code-generator/CodeParser';
import {
  getAuthenticatedUser,
  createRepository,
  pushAllFiles,
  generateRepoName,
} from './features/github-pusher/GitHubService';
import type { CompilerState, CompilerStep, GenerationResult } from './types';
import { saveProject } from './lib/supabase';

const STORAGE_KEY = 'aios_compiler_config';
const VERCEL_IMPORT_URL = 'https://vercel.com/import/git?s=';

const STEPS: { num: CompilerStep; label: string; icon: React.ReactNode }[] = [
  { num: 1, label: 'Prompt', icon: <Zap size={14} /> },
  { num: 2, label: 'Configurar', icon: <Key size={14} /> },
  { num: 3, label: 'Gerar', icon: <Loader size={14} /> },
  { num: 4, label: 'Rever', icon: <FolderOpen size={14} /> },
  { num: 5, label: 'Publicar', icon: <Github size={14} /> },
];

function loadSavedConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Partial<CompilerState['config']>) : {};
  } catch { return {}; }
}

export default function App() {
  const [state, setState] = useState<CompilerState>({
    step: 1,
    prompt: '',
    config: loadSavedConfig(),
    generationResult: null,
    pushResult: null,
    isLoading: false,
    error: null,
    streamingOutput: '',
  });

  const [pushProgress, setPushProgress] = useState({ done: 0, total: 0, current: '' });
  const [githubUser, setGithubUser] = useState<{ login: string } | null>(null);

  // Read prompt from URL params (pipeline integration)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const promptParam = params.get('prompt');
    if (promptParam) {
      setState(s => ({ ...s, prompt: decodeURIComponent(promptParam) }));
    }
  }, []);

  function update(partial: Partial<CompilerState>) {
    setState(s => ({ ...s, ...partial }));
  }

  function saveConfig(config: Partial<CompilerState['config']>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    update({ config });
  }

  async function handleVerifyGitHub() {
    if (!state.config.githubToken) return;
    try {
      const user = await getAuthenticatedUser(state.config.githubToken);
      setGithubUser({ login: user.login });
    } catch (e) {
      update({ error: `Token GitHub inválido: ${(e as Error).message}` });
    }
  }

  const handleGenerate = useCallback(async () => {
    const activeProvider = state.config.aiProvider ?? 'groq';
    const requiredKey = activeProvider === 'groq' ? state.config.groqApiKey : state.config.geminiApiKey;
    if (!requiredKey || !state.prompt) return;
    update({ isLoading: true, error: null, streamingOutput: '', step: 3 });

    // Auto-verificar token GitHub se ainda não verificado
    if (state.config.githubToken && !githubUser) {
      try {
        const user = await getAuthenticatedUser(state.config.githubToken);
        setGithubUser({ login: user.login });
      } catch {
        // Token inválido — continua a geração mas avisa no passo de publicar
      }
    }

    try {
      let rawOutput = '';
      const onChunk = (chunk: string) => {
        rawOutput += chunk;
        setState(s => ({ ...s, streamingOutput: s.streamingOutput + chunk }));
      };

      // Pass 1: Generate (Gemini or Groq/Llama)
      if ((state.config.aiProvider ?? 'groq') === 'groq') {
        if (!state.config.groqApiKey) throw new Error('Chave Groq em falta — preenche em Configuração.');
        rawOutput = await generateWithGroq(state.prompt, state.config.groqApiKey, onChunk);
      } else {
        if (!state.config.geminiApiKey) throw new Error('Chave Gemini em falta.');
        await generateWithGemini(state.prompt, state.config.geminiApiKey, onChunk, state.config.geminiModel ?? GEMINI_DEFAULT_MODEL);
      }

      // Pass 2: Groq validation — only when Gemini was used for generation
      // (Groq validating its own output degrades quality and introduces new errors)
      const usedGroq = (state.config.aiProvider ?? 'groq') === 'groq';
      let finalOutput = rawOutput;
      if (!usedGroq && state.config.groqApiKey) {
        setState(s => ({
          ...s,
          streamingOutput: s.streamingOutput + '\n\n--- 🔍 A validar com Groq Llama 3... ---\n\n',
        }));
        let groqOutput = '';
        const onGroqChunk = (c: string) => {
          groqOutput += c;
          setState(s => ({ ...s, streamingOutput: s.streamingOutput + c }));
        };
        finalOutput = await validateWithGroq(rawOutput, state.config.groqApiKey, onGroqChunk);
      }

      // Always run deterministic pre-processor on final output — regardless of LLM used
      finalOutput = preProcessCode(finalOutput);

      // Always run dedicated syntax fixer if Groq key available — catches [x,y]=hook() errors
      if (state.config.groqApiKey) {
        setState(s => ({
          ...s,
          streamingOutput: s.streamingOutput + '\n\n--- 🔧 A corrigir sintaxe... ---\n\n',
        }));
        let fixOutput = '';
        const onFixChunk = (c: string) => {
          fixOutput += c;
          setState(s => ({ ...s, streamingOutput: s.streamingOutput + c }));
        };
        finalOutput = await fixSyntaxWithGroq(finalOutput, state.config.groqApiKey, onFixChunk);
      }

      const parsedFiles = sortFiles(parseGeneratedFiles(finalOutput));
      const result: GenerationResult = {
        rawOutput: finalOutput,
        files: parsedFiles,
        model: state.config.useGroqValidation ? 'gemini-2.0-flash + groq-llama3' : 'gemini-2.0-flash',
        generatedAt: new Date().toISOString(),
        passNumber: state.config.useGroqValidation ? 2 : 1,
      };

      update({ generationResult: result, isLoading: false, step: 4 });
    } catch (e) {
      update({ error: (e as Error).message, isLoading: false });
    }
  }, [state.config, state.prompt]);

  async function handlePush() {
    const { config, generationResult } = state;
    if (!config.githubToken || !githubUser || !generationResult) return;

    const baseName = config.repoName?.trim() || generateRepoName('meu-projeto');
    const repoName = `${baseName}-${Date.now().toString(36)}`;

    update({ isLoading: true, error: null, step: 5 });
    try {
      const repo = await createRepository(
        config.githubToken,
        repoName,
        config.repoDescription ?? 'Gerado pelo AIOS Compiler — Imersão IA',
        config.repoPrivate ?? false
      );

      const pushResult = await pushAllFiles(
        config.githubToken,
        githubUser.login,
        repo,
        generationResult.files,
        (done, total, filename) => setPushProgress({ done, total, current: filename })
      );

      // Persist to Supabase community dashboard
      void saveProject({
        name: repoName,
        description: config.repoDescription ?? 'Gerado pelo AIOS Compiler — Imersão IA',
        github_url: repo.htmlUrl,
        tech_stack: ['React', 'TypeScript', 'Vite', 'CSS puro'],
        status: 'deployed',
        imersao_num: 1,
      });

      update({ pushResult, isLoading: false });
    } catch (e) {
      const msg = (e as Error).message;
      const isAuthError = /401|403|Bad credentials|requires authentication/i.test(msg);
      const isDuplicateRepo = /422|already exists|name already exists/i.test(msg);

      if (isAuthError) {
        setGithubUser(null);
        update({ error: 'Token GitHub inválido ou expirado — volta ao passo 2 e verifica o token.', isLoading: false, step: 2 });
      } else if (isDuplicateRepo) {
        update({ error: 'Já existe um repositório com este nome. Altera o nome do repositório e tenta de novo.', isLoading: false, step: 5 });
      } else {
        update({ error: msg, isLoading: false, step: 4 });
      }
    }
  }

  const { step, prompt, config, generationResult, pushResult, isLoading, error, streamingOutput } = state;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <Wrench size={22} className="brand-icon" />
          <div>
            <h1 className="brand-title">AIOS Compiler</h1>
            <p className="brand-sub">Prompt → Código → GitHub em segundos</p>
          </div>
        </div>
        <div className="header-pipeline">
          <span className="pipeline-step done">Optimizer</span>
          <span className="pipeline-arrow">→</span>
          <span className="pipeline-step active">Compiler</span>
          <span className="pipeline-arrow">→</span>
          <span className="pipeline-step">AI Velocity</span>
        </div>
      </header>

      {/* Step indicator */}
      <div className="step-indicator">
        {STEPS.map(s => (
          <div
            key={s.num}
            className={`step-item ${step === s.num ? 'active' : ''} ${step > s.num ? 'done' : ''}`}
          >
            <div className="step-circle">
              {step > s.num ? <CheckCircle size={14} /> : s.icon}
            </div>
            <span>{s.label}</span>
            {s.num < STEPS.length && <div className="step-connector" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          {error}
          <button onClick={() => update({ error: null })}>✕</button>
        </div>
      )}

      {/* Step content */}
      <main className="app-main">

        {/* STEP 1: Prompt */}
        {step === 1 && (
          <div className="step-content">
            <h2 className="step-title">
              <Zap size={18} /> O teu Prompt Optimizado
            </h2>
            <p className="step-desc">Cole ou revê o prompt gerado pelo Prompt Optimizer.</p>
            <textarea
              className="prompt-textarea"
              value={prompt}
              onChange={e => update({ prompt: e.target.value })}
              placeholder="Cola aqui o prompt gerado pelo Prompt Optimizer..."
              rows={16}
              spellCheck={false}
            />
            <div className="step-actions">
              <button
                className="btn-primary"
                onClick={() => update({ step: 2 })}
                disabled={!prompt.trim()}
              >
                Próximo: Configurar APIs →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Config */}
        {step === 2 && (
          <div className="step-content">
            <h2 className="step-title">
              <Key size={18} /> Configuração das APIs
            </h2>
            <p className="step-desc">As tuas chaves são guardadas localmente no browser.</p>

            <div className="config-grid">
              <div className="config-section">
                <h3>🤖 Motor de IA (Obrigatório)</h3>
                <select
                  className="config-input"
                  value={config.aiProvider ?? 'groq'}
                  onChange={e => saveConfig({ ...config, aiProvider: e.target.value as import('./types').AiProvider })}
                >
                  <option value="groq">🦙 Groq / Llama 3.3 70B — GRATUITO (recomendado)</option>
                  <option value="gemini">✨ Google Gemini</option>
                </select>

                {(config.aiProvider ?? 'groq') === 'groq' ? (
                  <>
                    <p className="config-hint" style={{ marginTop: 8 }}>
                      Chave gratuita em{' '}
                      <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer">
                        console.groq.com/keys
                      </a>
                    </p>
                    <input
                      type="password"
                      className="config-input"
                      placeholder="gsk_..."
                      value={config.groqApiKey ?? ''}
                      onChange={e => saveConfig({ ...config, groqApiKey: e.target.value })}
                    />
                  </>
                ) : (
                  <>
                    <p className="config-hint" style={{ marginTop: 8 }}>
                      Chave gratuita em{' '}
                      <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                        aistudio.google.com
                      </a>
                    </p>
                    <input
                      type="password"
                      className="config-input"
                      placeholder="AIza..."
                      value={config.geminiApiKey ?? ''}
                      onChange={e => saveConfig({ ...config, geminiApiKey: e.target.value })}
                    />
                    <select
                      className="config-input"
                      style={{ marginTop: 8 }}
                      value={config.geminiModel ?? GEMINI_DEFAULT_MODEL}
                      onChange={e => saveConfig({ ...config, geminiModel: e.target.value as import('./types').GeminiModel })}
                    >
                      <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                      <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite</option>
                    </select>
                  </>
                )}
              </div>

              <div className="config-section">
                <h3>🐙 GitHub Personal Access Token</h3>
                <p className="config-hint">
                  <a href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=AIOS+Compiler" target="_blank" rel="noopener noreferrer">
                    Criar token no GitHub →
                  </a>
                  {' '}(marcar scope: <strong>repo</strong>)
                </p>
                <div className="input-row">
                  <input
                    type="password"
                    className="config-input"
                    placeholder="ghp_..."
                    value={config.githubToken ?? ''}
                    onChange={e => {
                      saveConfig({ ...config, githubToken: e.target.value });
                      setGithubUser(null);
                    }}
                  />
                  <button className="btn-secondary" onClick={handleVerifyGitHub}>
                    Verificar
                  </button>
                </div>
                {githubUser && (
                  <p className="success-msg">
                    <CheckCircle size={14} /> Autenticado como <strong>@{githubUser.login}</strong>
                  </p>
                )}
              </div>

              <div className="config-section">
                <h3>📁 Nome do Repositório</h3>
                <input
                  type="text"
                  className="config-input"
                  placeholder="meu-projeto"
                  value={config.repoName ?? ''}
                  onChange={e => saveConfig({ ...config, repoName: e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '-') })}
                />
                <input
                  type="text"
                  className="config-input"
                  style={{ marginTop: 8 }}
                  placeholder="Descrição do projecto (opcional)"
                  value={config.repoDescription ?? ''}
                  onChange={e => saveConfig({ ...config, repoDescription: e.target.value })}
                />
              </div>

              {(config.aiProvider ?? 'gemini') === 'gemini' && (
                <div className="config-section">
                  <h3>🔍 Validação automática de código (Opcional)</h3>
                  <p className="config-hint">
                    Se forneceres uma chave Groq, o código gerado é validado e corrigido automaticamente antes de publicar.
                  </p>
                  <input
                    type="password"
                    className="config-input"
                    placeholder="Chave Groq (opcional) — console.groq.com/keys"
                    value={config.groqApiKey ?? ''}
                    onChange={e => saveConfig({ ...config, groqApiKey: e.target.value })}
                  />
                  {config.groqApiKey && (
                    <p className="success-msg" style={{ marginTop: 6 }}>
                      <CheckCircle size={14} /> Validação automática activa
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="step-actions">
              <button className="btn-secondary" onClick={() => update({ step: 1 })}>
                ← Voltar
              </button>
              <button
                className="btn-primary"
                onClick={handleGenerate}
                disabled={(config.aiProvider ?? 'gemini') === 'groq' ? !config.groqApiKey : !config.geminiApiKey}
              >
                🚀 Gerar Código
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Generating */}
        {step === 3 && (
          <div className="step-content">
            <h2 className="step-title">
              <Loader size={18} className="spin" /> A gerar o teu código...
            </h2>
            <p className="step-desc">
              {isLoading ? 'A Gemini está a trabalhar no teu projecto. Aguarda...' : 'Geração concluída!'}
            </p>
            <div className="stream-output">
              <pre>{streamingOutput || 'A iniciar...'}</pre>
            </div>
            {!isLoading && generationResult && (
              <div className="step-actions">
                <button className="btn-primary" onClick={() => update({ step: 4 })}>
                  Rever ficheiros gerados →
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Review */}
        {step === 4 && generationResult && (
          <div className="step-content step-content-wide">
            <div className="review-header">
              <div>
                <h2 className="step-title">
                  <FolderOpen size={18} /> {generationResult.files.length} ficheiros gerados
                </h2>
                <p className="step-desc">
                  Modelo: <strong>{generationResult.model}</strong> · Revê o código antes de publicar.
                </p>
              </div>
              <div className="step-actions">
                <button className="btn-secondary" onClick={() => update({ step: 2 })}>
                  ← Regenerar
                </button>
                <button className="btn-primary" onClick={() => update({ step: 5 })}>
                  <Github size={16} /> Publicar no GitHub →
                </button>
              </div>
            </div>
            <FileViewer files={generationResult.files} />
          </div>
        )}

        {/* STEP 5: Push */}
        {step === 5 && (
          <div className="step-content">
            {!pushResult ? (
              <>
                <h2 className="step-title">
                  <Github size={18} /> Publicar no GitHub
                </h2>
                <div className="push-summary">
                  <div className="push-info">
                    <span>📁 Repositório:</span>
                    <strong>{config.repoName || 'meu-projeto'}</strong>
                  </div>
                  <div className="push-info">
                    <span>👤 Conta:</span>
                    <strong>@{githubUser?.login ?? '—'}</strong>
                  </div>
                  <div className="push-info">
                    <span>📄 Ficheiros:</span>
                    <strong>{generationResult?.files.length ?? 0}</strong>
                  </div>
                </div>
                {isLoading && pushProgress.total > 0 && (
                  <div className="push-progress">
                    <div
                      className="push-progress-bar"
                      style={{ width: `${(pushProgress.done / pushProgress.total) * 100}%` }}
                    />
                    <p>
                      {pushProgress.done}/{pushProgress.total} — {pushProgress.current}
                    </p>
                  </div>
                )}
                {!githubUser && (
                  <p className="error-inline">
                    <AlertCircle size={14} /> Token GitHub não verificado — volta ao passo 2 e clica em "Verificar".
                  </p>
                )}
                <div className="step-actions">
                  <button className="btn-secondary" onClick={() => update({ step: 4 })}>
                    ← Rever código
                  </button>
                  <button className="btn-primary" onClick={handlePush} disabled={isLoading || !githubUser}>
                    {isLoading ? 'A publicar...' : '🚀 Publicar agora'}
                  </button>
                </div>
              </>
            ) : (
              <div className="success-state">
                <div className="success-icon">🎉</div>
                <h2>O teu projecto está no GitHub!</h2>
                <a href={pushResult.repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="repo-link">
                  <Github size={18} /> {pushResult.repo.fullName}
                </a>
                <p className="success-sub">
                  {pushResult.pushedFiles.length} ficheiros publicados com sucesso.
                </p>
                <div className="success-actions">
                  <a
                    href={`${VERCEL_IMPORT_URL}${encodeURIComponent(pushResult.repo.htmlUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    🚀 Deploy no Vercel
                  </a>
                  <a
                    href={pushResult.repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <Github size={16} /> Ver repositório
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
