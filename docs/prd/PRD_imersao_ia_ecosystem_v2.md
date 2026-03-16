# PRD: ECOSSISTEMA IMERSÃO IA — v2.0

> **Versão:** 2.0 | **Data:** 16/03/2026
> **Autor:** Eurico Alves (Mentor)
> **Estado:** ACTIVO — Substitui v1.0 após decisão arquitectural da Sessão 4
> **v1.0:** `PRD_imersao_ia_ecosystem.md` (mantido como registo histórico, inclui BUG-001/BUG-002)

---

## DECISÃO ARQUITECTURAL — PORQUÊ A v2.0

O AIOS Compiler foi testado durante 19 dias como gerador principal. Conclusão: o modelo Llama 3.3 70B não produz qualidade visual aceitável para um workshop de fim de semana. O Lovable com o mesmo prompt entrega CRM completo com UI de nível profissional.

**Decisão (Sessão 4 — 15/03/2026):**
- Lovable e Gemini AI Studio são os geradores principais
- AIOS Compiler mantém-se como segundo plano — não é prioridade
- Antigravity entra no pipeline como ferramenta de refinamento pós-GitHub

---

## 1. VISÃO E PROBLEMA

### 1.1 Problema

Três barreiras impedem qualquer pessoa de criar soluções digitais com IA:
1. **Não sabe por onde começar** — tem uma "dor" mas não consegue transformá-la em requisitos técnicos
2. **Não domina ferramentas de código** — sem acesso nem competências para terminais ou IDEs
3. **Falta de orientação estruturada** — cursos tradicionais ensinam teoria sem resultado prático

### 1.2 Visão
> *"Ideia no papel à solução pronta num fim de semana."*

Um ecossistema web sem atrito onde qualquer pessoa, sem conhecimento técnico, transforma a sua ideia num produto digital funcional e publicado — tudo via browser, com custo zero.

### 1.3 Proposta de Valor

| Para quem | Valor |
|-----------|-------|
| Aluno | Do zero ao produto em 2 dias, sem saber programar |
| Mentor | Sistema replicável e escalável de Imersão a Imersão |
| Comunidade IA-PT | Base de ferramentas que cresce com os membros |

---

## 2. PÚBLICO-ALVO

### Persona Primária — "O Empreendedor Prático"
- 25-55 anos, Portugal
- Tem ideia ou negócio mas não sabe programar
- Quer resultado concreto, não teoria
- Confortável com browser, desconfortável com terminal
- Orçamento limitado — não pode pagar ferramentas caras

### Persona Secundária — "O Curioso Tech" (2ª Imersão)
- Nível técnico intermédio
- Quer usar IA como ferramenta profissional
- Aberto a terminal e IDE
- Usa Gemini CLI e Antigravity para iteração directa no código
- Materiais específicos já criados na comunidade IA-PT para este perfil

---

## 3. PIPELINE COMPLETO

```
[1] Student Profiler (localhost:5191 | Vercel produção)
        ↓ ProfileData JSON
[2] Briefing Generator (localhost:5190)
        ↓ BriefingOutput JSON
[3] Starter Builder (localhost:5192)  ←── opcional
        ↓ DesignTokens JSON
[4] Prompt Optimizer (localhost:5193)
        ↓ OptimizedPrompt
   ┌────┼────┐
   ↓   ↓    ↓
Lovable  Gemini AI  [Copiar]
.dev     Studio     (manual)
   ↓       ↓
   └───┬───┘
       ↓
   GitHub (repo do aluno)
       ↓
[5] Antigravity (IDE — fix de bugs / refinamento)
       ↓
   Vercel Deploy
       ↓
   Projecto online
```

**Ponto de bifurcação:** O Optimizer gera o prompt e oferece 3 saídas:
- **"Abrir no Lovable"** — copia o prompt e abre lovable.dev (fluxo principal)
- **"Abrir no Gemini AI"** — copia e abre aistudio.google.com (alternativa)
- **"Copiar prompt"** — para uso manual ou ferramentas adicionais
- **"Enviar para o Compiler"** — fallback técnico (AIOS Compiler local)

### Fluxo de dados

