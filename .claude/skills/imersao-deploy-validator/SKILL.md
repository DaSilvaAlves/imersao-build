---
name: imersao-deploy-validator
description: Checklist de validação pré-deploy para projetos da Imersão IA Portugal. Use antes de qualquer push para GitHub ou deploy no Vercel para garantir que o projeto vai compilar com sucesso.
triggers:
  - "verificar deploy"
  - "check antes de publicar"
  - "pronto para deploy"
  - "validar projeto"
  - "vai funcionar no vercel"
  - "deploy validator"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  context: imersao-ia-portugal
---

# Deploy Validator — Imersão IA Portugal

Checklist completa de validação antes de fazer push para GitHub e deploy no Vercel.

## Checklist Pré-Deploy (executar em ordem)

### 1. Ficheiros Obrigatórios (scaffold)

Verificar que estes ficheiros existem e têm o conteúdo correcto do scaffold:

```
[ ] src/main.tsx          — Entry point React (não versão do LLM)
[ ] package.json          — Com build script "vite build" (sem "tsc -b")
[ ] vite.config.ts        — Config Vite padrão
[ ] vercel.json           — Com SPA rewrite rule
[ ] index.html            — HTML template correcto
[ ] tsconfig.json         — TypeScript config
```

### 2. Verificação do package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",    ← NÃO "tsc -b && vite build"
    "preview": "vite preview"
  }
}
```

### 3. Verificação do vercel.json

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 4. Verificação do main.tsx

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

### 5. Dependências (package.json)

Verificar que o LLM não adicionou dependências inexistentes:

```
PERMITIDAS (sempre no scaffold):
✓ react, react-dom
✓ typescript, @types/react, @types/react-dom
✓ vite, @vitejs/plugin-react
✓ lucide-react

PROIBIDAS (LLM inventa — vão quebrar o build):
✗ framer-motion (a menos que instalado manualmente)
✗ @tanstack/react-query
✗ react-router-dom (a menos que no scaffold)
✗ chart.js, recharts, d3
✗ axios (usar fetch nativo)
✗ zustand, jotai, redux
```

### 6. Imports de Ícones Lucide

```bash
# Verificar que todos os ícones importados existem no Lucide React
# Ícones inválidos causam build failure

# Forma de verificar: procurar imports de lucide-react no código
grep -r "from 'lucide-react'" src/
```

### 7. Nome do Repositório

```
[ ] Nome tem sufixo único (Date.now().toString(36))
[ ] Não existe já repositório com este nome na conta do aluno
[ ] Nome não tem espaços ou caracteres especiais (só letras, números, hífens)
```

### 8. Token GitHub

```
[ ] Token existe e está preenchido no Compiler
[ ] Token tem scope "repo" (criar e push)
[ ] Token não expirou
```

### 9. Chave Groq

```
[ ] Chave Groq está preenchida no Compiler
[ ] Chave é válida (testar em console.groq.com)
[ ] Modelo configurado: llama-3.3-70b-versatile
```

### 10. Teste Local (recomendado se há tempo)

```bash
# Na pasta do projeto gerado:
npm install
npm run build   ← deve completar sem erros
npm run preview ← verificar que app funciona
```

## Resultado da Validação

**VERDE — Pode fazer deploy:**
- Todos os itens 1-9 estão OK
- (Opcional) Teste local passou

**AMARELO — Revisar antes de deploy:**
- Algum item está incerto mas não é blocker
- Fazer deploy e monitorizar o build no Vercel

**VERMELHO — NÃO fazer deploy:**
- package.json tem "tsc -b" no build script
- main.tsx foi alterado pelo LLM
- vercel.json não existe ou está errado
- Dependências inexistentes no package.json

## Tempo Estimado

- Checklist completa: ~3 minutos
- Vale sempre a pena — evita 10-15 minutos de debugging de build

Quando aplicar este skill, percorrer a checklist item por item com o mentor ou aluno, identificar qualquer problema, e fornecer o fix exacto antes de prosseguir com o deploy.
