# BOOST: E-COMMERCE / LOJA ONLINE / MARKETPLACE
# Versão: 1.0 | Tipo: Boost opcional (injectado automaticamente)
# Activado por: keywords "loja", "loja online", "e-commerce", "vender",
#               "produto", "carrinho", "comprar", "pagamento", "stock",
#               "encomenda", "marketplace", "preço", "desconto", "promoção"
# Combinar com: skill-universal.md

---

## [BOOST_CONTEXT]

This project is an **e-commerce / online store application**.

Common use cases this boost covers:
- Product catalogue (catálogo de produtos)
- Shopping cart (carrinho de compras)
- Checkout flow (processo de pagamento)
- Order management (gestão de encomendas)
- Inventory tracking (controlo de stock)
- Discount codes (códigos de desconto)

---

## [BOOST_ARCHITECTURE]

### Shopping Cart (Context-based, persisted to LocalStorage)

```typescript
// Cart state machine
type CartState = 'empty' | 'active' | 'checkout' | 'processing' | 'success';

// Persist cart to localStorage on every change
const CART_STORAGE_KEY = 'imersao_cart';
```

### Domain Data Models

```typescript
// types/index.ts — E-commerce-specific types

interface Product {
  id: string;
  slug: string;           // URL-friendly name
  name: string;           // PT-PT product name
  description: string;    // Short description in PT-PT
  longDescription?: string;
  price: number;          // Base price in euros (cents as integer * 100)
  compareAtPrice?: number; // Original price (for discounts)
  images: string[];       // URLs or placeholder strings
  category: string;
  tags: string[];
  sku: string;
  stock: number;          // -1 = unlimited
  isActive: boolean;
  variants?: ProductVariant[];
  weight?: number;        // grams (for shipping)
}

interface ProductVariant {
  id: string;
  name: string;           // "Tamanho", "Cor"
  options: VariantOption[];
}

interface VariantOption {
  id: string;
  value: string;          // "S", "M", "L", "Azul", "Vermelho"
  priceModifier: number;  // +/- from base price
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>; // { "Tamanho": "M", "Cor": "Azul" }
  unitPrice: number;      // Resolved price at time of adding
}

interface Cart {
  items: CartItem[];
  discountCode?: string;
  discountAmount: number;
  shippingCost: number;
}

interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;            // IVA (23% in Portugal)
  total: number;
}

interface CheckoutForm {
  // Dados pessoais
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nif?: string;           // Número de Identificação Fiscal (optional)

  // Endereço de entrega
  address: string;
  city: string;
  postalCode: string;     // Format: XXXX-XXX
  country: string;        // Default: "Portugal"

  // Método de pagamento
  paymentMethod: PaymentMethod;
  saveAddress: boolean;
}

type PaymentMethod =
  | 'mbway'         // MB WAY (most popular in Portugal)
  | 'multibanco'    // ATM Reference
  | 'card'          // Credit/Debit card
  | 'transfer';     // Bank transfer

interface Order {
  id: string;
  orderNumber: string;    // e.g., "#1234"
  items: CartItem[];
  totals: CartTotals;
  shipping: CheckoutForm;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  trackingCode?: string;
}

type OrderStatus =
  | 'pendente'          // Awaiting payment
  | 'pago'              // Payment confirmed
  | 'em_preparacao'     // Being prepared
  | 'enviado'           // Shipped
  | 'entregue'          // Delivered
  | 'cancelado'         // Cancelled
  | 'devolvido';        // Returned

interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;           // % or € amount
  minimumOrder?: number;
  expiresAt?: string;
  usageLimit?: number;
  isActive: boolean;
}
```

---

## [BOOST_FILE_STRUCTURE]

Add these files to the universal structure:

