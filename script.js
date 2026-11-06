(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- icons & company logos ---------- */
/* Tech logos: Simple Icons (pinned version) from jsDelivr, drawn monochrome.
   Generic ones (agents, lock, ...) are inline SVGs below. A missing icon just disappears. */
const SI = 'https://cdn.jsdelivr.net/npm/simple-icons@16.26.0/icons/';
const g = p => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const CUSTOM = {
  agents: g('<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M10.7 7.2 6.3 15.8M13.3 7.2l4.4 8.6M7.5 18h9"/>'),
  key: g('<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/>'),
  shield: g('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>'),
  swap: g('<path d="M4 8h14l-3-3M20 16H6l3 3"/>'),
  branch: g('<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 7v10M6 12h10"/>'),
  plug: g('<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>'),
  browser: g('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>'),
  database: g('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
  image: g('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m21 16-5-5-8 9"/>'),
  search: g('<circle cx="11" cy="11" r="6"/><path d="m20 20-4-4"/>'),
  robot: g('<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 8V4M9 13h.01M15 13h.01M3 13v3M21 13v3"/>'),
  layers: g('<path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5"/>'),
  activity: g('<path d="M3 12h4l3-8 4 16 3-8h4"/>')
};
const iconSrc = k => CUSTOM[k] ? 'data:image/svg+xml,' + encodeURIComponent(CUSTOM[k]) : SI + k + '.svg';
function addIcons(root = document) {
  root.querySelectorAll('[data-i]').forEach(el => {
    if (el.querySelector(':scope > .ico')) return;
    el.insertAdjacentHTML('afterbegin', `<img class="ico" src="${iconSrc(el.dataset.i)}" alt="" loading="lazy" decoding="async" onerror="this.remove()">`);
  });
}
/* Company badges: looks for assets/logos/<id>.svg|png|jpg|webp and falls back to initials. */
function addCompanyLogos(root = document) {
  root.querySelectorAll('[data-co]').forEach(el => {
    const id = el.dataset.co, exts = ['png', 'svg', 'jpg', 'webp']; let i = 0;
    el.textContent = el.dataset.mono || id.slice(0, 2).toUpperCase(); el.classList.add('mono-badge');
    const img = new Image(); img.alt = '';
    const next = () => { if (i < exts.length) img.src = `assets/logos/${id}.${exts[i++]}`; };
    img.onerror = next;
    img.onload = () => {
      const n = el.nextElementSibling; img.alt = n && n.classList.contains('cn') ? n.textContent : '';
      el.classList.remove('mono-badge'); el.classList.add('has-img'); el.textContent = ''; el.appendChild(img);
    };
    next();
  });
}

/* ---------- theme ---------- */
$('#themeBtn').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
  document.dispatchEvent(new Event('themechange'));
});

/* ---------- typed headline ---------- */
(() => {
  const words = ['agentic AI systems', 'RAG pipelines', 'fast generative inference'];
  const el = $('#typed'); let w = 0, c = 0, del = false;
  if (reduced) { el.textContent = words[0]; return; }
  (function tick() {
    const word = words[w];
    el.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 28 : 65);
  })();
})();

/* ---------- certificate count (from data) ---------- */
const certTotal = (window.CERTS || []).reduce((n, g) => n + g.items.length, 0);
if (certTotal) $('#certCount').dataset.count = certTotal;

/* ---------- reveal & count-up ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
}), { threshold: .08 });
const reveal = el => { el.classList.add('reveal'); io.observe(el); };
document.querySelectorAll('.card, .about-grid').forEach(reveal);
document.querySelectorAll('[data-count]').forEach(el => {
  const end = +el.dataset.count, suf = el.dataset.suffix || '';
  const o = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return; o.disconnect();
    const t0 = performance.now();
    (function f(t) { const p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); })(t0);
  }); o.observe(el);
});

const visible = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
function rgba(hex, a) {
  hex = hex.replace('#', ''); if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const n = parseInt(hex, 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})`;
}

/* ---------- hero particle network ---------- */
(() => {
  const cv = $('#heroCanvas'), ctx = cv.getContext('2d');
  let W, H, pts = [], mouse = { x: -999, y: -999 };
  const fit = () => {
    const d = devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    const n = Math.min(110, Math.round(W * H / 14000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
  };
  fit(); addEventListener('resize', fit);
  cv.parentElement.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  cv.parentElement.addEventListener('mouseleave', () => mouse.x = mouse.y = -999);
  let a = css('--accent'), b = css('--accent2');
  document.addEventListener('themechange', () => { a = css('--accent'); b = css('--accent2'); });
  (function draw() {
    requestAnimationFrame(draw);
    if (!visible(cv)) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 130) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
    }
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) { ctx.strokeStyle = rgba(a, (1 - d / 120) * .35); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (md < 160) { ctx.strokeStyle = rgba(b, (1 - md / 160) * .6); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      ctx.fillStyle = rgba(a, .8); ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 7); ctx.fill();
    }
  })();
})();

