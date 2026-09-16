import { MAP } from './mapdata.js';

export function project(lat, lon) {
  const [w, s, e, n] = MAP.bbox;
  return {
    x: ((lon - w) / (e - w)) * MAP.width,
    y: ((n - lat) / (n - s)) * MAP.height,
  };
}

export function matchAddress(query, locations) {
  const q = String(query || '').trim().toLowerCase();
  if (!q || q.length < 3) return null;
  const byName = locations.find((l) => {
    const name = l.name.toLowerCase();
    return name.includes(q) || q.includes(name.split(' (')[0]);
  });
  if (byName) return byName;
  const byCountry = locations.find((l) => q.includes(l.country.toLowerCase()));
  return byCountry || null;
}

// ---------- Label layout ----------
// Pins that sit close together on the map (e.g. the Gaza cluster, or a
// near-vertical column like Tehran/Fordow/Natanz/Isfahan) produce overlapping
// text labels at the fixed x=10 y=4 offset. layoutLabels() is a pure,
// deterministic greedy layout: walk the items in the given order and place
// each label at the first candidate (a side of the pin plus a vertical
// offset) whose approximate bounding box doesn't collide with an
// already-placed label. If every candidate collides, fall back to the last
// one tried rather than failing.
//
// A vertical-only stagger cascades on a near-vertical stack of 3+ pins: each
// pin pushed down to clear the one above lands on the one below it, and no
// amount of extra vertical offset resolves that on its own. Flipping the
// label to the left side of the pin (text-anchor: end) opens up a second,
// horizontally-disjoint lane, which is what breaks the cascade.
const LABEL_DX = 10;
const LABEL_CHAR_WIDTH = 8.25; // px per character at font-size: 15px
// The label's own text is ~16px tall (font-size: 15px), but its painted footprint
// is bigger than the em-square: ascent/descent overshoot the box a little, and
// .pin-label's 4px paint-order stroke halo adds a couple more px on every side.
// Pad the approximate box to 24px so near-miss pairs (e.g. Tehran/Fordow, ~20px
// apart) are still treated as colliding rather than left to overlap on screen.
const LABEL_HEIGHT = 24; // px
// Right-side-first, then left-side, at the same height, before trying larger
// vertical offsets: a same-x collision is fully resolved by flipping sides
// (the two lanes never overlap horizontally), so that's tried before pushing
// either label further up or down.
const LABEL_CANDIDATES = [
  { side: 'right', dy: 4 },
  { side: 'left', dy: 4 },
  { side: 'right', dy: -14 },
  { side: 'left', dy: -14 },
  { side: 'right', dy: 22 },
  { side: 'left', dy: 22 },
  { side: 'right', dy: -30 },
  { side: 'left', dy: -30 },
];

function labelBox(x, y, side, dy, name) {
  const width = name.length * LABEL_CHAR_WIDTH;
  const top = y + dy - LABEL_HEIGHT;
  const bottom = top + LABEL_HEIGHT;
  if (side === 'left') {
    const right = x - LABEL_DX;
    return { left: right - width, top, right, bottom };
  }
  const left = x + LABEL_DX;
  return { left, top, right: left + width, bottom };
}

function boxesOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

export function layoutLabels(items) {
  const placedBoxes = [];
  const offsets = [];
  for (const item of items) {
    let chosen = null;
    for (const candidate of LABEL_CANDIDATES) {
      const box = labelBox(item.x, item.y, candidate.side, candidate.dy, item.name);
      const collides = placedBoxes.some((p) => boxesOverlap(box, p));
      chosen = { ...candidate, box };
      if (!collides) break;
    }
    placedBoxes.push(chosen.box);
    offsets.push({
      dx: chosen.side === 'left' ? -LABEL_DX : LABEL_DX,
      dy: chosen.dy,
      anchor: chosen.side === 'left' ? 'end' : 'start',
    });
  }
  return offsets;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs = {}, text) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

