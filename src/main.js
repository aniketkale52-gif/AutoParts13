/* PartsDesk POS app logic (vanilla JS, no framework).
   Data is demo data kept in localStorage until a backend exists. See docs/PRODUCT.md. */
(function(){
const HIDE_KM=3, GST=18;
const CATS=["Engine","Filters","Brakes","Clutch","Electrical","Lighting","Cooling","Suspension","Steering","Wheels","Transmission","Fuel","AC","Lubricants","Cables","Body"];

/* ---------- icons ---------- */
const P={
 Engine:'<path d="M3 10h2V8h3V6h7v2h2l2 2h2v6h-2l-2 2H9l-3-3H3z"/><path d="M9 6V4h5v2"/>',
 Brakes:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M18 6.5a8.5 8.5 0 0 1 2 5"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2"/>',
 Clutch:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/>',
 Filters:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M7 7h10M7 17h10M10 7v10M14 7v10"/>',
 Electrical:'<path d="M13 2 5 13h6l-1 9 8-11h-6z"/>',
 Lubricants:'<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
 Suspension:'<path d="M8 3h8M8 21h8M12 3v2M12 19v2"/><path d="M8 7l8 2-8 2 8 2-8 2 8 2"/>',
 Transmission:'<circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="4.5"/><path d="M7 9l10-1.5M7 15l10 1.5"/>',
 Cables:'<path d="M3 17c4 0 4-10 9-10s5 10 9 10"/><circle cx="3" cy="17" r="1.5"/><circle cx="21" cy="17" r="1.5"/>',
 Lighting:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
 Cooling:'<path d="M10 14V4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0z"/><path d="M12 9v6"/>',
 Steering:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M3.5 10.5 10 12M20.5 10.5 14 12M12 14v7"/>',
 Wheels:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/><path d="m12 3 1.5 2M21 12l-2 1.5M12 21l-1.5-2M3 12l2-1.5"/>',
 Fuel:'<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M4 10h10"/><path d="M14 8h2l3 3v7a1.5 1.5 0 0 1-3 0v-3h-2"/>',
 AC:'<path d="M12 2v20M4 7l16 10M20 7 4 17"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2"/>',
 Body:'<path d="M4 19a10 10 0 0 1 16 0"/><path d="M12 19 6 8"/><circle cx="12" cy="19" r="1.4"/>',
 sale:'<path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
 bills:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
 customers:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4.5a3 3 0 0 1 0 6M21 20c0-2.6-1.6-4.8-4-5.6"/>',
 inventory:'<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
 reports:'<path d="M4 20V11M10 20V5M16 20v-6M3 20h18"/>',
 find:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
 wanted:'<path d="M3 10v4l11 5V5z"/><path d="M14 9h2a3 3 0 0 1 0 6h-2M6 15l1 5h3l-1-4"/>',
 deals:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
 vstock:'<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
 moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 swap:'<path d="M7 7h13M17 4l3 3-3 3M17 17H4M7 14l-3 3 3 3"/>',
 Cash:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9v.01M18 15v.01"/>',
 UPI:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10.5 18.5h3M10 7l2.5 3.5L10 14"/>',
 Card:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
 Credit:'<path d="M5 4h11a3 3 0 0 1 3 3v14H8a3 3 0 0 1-3-3z"/><path d="M5 18a3 3 0 0 1 3-3h11M9 8h6"/>',
 Split:'<path d="M12 21v-7l-6-6M12 14l6-6M6 3v5h5M18 3v5h-5"/>',
 slip:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM8.5 11h7M8.5 15h4.5"/>',
 car:'<path d="M5 17H3.5v-3.5L6 9h9l4 4.5h1.5V17H19"/><path d="M9 17h6M6 13.5h13"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
 bike:'<circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/><path d="M8 17h6l2.5-5"/><path d="M3 12h6l2 2h3.5"/><path d="m19 17-3-7h-2.5"/><path d="M16 10h2.5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 check:'<path d="m5 12 5 5L20 7"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>'
};
// Vehicle on a card: a small car and/or bike icon; the words are in title and the card label for screen readers.
const VEHW={"2W":"Two-wheeler","4W":"Four-wheeler",Both:"Two-wheeler and four-wheeler"};
const vehIc=v=>`<span class="veh veh-ic" title="${VEHW[v]||""}">${v!=="4W"?ic("bike",1.7):""}${v!=="2W"?ic("car",1.7):""}</span>`;
const ic=(k,w)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w||1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k]||P.Engine}</svg>`;

/* ---------- catalogue: name, fits, pn, veh, cat, hsn, price, tiers, cost ---------- */
const CATALOG=[
 // id, name, fits, part no., vehicle, category, HSN, price, bulk tiers [[min qty, price]], cost
 ["eo-5w30","Engine oil 5W-30, 3.5 L","BS6 petrol cars","EO-4W-530-35","4W","Lubricants","2710",2240,[[6,2090]],1910],
 ["eo-10w30","Engine oil 10W-30, 1 L","4-stroke bikes and scooters","EO-2W-1030-1L","2W","Lubricants","2710",395,[[12,368]],318],
 ["eo-15w40","Engine oil 15W-40 diesel, 7.5 L","Bolero, Scorpio, Innova diesel","EO-4W-1540-75","4W","Lubricants","2710",3650,[[4,3420]],3120],
 ["of-swift","Engine oil filter","Maruti Swift, Dzire, Baleno, WagonR","OF-MS-1450","4W","Filters","8421",260,[[20,232],[100,214]],188],
 ["of-hy","Engine oil filter","Hyundai i10, i20, Venue petrol","OF-HY-2630","4W","Filters","8421",285,[[20,255]],205],
 ["of-re","Engine oil filter","Royal Enfield Classic 350 (J-series)","OF-RE-350J","2W","Filters","8421",180,[[20,158]],125],
 ["af-nexon","Air filter","Tata Nexon petrol","AF-TN-P22","4W","Filters","8421",690,[[10,630]],520],
 ["af-activa","Air filter element","Honda Activa 5G / 6G","AF-HA6G-12","2W","Filters","8421",165,[[20,142]],112],
 ["cf-creta","Cabin air filter","Hyundai Creta, Kia Seltos","CF-HC-SEL","4W","Filters","8421",540,[[10,485]],380],
 ["ff-mh","Fuel filter (diesel)","Mahindra Scorpio, XUV500 mHawk","FF-MH-XUV","4W","Filters","8421",1150,[[5,1060]],880],
 ["sp-2w","Spark plug","Most 100–150cc bikes and scooters","SP-2W-CPR8","2W","Electrical","8511",120,[[25,104],[100,96]],84],
 ["sp-4w","Iridium spark plug","Hyundai and Kia 1.2 petrol","SP-4W-IR12","4W","Electrical","8511",780,[[8,720]],610],
 ["bp-i20","Front brake pad set","Hyundai i20 (2015–2020)","BP-HI20-F","4W","Brakes","8708",1890,[[5,1760]],1520],
 ["bp-swift","Front brake pad set","Maruti Swift, Dzire (2018 on)","BP-MS18-F","4W","Brakes","8708",1450,[[5,1340]],1150],
 ["bs-splendor","Brake shoe set","Hero Splendor+, HF Deluxe","BS-HS-1021","2W","Brakes","8714",285,[[10,255],[50,235]],196],
 ["bs-alto","Rear brake shoe set","Maruti Alto 800 / K10","BS-MA-R800","4W","Brakes","8708",980,[[5,900]],760],
 ["bd-swift","Brake disc (front)","Maruti Swift, Dzire","BD-MS-FR","4W","Brakes","8708",2350,[[4,2180]],1890],
 ["bdr-bolero","Brake drum (rear)","Mahindra Bolero","BDR-MB-R","4W","Brakes","8708",3150,[[4,2950]],2620],
 ["bmc-wagonr","Brake master cylinder","Maruti WagonR, Alto K10","BMC-MWR","4W","Brakes","8708",2450,[[3,2290]],1980],
 ["bf-dot4","Brake fluid DOT 4, 500 ml","Cars and bikes with disc brakes","BF-DOT4-500","Both","Lubricants","3819",290,[[24,262]],205],
 ["mbp-pulsar","Motorcycle brake pad set","Bajaj Pulsar 150 / NS200 (front)","BP-BP-NS-F","2W","Brakes","8714",420,[[10,385]],310],
 ["mbp-activa","Motorcycle brake pad set","Honda Activa 125, Dio (front disc)","BP-HA125-F","2W","Brakes","8714",340,[[10,310]],262],
 ["cp-alto","Clutch plate","Maruti Alto 800 / K10","CP-MA800-02","4W","Clutch","8708",2150,[[5,1990]],1745],
 ["ck-swift","Clutch kit (plate, cover, bearing)","Maruti Swift, Dzire petrol","CK-MS-3PC","4W","Clutch","8708",6850,[[3,6450]],5780],
 ["cp-pulsar","Clutch plate set","Bajaj Pulsar 150 / 180","CP-BP150-07","2W","Clutch","8714",640,[[10,585]],470],
 ["cc-splendor","Clutch cable","Hero Splendor+, Passion","CC-HS-04","2W","Cables","8714",145,[[20,128]],98],
 ["db-i10","Drive belt (alternator)","Hyundai Grand i10, Aura","DB-HI10-6PK","4W","Engine","4010",720,[[5,665]],540],
 ["tb-wagonr","Timing belt","Maruti WagonR K10","TB-MWR-K10","4W","Engine","4010",1180,[[5,1095]],915],
 ["bt-35","Battery 12V 35Ah","Hatchbacks and compact sedans","BT-12V35-4W","4W","Electrical","8507",4950,[[3,4700]],4380],
 ["bt-5","Battery 12V 5Ah","Scooters and commuter bikes","BT-12V5-2W","2W","Electrical","8507",1650,[[5,1540]],1395],
 ["alt-bolero","Alternator 90A","Mahindra Bolero, Scorpio (mHawk)","AL-MB-90A","4W","Electrical","8511",9800,[[2,9300]],8350],
 ["sm-swift","Starter motor","Maruti Swift, Dzire petrol","SM-MS-12V","4W","Electrical","8511",6400,[[2,6050]],5420],
 ["hb-h4","Headlight bulb H4 60/55W","Cars and bikes with H4 fitting","HB-H4-6055","Both","Lighting","8539",220,[[20,192]],148],
 ["ha-swift","Headlight assembly (left)","Maruti Swift (2018 on)","HA-MS18-L","4W","Lighting","8512",5600,[[2,5300]],4650],
 ["tl-creta","Tail light assembly (right)","Hyundai Creta (2020 on)","TL-HC20-R","4W","Lighting","8512",4800,[[2,4550]],3950],
 ["ib-21w","Indicator bulb 12V 21W, amber","Most cars and bikes","IB-21W-AMB","Both","Lighting","8539",35,[[50,28]],20],
 ["wb-24","Wiper blade 24\"","Mahindra Bolero, Scorpio","WB-24-MB","4W","Body","8512",420,[[10,375]],305],
 ["wm-swift","Wiper motor (front)","Maruti Swift, Dzire","WM-MS-FR","4W","Electrical","8501",3250,[[2,3050]],2680],
 ["rad-alto","Radiator","Maruti Alto 800","RD-MA800","4W","Cooling","8708",3900,[[2,3680]],3250],
 ["cl-1l","Coolant, 1 L","All cars, ready to use","CL-1L-G12","4W","Cooling","3820",310,[[12,282]],228],
 ["th-hy","Thermostat","Hyundai i10, i20 petrol","TH-HY-82C","4W","Cooling","8481",850,[[5,780]],640],
 ["wp-swift","Water pump","Maruti Swift, Ertiga petrol (K-series)","WP-MS-K12","4W","Cooling","8413",2350,[[3,2190]],1880],
 ["rh-bolero","Radiator hose (upper)","Mahindra Bolero","RH-MB-UP","4W","Cooling","4009",560,[[5,510]],410],
 ["sa-swift","Front shock absorber","Maruti Swift (2018 on)","SA-MS18-F","4W","Suspension","8708",3350,[[4,3150]],2690],
 ["sa-shine","Rear shock absorber pair","Honda Shine, Unicorn","SA-HS-RR","2W","Suspension","8714",1450,[[5,1350]],1120],
 ["fs-creta","Front strut assembly","Hyundai Creta (2015–2020)","FS-HC15-F","4W","Suspension","8708",6200,[[2,5900]],5150],
 ["bj-innova","Lower ball joint","Toyota Innova, Innova Crysta","BJ-TI-LW","4W","Steering","8708",1250,[[4,1160]],960],
 ["tre-swift","Tie rod end","Maruti Swift, Dzire","TR-MS-OUT","4W","Steering","8708",690,[[6,635]],510],
 ["cab-hy","Control arm bush kit","Hyundai i20, Verna","CAB-HY-KIT","4W","Suspension","4016",780,[[6,715]],575],
 ["wbr-swift","Front wheel bearing","Maruti Swift, Baleno, Dzire","WBR-MS-F","4W","Wheels","8482",1350,[[4,1250]],1040],
 ["whub-xuv","Wheel hub assembly (front)","Mahindra XUV500","WH-MX5-F","4W","Wheels","8708",5450,[[2,5150]],4600],
 ["ty-185","Car tyre 185/65 R15","Swift, Dzire, Baleno, i20","TY-1856515","4W","Wheels","4011",5200,[[4,4950]],4480],
 ["ty-9090","Motorcycle tyre 90/90-17 (rear)","Splendor, Passion, Shine","TY-909017R","2W","Wheels","4011",1650,[[4,1560]],1340],
 ["fp-hy","Fuel pump assembly","Hyundai i20, Verna petrol","FP-HY-IN","4W","Fuel","8413",4650,[[2,4400]],3880],
 ["fi-mh","Fuel injector (diesel)","Mahindra Scorpio, XUV500 mHawk","FI-MH-CR","4W","Fuel","8409",8900,[[2,8450]],7650],
 ["ic-swift","Ignition coil","Maruti Swift, Baleno (K12)","IC-MS-K12","4W","Electrical","8511",1850,[[4,1720]],1450],
 ["em-swift","Engine mount (right)","Maruti Swift, Dzire","EM-MS-RH","4W","Engine","8708",1450,[[4,1350]],1110],
 ["acc-creta","AC compressor","Hyundai Creta, Verna","AC-HC-CMP","4W","AC","8414",18500,[],16400],
 ["acf-swift","AC cabin filter (activated carbon)","Maruti Swift, Baleno, Brezza","ACF-MS-SW","4W","AC","8421",420,[[10,375]],290],
 ["cvj-swift","CV joint (outer)","Maruti Swift, Dzire","CVJ-MS-OUT","4W","Transmission","8708",2650,[[3,2480]],2150],
 ["cvb-kit","CV boot kit","Maruti Swift, Alto, WagonR","CVB-MS-KIT","4W","Transmission","4016",380,[[10,340]],250],
 ["ck-apache","Motorcycle chain kit","TVS Apache RTR 160","CS-TA160-03","2W","Transmission","8714",1450,[[5,1360]],1120],
 ["ea-m800","Engine assembly, reconditioned","Maruti 800 MPFI","EA-M800-R","4W","Engine","8407",46500,[],41200]
].map(r=>({id:r[0],name:r[1],fits:r[2],pn:r[3],veh:r[4],cat:r[5],hsn:r[6],price:r[7],tiers:r[8].map(t=>({min:t[0],price:t[1]})),cost:r[9]}));
// Catalogue part id -> photo in public/parts (Wikimedia Commons, see public/parts/CREDITS.txt). Parts not listed show their category icon.
const PHOTOS={"eo-5w30":"engine-oil","eo-10w30":"engine-oil","eo-15w40":"engine-oil","of-swift":"oil-filter","of-hy":"oil-filter","of-re":"oil-filter",
 "af-nexon":"cabin-filter","af-activa":"air-filter-2w","cf-creta":"cabin-filter","acf-swift":"cabin-filter","ff-mh":"fuel-filter","sp-2w":"spark-plug","sp-4w":"spark-plug",
 "bp-i20":"brake-pads","bp-swift":"brake-pads","mbp-pulsar":"brake-pads","mbp-activa":"brake-pads","bs-splendor":"brake-shoes","bs-alto":"brake-shoes","bd-swift":"brake-disc",
 "bdr-bolero":"brake-drum","bmc-wagonr":"master-cylinder","cp-alto":"clutch-plate","cp-pulsar":"clutch-plate","ck-swift":"clutch-kit","cc-splendor":"clutch-cable",
 "tb-wagonr":"timing-belt","bt-35":"battery-car","bt-5":"battery-2w","alt-bolero":"alternator","hb-h4":"h4-bulb","ha-swift":"headlight","tl-creta":"tail-light",
 "ib-21w":"indicator-bulb","wb-24":"wiper-blade","wm-swift":"wiper-motor","cl-1l":"coolant","th-hy":"thermostat","sa-swift":"shock-absorber","sa-shine":"shock-2w",
 "fs-creta":"strut","tre-swift":"tie-rod-end","wbr-swift":"wheel-bearing","whub-xuv":"wheel-hub","ty-185":"tyre-car","ty-9090":"tyre-2w","fp-hy":"fuel-pump",
 "fi-mh":"fuel-injector","ic-swift":"ignition-coil","acc-creta":"ac-compressor","cvj-swift":"cv-joint","cvb-kit":"cv-boot","ck-apache":"chain-kit","ea-m800":"engine"};
const art=p=>PHOTOS[pidOf(p)]?`<img src="${import.meta.env.BASE_URL}parts/${PHOTOS[pidOf(p)]}.jpg" alt="" loading="lazy" decoding="async">`:ic(p.cat,1.5);
// Brands each catalogue part is sold under in the demo, as [brand, price factor vs. the catalogue price]. Shops stock a part once per brand.
const BSETS={
 oil:[["Servo",.88],["Gulf",.95],["Castrol",1],["Shell",1.06]],fluid:[["Bosch",1],["Castrol",1.08]],coolant:[["Servo",.92],["Prestone",1]],
 filter:[["Purolator",.9],["Bosch",1],["Mahle",1.1]],plug:[["Bosch",.95],["NGK",1]],battery:[["Exide",.94],["Amaron",1]],
 brake:[["TVS Girling",.9],["Rane",.96],["Bosch",1]],clutch:[["Valeo",.94],["LuK",1]],cable:[["Uno Minda",1]],belt:[["Contitech",.94],["Gates",1]],
 elec:[["Lucas TVS",.92],["Bosch",1]],bulb:[["Osram",.9],["Philips",1]],lamp:[["Lumax",.95],["Uno Minda",1]],wiper:[["Valeo",.95],["Bosch",1]],
 radiator:[["Subros",.93],["Denso",1]],thermo:[["Wahler",1]],pump:[["GMB",.92],["Aisin",1]],hose:[["Gates",1]],susp:[["Gabriel",.9],["Monroe",1]],
 steer:[["Rane",.92],["Moog",1]],bearing:[["NBC",.88],["SKF",1]],hub:[["SKF",1]],tyre4:[["Apollo",.94],["CEAT",.97],["MRF",1]],tyre2:[["TVS Eurogrip",.93],["MRF",1]],
 fuel:[["Delphi",.94],["Bosch",1]],ac:[["Sanden",.93],["Denso",1]],cv:[["GKN",1]],chain:[["Rolon",.92],["Diamond",1]],mount:[["Rane",1]],engine:[["Shop rebuild",1]]};
const BSET_OF={"eo-":"oil","of-":"filter","af-":"filter","cf-":"filter","ff-":"filter","acf-":"filter","sp-":"plug","bp-":"brake","mbp-":"brake","bs-":"brake","bd-":"brake","bdr-":"brake","bmc-":"brake",
 "bf-":"fluid","cp-":"clutch","ck-swift":"clutch","cc-":"cable","db-":"belt","tb-":"belt","bt-":"battery","alt-":"elec","sm-":"elec","ic-":"elec","wm-":"elec","hb-":"bulb","ib-":"bulb",
 "ha-":"lamp","tl-":"lamp","wb-":"wiper","rad-":"radiator","cl-":"coolant","th-":"thermo","wp-":"pump","rh-":"hose","sa-":"susp","fs-":"susp","bj-":"steer","tre-":"steer","cab-":"steer",
 "wbr-":"bearing","whub-":"hub","ty-185":"tyre4","ty-9090":"tyre2","fp-":"fuel","fi-":"fuel","em-":"mount","acc-":"ac","cvj-":"cv","cvb-":"cv","ck-apache":"chain","ea-":"engine"};
const bset=pid=>BSETS[BSET_OF[Object.keys(BSET_OF).filter(k=>pid.startsWith(k)).sort((a,b)=>b.length-a.length)[0]]]||[["Bosch",1]];
const BRANDS0=[...new Set(Object.values(BSETS).flat().map(b=>b[0]))].sort((a,b)=>a.localeCompare(b));
const RACKS={Engine:"R5",Filters:"R3",Brakes:"R1",Clutch:"R2",Electrical:"R4",Lighting:"R9",Cooling:"R10",Suspension:"R7",Steering:"R7",Wheels:"R11",Transmission:"R2",Fuel:"R5",AC:"R10",Lubricants:"R6",Cables:"R8",Body:"R8"};
// Sai Auto Spares: [stock, reorder level]. Parts not listed get a typical level from their price.
const S1_FIXED={"eo-5w30":[0,6],"cc-splendor":[0,10],"mbp-activa":[4,8],"wb-24":[3,6],"ea-m800":[1,1],"acc-creta":[1,1],"ha-swift":[1,2],"ty-185":[3,4],"rad-alto":[0,1],"of-swift":[85,20],"sp-4w":[32,8],"af-nexon":[22,6]};
function s1Stock(p,i){if(S1_FIXED[p.id])return S1_FIXED[p.id];const h=(i*37+11)%10;
  if(p.price<300)return [60+h*9,15];if(p.price<1000)return [18+h*3,6];if(p.price<5000)return [6+h,3];return [2+(h%3),1]}

const SHOPS0=[
 {id:"s1",name:"Sai Auto Spares",owner:"Sanjay Patil",area:"Grant Road, Mumbai",addr:"Shop 14, Lamington Road, Grant Road (E), Mumbai 400007",gstin:"27AAPFS1234K1Z9",phone:"+91 90000 00101",lat:18.9633,lng:72.8160,prefix:"SAS"},
 {id:"s2",name:"Om Motors & Spares",owner:"Imran Shaikh",area:"Girgaon, Mumbai",addr:"Girgaon Road, Mumbai 400004",gstin:"27AAQFO2231L1Z2",phone:"+91 90000 00102",lat:18.9550,lng:72.8130,prefix:"OMS",stock:{"eo-5w30":14,"of-swift":30,"bs-splendor":20,"sp-2w":60,"hb-h4":40,"af-activa":25,"ib-21w":200,"cl-1l":36}},
 {id:"s3",name:"Kurla Auto Parts",owner:"Rakesh Yadav",area:"Kurla West, Mumbai",addr:"LBS Marg, Kurla (W), Mumbai 400070",gstin:"27AAKFK8810P1Z7",phone:"+91 90000 00103",lat:19.0726,lng:72.8845,prefix:"KAP",stock:{"eo-5w30":8,"of-swift":12,"bp-i20":6,"af-nexon":9,"cc-splendor":15,"bt-35":3,"sa-swift":4,"sp-2w":40,"ty-185":8,"rad-alto":2,"wbr-swift":6}},
 {id:"s4",name:"Thane Spares Hub",owner:"Prakash Joshi",area:"Naupada, Thane",addr:"Gokhale Road, Naupada, Thane 400602",gstin:"27AATFT4410Q1Z1",phone:"+91 90000 00104",lat:19.1972,lng:72.9636,prefix:"TSH",stock:{"eo-5w30":3,"eo-10w30":40,"cp-pulsar":10,"cp-alto":2,"wb-24":12,"tb-wagonr":3,"hb-h4":30,"eo-15w40":10,"bdr-bolero":2,"rh-bolero":6}},
 {id:"s5",name:"Vashi Moto Parts",owner:"Deepak Nair",area:"Sector 17, Vashi",addr:"Sector 17, Vashi, Navi Mumbai 400703",gstin:"27AAVFV7781R1Z4",phone:"+91 90000 00105",lat:19.0771,lng:72.9986,prefix:"VMP",stock:{"eo-5w30":20,"sp-2w":80,"bt-5":6,"sp-4w":12,"db-i10":5,"cl-1l":30,"bs-splendor":25,"ty-9090":10,"ck-apache":6,"mbp-pulsar":14}}
];
const VENDORS0=[
 {id:"v1",name:"Mahalaxmi Lubricants & Filters",kind:"Lubricants · Filters",area:"Bhiwandi",phone:"+91 90000 00201",lat:19.2813,lng:73.0483,stock:{"eo-5w30":[180,1890,6],"eo-10w30":[420,330,12],"eo-15w40":[60,3080,4],"cl-1l":[260,250,12],"bf-dot4":[300,215,24],"of-swift":[0,215,20],"of-hy":[150,232,20],"af-activa":[300,128,20],"af-nexon":[45,560,5],"cf-creta":[80,420,10],"ff-mh":[40,960,5],"acf-swift":[120,320,10]}},
 {id:"v2",name:"Shree Ganesh Auto Distributors",kind:"Multi-brand spares",area:"Lamington Road, Mumbai",phone:"+91 90000 00202",lat:18.9642,lng:72.8185,stock:{"eo-5w30":[0,1910,6],"of-swift":[240,210,20],"bs-splendor":[300,225,10],"sp-2w":[900,92,25],"cc-splendor":[0,112,20],"hb-h4":[350,180,20],"ib-21w":[2000,24,100],"mbp-activa":[80,280,10],"tre-swift":[40,560,6],"cvb-kit":[90,280,10],"em-swift":[20,1180,4]}},
 {id:"v3",name:"Western Brake & Clutch Co.",kind:"Brakes · Clutch · Steering",area:"Andheri MIDC",phone:"+91 90000 00203",lat:19.1136,lng:72.8697,stock:{"bs-splendor":[500,220,20],"cp-pulsar":[90,540,10],"mbp-activa":[0,275,10],"bp-i20":[40,1650,4],"bp-swift":[60,1240,4],"cp-alto":[25,1880,4],"ck-swift":[12,5950,2],"bd-swift":[18,1990,2],"bdr-bolero":[10,2720,2],"bmc-wagonr":[8,2150,2],"bj-innova":[30,1020,4],"mbp-pulsar":[120,330,10]}},
 {id:"v4",name:"Navi Mumbai Auto Electricals",kind:"Batteries · Electricals · Lighting",area:"Turbhe MIDC",phone:"+91 90000 00204",lat:19.0760,lng:73.0170,stock:{"bt-5":[60,1450,5],"bt-35":[22,4520,2],"sp-4w":[0,690,8],"sp-2w":[1200,90,50],"hb-h4":[400,175,20],"alt-bolero":[6,8650,1],"sm-swift":[9,5600,1],"ic-swift":[35,1520,4],"wm-swift":[7,2800,1],"ha-swift":[4,4900,1],"tl-creta":[0,4100,1]}},
 {id:"v5",name:"Deccan Cooling, AC & Tyres",kind:"Cooling · AC · Tyres · Suspension",area:"Vasai East",phone:"+91 90000 00205",lat:19.3919,lng:72.8397,stock:{"rad-alto":[14,3350,2],"th-hy":[40,690,5],"wp-swift":[20,1980,2],"rh-bolero":[50,450,5],"acc-creta":[3,16900,1],"ty-185":[48,4600,4],"ty-9090":[80,1420,4],"sa-swift":[16,2800,2],"fs-creta":[6,5300,1],"wbr-swift":[30,1090,4],"whub-xuv":[5,4750,1],"fp-hy":[6,4000,1],"fi-mh":[0,7900,2]}}
];
// Extra brands some suppliers carry for a part they already list: [pid, brand, qty, price, moq].
const VENDOR_EXTRA={v1:[["eo-5w30","Servo",90,1690,6],["eo-10w30","Castrol",200,355,12]],v4:[["bt-35","Exide",30,4250,2],["sp-2w","NGK",600,96,50]]};
const CTYPES=["Retail","Mechanic / garage","Fleet / business"];
const WALKIN={id:"walkin",name:"Walk-in customer",type:"Retail",phone:"",gstin:"",due:0};

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const clone=o=>JSON.parse(JSON.stringify(o));
const r2=x=>Math.round((x+Number.EPSILON)*100)/100;
const money=n=>"₹"+Number(n).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const money0=n=>"₹"+Number(Math.round(n*100)/100).toLocaleString("en-IN",{maximumFractionDigits:2});
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cat=id=>CATALOG.find(p=>p.id===id);
// Inventory and supplier rows are one per part per brand. pid is the catalogue part; id is unique to the brand.
const pidOf=p=>p.pid||p.id;
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,"");
const vid=(pid,brand)=>pid+"--"+slug(brand);
const full=p=>p.brand?p.brand+" "+p.name:p.name;
const nice=n=>n<100?Math.round(n):n<1000?Math.round(n/5)*5:Math.round(n/10)*10;
function variant(p,brand,f){const price=nice(p.price*f);
  return {...clone(p),pid:p.id,id:vid(p.id,brand),brand,pn:p.pn+"-"+slug(brand).slice(0,3).toUpperCase(),price,cost:nice((p.cost||0)*f),tiers:p.tiers.map(t=>({min:t.min,price:nice(t.price*f)})).filter(t=>t.price<price)}}
const brandsOf=list=>[...new Set(list.map(p=>p.brand).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
const initials=n=>n.replace(/[^A-Za-z ]/g,"").split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();
function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function read(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){return null}}
function km(a,b){const R=6371,t=x=>x*Math.PI/180;const dLa=t(b.lat-a.lat),dLo=t(b.lng-a.lng);const h=Math.sin(dLa/2)**2+Math.cos(t(a.lat))*Math.cos(t(b.lat))*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
const kmTxt=(a,b)=>km(a,b).toFixed(1)+" km";
function ago(iso){const m=Math.round((Date.now()-new Date(iso))/60000);if(m<1)return "just now";if(m<60)return m+" min ago";const h=Math.round(m/60);if(h<24)return h+" h ago";const d=Math.round(h/24);return d+(d>1?" days":" day")+" ago"}
function fy(d){const y=d.getFullYear(),s=d.getMonth()>=3?y:y-1;return String(s).slice(2)+"-"+String(s+1).slice(2)}
function unitRate(p,qty){let rate=p.price;for(const t of p.tiers){if(qty>=t.min&&t.price<rate)rate=t.price}return rate}
function nextTier(p,qty){return p.tiers.filter(t=>t.min>qty).sort((a,b)=>a.min-b.min)[0]}
function stockState(p){return p.stock<=0?"out":(p.stock<=p.reorder?"low":"ok")}
const dshort=d=>d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"});
const tshort=d=>d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});

/* ---------- theme ---------- */
function effTheme(){const t=document.documentElement.dataset.theme;if(t==="dark"||t==="light")return t;return matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}
function setTheme(t){document.documentElement.dataset.theme=t;store("pd.theme",t);paintThemeBtns()}
function paintThemeBtns(){const d=effTheme()==="dark";document.querySelectorAll("[data-theme-toggle]").forEach(b=>{b.innerHTML=(b.classList.contains("nav")?ic(d?"sun":"moon"):ic(d?"sun":"moon"))+`<span>${d?"Light mode":"Dark mode"}</span>`})}
const savedTheme=read("pd.theme");if(savedTheme)document.documentElement.dataset.theme=savedTheme;

/* ---------- state ---------- */
let net,session,me,inventory=[],bills=[];
let cart=[],cartCust="walkin",discount={type:"pct",value:0},slipSent=null;
const f={q:"",veh:"all",cat:"All",brand:""},inv={q:"",low:false},find={q:"",pid:null};
let dealTab="received",vq="",range="7",current="login";
const acct=ref=>ref.t==="shop"?net.shops.find(s=>s.id===ref.id):net.vendors.find(v=>v.id===ref.id);
const isMe=ref=>!!session&&ref.t===session.t&&ref.id===session.id;
const shopsVisibleTo=s=>net.shops.filter(o=>o.id!==s.id&&km(s,o)>HIDE_KM);
const canSee=(a,b)=>a.id!==b.id&&km(a,b)>HIDE_KM;
const vItem=(v,id)=>v.stock.find(x=>x.id===id);
const vItems=(v,pid)=>v.stock.filter(x=>x.pid===pid);
const variantsOf=(list,pid)=>list.filter(p=>pidOf(p)===pid);
const myInterest=(toRef,pid,brand)=>net.interests.find(i=>isMe(i.from)&&i.to.t===toRef.t&&i.to.id===toRef.id&&i.pid===pid&&(i.brand||"")===(brand||"")&&i.kind==="interest"&&i.status!=="declined");
const getCust=id=>id==="walkin"?WALKIN:(me.customers||[]).find(c=>c.id===id)||WALKIN;

function compute(lines,disc,invList=inventory){
  const items=lines.map(l=>{const p=invList.find(x=>x.id===l.id);const rate=unitRate(p,l.qty);
    return {id:p.id,pid:pidOf(p),brand:p.brand||"",name:full(p),pn:p.pn,hsn:p.hsn,cat:p.cat,qty:l.qty,list:p.price,cost:p.cost||0,rate,amount:r2(rate*l.qty)}});
  const subtotal=r2(items.reduce((a,i)=>a+i.amount,0));
  const bulkSave=r2(items.reduce((a,i)=>a+i.list*i.qty,0)-subtotal);
  let d=disc.type==="pct"?subtotal*Math.min(Math.max(disc.value,0),100)/100:Math.min(Math.max(disc.value,0),subtotal);
  d=r2(d);const taxable=r2(subtotal-d);const cgst=r2(taxable*GST/200),sgst=cgst;const raw=r2(taxable+cgst+sgst);const total=Math.round(raw);
  return {items,subtotal,bulkSave,disc:d,taxable,cgst,sgst,roundoff:r2(total-raw),total,units:items.reduce((a,i)=>a+i.qty,0)};
}
const ONES=["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const TENS=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
const two=n=>n<20?ONES[n]:TENS[Math.floor(n/10)]+(n%10?"-"+ONES[n%10]:"");
const three=n=>{const h=Math.floor(n/100),r=n%100;return (h?ONES[h]+" hundred"+(r?" ":""):"")+(r?two(r):"")};
function words(n){if(n===0)return "Zero";const p=[];const cr=Math.floor(n/1e7);n%=1e7;const lk=Math.floor(n/1e5);n%=1e5;const th=Math.floor(n/1e3);n%=1e3;
  if(cr)p.push((cr>=1000?words(cr).toLowerCase():three(cr))+" crore");if(lk)p.push(two(lk)+" lakh");if(th)p.push(two(th)+" thousand");if(n)p.push(three(n));
  const s=p.join(" ");return s.charAt(0).toUpperCase()+s.slice(1)}

/* ---------- seed ---------- */
function seedNet(){
  const now=Date.now(),at=h=>new Date(now-h*3600e3).toISOString();
  let rack=0;
  const shops=SHOPS0.map((s,si)=>{const o=clone(s);
    const mk=(p,[brand,f],stock,reorder,r)=>({...variant(p,brand,f),stock,reorder,rack:r});
    // Sai Auto Spares stocks most brands of each part (cheapest brand gets the most stock); other shops stock one brand.
    o.inventory=s.id==="s1"?CATALOG.flatMap((p,i)=>{const [st,ro]=s1Stock(p,i),set=bset(p.id),r=RACKS[p.cat]+"-B"+(1+(rack++%6));
        const use=set.length>=3?set.filter((b,j)=>j!==i%set.length):set;
        return use.map((b,j)=>mk(p,b,j?Math.round(st*(j===1?.6:.4)):st,j?Math.max(1,Math.round(ro/2)):ro,r))})
      :CATALOG.filter(p=>p.id in s.stock).map(p=>{const set=bset(p.id);return mk(p,set[si%set.length],s.stock[p.id],Math.max(2,Math.round(s.stock[p.id]*.2)),RACKS[p.cat]+"-B"+(1+(rack++%6)))});
    delete o.stock;o.bills=[];o.customers=[];o.slipSeq=0;return o});
  const s1=shops[0];
  s1.customers=[
    {id:"c1",name:"Raju Motor Garage",type:"Mechanic / garage",phone:"+91 90000 00301",gstin:"",due:12400},
    {id:"c2",name:"Shree Ganesh Cabs",type:"Fleet / business",phone:"+91 90000 00302",gstin:"27AAKFS5521M1ZQ",due:38650},
    {id:"c3",name:"Patel Transport Co.",type:"Fleet / business",phone:"+91 90000 00303",gstin:"27AACFP7712N1Z3",due:0},
    {id:"c4",name:"Imtiaz Two-Wheeler Works",type:"Mechanic / garage",phone:"+91 90000 00304",gstin:"",due:4300},
    {id:"c5",name:"Anil Deshmukh",type:"Retail",phone:"+91 90000 00305",gstin:"",due:0}];
  // sample bills across the last 7 days
  let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
  const custPick=["walkin","walkin","walkin","c1","c2","c4","c5","c3"],modes=["Cash","Cash","UPI","UPI","UPI","Card","Credit"];
  let n=0;
  for(let day=6;day>=0;day--){const count=day===0?4:3+Math.floor(rnd()*4);
    for(let k=0;k<count;k++){
      const d=new Date(now-day*864e5);d.setHours(10+Math.floor(rnd()*9),Math.floor(rnd()*60),0,0);if(d>new Date(now))d.setTime(now-(k+1)*40*6e4);
      const cid=custPick[Math.floor(rnd()*custPick.length)];const c=cid==="walkin"?WALKIN:s1.customers.find(x=>x.id===cid);
      const lines=[];const nl=1+Math.floor(rnd()*3);
      for(let j=0;j<nl;j++){const pool=s1.inventory.filter(x=>x.price<7000&&x.pid!=="eo-5w30"),p=pool[Math.floor(rnd()*pool.length)];if(lines.find(l=>l.id===p.id))continue;const bulk=c.type!=="Retail"&&rnd()>.5;lines.push({id:p.id,qty:bulk?10+Math.floor(rnd()*15):1+Math.floor(rnd()*3)})}
      let mode=modes[Math.floor(rnd()*modes.length)];if(mode==="Credit"&&cid==="walkin")mode="Cash";
      const disc=c.type==="Fleet / business"?{type:"pct",value:3}:{type:"pct",value:0};
      const cc=compute(lines,disc,s1.inventory);n++;
      s1.bills.push({no:s1.prefix+"/"+fy(d)+"/"+String(n).padStart(4,"0"),date:d.toISOString(),customer:{id:c.id,name:c.name,type:c.type,phone:c.phone,gstin:c.gstin},payment:mode,payParts:[{mode,amount:cc.total}],discount:disc,...cc,sample:true});
    }}
  s1.bills.sort((a,b)=>new Date(a.date)-new Date(b.date));
  const vendors=VENDORS0.map((v,vi)=>{const stock=Object.entries(v.stock).map(([pid,a],k)=>{const set=bset(pid),b=set[(vi+k)%set.length][0];return {id:vid(pid,b),pid,brand:b,qty:a[0],price:a[1],moq:a[2]}});
    (VENDOR_EXTRA[v.id]||[]).forEach(([pid,b,qty,price,moq])=>{if(!stock.some(x=>x.id===vid(pid,b)))stock.push({id:vid(pid,b),pid,brand:b,qty,price,moq})});
    return {...clone(v),stock}});
  const S=id=>({t:"shop",id}),V=id=>({t:"vendor",id});
  const vb=(id,pid)=>vItems(vendors.find(v=>v.id===id),pid)[0].brand;
  return {shops,vendors,brands:BRANDS0.slice(),
    interests:[
      {id:"i1",kind:"interest",from:S("s1"),to:V("v3"),pid:"mbp-activa",brand:vb("v3","mbp-activa"),qty:20,price:270,note:"Activa pads keep running out. Can you deliver to Grant Road?",status:"shared",at:at(26)},
      {id:"i2",kind:"interest",from:S("s1"),to:V("v1"),pid:"eo-5w30",brand:vb("v1","eo-5w30"),qty:12,price:null,note:"",status:"pending",at:at(1)},
      {id:"i3",kind:"interest",from:S("s3"),to:S("s1"),pid:"bs-splendor",qty:15,price:260,note:"Need by Friday for a fleet job.",status:"pending",at:at(3)},
      {id:"i4",kind:"interest",from:S("s4"),to:V("v1"),pid:"eo-10w30",brand:vb("v1","eo-10w30"),qty:24,price:325,note:"",status:"shared",at:at(50)},
      {id:"i5",kind:"interest",from:S("s5"),to:V("v1"),pid:"eo-5w30",brand:vb("v1","eo-5w30"),qty:6,price:1880,note:"Regular monthly order if price works.",status:"pending",at:at(.7)},
      {id:"i6",kind:"offer",from:S("s4"),to:S("s1"),pid:"wb-24",qty:10,price:365,note:"Have 12 in stock. Can send with our Monday delivery van.",status:"pending",at:at(4),wid:"w4"},
      {id:"i7",kind:"interest",from:S("s3"),to:V("v5"),pid:"ty-185",brand:vb("v5","ty-185"),qty:8,price:4550,note:"For a cab fleet. Need fitting-ready by Saturday.",status:"pending",at:at(6)}],
    wanted:[
      {id:"w1",shopId:"s4",pid:"ea-m800",qty:1,offer:44000,note:"Customer waiting. Maruti 800 MPFI only.",open:true,at:at(5)},
      {id:"w2",shopId:"s5",pid:"cc-splendor",qty:30,offer:120,note:"Bulk for a two-wheeler service centre.",open:true,at:at(20)},
      {id:"w3",shopId:"s2",pid:"bp-i20",qty:4,offer:1700,note:"",open:true,at:at(8)},
      {id:"w4",shopId:"s1",pid:"wb-24",qty:10,offer:360,note:"No supplier has these right now.",open:true,at:at(9)},
      {id:"w5",shopId:"s3",pid:"fi-mh",brand:"Bosch",qty:4,offer:8200,note:"Scorpio mHawk injectors, genuine or Bosch only.",open:true,at:at(14)}]};
}
function save(){store("pd6.net",net)}
function demoCart(){const first=pid=>variantsOf(inventory,pid).find(p=>p.stock>0);
  cart=[["of-swift",12],["sp-4w",4],["af-nexon",1]].map(([pid,qty])=>first(pid)&&{id:first(pid).id,qty}).filter(Boolean);cartCust="c1"}

/* ---------- session & chrome ---------- */
function setMe(){
  me=session?acct(session):null;if(!me)session=null;
  if(session&&session.t==="shop"){inventory=me.inventory;bills=me.bills}else{inventory=[];bills=[]}
  cart=[];cartCust="walkin";discount={type:"pct",value:0};slipSent=null;find.pid=null;find.q="";f.q="";$("#fq").value="";$("#q").value="";$("#discVal").value=0;
}
function login(t,id){session={t,id};store("pd5.me",session);setMe();
  if(t==="shop"&&id==="s1"){demoCart()}
  show(t==="shop"?"counter":"vstock")}
function logout(){session=null;store("pd5.me",null);setMe();show("login")}
const SHOP_NAV=[["Sell"],["counter","New sale"],["bills","Bills"],["customers","Customers"],["Stock"],["inventory","Inventory"],["reports","Reports"],["Network"],["find","Find stock"],["wanted","Wanted"],["deals","Interests"]];
const VENDOR_NAV=[["Supplier"],["vstock","My stock"],["deals","Interests"]];
const pendingIn=()=>net.interests.filter(i=>isMe(i.to)&&i.status==="pending").length;
function renderChrome(){
  $("#app").classList.toggle("no-side",!session);
  if(!session)return;
  const low=session.t==="shop"?inventory.filter(p=>stockState(p)!=="ok").length:0,pin=pendingIn();
  const nav=(session.t==="shop"?SHOP_NAV:VENDOR_NAV).map(n=>n.length===1?`<div class="navgroup">${n[0]}</div>`:
    `<button class="nav" data-view="${n[0]}" ${n[0]===current?'aria-current="page"':""}>${ic(n[0])}<span>${n[1]}</span>${n[0]==="inventory"&&low?`<span class="count warn">${low}</span>`:""}${n[0]==="deals"&&pin?`<span class="count" aria-label="${pin} waiting">${pin}</span>`:""}</button>`).join("");
  $("#side").innerHTML=`<div class="tenant"><span class="logo">${esc(initials(me.name))}</span><div><b>${esc(me.name)}</b><span>${session.t==="shop"?"Counter 1 · "+esc(me.owner):esc(me.area)}</span></div></div>${nav}
    <div class="side-foot"><button class="nav" data-theme-toggle></button><button class="nav" id="acctBtn">${ic("swap")}<span>Switch account</span></button>
    <div class="powered"><i aria-hidden="true"></i>Powered by PartsDesk</div></div>`;
  $("#mLogo").textContent=initials(me.name);$("#mName").textContent=me.name;
  paintThemeBtns();
}
function closeSide(){$("#side").classList.remove("open");$("#sideScrim").hidden=true}

/* ---------- login ---------- */
function renderLogin(){
  $("#accShops").innerHTML=net.shops.map(s=>`<li class="acc"><div><b>${esc(s.name)}</b><span>${esc(s.owner)} · ${esc(s.area)}</span></div><button class="btn btn-secondary btn-sm" data-login="shop:${s.id}">Sign in</button></li>`).join("");
  $("#accVendors").innerHTML=net.vendors.map(v=>`<li class="acc"><div><b>${esc(v.name)}</b><span>${esc(v.kind)} · ${esc(v.area)}</span></div><button class="btn btn-secondary btn-sm" data-login="vendor:${v.id}">Sign in</button></li>`).join("");
  paintThemeBtns();
}

/* ---------- counter ---------- */
// Brand rows that pass the counter's vehicle, brand and search filters. Category is applied separately so chips can count.
function counterList(){const q=f.q.trim().toLowerCase();
  return inventory.filter(p=>(f.veh==="all"||p.veh===f.veh||p.veh==="Both")&&(!f.brand||p.brand===f.brand)&&(!q||(p.name+" "+p.fits+" "+p.pn+" "+p.cat+" "+(p.brand||"")).toLowerCase().includes(q)))}
const groupByPart=list=>{const m=new Map();list.forEach(p=>{const k=pidOf(p);if(!m.has(k))m.set(k,[]);m.get(k).push(p)});return [...m.values()]};
function groupState(vs){const s=vs.reduce((a,v)=>a+v.stock,0);return s<=0?"out":s<=vs.reduce((a,v)=>a+v.reorder,0)?"low":"ok"}
function renderCats(){
  const brands=brandsOf(inventory);if(f.brand&&!brands.includes(f.brand))f.brand="";
  $("#brandF").innerHTML=`<option value="">All brands</option>`+brands.map(b=>`<option${b===f.brand?" selected":""}>${esc(b)}</option>`).join("");
  const counts={},seen=new Set();counterList().forEach(p=>{if(seen.has(pidOf(p)))return;seen.add(pidOf(p));counts[p.cat]=(counts[p.cat]||0)+1});
  const list=["All",...CATS.filter(c=>counts[c])];if(!list.includes(f.cat))f.cat="All";
  $("#cats").innerHTML=list.map(c=>`<button class="chip" data-cat="${esc(c)}" aria-pressed="${c===f.cat}">${esc(c.toUpperCase())}<span class="n">${c==="All"?seen.size:counts[c]}</span></button>`).join("");
}
function renderGrid(){
  const groups=groupByPart(counterList().filter(p=>f.cat==="All"||p.cat===f.cat));
  const inCart=Object.fromEntries(cart.map(l=>[l.id,l.qty]));
  $("#grid").innerHTML=`<button class="tile add" data-goadd>${ic("plus")}Add part</button>`+(groups.length?groups.map(vs=>{const p=vs[0],st=groupState(vs),qty=vs.reduce((a,v)=>a+(inCart[v.id]||0),0);
    const avail=vs.filter(v=>v.stock>0),prices=(avail.length?avail:vs).map(v=>v.price),lo=Math.min(...prices),multi=vs.length>1,stock=vs.reduce((a,v)=>a+v.stock,0);
    const brands=[...new Set(vs.slice().sort((a,b)=>a.price-b.price).map(v=>v.brand).filter(Boolean))].join(", ");
    return `<button class="tile${qty?" in":""}${st==="out"?" oos":""}" data-part="${esc(pidOf(p))}" aria-label="${st==="out"?"Out of stock: ":multi?"Choose a brand of ":"Add "}${esc(multi?p.name:full(p))}, ${esc(p.fits)}, ${VEHW[p.veh]||""}, ${multi?"from ":""}${money0(lo)}">
      <span class="tile-art${PHOTOS[pidOf(p)]?" photo":""}">${art(p)}${vehIc(p.veh)}${qty?`<span class="badge">${qty}</span>`:""}</span>
      <span class="tile-body"><span class="tile-name">${esc(p.name)}</span><span class="tile-fits">${esc(p.fits)}</span>
      <span class="tile-brands">${multi?`${vs.length} brands · `:""}${esc(brands||"No brand")}</span>
      <span class="tile-foot"><span class="stock s-${st}">${st==="out"?"Out":stock+" left"}</span><span class="price-stack"><small${multi&&Math.max(...prices)>lo?"":" class=\"blank\" aria-hidden=\"true\""}>from</small><span class="price">${money0(lo)}</span></span></span></span></button>`}).join("")
    :`<div class="empty" style="grid-column:2/-1">No parts match${f.q?` “${esc(f.q)}”`:""}${f.brand?` in ${esc(f.brand)}`:""}. <button class="btn-link" data-findq="${esc(f.q)}">Search suppliers and shops</button></div>`);
}
// Tapping a card: one brand goes straight on the bill; several brands open the brand picker.
function tapPart(pid){
  const vs=counterList().filter(p=>pidOf(p)===pid),avail=vs.filter(v=>v.stock>0);if(!vs.length)return;
  if(!avail.length){find.pid=cat(pid)?pid:null;find.q=find.pid?"":vs[0].name;$("#fq").value=find.q;toast(`${vs.length>1?vs[0].name:full(vs[0])} is out of stock. Showing who has it.`);return show("find")}
  if(vs.length===1){addToCart(vs[0].id,1);if(matchMedia("(max-width:900px)").matches)toast("Added "+full(vs[0]));return}
  openBrandPick(pid);
}
// Brand picker: set a quantity per brand, then Confirm writes them all to the bill. Quantities start at what is already on the bill.
function openBrandPick(pid){
  const vs=counterList().filter(p=>pidOf(p)===pid).sort((a,b)=>(b.stock>0)-(a.stock>0)||a.price-b.price),p=vs[0];
  const inCart=Object.fromEntries(cart.map(l=>[l.id,l.qty]));
  openOverlay(`<form class="modal" id="pickForm" novalidate><div class="modal-head"><div><span class="label">Choose brands · cheapest first</span><h2>${esc(p.name)}</h2><div class="faint">${esc(p.fits)}</div></div><button type="button" class="icon-btn" data-close aria-label="Close">${ic("x",2)}</button></div>
    <ul class="src brandpick">${vs.map(v=>{const st=stockState(v),q=inCart[v.id]||0,nm=esc(full(v));
      return `<li class="src-row${q?" on":""}"><div class="src-main"><div class="src-title"><span class="src-name">${esc(v.brand||"No brand")}</span><span class="price">${money0(v.price)}</span></div>
        <div class="src-meta"><span class="stock s-${st}">${st==="out"?"Out of stock":v.stock+" left"}</span> · <span class="mono">${esc(v.pn)}</span>${v.tiers[0]?` · ${v.tiers[0].min}+ at ${money0(v.tiers[0].price)} each`:""}</div></div>
        <div class="src-side">${st==="out"?"":`<div class="stepper"><button type="button" data-pstep="-1" data-v="${esc(v.id)}" aria-label="One less ${nm}">−</button><input type="number" min="0" max="${v.stock}" step="1" value="${q}" data-pq="${esc(v.id)}" data-was="${q}" aria-label="Quantity of ${nm}"><button type="button" data-pstep="1" data-v="${esc(v.id)}" aria-label="One more ${nm}">+</button></div>`}</div></li>`}).join("")}</ul>
    ${vs.length<variantsOf(inventory,pid).length?`<p class="faint small" style="margin:0">Some brands are hidden by your search or brand filter.</p>`:""}
    <div class="pick-sum" id="pickSum" aria-live="polite"></div><span class="err" id="pickErr" role="alert"></span>
    <div class="form-actions"><button class="btn btn-primary" type="submit">Confirm</button><button type="button" class="btn-link" data-close>Cancel</button></div></form>`,"Choose brands");
  updatePick();
  const first=$("#pickForm [data-pq]");if(first)first.focus();
}
function pickRows(){return [...document.querySelectorAll("#pickForm [data-pq]")].map(i=>{const v=inventory.find(x=>x.id===i.dataset.pq);return {v,i,qty:Math.min(Math.max(Math.floor(Number(i.value)||0),0),v.stock),was:+i.dataset.was}})}
function updatePick(){const rows=pickRows(),on=rows.filter(r=>r.qty>0),units=on.reduce((a,r)=>a+r.qty,0),amt=on.reduce((a,r)=>a+unitRate(r.v,r.qty)*r.qty,0);
  rows.forEach(r=>r.i.closest(".src-row").classList.toggle("on",r.qty>0));
  $("#pickSum").innerHTML=units?`<span>${on.map(r=>r.qty+" × "+esc(r.v.brand||"No brand")).join(" + ")}</span><b>${units} unit${units>1?"s":""} · ${money0(r2(amt))}</b>`:`<span class="faint">Use + to choose how many of each brand.</span>`;$("#pickErr").textContent=""}
function setQty(id,qty){const p=inventory.find(x=>x.id===id),line=cart.find(l=>l.id===id);if(!line)return;qty=Math.floor(Number(qty)||0);
  if(qty<=0)cart=cart.filter(l=>l.id!==id);else if(qty>p.stock){line.qty=p.stock;toast(`Only ${p.stock} of ${full(p)} in stock`)}else line.qty=qty;slipSent=null;renderCounter()}
function addToCart(id,n=1){const p=inventory.find(x=>x.id===id);if(!p||p.stock<=0)return;const line=cart.find(l=>l.id===id);
  if(line)setQty(id,line.qty+n);else{cart.push({id,qty:Math.min(n,p.stock)});slipSent=null;renderCounter()}}
const billNo=()=>me.prefix+"/"+fy(new Date())+"/"+String(bills.length+1).padStart(4,"0");
const PAYMODES=[["Cash","Cash"],["UPI","UPI"],["Card","Card"],["Credit","Khata"],["Split","Split"]];
function payTiles(c){const cu=getCust(cartCust),dis=!cart.length;
  return `<button class="pay-tile pick" id="pickBtn" ${dis?"disabled":""}><span class="pl">${ic("slip",2)}Pick slip</span><small>${slipSent?"Sent · "+slipSent:"Send to store room"}</small></button>`+
    PAYMODES.map(([m,l])=>`<button class="pay-tile" data-paymode="${m}" ${dis?"disabled":""} ${m==="Credit"&&cu.id==="walkin"?'title="Choose a customer to put this on khata"':""}><span class="amt">${money0(c.total)}</span><span class="pl">${ic(m,2)}${l}</span></button>`).join("")}
function renderCart(){
  const c=compute(cart,discount),cu=getCust(cartCust);
  $("#pickCust").innerHTML=`<span class="avatar">${cu.id==="walkin"?ic("customers"):esc(initials(cu.name))}</span><span style="min-width:0"><b>${esc(cu.name)}</b><small>${esc(cu.type)}${cu.due>0?` · <span class="due">Khata due ${money0(cu.due)}</span>`:cu.gstin?` · GSTIN ${esc(cu.gstin)}`:""}</small></span><span class="chg">${cu.id==="walkin"?"Choose":"Change"}</span>`;
  $("#itemsLabel").textContent=cart.length?`Items in bill · ${c.units} units`:"Items in bill";
  $("#slipOn").innerHTML=slipSent?`<div class="slip-on">${ic("check",2.4)}Pick slip ${esc(slipSent)} sent to store room</div>`:"";
  $("#lines").innerHTML=cart.length?c.items.map(i=>{const p=inventory.find(x=>x.id===i.id),nt=nextTier(p,i.qty),bulk=i.rate<p.price;
    return `<li class="line"><div class="line-top"><span class="line-name">${esc(i.name)}</span><span class="line-price">${bulk?`<s>${money(i.list*i.qty)}</s>`:""}<b>${money(i.amount)}</b></span></div>
      <div class="line-sub"><span class="mono">${esc(i.pn)}</span><span>${money0(i.rate)} each</span>${bulk?`<span class="bulk-on">Bulk rate, saves ${money0((i.list-i.rate)*i.qty)}</span>`:""}${nt?`<span class="bulk-on">${nt.min-i.qty} more for ${money0(nt.price)} each</span>`:""}</div>
      <div class="line-ctrl"><div class="stepper"><button data-dec="${i.id}" aria-label="One less">−</button><input id="qty-${i.id}" type="number" min="0" max="${p.stock}" value="${i.qty}" data-qty="${i.id}" aria-label="Quantity of ${esc(i.name)}"><button data-inc="${i.id}" aria-label="One more">+</button></div>
      <button class="chip-btn" data-add10="${i.id}" aria-label="Add 10 more">+10</button>
      <button class="icon-btn danger" data-remove="${i.id}" aria-label="Remove ${esc(i.name)}">${ic("x",2)}</button></div></li>`}).join("")
    :`<li class="empty" style="margin-top:12px;padding:var(--md) var(--sm)">Tap a part to add it to the bill.<br>Type a quantity for bulk orders.</li>`;
  $("#cartExtras").hidden=!cart.length;
  $("#sum").innerHTML=`<div class="sum-row"><span>Sub total</span><span>${money(c.subtotal)}</span></div>
    ${c.bulkSave>0?`<div class="sum-row save"><span>Bulk savings included</span><span>${money(c.bulkSave)}</span></div>`:""}
    <div class="sum-row"><span>Discount${c.disc>0&&discount.type==="pct"?" ("+discount.value+"%)":""}</span><span>${c.disc>0?"− ":""}${money(c.disc)}</span></div>
    <div class="sum-row muted"><span>GST ${GST}% (CGST + SGST)</span><span>${money(c.cgst+c.sgst)}</span></div>
    <div class="sum-row muted"><span>Round off</span><span>${c.roundoff>=0?"+ ":"− "}${money(Math.abs(c.roundoff))}</span></div>
    <div class="due-row"><span>Total due</span><strong>${money0(c.total)}</strong></div>`;
  $("#paybar").innerHTML=payTiles(c);$("#payM").innerHTML=payTiles(c);
  $("#paybar").hidden=!cart.length;$("#payM").hidden=!cart.length;document.querySelector(".cartbar").hidden=!cart.length;
  $("#barTotal").textContent=money0(c.total);$("#barItems").textContent=cart.length?`${cart.length} part${cart.length>1?"s":""} · ${c.units} units`:"No items yet";
}
function renderCounter(){renderCats();renderGrid();renderCart()}

/* payment */
function openPay(mode){
  const c=compute(cart,discount),cu=getCust(cartCust),T=c.total;
  if(mode==="Credit"&&cu.id==="walkin")return openCustPicker("Choose who this bill goes on khata to.","Credit");
  let body="";
  if(mode==="Cash"){const ups=[...new Set([T,Math.ceil(T/100)*100,Math.ceil(T/500)*500,Math.ceil(T/2000)*2000])].slice(0,4);
    body=`<div class="field"><label for="pRecv">Cash received (₹)</label><input class="input num" id="pRecv" type="number" min="0" step="1" value="${T}" style="font-size:22px;height:56px"></div>
      <div class="quick">${ups.map(u=>`<button type="button" class="chip" data-recv="${u}">${money0(u)}</button>`).join("")}</div>
      <div class="change" id="pChange"><span>Change to return</span><b>₹0</b></div>`}
  else if(mode==="UPI")body=`<p class="muted" style="margin:0">Ask the customer to scan your shop's UPI QR and pay the amount above. Complete the sale once the payment shows on your phone.</p><div class="field"><label for="pRef">UPI reference no. (optional)</label><input class="input mono" id="pRef" inputmode="numeric" placeholder="12-digit UTR"></div>`;
  else if(mode==="Card")body=`<p class="muted" style="margin:0">Run the amount on your card machine. Complete the sale once the machine prints “approved”.</p><div class="field"><label for="pRef">Card last 4 digits (optional)</label><input class="input mono" id="pRef" inputmode="numeric" maxlength="4" placeholder="1234"></div>`;
  else if(mode==="Credit")body=`<div class="notice">${ic("Credit")}<span>This bill goes on <b style="color:var(--ink)">${esc(cu.name)}</b>'s khata. Their due goes from ${money0(cu.due)} to <b style="color:var(--ink)">${money0(cu.due+T)}</b>.</span></div>`;
  else if(mode==="Split")body=`<p class="muted" style="margin:0">Enter how much is paid each way. The amounts must add up to the total.</p>
      ${["Cash","UPI","Card","Credit"].map(m=>`<div class="split-row"><label for="sp-${m}">${ic(m)}${m==="Credit"?"Khata":m}</label><input class="input num" id="sp-${m}" data-split="${m}" type="number" min="0" step="1" value="${m==="Cash"?T:0}" ${m==="Credit"&&cu.id==="walkin"?'disabled title="Choose a customer first"':""}></div>`).join("")}
      <div class="change" id="pChange"><span>Left to collect</span><b>₹0</b></div>`;
  const title={Cash:"Collect cash",UPI:"Collect by UPI",Card:"Collect by card",Credit:"Put on khata",Split:"Split payment"}[mode];
  openOverlay(`<form class="modal" id="payForm" data-mode="${mode}" novalidate>
    <div class="modal-head"><div><span class="label">${esc(cu.name)} · ${c.units} units</span><h2>${title}</h2></div><button type="button" class="icon-btn" data-close aria-label="Close">${ic("x",2)}</button></div>
    <div><span class="label">Total due</span><div class="bigdue">${money0(T)}</div></div>${body}
    <span class="err" id="pErr" role="alert"></span>
    <div class="form-actions"><button class="btn btn-primary" type="submit" id="paySubmit">Complete sale</button><button type="button" class="btn-link" data-close>Back to bill</button></div></form>`,title);
  updatePay();
}
function updatePay(){const fm=$("#payForm");if(!fm)return;const T=compute(cart,discount).total,m=fm.dataset.mode;
  if(m==="Cash"){const r=Number($("#pRecv").value)||0;$("#pChange").innerHTML=r>=T?`<span>Change to return</span><b>${money0(r-T)}</b>`:`<span>Still short by</span><b style="color:var(--bad)">${money0(T-r)}</b>`;$("#paySubmit").disabled=r<T}
  if(m==="Split"){const s=[...fm.querySelectorAll("[data-split]")].reduce((a,i)=>a+(Number(i.value)||0),0),left=r2(T-s);
    $("#pChange").innerHTML=left===0?`<span>Fully collected</span><b style="color:var(--ok)">₹0</b>`:left>0?`<span>Left to collect</span><b>${money0(left)}</b>`:`<span>Over by</span><b style="color:var(--bad)">${money0(-left)}</b>`;$("#paySubmit").disabled=left!==0}
}
function completeSale(mode,parts,ref){
  const d=new Date(),c=compute(cart,discount),cu=getCust(cartCust);
  const bill={no:billNo(),date:d.toISOString(),customer:{id:cu.id,name:cu.name,type:cu.type,phone:cu.phone,gstin:cu.gstin},payment:mode,payParts:parts,ref:ref||"",discount:{...discount},slip:slipSent,...c};
  bill.items.forEach(i=>{const p=inventory.find(x=>x.id===i.id);if(p)p.stock=Math.max(0,p.stock-i.qty)});
  const credit=parts.filter(p=>p.mode==="Credit").reduce((a,p)=>a+p.amount,0);if(credit>0&&cu.id!=="walkin")cu.due=r2(cu.due+credit);
  bills.push(bill);save();
  cart=[];cartCust="walkin";discount={type:"pct",value:0};slipSent=null;$("#discVal").value=0;setPressed("#discSeg","pct","dtype");
  closeSheet();closeOverlay(true);renderCounter();renderChrome();showInvoice(bill,true);
}

