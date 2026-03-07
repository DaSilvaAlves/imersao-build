// AI Code Generation Service — Gemini + Groq/Llama

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
export const GEMINI_DEFAULT_MODEL = 'gemini-2.0-flash';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_INSTRUCTION = `You are an expert React 19 + TypeScript developer.
Generate complete, production-ready code with NO placeholders or TODO comments.
Output each file in a separate code block with the filename on the opening fence line.
FORMAT — one code block per file:
\`\`\`typescript src/App.tsx
[complete file content]
\`\`\`

\`\`\`css src/styles/theme.css
[complete file content]
\`\`\`

CRITICAL TYPESCRIPT RULES — violations cause build failures:
- Every interface MUST have opening AND closing braces: interface Name { ... }
- Every type alias MUST use equals: type Name = ...
- Every function parameter MUST have a type annotation
- Every useState MUST be complete with closing parenthesis and semicolon
- Never truncate a file mid-function or mid-interface

JSX RETURN RULES — closing mismatch causes immediate build failure:
- CORRECT:  return ( <div>...</div> );
- WRONG:    return ( <div>...</div> };   NEVER use }; to close return(
- WRONG:    return ( <div>...</div> }    NEVER use } to close return(
- Rule: every "return (" MUST be closed with ");" — never "};" or "}"

IMPORT RULES — broken imports are the #1 build failure cause:
- CORRECT:  import { useState, useEffect } from 'react'
- CORRECT:  import MyComponent from './components/MyComponent'
- WRONG:    import from 'react'  ← missing specifier, NEVER write this
- WRONG:    import X frompath    ← missing space + quotes, NEVER write this
- WRONG:    import X from ./path ← path MUST be in single or double quotes
- Every import MUST follow exactly: import [specifier] from '[path]'
- Every path MUST be in quotes: './features/feature-1' not ./features/feature-1

Generate ONLY these files (in order): src/styles/theme.css → src/types/index.ts → src/features/* → src/App.tsx
DO NOT generate: src/main.tsx, package.json, vite.config.ts, tsconfig*.json, index.html, vercel.json — these are provided by the build system.
Include ALL feature files. Do not skip any. Do not truncate.`;

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

export async function validateWithGroq(
  generatedCode: string,
  apiKey: string,
  onChunk: (chunk: string) => void
): Promise<string> {
  const validationPrompt = `You are a TypeScript compiler. Your job is to find and fix ALL syntax errors in this React 19 + TypeScript code so it compiles with zero errors.

CRITICAL — CHECK EVERY FILE FOR THESE EXACT PATTERNS:

1. INTERFACE/TYPE MISSING OPENING BRACE — most common error:
   WRONG:  interface TaskGroup  title: string;
   WRONG:  interface User  id: number;
   FIXED:  interface TaskGroup { title: string;
   Rule: every "interface Name" MUST be followed immediately by "{"

2. TYPE ALIAS MISSING EQUALS OR BRACE:
   WRONG:  type Status  'active' | 'done'
   FIXED:  type Status = 'active' | 'done'

3. Interface properties missing colon:
   WRONG:  title string
   FIXED:  title: string

4. Parameters without types:
   WRONG:  (id:) or (name,) with no type
   FIXED:  (id: number) (name: string)

5. Incomplete useState:
   WRONG:  useState(''
   FIXED:  useState('')

6. Malformed JSX tags:
   WRONG:  <input="text"
   FIXED:  <input type="text"

7. Broken onChange handlers:
   WRONG:  onChangeevent)
   FIXED:  onChange={(e) => ...}

8. JSX return closed with wrong character:
   WRONG:  return ( <div>...</div> };
   WRONG:  return ( <div>...</div> }
   FIXED:  return ( <div>...</div> );
   Rule: every "return (" MUST close with ");" — scan every component function

9. Missing closing tags, braces, or parentheses
10. Imports that don't match exports
11. Truncated or incomplete functions

12. BROKEN IMPORT STATEMENTS — check every single import line:
   WRONG:  import from 'react'          (missing specifier)
   WRONG:  import X frompath            (missing space + quotes)
   WRONG:  import Feature2 fromfeatures/feature-'  (malformed path)
   WRONG:  import X from ./path         (path not in quotes)
   FIXED:  import { useState } from 'react'
   FIXED:  import Feature2 from './features/feature-2'
   Rule: every import line MUST match: import [specifier] from '[quoted-path]'
   Check EVERY import in EVERY file — this is the #1 build failure cause.

SCAN EVERY INTERFACE AND TYPE DECLARATION FIRST before anything else.

OUTPUT: Rewrite ALL files in full with EVERY error fixed. Same format as input. Do not skip any file. Do not truncate.

CODE TO VALIDATE AND FIX:
${generatedCode}`;

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
