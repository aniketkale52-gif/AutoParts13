# Product brief

## One line

A point-of-sale and stock network for auto-parts shops. Shops bill customers at the counter, and when they run out of a part they can see which supplier or distant shop has it right now.

## Business model

- PartsDesk is the platform owner, a third-party SaaS like Petpooja (restaurants) or an HRMS.
- Each **shop** subscribes and uses the app under **its own name and logo**. Bills, the sidebar and the header show the shop's brand. PartsDesk appears only as "Powered by PartsDesk".
- **Vendors (suppliers / distributors)** get their own login in the same app to keep their stock current.
- The network is the differentiator: because every shop and vendor runs on PartsDesk, the platform knows who has what in stock.

## Users

| Persona | Age | Device | Needs |
|---|---|---|---|
| Shop owner | 35–65 | Counter tablet or desktop, phone | Fast billing, khata, knowing what's running out, finding stock |
| Counter staff | 20–45 | Counter tablet | Tap-to-bill, quantities, payment |
| Store-room staff | 20–50 | Printed or on-screen pick slip | Which part, which rack, how many |
| Vendor / distributor | 30–60 | Desktop, phone | Keep stock current, answer shop requests |

Many users are 40–60+. **Large type, large touch targets and plain words are requirements, not polish.** See DESIGN_SYSTEM.md.

## Roles and screens

### Shop
| Screen | Purpose |
|---|---|
| New sale | POS: tap parts → bill → pick slip → payment → invoice |
| Bills | History of bills, reopen an invoice |
| Customers | Garages, fleets and individuals; khata (credit) due; record payments |
| Inventory | Stock, rack, cost, price, margin, reorder level; add parts |
| Reports | Sales by day, payment modes, top parts, khata to collect, reorder list |
| Find stock | Search a part, see suppliers (exact stock) and shops >3 km away |
| Wanted | Post a part you need; offer parts other shops need |
| Interests | Requests sent and received; shared phone numbers |

### Vendor
| Screen | Purpose |
|---|---|
| My stock | List parts with quantity, trade price and minimum order |
| Interests | Shop requests: Share my number / Decline |

## Core flows

### 1. Counter sale
1. Staff tap part tiles. Each tap adds 1. Quantity can be typed, or +10 tapped for bulk.
2. Bulk tiers apply automatically (e.g. 20+ at ₹232). The bill shows "N more for ₹X each".
3. Optional: choose a customer (needed for khata), add a discount (% or ₹ flat).
4. Optional: **Pick slip** → the store room gets the parts list sorted by rack.
5. Tap a payment tile: Cash / UPI / Card / Khata / Split. A confirm step follows (change due, khata balance, split totals).
6. Sale completes → stock is deducted → GST tax invoice opens → **Next sale**.

### 2. Restock from the network
1. A part is low or out (red/amber in Inventory, or an out-of-stock tile tapped on the counter).
2. **Find stock** shows suppliers first (exact quantity, trade price, min order, distance), then shops more than 3 km away (has stock / limited stock only).
3. Shop taps **I'm interested** → quantity, price it would pay, note.
4. The supplier or shop sees it under **Interests** → **Share my number** or **Decline**.
5. Once shared, both sides see each other's number. They call and agree price, delivery and payment **outside the app**. Trust in this trade is built by talking.

### 3. Shop-to-shop trade (Wanted)
1. Nobody has the part → **Post to Wanted** (part, quantity, price offered, note).
2. Shops more than 3 km away see the post. If they have stock, they tap **I have this** and make an offer.
3. The poster accepts by sharing their number. Same call-to-close flow.

## Business rules

- **Distance privacy:** shops within `HIDE_KM` (3 km) of each other never see each other in Find stock or Wanted. This avoids helping direct competitors. Suppliers are visible to all shops.
- **Quantity privacy:** suppliers' exact stock is shown. Shop stock is shown only as "Has stock" / "Limited stock".
- **Number sharing:** a phone number is revealed only when the receiving side taps Share my number.
- **No payments between businesses in the app** (for now). The app finds stock and starts the conversation.
- **GST:** currently a flat 18% split CGST 9% + SGST 9% (intra-state). Real parts carry 5/12/18/28% by HSN. Make GST per part, and use IGST for inter-state sales.
- **Bill numbers:** `<SHOP PREFIX>/<FY e.g. 26-27>/<0001>`, restarting each financial year (April).
- **Khata:** credit sales add to the customer's due; payments recorded on Customers reduce it.

## Vocabulary (use these words in the UI)

| Say | Not |
|---|---|
| Khata | Accounts receivable, credit ledger |
| Pick slip | KOT, fulfilment ticket |
| Part, part number | SKU, item code |
| Supplier / vendor | Upstream partner |
| Rack (R2-B4) | Bin location |
| Bulk rate | Volume tier pricing |
