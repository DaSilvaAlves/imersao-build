---
name: compiler-pt-pt-standards
description: Garante que todo o código React gerado pelo AIOS Compiler usa Português de Portugal (PT-PT) correcto na UI — nunca PT-BR, nunca inglês em texto visível ao utilizador. Inclui glossário, padrões de mensagens, e regras de revisão.
triggers:
  - "português correcto"
  - "pt-pt"
  - "texto em português"
  - "linguagem portuguesa"
  - "ui em português"
  - "traduzir para português"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  context: imersao-ia-portugal
---

# PT-PT Standards — AIOS Compiler

Padrões obrigatórios de linguagem portuguesa para código gerado na Imersão IA Portugal.

## Regra Fundamental

```
CÓDIGO (variáveis, funções, tipos): sempre em INGLÊS
UI (botões, labels, mensagens, placeholders): sempre em PT-PT
NUNCA PT-BR — os alunos são portugueses
```

## Glossário PT-PT vs PT-BR vs Inglês

| PT-PT (correcto) | PT-BR (errado) | Inglês |
|-----------------|----------------|--------|
| Guardar | Salvar | Save |
| Eliminar | Excluir | Delete |
| Editar | Editar | Edit |
| Criar | Criar | Create |
| Cancelar | Cancelar | Cancel |
| Confirmar | Confirmar | Confirm |
| Carregar | Carregar/Carregando | Loading |
| A carregar... | Carregando... | Loading... |
| Pesquisar | Pesquisar/Buscar | Search |
| Filtrar | Filtrar | Filter |
| Ordenar | Ordenar | Sort |
| Submeter | Enviar | Submit |
| Início | Início/Home | Home |
| Definições | Configurações | Settings |
| Perfil | Perfil | Profile |
| Conta | Conta | Account |
| Palavra-passe | Senha | Password |
| Correio electrónico | E-mail | Email |
| Telefone | Telefone/Celular | Phone |
| Morada | Endereço | Address |
| Código postal | CEP | Postal code |
| Adicionar | Adicionar | Add |
| Remover | Remover | Remove |
| Fechar | Fechar | Close |
| Abrir | Abrir | Open |
| Ver | Ver/Visualizar | View |
| Detalhes | Detalhes | Details |
| Anterior | Anterior | Previous |
| Seguinte | Próximo | Next |
| Voltar | Voltar | Back |
| Continuar | Continuar | Continue |
| Terminar sessão | Sair | Logout |
| Iniciar sessão | Entrar/Login | Login |
| Registar | Cadastrar | Register |
| Bem-vindo | Bem-vindo | Welcome |
| Obrigado | Obrigado | Thank you |
| Erro | Erro | Error |
| Sucesso | Sucesso | Success |
| Aviso | Aviso | Warning |

## Padrões de Mensagens por Categoria

### Botões de Acção
```
Criar: "Criar [Entidade]", "Nova [Entidade]", "Adicionar"
Editar: "Editar", "Editar [Entidade]"
Guardar: "Guardar", "Guardar Alterações"
Eliminar: "Eliminar", "Eliminar [Entidade]"
Cancelar: "Cancelar"
Confirmar: "Confirmar", "Sim, eliminar"
Submeter formulário: "Guardar", "Criar [Entidade]"
```

### Estados de Loading
```
Genérico: "A carregar..."
Guardar: "A guardar..."
Eliminar: "A eliminar..."
Enviar: "A enviar..."
Processar: "A processar..."
Publicar: "A publicar..."
Sincronizar: "A sincronizar..."
```

### Mensagens de Sucesso
```
Criação: "[Entidade] criada com sucesso."
Edição: "Alterações guardadas com sucesso."
Eliminação: "[Entidade] eliminada com sucesso."
Envio: "Enviado com sucesso."
Publicação: "Publicado com sucesso."
```

### Mensagens de Erro
```
Genérico: "Ocorreu um erro. Tenta novamente."
Rede: "Sem ligação à internet. Verifica a tua ligação."
Validação: "Preenche todos os campos obrigatórios."
Não encontrado: "[Entidade] não encontrada."
Sem permissão: "Não tens permissão para realizar esta acção."
Sessão expirada: "A tua sessão expirou. Inicia sessão novamente."
```

### Estados Vazios
```
Lista vazia: "Ainda não tens [entidades]."
Lista vazia + CTA: "Ainda não tens [entidades]. Cria a tua primeira [entidade]."
Pesquisa sem resultados: "Nenhum resultado para '[termo]'."
Pesquisa sem resultados + CTA: "Nenhum resultado para '[termo]'. Tenta com outro termo."
```

### Confirmações de Eliminação
```
"Tens a certeza que queres eliminar esta [entidade]?"
"Esta acção não pode ser revertida."
Botões: [Cancelar] [Sim, eliminar]
```

### Placeholders de Input
```
Nome: "O teu nome"
Email: "email@exemplo.pt"
Palavra-passe: "A tua palavra-passe"
Pesquisa: "Pesquisar..."
Descrição: "Adiciona uma descrição..."
Título: "Título"
```

### Navegação
```
"Início"
"[Nome da secção]" (não "Dashboard" — usar nome descritivo em PT)
"Definições"
"Perfil"
"Terminar sessão"
```

## Datas e Números (Formato Português)

```typescript
// Datas
new Date().toLocaleDateString('pt-PT')
// Output: "06/03/2026"

new Date().toLocaleDateString('pt-PT', {
  day: 'numeric', month: 'long', year: 'numeric'
})
// Output: "6 de março de 2026"

// Moeda
new Intl.NumberFormat('pt-PT', {
  style: 'currency', currency: 'EUR'
}).format(1234.56)
// Output: "1 234,56 €"

// Números
new Intl.NumberFormat('pt-PT').format(1234567)
// Output: "1 234 567"
```

## Checklist de Revisão PT-PT

Antes de finalizar qualquer componente, verificar:

```
[ ] Todos os botões estão em PT-PT
[ ] Todos os labels de input estão em PT-PT
[ ] Todos os placeholders estão em PT-PT
[ ] Mensagens de sucesso em PT-PT
[ ] Mensagens de erro em PT-PT (específicas, não genéricas)
[ ] Estados vazios em PT-PT
[ ] Confirmações de eliminação em PT-PT
[ ] Nenhuma palavra em inglês visível ao utilizador
[ ] Nenhuma palavra em PT-BR (salvar→guardar, senha→palavra-passe)
[ ] Datas no formato dd/mm/aaaa
[ ] Valores monetários com símbolo € e vírgula decimal
```

## Exemplos de Componentes Correctos

```tsx
// CORRECTO
<button onClick={handleSave}>Guardar</button>
<input placeholder="Pesquisar..." />
<p>A carregar...</p>
<span>Ainda não tens tarefas. Cria a tua primeira tarefa.</span>
<p>Tens a certeza que queres eliminar esta tarefa?</p>

// ERRADO (PT-BR ou inglês)
<button onClick={handleSave}>Salvar</button>      // PT-BR
<input placeholder="Search..." />                 // inglês
<p>Loading...</p>                                 // inglês
<span>Nenhuma tarefa cadastrada.</span>            // PT-BR (cadastrada)
<p>Você tem certeza?</p>                          // PT-BR (você)
```

Quando este skill está activo, aplicar todos estes padrões automaticamente ao gerar ou rever código. Se encontrar texto em inglês ou PT-BR na UI, substituir imediatamente pelo equivalente PT-PT correcto.
