import { PRODUCTS, CATEGORIES, PRODUCTS_BY_ID, LOCATIONS, CASUALTY_PER_UNIT, DENSITY_BY_LOCATION } from './data.js';
import { money, basisLabel } from './format.js';
import { HANDLING_FEE, FREE_HANDLING_THRESHOLD } from './cart.js';

const catLabel = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

const rows = PRODUCTS.map((p) => `<tr>
  <td>${p.name}</td>
  <td>${catLabel[p.category]}</td>
  <td class="num">${money(p.price)}</td>
  <td>${basisLabel(p.basis)}</td>
  <td>${p.fy}</td>
  <td><a href="${p.sourceUrl}" target="_blank" rel="noopener">${hostOf(p.sourceUrl)}</a><br><span class="note">${p.source}</span></td>
  <td class="note">${p.note || ''}</td>
</tr>`).join('');

document.querySelector('#sourcesTable tbody').innerHTML = rows;
document.getElementById('handlingNote').textContent =
  `Orders under ${money(FREE_HANDLING_THRESHOLD)} carry a ${money(HANDLING_FEE)} aerial refueling fee, equal to one KC-135R flight hour at the FY2025 Comptroller rate.`;

// Credits are generated alongside the images by scripts/fetch-images.py. Fetch rather
// than import: it is data, not code, and keeping it as JSON means the script owns the
// file outright.
try {
  const res = await fetch('assets/credits.json');
  const credits = await res.json();
  const label = (c) => (c.kind === 'bundle' ? 'Bundle: ' : '') + c.id;
  document.querySelector('#creditsTable tbody').innerHTML = credits.map((c) => `<tr>
    <td>${label(c)}</td>
    <td>${c.title}</td>
    <td class="note">${c.author || 'Unknown'}</td>
    <td>${c.licence}</td>
    <td>${c.sourceUrl ? `<a href="${c.sourceUrl}" target="_blank" rel="noopener">Commons</a>` : '—'}</td>
  </tr>`).join('');
} catch {
  document.querySelector('#creditsTable tbody').innerHTML =
    '<tr><td colspan="5" class="note">Image credits unavailable.</td></tr>';
}

document.querySelector('#casualtyTable tbody').innerHTML = Object.entries(CASUALTY_PER_UNIT)
  .map(([id, r]) => `<tr>
    <td>${PRODUCTS_BY_ID[id] ? PRODUCTS_BY_ID[id].name : id}</td>
    <td class="num">${r.low === r.high ? r.low : `${r.low} to ${r.high}`}</td>
  </tr>`).join('');

document.querySelector('#densityTable tbody').innerHTML = LOCATIONS
  .map((l) => `<tr>
    <td>${l.name}, ${l.country}</td>
    <td class="num">${DENSITY_BY_LOCATION[l.id].toFixed(2)}</td>
  </tr>`).join('');
