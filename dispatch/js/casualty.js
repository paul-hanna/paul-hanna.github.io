import { CASUALTY_PER_UNIT, DENSITY_BY_LOCATION } from './data.js';

// An estimate, never a prediction. Each munition carries a published range for a dense
// populated area; the destination's density factor scales it. Non-munitions contribute
// nothing, because a sortie or a deployment does not itself kill anyone and interceptors
// are defensive. Unknown ids are skipped for the same reason cart totals skip them: a
// saved cart can outlive a catalog change, and a stale line must not take down the page.
export function estimate(cart, productsById, location) {
  const density = (location && DENSITY_BY_LOCATION[location.id]) ?? 1;
  let low = 0;
  let high = 0;
  let contributing = 0;
  for (const [id, qty] of Object.entries(cart.items || {})) {
    if (!productsById[id]) continue;
    const range = CASUALTY_PER_UNIT[id];
    if (!range) continue;
    low += range.low * qty * density;
    high += range.high * qty * density;
    contributing += 1;
  }
  return { low: Math.round(low), high: Math.round(high), contributing };
}

export function formatEstimate({ low, high }) {
  const noun = (n) => (n === 1 ? 'casualty' : 'casualties');
  if (low === high) return `${low} ${noun(low)}`;
  return `${low} to ${high} ${noun(high)}`;
}
