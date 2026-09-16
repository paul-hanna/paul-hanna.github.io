import { load, save } from './storage.js';
import { createCart } from './cart.js';
import { locationById } from './data.js';

const KEYS = {
  location: 'dispatch.location',
  carts: 'dispatch.carts',
  muted: 'dispatch.muted',
  lifetime: 'dispatch.lifetime',
};

const listeners = new Set();

const storedLifetime = load(KEYS.lifetime, { orders: 0, total: 0 });

const state = {
  view: 'landing',
  locationId: load(KEYS.location, null),
  carts: load(KEYS.carts, {}),
  muted: load(KEYS.muted, false),
  lifetime: storedLifetime,
  category: 'bundles',
  drawerOpen: false,
  sheetProductId: null,
  lastOrder: null,
};

// A lifetime figure saved before casualty tracking existed has no cas fields; default
// them rather than letting undefined propagate into the confirmation copy.
state.lifetime = {
  orders: storedLifetime.orders || 0,
  total: storedLifetime.total || 0,
  casLow: storedLifetime.casLow || 0,
  casHigh: storedLifetime.casHigh || 0,
};

// A stale location id (data changed) should not strand the app on the store view.
if (state.locationId && !locationById(state.locationId)) state.locationId = null;
if (state.locationId) state.view = 'store';

function persist() {
  save(KEYS.location, state.locationId);
  save(KEYS.carts, state.carts);
  save(KEYS.muted, state.muted);
  save(KEYS.lifetime, state.lifetime);
}

export function get() {
  return state;
}

export function set(patch) {
  Object.assign(state, patch);
  persist();
  // Re-entrant `set()` calls from a listener are expected and tolerated (e.g. a
  // listener redirecting the view): listeners after it in this notification then
  // run again for the inner call, and again for the outer call once the inner
  // one returns. That means every listener must stay idempotent — a listener
  // that fires a sound, toast, or confetti needs its own guard, because it may
  // be invoked more than once per logical state change. Iterate a snapshot so
  // an unsubscribe during notification doesn't mutate the Set mid-iteration.
  for (const fn of [...listeners]) fn(state);
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function currentLocation() {
  return locationById(state.locationId);
}

export function currentCart() {
  return (state.locationId && state.carts[state.locationId]) || createCart();
}

export function setCart(cart) {
  if (!state.locationId) return;
  set({ carts: { ...state.carts, [state.locationId]: cart } });
}
