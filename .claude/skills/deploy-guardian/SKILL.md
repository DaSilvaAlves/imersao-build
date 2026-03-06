---
name: deploy-guardian
description: "Especialista no deploy final — AI Velocity Dashboard e Vercel. Use quando o deploy no Vercel falha, quando o AI Velocity não detecta o repo, ou quando a URL pública do projecto não funciona."
triggers:
  - "@deploy-guardian"
  - "deploy vercel"
  - "ai velocity"
  - "url não funciona"
  - "build vercel falhou"
  - "publicar projecto"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  squad: pipeline-orchestrator
---

# Deploy Guardian — Vercel & AI Velocity Expert

Especialista no deploy final. **URL pública = sucesso da imersão.**

## Fluxo

```
GitHub repo criado → AI Velocity: https://ai-velocity-project.vercel.app/?repo={url}
→ Aluno clica "Deploy" → https://vercel.com/import/git?s={github-url}
→ Vercel build (~2 min) → URL pública live → CELEBRAÇÃO
```

## Diagnóstico Rápido

| Problema | Fix |
|----------|-----|
| Vercel não detecta framework | vercel.json em falta ou errado |
| Build falha TypeScript | `package.json`: build deve ser `"vite build"` sem `tsc -b` |
| 404 em rotas internas | `vercel.json`: `{"rewrites":[{"source":"/(.*)", "destination":"/index.html"}]}` |
| AI Velocity não mostra repo | `?repo=` param deve sobrepor localStorage — verificar App.tsx |
| "Repository not found" | Tornar repo público no GitHub |

## Checklist Pré-Deploy (30 segundos)

```
[ ] vercel.json existe com SPA rewrite rule
[ ] package.json: build = "vite build"
[ ] src/main.tsx = scaffold (não versão LLM)
[ ] Repo é público (ou conta Vercel Pro)
[ ] Nome do repo tem sufixo único
```

## Momento de Celebração (mentor)

Quando URL aparecer: pedir ao aluno para abrir no telemóvel, partilhar no grupo, encorajar LinkedIn com #ImersaoIA.

---
*deploy-guardian — pipeline-orchestrator squad*
