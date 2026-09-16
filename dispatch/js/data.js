export const BRAND = 'Dispatch';
export const TAGLINE = 'Ordnance, delivered.';

// ---------- Locations ----------
// region: gaza | westbank | lebanon | yemen | iraq | syria | iran
// partner: true means fulfilled by a partner force using US-supplied munitions.
export const LOCATIONS = [
  { id: 'gaza-city', name: 'Gaza City', country: 'Gaza', region: 'gaza', lat: 31.50, lon: 34.47, fulfilledBy: 'Partner', eta: '4 min', partner: true, badge: 'Popular' },
  { id: 'khan-younis', name: 'Khan Younis', country: 'Gaza', region: 'gaza', lat: 31.34, lon: 34.31, fulfilledBy: 'Partner', eta: '4 min', partner: true },
  { id: 'rafah', name: 'Rafah', country: 'Gaza', region: 'gaza', lat: 31.29, lon: 34.25, fulfilledBy: 'Partner', eta: '5 min', partner: true },
  { id: 'jenin', name: 'Jenin', country: 'West Bank', region: 'westbank', lat: 32.46, lon: 35.30, fulfilledBy: 'Partner', eta: '6 min', partner: true },
  { id: 'beirut', name: 'Beirut (Dahieh)', country: 'Lebanon', region: 'lebanon', lat: 33.85, lon: 35.50, fulfilledBy: 'Partner', eta: '8 min', partner: true },
  { id: 'sanaa', name: 'Sanaa', country: 'Yemen', region: 'yemen', lat: 15.37, lon: 44.19, fulfilledBy: 'USS Harry S. Truman CSG, Red Sea', eta: '22 min', partner: false, badge: 'Popular' },
  { id: 'hodeidah', name: 'Hodeidah', country: 'Yemen', region: 'yemen', lat: 14.80, lon: 42.95, fulfilledBy: 'USS Harry S. Truman CSG, Red Sea', eta: '14 min', partner: false },
  { id: 'saada', name: 'Saada', country: 'Yemen', region: 'yemen', lat: 16.94, lon: 43.76, fulfilledBy: 'USS Harry S. Truman CSG, Red Sea', eta: '25 min', partner: false },
  { id: 'baghdad', name: 'Baghdad', country: 'Iraq', region: 'iraq', lat: 33.31, lon: 44.37, fulfilledBy: 'Al Asad Air Base', eta: '15 min', partner: false },
  { id: 'erbil', name: 'Erbil', country: 'Iraq', region: 'iraq', lat: 36.19, lon: 44.01, fulfilledBy: 'Erbil Air Base', eta: '6 min', partner: false },
  { id: 'deir-ez-zor', name: 'Deir ez-Zor', country: 'Syria', region: 'syria', lat: 35.34, lon: 40.14, fulfilledBy: 'Al Tanf Garrison', eta: '18 min', partner: false },
  { id: 'tehran', name: 'Tehran', country: 'Iran', region: 'iran', lat: 35.69, lon: 51.39, fulfilledBy: 'Whiteman AFB, MO', eta: '18 hr', partner: false, badge: 'New' },
  { id: 'isfahan', name: 'Isfahan', country: 'Iran', region: 'iran', lat: 32.65, lon: 51.68, fulfilledBy: 'USS Georgia (SSGN), Arabian Sea', eta: '12 min', partner: false },
  { id: 'natanz', name: 'Natanz', country: 'Iran', region: 'iran', lat: 33.72, lon: 51.73, fulfilledBy: 'Whiteman AFB, MO', eta: '18 hr', partner: false },
  { id: 'fordow', name: 'Fordow', country: 'Iran', region: 'iran', lat: 34.88, lon: 50.99, fulfilledBy: 'Whiteman AFB, MO', eta: '18 hr', partner: false, badge: 'New' },
  { id: 'bandar-abbas', name: 'Bandar Abbas', country: 'Iran', region: 'iran', lat: 27.18, lon: 56.27, fulfilledBy: 'USS Nimitz CSG, Gulf of Oman', eta: '9 min', partner: false },
];

export const COMING_SOON = [
  { name: 'Caracas', country: 'Venezuela' },
  { name: 'Culiacán', country: 'Mexico' },
  { name: 'Nuuk', country: 'Greenland' },
  { name: 'Panama City', country: 'Panama' },
  { name: 'Mogadishu', country: 'Somalia', note: 'Back in stock soon' },
];

