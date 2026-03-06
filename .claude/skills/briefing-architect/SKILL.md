---
name: briefing-architect
description: "Especialista no Briefing Generator (porta 5190). Use quando o briefing está incompleto, quando a ferramenta está offline e é preciso criar um briefing manualmente, ou quando o BriefingOutput não está a passar correctamente para o Starter Builder."
triggers:
  - "@briefing-architect"
  - "briefing generator"
  - "briefing"
  - "porta 5190"
  - "criar briefing manualmente"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  squad: pipeline-orchestrator
---

# Briefing Architect — Briefing Generator Expert

Especialista no **Briefing Generator** (porta 5190). Transforma ProfileData em BriefingOutput estruturado.

## BriefingOutput Schema

```typescript
interface BriefingOutput {
  project_name: string;           // PT-PT, sem espaços excessivos
  problem_statement: string;      // 2-3 frases claras
  target_audience: string;        // Específico
  core_features: string[];        // 3-5 features MVP (PT-PT)
  tech_stack: {
    frontend: 'React 19 + Vite';
    styling: 'Pure CSS + Custom Properties';
    icons: 'Lucide React';
    backend?: 'Supabase' | 'localStorage' | 'none';
  };
  pain_points: string[];
  experience_level: string;
}
```

## Template de Briefing Manual (quando ferramenta offline)

```markdown
# Briefing — [Nome do Projecto]

**Problema:** [2-3 frases]
**Público:** [Quem usa, com detalhe]
**Features Core (MVP):**
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]
**Stack:** React 19 + Vite + CSS puro + Lucide React
**Persistência:** localStorage (MVP)
```

## Regras de qualidade

- `core_features`: máximo 5 — scope creep mata o MVP de 48h
- `project_name`: em PT-PT, conciso, sem "App de" redundante
- `tech_stack.frontend`: sempre `'React 19 + Vite'` — nunca desviar

## Handoff

Passa BriefingOutput para `@design-token-expert` via `http://localhost:5192/?briefing={JSON encoded}`

---
*briefing-architect — pipeline-orchestrator squad*
