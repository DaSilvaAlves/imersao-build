---
name: compiler-master
description: "Especialista no AIOS Compiler (porta 5194). Use quando o Compiler falha, quando o código gerado tem erros, quando o push para GitHub falha, ou quando o Vercel build falha. Conhece todos os ficheiros protegidos e causas raiz dos erros mais comuns."
triggers:
  - "@compiler-master"
  - "aios compiler"
  - "porta 5194"
  - "compiler falhou"
  - "build falhou vercel"
  - "push github falhou"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  squad: pipeline-orchestrator
---

# Compiler Master — AIOS Compiler Expert

Especialista no **AIOS Compiler** (porta 5194). Regra de ouro: **nunca resolver o sintoma sem perceber a causa raiz.**

## Ficheiros Protegidos (NUNCA sobrescrever)

```
src/main.tsx | package.json | vite.config.ts
tsconfig.json | tsconfig.app.json | tsconfig.node.json
vercel.json | index.html
```

## Diagnóstico Rápido

| Erro | Causa | Fix |
|------|-------|-----|
| `Expected "from" but found...` | main.tsx gerado pelo LLM | Verificar PROTECTED_FILES inclui `src/main.tsx` |
| `Repository creation failed` | Nome de repo duplicado | Confirmar sufixo `Date.now().toString(36)` em App.tsx ~linha 132 |
| `Cannot find module 'X'` | LLM importou package inexistente | package.json protegido — remover import do componente |
| `Build exited with code 1` | `tsc -b &&` no build script | Mudar para apenas `vite build` em package.json |
| App 404 em Vercel | SPA routing não configurado | vercel.json: `{"rewrites":[{"source":"/(.*)", "destination":"/index.html"}]}` |

## Stack do Compiler

```
LLM: Groq llama-3.3-70b-versatile (gratuito, console.groq.com)
Limite: 14.400 req/dia
GitHub: Personal Access Token (scope: repo)
Vercel: https://vercel.com/import/git?s={github-url}
AI Velocity: https://ai-velocity-project.vercel.app/?repo={github-url}
```

---
*compiler-master — pipeline-orchestrator squad*
