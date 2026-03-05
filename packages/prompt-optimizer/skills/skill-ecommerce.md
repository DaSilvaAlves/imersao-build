# SKILL: E-Commerce
> **Versão:** 1.0 | **Tipo:** Skill Opcional (Toggle Manual)
> **Activação:** Manual via toggle na UI do Prompt Optimizer
> **Aplica-se a:** Lojas online, marketplaces, catálogos com venda

---

## Descrição

Skill especializada para aplicações de comércio eletrónico. Injeta padrões de catálogo, carrinho, checkout e gestão de stock. Inclui suporte para integração com Supabase como backend de produtos.

---

## Injecções no Prompt

### Adicionado a [ROLE]
```
+ SKILL ACTIVE: E-Commerce
  - Product catalog with filtering, sorting, and search
  - Shopping cart with quantity management and persistence
  - Checkout flow with form validation
  - Stock management and availability indicators
  - Order history and status tracking
```

### Adicionado a [ARCHITECTURE]
```
E-Commerce patterns:
  - Cart state: React Context + LocalStorage persistence
  - Product data: Supabase table or static JSON (MVP)
  - Checkout: multi-step form (cart → details → confirm)
  - Stripe-ready structure (payment integration ready but not implemented in MVP)
```

### Adicionado a [FEATURES] (se não especificados pelo aluno)
```
Suggested features for e-commerce projects:
  - ProductCatalog: grid/list view, filter by category, sort by price/name
  - ProductDetail: image, description, price, stock badge, "Add to Cart"
  - ShoppingCart: sidebar/drawer with items, quantities, total
  - CheckoutForm: name, address, email — validation with Portuguese examples
  - OrderConfirmation: summary, order number, "Continuar a comprar"
  - StockBadge: "Em stock", "Últimas unidades", "Esgotado"
```

### Adicionado a [RULES]
```
E-commerce-specific rules:
  - All prices in EUR format (€ X.XX) with VAT note when relevant
  - Stock indicators: green (>5), orange (1-5), red (0)
  - Cart badge: always visible in header with item count
  - Empty cart: friendly message with CTA to catalog
  - Product images: 1:1 or 4:3 ratio with placeholder
  - Checkout: never lose cart data on navigation
  - Order IDs: use format #ORD-YYYY-NNNN
```

---

## Paleta de Cores Recomendada

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-shop-bg` | `#0d0d0d` | Background dark |
| `--color-shop-accent` | `#00ff87` | CTAs e preços |
| `--color-shop-warning` | `#ffba08` | Stock baixo |
| `--color-shop-danger` | `#d62828` | Esgotado |

---

## Ficheiros Extra a Gerar

```
- src/features/catalog/ProductCatalog.tsx
- src/features/catalog/ProductCard.tsx
- src/features/cart/CartDrawer.tsx
- src/features/cart/cartContext.tsx
- src/features/checkout/CheckoutForm.tsx
- src/features/checkout/OrderConfirmation.tsx
```

---

## Modelo de Dados Sugerido

```typescript
interface Product {
  id: string;
  name: string;           // "Camisola de Linho Premium"
  description: string;
  price: number;          // 29.90
  category: string;       // "Vestuário"
  stock: number;          // 0 = esgotado
  imageUrl?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}
```

---

*SKILL E-Commerce v1.0 — Imersão IA Portugal | Gerado por AIOS Master (Orion)*
