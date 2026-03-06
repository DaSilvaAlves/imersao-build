---
name: compiler-from-briefing
description: Converte um BriefingOutput JSON do Briefing Generator em código React 19 limpo e funcional. Use quando o AIOS Compiler recebe um briefing e precisa de transformá-lo em estrutura de ficheiros e componentes prontos a deploy.
triggers:
  - "gerar de briefing"
  - "briefing para código"
  - "converter briefing"
  - "compiler briefing"
  - "gerar app do briefing"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  context: imersao-ia-portugal
---

# Compiler From Briefing

Skill que transforma BriefingOutput em código React 19 estruturado e deployable.

## Input Esperado

```typescript
interface BriefingOutput {
  project_name: string;
  problem_statement: string;
  target_audience: string;
  core_features: string[];      // 3-5 features MVP
  tech_stack: {
    frontend: string;
    styling: string;
    backend?: string;
  };
  pain_points: string[];
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  design_preference?: string;
}
```

## Processo de Conversão

### Passo 1 — Analisar o briefing

Extrair do briefing:
- **Entidade principal:** O que o utilizador vai criar/gerir? (tarefas, produtos, clientes, posts...)
- **Acções principais:** O que o utilizador vai fazer? (criar, editar, apagar, filtrar, pesquisar...)
- **Fluxo principal:** Qual é a sequência de ecrãs que o utilizador vai percorrer?

### Passo 2 — Mapear para arquitectura

```
Exemplo: Briefing = "App de gestão de tarefas para freelancers"

Entidade: Task (id, title, description, status, dueDate, clientName)
Acções: create, update, delete, filter by status, mark complete
Fluxo: Dashboard → Lista de tarefas → Criar/Editar tarefa

Resulta em:
src/features/tasks/
  ├── TaskList.tsx       (lista com filtros)
  ├── TaskForm.tsx       (criar/editar)
  ├── TaskCard.tsx       (item da lista)
  └── useTasks.ts        (hook com CRUD + localStorage)

src/features/dashboard/
  ├── Dashboard.tsx      (overview + stats)
  └── DashboardStats.tsx (KPI cards)
```

### Passo 3 — Gerar tipos TypeScript

```typescript
// Sempre começar pelos tipos
interface {EntityName} {
  id: string;                    // crypto.randomUUID()
  createdAt: string;             // ISO string
  updatedAt: string;             // ISO string
  // ... campos do briefing
}

type {EntityName}Status = 'active' | 'completed' | 'archived';
// (ou o que fizer sentido para o domínio)
```

### Passo 4 — Gerar hook de feature

```typescript
// Hook com CRUD completo e persistência localStorage
export function use{Entity}() {
  const [items, setItems] = useLocalStorage<{Entity}[]>(
    '{entity}-items',
    []
  );

  const create = useCallback((data: CreateInput) => { ... });
  const update = useCallback((id, updates) => { ... });
  const remove = useCallback((id) => { ... });
  const getById = useCallback((id) => items.find(i => i.id === id), [items]);

  // Computed values úteis
  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter(i => i.status === 'active').length,
    completed: items.filter(i => i.status === 'completed').length,
  }), [items]);

  return { items, create, update, remove, getById, stats };
}
```

### Passo 5 — Gerar componentes de UI

Para cada feature, gerar no mínimo:
1. **Lista** — com pesquisa e filtros
2. **Formulário** — criar e editar (mesmo componente, modo controlado por prop)
3. **Estado vazio** — quando não há items (com CTA para criar o primeiro)
4. **Estado de loading** — para operações async (mesmo que sejam locais)

### Passo 6 — Gerar App.tsx com navegação

```typescript
// Navegação simples sem react-router — estado local
type View = 'dashboard' | 'list' | 'create' | 'edit';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="app">
      <Header onNavigate={setCurrentView} />
      <main>
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
        {currentView === 'list' && <ItemList onEdit={(id) => { setEditingId(id); setCurrentView('edit'); }} />}
        {currentView === 'create' && <ItemForm onSuccess={() => setCurrentView('list')} />}
        {currentView === 'edit' && <ItemForm id={editingId} onSuccess={() => setCurrentView('list')} />}
      </main>
    </div>
  );
}
```

## Regras de Geração

```
1. NUNCA gerar: main.tsx, package.json, vite.config.ts, index.html, vercel.json
2. SEMPRE gerar: src/styles/theme.css com CSS variables
3. SEMPRE usar: crypto.randomUUID() para IDs
4. SEMPRE usar: ISO string para datas (new Date().toISOString())
5. SEMPRE ter: estados de loading, erro, e vazio em componentes async
6. NUNCA importar: packages não listados em package.json do scaffold
7. SEMPRE usar: Lucide React para ícones (verificar que ícone existe)
8. SEMPRE escrever: UI em PT-PT, código em inglês
```

## Templates de Mensagens PT-PT

```typescript
// Sucesso
"[Entidade] criada com sucesso"
"Alterações guardadas"
"[Entidade] eliminada"

// Erro
"Não foi possível guardar. Tenta novamente."
"Preenche todos os campos obrigatórios"
"Ocorreu um erro inesperado"

// Estado vazio
"Ainda não tens [entidades]. Cria a tua primeira [entidade]."
"Nenhum resultado para a tua pesquisa."

// Loading
"A carregar..."
"A guardar..."
"A processar..."

// Confirmação
"Tens a certeza que queres eliminar esta [entidade]? Esta ação não pode ser revertida."
```

Quando este skill está activo, seguir este processo de conversão para transformar qualquer briefing em código React estruturado e deployable.
