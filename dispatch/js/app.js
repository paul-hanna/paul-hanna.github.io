import { get, set, subscribe, currentCart, currentLocation } from './state.js';
import { LOCATIONS, COMING_SOON } from './data.js';
import { renderMap, matchAddress } from './map.js';
import { itemCount } from './cart.js';
import { play, setMuted, isMuted, unlock } from './audio.js';
import { icon } from './icons.js';
import { showToast } from './toast.js';
import { initStore } from './store-view.js';
import { initCartDrawer } from './cart-view.js';
import { initCheckout } from './checkout-view.js';

const $ = (id) => document.getElementById(id);

// ---------- Views ----------
const VIEW_IDS = { landing: 'view-landing', store: 'view-store', checkout: 'view-checkout', confirmation: 'view-confirm' };

let lastView = null;
function renderView(state) {
  for (const [name, id] of Object.entries(VIEW_IDS)) $(id).hidden = state.view !== name;
  if (state.view === 'landing') renderLanding(state);
  if (state.view !== lastView) {
    lastView = state.view;
    window.scrollTo({ top: 0 });
  }
}

// ---------- Header ----------
function renderHeader(state) {
  const loc = currentLocation();
  $('locPillText').textContent = loc ? `${loc.name}, ${loc.country}` : 'Choose a location';
  const count = itemCount(currentCart());
  const badge = $('cartCount');
  if (badge.textContent !== String(count)) {
    badge.textContent = String(count);
    badge.classList.remove('bump');
    void badge.offsetWidth; // restart animation
    badge.classList.add('bump');
  }
  $('muteBtn').innerHTML = icon(state.muted ? 'muted' : 'sound');
}

// ---------- Landing ----------
export function selectLocation(loc) {
  play('pop');
  set({ locationId: loc.id, view: 'store', category: 'bundles', drawerOpen: false });
}

function servedCard(loc) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'served-card';
  btn.innerHTML = `
    ${loc.badge ? `<span class="badge-tag ${loc.badge === 'New' ? 'green' : ''}">${loc.badge}</span>` : ''}
    <strong>${loc.name}</strong>
    <span class="muted">${loc.country} · ${loc.eta}</span>
    <span class="muted">Fulfilled by ${loc.fulfilledBy}</span>`;
  btn.addEventListener('click', () => selectLocation(loc));
  return btn;
}

function soonCard(item) {
  const div = document.createElement('div');
  div.className = 'soon-card';
  div.innerHTML = `<span class="badge-tag">${item.note || 'Coming soon'}</span><strong>${item.name}</strong><span>${item.country}</span>`;
  return div;
}

function showMapCard(loc, evt) {
  const card = $('mapCard');
  if (!loc) { card.hidden = true; return; }
  card.innerHTML = `<strong>${loc.name}, ${loc.country}</strong><span class="muted">Fulfilled by ${loc.fulfilledBy}</span><br><span>Est. delivery <strong>${loc.eta}</strong></span>`;
  card.hidden = false;
}

let landingBuilt = false;
function renderLanding(state) {
  renderMap($('mapSvg'), LOCATIONS, { selectedId: state.locationId, onSelect: selectLocation, onHover: showMapCard });
  if (landingBuilt) return;
  landingBuilt = true;
  const served = $('servedList');
  served.innerHTML = '';
  LOCATIONS.forEach((loc) => served.append(servedCard(loc)));
  const soon = $('comingSoon');
  soon.innerHTML = '';
  COMING_SOON.forEach((item) => soon.append(soonCard(item)));
}

function handleAddress(evt) {
  evt.preventDefault();
  const input = $('addressInput');
  const query = input.value;
  const result = $('addressResult');
  if (!query.trim()) return;
  const match = matchAddress(query, LOCATIONS);
  if (match) {
    result.hidden = true;
    selectLocation(match);
    return;
  }
  play('thunk');
  result.innerHTML = `<span>Sorry, we don't deliver to <strong>${escapeHtml(query.trim())}</strong> yet. We're expanding our operating range soon.</span><button class="btn-ghost" type="button" id="notifyBtn">Notify me</button>`;
  result.hidden = false;
  $('notifyBtn').addEventListener('click', () => { play('ding'); showToast("You're on the list!"); });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- Wiring ----------
function init() {
  setMuted(get().muted);
  document.addEventListener('pointerdown', unlock, { once: true });

  $('locPill').addEventListener('click', () => set({ view: 'landing', drawerOpen: false }));
  $('muteBtn').addEventListener('click', () => {
    const muted = !isMuted();
    setMuted(muted);
    set({ muted });
    if (!muted) play('tick');
  });
  $('cartBtn').addEventListener('click', () => {
    if (!get().locationId) { showToast('Choose a delivery location first'); return; }
    set({ drawerOpen: true });
  });
  $('cartBtn').querySelector('.cart-btn-icon').innerHTML = icon('cart');
  $('addressForm').addEventListener('submit', handleAddress);
  $('voteBtn').addEventListener('click', () => { play('ding'); showToast('Thanks! Your vote has been counted.'); });

  initStore();
  initCartDrawer();
  initCheckout();

  subscribe((state) => { renderHeader(state); renderView(state); });
  renderHeader(get());
  renderView(get());
}

init();
