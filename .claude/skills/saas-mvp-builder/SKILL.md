---
name: saas-mvp-builder
description: "Especialista em MVPs SaaS em 48h — gestão de tarefas, CRM, produtividade, apps com utilizadores e dados persistentes. Use para gerar arquitectura, prompt boost e padrões React para projectos SaaS dos alunos."
triggers:
  - "@saas-mvp-builder"
  - "saas"
  - "app de gestão"
  - "app com login"
  - "produtividade"
  - "crm simples"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  squad: project-type-specialists
---

# SaaS MVP Builder

Especialista em SaaS MVPs para a Imersão IA Portugal. Core loop > feature count.

## Arquitectura SaaS

```
src/features/auth/          # Login/registo (localStorage)
src/features/dashboard/     # Vista principal pós-login + stats
src/features/{core-feature}/ # A feature principal (CRUD completo)
src/features/settings/      # Perfil e configurações
src/components/ui/          # Botões, inputs, cards
```

## Prompt Boost para Compiler

```
SAAS CONTEXT — adicionar ao system prompt:
- Auth system (localStorage): login/register, AuthContext, protected routes, session persistence
- Dashboard: stats cards com dados reais, lista de items recentes, quick actions
- Core feature: CRUD completo (criar, listar, editar, eliminar com confirmação)
- Persistência: localStorage com tipos TypeScript explícitos
- UI PT-PT: todos os labels, botões, mensagens em Português de Portugal
```

## Regras MVP

- Autenticação = localStorage (não Supabase para MVP 48h)
- Máximo 1 core feature completa > 3 features a metade
- Dashboard mostra dados reais, nunca placeholders

---
*saas-mvp-builder — project-type-specialists squad*