```
src/features/
├── catalogue/
│   ├── index.tsx             → Product catalogue / listing page
│   ├── ProductGrid.tsx       → Grid de produtos (responsivo)
│   ├── ProductCard.tsx       → Card com imagem, preço, stock, CTA
│   ├── ProductFilters.tsx    → Filtros: categoria, preço, disponibilidade
│   ├── ProductSearch.tsx     → Pesquisa em tempo real
│   └── useCatalogue.ts       → Filtros, sort, pesquisa
│
├── product-detail/
│   ├── index.tsx             → Página de detalhe do produto
│   ├── ProductImages.tsx     → Galeria de imagens
│   ├── VariantSelector.tsx   → Selecção de variantes (tamanho, cor)
│   ├── StockBadge.tsx        → Indicador de stock disponível
│   └── AddToCart.tsx         → Botão de adicionar ao carrinho
│
├── cart/
│   ├── index.tsx             → Drawer/página do carrinho
│   ├── CartItem.tsx          → Item com quantidade editável
│   ├── CartSummary.tsx       → Subtotal, desconto, total
│   ├── DiscountCode.tsx      → Campo de código de desconto
│   ├── CartContext.tsx       → Context provider com LocalStorage
│   └── useCart.ts            → Lógica do carrinho
│
├── checkout/
│   ├── index.tsx             → Processo de checkout multi-step
│   ├── StepAddress.tsx       → Passo 1: Endereço de entrega
│   ├── StepPayment.tsx       → Passo 2: Método de pagamento
│   ├── StepReview.tsx        → Passo 3: Revisão e confirmação
│   ├── MBWayPayment.tsx      → Instrução MB WAY
│   ├── MultibancoPayment.tsx → Referência Multibanco
│   └── useCheckout.ts        → Validação e submissão
│
└── orders/
    ├── index.tsx             → Histórico de encomendas
    ├── OrderCard.tsx         → Resumo de encomenda
    ├── OrderDetail.tsx       → Detalhe com timeline de estado
    └── useOrders.ts          → Gestão de encomendas
```

---

## [BOOST_DESIGN]

### E-commerce Layout & Styles

```css
/* E-commerce-specific CSS */

/* Product grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

@media (min-width: 768px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1200px) {
  .product-grid { grid-template-columns: repeat(4, 1fr); }
}

/* Product card */
.product-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Product image placeholder */
.product-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: var(--color-surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 3rem;
  position: relative;
  overflow: hidden;
}

/* Price display */
.price-container {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
}

.price-original {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.price-current {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.price-current.discounted { color: var(--color-error); }

/* Discount badge */
.discount-badge {
  background: var(--color-error);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

/* Stock indicator */
.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.stock-badge.in-stock  { color: var(--color-success); }
.stock-badge.low-stock { color: var(--color-warning); }
.stock-badge.out-stock { color: var(--color-error); }

/* Cart drawer */
.cart-drawer {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: min(400px, 100vw);
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform var(--transition-slow);
  box-shadow: var(--shadow-lg);
}

.cart-drawer.open { transform: translateX(0); }

/* Cart counter badge */
.cart-counter {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--color-accent);
  color: var(--color-bg);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Checkout steps */
.checkout-steps {
  display: flex;
  gap: 0;
  margin-bottom: var(--spacing-xl);
  background: var(--color-surface);
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.checkout-step {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: all var(--transition);
}

.checkout-step.active {
  background: var(--color-accent);
  color: var(--color-bg);
}

.checkout-step.completed {
  color: var(--color-success);
}

/* Portuguese postal code input */
.postal-code-input {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}
```

---

## [BOOST_RULES]

### E-commerce-Specific Rules

1. **Price handling:** Store prices in cents (integer) to avoid floating point errors. Display with `(price / 100).toFixed(2).replace('.', ',')`
2. **IVA (VAT):** Portugal standard rate is 23%. Always show IVA included in final price. Show breakdown: "IVA incluído (23%)"
3. **Currency symbol:** Always `€` before the amount — `€12,50` (not `12,50€`)
4. **Payment methods:** Prioritize MB WAY and Multibanco for Portuguese market
5. **Postal code:** Portuguese format is `XXXX-XXX` — validate with regex `/^\d{4}-\d{3}$/`
6. **Cart persistence:** Always save cart to localStorage. Restore on page load.
7. **Stock alerts:** Show "Últimas X unidades!" when stock ≤ 5
8. **Checkout validation:** Validate all fields before allowing next step
9. **Order confirmation:** Show clear success state with order number and email confirmation message
10. **PT-PT e-commerce labels:**
    - "Adicionar ao carrinho" (Add to cart)
    - "Comprar agora" (Buy now)
    - "Carrinho de compras" (Shopping cart)
    - "Finalizar compra" (Checkout)
    - "Continuar a comprar" (Continue shopping)
    - "Remover" (Remove)
    - "Quantidade" (Quantity)
    - "Subtotal" (Subtotal)
    - "Portes de envio" (Shipping)
    - "Total a pagar" (Total to pay)
    - "Código de desconto" (Discount code)
    - "Aplicar" (Apply)
    - "Encomenda confirmada!" (Order confirmed!)
    - "Número de encomenda" (Order number)

---

*BOOST E-commerce v1.0 — Imersão IA Portugal*
