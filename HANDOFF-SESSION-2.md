# HANDOFF — Sessão 2
**Data:** 2026-03-06 | **De:** Orion (aios-master)
**Contexto:** 78% — parar aqui para preservar qualidade
**Urgência:** ALTA — Imersão sábado 2026-03-08

---

## COMANDO EXACTO PARA CONTINUAR

Na próxima sessão Claude Code, escrever EXACTAMENTE:

```
/AIOS:agents:aios-master
```

Depois colar esta mensagem:
```
Lê o ficheiro HANDOFF-SESSION-2.md na raiz do projecto.
Continua a partir do ponto de paragem — workflow do sábado e Prompt Optimizer.
```

---

## O QUE FOI FEITO NESTA SESSÃO ✅

### Skills criadas (3/3 que faltavam)
- `.claude/skills/dashboard-builder/SKILL.md` ✅
- `.claude/skills/portfolio-builder/SKILL.md` ✅
- `.claude/skills/ecommerce-builder/SKILL.md` ✅
- **Squad project-type-specialists: 5/5 COMPLETO**

### PRD do AIOS Compiler criado
- Feito com `@chen-wei` — está na memória desta sessão
- North Star: taxa de deploy bem-sucedidos ≥ 85%
- 4 bugs identificados por `@priya-kapoor`

