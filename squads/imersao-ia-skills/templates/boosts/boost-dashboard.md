# BOOST: DASHBOARD / ANALYTICS / BACKOFFICE
# Versão: 1.0 | Tipo: Boost opcional (injectado automaticamente)
# Activado por: keywords "dashboard", "análise", "relatório", "gráfico",
#               "estatísticas", "métricas", "KPI", "backoffice", "admin",
#               "tabela", "filtro", "exportar", "monitorização"
# Combinar com: skill-universal.md

---

## [BOOST_CONTEXT]

This project is a **dashboard / analytics / backoffice application**.

Common use cases this boost covers:
- Business analytics dashboard (painel de análise)
- KPI monitoring (monitorização de indicadores)
- Data table with filtering and sorting (tabelas com filtros)
- Admin panel (painel de administração)
- Report generation (geração de relatórios)
- Real-time data display (dados em tempo real)

---

## [BOOST_ARCHITECTURE]

### Chart System (Pure CSS + SVG — no external library)

Use SVG for all charts. No Chart.js, no Recharts — keep it dependency-free.

```typescript
// Supported chart types (SVG-based)
type ChartType = 'line' | 'bar' | 'donut' | 'sparkline';

// Chart data structure
interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ChartConfig {
  type: ChartType;
  data: ChartData[];
  title: string;
  unit?: string;      // "€", "%", "un"
  trend?: number;     // % change (positive = up, negative = down)
  period?: string;    // "Esta semana", "Este mês"
}
```

### Domain Data Models

```typescript
// types/index.ts — Dashboard-specific types

interface KPICard {
  id: string;
  title: string;         // PT-PT label shown to user
  value: number | string;
  unit: string;          // "€", "%", "utilizadores", etc.
  trend: number;         // percentage change vs previous period
  trendLabel: string;    // "vs semana passada"
  icon: string;          // Lucide icon name
  color: 'green' | 'red' | 'blue' | 'yellow' | 'purple';
}

interface DataRow {
  id: string;
  [key: string]: string | number | boolean | null;
}

interface Column {
  key: string;
  label: string;         // PT-PT column header
  type: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'badge';
  sortable?: boolean;
  filterable?: boolean;
  format?: (value: unknown) => string;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'date-range' | 'search' | 'checkbox';
  options?: { value: string; label: string }[];
}

interface TableState {
  data: DataRow[];
  columns: Column[];
  filters: Record<string, unknown>;
  sortKey: string | null;
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
  searchQuery: string;
}

interface DateRange {
  start: string;   // ISO date
  end: string;     // ISO date
  label: string;   // "Últimos 7 dias", "Este mês", etc.
}

type ExportFormat = 'csv' | 'json';
```

---

## [BOOST_FILE_STRUCTURE]

Add these files to the universal structure:

```
src/features/
├── kpi-overview/
│   ├── index.tsx             → Grid de KPI cards (topo do dashboard)
│   ├── KPICard.tsx           → Card individual com valor, trend e ícone
│   └── useKPIData.ts         → Fetch/mock de dados dos KPIs
│
├── charts/
│   ├── index.tsx             → Layout de gráficos (grid 2 colunas)
│   ├── LineChart.tsx         → Gráfico de linhas SVG
│   ├── BarChart.tsx          → Gráfico de barras SVG
│   ├── DonutChart.tsx        → Gráfico donut SVG
│   ├── Sparkline.tsx         → Mini gráfico inline
│   └── useChartData.ts       → Transformação de dados para SVG
│
├── data-table/
│   ├── index.tsx             → Tabela de dados completa
│   ├── TableHeader.tsx       → Cabeçalho com sort e filtros
│   ├── TableRow.tsx          → Linha individual da tabela
│   ├── TableFilters.tsx      → Painel de filtros lateral/topo
│   ├── Pagination.tsx        → Paginação
│   ├── ExportButton.tsx      → Exportar CSV/JSON
│   └── useDataTable.ts       → Sort, filter, paginate, export logic
│
└── date-picker/
    ├── DateRangePicker.tsx   → Selecção de período temporal
    └── useDateRange.ts       → Gestão do período activo
```

---

## [BOOST_DESIGN]

### Dashboard Layout

```css
/* Dashboard-specific CSS */

/* Dashboard grid layout */
.dashboard-layout {
  display: grid;
  grid-template-rows: auto auto 1fr;
  min-height: 100vh;
  background: var(--color-bg);
}

/* Sidebar (desktop) */
.sidebar {
  width: 240px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  overflow-y: auto;
  z-index: 50;
}

@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
}

/* KPI cards grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

@media (min-width: 1024px) {
  .kpi-grid { grid-template-columns: repeat(4, 1fr); }
}

/* KPI card */
.kpi-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
  margin: var(--spacing-sm) 0;
  font-variant-numeric: tabular-nums;
}

.kpi-trend {
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kpi-trend.up   { color: var(--color-success); }
.kpi-trend.down { color: var(--color-error); }
.kpi-trend.neutral { color: var(--color-text-muted); }

/* Charts grid */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
  padding: 0 var(--spacing-lg);
}

@media (min-width: 1024px) {
  .charts-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Data table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table th {
  background: var(--color-surface);
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  font-weight: 600;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}

.data-table th:hover { color: var(--color-text); }

.data-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.data-table tr:hover td { background: var(--color-surface); }

/* Filter bar */
.filter-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  flex-wrap: wrap;
}

/* Badge variants */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.success  { background: rgba(34,197,94,0.15);  color: #22c55e; }
.badge.error    { background: rgba(239,68,68,0.15);  color: #ef4444; }
.badge.warning  { background: rgba(234,179,8,0.15);  color: #eab308; }
.badge.info     { background: rgba(99,102,241,0.15); color: #6366f1; }
```

---

## [BOOST_RULES]

### Dashboard-Specific Rules

1. **Number formatting:** Use `Intl.NumberFormat` with `pt-PT` locale — `new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' })`
2. **Date formatting:** Use `Intl.DateTimeFormat` with `pt-PT` locale — `new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short' })`
3. **SVG charts:** Normalize values to 0-100 range for rendering, preserve originals for display
4. **Table pagination:** Default page size 10, options: 10, 25, 50
5. **Export CSV:** Use BOM (`\uFEFF`) for proper UTF-8 display in Excel
6. **Skeleton loading:** Charts and KPI cards show skeleton animation while loading
7. **Empty state:** Tables show "Sem dados para o período seleccionado" (no data icon + message)
8. **Responsive table:** On mobile, use horizontal scroll with `overflow-x: auto`
9. **PT-PT dashboard labels:**
   - "Período" (Period)
   - "Filtrar" (Filter)
   - "Exportar" (Export)
   - "Ordenar por" (Sort by)
   - "Resultados por página" (Results per page)
   - "Mostrar" (Show)
   - "Esconder" (Hide)
   - "Actualizar" (Refresh)
   - "Sem dados" (No data)

---

*BOOST Dashboard v1.0 — Imersão IA Portugal*