export function locationById(id) {
  return LOCATIONS.find((l) => l.id === id);
}

// ---------- Categories ----------
export const CATEGORIES = [
  { id: 'bundles', label: 'Bundles' },
  { id: 'munitions', label: 'Munitions' },
  { id: 'sorties', label: 'Air Sorties' },
  { id: 'naval', label: 'Naval' },
  { id: 'ground', label: 'Ground Deployment' },
  { id: 'airdefense', label: 'Air Defense' },
];

// ---------- Products ----------
// basis: each | hour | day | rotation
// step: quantity block size; minQty: minimum order (a multiple of step)
// regions: 'all' or array of region ids; partner: available at partner-fulfilled locations
const TWZ = 'https://www.twz.com/32277/here-is-what-each-of-the-pentagons-air-launched-missiles-and-bombs-actually-cost';
const COMPTROLLER = 'https://comptroller.war.gov/Portals/45/documents/rates/fy2025/2025_b_c.pdf';
const COSTS_OF_WAR = 'https://costsofwar.watson.brown.edu/sites/default/files/2025-10/Wider-Middle-East-Costs_Costs-of-War_Bilmes_10.7.25.pdf';
const CENTER_SQUARE = 'https://www.thecentersquare.com/national/article_d8b141f3-4bfb-4832-bc6d-25fe5f86da66.html';
const TWZ_MIDNIGHT = 'https://www.twz.com/air/pentagon-moves-to-replace-weapons-it-used-in-operation-midnight-hammer-that-struck-irans-nuclear-facilities';
const NORSK = 'https://norskluftvern.com/2025/07/28/american-vs-european-missile-defense-critical-cost-analysis-of-gbi-sm-3-sm-6-thaad-pac-3-amraam-aster-30-and-iris-t/';
const USNI = 'https://news.usni.org/2026/04/06/new-navy-budget-wants-3b-for-new-tomahawks-4-3b-for-sm-6s';
const LEXINGTON = 'https://www.lexingtoninstitute.org/wp-content/uploads/2019/10/Brief-The-Logic-of-Aircraft-Carrier-Strike-Groups2.pdf';
const SPARTAN = 'https://www.asafm.army.mil/Portals/72/Documents/BudgetMaterial/2023/Base%20Budget/Military%20Personnel/MPA_OOC.pdf';
const HELLFIRE_WIKI = 'https://en.wikipedia.org/wiki/AGM-114_Hellfire';

const M = (o) => ({ category: 'munitions', basis: 'each', step: 1, minQty: 1, regions: 'all', partner: false, ...o });
const S = (o) => ({ category: 'sorties', basis: 'hour', regions: 'all', partner: false, fy: 2025, source: 'DoD Comptroller FY2025 reimbursable rates ("All Other" column)', sourceUrl: COMPTROLLER, ...o });
const N = (o) => ({ category: 'naval', basis: 'day', step: 7, minQty: 7, regions: ['yemen', 'iran'], partner: false, ...o });
const G = (o) => ({ category: 'ground', basis: 'rotation', step: 1, minQty: 1, regions: ['iraq', 'syria'], partner: false, fy: 2023, source: 'Army FY2023 MPA overseas ops: Spartan Shield $1,322.5M / 13,091 man-years ≈ $101k per soldier-year', sourceUrl: SPARTAN, ...o });
const A = (o) => ({ category: 'airdefense', basis: 'each', step: 1, minQty: 1, regions: 'all', partner: false, ...o });

