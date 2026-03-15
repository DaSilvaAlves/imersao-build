# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 5194
npm run build    # tsc && vite build
npm run preview  # Preview production build on port 5194
```

No test runner or lint script — this package has none.

## What This Package Does

AIOS Compiler is a 5-step wizard that turns a text prompt into a deployed GitHub repo:

1. **Prompt** — User pastes/receives the prompt (auto-loaded from `?prompt=` URL param from Prompt Optimizer)
2. **Configurar** — API keys (Groq or Gemini) + GitHub token, persisted in `localStorage` under key `aios_compiler_config`
3. **Gerar** — Calls the LLM API (streaming SSE), shows live output
4. **Rever** — `FileViewer` shows the generated `index.html` before push
5. **Publicar** — Creates a GitHub repo and pushes 3 files: `README.md`, `vercel.json`, `index.html`

The entire app state lives in a single `CompilerState` object in `App.tsx`. There is no router, no context, no reducers.

## Output Format — Static HTML Only

The LLM is instructed to generate **a single `index.html`** with all CSS and JS inline (no React, no npm, no CDN). This is a deliberate architecture decision — the generated app has zero build step, which makes Vercel deploy trivial (`vercel.json` with `cleanUrls: true`).

`CodeParser.ts` extracts the HTML using three fallback strategies in order:
1. `===HTML_START===` / `===HTML_END===` markers (Groq path — more reliable)
2. ` ```html ` code fence (Gemini path)
3. Raw `<!DOCTYPE` detection (last resort)

If the extracted HTML has fewer than 30 lines, generation is rejected with an error asking the user to regenerate.

## Key Architectural Decisions

**Provider difference:** Groq (`llama-3.3-70b-versatile`) uses markers in its system prompt to prevent token dropping. Gemini (`gemini-2.0-flash`) uses SSE streaming and expects a raw HTML fence. These two system prompts (`HTML_SYSTEM_GROQ` / `HTML_SYSTEM_GEMINI` in `GeminiService.ts`) must stay divergent.

**Repo naming:** `${userInput}-${Date.now().toString(36)}` — the suffix guarantees uniqueness across pipeline runs. Never remove the suffix.

**GitHub push sequence:** README.md → vercel.json → index.html, with 200ms delays between calls to avoid GitHub API rate limits on new repos.

**No PROTECTED_FILES set here** — the parent repo's CLAUDE.md describes PROTECTED_FILES for a previous React/Vite architecture. This package now generates static HTML only, so no scaffold files are pushed.

## Upstream Integration

Receives prompt via URL: `http://localhost:5194/?prompt=<OptimizedPrompt encoded>`

After successful push, links user to: `https://vercel.com/import/git?s=<github-url>`

The Supabase call in `handlePush` (`saveProject`) is fire-and-forget — it degrades gracefully if `VITE_SUPABASE_URL` is not set.