/* pick slip */
function openSlip(){
  if(!cart.length)return;const no=slipSent||"PS-"+String((me.slipSeq||0)+1).padStart(4,"0");
  const items=cart.map(l=>({...inventory.find(x=>x.id===l.id),qty:l.qty})).sort((a,b)=>(a.rack||"").localeCompare(b.rack||""));
  openOverlay(`<div class="modal"><div class="modal-head"><div><span class="label">Pick slip · ${esc(no)}</span><h2>Parts to pull from the store room</h2></div><button type="button" class="icon-btn" data-close aria-label="Close">${ic("x",2)}</button></div>
    <p class="muted" style="margin:0">Sorted by rack so staff can walk the store room once. Tick each part as it reaches the counter.</p>
    <ul class="slip" style="list-style:none;margin:0;padding:0">${items.map(p=>`<li><span class="rack">${esc(p.rack||"—")}</span><div><b style="font-weight:600">${esc(full(p))}</b><div class="faint small">${esc(p.fits)} · <span class="mono">${esc(p.pn)}</span></div></div>
      <label style="display:flex;align-items:center;gap:12px"><span class="q">×${p.qty}</span><input type="checkbox" aria-label="Picked ${esc(full(p))}"></label></li>`).join("")}</ul>
    <div class="form-actions"><button class="btn btn-primary" id="sendSlip" data-no="${esc(no)}">${slipSent?"Done":"Send to store room"}</button><button class="btn btn-secondary btn-sm" id="copySlip">Copy slip text</button><button type="button" class="btn-link" data-close>Cancel</button></div></div>`,"Pick slip");
}