| De → Para | Dados | Formato |
|-----------|-------|---------|
| Profiler → Briefing | `ProfileData` | JSON via URL param |
| Briefing → Optimizer | `BriefingOutput` | JSON via URL param `?briefing=` |
| Starter Builder → Optimizer | `DesignTokens` | JSON via URL param `?tokens=` |
| Optimizer → Gerador | `OptimizedPrompt` | String (cópia ou deeplink) |
| Gerador → GitHub | Código completo | Push directo (Lovable) ou manual |
| GitHub → Antigravity | Repositório | Clone local para refinamento |
| GitHub → Vercel | URL do repo | Vercel Import |

---

## 4. ESPECIFICAÇÃO POR FERRAMENTA

---

### 4.1 Student Profiler

**Estado:** Produção (Vercel)
**Porta local:** 5191

Diagnóstico do aluno em 10 dimensões. Gera `ProfileData` JSON que alimenta o Briefing Generator.

**Melhorias pendentes**

| # | Feature | Prioridade |
|---|---------|------------|
| SP-1 | Exportar `ProfileData` para Briefing Generator | Alta |
| SP-2 | URL partilhável com profile ID (Supabase) | Alta |
| SP-3 | Simplificar para ≤ 5 minutos | Média |

---

### 4.2 Briefing Generator

**Estado:** Protótipo funcional
**Porta local:** 5190

O aluno descreve a sua "dor" e o sistema gera um PRD profissional com stack sugerida e requisitos funcionais.

**Melhorias pendentes**

| # | Feature | Prioridade |
|---|---------|------------|
| BG-1 | Receber `ProfileData` do Profiler | Alta |
| BG-2 | Output em JSON estruturado (`BriefingOutput`) | Alta |
| BG-3 | Persistência em Supabase | Média |

**Contrato BriefingOutput**

```typescript
interface BriefingOutput {
  projectName: string;
  painPoints: string;
  features: string[];
  targetAudience: string;
  experienceLevel: 'iniciante' | 'intermediário' | 'avançado';
  suggestedStack: {
    architecture: string;
    frontend: string;
    backend: string;
    database: string;
  };
  uiVibe: string;
  prdText: string;
  timestamp: string;
}
```

---

### 4.3 Starter Builder

**Estado:** Funcional — papel a confirmar
**Porta local:** 5192

Configurador visual de Design System. Gera `DesignTokens` JSON para o Optimizer.

**Nota:** Com o Lovable a ser o gerador principal (e a ter o seu próprio sistema de design), o papel do Starter Builder precisa de ser reavaliado. Pode passar a opcional ou ser reformulado.

**Estado das melhorias:** A aguardar decisão sobre o papel no pipeline.

---

### 4.4 Prompt Optimizer

**Estado:** Funcional
**Porta local:** 5193

Combina `BriefingOutput` + `DesignTokens`, aplica SKILLs e gera o prompt otimizado. É o ponto central do pipeline — onde o aluno vê o resultado antes de gerar código.

**Features actuais**

| # | Feature | Estado |
|---|---------|--------|
| PO-1 | Receber `BriefingOutput` JSON | Funcional |
| PO-2 | Receber `DesignTokens` JSON | Funcional |
| PO-3 | SKILL Universal + boosts automáticos | Funcional |
| PO-4 | Preview do prompt com syntax highlighting | Funcional |
| PO-5 | Botão "Copiar prompt" | Funcional |
| PO-6 | Botão "Abrir no Lovable" | Funcional |
| PO-7 | Botão "Abrir no Gemini AI" | Funcional |
| PO-8 | Botão "Enviar para o Compiler" (fallback) | Funcional |

**SKILLs disponíveis**

```
skills/
├── skill-universal.md       → BASE para qualquer projecto
└── boosts/ (auto-detectados)
    ├── boost-restaurant.md  → PWA, menu digital, mobile-first
    ├── boost-ecommerce.md   → carrinho, pagamento, stock
    ├── boost-dashboard.md   → gráficos, tabelas, filtros
    └── boost-portfolio.md   → galeria, animações, SEO
```

---

### 4.5 Lovable — Gerador Principal

**Tipo:** Plataforma externa
**URL:** lovable.dev
**Free tier:** 5 projectos por mês por conta

Gerador primário de código. O aluno cola o `OptimizedPrompt`, o Lovable gera a aplicação completa e faz push directo para GitHub.

