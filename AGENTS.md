# Instructions for AI coding tools

Read these first: `docs/PRODUCT.md` (what this is and the rules), `docs/DESIGN_SYSTEM.md` (how it must look), `docs/DATA_MODEL.md` (data shapes), `docs/ROADMAP.md` (what's next).

## What this is
A white-label POS and parts network for Indian auto-parts shops and their suppliers. Shops use it under their own name and logo; "PartsDesk" is the platform (working name).

## Stack
- Vite + vanilla JS + one CSS file. No framework yet.
- `index.html` holds every screen as `<section id="view-NAME" hidden>`. `show(name)` in `src/main.js` switches views; each view has a `render<Name>()` function.
- Events use one delegated `click` / `input` / `change` / `submit` listener at the bottom of `main.js`, keyed by `data-*` attributes and element ids.
- State is in memory and saved with `save()` to `localStorage`. There is no backend yet.

## Rules you must keep
1. **Design tokens only.** Colours, fonts, spacing (8/16/28/48/80) and radii (8px or pill) come from `:root` in `styles.css`. Add any new colour as a token in all three theme blocks (light `:root`, the `prefers-color-scheme: dark` block, `[data-theme="dark"]`).
2. **Lime (`--accent`) is for actions and selected state only.**
3. **Accessibility for 40–60+ users:** body ≥16px, controls ≥42px tall, labels next to icons, status colour always paired with words, visible focus.
4. **Business rules:** shops within `HIDE_KM` (3 km) never see each other; shops never see each other's exact quantities; phone numbers appear only after the other side taps Share my number.
5. **Indian conventions:** ₹ with `en-IN` grouping, GST split CGST/SGST, bill number `PREFIX/FY/0001`, words like khata, pick slip, rack.
6. **Escape all user text** with `esc()` before putting it in HTML.
7. Keep it working at phone width (≤900px uses the drawer and bottom-sheet layout). No horizontal page scroll.
8. Copy is plain and specific. Buttons say what they do; toasts confirm; errors say how to fix.

## Commands
- `npm install` then `npm run dev`. Build with `npm run build`.
