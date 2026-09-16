let timer = null;
let hideTimer = null;

export function showToast(text, ms = 2200) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = text;
  el.hidden = false;
  el.classList.add('show');
  clearTimeout(timer);
  clearTimeout(hideTimer);
  timer = setTimeout(() => {
    el.classList.remove('show');
    hideTimer = setTimeout(() => { el.hidden = true; }, 250);
  }, ms);
}
