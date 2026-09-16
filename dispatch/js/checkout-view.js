import { get, set, subscribe, currentCart, setCart, currentLocation } from './state.js';
import { totals, isEmpty, createCart } from './cart.js';
import { PRODUCTS_BY_ID, PAYMENT_METHODS, DELIVERY_WINDOWS, TRACKER_STEPS, locationById, originFor } from './data.js';
import { money, moneyCompact, qtyLabel } from './format.js';
import { icon } from './icons.js';
import { play } from './audio.js';
import { burst } from './confetti.js';
import { showToast } from './toast.js';
import { renderRoute } from './route-map.js';
import { estimate, formatEstimate } from './casualty.js';

const $ = (id) => document.getElementById(id);

// Local, non-persisted checkout form state
const form = { window: 'asap', payment: 'supplemental', date: '', summaryOpen: false };
// Timers for the first four tracker steps only. The fifth, "Delivered", is not on a
// timer: it fires when the marker actually reaches the destination, so the map and the
// stepper can never contradict each other. FLIGHT_MS is how long that last leg takes.
const TRACK_DELAYS_MS = [0, 4000, 9000, 14000];
const FLIGHT_MS = 7000;
let trackerTimers = [];
let trackerOrderNumber = null;
let routeRaf = 0;

// Which glyph travels the arc. Anything that flies shows an aircraft; anything that is
// launched shows a missile; troops show troops.
function routeKind(product) {
  if (product.category === 'sorties') return 'air';
  if (product.category === 'ground' || product.category === 'naval') return 'ground';
  return 'missile';
}

// One route per distinct origin, most expensive first, capped so the map stays legible.
const MAX_ROUTES = 4;
function routesForOrder(order) {
  const loc = locationById(order.locationId);
  const lines = [...order.totals.lineItems].sort((a, b) => b.lineTotal - a.lineTotal);
  const seen = new Set();
  const routes = [];
  for (const line of lines) {
    const origin = originFor(line.product, loc);
    if (seen.has(origin.label)) continue;
    seen.add(origin.label);
    routes.push({
      from: { lat: origin.lat, lon: origin.lon, label: origin.label },
      to: { lat: loc.lat, lon: loc.lon, label: `${loc.name}, ${loc.country}` },
      kind: routeKind(line.product),
    });
    if (routes.length === MAX_ROUTES) break;
  }
  return { routes, lead: lines[0] && lines[0].product, extra: Math.max(0, seen.size - routes.length) };
}

// ---------- Checkout ----------
function renderCheckout(state) {
  if (state.view !== 'checkout') return;
  const loc = currentLocation();
  const cart = currentCart();
  if (!loc || isEmpty(cart)) { set({ view: loc ? 'store' : 'landing' }); return; }
  const t = totals(cart, PRODUCTS_BY_ID);

  $('coLocation').innerHTML = `<span class="banner-icon">${icon('pin')}</span>
    <div><strong>${loc.name}, ${loc.country}</strong><br><span class="muted">Fulfilled by ${loc.fulfilledBy} · est. ${loc.eta}</span></div>
    <button class="btn-link" type="button" data-change-loc>Change</button>`;

  if (form.window === 'overnight' && loc.region !== 'iran') form.window = 'asap';
  // set() fans out to every subscriber globally, so an unrelated state change (e.g. the
  // header mute toggle) triggers this render while the user is mid-edit in the scheduled
  // delivery date input. Rebuilding innerHTML here would destroy that input and drop focus
  // + the typed date. Guard against the date input specifically (not "focus anywhere in the
  // container") so clicking a window tile -- which focuses itself on mousedown, before its
  // click handler calls set() -- still triggers a normal rebuild, including the rebuild that
  // inserts the date input when "Scheduled" is chosen. querySelector returns null when the
  // date input isn't in the DOM (window !== 'scheduled'); the explicit null check on the left
  // of the && means that null can never equal document.activeElement and suppress a rebuild.
  // Skip the rebuild for this pass only when the date input itself is focused; it catches up
  // on the user's next interaction, which blurs the field.
  const coWindows = $('coWindows');
  const dateInput = coWindows.querySelector('[data-date]');
  if (!(dateInput && document.activeElement === dateInput)) {
    coWindows.innerHTML = DELIVERY_WINDOWS.map((w) => {
      const disabled = w.iranOnly && loc.region !== 'iran';
      const active = form.window === w.id;
      return `<button class="tile ${active ? 'active' : ''}" type="button" data-window="${w.id}" ${disabled ? 'disabled' : ''}>
        <strong>${w.label}</strong><span class="muted">${w.desc}</span></button>`;
    }).join('') + (form.window === 'scheduled'
      ? `<label class="tile"><strong>Delivery date</strong><input type="date" value="${form.date}" data-date aria-label="Delivery date"></label>`
      : '');
  }

  $('coPayments').innerHTML = PAYMENT_METHODS.map((p) =>
    `<button class="tile ${form.payment === p.id ? 'active' : ''}" type="button" data-payment="${p.id}"><strong>${p.label}</strong><span class="muted">${p.desc}</span></button>`).join('');

  $('coSummaryToggle').textContent = form.summaryOpen ? 'Hide order summary' : 'Show order summary';
  $('coSummary').hidden = !form.summaryOpen;
  $('coSummary').innerHTML = t.lineItems.map((l) =>
    `<div class="row"><span>${qtyLabel(l.product, l.qty)} ${l.product.name}</span><span>${money(l.lineTotal)}</span></div>`).join('')
    + `<div class="row"><span>Aerial refueling</span><span>${t.handling ? money(t.handling) : 'Free'}</span></div>
       <div class="row"><span>Tip (${cart.tipPct}%)</span><span>${money(t.tip)}</span></div>
       <div class="row"><span>Tax (Title 10 exempt)</span><span>$0.00</span></div>
       <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>`;
  $('coTotal').textContent = money(t.total);
}

