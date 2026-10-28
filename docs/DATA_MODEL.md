# Data model

Today everything lives in one object saved to `localStorage["pd5.net"]`. These shapes are what the backend tables should look like when it is built (see ROADMAP.md).

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
In production, add `brand`, `oem_numbers[]`, `gst_rate`, `image_url`, and a proper vehicle-fitment table (make, model, years, engine).

## Shop (tenant)
```json
{
  "id": "s1", "name": "Sai Auto Spares", "owner": "Sanjay Patil",
  "area": "Grant Road, Mumbai", "addr": "…", "gstin": "27AAPFS1234K1Z9",
  "phone": "+91 …", "lat": 18.9633, "lng": 72.8160, "prefix": "SAS",
  "inventory": [ /* shop stock item */ ],
  "customers": [ /* customer */ ],
  "bills": [ /* bill */ ],
  "slipSeq": 0
}
```
In production add `logo_url`, `brand_color`, `plan`, `branches[]`, `staff[]` (role: owner | cashier | store).

## Shop stock item
A catalogue part plus the shop's own numbers:
```json
{ "...catalogue fields": "", "stock": 85, "reorder": 20, "rack": "R3-B2" }
```

## Vendor
```json
{
  "id": "v1", "name": "Mahalaxmi Lubricants & Filters", "kind": "Lubricants · Filters",
  "area": "Bhiwandi", "phone": "+91 …", "lat": 19.28, "lng": 73.04,
  "stock": [{ "pid": "eo-5w30", "qty": 180, "price": 1890, "moq": 6 }]
}
```

## Customer (per shop)
```json
{ "id": "c1", "name": "Raju Motor Garage", "type": "Mechanic / garage", "phone": "+91 …", "gstin": "", "due": 12400 }
```
`type`: "Retail" | "Mechanic / garage" | "Fleet / business". `due` is the khata balance. In production, keep a `khata_entries` ledger (bill credit +, payment −) and derive `due` from it.

## Bill
```json
{
  "no": "SAS/26-27/0021",
  "date": "2026-10-28T11:20:00.000Z",
  "customer": { "id": "c1", "name": "…", "type": "…", "phone": "…", "gstin": "…" },
  "payment": "Split",                       // Cash | UPI | Card | Credit | Split
  "payParts": [{ "mode": "Cash", "amount": 5000 }, { "mode": "Credit", "amount": 10871 }],
  "ref": "UTR / last 4 / change given",
  "discount": { "type": "pct", "value": 3 },   // pct | amt
  "slip": "PS-0004",
  "items": [{ "id": "of-swift", "name": "…", "pn": "…", "hsn": "8421", "cat": "Filters", "qty": 12, "list": 260, "cost": 188, "rate": 260, "amount": 3120 }],
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
  "pid": "bs-splendor", "qty": 15, "price": 260, "note": "…",
  "status": "pending",                // pending | shared | declined
  "at": "ISO date",
  "wid": "w4"                         // set when it answers a Wanted post
}
```

## Wanted post
```json
{ "id": "w1", "shopId": "s4", "pid": "ea-m800", "qty": 1, "offer": 44000, "note": "…", "open": true, "at": "ISO date" }
```

## Visibility rule (server-side in production)
```
visible(shopA, shopB) = shopA.id != shopB.id AND distance_km(shopA, shopB) > HIDE_KM   // HIDE_KM = 3
```
Enforce this in the API or database row-level security, not only in the UI. Never send a hidden shop's data to the client.