export const PRODUCTS = [
  // Munitions
  M({ id: 'tlam', name: 'Tomahawk Block V', spec: 'Sea-launched cruise missile, 1,000 mi range', price: 2400000, shipsFrom: 'NWS Yorktown, VA', regions: ['yemen', 'iran', 'syria', 'iraq'], icon: 'missile', fy: 2025, source: 'Center Square analysis of Pentagon replacement cost, Operation Midnight Hammer', sourceUrl: CENTER_SQUARE }),
  M({ id: 'mop', name: 'GBU-57/B Massive Ordnance Penetrator', spec: '30,000 lb bunker buster. B-2 only.', price: 3500000, shipsFrom: 'Whiteman AFB, MO', regions: ['iran'], icon: 'bomb', fy: 2025, source: 'Pentagon replacement request: $123M for 14 MOPs', sourceUrl: TWZ_MIDNIGHT }),
  M({ id: 'gbu31', name: 'GBU-31 JDAM (MK-84)', spec: '2,000 lb, GPS/INS guided', price: 37000, shipsFrom: 'McAlester AAP, OK', partner: true, icon: 'bomb', fy: 2021, source: 'TWZ: $16,000 MK-84 body + $21,000 JDAM kit', sourceUrl: TWZ }),
  M({ id: 'gbu32', name: 'GBU-32 JDAM (MK-83)', spec: '1,000 lb, GPS/INS guided', price: 31000, shipsFrom: 'McAlester AAP, OK', partner: true, icon: 'bomb', fy: 2021, source: 'TWZ: est. $10,000 MK-83 body + $21,000 JDAM kit', sourceUrl: TWZ, note: 'Body price interpolated between MK-82 and MK-84.' }),
  M({ id: 'gbu38', name: 'GBU-38 JDAM (MK-82)', spec: '500 lb, GPS/INS guided', price: 25000, shipsFrom: 'McAlester AAP, OK', partner: true, icon: 'bomb-small', fy: 2021, source: 'TWZ: $4,000 MK-82 body + $21,000 JDAM kit', sourceUrl: TWZ }),
  M({ id: 'gbu39', name: 'GBU-39/B Small Diameter Bomb', spec: '250 lb glide bomb, 40 nmi', price: 39000, shipsFrom: 'Boeing, St. Charles, MO', partner: true, icon: 'bomb-small', fy: 2021, source: 'TWZ: FY2021 Air Force unit cost', sourceUrl: TWZ }),
  M({ id: 'gbu12', name: 'GBU-12 Paveway II', spec: '500 lb, laser guided', price: 22000, shipsFrom: 'Raytheon, Tucson, AZ', partner: true, icon: 'bomb-small', fy: 2021, source: 'Estimate: Paveway II kit ≈ $18,000 + $4,000 MK-82 body', sourceUrl: TWZ, note: 'Estimate.' }),
  M({ id: 'hellfire', name: 'AGM-114 Hellfire', spec: 'Air-to-ground missile, 100 lb, laser', price: 150000, shipsFrom: 'Lockheed Martin, Orlando, FL', partner: true, icon: 'missile', fy: 2021, source: 'FY2021 Army unit cost', sourceUrl: HELLFIRE_WIKI }),
  M({ id: 'r9x', name: 'AGM-114R9X "Ninja"', spec: 'Kinetic variant, no warhead, six blades', price: 150000, shipsFrom: 'Undisclosed', icon: 'missile', fy: 2021, source: 'Priced as standard Hellfire; R9X unit cost not published', sourceUrl: HELLFIRE_WIKI, note: 'Estimate.' }),
  M({ id: 'jassm', name: 'AGM-158B JASSM-ER', spec: 'Stealth cruise missile, 600 mi', price: 1266000, shipsFrom: 'Lockheed Martin, Troy, AL', icon: 'missile', fy: 2021, source: 'TWZ: FY2021 Air Force unit cost', sourceUrl: TWZ }),
  M({ id: 'aargm', name: 'AGM-88G AARGM-ER', spec: 'Extended-range anti-radiation missile', price: 6149000, shipsFrom: 'Northrop Grumman, Northridge, CA', icon: 'missile', fy: 2021, source: 'TWZ: FY2021 Navy unit cost', sourceUrl: TWZ }),
  M({ id: 'apkws', name: 'APKWS II', spec: '70 mm laser-guided rocket', price: 22000, shipsFrom: 'BAE Systems, Hudson, NH', icon: 'rocket', fy: 2025, source: 'Pentagon replacement request after Midnight Hammer', sourceUrl: TWZ_MIDNIGHT }),
  M({ id: 'mk82', name: 'MK-82 bomb body', spec: '500 lb, unguided', price: 4000, shipsFrom: 'McAlester AAP, OK', partner: true, icon: 'bomb-small', fy: 2021, source: 'TWZ', sourceUrl: TWZ }),
  M({ id: 'mk84', name: 'MK-84 bomb body', spec: '2,000 lb, unguided', price: 16000, shipsFrom: 'McAlester AAP, OK', partner: true, icon: 'bomb', fy: 2021, source: 'TWZ', sourceUrl: TWZ }),
  M({ id: 'm795', name: '155 mm M795 HE shell', spec: 'Artillery projectile, 14 mi', price: 3000, shipsFrom: 'Scranton AAP, PA', partner: true, icon: 'shell', fy: 2024, source: 'Widely reported Army procurement unit cost', sourceUrl: 'https://en.wikipedia.org/wiki/M795', note: 'Estimate.' }),

  // Air sorties (per flight hour). Rates are the FY2025 Comptroller "All Other" column.
  S({ id: 'b2', name: 'B-2A Spirit', spec: 'Stealth bomber, 36 hr round trip', price: 91523, step: 36, minQty: 36, shipsFrom: 'Whiteman AFB, MO', regions: ['iran'], icon: 'bomber' }),
  S({ id: 'b1', name: 'B-1B Lancer', spec: 'Supersonic heavy bomber', price: 94983, step: 4, minQty: 4, shipsFrom: 'Al Udeid AB, Qatar', icon: 'bomber' }),
  S({ id: 'b52', name: 'B-52H Stratofortress', spec: 'Heavy bomber, 70,000 lb payload', price: 65153, step: 4, minQty: 4, shipsFrom: 'Diego Garcia', icon: 'bomber' }),
  S({ id: 'f35a', name: 'F-35A Lightning II', spec: 'Stealth multirole fighter', price: 17835, step: 2, minQty: 2, shipsFrom: 'Al Dhafra AB, UAE', icon: 'jet' }),
  S({ id: 'f15e', name: 'F-15E Strike Eagle', spec: 'Two-seat strike fighter', price: 27531, step: 2, minQty: 2, shipsFrom: 'Muwaffaq Salti AB, Jordan', icon: 'jet' }),
  S({ id: 'f16c', name: 'F-16C Fighting Falcon', spec: 'Multirole fighter', price: 14222, step: 2, minQty: 2, shipsFrom: 'Al Udeid AB, Qatar', icon: 'jet' }),
  S({ id: 'f22', name: 'F-22A Raptor', spec: 'Air superiority fighter', price: 58771, step: 2, minQty: 2, shipsFrom: 'Al Udeid AB, Qatar', icon: 'jet' }),
  S({ id: 'fa18', name: 'F/A-18E Super Hornet', spec: 'Carrier strike fighter', price: 21555, step: 2, minQty: 2, shipsFrom: 'Carrier deck', regions: ['yemen', 'iran'], icon: 'jet', note: 'Priced at the EA-18G rate (same airframe); F/A-18E/F not in the extracted table.' }),
  S({ id: 'ea18g', name: 'EA-18G Growler', spec: 'Electronic attack', price: 21555, step: 2, minQty: 2, shipsFrom: 'Carrier deck', regions: ['yemen', 'iran'], icon: 'jet' }),
  S({ id: 'ac130', name: 'AC-130J Ghostrider', spec: 'Gunship, 30 mm + 105 mm', price: 12170, step: 3, minQty: 3, shipsFrom: 'Hurlburt Field, FL (fwd)', regions: ['iraq', 'syria', 'yemen'], icon: 'tanker' }),
  S({ id: 'mq9', name: 'MQ-9A Reaper', spec: 'Armed UAS, 27 hr endurance', price: 9626, step: 8, minQty: 8, shipsFrom: 'Undisclosed', regions: ['yemen', 'iraq', 'syria'], icon: 'drone', note: 'Navy MQ-9A rate; the Air Force line ($896) excludes contractor logistics.' }),
  S({ id: 'kc135', name: 'KC-135R Stratotanker', spec: 'Aerial refueling', price: 21165, step: 1, minQty: 1, shipsFrom: 'Al Udeid AB, Qatar', icon: 'tanker' }),
  S({ id: 'kc46', name: 'KC-46A Pegasus', spec: 'Aerial refueling', price: 13463, step: 1, minQty: 1, shipsFrom: 'Al Udeid AB, Qatar', icon: 'tanker' }),
  S({ id: 'e3', name: 'E-3 Sentry AWACS', spec: 'Airborne early warning', price: 37413, step: 4, minQty: 4, shipsFrom: 'Prince Sultan AB, KSA', icon: 'radar' }),
  S({ id: 'rc135', name: 'RC-135V Rivet Joint', spec: 'Signals intelligence', price: 20338, step: 6, minQty: 6, shipsFrom: 'Al Udeid AB, Qatar', icon: 'radar' }),

  // Naval (per day, 7-day blocks)
  N({ id: 'csg', name: 'Carrier Strike Group', spec: 'Carrier, air wing, 5 escorts, 6,700 sailors', price: 6500000, shipsFrom: 'Norfolk, VA', icon: 'carrier', fy: 2019, source: 'Lexington Institute; Costs of War (Oct 2025) cites $9.05M/day', sourceUrl: LEXINGTON, note: 'Estimate. Uses the older Lexington Institute figure; Costs of War (Oct 2025) cites $9.05M/day.' }),
  N({ id: 'ddg', name: 'Arleigh Burke destroyer (DDG)', spec: '96 VLS cells, Aegis', price: 700000, shipsFrom: 'Norfolk, VA', icon: 'ship', fy: 2025, source: 'Derived from ~$250M annual O&S', sourceUrl: COSTS_OF_WAR, note: 'Estimate.' }),
  N({ id: 'ssgn', name: 'Ohio-class SSGN', spec: '154 Tomahawk cells', price: 1100000, shipsFrom: 'Kings Bay, GA', icon: 'sub', fy: 2025, source: 'Derived estimate', sourceUrl: COSTS_OF_WAR, note: 'Estimate.' }),
  N({ id: 'meu', name: 'Marine Expeditionary Unit (ARG/MEU)', spec: '2,200 Marines, 3 amphibious ships', price: 3000000, shipsFrom: 'Camp Lejeune, NC', icon: 'ship', fy: 2025, source: 'Derived estimate', sourceUrl: COSTS_OF_WAR, note: 'Estimate.' }),

  // Ground (per 9-month rotation of the named unit)
  G({ id: 'abct', name: 'Armored Brigade Combat Team', spec: '100 soldiers, 9-month rotation', price: 7575000, shipsFrom: 'Fort Cavazos, TX', icon: 'soldiers' }),
  G({ id: 'sfoda', name: 'Special Forces ODA', spec: '12 operators, 9-month rotation', price: 909000, shipsFrom: 'Fort Liberty, NC', icon: 'soldiers' }),
  G({ id: 'adv', name: 'Advise-and-assist team', spec: '50 soldiers, 9-month rotation', price: 3787500, shipsFrom: 'Fort Moore, GA', icon: 'soldiers' }),

  // Air defense (per interceptor)
  A({ id: 'thaad', name: 'THAAD interceptor', spec: 'Terminal-phase ballistic missile defense', price: 12700000, shipsFrom: 'Fort Bliss, TX', partner: true, icon: 'interceptor', fy: 2025, source: 'Norsk luftvern cost analysis / MDA budget', sourceUrl: NORSK }),
  A({ id: 'pac3', name: 'Patriot PAC-3 MSE', spec: 'Hit-to-kill interceptor', price: 4200000, shipsFrom: 'Lockheed Martin, Camden, AR', icon: 'interceptor', fy: 2025, source: 'Army FY2025 budget', sourceUrl: NORSK }),
  A({ id: 'sm3', name: 'SM-3 Block IIA', spec: 'Exo-atmospheric interceptor', price: 27900000, shipsFrom: 'Aegis destroyer', partner: true, icon: 'interceptor', fy: 2025, source: 'MDA budget via Norsk luftvern', sourceUrl: NORSK }),
  A({ id: 'sm6', name: 'SM-6', spec: 'Multi-mission interceptor', price: 4300000, shipsFrom: 'Aegis destroyer', icon: 'interceptor', fy: 2026, source: 'USNI: Navy FY26 request', sourceUrl: USNI }),
  A({ id: 'sm2', name: 'SM-2', spec: 'Medium-range interceptor', price: 2100000, shipsFrom: 'Aegis destroyer', icon: 'interceptor', fy: 2024, source: 'Commonly cited', sourceUrl: NORSK, note: 'Estimate.' }),
];

