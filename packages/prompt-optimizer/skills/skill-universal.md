# SKILL UNIVERSAL — Imersão IA Portugal
> **Versão:** 1.0 | **Estado:** Activo
> **Usado por:** Prompt Optimizer (`PromptBuilder.ts`)
> **Aplica-se a:** QUALQUER tipo de projecto (base obrigatória)

---

## O que é esta SKILL

A SKILL Universal é o **template base de System Prompt** que o Prompt Optimizer injeta em qualquer prompt gerado.
É construída **dinamicamente** a partir dos dados do PRD + Design Tokens, substituindo os placeholders `{{VARIÁVEL}}` pelos valores reais do aluno.

Se o sistema detectar keywords de boost (restaurante, dashboard, loja), injeta o boost correspondente em `[ROLE]`.
Se não detectar nenhum boost → a SKILL Universal funciona sozinha para qualquer projecto.

---

## Estrutura Completa do Prompt Gerado

```
[ROLE]
[CONTEXT]
[TARGET]
[ARCHITECTURE]
[LANGUAGE]
[FEATURES]
[DESIGN]
[FILES]
[RULES]
[OUTPUT]
```

---

## [ROLE]
> *Quem é a IA. Define a sua especialidade e comportamento geral.*

```
You are a Senior Frontend Developer + UI Designer specialized in {{STYLE_DESCRIPTION}}.
You produce complete, production-ready React 19 + TypeScript code with zero placeholders.
{{BOOST_NOTE}}
```

**Variáveis:**
- `{{STYLE_DESCRIPTION}}` — Descrição do estilo visual (ex: `raw, bold, high-contrast brutalist with thick borders`)
- `{{BOOST_NOTE}}` — Opcional. Injectado automaticamente se boost detectado (ex: `+ BOOST activated: RESTAURANT patterns`)

**Estilos disponíveis:**

| Chave | Descrição |
|-------|-----------|
| `brutalist` | raw, bold, high-contrast brutalist with thick borders and stark typography |
| `minimal` | clean, whitespace-driven minimal with subtle borders and refined spacing |
| `glass` | glassmorphism with frosted backgrounds, subtle gradients, and depth |
| `gastro` | warm, food-focused neo-gastronomy with earthy tones and organic shapes |
| `bento` | japanese bento grid layout with modular, card-based components |

---

## [CONTEXT]
> *O projecto específico do aluno — injectado a partir do Briefing Generator.*

```
Project: "{{PROJECT_NAME}}"
Problem to solve: "{{PAIN_POINTS}}"
Builder experience level: {{EXPERIENCE_LEVEL}}
UI Vibe: {{UI_VIBE}}
```

**Variáveis:**
- `{{PROJECT_NAME}}` — Nome do projecto (ex: `Gestor de Oficina Pro`)
- `{{PAIN_POINTS}}` — Dor descrita pelo aluno (ex: `Perco tempo a gerir agendamentos manualmente`)
- `{{EXPERIENCE_LEVEL}}` — `iniciante` | `intermediário` | `avançado`
- `{{UI_VIBE}}` — Vibe gerado pelo SmartAI (ex: `Premium Dark Mode`)

---

## [TARGET]
> *Para quem é o projecto — define o tom e complexidade da UI.*

```
{{TARGET_AUDIENCE}}
```

**Variáveis:**
- `{{TARGET_AUDIENCE}}` — Público-alvo descrito pelo aluno (ex: `Pequenos empresários que trabalham sozinhos`)

---

## [ARCHITECTURE]
> *Stack técnica e padrão de layout da aplicação.*

```
Stack: {{FRONTEND}} + {{BACKEND}}
Database: {{DATABASE}}
Architecture: {{ARCHITECTURE_TYPE}}
Layout pattern: {{LAYOUT_DESCRIPTION}}
State: React useState + Context (no external state library)
Persistence: LocalStorage (MVP)
```

