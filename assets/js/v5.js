/* ==========================================================================
   .ATHR — v5.js · «الأثر»
   البطل = الماسة الحمرا. بتبدأ نقطة آخر العنوان، تنفصل، تعدّي على حيطة التشابه،
   وتمشي على خط الرحلة (والخط وراها يبيض = الأثر)، وفي الآخر تكبر وتقلب الدنيا Warm White.
   الحركة: Fade · Mask · Slide · Tracking · Diamond reveal — مفيش bounce/elastic/spin/glitch (§9.12)
   ========================================================================== */
(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ok = window.gsap && window.ScrollTrigger && window.SplitText && window.CustomEase && window.DrawSVGPlugin;
  const NS = 'http://www.w3.org/2000/svg';
  const DM = 14; // حجم البطل الأساسي بالبكسل (--dm)

  const unlockIntro = () => { root.classList.remove('intro'); try { sessionStorage.setItem('athr-intro5', '1'); } catch (e) {} };
  clock();

  if (!ok || reduce || /[?&]static/.test(location.search)) { unlockIntro(); return; } // الصفحة الثابتة شغالة لوحدها (?static للتجربة)
  root.classList.add('motion');
  // لو حاجة وقعت قبل ما الحركة تبدأ: ارجع للصفحة الثابتة
  const failsafe = setTimeout(() => { root.classList.remove('motion'); unlockIntro(); }, 5000);

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, DrawSVGPlugin);
  CustomEase.create('athr', '0.16,1,0.3,1');
  CustomEase.create('athrInOut', '0.76,0,0.24,1');
  gsap.defaults({ ease: 'athr', duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  const desk = () => window.innerWidth >= 900;

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // سناب بإيدينا فوق Lenis (السناب بتاع ScrollTrigger بيتخانق مع Lenis ويقف في النص)
  const snaps = [];
  let snapT = 0, snapping = false, lastDir = 1, quietUntil = 0;
  const addSnap = (st, getMarks) => snaps.push({ st, getMarks });
  const trySnap = () => {
    if (snapping) return;
    if (performance.now() < quietUntil) { clearTimeout(snapT); snapT = setTimeout(trySnap, quietUntil - performance.now() + 30); return; }
    ScrollTrigger.update();
    for (const { st, getMarks } of snaps) {
      if (!st || !st.isActive) continue;
      const marks = getMarks(), v = st.progress;
      const near = marks.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
      if (Math.abs(near - v) * (st.end - st.start) < 3) return;
      const m = lastDir > 0 ? (marks.find((x) => x > v) ?? marks[marks.length - 1]) : ([...marks].reverse().find((x) => x < v) ?? marks[0]);
      const y = st.start + (st.end - st.start) * m;
      const dur = gsap.utils.clamp(0.55, 1.25, Math.abs(y - window.scrollY) / 900);
      snapping = true;
      const release = () => { if (!snapping) return; snapping = false; quietUntil = performance.now() + 350; };
      setTimeout(release, dur * 1000 + 900);
      lenis.scrollTo(y, { duration: dur, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), onComplete: release });
      return;
    }
  };
  // (على اللمس مفيش سناب — عشان ما يتخانقش مع سحب الصباع)
  if (lenis && fine) lenis.on('scroll', (l) => {
    if (l.direction) lastDir = l.direction;
    if (snapping) return;
    clearTimeout(snapT);
    snapT = setTimeout(trySnap, 170);
  });
  const scrollToY = (y, dur = 1.6, done) => {
    if (lenis) { snapping = true; setTimeout(() => { snapping = false; }, dur * 1000 + 250); lenis.scrollTo(y, { duration: dur, easing: (t) => 1 - Math.pow(1 - t, 4), onComplete: () => done && setTimeout(done, 200) }); }
    else { window.scrollTo({ top: y, behavior: 'smooth' }); if (done) setTimeout(done, dur * 1000 + 300); }
  };
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#main') return;
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    const pinParent = target === 0 ? null : (target.closest('.pin-spacer') || target);
    scrollToY(target === 0 ? 0 : pinParent.getBoundingClientRect().top + scrollY);
  }));

  // مكان عنصر جوّه حاوية من غير ما الـtransforms تأثر (offsetLeft/Top)
  const offsetIn = (el, box) => {
    let x = 0, y = 0, n = el;
    while (n && n !== box) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2, w: el.offsetWidth };
  };
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  ready.then(() => {
    clearTimeout(failsafe);
    const intro = root.classList.contains('intro');
    if (intro && lenis) lenis.stop();
    cursor();
    nav();
    hero();
    journey();
    work();
    systems();
    cta();
    giant();
    chapters();
    magnet();
    ScrollTrigger.refresh();
    if (intro) loader(); else heroIntro(false);
  });

  /* ==========================================================================
     0 · المقدمة — الماسة بتقع، ATHR تطلع جنبها، وبعدين الماسة تطير وتقعد نقطة آخر العنوان
     ========================================================================== */
  function loader() {
    const el = $('.loader'), dm = $('.loader__dm');
    if (!el || !dm) { unlockIntro(); heroIntro(false); return; }
    const slot = $('.loader__slot', el), word = $('.loader__word', el), tag = $('.loader__tag', el);
    const chars = SplitText.create(word, { type: 'chars', mask: 'chars' }).chars;
    const fs = parseFloat(getComputedStyle(word).fontSize);
    const sr = slot.getBoundingClientRect(), wr = word.getBoundingClientRect();
    const start = { x: sr.left + sr.width / 2, y: wr.top + wr.height * 0.8, s: (fs * 0.17) / DM };
    const pdot = $('[data-pdot="hero"]'), pin = $('.hero');
    const target = () => { const o = offsetIn(pdot, pin), r = pin.getBoundingClientRect(); return { x: r.left + o.x, y: r.top + o.y, s: o.w / DM }; };
    gsap.set(dm, { x: start.x, y: -60, scale: start.s, rotation: 45 });
    const tl = gsap.timeline({ onComplete: () => { unlockIntro(); el.remove(); dm.remove(); if (lenis) lenis.start(); ScrollTrigger.refresh(); } });
    tl.to(dm, { y: start.y, duration: 0.75, ease: 'power3.in' }, 0.2)
      .fromTo(chars, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05 }, 0.85)
      .fromTo(el, { '--lp': 0 }, { '--lp': 1, duration: 1.1, ease: 'athrInOut' }, 0.95)
      .fromTo(tag, { opacity: 0, letterSpacing: '.6em' }, { opacity: 1, letterSpacing: '.2em', duration: 1 }, 1.1)
      .to(chars, { yPercent: -110, duration: 0.6, stagger: 0.03, ease: 'athrInOut' }, 2.2)
      .to(tag, { opacity: 0, duration: 0.3 }, 2.2)
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'athrInOut' }, 2.45)
      .add(() => heroIntro(true), 2.4);
    const t0 = target();
    tl.to(dm, { x: () => t0.x, y: () => t0.y, scale: () => t0.s, duration: 1.1, ease: 'athrInOut' }, 2.5)
      .add(() => { gsap.set(pdot, { visibility: 'visible' }); heroState.dotReady = true; }, 3.6);
  }

  /* ==========================================================================
     1 · THE NOISE — الهيرو + حيطة التشابه (مثبّت + scrub)
     ========================================================================== */
  const heroState = { dotReady: false };
  let heroOpen = null;
  function heroIntro(fromLoader) {
    const pin = $('.hero');
    const tl = gsap.timeline();
    tl.to('.nav', { opacity: 1, duration: 0.8 }, 1)
      .fromTo($('.anchor-line', pin), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'athrInOut' }, 0)
      .fromTo($$('.ln', pin), { yPercent: 110, y: 0 }, { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.35)
      .fromTo($$('[data-hero-fade]', pin), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 0.95)
      .fromTo($('.wall', pin), { opacity: 0 }, { opacity: 0.2, duration: 2.2, ease: 'power1.out' }, 0.4);
    if (!fromLoader) {
      const pdot = $('[data-pdot="hero"]'), a = heroState.actor, htl = heroState.tl && heroState.tl();
      if (!a || (htl && htl.time() > 0.02)) { heroState.dotReady = true; }
      else {
        const p = heroState.p0();
        tl.fromTo(a, { x: p.x, y: p.y - window.innerHeight * 0.5, scale: p.s, opacity: 1 }, { y: p.y, duration: 0.75, ease: 'power3.in' }, 1.05)
          .add(() => { pdot.style.visibility = 'visible'; heroState.dotReady = true; if (!(htl && htl.time() > 0.02)) a.style.opacity = 0; }, 1.8);
      }
    }
    heroOpen = tl;
  }

  function hero() {
    const sec = $('.s-hero'), pin = $('.hero', sec);
    if (!pin) return;
    const copy = $('.hero__copy', pin), lns = $$('.ln', copy), fades = $$('[data-hero-fade]', pin), anchor = $('.anchor-line', pin);
    const pdot = $('[data-pdot="hero"]', pin), actor = $('[data-actor="hero"]', pin), trail = $('[data-trail="hero"]', pin);
    const wall = $('.wall', pin), grid = $('.wall__grid', wall);
    const caps = $$('[data-cap]', pin);

    // الحيطة: بوستات متطابقة — كفاية تغطي أي شاشة
    const COLS = 13, ROWS = 9;
    grid.style.setProperty('--cols', COLS);
    // (صور Nano Banana من Flow: نفس اللاتيه ونفس الكرواسون ونفس التشيز كيك — كل الكافيهات بتنزّل نفس البوست)
    grid.innerHTML = Array.from({ length: COLS * ROWS }, (_, i) => {
      const n = ((i % COLS) * 5 + Math.floor(i / COLS) * 7) % 12 + 1;
      return `<div class="tile"><img src="assets/img/feed/f${String(n).padStart(2, '0')}.webp" alt="" width="320" height="400" decoding="async"></div>`;
    }).join('');
    const tiles = $$('.tile', grid);
    const r = rng(7);
    const shuffled = tiles.map((t) => [r(), t]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
    gsap.set(grid, { xPercent: -50, yPercent: -50 });

    // آخر جملة: الكلمات بتنوّر
    const words = SplitText.create($('[data-words] .cap__en', pin), { type: 'words', wordsClass: 'w' }).words;

    const A = { x: 0, y: 0, s: 1, o: 0 };
    const W = () => pin.clientWidth, H = () => pin.clientHeight;
    const p0 = () => { const o = offsetIn(pdot, pin); return { x: o.x, y: o.y, s: o.w / DM }; };
    const mid = () => ({ x: W() / 2, y: H() * (desk() ? 0.27 : 0.25) });
    let tl = null;
    const render = () => {
      actor.style.transform = `translate(${A.x.toFixed(2)}px,${A.y.toFixed(2)}px) scale(${A.s.toFixed(3)})`;
      actor.style.opacity = tl && tl.time() > 0.02 ? A.o : 0;
    };

    tl = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: () => {
      // (لو حد نزل قبل ما الافتتاحية تخلص: خلّصها، وبعدين ارسم السكرول تاني فوقها)
      if (heroOpen && tl.time() > 0.02) { const h = heroOpen; heroOpen = null; h.progress(1).kill(); tl.render(tl.time(), true, true); }
      render(); swapDot();
    } });
    const capIn = (c, at) => tl.set(c, { visibility: 'visible' }, at).fromTo(c.children, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'athr' }, at);
    const capOut = (c, at) => tl.to(c.children, { opacity: 0, y: -36, duration: 0.5, stagger: 0.06, ease: 'power2.in' }, at).set(c, { visibility: 'hidden' }, at + 0.62);

    // (أ) العنوان يطلع والماسة تنفصل وتروح نص الحيطة
    tl.fromTo(A, { x: () => p0().x, y: () => p0().y, s: () => p0().s, o: 1 }, { x: () => mid().x, y: () => mid().y, s: 1.7, duration: 1.5, ease: 'athrInOut' }, 0.15)
      .fromTo(lns, { yPercent: 0, y: 0, opacity: 1 }, { yPercent: -130, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power2.in', immediateRender: false }, 0)
      .fromTo(fades, { opacity: 1, y: 0 }, { opacity: 0, y: -24, duration: 0.6, stagger: 0.04, immediateRender: false }, 0)
      .fromTo(anchor, { scaleX: 1 }, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.8, ease: 'athrInOut', immediateRender: false }, 0.1)
      .fromTo(wall, { opacity: 0.2 }, { opacity: 1, duration: 1.4, immediateRender: false }, 0.4)
      .fromTo(grid, { scale: 1.12 }, { scale: 1, duration: 2.2 }, 0.2);
    // (ب) «Most brands look the same.» — موجة نور بتعدّي على البوستات المتطابقة
    capIn(caps[0], 1.6);
    tl.to(tiles, { '--dim': 0.04, duration: 0.35, stagger: { grid: [ROWS, COLS], from: 'center', amount: 1.1 } }, 1.9)
      .to(tiles, { '--dim': 0.5, duration: 0.35, stagger: { grid: [ROWS, COLS], from: 'center', amount: 1.1 } }, 2.35);
    capOut(caps[1 - 1], 3.6);
    // (ج) «And the same gets forgotten.» — البوستات بتتنسي واحد واحد، والماسة لوحدها
    capIn(caps[1], 4.2);
    tl.to(shuffled, { opacity: 0.04, scale: 0.9, duration: 0.5, stagger: { amount: 2.1 } }, 4.6)
      .to(A, { s: 2.1, duration: 2.4, ease: 'none' }, 4.6);
    capOut(caps[1], 6.9);
    // (د) «Design is the last step. Not the first.» — الكلمات تنوّر
    tl.set(caps[2], { visibility: 'visible' }, 7.4)
      .fromTo(words, { opacity: 0.1, y: 14 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.14 }, 7.4)
      .fromTo(caps[2].querySelector('.ar'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'athr' }, 8.3)
      .to(wall, { opacity: 0, duration: 0.8 }, 7.6);
    // (هـ) الماسة تقع لتحت وتسيب خط — رايحة للرحلة
    tl.to(caps[2].children, { opacity: 0, y: -30, duration: 0.5, stagger: 0.05, ease: 'power2.in' }, 9.6)
      .to(A, { s: 1, duration: 0.3, ease: 'power2.out' }, 9.6)
      .set(trail, { x: () => mid().x, y: () => mid().y, opacity: 1 }, 9.7)
      .to(A, { y: () => H() + 60, duration: 0.9, ease: 'power2.in' }, 9.85)
      .fromTo(trail, { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: 'power2.in', immediateRender: false }, 9.85)
      .to({}, { duration: 0.25 }, 10.75);

    // نقطة العنوان ↔ البطل (مش بـtl.set عشان الرجوع لفوق يرجّعها صح)
    let dotHidden = false;
    function swapDot() {
      const away = tl.time() > 0.02;
      if (away !== dotHidden && heroState.dotReady) { dotHidden = away; pdot.style.visibility = away ? 'hidden' : 'visible'; }
    }
    heroState.actor = actor; heroState.p0 = p0; heroState.tl = () => tl;

    // موبايل: نفس فكرة الرحلة — كل سحبة = جملة كاملة (الحيطة ← اتنسوا ← التصميم آخر خطوة ← الماسة تقع)
    // والمشهد بيتلعب لوحده لآخره. الكمبيوتر: scrub زي ما هو.
    const stepped = window.innerWidth < 900;
    const stops = [0, 3.1, 6.85, 9.3, tl.duration()];
    const LABELS = ['THE SAME', 'FORGOTTEN', 'THINK FIRST'];
    let stepIdx = -1, stepTw = null, stepUI = () => {};
    if (stepped) {
      tl.pause(0);
      const box = document.createElement('div');
      box.className = 'jw__stepper hero__stepper';
      box.setAttribute('aria-hidden', 'true');
      box.innerHTML = '<div class="jw__srow"><span class="jw__sline"><i></i></span>' + LABELS.map(() => '<i class="jw__sd"></i>').join('') + '</div><p class="jw__sname"></p>';
      pin.appendChild(box);
      const sds = $$('.jw__sd', box), line = $('.jw__sline i', box), name = $('.jw__sname', box);
      stepUI = (k) => { // k: 0 = العنوان · 1..3 = الجمل · 4 = الماسة بتقع
        const i = k - 1, on = i >= 0 && i < LABELS.length;
        sds.forEach((d, j) => { d.classList.toggle('is-done', on ? j < i : k > LABELS.length); d.classList.toggle('is-on', j === i); });
        line.style.transform = `scaleX(${on ? i / (LABELS.length - 1) : k > LABELS.length ? 1 : 0})`;
        name.innerHTML = on ? `<b>0${i + 1}</b> / 03 — ${LABELS[i]}` : k === 0 ? '<span class="jw__swipe">Swipe up</span>' : '';
        box.classList.toggle('is-off', k > LABELS.length);
      };
      stepUI(0);
    }
    const goStep = (k) => {
      if (k === stepIdx) return;
      stepIdx = k; stepUI(k);
      const to = stops[k], d = Math.abs(to - tl.time());
      if (stepTw) stepTw.kill();
      stepTw = tl.tweenTo(to, { duration: gsap.utils.clamp(0.45, 2.4, d * 0.42), ease: 'power1.inOut' });
    };
    ScrollTrigger.create({
      trigger: pin, pin: true, start: 'top top',
      end: () => '+=' + Math.round(stepped ? H() * 0.72 * (stops.length - 1) : H() * 3.1),
      ...(stepped
        ? { onUpdate: (self) => goStep(Math.round(self.progress * (stops.length - 1))) }
        : { scrub: 0.9, animation: tl, invalidateOnRefresh: true }),
      anticipatePin: 1,
      onRefresh: () => { if (stepped) { const now = tl.time(); tl.invalidate(); tl.time(0, true); tl.time(now, true); render(); swapDot(); } },
    });
    render();

    // الحيطة بتتحرك مع الماوس (عمق خفيف)
    if (fine) {
      const gx = gsap.quickTo(grid, 'x', { duration: 1.4, ease: 'athr' }), gy = gsap.quickTo(grid, 'y', { duration: 1.4, ease: 'athr' });
      pin.addEventListener('pointermove', (e) => { gx((e.clientX / window.innerWidth - 0.5) * -36); gy((e.clientY / window.innerHeight - 0.5) * -26); });
    }
  }

  /* ==========================================================================
     2 · THE JOURNEY — خط واحد، ٧ محطات، والماسة بتمشي عليه
     العالم SVG بوحدات ثابتة (المسافة بين المحطات 1000). الكاميرا proxy بتتحرك مع السكرول.
     ========================================================================== */
  function journey() {
    const sec = $('.s-journey'), pin = $('.jw', sec), svg = $('.jw__world', pin);
    if (!pin || !svg) return;
    const SP = 1000, N = 7, NAMES = ['CALL', 'AUDIT', 'MARKET', 'AUDIENCE', 'PLAN', 'FIX', 'CREATE'];
    const actor = $('[data-actor="jw"]', pin), trail = $('[data-trail="drop"]', pin), iris = $('.iris', pin);
    const intro = $('.jw__intro', pin), outro = $('.jw__outro', pin), after = $('.jw__after', pin), afterDot = $('[data-pdot="after"]', pin);
    const sunAfter = $('.sun--after', pin), sunVid = sunAfter && $('video', sunAfter);
    const count = $('.jw__count', pin), roll = $$('.jw__roll span', pin);
    const sts = $$('.st', pin);

    const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
    const L = (g, x1, y1, x2, y2, c = 'w-l') => mk('line', { x1, y1, x2, y2, class: c }, g);
    const P = (g, d, c = 'w-l') => mk('path', { d, class: c }, g);
    const C = (g, cx, cy, rr, c = 'w-l') => mk('circle', { cx, cy, r: rr, class: c }, g);
    const R = (g, x, y, w, h, rx, c = 'w-f') => mk('rect', { x, y, width: w, height: h, rx, class: c }, g);
    const T = (g, x, y, txt, c = 'w-t') => { const t = mk('text', { x, y, class: c }, g); t.textContent = txt; return t; };
    let stJ = null;
    const D = { x: 0, y: -2000, s: 1.35 };            // البطل في إحداثيات العالم
    const cam = { x: 0, k: 1, fx: 0.66, fy: 0.8 };    // الكاميرا
    const S = { on: 0, x: 0, y: 0, s: 1 };            // البطل في إحداثيات الشاشة (آخر المشهد)
    const TR = { x: -900 };                           // الأثر الأبيض على الخط
    const DR = { o: 0 };                              // خط الوقوع
    const IR = { s: 0 };                              // الإيريس

    // ---- العالم ----
    const world = mk('g', {}, svg);
    const base = L(world, -900, 0, -900, 0, 'w-base');
    const trace = L(world, -900, 0, -900, 0, 'w-trace');
    const stG = [], nodes = [];
    for (let i = 0; i < N; i++) stG.push(mk('g', { class: 'w-st', transform: `translate(${i * SP},0)` }, world));
    for (let i = 0; i < N; i++) {
      const g = mk('g', {}, world);
      const d = mk('rect', { x: -6, y: -6, width: 12, height: 12, transform: 'rotate(45)', class: 'w-node' }, g);
      const t = T(g, 0, 40, `0${i + 1}`, 'w-nlab'), nm = T(g, 0, 60, NAMES[i], 'w-nlab w-nname');
      t.setAttribute('text-anchor', 'middle'); nm.setAttribute('text-anchor', 'middle');
      nodes.push({ g, d, t, nm });
    }

    // ---- المحطات (كل واحدة بتبني مشهدها، وبترجع timeline + مكان الماسة) ----
    const build = [call, audit, market, audience, plan, fix, create].map((fn, i) => fn(stG[i], i * SP));

    function call(g, ox) {
      const cy = -285;
      const rings = [C(g, 0, cy, 62, 'w-l2'), C(g, 0, cy, 104, 'w-l2'), C(g, 0, cy, 146, 'w-l2')];
      const pg = mk('g', {}, g);
      [0, 1, 2].forEach(() => C(pg, 0, cy, 62, 'w-l2 w-pulse'));
      const eq = mk('g', { class: 'w-eq' }, g);
      const HS = [10, 22, 14, 34, 50, 26, 62, 40, 70, 48, 30, 56, 76, 42, 60, 34, 18, 44, 66, 36, 72, 52, 24, 58, 40, 28, 48, 20, 32, 14];
      const bars = HS.map((h, j) => L(eq, -232 + j * 16, -95 - h / 2, -232 + j * 16, -95 + h / 2, ''));
      const tags = [
        [T(g, -290, -400, 'GOALS'), L(g, -196, -404, -80, -352, 'w-l2')],
        [T(g, 128, -434, 'BUDGET'), L(g, 124, -430, 78, -358, 'w-l2')],
        [T(g, 128, -180, 'PAIN POINTS'), L(g, 124, -186, 78, -214, 'w-l2')],
      ];
      const rec = C(g, -228, -164, 4, 'w-solid'), lis = T(g, -214, -159, 'LISTENING');
      const tl = gsap.timeline()
        .fromTo(rings, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, stagger: 0.14, ease: 'athrInOut' }, 0)
        .fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 0.45, stagger: { amount: 0.5, from: 'center' }, ease: 'athr' }, 0.3)
        .fromTo(tags.map((t) => t[1]), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.45, stagger: 0.14 }, 0.6)
        .fromTo(tags.map((t) => t[0]), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.14 }, 0.7)
        .fromTo([rec, lis], { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.0);
      return { tl, role: { x: ox, y: cy } };
    }

    function audit(g, ox) {
      const top = -500, cardH = 200;
      const cards = [-285, -85, 115].map((x) => R(g, x, top, 170, cardH, 14));
      const inner = [];
      inner.push(C(g, -200, top + 82, 36), L(g, -236, top + 150, -164, top + 150, 'w-l2'));
      [[-61, 'w-solid'], [-18, 'w-mute'], [25, 'w-f']].forEach(([x, c]) => inner.push(R(g, x, top + 62, 36, 36, 6, c)));
      inner.push(L(g, -61, top + 128, 61, top + 128, 'w-l2'), L(g, -61, top + 146, 20, top + 146, 'w-l2'));
      [[143, top + 30], [201, top + 30], [143, top + 88], [201, top + 88]].forEach(([x, y]) => inner.push(R(g, x, y, 52, 52, 6, 'w-f')));
      const labs = [T(g, -270, top + 186, 'LOGO'), T(g, -70, top + 186, 'COLOUR'), T(g, 130, top + 186, 'POSTS')];
      const scan = L(g, -300, top - 10, 300, top - 10, 'w-l');
      const axis = L(g, 0, -232, 0, -82, 'w-l2');
      const rowsY = [-210, -177, -144, -111], RW = [182, 112, 222, 92], LW = [92, 192, 62, 142];
      const right = rowsY.map((y, j) => R(g, 0, y - 4, RW[j], 8, 0, 'w-solid'));
      const left = rowsY.map((y, j) => R(g, -LW[j], y - 4, LW[j], 8, 0, 'w-mute'));
      const wk = T(g, -290, -246, 'WEAKNESS'), stg = T(g, 290, -246, 'STRENGTH', 'w-t w-t--end');
      const tl = gsap.timeline()
        .fromTo(cards, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, 0)
        .fromTo([...inner, ...labs], { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.03 }, 0.25)
        .fromTo(scan, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.45)
        .fromTo(scan, { attr: { y1: top - 10, y2: top - 10 } }, { attr: { y1: top + cardH + 10, y2: top + cardH + 10 }, duration: 0.9, ease: 'none' }, 0.5)
        .to(D, { y: top + cardH + 10, duration: 0.9, ease: 'none' }, 0.5)
        .to(scan, { opacity: 0, duration: 0.2 }, 1.4)
        .fromTo(axis, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.35 }, 1.35)
        .fromTo(right, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.5, stagger: 0.08 }, 1.45)
        .fromTo(left, { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 0.5, stagger: 0.08 }, 1.45)
        .fromTo([wk, stg], { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.6)
        .to(D, { x: ox, y: -246, duration: 0.45, ease: 'athrInOut' }, 1.5);
      return { tl, role: { x: ox - 318, y: top - 10 } };
    }

    function market(g, ox) {
      const axes = P(g, 'M-290 -480 V-82 H290', 'w-l2');
      const r = rng(31), dots = [], cx = -130, cy = -205;
      while (dots.length < 26) {
        const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 96, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.9;
        if (dots.every(([px, py]) => Math.hypot(px - x, py - y) > 21)) dots.push([x, y]);
      }
      const dg = mk('g', {}, g);
      const dEls = dots.map(([x, y]) => C(dg, x.toFixed(1), y.toFixed(1), 8.5));
      const comp = T(g, -262, -330, 'COMPETITORS');
      const search = L(g, -112, -236, 132, -372, 'w-l2 w-dash');
      const gap = C(g, 170, -395, 54, 'w-l w-dash'), gapT = T(g, 236, -458, 'GAP');
      const tl = gsap.timeline()
        .fromTo(axes, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'athrInOut' }, 0)
        .fromTo(dEls, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, stagger: { amount: 0.55, from: 'random' } }, 0.15)
        .fromTo(comp, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.5)
        .to(dg, { opacity: 0.45, duration: 0.5 }, 0.9)
        .fromTo(search, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5 }, 0.75)
        .to(D, { x: ox + 170, y: -395, duration: 0.75, ease: 'athrInOut' }, 0.8)
        .fromTo(gap, { drawSVG: '0%', rotation: -90, transformOrigin: '50% 50%' }, { drawSVG: '100%', rotation: 0, duration: 0.6 }, 1.25)
        .fromTo(gapT, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4 }, 1.45);
      return { tl, role: { x: ox + cx, y: cy } };
    }

    function audience(g, ox) {
      const cy = -282;
      const rings = [C(g, 0, cy, 178, 'w-l2'), C(g, 0, cy, 120, 'w-l2'), C(g, 0, cy, 60, 'w-l')];
      const orbit = mk('g', {}, g);
      const r = rng(5), ppl = [];
      const add = (n, rad, c, jit) => { for (let j = 0; j < n; j++) { const a = (j / n) * Math.PI * 2 + r() * 0.5; const rr = rad + (r() - 0.5) * jit; ppl.push({ a, rr, c }); } };
      add(9, 178, 'w-l2', 8); add(7, 120, 'w-l', 8); add(5, 34, 'w-solid', 22);
      const els = ppl.map((p) => { const e = C(p.c === 'w-solid' ? g : orbit, (Math.cos(p.a) * p.rr).toFixed(1), (cy + Math.sin(p.a) * p.rr).toFixed(1), p.c === 'w-solid' ? 6.5 : 6, p.c); if (p.c !== 'w-solid') e.style.fill = '#111'; return { e, p }; });
      const lead = L(g, 104, -470, 30, -310, 'w-l2'), lab = T(g, 110, -478, 'CORE CUSTOMER');
      const spin = gsap.to(orbit, { rotation: 360, svgOrigin: `0 ${cy}`, duration: 70, repeat: -1, ease: 'none', paused: true });
      const tl = gsap.timeline()
        .fromTo(rings, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, stagger: 0.12, ease: 'athrInOut' }, 0);
      els.forEach(({ e, p }, j) => {
        const fx = Math.cos(p.a) * (p.rr + 210), fy = Math.sin(p.a) * (p.rr + 210);
        tl.fromTo(e, { x: fx, y: fy, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.6, ease: 'athrInOut' }, 0.3 + j * 0.03);
      });
      tl.fromTo(lead, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4 }, 1.15)
        .fromTo(lab, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.3);
      return { tl, role: { x: ox, y: cy }, live: (on) => (on ? spin.play() : spin.pause()) };
    }

    function plan(g, ox) {
      const ay = -112, x0 = -290, x1 = 290, step = (x1 - x0) / 11;
      const axis = L(g, x0, ay, x1, ay, 'w-l');
      const ticks = [], hot = [], months = 'JFMAMJJASOND'.split('');
      for (let j = 0; j < 12; j++) {
        const x = x0 + j * step;
        ticks.push(L(g, x, ay - 7, x, ay + 7, 'w-l2'));
        hot.push(mk('rect', { x: x - 4, y: ay - 4, width: 8, height: 8, transform: `rotate(45 ${x} ${ay})`, class: 'w-solid' }, g));
        const t = T(g, x, ay + 34, months[j], 'w-t w-t--mid'); ticks.push(t);
      }
      const bars = [
        R(g, x0, -410, 250, 14, 7, 'w-l'), R(g, x0 + 140, -362, 270, 14, 7, 'w-solid'),
        R(g, x0 + 230, -314, 350, 14, 7, 'w-l'), R(g, x0 + 330, -266, 250, 14, 7, 'w-l'),
      ];
      const ms = [[x0 + 250, -403], [x0 + 410, -355], [x1, -307]].map(([x, y]) => mk('rect', { x: x - 6, y: y - 6, width: 12, height: 12, transform: `rotate(45 ${x} ${y})`, class: 'w-l' }, g));
      const lab = T(g, x0, -462, '12 MONTHS'), lab2 = T(g, x1, -462, 'CONTENT PILLARS', 'w-t w-t--end');
      const tl = gsap.timeline()
        .fromTo(axis, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'athrInOut' }, 0)
        .fromTo(ticks, { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.015 }, 0.15)
        .fromTo([lab, lab2], { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.2)
        .fromTo(bars, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.55, stagger: 0.14, ease: 'athrInOut' }, 0.3)
        .fromTo(ms, { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.14 }, 0.75)
        .to(D, { x: ox + x1, duration: 1.1, ease: 'none' }, 0.55);
      hot.forEach((h, j) => tl.fromTo(h, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.12 }, 0.55 + (j / 11) * 1.1));
      return { tl, role: { x: ox + x0, y: ay } };
    }

    function fix(g, ox) {
      const phone = R(g, -125, -490, 250, 420, 30), notch = L(g, -22, -474, 22, -474, 'w-l2');
      const av = C(g, -80, -432, 20), name = L(g, -48, -440, 34, -440), handle = L(g, -48, -424, 4, -424, 'w-l2');
      const oldBio = L(g, -100, -390, 66, -390, 'w-l2 w-dash'), newBio = L(g, -100, -390, 86, -390);
      const bio2 = L(g, -100, -374, 40, -374, 'w-l2');
      const hl = [-84, -42, 0, 42, 84].map((x) => C(g, x, -342, 13, 'w-l2'));
      const tiles = [], r = rng(11), TS = 68, G = 6, gx = -105, gy = -318;
      for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
        const t = R(g, gx + col * (TS + G), gy + row * (TS + G), TS, TS, 6);
        tiles.push({ t, dx: (r() - 0.5) * 30, dy: (r() - 0.5) * 26, rot: (r() - 0.5) * 14, sc: 0.8 + r() * 0.3, cx: gx + col * (TS + G) + TS / 2, cy: gy + row * (TS + G) + TS / 2, tone: ['#2c2925', '#3d3934', '#1B1B1B', '#47423c'][Math.floor(r() * 4)] });
      }
      const checks = [0, 4, 8].map((j) => P(g, `M${tiles[j].cx - 11} ${tiles[j].cy} l7 7 l14 -15`, 'w-l'));
      const labs = [['BIO', -390], ['HIGHLIGHTS', -342], ['GRID', -210]].map(([s, y]) => [L(g, 132, y, 148, y, 'w-l2'), T(g, 156, y + 5, s)]);
      const tl = gsap.timeline()
        .fromTo(phone, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45 }, 0)
        .fromTo([notch, av, name, handle, oldBio, bio2], { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.04 }, 0.15)
        .fromTo(hl.filter((_, j) => j !== 1 && j !== 3), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.2)
        .fromTo(hl.filter((_, j) => j === 1 || j === 3), { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.1 }, 0.7)
        .fromTo(newBio, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4 }, 0.45)
        .to(oldBio, { opacity: 0, duration: 0.3 }, 0.6)
        .to(hl, { attr: { class: 'w-l' }, duration: 0.01 }, 0.95)
        .fromTo(labs.flat(), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05 }, 0.3);
      tiles.forEach(({ t, dx, dy, rot, sc, tone, cx, cy }, j) => {
        tl.fromTo(t, { x: dx, y: dy, rotation: rot, scale: sc, svgOrigin: `${cx} ${cy}`, fill: tone, opacity: 0.9 }, { x: 0, y: 0, rotation: 0, scale: 1, fill: '#1B1B1B', opacity: 1, duration: 0.42, ease: 'athrInOut' }, 0.55 + j * 0.08);
      });
      [[0, 0.6], [4, 0.85], [8, 1.1]].forEach(([j, at]) => tl.to(D, { x: ox + tiles[j].cx, y: tiles[j].cy, duration: 0.22, ease: 'athrInOut' }, at));
      tl.fromTo(checks, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.3, stagger: 0.14 }, 1.3);
      tl.set(tiles.map((x) => x.t), { opacity: 0.35 }, 1.29).set(checks, { opacity: 1 }, 1.29);
      return { tl, role: { x: ox + tiles[0].cx, y: tiles[0].cy } };
    }

    function create(g, ox) {
      const fr = (x, y, w, h) => {
        const gg = mk('g', {}, g);
        R(gg, x, y, w, h, 16);
        L(gg, x + 14, y + 20, x + w * 0.45, y + 20, 'w-l2');
        R(gg, x + 14, y + 36, w - 28, h * 0.5, 8, 'w-f');
        L(gg, x + 14, y + h - 44, x + w - 30, y + h - 44, 'w-l2');
        L(gg, x + 14, y + h - 28, x + w * 0.5, y + h - 28, 'w-l2');
        return gg;
      };
      const left = fr(-262, -438, 124, 220), right = fr(138, -438, 124, 220), mid = fr(-80, -480, 160, 284);
      const track = L(g, -60, -214, 60, -214, 'w-l2'), prog = L(g, -60, -214, 60, -214, 'w-l w-prog');
      const labs = [T(g, -262, -168, 'DESIGNS'), T(g, 0, -168, 'REELS', 'w-t w-t--mid'), T(g, 262, -168, 'SHORTS', 'w-t w-t--end')];
      const tl = gsap.timeline()
        .fromTo(mid, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5 }, 0)
        .fromTo(left, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.6, ease: 'athrInOut' }, 0.25)
        .fromTo(right, { opacity: 0, x: -120 }, { opacity: 1, x: 0, duration: 0.6, ease: 'athrInOut' }, 0.25)
        .fromTo([track, prog], { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7)
        .fromTo(labs, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, 0.8)
        .to(D, { y: -338, duration: 0.5, ease: 'athrInOut' }, 0.3);
      return { tl, role: { x: ox, y: -300 } };
    }

    // ---- الكاميرا والمقاسات ----
    const Lay = {};
    const layout = () => {
      const W = pin.clientWidth, H = pin.clientHeight;
      Lay.W = W; Lay.H = H;
      if (W >= 900) { Lay.k = gsap.utils.clamp(0.5, 1.25, Math.min((W * 0.5) / 640, (H * 0.56) / 520)); Lay.fx = 0.67; Lay.fy = 0.82; }
      else {
        // (موبايل: الرسمة بتاخد المساحة اللي فاضلة تحت الكلام بالظبط، والخريطة تحت)
        const list = $('.jw__stations', pin);
        const textBottom = (list ? list.offsetTop : H * 0.14) + Math.max(0, ...sts.map((x) => x.offsetHeight)) + 26;
        Lay.fy = 0.76; Lay.fx = 0.5;
        Lay.k = Math.min((W * 0.88) / 620, Math.max(H * Lay.fy - textBottom, 110) / 500);
      }
      Lay.kz = (W * (W >= 900 ? 0.82 : 0.9)) / (SP * (N - 1) + 760);
      Lay.fyz = W >= 900 ? 0.64 : 0.62;
      Lay.cover = (Math.SQRT2 * (W + H)) / 20 + 2;
      Lay.k = Math.max(Lay.k || 0, 0.05); Lay.kz = Math.max(Lay.kz || 0, 0.01);
    };
    layout();
    cam.k = Lay.k; cam.fx = Lay.fx; cam.fy = Lay.fy;

    const scr = (x, y) => ({ x: cam.fx * Lay.W - cam.x * cam.k + x * cam.k, y: cam.fy * Lay.H + y * cam.k });
    let lastK = -1;
    const render = () => {
      if (!(cam.k > 0) || !Lay.W) return; // (المقاسات لسه صفر وقت تغيير حجم الشاشة)
      const tx = cam.fx * Lay.W - cam.x * cam.k, ty = cam.fy * Lay.H;
      world.setAttribute('transform', `translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${cam.k.toFixed(4)})`);
      if (Math.abs(cam.k - lastK) > 0.0005) {
        lastK = cam.k;
        svg.style.setProperty('--sw', Math.max(1, 0.75 / cam.k).toFixed(3));
        nodes.forEach((n, i) => n.g.setAttribute('transform', `translate(${i * SP},0) scale(${(1 / cam.k).toFixed(4)})`));
      }
      base.setAttribute('x2', BS.x2);
      trace.setAttribute('x2', TR.x.toFixed(1));
      const p = S.on ? S : { ...scr(D.x, D.y), s: D.s };
      actor.style.transform = `translate(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px) scale(${p.s.toFixed(3)})`;
      actor.style.opacity = D.y < -1500 && !S.on ? 0 : 1;
      if (DR.o > 0) { const q = scr(D.x, D.y); trail.style.opacity = DR.o; trail.style.transform = `translate(${q.x.toFixed(1)}px,0) scaleY(${Math.max(0, q.y / Lay.H).toFixed(4)})`; }
      else trail.style.opacity = 0;
      if (IR.s > 0) { const q = scr(D.x, D.y); iris.style.transform = `translate(${q.x.toFixed(1)}px,${q.y.toFixed(1)}px) rotate(45deg) scale(${IR.s.toFixed(3)})`; }
      else iris.style.transform = 'scale(0)';
    };
    const BS = { x2: -900 };

    // ---- الـtimeline الكبيرة ----
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' }, onUpdate: () => { render(); tick(); } });
    const arrive = [], holds = [];
    // الكاميرا من المقاسات (بتتحسب تاني مع كل resize)
    // (أول محطة بتبدأ في نص الشاشة — نفس مكان خط الهيرو — وبعدين الكاميرا تروح يمين)
    tl.fromTo(cam, { x: 0, k: () => Lay.k, fx: 0.5, fy: () => Lay.fy }, { x: 0, k: () => Lay.k, fx: 0.5, fy: () => Lay.fy, duration: 0.001 }, 0)
      .to(cam, { fx: () => Lay.fx, duration: 0.8, ease: 'athrInOut' }, 1.45);
    // المقدمة: الخط يترسم، والماسة تقع على أول محطة
    tl.fromTo(BS, { x2: -900 }, { x2: SP * (N - 1) + 900, duration: 1.4, ease: 'athrInOut' }, 0)
      .fromTo(nodes.map((n) => n.g), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.08 }, 0.3)
      .fromTo(D, { x: 0, y: () => -(cam.fy * Lay.H) / Lay.k - 40 }, { y: 0, duration: 0.8, ease: 'power2.in' }, 0.7)
      .fromTo(DR, { o: 0 }, { o: 1, duration: 0.05 }, 0.7)
      .to(DR, { o: 0, duration: 0.4 }, 1.55)
      .fromTo(intro.children, { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 0.5, stagger: 0.06, ease: 'power2.in', immediateRender: false }, desk() ? 1.2 : 0.35)
      .fromTo(TR, { x: -900 }, { x: 0, duration: 1.2, ease: 'athrInOut' }, 0.3);
    let t = 1.7;
    build.forEach((b, i) => {
      if (i > 0) {
        // تمشي على الخط للمحطة الجاية — والخط وراها يبيض
        tl.to(D, { y: 0, x: (i - 1) * SP, duration: 0.4, ease: 'power2.in' }, t)
          .to(stG[i - 1], { opacity: 0, duration: 0.5 }, t + 0.1)
          .to(D, { x: i * SP, duration: 1, ease: 'athrInOut' }, t + 0.4)
          .to(TR, { x: i * SP, duration: 1, ease: 'athrInOut' }, t + 0.4)
          .to(cam, { x: i * SP, duration: 1.1, ease: 'athrInOut' }, t + 0.45);
        t += 1.45;
      }
      arrive[i] = t;
      // نطة جوّه المشهد
      tl.to(D, { x: b.role.x, duration: 0.5, ease: 'athrInOut' }, t)
        .to(D, { y: b.role.y, duration: 0.5, ease: 'power3.out' }, t);
      tl.add(b.tl, t + 0.25);
      t += 0.25 + b.tl.duration();
      holds[i] = t + 0.25;
      t += 0.6;
    });
    // زوم آوت: الرحلة كلها خريطة واحدة
    const zAt = t;
    tl.to(D, { x: (N - 1) * SP, y: 0, duration: 0.45, ease: 'power2.in' }, zAt)
      .to(TR, { x: (N - 1) * SP, duration: 0.3 }, zAt)
      .to(cam, { x: ((N - 1) * SP) / 2, k: () => Lay.kz, fy: () => Lay.fyz, fx: 0.5, duration: 1.7, ease: 'athrInOut' }, zAt + 0.3)
      .to(stG, { opacity: 1, duration: 0.6, stagger: 0.05 }, zAt + 0.6)
      .to($$('.w-t', svg), { opacity: 0, duration: 0.4 }, zAt + 0.3)
      .to(nodes.map((n) => n.nm), { opacity: () => (desk() ? 1 : 0), duration: 0.4 }, zAt + 0.6)
      .to(D, { s: 1.6, duration: 0.6 }, zAt + 1.2)
      .set(outro, { visibility: 'visible' }, zAt + 1.4)
      .fromTo(outro.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'athr' }, zAt + 1.4);
    const zHold = zAt + 2.45;
    // الإيريس: الماسة تكبر وتقلب الدنيا Warm White
    const iAt = zHold + 0.5;
    const pT = () => { const o = offsetIn(afterDot, pin); return { x: o.x, y: o.y, s: o.w / DM }; };
    tl.to(outro.children, { opacity: 0, y: -30, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, iAt)
      .set(outro, { visibility: 'hidden' }, iAt + 0.5)
      .to(D, { s: 2.4, duration: 0.4, ease: 'power2.out' }, iAt)
      .fromTo(IR, { s: 0 }, { s: () => Lay.cover, duration: 1.15, ease: 'power3.in' }, iAt + 0.3)
      .set(S, { on: 1 }, iAt + 1.45)
      .fromTo(S, { x: () => scr(D.x, D.y).x, y: () => scr(D.x, D.y).y, s: 2.4 }, { x: () => pT().x, y: () => pT().y, s: () => pT().s, duration: 0.9, ease: 'athrInOut', immediateRender: false }, iAt + 1.45)
      .fromTo(sunAfter, { opacity: 0 }, { opacity: 0.78, duration: 0.8, ease: 'power1.inOut' }, iAt + 1.35)
      .set(after, { visibility: 'visible' }, iAt + 1.5)
      .fromTo(after.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.14, ease: 'athr' }, iAt + 1.5)
      .to({}, { duration: 0.6 }, iAt + 2.4);
    const lightAt = iAt + 1.3;

    // ---- خريطة المحطات تحت (موبايل): ٧ ماسات على خط — الحالية حمرا، اللي خلصت بيضا ----
    const stepper = document.createElement('div');
    stepper.className = 'jw__stepper';
    stepper.setAttribute('aria-hidden', 'true');
    stepper.innerHTML = '<div class="jw__srow"><span class="jw__sline"><i></i></span>' + NAMES.map(() => '<i class="jw__sd"></i>').join('') + '</div><p class="jw__sname"></p>';
    pin.appendChild(stepper);
    const sds = $$('.jw__sd', stepper), sline = $('.jw__sline i', stepper), sname = $('.jw__sname', stepper);
    const stepUI = (i) => {
      const on = i >= 0 && i < N;
      sds.forEach((d, j) => { d.classList.toggle('is-done', on ? j < i : i >= N); d.classList.toggle('is-on', j === i); });
      sline.style.transform = `scaleX(${on ? i / (N - 1) : i >= N ? 1 : 0})`;
      sname.innerHTML = on ? `<b>${String(i + 1).padStart(2, '0')}</b> / 07 — ${NAMES[i]}` : i < 0 ? '<span class="jw__swipe">Swipe up</span> · 7 stations' : '';
      stepper.classList.toggle('is-off', i >= N);
    };

    // ---- الكلام على الشمال: بيتبدّل لما المحطة تتغيّر ----
    const splits = sts.map((s) => SplitText.create($('.st__t', s), { type: 'words,chars', mask: 'words' }).chars);
    const rests = sts.map((s) => [$('.ar', s), ...$$('.st__outs li', s)]);
    gsap.set(sts, { visibility: 'hidden' });
    let cur = -2;
    const show = (i) => {
      if (i === cur) return;
      const prev = cur; cur = i;
      sts.forEach((s, j) => {
        if (j === i || j === prev) return;
        gsap.killTweensOf([...splits[j], ...rests[j]]);
        gsap.set(s, { visibility: 'hidden' });
      });
      if (prev >= 0 && prev < N) {
        gsap.to(splits[prev], { yPercent: -115, duration: 0.5, stagger: 0.01, ease: 'power2.in', overwrite: true });
        gsap.to(rests[prev], { opacity: 0, y: -10, duration: 0.35, overwrite: true, onComplete: () => { if (cur !== prev) gsap.set(sts[prev], { visibility: 'hidden' }); } });
      }
      const on = i >= 0 && i < N;
      gsap.to(count, { opacity: on ? 1 : 0, duration: 0.5, overwrite: 'auto' });
      if (on) {
        gsap.set(sts[i], { visibility: 'visible' });
        gsap.fromTo(splits[i], { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.022, delay: prev >= 0 && prev < N ? 0.25 : 0, overwrite: true });
        gsap.fromTo(rests[i], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, delay: prev >= 0 && prev < N ? 0.4 : 0.15, overwrite: true });
        roll.forEach((r) => r.style.setProperty('--i', i));
      }
      nodes.forEach((n, j) => { const done = on ? j <= i : i >= N; [n.d, n.t, n.nm].forEach((e) => e.classList.toggle('is-done', done)); });
      build.forEach((b, j) => { stG[j].classList.toggle('is-live', j === i); if (b.live) b.live(j === i); });
      stepUI(i);
    };
    const indexAt = (time) => {
      if (time < arrive[0] - 0.2) return -1;
      if (time >= zAt + 0.2) return N;
      let c = 0; for (let i = 1; i < N; i++) if (time >= arrive[i] - 0.35) c = i;
      return c;
    };
    function tick() {
      show(indexAt(tl.time()));
      svg.classList.toggle('is-zoom', tl.time() >= zAt + 0.3);
      const light = tl.time() >= lightAt;
      if (light !== tick.light && stJ && stJ.isActive) { tick.light = light; setTheme(light ? 'light' : 'dark'); }
      if (sunVid) sunPlay(sunVid, light && stJ && stJ.isActive);
    }

    // سناب على المحطات (في اتجاه السكرول)
    const stops = [0, ...holds, zHold, tl.duration()];
    const marks = stops.map((m) => m / tl.duration());
    // موبايل: كل سحبة = محطة كاملة. السكرول بيختار المحطة، والرسمة بتتلعب لوحدها من أولها لآخرها
    // (مفيش رسمة بتقف في النص، ومفيش سناب بيتخانق مع الصباع)
    const stepped = window.innerWidth < 900;
    let stepIdx = -1, stepTw = null;
    const goStep = (k) => {
      if (k === stepIdx) return;
      stepIdx = k;
      const to = stops[k], d = Math.abs(to - tl.time());
      if (stepTw) stepTw.kill();
      stepTw = tl.tweenTo(to, { duration: gsap.utils.clamp(0.45, 2.6, d * 0.42), ease: 'power1.inOut' });
    };
    stJ = ScrollTrigger.create({
      trigger: pin, pin: true, start: 'top top',
      end: () => '+=' + Math.round(stepped ? Lay.H * 0.72 * (stops.length - 1) : tl.duration() * Lay.H * 0.2),
      ...(stepped
        ? { onUpdate: (self) => goStep(Math.round(self.progress * (stops.length - 1))) }
        : { scrub: 0.8, animation: tl, invalidateOnRefresh: true }),
      anticipatePin: 1,
      onRefreshInit: () => { layout(); },
      onRefresh: () => {
        lastK = -1;
        if (stepped) { const now = tl.time(); tl.invalidate(); tl.time(0, true); tl.time(now, true); tick(); }
        render();
      },
      onToggle: (self) => { if (self.isActive) { tick.light = tl.time() >= lightAt; setTheme(tick.light ? 'light' : 'dark'); } if (sunVid) sunPlay(sunVid, self.isActive && tl.time() >= lightAt); },
    });
    if (!stepped) addSnap(stJ, () => marks);
    show(-1);
    render();
  }

  /* ==========================================================================
     3 · THE WORK — عدسة أثر: رمادي برّه، ملوّن جوّه
     ========================================================================== */
  function work() {
    const sec = $('.s-work'), pin = $('.wk', sec);
    if (!pin) return;
    const lens = $('.wk__lens', pin), col = $('[data-col]', lens), frame = $('.wk__frame', lens);
    const items = $$('.wk__it', col), N = items.length;
    $$('img', col).forEach((im) => { im.loading = 'eager'; });
    col.classList.add('wk__col--base');
    const clip = document.createElement('div');
    clip.className = 'wk__clip';
    const colC = col.cloneNode(true);
    colC.classList.remove('wk__col--base'); colC.removeAttribute('data-col'); colC.setAttribute('aria-hidden', 'true');
    $$('img', colC).forEach((im) => { im.alt = ''; });
    clip.appendChild(colC);
    lens.insertBefore(clip, frame);
    const lis = $$('.wk__index li', pin);
    const nowEl = $('[data-wk-now]', pin), nameEl = $('[data-wk-name]', pin), kindEl = $('[data-wk-kind]', pin);

    const step = () => items[0].offsetHeight + parseFloat(getComputedStyle(col).rowGap || 28);
    const tl = gsap.timeline({ defaults: { ease: 'none' } })
      .fromTo([col, colC], { y: 0 }, { y: () => -step() * (N - 1), duration: 1 });
    let cur = -1;
    const set = (i) => {
      if (i === cur) return;
      cur = i;
      lis.forEach((li, j) => li.classList.toggle('is-on', j === i));
      const it = items[i];
      nowEl.textContent = String(i + 1).padStart(2, '0');
      gsap.fromTo([nameEl, kindEl], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, overwrite: 'auto', onStart: () => { nameEl.textContent = it.dataset.name; kindEl.textContent = it.dataset.kind; } });
    };
    const st = ScrollTrigger.create({
      trigger: pin, pin: true, start: 'top top', end: () => '+=' + Math.round(pin.clientHeight * (desk() ? 0.24 : 0.2) * (N - 1)),
      scrub: 0.7, animation: tl, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: (self) => set(Math.round(self.progress * (N - 1))),
    });
    addSnap(st, () => items.map((_, i) => i / (N - 1)));
    set(0);
    $('.wk__index', pin).addEventListener('click', (e) => {
      const b = e.target.closest('[data-go]');
      if (!b) return;
      scrollToY(st.start + (st.end - st.start) * (Number(b.dataset.go) / (N - 1)), 1.2);
    });
    // دخول: الإطار والعنوان
    gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 70%', once: true } })
      .fromTo($$('.wk__head > *', pin), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 0)
      .fromTo(frame, { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'athrInOut' }, 0.1)
      .fromTo($$('.wk__index li, .wk__meta, .wk__legend', pin), { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.02 }, 0.4);
  }

  /* ---------- 4 · Systems ---------- */
  function systems() {
    const sec = $('.s-systems');
    if (!sec) return;
    gsap.fromTo($('.systems__rule', sec), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'athrInOut', scrollTrigger: { trigger: sec, start: 'top 85%', once: true } });
    $$('[data-chars]', sec).forEach((el) => SplitText.create(el, {
      type: 'lines,words,chars', mask: 'lines', charsClass: 'ch', autoSplit: true,
      onSplit: (self) => gsap.fromTo(self.chars, { yPercent: 118 }, { yPercent: 0, duration: 1.2, stagger: 0.02, scrollTrigger: { trigger: el, start: 'top 86%', once: true } }),
    }));
    const frames = $$('.sys__frame', sec);
    gsap.fromTo(frames, { clipPath: 'inset(100% 0% 0% 0% round 16px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.4, stagger: 0.09, ease: 'athrInOut',
      scrollTrigger: { trigger: '[data-sys]', start: 'top 85%', once: true },
      onComplete: () => gsap.set(frames, { clearProps: 'clipPath' }),
    });
    gsap.fromTo($$('.sys__frame img', sec), { yPercent: 18 }, {
      yPercent: 0, duration: 1.6, stagger: 0.09, scrollTrigger: { trigger: '[data-sys]', start: 'top 85%', once: true },
      onComplete: function () { gsap.set(this.targets(), { clearProps: 'transform' }); },
    });
  }

  /* ---------- 5 · النهاية: نفس الافتتاحية، والماسة تقع نقطة الجملة ---------- */
  function cta() {
    const sec = $('.s-cta');
    if (!sec) return;
    const pdot = $('[data-pdot="cta"]', sec), a = $('[data-actor="cta"]', sec);
    const p = () => { const o = offsetIn(pdot, sec); return { x: o.x, y: o.y, s: o.w / DM }; };
    const tl = gsap.timeline({ paused: true })
      .fromTo($('.anchor-line', sec), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'athrInOut' }, 0)
      .fromTo($$('.ln', sec), { yPercent: 110, y: 0 }, { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.35)
      .fromTo(a, { x: () => p().x, y: () => p().y - window.innerHeight * 0.6, scale: () => p().s, opacity: 1 }, { y: () => p().y, duration: 0.8, ease: 'power3.in', immediateRender: false }, 1.0)
      .add(() => { pdot.style.visibility = 'visible'; a.style.opacity = 0; }, 1.8)
      .fromTo($$('.cta__row > *', sec), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 1.2);
    ScrollTrigger.create({ trigger: sec, start: 'top 62%', once: true, onEnter: () => tl.play() });
    const sv = $('.sun--cta video', sec);
    if (sv) ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onToggle: (self) => sunPlay(sv, self.isActive) });
  }

  /* ---------- الفوتر: .ATHR عملاقة، والماسة آخر حاجة ---------- */
  function giant() {
    const g = $('.foot__giant');
    if (!g) return;
    const letters = $$('.fg:not(.fg--dot)', g), dm = $('.fg__dm', g);
    gsap.timeline({ scrollTrigger: { trigger: g, start: 'top 92%', once: true } })
      .fromTo(letters, { yPercent: 100 }, { yPercent: 0, duration: 1.4, stagger: 0.07, ease: 'athrInOut' }, 0)
      .fromTo(dm, { y: () => -g.offsetHeight, opacity: 1 }, { y: 0, duration: 0.8, ease: 'power3.in' }, 0.6);
  }

  /* ---------- الفيديو: يشتغل بس وهو باين (ومن غير reduced-motion أصلًا مش هنوصل هنا) ---------- */
  function sunPlay(v, on) {
    if (on) { if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); } if (v.paused) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } }
    else if (!v.paused) v.pause();
  }

  /* ---------- Nav + الفصول + الثيم ---------- */
  function setTheme(t) { root.classList.toggle('on-light', t === 'light'); }
  function nav() {
    const el = $('[data-nav]');
    if (!el) return;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => el.classList.toggle('is-hidden', self.scroll() > 600 && self.direction === 1),
    });
  }
  function chapters() {
    const roll = $$('.chap__roll span');
    $$('[data-theme]').forEach((s) => {
      const theme = s.dataset.theme, ch = s.dataset.chap;
      ScrollTrigger.create({
        trigger: s, start: 'top 50%', end: 'bottom 50%',
        onToggle: (self) => {
          if (!self.isActive) return;
          if (!s.classList.contains('s-journey')) setTheme(theme);
          if (ch !== undefined) roll.forEach((r) => r.style.setProperty('--i', ch));
          $('.chap').classList.toggle('is-off', s.tagName === 'FOOTER');
        },
      });
    });
  }

  /* ---------- مؤشر الماوس ---------- */
  function cursor() {
    const c = $('.cursor');
    if (!c || !fine) return;
    root.classList.add('has-cursor');
    const label = $('.cursor__label', c);
    const xTo = gsap.quickTo(c, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(c, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
    const size = (s, text) => {
      gsap.to(c, { width: s, height: s, margin: -s / 2, duration: 0.6, ease: 'athr', overwrite: 'auto' });
      label.textContent = text || '';
      gsap.to(label, { opacity: text ? 1 : 0, scale: text ? 1 : 0.4, duration: 0.4, overwrite: 'auto' });
    };
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor], a, button');
      if (!t) return;
      if (t.hasAttribute('data-cursor')) size(t.dataset.cursor ? 84 : 0, t.dataset.cursor);
      else size(40);
    });
    document.addEventListener('pointerout', (e) => {
      const t = e.target.closest('[data-cursor], a, button');
      if (t && !t.contains(e.relatedTarget)) size(8);
    });
    root.addEventListener('pointerleave', () => gsap.to(c, { opacity: 0, duration: 0.3 }));
    root.addEventListener('pointerenter', () => gsap.to(c, { opacity: 1, duration: 0.3 }));
  }

  /* ---------- زرار مغناطيسي ---------- */
  function magnet() {
    if (!fine) return;
    $$('[data-magnet]').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.7, ease: 'athr' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.7, ease: 'athr' });
      const zone = btn.parentElement;
      zone.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const near = Math.abs(dx) < r.width / 2 + 70 && Math.abs(dy) < r.height / 2 + 60;
        xTo(near ? dx * 0.22 : 0); yTo(near ? dy * 0.3 : 0);
      });
      zone.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  // ساعة القاهرة
  function clock() {
    const els = $$('[data-clock]');
    if (!els.length) return;
    let fmt;
    try { fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' }); } catch (e) { return; }
    const tick = () => { const v = fmt.format(new Date()); els.forEach((e) => { e.textContent = v; }); };
    tick();
    setInterval(tick, 20000);
  }
})();