**Fluxo do aluno**

1. No Optimizer: clicar "Abrir no Lovable"
2. Lovable abre com o prompt pronto
3. Lovable gera o projecto
4. "Connect to GitHub" no Lovable → repo criado automaticamente
5. URL do repo disponível para Antigravity ou Vercel

**Vantagens**

| Característica | Detalhe |
|----------------|---------|
| Qualidade visual | Nível profissional — muito superior ao Compiler com Llama 3.3 70B |
| Push GitHub | Automático, sem configuração manual |
| Iteração | Pedidos de ajuste em linguagem natural dentro do Lovable |
| Zero setup | Funciona directamente no browser |

---

### 4.6 Gemini AI Studio — Gerador Alternativo

**Tipo:** Plataforma externa
**URL:** aistudio.google.com
**Custo:** Gratuito (modelo Gemini 2.0 Flash)

Alternativa ao Lovable para alunos sem conta ou que esgotaram o free tier.

| Característica | Detalhe |
|----------------|---------|
| Push GitHub | Manual — o aluno copia o código e faz upload |
| Adequado para | Alunos com ligeiro mais conforto técnico |
| Alternativa técnica | Gemini CLI (ver 4.8) para perfil avançado |

---

### 4.7 Antigravity — Refinamento e Fix de Bugs

**Tipo:** IDE proprietário (Synkra)
**Localização:** `C:\Users\XPS\.antigravity\`

Antigravity é um IDE (fork do VS Code) desenvolvido pela Synkra com Claude Code e todos os agentes AIOX pré-instalados e pré-configurados. Não requer setup — está pronto a usar.

**O que tem instalado**

| Componente | Detalhe |
|------------|---------|
| Claude Code | `anthropic.claude-code-2.1.63` — nativo |
| Agentes AIOX | dev, qa, architect, pm, po, sm, analyst, devops — todos pré-configurados |
| Docker support | `vscode-docker`, `vscode-containers` |
| Regras AIOX | `.antigravity/rules.md` — carregadas automaticamente |

**Papel no pipeline**

Entra depois do GitHub, antes do Vercel. O aluno (ou o mentor no Ponto Socorro) abre o repo gerado pelo Lovable no Antigravity para:
- Corrigir bugs com Claude Code e agentes AIOX
- Fazer refinamentos sem regressar ao início do pipeline
- Usar `@dev`, `@qa` directamente sobre o código gerado

**Perfil de utilizador**

- Fluxo principal (Imersão básica): usado pelo **mentor** no Ponto Socorro para resolver bloqueios
- Perfil "Curioso Tech" (2ª Imersão): usado pelo **aluno** directamente

---

### 4.8 Gemini CLI — Perfil Avançado

**Tipo:** Ferramenta externa (Google)
**Perfil:** Persona Secundária ("Curioso Tech")

Para alunos com conforto técnico que preferem trabalhar em terminal. Materiais específicos já existem na comunidade IA-PT para este fluxo.

**Não faz parte do pipeline da Imersão básica.**

---

### 4.9 Vercel Deploy

**Tipo:** Plataforma externa
**Entrada:** URL do repo GitHub
**URL de import:** `https://vercel.com/import/git?s=<github-url>`

Deploy automático a partir do GitHub. SSL, CDN e URL público incluídos no free tier.

---

### 4.10 AI Velocity Dashboard — A AVALIAR

**Estado:** Papel a determinar
**Produção:** `https://ai-velocity-project.vercel.app/`
**Localização:** `ecosistema-ia-avancada-pt/ai-velocity-project/`

O AI Velocity Dashboard tinha 6 estações (Analyst, Architect, UX, Data, PM, DevOps) e um motor de deploy local (`materializer.cjs`).

**Problemas conhecidos**
- Depende de backend local — não funciona sem setup
- DevOps Station não copiava variáveis `.env` para Vercel (dados não aparecem após deploy)

**Questão em aberto:** Com o Lovable a fazer push directo para GitHub e o Antigravity a tratar do refinamento, qual é o papel do AI Velocity Dashboard no novo pipeline? Não está removido — está a aguardar decisão.

---

### 4.11 AIOS Compiler — Segundo Plano