/* customers */
function openCustPicker(msg,thenPay){
  const list=[WALKIN,...me.customers];
  openOverlay(`<div class="modal"><div class="modal-head"><div><span class="label">Customer</span><h2>Who is this bill for?</h2></div><button type="button" class="icon-btn" data-close aria-label="Close">${ic("x",2)}</button></div>
    ${msg?`<div class="notice">${ic("info")}<span>${esc(msg)}</span></div>`:""}
    <label class="search" style="flex:none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="custQ" type="search" placeholder="Search name or mobile" autocomplete="off" aria-label="Search customers"></label>
    <ul class="custlist" id="custList" data-then="${thenPay||""}">${custRows(list,"")}</ul>
    <div class="form-actions"><button class="btn btn-secondary btn-sm" data-newcust="${thenPay||"pick"}">${ic("plus",2)}New customer</button><button type="button" class="btn-link" data-close>Cancel</button></div></div>`,"Choose customer");
}
function custRows(list,q){q=q.trim().toLowerCase();const r=list.filter(c=>!q||(c.name+" "+c.phone).toLowerCase().includes(q));
  return r.map(c=>`<li><button data-setcust="${c.id}"><span class="avatar">${c.id==="walkin"?ic("customers"):esc(initials(c.name))}</span><span><b>${esc(c.name)}</b><small>${esc(c.type)}${c.phone?" · "+esc(c.phone):""}</small></span>${c.due>0?`<span class="due">Due ${money0(c.due)}</span>`:""}</button></li>`).join("")||`<li class="empty" style="border:0">No customer matches.</li>`}
