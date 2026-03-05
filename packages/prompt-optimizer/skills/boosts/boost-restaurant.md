# BOOST: Restaurant / Food & Beverage
> **Activação:** Palavras-chave — restaurante, menu, carta, ementa, refeição, prato, cozinha, takeaway, delivery, reserva, mesa, comida, café, pastelaria, bar
> **Injeta em:** `[ROLE]` como nota adicional

## Injecção em [ROLE]

```
+ BOOST activated: RESTAURANT patterns
  - Mobile-first PWA (installable, offline-capable)
  - Menu digital with category navigation and item cards
  - Real-time availability for reservations
  - WhatsApp/phone CTA integration
  - High visual food imagery support (img placeholders, aspect ratios)
  - Touch-optimized interactions (large tap targets, swipe gestures)
```

## Padrões de Arquitectura Específicos

```
Features típicas detectadas neste domínio:
- MenuDisplay — categorias + items com preço e foto
- ReservationForm — data, hora, nº pessoas, confirmação
- OrderCart — seleção de itens, total, envio para WhatsApp
- LocationMap — mapa embed + horários de funcionamento
- QRCode — geração de QR para menu digital
```

## Regras Adicionais (injectadas em [RULES])

```
- Menu items must show: name, description, price, dietary tags
- Reservation flow: max 3 steps (date → details → confirm)
- All prices in EUR format (€ X.XX)
- Phone/WhatsApp buttons must be prominent CTAs
- Image placeholders with correct food aspect ratio (4:3)
```

---
*Boost Restaurant v1.0 — Imersão IA Portugal*
