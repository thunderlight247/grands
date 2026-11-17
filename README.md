# Grand Gees Food Court

Mobile-first storefront for **Grand Gees Food Court**, inside Skyways Hotel at Jack Mullar Beach Junction, Bortianor, Accra. Guests browse the menu, build an order and send it to the kitchen on WhatsApp, or send a catering enquiry the same way.

Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Lenis smooth scrolling and GSAP ScrollTrigger.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

Optional environment variables (put them in `.env.local`):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for canonical links, Open Graph and JSON-LD (e.g. `https://grandgees.com`). |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Turns on the "Pay now with card or MoMo" button in the cart drawer. |

## Images

All photos live in `public/images/` and are already in the repo:

| File | Dish |
| --- | --- |
| `hero-mixed-platter.jpg` | Jollof, fried rice, spaghetti, plantain, beef and chicken platter (hero, Open Graph, catering) |
| `okra-soup-seafood.jpg` | Okra soup with prawns, ponmo and beef |
| `assorted-pepper-soup.jpg` | Assorted meat pepper soup with yam |
| `egusi-smoked-fish.jpg` | Egusi stew with smoked mackerel and dried fish |
| `efo-riro.jpg` | Efo riro spinach stew |
| `afang-soup-eba.jpg` | Afang soup with eba |
| `yam-palava-sauce-avocado.jpg` | Boiled yam, palava sauce, avocado |
| `egusi-soup-pounded-yam.jpg` | Egusi soup with pounded yam |
| `fufu-goat-light-soup.jpg` | Fufu with goat light soup |
| `swallow-ewedu-stew.jpg` | Swallow with ewedu and pepper stew |

To add a dish (e.g. achieke, pizza, shawarma or drinks), add its photo to `public/images/`, then add an entry to `src/data/menuData.ts` with the image path and its pixel size. A new category tab appears automatically once it has at least one dish.

## Where to edit things

| What | File |
| --- | --- |
| Name, phone, address, hours, Google Maps links | `src/data/businessInfo.ts` |
| Dishes, prices, availability (`available: false` shows "Sold out today") | `src/data/menuData.ts` |
| Google reviews (paste real reviews only) | `src/data/reviewsData.ts` |
| WhatsApp message wording | `src/utils/whatsapp.ts` |
| Open/closed logic (Africa/Accra, 08:00–00:30) | `src/utils/hours.ts` |

Before launch, replace the placeholder Google Maps search links in `businessInfo.ts` with the exact Google Business Profile share link, embed URL and review link, and set the exact map coordinates.

## Project structure

```
src/
  app/                layout (metadata + JSON-LD), page, globals.css
  components/
    layout/           Navbar, Footer
    sections/         Hero, Menu, Catering, Reviews, Location
    ui/               DishCard, WhatsAppCartDrawer, QuantityStepper, StatusBadge, BlurText
    providers/        SmoothScroll (Lenis + GSAP ticker)
    seo/              RestaurantSchema
  context/            CartContext (persisted in localStorage)
  data/               businessInfo, menuData, reviewsData
  hooks/              useRestaurantStatus, useStaggerReveal, usePaystackCheckout
  utils/              hours, whatsapp, currency
```

## Paystack prepayment

`src/hooks/usePaystackCheckout.ts` already builds a GHS transaction (amount in pesewas, reference, cart metadata) from the cart and dispatches it as a `grandgees:paystack-checkout` window event. To go live:

1. Set `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`.
2. Load `https://js.paystack.co/v2/inline.js`, listen for the event and pass `event.detail` plus the customer's email to `new PaystackPop().newTransaction(...)`.
3. Verify each payment on a server route with your secret key before treating the order as paid.

The cart itself doesn't need to change.
