# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

`imersao-build` is one of two repos for **Imersão IA Portugal** — a weekend workshop where students go from idea to deployed app.

**This repo** (imersao-build): prompt-optimizer, aios-compiler, community-dashboard
**Sister repo** (imersao-tools, separate path): student-profiler, briefing-generator, starter-builder

## Pipeline Flow

```
Student Profiler (5191) → Briefing Generator (5190) → Starter Builder (5192)
  → Prompt Optimizer (5193) → AIOS Compiler (5194)
  → GitHub repo → AI Velocity Dashboard → Vercel deploy
```

**URL integration between tools:**
- Starter Builder → Optimizer: `http://localhost:5193/?tokens=<DesignTokens JSON encoded>`
- Optimizer → Compiler: `http://localhost:5194/?prompt=<OptimizedPrompt encoded>`
- Compiler → AI Velocity: `https://ai-velocity-project.vercel.app/?repo=<github-url>`

**AI Velocity is ONLINE ONLY** — `https://ai-velocity-project.vercel.app`. Never use localhost:5333 (known bugs).

## Packages

Each package is independent (no root `npm install`). Run commands from inside each package directory.

| Package | Port | Command |
|---------|------|---------|
| `packages/prompt-optimizer` | 5193 | `npm run dev` |
| `packages/aios-compiler` | 5194 | `npm run dev` |
| `packages/community-dashboard` | 5196 | `npm run dev` |

```bash
cd packages/aios-compiler && npm run dev    # port 5194
cd packages/prompt-optimizer && npm run dev # port 5193
cd packages/community-dashboard && npm run dev # port 5196

# Build
cd packages/<name> && npm run build   # tsc && vite build
```

No root-level `npm run dev` or test runner — each package is standalone.

## Stack

All packages use the same stack:
- React 19 + TypeScript + Vite
- Plain CSS (no Tailwind) — brutalist design system in `src/styles/theme.css`
- Lucide React for icons
- Supabase (optional — apps degrade gracefully if `VITE_SUPABASE_URL` is not set)

## AIOS Compiler Architecture

The compiler is the most complex package. It has a 5-step UI wizard:

1. **Prompt** — receives prompt (or from `?prompt=` URL param)
2. **Configurar** — API keys (Groq/Gemini) + GitHub token, persisted in `localStorage`
3. **Gerar** — calls Gemini or Groq to generate code, streams output
4. **Rever** — FileViewer shows generated files before push
5. **Publicar** — pushes to GitHub, opens AI Velocity for Vercel deploy

### Key files in aios-compiler

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main 5-step wizard state machine |
| `src/features/code-generator/GeminiService.ts` | Gemini (streaming) + Groq generation + Groq validation |
| `src/features/code-generator/CodeParser.ts` | Parses LLM output into `GeneratedFile[]` |
| `src/features/github-pusher/GitHubService.ts` | GitHub API: auth, repo creation, file push |
| `src/features/file-viewer/FileViewer.tsx` | Read-only diff viewer before push |
| `src/lib/supabase.ts` | Optional Supabase persistence |
| `src/types/index.ts` | `CompilerState`, `GeneratedFile`, `PushResult`, etc. |

### PROTECTED FILES — Critical

`GitHubService.ts` maintains a `PROTECTED_FILES` set. These scaffold files are **always** used from the template and **never** overwritten by LLM-generated content:

```
src/main.tsx, package.json, vite.config.ts, tsconfig.json,
tsconfig.app.json, tsconfig.node.json, vercel.json, index.html
```

**Do not remove files from this set.** The LLM regularly generates broken versions of these files. The build script in the scaffold uses `vite build` (not `tsc && vite build`) to skip TypeScript errors in generated code.

### AI models

- **Groq** (`llama-3.3-70b-versatile`) — recommended, free tier, 14,400 req/day
- **Gemini** (`gemini-2.0-flash`) — alternative, streaming SSE

Groq validation runs automatically if a Groq key is present (do not gate it behind a manual toggle).

## Community Dashboard

Supports **demo mode** (no Supabase) and **live mode** (`VITE_SUPABASE_URL` set). The `IS_DEMO` flag in `App.tsx` controls which data source is used. Has three views: Members, Projects, Mentor.

## Environment Variables

No `.env` file is committed. Each package reads:
- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` — optional Supabase connection
- API keys (Groq, Gemini, GitHub token) are entered at runtime in the UI and stored in `localStorage`

## Do Not Touch

- **Portal AIOS** (`localhost:5333`, path `portal-imersao-ai/`) — localStorage conflict bugs, deferred post-workshop
- Do not add Tailwind, shadcn, or other UI libraries — plain CSS is intentional
- Do not change port numbers — they are hardcoded in cross-tool URLs
