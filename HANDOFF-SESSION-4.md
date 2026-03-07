# HANDOFF — Sessão 4
**Data:** 2026-03-07 | **Agentes:** Aria (architect) + Gage (devops)
**Urgência:** CRÍTICA — Imersão sábado 2026-03-08

---

## COMANDO PARA CONTINUAR

```
/AIOS:agents:devops
```
Depois:
```
Lê HANDOFF-SESSION-4.md e continua.
```

---

## O QUE FOI FEITO NESTA SESSÃO

| Commit | Fix |
|--------|-----|
| `f91db87` | Arquitectura ficheiro único — elimina imports entre ficheiros |
| `dea6e3f` | Pre-processador determinístico no output final (sempre corre) |
| `6e21912` | interface sem nome + type alias sem nome |
| `dfd2df4` | import sem chaveta de fecho `{ X from` |
| `52f2479` | tipo sem `:` e arrow function sem `=>` |
| `f9a79e4` | propriedade de interface sem nome `: boolean` |
| `afc992d` | **FIX CRÍTICO**: Groq não valida próprio output (evita regressão) |
| `5ab8619` | Groq temperatura 0 + few-shot example |
| `0ce1c6b` | **FIX ARQUITECTURAL**: Groq JSON mode |
| `f1c457c` | JSON extraction robusta com fallback regex |
| `5f449c5` | Fallback parser — code block sem nome → src/App.tsx |
| `f8e2ece` | **FIX FINAL**: marcadores ===APP_START/END=== — elimina JSON escaping |
| `60c5c33` | Scaffold CSS reset + fundo branco |
| `e256762` | Closing tag truncado `</h>` + sub-componentes fantasma |

---

## ESTADO ACTUAL

**Pipeline FUNCIONA** — teste11-blush.vercel.app fez deploy com sucesso.

Problemas restantes:
1. `</h>` truncado (fix adicionado ao pre-processador)
2. Sub-componentes `<Feature1 />` referenciados mas não definidos (fix adicionado)
3. Tela preta — CSS reset no scaffold corrige o fundo, mas LLM pode gerar cores escuras

---

## ARQUITECTURA ACTUAL DO PIPELINE GROQ

```
Prompt → generateWithGroq (marcadores ===APP_START/END===, temp=0)
→ extracção por marcadores
→ preProcessCode (12 fixes determinísticos)
→ parseGeneratedFiles (7 formatos + fallback)
→ GitHubService.pushAllFiles (normalização paths + scaffold protegido)
→ Vercel deploy
```

**SEM validação Groq quando Groq é o gerador** (evita regressão).

---

## PROBLEMAS QUE AINDA PODEM APARECER

O LLM trunca código quando o output é longo. Sintomas:
- Tags `</h>` em vez de `</h1>`
- Texto cortado a meio: "Gestor de Tare" em vez de "Gestor de Tarefas"
- Componentes referenciados mas não definidos

**Causa:** max_tokens=12000 pode não chegar para apps complexas.
**Fix potencial:** reduzir complexidade do prompt OU aumentar max_tokens (limite Groq: 32768 para llama-3.3-70b).

---

## FICHEIROS CHAVE

| Ficheiro | Mudanças desta sessão |
|---------|----------------------|
| `packages/aios-compiler/src/features/code-generator/GeminiService.ts` | GROQ_MARKER_SYSTEM, preProcessCode (12 fixes), marcadores |
| `packages/aios-compiler/src/features/code-generator/CodeParser.ts` | Format G fallback |
| `packages/aios-compiler/src/features/github-pusher/GitHubService.ts` | normalização paths, fallback App.tsx, CSS reset |
| `packages/aios-compiler/src/App.tsx` | Groq não valida próprio output |

---

## PRÓXIMO PASSO IMEDIATO

Testar com prompt simples para confirmar que o pipeline está estável.
Se aparecerem erros de truncação: aumentar max_tokens para 32000.

*Gerado por Gage (devops) — 2026-03-07*
