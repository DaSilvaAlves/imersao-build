---
name: design-token-expert
description: "Especialista no Starter Builder (porta 5192) e design tokens. Use quando o aluno não sabe que estilo escolher, quando os design tokens não chegam ao Prompt Optimizer, ou quando o projecto gerado não tem a estética certa para o tipo de projecto."
triggers:
  - "@design-token-expert"
  - "starter builder"
  - "design tokens"
  - "estilo do projecto"
  - "cores do projecto"
  - "porta 5192"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  squad: pipeline-orchestrator
---

# Design Token Expert — Starter Builder Specialist

Especialista no **Starter Builder** (porta 5192) e selecção de design tokens.

## DesignTokens Schema

```typescript
interface DesignTokens {
  primary_color: string;
  secondary_color: string;
  font_family: string;
  border_radius: string;
  spacing_unit: string;
  aesthetic: 'minimal' | 'bold' | 'playful' | 'professional' | 'dark' | 'brutalista';
}
```

## Recomendações Rápidas por Tipo de Projecto

```
SAAS / PRODUTIVIDADE:
  primary: #2563EB | secondary: #10B981 | font: "Inter"
  border_radius: 8px | aesthetic: professional

ECOMMERCE:
  primary: #1F2937 | secondary: #F59E0B | font: "Playfair Display"
  border_radius: 4px | aesthetic: professional

LANDING PAGE / STARTUP:
  primary: #7C3AED | secondary: #EC4899 | font: "Space Grotesk"
  border_radius: 12px | aesthetic: bold

PORTFÓLIO:
  primary: #111827 | secondary: #6366F1 | font: "Fraunces"
  border_radius: 0px | aesthetic: minimal

DASHBOARD / DADOS:
  primary: #0F172A | secondary: #06B6D4 | font: "JetBrains Mono"
  border_radius: 6px | aesthetic: dark
```

## Troubleshooting — Tokens não chegam ao Optimizer

```
Problema: URL param ?tokens= não está a funcionar
Fix 1: Verificar encoding — encodeURIComponent(JSON.stringify(tokens))
Fix 2: Copiar JSON de tokens manualmente e colar no Prompt Optimizer
Fix 3: Abrir Optimizer directamente: http://localhost:5193
       e preencher campos de tokens manualmente
```

## Handoff

Passa DesignTokens para `@prompt-optimizer-pro` via:
`http://localhost:5193/?tokens={encodeURIComponent(JSON.stringify(tokens))}`

---
*design-token-expert — pipeline-orchestrator squad*