function openNewCust(then){
  openOverlay(`<form class="modal" id="custForm" data-then="${then||""}" novalidate><div class="modal-head"><div><span class="label">Customer</span><h2>Add a customer</h2></div><button type="button" class="icon-btn" data-close aria-label="Close">${ic("x",2)}</button></div>
    <div class="field"><label for="ncName">Name</label><input class="input" id="ncName" placeholder="Raju Motor Garage"></div>
    <div class="field"><label for="ncPhone">Mobile</label><input class="input" id="ncPhone" inputmode="tel" placeholder="+91 98xxx xxxxx"></div>
    <div class="field"><label for="ncType">Type</label><select class="input" id="ncType">${CTYPES.map(t=>`<option>${t}</option>`).join("")}</select></div>
    <div class="field"><label for="ncGst">GSTIN (for business bills)</label><input class="input mono" id="ncGst" maxlength="15" style="text-transform:uppercase" placeholder="Optional"></div>
    <span class="err" id="ncErr" role="alert"></span>
    <div class="form-actions"><button class="btn btn-primary" type="submit">Save customer</button><button type="button" class="btn-link" data-close>Cancel</button></div></form>`,"Add customer");
}
function renderCustomers(){
  const list=me.customers,due=list.reduce((a,c)=>a+c.due,0),owing=list.filter(c=>c.due>0).length;
  $("#custSub").textContent="Garages, fleets and regulars. Khata due is what they owe you on credit bills.";
  $("#custStats").innerHTML=`<div class="stat hi"><span class="label">Total khata due</span><b>${money0(due)}</b><small>${owing} customer${owing!==1?"s":""} owe you</small></div>
    <div class="stat"><span class="label">Customers</span><b>${list.length}</b></div>
    <div class="stat"><span class="label">Garages</span><b>${list.filter(c=>c.type==="Mechanic / garage").length}</b></div>
    <div class="stat"><span class="label">Fleets / businesses</span><b>${list.filter(c=>c.type==="Fleet / business").length}</b></div>`;
  const last=id=>{const b=bills.filter(x=>x.customer.id===id).pop();return b?dshort(new Date(b.date)):"—"};
  $("#custBody").innerHTML=list.length?list.slice().sort((a,b)=>b.due-a.due).map(c=>`<tr><td><div class="pcell" style="min-width:200px"><span class="avatar">${esc(initials(c.name))}</span><div><b>${esc(c.name)}</b>${c.gstin?`<span class="mono">GSTIN ${esc(c.gstin)}</span>`:""}</div></div></td>
    <td>${esc(c.type)}</td><td class="mono" style="white-space:nowrap">${esc(c.phone||"—")}</td><td>${last(c.id)}</td>
    <td class="r num" style="font-weight:600;${c.due>0?"color:var(--bad)":""}">${money0(c.due)}</td>
    <td class="r">${c.due>0?`<button class="btn btn-secondary btn-sm" data-collect="${c.id}">Record payment</button>`:""}</td></tr>`).join("")
    :`<tr><td colspan="6" style="text-align:center;color:var(--faint);padding:var(--lg)">No customers yet. Add the garages and fleets you give credit to.</td></tr>`;
}
function openCollect(id){const c=getCust(id);
  openOverlay(`<form class="modal" id="collectForm" data-id="${id}" novalidate><div class="modal-head"><div><span class="label">Khata · ${esc(c.name)}</span><h2>Record a payment</h2></div><button type="button" class="icon-btn" data-close aria-label="Close">${ic("x",2)}</button></div>
    <div><span class="label">Due now</span><div class="bigdue" style="color:var(--bad)">${money0(c.due)}</div></div>
    <div class="row2" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label for="colAmt">Amount received (₹)</label><input class="input num" id="colAmt" type="number" min="1" step="1" value="${c.due}"></div>
    <div class="field"><label for="colMode">Paid by</label><select class="input" id="colMode"><option>Cash</option><option>UPI</option><option>Card</option><option>Cheque</option></select></div></div>
    <span class="err" id="colErr" role="alert"></span>
    <div class="form-actions"><button class="btn btn-primary" type="submit">Save payment</button><button type="button" class="btn-link" data-close>Cancel</button></div></form>`,"Record payment")}