// Several served locations sit almost on top of each other at this scale — Gaza City,
// Khan Younis and Rafah are within a few viewBox units, as are Tehran and Fordow. Drawing
// them at their true positions stacks the dots, so they cannot be clicked individually.
// spiderfy() finds groups of points closer together than minDist and fans each group out
// around its centroid at a fixed radius. renderMap draws a leader line from each displaced
// dot back to its true position, so the map stays honest about where the place actually is.
// Pure and deterministic: grouping and fan order both follow input order, never geometry
// that could vary between renders.
export function spiderfy(points, { minDist = 16, radius = 15 } = {}) {
  const n = points.length;
  const group = new Array(n).fill(-1);
  let groups = 0;
  for (let i = 0; i < n; i++) {
    if (group[i] !== -1) continue;
    group[i] = groups;
    const queue = [i];
    while (queue.length) {
      const cur = queue.pop();
      for (let j = 0; j < n; j++) {
        if (group[j] !== -1) continue;
        if (Math.hypot(points[cur].x - points[j].x, points[cur].y - points[j].y) < minDist) {
          group[j] = groups;
          queue.push(j);
        }
      }
    }
    groups++;
  }

  const out = points.map((p) => ({ x: p.x, y: p.y, displaced: false }));
  for (let k = 0; k < groups; k++) {
    const members = [];
    for (let i = 0; i < n; i++) if (group[i] === k) members.push(i);
    if (members.length < 2) continue;
    const cx = members.reduce((s, i) => s + points[i].x, 0) / members.length;
    const cy = members.reduce((s, i) => s + points[i].y, 0) / members.length;
    members.forEach((i, m) => {
      const angle = -Math.PI / 2 + (m / members.length) * Math.PI * 2;
      out[i] = {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        displaced: true,
      };
    });
  }
  return out;
}

export function renderMap(svg, locations, { selectedId = null, onSelect, onHover } = {}) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${MAP.width} ${MAP.height}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

  // grid
  const grid = el('g', { class: 'map-grid' });
  for (let x = 0; x <= MAP.width; x += 100) grid.append(el('line', { x1: x, y1: 0, x2: x, y2: MAP.height }));
  for (let y = 0; y <= MAP.height; y += 100) grid.append(el('line', { x1: 0, y1: y, x2: MAP.width, y2: y }));
  svg.append(grid);

  if (MAP.land) svg.append(el('path', { class: 'map-land', d: MAP.land }));
  if (MAP.borders) svg.append(el('path', { class: 'map-borders', d: MAP.borders }));

  const projected = locations.map((loc) => ({ loc, ...project(loc.lat, loc.lon) }));
  const placed = spiderfy(projected);
  // Leader lines go in their own group appended before the pins, so every line is
  // painted under every dot. It must NOT live inside .map-pins: the stylesheet
  // staggers pulse timing with .pin:nth-child(odd), which an extra leading child
  // would silently shift.
  const leaders = el('g', { class: 'pin-leaders' });
  projected.forEach(({ x, y }, i) => {
    if (!placed[i].displaced) return;
    leaders.append(el('line', {
      class: 'pin-leader',
      x1: x.toFixed(1), y1: y.toFixed(1),
      x2: placed[i].x.toFixed(1), y2: placed[i].y.toFixed(1),
    }));
  });
  svg.append(leaders);

  const pins = el('g', { class: 'map-pins' });
  const labelOffsets = layoutLabels(placed.map(({ x, y }, i) => ({ x, y, name: projected[i].loc.name })));
  placed.forEach(({ x, y, displaced }, i) => {
    const loc = projected[i].loc;
    const { dx, dy, anchor } = labelOffsets[i];
    const g = el('g', { class: 'pin' + (loc.id === selectedId ? ' selected' : ''), transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`, 'data-id': loc.id, tabindex: '0', role: 'button', 'aria-label': `${loc.name}, ${loc.country}` });
    // An invisible, generously sized hit target. The visible dot is only 6 units across and
    // the pulse ring animates its own size, so neither is a reliable thing to click.
    g.append(el('circle', { class: 'pin-hit', r: 12 }));
    g.append(el('circle', { class: 'pin-pulse', r: 14 }));
    g.append(el('circle', { class: 'pin-dot' + (displaced ? ' displaced' : ''), r: 6 }));
    g.append(el('text', { class: 'pin-label', x: dx, y: dy, 'text-anchor': anchor }, loc.name));
    g.addEventListener('click', () => onSelect && onSelect(loc));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect && onSelect(loc); } });
    g.addEventListener('mouseenter', (e) => onHover && onHover(loc, e));
    g.addEventListener('mouseleave', (e) => onHover && onHover(null, e));
    pins.append(g);
  });
  svg.append(pins);
}
