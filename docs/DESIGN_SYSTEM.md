# Design system

The visual language comes from the original design brief: high contrast, one bright lime accent, a square display face, pill buttons with 8px squared cards, and hairline borders instead of shadows. The layout follows two references: a tablet POS (tap grid, bill on the right, big payment tiles across the bottom) and a back office with a dark sidebar and clean tables.

All tokens live at the top of `src/styles.css`. **Never hard-code a colour in a component. Use a token.**

## Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f4f5f7` | `#0d0d0f` | Page background |
| `--surface` | `#ffffff` | `#17171a` | Cards, bill panel, tables |
| `--raised` | `#f1f2f4` | `#222226` | Tile art, payment tiles, hovers |
| `--ink` | `#000000` | `#fafafa` | Main text and icons (brief: Primary) |
| `--muted` | `#374151` | `#cfcfd6` | Secondary text |
| `--faint` | `#5b6370` | `#a3a3ad` | Captions, meta (still AA on its surface) |
| `--line` | `#e5e7eb` | `#2b2b30` | Hairline borders (brief: Border) |
| `--line-strong` | `#cfd3da` | `#3b3b42` | Input and control borders |
| `--accent` | `#c0f63b` | `#c0f63b` | **Actions, selected state, highlights only** (brief: Secondary) |
| `--on-accent` | `#000000` | `#000000` | Text on accent |
| `--accent-ink` | `#3f6212` | `#c0f63b` | Accent as text on `--surface`; plain lime is unreadable on white |
| `--steel` | `#7155e6` | `#a893f7` | Bulk pricing, network hints (brief: slate-blue) |
| `--ok / --warn / --bad` | green / amber / red | lighter versions | Stock and status only, always with a label |
| `--side-bg` | `#0b0b0c` | `#050506` | Sidebar (dark in both themes) |

Rules:
- Lime is reserved for primary actions, the active nav item, the selected state, quantity badges and the headline stat. Don't use it for decoration.
- Status colours always come with words ("4 left", "Out of stock", "Reorder"). Never rely on colour alone.
- Dark mode is a separate palette, not an inversion. Toggle with `data-theme="dark|light"` on `<html>`. With no attribute, the OS setting is followed.

## Type

| Role | Family | Use |
|---|---|---|
| Display | **Saira** 500/700 | Page titles, prices, totals, stats |
| Body | **Work Sans** 400/500/600 | Everything else (substitute for the brief's "grotesk") |
| Mono | **JetBrains Mono** 400/500 | Part numbers, HSN, bill numbers, rack codes, phone numbers |

Loaded from Google Fonts in `index.html`.

**Sizes are tuned for 40–60+ users:**
- Body text is 16px. Nothing interactive is below 14px.
- Page titles are 32px. The POS total is 34px. Sign-in hero 32–64px.
- Labels are uppercase 12.5px with letter-spacing, used only for section labels.
- Use `font-variant-numeric: tabular-nums` wherever numbers line up.

## Spacing and shape

- Spacing scale: **8 / 16 / 28 / 48 / 80** (`--xs --sm --md --lg --xl`). Don't invent other gaps for layout.
- Radius: **8px** (`--r-sm`) for cards, tiles, inputs and tables. **Full pill** (`--r-full`) for buttons, chips and status badges. No other radii.
- Shadows: only on floating layers (modals, bottom sheet, sign-in card). Everything else uses a 1px border.

## Touch targets (accessibility)

| Element | Min height |
|---|---|
| Primary button | 47px (`--pill`) |
| Small button | 42px |
| Nav item | 48px |
| Stepper +/− | 42px circle |
| Category chip | 44px |
| Payment tile | 52px |
| Part tile | ~190px |

Every icon in the sidebar has a visible text label, even when the sidebar collapses to icons (≤1280px). Focus is a visible 3px outline.

## Components

- **Part tile:** category icon area with a vehicle badge (2W / 4W), name, fits line, a stock dot with count, and the price in Saira. A selected tile gets a 2px ink inset border and a lime quantity badge. An out-of-stock tile is dimmed and opens Find stock.
- **Bill line:** name; struck-through list price when a bulk rate applies; part number; per-unit price; a purple bulk hint; stepper, +10, remove.
- **Payment tile:** mode icon and uppercase label, in a 2×2 grid (Cash, UPI, Card, Khata) pinned to the bottom of the bill, under Total due. The selected tile gets a lime edge, soft tint and a tick. The Generate bill tile is solid lime and sits below them at full width.
- **Sign-in screen:** dark brand panel on the left with a slider that changes every 6 seconds (it stops on hover, on keyboard focus and for reduced motion). A floating card on the right holds the Shop / Vendor toggle and the account list.
- **Status pill:** `st-ok`, `st-low`, `st-out`, `st-wait`, `st-need` (ink, means "your turn"), `st-shared` (lime).
- **Phone reveal:** ink-bordered box with a lime tint and a mono number, `user-select: all`.
- **Tables:** 12.5px uppercase headers; 15.5px cells; low-stock rows tinted amber.
- **Scrollbars:** hidden until hover on desktop (`styles.css`, bottom section).

## Layout

- **≥1281px:** 252px sidebar with labels + content. The POS shows a grid, a 410px bill and a bottom payment bar.
- **901–1280px (tablet):** 96px icon sidebar with small labels. Bill 370px.
- **≤900px (phone):** the sidebar becomes a drawer behind the ☰ button. The bill becomes a bottom sheet opened from a sticky "Review bill" bar. Payment tiles go inside the sheet.
- The side gutter is never under 16px, and it respects `env(safe-area-inset-*)`.

## Copy

- Plain, short and from the user's side: "Find stock", "Share my number", "Put on khata", "Next sale".
- A button says exactly what happens. A toast confirms it ("Number shared with Kurla Auto Parts").
- Errors say what to fix: "This supplier's minimum order is 6."
- Indian formats: ₹ with en-IN grouping (₹1,23,456), amount in words in lakh/crore, dates like "28 Oct".
