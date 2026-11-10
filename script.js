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
  activity: g('<path d="M3 12h4l3-8 4 16 3-8h4"/>'),
  text: g('<path d="M4 6h16M4 12h10M4 18h14"/>'),
  chat: g('<path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z"/>'),
  cpu: g('<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>'),
  refresh: g('<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>'),
  pin: g('<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  phone: g('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  bell: g('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0"/>'),
  check: g('<path d="m5 12 5 5 9-10"/>'),
  flask: g('<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/>'),
  coin: g('<circle cx="12" cy="12" r="9"/><path d="M14.5 9a2.5 2.5 0 0 0-2.5-1.5c-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2A2.5 2.5 0 0 1 9.5 15M12 6v1.5M12 16.5V18"/>')
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

/* ---------- rotating headline (words fade in place, so nothing on the page moves) ---------- */
(() => {
  const words = [...document.querySelectorAll('#rotor > span')];
  if (reduced || words.length < 2) return;
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    words[i].classList.remove('on'); i = (i + 1) % words.length; words[i].classList.add('on');
  }, 2800);
})();

/* ---------- scroll progress bar ---------- */
(() => {
  const bar = $('#progress'); let tick = false;
  const update = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; tick = false;
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();

/* ---------- tech marquee: duplicate the list once so it loops seamlessly ---------- */
(() => {
  const track = $('#track'); if (!track || reduced) return;
  const copy = track.firstElementChild.cloneNode(true); copy.setAttribute('aria-hidden', 'true');
  track.appendChild(copy);
})();

/* ---------- "read more" on long paragraphs, phones only ---------- */
(() => {
  if (!matchMedia('(max-width: 600px)').matches) return;
  document.querySelectorAll('.project .lede, .project .expl, .chapter .lede, .chapter .expl').forEach(p => {
    if (p.textContent.length < 170) return;
    p.classList.add('rm-clamp');
    const b = document.createElement('button'); b.className = 'rm-btn'; b.type = 'button'; b.textContent = 'Read more';
    b.addEventListener('click', () => { const open = p.classList.toggle('rm-clamp'); b.textContent = open ? 'Read more' : 'Show less'; });
    p.after(b);
  });
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
document.querySelectorAll('.card, .about-grid, .chapter').forEach(reveal);
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
  /* only rebuild on a real width change: phones fire "resize" whenever the address bar hides while scrolling */
  let lastW = 0;
  const refit = () => { if (cv.clientWidth !== lastW) { lastW = cv.clientWidth; fit(); } };
  fit(); lastW = cv.clientWidth; addEventListener('resize', refit);
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

/* ---------- interactive steppers (iSolution, Bitknox, hackathons) ---------- */
(() => {
  /* every caption below is taken from the project descriptions on this page.
     The Apigee policies are generic textbook examples with placeholder values, nothing from a real client. */
  const tags = (label, list, extra = {}) => ({ type: 'tags', label, tags: list.map(x => typeof x === 'string' ? { t: x } : { t: x[0], i: x[1] }), ...extra });
  const SIMS = {
    isolution: {
      btn: '▶ Send a request', finalAll: true, lines: 6,
      intro: { t: 'Request path', d: 'Watch a request travel through an Apigee proxy, or tap any step to see what happens there.',
        panel: { type: 'code', file: 'policy.xml', tool: 'Apigee', code: '<!-- Tap a step to see its policy -->' } },
      steps: [
        { t: 'Client app', d: 'A client application sends a request to the API, carrying an access token.',
          panel: { type: 'code', file: 'request.http', tool: 'Apigee', code: 'GET /v1/resource HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer <access token>' } },
        { t: 'OAuth', d: 'Before anything else, the proxy checks the access token. A missing or invalid token stops here.',
          panel: { type: 'code', file: 'Verify-Access-Token.xml', tool: 'Apigee', code: '<OAuthV2 name="Verify-Access-Token">\n  <Operation>VerifyAccessToken</Operation>\n</OAuthV2>' } },
        { t: 'Security policies', d: 'Security policies inspect the request, for example limiting payload size and nesting, before it can reach the backend.',
          panel: { type: 'code', file: 'JSON-Threat.xml', tool: 'Apigee', code: '<JSONThreatProtection name="JSON-Threat">\n  <ArrayElementCount>20</ArrayElementCount>\n  <ContainerDepth>5</ContainerDepth>\n  <ObjectEntryCount>50</ObjectEntryCount>\n  <Source>request</Source>\n</JSONThreatProtection>' } },
        { t: 'Transform & map', d: 'Transformation and mapping policies reshape the message into the format the backend system expects.',
          panel: { type: 'code', file: 'Convert-Payload.xml', tool: 'Apigee', code: '<XMLToJSON name="Convert-Payload">\n  <Source>request</Source>\n  <OutputVariable>request</OutputVariable>\n</XMLToJSON>' } },
        { t: 'Backend system', d: 'The proxy forwards the clean request to the bank or government service, which processes it and replies.',
          panel: { type: 'code', file: 'default.xml', tool: 'Apigee', code: '<TargetEndpoint name="default">\n  <HTTPTargetConnection>\n    <URL>https://backend.example.com</URL>\n  </HTTPTargetConnection>\n</TargetEndpoint>' } },
        { t: 'Response returned', d: 'The reply passes back through the proxy, is mapped to the format the client expects, and is returned.',
          panel: { type: 'code', file: 'response.http', tool: 'Apigee', code: 'HTTP/1.1 200 OK\nContent-Type: application/json' } }
      ]
    },
    sd: {
      btn: '▶ Follow a prompt',
      intro: { t: 'Stable Diffusion on Intel CPUs', d: 'Follow a prompt through the pipeline, or tap any step.', panel: tags('Pipeline', [], { hint: 'Tap a step, or press the button to play it through.' }) },
      steps: [
        { t: 'Text prompt', d: 'The user describes the image they want.', panel: tags('Input', [['Plain-text prompt', 'text']]) },
        { t: 'Stable Diffusion', d: 'Text-to-image pipeline built with Diffusers.', panel: tags('Model', [['Stable Diffusion', 'image'], ['Diffusers', 'huggingface']]) },
        { t: 'OpenVINO / ONNX', d: 'Model optimized to run on Intel CPUs.', panel: tags('Optimization', [['OpenVINO', 'intel'], ['ONNX', 'onnx'], ['Intel CPUs', 'cpu']]) },
        { t: 'Latent caching', d: 'Intermediate results reused for low-latency inference.', panel: tags('Speed', [['Latent caching', 'refresh'], ['Low-latency inference', 'activity']]) }
      ]
    },
    rag: {
      btn: '▶ Ask a question',
      intro: { t: 'RAG chatbot', d: 'Follow a question through the chatbot, or tap any step.', panel: tags('Pipeline', [], { hint: 'Tap a step, or press the button to play it through.' }) },
      steps: [
        { t: 'Embed', d: 'Content is turned into vectors.', panel: tags('Embeddings', [['Content as vectors', 'layers']]) },
        { t: 'PGVector on PostgreSQL', d: 'Vectors stored and searched inside Postgres.', panel: tags('Storage', [['PGVector', 'postgresql'], ['PostgreSQL', 'postgresql']]) },
        { t: 'Retrieve', d: 'Closest matches pulled in for each question.', panel: tags('Retrieval', [['Closest matches', 'search']]) },
        { t: 'Chatbot answers', d: 'The LLM replies using the retrieved context.', panel: tags('Answer', [['LLM', 'chat'], ['Retrieved context', 'database']]) }
      ]
    },
    dispatch: {
      btn: '▶ Play it through',
      intro: { t: 'From call to alert', d: 'Follow an emergency call through the system, or tap any step.', panel: tags('Incident', [], { hint: 'Tap a step, or press the button to play it through.' }) },
      steps: [
        { t: 'Call comes in', d: 'A caller reports an incident, in any language or dialect.', panel: tags('Incoming call', ['Any language', 'Any dialect'], { q: 'Saddar mobile market mein aag lagi hai' }) },
        { t: 'Agents analyse it', d: 'Sentiment, location and a confidence score. Matching social posts raise the confidence.', panel: tags('Agents', [['Sentiment', 'agents'], ['Location', 'pin'], ['Confidence score', 'activity'], ['Social posts', 'search']]) },
        { t: 'Dispatcher decides', d: 'The dispatcher gets a recommended plan to approve or reject. Weather and blocked roads re-plan it live.', panel: tags('Response plan', [['Approve or reject', 'check'], 'Weather', 'Blocked roads', ['Live re-plan', 'refresh']]) },
        { t: 'Right people alerted', d: 'Only citizens near the incident are notified. False alarms go to a dormant vault, not the bin.', panel: tags('Alerts', [['Nearby citizens only', 'pin'], ['False alarms to a dormant vault', 'database']]) }
      ]
    },
    chem: {
      btn: '▶ Match some waste',
      intro: { t: 'From waste to match', d: 'Follow a waste description through the engine, or tap any step.', panel: tags('Match', [], { hint: 'Tap a step, or press the button to play it through.' }) },
      steps: [
        { t: 'Describe the waste', d: 'An unstructured, natural-language waste manifest.', panel: tags('Input', [['Plain language', 'text'], 'Unstructured manifest']) },
        { t: 'Embed & search', d: 'An embedding model plus semantic search in Qdrant.', panel: tags('Search', [['gemini-embedding-001', 'googlegemini'], '3072-d vectors', ['Qdrant', 'qdrant']]) },
        { t: 'AI chemical engineer', d: 'Gemini 2.5 Flash explains why the chemistry works.', panel: tags('Explanation', [['Gemini 2.5 Flash', 'googlegemini'], ['Neutralization chemistry', 'flask']]) },
        { t: 'See the profit', d: 'Monthly ROI calculated in PKR.', panel: tags('Result', [['Monthly ROI', 'coin'], 'PKR', ['Cloud Run', 'googlecloud']]) }
      ]
    }
  };

  /* tiny syntax colouring: tags, attribute names, strings */
  const hl = src => esc(src).split('\n').map(l => l.startsWith('&lt;!--') ? `<span class="c">${l}</span>`
    : l.replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="t">$2</span>').replace(/(\s)([\w-]+)=(&quot;.*?&quot;)/g, '$1<span class="a">$2</span>=<span class="s">$3</span>')).join('\n');
  const renderPanel = (p, lines) => p.type === 'code'
    ? `<div class="code"><div class="code-bar mono"><span>${esc(p.file)}</span><span>${esc(p.tool || '')}</span></div><pre class="mono" style="--lines:${lines}">${hl(p.code)}</pre></div>`
    : `<div class="tp"><div class="tp-bar mono"><span>${esc(p.label || '')}</span></div><div class="tp-body">${p.q ? `<p class="tp-q">“${esc(p.q)}”</p>` : ''}${p.tags.map(x => `<span class="tp-chip"${x.i ? ` data-i="${x.i}"` : ''}>${esc(x.t)}</span>`).join('')}${p.hint ? `<span class="tp-hint">${esc(p.hint)}</span>` : ''}</div></div>`;

  function initSim(root, cfg) {
    if (!cfg) return;
    const lis = [...root.querySelectorAll('.sim-track li')], btn = root.querySelector('.sim-btn');
    const cap = root.querySelector('.sim-cap'), capT = cap.querySelector('h4'), capD = cap.querySelector('p'), panel = root.querySelector('.sim-panel');
    const steps = cfg.steps, last = steps.length - 1;
    let cur = -1, timer = null;

    const paint = s => { capT.textContent = s.t; capD.textContent = s.d; panel.innerHTML = renderPanel(s.panel, cfg.lines || 6); addIcons(panel); };
    function show(i) {
      cur = i;
      lis.forEach((li, k) => { li.classList.toggle('on', k === i); li.classList.toggle('done', (cfg.finalAll && i === last) || k < i); });
      paint(steps[i]);
    }
    /* reserve room for the tallest caption and panel, so nothing below ever shifts */
    function fit() {
      const keep = cur < 0 ? cfg.intro : steps[cur];
      cap.style.minHeight = '0'; panel.style.minHeight = '0';
      let hc = 0, hp = 0;
      [cfg.intro, ...steps].forEach(s => { paint(s); hc = Math.max(hc, cap.offsetHeight); hp = Math.max(hp, panel.offsetHeight); });
      paint(keep); cap.style.minHeight = hc + 'px'; panel.style.minHeight = hp + 'px';
    }
    const stop = () => { clearInterval(timer); timer = null; };
    function run() {
      stop(); let i = 0; show(0); btn.textContent = 'Playing…';
      timer = setInterval(() => {
        i++; show(i);
        if (i === last) { stop(); btn.textContent = '↻ Replay'; }
      }, 1800);
    }

    let fitW = innerWidth; fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    addEventListener('resize', () => { if (innerWidth !== fitW) { fitW = innerWidth; fit(); } });

    if (reduced) {
      btn.textContent = 'Next step ›';
      btn.addEventListener('click', () => show((cur + 1) % steps.length));
    } else {
      btn.addEventListener('click', run);
      /* play once, the first time it scrolls into view */
      new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); run(); } }, { threshold: .4 }).observe(root);
    }
    lis.forEach((li, k) => {
      const go = () => { stop(); show(k); btn.textContent = reduced ? 'Next step ›' : '↻ Replay'; };
      li.addEventListener('click', go);
      li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
  }
  document.querySelectorAll('.sim').forEach(root => initSim(root, SIMS[root.dataset.sim]));
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
  const grid = $('#certGrid');
  const safe = u => /^https?:\/\//i.test(u) ? u : '';
  (window.CERTS || []).forEach(g => {
    const c = document.createElement('div'); c.className = 'card cert-group';
    c.innerHTML = `<h4>${esc(g.group)}</h4>` + g.items.map(it => {
      const url = safe(it.url);
      return `<div class="cert-row"><div class="cert-name">${esc(it.n)}${it.d ? `<small>${esc(it.d)}</small>` : ''}</div>
        <div class="cert-act">${url ? `<a class="chip-btn solid" href="${esc(url)}" target="_blank" rel="noopener">Verify ↗</a>` : ''}</div></div>`;
    }).join('');
    grid.appendChild(c); reveal(c);
  });
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
