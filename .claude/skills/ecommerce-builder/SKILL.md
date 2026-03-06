---
name: ecommerce-builder
description: "Especialista em lojas online MVP — catálogo de produtos, carrinho localStorage, checkout sem pagamentos reais. Use para projectos de ecommerce dos alunos."
triggers:
  - "@ecommerce-builder"
  - "loja online"
  - "ecommerce"
  - "carrinho"
  - "produtos"
  - "marketplace"
  - "checkout"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  squad: project-type-specialists
---

# Ecommerce Builder

Especialista em lojas online MVP para a Imersão IA Portugal. Experiência de compra completa sem backend — localStorage simula o pedido, integração de pagamentos é fase 2.

## Quando usar

- Loja online ou marketplace
- Catálogo de produtos com carrinho
- Qualquer app com fluxo de compra (seleccionar → carrinho → checkout)

## Arquitectura de Ficheiros

```
src/features/catalog/       # Grelha de produtos + filtros + pesquisa
src/features/product/       # Página de detalhe do produto
src/features/cart/          # Carrinho slide-in drawer + persistência localStorage
src/features/checkout/      # Fluxo 3 passos (dados → revisão → confirmação)
src/features/header/        # Header com ícone de carrinho + badge
src/data/products.ts        # 12+ produtos realistas em PT-PT com preços EUR
src/components/ui/          # Botões, inputs, cards, badges
```

## Prompt Boost para Compiler

```
ECOMMERCE CONTEXT:
This is an online store MVP. Implement complete shopping experience:

1. PRODUCT CATALOG:
   - Grid layout (3 cols desktop, 2 cols tablet, 1 col mobile)
   - Product card: image (CSS gradient placeholder), name, price, "Adicionar ao carrinho"
   - Category filter tabs
   - Search bar
   - 12+ realistic sample products with Portuguese names and prices in EUR

2. PRODUCT DETAIL PAGE:
   - Large image area, product name, price, description
   - Quantity selector
   - "Adicionar ao carrinho" CTA (prominent)
   - Related products section

3. SHOPPING CART (sidebar or page):
   - Slide-in drawer from right on desktop
   - Item list with quantity controls and remove button
   - Order summary with subtotal, shipping estimate, total
   - "Finalizar Compra" CTA

4. CHECKOUT FLOW (3 steps, no real payment):
   - Step 1: Delivery details (name, address, postal code, city)
   - Step 2: Order review
   - Step 3: Confirmation page with order number
   - Order saved to localStorage

5. CART PERSISTENCE: Cart survives page refresh (localStorage).

6. CART ICON IN HEADER: Shows item count badge. Always visible.

7. EUR PRICING: Format as "€XX,XX" (European format).

8. STOCK INDICATORS: "Em stock" / "Últimas unidades" / "Esgotado" states.
```

## Regras MVP

- Sem pagamentos reais — localStorage simula o pedido completo
- Carrinho sempre visível no header com badge de quantidade
- Checkout em 3 passos máximo: dados → revisão → confirmação
- Preços em formato EUR (€XX,XX) — nunca formato americano
- 12+ produtos de exemplo realistas em PT-PT desde o início

---
*ecommerce-builder — project-type-specialists squad*
