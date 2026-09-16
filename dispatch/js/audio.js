let ctx = null;
let muted = false;

export function setMuted(m) {
  muted = Boolean(m);
}

export function isMuted() {
  return muted;
}

export function unlock() {
  if (!ctx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = AC ? new AC() : null;
    } catch {
      ctx = null;
    }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, { type = 'sine', dur = 0.12, gain = 0.2, slide = 0, delay = 0 } = {}) {
  const c = unlock();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noise(dur = 0.4, gain = 0.15) {
  const c = unlock();
  if (!c) return;
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(600, c.currentTime);
  filter.frequency.exponentialRampToValueAtTime(3000, c.currentTime + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  src.connect(filter).connect(g).connect(c.destination);
  src.start();
}

export function play(name) {
  if (muted) return;
  switch (name) {
    case 'pop': tone(880, { dur: 0.1, slide: -400 }); break;
    case 'tick': tone(1200, { type: 'square', dur: 0.04, gain: 0.06 }); break;
    case 'click': tone(600, { type: 'triangle', dur: 0.05, gain: 0.08 }); break;
    case 'thunk': tone(180, { type: 'triangle', dur: 0.16, slide: -80 }); break;
    case 'ding': tone(1568, { dur: 0.3, gain: 0.15 }); break;
    case 'chime':
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, { dur: 0.55, gain: 0.14, delay: i * 0.09 }));
      break;
    case 'whoosh': noise(0.5); break;
    default: break;
  }
}
