# Squad: project-type-specialists

> Especialistas por tipo de projecto para os alunos da Imersão IA Portugal.
> Criado por Orion (aios-master) — 2026-03-06

## Missão

Garantir que cada tipo de projecto dos alunos tem um especialista dedicado que conhece os padrões correctos, as armadilhas comuns, e o prompt boost certo para gerar código de alta qualidade no AIOS Compiler.

## Especialistas

| Agente | Tipo de Projecto | Casos de Uso |
|--------|-----------------|--------------|
| `@saas-mvp-builder` | SaaS / Produtividade | Gestão de tarefas, CRM, plataformas com utilizadores |
| `@landing-builder` | Landing Page | Startup, produto, serviço, pré-lançamento |
| `@dashboard-builder` | Dashboard / Dados | Analytics, backoffice, monitorização, KPIs |
| `@portfolio-builder` | Portfólio Pessoal | Site profissional, freelancer, apresentação |
| `@ecommerce-builder` | Ecommerce | Loja online, catálogo, marketplace |

## Como usar

```bash
# Identificar tipo de projecto do aluno
# Activar especialista correspondente

@saas-mvp-builder
*saas-prompt {briefing do aluno}

@landing-builder
*landing-prompt {briefing do aluno}

@dashboard-builder
*dashboard-prompt {briefing do aluno}
```

## Árvore de Decisão

```
Qual é o projecto do aluno?
        |
        ├── Tem utilizadores com login? → @saas-mvp-builder
        |
        ├── É uma página para convencer/vender? → @landing-builder
        |
        ├── Mostra dados/métricas/análises? → @dashboard-builder
        |
        ├── É para apresentar o aluno/freelancer? → @portfolio-builder
        |
        └── Tem produtos e carrinho? → @ecommerce-builder
```

## Boost de Prompt

Cada especialista tem um "Prompt Boost" — texto adicional que é injectado no system prompt do AIOS Compiler para gerar código especializado para aquele tipo de projecto.

O mentor ou o `@prompt-optimizer-pro` deve usar o boost do especialista relevante antes de enviar para o Compiler.
