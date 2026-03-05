import { useState } from 'react';
import { Copy, Check, Send, Edit3, Eye, Zap, Target } from 'lucide-react';
import type { GeneratedPrompt } from '../../types';

interface Props {
  prompt: GeneratedPrompt | null;
  onSendToCompiler: (text: string) => void;
}

const SECTION_COLORS: Record<string, string> = {
  ROLE: '#6366f1',
  CONTEXT: '#22c55e',
  TARGET: '#eab308',
  ARCHITECTURE: '#3b82f6',
  LANGUAGE: '#ec4899',
  FEATURES: '#f97316',
  DESIGN: '#a855f7',
  FILES: '#06b6d4',
  RULES: '#ef4444',
  OUTPUT: '#84cc16',
};

function HighlightedPrompt({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="highlighted-prompt">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\[([A-Z_]+)\]/);
        if (sectionMatch) {
          const key = sectionMatch[1];
          const color = SECTION_COLORS[key] ?? '#888';
          return (
            <div key={i} className="prompt-section-header" style={{ color }}>
              {line}
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="prompt-empty-line" />;
        return (
          <div key={i} className="prompt-line">
            {line}
          </div>
        );
      })}
    </div>
  );
}

export default function PreviewPanel({ prompt, onSendToCompiler }: Props) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');

  if (!prompt) {
    return (
      <div className="preview-empty">
        <div className="empty-icon">⚡</div>
        <h3>O teu prompt aparece aqui</h3>
        <p>
          Preenche o Briefing JSON à esquerda e clica em{' '}
          <strong>Construir Prompt</strong>.
        </p>
        <div className="preview-steps">
          <div className="step">
            <span className="step-num">1</span> Cola o Briefing JSON
          </div>
          <div className="step">
            <span className="step-num">2</span> Adiciona Design Tokens (opcional)
          </div>
          <div className="step">
            <span className="step-num">3</span> Clica em Construir Prompt
          </div>
          <div className="step">
            <span className="step-num">4</span> Envia para o Compiler
          </div>
        </div>
      </div>
    );
  }

  const displayText = isEditing ? editedText : prompt.fullText;

  function handleCopy() {
    navigator.clipboard.writeText(displayText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleEditToggle() {
    if (!isEditing) {
      setEditedText(prompt?.fullText ?? '');
    }
    setIsEditing(e => !e);
  }

  function handleSend() {
    onSendToCompiler(displayText);
  }

  const boost = prompt.detectedBoost;

  return (
    <div className="preview-panel">
      {/* Boost Badge */}
      {boost.type !== 'none' && (
        <div className="boost-banner">
          <Zap size={14} />
          <span>
            Boost <strong>{boost.type.toUpperCase()}</strong> activado automaticamente
          </span>
          <span className="boost-triggers">
            Palavras-chave: {boost.triggeredBy.slice(0, 3).join(', ')}
          </span>
        </div>
      )}

      {/* Stats bar */}
      <div className="prompt-stats">
        <span>
          <Target size={12} /> {prompt.wordCount} palavras
        </span>
        <span>10 secções</span>
        <span>{prompt.fullText.length} caracteres</span>
      </div>

      {/* Toolbar */}
      <div className="preview-toolbar">
        <button className={`btn-tool ${isEditing ? 'active' : ''}`} onClick={handleEditToggle}>
          {isEditing ? <Eye size={14} /> : <Edit3 size={14} />}
          {isEditing ? 'Pré-visualizar' : 'Editar'}
        </button>
        <button className="btn-tool" onClick={handleCopy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>

      {/* Content */}
      <div className="preview-content">
        {isEditing ? (
          <textarea
            className="edit-textarea"
            value={editedText}
            onChange={e => setEditedText(e.target.value)}
            spellCheck={false}
          />
        ) : (
          <HighlightedPrompt text={displayText} />
        )}
      </div>

      {/* Actions */}
      <div className="preview-actions">
        <button className="btn-secondary" onClick={handleCopy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copiado!' : 'Copiar prompt'}
        </button>
        <button className="btn-primary btn-send" onClick={handleSend}>
          <Send size={16} />
          Enviar para o Compiler
        </button>
      </div>
    </div>
  );
}