export const PRODUCTS_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

// Coordinates for every distinct shipsFrom value in the catalog, so the delivery map
// can draw a real route. At-sea origins are the station the relevant fleet actually
// operates from for the region in question.
export const ORIGINS = {
  'Whiteman AFB, MO': { lat: 38.73, lon: -93.55 },
  'NWS Yorktown, VA': { lat: 37.23, lon: -76.55 },
  'McAlester AAP, OK': { lat: 34.93, lon: -95.77 },
  'Boeing, St. Charles, MO': { lat: 38.79, lon: -90.51 },
  'Raytheon, Tucson, AZ': { lat: 32.15, lon: -110.92 },
  'Lockheed Martin, Orlando, FL': { lat: 28.48, lon: -81.43 },
  'Lockheed Martin, Troy, AL': { lat: 31.81, lon: -85.97 },
  'Lockheed Martin, Camden, AR': { lat: 33.58, lon: -92.83 },
  'Northrop Grumman, Northridge, CA': { lat: 34.23, lon: -118.54 },
  'BAE Systems, Hudson, NH': { lat: 42.76, lon: -71.44 },
  'Scranton AAP, PA': { lat: 41.41, lon: -75.66 },
  'Diego Garcia': { lat: -7.31, lon: 72.41 },
  'Al Udeid AB, Qatar': { lat: 25.12, lon: 51.32 },
  'Al Dhafra AB, UAE': { lat: 24.25, lon: 54.55 },
  'Muwaffaq Salti AB, Jordan': { lat: 31.83, lon: 36.78 },
  'Prince Sultan AB, KSA': { lat: 24.06, lon: 47.58 },
  'Hurlburt Field, FL (fwd)': { lat: 30.43, lon: -86.69 },
  'Carrier deck': { lat: 26.5, lon: 56.5 },
  'Norfolk, VA': { lat: 36.95, lon: -76.33 },
  'Kings Bay, GA': { lat: 30.80, lon: -81.51 },
  'Camp Lejeune, NC': { lat: 34.63, lon: -77.35 },
  'Fort Cavazos, TX': { lat: 31.14, lon: -97.78 },
  'Fort Liberty, NC': { lat: 35.14, lon: -79.01 },
  'Fort Moore, GA': { lat: 32.35, lon: -84.97 },
  'Fort Bliss, TX': { lat: 31.81, lon: -106.42 },
  'Aegis destroyer': { lat: 26.5, lon: 56.5 },
  'Undisclosed': { lat: 25.12, lon: 51.32 },
  // Forward bases and stations. These are the fulfilledBy values on LOCATIONS, and they
  // are where a munition is actually loaded for its delivery leg — see originFor below.
  'Al Asad Air Base': { lat: 33.79, lon: 42.44 },
  'Erbil Air Base': { lat: 36.24, lon: 43.96 },
  'Al Tanf Garrison': { lat: 33.50, lon: 38.65 },
  'USS Harry S. Truman CSG, Red Sea': { lat: 19.00, lon: 38.50 },
  'USS Georgia (SSGN), Arabian Sea': { lat: 20.00, lon: 60.00 },
  'USS Nimitz CSG, Gulf of Oman': { lat: 24.80, lon: 58.50 },
  // Partner-fulfilled destinations are supplied with US munitions flown from a partner
  // airbase, not from the United States.
  'Partner': { lat: 31.23, lon: 34.66 },
};

