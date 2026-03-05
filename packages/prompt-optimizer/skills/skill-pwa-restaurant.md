# SKILL: PWA Restaurant
> **Versão:** 1.0 | **Tipo:** Skill Opcional (Toggle Manual)
> **Activação:** Manual via toggle na UI do Prompt Optimizer
> **Aplica-se a:** Restaurantes, cafés, pastelarias, takeaway, food & beverage

---

## Descrição

Skill especializada para aplicações de restauração. Injeta padrões PWA (Progressive Web App), navegação de menu, sistema de reservas e integração WhatsApp. Combina com a SKILL Universal.

---

## Injecções no Prompt

### Adicionado a [ROLE]
```
+ SKILL ACTIVE: PWA Restaurant
  - Progressive Web App (installable on mobile, works offline)
  - Mobile-first food & beverage UX patterns
  - WhatsApp/phone integration for orders and reservations
  - Touch-optimized with large tap targets (min 48px)
```

### Adicionado a [ARCHITECTURE]
```
PWA Config:
  - Service Worker for offline menu cache
  - Web App Manifest (name, icons, theme-color)
  - Install prompt handling
  - Offline fallback page
```

### Adicionado a [FEATURES] (se não especificados pelo aluno)
```
Suggested features for restaurant projects:
  - MenuDisplay: categories, items with price, photo placeholder, dietary tags
  - ReservationForm: date picker, time slots, party size, confirmation
  - OrderCart: add items, view total, send via WhatsApp deeplink
  - LocationInfo: embed map, opening hours, phone CTA
  - QRCodeShare: generate QR for digital menu URL
```

### Adicionado a [RULES]
```
Restaurant-specific rules:
  - All prices formatted as EUR (€ X.XX)
  - Menu items show: name, description, price, dietary icons (🌱 🌾 🥛)
  - Reservation: max 3 steps — date/time → guest details → confirm
  - WhatsApp CTA: wa.me/ deeplink with pre-filled message
  - Images: aspect ratio 4:3, with Portuguese placeholder text "Foto em breve"
  - No lorem ipsum — use realistic Portuguese food items as examples
```

---

## Paleta de Cores Recomendada

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-food-warm` | `#1a0a00` | Background quente |
| `--color-food-accent` | `#e85d04` | CTAs e destaques |
| `--color-food-cream` | `#fefae0` | Texto claro |
| `--color-food-green` | `#588157` | Tags vegetariano |

---

## Ficheiros Extra a Gerar

```
- src/features/menu/MenuDisplay.tsx
- src/features/reservation/ReservationForm.tsx
- src/features/cart/OrderCart.tsx
- public/manifest.json
- public/sw.js (Service Worker básico)
```

---

## Exemplo de Prompt com Skill Activa

```
[ROLE]
You are a Senior Frontend Developer + UI Designer specialized in warm, food-focused neo-gastronomy with earthy tones and organic shapes.
You produce complete, production-ready React 19 + TypeScript code with zero placeholders.
+ SKILL ACTIVE: PWA Restaurant
  - Progressive Web App (installable on mobile, works offline)
  - Mobile-first food & beverage UX patterns
  - WhatsApp/phone integration for orders and reservations
```

---

*SKILL PWA Restaurant v1.0 — Imersão IA Portugal | Gerado por AIOS Master (Orion)*
