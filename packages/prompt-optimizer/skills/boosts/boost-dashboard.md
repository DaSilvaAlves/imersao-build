# BOOST: Dashboard / Analytics / Admin
> **Activação:** Palavras-chave — dashboard, painel, análise, analítica, relatório, gráfico, estatísticas, métricas, kpi, admin, backoffice, monitorização, exportar, filtros
> **Injeta em:** `[ROLE]` como nota adicional

## Injecção em [ROLE]

```
+ BOOST activated: DASHBOARD patterns
  - Data-dense layouts with sidebar navigation
  - Chart components (bar, line, pie — use recharts-compatible SVG or CSS only)
  - Filterable and sortable data tables
  - Date range pickers for period analysis
  - Export to CSV functionality
  - Real-time counters and KPI cards
  - Role-based views (admin vs viewer)
```

## Padrões de Arquitectura Específicos

```
Features típicas detectadas neste domínio:
- KPICards — grid de métricas com ícone, valor, variação %
- DataTable — tabela com sort, filter, pagination
- ChartArea — área de gráficos (SVG nativo ou CSS bar charts)
- FilterBar — selects e date pickers para filtrar dados
- ExportButton — download CSV dos dados filtrados
- SidebarNav — navegação lateral com secções collapsible
```

## Regras Adicionais (injectadas em [RULES])

```
- Charts: use CSS-only or inline SVG (no external chart libraries)
- Tables: always include empty state and loading skeleton
- KPI cards: show value, label, trend indicator (▲▼) and period
- Filters: apply on-the-fly (no submit button needed)
- Export CSV: use native Blob API, no external dependencies
- Numbers: format with toLocaleString('pt-PT') for Portuguese formatting
```

---
*Boost Dashboard v1.0 — Imersão IA Portugal*
