// AI Code Generation Service — Gemini + Groq/Llama

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
export const GEMINI_DEFAULT_MODEL = 'gemini-2.0-flash';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_INSTRUCTION = `You are an expert React 19 + TypeScript developer.

CRITICAL ARCHITECTURE RULE: Generate EXACTLY ONE FILE — src/App.tsx.
Everything goes in this single file: types, state, components, styles.
DO NOT generate multiple files. DO NOT create separate feature files.
DO NOT generate: src/main.tsx, package.json, vite.config.ts, tsconfig*.json, index.html, vercel.json.

OUTPUT FORMAT — exactly this, nothing else:
\`\`\`typescript src/App.tsx
[complete application code — all in one file]
\`\`\`

IMPORTS — only from external packages (react, lucide-react):
- CORRECT: import { useState, useEffect } from 'react'
- CORRECT: import { Search, Plus } from 'lucide-react'
- WRONG: import anything from './anything' ← NEVER import from local paths
- Every import MUST be from 'react' or 'lucide-react' only.

TYPESCRIPT RULES:
- Every interface MUST have braces: interface Name { field: type; }
- Every type alias MUST use equals: type Status = 'active' | 'done'
- Every object property MUST have colon: { name: 'John' } not { name 'John' }
- Every function parameter MUST have a type annotation
- Every useState MUST close with ): const [x, setX] = useState<Type>(value)

JSX RETURN — closing mismatch causes build failure:
- CORRECT: return ( <div>...</div> );
- WRONG:   return ( <div>...</div> };
- Rule: every "return (" MUST close with ");"

STYLES — use inline styles or a <style> tag inside the component. No external CSS imports.

The file MUST export a default App function: export default function App() { ... }`;

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
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 8192,
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

  return fullText;
}

/**
 * Deterministic pre-processor — fixes common LLM output corruption before Groq validation.
 * These are regex-based fixes that never fail, unlike LLM-based validation.
 */
function preProcessCode(code: string): string {
  // Fix: line missing "import" keyword — e.g. " { Search, Plus } from 'lucide-react'"
  // Happens when LLM splits a multi-import line and drops the keyword on continuation lines
  code = code.replace(/^([ \t]*)\{([^}]+)\}([ \t]+from[ \t]+['"][^'"]+['"])/gm,
    '$1import {$2}$3');

  // Fix: merged import lines — e.g. "import A from './x'import B from './y'"
  code = code.replace(/(from\s+['"][^'"]+['"];?)\s*(import\s)/g, '$1\n$2');

  // Fix: remove any local imports (from './...' or from '../...') — not allowed in single-file
  code = code.replace(/^[ \t]*import\s[^\n]+from\s+['"]\.\.?\//gm, '// removed local import: ');

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