/* ---------- Dispatch video fallback ---------- */
(() => {
  const v = $('#dVideo');
  v.querySelector('source').addEventListener('error', () => { v.classList.add('hidden'); $('#dVideoMissing').classList.remove('hidden'); });
})();

/* ---------- experience ---------- */
(() => {
  const J = [
    { t: 'API Developer', co: 'iSolution · Riyadh, Saudi Arabia', d: 'May 2026 – Nov 2026', id: 'isolution', m: 'iS', b: [
      'Learned and applied Apigee on GCP: built API proxies and implemented OAuth, security policies, transformations and mappings.',
      'Debugged proxy errors and ran rigorous proxy testing before release; worked on WSO2 mappings and IBM webMethods integrations.',
      'Delivered integrations for banking and government clients across the Gulf region.',
      'Joined client calls to diagnose issues, agreed resolutions with them and wrote the technical documentation.'] },
    { t: 'AI/ML Engineer', co: 'Bitknox Global · On-site', d: 'Jan 2026 – May 2026', id: 'bitknox', m: 'BK', b: [
      'Built text-to-image pipelines with Stable Diffusion, optimized for Intel CPUs via OpenVINO/ONNX, with latent caching for low-latency inference.',
      'Integrated PGVector with PostgreSQL for RAG chatbots; developed an AI image search library for web integration.',
      'Developed URDF models and simulations in Gazebo Harmonic, PyBullet and ROS2 Jazzy; implemented the Unitree SDK and researched HarmonyOS for humanoid robotics R&D.',
      'Architected a lead-gen portal for automated Google Maps scraping and WhatsApp/email campaigns (FastAPI, Tailwind, Playwright, MySQL).',
      'Authored the architecture for a 150k-user field-staff tracking project for a provincial government; delivered viability reports and monitoring tools.',
      'Researched neural architectures, CNNs, feature engineering, Ridge/Lasso regularization and gradient-descent optimization.'] },
    { t: 'Game Design & Quality Assurance Intern', co: 'The Game Storm Studios · On-site', d: 'Oct 2025 – Dec 2025', id: 'gamestorm', m: 'GS', b: [
      'Ran stress-testing and QA cycles on 42 games, uncovering 270+ bugs.',
      'Designed 7 full-scale Game Design Documents, turning creative vision into development-ready specs.',
      'Balanced complex mechanics against technical feasibility across game categories.'] },
    { t: 'Freelance IT Consultant & Tutor', co: 'Freelance · Remote', d: 'Jan 2025 – Mar 2025', id: 'freelance', m: 'FL', b: [
      'Taught cloud computing, virtualization and embedded systems.',
      'Helped design high-availability architectures with Docker, WSL, MySQL NDB clusters, MongoDB replicas and Nginx load balancing.',
      'Supported embedded work in C, circuit design and PlatformIO microcontroller projects.'] },
    { t: 'IT Intern', co: 'DHA Lahore · On-site', d: 'Oct 2024 – Dec 2024', id: 'dha', m: 'DHA', b: [
      'Helped the IT team roll out Jira for project management: research, feature testing, creating projects, reports and presentations.'] },
    { t: 'ML Engineer Intern, AWS Cloud Services', co: 'NetSol Technologies · On-site', d: 'Jul 2024 – Sep 2024', id: 'netsol', m: 'NS', b: [
      'Worked in the Cloud Services department on generative AI projects with large language models.',
      'Collaborated with senior developers on model training, validation and fine-tuning best practices.'] }
  ];
  const tl = $('#timeline');
  J.forEach((j, i) => {
    const d = document.createElement('details'); d.className = 'job'; d.open = true;
    d.innerHTML = `<summary><div class="sum-l"><span class="co-logo sm" data-co="${esc(j.id)}" data-mono="${esc(j.m)}"></span><div><h4>${esc(j.t)}</h4><div class="co">${esc(j.co)}</div></div></div><span class="when">${esc(j.d)}</span></summary><ul class="b">${j.b.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    tl.appendChild(d); reveal(d);
  });
})();

/* ---------- certificates (data from certs.js) ---------- */
(() => {
  const grid = $('#certGrid'), lb = $('#lightbox');
  const safe = u => /^https?:\/\//i.test(u) ? u : '';
  (window.CERTS || []).forEach(g => {
    const c = document.createElement('div'); c.className = 'card cert-group';
    c.innerHTML = `<h4>${esc(g.group)}</h4>` + g.items.map((it, i) => {
      const url = safe(it.url);
      return `<div class="cert-row"><div class="cert-name">${esc(it.n)}${it.d ? `<small>${esc(it.d)}</small>` : ''}</div>
        <div class="cert-act">${it.img ? `<button class="chip-btn" data-img="${esc(it.img)}" data-cap="${esc(it.n)}">View</button>` : ''}${url ? `<a class="chip-btn solid" href="${esc(url)}" target="_blank" rel="noopener">Verify ↗</a>` : ''}</div></div>`;
    }).join('');
    grid.appendChild(c); reveal(c);
  });
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-img]'); if (!b) return;
    lb.querySelector('img').src = b.dataset.img; lb.querySelector('img').alt = b.dataset.cap; lb.querySelector('p').textContent = b.dataset.cap; lb.classList.remove('hidden');
  });
  const close = () => lb.classList.add('hidden');
  lb.addEventListener('click', e => { if (e.target !== lb.querySelector('img')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ---------- university projects ---------- */
(() => {
  const P = [
    { t: 'Garden Cold Frame Monitoring Embedded System', d: 'Apr – May 2024', img: 'assets/uni/garden.jpg', tags: ['C++', 'ESP32', 'PlatformIO', 'DHT11', 'TFT display'], repo: 'https://gitlab.com/shanzazahir6/garden-cold-frame-monitoring-embedded-system',
      x: 'Prototype embedded system for real-time sensor data logging, user-mode selection and environmental monitoring. Shows min/max temperature and humidity on a display, has user-editable modes, and switches automatically between day and night modes from ambient light. Built with a 4x4 keypad, light-dependent resistor, DHT11 sensor, ILI9341 TFT screen and RGB LED on an ESP32 DevKit, coded in C++ with PlatformIO.' },
    { t: 'User-Centered Weather Forecast Mobile App Prototype', d: 'Feb – Mar 2024', img: 'assets/uni/weather.jpg', tags: ['Figma', 'UX design', 'User research'],
      x: 'For my User Experience Design course I designed a weather forecast app prototype in Figma. The design process covered characterizing user needs, identifying core requirements and presenting complex forecast, temperature and precipitation data with clarity, with an emphasis on user convenience.' },
    { t: 'BI Dashboard for Vehicle Sales Data', d: 'Dec 2023 – Jan 2024', img: 'assets/uni/bi.jpg', tags: ['JavaFX', 'Scene Builder', 'JSON', 'WCF web service'],
      x: 'For Applied Data Science I built a Business Intelligence dashboard in JavaFX (Eclipse) with Scene Builder layouts. It visualizes vehicle sales across years, quarters, regions and models by pulling JSON from a WCF web service, parsing and caching it, and showing it in tables and charts with dropdown and checkbox filters.' },
    { t: 'eDepot System for Haulage Management', d: 'Apr – May 2023', img: 'assets/uni/edepot.jpg', tags: ['Java', 'UML', 'OOP', 'CSV persistence'],
      x: 'A two-part assignment on design and implementation of a system managing Heavy Goods Vehicle depots. The design phase produced Use Case, Class, State, Activity, Communication and Sequence UML diagrams; the implementation is an object-oriented Java console application managing vehicles, drivers and work schedules, with CSV data persistence.' },
    { t: 'Club Event Promotion Web Application', d: 'Mar – Apr 2023', img: 'assets/uni/club.jpg', tags: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'AJAX'],
      x: 'A dynamic web app for promoting and tracking nightclub events. Staff get an admin interface for artists, categories, timings and ticket pricing stored in MySQL; the public sees upcoming and past events on a mobile-friendly front end with AJAX for seamless updates.' }
  ];
  const g = $('#uniGrid');
  P.forEach(p => {
    const c = document.createElement('details'); c.className = 'card uni';
    c.innerHTML = `<summary><img src="${esc(p.img)}" alt="" onerror="this.remove()"><div><h4>${esc(p.t)}</h4><span class="muted small mono">${esc(p.d)}</span>
      <ul class="chips">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div></summary>
      <p>${esc(p.x)}</p>${p.repo ? `<a class="btn sm" href="${esc(p.repo)}" target="_blank" rel="noopener">View repository ↗</a>` : ''}`;
    g.appendChild(c); reveal(c);
  });
})();

/* ---------- logos (run last, once all dynamic content exists) ---------- */
addIcons();
addCompanyLogos();

})();
