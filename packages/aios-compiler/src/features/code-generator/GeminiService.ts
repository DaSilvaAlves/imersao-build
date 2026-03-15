// AI Code Generation Service — HTML static output (zero build step)

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
export const GEMINI_DEFAULT_MODEL = 'gemini-2.0-flash';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Used for Gemini generation
const HTML_SYSTEM_GEMINI = `You are a Senior Frontend Developer. Generate a COMPLETE, FULLY FUNCTIONAL single-page app as a single index.html file.

ABSOLUTE RULES:
- Everything inline: CSS in <style>, JavaScript in <script> — zero npm, zero CDN, zero external dependencies
- UI in Portuguese (PT-PT) — ALL visible text, labels, buttons, placeholders must be in Portuguese
- Implement ALL features from [FEATURES] — every single one, fully working, no placeholders, no TODOs
- Apply the visual style from [DESIGN] — dark backgrounds, glassmorphism, exact hex colors provided
- localStorage for all persistence — NEVER use fetch('/api/...'), no backend exists
- Realistic Portuguese example data — never Lorem Ipsum, never "Test", never "Example"
- Minimum 200 lines of real working code

GLASSMORPHISM PATTERN (use this):
  background: rgba(255,255,255,0.05); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;

OUTPUT: Return only the complete index.html content, starting with <!DOCTYPE html>`;

// Used for Groq — uses markers to prevent token dropping
const HTML_SYSTEM_GROQ = `You are a Senior Frontend Developer. Generate a COMPLETE, FULLY FUNCTIONAL single-page app as a single index.html.

Output the complete HTML between these exact markers:

===HTML_START===
[complete index.html here]
===HTML_END===

ABSOLUTE RULES (breaking these causes failure):
- Everything inline: CSS in <style>, JS in <script> — zero npm, zero CDN
- UI in Portuguese (PT-PT) — ALL text visible to user must be in Portuguese
- Implement ALL features from [FEATURES] — every single one, fully working
- Apply style from [DESIGN]: dark theme, glassmorphism, exact hex colors
  * backdrop-filter: blur(12px); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1)
  * Use the exact accent color hex values from [DESIGN]
- localStorage persistence — NEVER fetch('/api/...')
- Realistic Portuguese data — never Lorem Ipsum
- Minimum 200 lines of real working code
- Start with <!DOCTYPE html> and end with </html>`;

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
      system_instruction: { parts: [{ text: HTML_SYSTEM_GEMINI }] },
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
        { role: 'system', content: HTML_SYSTEM_GROQ },
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

  return fullText;
}
