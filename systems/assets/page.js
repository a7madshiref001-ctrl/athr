/* ==========================================================================
   .ATHR Systems — الصفحة: الوضع الفاتح/الغامق، الترحيب بالاسم، الأنظمة، الفوايد، الظهور
   ========================================================================== */
(function () {
  var S = window.SYS, IC = window.IC, d = document;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- فاتح / غامق ---------- */
  var root = d.documentElement, themeBtn = $("#theme"), meta = $('meta[name="theme-color"]');
  function setTheme(t, save) {
    root.setAttribute("data-theme", t);
    if (meta) meta.setAttribute("content", t === "dark" ? "#111111" : "#F7F5F2");
    themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    if (save) try { localStorage.setItem("athr-sys-theme", t); } catch (e) { }
  }
  setTheme(root.getAttribute("data-theme") || "dark");
  themeBtn.addEventListener("click", function () { setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true); });

  /* ---------- انستجرام ---------- */
  $$("[data-ig]").forEach(function (a) { a.href = S.ig; });
  var h = $("#igHandle"); if (h) h.textContent = "@" + S.igHandle;

  /* ---------- الترحيب بالاسم: ?to=اسم المكان ---------- */
  try {
    var to = new URLSearchParams(location.search).get("to");
    if (to) {
      to = to.replace(/[<>]/g, "").trim().slice(0, 40);
      if (to) { $("#helloName").textContent = to; $("#hello").hidden = false; d.title = to + " — .ATHR Systems"; }
    }
  } catch (e) { }

  /* ---------- NAV ---------- */
  var nav = $("#nav");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- 01 · الأنظمة ---------- */
  var SURF = { lc: "#E9E1D6", areeb: "#E6DAC1", friends: "#1C1916", cezar: "#1E1F23" };
  $("#cases").innerHTML = S.order.map(function (id, i) {
    var b = S.brands[id], gym = b.type === "gym";
    return '<article class="case" data-brand="' + id + '" style="--sf:' + SURF[id] + '">' +
      '<div class="case__media rv">' +
        '<div class="case__lap"><div class="scr"><img loading="lazy" decoding="async" src="' + b.shots.desk + '" alt="' + esc(b.nameEn) + ' owner dashboard" width="1440" height="900"></div><div class="base"></div></div>' +
        '<div class="case__ph"><div class="scr"><img loading="lazy" decoding="async" class="' + (b.shots.scroll ? "scrolls" : "") + '" src="' + b.shots.phone + '" alt="' + esc(b.nameEn) + ' on a customer phone"></div></div>' +
      "</div>" +
      '<div class="case__txt">' +
        '<p class="case__k rv"><b>0' + (i + 1) + "</b>" + esc(b.kindEn) + "</p>" +
        '<h3 class="case__name rv">' + esc(b.nameEn) + '<span class="ar">' + esc(b.name) + "</span></h3>" +
        '<p class="case__line rv">' + esc(b.lineEn) + "</p>" +
        '<ul class="facts rv">' + b.factsEn.map(function (f) { return "<li><b>" + f[0] + "</b><span>" + esc(f[1]) + "</span></li>"; }).join("") + "</ul>" +
        '<div class="case__cta rv">' +
          '<a class="btn btn--sm" href="' + b.urls.menu + '" target="_blank" rel="noopener">' + (gym ? "Gym website" : "Customer view") + IC("out") + "</a>" +
          '<a class="btn btn--sm btn--ghost" href="' + b.urls.owner + '" target="_blank" rel="noopener">' + (gym ? "Management system" : "Owner dashboard") + IC("out") + "</a>" +
          '<button class="tlink" type="button" data-try="' + id + '">Try it here' + IC("down") + "</button>" +
        "</div>" +
      "</div>" +
    "</article>";
  }).join("");

  /* الموبايل بيسكرول لوحده جوه الإطار */
  $$(".case__ph img.scrolls").forEach(function (im) {
    function set() {
      var box = im.parentNode, vh = box.clientHeight, ih = im.clientHeight;
      if (!ih) return;
      im.style.setProperty("--dur", Math.max(14, Math.round((ih - vh) / 70)) + "s");
      im.style.setProperty("--vh", vh + "px");
    }
    if (im.complete) set(); else im.addEventListener("load", set);
    window.addEventListener("resize", set);
  });

  d.addEventListener("click", function (e) {
    var t = e.target.closest("[data-try]");
    if (!t) return;
    if (window.LAB) window.LAB.open(t.getAttribute("data-try"), t.getAttribute("data-mod"));
    $("#lab").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });

  /* ---------- 02 · الفوايد: النظام ← الفايدة ← التفاصيل ---------- */
  var ben = $("#ben"), sys = S.ben[0].id, open = null;
  var NAMES = { lc: "Luxury Crop", areeb: "Areeb", friends: "Friends", cezar: "Cezar Gym" };
  function renderBen() {
    var cur = S.ben.filter(function (x) { return x.id === sys; })[0];
    ben.innerHTML =
      '<div class="ben__pick" role="tablist" aria-label="Pick a system">' + S.ben.map(function (x) {
        return '<button type="button" role="tab" class="bpk' + (x.id === sys ? " on" : "") + '" aria-selected="' + (x.id === sys) + '" data-sys="' + x.id + '">' +
          '<span class="bpk__i">' + IC(x.ic) + '</span><span class="bpk__t"><b>' + esc(x.t) + "</b><small>" + esc(x.sub) + '</small></span><span class="bpk__n">' + x.items.length + " benefits</span></button>";
      }).join("") + "</div>" +
      '<div class="ben__list" role="tabpanel">' + cur.items.map(function (it, i) {
        var o = open === i, inBrands = cur.id === "gym" ? "Cezar Gym" : "Luxury Crop · Areeb · Friends";
        return '<div class="acc' + (o ? " open" : "") + '"><button type="button" class="acc__h" aria-expanded="' + o + '" data-acc="' + i + '">' +
          '<span class="acc__n">' + (i + 1) + '</span><span class="acc__t"><b>' + esc(it.t) + "</b><small>" + esc(it.s) + '</small></span><span class="acc__x">' + IC("plus") + "</span></button>" +
          '<div class="acc__p"><div><div class="acc__in"><ul>' + it.d.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
          '<div class="acc__ft"><button type="button" class="btn btn--sm" data-try="' + it.tr[0] + '" data-mod="' + it.tr[1] + '">Try it in ' + NAMES[it.tr[0]] + IC("down") + "</button><small>In: " + inBrands + "</small></div></div></div></div></div>";
      }).join("") + "</div>";
  }
  renderBen();
  ben.addEventListener("click", function (e) {
    var p = e.target.closest("[data-sys]");
    if (p) { if (p.getAttribute("data-sys") !== sys) { sys = p.getAttribute("data-sys"); open = null; renderBen(); } return; }
    var a = e.target.closest("[data-acc]");
    if (a) {
      var i = +a.getAttribute("data-acc"), was = open === i;
      $$(".acc", ben).forEach(function (x, k) {
        var on = !was && k === i;
        x.classList.toggle("open", on);
        $(".acc__h", x).setAttribute("aria-expanded", on);
      });
      open = was ? null : i;
    }
  });

  /* ---------- ظهور هادي مع السكرول ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: .1 });
    $$(".rv").forEach(function (el) {
      var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 5) * 70 + "ms";
      io.observe(el);
    });
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (en) { en.target.classList.toggle("is-in", en.isIntersecting); });
    }, { threshold: .25 });
    $$(".case").forEach(function (c) { io2.observe(c); });
  } else {
    $$(".rv").forEach(function (el) { el.classList.add("is-in"); });
    $$(".case").forEach(function (c) { c.classList.add("is-in"); });
  }
})();
