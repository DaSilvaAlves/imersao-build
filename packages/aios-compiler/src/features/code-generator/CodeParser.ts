import type { GeneratedFile } from '../../types';

/**
 * Parse LLM output into a GeneratedFile array.
 * New architecture outputs a single index.html — no build step, no TypeScript.
 *
 * Extraction order:
 *   1. ===HTML_START=== / ===HTML_END=== markers (Groq path)
 *   2. ```html ... ``` fence (Gemini path)
 *   3. <!DOCTYPE html> direct detection (fallback)
 */
export function parseGeneratedFiles(rawOutput: string): GeneratedFile[] {
  // 1. Marker extraction (Groq)
  const markerMatch = rawOutput.match(/===HTML_START===\r?\n([\s\S]*?)\r?\n===HTML_END===/);
  if (markerMatch) {
    // Strip code fence if LLM wrapped HTML inside the markers: ```html\n...\n```
    let content = markerMatch[1].trim();
    content = content.replace(/^```[\w]*\r?\n/, '').replace(/\r?\n```$/, '').trim();
    if (content.length > 100) {
      return [{ filename: 'index.html', content, language: 'html', lineCount: content.split('\n').length }];
    }
  }

  // 2. HTML code fence (Gemini)
  const fenceMatch = rawOutput.match(/```html\r?\n([\s\S]+?)```/);
  if (fenceMatch) {
    const content = fenceMatch[1].trim();
    if (content.length > 100) {
      return [{ filename: 'index.html', content, language: 'html', lineCount: content.split('\n').length }];
    }
  }

  // 3. Direct <!DOCTYPE detection (last resort)
  const doctypeIdx = rawOutput.indexOf('<!DOCTYPE');
  if (doctypeIdx >= 0) {
    const content = rawOutput.slice(doctypeIdx).trim();
    if (content.length > 100) {
      return [{ filename: 'index.html', content, language: 'html', lineCount: content.split('\n').length }];
    }
  }

  return [];
}

// Single-file output — no sorting needed, kept for API compatibility
export function sortFiles(files: GeneratedFile[]): GeneratedFile[] {
  return files;
}