// Where a product's delivery leg actually starts.
//
// A product's shipsFrom is where it comes from in a supply-chain sense: the plant that
// builds a bomb, the depot that stores it. That is the right answer for anything that
// flies or sails itself to the target, because a B-2 really does take off from Missouri
// and a carrier really does sail from Norfolk. It is the wrong answer for a munition:
// a small diameter bomb does not fly from a factory in Missouri to Baghdad, it is
// loaded onto an aircraft at the forward base that serves that destination. Drawing the
// factory as the origin also contradicted the tracker, which says "Loading at Al Asad
// Air Base" while the map showed three lines leaving the United States.
//
// So munitions and interceptors originate at the destination's own fulfilling unit;
// everything else uses its real basing location.
const LOADED_AT_FORWARD_BASE = new Set(['munitions', 'airdefense']);

// "Partner" is a fulfilment model, not a place, and "Loading at Partner" reads badly on
// the tracker. Name the thing it actually is.
const ORIGIN_LABELS = { Partner: 'Partner air base' };
const originLabel = (name) => ORIGIN_LABELS[name] || name;

export function originFor(product, location) {
  if (LOADED_AT_FORWARD_BASE.has(product.category)) {
    const forward = ORIGINS[location && location.fulfilledBy];
    if (forward) return { ...forward, label: originLabel(location.fulfilledBy) };
  }
  const direct = ORIGINS[product.shipsFrom];
  if (direct) return { ...direct, label: product.shipsFrom };
  const viaLocation = ORIGINS[location && location.fulfilledBy];
  if (viaLocation) return { ...viaLocation, label: originLabel(location.fulfilledBy) };
  return { lat: 25.12, lon: 51.32, label: product.shipsFrom || 'Undisclosed' };
}

