# BOOST: E-commerce / Loja Online
> **Activação:** Palavras-chave — loja, e-commerce, ecommerce, vender, produto, carrinho, comprar, pagamento, stock, encomenda, marketplace, preço, desconto, promoção, catálogo
> **Injeta em:** `[ROLE]` como nota adicional

## Injecção em [ROLE]

```
+ BOOST activated: ECOMMERCE patterns
  - Product catalogue with category filtering and search
  - Shopping cart with persistent state (LocalStorage)
  - Checkout flow: cart → details → confirmation (3 steps max)
  - Stock management with availability indicators
  - Order tracking with status states
  - Discount/promo code support
  - Mobile-first product cards with image, name, price, CTA
```

## Padrões de Arquitectura Específicos

```
Features típicas detectadas neste domínio:
- ProductGrid — grelha de produtos com filtros e ordenação
- ProductCard — foto, nome, preço (riscado se desconto), botão
- CartDrawer — painel lateral com itens, quantidades, total
- CheckoutFlow — formulário multi-step (dados → pagamento → confirmação)
- StockBadge — "Em Stock" | "Últimas unidades" | "Esgotado"
- OrderSummary — resumo de encomenda com linha de items e total
```

## Regras Adicionais (injectadas em [RULES])

```
- Cart state persisted in LocalStorage (survives page refresh)
- Prices always shown with VAT included (IVA incluído)
- Currency: EUR, format €X.XX
- Out-of-stock items: visible but button disabled ("Esgotado")
- Product images: placeholder with correct e-comm ratio (1:1 or 3:4)
- Checkout: never lose cart data on navigation
- Empty cart: clear CTA to go back to catalogue
```

---
*Boost E-commerce v1.0 — Imersão IA Portugal*
