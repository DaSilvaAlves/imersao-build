# HANDOFF — Sessão 3
**Data:** 2026-03-07 | **De:** Orion (aios-master) + Aria (architect)
**Contexto:** 78% — parar aqui para preservar qualidade
**Urgência:** CRÍTICA — Imersão sábado 2026-03-08 (horas)

---

## COMANDO EXACTO PARA CONTINUAR

```
/AIOS:agents:aios-master
```

Depois colar:
```
Lê o ficheiro HANDOFF-SESSION-3.md na raiz do projecto.
Continua a partir do ponto de paragem.
```

---

## REGRA DE OURO DESTA SESSÃO

> O aios-master NÃO executa directamente. Chama skills e aguarda validação.
> Antes de qualquer commit: chamar `imersao-deploy-validator`.
> Antes de qualquer debug: chamar `compiler-master`.

---

## O QUE FOI FEITO NESTA SESSÃO ✅

### Commits (por ordem)

| Commit | O que fez |
|--------|-----------|
| `8f0be4b` | Prompt Optimizer — blueprints visuais completos por estilo (typography, animations, CSS patterns, components) |
| `8f0be4b` | AIOS Compiler — link directo para criar token GitHub (RF-01) |
| `8f0be4b` | docs: PRD do AIOS Compiler guardado em `docs/prd/aios-compiler-prd.md` |
| `cad97c2` | fix: imports partidos na geração — `import from 'react'` e `import X frompath` |
| `e9e87e7` | **FIX CRÍTICO**: botão "Deploy no Vercel" aponta para `vercel.com/import/git?s=<repo>` (antes abria CYBERTASK_PRO) |
| `e9e87e7` | fix: JSX `return(` fechado com `};` em vez de `);` |

### Descobertas Importantes

1. **Portal AIOS (`localhost:5333`) está PARTIDO** — o utilizador testava nele sem saber. Nunca usar.
2. **AI Velocity URL estava ERRADO** — `ai-velocity-project.vercel.app` é o CYBERTASK_PRO (projecto de exemplo), não um dashboard de deploy. Corrigido para Vercel directo.
3. **Ferramenta correcta**: `localhost:5194` (AIOS Compiler). Sempre.
4. **Optimizer melhorado** — output [DESIGN] agora tem fontes Google Fonts, animações, CSS patterns, componentes específicos por estilo.

---

## ESTADO ACTUAL DO PIPELINE ✅

```
5193 (Optimizer) → prompt → 5194 (Compiler) → GitHub → [botão Deploy no Vercel] → vercel.com/import/git?s=<repo> → Deploy
```

### Portas correctas (fechar tudo o resto)
| Porta | Ferramenta |
|-------|-----------|
| `5193` | Prompt Optimizer |
| `5194` | AIOS Compiler |
| `5333` | Portal AIOS — **FECHAR, NÃO USAR** |

---

## VALIDAÇÃO PENDENT — FAZER PRIMEIRO

O botão foi corrigido mas **ainda não foi testado de ponta a ponta** com a nova URL.

**Teste obrigatório antes do sábado:**
1. Abre `localhost:5194`
2. Cola qualquer prompt no step 1
3. Configura token GitHub + chave Groq
4. Clica "Próximo: Configurar APIs →"
5. Passa os 5 passos até ao fim
6. Clica **"🚀 Deploy no Vercel"**
7. **Deve abrir**: `https://vercel.com/import/git?s=https://github.com/DaSilvaAlves/...`
8. No Vercel: clicar "Deploy" (zero configuração)

Se o passo 7 abrir o Vercel com o repo → **PIPELINE COMPLETO ✅**

---

## O QUE FALTA (por prioridade)

### P0 — Antes do sábado

#### 1. Testar botão Deploy ponta-a-ponta (ver acima)

#### 2. Fase 2 de erros (se sobrar tempo — 30 min)
- Teste A: token GitHub inválido → deve redirigir para step 2
- Teste B: repo duplicado → deve ficar no step 5
- Teste C: token não verificado no step 5 → aviso visível

### P1 — Após sábado
- Automatizar camada de pesquisa no pipeline (Perplexity/Grok entre Briefing e Optimizer)
- Squad de elevação de prompts (@chen-wei + @priya-kapoor + skills por tipo)

---

## SCAFFOLD — VALIDAÇÃO COMPLETA ✅

Checklist `imersao-deploy-validator` executada — tudo verde:

| Item | Estado |
|------|--------|
| `build: "vite build"` (sem tsc -b) | ✅ |
| `vercel.json` com SPA rewrites | ✅ |
| `src/main.tsx` protegido (scaffold) | ✅ |
| PROTECTED_FILES (8 ficheiros) | ✅ |
| Sufixo único no nome do repo | ✅ |
| Botão deploy → `vercel.com/import/git?s=` | ✅ |

---

## FICHEIROS CHAVE

| Ficheiro | Propósito |
|---------|-----------|
| `packages/aios-compiler/src/App.tsx` | Wizard 5 passos — botão deploy na linha ~521 |
| `packages/aios-compiler/src/features/code-generator/GeminiService.ts` | SYSTEM_INSTRUCTION + validação Groq (12 checks) |
| `packages/aios-compiler/src/features/github-pusher/GitHubService.ts` | PROTECTED_FILES + scaffold |
| `packages/prompt-optimizer/src/features/prompt-builder/PromptBuilder.ts` | Blueprints visuais por estilo |
| `docs/prd/aios-compiler-prd.md` | PRD completo do Compiler |
| `C:\Users\XPS\Documents\prompt-todolist.txt` | Prompt de referência "fora de série" |

---

## PROTOCOLO DE ORQUESTRAÇÃO PARA SÁBADO

Definido por Aria (architect):

| Passo | Responsável | Ferramenta |
|-------|-------------|-----------|
| Gerar prompt | Mentor + aluno | `localhost:5193` |
| Compilar e fazer push | Aluno | `localhost:5194` |
| Deploy | Aluno | Botão → `vercel.com/import/git?s=<repo>` |
| Validar | Mentor | Vercel dashboard — build log |

**Uma porta. Um caminho. Zero ambiguidade.**

---

## CONTEXTO PEDAGÓGICO

- **Sábado 2026-03-08** — evento de 48h
- Alunos: iniciantes a intermédios
- Sucesso = projecto do aluno online no Vercel ao domingo
- UI sempre em PT-PT (Portugal)
- O mentor está ao lado — erros devem ser legíveis por ambos
- North Star: taxa de deploy bem-sucedidos ≥ 85%

---

## LIÇÃO APRENDIDA DESTA SESSÃO

O `aios-master` deve orquestrar, não executar.
Antes de qualquer acção:
1. Chamar a skill relevante (`compiler-master`, `imersao-deploy-validator`, etc.)
2. Aguardar avaliação
3. Só então executar com aprovação explícita do utilizador

---

*Gerado por Orion (aios-master) + Aria (architect) — 2026-03-07*
