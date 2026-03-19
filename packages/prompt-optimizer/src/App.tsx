import { useState, useCallback, useEffect } from 'react';
import { Zap } from 'lucide-react';
import InputPanel from './features/input-panel/InputPanel';
import PreviewPanel from './features/preview-panel/PreviewPanel';
import { detectBoost, buildPrompt } from './features/prompt-builder/PromptBuilder';
import type { BriefingOutput, DesignTokens, GeneratedPrompt, OptionalSkillId } from './types';
import { saveBriefingOutput } from './lib/supabase';
import PipelineNav from './components/PipelineNav';

const COMPILER_URL = 'http://localhost:5194';

export default function App() {
  const [briefing, setBriefing] = useState<BriefingOutput | null>(null);
  const [tokens, setTokens] = useState<DesignTokens | null>(null);
  const [prompt, setPrompt] = useState<GeneratedPrompt | null>(null);
  const [activeSkills, setActiveSkills] = useState<Set<OptionalSkillId>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'input' | 'preview'>('input');

  // Read URL params on mount (pipeline integration)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const briefingParam = params.get('briefing');
    const tokensParam = params.get('tokens');
    if (briefingParam) {
      try {
        setBriefing(JSON.parse(decodeURIComponent(briefingParam)) as BriefingOutput);
      } catch { /* ignore */ }
    }
    if (tokensParam) {
      try {
        setTokens(JSON.parse(decodeURIComponent(tokensParam)) as DesignTokens);
      } catch { /* ignore */ }
    }
  }, []);

  function handleSkillToggle(skillId: OptionalSkillId) {
    setActiveSkills(prev => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.add(skillId);
      }
      return next;
    });
  }

  const handleGenerate = useCallback(() => {
    if (!briefing) {
      setError('Preenche o Briefing JSON antes de construir o prompt.');
      return;
    }
    setError(null);
    setIsGenerating(true);

    // Simulate slight delay for UX feedback
    setTimeout(() => {
      const detected = detectBoost(briefing);
      const generated = buildPrompt(briefing, tokens, detected, activeSkills);
      setPrompt(generated);
      setIsGenerating(false);
      setActivePanel('preview');
      // Persist to Supabase (fire-and-forget)
      void saveBriefingOutput(briefing, tokens);
    }, 600);
  }, [briefing, tokens, activeSkills]);

  function handleSendToCompiler(text: string) {
    const encoded = encodeURIComponent(text);
    const url = `${COMPILER_URL}?prompt=${encoded}`;
    window.open(url, '_blank');
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <Zap size={22} className="brand-icon" />
          <div>
            <h1 className="brand-title">Prompt Optimizer</h1>
            <p className="brand-sub">PRD → Prompt perfeito para qualquer IA</p>
          </div>
        </div>
        <div className="header-pipeline">
          <span className="pipeline-step done">Profiler</span>
          <span className="pipeline-arrow">→</span>
          <span className="pipeline-step done">Briefing</span>
          <span className="pipeline-arrow">→</span>
          <span className="pipeline-step done">Starter</span>
          <span className="pipeline-arrow">→</span>
          <span className="pipeline-step active">Optimizer</span>
          <span className="pipeline-arrow">→</span>
          <span className="pipeline-step">Compiler</span>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="mobile-tabs">
        <button
          className={`mobile-tab ${activePanel === 'input' ? 'active' : ''}`}
          onClick={() => setActivePanel('input')}
        >
          Dados
        </button>
        <button
          className={`mobile-tab ${activePanel === 'preview' ? 'active' : ''}`}
          onClick={() => setActivePanel('preview')}
        >
          Prompt {prompt ? '✓' : ''}
        </button>
      </div>

      {/* Main layout */}
      <main className="app-main">
        <div className={`panel left-panel ${activePanel === 'input' ? 'panel-active' : ''}`}>
          <InputPanel
            briefing={briefing}
            tokens={tokens}
            activeSkills={activeSkills}
            onBriefingChange={setBriefing}
            onTokensChange={setTokens}
            onSkillToggle={handleSkillToggle}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            error={error}
          />
        </div>
        <div className={`panel right-panel ${activePanel === 'preview' ? 'panel-active' : ''}`}>
          <PreviewPanel prompt={prompt} onSendToCompiler={handleSendToCompiler} />
        </div>
      </main>
      <PipelineNav />
    </div>
  );
}
