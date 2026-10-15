/* ==========================================================================
   .ATHR Systems — الصفحة: الترحيب بالاسم، الحالات، الإمكانيات، الظهور
   ========================================================================== */
(function () {
  var S = window.SYS, IC = window.IC, d = document;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  function hydrate(root) {
    $$("[data-ic]", root).forEach(function (el) { el.outerHTML = IC(el.getAttribute("data-ic")); });
  }
  hydrate(d);

  /* ---------- انستجرام ---------- */
  $$("[data-ig]").forEach(function (a) { a.href = S.ig; });
  var h = $("#igHandle"); if (h) h.textContent = "@" + S.igHandle;

  /* ---------- الترحيب بالاسم: ?to=اسم المكان ---------- */
  try {
    var to = new URLSearchParams(location.search).get("to");
    if (to) {
      to = to.replace(/[<>]/g, "").trim().slice(0, 40);
      if (to) {
        $("#helloName").textContent = to;
        $("#hello").hidden = false;
        d.title = to + " — .ATHR Systems";
      }
    }
  } catch (e) { }

  /* ---------- NAV ---------- */
  var nav = $("#nav");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- 01 · الحالات ---------- */
  var SURF = { lc: "#EDE5DA", areeb: "#E9DDC4", friends: "#1C1916", cezar: "#1B1C20" };
  var casesEl = $("#cases");
  casesEl.innerHTML = S.order.map(function (id, i) {
    var b = S.brands[id];
    var k = [b.kind, b.city].filter(Boolean).join(" · ");
    return '<article class="case" data-brand="' + id + '" style="--sf:' + SURF[id] + '">' +
      '<div class="case__media rv">' +
        '<div class="case__lap"><div class="scr"><img loading="lazy" decoding="async" src="' + b.shots.desk + '" alt="لوحة صاحب المكان — ' + esc(b.name) + '" width="1440" height="900"></div><div class="base"></div></div>' +
        '<div class="case__ph"><div class="scr"><img loading="lazy" decoding="async" class="' + (b.shots.scroll ? "scrolls" : "") + '" src="' + b.shots.phone + '" alt="شاشة الزبون — ' + esc(b.name) + '"></div></div>' +
      '</div>' +
      '<div class="case__txt">' +
        '<p class="case__k rv"><b class="num">0' + (i + 1) + '</b>' + esc(k) + '</p>' +
        '<h3 class="case__name rv">' + esc(b.name) + '<span class="en">' + esc(b.en) + '</span></h3>' +
        '<p class="case__line rv">' + esc(b.line) + '</p>' +
        '<ul class="facts rv">' + b.facts.map(function (f) { return '<li><b>' + f[0] + '</b><span>' + esc(f[1]) + '</span></li>'; }).join("") + '</ul>' +
        '<ul class="chips rv">' + b.chips.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join("") + '</ul>' +
        '<div class="case__cta rv">' +
          '<a class="btn btn--sm" href="' + b.urls.menu + '" target="_blank" rel="noopener">' + esc(b.menuLabel || "شاشة الزبون") + IC("out") + '</a>' +
          '<a class="btn btn--sm btn--ghost" href="' + b.urls.owner + '" target="_blank" rel="noopener">' + (b.type === "gym" ? "نظام الإدارة" : "لوحة صاحب المكان") + IC("out") + '</a>' +
          '<button class="tlink case__try" type="button" data-try="' + id + '">جرّبه هنا' + IC("down") + '</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join("");

  /* الموبايل بيسكرول لوحده جوه الإطار — المسافة على قد طول الصورة */
  $$(".case__ph img.scrolls").forEach(function (im) {
    function set() {
      var box = im.parentNode, vh = box.clientHeight, ih = im.clientHeight;
      if (!ih) return;
      box.style.setProperty("--vh", vh + "px");
      im.style.setProperty("--dur", Math.max(14, Math.round((ih - vh) / 70)) + "s");
      im.style.setProperty("--vh", vh + "px");
    }
    if (im.complete) set(); else im.addEventListener("load", set);
    window.addEventListener("resize", set);
  });

  d.addEventListener("click", function (e) {
    var t = e.target.closest("[data-try]");
    if (!t) return;
    var id = t.getAttribute("data-try"), mod = t.getAttribute("data-mod");
    if (window.LAB) window.LAB.open(id, mod);
    $("#lab").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ---------- 03 · الإمكانيات ---------- */
  var NAMES = { lc: "محصول فاخر", areeb: "أريب", friends: "فرندس", cezar: "سيزر" };
  var capf = $("#capf"), capList = $("#caplist");
  var current = "all";
  function counts(g) { return S.caps.filter(function (c) { return g === "all" || c.g === g; }).length; }
  capf.innerHTML = '<button type="button" class="is-on" data-g="all">الكل <b class="num">' + S.caps.length + '</b></button>' +
    S.groups.map(function (g) { return '<button type="button" data-g="' + g.id + '">' + esc(g.q) + ' <b class="num">' + counts(g.id) + '</b></button>'; }).join("");
  var expanded = {}, narrow = window.matchMedia("(max-width:700px)");
  function renderCaps() {
    capList.innerHTML = S.groups.filter(function (g) { return current === "all" || g.id === current; }).map(function (g) {
      var all = S.caps.filter(function (c) { return c.g === g.id; });
      var cut = narrow.matches && current === "all" && !expanded[g.id] && all.length > 3;
      var list = cut ? all.slice(0, 3) : all;
      return '<div class="capgrp"><div class="capgrp__h"><h3>' + IC(g.ic) + esc(g.q) + '</h3><span class="en">' + esc(g.en) + '</span></div>' +
        '<div class="caplist">' + list.map(function (c) {
          var tryBtn = "";
          if (c.tr) {
            var brand = c.tr[0] === "gym" ? "cezar" : (c.s.indexOf("lc") > -1 ? "lc" : c.s[0]);
            tryBtn = '<button type="button" class="cap__try" data-try="' + brand + '" data-mod="' + c.tr[1] + '">جرّبها' + IC("left") + '</button>';
          }
          return '<article class="cap"><h4>' + esc(c.t) + '</h4><p>' + esc(c.d) + '</p><p class="f">' + esc(c.f) + '</p>' +
            '<div class="cap__ft"><span class="cap__s">' + c.s.map(function (s) { return '<i>' + NAMES[s] + '</i>'; }).join("") + '</span>' + tryBtn + '</div></article>';
        }).join("") + '</div>' + (cut ? '<button type="button" class="capmore" data-more="' + g.id + '">اعرض الـ' + all.length + ' كلها' + IC("down") + "</button>" : "") + "</div>";
    }).join("");
  }
  renderCaps();
  capList.addEventListener("click", function (e) { var b = e.target.closest("[data-more]"); if (!b) return; expanded[b.getAttribute("data-more")] = true; renderCaps(); });
  if (narrow.addEventListener) narrow.addEventListener("change", renderCaps);
  capf.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-g]"); if (!b) return;
    current = b.getAttribute("data-g");
    $$("button", capf).forEach(function (x) { x.classList.toggle("is-on", x === b); });
    renderCaps();
  });

  /* عدّاد الإمكانيات */
  var cc = $("#capCount"), counted = false;
  function countUp() {
    if (counted) return; counted = true;
    var n = S.caps.length, t0 = performance.now();
    (function tick(t) {
      var p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
      cc.textContent = Math.round(n * e);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- ظهور العناصر ---------- */
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        if (en.target === cc.parentNode) countUp();
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .12 });
    $$(".rv").forEach(function (el, i) {
      var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 6) * 70 + "ms";
      io.observe(el);
    });
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (en) { en.target.classList.toggle("is-in", en.isIntersecting); });
    }, { threshold: .25 });
    $$(".case").forEach(function (c) { io2.observe(c); });
  } else {
    $$(".rv").forEach(function (el) { el.classList.add("is-in"); });
    $$(".case").forEach(function (c) { c.classList.add("is-in"); });
    cc.textContent = S.caps.length;
  }
})();