**Variáveis:**
- `{{FRONTEND}}` — Ex: `React 19 + Vite`
- `{{BACKEND}}` — Ex: `Supabase` | `Node.js`
- `{{DATABASE}}` — Ex: `PostgreSQL + Supabase`
- `{{ARCHITECTURE_TYPE}}` — Ex: `Monolito Modular`
- `{{LAYOUT_DESCRIPTION}}` — Descrição do layout escolhido no Starter Builder

**Layouts disponíveis:**

| Chave | Descrição |
|-------|-----------|
| `kanban` | Kanban board (columns with drag-drop cards) |
| `list` | vertical list with rows and detail panels |
| `grid` | responsive grid of cards with hover effects |
| `calendar` | calendar grid with event overlays |

---

## [LANGUAGE]
> *Regra crítica do projecto — código em inglês, UI em português.*

```
- All code (variables, functions, comments, types): ENGLISH
- All UI strings (labels, buttons, text, placeholders, errors): Portuguese (PT-PT)
- Examples: const taskList = [] ✓  |  Button: "Guardar" ✓
```

> ⚠️ Esta secção é **estática** — não tem placeholders. É sempre injectada igual.

---

## [FEATURES]
> *Funcionalidades concretas do projecto, geradas a partir do Briefing.*

```
  - FR-1: {{FEATURE_1}}
  - FR-2: {{FEATURE_2}}
  - FR-3: {{FEATURE_3}}
  ...
```

**Variáveis:**
- `{{FEATURE_N}}` — Cada funcionalidade descrita pelo aluno (ex: `Agendamento automático de clientes`)

---

## [DESIGN]
> *Tokens visuais do Starter Builder. Se não houver tokens → valores padrão.*

```
Style: {{STYLE_DESCRIPTION}}
Colors: background="{{BG}}", foreground="{{FG}}", accent="{{ACCENT}}"
Typography: {{TYPOGRAPHY}}
CSS Directives: {{CSS_DIRECTIVES}}
Mobile-first responsive (base: mobile, breakpoint: 768px+)
```

**Variáveis:**
- `{{BG}}` — Cor de fundo (default: `#0a0a0a`)
- `{{FG}}` — Cor do texto (default: `#ffffff`)
- `{{ACCENT}}` — Cor de acento (default: `#EEFF00`)
- `{{TYPOGRAPHY}}` — `serif` | `sans-serif` | `mono`
- `{{CSS_DIRECTIVES}}` — Instruções CSS específicas do estilo (ex: `Hard box-shadows 4px 4px 0px #000, no border-radius`)

---

## [FILES]
> *Lista de ficheiros a gerar — dinâmica consoante as features.*

```
Generate the following files:
  - src/App.tsx
  - src/styles/theme.css
  - src/features/feature-1/index.tsx
  - src/features/feature-2/index.tsx
  - src/features/feature-N/index.tsx
  - src/components/ui/Button.tsx
  - src/types/index.ts
  - src/main.tsx
```

**Nota:** A lista cresce com cada feature detectada. Uma feature = uma pasta `features/feature-N/`.

---

## [RULES]
> *Restrições de qualidade — sempre injectadas, nunca alteradas sem aprovação.*

```
- No external CSS libraries (no Tailwind, no Bootstrap)
- No external UI libraries beyond Lucide React
- No Lorem Ipsum or placeholder data — use realistic Portuguese examples
- Max 200 lines per file — split into smaller components if needed
- Every feature must be fully functional (no stubs, no TODO comments)
- Empty states for all lists
- Loading and error states for all async operations
- Accessible: aria-label on interactive elements, keyboard navigation
- No inline styles — use CSS custom properties in theme.css
```

> ⚠️ Esta secção é **estática** e intencional. Alterações aqui têm impacto em todos os prompts gerados.

---

## [OUTPUT]
> *Instrução de formato de saída — garante que o código é parseável.*

```
Output each file in a separate code block with filename as header.
Format: ```typescript src/App.tsx ... ```
Start with theme.css → types/index.ts → features → App.tsx → main.tsx
Include ALL files listed in [FILES].
```

---

## Sistema de Boosts

Boosts são **adições opcionais** injectadas em `[ROLE]` quando o SmartAI detecta keywords.