function placeOrder() {
  const loc = currentLocation();
  const cart = currentCart();
  if (!loc || isEmpty(cart)) return;
  const t = totals(cart, PRODUCTS_BY_ID);
  const cas = estimate(cart, PRODUCTS_BY_ID, loc);
  const order = {
    number: 'CENTCOM-' + String(10000 + Math.floor(Math.random() * 90000)),
    locationId: loc.id,
    cart,
    totals: t,
    casualty: cas,
    window: form.window,
    payment: form.payment,
    placedAt: Date.now(),
  };
  const lifetime = get().lifetime;
  set({
    lastOrder: order,
    lifetime: {
      orders: lifetime.orders + 1,
      total: lifetime.total + t.total,
      casLow: lifetime.casLow + cas.low,
      casHigh: lifetime.casHigh + cas.high,
    },
    carts: { ...get().carts, [loc.id]: createCart() },
    view: 'confirmation',
  });
}

// ---------- Confirmation ----------
function clearTracker() {
  trackerTimers.forEach(clearTimeout);
  trackerTimers = [];
  cancelAnimationFrame(routeRaf);
}

function trackerHtml(steps, doneCount, stamps) {
  return steps.map((label, i) => {
    const cls = i < doneCount ? 'done' : i === doneCount ? 'current' : '';
    return `<li class="tracker-step ${cls}"><span class="dot">${i < doneCount ? icon('check') : ''}</span><span>${label}</span><span class="when">${stamps[i] || ''}</span></li>`;
  }).join('');
}

