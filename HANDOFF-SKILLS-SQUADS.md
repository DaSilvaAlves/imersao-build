# HANDOFF — Criação de Skills & Squads
**Data:** 2026-03-06 | **De:** Orion (aios-master)
**Motivo de paragem:** Contexto da sessão a 90% — risco de truncar ficheiros se continuar
**Urgência:** MÉDIA — completar antes da imersão (sábado 2026-03-08)

---

## ESTADO ACTUAL — O QUE FOI CRIADO

### Skills reais em `.claude/skills/` — COMPLETAS ✅

#### Squad PRD World-Class (5/5) ✅
| Skill | Path | Estado |
|-------|------|--------|
| `chen-wei` | `.claude/skills/chen-wei/SKILL.md` | ✅ Criado |
| `sofia-ribeiro` | `.claude/skills/sofia-ribeiro/SKILL.md` | ✅ Criado |
| `priya-kapoor` | `.claude/skills/priya-kapoor/SKILL.md` | ✅ Criado |
| `marcus-okonkwo` | `.claude/skills/marcus-okonkwo/SKILL.md` | ✅ Criado |
| `elena-volkov` | `.claude/skills/elena-volkov/SKILL.md` | ✅ Criado |

#### Squad Pipeline Orchestrator (4/6) — INCOMPLETO ⚠️
| Skill | Path | Estado |
|-------|------|--------|
| `profiler-specialist` | `.claude/skills/profiler-specialist/SKILL.md` | ✅ Criado |
| `briefing-architect` | `.claude/skills/briefing-architect/SKILL.md` | ✅ Criado |
| `design-token-expert` | `.claude/skills/design-token-expert/SKILL.md` | ✅ Criado |
| `prompt-optimizer-pro` | `.claude/skills/prompt-optimizer-pro/SKILL.md` | ✅ Criado |
| `compiler-master` | `.claude/skills/compiler-master/SKILL.md` | ✅ Criado |
| `deploy-guardian` | `.claude/skills/deploy-guardian/SKILL.md` | ✅ Criado |

> Pipeline orchestrator está COMPLETO (6/6) — a task #6 pode ser marcada como completed.

#### Squad Project Type Specialists (2/5) — INCOMPLETO ⚠️
| Skill | Path | Estado |
|-------|------|--------|
| `saas-mvp-builder` | `.claude/skills/saas-mvp-builder/SKILL.md` | ✅ Criado |
| `landing-builder` | `.claude/skills/landing-builder/SKILL.md` | ✅ Criado |
| `dashboard-builder` | `.claude/skills/dashboard-builder/SKILL.md` | ❌ FALTA |
| `portfolio-builder` | `.claude/skills/portfolio-builder/SKILL.md` | ❌ FALTA |
| `ecommerce-builder` | `.claude/skills/ecommerce-builder/SKILL.md` | ❌ FALTA |

### Skills de ferramenta (6/6) ✅
Todas criadas: `imersao-pipeline-guide`, `imersao-debug-react`, `imersao-deploy-validator`,
`compiler-react19-architect`, `compiler-from-briefing`, `compiler-pt-pt-standards`

### Squads (definições de referência) (3/3) ✅
Todos os ficheiros de squad criados em `squads/`:
- `squads/prd-world-class/` — 5 agentes + workflow + README ✅
- `squads/pipeline-orchestrator/` — 6 agentes + README ✅
- `squads/project-type-specialists/` — 5 agentes + README ✅

---

## O QUE FALTA — 3 SKILLS A CRIAR

### 1. `dashboard-builder` — SKILL.md

**Path:** `.claude/skills/dashboard-builder/SKILL.md`

**Frontmatter:**
```yaml
name: dashboard-builder
description: "Especialista em dashboards de dados e backoffice — analytics, KPIs, tabelas com filtros. Use para gerar arquitectura e prompt boost para projectos dashboard dos alunos."
triggers:
  - "@dashboard-builder"
  - "dashboard"
  - "analytics"
  - "backoffice"
  - "kpis"
  - "gráficos"
  - "tabela de dados"
```

**Conteúdo essencial a incluir:**
- Arquitectura de ficheiros para dashboard (sidebar + main content area)
- Prompt Boost: KPI cards com trend indicators, gráficos SVG puro (sem Chart.js/Recharts), tabela com sort/filter/pagination, sidebar colapsável, dados de exemplo realistas em PT-PT, dark theme preferido
- Referência à skill `compiler-react19-architect` para padrões base

**Referência:** Ver ficheiro completo em `squads/project-type-specialists/agents/dashboard-builder.md`

---

### 2. `portfolio-builder` — SKILL.md

**Path:** `.claude/skills/portfolio-builder/SKILL.md`

**Frontmatter:**
```yaml
name: portfolio-builder
description: "Especialista em portfólios profissionais com identidade visual única. Use para gerar arquitectura e prompt boost para portfólios pessoais dos alunos — freelancer, developer, designer."
triggers:
  - "@portfolio-builder"
  - "portfólio"
  - "site pessoal"
  - "freelancer"
  - "apresentação pessoal"
  - "portfolio"
```

