# Squad: prd-world-class

> Criação de PRDs de qualidade world-class para o ecossistema Imersão IA Portugal.
> Criado por Orion (aios-master) — 2026-03-06

## Missão

Transformar requisitos vagos em PRDs precisos e accionáveis, combinando expertise de produto, UX, arquitectura, growth e pedagogia de nível mundial.

## Especialistas

| Agente | Persona | Expertise | Ex-Empresa |
|--------|---------|-----------|-----------|
| `@chen-wei` | Chen Wei | Product Strategy & PRD | Google, Anthropic |
| `@sofia-ribeiro` | Sofia Ribeiro | UX Research & Learning Experience | IDEO, Nielsen Norman |
| `@priya-kapoor` | Priya Kapoor | Technical Architecture | Stripe, Vercel |
| `@marcus-okonkwo` | Marcus Okonkwo | Growth & Engagement | Duolingo, Notion |
| `@elena-volkov` | Elena Volkov | Instructional Design | Khan Academy, edX |

## Como usar

### Criar PRD completo para uma ferramenta

```bash
# Activar qualquer agente do squad
@chen-wei

# Iniciar workflow de criação de PRD
*create-prd student-profiler
```

### Usar especialistas individualmente

```bash
# Apenas UX audit
@sofia-ribeiro
*audit-ux aios-compiler

# Apenas arquitectura técnica
@priya-kapoor
*design-architecture briefing-generator

# Apenas learning objectives
@elena-volkov
*learning-objectives prompt-optimizer

# Apenas growth loop
@marcus-okonkwo
*design-loop community-dashboard
```

## Workflow de Criação de PRD

```
Phase 1: Chen Wei — Define problema + métricas
    ↓
Phase 2a: Sofia Ribeiro — UX spec + user journey     ┐ em paralelo
Phase 2b: Elena Volkov — Pedagogical design + feedback ┘
    ↓
Phase 3: Priya Kapoor — Arquitectura técnica + data contracts
    ↓
Phase 4: Marcus Okonkwo — Growth loop + engagement mechanics
    ↓
Phase 5: Chen Wei — Síntese → PRD final
```

## Ferramentas do Ecossistema (PRDs a criar)

| Ferramenta | PRD Existente | Prioridade |
|-----------|--------------|-----------|
| Student Profiler | Parcial | P1 |
| Briefing Generator | Nenhum | P1 |
| Starter Builder | Nenhum | P2 |
| Prompt Optimizer | Nenhum | P1 |
| AIOS Compiler | Nenhum | P0 |
| Community Dashboard | Nenhum | P2 |

## Output de cada PRD

```
docs/prd/
├── PRD_{tool-name}.md          ← PRD master (entrega principal)
└── specs/
    ├── ux_{tool-name}.md       ← UX specification detalhada
    ├── tech_{tool-name}.md     ← Technical specification
    ├── pedagogy_{tool-name}.md ← Pedagogical design
    └── growth_{tool-name}.md   ← Growth & engagement spec
```
