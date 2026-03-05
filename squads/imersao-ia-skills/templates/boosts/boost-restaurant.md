# BOOST: RESTAURANT / MENU DIGITAL
# Versão: 1.0 | Tipo: Boost opcional (injectado automaticamente)
# Activado por: keywords "restaurante", "menu", "carta", "ementa", "takeaway",
#               "reserva", "mesa", "pedido", "cozinha", "prato"
# Combinar com: skill-universal.md

---

## [BOOST_CONTEXT]

This project is a **digital restaurant / food service application**.

Common use cases this boost covers:
- Digital menu (carta digital) for customers to browse
- Online ordering system (pedidos online)
- Table reservation system (reservas)
- Kitchen dashboard (painel de cozinha)
- Takeaway / delivery order management

---

## [BOOST_ARCHITECTURE]

### PWA Configuration (Progressive Web App)

Add to `index.html`:
```html
<meta name="theme-color" content="{{COLOR_ACCENT}}">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="manifest" href="/manifest.json">
```

Generate `public/manifest.json`:
```json
{
  "name": "{{PROJECT_NAME}}",
  "short_name": "{{PROJECT_NAME}}",
  "start_url": "/",
  "display": "standalone",
  "background_color": "{{COLOR_BACKGROUND}}",
  "theme_color": "{{COLOR_ACCENT}}",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Domain Data Models

```typescript
// types/index.ts — Restaurant-specific types

interface MenuItem {
  id: string;
  name: string;             // Portuguese: name of the dish
  description: string;      // Short description in PT-PT
  price: number;            // In euros
  category: MenuCategory;
  available: boolean;
  imageUrl?: string;
  allergens?: string[];     // e.g., ["gluten", "lactose"]
  isVegetarian?: boolean;
  isVegan?: boolean;
  preparationTime?: number; // minutes
}

type MenuCategory =
  | 'entrada'       // Starters
  | 'principal'     // Main course
  | 'sobremesa'     // Dessert
  | 'bebida'        // Drinks
  | 'especial';     // Chef special

interface Order {
  id: string;
  items: OrderItem[];
  tableNumber?: number;
  customerName?: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
  notes?: string;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  observations?: string;    // PT-PT: "Sem cebola", "Bem passado"
}

type OrderStatus =
  | 'pendente'      // Pending
  | 'confirmado'    // Confirmed
  | 'em_preparacao' // In preparation
  | 'pronto'        // Ready
  | 'entregue'      // Delivered
  | 'cancelado';    // Cancelled

interface Reservation {
  id: string;
  date: string;             // ISO 8601
  time: string;             // "19:30"
  guests: number;
  customerName: string;
  customerPhone: string;
  notes?: string;
  status: 'confirmada' | 'cancelada' | 'pendente';
}

interface RestaurantConfig {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  openingHours: { [day: string]: { open: string; close: string } | null };
  currency: 'EUR';
  deliveryEnabled: boolean;
  takeawayEnabled: boolean;
  minimumOrder?: number;
}
```

---

## [BOOST_FILE_STRUCTURE]

Add these files to the universal structure:

```
src/features/
├── menu/
│   ├── index.tsx             → Menu digital com categorias
│   ├── MenuGrid.tsx          → Grid de pratos (card layout)
│   ├── MenuCard.tsx          → Card individual de prato
│   ├── CategoryFilter.tsx    → Filtro por categoria
│   └── useMenu.ts            → Estado e filtragem do menu
│
├── cart/
│   ├── index.tsx             → Carrinho de pedido
│   ├── CartItem.tsx          → Item individual no carrinho
│   ├── CartSummary.tsx       → Total + botão de confirmar
│   └── useCart.ts            → Lógica do carrinho
│
├── orders/
│   ├── index.tsx             → Lista de pedidos
│   ├── OrderCard.tsx         → Card de pedido com status
│   ├── OrderStatus.tsx       → Badge de estado visual
│   └── useOrders.ts          → Gestão de pedidos
│
└── reservations/ (opcional)
    ├── index.tsx             → Formulário de reserva
    └── useReservations.ts    → Gestão de reservas

public/
├── manifest.json             → PWA manifest
├── icon-192.png              → App icon (placeholder SVG)
└── icon-512.png              → App icon large (placeholder SVG)
```

---

## [BOOST_DESIGN]

### Mobile-First Restaurant Layout

```css
/* Restaurant-specific CSS additions */

/* Hero menu header */
.menu-hero {
  background: linear-gradient(180deg, var(--color-accent) 0%, var(--color-bg) 100%);
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
}

/* Category pills (horizontal scroll on mobile) */
.category-filter {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding: var(--spacing-md) var(--spacing-lg);
  scrollbar-width: none;   /* Firefox */
  -ms-overflow-style: none; /* IE */
  position: sticky;
  top: 0;
  background: var(--color-bg);
  z-index: 10;
  border-bottom: 1px solid var(--color-border);
}

.category-filter::-webkit-scrollbar { display: none; }

/* Menu grid: 1 col mobile → 2 col tablet → 3 col desktop */
.menu-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

@media (min-width: 640px) {
  .menu-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .menu-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Floating cart button (sticky bottom) */
.cart-fab {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  background: var(--color-accent);
  color: var(--color-bg);
  border: none;
  border-radius: 50px;
  padding: var(--spacing-md) var(--spacing-xl);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: transform var(--transition), box-shadow var(--transition);
}

.cart-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.6);
}

/* Price formatting */
.price {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: var(--color-accent);
}
```

---

## [BOOST_RULES]

### Restaurant-Specific Rules

1. **Price formatting:** Always format in euros — `€12,50` (use `toFixed(2).replace('.', ',')`)
2. **Availability check:** Unavailable items are shown greyed out with "Esgotado" label, not hidden
3. **Order confirmation:** Always show order summary before final submit
4. **Allergen disclosure:** If allergens are defined, always display them on the card
5. **Loading skeleton:** Menu cards show skeleton while loading (CSS animation, no images needed)
6. **Offline support:** Cache menu in localStorage so PWA works without connection
7. **PT-PT food labels:**
   - "Adicionar ao pedido" (Add to order)
   - "Pedido confirmado" (Order confirmed)
   - "A preparar..." (In preparation)
   - "Pronto para levantar" (Ready for pickup)
   - "Esgotado" (Sold out)
   - "Sem glúten" (Gluten-free)
   - "Vegetariano" (Vegetarian)
   - "Vegan" (Vegan)

---

*BOOST Restaurant v1.0 — Imersão IA Portugal*
