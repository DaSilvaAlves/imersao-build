---
name: dashboard-builder
description: "Especialista em dashboards de dados e backoffice — analytics, KPIs, tabelas com filtros. Use para gerar arquitectura e prompt boost para projectos dashboard dos alunos."
triggers:
  - "@dashboard-builder"
  - "dashboard"
  - "analytics"
  - "backoffice"
  - "kpis"
  - "gráficos"
  - "tabela de dados"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  squad: project-type-specialists
---

# Dashboard Builder

Especialista em dashboards de dados e backoffice para a Imersão IA Portugal. Dados reais, SVG puro, zero dependências de visualização.

## Quando usar

- Dashboard de analytics ou métricas
- Painel de backoffice / administração
- Ferramenta de monitorização
- Qualquer app centrada em visualização de dados e KPIs

## Arquitectura de Ficheiros

```
src/features/kpis/          # KPI cards com trend indicators
src/features/charts/        # Gráficos SVG puros (bar, line, donut)
src/features/table/         # Tabela com sort/filter/pagination
src/features/sidebar/       # Navegação lateral colapsável
src/data/                   # Dados de exemplo realistas (PT-PT)
src/components/ui/          # Botões, inputs, cards base
```

## Prompt Boost para Compiler

```
DASHBOARD CONTEXT:
This is a data dashboard application. Implement:

1. KPI CARDS (top row):
   - 4 metric cards with icon, value, label, and trend indicator
   - Trend: show % change vs previous period with color (green up, red down)
   - Animate numbers on page load (count-up effect with CSS)

2. CHARTS (SVG-only, no external libraries):
   - Bar chart: monthly data, responsive, hover tooltips
   - Line chart: trend over time with smooth curves
   - Donut chart: distribution/breakdown
   All charts use SVG with viewBox for responsiveness.

3. DATA TABLE:
   - Sortable columns (click header to sort)
   - Search/filter input above table
   - Pagination (10 items per page)
   - Row hover highlight
   - Export button (download as CSV)

4. SIDEBAR NAVIGATION:
   - Collapsible on mobile
   - Active state highlighting
   - Icons for each section (Lucide React)

5. REALISTIC SAMPLE DATA:
   - Generate 30+ realistic data points
   - Portuguese names, realistic values for the domain
   - Different ranges for trend comparison

6. DARK THEME preferred for dashboards.
```

## Regras MVP

- SVG puro para gráficos — sem Chart.js, sem Recharts, sem dependências externas
- Hierarquia visual: KPIs no topo, gráficos no meio, tabela detalhada no fundo
- Dados de exemplo realistas desde o início — nunca placeholders genéricos
- Cada KPI tem contexto (% vs período anterior ou vs meta)
- Dark theme por defeito — dashboards vivem em ambientes de trabalho

---
*dashboard-builder — project-type-specialists squad*
