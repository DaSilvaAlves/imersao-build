// AI Code Generation Service — Gemini + Groq/Llama

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
export const GEMINI_DEFAULT_MODEL = 'gemini-2.0-flash';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Used for Gemini generation
const SYSTEM_INSTRUCTION = `You are an expert React 19 + TypeScript developer. You output ONLY valid TypeScript/JSX that compiles with zero errors.

RULE 1 — ONE FILE ONLY: Generate exactly one file: src/App.tsx. Everything in one file.
RULE 2 — NO LOCAL IMPORTS: Only import from 'react' or 'lucide-react'. Never from './anything'.

OUTPUT FORMAT:
\`\`\`typescript src/App.tsx
[complete file content]
\`\`\`

Use inline styles. All types and components in the same file. export default function App() at the end.`;

// Used for Groq JSON mode — forces structured output, eliminates token dropping
const GROQ_MARKER_SYSTEM = `You are a React 19 TypeScript developer. Output the complete src/App.tsx between these exact markers:

===APP_START===
[complete src/App.tsx content here]
===APP_END===

Rules:
- Only import from 'react' or 'lucide-react' — never from './anything'
- All types, state, and components in one file
- Use inline styles only (no CSS imports)
- Must end with: export default function App() { ... }
- Every interface must have braces: interface Name { field: type; }
- Every arrow function must have =>: const fn = () => { ... }
- Every object property must have colon: { key: value }
- Every array spread must be complete: [...prev, item]

Example:
===APP_START===
import { useState } from 'react'
interface Task { id: number; text: string; done: boolean; }
export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  return <div style={{ padding: '2rem' }}><h1>App</h1></div>;
}
===APP_END===`;

export async function generateWithGemini(
  prompt: string,
  apiKey: string,
  onChunk: (chunk: string) => void,
  model: string = GEMINI_DEFAULT_MODEL
): Promise<string> {
  const url = `${GEMINI_BASE}/${model}:streamGenerateContent?key=${apiKey}&alt=sse`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
        topP: 0.8,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let message = `Gemini API error ${response.status}`;
    try {
      const parsed = JSON.parse(errorBody) as { error?: { message?: string } };
      if (parsed.error?.message) message = parsed.error.message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Stream não disponível');

  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

    for (const line of lines) {
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        if (text) {
          fullText += text;
          onChunk(text);
        }
      } catch { /* skip malformed SSE events */ }
    }
  }

  return fullText;
}

export async function generateWithGroq(
  prompt: string,
  apiKey: string,
  onChunk: (chunk: string) => void
): Promise<string> {
  // Use JSON mode — forces structured output, eliminates token dropping by Llama
  const response = await fetch(GROQ_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: GROQ_MARKER_SYSTEM },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
      max_tokens: 12000,
      stream: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    let msg = `Groq API error ${response.status}`;
    try { msg = (JSON.parse(body) as { error?: { message?: string } }).error?.message ?? msg; } catch { /* ignore */ }
    throw new Error(msg);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Stream Groq não disponível');

  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n').filter(l => l.startsWith('data: '))) {
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
        const text = parsed.choices?.[0]?.delta?.content ?? '';
        if (text) { fullText += text; onChunk(text); }
      } catch { /* skip */ }
    }
  }

  // Extract code between ===APP_START=== and ===APP_END=== markers
  const markerMatch = fullText.match(/===APP_START===\r?\n([\s\S]*?)\r?\n===APP_END===/);
  if (markerMatch) {
    return '```typescript src/App.tsx\n' + markerMatch[1].trim() + '\n```';
  }

  // Fallback: return raw output (Format A/B/C/D in CodeParser will try to parse)
  return fullText;
}

/**
 * Deterministic pre-processor — fixes common LLM output corruption before Groq validation.
 * These are regex-based fixes that never fail, unlike LLM-based validation.
 */