/* invoice */
let openBill=null;
function invoiceText(b){const d=new Date(b.date);
  const L=[me.name,me.addr,"GSTIN "+me.gstin,"","TAX INVOICE  "+b.no,d.toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}),"Billed to: "+b.customer.name+(b.customer.gstin?" ("+b.customer.gstin+")":""),"",
    ...b.items.map((i,n)=>`${n+1}. ${i.name} [${i.pn}]\n   ${i.qty} x ${money(i.rate)} = ${money(i.amount)}`),"","Subtotal: "+money(b.subtotal)];
  if(b.disc>0)L.push("Discount: -"+money(b.disc));
  L.push("Taxable: "+money(b.taxable),`CGST ${GST/2}%: `+money(b.cgst),`SGST ${GST/2}%: `+money(b.sgst),"Round off: "+money(b.roundoff),"TOTAL: "+money(b.total),"Paid by: "+payTxt(b),"","Rupees "+words(b.total).toLowerCase()+" only");
  return L.join("\n")}
const payTxt=b=>b.payment==="Split"?b.payParts.filter(p=>p.amount>0).map(p=>(p.mode==="Credit"?"Khata":p.mode)+" "+money0(p.amount)).join(" + "):b.payment==="Credit"?"Khata (credit)":b.payment;
function showInvoice(b,fresh){openBill=b;const d=new Date(b.date);
  openOverlay(`<div class="invoice"><div class="inv-actions">${fresh?`<span class="ok-msg">${ic("check",2.4)}Sale complete · stock updated</span>`:""}
    <button class="btn btn-secondary btn-sm" id="copyBill">Copy bill text</button>${fresh?`<button class="btn btn-primary btn-sm" id="newSale">Next sale</button>`:`<button class="btn btn-primary btn-sm" data-close>Close</button>`}</div>
    <div class="inv"><div class="inv-head"><div class="inv-shop"><span class="logo">${esc(initials(me.name))}</span><div><h2>${esc(me.name)}</h2><div class="addr">${esc(me.addr)}<br>GSTIN <span class="mono">${esc(me.gstin)}</span> · ${esc(me.phone)}</div></div></div>
      <div class="inv-title"><span class="t">Tax invoice</span><div class="mono" style="margin-top:8px;font-size:15px">${esc(b.no)}</div>${b.sample?`<div style="margin-top:6px"><span class="tag tag-sample">Sample bill</span></div>`:""}</div></div>
    <div class="inv-meta"><div><span class="label">Billed to</span><strong>${esc(b.customer.name)}</strong>${b.customer.phone?`<span>${esc(b.customer.phone)}</span>`:""}${b.customer.gstin?`<span class="mono">GSTIN ${esc(b.customer.gstin)}</span>`:""}</div>
      <div><span class="label">Date</span><span>${d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}, ${tshort(d)}</span></div>
      <div><span class="label">Place of supply</span><span>Maharashtra</span></div><div><span class="label">Paid by</span><span>${esc(payTxt(b))}</span>${b.ref?`<span class="mono faint">Ref ${esc(b.ref)}</span>`:""}</div></div>
    <div class="tablewrap"><table><thead><tr><th>#</th><th>Part</th><th>HSN</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead>
      <tbody>${b.items.map((i,n)=>`<tr><td class="num">${n+1}</td><td><div style="font-weight:500">${esc(i.name)}</div><div class="mono faint">${esc(i.pn)}${i.rate<i.list?` · bulk rate (list ${money0(i.list)})`:""}</div></td><td class="mono">${esc(i.hsn)}</td><td class="r num">${i.qty}</td><td class="r num">${money(i.rate)}</td><td class="r num">${money(i.amount)}</td></tr>`).join("")}</tbody></table></div>
    <div class="inv-bottom"><div class="words"><span class="label">Amount in words</span><em>Rupees ${esc(words(b.total).toLowerCase())} only</em>${b.bulkSave>0?`<p style="color:var(--steel);margin:12px 0 0">Bulk pricing saved this customer ${money(b.bulkSave)}.</p>`:""}</div>
      <div class="sum"><div class="sum-row"><span>Subtotal</span><span>${money(b.subtotal)}</span></div>
        ${b.disc>0?`<div class="sum-row"><span>Discount${b.discount.type==="pct"?" ("+b.discount.value+"%)":""}</span><span>− ${money(b.disc)}</span></div>`:""}
        <div class="sum-row muted"><span>Taxable value</span><span>${money(b.taxable)}</span></div><div class="sum-row muted"><span>CGST ${GST/2}%</span><span>${money(b.cgst)}</span></div>
        <div class="sum-row muted"><span>SGST ${GST/2}%</span><span>${money(b.sgst)}</span></div><div class="sum-row muted"><span>Round off</span><span>${b.roundoff>=0?"+ ":"− "}${money(Math.abs(b.roundoff))}</span></div>
        <div class="inv-total"><span class="label">Total</span><strong>${money0(b.total)}</strong></div></div></div>
    <div id="copyFallback"></div>
    <div class="inv-foot"><span>${b.units} units across ${b.items.length} part${b.items.length>1?"s":""}. Goods once sold are returnable within 7 days with this bill.</span><span>Powered by PartsDesk</span></div></div></div>`,"Invoice")}

/* bills */
function renderBills(){
  const today=new Date().toDateString(),td=bills.filter(b=>new Date(b.date).toDateString()===today);
  const credit=bills.reduce((a,b)=>a+b.payParts.filter(p=>p.mode==="Credit").reduce((x,p)=>x+p.amount,0),0);
  $("#stats").innerHTML=`<div class="stat hi"><span class="label">Sales today</span><b>${money0(td.reduce((a,b)=>a+b.total,0))}</b><small>${td.length} bills</small></div>
    <div class="stat"><span class="label">Bills today</span><b>${td.length}</b></div><div class="stat"><span class="label">Units sold today</span><b>${td.reduce((a,b)=>a+b.units,0)}</b></div>
    <div class="stat"><span class="label">Given on khata</span><b>${money0(credit)}</b><small>all bills</small></div>`;
  $("#billBody").innerHTML=bills.length?bills.slice().reverse().map((b,ri)=>{const d=new Date(b.date),idx=bills.length-1-ri;
    return `<tr class="click" data-bill="${idx}" tabindex="0"><td class="mono" style="white-space:nowrap">${esc(b.no)} ${b.sample?'<span class="tag tag-sample">Sample</span>':""}</td>
      <td style="white-space:nowrap">${dshort(d)}, ${tshort(d)}</td><td>${esc(b.customer.name)}</td><td class="r num">${b.items.length}</td><td class="r num">${b.units}</td>
      <td><span class="tag">${esc(b.payment==="Credit"?"Khata":b.payment)}</span></td><td class="r num" style="font-weight:600">${money(b.total)}</td></tr>`}).join("")
    :`<tr><td colspan="7" style="text-align:center;color:var(--faint);padding:var(--lg)">No bills yet. Completed sales appear here.</td></tr>`;
}

/* brands: everyone picks from one shared list so the same brand is always spelled the same way */
const NEW_BRAND="__new";
function fillBrandSel(el,{any,add}={}){if(!el)return;const keep=el.value;
  el.innerHTML=(any?`<option value="">${esc(any)}</option>`:`<option value="">Choose a brand</option>`)+net.brands.map(b=>`<option>${esc(b)}</option>`).join("")+(add?`<option value="${NEW_BRAND}">+ Add a new brand</option>`:"");
  if(keep&&[...el.options].some(o=>o.value===keep))el.value=keep}
// Returns {brand} or {err}. A typed brand that matches one on the list (ignoring case, spaces and dots) uses the listed spelling.
function readBrand(sel){
  if(sel.value!==NEW_BRAND)return sel.value?{brand:sel.value}:{err:"Choose a brand. If it's not in the list, pick “+ Add a new brand”."};
  let typed=$("#"+sel.id+"New").value.trim().replace(/\s+/g," ");if(!typed)return {err:"Type the new brand's name."};
  if(typed===typed.toLowerCase())typed=typed.replace(/\b\w/g,c=>c.toUpperCase());
  const hit=net.brands.find(b=>slug(b)===slug(typed));if(hit)return {brand:hit,matched:true};
  return {brand:typed,added:true};
}
// Call once the form is valid, so a failed save doesn't leave a half-added brand on the list.
function keepBrand(r){if(r.added&&!net.brands.includes(r.brand)){net.brands.push(r.brand);net.brands.sort((a,b)=>a.localeCompare(b))}}
const brandNote=r=>r.added?` ${r.brand} is now on the brand list.`:r.matched?` Used ${r.brand} from the brand list.`:"";
function resetBrandSel(sel){sel.value="";const n=$("#"+sel.id+"New");if(n){n.value="";n.hidden=true}}

