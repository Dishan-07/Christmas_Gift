const canvas = document.createElement("canvas");
canvas.className = "snow";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
let w, h;
let flakes = [];
let shootingStars = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function createFlakes() {
  flakes = Array.from({ length: Math.max(90, Math.floor(window.innerWidth / 8)) }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 3 + 0.8,
    speed: Math.random() * 1.2 + 0.4
  }));
}
createFlakes();

// Simple snowbank accumulation for the bottom-centered snowman
let snowbankHeight = parseFloat(localStorage.getItem('snowbankHeight') || '6'); // px (initial or persisted)
const SNOWBANK_MAX = 140; // cap the pile height
const SNOW_ACC_STEP = 0.65; // typical increment per landed flake
const SNOW_ACC_MIN = 0.18; // minimum increment
const SNOWBANK_SHOW_THRESHOLD = 28; // show snowman earlier
let snowmanShown = localStorage.getItem('snowmanShown') === '1';
const snowbankEl = () => document.getElementById('snowbank');
const snowmanElGetter = () => document.getElementById('snowman');
function updateSnowbank() {
  const sb = snowbankEl();
  const sm = snowmanElGetter();
  if (!sb) return;
  sb.style.height = Math.max(6, Math.min(SNOWBANK_MAX, Math.round(snowbankHeight))) + 'px';
  // subtle bounce
  sb.style.transform = 'translateY(' + (Math.random() * 2 - 1) + 'px)';
  setTimeout(() => { if (sb) sb.style.transform = ''; }, 350);

  // persist small integer value so progress remains across reloads
  try { localStorage.setItem('snowbankHeight', String(Math.round(snowbankHeight))); } catch (e) { }

  if (snowbankHeight > SNOWBANK_SHOW_THRESHOLD && sm && !snowmanShown) {
    sm.classList.add('snowman-visible');
    const rightArm = sm.querySelector('.arm.right');
    if (rightArm) rightArm.classList.add('waving');
    snowmanShown = true;
    try { localStorage.setItem('snowmanShown', '1'); } catch (e) { }
  }
}

// ensure initial state
updateSnowbank();

function spawnShootingStar() {
  if (Math.random() > 0.995) {
    const startX = Math.random() * w * 0.6;
    const startY = Math.random() * h * 0.25;
    shootingStars.push({ x: startX, y: startY, vx: 12 + Math.random() * 10, vy: 2 + Math.random() * 4, life: 1.0, length: 120 + Math.random() * 180 });
  }
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  // Snow flakes
  flakes.forEach(f => {
    ctx.beginPath();
    const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 2);
    grd.addColorStop(0, 'rgba(255,255,255,0.95)');
    grd.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.fillStyle = grd;
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();

    f.y += f.speed;
    f.x += Math.sin(f.y * 0.01) * 0.6;
    if (f.y > h) {
      // Landed — if near center, contribute to the central snowbank (probabilistic)
      const centerRadius = Math.min(220, w * 0.33);
      if (Math.abs(f.x - w / 2) < centerRadius && Math.random() > 0.35) {
        const add = Math.random() * SNOW_ACC_STEP + SNOW_ACC_MIN;
        snowbankHeight = Math.min(SNOWBANK_MAX, snowbankHeight + add);
        updateSnowbank();
      }
      f.y = -5 - Math.random() * 20;
      f.x = Math.random() * w;
    }
  });

  // Shooting stars (brief streaks)
  spawnShootingStar();
  shootingStars.forEach((s, idx) => {
    const progress = 1 - s.life; // 0..1
    const x2 = s.x + s.vx * (1 - s.life) * 6;
    const y2 = s.y + s.vy * (1 - s.life) * 6;

    const grad = ctx.createLinearGradient(s.x, s.y, x2, y2);
    grad.addColorStop(0, 'rgba(255,255,255,0.95)');
    grad.addColorStop(0.5, 'rgba(255,240,200,0.8)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.lineWidth = 2 + 4 * (1 - s.life);
    ctx.lineCap = 'round';
    ctx.strokeStyle = grad;

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.02 + Math.random() * 0.03;
    if (s.life <= 0) shootingStars.splice(idx, 1);
  });

  requestAnimationFrame(draw);
}
draw();

/* Music variables removed per request */

/* Audio source resolution removed */


/* Music controls removed */

/* Removed CORS test for background audio */

/* Audio event listeners removed */

/* Removed enable overlay for music */

/* Removed audio load error handling */

/* Removed metadata time restore */

/* Removed audio load error UI */

/* Removed periodic bgm time save */

/* Music play/pause/toggle functions removed */

/* Removed cross-tab bgm sync handler */

/* Removed DOMContentLoaded music initialization */
