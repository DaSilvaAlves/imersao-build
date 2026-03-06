---
name: compiler-react19-architect
description: Padrões e melhores práticas React 19 para o AIOS Compiler. Use quando gerando código React para os projetos dos alunos — garante estrutura modular, feature-first, CSS custom properties, e sem dependências desnecessárias.
triggers:
  - "gerar código react"
  - "react 19"
  - "arquitectura react"
  - "estrutura de ficheiros"
  - "componente react"
  - "compiler react"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  context: imersao-ia-portugal
---

# React 19 Architecture — AIOS Compiler

Padrões obrigatórios para geração de código React 19 no contexto da Imersão IA Portugal.

## Stack (Invariável)

```
React 19 — Hooks, functional components, concurrent features
TypeScript — Strict mode (erros não bloqueiam o build Vite)
Vite 7 — Build tool, dev server
Pure CSS — CSS Custom Properties, sem frameworks
Lucide React — Única biblioteca de ícones permitida
localStorage — Persistência MVP (ou Supabase se especificado)
```

## Estrutura de Ficheiros (Feature-First)

```
src/
├── App.tsx                          # Router principal + layout
├── index.css                        # Reset global + imports de tema
├── features/
│   ├── {feature-a}/
│   │   ├── {FeatureA}.tsx           # Componente principal
│   │   ├── {FeatureA}Form.tsx       # Formulário (se aplicável)
│   │   ├── {FeatureA}List.tsx       # Lista (se aplicável)
│   │   └── use{FeatureA}.ts         # Hook com lógica e estado
│   └── {feature-b}/
│       └── ...
├── components/
│   └── ui/
│       ├── Button.tsx               # Botão reutilizável
│       ├── Input.tsx                # Input reutilizável
│       ├── Card.tsx                 # Card reutilizável
│       └── Modal.tsx                # Modal reutilizável
├── hooks/
│   ├── useLocalStorage.ts           # Persistência genérica
│   └── useAsync.ts                  # Async state management
└── styles/
    ├── theme.css                    # CSS variables (tokens)
    └── components.css               # Estilos de componentes base
```

## Padrões de Componente

### Componente funcional padrão
```typescript
interface {Component}Props {
  // Props tipadas
}

export function {Component}({ prop1, prop2 }: {Component}Props) {
  // Estado local
  const [state, setState] = useState<Type>(defaultValue);

  // Efeitos
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Handlers
  const handleAction = useCallback(() => {
    // Handler logic
  }, [dependencies]);

  // Render
  return (
    <div className="{component}">
      {/* JSX */}
    </div>
  );
}
```

### Hook de feature
```typescript
export function use{Feature}() {
  const [items, setItems] = useLocalStorage<{Type}[]>('{feature}-items', []);

  const create = useCallback((data: Omit<{Type}, 'id' | 'createdAt'>) => {
    const newItem: {Type} = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...data,
    };
    setItems(prev => [...prev, newItem]);
    return newItem;
  }, [setItems]);

  const update = useCallback((id: string, updates: Partial<{Type}>) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, [setItems]);

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, [setItems]);

  return { items, create, update, remove };
}
```

### Hook de localStorage
```typescript
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const resolved = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue;
      localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  }, [key]);

  return [value, setStoredValue] as const;
}
```

## CSS Custom Properties (theme.css)

```css
:root {
  /* Tokens do projeto (injectados pelo Prompt Optimizer) */
  --color-primary: #2563EB;
  --color-secondary: #10B981;
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-border: #E5E7EB;
  --color-text: #111827;
  --color-text-muted: #6B7280;
  --color-error: #EF4444;
  --color-success: #10B981;

  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;

  /* Border */
  --border-radius: 8px;
  --border-radius-sm: 4px;
  --border-radius-lg: 12px;
  --border-radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition: 200ms ease;
  --transition-slow: 300ms ease;
}
```

## Estados Obrigatórios em Todos os Componentes Async

```typescript
// Todo componente com operação async DEVE ter estes 3 estados:
const [data, setData] = useState<Type | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// E renderizá-los:
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} onRetry={retry} />;
if (!data) return <EmptyState />;
return <DataView data={data} />;
```

## Regras de Naming (PT-PT na UI, inglês no código)

```typescript
// CORRECTO: variáveis e funções em inglês
const handleSubmit = () => {};
const userProfile = {};
const isLoading = false;

// CORRECTO: UI em PT-PT
<button>Guardar</button>
<p>Carregando...</p>
<span>Erro ao guardar. Tenta novamente.</span>

// ERRADO: misturar idiomas
const handleGuardar = () => {};     // Variável em PT
<button>Save</button>               // UI em inglês
```

## NUNCA Gerar

```
src/main.tsx       — Ficheiro protegido do scaffold
package.json       — Ficheiro protegido do scaffold
vite.config.ts     — Ficheiro protegido do scaffold
tsconfig.json      — Ficheiro protegido do scaffold
index.html         — Ficheiro protegido do scaffold
vercel.json        — Ficheiro protegido do scaffold
```

Quando este skill está activo, aplicar estes padrões a todo o código React gerado.
