/* ==========================================================================
   .ATHR Systems — «جرّب اللوحة بإيدك»
   لوحة صاحب المكان (موحّدة) + موبايل الزبون جنبها. كل تغيير في اللوحة بيوصل للموبايل فورًا.
   كل البيانات في الذاكرة بس — مفيش حاجة بتتبعت ولا بتتحفظ.
   ========================================================================== */
(function () {
  var S = window.SYS, IC = window.IC, d = document;
  var root = d.getElementById("labx");
  if (!root || !S) return;
  var img = S.img;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var n2 = function (v) { return Math.round(v).toLocaleString("en-US"); };
  var $ = function (s, r) { return (r || root).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || root).querySelectorAll(s)); };
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function mask(r) { return "05" + (1 + Math.floor(r() * 9)) + " ••• " + (1000 + Math.floor(r() * 9000)); }
  function ago(ms) {
    var m = Math.round((Date.now() - ms) / 60000);
    if (m < 1) return "دلوقتي"; if (m < 60) return "قبل " + m + " د"; var h = Math.round(m / 60);
    if (h < 24) return "قبل " + h + " س"; return "قبل " + Math.round(h / 24) + " يوم";
  }
  var NAMES = ["فهد", "عبدالله", "نورة", "سارة", "خالد", "ريم", "محمد", "لمى", "تركي", "جود", "ريان", "هيا", "سلطان", "دانة", "ماجد", "أمل", "بندر", "شهد", "عمر", "غادة"];
  var MIN = 60000, DAY = 86400000;
  var mobile = function () { return window.innerWidth <= 1080; };

  /* ======================================================================
     الحالة
     ====================================================================== */
  var STATES = {}, st = null;

  function mkCafe(id) {
    var b = S.brands[id], r = rng(id.length * 977 + 13);
    var items = b.items.map(function (it) { return { id: it.id, n: it.n, p: it.p, s: it.s, im: it.im, d: it.d, b: it.b || "", sz: it.sz || null, on: true, nw: false, v: 0, o: 0 }; });
    items.forEach(function (it, i) { it.v = Math.round(120 + r() * 640 * (it.b ? 1.7 : 1)); it.o = Math.round(it.v * (.14 + r() * .3)); });
    items[items.length - 2].v = 9; items[items.length - 2].o = 0;
    var o0 = b.offers[0];
    var s = {
      id: id, b: b, gym: false, mod: "orders", msec: "all", ofil: "all", adding: false, newPic: items[0].im,
      items: items,
      offer: { on: true, im: o0.im, t: o0.t, d: o0.d, p: o0.p, was: o0.was, from: 7, to: 11, ends: Date.now() + (2 * 3600 + 14 * 60) * 1000 },
      draft: null,
      orders: [], no: 236 + Math.floor(r() * 6),
      rev: { th: 4, google: 214, caught: 21, list: [] },
      loy: { goal: b.loyalty.goal, reward: b.loyalty.reward, min: id === "friends" ? 25 : 15, perDay: true, cards: [], codes: [], code: "" },
      cust: [], seg: "all",
      guard: { first: true, daily: 5, cool: 90, trap: true, table: true, block: [mask(r), mask(r)], blockIn: "", queue: [] },
      pay: { stc: true, bank: true, cash: true, wait: [] },
      tables: 8,
      look: { c: b.t.pri, name: b.name, tag: b.kind + (b.city ? " · " + b.city : ""), dark: b.t.dark },
      ph: { view: "menu", sec: "all", cart: [], mode: "table", pay: "cash", ref: "", last: 0, stamps: b.loyalty.goal - 2, stars: 0, msg: "", sheet: null, done: null, blocked: false, name: "فهد", phone: "0551234567" },
      rep: { range: 30 },
      sound: true, tour: {}, today: { orders: 46, sales: 0, visitors: 212, up: 0 }
    };
    s.today.sales = s.today.orders * (id === "friends" ? 41 : 33);
    s.today.up = Math.round(s.today.sales * .11);
    /* طلبات قديمة */
    var modes = ["table", "table", "take", "table", "deliv"];
    for (var i = 0; i < 6; i++) {
      var o = mkOrder(s, r, i < 1 ? "prep" : i === 5 ? "x" : "done", modes[i % modes.length]);
      o.at = Date.now() - (4 + i * 9) * MIN; s.orders.push(o);
    }
    var cf = mkOrder(s, r, "conf", "take"); cf.lines.forEach(function (l) { l.q = 3; }); cf.tot = tot(cf); cf.at = Date.now() - 2 * MIN; cf.flag = "أول طلب من الرقم ده + مبلغ كبير"; s.guard.queue.push(cf);
    var pw = mkOrder(s, r, "pay", "take"); pw.ref = String(100000 + Math.floor(r() * 899999)).slice(-6); pw.via = "STC Pay"; pw.at = Date.now() - 3 * MIN; s.pay.wait.push(pw);
    /* شكاوى */
    var CM = id === "friends" ? ["البطاطس وصلت باردة", "الطلب اتأخر 25 دقيقة", "الصوص كان ناقص"] : ["القهوة وصلت فاترة", "الانتظار كان طويل شوية", "الكيك كان ناشف"];
    CM.forEach(function (t, i) { s.rev.list.push({ st: 1 + (i % 3), ph: mask(r), t: t, at: Date.now() - (i + 1) * 5 * 3600 * 1000, done: i === 2 }); });
    /* عملاء + ولاء */
    for (var k = 0; k < 18; k++) {
      var visits = 1 + Math.floor(Math.pow(r(), 2) * 14), lastD = Math.floor(r() * 45);
      s.cust.push({ n: NAMES[k % NAMES.length], ph: mask(r), v: visits, sum: visits * (22 + Math.floor(r() * 40)), last: Date.now() - lastD * DAY, fresh: k > 14 });
    }
    s.cust.slice(0, 7).forEach(function (c, i) { s.loy.cards.push({ ph: c.ph, n: Math.min(s.loy.goal, (i * 2 + 1) % (s.loy.goal + 1)), last: c.last }); });
    var pre = id === "lc" ? "LC" : id === "areeb" ? "AR" : "FR";
    s.loy.codes = [{ c: pre + "-4821", ph: s.cust[2].ph, used: false }, { c: pre + "-1907", ph: s.cust[5].ph, used: false }];
    /* أرقام التقارير (30 يوم) */
    var hw = [.05, .03, .02, .02, .02, .03, .15, .5, 1.4, 2.6, 3.4, 3.1, 2.6, 2.4, 2.2, 2.3, 2.8, 3.6, 4.4, 4.8, 4.2, 3.1, 1.6, .5];
    if (id === "friends") hw = [.6, .3, .1, .05, .05, .05, .1, .2, .4, .8, 1.2, 1.8, 2.8, 3.2, 2.6, 2.2, 2.4, 3.2, 4.2, 4.9, 5.2, 4.6, 3.4, 1.8];
    s.hours = hw.map(function (w) { return w * (.9 + r() * .2); });
    s.days = [1, .82, .84, .9, 1.1, 1.5, 1.4].map(function (w) { return w * (.92 + r() * .16); });
    return s;
  }
  function mkOrder(s, r, stt, mode) {
    var pool = s.items.filter(function (x) { return x.on; });
    var a = pick(r, pool), bb = pick(r, pool.filter(function (x) { return x.s !== a.s; }));
    var lines = [{ id: a.id, n: a.n, q: 1 + (r() > .7 ? 1 : 0), p: a.p, add: [] }];
    if (r() > .35) lines.push({ id: bb.id, n: bb.n, q: 1, p: bb.p, add: [], up: r() > .5 });
    var o = { no: ++s.no, st: stt, mode: mode, table: 1 + Math.floor(r() * s.tables), name: pick(r, NAMES), ph: mask(r), lines: lines, at: Date.now(), src: "seed" };
    o.tot = tot(o);
    return o;
  }
  function tot(o) { return o.lines.reduce(function (a, l) { return a + (l.p + (l.add || []).reduce(function (x, y) { return x + y.p; }, 0)) * l.q; }, 0) + (o.mode === "deliv" ? 10 : 0); }

  function mkGym() {
    var b = S.brands.cezar, r = rng(4242), now = Date.now();
    var M = [["1024", "محمود سمير", "m", "bronze", 11, 19, "b1"], ["1088", "سارة محمد", "f", "plat", 14, 23, "b2"], ["1102", "كريم عادل", "m", "silver", 0, 6, "b1"], ["1131", "نورهان علي", "f", "gold", 9, 12, "b2"],
      ["1145", "أحمد حسن", "m", "gold", 3, 2, "b2"], ["1167", "يوسف طارق", "m", "power", 5, 4, "b1"], ["1180", "منة الله أحمد", "f", "bronze", 7, 15, "b2"], ["1193", "عمر خالد", "m", "vip", 22, 26, "b2"],
      ["1207", "ياسمين حسام", "f", "silver", 2, -3, "b1"], ["1219", "مصطفى ناصر", "m", "plat", 12, 21, "b1"], ["1233", "حازم رضا", "m", "bronze", 6, 5, "b2"], ["1246", "إسلام فتحي", "m", "top", 18, 24, "b2"],
      ["1258", "مريم أشرف", "f", "power", 4, 9, "b1"], ["1271", "زياد وليد", "m", "silver", 10, 17, "b1"], ["1283", "هبة سامي", "f", "bronze", 8, 3, "b2"], ["1296", "علي جمال", "m", "gold", 15, 20, "b1"]];
    var plans = {}; b.plans.forEach(function (p) { plans[p.id] = p; });
    var mem = M.map(function (m, i) {
      return { code: m[0], n: m[1], g: m[2], plan: m[3], total: plans[m[3]].s, left: m[4], exp: now + m[5] * DAY, br: m[6], frozen: m[0] === "1131", debt: m[0] === "1233" ? 400 : m[0] === "1167" ? 250 : 0, last: now - (1 + Math.floor(r() * 12)) * DAY, absent: m[0] === "1219" || m[0] === "1271", visits: Array.from({ length: 12 }, function () { return r() > .4; }) };
    });
    return {
      id: "cezar", b: b, gym: true, mod: "checkin", branch: "all", mfil: "all", open: null, frz: 14, plansBr: "b2",
      mem: mem, plans: plans, sel: "1024", code: "", res: null, log: [], lastIn: null,
      cash: { rows: [["اشتراك برونز — حازم رضا", 800, "in"], ["بوفيه — واي بروتين", 120, "in"], ["تمرين منفصل", 150, "in"], ["اشتراك جولد — علي جمال", 850, "in"], ["صيانة تريدميل #3", 350, "out"], ["بوفيه — مياه ومشروبات", 85, "in"], ["كهربا — دفعة", 600, "out"]], drawer: "", closed: null },
      msgs: { list: "soon", tpl: "أهلاً يا {الاسم}، اشتراكك في سيزر باقي عليه {الأيام} و{الجلسات}. جدّد من الريسبشن وخلّي مكانك محجوز.", sent: 0, note: null },
      cls: [["10:00 ص", "يوجا", "سيدات · الفرع التاني", 6, 10], ["5:00 م", "زومبا", "سيدات · الفرع التاني", 18, 20], ["6:00 م", "كروس فيت", "رجالة · الفرع الأول", 12, 15], ["8:00 م", "ملاكمة", "رجالة · الفرع التاني", 11, 12]].map(function (c) { return { t: c[0], n: c[1], sub: c[2], in: c[3], cap: c[4] }; }),
      role: "owner", tour: {}
    };
  }

  /* حالة العضو */
  function mstat(m) {
    var now = Date.now();
    if (m.frozen) return "frz";
    if (m.left <= 0 || m.exp < now) return "exp";
    if (m.exp - now < 7 * DAY || m.left <= 3) return "soon";
    return "ok";
  }
  var MST = { ok: ["ساري", "t-done"], soon: ["بيخلص قريب", "t-conf"], exp: ["خلص", "t-new"], frz: ["متجمّد", "t-prep"] };
  function fdate(ms) { var x = new Date(ms); return x.getDate() + " " + ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"][x.getMonth()]; }
  function ftime(ms) { var x = new Date(ms), h = x.getHours(), m = x.getMinutes(); return (h % 12 || 12) + ":" + (m < 10 ? "0" : "") + m + (h < 12 ? " ص" : " م"); }

  /* فترات الفرع التاني (من بوستره) — بالدقايق من نص الليل، وأكبر من 1440 = بتكمّل لبكرة */
  var SCHED = {
    A: { m: [[420, 540], [840, 1860]], f: [[540, 840]] },   /* سبت · إتنين · أربع */
    B: { m: [[420, 960], [1260, 1860]], f: [[960, 1260]] }, /* حد · تلات · خميس */
    F: { m: [[960, 1440]], f: [[720, 960]] }                /* جمعة */
  };
  function dayKey(dw) { return dw === 5 ? "F" : [6, 1, 3].indexOf(dw) > -1 ? "A" : "B"; }
  function period(t) {
    var x = new Date(t || Date.now()), mins = x.getHours() * 60 + x.getMinutes(), dw = x.getDay();
    var check = function (k, mm) { var s = SCHED[k]; for (var g in s) for (var i = 0; i < s[g].length; i++) if (mm >= s[g][i][0] && mm < s[g][i][1]) return g; return null; };
    return check(dayKey(dw), mins) || check(dayKey((dw + 6) % 7), mins + 1440) || "x";
  }

  /* ======================================================================
     الجولة
     ====================================================================== */
  var TOUR = {
    cafe: [
      { k: "order", mod: "orders", t: "ابعت طلب من موبايل الزبون", h: "دوس «+» على أي صنف في الموبايل وابعته — أو «طلب تجريبي» هنا.", f: "الطلب بيوصلك مكتوب ومتحسب بجرس، من غير مكالمات ولا غلط." },
      { k: "advance", mod: "orders", t: "حرّك الطلب: ابدأ التجهيز ← اتسلّم", h: "من كارت الطلب الجديد.", f: "الزبون عارف طلبه فين، وإنت عارف إيه اللي اتأخر." },
      { k: "offer", mod: "offers", t: "غيّر صورة العرض ودوس «انشر»", h: "اختار صورة تانية وغيّر السعر لو تحب.", f: "المنيو بيتغيّر عند كل الزباين في نفس اللحظة." },
      { k: "sold", mod: "menu", t: "اقفل صنف خلص", h: "من مفتاح «متاح» جنب أي صنف.", f: "محدش يطلب حاجة مش موجودة." },
      { k: "price", mod: "menu", t: "غيّر سعر أي صنف", h: "اكتب السعر الجديد ودوس Enter.", f: "من غير ما تطبع منيو جديد." },
      { k: "complaint", mod: "reviews", t: "قيّم من الموبايل بنجمتين", h: "من «قيّمنا» تحت في الموبايل، واكتب سبب.", f: "الشكوى بتوصلك إنت الأول، مش لجوجل." },
      { k: "numbers", mod: "home", t: "شوف الأرقام", h: "افتح «الرئيسية».", f: "تعرف إيه اللي بيكسب، وإيه اللي محتاج قرار منك." }
    ],
    gym: [
      { k: "checkin", mod: "checkin", t: "سجّل دخول عضو بكوده", h: "اكتب 1024 أو اختار من الأكواد السريعة.", f: "الجلسة بتتخصم لوحدها، وموبايل العضو بيتحدّث." },
      { k: "freeze", mod: "members", t: "جمّد اشتراك عضو", h: "افتح أي عضو ودوس «جمّد».", f: "تاريخ الانتهاء بيتمد لوحده — من غير حسابات." },
      { k: "msg", mod: "msgs", t: "ابعت رسالة للي اشتراكهم بيخلص", h: "القايمة جاهزة والرسالة باسم كل عضو.", f: "تجديد أكتر، من غير ما حد يفتكر." },
      { k: "branch", mod: "home", t: "بدّل بين الفرعين", h: "من المفتاح اللي فوق في لوحة القيادة.", f: "تشوف كل فرع لوحده أو الاتنين مع بعض." },
      { k: "close", mod: "cash", t: "قفّل اليوم", h: "اكتب اللي في الدرج ودوس «قفّل».", f: "تعرف الفرق في نفس اليوم، مش آخر الشهر." }
    ]
  };
  function steps() { return TOUR[st.gym ? "gym" : "cafe"]; }
  function done(k) {
    if (st.tour[k]) return;
    var s = steps().filter(function (x) { return x.k === k; })[0];
    if (!s) return;
    st.tour[k] = true;
    toast("تمام — " + s.t, s.f);
    renderCoach();
  }

  /* ======================================================================
     الهيكل
     ====================================================================== */
  var NAV = {
    cafe: [
      ["التشغيل", [["home", "home", "الرئيسية"], ["orders", "receipt", "الطلبات"], ["menu", "book", "المنيو"], ["offers", "tag", "العروض"]]],
      ["الزباين", [["loyal", "gift", "الولاء"], ["reviews", "star", "التقييمات"], ["customers", "users", "العملاء"]]],
      ["التحكم", [["guard", "shield", "الحماية"], ["pay", "wallet", "الدفع"], ["qr", "qr", "QR والطاولات"], ["brand", "palette", "الهوية"], ["reports", "chart", "التقارير"]]]
    ],
    gym: [
      ["التشغيل", [["home", "home", "لوحة القيادة"], ["checkin", "door", "الدخول والحضور"], ["members", "users", "الأعضاء"], ["classes", "calendar", "الحصص"]]],
      ["الفلوس", [["plans", "tag", "الباقات والأسعار"], ["cash", "cash", "الخزنة"]]],
      ["التواصل والإدارة", [["msgs", "msg", "مركز الرسايل"], ["roles", "lock", "الصلاحيات"]]]
    ]
  };
  var ROLE_MODS = { owner: null, manager: ["home", "checkin", "members", "classes", "plans", "cash", "msgs", "roles"], reception: ["checkin", "members", "classes", "roles"] };

  function bmark(b) {
    if (b.mark) return '<span class="lx__bm" style="background:#fff"><img src="' + b.mark + '" alt=""></span>';
    if (b.id === "friends") return '<span class="lx__bm" style="background:#141210"><svg viewBox="0 0 100 92" width="22" height="20"><path d="M6 14C34-4 74 0 95 22L64 36C54 27 42 26 33 32L46 88Z" fill="#F97316"/></svg></span>';
    if (b.id === "cezar") return '<span class="lx__bm" style="background:#17181C;color:#BEF23C">CZ</span>';
    return '<span class="lx__bm" style="background:' + b.t.bg + ';color:' + b.t.pri + ';font-family:var(--ar);font-weight:800;font-size:15px">' + esc(b.name.slice(0, 2)) + "</span>";
  }
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return "rgba(" + (n >> 16) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }

  function renderAll() {
    var b = st.b;
    root.innerHTML =
      '<div class="lx' + (st.gym ? " gym" : "") + '" id="lx">' +
        '<div class="lx__brands" role="tablist" aria-label="اختار المكان">' + S.order.map(function (id) {
          var x = S.brands[id];
          return '<button type="button" role="tab" aria-selected="' + (id === st.id) + '" class="' + (id === st.id ? "on" : "") + '" data-act="brand" data-v="' + id + '">' + bmark(x) + "<span><b>" + esc(x.name) + "</b><small>" + esc(x.tag) + " · " + (x.type === "gym" ? "8 وحدات" : "12 وحدة") + "</small></span></button>";
        }).join("") + "</div>" +
        '<div class="coach" id="coach"></div>' +
        '<div class="lx__body">' +
          '<div class="win"><div class="win__bar"><i></i><i></i><i></i><span class="win__url">' + IC("lock") + (st.gym ? "نظام الإدارة" : "لوحة صاحب المكان") + " — " + esc(b.name) + '</span><span class="win__live"><i></i><span>مباشر · بيانات تجريبية</span></span></div>' +
            '<div class="win__app"><nav class="side" id="side" aria-label="أقسام اللوحة"></nav><div class="main" id="main" tabindex="-1"></div></div></div>' +
          '<div class="lx__phone" id="lphone"><button class="lx__phx" type="button" data-act="phclose" aria-label="اقفل">' + IC("x") + '</button><div class="lph"><div class="lph__s" id="lphs"></div></div><p class="lx__phcap" id="phcap">' + (st.gym ? "موبايل العضو · <b>بيتحدّث لوحده</b>" : "موبايل الزبون · <b>بيتحدّث لوحده</b>") + "</p></div>" +
        "</div>" +
      "</div>";
    applyAccent();
    renderSide(); renderMain(); renderPhone(); renderCoach();
  }
  function applyAccent() {
    var lx = $("#lx"); if (!lx || st.gym) return;
    var c = st.look.c;
    lx.style.setProperty("--ac", c); lx.style.setProperty("--acs", hexA(c, .12)); lx.style.setProperty("--acon", "#fff");
  }
  function visibleMods() {
    var all = [];
    NAV[st.gym ? "gym" : "cafe"].forEach(function (g) { g[1].forEach(function (n) { all.push(n[0]); }); });
    if (st.gym && ROLE_MODS[st.role]) all = all.filter(function (m) { return ROLE_MODS[st.role].indexOf(m) > -1; });
    return all;
  }
  function badge(m) {
    if (st.gym) {
      if (m === "members") return st.mem.filter(function (x) { var s = mstat(x); return s === "soon" || s === "exp"; }).length;
      return 0;
    }
    if (m === "orders") return st.orders.filter(function (o) { return o.st === "new"; }).length;
    if (m === "reviews") return st.rev.list.filter(function (x) { return !x.done; }).length;
    if (m === "guard") return st.guard.queue.length;
    if (m === "pay") return st.pay.wait.length;
    return 0;
  }
  function renderSide() {
    var b = st.b, vis = visibleMods(), cur = stepNow();
    $("#side").innerHTML = '<div class="side__brand">' + bmark(b) + "<div><b>" + esc(st.gym ? b.name : st.look.name) + "</b><small>" + (st.gym ? (st.role === "owner" ? "صاحب الجيم" : st.role === "manager" ? "مدير فرع" : "ريسبشن") : "صاحب المكان") + "</small></div></div>" +
      NAV[st.gym ? "gym" : "cafe"].map(function (g) {
        var its = g[1].filter(function (n) { return vis.indexOf(n[0]) > -1; });
        if (!its.length) return "";
        return '<p class="side__g">' + g[0] + "</p>" + its.map(function (n) {
          var bd = badge(n[0]);
          return '<button type="button" class="nav-i' + (st.mod === n[0] ? " on" : "") + (cur && cur.mod === n[0] && st.mod !== n[0] ? " pulse" : "") + '" data-act="mod" data-v="' + n[0] + '">' + IC(n[1]) + n[2] + (bd ? "<em>" + bd + "</em>" : "") + "</button>";
        }).join("");
      }).join("");
  }
  function go(mod) {
    st.mod = mod;
    renderSide(); renderMain();
    var m = $("#main"); if (m) m.scrollTop = 0;
    if (!st.gym && mod === "home") done("numbers");
    var on = $("#side .nav-i.on");
    if (on && mobile()) on.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  /* ======================================================================
     الجولة (الشريط الأسود)
     ====================================================================== */
  function stepNow() { var ss = steps(); for (var i = 0; i < ss.length; i++) if (!st.tour[ss[i].k]) return ss[i]; return null; }
  function renderCoach() {
    var c = $("#coach"); if (!c) return;
    var ss = steps(), cur = stepNow(), n = ss.filter(function (s) { return st.tour[s.k]; }).length;
    c.classList.toggle("is-done", !cur);
    c.innerHTML = cur ?
      '<span class="coach__n">' + (n + 1) + "/" + ss.length + '</span><div class="coach__t"><b>' + esc(cur.t) + "</b><small>" + esc(cur.h) + " — " + esc(cur.f) + "</small></div>" +
      '<div class="coach__a"><button class="coach__go" type="button" data-act="coach">ورّيني فين</button><button class="coach__sk" type="button" data-act="skip">تخطّي</button></div>' :
      '<span class="coach__n">' + IC("check") + '</span><div class="coach__t"><b>خلّصت الجولة — ودي مش كل حاجة.</b><small>كل مكان بيتبني له سيستم على قد شغله هو.</small></div>' +
      '<div class="coach__a"><a class="coach__go" href="#benefits">شوف الفوايد</a><button class="coach__sk" type="button" data-act="retour">من الأول</button></div>';
    c.innerHTML += '<div class="coach__dots">' + ss.map(function (s) { return '<i class="' + (st.tour[s.k] ? "on" : cur && s.k === cur.k ? "cur" : "") + '"></i>'; }).join("") + "</div>";
    renderSide();
  }

  /* ======================================================================
     الوحدات — كافيه/مطعم
     ====================================================================== */
  function cur$(v) { return n2(v) + " " + (st.b.cur || "ر.س"); }
  function mh(t, p, a) { return '<div class="mh"><div><h3>' + t + "</h3>" + (p ? "<p>" + p + "</p>" : "") + '</div><div class="mh__a">' + (a || "") + "</div></div>"; }
  var MODE = { table: "طاولة", take: "سفري", deliv: "توصيل" };
  var STT = { "new": ["جديد", "t-new"], prep: ["في التحضير", "t-prep"], done: ["اتسلّم", "t-done"], x: ["ملغي", "t-x"], conf: ["محتاج تأكيد", "t-conf"], pay: ["مستني الدفع", "t-pay"] };
  function modeChip(o) { return '<span class="chip2">' + (o.mode === "table" ? "طاولة " + o.table : o.mode === "take" ? "سفري · " + esc(o.name) : "توصيل · " + esc(o.name)) + "</span>"; }
  function orderCard(o, acts) {
    return '<div class="oc' + (o.fresh ? " is-new" : "") + '" data-o="' + o.no + '"><div class="oc__t"><b>#D' + o.no + '</b><span class="tag2 ' + STT[o.st][1] + '">' + STT[o.st][0] + "</span>" + modeChip(o) + (o.src === "phone" ? '<span class="chip2">' + IC("mobile") + "من الموبايل</span>" : "") + "<time>" + ago(o.at) + "</time></div>" +
      o.lines.map(function (l) { return '<div class="oc__l"><span>' + esc(l.n) + (l.q > 1 ? " ×" + l.q : "") + (l.add && l.add.length ? " + " + l.add.map(function (a) { return esc(a.n); }).join("، ") : "") + (l.up ? " <small>· يمشي معاه</small>" : "") + "</span><span>" + n2((l.p + (l.add || []).reduce(function (x, y) { return x + y.p; }, 0)) * l.q) + "</span></div>"; }).join("") +
      (o.flag ? '<div class="note2">' + IC("alert") + "<span>" + esc(o.flag) + " — اتصل وأكّد قبل ما يدخل المطبخ.</span></div>" : "") +
      (o.ref ? '<div class="note2">' + IC("wallet") + "<span>" + esc(o.via) + " · رقم العملية بينتهي بـ <b class=\"num\">" + esc(o.ref) + "</b> — اتأكد من إشعار محفظتك.</span></div>" : "") +
      '<div class="oc__f"><span class="tot">' + cur$(o.tot) + "</span><div>" + (acts || "") + "</div></div></div>";
  }
  function orderActs(o) {
    var pr = '<button type="button" class="b sm gh" data-act="rcpt" data-v="' + o.no + '">' + IC("printer") + "طباعة</button>";
    if (o.st === "new") return pr + '<button type="button" class="b sm no" data-act="ost" data-v="' + o.no + '" data-s="x">إلغاء</button><button type="button" class="b sm" data-act="ost" data-v="' + o.no + '" data-s="prep" data-tour="advance">ابدأ التجهيز</button>';
    if (o.st === "prep") return pr + '<button type="button" class="b sm ok" data-act="ost" data-v="' + o.no + '" data-s="done" data-tour="advance">' + IC("check") + "اتسلّم</button>";
    if (o.st === "done") return pr;
    return "";
  }

  var MODS = {};
  MODS.home = function () {
    var h = new Date().getHours();
    var live = st.orders.filter(function (o) { return o.src === "phone" || o.src === "demo"; });
    var liveOk = live.filter(function (o) { return o.st !== "x"; });
    var sales = st.today.sales + liveOk.reduce(function (a, o) { return a + o.tot; }, 0);
    var orders = st.today.orders + liveOk.length;
    var up = st.today.up + liveOk.reduce(function (a, o) { return a + o.lines.filter(function (l) { return l.up; }).reduce(function (x, l) { return x + l.p * l.q; }, 0); }, 0);
    var decs = [];
    var nw = st.orders.filter(function (o) { return o.st === "new"; }).length;
    if (nw) decs.push(["receipt", "<b>" + nw + " طلب جديد</b> مستني حد يبدأه", "orders"]);
    if (st.guard.queue.length) decs.push(["shield", "<b>" + st.guard.queue.length + " طلب</b> محتاج مكالمة تأكيد", "guard"]);
    if (st.pay.wait.length) decs.push(["wallet", "<b>" + st.pay.wait.length + " تحويل</b> مستني تأكيد الفلوس", "pay"]);
    var cm = st.rev.list.filter(function (x) { return !x.done; }).length;
    if (cm) decs.push(["star", "<b>" + cm + " شكاوى</b> اتلمّت قبل ما توصل جوجل", "reviews"]);
    var dead = st.items.filter(function (i) { return i.v < 40; }).length;
    if (dead) decs.push(["eye", "<b>" + dead + " صنف</b> محدش فتحه من أسبوعين — شيله أو صوّره تاني", "reports"]);
    var off = st.items.filter(function (i) { return !i.on; }).length;
    if (off) decs.push(["ban", "<b>" + off + " صنف</b> مقفول دلوقتي في المنيو", "menu"]);
    return mh(h < 12 ? "صباح الخير" : "مساء الخير", "أهم اللي بيحصل في " + esc(st.look.name) + " النهارده", '<span class="demo-chip"><i></i>بيانات تجريبية</span>') +
      '<div class="grid2" style="grid-template-columns:1.4fr 1fr"><div class="kp hero-k"><small>مبيعات النهارده</small><b>' + n2(sales) + "<span>" + st.b.cur + '</span></b><i class="up">▲ 12% عن نفس اليوم الأسبوع اللي فات</i></div>' +
      '<div class="kp"><small>منها من «يمشي معاه» والإضافات</small><b>' + n2(up) + "<span>" + st.b.cur + '</span></b><i class="up">' + Math.round(up / sales * 100) + "% من المبيعات</i></div></div>" +
      '<div class="grid4" style="margin-top:12px"><div class="kp"><small>طلبات النهارده</small><b>' + orders + '</b></div><div class="kp"><small>متوسط الفاتورة</small><b>' + n2(sales / orders) + "<span>" + st.b.cur + '</span></b></div><div class="kp"><small>زوار المنيو</small><b>' + n2(st.today.visitors + live.length * 3) + '</b></div><div class="kp"><small>تقييم جوجل</small><b>4.7<span>★</span></b></div></div>' +
      '<div class="c" style="margin-top:12px"><h4>' + IC("bolt") + 'محتاج قرار منك</h4><p class="sub">اللوحة بتقولك تعمل إيه — مش بس أرقام.</p><div style="margin-top:10px">' +
        (decs.length ? decs.map(function (x) { return '<div class="dec2">' + IC(x[0]) + "<div>" + x[1] + '</div><button type="button" class="b sm gh" data-act="mod" data-v="' + x[2] + '">افتح</button></div>'; }).join("") : '<p class="empty">مفيش حاجة مستنياك. كله تمام.</p>') +
      "</div></div>" +
      '<div class="c"><h4>' + IC("receipt") + "آخر الطلبات</h4>" + st.orders.slice(0, 3).map(function (o) { return '<div class="row"><div class="row__t"><b class="num">#D' + o.no + " · " + cur$(o.tot) + "</b><small>" + o.lines.map(function (l) { return esc(l.n); }).join(" · ") + '</small></div><span class="tag2 ' + STT[o.st][1] + '">' + STT[o.st][0] + "</span></div>"; }).join("") + "</div>";
  };

  MODS.orders = function () {
    var f = st.ofil, list = st.orders.filter(function (o) { return f === "all" || o.st === f; });
    var cnt = function (s) { return st.orders.filter(function (o) { return o.st === s; }).length; };
    var segs = [["all", "الكل", st.orders.length], ["new", "جديد", cnt("new")], ["prep", "في التحضير", cnt("prep")], ["done", "اتسلّم", cnt("done")], ["x", "ملغي", cnt("x")]];
    return mh("الطلبات", "بتوصل لحظيًا من الطاولات والسفري والتوصيل",
      '<button type="button" class="b sm gh bellb' + (st.ring ? " ring" : "") + '" data-act="sound" aria-label="صوت الطلبات">' + IC(st.sound ? "bell" : "ban") + (st.sound ? "الجرس شغّال" : "الجرس مقفول") + (cnt("new") ? "<em>" + cnt("new") + "</em>" : "") + "</button>" +
      '<button type="button" class="b sm" data-act="demo-order" data-tour="order">' + IC("plus") + "طلب تجريبي</button>") +
      '<div class="seg" style="margin-bottom:12px">' + segs.map(function (s) { return '<button type="button" class="' + (f === s[0] ? "on" : "") + '" data-act="ofil" data-v="' + s[0] + '">' + s[1] + "<em>" + s[2] + "</em></button>"; }).join("") + "</div>" +
      (list.length ? list.map(function (o) { return orderCard(o, orderActs(o)); }).join("") : '<p class="empty">مفيش طلبات هنا.</p>') +
      '<p class="sub" style="margin-top:12px;font-size:12px;color:var(--mut)">الملغي مش بيتحسب في المبيعات. والطلب اللي «محتاج تأكيد» أو «مستني الدفع» بيظهر في «الحماية» و«الدفع» لحد ما يتأكد.</p>';
  };

  MODS.menu = function () {
    var b = st.b, sec = st.msec;
    var list = st.items.filter(function (i) { return sec === "all" || i.s === sec; });
    var pics = uniq(st.items.map(function (i) { return i.im; })).slice(0, 12);
    var form = st.adding ? '<div class="newf"><h4 style="font-size:14.5px;font-weight:600">صنف جديد</h4><div class="grid2"><div class="fld2"><label class="lbl" for="nwN">الاسم</label><input class="inp" id="nwN" placeholder="مثلًا: لاتيه بندق"></div><div class="grid2" style="grid-template-columns:1fr 1fr"><div class="fld2"><label class="lbl" for="nwP">السعر</label><input class="inp price" id="nwP" inputmode="numeric" value="18" style="width:100%"></div><div class="fld2"><label class="lbl" for="nwS">القسم</label><select class="inp" id="nwS">' + b.secs.map(function (s) { return '<option value="' + s.id + '">' + s.t + "</option>"; }).join("") + "</select></div></div></div>" +
      '<div><span class="lbl">الصورة</span><div class="pics">' + pics.map(function (p) { return '<button type="button" class="' + (st.newPic === p ? "on" : "") + '" data-act="npic" data-v="' + p + '"><img src="' + img(p) + '" alt=""></button>'; }).join("") + '</div></div><div style="display:flex;gap:8px"><button type="button" class="b" data-act="additem">' + IC("check") + 'أضف للمنيو</button><button type="button" class="b gh" data-act="addcancel">إلغاء</button></div></div>' : "";
    return mh("المنيو", st.items.length + " صنف · " + b.secs.length + " أقسام — أي تغيير بيظهر عند الزبون فورًا", '<button type="button" class="b sm" data-act="addopen">' + IC("plus") + "صنف جديد</button>") + form +
      '<div class="seg" style="margin-bottom:6px">' + [["all", "الكل"]].concat(b.secs.map(function (s) { return [s.id, s.t]; })).map(function (s) { return '<button type="button" class="' + (sec === s[0] ? "on" : "") + '" data-act="msec" data-v="' + s[0] + '">' + s[1] + "</button>"; }).join("") + "</div>" +
      '<div class="c" style="padding-block:4px">' + list.map(function (it) {
        return '<div class="mi' + (it.on ? "" : " off") + '"><img src="' + img(it.im) + '" alt=""><div class="row__t"><b>' + esc(it.n) + (it.nw ? ' <span class="tag2 t-done">جديد</span>' : "") + "</b><small>" + esc(it.d || "") + "</small></div>" +
          '<select aria-label="بادج" data-chg="badge" data-v="' + it.id + '"><option value=""' + (!it.b ? " selected" : "") + '>من غير بادج</option><option value="hot"' + (it.b === "hot" ? " selected" : "") + '>الأكثر طلبًا</option><option value="chef"' + (it.b === "chef" ? " selected" : "") + ">" + (b.type === "rest" ? "اختيار الشيف" : "اختيار الباريستا") + "</option></select>" +
          '<input class="inp price" inputmode="numeric" aria-label="السعر" value="' + it.p + '" data-chg="price" data-v="' + it.id + '" data-tour="price">' +
          '<span class="tgw"><span class="st">' + (it.on ? "متاح" : "خلص") + '</span><button type="button" class="tg2' + (it.on ? " on" : "") + '" role="switch" aria-checked="' + it.on + '" aria-label="متاح" data-act="avail" data-v="' + it.id + '" data-tour="sold"></button></span></div>';
      }).join("") + "</div>";
  };
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

  MODS.offers = function () {
    var b = st.b, o = st.draft || (st.draft = JSON.parse(JSON.stringify(st.offer)));
    var pics = uniq(b.offers.map(function (x) { return x.im; }).concat(st.items.filter(function (i) { return i.b; }).map(function (i) { return i.im; }))).slice(0, 8);
    var H = []; for (var h = 0; h < 24; h++) H.push(h);
    var hl = function (h) { return (h % 12 || 12) + (h < 12 ? " الصبح" : h < 17 ? " الضهر" : " بالليل"); };
    return mh("العروض", "اللي بيظهر فوق في المنيو — بيفتح ويقفل لوحده في مواعيده",
      '<span style="display:inline-flex;align-items:center;gap:8px;font-size:13px">' + (st.offer.on ? "العرض شغّال" : "العرض مقفول") + '<button type="button" class="tg2' + (st.offer.on ? " on" : "") + '" role="switch" aria-checked="' + st.offer.on + '" aria-label="تشغيل العرض" data-act="offon"></button></span>') +
      '<div class="grid2"><div><div class="ofp"><img src="' + img(o.im) + '" alt=""><div><b>' + esc(o.t) + "</b><span>" + o.p + " " + b.cur + "</span><s>" + o.was + '</s></div></div><span class="lbl" style="margin-top:12px">صورة العرض</span><div class="pics" data-tour="offer">' +
        pics.map(function (p) { return '<button type="button" class="' + (o.im === p ? "on" : "") + '" data-act="opic" data-v="' + p + '"><img src="' + img(p) + '" alt=""></button>'; }).join("") + "</div></div>" +
      '<div style="display:grid;gap:10px;align-content:start"><div class="fld2"><label class="lbl" for="ofT">اسم العرض</label><input class="inp" id="ofT" value="' + esc(o.t) + '" data-in="ot"></div>' +
        '<div class="fld2"><label class="lbl" for="ofD">فيه إيه</label><input class="inp" id="ofD" value="' + esc(o.d) + '" data-in="od"></div>' +
        '<div class="grid2" style="grid-template-columns:1fr 1fr"><div class="fld2"><label class="lbl" for="ofP">السعر</label><input class="inp price" style="width:100%" id="ofP" inputmode="numeric" value="' + o.p + '" data-in="op"></div><div class="fld2"><label class="lbl" for="ofW">بدل</label><input class="inp price" style="width:100%" id="ofW" inputmode="numeric" value="' + o.was + '" data-in="ow"></div></div>' +
        '<div class="grid2" style="grid-template-columns:1fr 1fr"><div class="fld2"><label class="lbl" for="ofF">بيفتح</label><select class="inp" id="ofF" data-in="of">' + H.map(function (h) { return '<option value="' + h + '"' + (o.from === h ? " selected" : "") + ">" + hl(h) + "</option>"; }).join("") + '</select></div><div class="fld2"><label class="lbl" for="ofTo">بيقفل</label><select class="inp" id="ofTo" data-in="oto">' + H.map(function (h) { return '<option value="' + h + '"' + (o.to === h ? " selected" : "") + ">" + hl(h) + "</option>"; }).join("") + "</select></div></div>" +
        '<button type="button" class="b" style="height:42px" data-act="publish" data-tour="offer">' + IC("send") + "انشر العرض عند كل الزباين</button></div></div>" +
      '<div class="c" style="margin-top:14px"><h4>' + IC("layers") + 'الكومبوهات</h4><p class="sub">عروض مجمّعة بسعر قبل وبعد — الزبون بيشوف التوفير مكتوب.</p>' +
        b.offers.map(function (x) { return '<div class="combo"><img src="' + img(x.im) + '" alt=""><div class="row__t"><b>' + esc(x.t) + "</b><small>" + esc(x.d) + '</small></div><div style="text-align:left"><b class="num" style="display:block">' + x.p + " " + b.cur + '</b><span class="sv">وفّر ' + (x.was - x.p) + "</span></div></div>"; }).join("") + "</div>";
  };

  MODS.loyal = function () {
    var L = st.loy, b = st.b;
    return mh("كارت الولاء", "الختم بيتحسب لما الكاشير يسلّم الطلب — مش لما الزبون يضغط") +
      '<div class="grid2"><div class="c"><h4>' + IC("gift") + 'إعدادات الكارت</h4><div class="row"><div class="row__t"><b>عدد الأختام</b><small>للمكافأة</small></div><span class="stp"><button type="button" data-act="lgoal" data-v="-1" aria-label="أقل">' + IC("minus") + "</button><span>" + L.goal + '</span><button type="button" data-act="lgoal" data-v="1" aria-label="أكتر">' + IC("plus") + "</button></span></div>" +
        '<div class="row"><div class="row__t"><b>المكافأة</b></div><input class="inp" style="max-width:200px" value="' + esc(L.reward) + '" data-in="lrew" aria-label="المكافأة"></div>' +
        '<div class="row"><div class="row__t"><b>أقل فاتورة للختم</b><small>عشان محدش يجمع أختام بطلبات صغيرة</small></div><span class="stp"><button type="button" data-act="lmin" data-v="-5">' + IC("minus") + "</button><span>" + L.min + '</span><button type="button" data-act="lmin" data-v="5">' + IC("plus") + "</button></span></div>" +
        '<div class="row"><div class="row__t"><b>ختم واحد في اليوم</b><small>نفس الرقم مياخدش أكتر من ختم</small></div><button type="button" class="tg2' + (L.perDay ? " on" : "") + '" role="switch" aria-checked="' + L.perDay + '" data-act="lday" aria-label="ختم واحد في اليوم"></button></div></div>' +
      '<div class="c"><h4>' + IC("key") + 'اصرف مكافأة</h4><p class="sub">الزبون بيوري الكود للكاشير، والكود بيتصرف مرة واحدة بس.</p><div style="display:flex;gap:8px;margin-top:10px"><input class="inp num" style="direction:ltr;text-align:left" placeholder="XX-0000" value="' + esc(L.code) + '" data-in="lcode" aria-label="الكود"><button type="button" class="b" data-act="redeem">اصرف</button></div>' +
        '<p class="lbl" style="margin-top:14px">أكواد مستنية تتصرف</p>' + L.codes.map(function (c) { return '<div class="row"><div class="row__t"><b class="num" style="direction:ltr;text-align:right">' + c.c + '</b><small><span class="mask">' + c.ph + "</span></small></div>" + (c.used ? '<span class="tag2 t-done">' + IC("check") + "اتصرف</span>" : '<button type="button" class="b sm gh" data-act="fillcode" data-v="' + c.c + '">استخدمه</button>') + "</div>"; }).join("") + "</div></div>" +
      '<div class="c"><h4>' + IC("users") + "الكروت</h4>" + L.cards.map(function (c) { return '<div class="row"><span class="mask">' + c.ph + '</span><div class="lbar" style="flex:1"><i style="width:' + Math.round(c.n / L.goal * 100) + '%"></i></div><b class="num" style="min-width:44px;text-align:left">' + c.n + "/" + L.goal + '</b><small style="color:var(--mut);font-size:12px;min-width:74px">' + ago(c.last) + "</small></div>"; }).join("") + "</div>";
  };

  MODS.reviews = function () {
    var R = st.rev, open = R.list.filter(function (x) { return !x.done; }).length;
    return mh("التقييمات", R.th + " نجوم وأكتر بتروح لجوجل · أقل من كده بتوصلك هنا", '<div class="seg">' + [3, 4, 5].map(function (n) { return '<button type="button" class="' + (R.th === n ? "on" : "") + '" data-act="rth" data-v="' + n + '">' + n + "★ وأكتر لجوجل</button>"; }).join("") + "</div>") +
      '<div class="grid3"><div class="kp"><small>اتحوّلوا لجوجل</small><b>' + R.google + '</b></div><div class="kp"><small>شكاوى اتلمّت قبل جوجل</small><b>' + R.caught + '</b></div><div class="kp"><small>مستنية رد</small><b>' + open + "</b></div></div>" +
      '<div class="c" style="margin-top:12px"><h4>' + IC("msg") + "الشكاوى</h4>" + (R.list.length ? R.list.map(function (x, i) {
        return '<div class="row' + (x.fresh ? " hl" : "") + '"><div class="row__t"><b>' + esc(x.t) + '</b><small><span class="stars2">' + "★".repeat(x.st) + "<s>" + "★".repeat(5 - x.st) + '</s></span> · <span class="mask">' + x.ph + "</span> · " + ago(x.at) + "</small></div>" +
          (x.done ? '<span class="tag2 t-done">' + IC("check") + "اتحلّت</span>" : '<button type="button" class="b sm gh" data-act="call">' + IC("phone") + 'اتصل</button><button type="button" class="b sm ok" data-act="rdone" data-v="' + i + '">' + IC("check") + "اتحلّت</button>") + "</div>";
      }).join("") : '<p class="empty">مفيش شكاوى.</p>') + "</div>";
  };

  MODS.customers = function () {
    var now = Date.now(), sg = st.seg;
    var segs = [["all", "الكل"], ["loyal", "دايمين (5+ زيارات)"], ["gone", "غايبين +30 يوم"], ["new", "جداد"]];
    var f = function (c) { return sg === "all" || (sg === "loyal" && c.v >= 5) || (sg === "gone" && now - c.last > 30 * DAY) || (sg === "new" && c.fresh); };
    var list = st.cust.filter(f).sort(function (a, b) { return b.sum - a.sum; });
    return mh("العملاء", st.cust.length + " رقم في قاعدة البيانات — من الطلبات وكارت الولاء", '<button type="button" class="b sm gh" data-act="csv">' + IC("download") + "صدّر Excel</button>") +
      '<div class="seg" style="margin-bottom:12px">' + segs.map(function (s) { return '<button type="button" class="' + (sg === s[0] ? "on" : "") + '" data-act="seg" data-v="' + s[0] + '">' + s[1] + "<em>" + st.cust.filter(function (c) { var o = st.seg; st.seg = s[0]; var r = f(c); st.seg = o; return r; }).length + "</em></button>"; }).join("") + "</div>" +
      '<div class="c tbl-w" style="padding:4px 12px"><table class="tbl"><thead><tr><th>الاسم</th><th>الرقم</th><th>زيارات</th><th>إجمالي</th><th>آخر مرة</th></tr></thead><tbody>' +
      list.map(function (c) { return "<tr><td>" + esc(c.n) + '</td><td><span class="mask">' + c.ph + '</span></td><td class="n">' + c.v + '</td><td class="n">' + n2(c.sum) + "</td><td>" + ago(c.last) + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      '<p class="sub" style="margin-top:10px;font-size:12px;color:var(--mut)">مثال: «الغايبين +30 يوم» تبعتلهم عرض يرجّعهم.</p>';
  };

  MODS.guard = function () {
    var G = st.guard;
    var tg = function (k, t, s) { return '<div class="row"><div class="row__t"><b>' + t + "</b><small>" + s + '</small></div><button type="button" class="tg2' + (G[k] ? " on" : "") + '" role="switch" aria-checked="' + !!G[k] + '" aria-label="' + t + '" data-act="gtg" data-v="' + k + '"></button></div>'; };
    return mh("الحماية من الطلبات الوهمية", "قبل ما أي طلب يوصل المطبخ") +
      '<div class="grid2"><div class="c"><h4>' + IC("shield") + "القواعد</h4>" +
        tg("first", "تأكيد أول طلب", "أول طلب سفري/توصيل من رقم جديد بيستنى مكالمة") +
        '<div class="row"><div class="row__t"><b>فترة بين الطلبات</b><small>نفس الموبايل — بالثواني</small></div><span class="stp"><button type="button" data-act="gcool" data-v="-30">' + IC("minus") + '</button><span class="num">' + G.cool + '</span><button type="button" data-act="gcool" data-v="30">' + IC("plus") + "</button></span></div>" +
        '<div class="row"><div class="row__t"><b>أقصى طلبات في اليوم</b><small>لنفس الرقم</small></div><span class="stp"><button type="button" data-act="gday" data-v="-1">' + IC("minus") + "</button><span>" + G.daily + '</span><button type="button" data-act="gday" data-v="1">' + IC("plus") + "</button></span></div>" +
        tg("trap", "فخ للبرامج الآلية", "خانة مستخبية + وقت القعدة في الصفحة") + tg("table", "رقم الطاولة مقفول بالـQR", "محدش يكتب طاولة مش بتاعته") + "</div>" +
      '<div><div class="c"><h4>' + IC("ban") + 'أرقام محظورة</h4><div style="display:flex;gap:8px;margin-top:10px"><input class="inp num" style="direction:ltr;text-align:left" placeholder="05xxxxxxxx" value="' + esc(G.blockIn) + '" data-in="gblk" aria-label="رقم للحظر"><button type="button" class="b sm" style="height:36px" data-act="gblock">احظر</button></div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">' + G.block.map(function (p, i) { return '<span class="chip2"><span class="mask">' + esc(p) + '</span><button type="button" data-act="gunblock" data-v="' + i + '" aria-label="شيل">' + IC("x") + "</button></span>"; }).join("") + "</div></div>" +
      '<div class="c"><h4>' + IC("phone") + "محتاج تأكيد</h4>" + (G.queue.length ? G.queue.map(function (o) { return orderCard(o, '<button type="button" class="b sm no" data-act="greject" data-v="' + o.no + '">ارفض</button><button type="button" class="b sm ok" data-act="gconfirm" data-v="' + o.no + '">' + IC("check") + "اتصلت وأكّدت</button>"); }).join("") : '<p class="empty">مفيش طلبات مستنية.</p>') + "</div></div></div>" +
      '<div class="note2" style="margin-top:12px">' + IC("alert") + "<span>جرّب: ابعت طلبين ورا بعض من الموبايل — التاني هيتوقف لحد ما تعدّي الفترة. وكل ده ردع؛ والطبقة اللي محدش يعرف يعدّيها هي الكاشير.</span></div>";
  };

  MODS.pay = function () {
    var P = st.pay;
    var tg = function (k, t, s) { return '<div class="row"><div class="row__t"><b>' + t + "</b><small>" + s + '</small></div><button type="button" class="tg2' + (P[k] ? " on" : "") + '" role="switch" aria-checked="' + !!P[k] + '" aria-label="' + t + '" data-act="ptg" data-v="' + k + '"></button></div>'; };
    return mh("الدفع", "تحويل برقم مرجعي — من غير بوابة دفع ولا عمولة") +
      '<div class="grid2"><div class="c"><h4>' + IC("wallet") + "طرق الدفع اللي الزبون يشوفها</h4>" + tg("stc", "STC Pay", "رقم المحفظة + المبلغ بالظبط + زرار نسخ") + tg("bank", "تحويل بنكي", "الآيبان + زرار نسخ") + tg("cash", "كاش عند الاستلام", "الدفع اختياري للزبون") +
        '<div class="note2" style="margin-top:10px">' + IC("alert") + "<span>الأرقام اللي هنا تجريبية. في السيستم الحقيقي بتحط أرقامك إنت.</span></div></div>" +
      '<div class="c"><h4>' + IC("clock") + "مستني الدفع</h4>" + (P.wait.length ? P.wait.map(function (o) { return orderCard(o, '<button type="button" class="b sm ok" data-act="paid" data-v="' + o.no + '">' + IC("check") + "الفلوس وصلت</button>"); }).join("") : '<p class="empty">مفيش تحويلات مستنية.</p>') + "</div></div>" +
      '<div class="note2" style="margin-top:12px">' + IC("shield") + "<span><b>القاعدة اللي بنقولها لكل كاشير:</b> اتأكد من إشعار محفظتك إنت، مش من سكرين شوت الزبون. والطلب المدفوع بيعدّي التأكيد على طول — الفلوس هي التأكيد.</span></div>";
  };

  MODS.qr = function () {
    var Q = window.QRD, b = st.b, cards = [];
    for (var t = 1; t <= st.tables; t++) cards.push('<div class="qrc">' + qrSvg(b.id, t) + "<b>طاولة " + t + "</b><small>امسح واطلب</small></div>");
    return mh("QR والطاولات", "كل طاولة ليها كود حقيقي — امسحه بموبايلك وجرّب", '<span class="stp"><button type="button" data-act="tables" data-v="-1" aria-label="أقل">' + IC("minus") + '</button><span class="num">' + st.tables + '</span><button type="button" data-act="tables" data-v="1" aria-label="أكتر">' + IC("plus") + '</button></span><button type="button" class="b sm gh" data-act="printqr">' + IC("printer") + "اطبع</button>") +
      '<div class="qrg">' + cards.join("") + "</div>" +
      '<p class="sub" style="margin-top:12px;font-size:12px;color:var(--mut)">الكود بيفتح نسخة العرض من منيو ' + esc(b.name) + " ومعاه رقم الطاولة.</p>";
  };
  function qrSvg(id, t) {
    var Q = window.QRD; if (!Q || !Q[id]) return "";
    var n = Q.size[id], hex = Q[id][t - 1], bits = "", rects = "";
    for (var i = 0; i < hex.length; i++) bits += ("000" + parseInt(hex[i], 16).toString(2)).slice(-4);
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (bits[y * n + x] === "1") rects += "M" + x + " " + y + "h1v1h-1z";
    return '<svg viewBox="-2 -2 ' + (n + 4) + " " + (n + 4) + '" shape-rendering="crispEdges" role="img" aria-label="QR طاولة ' + t + '"><rect x="-2" y="-2" width="' + (n + 4) + '" height="' + (n + 4) + '" fill="#fff"/><path d="' + rects + '" fill="#111"/></svg>';
  }

  MODS.brand = function () {
    var L = st.look, b = st.b, cols = uniq([b.t.pri, "#111111", "#2F5D50", "#8C2F39", "#1F4E79", "#B5651D"]);
    return mh("الهوية", "نفس السيستم — بس لابس هوية مكانك. غيّر وشوف الموبايل") +
      '<div class="grid2"><div class="c"><h4>' + IC("palette") + 'اللون الأساسي</h4><div class="sw" style="margin-top:10px">' + cols.map(function (c) { return '<button type="button" class="' + (L.c === c ? "on" : "") + '" style="background:' + c + '" data-act="lcol" data-v="' + c + '" aria-label="' + c + '"></button>'; }).join("") + "</div>" +
        '<div class="row" style="margin-top:8px"><div class="row__t"><b>الوضع الغامق</b><small>الزبون يقدر يختار</small></div><button type="button" class="tg2' + (L.dark ? " on" : "") + '" role="switch" aria-checked="' + L.dark + '" data-act="ldark" aria-label="الوضع الغامق"></button></div></div>' +
      '<div class="c"><h4>' + IC("edit") + 'البيانات</h4><div class="fld2" style="margin-top:10px"><label class="lbl" for="bN">اسم المكان</label><input class="inp" id="bN" value="' + esc(L.name) + '" data-in="lname"></div><div class="fld2" style="margin-top:10px"><label class="lbl" for="bT">السطر اللي تحت الاسم</label><input class="inp" id="bT" value="' + esc(L.tag) + '" data-in="ltag"></div></div></div>' +
      '<div class="note2" style="margin-top:12px">' + IC("spark") + "<span>في السيستم الحقيقي الهوية بتتعمل مرة واحدة بإيدينا: الخط واللوجو والصور والألوان — مش مجرد لون.</span></div>";
  };

  MODS.reports = function () {
    var k = st.rep.range / 30, hs = st.hours, mx = Math.max.apply(null, hs), dy = st.days, mxd = Math.max.apply(null, dy);
    var top = st.items.slice().sort(function (a, b) { return b.v - a.v; }).slice(0, 6), mv = top[0].v;
    var dead = st.items.filter(function (i) { return i.v < 40; });
    var DN = ["حد", "اتنين", "تلات", "أربع", "خميس", "جمعة", "سبت"];
    return mh("التقارير", "آخر " + st.rep.range + " يوم · مقارنة بالفترة اللي قبلها", '<div class="seg">' + [7, 30].map(function (n) { return '<button type="button" class="' + (st.rep.range === n ? "on" : "") + '" data-act="rrange" data-v="' + n + '">' + n + " يوم</button>"; }).join("") + '</div><button type="button" class="b sm gh" data-act="csv2">' + IC("download") + "صدّر</button>") +
      '<div class="grid4"><div class="kp"><small>المبيعات</small><b>' + n2(62162 * k) + '</b><i class="up">▲ 17%</i></div><div class="kp"><small>الطلبات</small><b>' + n2(1140 * k) + '</b><i class="up">▲ 9%</i></div><div class="kp"><small>زوار المنيو</small><b>' + n2(2964 * k) + '</b><i class="up">▲ 14%</i></div><div class="kp"><small>متوسط الفاتورة</small><b>55<span>' + st.b.cur + '</span></b><i class="dn">▼ 2%</i></div></div>' +
      '<div class="grid2" style="margin-top:12px"><div class="c"><h4>' + IC("clock") + 'ساعات الزحمة</h4><div class="vbars">' + hs.map(function (v) { return '<u class="' + (v > mx * .82 ? "hi" : "") + '" style="height:' + Math.max(3, v / mx * 100) + '%"></u>'; }).join("") + '</div><div class="vlab"><span>12a</span><span>6a</span><span>12p</span><span>6p</span><span>11p</span></div></div>' +
        '<div class="c"><h4>' + IC("calendar") + 'أيام الأسبوع</h4><div class="vbars">' + dy.map(function (v) { return '<u class="' + (v > mxd * .9 ? "hi" : "") + '" style="height:' + (v / mxd * 100) + '%"></u>'; }).join("") + '</div><div class="vlab" style="direction:rtl">' + DN.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div></div></div>" +
      '<div class="c"><h4>' + IC("eye") + 'بيتشاف كتير ضد بيتطلب</h4><p class="sub">الرمادي = مشاهدات · اللون = طلبات. صنف بيتشاف ومبيتطلبش يبقى فيه مشكلة في السعر أو الصورة.</p><div style="margin-top:8px">' +
        top.map(function (i) { return '<div class="hbar"><span style="color:var(--ink);font-family:var(--ar)">' + esc(i.n) + '</span><div style="display:grid;gap:3px"><u class="v" style="width:' + (i.v / mv * 100) + '%"></u><u style="width:' + (i.o / mv * 100) + '%"></u></div><span>' + i.o + "/" + i.v + "</span></div>"; }).join("") + "</div></div>" +
      '<div class="c"><h4>' + IC("alert") + "الأصناف الواقفة</h4>" + (dead.length ? dead.map(function (i) { return '<div class="row"><div class="row__t"><b>' + esc(i.n) + "</b><small>" + i.v + ' مشاهدة · 0 طلب في 14 يوم</small></div><button type="button" class="b sm gh" data-act="mod" data-v="menu">افتح المنيو</button></div>'; }).join("") : '<p class="empty">مفيش أصناف واقفة.</p>') + "</div>";
  };

  /* ======================================================================
     الوحدات — الجيم
     ====================================================================== */
  function memBy(code) { return st.mem.filter(function (m) { return m.code === code; })[0]; }
  function brName(b) { return b === "b1" ? "الفرع الأول" : "الفرع التاني"; }
  function nowChip() {
    var p = period();
    return '<span class="nowp' + (p === "f" ? " f" : p === "x" ? " x" : "") + '"><i></i>' + (p === "m" ? "دلوقتي: فترة الرجالة" : p === "f" ? "دلوقتي: فترة السيدات" : "الفرع مقفول دلوقتي") + " · الفرع التاني</span>";
  }
  var GM = {};
  GM.home = function () {
    var br = st.branch, ms = st.mem.filter(function (m) { return br === "all" || m.br === br; });
    var k = br === "all" ? 1 : br === "b1" ? .46 : .54;
    var cnt = function (s) { return ms.filter(function (m) { return mstat(m) === s; }).length; };
    var debt = ms.filter(function (m) { return m.debt; });
    var alerts = [
      ["clock", "<b>" + cnt("soon") + " اشتراك</b> بيخلصوا خلال 7 أيام", "ابعتلهم رسالة", "msgs"],
      ["alert", "<b>" + cnt("exp") + " اشتراك</b> خلصوا — دول أسهل ناس ترجّعهم", "كلّمهم", "msgs"],
      ["users", "<b>" + ms.filter(function (m) { return m.absent; }).length + " عضو</b> مشترك وغايب من +10 أيام", "ابعتلهم", "msgs"],
      ["cash", "<b>متأخرات " + n2(debt.reduce(function (a, m) { return a + m.debt; }, 0)) + " ج</b> على " + debt.length + " عضو", "شوف", "members"],
      ["snow", "<b>" + cnt("frz") + " اشتراك</b> متجمّد", "شوف", "members"],
      ["tool", "<b>" + Math.round(2 * k || 1) + " جهاز</b> محتاج صيانة", "", ""],
      ["layers", "<b>" + Math.round(3 * k || 1) + " صنف</b> في البوفيه بيخلص", "", ""],
      ["target", "<b>" + Math.round(5 * k || 1) + " عميل محتمل</b> ميعاد متابعتهم النهارده", "", ""],
      ["gift", "<b>1 عضو</b> عيد ميلاده النهارده", "ابعتله", "msgs"]
    ];
    var inside = st.log.length;
    return mh("لوحة القيادة", "التنبيهات هي المنتج — كل تنبيه بزرار بيوديك تتصرف", '<div class="seg" data-tour="branch">' + [["all", "الفرعين"], ["b1", "الأول"], ["b2", "التاني"]].map(function (x) { return '<button type="button" class="' + (br === x[0] ? "on" : "") + '" data-act="gbr" data-v="' + x[0] + '">' + x[1] + "</button>"; }).join("") + "</div>") +
      '<div class="grid4"><div class="kp hero-k"><small>في الجيم دلوقتي</small><b>' + (Math.round(9 * k) + inside) + "<span>من " + Math.round(120 * k) + '</span></b></div><div class="kp"><small>حضور النهارده</small><b>' + (Math.round(49 * k) + inside) + '</b></div><div class="kp"><small>تحصيل الشهر</small><b>' + n2(149520 * k) + '<span>ج</span></b><i class="up">▲ 8%</i></div><div class="kp"><small>أعضاء نشطين</small><b>' + Math.round(152 * k) + "</b></div></div>" +
      '<div class="c" style="margin-top:12px"><h4>' + IC("bell") + "التنبيهات (9 أنواع)</h4>" + alerts.map(function (a) { return '<div class="dec2">' + IC(a[0]) + "<div>" + a[1] + "</div>" + (a[3] ? '<button type="button" class="b sm gh" data-act="mod" data-v="' + a[3] + '">' + a[2] + "</button>" : "") + "</div>"; }).join("") + "</div>";
  };
  GM.checkin = function () {
    var r = st.res, m = r && r.m;
    var box = "";
    if (r) {
      if (!m) box = '<div class="warn e">' + IC("alert") + "مفيش عضو بالكود ده.</div>";
      else {
        var s = mstat(m), per = period(), ws = [];
        if (s === "frz") ws.push(["w", "snow", "الاشتراك متجمّد — فكّ التجميد الأول من «الأعضاء»."]);
        if (s === "exp") ws.push(["e", "alert", m.left <= 0 ? "الجلسات خلصت — النظام بيمنع الدخول لحد ما يجدّد، حتى لو التاريخ لسه ساري." : "الاشتراك خلص — جدّد الأول."]);
        if (per !== "x" && per !== m.g && s !== "exp" && s !== "frz") ws.push(["w", "users", per === "m" ? "دي فترة الرجالة — العضوة دي فترتها السيدات." : "دي فترة السيدات — العضو ده فترته الرجالة."]);
        if (m.br !== "b2" && s !== "exp") ws.push(["w", "building", "اشتراكه في " + brName(m.br) + " — دي هتتسجّل زيارة لفرع تاني."]);
        if (m.debt) ws.push(["w", "cash", "عليه متأخرات " + m.debt + " ج."]);
        if (r.ok) ws.unshift(["o", "check", "دخل " + ftime(r.ok) + " — الجلسة اتخصمت."]);
        var can = !r.ok && s !== "exp" && s !== "frz";
        box = '<div class="c" style="margin-top:12px"><div class="mem"><span class="av">' + esc(m.n.split(" ").map(function (w) { return w[0]; }).join("")) + "</span><div><b>" + esc(m.n) + "</b><small>" + esc(st.plans[m.plan].n) + " · " + m.total + " جلسة · بينتهي " + fdate(m.exp) + " · " + brName(m.br) + '</small></div><div class="ses"><b>' + m.left + '</b><small>جلسة باقية</small></div></div><div class="lbar" style="margin-top:12px"><i style="width:' + (m.left / m.total * 100) + '%"></i></div>' +
          ws.map(function (w) { return '<div class="warn ' + w[0] + '">' + IC(w[1]) + "<span>" + w[2] + "</span></div>"; }).join("") +
          '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">' + (can ? '<button type="button" class="b" data-act="cin" data-tour="checkin">' + IC("door") + "سجّل دخول</button>" : "") + (r.ok ? '<button type="button" class="b gh" data-act="cundo">إلغاء التسجيل (الجلسة ترجع)</button>' : "") + '<button type="button" class="b gh" data-act="cshow">' + IC("mobile") + "ورّيني موبايله</button></div></div>";
      }
    }
    return mh("الدخول والحضور", (49 + st.log.length) + " حضور النهارده · السعة 120", nowChip()) +
      '<div class="c"><label class="lbl" for="gcode">كود العضو</label><div class="code"><input id="gcode" inputmode="numeric" maxlength="6" autocomplete="off" value="' + esc(st.code) + '" data-in="gcode" placeholder="1024"><button type="button" class="b" data-act="cfind" data-tour="checkin">' + IC("search") + "دوّر</button></div>" +
        '<div class="qcodes">' + ["1024", "1088", "1102", "1131", "1233"].map(function (c) { var m2 = memBy(c); return '<button type="button" data-act="cquick" data-v="' + c + '"><b>' + c + "</b>" + esc(m2.n.split(" ")[0]) + "</button>"; }).join("") + "</div></div>" +
      box +
      '<div class="c"><h4>' + IC("list") + "سجل النهارده</h4>" + (st.log.length ? st.log.map(function (l) { return '<div class="row"><div class="row__t"><b>' + esc(l.n) + "</b><small>" + l.code + " · " + brName("b2") + '</small></div><span class="num" style="font-size:12.5px;color:var(--mut)">' + ftime(l.t) + "</span></div>"; }).join("") : '<p class="empty">سجّل أول دخول وهيظهر هنا.</p>') + "</div>";
  };
  GM.members = function () {
    var f = st.mfil, segs = [["all", "الكل"], ["ok", "ساري"], ["soon", "بيخلص"], ["exp", "خلص"], ["frz", "متجمّد"], ["debt", "متأخرات"]];
    var ok = function (m) { return f === "all" || (f === "debt" ? m.debt : mstat(m) === f); };
    return mh("الأعضاء", st.mem.length + " عضو تجريبي — دوس «افتح» على أي عضو") +
      '<div class="seg" style="margin-bottom:12px">' + segs.map(function (s) { return '<button type="button" class="' + (f === s[0] ? "on" : "") + '" data-act="mfil" data-v="' + s[0] + '">' + s[1] + "<em>" + st.mem.filter(function (m) { return s[0] === "all" || (s[0] === "debt" ? m.debt : mstat(m) === s[0]); }).length + "</em></button>"; }).join("") + "</div>" +
      '<div class="c" style="padding-block:4px">' + st.mem.filter(ok).map(function (m) {
        var s = mstat(m), o = st.open === m.code;
        return '<div class="row" style="flex-wrap:wrap"><div class="row__t"><b>' + esc(m.n) + ' <span class="num" style="color:var(--mut);font-weight:400;font-size:12px">' + m.code + "</span></b><small>" + esc(st.plans[m.plan].n) + " · " + m.left + "/" + m.total + " جلسة · بينتهي " + fdate(m.exp) + (m.debt ? " · متأخرات " + m.debt + " ج" : "") + '</small></div><span class="tag2 ' + MST[s][1] + '">' + MST[s][0] + '</span><button type="button" class="b sm gh" data-act="mopen" data-v="' + m.code + '">' + (o ? "اقفل" : "افتح") + "</button>" +
          (o ? '<div style="flex-basis:100%;display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:10px 0 4px">' +
            (m.frozen ? '<button type="button" class="b" data-act="unfrz" data-v="' + m.code + '">فكّ التجميد</button>' :
              '<span class="stp"><button type="button" data-act="frzd" data-v="-7">' + IC("minus") + "</button><span>" + st.frz + ' يوم</span><button type="button" data-act="frzd" data-v="7">' + IC("plus") + '</button></span><button type="button" class="b" data-act="frz" data-v="' + m.code + '" data-tour="freeze">' + IC("snow") + "جمّد</button>") +
            '<button type="button" class="b gh" data-act="renew" data-v="' + m.code + '">' + IC("replay") + "جدّد نفس الباقة</button>" + '<button type="button" class="b gh" data-act="mshow" data-v="' + m.code + '">' + IC("mobile") + "موبايله</button></div>" : "") + "</div>";
      }).join("") + "</div>";
  };
  GM.classes = function () {
    return mh("الحصص والجدول", "حصص النهارده — الحجز بعدد أماكن والحصة بتقفل لما تتملي") +
      '<div class="c" style="padding-block:4px">' + st.cls.map(function (c, i) {
        var full = c.in >= c.cap;
        return '<div class="cls"><time>' + c.t + '</time><div class="row__t"><b>' + c.n + "</b><small>" + c.sub + '</small><div class="lbar" style="margin-top:6px"><i style="width:' + (c.in / c.cap * 100) + '%"></i></div></div><div style="display:grid;justify-items:end;gap:4px"><b class="num">' + c.in + "/" + c.cap + "</b>" + (full ? '<span class="tag2 t-new">اتقفلت</span>' : '<button type="button" class="b sm" data-act="book" data-v="' + i + '">احجز</button>') + "</div></div>";
      }).join("") + "</div>";
  };
  GM.plans = function () {
    var br = st.plansBr;
    return mh("الباقات والأسعار", "بالجلسات مش بالأيام — وسعر مختلف لكل فرع (الأسعار الحقيقية)", '<div class="seg">' + [["b1", "الفرع الأول"], ["b2", "الفرع التاني"]].map(function (x) { return '<button type="button" class="' + (br === x[0] ? "on" : "") + '" data-act="pbr" data-v="' + x[0] + '">' + x[1] + "</button>"; }).join("") + "</div>") +
      '<div class="grid3">' + st.b.plans.map(function (p) {
        var pr = p.p[br];
        return '<div class="kp" style="' + (pr ? "" : "opacity:.45") + '"><small>' + esc(p.n) + (p.pop ? ' · <span style="color:#15803D">الأكتر مبيعًا</span>' : "") + "</small><b>" + (pr ? n2(pr) + "<span>ج</span>" : "<span>مش متاحة هنا</span>") + '</b><small><span class="num">' + p.s + "</span> جلسة · " + esc(p.note) + "</small></div>";
      }).join("") + "</div>" +
      '<div class="note2" style="margin-top:12px">' + IC("alert") + "<span>كل دخول بيخصم جلسة. والسعر المعلن والخصم والسعر الفعلي بيتحفظوا مع بعض — عشان تعرف بتبيع بكام فعلًا.</span></div>";
  };
  GM.cash = function () {
    var C = st.cash, inn = 0, out = 0;
    C.rows.forEach(function (r) { if (r[2] === "in") inn += r[1]; else out += r[1]; });
    var net = inn - out, cl = C.closed;
    return mh("الخزنة والمالية", "كل وارد ومنصرف بفرعه وباسم اللي سجّله") +
      '<div class="grid3"><div class="kp"><small>وارد النهارده</small><b>' + n2(inn) + '<span>ج</span></b></div><div class="kp"><small>منصرف</small><b>' + n2(out) + '<span>ج</span></b></div><div class="kp hero-k"><small>المفروض في الدرج</small><b>' + n2(net) + "<span>ج</span></b></div></div>" +
      '<div class="c" style="margin-top:12px"><h4>' + IC("lock") + 'تقفيل اليوم</h4><p class="sub">اكتب اللي في الدرج فعلًا، والنظام يقارنه بالمسجّل.</p><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><input class="inp num" style="max-width:180px;direction:ltr;text-align:left" inputmode="numeric" placeholder="' + net + '" value="' + esc(C.drawer) + '" data-in="drawer" aria-label="اللي في الدرج"><button type="button" class="b" data-act="close" data-tour="close">قفّل اليوم</button></div>' +
        (cl ? '<div class="warn ' + (cl.diff === 0 ? "o" : "e") + '">' + IC(cl.diff === 0 ? "check" : "alert") + "<span>" + (cl.diff === 0 ? "الدرج مظبوط — اليوم اتقفل." : (cl.diff > 0 ? "زيادة " : "عجز ") + n2(Math.abs(cl.diff)) + " ج — اتسجّل في التقرير باسم اللي قفّل.") + "</span></div>" : "") + "</div>" +
      '<div class="c"><h4>' + IC("list") + "حركات النهارده</h4>" + C.rows.map(function (r) { return '<div class="row"><div class="row__t"><b>' + esc(r[0]) + '</b></div><b class="num" style="color:' + (r[2] === "in" ? "#15803D" : "#B91C1C") + '">' + (r[2] === "in" ? "+" : "−") + n2(r[1]) + "</b></div>"; }).join("") + "</div>";
  };
  var LISTS = { soon: "بيخلص خلال 7 أيام", exp: "خلص", absent: "غايب +10 أيام", debt: "عليه متأخرات", bday: "عيد ميلاده" };
  function listMem(k) {
    return st.mem.filter(function (m) { var s = mstat(m); return k === "soon" ? s === "soon" : k === "exp" ? s === "exp" : k === "absent" ? m.absent : k === "debt" ? !!m.debt : m.code === "1180"; });
  }
  function cnt(n, one, two, few, many) { return n <= 0 ? "0 " + many : n === 1 ? one : n === 2 ? two : n <= 10 ? n + " " + few : n + " " + many; }
  function fillTpl(m) {
    var days = Math.max(0, Math.ceil((m.exp - Date.now()) / DAY));
    return st.msgs.tpl.replace(/\{الاسم\}/g, m.n.split(" ")[0]).replace(/\{الأيام\}/g, cnt(days, "يوم واحد", "يومين", "أيام", "يوم")).replace(/\{الجلسات\}/g, cnt(m.left, "جلسة واحدة", "جلستين", "جلسات", "جلسة")).replace(/\{الباقة\}/g, st.plans[m.plan].n);
  }
  GM.msgs = function () {
    var M = st.msgs, list = listMem(M.list), first = list[0];
    return mh("مركز الرسايل", "القوايم جاهزة — والرسالة بتتكتب باسم كل عضو") +
      '<div class="seg" style="margin-bottom:12px">' + Object.keys(LISTS).map(function (k) { return '<button type="button" class="' + (M.list === k ? "on" : "") + '" data-act="mlist" data-v="' + k + '">' + LISTS[k] + "<em>" + listMem(k).length + "</em></button>"; }).join("") + "</div>" +
      '<div class="grid2"><div class="c"><h4>' + IC("edit") + 'الرسالة</h4><textarea class="inp" style="height:120px;padding:10px 12px;line-height:1.8;margin-top:10px;resize:vertical" data-in="tpl" aria-label="نص الرسالة">' + esc(M.tpl) + '</textarea><div class="qcodes">' + ["{الاسم}", "{الأيام}", "{الجلسات}", "{الباقة}"].map(function (v) { return '<button type="button" data-act="tvar" data-v="' + v + '">' + v + "</button>"; }).join("") + "</div></div>" +
      '<div class="c"><h4>' + IC("eye") + "هتوصل كده</h4>" + (first ? '<div style="margin-top:10px;background:#E7F7DE;border-radius:14px 14px 4px 14px;padding:10px 12px;font-size:13px;line-height:1.8">' + esc(fillTpl(first)) + '</div><p class="sub" style="margin-top:8px">ل' + esc(first.n) + " و" + (list.length - 1) + " غيره</p>" : '<p class="empty">القايمة دي فاضية.</p>') +
        '<button type="button" class="b" style="margin-top:12px;width:100%" data-act="send" data-tour="msg"' + (list.length ? "" : " disabled") + ">" + IC("send") + "جهّز " + list.length + " رسالة واتساب</button></div></div>" +
      (M.note ? '<div class="warn o" style="margin-top:12px">' + IC("check") + "<span>" + esc(M.note) + "</span></div>" : "");
  };
  GM.roles = function () {
    var R = [["owner", "صاحب الجيم", "بيشوف كل حاجة في الفرعين", ["كل الوحدات", "التقارير والفلوس", "المستخدمين والصلاحيات"], []],
      ["manager", "مدير فرع", "فرعه بس", ["الدخول والأعضاء", "الخزنة والتقفيل", "الرسايل"], ["الفرع التاني", "المستخدمين"]],
      ["reception", "ريسبشن", "شغله بس", ["الدخول والحضور", "الأعضاء", "الحصص"], ["الفلوس والتقارير", "الأسعار"]]];
    return mh("الصلاحيات", "كل واحد بيدخل بكود PIN وبيشوف اللي يخصّه بس") +
      '<div class="grid3">' + R.map(function (r) {
        return '<div class="c role' + (st.role === r[0] ? " on" : "") + '"><h4>' + IC("lock") + r[1] + '</h4><p class="sub">' + r[2] + "</p><ul>" + r[3].map(function (x) { return '<li class="y">' + IC("check") + x + "</li>"; }).join("") + r[4].map(function (x) { return '<li class="n">' + IC("x") + x + "</li>"; }).join("") + "</ul>" +
          (st.role === r[0] ? '<span class="tag2 t-done" style="justify-self:start">إنت داخل بيها</span>' : '<button type="button" class="b sm gh" data-act="role" data-v="' + r[0] + '" style="justify-self:start">ادخل بيها</button>') + "</div>";
      }).join("") + "</div>" +
      '<div class="note2" style="margin-top:12px">' + IC("eye") + "<span>جرّب «ادخل بيها» على الريسبشن — القايمة الجانبية هتصغر لـ4 وحدات بس.</span></div>";
  };

  function renderMain() {
    var m = $("#main"); if (!m) return;
    var fn = (st.gym ? GM : MODS)[st.mod] || (st.gym ? GM.checkin : MODS.orders);
    var banner = st.gym && st.role !== "owner" ? '<div class="warn w" style="margin:0 0 12px">' + IC("lock") + "<span>إنت داخل كـ" + (st.role === "manager" ? "مدير فرع" : "ريسبشن") + ' — شايف ' + visibleMods().length + ' وحدات بس.</span><button type="button" class="b sm gh" data-act="role" data-v="owner" style="margin-inline-start:auto">رجوع لصاحب الجيم</button></div>' : "";
    m.innerHTML = banner + fn();
    markTour();
  }
  function markTour() {
    $$(".pulse-t").forEach(function (e) { e.classList.remove("pulse-t"); });
    var c = stepNow(); if (!c || c.mod !== st.mod) return;
    var t = $('[data-tour="' + c.k + '"]', $("#lx"));
    if (t) t.classList.add("pulse-t");
  }

  /* ======================================================================
     موبايل الزبون
     ====================================================================== */
  function pvars() {
    if (st.gym) return "--pb:#F3F1EB;--pc:#FFFFFF;--pi:#17181C;--pi2:#6B6C66;--pp:#17181C;--pl:#E2DFD6;--pon:#BEF23C";
    var t = st.b.t, L = st.look, dark = L.dark;
    var base = dark ? (t.dark ? t : { bg: "#141210", card: "#1E1B18", ink: "#F5EFE8", ink2: "#A89F95", line: "#2E2A26" }) : (t.dark ? { bg: "#F7F3EE", card: "#FFFFFF", ink: "#1F1A16", ink2: "#7A7067", line: "#E8E0D6" } : t);
    return "--pb:" + base.bg + ";--pc:" + base.card + ";--pi:" + base.ink + ";--pi2:" + base.ink2 + ";--pp:" + L.c + ";--pl:" + base.line + ";--pon:#fff";
  }
  var lastHL = null;
  function renderPhone(hl) {
    var s = $("#lphs"); if (!s) return;
    var sc = $(".ps__sc", s), top = sc ? sc.scrollTop : 0;
    s.setAttribute("style", pvars());
    s.innerHTML = '<div class="ps"><div class="ps__bar"><span>9:41</span><span>●●●</span></div>' + (st.gym ? phGym() : phCafe()) + "</div>";
    sc = $(".ps__sc", s); if (sc) sc.scrollTop = top;
    if (hl) {
      var el = $('[data-hl="' + hl + '"]', s);
      if (el) {
        el.classList.add("hl");
        if (sc) { var r = el.getBoundingClientRect(), rs = sc.getBoundingClientRect(); if (r.top < rs.top || r.bottom > rs.bottom - 70) sc.scrollTop += r.top - rs.top - 90; }
      }
    }
  }
  function phHead() {
    var b = st.b, L = st.look;
    var h = b.logo && L.name === b.name && !L.dark ? '<img src="' + b.logo + '" alt="' + esc(L.name) + '">' :
      b.flag && L.name === b.name ? '<span class="fl"><svg viewBox="0 0 100 92"><path d="M6 14C34-4 74 0 95 22L64 36C54 27 42 26 33 32L46 88Z" fill="' + L.c + '"/></svg><b>F</b>RIENDS</span>' :
        '<span class="wd">' + esc(L.name) + "</span>";
    return '<div class="ps__hd" data-hl="head">' + h + '</div><p class="ps__tag" data-hl="tag">' + esc(L.tag) + "</p>";
  }
  function offerOpen() { var h = new Date().getHours(), o = st.offer; return o.on && (o.from <= o.to ? h >= o.from && h < o.to : h >= o.from || h < o.to) || o.on && st.forceOffer; }
  function phCafe() {
    var P = st.ph, b = st.b, v = P.view, out = "";
    if (v === "menu") {
      var o = st.offer, secs = b.secs;
      out += '<div class="ps__sc">' + phHead() +
        (o.on ? '<div class="pof" data-hl="offer"><img src="' + img(o.im) + '" alt=""><span class="pof__lb">' + (offerOpen() ? "عرض شغّال دلوقتي" : "عرض اليوم") + '</span><span class="pof__tm">' + IC("clock") + '<span id="ptm">' + clk(o.ends - Date.now()) + '</span></span><div class="pof__t"><small>' + esc(o.d) + "</small><b>" + esc(o.t) + "</b><p><strong>" + o.p + " " + b.cur + "</strong><s>" + o.was + "</s></p></div></div>" : "") +
        '<div class="ppills">' + [["all", "الكل"]].concat(secs.map(function (x) { return [x.id, x.t]; })).map(function (x) { return '<button type="button" class="' + (P.sec === x[0] ? "on" : "") + '" data-pa="psec" data-v="' + x[0] + '">' + x[1] + "</button>"; }).join("") + "</div>" +
        secs.filter(function (x) { return P.sec === "all" || P.sec === x.id; }).map(function (x) {
          var its = st.items.filter(function (i) { return i.s === x.id; });
          return its.length ? '<p class="pmh">' + x.t + "</p>" + its.map(phItem).join("") : "";
        }).join("") + "</div>";
    } else if (v === "cart") out += phCart();
    else if (v === "done") out += '<div class="ps__sc">' + phDone() + "</div>";
    else if (v === "loy") out += '<div class="ps__sc">' + phHead() + phLoy() + "</div>";
    else if (v === "rate") out += '<div class="ps__sc">' + phHead() + phRate() + "</div>";
    var cn = P.cart.reduce(function (a, l) { return a + l.q; }, 0);
    if (cn && v === "menu") out += '<button type="button" class="pcart" data-pa="pview" data-v="cart" data-hl="cart"><span>' + IC("cart") + "سلتك · " + cn + " صنف</span><b>" + cartTotal() + " " + b.cur + "</b></button>";
    out += '<nav class="ptabs">' + [["menu", "book", "المنيو"], ["cart", "cart", "سلتي"], ["loy", "gift", "كارتي"], ["rate", "star", "قيّمنا"]].map(function (t) { return '<button type="button" class="' + (v === t[0] || (v === "done" && t[0] === "cart") ? "on" : "") + '" data-pa="pview" data-v="' + t[0] + '">' + IC(t[1]) + t[2] + "</button>"; }).join("") + "</nav>";
    if (P.sheet) out += phSheet();
    return out;
  }
  function phItem(it) {
    var bd = it.nw ? '<span class="bd nw">جديد</span>' : it.b === "hot" ? '<span class="bd">' + IC("fire") + "الأكثر طلبًا</span>" : it.b === "chef" ? '<span class="bd">' + IC("star") + (st.b.type === "rest" ? "اختيار الشيف" : "اختيار الباريستا") + "</span>" : "";
    return '<button type="button" class="pit' + (it.on ? "" : " off") + '" data-pa="pitem" data-v="' + it.id + '" data-hl="i-' + it.id + '"' + (it.on ? "" : " disabled") + '><img src="' + img(it.im) + '" alt="" loading="lazy"><div><b>' + esc(it.n) + "</b><small>" + esc(it.d || "") + "</small>" + bd + '</div><div class="pz"><span data-hl="p-' + it.id + '">' + it.p + " " + st.b.cur + "</span><u>" + IC("plus") + "</u></div>" + (it.on ? "" : '<span class="so">خلص النهارده</span>') + "</button>";
  }
  var ADDS = {
    cafe: [["شوت إسبريسو زيادة", 4], ["حليب نباتي (لوز/شوفان)", 5], ["سيرب كراميل", 3]],
    sweet: [["صوص شوكولاتة", 3], ["كريمة", 3]],
    rest: [["جبنة زيادة", 4], ["صوص فريندز", 2], ["باكيت بطاطس", 6]]
  };
  function addsFor(it) { return st.b.type === "rest" ? ADDS.rest : it.s === "sweet" ? ADDS.sweet : ADDS.cafe; }
  function phSheet() {
    var P = st.ph, it = st.items.filter(function (x) { return x.id === P.sheet.id; })[0]; if (!it) return "";
    var sz = it.sz, adds = addsFor(it), sel = P.sheet;
    var price = (sz ? sz[sel.sz || 0] : it.p) + sel.add.reduce(function (a, i) { return a + adds[i][1]; }, 0);
    var SZN = sz && sz.length === 3 ? ["صغير", "وسط", "كبير"] : ["وسط", "كبير"];
    return '<div class="psh open" data-pa="sclose"><div class="psh__in" data-stop><img class="psh__img" src="' + img(it.im) + '" alt=""><h5>' + esc(it.n) + "</h5><p>" + esc(it.d || "") + "</p>" +
      (sz ? '<div class="psz">' + sz.map(function (p, i) { return '<button type="button" class="' + ((sel.sz || 0) === i ? "on" : "") + '" data-pa="psz" data-v="' + i + '">' + SZN[i] + " · " + p + "</button>"; }).join("") + "</div>" : "") +
      adds.map(function (a, i) { var on = sel.add.indexOf(i) > -1; return '<button type="button" class="popt' + (on ? " on" : "") + '" data-pa="padd" data-v="' + i + '"><span><i>' + (on ? IC("check") : "") + "</i>" + a[0] + "</span><b>+" + a[1] + "</b></button>"; }).join("") +
      '<button type="button" class="pbig" data-pa="padd2cart">أضف للسلة · <b>' + price + "</b> " + st.b.cur + "</button></div></div>";
  }
  function cartTotal() { return st.ph.cart.reduce(function (a, l) { return a + l.unit * l.q; }, 0); }
  function suggestion() {
    var P = st.ph; if (!P.cart.length) return null;
    var ids = P.cart.map(function (l) { return l.id; });
    var id = st.b.pair[P.cart[0].s];
    var it = st.items.filter(function (x) { return x.id === id && x.on; })[0];
    return it && ids.indexOf(it.id) === -1 ? it : null;
  }
  function phCart() {
    var P = st.ph, b = st.b, sg = suggestion();
    if (!P.cart.length) return '<div class="ps__sc"><div class="pdone"><div class="ok w">' + IC("cart") + "</div><b>سلتك فاضية</b><small>اختار من المنيو ودوس «+»</small><button type=\"button\" class=\"pbig\" data-pa=\"pview\" data-v=\"menu\">ارجع للمنيو</button></div></div>";
    var payOpts = [];
    if (st.pay.cash) payOpts.push(["cash", "كاش"]);
    if (st.pay.stc) payOpts.push(["stc", "STC Pay"]);
    if (st.pay.bank) payOpts.push(["bank", "تحويل"]);
    if (!payOpts.some(function (x) { return x[0] === P.pay; })) P.pay = payOpts.length ? payOpts[0][0] : "cash";
    var total = cartTotal() + (P.mode === "deliv" ? 10 : 0);
    return '<div class="ps__sc"><p class="pmh" style="font-size:17px;margin-top:6px">سلتك</p>' +
      P.cart.map(function (l, i) { return '<div class="pcrow"><div><span>' + esc(l.n) + "</span>" + (l.addN.length ? "<small>" + esc(l.addN.join("، ")) + "</small>" : "") + (l.up ? '<small style="color:var(--pp)">يمشي معاه</small>' : "") + '</div><span class="pq"><button type="button" data-pa="pq" data-v="' + i + '" data-d="-1" aria-label="أقل">' + IC("minus") + "</button><span>" + l.q + '</span><button type="button" data-pa="pq" data-v="' + i + '" data-d="1" aria-label="أكتر">' + IC("plus") + "</button></span><b>" + l.unit * l.q + "</b></div>"; }).join("") +
      (sg ? '<div class="psug"><img src="' + img(sg.im) + '" alt=""><div><small>يمشي معاه</small><b>' + esc(sg.n) + '</b></div><button type="button" data-pa="pup" data-v="' + sg.id + '">أضف · ' + sg.p + "</button></div>" : "") +
      '<div class="pmode">' + [["table", "طاولة " + b.table], ["take", "سفري"], ["deliv", "توصيل"]].map(function (m) { return '<button type="button" class="' + (P.mode === m[0] ? "on" : "") + '" data-pa="pmode" data-v="' + m[0] + '">' + m[1] + "</button>"; }).join("") + "</div>" +
      (P.mode !== "table" ? '<input class="pin" value="' + esc(P.name) + '" data-pi="name" aria-label="الاسم" placeholder="الاسم"><input class="pin num" style="direction:ltr;text-align:left" value="' + esc(P.phone) + '" data-pi="phone" aria-label="رقم الجوال" placeholder="05xxxxxxxx">' : "") +
      (payOpts.length > 1 ? '<div class="pmode">' + payOpts.map(function (m) { return '<button type="button" class="' + (P.pay === m[0] ? "on" : "") + '" data-pa="ppay" data-v="' + m[0] + '">' + m[1] + "</button>"; }).join("") + "</div>" : "") +
      (P.pay !== "cash" ? '<div class="pblock" style="background:var(--pc);color:var(--pi);border:1px dashed var(--pl)">حوّل <b class="num">' + total + " " + b.cur + "</b> على " + (P.pay === "stc" ? "STC Pay <span class=\"num\">05XXXXXXXX</span>" : "الآيبان <span class=\"num\">SA00…0000</span>") + ' (أرقام تجريبية)، واكتب آخر 6 أرقام من العملية:<input class="pin num" style="direction:ltr;text-align:left" maxlength="6" inputmode="numeric" value="' + esc(P.ref) + '" data-pi="ref" placeholder="000000"></div>' : "") +
      '<div class="pcrow" style="border:0;margin-top:8px;font-size:14px"><b style="font-family:var(--ar)">الإجمالي' + (P.mode === "deliv" ? " (مع التوصيل)" : "") + '</b><b style="font-size:17px;color:var(--pp)" data-hl="ctot">' + total + " " + b.cur + "</b></div>" +
      (P.blocked ? '<div class="pblock">' + esc(P.blocked) + "</div>" : "") +
      '<button type="button" class="pbig" data-pa="psend" data-tour="order">' + IC("send") + "ابعت الطلب</button></div>";
  }
  function phDone() {
    var D = st.ph.done, b = st.b;
    if (!D) return "";
    var o = D.o, waits = o.st === "conf" || o.st === "pay";
    return '<div class="pdone"><div class="ok' + (waits ? " w" : "") + '">' + IC(waits ? "clock" : "check") + "</div><b>" + (o.st === "conf" ? "هنكلّمك نأكد الطلب" : o.st === "pay" ? "مستنيين نأكد التحويل" : "طلبك وصل للكاشير") + "</b><small>" +
      (o.st === "conf" ? "ده أول طلب من رقمك — هنتصل بيك دقيقة ونبدأ." : o.st === "pay" ? "أول ما الفلوس توصل الطلب يدخل المطبخ." : o.mode === "table" ? "بنجهّزه دلوقتي — طاولة " + o.table : "بنجهّزه دلوقتي") +
      '</small><em data-hl="ostat">#D' + o.no + " · " + STT[o.st][0] + '</em><button type="button" class="pbig" data-pa="pview" data-v="menu">ارجع للمنيو</button><button type="button" class="pgg" style="width:100%" data-pa="pview" data-v="rate">' + IC("star") + "قيّم زيارتك</button></div>";
  }
  function phLoy() {
    var P = st.ph, L = st.loy, n = Math.min(P.stamps, L.goal), dots = "";
    for (var i = 0; i < L.goal; i++) dots += '<i class="' + (i < n ? "on" : "") + '"' + (i === n - 1 ? ' data-hl="stamp"' : "") + ">" + (i < n ? IC("check") : "") + "</i>";
    var full = n >= L.goal;
    return '<div class="ploy" data-hl="loy"><small>' + (full ? "كمّلت الكارت!" : "باقي " + (L.goal - n) + " وتاخد") + "</small><b>" + esc(L.reward) + '</b><div class="ploy__d">' + dots + "</div><p>" + (full ? "ورّي الكود للكاشير: <b class=\"num\">" + esc(P.code || "") + "</b> — بيتصرف مرة واحدة." : "الختم بيتحسب لما الكاشير يسلّم طلبك — على رقم موبايلك.") + "</p></div>" +
      '<p style="font-size:11px;color:var(--pi2);margin-top:12px;line-height:1.8;text-align:center">جرّب: ابعت طلب، وبعدين من اللوحة دوس «اتسلّم» — هتلاقي الختم زاد هنا.</p>';
  }
  function phRate() {
    var P = st.ph, R = st.rev, labels = ["", "وحش", "مش أحسن حاجة", "عادي", "حلو", "ممتاز"];
    var out = '<div class="prate"><h5>قيّم زيارتك</h5><p>رأيك بيوصل لصاحب المكان</p><div class="pst">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" class="' + (P.stars >= n ? "on" : "") + '" data-pa="pstar" data-v="' + n + '" aria-label="' + n + ' نجوم"><svg viewBox="0 0 24 24"><path d="M12 17.75l-6.17 3.25 1.18-6.88-5-4.86 6.9-1L12 2l3.09 6.26 6.9 1-5 4.86 1.18 6.88z"/></svg>' + n + "</button>"; }).join("") + '</div><p class="prate__l">' + (P.stars ? labels[P.stars] : "") + "</p></div>";
    if (P.stars && P.stars >= R.th) out += '<p style="text-align:center;font-size:11.5px;color:var(--pi2);margin-top:6px">شكرًا! ممكن تكتب رأيك على جوجل؟</p><button type="button" class="pgg" style="width:100%" data-pa="pgoogle">' + IC("star") + "قيّمنا على جوجل ماب</button>";
    else if (P.stars) out += (P.sentC ? '<div class="pdone" style="padding-top:12px"><div class="ok">' + IC("check") + "</div><b>وصلت لصاحب المكان</b><small>هيكلّمك ويحلّها.</small></div>" : '<label style="display:block;font-size:12px;font-weight:600;margin-top:14px">إيه اللي ضايقك؟</label><textarea class="pta" data-pi="msg" placeholder="اكتب هنا…">' + esc(P.msg) + '</textarea><p style="font-size:10px;color:var(--pi2);margin-top:4px">رسالتك بتروح لصاحب المكان مباشرة — مش لجوجل.</p><button type="button" class="pbig" data-pa="pcomplain">' + IC("send") + "ابعت لصاحب المكان</button>");
    return out;
  }
  function phGym() {
    var m = memBy(st.sel) || st.mem[0], s = mstat(m), C = 2 * Math.PI * 52, off = C * (1 - Math.max(0, m.left) / m.total);
    var p = period();
    var dots = m.visits.map(function (v, i) { return '<i class="' + (v ? "on" : "") + '"></i>'; }).join("") + st.log.filter(function (l) { return l.code === m.code; }).map(function () { return '<i class="nw"></i>'; }).join("");
    return '<div class="ps__sc"><div class="pp__hd"><i>CZ</i>سيزر جيم</div><p style="font-size:12px;color:#6B6C66">أهلاً يا ' + esc(m.n.split(" ")[0]) + '</p>' +
      '<div class="pp__card" data-hl="ring"><small>اشتراكك: ' + esc(st.plans[m.plan].n) + " · " + m.total + ' جلسة</small><div class="pring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="#2A2B30" stroke-width="10"/><circle cx="60" cy="60" r="52" fill="none" stroke="#BEF23C" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + C.toFixed(2) + '" stroke-dashoffset="' + off.toFixed(2) + '"/></svg><strong>' + Math.max(0, m.left) + "<small>جلسة باقية</small></strong></div>" +
        '<span class="tag2 ' + MST[s][1] + '">' + MST[s][0] + "</span></div>" +
      '<div class="pp__row" data-hl="exp"><span>بينتهي</span><b>' + fdate(m.exp) + (m.frozen ? " · متجمّد" : "") + '</b></div><div class="pp__row"><span>الفرع</span><b>' + brName(m.br) + '</b></div><div class="pp__row"><span>آخر دخول</span><b data-hl="last">' + (st.lastIn && st.lastIn.code === m.code ? "النهارده " + ftime(st.lastIn.t) : fdate(m.last)) + "</b></div>" +
      (m.debt ? '<div class="pp__row"><span>متأخرات</span><b style="color:#B91C1C">' + m.debt + " ج</b></div>" : "") +
      '<p style="font-size:11.5px;font-weight:600;margin-top:12px">حضورك الشهر ده</p><div class="pp__dots" data-hl="dots">' + dots + "</div>" +
      '<div class="pp__open"><div><b><i class="' + (p === "x" ? "x" : "") + '"></i>الفرع التاني</b>' + (p === "m" ? "فترة الرجالة دلوقتي" : p === "f" ? "فترة السيدات دلوقتي" : "مقفول دلوقتي") + "</div><div><b><i></i>الفرع الأول</b>مواعيده مختلفة — دايمًا فيه فرع فاتح</div></div></div>" +
      (st.gnote && st.gnote.code === m.code ? '<div class="pmsg"><div class="pmsg__h"><i>CZ</i>سيزر جيم · واتساب · دلوقتي</div><p>' + esc(st.gnote.t) + "</p></div>" : "");
  }
  function clk(ms) { ms = Math.max(0, ms); var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (x < 10 ? "0" : "") + x; }
  setInterval(function () { var t = d.getElementById("ptm"); if (t && st && !st.gym) t.textContent = clk(st.offer.ends - Date.now()); }, 1000);

  /* الموبايل على الشاشات الصغيرة: بيطلع من تحت يوري التغيير وبعدين يقفل */
  var peekT = null, touched = false;
  function showPhone(auto) {
    var p = $("#lphone"); if (!p || !mobile()) return;
    p.classList.add("open"); peekBtn.classList.remove("ping");
    clearTimeout(peekT); touched = false;
    if (auto) peekT = setTimeout(function () { if (!touched) p.classList.remove("open"); }, 2800);
  }
  function hidePhone() { var p = $("#lphone"); if (p) p.classList.remove("open"); }
  function changed(hl) {
    renderPhone(hl);
    var cap = $("#phcap");
    if (cap) { cap.classList.add("flash"); setTimeout(function () { cap.classList.remove("flash"); }, 1400); }
    if (mobile()) {
      var p = $("#lphone");
      if (p && !p.classList.contains("open")) showPhone(true);
    }
  }

  /* ======================================================================
     التوست + الصوت + الفاتورة
     ====================================================================== */
  var toastEl = d.createElement("div"); toastEl.className = "lx__toast"; toastEl.setAttribute("role", "status"); d.body.appendChild(toastEl);
  var toastT = null;
  function toast(a, b) {
    toastEl.innerHTML = IC("check") + "<div>" + esc(a) + (b ? "<small>" + esc(b) + "</small>" : "") + "</div>";
    toastEl.classList.add("show"); clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }
  var actx = null;
  function chime() {
    if (!st.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      [0, .16].forEach(function (dt, i) {
        var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + dt;
        o.type = "sine"; o.frequency.value = i ? 1318 : 988;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.12, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .5);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .55);
      });
    } catch (e) { }
  }
  function receipt(no) {
    var o = st.orders.filter(function (x) { return x.no === no; })[0]; if (!o) return;
    var m = d.createElement("div"); m.className = "rmod";
    m.innerHTML = '<div class="rmod__in"><div class="rcp"><h5>' + esc(st.look.name) + '</h5><p class="c" style="justify-content:center;display:flex">فاتورة تجريبية</p><hr><p><span>#D' + o.no + "</span><span>" + ftime(o.at) + "</span></p><p><span>" + (MODE[o.mode] || "") + (o.mode === "table" ? " " + o.table : "") + "</span><span></span></p><hr>" +
      o.lines.map(function (l) { return "<p><span>" + esc(l.n) + (l.q > 1 ? " ×" + l.q : "") + "</span><span>" + n2(l.p * l.q) + "</span></p>"; }).join("") + (o.mode === "deliv" ? "<p><span>توصيل</span><span>10</span></p>" : "") +
      "<hr><p><b>الإجمالي</b><b>" + cur$(o.tot) + "</b></p>" + (st.b.cur === "ر.س" ? '<p style="font-size:11px;color:#767676"><span>شامل ضريبة القيمة المضافة 15%</span><span></span></p>' : "") + '<hr><p class="c" style="display:flex">شكرًا لزيارتك</p></div>' +
      '<p style="font-size:12.5px;color:#767676">بتطلع على طابعة الكاشير الحرارية 80mm</p><div style="display:flex;gap:8px"><button type="button" class="b dk" data-x="print">' + IC("printer") + 'اطبع</button><button type="button" class="b gh" data-x="close">اقفل</button></div></div>';
    d.body.appendChild(m);
    m.addEventListener("click", function (e) {
      var x = e.target.closest("[data-x]");
      if (e.target === m || (x && x.getAttribute("data-x") === "close")) m.remove();
      else if (x && x.getAttribute("data-x") === "print") { d.body.classList.add("print-rcp"); window.print(); d.body.classList.remove("print-rcp"); }
    });
  }
  function download(name, rows) {
    var csv = "﻿" + rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(","); }).join("\n");
    var a = d.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); a.download = name;
    d.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ======================================================================
     الطلبات: من الموبايل أو تجريبي
     ====================================================================== */
  function arrive(o) {
    o.fresh = true; o.at = Date.now();
    if (o.st === "conf") st.guard.queue.unshift(o);
    else if (o.st === "pay") st.pay.wait.unshift(o);
    else st.orders.unshift(o);
    chime(); st.ring = true; setTimeout(function () { st.ring = false; }, 2000);
    if (o.st === "new" && st.mod !== "orders" && !mobile()) toast("طلب جديد #D" + o.no + " — " + cur$(o.tot), "وصل للوحة بجرس — افتح «الطلبات».");
    renderSide(); renderMain();
    setTimeout(function () { o.fresh = false; }, 6000);
  }
  function demoOrder() {
    var r = rng(Date.now() & 0xffff);
    var o = mkOrder(st, r, "new", pick(r, ["table", "table", "take"])); o.src = "demo";
    arrive(o); done("order");
  }
  function sendFromPhone() {
    var P = st.ph, now = Date.now();
    if (!P.cart.length) return;
    if (st.guard.cool && P.last && now - P.last < st.guard.cool * 1000) {
      P.blocked = "استنى " + Math.ceil((st.guard.cool * 1000 - (now - P.last)) / 1000) + " ثانية قبل طلب جديد — دي حماية من الطلبات الوهمية (اتحكم فيها من «الحماية»).";
      renderPhone("ctot"); return;
    }
    if (P.mode !== "table" && st.guard.block.some(function (b) { return b.slice(-4) === P.phone.slice(-4); })) {
      P.blocked = "الرقم ده محظور من الطلب."; renderPhone(); return;
    }
    if (P.pay !== "cash" && !/^\d{6}$/.test(P.ref)) { P.blocked = "اكتب آخر 6 أرقام من عملية التحويل."; renderPhone(); return; }
    P.blocked = false;
    var o = { no: ++st.no, st: "new", mode: P.mode, table: st.b.table, name: P.name || "زبون", ph: P.phone ? "05" + P.phone.slice(2, 3) + " ••• " + P.phone.slice(-4) : "", src: "phone",
      lines: P.cart.map(function (l) { return { id: l.id, n: l.n, q: l.q, p: l.unit, add: [], up: l.up, addN: l.addN }; }) };
    o.lines.forEach(function (l) { if (l.addN && l.addN.length) l.n = l.n + " + " + l.addN.join("، "); });
    o.tot = tot(o);
    if (P.pay !== "cash") { o.st = "pay"; o.ref = P.ref; o.via = P.pay === "stc" ? "STC Pay" : "تحويل بنكي"; }
    else if (P.mode !== "table" && st.guard.first && !P.knownPhone) { o.st = "conf"; o.flag = "أول طلب من الرقم ده"; }
    P.last = now; P.cart = []; P.ref = ""; P.done = { o: o }; P.view = "done";
    if (P.mode !== "table") P.knownPhone = true;
    arrive(o);
    renderPhone("ostat");
    done("order");
    if (o.st === "new" && st.mod !== "orders") { st.mod = "orders"; renderSide(); renderMain(); }
    else if (o.st === "conf" && st.mod !== "guard") toast("الطلب راح «محتاج تأكيد»", "أول طلب من رقم جديد — من «الحماية» دوس «اتصلت وأكّدت».");
    else if (o.st === "pay") toast("الطلب «مستني الدفع»", "من «الدفع» دوس «الفلوس وصلت» بعد ما تشوف إشعار محفظتك.");
  }
  function setStatus(no, s) {
    var o = st.orders.filter(function (x) { return x.no === no; })[0]; if (!o) return;
    o.st = s; o.fresh = false;
    if (s === "prep" || s === "done") done("advance");
    if (s === "done" && o.src === "phone") {
      var L = st.loy, P = st.ph;
      if (o.tot >= L.min && P.stamps < L.goal) {
        P.stamps++;
        if (P.stamps >= L.goal) { P.code = (st.id === "lc" ? "LC-" : st.id === "areeb" ? "AR-" : "FR-") + (1000 + Math.floor(Math.random() * 9000)); L.codes.unshift({ c: P.code, ph: "05X ••• (إنت)", used: false }); toast("كمّلت الكارت!", "اتولّد كود مكافأة — شوفه في «كارتي» على الموبايل وفي «الولاء» هنا."); }
        else toast("ختم جديد على كارت الزبون", "اتحسب لما الطلب اتسلّم — مش لما الزبون ضغط.");
        P.view = "loy"; changed("stamp");
      } else if (o.tot < L.min) toast("الطلب أقل من حد الختم", "أقل فاتورة للختم " + L.min + " " + st.b.cur + " — تقدر تغيّرها من «الولاء».");
    }
    if (st.ph.done && st.ph.done.o === o) changed("ostat");
    renderSide(); renderMain();
  }

  /* ======================================================================
     الأحداث
     ====================================================================== */
  function num(v, a, b) { v = parseInt(String(v).replace(/[^\d]/g, ""), 10); if (isNaN(v)) return null; return Math.max(a, Math.min(b, v)); }
  function item(id) { return st.items.filter(function (x) { return x.id === id; })[0]; }

  root.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act],[data-pa]");
    if (!t || !root.contains(t)) return;
    if (t.hasAttribute("data-pa")) { phoneAct(t, e); return; }
    var a = t.getAttribute("data-act"), v = t.getAttribute("data-v");
    switch (a) {
      case "brand": open(v); break;
      case "mod": go(v); break;
      case "coach": var c = stepNow(); if (c) { go(c.mod); if (mobile()) $("#lx .win").scrollIntoView({ behavior: "smooth", block: "start" }); } break;
      case "skip": var c2 = stepNow(); if (c2) { st.tour[c2.k] = true; renderCoach(); markTour(); } break;
      case "retour": st.tour = {}; renderCoach(); markTour(); break;
      case "phclose": hidePhone(); break;
      /* الطلبات */
      case "demo-order": demoOrder(); break;
      case "ofil": st.ofil = v; renderMain(); break;
      case "ost": setStatus(+v, t.getAttribute("data-s")); break;
      case "rcpt": receipt(+v); break;
      case "sound": st.sound = !st.sound; renderMain(); if (st.sound) chime(); break;
      /* المنيو */
      case "msec": st.msec = v; renderMain(); break;
      case "avail": var it = item(v); it.on = !it.on; renderMain(); changed("i-" + v); if (!it.on) done("sold"); break;
      case "addopen": st.adding = true; renderMain(); var n = $("#nwN"); if (n) n.focus(); break;
      case "addcancel": st.adding = false; renderMain(); break;
      case "npic": st.newPic = v; renderMain(); break;
      case "additem":
        var nm = ($("#nwN").value || "").trim(), pr = num($("#nwP").value, 1, 999), sc = $("#nwS").value;
        if (!nm) { $("#nwN").focus(); toast("اكتب اسم الصنف الأول"); break; }
        var nid = "n" + Date.now();
        st.items.push({ id: nid, n: nm, p: pr || 15, s: sc, im: st.newPic, d: "صنف جديد", b: "", on: true, nw: true, v: 0, o: 0 });
        st.adding = false; st.msec = sc; renderMain(); st.ph.view = "menu"; st.ph.sec = sc; changed("i-" + nid);
        toast("الصنف نزل في المنيو", "بعلامة «جديد» — والزبون يقدر يطلبه دلوقتي.");
        break;
      /* العروض */
      case "opic": st.draft.im = v; renderMain(); break;
      case "offon": st.offer.on = !st.offer.on; if (st.draft) st.draft.on = st.offer.on; renderMain(); st.ph.view = "menu"; changed("offer"); break;
      case "publish":
        var D = st.draft, changedImg = D.im !== st.offer.im;
        D.ends = Date.now() + (((D.to - new Date().getHours() + 24) % 24) || 4) * 3600000;
        st.offer = JSON.parse(JSON.stringify(D)); st.offer.on = true; st.forceOffer = true;
        renderMain(); st.ph.view = "menu"; st.ph.sheet = null;
        var sc2 = $(".ps__sc"); if (sc2) sc2.scrollTop = 0;
        changed("offer"); done("offer");
        if (!changedImg) toast("العرض اتنشر", "جرّب كمان تغيّر الصورة — هتتغيّر عند كل الزباين.");
        break;
      /* الولاء */
      case "lgoal": st.loy.goal = Math.max(3, Math.min(10, st.loy.goal + +v)); renderMain(); st.ph.view = "loy"; changed("loy"); break;
      case "lmin": st.loy.min = Math.max(0, Math.min(100, st.loy.min + +v)); renderMain(); break;
      case "lday": st.loy.perDay = !st.loy.perDay; renderMain(); break;
      case "fillcode": st.loy.code = v; renderMain(); break;
      case "redeem":
        var cd = (st.loy.code || "").trim().toUpperCase(), hit = st.loy.codes.filter(function (x) { return x.c === cd; })[0];
        if (!hit) toast("الكود ده مش موجود", "جرّب واحد من «أكواد مستنية تتصرف».");
        else if (hit.used) toast("الكود ده اتصرف قبل كده", "كل كود بيتصرف مرة واحدة بس.");
        else { hit.used = true; st.loy.code = ""; toast("المكافأة اتصرفت — " + hit.c, "الكود اتقفل ومحدش يقدر يستخدمه تاني."); if (hit.c === st.ph.code) { st.ph.stamps = 0; st.ph.code = ""; changed("loy"); } }
        renderMain(); break;
      /* التقييمات */
      case "rth": st.rev.th = +v; renderMain(); if (st.ph.view === "rate") changed(); break;
      case "rdone": st.rev.list[+v].done = true; st.rev.list[+v].fresh = false; renderMain(); renderSide(); break;
      case "call": toast("في السيستم الحقيقي بيتصل على طول", "الرقم بيبان كامل لصاحب المكان بس."); break;
      /* العملاء */
      case "seg": st.seg = v; renderMain(); break;
      case "csv": download("customers-demo.csv", [["الاسم", "الرقم", "زيارات", "إجمالي", "آخر زيارة"]].concat(st.cust.map(function (c) { return [c.n, c.ph, c.v, c.sum, new Date(c.last).toLocaleDateString("en-GB")]; }))); toast("اتنزّل ملف Excel تجريبي"); break;
      case "csv2": download("report-demo.csv", [["الصنف", "مشاهدات", "طلبات"]].concat(st.items.map(function (i) { return [i.n, i.v, i.o]; }))); toast("اتنزّل التقرير"); break;
      /* الحماية */
      case "gtg": st.guard[v] = !st.guard[v]; renderMain(); break;
      case "gcool": st.guard.cool = Math.max(0, Math.min(300, st.guard.cool + +v)); renderMain(); break;
      case "gday": st.guard.daily = Math.max(1, Math.min(20, st.guard.daily + +v)); renderMain(); break;
      case "gblock": var bp = (st.guard.blockIn || "").replace(/[^\d]/g, ""); if (bp.length < 8) { toast("اكتب رقم صحيح"); break; } st.guard.block.unshift("05" + bp.slice(2, 3) + " ••• " + bp.slice(-4)); st.guard.blockIn = ""; renderMain(); toast("الرقم اتحظر", "مش هيقدر يبعت طلبات تاني."); break;
      case "gunblock": st.guard.block.splice(+v, 1); renderMain(); break;
      case "gconfirm": case "greject": case "paid":
        var arr = a === "paid" ? st.pay.wait : st.guard.queue, i2 = arr.map(function (x) { return x.no; }).indexOf(+v);
        if (i2 > -1) {
          var oo = arr.splice(i2, 1)[0];
          oo.flag = null; oo.ref = a === "paid" ? null : oo.ref;
          oo.st = a === "greject" ? "x" : "new"; oo.fresh = a !== "greject";
          st.orders.unshift(oo);
          toast(a === "greject" ? "الطلب اترفض ومش هيتحسب" : a === "paid" ? "الفلوس وصلت — الطلب دخل المطبخ" : "اتأكد — الطلب دخل المطبخ", a === "greject" ? "" : "لقيته في «الطلبات» بعلامة جديد.");
          if (st.ph.done && st.ph.done.o === oo) changed("ostat");
        }
        renderSide(); renderMain(); break;
      case "ptg": st.pay[v] = !st.pay[v]; if (!st.pay.stc && !st.pay.bank && !st.pay.cash) st.pay.cash = true; renderMain(); if (st.ph.view === "cart") changed(); break;
      /* QR */
      case "tables": st.tables = Math.max(1, Math.min(12, st.tables + +v)); renderMain(); break;
      case "printqr": d.body.classList.add("print-qr"); window.print(); d.body.classList.remove("print-qr"); break;
      /* الهوية */
      case "lcol": st.look.c = v; applyAccent(); renderMain(); changed("head"); break;
      case "ldark": st.look.dark = !st.look.dark; renderMain(); changed("head"); break;
      /* التقارير */
      case "rrange": st.rep.range = +v; renderMain(); break;

      /* ---------- الجيم ---------- */
      case "gbr": st.branch = v; renderMain(); if (v !== "all") done("branch"); break;
      case "cquick": st.code = v; findMember(); break;
      case "cfind": st.code = ($("#gcode") || {}).value || st.code; findMember(); break;
      case "cin": checkIn(); break;
      case "cundo":
        var mm = st.res && st.res.m;
        if (mm && st.res.ok) { mm.left++; st.log.shift(); st.res.ok = null; st.lastIn = null; renderMain(); changed("ring"); toast("التسجيل اتلغى والجلسة رجعت"); }
        break;
      case "cshow": st.sel = st.res.m.code; changed("ring"); if (mobile()) showPhone(false); break;
      case "mfil": st.mfil = v; renderMain(); break;
      case "mopen": st.open = st.open === v ? null : v; st.sel = v; renderMain(); renderPhone(); break;
      case "frzd": st.frz = Math.max(7, Math.min(60, st.frz + +v)); renderMain(); break;
      case "frz": var fm = memBy(v); fm.frozen = true; fm.exp += st.frz * DAY; st.sel = v; renderMain(); renderSide(); changed("exp"); done("freeze"); toast("الاشتراك اتجمّد " + st.frz + " يوم", "تاريخ الانتهاء بقى " + fdate(fm.exp) + " لوحده."); break;
      case "unfrz": var um = memBy(v); um.frozen = false; st.sel = v; renderMain(); renderSide(); changed("exp"); toast("التجميد اتفك"); break;
      case "renew":
        var rm = memBy(v), pl = st.plans[rm.plan], price = pl.p[rm.br] || pl.p.b2;
        rm.left = pl.s; rm.exp = Date.now() + 30 * DAY; rm.frozen = false; rm.debt = 0; st.sel = v;
        st.cash.rows.unshift(["تجديد " + pl.n + " — " + rm.n, price, "in"]);
        renderMain(); renderSide(); changed("ring"); toast("اتجدّد — " + pl.s + " جلسة", "واتسجّل " + n2(price) + " ج في الخزنة لوحده.");
        break;
      case "mshow": st.sel = v; changed("ring"); if (mobile()) showPhone(false); break;
      case "book": var cl = st.cls[+v]; if (cl.in < cl.cap) cl.in++; renderMain(); if (cl.in >= cl.cap) toast("الحصة اتملت واتقفلت", "مفيش حجز زيادة عن السعة."); break;
      case "pbr": st.plansBr = v; renderMain(); break;
      case "close":
        var C = st.cash, net = C.rows.reduce(function (a2, r) { return a2 + (r[2] === "in" ? r[1] : -r[1]); }, 0), got = num(C.drawer === "" ? net : C.drawer, 0, 9999999);
        C.closed = { diff: (got == null ? net : got) - net }; renderMain(); done("close"); break;
      case "mlist": st.msgs.list = v; st.msgs.note = null; renderMain(); break;
      case "tvar": st.msgs.tpl += " " + v; renderMain(); break;
      case "send":
        var L2 = listMem(st.msgs.list);
        st.msgs.note = "اتجهزت " + L2.length + " رسالة باسم كل عضو — في السيستم الحقيقي بتتبعت من واتساب الجيم.";
        if (L2[0]) { st.sel = L2[0].code; st.gnote = { code: L2[0].code, t: fillTpl(L2[0]) }; setTimeout(function () { st.gnote = null; if (st.gym) renderPhone(); }, 6000); }
        renderMain(); changed("ring"); done("msg"); break;
      case "role": st.role = v; var vis = visibleMods(); if (vis.indexOf(st.mod) === -1) st.mod = vis[0]; renderSide(); renderMain(); break;
    }
  });

  function findMember() {
    var m = memBy(String(st.code).trim());
    st.res = { m: m, ok: null };
    if (m) { st.sel = m.code; renderPhone(); }
    renderMain();
  }
  function checkIn() {
    var m = st.res && st.res.m; if (!m) return;
    m.left--; var t = Date.now();
    st.res.ok = t; st.lastIn = { code: m.code, t: t };
    st.log.unshift({ n: m.n, code: m.code, t: t });
    renderMain(); changed("ring"); done("checkin");
  }

  function phoneAct(t, e) {
    var a = t.getAttribute("data-pa"), v = t.getAttribute("data-v"), P = st.ph;
    touched = true;
    if (a === "sclose") { if (e.target.closest("[data-stop]")) return; P.sheet = null; renderPhone(); return; }
    switch (a) {
      case "psec": P.sec = v; renderPhone(); var sc = $(".ps__sc"); if (sc) sc.scrollTop = 0; break;
      case "pitem": var it = item(v); if (!it || !it.on) return; P.sheet = { id: v, sz: it.sz ? (it.sz.length === 3 ? 1 : 0) : 0, add: [] }; renderPhone(); break;
      case "psz": P.sheet.sz = +v; renderPhone(); break;
      case "padd": var i = P.sheet.add.indexOf(+v); if (i > -1) P.sheet.add.splice(i, 1); else P.sheet.add.push(+v); renderPhone(); break;
      case "padd2cart":
        var it2 = item(P.sheet.id), adds = addsFor(it2), sel = P.sheet;
        var unit = (it2.sz ? it2.sz[sel.sz] : it2.p) + sel.add.reduce(function (x, k) { return x + adds[k][1]; }, 0);
        P.cart.push({ id: it2.id, n: it2.n + (it2.sz ? " (" + (it2.sz.length === 3 ? ["صغير", "وسط", "كبير"] : ["وسط", "كبير"])[sel.sz] + ")" : ""), s: it2.s, q: 1, unit: unit, addN: sel.add.map(function (k) { return adds[k][0]; }), up: false });
        P.sheet = null; P.blocked = false; renderPhone("cart"); break;
      case "pq": var l = P.cart[+v]; l.q += +t.getAttribute("data-d"); if (l.q <= 0) P.cart.splice(+v, 1); renderPhone(); break;
      case "pup": var s = item(v); P.cart.push({ id: s.id, n: s.n, s: s.s, q: 1, unit: s.p, addN: [], up: true }); renderPhone("ctot"); toast("اقتراح «يمشي معاه» اتقبل", "+" + s.p + " " + st.b.cur + " على الفاتورة — من غير ما حد يضغط على الزبون."); break;
      case "pmode": P.mode = v; P.blocked = false; renderPhone(); break;
      case "ppay": P.pay = v; P.blocked = false; renderPhone(); break;
      case "psend": sendFromPhone(); break;
      case "pview": P.view = v; P.sheet = null; if (v !== "done") P.done = v === "cart" ? null : P.done; if (v === "rate") { P.sentC = false; } renderPhone(); var s2 = $(".ps__sc"); if (s2) s2.scrollTop = 0; break;
      case "pstar": P.stars = +v; P.sentC = false; renderPhone(); break;
      case "pgoogle": toast("في السيستم الحقيقي بيفتح صفحة التقييم على جوجل ماب", "الراضي بيروح لجوجل — والزعلان بيكتبلك إنت."); st.rev.google++; if (st.mod === "reviews") renderMain(); break;
      case "pcomplain":
        var msg = (P.msg || "").trim() || "التجربة ما كانتش أحسن حاجة";
        st.rev.list.unshift({ st: P.stars, ph: "05X ••• (إنت)", t: msg, at: Date.now(), done: false, fresh: true });
        st.rev.caught++; P.sentC = true; P.msg = "";
        renderPhone(); renderSide();
        if (st.mod !== "reviews") go("reviews"); else renderMain();
        done("complaint"); break;
    }
  }

  root.addEventListener("change", function (e) {
    var t = e.target, k = t.getAttribute("data-chg"); if (!k) return;
    var it = item(t.getAttribute("data-v"));
    if (k === "price") { var p = num(t.value, 1, 999); if (p == null) { t.value = it.p; return; } if (p !== it.p) { it.p = p; changed("p-" + it.id); done("price"); toast("السعر اتغيّر — " + it.n + " بقى " + p + " " + st.b.cur, "اتغيّر عند كل الزباين في نفس اللحظة."); } }
    if (k === "badge") { it.b = t.value; changed("i-" + it.id); }
  });
  root.addEventListener("keydown", function (e) {
    var t = e.target;
    if (e.key === "Enter" && t.getAttribute("data-chg") === "price") { t.blur(); }
    if (e.key === "Enter" && t.id === "gcode") { e.preventDefault(); st.code = t.value; findMember(); }
  });
  root.addEventListener("input", function (e) {
    var t = e.target, k = t.getAttribute("data-in"), pk = t.getAttribute("data-pi");
    if (pk) { st.ph[pk] = t.value; if (pk !== "msg") st.ph.blocked = false; return; }
    if (!k) return;
    var D = st.draft;
    switch (k) {
      case "ot": D.t = t.value; break;
      case "od": D.d = t.value; break;
      case "op": D.p = num(t.value, 0, 9999) || 0; break;
      case "ow": D.was = num(t.value, 0, 9999) || 0; break;
      case "of": D.from = +t.value; break;
      case "oto": D.to = +t.value; break;
      case "lrew": st.loy.reward = t.value; if (st.ph.view === "loy") renderPhone(); return;
      case "lcode": st.loy.code = t.value; return;
      case "gblk": st.guard.blockIn = t.value; return;
      case "lname": st.look.name = t.value || st.b.name; renderSide(); changed("head"); return;
      case "ltag": st.look.tag = t.value; changed("tag"); return;
      case "gcode": st.code = t.value; return;
      case "drawer": st.cash.drawer = t.value; return;
      case "tpl": st.msgs.tpl = t.value; var pv = $(".main .c:nth-child(2) div[style*='E7F7DE']"); var f = listMem(st.msgs.list)[0]; if (pv && f) pv.textContent = fillTpl(f); return;
    }
    if (k.charAt(0) === "o") { var pr = $(".ofp"); if (pr) { $("b", pr).textContent = D.t; $("span", pr).textContent = D.p + " " + st.b.cur; $("s", pr).textContent = D.was; } }
  });
  root.addEventListener("change", function (e) { var k = e.target.getAttribute("data-in"); if (k === "of" || k === "oto") { /* المواعيد بتتطبّق مع «انشر» */ } });
  /* نسخ قيمة الموبايل لما الزبون يكتب في الكارت */
  root.addEventListener("pointerdown", function (e) { if (e.target.closest("#lphone")) touched = true; });

  /* ======================================================================
     فتح مكان + زرار الموبايل العايم
     ====================================================================== */
  function open(id, mod) {
    if (!S.brands[id]) return;
    if (st && st.id === id && !mod) return;
    st = STATES[id] || (STATES[id] = id === "cezar" ? mkGym() : mkCafe(id));
    if (mod) {
      var ok = (st.gym ? GM : MODS)[mod];
      if (ok) st.mod = mod;
      if (st.gym && ROLE_MODS[st.role] && ROLE_MODS[st.role].indexOf(st.mod) === -1) st.role = "owner";
    }
    renderAll();
  }

  var peekBtn = d.createElement("button");
  peekBtn.type = "button"; peekBtn.className = "lx__peek";
  peekBtn.innerHTML = '<span class="dot"></span>' + IC("mobile") + "<span>شاشة الزبون</span>";
  d.body.appendChild(peekBtn);
  peekBtn.addEventListener("click", function () { var p = $("#lphone"); if (p && p.classList.contains("open")) hidePhone(); else showPhone(false); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        peekBtn.classList.toggle("show", en.isIntersecting);
        peekBtn.querySelector("span:last-child").textContent = st && st.gym ? "موبايل العضو" : "شاشة الزبون";
        if (!en.isIntersecting) hidePhone();
      });
    }, { rootMargin: "-30% 0px -30% 0px" }).observe(d.getElementById("labx"));
  }

  open("lc");
  window.LAB = { open: open, get state() { return st; } };
})();
