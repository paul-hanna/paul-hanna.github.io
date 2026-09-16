import { get, set, subscribe, currentCart, setCart, currentLocation } from './state.js';
import { totals, setQty, removeItem, setTip, setPromo, isEmpty, FREE_HANDLING_THRESHOLD } from './cart.js';
import { PRODUCTS_BY_ID } from './data.js';
import { money, qtyLabel } from './format.js';
import { icon } from './icons.js';
import { play } from './audio.js';

const $ = (id) => document.getElementById(id);
const TIP_PRESETS = [0, 15, 20, 25];

function lineHtml({ product, qty, lineTotal }) {
  return `<div class="line" data-line="${product.id}">
    <div class="line-icon">${icon(product.icon)}</div>
    <div class="line-body">
      <span class="line-name">${product.name}</span>
      <span class="line-sub">${money(product.price)} × ${qtyLabel(product, qty)}</span>
      <button class="line-remove" type="button" data-remove="${product.id}">Remove</button>
    </div>
    <div class="stepper" data-stepper="${product.id}">
      <button class="stepper-btn" type="button" data-delta="-1" aria-label="Less">−</button>
      <span class="stepper-qty">${qty}</span>
      <button class="stepper-btn" type="button" data-delta="1" aria-label="More">+</button>
    </div>
    <div class="line-price">${money(lineTotal)}</div>
  </div>`;
}

function renderDrawer(state) {
  const open = state.drawerOpen && Boolean(state.locationId);
  $('drawer').hidden = !open;
  $('drawerBackdrop').hidden = !open;
  if (!open) return;
  const cart = currentCart();
  const loc = currentLocation();
  const t = totals(cart, PRODUCTS_BY_ID);
  const empty = isEmpty(cart);

  $('drawerEmpty').hidden = !empty;
  $('drawerItems').innerHTML = t.lineItems.map(lineHtml).join('');

  // set() fans out to every subscriber globally, so an unrelated state change (e.g. the
  // header mute toggle) triggers this render while the user is mid-keystroke in the custom
  // tip input. Rebuilding innerHTML here would destroy that input and drop focus + typed text.
  // Guard against the custom-tip input specifically (not "focus anywhere in the container")
  // so clicks on the preset chip buttons -- which focus themselves on mousedown, before their
  // click handler calls set() -- still trigger a normal rebuild and get their active class.
  // Skip the rebuild for this pass only when the custom-tip input itself is focused; it
  // catches up on the user's next interaction, which blurs the field.
  const tipChips = $('tipChips');
  const customTipInput = tipChips.querySelector('[data-tip-custom]');
  if (!(customTipInput && document.activeElement === customTipInput)) {
    tipChips.innerHTML = TIP_PRESETS.map((p) =>
      `<button class="tip-chip ${cart.tipPct === p ? 'active' : ''}" type="button" data-tip="${p}">${p}%</button>`).join('')
      + `<input class="tip-chip" type="number" min="0" max="100" data-tip-custom value="${TIP_PRESETS.includes(cart.tipPct) ? '' : cart.tipPct}" placeholder="Custom" aria-label="Custom tip percent" style="width:84px">`;
  }

  $('sumSubtotal').textContent = money(t.subtotal);
  $('sumHandling').textContent = t.handling === 0 ? (t.subtotal > 0 ? 'Free' : money(0)) : money(t.handling);
  $('sumTip').textContent = money(t.tip);
  $('sumTax').textContent = '$0.00';
  $('sumTotal').textContent = money(t.total);

  const promoMsg = $('promoMsg');
  if (t.promo) {
    promoMsg.hidden = false;
    promoMsg.classList.toggle('bad', !t.promo.ok);
    promoMsg.textContent = t.promo.ok ? `${t.promo.label}: ${t.promo.effect}` : t.promo.message;
  } else {
    promoMsg.hidden = true;
  }
  if (document.activeElement !== $('promoInput')) $('promoInput').value = cart.promo || '';

  const delay = t.promo && t.promo.ok && t.promo.delayDays ? ` + ${t.promo.delayDays} days` : '';
  const freeNote = t.subtotal > 0 && t.subtotal < FREE_HANDLING_THRESHOLD
    ? ` · Add ${money(FREE_HANDLING_THRESHOLD - t.subtotal)} more for free aerial refueling` : '';
  $('drawerDelivery').textContent = `Delivery to ${loc.name}, ${loc.country} · est. ${loc.eta}${delay}${freeNote}`;

  $('checkoutBtn').disabled = empty;
}

function handleClick(evt) {
  const remove = evt.target.closest('[data-remove]');
  if (remove) { setCart(removeItem(currentCart(), remove.dataset.remove)); play('thunk'); return; }
  const step = evt.target.closest('[data-delta]');
  if (step) {
    const id = step.closest('[data-stepper]').dataset.stepper;
    const product = PRODUCTS_BY_ID[id];
    const cart = currentCart();
    const next = (cart.items[id] || 0) + Number(step.dataset.delta) * product.step;
    setCart(setQty(cart, product, next));
    play(next <= 0 ? 'thunk' : 'tick');
    return;
  }
  const tip = evt.target.closest('[data-tip]');
  if (tip) { setCart(setTip(currentCart(), Number(tip.dataset.tip))); play('click'); }
}

export function initCartDrawer() {
  const close = () => set({ drawerOpen: false });
  $('drawerClose').innerHTML = icon('close');
  $('drawerClose').addEventListener('click', close);
  $('drawerBackdrop').addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && get().drawerOpen) close(); });
  $('drawer').addEventListener('click', handleClick);
  $('drawer').addEventListener('change', (evt) => {
    const custom = evt.target.closest('[data-tip-custom]');
    if (custom) { setCart(setTip(currentCart(), Number(custom.value))); play('click'); }
  });
  $('promoForm').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const cart = setPromo(currentCart(), $('promoInput').value);
    setCart(cart);
    const result = totals(cart, PRODUCTS_BY_ID).promo;
    play(result && result.ok ? 'ding' : 'thunk');
  });
  $('checkoutBtn').addEventListener('click', () => {
    if (isEmpty(currentCart())) return;
    play('click');
    set({ drawerOpen: false, sheetProductId: null, view: 'checkout' });
  });
  subscribe(renderDrawer);
  renderDrawer(get());
}