/* inventory */
function renderInventory(){
  fillBrandSel($("#fBrand"),{add:true});
  const q=inv.q.trim().toLowerCase();
  const list=inventory.filter(p=>(!inv.low||stockState(p)!=="ok")&&(!q||(p.name+" "+p.fits+" "+p.pn+" "+p.cat+" "+(p.rack||"")+" "+(p.brand||"")).toLowerCase().includes(q)));
  const low=inventory.filter(p=>stockState(p)==="low").length,out=inventory.filter(p=>stockState(p)==="out").length,parts=new Set(inventory.map(pidOf)).size;
  $("#invSummary").textContent=`${parts} parts in ${inventory.length} brands · stock worth ${money0(Math.round(inventory.reduce((a,p)=>a+(p.cost||0)*p.stock,0)))} at cost · ${low} low, ${out} out of stock`;
  const firstOf=new Set();
  $("#invBody").innerHTML=list.length?list.map(p=>{const st=stockState(p),m=p.price>0&&p.cost?(p.price-p.cost)/p.price*100:null,mc=m===null?"":m>=20?"m-ok":m>=12?"m-low":"m-bad";
    const pid=pidOf(p),first=!firstOf.has(pid);firstOf.add(pid);
    return `<tr class="${st!=="ok"?"lowrow":""}"><td><div class="pcell"><span class="thumb">${art(p)}</span><div><b>${esc(full(p))}</b><span>${esc(p.fits)} · <span class="mono">${esc(p.pn)}</span></span></div></div></td>
    <td><span class="mono">${esc(p.rack||"—")}</span></td><td><span class="veh">${p.veh==="Both"?"2W · 4W":p.veh}</span></td>
    <td class="r"><input class="input cell-in" type="number" min="0" id="stock-${esc(p.id)}" data-stock="${esc(p.id)}" value="${p.stock}" aria-label="Stock of ${esc(full(p))}"></td>
    <td class="r num">${p.cost?money0(p.cost):"—"}</td><td class="r num">${money0(p.price)}${p.tiers.length?`<div class="small" style="color:var(--steel)">${p.tiers[0].min}+ @ ${money0(p.tiers[0].price)}</div>`:""}</td>
    <td class="r">${m===null?"—":`<span class="margin ${mc}">${money0(p.price-p.cost)} · ${m.toFixed(0)}%</span>`}</td>
    <td><span class="status st-${st}">${st==="ok"?"In stock":st==="low"?"Reorder":"Out of stock"}</span></td>
    <td><div class="row-actions">${first?`<button class="btn btn-secondary btn-sm" data-addbrand="${esc(pid)}">Add brand</button>`:""}${st!=="ok"&&cat(pid)?`<button class="btn btn-secondary btn-sm" data-find="${esc(pid)}">Find stock</button>`:""}</div></td></tr>`}).join("")
    :`<tr><td colspan="9" style="text-align:center;color:var(--faint);padding:var(--lg)">Nothing matches. Clear the search or add this part.</td></tr>`;
}
// Stock another brand of a part the shop already sells. Name, fits, category and HSN come from the part.
function openAddBrand(pid){const vs=variantsOf(inventory,pid),p=vs[0];
  openOverlay(`<form class="modal" id="brandForm" data-pid="${esc(pid)}" novalidate><div class="modal-head"><div><span class="label">Add a brand</span><h2>${esc(p.name)}</h2><div class="faint">${esc(p.fits)}${vs.some(v=>v.brand)?` · you stock ${esc(brandsOf(vs).join(", "))}`:""}</div></div><button type="button" class="icon-btn" data-close aria-label="Close">${ic("x",2)}</button></div>
    <div class="field"><label for="bBrand">Brand</label><select class="input" id="bBrand" data-brandsel></select><input class="input" id="bBrandNew" hidden placeholder="Type the new brand's name" aria-label="New brand name"></div>
    <div class="pair"><div class="field"><label for="bPn">Part number</label><input class="input mono" id="bPn" placeholder="Auto if blank"></div><div class="field"><label for="bRack">Rack / bin</label><input class="input mono" id="bRack" value="${esc(p.rack||"")}"></div></div>
    <div class="pair"><div class="field"><label for="bCost">Cost price (₹)</label><input class="input num" id="bCost" type="number" min="0" step="0.01"></div><div class="field"><label for="bPrice">Selling price (₹, before GST)</label><input class="input num" id="bPrice" type="number" min="0" step="0.01"></div></div>
    <div class="pair"><div class="field"><label for="bStock">Opening stock</label><input class="input num" id="bStock" type="number" min="0" step="1"></div><div class="field"><label for="bReorder">Reorder level</label><input class="input num" id="bReorder" type="number" min="0" step="1" value="${p.reorder||5}"></div></div>
    <span class="err" id="bErr" role="alert"></span>
    <div class="form-actions"><button class="btn btn-primary" type="submit">Save brand</button><button type="button" class="btn-link" data-close>Cancel</button></div></form>`,"Add a brand");
  fillBrandSel($("#bBrand"),{add:true});$("#bBrand").focus();
}

/* reports */
function bars(rows,fmt){const max=Math.max(1,...rows.map(r=>r.v));
  return `<div class="bars">${rows.map(r=>`<div class="bar-row" title="${esc(r.l)}: ${esc(fmt(r.v))}"><span class="bar-l">${esc(r.l)}</span><span class="bar-track"><span class="bar" style="width:${(r.v/max*100).toFixed(1)}%"></span></span><span class="bar-v">${fmt(r.v)}</span></div>`).join("")}</div>`}
function renderReports(){
  setPressed("#rangeSeg",range,"range");
  const now=new Date(),start=new Date(now);start.setHours(0,0,0,0);if(range==="7")start.setDate(start.getDate()-6);
  const B=bills.filter(b=>new Date(b.date)>=start),sales=B.reduce((a,b)=>a+b.total,0);
  const profit=B.reduce((a,b)=>a+b.items.reduce((x,i)=>x+(i.rate-(i.cost||0))*i.qty,0)-b.disc,0),sub=B.reduce((a,b)=>a+b.taxable,0);
  const credit=B.reduce((a,b)=>a+b.payParts.filter(p=>p.mode==="Credit").reduce((x,p)=>x+p.amount,0),0);
  $("#rStats").innerHTML=`<div class="stat hi"><span class="label">Sales</span><b>${money0(sales)}</b><small>incl. GST</small></div>
    <div class="stat"><span class="label">Bills</span><b>${B.length}</b><small>avg ${money0(B.length?Math.round(sales/B.length):0)}</small></div>
    <div class="stat"><span class="label">Gross margin</span><b>${sub?Math.round(profit/sub*100):0}%</b><small>${money0(Math.round(profit))} before GST</small></div>
    <div class="stat"><span class="label">Given on khata</span><b>${money0(credit)}</b><small>to be collected</small></div>`;
  const days=[];if(range==="7")for(let i=6;i>=0;i--){const d=new Date(now);d.setHours(0,0,0,0);d.setDate(d.getDate()-i);const e=new Date(d);e.setDate(e.getDate()+1);
    days.push({l:d.toLocaleDateString("en-IN",{weekday:"short",day:"numeric"}),v:bills.filter(b=>{const t=new Date(b.date);return t>=d&&t<e}).reduce((a,b)=>a+b.total,0)})}
  const modes={};B.forEach(b=>b.payParts.forEach(p=>{if(p.amount>0)modes[p.mode]=(modes[p.mode]||0)+p.amount}));
  const parts={};B.forEach(b=>b.items.forEach(i=>{parts[i.name]=(parts[i.name]||0)+i.amount}));
  const top=Object.entries(parts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([l,v])=>({l,v}));
  const debtors=me.customers.filter(c=>c.due>0).sort((a,b)=>b.due-a.due);
  const low=inventory.filter(p=>stockState(p)!=="ok");
  $("#rPanels").innerHTML=
    (range==="7"?`<section class="panel"><div class="panel-h"><h2>Sales by day</h2><span class="faint small">incl. GST</span></div>${bars(days,money0)}</section>`:"")+
    `<section class="panel"><div class="panel-h"><h2>Payments by mode</h2><span class="faint small">${range==="7"?"last 7 days":"today"}</span></div>${Object.keys(modes).length?bars(["Cash","UPI","Card","Credit"].filter(m=>modes[m]).map(m=>({l:m==="Credit"?"Khata":m,v:modes[m]})),money0):`<p class="faint">No payments yet.</p>`}</section>
    <section class="panel"><div class="panel-h"><h2>Top parts by sales</h2><span class="faint small">before GST</span></div>${top.length?bars(top,money0):`<p class="faint">No sales yet.</p>`}</section>
    <section class="panel"><div class="panel-h"><h2>Khata to collect</h2><button class="btn-link" data-view="customers">All customers</button></div>${debtors.length?`<div>${debtors.map(c=>`<div class="debt"><span>${esc(c.name)}<br><span class="faint small">${esc(c.type)}</span></span><b style="color:var(--bad)">${money0(c.due)}</b></div>`).join("")}</div>`:`<p class="faint">Nobody owes you.</p>`}</section>
    <section class="panel"><div class="panel-h"><h2>Needs reordering</h2><button class="btn-link" data-view="find">Find stock</button></div>${low.length?`<div>${low.map(p=>`<div class="debt"><span>${esc(full(p))}<br><span class="faint small">${esc(p.fits)}</span></span><span class="stock s-${stockState(p)}">${p.stock?p.stock+" left":"Out"}</span></div>`).join("")}</div>`:`<p class="faint">Everything is above its reorder level.</p>`}</section>`;
}

/* find stock */
function statusOrCta(toRef,pid,brand){const ex=myInterest(toRef,pid,brand);
  if(ex&&ex.status==="shared")return `<button class="status st-shared" data-view="deals" style="border:0">Number shared · view</button>`;
  if(ex)return `<span class="status st-wait">Interest sent ${ago(ex.at)}</span>`;
  return `<button class="btn btn-primary btn-sm" data-interest="${toRef.t}:${toRef.id}:${esc(pid)}" data-brand="${esc(brand||"")}">I'm interested</button>`}
const myStock=(pid,brand)=>variantsOf(inventory,pid).filter(v=>!brand||v.brand===brand).reduce((a,v)=>a+v.stock,0);
const pname=(pid,brand)=>(brand?brand+" ":"")+cat(pid).name;
// One part across the network. When brand is set (searched for, or asked for in a Wanted post), only that brand is listed.
function partSources(p,brand){
  const mine=variantsOf(inventory,p.id),have=mine.reduce((a,v)=>a+v.stock,0);
  const vend=net.vendors.flatMap(v=>vItems(v,p.id).filter(it=>!brand||it.brand===brand).map(it=>({v,it}))).sort((a,b)=>(b.it.qty>0)-(a.it.qty>0)||km(me,a.v)-km(me,b.v)||a.it.price-b.it.price);
  const shops=shopsVisibleTo(me).map(s=>({s,vs:variantsOf(s.inventory,p.id).filter(v=>v.stock>0&&(!brand||v.brand===brand))})).filter(x=>x.vs.length).sort((a,b)=>km(me,a.s)-km(me,b.s));
  const myStatus=mine.length?`<span class="status st-${groupState(mine)}">${have<=0?"You're out":"You have "+have}</span>`:`<span class="status st-off">Not in your inventory</span>`;
  const vRows=vend.length?vend.map(({v,it})=>`<li class="src-row"><div class="src-main"><div class="src-title"><span class="src-name">${esc(v.name)}</span><span class="tag tag-net">Supplier</span><span class="brandchip">${esc(it.brand)}</span><span class="pricechip">${money0(it.price)} / unit</span></div>
      <div class="src-meta">${esc(v.area)} · ${kmTxt(me,v)} · min order ${it.moq}</div></div>
      <div class="src-side">${it.qty>0?`<span class="stock s-${it.qty<=it.moq*2?"low":"ok"}">${it.qty} in stock</span>`+statusOrCta({t:"vendor",id:v.id},p.id,it.brand):`<span class="stock s-out">Out of stock</span>`}</div></li>`).join(""):`<li class="src-row faint">No supplier lists ${brand?esc(brand)+" for ":""}this part yet.</li>`;
  const sRows=shops.length?shops.map(({s,vs})=>`<li class="src-row"><div class="src-main"><div class="src-title"><span class="src-name">${esc(s.name)}</span><span class="tag">Shop</span>${brandsOf(vs).map(b=>`<span class="brandchip">${esc(b)}</span>`).join("")}</div><div class="src-meta">${esc(s.area)} · ${kmTxt(me,s)}</div></div>
      <div class="src-side"><span class="stock s-${groupState(vs)==="low"?"low":"ok"}">${groupState(vs)==="low"?"Limited stock":"Has stock"}</span>${statusOrCta({t:"shop",id:s.id},p.id,brand)}</div></li>`).join(""):`<li class="src-row faint">No shop more than ${HIDE_KM} km away has ${brand?esc(brand)+" for ":""}it in stock.</li>`;
  const any=vend.some(x=>x.it.qty>0)||shops.length;
  return `<section class="fpart"><div class="fpart-head"><div class="pcell"><span class="thumb">${art(p)}</span><div><h2>${esc(p.name)}</h2><span>${esc(p.fits)}${brand?` · showing <b>${esc(brand)}</b> only`:""}</span></div></div>${myStatus}</div>
    <div class="group-label"><span class="label">Suppliers</span><span class="faint small">Exact stock, kept current by the supplier</span></div><ul class="src">${vRows}</ul>
    <div class="group-label"><span class="label">Shops more than ${HIDE_KM} km away</span><span class="faint small">Shops never see each other's quantities</span></div><ul class="src">${sRows}</ul>
    <div class="fpart-foot"><span>${any?"Need more than they have?":"Nobody has it in stock right now."}</span><button class="btn ${any?"btn-secondary":"btn-primary"} btn-sm" data-want="${esc(p.id)}" data-brand="${esc(brand||"")}">Post to Wanted</button></div></section>`;
}
function renderFind(){
  const near=net.shops.filter(s=>s.id!==me.id&&km(me,s)<=HIDE_KM).length;
  $("#hideNote").textContent=`Shops within ${HIDE_KM} km of you are hidden, and you're hidden from them${near?` (${near} nearby shop${near>1?"s":""})`:""}. Suppliers show wherever they are.`;
  const q=find.q.trim().toLowerCase(),out=$("#findOut");
  // A brand typed in the search ("bosch spark plug") narrows results to that brand; the other words find the part.
  const brand=q?net.brands.slice().sort((a,b)=>b.length-a.length).find(b=>(" "+q+" ").includes(" "+b.toLowerCase()+" ")):"";
  const words=(brand?q.replace(brand.toLowerCase()," "):q).split(/\s+/).filter(Boolean);
  const parts=find.pid?[cat(find.pid)]:q?CATALOG.filter(p=>{const h=(p.name+" "+p.fits+" "+p.pn+" "+p.cat).toLowerCase();return words.every(w=>h.includes(w))&&(!brand||bset(p.id).some(b=>b[0]===brand)||net.vendors.some(v=>vItem(v,vid(p.id,brand))))}).slice(0,6):null;
  if(!parts){const low=inventory.filter(p=>stockState(p)!=="ok"&&cat(pidOf(p))).sort((a,b)=>a.stock-b.stock);
    out.innerHTML=`<div><h2 class="section-h">Running low at your shop</h2>${low.length?`<ul class="lowlist">${low.map(p=>{const n=net.vendors.filter(v=>(vItem(v,p.id)||{}).qty>0).length,b=esc(p.brand||"it");
      return `<li><div class="pcell"><span class="thumb">${art(p)}</span><div><b>${esc(full(p))}</b><span><span class="stock s-${stockState(p)}">${p.stock?p.stock+" left":"Out of stock"}</span> · ${n?n+" supplier"+(n>1?"s have ":" has ")+b:"no supplier has "+b}</span></div></div>
      <button class="btn btn-secondary btn-sm" data-find="${esc(pidOf(p))}">Find stock</button></li>`}).join("")}</ul>`:`<div class="empty">Everything is above its reorder level.</div>`}</div>`;return}
  out.innerHTML=(find.pid?`<div><button class="btn-link" id="clearFind">← Back to all parts</button></div>`:"")+(parts.length?parts.map(p=>partSources(p,brand)).join(""):`<div class="empty">No part in the network matches “${esc(find.q)}”. Try the vehicle model or part number.</div>`);
}

