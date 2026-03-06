# Squad: pipeline-orchestrator

> Agentes especializados em cada ferramenta do pipeline Imersão IA Portugal.
> Criado por Orion (aios-master) — 2026-03-06

## Missão

Garantir que cada ferramenta do pipeline funciona perfeitamente, que os dados fluem correctamente entre ferramentas, e que mentores e alunos têm suporte especializado em cada etapa.

## Pipeline Completo

```
[Entrada do Aluno]
       ↓
@profiler-specialist     → Student Profiler (5191)
       ↓ ProfileData
@briefing-architect      → Briefing Generator (5190)
       ↓ BriefingOutput
@design-token-expert     → Starter Builder (5192)
       ↓ DesignTokens
@prompt-optimizer-pro    → Prompt Optimizer (5193)
       ↓ OptimizedPrompt
@compiler-master         → AIOS Compiler (5194)
       ↓ GitHub Repo URL
@deploy-guardian         → AI Velocity + Vercel
       ↓
[Projecto Online]
```

## Agentes

| Agente | Ferramenta | Porta |
|--------|-----------|-------|
| `@profiler-specialist` | Student Profiler | 5191 |
| `@briefing-architect` | Briefing Generator | 5190 |
| `@design-token-expert` | Starter Builder | 5192 |
| `@prompt-optimizer-pro` | Prompt Optimizer | 5193 |
| `@compiler-master` | AIOS Compiler | 5194 |
| `@deploy-guardian` | AI Velocity + Vercel | online |

## Como usar

```bash
# Problema num passo específico do pipeline
@compiler-master
*debug-build

# Aluno preso no Prompt Optimizer
@prompt-optimizer-pro
*validate-prompt {prompt}

# Deploy não está a funcionar
@deploy-guardian
*debug-vercel-build

# Código gerado está errado
@compiler-master
*validate-generated-code
```

## URLs de Integração

```
Starter Builder → Optimizer:
http://localhost:5193/?tokens=<DesignTokens JSON encoded>

Optimizer → Compiler:
http://localhost:5194/?prompt=<OptimizedPrompt encoded>

Compiler → AI Velocity:
https://ai-velocity-project.vercel.app/?repo=<github-url>

Vercel Import:
https://vercel.com/import/git?s=<github-url>
```
