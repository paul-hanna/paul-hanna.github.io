import { WORLD } from './mapdata.js';
import { fitBox, arcControl, quadPoint, quadTangent } from './route-math.js';
import { icon } from './icons.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const W = 1000;
const H = 460;

function el(tag, attrs = {}, text) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

const MARKER_ICON = { air: 'jet', missile: 'missile', ground: 'soldiers' };

// Re-project the world land path from its own bbox into this route's frame. The path
// is a flat "M x y L x y ... Z" string, so a regex walk is enough and avoids parsing
// a full path grammar for what is only ever absolute moves and lines.
function reprojectLand(project) {
  const [w, s, e, n] = WORLD.bbox;
  const toLat = (y) => n - (y / WORLD.height) * (n - s);
  const toLon = (x) => w + (x / WORLD.width) * (e - w);
  return WORLD.land.replace(/([ML])(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, cmd, xs, ys) => {
    const p = project(toLat(Number(ys)), toLon(Number(xs)));
    return `${cmd}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  });
}

export function renderRoute(svg, routes, progress = 0) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  if (!routes || !routes.length) return;

  const points = routes.flatMap((r) => [r.from, r.to]);
  const { project } = fitBox(points, { width: W, height: H, padFrac: 0.16 });

  svg.append(el('path', { class: 'route-land', d: reprojectLand(project) }));

  const t = Math.max(0, Math.min(1, progress));
  for (const route of routes) {
    const a = project(route.from.lat, route.from.lon);
    const b = project(route.to.lat, route.to.lon);
    const c = arcControl(a, b, 0.22);

    svg.append(el('path', {
      class: 'route-line',
      d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`,
    }));

    const origin = el('g', { class: 'route-pin route-origin', transform: `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)})` });
    origin.append(el('circle', { r: 5 }));
    origin.append(el('text', { x: 0, y: -12, 'text-anchor': 'middle' }, route.from.label));
    svg.append(origin);

    const dest = el('g', { class: 'route-pin route-dest', transform: `translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})` });
    dest.append(el('circle', { class: 'route-dest-ring', r: 11 }));
    dest.append(el('circle', { r: 5 }));
    dest.append(el('text', { x: 0, y: -18, 'text-anchor': 'middle' }, route.to.label));
    svg.append(dest);

    const p = quadPoint(a, c, b, t);
    const heading = quadTangent(a, c, b, t);
    const marker = el('g', {
      class: 'route-marker',
      transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${heading.toFixed(1)})`,
    });
    const glyph = el('g', { class: 'route-marker-glyph', transform: 'translate(-11 -11)' });
    glyph.innerHTML = icon(MARKER_ICON[route.kind] || 'jet');
    const svgChild = glyph.firstElementChild;
    if (svgChild) { svgChild.setAttribute('width', '22'); svgChild.setAttribute('height', '22'); }
    marker.append(el('circle', { class: 'route-marker-halo', r: 16 }));
    marker.append(glyph);
    svg.append(marker);
  }
}