**Conteúdo essencial a incluir:**
- Princípio: NUNCA genérico — cada portfólio deve ter personalidade visual única
- Prompt Boost: Hero full-screen com animação de texto, secção About + skills, Work/Projects (3-6 items com hover), Contact form, tipografia editorial (display font + body font), animações de page-load staggered, 4 direcções estéticas (Brutalist, Editorial, Dark & moody, Clean & confident)
- Aviso: evitar Inter/Roboto/Arial — usar fontes com carácter

**Referência:** Ver ficheiro completo em `squads/project-type-specialists/agents/portfolio-builder.md`

---

### 3. `ecommerce-builder` — SKILL.md

**Path:** `.claude/skills/ecommerce-builder/SKILL.md`

**Frontmatter:**
```yaml
name: ecommerce-builder
description: "Especialista em lojas online MVP — catálogo de produtos, carrinho localStorage, checkout sem pagamentos reais. Use para projectos de ecommerce dos alunos."
triggers:
  - "@ecommerce-builder"
  - "loja online"
  - "ecommerce"
  - "carrinho"
  - "produtos"
  - "marketplace"
  - "checkout"
```

**Conteúdo essencial a incluir:**
- Regra: sem pagamentos reais no MVP — localStorage simula o pedido
- Prompt Boost: catálogo grid (3/2/1 cols), product detail page, carrinho slide-in drawer, checkout 3 passos (dados → revisão → confirmação), carrinho persistente em localStorage, ícone de carrinho com badge no header, preços em formato EUR (€XX,XX), indicadores de stock
- 12+ produtos de exemplo realistas em PT-PT

**Referência:** Ver ficheiro completo em `squads/project-type-specialists/agents/ecommerce-builder.md`

---

## COMO CONTINUAR — INSTRUÇÕES PARA NOVA SESSÃO

### Passo 1 — Activar o agente certo
Na nova janela Claude Code, escrever:
```
/AIOS:agents:aios-master
```

### Passo 2 — Dar contexto imediato
Colar esta mensagem exacta:
```
Lê o ficheiro HANDOFF-SKILLS-SQUADS.md na raiz do projecto.
Preciso que completes a criação das 3 skills em falta:
dashboard-builder, portfolio-builder, ecommerce-builder
em .claude/skills/{nome}/SKILL.md

As definições completas estão em squads/project-type-specialists/agents/{nome}.md
Segue a estrutura dos outros SKILL.md já criados (ex: saas-mvp-builder, landing-builder).
```

### Passo 3 — Verificar tasks pendentes
```
Marca a task #6 como completed (pipeline orchestrator está 6/6 completo)
Continua a task #7 (project-type-specialists — faltam 3)
```

### Passo 4 — Após criar as 3 skills, verificar tudo
```bash
ls .claude/skills/ | wc -l
# Deve mostrar 43 skills (24 originais + 6 ferramentas + 13 agentes)
```

---

## ESTRUTURA DE UM SKILL.MD (template para as 3 que faltam)

```markdown
---
name: {nome}
description: "{descrição curta para o autocomplete}"
triggers:
  - "@{nome}"
  - "{trigger 1}"
  - "{trigger 2}"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  squad: project-type-specialists
---

# {Título}

{1 frase de identidade}

## Quando usar

{Tipos de projecto que activa este especialista}

## Arquitectura de Ficheiros

{estrutura src/ recomendada}

## Prompt Boost para Compiler

{Texto a adicionar ao system prompt do AIOS Compiler}

## Regras MVP

{3-5 regras críticas para o tipo de projecto}

---
*{nome} — project-type-specialists squad*
```

---

## ESTADO DAS TASKS

| # | Task | Estado |
|---|------|--------|
| 1 | Squad prd-world-class (5 agentes) | ✅ completed |
| 2 | Squad pipeline-orchestrator (6 agentes) | ✅ completed |
| 3 | Squad project-type-specialists (5 agentes) | ✅ completed |
| 4 | 6 Skills ferramentas | ✅ completed |
| 5 | Skills reais PRD (5) | ✅ completed |
| 6 | Skills reais Pipeline (6) | ✅ completed — marcar na nova sessão |
| 7 | Skills reais Project Types (5) | ⚠️ 2/5 — continuar na nova sessão |

---

## VERIFICAÇÃO FINAL (após completar tudo)

```bash
# Contar skills criadas
ls .claude/skills/ | sort

# Verificar que as 3 novas existem
ls .claude/skills/dashboard-builder/
ls .claude/skills/portfolio-builder/
ls .claude/skills/ecommerce-builder/

# Teste rápido de activação (numa nova janela Claude Code)
@chen-wei   → deve activar Chen Wei PRD specialist
@compiler-master  → deve activar Compiler Master
@dashboard-builder → deve activar Dashboard Builder
```

---

## CONTEXTO DO PROJECTO (para nova sessão)

**Projecto:** Imersão IA Portugal — ferramentas pedagógicas para evento 48h
**Repositório:** `C:/Users/XPS/Documents/imersao-build`
**Urgência:** Imersão a 2026-03-08 (sábado)
**PRD a criar após skills:** AIOS Compiler (P0) usando `@chen-wei` + workflow `prd-world-class`

---

*Gerado por Orion (aios-master) — 2026-03-06 — contexto 90%*