// ---------- Bundles ----------
export const BUNDLES = [
  { id: 'get-well-soon', name: 'Get Well Soon', tagline: 'For hospitals, clinics, and field wards.', items: { gbu31: 2, gbu39: 4, m795: 12 }, icon: 'gift' },
  { id: 'back-to-school', name: 'Back to School', tagline: 'Everything a school needs for the new term.', items: { gbu32: 3, gbu39: 6, mk82: 4 }, icon: 'gift' },
  { id: 'aid-convoy', name: 'Aid Convoy Special', tagline: 'Perfect for marked vehicles. Limited time.', items: { hellfire: 3, mq9: 8 }, icon: 'gift' },
  { id: 'wedding-party', name: 'Wedding Party Pack', tagline: 'Celebrate the big day. Serves 40 to 60.', items: { hellfire: 2, gbu12: 1, mq9: 8 }, icon: 'gift' },
  { id: 'press-corps', name: 'Press Corps Bundle', tagline: 'Extra coverage.', items: { gbu39: 1, hellfire: 1, mq9: 8 }, icon: 'gift' },
  { id: 'deep-clean', name: 'Deep Clean', tagline: 'For hardened underground facilities. Iran only.', items: { mop: 2, b2: 36, kc135: 4 }, icon: 'gift' },
  { id: 'red-sea-starter', name: 'Red Sea Starter', tagline: 'Six weeks of freedom of navigation.', items: { tlam: 10, csg: 7, sm6: 4 }, icon: 'gift' },
];