### Bugs corrigidos no AIOS Compiler
| Fix | Ficheiro | Commit |
|-----|---------|--------|
| Auto-verificar GitHub token ao gerar | `App.tsx` | 839f9a5 |
| Redirect correcto por tipo de erro no push | `App.tsx` | 839f9a5 |
| Remover toggle useGroqValidation | `App.tsx` | 839f9a5 |
| SPA rewrites no vercel.json | `GitHubService.ts` | 839f9a5 |
| Link directo criar token GitHub | `App.tsx` | 839f9a5 |
| Reforçar prompts geração + validação (interface sem {) | `GeminiService.ts` | cedfae4 |
| Adicionar motion@11 ao scaffold | `GitHubService.ts` | 95f3beb |

### Testes realizados
- ✅ Fase 1 (happy path): 14 ficheiros publicados, @DaSilvaAlves verificado auto
- ✅ Fix #1 auto-verify confirmado
- ✅ Build Vercel falhou com `interface TaskGroup  title:` → fix aplicado
- ⏳ Fase 2 (erros) — não chegou a testar token inválido e repo duplicado

---

## VISÃO ESTRATÉGICA — CONTEXTO CRÍTICO

### A história origem
O colega de formação criou um prompt excepcional → colocou no Lovable/AI Studio → resultado perfeito sem erros.
**Repo de referência:** https://github.com/DaSilvaAlves/Imers-o
**Prompt de referência:** `C:\Users\XPS\Documents\prompt-todolist.txt`

O que fez o prompt ser "fora de série":
- Cores exactas: `#050810`, `#00F5FF`, `#0066FF`
- Tipografia específica: Orbitron/Rajdhani display, Syne/DM Sans body
- Animações detalhadas: stagger, scan line hover, cursor customizado
- CSS patterns: glassmorphism, backdrop-filter, custom properties
- Componentes: estilos específicos (terminal input, outline buttons)

**A visão:** prompt de qualidade → Compiler → projecto perfeito (sem Lovable, sem AI Studio)

### Workflow do sábado (após almoço)
```
1. Student Profiler → identificar dor do aluno
2. Briefing Generator → PRD básico
3. Perplexity + Grok → pesquisa real do domínio
4. Prompt técnico base (já com contexto de pesquisa)
5. Squads/Skills → elevar qualidade visual + arquitectura
6. AIOS Compiler → projecto perfeito
```

A **camada de pesquisa** (passo 3) é feita manualmente pelo mentor por agora.
O Compiler é um **processador** — a magia está no input.

---

## O QUE FALTA FAZER (por prioridade)

### P0 — Antes do sábado

#### 1. Guardar o PRD do AIOS Compiler em ficheiro
O PRD foi criado com @chen-wei nesta sessão mas está apenas na memória.
Precisa de ser guardado em `docs/prd/aios-compiler-prd.md`.

**Comando:**
```
@chen-wei — o PRD do AIOS Compiler que criámos está na memória desta sessão.
Por favor gera o ficheiro completo em docs/prd/aios-compiler-prd.md
```
*(Atenção: se a sessão foi fechada, o PRD está neste HANDOFF resumido abaixo)*

#### 2. Melhorar o Prompt Optimizer para produzir prompts de qualidade "fora de série"
O Prompt Optimizer actual produz prompts funcionais mas sem detalhe visual.
Precisa de injectar:
- Paleta de cores específica (vinda dos design tokens do Starter Builder)
- Tipografia com fontes com carácter (não Inter/Roboto/Arial)
- Animações detalhadas (agora que motion@11 está no scaffold)
- CSS patterns (glassmorphism, custom properties)

**Ficheiro a melhorar:**
`packages/prompt-optimizer/src/` — ver estrutura e melhorar o output

**Skill a usar:**
```
@prompt-optimizer-pro
```

#### 3. Testar Fase 2 de erros (se houver tempo)
- Teste A: token GitHub inválido → deve redirigir para step 2
- Teste B: repo duplicado → deve ficar no step 5
- Teste C: token não verificado no step 5 → aviso visível

#### 4. Verificar projecto gerado no Vercel (conta certa)
- Conta Vercel correcta: `DaSilvaAlves` (não `euricojsalves-4744`)
- Repo para testar: `DaSilvaAlves/nome-do-reposit-rio-mmf86enj`

### P1 — Após sábado

#### 5. Automatizar a camada de pesquisa no pipeline
Integrar Perplexity/Grok como passo entre Briefing e Prompt Optimizer.
Squad a criar: `@research-enricher` — recebe PRD básico, faz pesquisa, enriquece prompt.

#### 6. Squad de elevação de prompts
Criar workflow que combina:
- `@chen-wei` (estratégia)
- `@priya-kapoor` (arquitectura técnica)
- `@compiler-react19-architect` (padrões React)
- `@portfolio-builder`/`@dashboard-builder`/etc. (contexto visual do domínio)
→ Output: prompt no nível do prompt do colega

---

## PRD DO AIOS COMPILER (resumo para nova sessão)

```markdown
# PRD — AIOS Compiler
North Star: taxa de deploy bem-sucedidos ≥ 85%

Problema: erros de configuração + fase Publicar falha
Utilizador: aluno (executor) + mentor ao lado

Requisitos críticos:
- RF-01: Validar API keys em tempo real
- RF-04: PROTECTED_FILES nunca sobrescritos pelo LLM ✅ implementado
- RF-05: Validação Groq automática pós-geração ✅ implementado
- RF-09: Push GitHub com feedback por ficheiro ✅ implementado
- RF-10: Mensagens de erro accionáveis por tipo ✅ implementado
- RF-11: Abrir AI Velocity após push ✅ implementado

OUT of scope: histórico de projectos, multi-framework, colaboração
```

---

## ESTADO ACTUAL DO SISTEMA

### Pipeline (todos a funcionar)
```
Profiler (5191) → Briefing (5190) → Starter Builder (5192)
→ Optimizer (5193) → Compiler (5194) → AI Velocity (online)
```

### Skills completas
- PRD World-Class: 5/5 ✅
- Pipeline Orchestrator: 6/6 ✅
- Project Type Specialists: 5/5 ✅ (completado nesta sessão)
- Ferramentas: 6/6 ✅
- **Total: 22 skills de projecto**

### Commits desta sessão
```
95f3beb feat(compiler): adicionar motion@11 ao scaffold
cedfae4 fix(compiler): reforçar prompts geração + validação
839f9a5 fix(compiler): corrigir 4 bugs críticos + criar skills
```

---

## FICHEIROS CHAVE

| Ficheiro | Propósito |
|---------|-----------|
| `packages/aios-compiler/src/App.tsx` | Wizard 5 passos — state machine |
| `packages/aios-compiler/src/features/code-generator/GeminiService.ts` | Geração + validação Groq |
| `packages/aios-compiler/src/features/github-pusher/GitHubService.ts` | Push GitHub + scaffold |
| `packages/prompt-optimizer/src/` | **PRÓXIMO A MELHORAR** |
| `C:\Users\XPS\Documents\prompt-todolist.txt` | Prompt de referência de qualidade |
| `https://github.com/DaSilvaAlves/Imers-o` | Projecto perfeito de referência |

---

## CONTEXTO PEDAGÓGICO (para ter em mente)

- **Sábado 2026-03-08** — evento de 48h
- Alunos: iniciantes a intermédios
- Range: não sabem o que vão querer construir (Student Profiler resolve isto)
- Sucesso = projecto do aluno online no Vercel ao domingo
- UI sempre em PT-PT (Portugal, não Brasil)
- O mentor está ao lado — erros devem ser legíveis por ambos

---

*Gerado por Orion (aios-master) — 2026-03-06 — contexto 78%*
