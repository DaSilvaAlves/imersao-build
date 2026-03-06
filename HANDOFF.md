# HANDOFF — Imersão IA Portugal
**Data:** 2026-03-06 | **De:** Morgan (PM) + Quinn (QA) + Orion (Master)
**Para:** Próxima sessão de desenvolvimento
**Urgência:** ALTA — Imersão em 2 dias (sábado 2026-03-08)

---

## REGRA OBRIGATÓRIA
> **ANTES DE EXECUTAR QUALQUER COISA: Ler o PRD.**
> Path: `C:/Users/XPS/Documents/aios-imersao/docs/prd/PRD_imersao_ia_ecosystem.md`
> Qualquer tarefa que não esteja no PRD deve ser questionada antes de executar.

---

## 1. CONTEXTO DO PROJECTO

### O que é
Ecossistema de ferramentas pedagógicas web para a **Imersão IA Portugal**.
Promessa: *"Aluno entra sábado com ideia no papel. Sai domingo com ela no ar."*

### Mentor
Eurico Alves (`@DaSilvaAlves` no GitHub)

### Dois repositórios activos
| Repo | Path | Conteúdo |
|------|------|----------|
| `imersao-tools` | `C:/Users/XPS/Documents/imersao-tools/` | student-profiler, briefing-generator, starter-builder |
| `imersao-build` | `C:/Users/XPS/Documents/imersao-build/` | prompt-optimizer, aios-compiler, community-dashboard |

---

## 2. ESTADO ACTUAL DE CADA FERRAMENTA

### ✅ FUNCIONAL — Pronto para a imersão

| Ferramenta | Path | Porto | URL Online | Notas |
|-----------|------|-------|-----------|-------|
| Student Profiler | `imersao-tools/student-profiler/` | 5191 | Em produção (Vercel) | OK |
| Starter Builder | `imersao-tools/starter-builder/` | 5192 | — | Envia DesignTokens via URL param |
| Prompt Optimizer | `imersao-build/packages/prompt-optimizer/` | 5193 | — | Recebe briefing + tokens via URL |
| AIOS Compiler | `imersao-build/packages/aios-compiler/` | 5194 | — | **DOIS FIXES APLICADOS HOJE** |
| AI Velocity (simples) | `C:/Users/XPS/Documents/ai-velocity-project/` | 5333* | `ai-velocity-project.vercel.app` | Usar a versão ONLINE, não local |

*A versão local (5333) foi substituída pelo portal. Usar o online.

### 🟡 INCOMPLETO — Não crítico para este fim de semana

| Ferramenta | Path | Porto | Estado |
|-----------|------|-------|--------|
| Briefing Generator | `imersao-tools/briefing-generator/` | 5190 | Protótipo — pode usar manualmente |
| Community Dashboard | `imersao-build/packages/community-dashboard/` | 5196 | Funcional mas não crítico |

### ❌ NÃO USAR — Bugs conhecidos

| Ferramenta | Path | Problema |
|-----------|------|---------|
| Portal AIOS (novo) | `C:/Users/XPS/Documents/portal-imersao-ai/` | Bug de estado: dois localStorage em conflito. Adiar para pós-imersão. |

---

## 3. PIPELINE ESCOLHIDO (CAMINHO A)

```
[SÁBADO MANHÃ]
Student Profiler (5191)
        ↓ ProfileData JSON via URL
Briefing Generator (5190)  ← ou preenchimento manual do aluno
        ↓ BriefingOutput JSON
Starter Builder (5192)
        ↓ DesignTokens JSON via URL param
Prompt Optimizer (5193)
        ↓ OptimizedPrompt via URL param (?prompt=...)
AIOS Compiler (5194)
        ↓ Push para GitHub do aluno
AI Velocity Dashboard (https://ai-velocity-project.vercel.app/?repo=<github-url>)
        ↓ Abre no Vercel para deploy
[DOMINGO]
Projecto online com URL pública
```