/* interests */
function dealCard(i){
  const out=isMe(i.from),other=acct(out?i.to:i.from),nm=pname(i.pid,i.brand),who=out?i.to:i.from;
  const typeTag=who.t==="vendor"?'<span class="tag tag-net">Supplier</span>':'<span class="tag">Shop</span>';
  const title=out?(i.kind==="offer"?`You offered ${i.qty} × ${nm}`:`You asked for ${i.qty} × ${nm}`):(i.kind==="offer"?`${other.name} can supply ${i.qty} × ${nm}`:`${other.name} wants ${i.qty} × ${nm}`);
  const st=i.status==="shared"?['st-shared','Numbers shared']:i.status==="declined"?['st-off',out?'Declined':'You declined']:out?['st-wait','Waiting for reply']:['st-need','Needs your reply'];
  const price=i.price?`${out?"Your":"Their"} price ${money0(i.price)} / unit`:"No price given";
  let body="";
  if(i.status==="shared")body=`<div class="phone"><div><span class="label">${out?esc(other.name)+" shared their number":"Their number"}</span><strong>${esc(other.phone)}</strong></div><button class="btn btn-secondary btn-sm" data-copy="${esc(other.phone)}">Copy number</button></div>
    <p class="faint small" style="margin:0">${out?"Call them to agree price, quantity and delivery.":"You shared your number. Expect their call, or call them first."} Payment happens outside the app.</p>`;
  else if(i.status==="pending"&&!out)body=`<div class="deal-actions"><button class="btn btn-primary btn-sm" data-share="${i.id}">Share my number</button><button class="btn-link" data-decline="${i.id}">Decline</button></div><p class="faint small" style="margin:0">Sharing lets ${esc(other.name)} call you on ${esc(me.phone)}.</p>`;
  else if(i.status==="pending")body=`<p class="faint small" style="margin:0">${esc(other.name)} sees your name, area and this request. Their number appears here when they accept.</p>`;
  return `<article class="deal${i.status==="pending"&&!out?" need":""}"><div class="deal-top"><span class="status ${st[0]}">${st[1]}</span><span class="faint small">${ago(i.at)}</span></div>
    <h3 class="deal-title">${esc(title)}</h3><div class="deal-meta">${typeTag} ${out?"To "+esc(other.name)+" · ":""}${esc(other.area)} · ${kmTxt(me,other)} · ${price}${i.wid?" · re: Wanted post":""}</div>
    ${i.note?`<div class="deal-note">${esc(i.note)}</div>`:""}${body}</article>`;
}
function renderDeals(){
  const rec=net.interests.filter(i=>isMe(i.to)),sent=net.interests.filter(i=>isMe(i.from)),isV=session.t==="vendor";if(isV)dealTab="received";
  $("#dealSeg").hidden=isV;
  $("#dealSeg").innerHTML=`<button data-dealtab="received" aria-pressed="${dealTab==="received"}">Received<span class="n">${rec.length}</span></button><button data-dealtab="sent" aria-pressed="${dealTab==="sent"}">Sent<span class="n">${sent.length}</span></button>`;
  $("#dealsSub").textContent=isV?"Shops interested in your stock. Share your number with the ones you want to deal with, then talk it through on a call.":dealTab==="received"?"Shops that want your stock, and offers for parts you asked for.":"Requests you've sent. When the other side accepts, their number appears here.";
  const list=(dealTab==="received"?rec:sent).slice().sort((a,b)=>(a.status==="pending"?0:1)-(b.status==="pending"?0:1)||new Date(b.at)-new Date(a.at));
  $("#dealList").innerHTML=list.length?list.map(dealCard).join(""):`<div class="empty" style="grid-column:1/-1">${dealTab==="received"?"No requests yet.":"Nothing sent yet. Use Find stock to reach a supplier or shop."}</div>`;
}

/* wanted */
function renderWanted(){
  fillBrandSel($("#wBrand"),{any:"Any brand"});const keep=$("#wPart").value;$("#wPart").innerHTML=CATALOG.map(p=>`<option value="${p.id}">${esc(p.name)} · ${esc(p.fits)}</option>`).join("");if(keep)$("#wPart").value=keep;
  $("#wReach").textContent=`Shown to ${shopsVisibleTo(me).length} shops more than ${HIDE_KM} km away.`;
  const vis=net.wanted.filter(w=>w.open&&w.shopId!==me.id&&canSee(me,net.shops.find(s=>s.id===w.shopId))).sort((a,b)=>new Date(b.at)-new Date(a.at));
  $("#wantedList").innerHTML=vis.length?vis.map(w=>{const s=net.shops.find(x=>x.id===w.shopId),p=cat(w.pid),mine=myStock(w.pid,w.brand),sent=net.interests.find(i=>isMe(i.from)&&i.wid===w.id);
    const cta=sent?(sent.status==="shared"?`<button class="status st-shared" data-view="deals" style="border:0">Numbers shared · view</button>`:`<span class="status st-wait">Offer sent ${ago(sent.at)}</span>`):mine>0?`<button class="btn btn-primary btn-sm" data-have="${w.id}">I have this</button><span class="faint small">You have ${mine}</span>`:`<span class="faint small">${w.brand?"No "+esc(w.brand)+" in your stock":"Not in your stock"}</span>`;
    return `<article class="deal"><div class="deal-top"><span class="tag">Shop</span><span class="faint small">${ago(w.at)}</span></div><h3 class="deal-title">${w.qty} × ${esc(pname(w.pid,w.brand))}</h3>
      <div class="deal-meta">${esc(p.fits)} · ${w.brand?`only ${esc(w.brand)}`:"any brand"}</div><div class="deal-meta">${esc(s.name)} · ${esc(s.area)} · ${kmTxt(me,s)}${w.offer?` · offering <b style="color:var(--ink)">${money0(w.offer)}</b> / unit`:""}</div>
      ${w.note?`<div class="deal-note">${esc(w.note)}</div>`:""}<div class="deal-actions">${cta}</div></article>`}).join(""):`<div class="empty" style="grid-column:1/-1">No open requests from shops in other areas right now.</div>`;
  const mineW=net.wanted.filter(w=>w.shopId===me.id).sort((a,b)=>b.open-a.open||new Date(b.at)-new Date(a.at));
  $("#wantedMine").innerHTML=mineW.length?mineW.map(w=>{const resp=net.interests.filter(i=>i.wid===w.id);
    return `<article class="deal"><div class="deal-top"><span class="status ${w.open?"st-wait":"st-off"}">${w.open?"Open":"Closed"}</span><span class="faint small">${ago(w.at)}</span></div><h3 class="deal-title">${w.qty} × ${esc(pname(w.pid,w.brand))}</h3>
      <div class="deal-meta">${w.offer?`Your price ${money0(w.offer)} / unit · `:""}${resp.length?`<button class="btn-link" data-view="deals">${resp.length} offer${resp.length>1?"s":""} received</button>`:"No offers yet"}</div>
      ${w.note?`<div class="deal-note">${esc(w.note)}</div>`:""}<div class="deal-actions"><button class="btn-link" data-closepost="${w.id}">${w.open?"Close request":"Reopen"}</button></div></article>`}).join(""):`<div class="empty" style="grid-column:1/-1">You haven't posted anything yet.</div>`;
}

/* vendor stock */
function renderVStock(){
  const pin=pendingIn(),out=me.stock.filter(x=>x.qty<=0).length;
  $("#vStats").innerHTML=`<div class="stat hi"><span class="label">Waiting for your reply</span><b>${pin}</b><small>shop requests</small></div><div class="stat"><span class="label">Parts listed</span><b>${me.stock.length}</b></div>
    <div class="stat"><span class="label">Out of stock</span><b>${out}</b></div><div class="stat"><span class="label">Shops that can see you</span><b>${net.shops.length}</b></div>`;
  const keep=$("#vPart").value;$("#vPart").innerHTML=CATALOG.map(p=>`<option value="${p.id}">${esc(p.name)} · ${esc(p.fits)}</option>`).join("");if(keep)$("#vPart").value=keep;
  fillBrandSel($("#vBrand"),{add:true});
  const q=vq.trim().toLowerCase(),rows=me.stock.map(it=>({it,p:cat(it.pid)})).filter(({it,p})=>!q||(p.name+" "+p.fits+" "+p.pn+" "+it.brand).toLowerCase().includes(q));
  $("#vBody").innerHTML=rows.length?rows.map(({it,p})=>{const nm=esc(pname(it.pid,it.brand));return `<tr class="${it.qty<=0?"lowrow":""}"><td><div class="pcell"><span class="thumb">${art(p)}</span><div><b>${nm}</b><span>${esc(p.fits)}</span></div></div></td><td class="mono">${esc(p.pn)}</td>
    <td class="r"><input class="input cell-in" type="number" min="0" id="vp-${esc(it.id)}" data-vprice="${esc(it.id)}" value="${it.price}" aria-label="Trade price of ${nm}"></td>
    <td class="r"><input class="input cell-in" type="number" min="1" id="vm-${esc(it.id)}" data-vmoq="${esc(it.id)}" value="${it.moq}" aria-label="Minimum order for ${nm}"></td>
    <td class="r"><input class="input cell-in" type="number" min="0" id="vq-${esc(it.id)}" data-vqty="${esc(it.id)}" value="${it.qty}" aria-label="Stock of ${nm}"></td>
    <td>${it.qty>0?`<span class="status st-ok">${it.qty} in stock</span>`:`<span class="status st-out">Out of stock</span>`}</td></tr>`}).join(""):`<tr><td colspan="6" style="text-align:center;color:var(--faint);padding:var(--lg)">Nothing listed matches.</td></tr>`;
}

/* interest modal */
function openInterest(kind,toRef,pid,wid,brand){
  const to=acct(toRef),p=cat(pid),mine=variantsOf(inventory,pid),reorder=mine.reduce((a,v)=>a+v.reorder,0),have=mine.reduce((a,v)=>a+v.stock,0);let qty,price="",min=1,hint,heading;
  if(kind==="offer"){const w=net.wanted.find(x=>x.id===wid),n=myStock(pid,w.brand);brand=w.brand||"";qty=Math.min(w.qty,n);price=w.offer||"";heading=`Offer to ${to.name}`;hint=`They asked for ${w.qty}${w.offer?` at ${money0(w.offer)} each`:""}${w.brand?`, ${w.brand} only`:""}. You have ${n} in stock.`}
  else if(toRef.t==="vendor"){const it=vItem(to,vid(pid,brand));min=it.moq;qty=Math.max(it.moq,mine.length?Math.max(reorder*2-have,0):it.moq);heading=`Ask ${to.name}`;hint=`Trade price ${money0(it.price)} / unit · minimum order ${it.moq} · ${it.qty} in stock`}
  else{qty=mine.length?Math.max(reorder,1):1;heading=`Ask ${to.name}`;hint="They have it in stock. Shops don't see each other's exact quantities."}
  openOverlay(`<form class="modal" id="intForm" data-kind="${kind}" data-to="${toRef.t}:${toRef.id}" data-pid="${esc(pid)}" data-brand="${esc(brand||"")}" data-wid="${wid||""}" data-min="${min}" novalidate>
    <div class="modal-head"><div><span class="label">${kind==="offer"?"Offer stock":"Send interest"}</span><h2>${esc(heading)}</h2></div><button type="button" class="icon-btn" data-close aria-label="Close">${ic("x",2)}</button></div>
    <div><b style="font-weight:600">${esc(pname(pid,brand))}</b> <span class="faint small">${esc(p.fits)}</span><div class="small" style="color:var(--steel)">${esc(hint)}</div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label for="iQty">Quantity</label><input class="input num" id="iQty" type="number" min="${min}" step="1" value="${qty}"></div>
      <div class="field"><label for="iPrice">${kind==="offer"?"Your price":"Price you'd pay"} / unit (₹)</label><input class="input num" id="iPrice" type="number" min="0" step="1" value="${price}" placeholder="Optional"></div></div>
    <div class="field"><label for="iNote">Note</label><textarea class="input" id="iNote" placeholder="${kind==="offer"?"When you can deliver, pickup or courier…":"When you need it, delivery or pickup…"}"></textarea></div>
    <div class="notice">${ic("deals")}<span>${esc(to.name)} sees your name, area and this note. If they want to go ahead, they share their number here and you settle the deal on a call.</span></div>
    <span class="err" id="iErr" role="alert"></span>
    <div class="form-actions"><button class="btn btn-primary" type="submit">${kind==="offer"?"Send offer":"Send interest"}</button><button type="button" class="btn-link" data-close>Cancel</button></div></form>`,heading);
}

/* ---------- views ---------- */
const VIEWS=["login","counter","bills","customers","inventory","reports","find","wanted","deals","vstock"];
const R={counter:renderCounter,bills:renderBills,customers:renderCustomers,inventory:renderInventory,reports:renderReports,find:renderFind,wanted:renderWanted,deals:renderDeals,vstock:renderVStock};
function rerender(){if(!session){renderChrome();return renderLogin()}(R[current]||(()=>{}))();renderChrome()}
function show(view){
  const allowed=!session?["login"]:session.t==="shop"?["counter","bills","customers","inventory","reports","find","wanted","deals"]:["vstock","deals"];
  if(!allowed.includes(view))view=allowed[0];
  current=view;VIEWS.forEach(v=>$("#view-"+v).hidden=v!==view);
  $("#content").classList.toggle("pos",view==="counter");$("#resetWrap").hidden=!session||view==="counter";
  closeSide();rerender();$("#content").scrollTop=0;
  try{history.replaceState(null,"","#"+view)}catch(e){}
}
function openOverlay(html,label){const ov=$("#overlay");ov.innerHTML=html;ov.setAttribute("aria-label",label);ov.hidden=false;const fx=ov.querySelector("input:not([type=checkbox]),textarea,#newSale,#sendSlip,[data-close]");if(fx)fx.focus()}
function closeOverlay(silent){$("#overlay").hidden=true;$("#overlay").innerHTML="";openBill=null;if(!silent)rerender()}
function openSheet(){$("#cart").classList.add("open");$("#sheetScrim").hidden=false}
function closeSheet(){$("#cart").classList.remove("open");$("#sheetScrim").hidden=true}
function setPressed(sel,val,key){document.querySelectorAll(sel+" button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset[key]===val)))}
let tt;function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2800)}
function copy(txt,ok,fb){try{navigator.clipboard.writeText(txt).then(()=>toast(ok),fb)}catch(e){fb()}}

