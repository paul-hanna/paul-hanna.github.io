const COLORS = ['#06C167', '#05A356', '#F6A700', '#FFFFFF', '#9AE6C4', '#0B0B0B'];

let particles = [];
let raf = null;
let activeCanvas = null;

function resize(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function frame() {
  const canvas = activeCanvas;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter((p) => p.y < canvas.height + 40 && p.life > 0);
  for (const p of particles) {
    p.vy += 0.18;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.min(1, p.life / 40);
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
  if (particles.length) raf = requestAnimationFrame(frame);
  else {
    raf = null;
    canvas.hidden = true;
  }
}

export function burst(canvas, { count = 180, origin = { x: 0.5, y: 0.35 } } = {}) {
  activeCanvas = canvas;
  resize(canvas);
  canvas.hidden = false;
  const ox = origin.x * canvas.width;
  const oy = origin.y * canvas.height;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    particles.push({
      x: ox, y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: COLORS[i % COLORS.length],
      life: 140 + Math.random() * 60,
    });
  }
  if (!raf) raf = requestAnimationFrame(frame);
}
