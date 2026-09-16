export const FREE_HANDLING_THRESHOLD = 10_000_000;
export const HANDLING_FEE = 21_165; // one KC-135R flight hour, FY2025 Comptroller rate
export const DEFAULT_TIP_PCT = 20;
const BUNDLE_WAS_MARKUP = 1.14;

export const PROMO_CODES = {
  NDAA: { label: 'Congressional authorization', effect: '0% off', delayDays: 0 },
  CR: { label: 'Continuing resolution', effect: 'Delivery delayed 90 days', delayDays: 90 },
  AUMF2001: { label: 'Legacy authorization accepted', effect: '0% off', delayDays: 0 },
};

export function createCart() {
  return { items: {}, tipPct: DEFAULT_TIP_PCT, promo: null };
}

function normalizeQty(product, qty) {
  const step = product.step || 1;
  const min = product.minQty || step;
  if (!(qty > 0)) return 0;
  const rounded = Math.round(qty / step) * step;
  return Math.max(min, rounded);
}

export function setQty(cart, product, qty) {
  const items = { ...cart.items };
  const q = normalizeQty(product, qty);
  if (q === 0) delete items[product.id];
  else items[product.id] = q;
  return { ...cart, items };
}

export function addItem(cart, product, qty) {
  const current = cart.items[product.id] || 0;
  const inc = qty ?? (product.step || 1);
  return setQty(cart, product, current + inc);
}

export function removeItem(cart, productId) {
  const items = { ...cart.items };
  delete items[productId];
  return { ...cart, items };
}

export function applyBundle(cart, bundle, productsById) {
  return Object.entries(bundle.items).reduce(
    (c, [id, qty]) => addItem(c, productsById[id], qty),
    cart,
  );
}

export function setTip(cart, pct) {
  return { ...cart, tipPct: Math.max(0, Number(pct) || 0) };
}

export function setPromo(cart, code) {
  const normalized = code ? String(code).trim().toUpperCase() : '';
  return { ...cart, promo: normalized || null };
}

export function itemCount(cart) {
  return Object.keys(cart.items).length;
}

export function isEmpty(cart) {
  return itemCount(cart) === 0;
}

export function promoResult(code) {
  if (!code) return null;
  const p = PROMO_CODES[code];
  return p ? { ok: true, ...p } : { ok: false, message: 'Code not recognized. Try again after markup.' };
}

export function totals(cart, productsById) {
  // A cart persisted to localStorage can outlive the catalog: if a product id
  // it references is later removed, skip that line rather than throwing, so a
  // returning visitor's page still renders.
  const lineItems = Object.entries(cart.items)
    .filter(([id]) => productsById[id])
    .map(([id, qty]) => {
      const product = productsById[id];
      return { product, qty, lineTotal: product.price * qty };
    });
  const subtotal = lineItems.reduce((s, l) => s + l.lineTotal, 0);
  const handling = subtotal === 0 || subtotal >= FREE_HANDLING_THRESHOLD ? 0 : HANDLING_FEE;
  const tip = Math.round((subtotal * cart.tipPct) / 100);
  const tax = 0;
  const total = subtotal + handling + tip + tax;
  return { lineItems, subtotal, handling, tip, tax, total, promo: promoResult(cart.promo) };
}

export function bundlePrice(bundle, productsById) {
  return Object.entries(bundle.items).reduce((s, [id, qty]) => s + productsById[id].price * qty, 0);
}

export function bundleWasPrice(bundle, productsById) {
  return Math.round(bundlePrice(bundle, productsById) * BUNDLE_WAS_MARKUP);
}