| Boost | Keywords Detectadas | Ficheiro |
|-------|--------------------|----|
| `restaurant` | restaurante, menu, carta, ementa, delivery, reserva, mesa | `boosts/boost-restaurant.md` |
| `dashboard` | dashboard, painel, análise, relatório, gráfico, kpi, admin | `boosts/boost-dashboard.md` |
| `ecommerce` | loja, e-commerce, produto, carrinho, pagamento, stock | `boosts/boost-ecommerce.md` |

**Lógica:** Score > 5% dos keywords da categoria → boost activado. Só um boost por prompt.

---

## Como Editar

Para ajustar o comportamento global de todos os prompts gerados:

1. **Adicionar uma regra:** Edita a secção `[RULES]` e actualiza `PromptBuilder.ts` → `sections.rules`
2. **Mudar o [ROLE] base:** Edita a descrição e reflecte em `PromptBuilder.ts` → `sections.role`
3. **Adicionar um novo boost:** Cria `boosts/boost-{tipo}.md` + adiciona keywords em `BOOST_KEYWORDS`
4. **Novo estilo visual:** Adiciona entrada em `STYLE_DESCRIPTIONS` e `COLOR_PALETTES` no Starter Builder

---

## Exemplo de Prompt Gerado (preenchido)

```
[ROLE]
You are a Senior Frontend Developer + UI Designer specialized in raw, bold, high-contrast brutalist with thick borders and stark typography.
You produce complete, production-ready React 19 + TypeScript code with zero placeholders.

[CONTEXT]
Project: "Gestor de Oficina Pro"
Problem to solve: "Perco muito tempo a organizar faturas e a marcar agendamentos à mão"
Builder experience level: iniciante
UI Vibe: Premium Dark Mode

[TARGET]
Pequenos empresários de oficinas que trabalham sozinhos e precisam de simplicidade

[ARCHITECTURE]
Stack: React 19 + Vite + Supabase
Database: PostgreSQL + Supabase
Architecture: Monolito Modular
Layout pattern: Kanban board (columns with drag-drop cards)
State: React useState + Context (no external state library)
Persistence: LocalStorage (MVP)

[LANGUAGE]
- All code (variables, functions, comments, types): ENGLISH
- All UI strings (labels, buttons, text, placeholders, errors): Portuguese (PT-PT)

[FEATURES]
  - FR-1: Agendamento automático de clientes
  - FR-2: Controlo de stock de peças
  - FR-3: Emissão de faturas simples

[DESIGN]
Style: raw, bold, high-contrast brutalist with thick borders and stark typography
Colors: background="#000000", foreground="#ffffff", accent="#EEFF00"
Typography: sans-serif
CSS Directives: Hard box-shadows (4px 4px 0px #000), solid 2px borders, no border-radius
Mobile-first responsive (base: mobile, breakpoint: 768px+)

[FILES]
Generate the following files:
  - src/App.tsx
  - src/styles/theme.css
  - src/features/feature-1/index.tsx
  - src/features/feature-2/index.tsx
  - src/features/feature-3/index.tsx
  - src/components/ui/Button.tsx
  - src/types/index.ts
  - src/main.tsx

[RULES]
- No external CSS libraries (no Tailwind, no Bootstrap)
- No external UI libraries beyond Lucide React
- No Lorem Ipsum or placeholder data — use realistic Portuguese examples
- Max 200 lines per file — split into smaller components if needed
- Every feature must be fully functional (no stubs, no TODO comments)
- Empty states for all lists
- Loading and error states for all async operations
- Accessible: aria-label on interactive elements, keyboard navigation
- No inline styles — use CSS custom properties in theme.css

[OUTPUT]
Output each file in a separate code block with filename as header.
Format: ```typescript src/App.tsx ... ```
Start with theme.css → types/index.ts → features → App.tsx → main.tsx
Include ALL files listed in [FILES].
```

---

*SKILL Universal v1.0 — Imersão IA Portugal | Gerado por AIOS Master (Orion)*
