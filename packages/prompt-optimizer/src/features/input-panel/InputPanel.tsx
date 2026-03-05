import { useState, useEffect } from 'react';
import { FileJson, Palette, Info, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import type { BriefingOutput, DesignTokens, OptionalSkillId } from '../../types';
import { OPTIONAL_SKILLS } from '../../types';

interface Props {
  briefing: BriefingOutput | null;
  tokens: DesignTokens | null;
  activeSkills: Set<OptionalSkillId>;
  onBriefingChange: (b: BriefingOutput | null) => void;
  onTokensChange: (t: DesignTokens | null) => void;
  onSkillToggle: (id: OptionalSkillId) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

// Safely serialise to pretty JSON or return empty string
function toText(val: unknown): string {
  if (!val) return '';
  try { return JSON.stringify(val, null, 2); } catch { return ''; }
}

const BRIEFING_PLACEHOLDER = JSON.stringify(
  {
    projectName: 'Gestor de Tarefas',
    painPoints: 'Perco muito tempo a gerir as minhas tarefas diárias e não consigo priorizar',
    features: ['Criar e editar tarefas', 'Definir prioridades', 'Marcar como concluída'],
    targetAudience: 'Profissionais e estudantes portugueses',
    experienceLevel: 'iniciante',
    suggestedStack: {
      architecture: 'Monolito Modular',
      frontend: 'React 19 + Vite',
      backend: 'Supabase',
      database: 'PostgreSQL + Supabase',
    },
    uiVibe: 'Minimalista Dark',
    prdText: '',
    timestamp: new Date().toISOString(),
  },
  null,
  2
);

const TOKENS_PLACEHOLDER = JSON.stringify(
  {
    style: 'minimal',
    layout: 'list',
    colorScheme: { background: '#0a0a0a', foreground: '#ffffff', accent: '#EEFF00' },
    typography: 'sans-serif',
    features: ['search', 'filters'],
    cssDirectives: 'Clean lines, generous whitespace, no decorative elements',
  },
  null,
  2
);

function parseJSON<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export default function InputPanel({
  briefing,
  tokens,
  activeSkills,
  onBriefingChange,
  onTokensChange,
  onSkillToggle,
  onGenerate,
  isGenerating,
  error,
}: Props) {
  const [briefingText, setBriefingText] = useState(() => toText(briefing));
  const [tokensText, setTokensText] = useState(() => toText(tokens));

  // Sync when URL params arrive after mount (pipeline integration)
  useEffect(() => {
    if (briefing && !briefingText) setBriefingText(toText(briefing));
  }, [briefing]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tokens && !tokensText) setTokensText(toText(tokens));
  }, [tokens]); // eslint-disable-line react-hooks/exhaustive-deps
  const [tokensOpen, setTokensOpen] = useState(true);
  const [briefingOpen, setBriefingOpen] = useState(true);

  const briefingValid = briefingText.trim() === '' || parseJSON(briefingText) !== null;
  const tokensValid = tokensText.trim() === '' || parseJSON(tokensText) !== null;

  function handleBriefingChange(text: string) {
    setBriefingText(text);
    const parsed = parseJSON<BriefingOutput>(text);
    onBriefingChange(parsed);
  }

  function handleTokensChange(text: string) {
    setTokensText(text);
    const parsed = parseJSON<DesignTokens>(text);
    onTokensChange(parsed);
  }

  function handlePasteExample(type: 'briefing' | 'tokens') {
    if (type === 'briefing') {
      setBriefingText(BRIEFING_PLACEHOLDER);
      onBriefingChange(JSON.parse(BRIEFING_PLACEHOLDER) as BriefingOutput);
    } else {
      setTokensText(TOKENS_PLACEHOLDER);
      onTokensChange(JSON.parse(TOKENS_PLACEHOLDER) as DesignTokens);
    }
  }

  const canGenerate = parseJSON(briefingText) !== null;

  return (
    <div className="input-panel">
      {/* Briefing Section */}
      <div className="section-block">
        <button className="section-header" onClick={() => setBriefingOpen(o => !o)}>
          <span className="section-title">
            <FileJson size={16} />
            PRD / Briefing JSON
            <span className="required-badge">Obrigatório</span>
          </span>
          {briefingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {briefingOpen && (
          <div className="section-body">
            <p className="section-hint">
              <Info size={12} /> Cole aqui o JSON gerado pelo Briefing Generator
            </p>
            <textarea
              className={`json-textarea ${!briefingValid ? 'invalid' : ''}`}
              value={briefingText}
              onChange={e => handleBriefingChange(e.target.value)}
              placeholder={BRIEFING_PLACEHOLDER}
              rows={10}
              spellCheck={false}
            />
            {!briefingValid && (
              <p className="field-error">JSON inválido — verifica a formatação</p>
            )}
            <button className="btn-ghost btn-sm" onClick={() => handlePasteExample('briefing')}>
              Usar exemplo de demonstração
            </button>
          </div>
        )}
      </div>

      {/* Design Tokens Section */}
      <div className="section-block">
        <button className="section-header" onClick={() => setTokensOpen(o => !o)}>
          <span className="section-title">
            <Palette size={16} />
            Design Tokens JSON
            <span className="optional-badge">Opcional</span>
          </span>
          {tokensOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {tokensOpen && (
          <div className="section-body">
            <p className="section-hint">
              <Info size={12} /> Cole aqui o JSON gerado pelo Starter Builder
            </p>
            <textarea
              className={`json-textarea ${!tokensValid ? 'invalid' : ''}`}
              value={tokensText}
              onChange={e => handleTokensChange(e.target.value)}
              placeholder={TOKENS_PLACEHOLDER}
              rows={8}
              spellCheck={false}
            />
            {!tokensValid && (
              <p className="field-error">JSON inválido — verifica a formatação</p>
            )}
            <button className="btn-ghost btn-sm" onClick={() => handlePasteExample('tokens')}>
              Usar exemplo de demonstração
            </button>
          </div>
        )}
      </div>

      {/* Optional Skills Section */}
      <div className="section-block">
        <div className="section-header skills-header-static">
          <span className="section-title">
            <Zap size={16} />
            Skills Opcionais
            <span className="optional-badge">Boosts de Projecto</span>
          </span>
        </div>
        <div className="section-body">
          <p className="section-hint">
            <Info size={12} /> Activa skills específicas para reforçar o prompt com padrões do teu tipo de projecto
          </p>
          <div className="skills-grid">
            {OPTIONAL_SKILLS.map(skill => {
              const isActive = activeSkills.has(skill.id);
              return (
                <button
                  key={skill.id}
                  className={`skill-toggle ${isActive ? 'skill-active' : ''}`}
                  onClick={() => onSkillToggle(skill.id)}
                  aria-pressed={isActive}
                >
                  <span className="skill-emoji">{skill.emoji}</span>
                  <span className="skill-info">
                    <span className="skill-label">{skill.label}</span>
                    <span className="skill-desc">{skill.description}</span>
                  </span>
                  <span className="skill-badge">{isActive ? 'ON' : 'OFF'}</span>
                </button>
              );
            })}
          </div>
          {activeSkills.size > 0 && (
            <p className="skills-active-note">
              {activeSkills.size} skill{activeSkills.size > 1 ? 's' : ''} activa{activeSkills.size > 1 ? 's' : ''} — padrões extra serão injectados no prompt
            </p>
          )}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <button
        className="btn-primary btn-generate"
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
      >
        {isGenerating ? 'A construir prompt...' : '⚡ Construir Prompt'}
      </button>
    </div>
  );
}
