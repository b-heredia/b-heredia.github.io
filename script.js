// Typing effect for the hero tagline
const phrases = [
  "Aspiring Software Developer",
  "Exploring AI + Creative Code",
  "i.c.stars"
];

const typedEl = document.getElementById('typed');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Mouse-only effects are skipped on phones/tablets (no cursor to follow)
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
// Cap canvas resolution so retina screens don't render 4x the pixels
const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

function typeLoop() {
  if (!typedEl) return;

  if (prefersReducedMotion) {
    typedEl.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(tick, deleting ? 35 : 65);
  }

  tick();
}

typeLoop();

// Twinkling star field (live background)
// Stars are grouped into a few twinkle "bands" so each frame only needs
// one fill() per band instead of one per star, and it redraws at ~30fps.
(function () {
  const canvas = document.getElementById('starField');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const BANDS = 12;
  let bands = [];

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const count = Math.min(Math.floor((w * h) / 9000), 260);
    bands = Array.from({ length: BANDS }, (_, i) => ({
      phase: (i / BANDS) * Math.PI * 2,
      speed: 0.0006 + Math.random() * 0.0012,
      path: new Path2D()
    }));
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 1.3 + 0.4;
      const p = bands[i % BANDS].path;
      p.moveTo(x + r, y);
      p.arc(x, y, r, 0, Math.PI * 2);
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f2f0ff';
    for (const b of bands) {
      const twinkle = prefersReducedMotion ? 0.7 : 0.5 + 0.5 * Math.sin(time * b.speed + b.phase);
      ctx.globalAlpha = 0.25 + twinkle * 0.65;
      ctx.fill(b.path);
    }
    ctx.globalAlpha = 1;
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); draw(performance.now()); }, 150);
  });
  resize();

  if (prefersReducedMotion) {
    draw(0);
    return;
  }

  let last = 0;
  function loop(time) {
    if (time - last >= 33) { // ~30fps is plenty for a slow twinkle
      draw(time);
      last = time;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// Fade-in sections on scroll
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

// Boot-up intro overlay
const bootOverlay = document.getElementById('boot-overlay');
if (bootOverlay) {
  const bootDuration = prefersReducedMotion ? 0 : 1200;
  setTimeout(() => bootOverlay.remove(), bootDuration);
}

// Shared mouse tracking: one listener, work batched into a single frame
let mouseX = -9999;
let mouseY = -9999;
let mouseFramePending = false;
const mouseSubscribers = [];

if (hasFinePointer && !prefersReducedMotion) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!mouseFramePending) {
      mouseFramePending = true;
      requestAnimationFrame(() => {
        mouseFramePending = false;
        mouseSubscribers.forEach((fn) => fn(mouseX, mouseY));
      });
    }
  }, { passive: true });
}

// Cursor-tracking ambient glow
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
  if (hasFinePointer && !prefersReducedMotion) {
    mouseSubscribers.push((x, y) => {
      cursorGlow.style.transform = `translate3d(${x - 240}px, ${y - 240}px, 0)`;
    });
  } else {
    cursorGlow.remove();
  }
}

// Comet-trail cursor
// The loop only runs while there are particles on screen, and the glow is
// faked with a soft second circle instead of the very expensive shadowBlur.
(function () {
  const canvas = document.getElementById('cometCanvas');
  if (!canvas) return;
  if (prefersReducedMotion || !hasFinePointer) {
    canvas.remove();
    return;
  }
  const ctx = canvas.getContext('2d');
  const colors = ['#9d5cff', '#ff2fc4', '#00eaff'];
  const MAX = 90;
  let particles = [];
  let running = false;

  function resize() {
    canvas.width = Math.round(window.innerWidth * DPR);
    canvas.height = Math.round(window.innerHeight * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  mouseSubscribers.push((x, y) => {
    for (let i = 0; i < 2; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        r: Math.random() * 3 + 2,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    if (particles.length > MAX) particles.splice(0, particles.length - MAX);
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  });

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;
      if (p.life <= 0) continue;
      const r = p.r * p.life;
      ctx.fillStyle = p.color;
      // soft halo
      ctx.globalAlpha = p.life * 0.25;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 2.4, 0, Math.PI * 2);
      ctx.fill();
      // bright core
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    particles = particles.filter((p) => p.life > 0);
    if (particles.length) {
      requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      running = false;
    }
  }
})();

// Scroll progress bar (uses transform instead of width, so no layout work)
const scrollFill = document.getElementById('scrollFill');
if (scrollFill) {
  let scrollPending = false;
  function updateScrollProgress() {
    scrollPending = false;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? window.scrollY / docHeight : 0;
    scrollFill.style.transform = `scaleX(${pct})`;
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateScrollProgress);
    }
  }, { passive: true });
  updateScrollProgress();
}

// 3D tilt on project cards
if (!prefersReducedMotion && hasFinePointer) {
  document.querySelectorAll('.project.tilt').forEach((card) => {
    let rect = null;
    let pending = false;
    let lastEvent = null;
    card.style.transition = 'transform 0.15s ease';
    card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
    card.addEventListener('mousemove', (e) => {
      lastEvent = e;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        if (!rect) rect = card.getBoundingClientRect();
        const x = lastEvent.clientX - rect.left;
        const y = lastEvent.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -8;
        const rotateY = ((x / rect.width) - 0.5) * 8;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      rect = null;
      card.style.transform = '';
    });
  });
}

// Live footer clock
const liveClock = document.getElementById('liveClock');
if (liveClock) {
  function tickClock() {
    const now = new Date();
    liveClock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }
  tickClock();
  setInterval(tickClock, 1000);
}

// Footer date stamp
const footerDate = document.getElementById('footerDate');
if (footerDate) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  footerDate.textContent = `${dd}.${mm}.${now.getFullYear()}`;
}

// Ruler tick marks along the top HUD strip
const ruler = document.getElementById('ruler');
if (ruler) {
  let lastCount = 0;
  function buildRuler() {
    const tickWidth = 42;
    const count = Math.ceil(window.innerWidth / tickWidth) + 1;
    if (count === lastCount) return;
    lastCount = count;
    ruler.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 1; i <= count; i++) {
      const tick = document.createElement('span');
      tick.className = 'ruler-tick';
      tick.textContent = i;
      frag.appendChild(tick);
    }
    ruler.appendChild(frag);
  }
  buildRuler();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildRuler, 200);
  });
}