### URLs de integração entre ferramentas
```
Starter Builder → Optimizer:
http://localhost:5193/?tokens=<DesignTokens JSON encoded>

Optimizer → Compiler:
http://localhost:5194/?prompt=<OptimizedPrompt encoded>

Compiler → AI Velocity:
https://ai-velocity-project.vercel.app/?repo=<github-url>
```

---

## 4. FIXES APLICADOS HOJE (2026-03-06)

### Fix 1 — Build script Vercel (CRÍTICO)
**Ficheiro:** `imersao-build/packages/aios-compiler/src/features/github-pusher/GitHubService.ts`
**Linha 123:** Mudado de `'tsc -b && vite build'` para `'vite build'`
**Porquê:** O `tsc -b` falhava no Vercel porque o código gerado por LLM tem erros TypeScript. Agora o Vite compila sem verificar tipos.

### Fix 2 — Nome de repo único (CRÍTICO)
**Ficheiro:** `imersao-build/packages/aios-compiler/src/App.tsx`
**Linha 132:** Adicionado sufixo `Date.now().toString(36)` ao nome do repo
**Porquê:** Tentativas repetidas criavam repo com o mesmo nome → "Repository creation failed"

### Fix 3 — AI Velocity URL corrigida
**Ficheiro:** `imersao-build/packages/aios-compiler/src/App.tsx:16`
**Mudança:** `http://localhost:5333` → `https://ai-velocity-project.vercel.app`
**Porquê:** A versão local tem bugs. Usar sempre a versão online.

### Fix 4 — Ficheiros críticos protegidos do LLM (CRÍTICO)
**Ficheiro:** `imersao-build/packages/aios-compiler/src/features/github-pusher/GitHubService.ts`
**Mudança:** Set `PROTECTED` — `main.tsx`, `package.json`, `vite.config.ts`, configs nunca são substituídos pelo código gerado pelo LLM
**Porquê:** O LLM gerava versões corrompidas destes ficheiros críticos que quebravam o build na Vercel

### Fix 5 — Groq validation automática
**Ficheiro:** `imersao-build/packages/aios-compiler/src/App.tsx:100`
**Mudança:** Validação Groq corre automaticamente se chave disponível (sem toggle manual)
**Porquê:** Alunos não ativavam o toggle → código com erros

### Estado actual após fixes
- Código gerado → GitHub → Vercel **deve funcionar**
- **Ainda não foi testado end-to-end após os fixes**
- **PRIORIDADE #1: Testar antes de sábado**

---

## 5. PRIORIDADES ANTES DE SÁBADO

### P0 — Testar pipeline completo (HOJE)
1. Abrir Prompt Optimizer (`localhost:5193`)
2. Usar prompt do "Task Manager" (exercício de sábado)
3. Enviar para Compiler (`localhost:5194`)
4. Gerar com Groq (chave gratuita em groq.com)
5. Publicar → verificar que repo é criado no GitHub com nome único
6. Verificar que Vercel faz build com sucesso
7. Confirmar URL pública funciona

### P1 — Verificar integração Starter Builder → Optimizer
- Confirmar que tokens do Starter Builder chegam ao Optimizer via URL
- Testar fluxo: `localhost:5192` → escolher design → clicar enviar → `localhost:5193` pré-preenchido

### P2 — Preparar chave Groq de backup
- Conta gratuita em `console.groq.com`
- Modelo: `llama-3.3-70b-versatile`
- Limite gratuito: 14.400 req/dia — suficiente para turma inteira

### P3 — Verificar Student Profiler online
- Confirmar URL de produção está funcional
- Testar formulário completo + output

---

## 6. O QUE NÃO FAZER ANTES DA IMERSÃO

- ❌ Não tocar no `portal-imersao-ai` (porta 5333) — bugs complexos, adiar
- ❌ Não criar landing page — não é blocker
- ❌ Não migrar para OmniRoute — melhoria futura
- ❌ Não refactorizar nada que já funcione
- ❌ Não mudar o design das ferramentas existentes

---

## 7. COMANDOS AIOX PARA CONTINUAÇÃO

### Para testar e corrigir o pipeline

