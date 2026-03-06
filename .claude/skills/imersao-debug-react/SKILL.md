---
name: imersao-debug-react
description: Diagnóstico e correção de erros React/TypeScript em projetos gerados pelo AIOS Compiler durante a Imersão IA Portugal. Use quando um aluno tem erros no código gerado, quando o build falha, ou quando a app não funciona como esperado.
triggers:
  - "erro react"
  - "bug aluno"
  - "código não funciona"
  - "erro typescript"
  - "debug react"
  - "build falhou"
  - "cannot find module"
  - "unexpected token"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  context: imersao-ia-portugal
---

# Imersão Debug React

Skill especializado em diagnosticar e corrigir erros nos projetos React 19 gerados pelo AIOS Compiler durante a Imersão IA Portugal.

## Contexto do Stack

Os projetos gerados usam sempre:
- React 19 + TypeScript (strict mode)
- Vite (build ignora erros TypeScript)
- CSS puro com CSS Custom Properties
- Lucide React para ícones
- Sem outras dependências externas

## Erros Mais Comuns e Fixes

### ERRO 1 — Sintaxe inválida no main.tsx
```
Error: Expected "from" but found "'react-dom/client'"
```
**Causa:** O LLM gerou um main.tsx corrompido que sobrepôs o scaffold.
**Fix:** Verificar se `PROTECTED_FILES` no GitHubService.ts inclui `'src/main.tsx'`. Restaurar o main.tsx do scaffold:
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### ERRO 2 — Cannot find module
```
Error: Cannot find module 'framer-motion'
Error: Cannot find module '@tanstack/react-query'
```
**Causa:** O LLM importou uma dependência que não está no package.json.
**Fix:** O `package.json` do scaffold não tem essas dependências. Duas opções:
- **Opção A:** Remover o import do componente e substituir por alternativa em CSS puro
- **Opção B:** Adicionar ao package.json (mas pode quebrar o Vercel build)

### ERRO 3 — Lucide React import errado
```
Error: 'SomeIcon' is not exported from 'lucide-react'
```
**Causa:** O LLM inventou um nome de ícone que não existe no Lucide.
**Fix:** Substituir pelo ícone mais próximo. Ícones seguros:
```
Home, User, Settings, Search, Plus, Minus, X, Check, ChevronRight,
ChevronDown, ChevronLeft, ChevronUp, ArrowRight, ArrowLeft,
Menu, Bell, Heart, Star, Trash2, Edit, Eye, EyeOff, Lock, Unlock,
Mail, Phone, MapPin, Calendar, Clock, Download, Upload, Share2,
BarChart2, PieChart, TrendingUp, TrendingDown, AlertCircle,
CheckCircle, Info, ShoppingCart, Package, Tag, Zap
```

### ERRO 4 — CSS Custom Properties não aplicadas
```
Sintoma: A app aparece sem as cores/fontes correctas
```
**Causa:** O LLM gerou variáveis CSS com nomes diferentes dos esperados.
**Fix:** Verificar `src/styles/theme.css` e garantir que variáveis seguem este padrão:
```css
:root {
  --color-primary: #2563EB;
  --color-secondary: #10B981;
  --font-family: 'Inter', sans-serif;
  --border-radius: 8px;
  --spacing-unit: 8px;
}
```

### ERRO 5 — Vercel build falha mas localhost funciona
```
Error: Build exited with code 1
```
**Causa mais comum:** `tsc -b` no build script. O Vite no Vercel não tolera erros TypeScript.
**Fix:** Em `package.json`:
```json
"scripts": {
  "build": "vite build"  // NÃO "tsc -b && vite build"
}
```

### ERRO 6 — Rotas funcionam no Compiler mas não no Vercel (404)
```
Sintoma: Página inicial funciona, rotas internas dão 404
```
**Causa:** Vercel não sabe que é uma SPA.
**Fix:** Confirmar `vercel.json` no root do repo:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### ERRO 7 — React useState não actualiza a UI
```
Sintoma: Estado muda mas componente não re-renderiza
```
**Causa:** Mutação directa do estado em vez de criar novo objecto.
**Fix:**
```typescript
// ERRADO
state.items.push(newItem)
setState(state)

// CORRECTO
setState(prev => ({
  ...prev,
  items: [...prev.items, newItem]
}))
```

### ERRO 8 — localStorage undefined no servidor
```
Error: localStorage is not defined
```
**Causa:** Código acede a localStorage fora de um hook/effect.
**Fix:**
```typescript
// CORRECTO — só aceder no cliente
const [data, setData] = useState(() => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem('key');
  return stored ? JSON.parse(stored) : defaultValue;
});
```

## Protocolo de Debug

Quando um aluno reporta um erro:

1. **Ler o erro completo** — não o resumo, o erro exacto com stack trace
2. **Identificar a categoria** — sintaxe, import, runtime, build, deploy
3. **Verificar ficheiros protegidos** — main.tsx, package.json, vite.config.ts intactos?
4. **Fix mínimo** — a menor alteração possível que resolve o problema
5. **Testar localmente** — confirmar que `npm run dev` funciona antes do push
6. **Verificar build** — `npm run build` deve completar sem erros

## Ferramentas de Debug no Browser

```javascript
// Console do browser para inspeccionar estado
// Ctrl+Shift+I → Console

// Ver o que está no localStorage
Object.keys(localStorage).forEach(key =>
  console.log(key, JSON.parse(localStorage.getItem(key)))
)

// Limpar localStorage para estado limpo
localStorage.clear()
```

Quando receber um erro, identificar a categoria acima e aplicar o fix correspondente. Se o erro não estiver aqui, analisar o stack trace para identificar a causa raiz — nunca resolver o sintoma sem perceber a causa.