/* ---------- events ---------- */
document.addEventListener("click",e=>{
  if(e.target.id==="overlay")return closeOverlay();
  const t=e.target.closest("button,tr[data-bill]");if(!t)return;const ds=t.dataset;
  if(ds.close!==undefined)return closeOverlay();
  if(ds.themeToggle!==undefined)return setTheme(effTheme()==="dark"?"light":"dark");
  if(ds.login){const [ty,id]=ds.login.split(":");return login(ty,id)}
  if(ds.view){if(!$("#overlay").hidden)closeOverlay(true);return show(ds.view)}
  if(ds.part)return tapPart(ds.part);
  if(ds.pstep){const i=document.querySelector(`#pickForm [data-pq="${CSS.escape(ds.v)}"]`);i.value=Math.min(Math.max((Math.floor(Number(i.value))||0)+Number(ds.pstep),0),+i.max);return updatePick()}
  if(ds.addbrand)return openAddBrand(ds.addbrand);
  if(ds.goadd!==undefined){show("inventory");$("#addForm").hidden=false;return $("#fName").focus()}
  if(ds.cat){f.cat=ds.cat;return renderCounter()}
  if(ds.veh){f.veh=ds.veh;setPressed("#vehSeg",ds.veh,"veh");return renderCounter()}
  if(ds.inc)return setQty(ds.inc,cart.find(x=>x.id===ds.inc).qty+1);
  if(ds.dec)return setQty(ds.dec,cart.find(x=>x.id===ds.dec).qty-1);
  if(ds.add10)return setQty(ds.add10,cart.find(x=>x.id===ds.add10).qty+10);
  if(ds.remove){cart=cart.filter(l=>l.id!==ds.remove);slipSent=null;return renderCounter()}
  if(ds.dtype){discount.type=ds.dtype;setPressed("#discSeg",ds.dtype,"dtype");return renderCart()}
  if(ds.paymode){if(!cart.length)return toast("Add parts to the bill first.");return openPay(ds.paymode)}
  if(ds.recv){$("#pRecv").value=ds.recv;return updatePay()}
  if(ds.setcust){const then=$("#custList").dataset.then;cartCust=ds.setcust;closeOverlay(true);renderCart();if(then&&cartCust!=="walkin")return openPay(then);return}
  if(ds.newcust!==undefined)return openNewCust(ds.newcust);
  if(ds.collect)return openCollect(ds.collect);
  if(ds.range){range=ds.range;return renderReports()}
  if(ds.bill!==undefined)return showInvoice(bills[+ds.bill],false);
  if(ds.find){find.pid=ds.find;find.q="";$("#fq").value="";return show("find")}
  if(ds.findq!==undefined){find.pid=null;find.q=ds.findq;$("#fq").value=ds.findq;return show("find")}
  if(ds.interest){const [ty,id,pid]=ds.interest.split(":");return openInterest("interest",{t:ty,id},pid,null,ds.brand||"")}
  if(ds.have){const w=net.wanted.find(x=>x.id===ds.have);return openInterest("offer",{t:"shop",id:w.shopId},w.pid,w.id)}
  if(ds.want){show("wanted");$("#wantForm").hidden=false;$("#wPart").value=ds.want;$("#wBrand").value=ds.brand||"";const mine=variantsOf(inventory,ds.want);$("#wQty").value=mine.length?Math.max(mine.reduce((a,v)=>a+v.reorder*2-v.stock,0),1):1;return $("#wQty").focus()}
  if(ds.share){const i=net.interests.find(x=>x.id===ds.share);i.status="shared";save();rerender();return toast(`Number shared with ${acct(i.from).name}`)}
  if(ds.decline){const i=net.interests.find(x=>x.id===ds.decline);i.status="declined";save();rerender();return toast("Declined. They'll see it was declined.")}
  if(ds.copy)return copy(ds.copy,"Number copied",()=>toast("Copy blocked here. The number is "+ds.copy));
  if(ds.dealtab){dealTab=ds.dealtab;return renderDeals()}
  if(ds.closepost){const w=net.wanted.find(x=>x.id===ds.closepost);w.open=!w.open;save();renderWanted();return toast(w.open?"Request reopened":"Request closed")}
  switch(t.id){
    case "menuBtn":$("#side").classList.add("open");$("#sideScrim").hidden=false;return;
    case "acctBtn":return logout();
    case "pickCust":return openCustPicker();
    case "pickBtn":return openSlip();
    case "sendSlip":{if(!slipSent){me.slipSeq=(me.slipSeq||0)+1;slipSent=t.dataset.no;save();toast(`Pick slip ${slipSent} sent to the store room`)}closeOverlay(true);return renderCart()}
    case "copySlip":{const txt=["PICK SLIP "+(slipSent||""),...cart.map(l=>{const p=inventory.find(x=>x.id===l.id);return `${p.rack||"-"}  ${l.qty} x ${full(p)} [${p.pn}]`})].join("\n");return copy(txt,"Slip copied",()=>toast("Copy blocked here."))}
    case "clearCart":cart=[];slipSent=null;cartCust="walkin";return renderCounter();
    case "openCart":return openSheet();
    case "closeCart":return closeSheet();
    case "newSale":closeOverlay(true);return show("counter");
    case "copyBill":{const txt=invoiceText(openBill);return copy(txt,"Bill copied. Paste it into WhatsApp or SMS.",()=>{$("#copyFallback").innerHTML=`<textarea class="copybox" id="copyArea" readonly aria-label="Bill text"></textarea>`;const a=$("#copyArea");a.value=txt;a.focus();a.select();toast("Text selected. Copy it with your keyboard or long-press.")})}
    case "toggleAdd":{const fm=$("#addForm");fm.hidden=!fm.hidden;if(!fm.hidden)$("#fName").focus();return}
    case "cancelAdd":$("#addForm").reset();$("#addForm").hidden=true;$("#formErr").textContent="";return;
    case "toggleWant":{const fm=$("#wantForm");fm.hidden=!fm.hidden;if(!fm.hidden)$("#wPart").focus();return}
    case "cancelWant":$("#wantForm").reset();$("#wantForm").hidden=true;$("#wErr").textContent="";return;
    case "toggleVAdd":{const fm=$("#vAddForm");fm.hidden=!fm.hidden;if(!fm.hidden)$("#vPart").focus();return}
    case "cancelVAdd":$("#vAddForm").reset();$("#vAddForm").hidden=true;$("#vErr").textContent="";return;
    case "clearFind":find.pid=null;return renderFind();
    case "lowOnly":inv.low=!inv.low;t.setAttribute("aria-pressed",String(inv.low));return renderInventory();
    case "resetAsk":$("#resetConfirm").hidden=false;t.hidden=true;return;
    case "resetNo":$("#resetConfirm").hidden=true;$("#resetAsk").hidden=false;return;
    case "resetYes":{const s=session;net=seedNet();save();$("#resetConfirm").hidden=true;$("#resetAsk").hidden=false;session=s;setMe();if(!me)return logout();rerender();return toast("Demo data restored")}
  }
});
$("#sideScrim").addEventListener("click",closeSide);
$("#sheetScrim").addEventListener("click",closeSheet);
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){if(!$("#overlay").hidden)closeOverlay();else{closeSheet();closeSide()}}
  if(e.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&current==="counter"){e.preventDefault();$("#q").focus()}
  if(e.key==="Enter"&&e.target.matches("tr[data-bill]"))showInvoice(bills[+e.target.dataset.bill],false);
});
document.addEventListener("input",e=>{const id=e.target.id;
  if(id==="q"){f.q=e.target.value;renderGrid()}
  else if(id==="invQ"){inv.q=e.target.value;renderInventory()}
  else if(id==="fq"){find.q=e.target.value;find.pid=null;renderFind()}
  else if(id==="vq"){vq=e.target.value;renderVStock()}
  else if(id==="discVal"){discount.value=Math.max(0,Number(e.target.value)||0);renderCart()}
  else if(id==="custQ"){$("#custList").innerHTML=custRows([WALKIN,...me.customers],e.target.value)}
  else if(id==="pRecv"||e.target.dataset.split)updatePay();
  else if(e.target.dataset.pq!==undefined)updatePick();
});
document.addEventListener("change",e=>{const d=e.target.dataset;
  if(d.qty)setQty(d.qty,e.target.value);
  if(e.target.matches("[data-brandsel]")){const n=$("#"+e.target.id+"New"),isNew=e.target.value===NEW_BRAND;n.hidden=!isNew;if(isNew)n.focus()}
  if(e.target.id==="brandF"){f.brand=e.target.value;renderCounter()}
  if(d.stock){const p=inventory.find(x=>x.id===d.stock);p.stock=Math.max(0,Math.floor(Number(e.target.value)||0));save();renderInventory();renderChrome();toast(`${full(p)}: stock set to ${p.stock}`)}
  if(d.vqty||d.vprice||d.vmoq){const id=d.vqty||d.vprice||d.vmoq,it=vItem(me,id),v=Math.max(0,Math.floor(Number(e.target.value)||0));if(d.vqty)it.qty=v;if(d.vprice)it.price=v;if(d.vmoq)it.moq=Math.max(1,v);save();renderVStock();toast(`${pname(it.pid,it.brand)} updated. Shops see the change now.`)}
});
document.addEventListener("submit",e=>{
  e.preventDefault();const fm=e.target;
  if(fm.id==="pickForm"){const rows=pickRows();
    if(!rows.some(r=>r.qty!==r.was))return rows.some(r=>r.qty)?(closeOverlay(true),renderCounter()):$("#pickErr").textContent="Choose how many of at least one brand, or tap Cancel.";
    const over=pickRows().filter(r=>(Number(r.i.value)||0)>r.v.stock);
    rows.forEach(({v,qty})=>{const line=cart.find(l=>l.id===v.id);if(qty<=0)cart=cart.filter(l=>l.id!==v.id);else if(line)line.qty=qty;else cart.push({id:v.id,qty})});
    slipSent=null;closeOverlay(true);renderCounter();
    const on=rows.filter(r=>r.qty>0);return toast(over.length?`Only ${over.map(r=>r.v.stock+" "+r.v.brand).join(", ")} in stock, so the bill has that many.`:on.length?"Bill updated: "+on.map(r=>r.qty+" × "+(r.v.brand||r.v.name)).join(", "):"Removed from the bill")}
  if(fm.id==="payForm"){const m=fm.dataset.mode,T=compute(cart,discount).total;
    if(m==="Cash"){const r=Number($("#pRecv").value)||0;if(r<T)return $("#pErr").textContent="Cash received is less than the total.";return completeSale("Cash",[{mode:"Cash",amount:T}],r>T?"Change "+money0(r-T):"")}
    if(m==="Split"){const parts=[...fm.querySelectorAll("[data-split]")].map(i=>({mode:i.dataset.split,amount:Number(i.value)||0}));if(r2(parts.reduce((a,p)=>a+p.amount,0))!==T)return $("#pErr").textContent="The amounts must add up to the total.";
      const used=parts.filter(p=>p.amount>0);return completeSale(used.length===1?used[0].mode:"Split",parts,"")}
    return completeSale(m,[{mode:m,amount:T}],($("#pRef")||{}).value||"")}
  if(fm.id==="custForm"){const name=$("#ncName").value.trim();if(!name)return $("#ncErr").textContent="Enter the customer's name.";
    const c={id:"c"+Date.now(),name,type:$("#ncType").value,phone:$("#ncPhone").value.trim(),gstin:$("#ncGst").value.trim().toUpperCase(),due:0};me.customers.push(c);save();
    const then=fm.dataset.then;closeOverlay(true);if(current==="counter"||then){cartCust=c.id;renderCart();if(then&&then!=="pick")return openPay(then)}else renderCustomers();return toast(`${name} added`)}
  if(fm.id==="collectForm"){const c=getCust(fm.dataset.id),a=Number($("#colAmt").value);if(!(a>0))return $("#colErr").textContent="Enter the amount received.";if(a>c.due)return $("#colErr").textContent=`That's more than the ${money0(c.due)} due.`;
    c.due=r2(c.due-a);save();closeOverlay(true);renderCustomers();return toast(`${money0(a)} received from ${c.name} by ${$("#colMode")?$("#colMode").value:"cash"}`)}
  if(fm.id==="intForm"){const qty=Math.floor(Number($("#iQty").value)),min=+fm.dataset.min,price=$("#iPrice").value===""?null:Number($("#iPrice").value);
    if(!(qty>=1))return $("#iErr").textContent="Enter how many you need.";if(qty<min)return $("#iErr").textContent=`This supplier's minimum order is ${min}.`;
    if(fm.dataset.kind==="offer"){const n=myStock(fm.dataset.pid,fm.dataset.brand);if(qty>n)return $("#iErr").textContent=`You only have ${n} in stock.`}
    if(price!==null&&!(price>=0))return $("#iErr").textContent="Enter a price of ₹0 or more, or leave it blank.";
    const [ty,id]=fm.dataset.to.split(":"),to={t:ty,id};const rec={id:"i"+Date.now(),kind:fm.dataset.kind,from:{t:session.t,id:session.id},to,pid:fm.dataset.pid,brand:fm.dataset.brand||"",qty,price,note:$("#iNote").value.trim(),status:"pending",at:new Date().toISOString()};if(fm.dataset.wid)rec.wid=fm.dataset.wid;
    net.interests.push(rec);save();closeOverlay();return toast(`${fm.dataset.kind==="offer"?"Offer":"Interest"} sent to ${acct(to).name}. Their number appears under Interests when they accept.`)}
  if(fm.id==="wantForm"){const qty=Math.floor(Number($("#wQty").value)),offer=$("#wOffer").value===""?null:Number($("#wOffer").value);if(!(qty>=1))return $("#wErr").textContent="Enter how many you need.";
    net.wanted.push({id:"w"+Date.now(),shopId:me.id,pid:$("#wPart").value,brand:$("#wBrand").value,qty,offer,note:$("#wNote").value.trim(),open:true,at:new Date().toISOString()});save();fm.reset();fm.hidden=true;$("#wErr").textContent="";renderWanted();return toast(`Posted to ${shopsVisibleTo(me).length} shops in other areas`)}
  if(fm.id==="vAddForm"){const pid=$("#vPart").value,qty=Number($("#vQty").value),price=Number($("#vPrice").value),moq=Math.max(1,Math.floor(Number($("#vMoq").value)||1));
    const b=readBrand($("#vBrand"));if(b.err)return $("#vErr").textContent=b.err;
    if(vItem(me,vid(pid,b.brand)))return $("#vErr").textContent=`You already list ${pname(pid,b.brand)}. Change its stock in the table below.`;
    if($("#vQty").value===""||!(qty>=0))return $("#vErr").textContent="Enter how many you have (0 is fine).";if(!(price>0))return $("#vErr").textContent="Enter your trade price.";
    keepBrand(b);me.stock.unshift({id:vid(pid,b.brand),pid,brand:b.brand,qty:Math.floor(qty),price,moq});save();fm.reset();resetBrandSel($("#vBrand"));fm.hidden=true;$("#vErr").textContent="";renderVStock();return toast(`${pname(pid,b.brand)} listed. Shops can find it now.${brandNote(b)}`)}
  if(fm.id==="brandForm"){const pid=fm.dataset.pid,vs=variantsOf(inventory,pid),p=vs[0],v=id=>$(id).value.trim(),price=Number(v("#bPrice")),cost=Number(v("#bCost"))||0,stock=Number(v("#bStock"));
    const b=readBrand($("#bBrand"));if(b.err)return $("#bErr").textContent=b.err;
    if(vs.some(x=>x.brand===b.brand))return $("#bErr").textContent=`You already stock ${b.brand}. Change its stock in the inventory table.`;
    if(!(price>0))return $("#bErr").textContent="Enter a selling price above ₹0.";if(v("#bStock")===""||!(stock>=0))return $("#bErr").textContent="Enter the opening stock (0 is fine).";
    keepBrand(b);const row={...clone(p),id:vid(pid,b.brand),pid,brand:b.brand,pn:(v("#bPn")||((sfx=>p.brand&&p.pn.endsWith(sfx)?p.pn.slice(0,-sfx.length):p.pn)("-"+slug(p.brand||"").slice(0,3).toUpperCase())+"-"+slug(b.brand).slice(0,3).toUpperCase())).toUpperCase(),price,cost,tiers:[],stock:Math.floor(stock),reorder:Number(v("#bReorder"))||5,rack:v("#bRack").toUpperCase()};
    inventory.splice(inventory.lastIndexOf(vs[vs.length-1])+1,0,row);save();closeOverlay(true);renderInventory();renderChrome();return toast(`${full(row)} added. It shows on the counter under ${p.name}.${brandNote(b)}`)}
  if(fm.id==="addForm"){const v=id=>$(id).value.trim(),name=v("#fName"),price=Number(v("#fPrice")),cost=Number(v("#fCost"))||0,stock=Number(v("#fStock"));
    if(!name)return $("#formErr").textContent="Give the part a name.";if(!(price>0))return $("#formErr").textContent="Enter a selling price above ₹0.";
    if(v("#fStock")===""||!(stock>=0))return $("#formErr").textContent="Enter the opening stock (0 is fine).";
    const bm=Number(v("#fBulkMin")),bp=Number(v("#fBulkPrice"));if((bm||bp)&&!(bm>=2&&bp>0&&bp<price))return $("#formErr").textContent="Bulk price needs a quantity of 2 or more and a price below the selling price.";
    const b=readBrand($("#fBrand"));if(b.err)return $("#formErr").textContent=b.err;keepBrand(b);const pid="x"+Date.now();
    inventory.unshift({id:vid(pid,b.brand),pid,brand:b.brand,name,fits:v("#fFits")||"Universal",pn:(v("#fPn")||("NP-"+String(inventory.length+1).padStart(4,"0"))).toUpperCase(),veh:v("#fVeh"),cat:v("#fCat"),hsn:v("#fHsn")||"8708",price,cost,rack:v("#fRack").toUpperCase(),tiers:bm?[{min:bm,price:bp}]:[],stock:Math.floor(stock),reorder:Number(v("#fReorder"))||5});
    save();fm.reset();resetBrandSel($("#fBrand"));fm.hidden=true;$("#formErr").textContent="";renderInventory();renderChrome();return toast(`${b.brand} ${name} added to inventory.${brandNote(b)}`)}
});
$("#fCat").innerHTML=CATS.map(c=>`<option>${c}</option>`).join("");
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",paintThemeBtns);

/* ---------- boot ---------- */
net=read("pd6.net")||seedNet();save();
session=read("pd5.me");setMe();
const start=(location.hash||"").slice(1);
if(session){if(session.t==="shop"&&session.id==="s1"){demoCart()}show(start||"counter")}
else show("login");
})();
