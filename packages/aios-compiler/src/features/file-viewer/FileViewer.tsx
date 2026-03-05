import { useState } from 'react';
import { FileCode, Copy, Check, AlertTriangle } from 'lucide-react';
import type { GeneratedFile } from '../../types';

interface Props {
  files: GeneratedFile[];
}

const LANG_COLORS: Record<string, string> = {
  typescript: '#3b82f6',
  javascript: '#eab308',
  css: '#a855f7',
  html: '#f97316',
  json: '#22c55e',
  markdown: '#888',
  plaintext: '#888',
};

export default function FileViewer({ files }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (files.length === 0) {
    return (
      <div className="file-viewer-empty">
        <FileCode size={32} />
        <p>Nenhum ficheiro gerado ainda</p>
      </div>
    );
  }

  const activeFile = files[activeIdx];
  const hasParseError = files.length === 1 && files[0].filename === 'output.txt';
  const hasNoCodeFiles = !files.some(f => f.filename.match(/\.(tsx?|jsx?|css|html)$/));

  function handleCopy(idx: number) {
    navigator.clipboard.writeText(files[idx].content).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }

  return (
    <div className="file-viewer">
      {(hasParseError || hasNoCodeFiles) && (
        <div style={{ background: '#7f1d1d', border: '2px solid #ef4444', padding: '12px 16px', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ color: '#ef4444' }}>AVISO — O modelo não gerou ficheiros válidos</strong>
            <p style={{ color: '#fca5a5', fontSize: '0.8rem', margin: '4px 0 0' }}>
              O output não contém código React reconhecível. Volta ao passo anterior e regenera — o modelo pode não ter seguido o formato correto.
            </p>
          </div>
        </div>
      )}
      {/* File tabs */}
      <div className="file-tabs">
        {files.map((file, idx) => (
          <button
            key={file.filename}
            className={`file-tab ${idx === activeIdx ? 'active' : ''}`}
            onClick={() => setActiveIdx(idx)}
          >
            <span
              className="file-lang-dot"
              style={{ background: LANG_COLORS[file.language] ?? '#888' }}
            />
            <span className="file-tab-name">{file.filename.split('/').pop()}</span>
          </button>
        ))}
      </div>

      {/* File header */}
      <div className="file-header">
        <span className="file-path">{activeFile.filename}</span>
        <div className="file-meta">
          <span className="file-stats">{activeFile.lineCount} linhas</span>
          <button className="btn-tool" onClick={() => handleCopy(activeIdx)}>
            {copiedIdx === activeIdx ? <Check size={13} /> : <Copy size={13} />}
            {copiedIdx === activeIdx ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* File content */}
      <div className="file-content">
        <pre className="code-block">
          <code>{activeFile.content}</code>
        </pre>
      </div>
    </div>
  );
}
