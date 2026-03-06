# PRD — AIOS Compiler
**Versão:** 1.0 | **Data:** 2026-03-06 | **Autor:** Chen Wei (PM) + Priya Kapoor (Eng)
**Contexto:** Imersão IA Portugal — sábado 2026-03-08

---

## North Star

> Taxa de deploy bem-sucedidos ≥ 85% (projecto do aluno online no Vercel ao domingo)

---

## Problema

Os alunos falham no deploy por dois motivos principais:

1. **Erros de configuração** — token GitHub inválido ou ausente não é detectado cedo o suficiente
2. **Fase Publicar falha** — código gerado pela IA quebra o build Vercel (main.tsx com sintaxe errada, package.json incompatível, etc.)

O mentor está ao lado, mas erros devem ser **legíveis e accionáveis** por ambos.

---

## Utilizadores

| Persona | Descrição |
|---------|-----------|
| Aluno (executor) | Iniciante a intermédio, segue wizard passo a passo |
| Mentor (observador) | Ao lado, resolve bloqueios técnicos |

---

## Requisitos Funcionais

### RF-01 — Validar API keys em tempo real
- Ao introduzir token GitHub: validar imediatamente via API
- Mostrar feedback visual: OK / erro com mensagem accionável
- Link directo para criar token se inválido
- **Status:** implementado (commit 839f9a5)

### RF-02 — Redirect correcto por tipo de erro no push
- Token inválido → redirigir para step 2 (Configurar)
- Repo duplicado → ficar no step 5 (Publicar), permitir retry
- Erro genérico → step 5 com mensagem descritiva
- **Status:** implementado (commit 839f9a5)

### RF-03 — Aviso de token não verificado no step 5
- Se o utilizador chegar ao step 5 sem verificar o token → aviso visível
- Não bloquear — alertar com possibilidade de continuar
- **Status:** implementado (commit 839f9a5)

### RF-04 — PROTECTED_FILES nunca sobrescritos pelo LLM
Ficheiros críticos vêm SEMPRE do scaffold, NUNCA do output da IA:
```
src/main.tsx, package.json, vite.config.ts, tsconfig.json,
tsconfig.app.json, tsconfig.node.json, vercel.json, index.html
```
- **Causa raiz protegida:** IA gera main.tsx com sintaxe quebrada frequentemente
- **Status:** implementado (GitHubService.ts PROTECTED_FILES)

### RF-05 — Validação Groq automática pós-geração
- Se chave Groq presente: executar dual-pass de validação automaticamente
- Não requerer toggle manual
- **Status:** implementado

### RF-06 — Prompts de geração rigorosos (sem `{` em interfaces)
- Prompt de geração: instruir explicitamente contra `interface Foo { bar: string }` inline
- Usar type literals ou ficheiro separado
- **Status:** implementado (commit cedfae4)

### RF-07 — motion@11 no scaffold
- `framer-motion@11` incluído no package.json do scaffold
- Permite ao aluno usar animações no projecto gerado
- **Status:** implementado (commit 95f3beb)

### RF-08 — SPA rewrites no vercel.json do scaffold
- `vercel.json` do scaffold inclui rewrite rule para SPA routing
- Evita 404 em refresh de páginas internas
- **Status:** implementado (commit 839f9a5)

### RF-09 — Push GitHub com feedback por ficheiro
- Durante o push: mostrar cada ficheiro conforme é enviado
- Progresso visual em tempo real
- **Status:** implementado

### RF-10 — Mensagens de erro accionáveis por tipo
- Cada tipo de erro tem mensagem específica em PT-PT
- Instrução clara do próximo passo para o aluno
- **Status:** implementado

### RF-11 — Abrir AI Velocity após push
- Após push bem-sucedido: abrir `https://ai-velocity-project.vercel.app/?repo=<url>`
- Usar sempre a URL de produção (nunca localhost:5333)
- **Status:** implementado

---

## Requisitos Não Funcionais

| ID | Requisito |
|----|-----------|
| NFR-01 | Wizard de 5 passos: Prompt → Configurar → Gerar → Rever → Publicar |
| NFR-02 | UI em PT-PT (Portugal, nunca PT-BR) |
| NFR-03 | Funciona sem Supabase (degradação graciosa) |
| NFR-04 | API keys armazenadas apenas em localStorage (nunca enviadas para servidor) |
| NFR-05 | Build Vercel usa `vite build` (não `tsc && vite build`) para tolerância a TS errors no código gerado |

---

## Fora de Âmbito (Out of Scope)

- Histórico de projectos gerados
- Suporte a múltiplos frameworks (Vue, Svelte)
- Colaboração multi-aluno no mesmo projecto
- Editor de código inline
- Preview em tempo real do código gerado

---

## Modelos de IA Suportados

| Modelo | Provider | Tier |
|--------|---------|------|
| `llama-3.3-70b-versatile` | Groq | Recomendado (gratuito, 14.400 req/dia) |
| `gemini-2.0-flash` | Google | Alternativa (streaming SSE) |

---

## Estado de Implementação

| RF | Título | Estado |
|----|--------|--------|
| RF-01 | Validar API keys em tempo real | ✅ Implementado |
| RF-02 | Redirect correcto por tipo de erro | ✅ Implementado |
| RF-03 | Aviso token não verificado step 5 | ✅ Implementado |
| RF-04 | PROTECTED_FILES | ✅ Implementado |
| RF-05 | Validação Groq automática | ✅ Implementado |
| RF-06 | Prompts rigorosos | ✅ Implementado |
| RF-07 | motion@11 no scaffold | ✅ Implementado |
| RF-08 | SPA rewrites vercel.json | ✅ Implementado |
| RF-09 | Push com feedback por ficheiro | ✅ Implementado |
| RF-10 | Mensagens de erro accionáveis | ✅ Implementado |
| RF-11 | Abrir AI Velocity após push | ✅ Implementado |

**Todos os RF implementados.** Fase de testes pendente:
- Teste A: token GitHub inválido → redirect step 2
- Teste B: repo duplicado → ficar step 5
- Teste C: token não verificado no step 5 → aviso visível

---

*PRD gerado por sessão Orion (aios-master) — 2026-03-06*
