---
name: imersao-pipeline-guide
description: Guia passo-a-passo do pipeline completo da Imersão IA Portugal. Use quando um mentor ou aluno precisa de orientação sobre o próximo passo no pipeline, quando há dúvidas sobre a sequência de ferramentas, ou quando algo não está a funcionar e é preciso perceber onde estamos no fluxo.
triggers:
  - "próximo passo"
  - "como funciona o pipeline"
  - "o que faço a seguir"
  - "guia pipeline"
  - "pipeline imersão"
  - "sequência de ferramentas"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  context: imersao-ia-portugal
---

# Imersão IA Portugal — Pipeline Guide

Este skill guia mentores e alunos através do pipeline completo da Imersão IA Portugal, passo a passo.

## Pipeline Completo

```
SÁBADO MANHÃ
─────────────────────────────────────────────────────────
PASSO 1: Student Profiler
  URL: http://localhost:5191
  Tempo: ~10 minutos
  Output: ProfileData JSON (nome, ideia, público, nível)

     ↓

PASSO 2: Briefing Generator
  URL: http://localhost:5190
  Tempo: ~15 minutos
  Input: ProfileData do Passo 1
  Output: BriefingOutput JSON (features, stack, pain points)
  ALTERNATIVA: Preencher manualmente se a ferramenta não estiver disponível

     ↓

PASSO 3: Starter Builder
  URL: http://localhost:5192
  Tempo: ~5 minutos
  Input: BriefingOutput do Passo 2 (via URL ou cópia manual)
  Output: DesignTokens (cores, fonte, estética)

     ↓

PASSO 4: Prompt Optimizer
  URL: http://localhost:5193
  Tempo: ~5 minutos
  Input: DesignTokens do Passo 3 (via URL param ?tokens=...)
  Output: OptimizedPrompt (system + user prompt enriquecido)

     ↓

PASSO 5: AIOS Compiler
  URL: http://localhost:5194
  Tempo: ~10-15 minutos (geração + push)
  Input: OptimizedPrompt do Passo 4 (via URL param ?prompt=...)
  Requer: Chave Groq (gratuita em console.groq.com) + Token GitHub
  Output: Repositório GitHub criado com código gerado

     ↓

PASSO 6: Deploy no Vercel
  URL: https://ai-velocity-project.vercel.app/?repo={github-url}
  Tempo: ~5 minutos (build Vercel automático)
  Output: URL pública do projecto do aluno

DOMINGO
─────────────────────────────────────────────────────────
PROJECTO ONLINE COM URL PÚBLICA
```

## Diagnóstico Rápido por Passo

### Passo 1 — Student Profiler
- Problema: Aluno não sabe o que quer construir
- Fix: Perguntar "Que problema tens hoje que uma app podia resolver?"

### Passo 2 — Briefing Generator
- Problema: Ferramenta offline
- Fix: Criar briefing manualmente com o template em markdown

### Passo 3 — Starter Builder
- Problema: Tokens não chegam ao Optimizer
- Fix: Copiar JSON de DesignTokens manualmente e colar no Optimizer

### Passo 4 — Prompt Optimizer
- Problema: Prompt muito vago
- Fix: Adicionar boost do tipo de projecto (@saas-mvp-builder, @landing-builder, etc.)

### Passo 5 — AIOS Compiler
- Problema: Erro no GitHub push
- Fix: Verificar token GitHub + confirmar que repo não existe já
- Problema: Código com erros
- Fix: Verificar que ficheiros protegidos estão intactos (main.tsx, package.json)

### Passo 6 — Deploy Vercel
- Problema: Build falha
- Fix: Confirmar que build script é "vite build" (sem "tsc -b")
- Problema: Rotas não funcionam (404)
- Fix: Confirmar vercel.json com SPA rewrite rule

## URLs Rápidas

```
Student Profiler:  http://localhost:5191
Briefing Gen:      http://localhost:5190
Starter Builder:   http://localhost:5192
Prompt Optimizer:  http://localhost:5193
AIOS Compiler:     http://localhost:5194
AI Velocity:       https://ai-velocity-project.vercel.app
Groq Console:      https://console.groq.com
```

## Configuração Necessária (Passo 5)

```
1. CHAVE GROQ (gratuita):
   - Criar conta em console.groq.com
   - Criar API Key
   - Colar no campo "Groq API Key" do Compiler
   - Modelo: llama-3.3-70b-versatile

2. TOKEN GITHUB:
   - github.com → Settings → Developer Settings → Personal Access Tokens
   - Criar token com scope "repo"
   - Colar no campo "GitHub Token" do Compiler
```

Quando o mentor ou aluno descreve onde está no pipeline, identificar o passo exacto e fornecer instruções precisas para avançar — incluindo a URL correcta, os dados que precisa do passo anterior, e o que fazer se algo falhar.