**Estado:** Fallback técnico
**Porta local:** 5194

Mantido como alternativa para situações sem acesso ao Lovable ou Gemini AI Studio. Não é o fluxo principal da Imersão.

Após 19 dias de patches, a limitação é do modelo (Llama 3.3 70B), não do código. O conflito arquitectural entre o Prompt Optimizer e o GeminiService está documentado em detalhe no PRD v1.0 (Secção 12 — BUG-001).

**Quando usar**

| Situação | Usar Compiler? |
|----------|----------------|
| Sem conta Lovable | Sim |
| Quota Lovable esgotada | Sim |
| Sem acesso à internet | Sim |
| Fluxo normal da Imersão | Não |

---

## 5. STACK TÉCNICA

| Componente | Tecnologia |
|------------|------------|
| Ferramentas internas | React 19 + Vite + TypeScript + CSS puro |
| Gerador principal | Lovable (externo) |
| Gerador alternativo | Gemini AI Studio (externo) |
| Gerador avançado | Gemini CLI (externo — perfil técnico) |
| IDE de refinamento | Antigravity (IDE Synkra com Claude Code) |
| Gerador fallback | AIOS Compiler (interno) |
| Base de dados | Supabase (opcional, degradação graciosa) |
| Deploy | Vercel (free tier) |
| Repositório | GitHub |

### Portas reservadas

| Ferramenta | Porta |
|------------|-------|
| Briefing Generator | 5190 |
| Student Profiler | 5191 |
| Starter Builder | 5192 |
| Prompt Optimizer | 5193 |
| AIOS Compiler | 5194 |
| Community Dashboard | 5196 |

---

## 6. CONTAS QUE O ALUNO PRECISA

| Serviço | Para quê | Free Tier |
|---------|----------|-----------|
| **Lovable** | Gerar código + push GitHub | 5 projectos/mês |
| **Google** | Gemini AI Studio (alternativa) | Ilimitado |
| **GitHub** | Repositório do projecto | Repos ilimitados |
| **Vercel** | Deploy (login com GitHub) | 100 deploys/mês |
| **Supabase** | Opcional — backend do projecto | 500MB, 50K rows |

> **Setup pré-Imersão:** Guia passo-a-passo com screenshots — 15 minutos antes do workshop.

---

## 7. USER STORIES (MVP)

### US-1: Diagnóstico Rápido
> Como aluno, quero preencher um questionário de 5 min para que o sistema entenda o meu nível e objectivos.

**Critérios:** ≤10 perguntas, resultado `ProfileData` em Supabase, URL partilhável.

### US-2: Da Dor ao PRD
> Como aluno, quero descrever a minha "dor" em linguagem simples e receber um PRD técnico profissional.

**Critérios:** Formulário multi-step, detecção de tipo de projecto, output JSON + Markdown.

### US-3: Escolher o Visual
> Como aluno, quero escolher o estilo visual da minha app sem saber CSS.

**Critérios:** 5+ Design Systems com preview, output `DesignTokens` JSON.

### US-4: Prompt Perfeito
> Como aluno, quero ver o prompt optimizado e ter um clique para o abrir no Lovable ou Gemini AI.

**Critérios:** Preview do prompt, botão "Abrir no Lovable", botão "Abrir no Gemini AI", botão "Copiar".

### US-5: Projecto Gerado
> Como aluno, quero colar o prompt no Lovable e ter o meu projecto num repo GitHub sem tocar no terminal.

**Critérios:** Prompt copiado ao clicar "Abrir no Lovable", Lovable gera e faz push, aluno autentica com GitHub no Lovable.

### US-6: Refinamento com IA
> Como aluno (ou mentor), quero abrir o repo gerado no Antigravity para corrigir bugs com Claude Code sem regressar ao início.

**Critérios:** Repo clonado no Antigravity, Claude Code disponível, agentes AIOX activos.

### US-7: Deploy em Um Clique
> Como aluno, quero abrir o Vercel Import com o URL do meu repo e ter o site online.

**Critérios:** URL do GitHub → Vercel Import → URL público visível.

---

## 8. CRONOGRAMA DA IMERSÃO (FIM DE SEMANA)

### SÁBADO: DO CONCEITO À PRÁTICA

