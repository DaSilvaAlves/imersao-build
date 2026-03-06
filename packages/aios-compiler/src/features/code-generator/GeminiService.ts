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

CHECK EVERY FILE FOR:
- Parameters without types: (id:) → fix to (id: number)
- Interface properties missing colon: title string → fix to title: string
- Incomplete useState: useState('' → fix to useState('')
- Malformed JSX tags: <input="text" → fix to <input type="text"
- Broken onChange handlers: onChangeevent) → fix to onChange={(e) => ...}
- Missing closing tags or braces
- Imports that don't match exports
- Truncated or incomplete functions

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
