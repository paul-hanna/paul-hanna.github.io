const wrap = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const ICONS = {
  missile: wrap('<path d="M12 2c2.2 3 3 6 3 10v6H9v-6c0-4 .8-7 3-10z"/><path d="M9 14l-3 4h3M15 14l3 4h-3M12 18v4"/>'),
  rocket: wrap('<path d="M12 3c1.5 2 2 5 2 8v5h-4v-5c0-3 .5-6 2-8z"/><path d="M10 16l-2 3h2M14 16l2 3h-2M12 16v5"/>'),
  bomb: wrap('<path d="M12 3v3M9 4.5h6"/><path d="M12 6c-3.5 0-6 3.2-6 7.5a6 6 0 0 0 12 0C18 9.2 15.5 6 12 6z"/>'),
  'bomb-small': wrap('<path d="M12 5v3M10 6.5h4"/><path d="M12 8c-2.5 0-4.5 2.5-4.5 6a4.5 4.5 0 0 0 9 0c0-3.5-2-6-4.5-6z"/>'),
  shell: wrap('<path d="M10 3h4v3h-4zM9 6h6v10H9zM8 16h8v4H8z"/>'),
  drone: wrap('<path d="M12 6v10M3 9h18M9 16h6M12 16v3M7 9l-1 4M17 9l1 4"/>'),
  jet: wrap('<path d="M12 3l2 8 7 4v2l-7-2-1 4 2 2v1l-3-1-3 1v-1l2-2-1-4-7 2v-2l7-4z"/>'),
  bomber: wrap('<path d="M12 5l10 10-4 1-6-4-6 4-4-1z"/><path d="M12 12v4"/>'),
  tanker: wrap('<path d="M4 12h13a3 3 0 0 1 0 6H4z"/><path d="M6 12V9h6v3M17 15h4l-2 3"/>'),
  radar: wrap('<path d="M3 17h18M12 17v-5"/><path d="M6 12a6 6 0 0 1 12 0M9 12a3 3 0 0 1 6 0"/>'),
  ship: wrap('<path d="M3 14l2 5h14l2-5z"/><path d="M6 14V9h12v5M12 9V5M10 5h4"/>'),
  carrier: wrap('<path d="M2 14l2 5h16l2-5z"/><path d="M5 14v-3h14v3M14 11V8h4v3M6 12h6"/>'),
  sub: wrap('<path d="M3 14a4 4 0 0 1 4-4h10a4 4 0 0 1 0 8H7a4 4 0 0 1-4-4z"/><path d="M10 10V7h4v3M12 7V4"/>'),
  soldiers: wrap('<circle cx="8" cy="6" r="2"/><circle cx="16" cy="6" r="2"/><path d="M4 20v-5a4 4 0 0 1 8 0v5M12 20v-5a4 4 0 0 1 8 0v5"/>'),
  interceptor: wrap('<path d="M12 2l3 6-3 14-3-14z"/><path d="M12 8v14M6 20l6-3 6 3"/>'),
  gift: wrap('<path d="M3 9h18v4H3zM5 13h14v8H5zM12 9v12"/><path d="M12 9c-2 0-4-1-4-3s2-2 4 3c2-5 4-5 4-3s-2 3-4 3"/>'),
  cart: wrap('<path d="M3 4h2l2.5 11h11L21 7H6.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>'),
  pin: wrap('<path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11z"/><circle cx="12" cy="10" r="2"/>'),
  check: wrap('<path d="M4 12l5 5L20 6"/>'),
  close: wrap('<path d="M6 6l12 12M18 6L6 18"/>'),
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
  sound: wrap('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9a4 4 0 0 1 0 6"/>'),
  muted: wrap('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9l5 6M21 9l-5 6"/>'),
};

export function icon(name) {
  return ICONS[name] || ICONS.bomb;
}
