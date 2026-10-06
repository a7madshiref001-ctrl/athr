/* ==========================================================================
   .ATHR — site.js · v4 — «رحلة العميل»
   الفكرة: الرحلة = خط بيتحرك بين ٧ محطات. كل محطة مشهد: صورة بتتكشف + جرافيك بيترسم.
   الحركة واثقة وبطيئة: مفيش bounce/elastic/glitch (§9.12).
   الإنجليزي يتقسم حروف · العربي كلمات/سطور بس (التقسيم لحروف بيكسر اتصال الحروف).
   ========================================================================== */
(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ok = window.gsap && window.ScrollTrigger && window.SplitText && window.CustomEase;

  const unlockIntro = () => { root.classList.remove('intro'); try { sessionStorage.setItem('athr-intro', '1'); } catch (e) {} };
  const failsafe = setTimeout(() => { root.classList.add('motion-off'); unlockIntro(); }, 4000);

  buildEq();
  buildRail();
  clock();
  galleryNames();

  if (!ok || reduce) {
    clearTimeout(failsafe);
    root.classList.add('motion-off');
    unlockIntro();
    $$('.stp').forEach((s) => s.classList.add('is-active'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, ...(window.DrawSVGPlugin ? [DrawSVGPlugin] : []));
  CustomEase.create('athr', '0.16,1,0.3,1');
  CustomEase.create('athrInOut', '0.76,0,0.24,1');
  gsap.defaults({ ease: 'athr', duration: 1 });
  const hasDraw = !!window.DrawSVGPlugin;

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToY = (y, dur = 1.6, done) => {
    if (lenis) lenis.scrollTo(y, { duration: dur, easing: (t) => 1 - Math.pow(1 - t, 4), onComplete: () => done && setTimeout(done, 200) });
    else { window.scrollTo({ top: y, behavior: 'smooth' }); if (done) setTimeout(done, dur * 1000 + 300); }
  };
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    scrollToY(target === 0 ? 0 : target.getBoundingClientRect().top + scrollY);
  }));

  const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  ready.then(() => {
    clearTimeout(failsafe);
    const intro = root.classList.contains('intro');
    if (intro && lenis) lenis.stop();
    cursor();
    nav();
    headings();
    fades();
    statement();
    journey();
    gallery();
    systems();
    reveals();
    finale();
    giant();
    magnet();
    tweak();
    heroScroll();
    richness();
    const go = () => { heroIntro(); requestAnimationFrame(() => ScrollTrigger.refresh()); };
    if (intro) loader(go); else go();
  });

  /* ---------- 0 · المقدمة: .ATHR + المحطات السبعة على الخط، وبعدين الستارة ---------- */
  function loader(done) {
    const el = $('.loader');
    if (!el) { unlockIntro(); done(); return; }
    const word = SplitText.create($('.loader__word', el), { type: 'chars' });
    const parts = [$('.loader__dot', el), ...word.chars];
    const steps = $$('.loader__steps span', el);
    const tl = gsap.timeline({ onComplete: () => { unlockIntro(); el.remove(); if (lenis) lenis.start(); } });
    tl.fromTo(parts, { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.1)
      .fromTo(el, { '--lp': 0 }, { '--lp': 1, duration: 1.5, ease: 'athrInOut' }, 0.2)
      .fromTo(steps, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.16 }, 0.3)
      .to(steps, { opacity: 0, duration: 0.4, stagger: 0.03 }, 1.65)
      .to(parts, { yPercent: -115, duration: 0.8, stagger: 0.04, ease: 'athrInOut' }, 1.7)
      .fromTo(el, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'athrInOut' }, 2.0)
      .add(done, 2.4);
  }

  /* ---------- 1 · افتتاحية الهيرو: الخط يترسم ← الصورة تنفرد من عنده ← العنوان يطلع ---------- */
  function opening(scope) {
    const line = $('.anchor-line', scope), dms = $$('.anchor-dms .dm', scope), lns = $$('.ln', scope);
    const tl = gsap.timeline();
    if (line) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'athrInOut' }, 0);
    if (dms.length) tl.fromTo(dms, { opacity: 0, y: -24, scale: 0.3, rotation: 45 }, { opacity: 1, y: 0, scale: 1, rotation: 45, duration: 0.9, stagger: 0.09 }, 0.75);
    if (lns.length) tl.fromTo(lns, { yPercent: 110, y: 0 }, { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.45);
    return tl;
  }
  function heroIntro() {
    const hero = $('.hero');
    gsap.to('.nav', { opacity: 1, duration: 0.8, delay: hero ? 1.1 : 0 });
    if (!hero) return;
    const tl = opening(hero);
    const media = $('[data-hero-media]');
    if (media) {
      tl.fromTo(media, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'athrInOut' }, 0.55)
        .fromTo($('img', media), { scale: 1.3 }, { scale: 1, duration: 2.4, ease: 'athr' }, 0.55);
    }
    tl.fromTo('[data-hero-fade]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 1.05);
  }
  // الهيرو بيبعد بعمق وانت نازل
  function heroScroll() {
    const body = $('[data-hero-body]'), media = $('[data-hero-media]');
    const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    if (body) gsap.to(body, { yPercent: -22, opacity: 0.15, ease: 'none', scrollTrigger: st });
    if (media) gsap.to($('img', media), { yPercent: 12, ease: 'none', scrollTrigger: { ...st } });
    if (media) gsap.to(media, { yPercent: -8, ease: 'none', scrollTrigger: { ...st } });
  }

  /* ---------- Nav ---------- */
  function nav() {
    const el = $('[data-nav]');
    if (!el) return;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        el.classList.toggle('is-solid', y > 40);
        el.classList.toggle('is-hidden', y > 600 && self.direction === 1);
      },
    });
  }

  /* ---------- عناوين الأقسام ---------- */
  function headings() {
    $$('.sec-anchor').forEach((a) => gsap.fromTo(a, { scaleX: 0 }, {
      scaleX: 1, duration: 1.3, ease: 'athrInOut', scrollTrigger: { trigger: a, start: 'top 88%', once: true },
    }));
    $$('[data-chars]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines,words,chars', mask: 'lines', linesClass: 'ln', charsClass: 'ch', autoSplit: true,
        onSplit: (self) => gsap.fromTo(self.chars, { yPercent: 118 }, {
          yPercent: 0, duration: 1.2, stagger: 0.024,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        }),
      });
    });
  }
  function fades() {
    $$('[data-fade]').forEach((el) => gsap.fromTo(el, { opacity: 0, y: 22 }, {
      opacity: 1, y: 0, duration: 1.2, scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    }));
  }

  /* ---------- الجملة: الكلمات بتنوّر مع السكرول ---------- */
  function statement() {
    const el = $('[data-words]');
    if (!el) return;
    const split = SplitText.create(el, { type: 'words', wordsClass: 'w' });
    gsap.fromTo(split.words, { opacity: 0.08, filter: 'blur(8px)', yPercent: 20 }, {
      opacity: 1, filter: 'blur(0px)', yPercent: 0, ease: 'none', stagger: 0.14,
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.8 },
    });
  }

  /* ==========================================================================
     2 · الرحلة — اللحظة الأساسية
     كمبيوتر: مرحلة مثبّتة، كل سكرول = محطة. الصورة القديمة تتمسح لفوق، والجديدة تتكشف من تحت،
     العنوان يطلع حرف حرف، والجرافيك يترسم. الخط تحت بيمشي بين ٧ ماسات، والعدّاد بيلف.
     موبايل: كل محطة تحت التانية وبتتكشف لما توصلها.
     ========================================================================== */
  function journey() {
    const sec = $('.journey');
    if (!sec) return;
    const steps = $$('.stp', sec);
    const N = steps.length;
    const roll = $$('.jr__roll span', sec);
    const ghostRoll = $$('.jr__groll span', sec);
    const lis = $$('.jr__marks li', sec);
    const fill = $('.jr__fill', sec);
    const parts = steps.map((s) => ({
      el: s,
      media: $('.stp__media', s),
      img: $('.stp__media img', s),
      svg: $('.mg', s),
      chars: SplitText.create($('.stp__t', s), { type: 'words,chars', mask: 'words' }).chars,
      rest: [$('.ar', s), ...$$('.stp__outs li', s)],
    }));

    const mgIn = (svg) => {
      const tl = gsap.timeline();
      if (!svg) return tl;
      const lines = $$('.mg__l, .mg__grid rect, .mg__ticks line', svg);
      const pops = $$('.mg__dots circle, .mg__p', svg);
      const barsR = $$('.mg__b--r', svg), barsL = $$('.mg__b--l', svg);
      const eq = $$('.mg__eq line', svg), acc = $$('.mg__acc', svg), tx = $$('.mg__tx', svg);
      tl.set(svg, { opacity: 1 }, 0);
      if (tx.length) tl.fromTo(tx, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.08 }, 0);
      if (lines.length && hasDraw) tl.fromTo(lines, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, stagger: { amount: 0.4 }, ease: 'athrInOut' }, 0.05);
      if (pops.length) tl.fromTo(pops, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, stagger: { amount: 0.35 } }, 0.25);
      if (barsR.length) tl.fromTo(barsR, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.9, stagger: 0.07 }, 0.3);
      if (barsL.length) tl.fromTo(barsL, { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 0.9, stagger: 0.07 }, 0.3);
      if (eq.length) tl.fromTo(eq, { scaleY: 0, transformOrigin: '50% 50%' }, { scaleY: 1, duration: 0.6, stagger: { amount: 0.4 } }, 0.25);
      if (acc.length) tl.fromTo(acc, { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.7 }, 0.7);
      return tl;
    };
    const stepIn = (p) => gsap.timeline()
      .fromTo(p.media, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'athrInOut' }, 0)
      .fromTo(p.img, { scale: 1.28, yPercent: 8 }, { scale: 1, yPercent: 0, duration: 1.3 }, 0)
      .fromTo(p.chars, { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.022 }, 0.25)
      .fromTo(p.rest, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.45)
      .add(mgIn(p.svg), 0.55);
    const stepOut = (p) => gsap.timeline()
      .fromTo(p.media, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'athrInOut', immediateRender: false }, 0)
      .fromTo(p.img, { scale: 1, yPercent: 0 }, { scale: 1.06, yPercent: -10, duration: 0.9, ease: 'athrInOut', immediateRender: false }, 0)
      .fromTo(p.chars, { yPercent: 0 }, { yPercent: -115, duration: 0.6, stagger: 0.012, ease: 'athrInOut', immediateRender: false }, 0)
      .fromTo(p.rest, { opacity: 1, y: 0 }, { opacity: 0, y: -10, duration: 0.45, stagger: 0.03, immediateRender: false }, 0)
      .fromTo(p.svg, { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, 0);

    const setActive = (cur) => {
      steps.forEach((s, i) => s.classList.toggle('is-active', i === cur));
      roll.forEach((r) => r.style.setProperty('--i', cur));
      ghostRoll.forEach((r) => r.style.setProperty('--i', cur));
      lis.forEach((li, i) => { li.classList.toggle('is-on', i === cur); li.classList.toggle('is-done', i < cur); });
    };

    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px) and (min-height: 600px)', () => {
      sec.classList.add('is-pinned');
      const stage = $('.jr__stage', sec);
      const HOLD = 0.4, GAP = 0.4;
      const labels = [0], inAts = [0];
      const tl = gsap.timeline({ paused: true });

      // المحطة الأولى ظاهرة، والباقي مستني
      gsap.set(steps, { visibility: 'hidden' });
      gsap.set(steps[0], { visibility: 'visible' });
      parts.slice(1).forEach((p) => {
        gsap.set(p.media, { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set(p.chars, { yPercent: 115 });
        gsap.set(p.rest, { opacity: 0 });
        gsap.set(p.svg, { opacity: 0 });
      });

      // كل محطة: القديمة تخرج ← الجديدة تدخل ← السناب يقف لما الرسم يخلص بالظبط
      tl.addLabel('s0', 0);
      for (let i = 1; i < N; i++) {
        const outAt = labels[i - 1] + HOLD, inAt = outAt + GAP;
        const enter = stepIn(parts[i]);
        tl.add(stepOut(parts[i - 1]), outAt)
          .set(steps[i], { visibility: 'visible' }, inAt)
          .add(enter, inAt)
          .set(steps[i - 1], { visibility: 'hidden' }, outAt + 0.95);
        inAts[i] = inAt;
        labels[i] = inAt + enter.duration();
        tl.addLabel('s' + i, labels[i]);
      }
      tl.to({}, { duration: 0.5 }, labels[N - 1]); // وقفة صغيرة على آخر محطة

      // دخول المحطة الأولى (قبل التثبيت)
      // (لو الصفحة فتحت وانت نازل تحت، المحطة الأولى تتحط جاهزة على طول)
      const first = stepIn(parts[0]).pause();
      ScrollTrigger.create({
        trigger: stage, start: 'top 75%', once: true,
        onEnter: () => first.play(),
        onRefresh: (self) => { if (self.progress > 0 && first.progress() < 1) first.progress(1); },
      });

      const indexAt = (t) => { let c = 0; for (let i = 1; i < N; i++) if (t >= inAts[i] + 0.45) c = i; return c; };
      const fillAt = (t) => {
        if (t >= labels[N - 1]) return 1;
        let i = 0; while (i < N - 2 && t >= labels[i + 1]) i++;
        return (i + gsap.utils.clamp(0, 1, (t - labels[i]) / (labels[i + 1] - labels[i]))) / (N - 1);
      };
      // سناب على المحطات في اتجاه السكرول — ويقف وقت القفز من الخط
      const marks = labels.map((l) => l / tl.duration());
      let jumping = false;
      const snapTo = (v, self) => {
        if (jumping) return v;
        const near = marks.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
        if (Math.abs(near - v) < 0.004) return near;
        if (self.direction > 0) return marks.find((m) => m > v) ?? marks[N - 1];
        return [...marks].reverse().find((m) => m < v) ?? marks[0];
      };
      let last = -1;
      const st = ScrollTrigger.create({
        trigger: stage, pin: true, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 0.95 * (N - 1)),
        scrub: 1, animation: tl, anticipatePin: 1, invalidateOnRefresh: true,
        snap: { snapTo, duration: { min: 0.35, max: 0.9 }, delay: 0.08, ease: 'power2.inOut' },
        onUpdate: () => {
          if (tl.time() > 0 && first.progress() < 1) { first.progress(1); tl.render(tl.time(), true, true); }
          const t = tl.time();
          fill.style.setProperty('--p', fillAt(t).toFixed(4));
          const c = indexAt(t);
          if (c !== last) { last = c; setActive(c); }
        },
      });
      setActive(0);
      fill.style.setProperty('--p', '0');

      // الضغط على محطة في الخط = روح لها
      const go = (e) => {
        const b = e.target.closest('[data-go]');
        if (!b) return;
        const i = Number(b.dataset.go);
        jumping = true;
        scrollToY(st.start + (st.end - st.start) * marks[i], 1.4, () => { jumping = false; });
      };
      $('.jr__marks', sec).addEventListener('click', go);

      return () => {
        sec.classList.remove('is-pinned');
        $('.jr__marks', sec).removeEventListener('click', go);
        gsap.set(steps, { clearProps: 'visibility' });
        parts.forEach((p) => gsap.set([p.media, p.img, ...p.chars, ...p.rest, p.svg], { clearProps: 'all' }));
      };
    });

    // موبايل: كاروسيل بالسحب — محطة في الشاشة، والكلام والجرافيك بيظهروا أول ما المحطة توصل
    mm.add('(max-width: 899px), (max-height: 599px)', () => {
      const track = $('.jr__steps', sec);
      const now = $('[data-jr-now]', sec);
      const marks = $('.jr__marks', sec);
      const played = new Set();
      const cardIn = (p) => gsap.timeline()
        .fromTo(p.img, { scale: 1.14 }, { scale: 1, duration: 1.4 }, 0)
        .fromTo(p.chars, { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.022 }, 0.1)
        .fromTo(p.rest, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.3)
        .add(mgIn(p.svg), 0.35);
      const play = (i) => { if (played.has(i)) return; played.add(i); cardIn(parts[i]); };
      parts.forEach((p) => { gsap.set(p.chars, { yPercent: 115 }); gsap.set(p.rest, { opacity: 0 }); gsap.set(p.svg, { opacity: 0 }); });

      const step = () => parts[0].el.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 14);
      let cur = -1, entered = false;
      const sync = () => {
        const max = track.scrollWidth - track.clientWidth;
        fill.style.setProperty('--p', (max > 0 ? track.scrollLeft / max : 0).toFixed(4));
        const i = Math.min(N - 1, Math.max(0, Math.round(track.scrollLeft / step())));
        if (i !== cur) { cur = i; setActive(i); if (now) now.textContent = String(i + 1).padStart(2, '0'); if (entered) play(i); }
      };
      track.addEventListener('scroll', sync, { passive: true });
      const go = (e) => {
        const btn = e.target.closest('[data-go]');
        if (!btn) return;
        track.scrollTo({ left: Number(btn.dataset.go) * step(), behavior: 'smooth' });
      };
      marks.addEventListener('click', go);
      const st = ScrollTrigger.create({ trigger: track, start: 'top 80%', once: true, onEnter: () => { entered = true; play(Math.max(cur, 0)); } });
      sync();
      return () => {
        track.removeEventListener('scroll', sync); marks.removeEventListener('click', go); st.kill();
        parts.forEach((p) => { p.el.classList.remove('is-active'); gsap.set([p.img, ...p.chars, ...p.rest, p.svg], { clearProps: 'all' }); });
      };
    });
  }

  /* ---------- المحتوى: ٣ صفوف (كاروسيلات · صور Gemini · كاروسيلات) عكس بعض + ميل مع السرعة ----------
     كمبيوتر: المعرض بيتثبّت وكل صف بيمشي لحد آخره (كل الصور بتتشاف). موبايل: بيمشي مع السكرول من غير تثبيت. */
  function gallery() {
    const sec = $('.content'), wrap = $('[data-gal]');
    if (!sec || !wrap) return;
    const stage = $('.gal__stage', wrap);
    const rows = $$('.gal__row', wrap);
    const gut = () => parseFloat(getComputedStyle($('.wrap')).paddingLeft) || 24;
    const over = (row) => Math.max(0, row.scrollWidth + (parseFloat(getComputedStyle(row).marginLeft) || 0) - window.innerWidth);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px) and (min-height: 640px)', () => {
      sec.classList.add('is-pinned');
      const tl = gsap.timeline();
      rows.forEach((row) => {
        const d = Number(row.dataset.dir || 1);
        tl.fromTo(row, { x: () => (d > 0 ? gut() : -over(row) - gut()) }, { x: () => (d > 0 ? -over(row) - gut() : gut()), ease: 'none' }, 0);
      });
      const st = ScrollTrigger.create({
        trigger: stage, pin: true, start: 'top top', end: () => '+=' + Math.round(Math.max(...rows.map(over)) * 0.85 + window.innerHeight * 0.2),
        scrub: 0.8, animation: tl, invalidateOnRefresh: true, anticipatePin: 1,
      });
      return () => { sec.classList.remove('is-pinned'); st.kill(); tl.kill(); gsap.set(rows, { clearProps: 'x' }); };
    });

    mm.add('(max-width: 899px), (max-height: 639px)', () => {
      const tws = rows.map((row) => {
        const d = Number(row.dataset.dir || 1);
        const travel = () => Math.min(over(row), window.innerWidth * 1.4);
        return gsap.fromTo(row, { x: () => (d > 0 ? 0 : -over(row)) }, {
          x: () => (d > 0 ? -travel() : -over(row) + travel()), ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
        });
      });
      return () => tws.forEach((t) => { if (t.scrollTrigger) t.scrollTrigger.kill(); t.kill(); });
    });

    // ميل خفيف مع سرعة السكرول
    const skewTo = gsap.quickTo(rows, 'skewX', { duration: 0.6, ease: 'athr' });
    ScrollTrigger.create({
      trigger: wrap, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => skewTo(gsap.utils.clamp(-5, 5, self.getVelocity() / -380)),
      onLeave: () => skewTo(0), onLeaveBack: () => skewTo(0),
    });
    // دخول: الصور بتطلع من النص للأطراف
    gsap.fromTo($$('.g', wrap), { opacity: 0, y: 46 }, {
      opacity: 1, y: 0, duration: 1.2, stagger: { each: 0.025, from: 'center' },
      scrollTrigger: { trigger: wrap, start: 'top 85%', once: true },
    });
  }

  /* ---------- الأنظمة: الخط الأحمر يترسم + الإطارات تنكشف ---------- */
  function systems() {
    const sec = $('.systems');
    if (!sec) return;
    const rule = $('.systems__rule', sec);
    if (rule) gsap.fromTo(rule, { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: 1.2, ease: 'athrInOut', scrollTrigger: { trigger: sec, start: 'top 85%', once: true } });
    const frames = $$('.sys__frame', sec);
    gsap.fromTo(frames, { clipPath: 'inset(100% 0% 0% 0% round 16px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.4, stagger: 0.09, ease: 'athrInOut',
      scrollTrigger: { trigger: '[data-sys]', start: 'top 85%', once: true },
      onComplete: () => gsap.set(frames, { clearProps: 'clipPath' }),
    });
    gsap.fromTo($$('.sys__frame img', sec), { yPercent: 18 }, {
      yPercent: 0, duration: 1.6, stagger: 0.09,
      scrollTrigger: { trigger: '[data-sys]', start: 'top 85%', once: true },
      onComplete: function () { gsap.set(this.targets(), { clearProps: 'transform' }); },
    });
    gsap.fromTo($$('.sys__cap', sec), { opacity: 0 }, { opacity: 1, duration: 1, stagger: 0.09, delay: 0.5, scrollTrigger: { trigger: '[data-sys]', start: 'top 85%', once: true } });
  }

  /* ---------- كشف عام بـclip-path (صفحة دراسة الحالة) ---------- */
  function reveals() {
    $$('[data-reveal]').forEach((el) => gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 16px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.6, ease: 'athrInOut',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onComplete: () => gsap.set(el, { clearProps: 'clipPath' }),
    }));
  }

  /* ---------- النهاية: نفس افتتاحية الهيرو ---------- */
  function finale() {
    const cta = $('.cta');
    if (!cta) return;
    const tl = opening(cta).pause();
    ScrollTrigger.create({ trigger: cta, start: 'top 60%', once: true, onEnter: () => tl.play() });
  }

  /* ---------- الفوتر: .ATHR عملاقة حرف حرف ---------- */
  function giant() {
    const g = $('.foot__giant');
    if (!g) return;
    gsap.fromTo($$('.fg', g), { yPercent: 100 }, {
      yPercent: 0, duration: 1.4, stagger: 0.07, ease: 'athrInOut',
      scrollTrigger: { trigger: g, start: 'top 92%', once: true },
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
    document.documentElement.addEventListener('pointerleave', () => gsap.to(c, { opacity: 0, duration: 0.3 }));
    document.documentElement.addEventListener('pointerenter', () => gsap.to(c, { opacity: 1, duration: 0.3 }));
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

  /* ---------- /tweak ---------- */
  function tweak() {
    if (!/[?&]tweak/.test(location.search)) return;
    const fields = [
      { label: 'Anchor (svh)', min: 14, max: 30, step: 1, v: 22, apply: (v) => { root.style.setProperty('--anchor-v', v + 'svh'); root.style.setProperty('--anchor', v + '%'); } },
      { label: 'H1 max (px)', min: 64, max: 160, step: 2, v: 104, apply: (v) => root.style.setProperty('--h1', `clamp(46px, ${(v / 16.25).toFixed(2)}vw, ${v}px)`) },
      { label: 'Section space (px)', min: 120, max: 420, step: 4, v: 340, apply: (v) => root.style.setProperty('--sec-pad', `clamp(${Math.round(v * 0.47)}px, 30vh, ${v}px)`) },
      { label: 'Motion speed', min: 0.25, max: 1.75, step: 0.05, v: 1, apply: (v) => gsap.globalTimeline.timeScale(v) },
    ];
    const box = document.createElement('div');
    box.className = 'tweak';
    box.innerHTML = '<h4>Tweak — .ATHR</h4>' + fields.map((f, i) => `<label>${f.label}<output id="tw${i}">${f.v}</output><input type="range" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.v}" data-i="${i}"></label>`).join('') + '<button type="button">Bake</button><pre></pre>';
    document.body.appendChild(box);
    box.addEventListener('input', (e) => { const i = +e.target.dataset.i; $('#tw' + i, box).textContent = e.target.value; fields[i].apply(+e.target.value); ScrollTrigger.refresh(); });
    $('button', box).addEventListener('click', () => {
      const s = root.style;
      const css = `:root{\n  --anchor:${s.getPropertyValue('--anchor') || '22%'};\n  --anchor-v:${s.getPropertyValue('--anchor-v') || '22svh'};\n  --h1:${s.getPropertyValue('--h1') || 'default'};\n  --sec-pad:${s.getPropertyValue('--sec-pad') || 'default'};\n}`;
      const pre = $('pre', box); pre.textContent = css; pre.style.display = 'block';
      if (navigator.clipboard) navigator.clipboard.writeText(css).catch(() => {});
    });
  }

  /* ==========================================================================
     v4.3 — تفاصيل وحركة: شريط تقدّم · جو بيتحرك · شرايط كلام · لابلات · ماسات · ميل · غبار
     ========================================================================== */
  function richness() {
    // شريط التقدّم + التيكستر بيتحرك أبطأ من الصفحة
    const bar = $('.progress'), tex = $('.atmo__tex');
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        if (bar) bar.style.setProperty('--p', self.progress.toFixed(4));
        if (tex) tex.style.setProperty('--ty', (-self.progress * 6).toFixed(2) + 'vh');
      },
    });

    // شرايط الكلام: ماشية لوحدها، وبتسرع مع السكرول وبتعكس لما تطلع لفوق
    const ms = $$('[data-marq]');
    if (ms.length) {
      let boost = 0, dir = 1;
      if (lenis) lenis.on('scroll', (e) => { const v = e.velocity || 0; boost = Math.min(18, Math.abs(v) * 0.7); if (Math.abs(v) > 0.4) dir = v > 0 ? 1 : -1; });
      ms.forEach((m) => {
        const track = $('.marq__track', m), row = $('.marq__row', m), side = Number(m.dataset.dir || 1);
        let x = 0, w = row.offsetWidth, on = false;
        window.addEventListener('resize', () => { w = row.offsetWidth; });
        ScrollTrigger.create({ trigger: m, start: 'top bottom', end: 'bottom top', onToggle: (st) => { on = st.isActive; } });
        gsap.ticker.add((t, dt) => {
          if (!on || !w) return;
          x -= (0.55 + boost) * (dt / 16.7) * side * dir;
          if (x <= -w) x += w; else if (x > 0) x -= w;
          track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0) skewX(' + (-boost * 0.35 * dir * side).toFixed(2) + 'deg)';
        });
      });
      gsap.ticker.add(() => { boost *= 0.93; });
    }

    // لابلات الأقسام: الحروف بتتلم (tracking) والرقم الأحمر يظهر الأول
    $$('[data-slabel]').forEach((el) => {
      const num = el.children[0], txt = el.children[1];
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
        .fromTo(num, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, 0)
        .fromTo(txt, { opacity: 0, letterSpacing: '.6em' }, { opacity: 1, letterSpacing: '.18em', duration: 1.4 }, 0.1);
    });

    // الخط اللي بينزل من الجملة للرحلة
    const con = $('.connector i');
    if (con) gsap.fromTo(con, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.connector', start: 'top 85%', end: 'bottom 45%', scrub: true } });

    // الأرقام الضخمة بتتحرك بعكس السكرول
    $$('[data-ghost]').forEach((g) => gsap.fromTo(g, { yPercent: 18 }, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: g.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // ماسات طايرة حوالين صورة الهيرو
    $$('.floaters i').forEach((d, i) => gsap.to(d, { y: i % 2 ? 12 : -14, x: i === 2 ? 8 : 0, duration: 3.2 + i * 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.4 }));

    // صورة الهيرو بتميل مع الماوس (عمق خفيف)
    const side = $('[data-tilt]'), media = $('[data-hero-media]');
    if (side && media && fine) {
      const img = $('img', media);
      const rx = gsap.quickTo(media, 'rotationX', { duration: 0.9, ease: 'athr' });
      const ry = gsap.quickTo(media, 'rotationY', { duration: 0.9, ease: 'athr' });
      const ix = gsap.quickTo(img, 'xPercent', { duration: 1.1, ease: 'athr' });
      const flo = $$('.floaters i', side).map((d) => gsap.quickTo(d, 'xPercent', { duration: 1.2, ease: 'athr' }));
      const hero = $('.hero');
      hero.addEventListener('pointermove', (e) => {
        const r = side.getBoundingClientRect();
        const px = (e.clientX - (r.left + r.width / 2)) / window.innerWidth, py = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        ry(px * 9); rx(-py * 7); ix(-px * 4); flo.forEach((f, i) => f(px * (i + 1) * 60));
      });
      hero.addEventListener('pointerleave', () => { rx(0); ry(0); ix(0); flo.forEach((f) => f(0)); });
    }

    dust();
  }

  // غبار في شعاع النور (النهاية) — بيشتغل بس وهو باين
  function dust() {
    const c = $('.dust');
    if (!c) return;
    const ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, on = false, parts = [];
    const size = () => {
      W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = W < 700 ? 34 : 70;
      parts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + 0.3, vx: (Math.random() - 0.5) * 0.12, vy: -Math.random() * 0.18 - 0.03, a: Math.random() * 0.5 + 0.15, p: Math.random() * Math.PI * 2 }));
    };
    size();
    window.addEventListener('resize', size);
    ScrollTrigger.create({ trigger: '.cta', start: 'top bottom', end: 'bottom top', onToggle: (st) => { on = st.isActive; } });
    gsap.ticker.add(() => {
      if (!on) return;
      ctx.clearRect(0, 0, W, H);
      for (const d of parts) {
        d.x += d.vx; d.y += d.vy; d.p += 0.02;
        if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
        if (d.x < -4) d.x = W + 4; else if (d.x > W + 4) d.x = -4;
        // أنور جوه الشعاع (ناحية اليمين)
        const inBeam = Math.max(0, 1 - Math.abs(d.x - W * 0.72) / (W * 0.32));
        ctx.globalAlpha = d.a * (0.35 + inBeam * 0.9) * (0.75 + Math.sin(d.p) * 0.25);
        ctx.fillStyle = '#F7F5F2';
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }

  // ساعة القاهرة (تفصيلة صغيرة: الاستوديو صاحي)
  function clock() {
    const els = $$('[data-clock]');
    if (!els.length) return;
    let fmt;
    try { fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' }); } catch (e) { return; }
    const tick = () => { const v = fmt.format(new Date()); els.forEach((e) => { e.textContent = v; }); };
    tick();
    setInterval(tick, 20000);
  }

  // اسم كل تصميم يظهر في الهوفر (من الـalt)
  function galleryNames() {
    $$('.g img').forEach((img) => { const n = (img.alt || '').split(' — ')[0]; if (n) img.parentElement.dataset.name = n; });
  }

  /* ---------- مكوّنات بتتبني بالكود (شغالة حتى من غير GSAP) ---------- */
  // موجة «بنسمعك» في محطة المكالمة
  function buildEq() {
    const g = $('.mg__eq');
    if (!g) return;
    const NS = 'http://www.w3.org/2000/svg';
    const H = [6, 14, 9, 22, 34, 18, 44, 28, 52, 36, 20, 40, 58, 30, 46, 24, 12, 32, 48, 26, 54, 38, 16, 42, 30, 20, 36, 14, 26, 10, 18, 8, 12, 6];
    H.forEach((h, i) => {
      const x = 66 + i * 8.2;
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', x); l.setAttribute('x2', x);
      l.setAttribute('y1', 410 - h / 2); l.setAttribute('y2', 410 + h / 2);
      l.style.animationDelay = (-(i * 0.137) % 1.1).toFixed(2) + 's';
      g.appendChild(l);
    });
  }
  // خط الرحلة: ٧ ماسات بأسماء المحطات
  function buildRail() {
    const ol = $('.jr__marks');
    if (!ol) return;
    ol.innerHTML = $$('.stp').map((s, i) => `<li><button type="button" data-go="${i}" aria-label="Step ${i + 1}: ${s.dataset.label}"><i aria-hidden="true"></i><span>${s.dataset.label}</span></button></li>`).join('');
  }
})();
