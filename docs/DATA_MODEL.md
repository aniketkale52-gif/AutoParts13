# Data model

Today everything lives in one object saved to `localStorage["pd6.net"]`. These shapes are what the backend tables should look like when it is built (see ROADMAP.md).

## Catalogue part (shared master list)
```json
{
  "id": "of-swift",
  "name": "Oil filter",
  "fits": "Maruti Swift, Dzire, Baleno (petrol)",
  "pn": "OF-MS-1450",
  "veh": "4W",                 // "2W" | "4W" | "Both"
  "cat": "Filters",            // Engine, Filters, Brakes, Clutch, Electrical, Lighting, Cooling, Suspension, Steering, Wheels, Transmission, Fuel, AC, Lubricants, Cables, Body
  "hsn": "8421",
  "price": 260,                // suggested selling price before GST
  "cost": 188,
  "tiers": [{ "min": 20, "price": 232 }, { "min": 100, "price": 214 }]
}
```
A catalogue part has no brand. Shops and suppliers stock it once per brand (see below).

In production, add `oem_numbers[]`, `gst_rate`, `image_url`, and a proper vehicle-fitment table (make, model, years, engine).

## Shop (tenant)
```json
{
  "id": "s1", "name": "Sai Auto Spares", "owner": "Sanjay Patil",
  "area": "Grant Road, Mumbai", "addr": "…", "gstin": "27AAPFS1234K1Z9",
  "phone": "+91 …", "lat": 18.9633, "lng": 72.8160, "prefix": "SAS",
  "inventory": [ /* shop stock item */ ],
  "customers": [ /* customer */ ],
  "bills": [ /* bill */ ],
}
```
In production add `logo_url`, `brand_color`, `plan`, `branches[]`, `staff[]` (role: owner | cashier | store).

## Brand list (shared)
`net.brands` is one sorted list of brand names (`["Amaron", "Bosch", "Castrol", …]`). Shops and suppliers pick a brand from it. A new brand typed in a form is checked against the list ignoring case, spaces and dots (`castrol` uses the listed `Castrol`); only an unmatched name is added. In production this is a `brands` table with a unique key on the normalised name.

## Shop stock item (one per part per brand)
A catalogue part plus the brand and the shop's own numbers. `pid` is the catalogue part; `id` is `pid--brandslug`. Every brand of a part shows as one card on the counter; tapping it opens a brand picker when there is more than one.
```json
{ "...catalogue fields": "", "id": "eo-15w40--castrol", "pid": "eo-15w40", "brand": "Castrol", "pn": "EO-4W-1540-75-CAS", "price": 3650, "cost": 3120, "stock": 85, "reorder": 20, "rack": "R6-B2" }
```
A part a shop adds itself has `pid` like `x1730000000000`.

## Vendor
```json
{
  "id": "v1", "name": "Mahalaxmi Lubricants & Filters", "kind": "Lubricants · Filters",
  "area": "Bhiwandi", "phone": "+91 …", "lat": 19.28, "lng": 73.04,
  "stock": [{ "id": "eo-5w30--castrol", "pid": "eo-5w30", "brand": "Castrol", "qty": 180, "price": 1890, "moq": 6 }]
}
```

## Customer (per shop)
```json
{ "id": "c1", "name": "Raju Motor Garage", "type": "Mechanic / garage", "phone": "+91 …", "gstin": "", "due": 12400 }
```
`type`: "Individual" | "Mechanic / garage" | "Fleet / business". `due` is the khata balance. In production, keep a `khata_entries` ledger (bill credit +, payment −) and derive `due` from it.

## Bill
```json
{
  "no": "SAS/26-27/0021",
  "date": "2026-10-28T11:20:00.000Z",
  "customer": { "id": "c1", "name": "…", "type": "…", "phone": "…", "gstin": "…" },
  "payment": "Cash",                        // Cash | UPI | Card | Credit (older bills may be Split)
  "payParts": [{ "mode": "Cash", "amount": 15871 }],
  "ref": "UTR / last 4 / change given",
  "discount": { "type": "pct", "value": 3 },   // pct | amt
  "items": [{ "id": "of-swift--bosch", "pid": "of-swift", "brand": "Bosch", "name": "Bosch Engine oil filter", "pn": "…", "hsn": "8421", "cat": "Filters", "qty": 12, "list": 260, "cost": 188, "rate": 260, "amount": 3120 }],
  "subtotal": 0, "bulkSave": 0, "disc": 0, "taxable": 0, "cgst": 0, "sgst": 0, "roundoff": 0, "total": 0, "units": 0
}
```

## Interest (network request / offer)
```json
{
  "id": "i3",
  "kind": "interest",                 // interest (I want yours) | offer (I have what you posted)
  "from": { "t": "shop", "id": "s3" },
  "to":   { "t": "shop", "id": "s1" },  // t: shop | vendor
  "pid": "bs-splendor", "brand": "", "qty": 15,   // brand is set for requests to a supplier's listing "price": 260, "note": "…",
  "status": "pending",                // pending | shared | declined
  "at": "ISO date",
  "wid": "w4"                         // set when it answers a Wanted post
}
```

## Wanted post
```json
{ "id": "w1", "shopId": "s4", "pid": "ea-m800", "brand": "", "qty": 1,   // brand "" = any brand "offer": 44000, "note": "…", "open": true, "at": "ISO date" }
```

## Visibility rule (server-side in production)
```
visible(shopA, shopB) = shopA.id != shopB.id AND distance_km(shopA, shopB) > HIDE_KM   // HIDE_KM = 3
```
Enforce this in the API or database row-level security, not only in the UI. Never send a hidden shop's data to the client.