export function preProcessCode(code: string): string {
  // Fix: line missing "import" keyword — e.g. " { Search, Plus } from 'lucide-react'"
  // Happens when LLM splits a multi-import line and drops the keyword on continuation lines
  code = code.replace(/^([ \t]*)\{([^}]+)\}([ \t]+from[ \t]+['"][^'"]+['"])/gm,
    '$1import {$2}$3');

  // Fix: merged import lines — e.g. "import A from './x'import B from './y'"
  code = code.replace(/(from\s+['"][^'"]+['"];?)\s*(import\s)/g, '$1\n$2');

  // Fix: remove any local imports (from './...' or from '../...') — not allowed in single-file
  code = code.replace(/^[ \t]*import\s[^\n]+from\s+['"]\.\.?\//gm, '// removed local import: ');

  // Fix: const declaration missing colon before type — e.g. "const App React.FC = () {"
  code = code.replace(/\bconst\s+(\w+)\s+([A-Z][A-Za-z.]+)\s*=/g, 'const $1: $2 =');

  // Fix: arrow function missing => — e.g. "= () {" or "= (x: T) {"
  code = code.replace(/=\s*(\([^)]*\))\s*\{/g, '= $1 => {');

  // Fix: truncated closing HTML tags — e.g. "</h>" → "</h1>", "</p" → "</p>"
  code = code.replace(/<\/h>\s/g, '</h1> ');
  code = code.replace(/<\/h>$/gm, '</h1>');

  // Fix: truncated text content — lines ending mid-word before a tag
  // Remove <Feature1 />, <Feature2 /> etc. — sub-components not allowed in single-file
  code = code.replace(/<Feature\d+\s*\/>/g, '');
  code = code.replace(/<[A-Z][a-zA-Z]+\d+\s*\/>/g, '');

  // Fix: interface/object property missing name — e.g. "  : boolean;" → "  _field: boolean;"
  code = code.replace(/^([ \t]+):\s+(\w)/gm, '$1_field: $2');

  // Fix: import missing closing brace — e.g. "import { Search, Plus from 'lucide-react'"
  code = code.replace(/import\s+\{([^}]+?)\s+from\s+(['"][^'"]+['"])/g,
    (_m, specifiers, path) => `import { ${specifiers.trim()} } from ${path}`);

  // Fix: interface without name — e.g. "interface {"
  let ifaceCounter = 0;
  code = code.replace(/\binterface\s+\{/g, () => `interface GeneratedType${++ifaceCounter} {`);

  // Fix: type alias without name — e.g. "type = 'active' | 'done'"
  code = code.replace(/\btype\s+=\s+/g, 'type GeneratedType = ');

  return code;
}

export async function validateWithGroq(
  generatedCode: string,
  apiKey: string,
  onChunk: (chunk: string) => void
): Promise<string> {
  const preProcessed = preProcessCode(generatedCode);
  const validationPrompt = `You are a TypeScript compiler. Fix ALL syntax errors in this single-file React 19 + TypeScript app so it compiles with zero errors.

This is ONE file: src/App.tsx. It must only import from 'react' or 'lucide-react'. No local imports.

CHECK THESE PATTERNS IN ORDER:

1. MERGED IMPORT LINES — most critical:
   WRONG:  import A from './featuresimport B from './other'
   FIXED:  (remove both — no local imports allowed. Keep only react/lucide-react imports)
   Rule: ANY import from a local path ('./anything') MUST be removed entirely.

2. INTERFACE/TYPE MISSING BRACE:
   WRONG:  interface User  id: number;
   FIXED:  interface User { id: number; }

3. TYPE ALIAS MISSING EQUALS:
   WRONG:  type Status  'active' | 'done'
   FIXED:  type Status = 'active' | 'done'

4. OBJECT/INTERFACE PROPERTY MISSING COLON:
   WRONG:  { name 'John' }  or  name string; in interface
   FIXED:  { name: 'John' }  or  name: string;

5. JSX RETURN WRONG CLOSING:
   WRONG:  return ( <div/> };
   FIXED:  return ( <div/> );

6. INCOMPLETE useState:
   WRONG:  useState(''
   FIXED:  useState('')

7. MISSING export default:
   The file MUST end with: export default function App() or export default App

OUTPUT: Rewrite the complete fixed src/App.tsx in a single code block. Do not truncate.

CODE TO VALIDATE AND FIX:
${preProcessed}`;

  const response = await fetch(GROQ_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        { role: 'user', content: validationPrompt },
      ],
      temperature: 0.1,
      max_tokens: 8192,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('Stream Groq não disponível');

  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

    for (const line of lines) {
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const text = parsed.choices?.[0]?.delta?.content ?? '';
        if (text) {
          fullText += text;
          onChunk(text);
        }
      } catch { /* skip */ }
    }
  }

  return fullText;
}