function stamp(ms) {
  return new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function runTracker(order) {
  const loc = locationById(order.locationId);
  const stamps = [];
  const tracker = $('tracker');
  const rateCard = $('rateCard');
  rateCard.hidden = true;
  $('reportCard').hidden = true;
  clearTracker();

  const { routes, lead } = routesForOrder(order);
  const routeSvg = $('routeMap');
  // The "Loading at ..." step names the origin the map actually draws for the lead item,
  // not the destination's fulfilling unit. Those two disagreed: the stepper read
  // "Loading at Al Asad Air Base" while the map drew every line leaving the United States.
  const loadingAt = (routes[0] && routes[0].from.label) || loc.fulfilledBy;
  const steps = TRACKER_STEPS.map((s) => s.replace('{from}', loadingAt));
  $('routeHead').innerHTML = lead
    ? `Your <strong>${lead.name}</strong> is on its way!`
    : 'Your order is on its way!';
  // Hold the marker at its origin while the order is still being prepared. Nothing is
  // in the air until "Out for delivery", and showing it moving before then would
  // contradict the stepper sitting right underneath it.
  renderRoute(routeSvg, routes, 0);

  // Fired by whichever comes first: the flight animation completing, or the backstop
  // timer below. requestAnimationFrame is throttled to a standstill in a background
  // tab, so hanging "Delivered" on it alone would strand an order the moment the user
  // switches away. Guarded so it can only run once.
  let arrived = false;
  const arrive = () => {
    if (arrived) return;
    arrived = true;
    renderRoute(routeSvg, routes, 1);
    stamps[4] = stamp(Date.now());
    tracker.innerHTML = trackerHtml(steps, 5, stamps);
    play('chime');
    burst($('confetti'), { count: 90, origin: { x: 0.5, y: 0.5 } });
    rateCard.hidden = false;
    const report = $('reportCard');
    $('reportOrder').textContent = order.number;
    $('reportAvatar').innerHTML = icon('soldiers');
    $('reportNote').textContent =
      `Your commander estimated ${formatEstimate(order.casualty)} at this address.`;
    report.hidden = false;
  };

  const startFlight = () => {
    const started = Date.now();
    const tick = () => {
      if (get().view !== 'confirmation') return;
      const p = Math.min(1, (Date.now() - started) / FLIGHT_MS);
      renderRoute(routeSvg, routes, p);
      if (p < 1) {
        routeRaf = requestAnimationFrame(tick);
      } else {
        // The marker has landed. Only now does the order count as delivered.
        arrive();
      }
    };
    cancelAnimationFrame(routeRaf);
    routeRaf = requestAnimationFrame(tick);
    // Backstop: if frames never arrive, land the marker and deliver on a timer.
    trackerTimers.push(setTimeout(arrive, FLIGHT_MS + 250));
  };

  TRACK_DELAYS_MS.forEach((delay, i) => {
    trackerTimers.push(setTimeout(() => {
      stamps[i] = stamp(Date.now());
      tracker.innerHTML = trackerHtml(steps, i + 1, stamps);
      play('tick');
      // "Out for delivery" is the last timed step; it launches the flight, and the
      // flight's completion is what fires "Delivered".
      if (i === TRACK_DELAYS_MS.length - 1) startFlight();
    }, delay));
  });
  tracker.innerHTML = trackerHtml(steps, 0, stamps);
}

function renderRateStars(selected = 0) {
  $('rateStars').innerHTML = [1, 2, 3, 4, 5].map((n) =>
    `<button class="star ${n <= selected ? 'on' : ''}" type="button" data-rate="${n}" aria-label="${n} stars">${icon('star')}</button>`).join('');
}

function renderConfirmation(state) {
  if (state.view !== 'confirmation') { clearTracker(); trackerOrderNumber = null; return; }
  const order = state.lastOrder;
  if (!order) { set({ view: 'store' }); return; }
  $('confNumber').textContent = order.number;
  $('confTotal').textContent = money(order.totals.total);
  $('confTotal').title = moneyCompact(order.totals.total);
  const lt = state.lifetime;
  const casPart = lt.casHigh > 0
    ? `, and an estimated ${formatEstimate({ low: lt.casLow, high: lt.casHigh })}`
    : '';
  $('lifetime').textContent =
    `You've authorized ${money(lt.total)} across ${lt.orders} order${lt.orders === 1 ? '' : 's'}${casPart}.`;
  if (trackerOrderNumber !== order.number) {
    trackerOrderNumber = order.number;
    document.querySelector('.confirm-check').innerHTML = icon('check');
    renderRateStars(0);
    play('chime');
    play('whoosh');
    burst($('confetti'), { count: 220, origin: { x: 0.5, y: 0.3 } });
    runTracker(order);
  }
}

function shareText(order) {
  const loc = locationById(order.locationId);
  const lines = order.totals.lineItems.map((l) => `• ${qtyLabel(l.product, l.qty)} ${l.product.name} — ${money(l.lineTotal)}`);
  return [`My Dispatch order ${order.number} to ${loc.name}, ${loc.country}`, ...lines, `Total: ${money(order.totals.total)}`, 'dispatch — Ordnance, delivered.'].join('\n');
}

export function initCheckout() {
  $('coBack').addEventListener('click', () => set({ view: 'store', drawerOpen: true }));
  $('coLocation').addEventListener('click', (evt) => {
    if (evt.target.closest('[data-change-loc]')) set({ view: 'landing' });
  });
  $('coWindows').addEventListener('click', (evt) => {
    const tile = evt.target.closest('[data-window]');
    if (tile && !tile.disabled) { form.window = tile.dataset.window; play('click'); renderCheckout(get()); }
  });
  $('coWindows').addEventListener('change', (evt) => {
    const date = evt.target.closest('[data-date]');
    if (date) form.date = date.value;
  });
  $('coPayments').addEventListener('click', (evt) => {
    const tile = evt.target.closest('[data-payment]');
    if (tile) { form.payment = tile.dataset.payment; play('click'); renderCheckout(get()); }
  });
  $('coSummaryToggle').addEventListener('click', () => { form.summaryOpen = !form.summaryOpen; renderCheckout(get()); });
  $('authorizeBtn').addEventListener('click', () => { play('pop'); placeOrder(); });

  $('rateStars').addEventListener('click', (evt) => {
    const star = evt.target.closest('[data-rate]');
    if (!star) return;
    renderRateStars(Number(star.dataset.rate));
    play('ding');
    showToast('Thanks for your feedback!');
  });
  $('reorderBtn').addEventListener('click', () => {
    const order = get().lastOrder;
    if (!order) return;
    set({ locationId: order.locationId });
    setCart(order.cart);
    play('pop');
    set({ view: 'store', drawerOpen: true });
  });
  $('shopBtn').addEventListener('click', () => set({ view: 'store' }));
  $('shareBtn').addEventListener('click', async () => {
    const order = get().lastOrder;
    if (!order) return;
    try {
      await navigator.clipboard.writeText(shareText(order));
      play('ding');
      showToast('Order summary copied to clipboard');
    } catch {
      showToast('Could not copy. Select the text manually.');
    }
  });

  subscribe((state) => { renderCheckout(state); renderConfirmation(state); });
  renderCheckout(get());
  renderConfirmation(get());
}