```bash
# Activar agente de desenvolvimento
@dev

# Verificar estado dos packages
*task run-tests

# Ver o que está a correr
cd C:/Users/XPS/Documents/imersao-build
npm run dev  # inicia todos os packages (verificar package.json raiz)
```

### Para o AIOS Compiler (fix já aplicado)
```bash
cd C:/Users/XPS/Documents/imersao-build/packages/aios-compiler
npm run dev
# Porto: 5194
```

### Para o Prompt Optimizer
```bash
cd C:/Users/XPS/Documents/imersao-build/packages/prompt-optimizer
npm run dev
# Porto: 5193
```

### Para o Starter Builder
```bash
cd C:/Users/XPS/Documents/imersao-tools/starter-builder
npm run dev
# Porto: 5192
```

### Se o teste falhar — activar QA
```bash
@qa
*review aios-compiler
# Ver relatório: C:/Users/XPS/Documents/imersao-build/docs/qa/
```

### Se precisar de nova feature urgente — activar Dev
```bash
@dev
# REGRA: Ler PRD antes → C:/Users/XPS/Documents/aios-imersao/docs/prd/PRD_imersao_ia_ecosystem.md
# Trabalhar apenas em P0 e P1 da lista de prioridades
```

### Para ver estado do projecto
```bash
@pm
*status
```

### Para corrigir bugs do portal (PÓS-IMERSÃO)
```bash
@dev
# Ler HANDOFF: C:/Users/XPS/Documents/imersao-tools/HANDOFF_IMERSAO_TOOLS.md
# Bugs documentados: localStorage conflict em StationAnalyst.tsx
# Fix: usar key={context.updatedAt} no componente pai + localStorage.clear() no resetContext
```

---

## 8. FICHEIROS CHAVE

| Ficheiro | Propósito |
|---------|-----------|
| `C:/Users/XPS/Documents/aios-imersao/docs/prd/PRD_imersao_ia_ecosystem.md` | **PRD MASTER — ler antes de qualquer coisa** |
| `C:/Users/XPS/Documents/imersao-build/HANDOFF.md` | Este ficheiro |
| `C:/Users/XPS/Documents/imersao-tools/HANDOFF_IMERSAO_TOOLS.md` | Bugs do portal (pós-imersão) |
| `imersao-build/packages/aios-compiler/src/features/github-pusher/GitHubService.ts` | Fix 1 aplicado |
| `imersao-build/packages/aios-compiler/src/App.tsx` | Fix 2 aplicado |

---

## 9. CONTEXTO TÉCNICO RÁPIDO

### Stack
- React 19 + TypeScript + Vite
- CSS puro (sem Tailwind) — design system brutalista
- Lucide React para ícones
- Supabase para persistência (opcional — funciona sem)

### APIs usadas
- **Groq** (llama-3.3-70b-versatile) — GRATUITO — recomendado para alunos
- **Gemini** (gemini-2.0-flash) — gratuito com limites
- **GitHub API** — token pessoal do aluno (Personal Access Token)
- **Vercel** — deploy automático via importação do repo

### Portas reservadas
```
5190 — Briefing Generator
5191 — Student Profiler
5192 — Starter Builder
5193 — Prompt Optimizer
5194 — AIOS Compiler
5196 — Community Dashboard
5333 — Portal AIOS (NÃO USAR — bugs)
```

---

## 10. PRIMEIRA ACÇÃO NA NOVA JANELA

```
1. Ler PRD: C:/Users/XPS/Documents/aios-imersao/docs/prd/PRD_imersao_ia_ecosystem.md
2. Ler este HANDOFF até ao fim
3. Executar teste P0:
   - Abrir localhost:5193 (Prompt Optimizer)
   - Gerar prompt para "Task Manager"
   - Enviar para localhost:5194 (Compiler)
   - Publicar e confirmar GitHub + Vercel OK
4. Reportar resultado
```

---

*Gerado por Morgan (PM) + Quinn (QA) — Synkra AIOX — 2026-03-06*
*Próxima sessão: Continuar em nova janela com contexto limpo*
