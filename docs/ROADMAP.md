# Roadmap

## Now: front-end prototype (this repo)
- All screens for shops and vendors, demo data in `localStorage`, light/dark, responsive down to phone.

## Next 1: make it real (backend + auth)
Suggested stack: **Supabase** (Postgres + Auth + Row-Level Security + Realtime), or Postgres + Node/Next API. Both deploy alongside Vercel.

1. **Auth:** phone OTP sign-in. Roles: `shop_owner`, `shop_staff` (cashier / store), `vendor`, `platform_admin`.
2. **Multi-tenant tables:** `shops`, `branches`, `staff`, `vendors`, `parts` (master catalogue), `shop_stock`, `vendor_stock`, `customers`, `khata_entries`, `bills`, `bill_items`, `payments`, `pick_slips`, `interests`, `wanted_posts`. See DATA_MODEL.md.
3. **RLS policies:** a shop reads and writes only its own rows. Network queries go through a server function that applies the 3 km rule and hides shop quantities.
4. **Realtime:** vendor stock changes and new interests push to clients. Show a badge and a toast.
5. **Replace `localStorage` calls** in `src/main.js` (`save()`, `read()`, `seedNet()`) with an API layer (`src/api.js`).

## Next 2: counter essentials
- Per-part GST rate (5/12/18/28%) and IGST for inter-state sales.
- Thermal printer (58/80mm) and A4 invoice PDF; share invoice on WhatsApp.
- Barcode / QR scan to add a part.
- Purchase entry (stock in from a supplier bill), stock adjustments, returns and credit notes.
- Holds / parked bills (serve the next customer, come back).
- Day close: cash in drawer vs. expected.
- Shop branding: logo upload, brand colour, invoice footer text.

## Next 3: network
- Vehicle fitment search (make → model → year → part).
- Supplier ratings after a shared-number deal ("Did you buy?").
- Notifications: SMS / WhatsApp when someone shares a number.
- Admin-configurable `HIDE_KM` per city.

## Next 4: mobile app
- Same design system in **React Native (Expo)** or **Flutter**, or ship this web app as a PWA first (add `manifest.json` + service worker).
- Vendor app first on mobile (stock updates on the go); shop owners next (reports, khata, interests).

## Platform admin (PartsDesk team)
- Onboard shops and vendors, plans and subscriptions, usage, support login.

## Suggested code split (when it grows)
The prototype is one `main.js` on purpose. When moving on, either:
- **Stay vanilla:** split into `src/data/`, `src/views/` (one file per screen), `src/components/` (tile, bill line, modal), `src/state.js`, `src/api.js`. Or:
- **Move to React + TypeScript (Vite):** each `render*()` function becomes a component, and the tokens in `styles.css` stay as they are (or map to a Tailwind theme).