| Hora | Actividade | Ferramentas |
|------|------------|-------------|
| 10:00-11:00 | Palestra IA + Setup de contas | Nenhuma |
| 11:00-13:00 | Treino: Task Manager com pipeline completo | Profiler → Optimizer → Lovable → Vercel |
| 13:00-15:00 | Almoço | — |
| 15:00-19:00 | Projecto individual (dor real do aluno) | Pipeline completo |
| 22:00-23:30 | Ponto Socorro (mentor usa Antigravity para fix) | Google Meet + Antigravity |

### DOMINGO: REFINAMENTO E ENTREGA

| Hora | Actividade | Ferramentas |
|------|------------|-------------|
| 10:00-13:00 | Refinamento via Lovable ou Antigravity | Lovable / Antigravity |
| 13:00-15:00 | Almoço | — |
| 15:00-16:00 | Deploy final | Vercel |
| 22:00 | Ponto Socorro Final + celebração | Verificação dos sites online |

---

## 9. RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Lovable quota esgotada (5 proj/mês) | Média | Conta do mentor como backup; Gemini AI Studio como alternativa |
| Lovable não interpreta o prompt correctamente | Baixa | Prompt Optimizer já estrutura para Lovable; mentor ajusta ao vivo |
| GitHub OAuth no Lovable com problemas | Baixa | Fallback: download ZIP + upload manual |
| Aluno não consegue criar contas | Baixa | Guia passo-a-passo + sessão setup pré-Imersão |
| Bugs no código gerado pelo Lovable | Baixa-Média | Antigravity + Claude Code para fix rápido no Ponto Socorro |
| Vercel deploy falha (env vars) | Média | Ver BUG conhecido no AI Velocity Dashboard HANDOFF — guiar aluno a adicionar vars na Vercel |

---

## 10. ROADMAP

### Próxima sessão — Validação do fluxo 🔴

- [ ] Testar pipeline completo como aluno: Optimizer → Lovable → GitHub → Vercel
- [ ] Confirmar papel do Starter Builder no novo pipeline
- [ ] Clarificar papel do AI Velocity Dashboard (substituído? coexiste?)
- [ ] Explorar integração do Antigravity no Ponto Socorro (workflow para o mentor)

### Pré-Imersão 🟡

- [ ] Melhorar Briefing Generator (BG-1, BG-2)
- [ ] Criar guia de setup do aluno (contas + pré-Imersão)
- [ ] Teste end-to-end com aluno real
- [ ] Decidir e documentar papel do AI Velocity Dashboard

### Pós 1ª Imersão 🟢

- [ ] Persistência cross-tool em Supabase
- [ ] Dashboard do Mentor: ver progresso dos alunos
- [ ] Community Dashboard: projectos e membros
- [ ] Materiais Gemini CLI para 2ª Imersão (Curioso Tech)

---

## 11. MÉTRICAS DE SUCESSO (1ª Imersão)

| Métrica | Objectivo |
|---------|-----------|
| Alunos com projecto online no domingo | **100%** |
| Tempo médio pipeline (Profiler → Deploy) | **< 45 min** (treino) |
| Custo total de APIs | **$0.00** |
| NPS (satisfação do aluno) | **≥ 8/10** |
| Alunos que querem 2ª Imersão | **≥ 70%** |

---

## 12. REFERÊNCIAS E HISTÓRICO

| Documento | Localização | Conteúdo |
|-----------|-------------|----------|
| PRD v1.0 | `docs/prd/PRD_imersao_ia_ecosystem.md` | Arquitectura original + BUG-001 (conflito Optimizer/Compiler) + BUG-002 |
| HANDOFF Sessão 4 | `HANDOFF_15032026_SESSAO4.md` (raiz do ecosistema) | Decisão de abandono do Compiler como gerador principal |
| HANDOFF AI Velocity | `ai-velocity-project/HANDOFF.md` | Estado do dashboard, problema env vars, estrutura |
| PRD Compiler | `docs/prd/aios-compiler-prd.md` | Especificação técnica do AIOS Compiler |

---

*PRD v2.0 — Imersão IA Portugal*
*Arquitectura actualizada: Sessão 4 — 15/03/2026 | Antigravity adicionado: 16/03/2026*
