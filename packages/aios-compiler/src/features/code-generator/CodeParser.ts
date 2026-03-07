import type { GeneratedFile } from '../../types';

// Language detection from file extension
const LANG_MAP: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  css: 'css',
  html: 'html',
  json: 'json',
  md: 'markdown',
  yaml: 'yaml',
  yml: 'yaml',
  env: 'bash',
  sh: 'bash',
};

function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return LANG_MAP[ext] ?? 'plaintext';
}

function isFilename(s: string): boolean {
  const t = s.trim();
  return (t.includes('.') || t.includes('/')) && !t.includes(' ') && t.length < 120;
}

function upsert(files: GeneratedFile[], file: GeneratedFile) {
  const idx = files.findIndex(f => f.filename === file.filename);
  if (idx >= 0) files[idx] = file; else files.push(file);
}

/**
 * Parse the raw LLM output into separate GeneratedFile objects.
 * Handles all common LLM output formats:
 *
 *   Format A: ```typescript src/App.tsx     (filename on opening fence)
 *   Format B: ```typescript\n// src/App.tsx  (filename in first comment)
 *   Format C: **src/App.tsx**\n```typescript  (filename as bold before block)
 *   Format D: ### src/App.tsx\n```typescript  (filename as heading before block)
 *   Format E: `src/App.tsx`\n```typescript    (filename as inline code before block)
 */
export function parseGeneratedFiles(rawOutput: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // Format A — filename on the opening fence line (original expected format)
  const fenceWithName = /```(\w*)\s+([\w./\-]+\.\w+)\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = fenceWithName.exec(rawOutput)) !== null) {
    const [, langHint, filename, content] = m;
    const clean = content.trimEnd();
    upsert(files, {
      filename: filename.trim(),
      content: clean,
      language: langHint?.toLowerCase() || detectLanguage(filename),
      lineCount: clean.split('\n').length,
    });
  }

  // Format B — filename as first-line comment inside fence: // path or # path
  const fenceCommentName = /```(\w+)\n\/[\/\*]\s*([\w./\-]+\.\w+)[^\n]*\n([\s\S]*?)```/g;
  while ((m = fenceCommentName.exec(rawOutput)) !== null) {
    const [, langHint, filename, content] = m;
    if (files.find(f => f.filename === filename.trim())) continue; // already parsed
    const clean = content.trimEnd();
    upsert(files, {
      filename: filename.trim(),
      content: clean,
      language: langHint?.toLowerCase() || detectLanguage(filename),
      lineCount: clean.split('\n').length,
    });
  }

  // Format C/D/E — filename on the line immediately before the fence
  // Matches: **filename**, ### filename, `filename`, or plain filename
  const preLabel = /(?:\*\*|###\s*|`)([\w./\-]+\.\w+)(?:\*\*|`)?[ \t]*\n```(\w*)\n([\s\S]*?)```/g;
  while ((m = preLabel.exec(rawOutput)) !== null) {
    const [, filename, langHint, content] = m;
    if (files.find(f => f.filename === filename.trim())) continue;
    const clean = content.trimEnd();
    upsert(files, {
      filename: filename.trim(),
      content: clean,
      language: langHint?.toLowerCase() || detectLanguage(filename),
      lineCount: clean.split('\n').length,
    });
  }

  // Format F — bare filename line directly before fence (no markdown decoration)
  const bareName = /^([\w./\-]+\.\w+)[ \t]*\n```(\w*)\n([\s\S]*?)```/gm;
  while ((m = bareName.exec(rawOutput)) !== null) {
    const [, filename, langHint, content] = m;
    if (!isFilename(filename)) continue;
    if (files.find(f => f.filename === filename.trim())) continue;
    const clean = content.trimEnd();
    upsert(files, {
      filename: filename.trim(),
      content: clean,
      language: langHint?.toLowerCase() || detectLanguage(filename),
      lineCount: clean.split('\n').length,
    });
  }

  // Format G — fallback: any code block without filename → assume src/App.tsx
  // Handles cases where LLM or validator omits the filename from the fence
  if (files.length === 0) {
    const anyFence = /```(?:typescript|tsx|jsx?)\n([\s\S]+?)```/;
    const fm = anyFence.exec(rawOutput);
    if (fm) {
      const clean = fm[1].trimEnd();
      files.push({
        filename: 'src/App.tsx',
        content: clean,
        language: 'typescript',
        lineCount: clean.split('\n').length,
      });
    }
  }

  return files;
}

/**
 * Sort files in logical order: CSS → types → hooks → components → features → App → main
 */
export function sortFiles(files: GeneratedFile[]): GeneratedFile[] {
  const ORDER = [
    /theme\.css$/,
    /types\/index\.ts$/,
    /use[A-Z]/,
    /components\/ui/,
    /features\//,
    /App\.tsx$/,
    /main\.tsx$/,
  ];

  return [...files].sort((a, b) => {
    const ai = ORDER.findIndex(r => r.test(a.filename));
    const bi = ORDER.findIndex(r => r.test(b.filename));
    if (ai === -1 && bi === -1) return a.filename.localeCompare(b.filename);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}
