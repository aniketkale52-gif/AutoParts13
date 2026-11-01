# PartsDesk POS

A white-label point of sale (POS) and parts network for auto-parts shops and their suppliers. Think Petpooja, but for spare-parts counters: each shop runs it under its own name and logo, while the platform, the network and the logic belong to PartsDesk.

> "PartsDesk" is a working name. Replace it everywhere when the brand is final (search the repo for `PartsDesk`).

## What's in this version

This is a front-end prototype. It runs entirely in the browser on demo data saved in `localStorage`. There is no backend, login or server yet. See `docs/ROADMAP.md` for the plan.

**Shop owner app**
- **New sale (POS):** a tap grid of parts with category tabs and a two-wheeler / four-wheeler filter. The bill sits on the right. Bulk rates apply automatically, and discounts can be a percentage or a flat amount, with GST.
- **Payment tiles:** choose Cash (works out change), UPI, Card or Khata (credit), then tap Generate bill.
- **Bills:** history with a GST tax invoice, the amount in words, and copy-to-WhatsApp text.
- **Customers:** garages, fleets and individuals, with khata due and payment recording.
- **Inventory:** rack, cost, price, margin, reorder status and add-part.
- **Reports:** sales by day, payments by mode, top parts, khata to collect and items to reorder.
- **Find stock:** live supplier stock plus shops more than 3 km away.
- **Wanted:** post a part you need; shops in other areas can offer it.
- **Interests:** send interest. When the other side accepts, phone numbers are shared in-app and the deal is closed on a call.

**Vendor (supplier) app**
- **My stock:** a list of parts with editable quantity, trade price and minimum order.
- **Interests:** shop requests, with Share my number or Decline.

**Rules**
- Shops closer than 3 km never see each other (`HIDE_KM` in `src/main.js`).
- Shops see suppliers' exact stock. Shops only see each other as "Has stock" or "Limited stock".
- Phone numbers are shared only after the receiving side accepts.

## Run it locally

You need Node.js 18 or newer.

```bash
npm install
npm run dev
```

The app opens at http://localhost:5173. Sign in with any demo account. To see both sides of a deal, use **Switch account** in the sidebar.

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Put it on GitHub

```bash
git init
git add .
git commit -m "PartsDesk POS prototype"
git branch -M main
git remote add origin https://github.com/<your-username>/partsdesk-pos.git
git push -u origin main
```

## Deploy on Vercel

1. Push the repo to GitHub (above).
2. On vercel.com, choose **Add New → Project** and import the repo.
3. Vercel reads `vercel.json`, so framework, build command (`npm run build`) and output folder (`dist`) are already set. Click **Deploy**.

Or deploy from the terminal:

```bash
npm i -g vercel
vercel        # preview deployment
vercel --prod # production
```

## Project layout

```
index.html            App markup: every screen is a <section id="view-…">
src/styles.css        All styles. Design tokens at the top (light + dark)
src/main.js           All logic: demo data, rendering, events
public/favicon.svg    Tab icon
docs/PRODUCT.md       What the product is, roles, flows and business rules
docs/DESIGN_SYSTEM.md Colours, type, spacing, components and accessibility rules
docs/DATA_MODEL.md    Shapes of shops, vendors, parts, bills, customers, interests
docs/ROADMAP.md       What to build next (backend, auth, mobile app)
AGENTS.md             Instructions for AI coding tools (Cursor, Claude Code)
.cursor/rules/        Cursor project rules
vercel.json           Vercel build + SPA routing
```

## Demo data

Demo data loads on first visit and is saved in the browser. To start fresh, clear the site's storage. The storage keys are `pd5.net` (everything), `pd5.me` (signed-in account) and `pd.theme`.