// ---------- Availability ----------
export function isAvailable(product, location) {
  if (!location) return false;
  if (product.regions !== 'all' && !product.regions.includes(location.region)) return false;
  if (location.partner && !product.partner) return false;
  return true;
}

export function bundleAvailable(bundle, location) {
  return Object.keys(bundle.items).every((id) => isAvailable(PRODUCTS_BY_ID[id], location));
}

// ---------- Deterministic flavor ----------
export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function ratingFor(productId) {
  const h = hash(productId);
  return { rating: 4.2 + ((h % 9) / 10), count: 140 + (h % 2900) };
}

const SIGNATURES = [
  'Verified purchaser · OSD Policy',
  'J3, CENTCOM',
  'Contracting officer, DLA',
  'HAC-D professional staff',
  'Deputy PM, PEO Missiles & Space',
  'Fifth Fleet N3',
  'Desk officer, NEA',
  'Verified purchaser · Joint Staff J5',
  'Action officer, AFCENT',
  'Budget analyst, OMB National Security',
];

const REVIEW_POOL = [
  { stars: 5, text: 'Arrived exactly at the coordinates. Would authorize again.' },
  { stars: 5, text: 'Second order this quarter. Supplemental funding made checkout painless.' },
  { stars: 4, text: 'Docked one star: continuing resolution delayed delivery by a fiscal quarter.' },
  { stars: 5, text: 'Great value at this price point. Frequently reorder for the whole AOR.' },
  { stars: 5, text: 'Packaging was discreet. Battle damage assessment came back exactly as described.' },
  { stars: 4, text: 'Works as advertised. Wish the FY26 inventory were deeper.' },
  { stars: 5, text: 'The J3 loved it. Already added to our standing requirements.' },
  { stars: 5, text: 'Delivered ahead of the estimated window. Five stars, no notes.' },
  { stars: 4, text: 'Solid product. Refueling handling fee felt steep on a smaller order.' },
  { stars: 5, text: 'We had a tight timeline before markup and this shipped same day.' },
  { stars: 3, text: 'Fine. Had to re-submit the authorization twice. Delivery itself was flawless.' },
  { stars: 5, text: 'Went with the bundle and saved a bunch. Recommend for first-time buyers.' },
  { stars: 5, text: 'Exactly what the requirement called for. Reordering under drawdown authority.' },
  { stars: 4, text: 'Good coverage, minimal handling. Tip option for aircrew is a nice touch.' },
  { stars: 5, text: 'Honestly cheaper than I expected once the OCO line kicked in.' },
];

