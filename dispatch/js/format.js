export function money(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function trim(x) {
  return String(Math.round(x * 10) / 10);
}

export function moneyCompact(n) {
  const abs = Math.abs(n);
  if (abs >= 1e9) return '$' + trim(n / 1e9) + 'B';
  if (abs >= 1e6) return '$' + trim(n / 1e6) + 'M';
  if (abs >= 1e3) return '$' + trim(n / 1e3) + 'K';
  return money(n);
}

const BASIS_LABELS = {
  each: 'each',
  hour: '/ flight hour',
  day: '/ day',
  rotation: '/ rotation',
};

export function basisLabel(basis) {
  return BASIS_LABELS[basis] ?? basis;
}

export function qtyLabel(product, qty) {
  switch (product.basis) {
    case 'hour': return `${qty} flight hr`;
    case 'day': return `${qty} days`;
    case 'rotation': return `${qty} rotation${qty === 1 ? '' : 's'}`;
    default: return `${qty}×`;
  }
}