export function reviewsFor(productId) {
  const h = hash(productId);
  const out = [];
  for (let i = 0; i < 3; i++) {
    const r = REVIEW_POOL[(h + i * 7) % REVIEW_POOL.length];
    const sig = SIGNATURES[(h >>> (i * 3)) % SIGNATURES.length];
    out.push({ stars: r.stars, text: r.text, signature: sig });
  }
  return out;
}

const UNITS = ['Fifth Fleet', 'J3, CENTCOM', 'AFCENT', 'SOCCENT', 'the Joint Staff', 'OSD Policy', 'Sixth Fleet', 'Task Force 50'];
const APPNS = ['OCO', 'Supplemental', 'Base budget', 'FMF', 'Drawdown'];

export function metaFor(product) {
  const h = hash(product.id + ':meta');
  const pick = h % 4;
  if (pick === 0) return `Ships from ${product.shipsFrom}`;
  if (pick === 1) return `Frequently ordered by ${UNITS[h % UNITS.length]}`;
  if (pick === 2) return `Only ${3 + (h % 40)} left in FY26 inventory`;
  return `Appropriation: ${APPNS[h % APPNS.length]}`;
}

// ---------- Checkout copy ----------
export const PAYMENT_METHODS = [
  { id: 'supplemental', label: 'Supplemental appropriation', desc: 'Emergency funding outside the base budget. No spending caps apply.' },
  { id: 'cr', label: 'Continuing resolution', desc: 'Funds at prior-year levels until Congress passes a full-year bill.' },
  { id: 'pda', label: 'Presidential drawdown authority', desc: 'Transfers existing stock directly. Replenishment billed later.' },
  { id: 'fmf', label: 'Foreign military financing (FMF)', desc: 'Grant financing for partner purchases of US-made equipment.' },
];

export const DELIVERY_WINDOWS = [
  { id: 'asap', label: 'ASAP', desc: 'Dynamic targeting. Est. 12 to 25 min.' },
  { id: 'scheduled', label: 'Scheduled', desc: 'Deliberate targeting. Choose a date.' },
  { id: 'overnight', label: 'Overnight', desc: 'B-2 express from Whiteman AFB. Iran only.', iranOnly: true },
];

export const TRACKER_STEPS = [
  'Order received',
  'Loading at {from}',
  'Aerial refueling',
  'Out for delivery',
  'Delivered',
];

// ---------- Casualty estimation ----------
// Estimated casualties per unit, in a densely populated area, before the destination
// density factor is applied. These are ranges drawn from published reporting on
// comparable documented strikes, not a predictive model, and the sources page sets out
// every anchor. Only munitions appear here: a sortie, a ship-day or a troop rotation
// does not itself kill anyone, and interceptors are defensive.
export const CASUALTY_PER_UNIT = {
  gbu31: { low: 20, high: 90 },
  mk84: { low: 20, high: 90 },
  gbu32: { low: 10, high: 45 },
  gbu38: { low: 5, high: 25 },
  mk82: { low: 5, high: 25 },
  gbu12: { low: 5, high: 25 },
  gbu39: { low: 2, high: 12 },
  tlam: { low: 5, high: 30 },
  jassm: { low: 5, high: 30 },
  hellfire: { low: 0, high: 6 },
  r9x: { low: 0, high: 2 },
  aargm: { low: 0, high: 5 },
  apkws: { low: 0, high: 4 },
  m795: { low: 1, high: 8 },
  mop: { low: 0, high: 5 },
};

// How much of that range a given destination realises. Dense civilian areas sit at 1;
// hardened, evacuated underground sites sit near zero. Reporting honest zeros for
// Fordow and Natanz is deliberate: the contrast is the point, and inflating them would
// make every other figure dismissible.
export const DENSITY_BY_LOCATION = {
  'gaza-city': 1.0, 'khan-younis': 1.0, 'rafah': 1.0,
  'beirut': 0.7,
  'jenin': 0.5,
  'sanaa': 0.4, 'hodeidah': 0.4, 'saada': 0.4,
  'baghdad': 0.3, 'tehran': 0.3,
  'erbil': 0.25, 'deir-ez-zor': 0.25,
  'isfahan': 0.15, 'bandar-abbas': 0.15,
  'natanz': 0.02, 'fordow': 0.02,
};
