/* ==========================================================================
   .ATHR Systems — الفيديو (أنيميشن بالكود، من غير صوت)
   مسرح 1280×720 · GSAP timeline واحد · كل نص بيتغيّر مربوط بالوقت (يشتغل صح مع التقديم والترجيع)
   ========================================================================== */
(function () {
  var S = window.SYS, IC = window.IC, gsap = window.gsap;
  var stage = document.getElementById("stage");
  if (!stage || !gsap || !S) return;
  var B = S.brands, im = S.img;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ------------------------------------------------------------------
     المشاهد: البداية والنهاية والنص اللي بيظهر (الكمبيوتر + تحت الفيديو في الموبايل)
     ------------------------------------------------------------------ */
  var CH = [
    { t: 0, n: "Intro" },
    { t: 4.8, n: "Menu", k: "01", brand: "lc", h: "Customers see everything.", b: "A photo, price and details for every item. No more “how much is this?”" },
    { t: 11.2, n: "Orders", k: "02", brand: "lc", h: "Orders arrive clear and priced.", b: "From the table to your screen, with a bell. A smart tip added +10 SAR." },
    { t: 19.2, n: "Offers", k: "03", brand: "lc", h: "Change an offer in seconds.", b: "Pick a photo and a price. Every customer sees it right away." },
    { t: 27.2, n: "Control", k: "04", brand: "friends", h: "Sold out? One tap.", b: "It stops being ordered. Prices change with no reprinting." },
    { t: 33.7, n: "Loyalty", k: "05", brand: "areeb", h: "They come back. Complaints come to you.", b: "A stamp card brings them back. Unhappy customers talk to you before Google." },
    { t: 42.2, n: "Numbers", k: "06", brand: "areeb", h: "See what sells.", b: "Sales, busy hours and slow items — and what to do next." },
    { t: 48.7, n: "Gym", k: "07", brand: "cezar", h: "A gym? Same idea.", b: "Members check in with a code. Sessions count down. You know who to remind." },
    { t: 56.2, n: "End" }
  ];
  var DUR = 62;
  var HOOK_CAP = { h: "Too many messages. Too much time.", b: "Your menu can answer most of them for you." };
  var OUT_CAP = { h: "Now try it yourself.", b: "Everything in this video works in the dashboard below." };

  /* ------------------------------------------------------------------
     أدوات بناء الشاشات
     ------------------------------------------------------------------ */
  function vars(b) {
    var t = b.t;
    return "--pb:" + t.bg + ";--pc:" + t.card + ";--pi:" + t.ink + ";--pi2:" + t.ink2 + ";--pp:" + t.pri + ";--pl:" + t.line + ";--pon:" + t.on + ";--pa:" + t.acc;
  }
  function bar() { return '<div class="ph__bar"><span>9:41</span><i><u style="height:4px"></u><u style="height:6px"></u><u style="height:8px"></u><u style="height:10px"></u></i></div>'; }
  function words(s) {
    return s.split(" ").map(function (w) { return '<span class="wm"><span class="w">' + esc(w) + "</span></span>"; }).join(" ");
  }
  function txt(c) {
    var b = B[c.brand];
    return '<div class="sc__txt"><p class="sc__k"><b>' + c.k + '</b><i></i><span>' + c.n + "</span></p>" +
      '<h3 class="sc__h">' + words(c.h) + "</h3>" +
      '<p class="sc__b">' + words(c.b) + "</p>" +
      '<p class="sc__brand" style="--bc:' + (b.t.dark ? b.t.pri : (b.id === "cezar" ? "#BEF23C" : b.t.pri)) + '"><i></i>From the <b>' + esc(b.nameEn) + "</b> system</p></div>";
  }
  function cur() { return '<div class="cur"><div class="cur__r"></div><div class="cur__d"></div></div>'; }
  function money(v, b) { return Math.round(v).toLocaleString("en-US") + " " + (b || "ر.س"); }
  function item(b, id, extra) {
    var it = b.items.filter(function (x) { return x.id === id; })[0];
    return '<div class="it" data-it="' + id + '"><img src="' + im(it.im) + '" alt=""><div><b>' + esc(it.n) + "</b><small>" + esc(it.d) + "</small>" +
      (extra && extra.bdg ? '<span class="bdg"' + (extra.bdg === 2 ? ' style="opacity:1"' : "") + ">" + IC("fire") + "الأكثر طلبًا</span>" : "") + "</div>" +
      '<div class="pz"><span><span class="pv">' + it.p + "</span> " + b.cur + "</span><u>" + IC("plus") + "</u></div>" +
      (extra && extra.sold ? '<span class="sold">خلص النهارده</span>' : "") + '<span class="flash"></span></div>';
  }
  function head(b) {
    if (b.logo) return '<div class="mn__hd"><img src="' + b.logo + '" alt=""></div>';
    if (b.flag) return '<div class="mn__hd"><span class="mn__flag"><svg viewBox="0 0 100 92"><path d="M6 14C34-4 74 0 95 22L64 36C54 27 42 26 33 32L46 88Z" fill="#F97316"/></svg><b>F</b>RIENDS</span></div>';
    return '<div class="mn__hd"><span class="mn__word">' + esc(b.word || b.name) + "</span></div>";
  }
  function side(b, on, gym) {
    var nav = gym ?
      [["home", "لوحة القيادة"], ["door", "الدخول والحضور"], ["users", "الأعضاء"], ["tag", "الباقات"], ["cash", "الخزنة"], ["msg", "الرسايل"], ["calendar", "الحصص"], ["chart", "التقارير"]] :
      [["home", "الرئيسية"], ["receipt", "الطلبات"], ["book", "المنيو"], ["tag", "العروض"], ["gift", "الولاء"], ["star", "التقييمات"], ["users", "العملاء"], ["chart", "التقارير"]];
    var mk = b.mark ? '<img src="' + b.mark + '" alt="">' : '<span class="mk">' + (gym ? "CZ" : esc(b.en.slice(0, 2))) + "</span>";
    return '<div class="adm__side"><div class="adm__brand">' + mk + esc(b.name) + "</div>" +
      nav.map(function (n) { return '<div class="adm__nav' + (n[1] === on ? " on" : "") + '">' + IC(n[0]) + n[1] + (n[1] === "الطلبات" && on === "الطلبات" ? '<em class="navb">2</em>' : "") + "</div>"; }).join("") + "</div>";
  }
  function admVars(b) {
    if (b.id === "cezar") return "";
    var p = b.t.pri;
    return "--ac:" + p + ";--acs:" + hexA(p, .13) + ";--acon:#fff";
  }
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return "rgba(" + (n >> 16) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }
  function qr(seed) {
    var n = 21, cells = "", r = seed;
    var rnd = function () { r = (r * 1103515245 + 12345) & 0x7fffffff; return r / 0x7fffffff; };
    var finder = function (x, y) { return (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); };
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var on;
      if (finder(x, y)) {
        var fx = x > 13 ? x - 14 : x, fy = y > 13 ? y - 14 : y;
        on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5);
      } else on = rnd() > .52;
      if (on) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
    return '<svg viewBox="-1 -1 23 23" shape-rendering="crispEdges"><rect x="-1" y="-1" width="23" height="23" fill="#fff"/><g fill="#111">' + cells + "</g></svg>";
  }

  /* ------------------------------------------------------------------
     HTML المشاهد
     ------------------------------------------------------------------ */
  var lc = B.lc, ar = B.areeb, fr = B.friends, cz = B.cezar;
  var MSGS = [["نورة", "السلام عليكم، المنيو لو سمحت؟"], ["فهد", "بكم السبانش لاتيه؟"], ["ريم", "عندكم تشيز كيك اليوم؟"], ["خالد", "أبي أطلب سفري"],
    ["سارة", "متى تفتحون؟"], ["عبدالله", "وين طلبي؟"], ["لمى", "فيه عرض اليوم؟"], ["تركي", "كم سعر الكوكيز؟"], ["جود", "المنيو لو سمحت"]];

  var H = [];
  /* 0 · البداية */
  H.push('<div class="sc" data-s="0"><div class="sc__bg"></div><div class="sc__grid"></div>' +
    '<div class="devs nocmp"><div class="ph" style="left:470px;top:100px"><div class="ph__s" style="background:#EFEAE2;--pb:#fff">' + bar() +
      '<div class="chat"><div class="chat__hd"><span class="av">◆</span><div><b>رسايل الصفحة</b><small>نشط الآن</small></div><em class="h-cnt">1</em></div>' +
      '<div class="chat__list">' + MSGS.map(function (m) { return '<div class="bub"><b>' + m[0] + "</b>" + m[1] + "<small>9:41</small></div>"; }).join("") + "</div></div>" +
    "</div></div></div>" +
    '<h3 class="hook__h keep-t">' + words("Same questions.") + '<br><span style="color:#F24A3D">' + words("Every day.") + "</span></h3>" +
    '<h3 class="hook__h2 keep-t">' + words("Let the system") + "<br>" + words("answer.") + '<em>◆</em></h3>' +
    '<p class="hook__s">Menu · Orders · Offers · Numbers — in one system.</p>' +
    '<div class="big-dm" style="left:1039px;top:360px"></div></div>');

  /* 1 · المنيو (محصول فاخر) */
  H.push('<div class="sc" data-s="1"><div class="sc__bg"></div><div class="sc__grid"></div>' + txt(CH[1]) +
    '<div class="devs">' +
      '<div class="tent" style="position:absolute;left:110px;top:330px;width:190px;background:#fff;border-radius:18px;padding:18px;box-shadow:0 30px 50px -28px rgba(17,17,17,.45);text-align:center;border:1px solid #ECE8E2">' +
        '<img src="' + lc.logo + '" alt="" style="height:16px;margin:0 auto 10px">' +
        '<div style="width:120px;margin:0 auto">' + qr(7) + "</div>" +
        '<p style="margin:10px 0 0;font-size:14px;font-weight:700">امسح واطلب</p><p style="margin:2px 0 0;font-size:12px;color:#767676">طاولة <b class="num" style="color:#111">4</b></p></div>' +
      '<div class="ph" style="left:380px;top:100px"><div class="ph__s" style="' + vars(lc) + '">' + bar() +
        '<div class="mn"><div class="mn__in">' + head(lc) +
          '<div class="offer"><img src="' + im("lc/combo-start-day") + '" alt=""><span class="offer__lbl">عرض اليوم</span><span class="offer__tm">' + IC("clock") + "02:14:09</span>" +
            '<div class="offer__t"><small>لاتيه حار + كوكيز فانيليا</small><b>بداية اليوم</b><div class="offer__p"><strong>23 ر.س</strong><s>27</s></div></div></div>' +
          '<div class="mpills"><span class="on">الساخنة</span><span>الباردة</span><span>V60</span><span>الحلا</span></div>' +
          '<p class="mh">الساخنة</p>' + item(lc, "spanish", { bdg: 2 }) + item(lc, "latte") + item(lc, "cappuccino") + item(lc, "flatwhite") + item(lc, "espresso") +
        "</div>" +
        '<div class="cartbar"><span>' + IC("cart") + 'سلتك · 1 صنف</span><b>22 ر.س</b></div>' +
        '<div class="sheet"><img class="sheet__img" src="' + im("lc/spanish") + '" alt=""><h6>سبانش لاتيه حار</h6><p>إسبريسو + حليب مكثّف</p>' +
          '<div class="opt o1"><span><i class="chk"></i>شوت إسبريسو زيادة</span><b>+4</b></div>' +
          '<div class="opt"><span><i></i>حليب نباتي (لوز/شوفان)</span><b>+5</b></div>' +
          '<div class="opt"><span><i></i>سيرب كراميل</span><b>+3</b></div>' +
          '<div class="bigbtn">أضف للسلة · <b class="sp">18</b> ر.س</div></div>' +
        "</div>" +
        '<div class="cam" style="position:absolute;inset:0;background:#0E0E0E;z-index:24;display:grid;place-items:center">' +
          '<div style="position:relative;width:150px;height:150px"><div style="position:absolute;inset:0;border-radius:18px;box-shadow:0 0 0 2000px rgba(0,0,0,.35)"></div>' +
          '<div style="position:absolute;inset:12px;opacity:.9">' + qr(7) + "</div>" +
          '<i class="cn" style="top:0;left:0;border-width:3px 0 0 3px;border-radius:16px 0 0 0"></i><i class="cn" style="top:0;right:0;border-width:3px 3px 0 0;border-radius:0 16px 0 0"></i><i class="cn" style="bottom:0;left:0;border-width:0 0 3px 3px;border-radius:0 0 0 16px"></i><i class="cn" style="bottom:0;right:0;border-width:0 3px 3px 0;border-radius:0 0 16px 0"></i>' +
          '<i class="scan" style="position:absolute;left:8px;right:8px;top:8px;height:2px;background:#F24A3D;box-shadow:0 0 12px #F24A3D"></i></div>' +
          '<p style="position:absolute;bottom:60px;left:0;right:0;text-align:center;color:#fff;font-size:12px">وجّه الكاميرا على الكود</p></div>' +
      "</div></div>" + cur() + "</div></div>");

  /* 2 · الطلب */
  H.push('<div class="sc" data-s="2"><div class="sc__bg"></div><div class="sc__grid"></div>' + txt(CH[2]) +
    '<div class="devs">' +
      '<div class="lapw" data-k=".8" style="left:0;top:190px;transform:scale(.8)"><div class="lap"><div class="lap__s"><div class="lap__in"><div class="adm" style="' + admVars(lc) + '">' + side(lc, "الطلبات") +
        '<div class="adm__main"><div class="adm__hd"><div><h5>الطلبات</h5><p>النهارده · طاولات وسفري</p></div><div style="display:flex;gap:8px;align-items:center"><span class="adm__chip"><i></i>مباشر</span><div class="bell">' + IC("bell") + '<em>1</em></div></div></div>' +
        '<div class="pills"><span class="pill on">الكل <b class="p-all">37</b></span><span class="pill">جديد <b class="p-new">0</b></span><span class="pill">في التحضير <b class="p-prep">2</b></span><span class="pill">اتسلّم <b>35</b></span></div>' +
        '<div class="ord"><div class="slot" style="overflow:hidden;height:0"><div class="ord__c is-new nw"><div class="ord__t"><b>#D241</b><span class="tag new tg1">جديد</span><span class="adm__chip">طاولة 4</span><span class="tm">دلوقتي</span></div>' +
          '<div class="ord__l"><span>سبانش لاتيه حار + شوت زيادة</span><span>22</span></div><div class="ord__l"><span>كوكيز فانيليا <small style="color:#F24A3D">· يمشي معاه</small></span><span>10</span></div>' +
          '<div class="ord__f"><span class="tot">32 ر.س</span><div><span class="btnm gh b-print">' + IC("printer") + 'طباعة</span><span class="btnm b-go">ابدأ التجهيز</span></div></div></div></div>' +
          '<div class="ord__c"><div class="ord__t"><b>#D240</b><span class="tag prep">في التحضير</span><span class="adm__chip">طاولة 2</span><span class="tm">قبل 4 دقايق</span></div><div class="ord__l"><span>لاتيه حار ×2 · كوكيز شوكلت</span><span>44</span></div><div class="ord__f"><span class="tot">44 ر.س</span><div><span class="btnm">اتسلّم</span></div></div></div>' +
          '<div class="ord__c"><div class="ord__t"><b>#D239</b><span class="tag done">اتسلّم</span><span class="adm__chip">سفري · عبدالله</span><span class="tm">قبل 11 دقيقة</span></div><div class="ord__l"><span>كولد برو · تراميسو</span><span>44</span></div></div>' +
        "</div></div></div></div></div><div class=\"lap__b\"></div></div></div>" +
      '<div class="rcpt" style="left:24px;top:468px;opacity:0"><h6>محصول فاخر</h6><p><span>#D241 · طاولة 4</span><span>9:41</span></p><hr><p><span>سبانش لاتيه + شوت</span><span>22</span></p><p><span>كوكيز فانيليا</span><span>10</span></p><hr><p><b>الإجمالي</b><b>32 ر.س</b></p><hr><p style="justify-content:center;color:#767676">شكرًا لزيارتك</p></div>' +
      '<div class="ph" style="left:546px;top:100px"><div class="ph__s" style="' + vars(lc) + '">' + bar() +
        '<div class="mn"><div class="mn__in"><p class="mh" style="font-size:16px;margin-top:8px">سلتك</p><p style="margin:0;font-size:10px;color:var(--pi2)">طاولة 4 · محلي</p>' +
          '<div class="crow"><span>سبانش لاتيه حار + شوت زيادة</span><b>22</b></div>' +
          '<div class="slot2" style="overflow:hidden;height:0"><div class="crow"><span>كوكيز فانيليا</span><b>10</b></div></div>' +
          '<div class="sug"><img src="' + im("lc/cookie-van") + '" alt=""><div><small>يمشي معاه</small><b>كوكيز فانيليا</b></div><u>أضف · 10</u></div>' +
          '<div class="crow" style="border:0;margin-top:14px;font-size:13px"><span style="font-weight:700">الإجمالي</span><b class="ctot" style="font-size:16px;color:var(--pp)">22 ر.س</b></div>' +
          '<span class="plus-pop" style="left:20px;top:250px">+10</span>' +
          '<div class="bigbtn send">' + IC("send") + "ابعت الطلب</div>" +
        '</div><div class="ok"><div class="ok__c">' + IC("check") + "</div><b>طلبك وصل للكاشير</b><small>بنجهّزه دلوقتي — طاولة 4</small><em>#D241</em></div></div>" +
      "</div></div>" + cur() + "</div></div>");

  /* 3 · العروض */
  H.push('<div class="sc" data-s="3"><div class="sc__bg"></div><div class="sc__grid"></div>' + txt(CH[3]) +
    '<div class="devs">' +
      '<div class="lapw" data-k=".8" style="left:0;top:190px;transform:scale(.8)"><div class="lap"><div class="lap__s"><div class="lap__in"><div class="adm" style="' + admVars(lc) + '">' + side(lc, "العروض") +
        '<div class="adm__main"><div class="adm__hd"><div><h5>العروض</h5><p>اللي بيظهر فوق في المنيو</p></div><span class="adm__chip"><i></i>العرض شغّال</span></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' +
          '<div class="fld" style="gap:10px"><div class="fld"><label>اسم العرض</label><div class="in f-title"><span class="v-title">بداية اليوم</span><i class="caret c1"></i></div></div>' +
            '<div class="fld"><label>السعر</label><div class="in f-price"><span class="v-price num">23</span> ر.س <s class="v-was">27</s></div></div>' +
            '<div class="fld"><label>المواعيد (بيفتح ويقفل لوحده)</label><div class="in f-time"><span class="v-time">7 الصبح ← 11 الضهر</span></div></div>' +
            '<span class="btnm b-pub" style="height:34px;margin-top:4px">' + IC("send") + "انشر العرض</span></div>" +
          '<div><div style="position:relative;height:150px;border-radius:12px;overflow:hidden"><img src="' + im("lc/combo-start-day") + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" alt=""><img class="pv2" src="' + im("lc/combo-for-two") + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0" alt=""></div>' +
            '<p style="margin:10px 0 6px;font-size:10px;color:#8A857E">صورة العرض</p><div class="thumbs">' +
            lc.offers.map(function (o, i) { return '<div class="th' + i + (i === 0 ? " on" : "") + '"><img src="' + im(o.im) + '" alt=""></div>'; }).join("") + "</div></div>" +
        "</div>" +
        '<div class="toast" style="right:18px;bottom:16px">' + IC("check") + "اتنشر عند كل الزباين</div>" +
        "</div></div></div></div><div class=\"lap__b\"></div></div></div>" +
      '<div class="sig" style="left:500px;top:300px;width:1px"></div>' +
      '<div class="ph" style="left:546px;top:100px"><div class="ph__s" style="' + vars(lc) + '">' + bar() +
        '<div class="mn"><div class="mn__in">' + head(lc) +
          '<div class="offer o-ban"><img src="' + im("lc/combo-start-day") + '" alt=""><img class="img2" src="' + im("lc/combo-for-two") + '" alt=""><span class="offer__lbl">عرض اليوم</span><span class="offer__tm">' + IC("clock") + '<span class="o-tm">02:14:09</span></span>' +
            '<div class="offer__t"><small class="o-d">لاتيه حار + كوكيز فانيليا</small><b class="o-t">بداية اليوم</b><div class="offer__p"><strong><span class="o-p">23</span> ر.س</strong><s class="o-w">27</s></div></div></div>' +
          '<div class="mpills"><span class="on">الساخنة</span><span>الباردة</span><span>V60</span><span>الحلا</span></div>' +
          '<p class="mh">الساخنة</p>' + item(lc, "spanish", { bdg: 2 }) + item(lc, "latte") + item(lc, "cappuccino") +
        "</div></div></div></div>" + cur() + "</div></div>");

  /* 4 · التحكم (فرندس) */
  var frRows = ["crepeb", "crepemix", "bigking", "cheeseb", "doubleb"];
  H.push('<div class="sc" data-s="4"><div class="sc__bg"></div><div class="sc__grid"></div>' + txt(CH[4]) +
    '<div class="devs">' +
      '<div class="lapw" data-k=".8" style="left:0;top:190px;transform:scale(.8)"><div class="lap"><div class="lap__s"><div class="lap__in"><div class="adm" style="' + admVars(fr) + '">' + side(fr, "المنيو") +
        '<div class="adm__main"><div class="adm__hd"><div><h5>المنيو</h5><p>190 صنف · 7 أقسام</p></div><span class="btnm">' + IC("plus") + "صنف جديد</span></div>" +
        '<div class="pills"><span class="pill on">الكل</span><span class="pill">الكريب</span><span class="pill">البيتزا</span><span class="pill">السندوتشات</span><span class="pill">البروست</span></div>' +
        frRows.map(function (id) {
          var it = fr.items.filter(function (x) { return x.id === id; })[0];
          return '<div class="mrow r-' + id + '"><img src="' + im(it.im) + '" alt=""><div><b>' + esc(it.n) + '</b><small class="st-' + id + '">' + (id === "crepemix" ? '<span class="bd-btn" style="border:1px dashed #D4D0C9;border-radius:5px;padding:0 5px">+ بادج</span>' : "متاح") + "</small></div>" +
            '<div class="pr pr-' + id + '"><span class="pv num">' + it.p + "</span> ر.س</div><div class=\"tg tg-" + id + '"></div></div>';
        }).join("") +
        "</div></div></div></div><div class=\"lap__b\"></div></div></div>" +
      '<div class="ph" style="left:546px;top:100px"><div class="ph__s" style="' + vars(fr) + '">' + bar() +
        '<div class="mn"><div class="mn__in">' + head(fr) +
          '<div class="mpills"><span class="on">الكل</span><span>الكريب</span><span>البيتزا</span><span>السندوتشات</span></div>' +
          frRows.map(function (id) { return item(fr, id, { sold: id === "bigking", bdg: id === "crepemix" }); }).join("") +
        "</div></div></div></div>" + cur() + "</div></div>");

  /* 5 · الولاء والتقييم (أريب) */
  H.push('<div class="sc" data-s="5"><div class="sc__bg"></div><div class="sc__grid"></div>' + txt(CH[5]) +
    '<div class="devs">' +
      '<div class="lapw" data-k=".8" style="left:0;top:190px;transform:scale(.8)"><div class="lap"><div class="lap__s"><div class="lap__in"><div class="adm" style="' + admVars(ar) + '">' + side(ar, "التقييمات") +
        '<div class="adm__main"><div class="adm__hd"><div><h5>التقييمات</h5><p>4 و5 نجوم بيروحوا لجوجل · الباقي بيوصلك هنا</p></div></div>' +
        '<div class="sts"><div class="card kpi"><small>اتحوّلوا لجوجل</small><b class="num">214</b></div><div class="card kpi"><small>شكاوى اتلمّت قبل جوجل</small><b class="num k-cmp">21</b></div></div>' +
        '<div class="cmp"><div class="slot" style="overflow:hidden;height:0"><div class="cmp__c is-new nw"><div class="cmp__t"><span class="st">★★</span><span class="ph-n">05X XXX 4471</span><span class="tm">دلوقتي</span></div><p>القهوة وصلت باردة</p><div class="acts"><span class="btnm gh">' + IC("phone") + 'اتصل</span><span class="btnm b-res">' + IC("check") + "اتحلّت</span></div><span class=\"cmp__ok\">" + IC("check") + "</span></div></div>" +
          '<div class="cmp__c"><div class="cmp__t"><span class="st">★★★</span><span class="ph-n">05X XXX 1290</span><span class="tm">أمس</span></div><p>الطلب اتأخر شوية</p><div class="acts"><span class="tag done">' + IC("check") + "اتحلّت</span></div></div>" +
        "</div></div></div></div></div><div class=\"lap__b\"></div></div></div>" +
      '<div class="ph" style="left:546px;top:100px"><div class="ph__s" style="' + vars(ar) + '">' + bar() +
        '<div class="loy">' + head(ar) + '<p class="mh" style="margin-top:6px">كارت الولاء</p>' +
          '<div class="loy__card"><small>باقي كوب واحد</small><b>وتاخد مشروب ساخن على حسابنا</b><div class="loy__dots">' +
            [0, 1, 2, 3, 4, 5].map(function (i) { return "<i>" + '<u class="dt' + i + '">' + IC("coffee") + "</u></i>"; }).join("") +
          '</div><p class="loy__note">الختم بيتحسب لما الكاشير يسلّم طلبك</p>' +
          '<div class="loy__rw">' + IC("gift") + "<b>مشروبك الجاي علينا</b><em>AR-4821</em><small>ورّيه للكاشير — بيتصرف مرة واحدة</small></div></div>" +
        "</div>" +
        '<div class="rate">' + head(ar) + "<h6>قيّم زيارتك</h6><p>رأيك بيوصل لصاحب المكان</p>" +
          '<div class="stars">' + [1, 2, 3, 4, 5].map(function (i) { return '<i class="s' + i + '">' + IC("star") + "</i>"; }).join("") + "</div>" +
          '<p class="rate__lbl"></p><div class="rate__form"><label>إيه اللي ضايقك؟</label><div class="rate__ta"><span class="r-txt"></span><i class="caret c2"></i></div><small>رسالتك بتروح لصاحب المكان مباشرة</small><div class="bigbtn r-send">' + IC("send") + "ابعت لصاحب المكان</div></div>" +
        '</div><div class="ok"><div class="ok__c">' + IC("check") + "</div><b>وصلت لصاحب المكان</b><small>هيكلّمك ويحلّها</small></div>" +
      "</div></div>" + cur() + "</div></div>");

  /* 6 · الأرقام (أريب) */
  var BARS = [12, 18, 34, 58, 66, 48, 40, 44, 62, 84, 100, 72];
  H.push('<div class="sc" data-s="6"><div class="sc__bg"></div><div class="sc__grid"></div>' + txt(CH[6]) +
    '<div class="devs">' +
      '<div class="lapw" data-k="1" style="left:70px;top:150px"><div class="lap"><div class="lap__s"><div class="lap__in"><div class="adm" style="' + admVars(ar) + '">' + side(ar, "الرئيسية") +
        '<div class="adm__main"><div class="adm__hd"><div><h5>الرئيسية</h5><p>آخر 30 يوم</p></div><span class="adm__chip demo"><i></i>بيانات تجريبية</span></div>' +
        '<div class="card" style="background:var(--acs);border-color:transparent;padding:14px 16px"><small style="font-size:10.5px;color:#5E5A55">إجمالي مبيعات الشهر</small>' +
          '<div style="display:flex;align-items:baseline;gap:10px"><b class="num k-sales" style="font-size:34px;font-weight:600;line-height:1.15">0</b><span style="font-size:12px">ر.س</span><span class="kpi"><i>▲ 17% عن الشهر اللي فات</i></span></div>' +
          '<p style="margin:2px 0 0;font-size:10.5px;color:#5E5A55">منها <b class="num k-up">0</b> ر.س (12%) من الاقتراحات والإضافات</p></div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px"><div class="card kpi"><small>زوار المنيو</small><b class="num k-v">0</b></div><div class="card kpi"><small>طلبات</small><b class="num k-o">0</b></div><div class="card kpi"><small>متوسط الفاتورة</small><b class="num"><span class="k-a">0</span> ر.س</b></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px"><div class="card"><small style="font-size:10px;color:#8A857E">ساعات الزحمة</small><div class="bars">' +
          BARS.map(function (h, i) { return '<u class="' + (h > 80 ? "hi" : "") + '" style="height:' + h + '%"></u>'; }).join("") + "</div></div>" +
          '<div class="card" style="display:grid;gap:6px;align-content:start"><small style="font-size:10px;color:#8A857E">محتاج قرار منك</small>' +
            '<div class="dec d1">' + IC("eye") + "<span><b>3 أصناف</b> محدش فتحها من أسبوعين</span></div>" +
            '<div class="dec d2">' + IC("star") + "<span><b>4 تقييمات واطية</b> اتلمّت قبل جوجل</span></div>" +
            '<div class="dec d3">' + IC("clock") + "<span><b>الزحمة</b> من 7 لـ 10 بالليل</span></div></div></div>" +
        "</div></div></div></div><div class=\"lap__b\"></div></div></div>" + cur() + "</div></div>");

  /* 7 · الجيم (سيزر) */
  H.push('<div class="sc" data-s="7"><div class="sc__bg"></div><div class="sc__grid"></div>' + txt(CH[7]) +
    '<div class="devs">' +
      '<div class="lapw" data-k=".8" style="left:0;top:190px;transform:scale(.8)"><div class="lap"><div class="lap__s"><div class="lap__in"><div class="adm gym">' + side(cz, "الدخول والحضور", true) +
        '<div class="adm__main"><div class="adm__hd"><div><h5>الدخول والحضور</h5><p>49 حضور النهارده · 9 جوّه دلوقتي</p></div><span class="gnow"><i></i>فترة الرجالة · الفرع الأول</span></div>' +
        '<div class="gin"><div class="in"><small>كود العضو</small><span class="g-code"></span><i class="caret c3"></i></div><span class="gbtn">' + IC("door") + "سجّل دخول</span></div>" +
        '<div class="gmem"><span class="av">مس</span><div><b>محمود سمير</b><small>برونز · 12 جلسة · بينتهي 2 نوفمبر</small></div><div class="gses"><b class="num g-s">11</b><small>جلسة باقية</small></div>' +
          '<div class="gbar"><i class="g-bar" style="transform:scaleX(.9167)"></i></div><p class="gok">' + IC("check") + "دخل 5:47 م — الجلسة اتخصمت</p></div>" +
        '<div class="galert">' + IC("alert") + "<span><b>21 اشتراك</b> بيخلصوا خلال 7 أيام</span><span class=\"btnm g-msg\">" + IC("msg") + "ابعت رسالة</span></div>" +
        "</div></div></div></div><div class=\"lap__b\"></div></div></div>" +
      '<div class="ph" style="left:546px;top:100px"><div class="ph__s" style="background:#F3F1EB;color:#17181C;--pb:#F3F1EB;--pi:#17181C">' + bar() +
        '<div class="port"><div class="port__hd"><i>CZ</i>سيزر جيم</div>' +
          '<div class="port__card"><small>اشتراكك: برونز · 12 جلسة</small><div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="#2A2B30" stroke-width="10"/><circle class="g-ring" cx="60" cy="60" r="50" fill="none" stroke="#BEF23C" stroke-width="10" stroke-linecap="round" stroke-dasharray="314.16" stroke-dashoffset="26.18"/></svg><b><span class="num g-s2">11</span><small>جلسة باقية</small></b></div></div>' +
          '<div class="port__row"><span>آخر دخول</span><b class="g-last">أمس 6:10 م</b></div><div class="port__row"><span>بينتهي</span><b>2 نوفمبر</b></div><div class="port__row"><span>الفرع</span><b>الأول · ميدان الجامع</b></div>' +
        '</div><div class="wa"><div class="wa__h"><i>CZ</i>سيزر جيم · دلوقتي</div><p>أهلاً يا محمود، اشتراكك باقي عليه 3 أيام. جدّد من الريسبشن وخلّي مكانك محجوز.</p></div>' +
      "</div></div>" + cur() + "</div></div>");

  /* 8 · الختام */
  var OUT = [["lc", "Luxury Crop", "Café · Taif"], ["areeb", "Areeb", "Specialty coffee"], ["friends", "Friends", "Restaurant"], ["cezar", "Cezar Gym", "Gym · 2 branches"]];
  H.push('<div class="sc" data-s="8"><div class="sc__bg"></div><div class="sc__grid"></div>' +
    '<h3 class="out__h">' + words("4 real systems. Built and running.") + "</h3>" +
    '<p class="out__s">Try them yourself below.</p>' +
    '<div class="out__row">' + OUT.map(function (o) {
      return '<div class="mini"><div class="mini__ph"><div><img src="' + B[o[0]].shots.phone + '" alt=""></div></div><b>' + o[1] + "</b><small>" + o[2] + "</small></div>";
    }).join("") + "</div>" +
    '<p class="out__logo"><i></i>ATHR<span>Systems</span></p></div>');

  stage.innerHTML = H.join("");
  var SC = Array.prototype.slice.call(stage.querySelectorAll(".sc"));

  /* ------------------------------------------------------------------
     ربط النصوص بالوقت (بيشتغل صح مع أي تقديم أو ترجيع)
     ------------------------------------------------------------------ */
  var BIND = [];
  function kText(el, keys) {
    var last = null;
    BIND.push(function (t) {
      var v = keys[0][1];
      for (var i = 0; i < keys.length; i++) { if (t >= keys[i][0]) v = keys[i][1]; else break; }
      if (v !== last) { el.textContent = v; last = v; }
    });
  }
  function kNum(el, keys, fmt) {
    var last = null; fmt = fmt || function (v) { return Math.round(v).toLocaleString("en-US"); };
    BIND.push(function (t) {
      var v = keys[0][1];
      for (var i = 1; i < keys.length; i++) {
        var k = keys[i]; if (t < k[0]) break;
        var p = Math.min(1, (t - k[0]) / (k[2] || .001)), e = 1 - Math.pow(1 - p, 3);
        v = keys[i - 1][1] + (k[1] - keys[i - 1][1]) * e;
      }
      var s = fmt(v); if (s !== last) { el.textContent = s; last = s; }
    });
  }
  function kClass(el, cls, keys) {
    var last = null;
    BIND.push(function (t) {
      var v = keys[0][1];
      for (var i = 0; i < keys.length; i++) { if (t >= keys[i][0]) v = keys[i][1]; else break; }
      if (v !== last) { el.classList.toggle(cls, !!v); last = v; }
    });
  }
  /* كتابة: قبل t0 النص القديم، بعدين بيتمسح ويتكتب الجديد */
  function kEdit(el, t0, from, to, cps) {
    var last = null, er = from.length ? Math.min(.35, from.length * .03) : 0, ty = to.length / (cps || 16);
    BIND.push(function (t) {
      var v;
      if (t < t0) v = from;
      else if (t < t0 + er) v = from.slice(0, Math.max(0, Math.round(from.length * (1 - (t - t0) / er))));
      else if (t < t0 + er + ty) v = to.slice(0, Math.floor((t - t0 - er) * (cps || 16)));
      else v = to;
      if (v !== last) { el.textContent = v; last = v; }
    });
    return t0 + er + ty;
  }
  function kFn(fn) { BIND.push(fn); }

  /* ------------------------------------------------------------------
     الـ timeline
     ------------------------------------------------------------------ */
  var tl = gsap.timeline({ paused: true });
  var q = function (el, s) { return el.querySelector(s); };
  var qa = function (el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); };

  function pos(el, root) {
    var x = 0, y = 0, k = 1, e = el;
    while (e && e !== root) {
      if (e.getAttribute && e.getAttribute("data-k")) { var f = +e.getAttribute("data-k"); x *= f; y *= f; k *= f; }
      x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent;
    }
    return { x: x, y: y, w: el.offsetWidth * k, h: el.offsetHeight * k };
  }
  function ctr(el, root, dx, dy) { var p = pos(el, root); return { x: p.x + p.w / 2 + (dx || 0), y: p.y + p.h / 2 + (dy || 0) }; }

  function sceneIn(sc, t0, t1, last) {
    tl.fromTo(sc, { autoAlpha: 0 }, { autoAlpha: 1, duration: .35, ease: "none", immediateRender: false }, t0);
    if (!last) tl.to(sc, { autoAlpha: 0, duration: .3, ease: "none" }, t1 - .3);
    var ws = qa(sc, ".sc__txt .w");
    if (ws.length) tl.fromTo(ws, { yPercent: 115 }, { yPercent: 0, duration: .7, stagger: .028, ease: "power3.out", immediateRender: false }, t0 + .12);
    var br = q(sc, ".sc__brand");
    if (br) tl.fromTo(br, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .5, ease: "power2.out", immediateRender: false }, t0 + .7);
  }
  function enter(el, t, from) {
    tl.fromTo(el, from || { autoAlpha: 0, y: 40 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .7, ease: "power3.out", immediateRender: false }, t);
  }
  function Cursor(sc) {
    var c = q(sc, ".cur"), d = q(c, ".cur__d"), r = q(c, ".cur__r"), devs = q(sc, ".devs");
    gsap.set(d, { rotation: 45 });
    return {
      show: function (t, p) { tl.fromTo(c, { autoAlpha: 0, x: p.x + 40, y: p.y + 60 }, { autoAlpha: 1, x: p.x, y: p.y, duration: .5, ease: "power2.out", immediateRender: false }, t); },
      to: function (t, p, dur) { tl.to(c, { x: p.x, y: p.y, duration: dur || .55, ease: "power2.inOut" }, t); },
      click: function (t) {
        tl.fromTo(d, { scale: 1 }, { scale: .72, duration: .09, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }, t);
        tl.fromTo(r, { scale: .3, autoAlpha: .9 }, { scale: 1.7, autoAlpha: 0, duration: .5, ease: "power2.out", immediateRender: false }, t);
      },
      hide: function (t) { tl.to(c, { autoAlpha: 0, duration: .25 }, t); },
      at: function (el, dx, dy) { return ctr(el, devs, dx, dy); }
    };
  }
  function grow(slot, t, dur) {
    var h = slot.firstElementChild.offsetHeight + 7;
    tl.fromTo(slot, { height: 0 }, { height: h, duration: dur || .45, ease: "power3.out", immediateRender: false }, t);
    tl.fromTo(slot.firstElementChild, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: .45, ease: "power2.out", immediateRender: false }, t + .1);
  }
  function pop(el, t) { tl.fromTo(el, { autoAlpha: 0, scale: .6 }, { autoAlpha: 1, scale: 1, duration: .45, ease: "back.out(2)", immediateRender: false }, t); }
  function clock(sec) {
    sec = Math.max(0, Math.floor(sec));
    var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  function build() {
    var sc, t0, t1, c, devs;

    /* ===== 0 · البداية ===== */
    sc = SC[0]; t0 = 0; t1 = CH[1].t + .3;
    tl.fromTo(sc, { autoAlpha: 1 }, { autoAlpha: 1, duration: .01, immediateRender: false }, 0);
    tl.to(sc, { autoAlpha: 0, duration: .3, ease: "none" }, t1 - .3);
    var ph0 = q(sc, ".ph");
    enter(ph0, .05, { autoAlpha: 0, y: 60, scale: .96 });
    var bubs = qa(sc, ".bub");
    bubs.forEach(function (bu, i) {
      var tt = .3 + i * .27;
      kClass(bu, "gone", [[0, true], [tt, false]]);
      tl.fromTo(bu, { autoAlpha: 0, y: 16, scale: .94 }, { autoAlpha: 1, y: 0, scale: 1, duration: .28, ease: "back.out(1.6)", immediateRender: false }, tt);
    });
    kNum(q(sc, ".h-cnt"), [[0, 1], [.3, 47, 2.6]]);
    tl.fromTo(qa(sc, ".hook__h .w"), { yPercent: 115 }, { yPercent: 0, duration: .7, stagger: .06, ease: "power3.out", immediateRender: false }, .5);
    tl.to(q(sc, ".hook__h"), { autoAlpha: 0, y: -30, duration: .35, ease: "power2.in" }, 3.0);
    tl.fromTo(q(sc, ".hook__h2"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .01, immediateRender: false }, 3.25);
    tl.fromTo(qa(sc, ".hook__h2 .w, .hook__h2 em"), { yPercent: 115, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .6, stagger: .06, ease: "power3.out", immediateRender: false }, 3.25);
    tl.fromTo(q(sc, ".hook__s"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, immediateRender: false }, 3.7);
    var dm = q(sc, ".big-dm");
    tl.fromTo(dm, { y: -420, scale: .6, rotation: 45 }, { y: 0, scale: 1, rotation: 45, duration: .55, ease: "power3.in", immediateRender: false }, 2.85);
    tl.to(bubs.slice().reverse(), { scale: 0, autoAlpha: 0, duration: .3, stagger: .03, ease: "power2.in" }, 3.25);
    tl.fromTo(dm, { scale: 1 }, { scale: 1.5, duration: .12, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }, 3.4);
    tl.to(dm, { scale: 70, duration: .6, ease: "power3.in" }, 4.3);
    tl.to(dm, { autoAlpha: 0, duration: .25 }, 4.95);

    /* ===== 1 · المنيو ===== */
    sc = SC[1]; t0 = CH[1].t; t1 = CH[2].t + .3; c = Cursor(sc); devs = q(sc, ".devs");
    sceneIn(sc, t0, t1);
    var tent = q(sc, ".tent"), ph1 = q(sc, ".ph"), cam = q(sc, ".cam"), mnIn = q(sc, ".mn__in");
    enter(tent, t0 + .15, { autoAlpha: 0, y: 40 });
    tl.fromTo(tent, { rotation: -4 }, { rotation: 0, duration: .7, immediateRender: false }, t0 + .15);
    enter(ph1, t0 + .3, { autoAlpha: 0, y: 70 });
    tl.fromTo(q(sc, ".scan"), { y: 0 }, { y: 130, duration: .45, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, t0 + .7);
    tl.to(cam, { autoAlpha: 0, duration: .25 }, t0 + 1.6);
    tl.fromTo(qa(sc, ".mn__in > *"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .05, ease: "power2.out", immediateRender: false }, t0 + 1.55);
    tl.to(mnIn, { y: -150, duration: 1.0, ease: "power2.inOut" }, t0 + 2.55);
    var sp = q(sc, '[data-it="spanish"]');
    var pSp = c.at(sp, 0, -150);
    c.show(t0 + 3.2, pSp); c.click(t0 + 3.75);
    var sheet = q(sc, ".sheet");
    gsap.set(sheet, { yPercent: 105 });
    tl.fromTo(sheet, { yPercent: 105 }, { yPercent: 0, duration: .5, ease: "power3.out", immediateRender: false }, t0 + 3.85);
    var o1 = q(sc, ".o1");
    var pO1 = ctr(o1, devs); pO1.y += 0; /* بعد ما الشيت يطلع */
    c.to(t0 + 4.45, { x: pO1.x + 40, y: pO1.y });
    c.click(t0 + 5.0);
    kClass(q(sc, ".chk"), "on", [[0, false], [t0 + 5.05, true]]);
    kFn((function (el) { var last = null; return function (t) { var v = t >= t0 + 5.05; if (v !== last) { el.innerHTML = v ? IC("check") : ""; last = v; } }; })(q(sc, ".chk")));
    kText(q(sc, ".sp"), [[0, "18"], [t0 + 5.1, "22"]]);
    var bb = q(sc, ".sheet .bigbtn");
    c.to(t0 + 5.45, ctr(bb, devs));
    c.click(t0 + 5.9);
    tl.to(sheet, { yPercent: 105, duration: .4, ease: "power2.in" }, t0 + 6.0);
    tl.fromTo(q(sc, ".cartbar"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .45, ease: "back.out(1.6)", immediateRender: false }, t0 + 6.3);
    c.hide(t0 + 6.25);

    /* ===== 2 · الطلب ===== */
    sc = SC[2]; t0 = CH[2].t; t1 = CH[3].t + .3; c = Cursor(sc); devs = q(sc, ".devs");
    sceneIn(sc, t0, t1);
    var lap2 = q(sc, ".lap"), ph2 = q(sc, ".ph");
    enter(lap2, t0 + .2, { autoAlpha: 0, x: -50 });
    enter(ph2, t0 + .35, { autoAlpha: 0, y: 60 });
    var sugBtn = q(sc, ".sug u");
    c.show(t0 + 1.0, c.at(sugBtn)); c.click(t0 + 1.5);
    tl.to(q(sc, ".sug"), { autoAlpha: 0, height: 0, marginTop: 0, padding: 0, duration: .35, ease: "power2.in" }, t0 + 1.6);
    grow(q(sc, ".slot2"), t0 + 1.6, .35);
    kNum(q(sc, ".ctot"), [[0, 22], [t0 + 1.65, 32, .6]], function (v) { return Math.round(v) + " ر.س"; });
    tl.fromTo(q(sc, ".plus-pop"), { autoAlpha: 0, y: 0 }, { autoAlpha: 1, y: -26, duration: .4, ease: "power2.out", immediateRender: false }, t0 + 1.65);
    tl.to(q(sc, ".plus-pop"), { autoAlpha: 0, duration: .3 }, t0 + 2.3);
    var send = q(sc, ".send"), sug = q(sc, ".sug"), sl2 = q(sc, ".slot2");
    var dSend = (sl2.firstElementChild.offsetHeight + 7) - (sug.offsetHeight + 10);
    c.to(t0 + 2.2, c.at(send, 0, dSend)); c.click(t0 + 2.7);
    var ok2 = q(sc, ".ok");
    tl.fromTo(ok2, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, immediateRender: false }, t0 + 2.85);
    pop(q(ok2, ".ok__c"), t0 + 2.95);
    /* اللوحة */
    grow(q(sc, ".slot"), t0 + 3.3, .5);
    pop(q(sc, ".bell em"), t0 + 3.35);
    tl.to(q(sc, ".bell"), { keyframes: [{ rotation: -16, duration: .08 }, { rotation: 14, duration: .1 }, { rotation: -10, duration: .1 }, { rotation: 8, duration: .1 }, { rotation: 0, duration: .1 }] }, t0 + 3.4);
    tl.to(q(sc, ".bell"), { keyframes: [{ rotation: -16, duration: .08 }, { rotation: 14, duration: .1 }, { rotation: -10, duration: .1 }, { rotation: 0, duration: .1 }] }, t0 + 4.1);
    kText(q(sc, ".p-new"), [[0, "0"], [t0 + 3.35, "1"], [t0 + 4.95, "0"]]);
    kText(q(sc, ".p-all"), [[0, "37"], [t0 + 3.35, "38"]]);
    kText(q(sc, ".p-prep"), [[0, "2"], [t0 + 4.95, "3"]]);
    var go = q(sc, ".b-go");
    var pGo = c.at(go); /* الكارت لسه مقفول وقت القياس — المكان بعد ما يفتح نفسه */
    c.to(t0 + 4.2, pGo, .7); c.click(t0 + 4.9);
    kText(q(sc, ".tg1"), [[0, "جديد"], [t0 + 4.95, "في التحضير"]]);
    kClass(q(sc, ".tg1"), "prep", [[0, false], [t0 + 4.95, true]]);
    kClass(q(sc, ".tg1"), "new", [[0, true], [t0 + 4.95, false]]);
    kClass(q(sc, ".nw"), "is-new", [[0, true], [t0 + 4.95, false]]);
    kText(go, [[0, "ابدأ التجهيز"], [t0 + 4.95, "اتسلّم"]]);
    var pr = q(sc, ".b-print");
    c.to(t0 + 5.5, c.at(pr)); c.click(t0 + 6.0);
    tl.fromTo(q(sc, ".rcpt"), { autoAlpha: 0, y: -60, scaleY: .6, transformOrigin: "top" }, { autoAlpha: 1, y: 0, scaleY: 1, duration: .7, ease: "power3.out", immediateRender: false }, t0 + 6.1);
    c.hide(t0 + 6.6);

    /* ===== 3 · العروض ===== */
    sc = SC[3]; t0 = CH[3].t; t1 = CH[4].t + .3; c = Cursor(sc); devs = q(sc, ".devs");
    sceneIn(sc, t0, t1);
    enter(q(sc, ".lap"), t0 + .2, { autoAlpha: 0, x: -50 });
    enter(q(sc, ".ph"), t0 + .35, { autoAlpha: 0, y: 60 });
    var th1 = q(sc, ".th1");
    c.show(t0 + 1.0, c.at(th1)); c.click(t0 + 1.5);
    kClass(q(sc, ".th0"), "on", [[0, true], [t0 + 1.55, false]]);
    kClass(th1, "on", [[0, false], [t0 + 1.55, true]]);
    tl.fromTo(q(sc, ".pv2"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .45, immediateRender: false }, t0 + 1.55);
    var fT = q(sc, ".f-title");
    c.to(t0 + 1.95, c.at(fT, 30)); c.click(t0 + 2.4);
    kClass(fT, "focus", [[0, false], [t0 + 2.45, true], [t0 + 3.6, false]]);
    kClass(q(sc, ".c1"), "on", [[0, false], [t0 + 2.45, true], [t0 + 3.6, false]]);
    kEdit(q(sc, ".v-title"), t0 + 2.5, "بداية اليوم", "قعدة اثنين", 14);
    var fP = q(sc, ".f-price");
    c.to(t0 + 3.5, c.at(fP, 30)); c.click(t0 + 3.85);
    kClass(fP, "focus", [[0, false], [t0 + 3.9, true], [t0 + 4.5, false]]);
    kText(q(sc, ".v-price"), [[0, "23"], [t0 + 4.05, "5"], [t0 + 4.15, "50"]]);
    kText(q(sc, ".v-was"), [[0, "27"], [t0 + 4.15, "56"]]);
    var fTm = q(sc, ".f-time");
    c.to(t0 + 4.35, c.at(fTm, 30)); c.click(t0 + 4.7);
    kClass(fTm, "focus", [[0, false], [t0 + 4.75, true], [t0 + 5.3, false]]);
    kText(q(sc, ".v-time"), [[0, "7 الصبح ← 11 الضهر"], [t0 + 4.9, "4 العصر ← 8 بالليل"]]);
    var pub = q(sc, ".b-pub");
    c.to(t0 + 5.1, c.at(pub)); c.click(t0 + 5.55);
    tl.fromTo(q(sc, ".toast"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .35, immediateRender: false }, t0 + 5.65);
    tl.to(q(sc, ".toast"), { autoAlpha: 0, duration: .3 }, t0 + 7.3);
    /* الإشارة من اللوحة للموبايل */
    var sig = q(sc, ".sig"), pp = ctr(pub, devs), ban = q(sc, ".o-ban"), pb = ctr(ban, devs);
    gsap.set(sig, { left: pp.x, top: pp.y, width: Math.hypot(pb.x - pp.x, pb.y - pp.y), rotation: Math.atan2(pb.y - pp.y, pb.x - pp.x) * 180 / Math.PI, transformOrigin: "0% 50%", scaleX: 0 });
    tl.fromTo(sig, { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, duration: .45, ease: "power2.inOut", immediateRender: false }, t0 + 5.7);
    tl.to(sig, { autoAlpha: 0, duration: .3 }, t0 + 6.3);
    c.hide(t0 + 5.9);
    var tFlip = t0 + 6.15;
    tl.fromTo(q(ban, ".img2"), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: .6, ease: "power2.out", immediateRender: false }, tFlip);
    tl.fromTo(ban, { boxShadow: "0 0 0 0 rgba(242,74,61,0)" }, { boxShadow: "0 0 0 4px rgba(242,74,61,.9)", duration: .2, yoyo: true, repeat: 3, immediateRender: false }, tFlip);
    kText(q(sc, ".o-t"), [[0, "بداية اليوم"], [tFlip + .15, "قعدة اثنين"]]);
    kText(q(sc, ".o-d"), [[0, "لاتيه حار + كوكيز فانيليا"], [tFlip + .15, "2 سبانش لاتيه حار + تراميسو"]]);
    kNum(q(sc, ".o-p"), [[0, 23], [tFlip + .15, 50, .5]]);
    kText(q(sc, ".o-w"), [[0, "27"], [tFlip + .15, "56"]]);
    tl.to(q(ban, ".offer__t"), { keyframes: [{ y: 14, autoAlpha: 0, duration: .15 }, { y: 0, autoAlpha: 1, duration: .3 }] }, tFlip);
    kFn((function (el) {
      var last = null;
      return function (t) {
        var v = t < tFlip + .15 ? clock(8049 - (t - t0)) : clock(14399 - (t - tFlip));
        if (v !== last) { el.textContent = v; last = v; }
      };
    })(q(sc, ".o-tm")));

    /* ===== 4 · التحكم ===== */
    sc = SC[4]; t0 = CH[4].t; t1 = CH[5].t + .3; c = Cursor(sc); devs = q(sc, ".devs");
    sceneIn(sc, t0, t1);
    enter(q(sc, ".lap"), t0 + .2, { autoAlpha: 0, x: -50 });
    enter(q(sc, ".ph"), t0 + .35, { autoAlpha: 0, y: 60 });
    var tgBk = q(sc, ".tg-bigking");
    c.show(t0 + 1.0, c.at(tgBk)); c.click(t0 + 1.5);
    kClass(tgBk, "off", [[0, false], [t0 + 1.55, true]]);
    kText(q(sc, ".st-bigking"), [[0, "متاح"], [t0 + 1.55, "خلص النهارده"]]);
    var rowBk = q(sc, '.ph [data-it="bigking"]');
    tl.to(qa(rowBk, "img, div"), { opacity: .4, duration: .35 }, t0 + 1.75);
    tl.fromTo(q(rowBk, ".sold"), { autoAlpha: 0, scale: .7 }, { autoAlpha: 1, scale: 1, duration: .35, ease: "back.out(2)", immediateRender: false }, t0 + 1.8);
    tl.fromTo(q(rowBk, ".flash"), { opacity: 0 }, { opacity: .22, duration: .18, yoyo: true, repeat: 1, immediateRender: false }, t0 + 1.75);
    var prC = q(sc, ".pr-crepeb");
    c.to(t0 + 2.2, c.at(prC)); c.click(t0 + 2.65);
    kClass(prC, "focus", [[0, false], [t0 + 2.7, true], [t0 + 3.4, false]]);
    kText(q(prC, ".pv"), [[0, "14"], [t0 + 2.85, "1"], [t0 + 3.0, "16"]]);
    var rowC = q(sc, '.ph [data-it="crepeb"]');
    kText(q(rowC, ".pv"), [[0, "14"], [t0 + 3.5, "16"]]);
    tl.fromTo(q(rowC, ".flash"), { opacity: 0 }, { opacity: .25, duration: .2, yoyo: true, repeat: 1, immediateRender: false }, t0 + 3.45);
    tl.fromTo(q(rowC, ".pz span"), { scale: 1 }, { scale: 1.3, duration: .18, yoyo: true, repeat: 1, immediateRender: false }, t0 + 3.5);
    var bd = q(sc, ".bd-btn");
    c.to(t0 + 3.9, c.at(bd)); c.click(t0 + 4.35);
    kFn((function (el) { var last = null; return function (t) { var v = t >= t0 + 4.4; if (v !== last) { el.innerHTML = v ? '<span style="color:#F97316;font-weight:700">● الأكثر طلبًا</span>' : '<span class="bd-btn" style="border:1px dashed #D4D0C9;border-radius:5px;padding:0 5px">+ بادج</span>'; last = v; } }; })(q(sc, ".st-crepemix")));
    var rowM = q(sc, '.ph [data-it="crepemix"]');
    tl.fromTo(q(rowM, ".bdg"), { autoAlpha: 0, x: 10 }, { autoAlpha: 1, x: 0, duration: .35, immediateRender: false }, t0 + 4.6);
    tl.fromTo(q(rowM, ".flash"), { opacity: 0 }, { opacity: .25, duration: .2, yoyo: true, repeat: 1, immediateRender: false }, t0 + 4.55);
    c.hide(t0 + 5.2);

    /* ===== 5 · الولاء والتقييم ===== */
    sc = SC[5]; t0 = CH[5].t; t1 = CH[6].t + .3; c = Cursor(sc); devs = q(sc, ".devs");
    sceneIn(sc, t0, t1);
    enter(q(sc, ".lap"), t0 + .2, { autoAlpha: 0, x: -50 });
    enter(q(sc, ".ph"), t0 + .35, { autoAlpha: 0, y: 60 });
    var dts = qa(sc, ".loy__dots u");
    dts.forEach(function (u, i) { if (i < 5) tl.fromTo(u, { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, t0 + .6 + i * .07); });
    tl.fromTo(dts[5], { scale: 0 }, { scale: 1, duration: .5, ease: "back.out(3)", immediateRender: false }, t0 + 1.4);
    tl.fromTo(dts[5].parentNode, { boxShadow: "0 0 0 0 rgba(255,255,255,.8)" }, { boxShadow: "0 0 0 14px rgba(255,255,255,0)", duration: .6, immediateRender: false }, t0 + 1.45);
    kText(q(sc, ".loy__card small"), [[0, "باقي كوب واحد"], [t0 + 1.5, "كمّلت الكارت!"]]);
    tl.fromTo(q(sc, ".loy__rw"), { autoAlpha: 0, scale: .9 }, { autoAlpha: 1, scale: 1, duration: .45, ease: "back.out(1.6)", immediateRender: false }, t0 + 2.0);
    var rate = q(sc, ".rate");
    tl.fromTo(rate, { autoAlpha: 0, xPercent: -20 }, { autoAlpha: 1, xPercent: 0, duration: .45, ease: "power3.out", immediateRender: false }, t0 + 3.3);
    var s2 = q(sc, ".s2");
    c.show(t0 + 3.7, c.at(s2)); c.click(t0 + 4.15);
    kClass(q(sc, ".s1"), "on", [[0, false], [t0 + 4.2, true]]);
    kClass(s2, "on", [[0, false], [t0 + 4.2, true]]);
    kText(q(sc, ".rate__lbl"), [[0, ""], [t0 + 4.2, "2 — مش أحسن حاجة"]]);
    tl.fromTo(q(sc, ".rate__form"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t0 + 4.4);
    kClass(q(sc, ".c2"), "on", [[0, false], [t0 + 4.6, true], [t0 + 5.7, false]]);
    kEdit(q(sc, ".r-txt"), t0 + 4.65, "", "القهوة وصلت باردة", 18);
    var rs = q(sc, ".r-send");
    c.to(t0 + 5.55, c.at(rs)); c.click(t0 + 5.95);
    var ok5 = q(sc, ".ph .ok");
    tl.fromTo(ok5, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, immediateRender: false }, t0 + 6.05);
    pop(q(ok5, ".ok__c"), t0 + 6.1);
    grow(q(sc, ".cmp .slot"), t0 + 6.35, .5);
    kNum(q(sc, ".k-cmp"), [[0, 21], [t0 + 6.4, 22, .4]]);
    var res = q(sc, ".b-res");
    c.to(t0 + 6.9, c.at(res)); c.click(t0 + 7.4);
    pop(q(sc, ".cmp__ok"), t0 + 7.45);
    kClass(q(sc, ".cmp .nw"), "is-new", [[0, true], [t0 + 7.45, false]]);
    c.hide(t0 + 7.9);

    /* ===== 6 · الأرقام ===== */
    sc = SC[6]; t0 = CH[6].t; t1 = CH[7].t + .3; c = Cursor(sc); devs = q(sc, ".devs");
    sceneIn(sc, t0, t1);
    enter(q(sc, ".lap"), t0 + .2, { autoAlpha: 0, y: 50, scale: .96 });
    kNum(q(sc, ".k-sales"), [[0, 0], [t0 + .7, 62162, 1.8]]);
    kNum(q(sc, ".k-up"), [[0, 0], [t0 + 1.0, 7188, 1.6]]);
    kNum(q(sc, ".k-v"), [[0, 0], [t0 + .9, 2964, 1.5]]);
    kNum(q(sc, ".k-o"), [[0, 0], [t0 + 1.0, 1140, 1.5]]);
    kNum(q(sc, ".k-a"), [[0, 0], [t0 + 1.1, 55, 1.3]]);
    tl.fromTo(qa(sc, ".bars u"), { scaleY: 0 }, { scaleY: 1, duration: .6, stagger: .05, ease: "power3.out", immediateRender: false }, t0 + 1.1);
    tl.fromTo(qa(sc, ".dec"), { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: .45, stagger: .15, ease: "power2.out", immediateRender: false }, t0 + 2.4);
    var d1 = q(sc, ".d1");
    c.show(t0 + 3.4, c.at(d1)); c.click(t0 + 3.9);
    tl.fromTo(d1, { backgroundColor: "#ffffff" }, { backgroundColor: "#FDECEA", duration: .3, immediateRender: false }, t0 + 3.95);
    var hi = qa(sc, ".bars u.hi");
    c.to(t0 + 4.5, c.at(hi[0], 0, -10));
    tl.fromTo(hi, { filter: "brightness(1)" }, { filter: "brightness(1.25)", duration: .25, yoyo: true, repeat: 3, immediateRender: false }, t0 + 5.0);
    c.hide(t0 + 5.8);

    /* ===== 7 · الجيم ===== */
    sc = SC[7]; t0 = CH[7].t; t1 = CH[8].t + .3; c = Cursor(sc); devs = q(sc, ".devs");
    sceneIn(sc, t0, t1);
    enter(q(sc, ".lap"), t0 + .2, { autoAlpha: 0, x: -50 });
    enter(q(sc, ".ph"), t0 + .35, { autoAlpha: 0, y: 60 });
    kClass(q(sc, ".c3"), "on", [[0, false], [t0 + .9, true], [t0 + 1.7, false]]);
    kEdit(q(sc, ".g-code"), t0 + 1.0, "", "1024", 7);
    tl.fromTo(q(sc, ".gmem"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45, ease: "power2.out", immediateRender: false }, t0 + 1.75);
    var gb = q(sc, ".gbtn");
    c.show(t0 + 2.0, c.at(gb)); c.click(t0 + 2.55);
    kNum(q(sc, ".g-s"), [[0, 11], [t0 + 2.6, 10, .4]]);
    kNum(q(sc, ".g-s2"), [[0, 11], [t0 + 2.9, 10, .4]]);
    tl.fromTo(q(sc, ".g-bar"), { scaleX: 11 / 12 }, { scaleX: 10 / 12, duration: .5, immediateRender: false }, t0 + 2.6);
    tl.fromTo(q(sc, ".gok"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .35, immediateRender: false }, t0 + 2.65);
    tl.fromTo(q(sc, ".g-ring"), { attr: { "stroke-dashoffset": 26.18 } }, { attr: { "stroke-dashoffset": 52.36 }, duration: .6, ease: "power2.out", immediateRender: false }, t0 + 2.9);
    kText(q(sc, ".g-last"), [[0, "أمس 6:10 م"], [t0 + 2.95, "النهارده 5:47 م"]]);
    tl.fromTo(q(sc, ".galert"), { boxShadow: "0 0 0 0 rgba(245,158,11,0)" }, { boxShadow: "0 0 0 4px rgba(245,158,11,.45)", duration: .3, yoyo: true, repeat: 1, immediateRender: false }, t0 + 3.6);
    var gm = q(sc, ".g-msg");
    c.to(t0 + 3.8, c.at(gm)); c.click(t0 + 4.3);
    tl.fromTo(q(sc, ".wa"), { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: .5, ease: "back.out(1.5)", immediateRender: false }, t0 + 4.5);
    c.hide(t0 + 4.9);

    /* ===== 8 · الختام ===== */
    sc = SC[8]; t0 = CH[8].t;
    sceneIn(sc, t0, DUR, true);
    tl.fromTo(qa(sc, ".out__h .w"), { yPercent: 115 }, { yPercent: 0, duration: .7, stagger: .05, ease: "power3.out", immediateRender: false }, t0 + .2);
    tl.fromTo(q(sc, ".out__s"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, immediateRender: false }, t0 + .9);
    tl.fromTo(qa(sc, ".mini"), { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: .8, stagger: .12, ease: "power3.out", immediateRender: false }, t0 + .4);
    qa(sc, ".mini img").forEach(function (m, i) {
      tl.fromTo(m, { y: 0 }, { y: i === 3 ? 0 : -420, duration: 4.4, ease: "sine.inOut", immediateRender: false }, t0 + 1.2);
    });
    tl.fromTo(q(sc, ".out__logo"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .6, immediateRender: false }, t0 + 1.4);
    tl.to({}, { duration: .01 }, DUR - .01);
  }

  /* ------------------------------------------------------------------
     المشغّل
     ------------------------------------------------------------------ */
  var player = document.getElementById("film"), frame = document.getElementById("filmFrame");
  var bigBtn = document.getElementById("filmBig"), playBtn = document.getElementById("filmPlay");
  var track = document.getElementById("filmTrack"), timeEl = document.getElementById("filmTime");
  var fsBtn = document.getElementById("filmFs"), endEl = document.getElementById("filmEnd");
  var capEl = document.getElementById("filmCap"), capIn = capEl.querySelector(".pcap__in");
  var chapsEl = document.getElementById("filmChaps"), pfsX = document.getElementById("filmPfsX");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var userPaused = false, visible = false, ended = false, built = false, dirty = true, chapIdx = -1, pending = false;

  function ends(i) { return i < CH.length - 1 ? CH[i + 1].t : DUR; }
  track.innerHTML = CH.map(function (c, i) { return '<span class="pb-seg" style="flex:' + (ends(i) - c.t).toFixed(2) + '" title="' + c.n + '"><i></i></span>'; }).join("");
  var segs = Array.prototype.slice.call(track.children);
  chapsEl.innerHTML = CH.map(function (c, i) { return '<li><button class="chap" type="button" data-i="' + i + '"><b class="num">' + (i === 0 ? "00" : i < 8 ? "0" + i : "◆") + "</b>" + c.n + "</button></li>"; }).join("");
  var chips = Array.prototype.slice.call(chapsEl.querySelectorAll(".chap"));

  function fmt(t) { t = Math.max(0, Math.round(t)); return Math.floor(t / 60) + ":" + (t % 60 < 10 ? "0" : "") + (t % 60); }
  function setPlayIcon(p) {
    playBtn.innerHTML = IC(p ? "pause" : "play");
    playBtn.setAttribute("aria-label", p ? "Pause" : "Play");
    player.classList.toggle("is-playing", p);
  }
  function caption(i) {
    var c = CH[i], h, b, k;
    if (i === 0) { h = HOOK_CAP.h; b = HOOK_CAP.b; k = ""; }
    else if (i === CH.length - 1) { h = OUT_CAP.h; b = OUT_CAP.b; k = ""; }
    else { h = c.h; b = c.b; k = '<p class="pcap__k">' + c.k + " — " + c.n + " <span>· " + B[c.brand].nameEn + "</span></p>"; }
    capIn.classList.add("is-swap");
    setTimeout(function () {
      capIn.innerHTML = k + '<p class="pcap__h">' + esc(h) + '</p><p class="pcap__b">' + esc(b) + "</p>";
      capIn.classList.remove("is-swap");
    }, 160);
  }
  function update() {
    if (!built) return;
    var t = tl.time();
    for (var i = 0; i < BIND.length; i++) BIND[i](t);
    var ci = 0;
    for (var j = 0; j < CH.length; j++) if (t >= CH[j].t - .001) ci = j;
    segs.forEach(function (s, j) {
      var p = j < ci ? 1 : j > ci ? 0 : (t - CH[j].t) / (ends(j) - CH[j].t);
      s.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(4));
      s.classList.toggle("is-on", j === ci);
    });
    if (ci !== chapIdx) {
      chapIdx = ci;
      chips.forEach(function (c, j) { c.classList.toggle("is-on", j === ci); });
      caption(ci);
      var chip = chips[ci];
      if (chip && visible && chapsEl.scrollWidth > chapsEl.clientWidth) {
        var cr = chip.getBoundingClientRect(), pr = chapsEl.getBoundingClientRect();
        if (cr.left < pr.left || cr.right > pr.right) chapsEl.scrollTo({ left: chapsEl.scrollLeft + (cr.left - pr.left) - 16, behavior: "smooth" });
      }
    }
    timeEl.textContent = fmt(t) + " / " + fmt(DUR);
    track.setAttribute("aria-valuenow", Math.round(t / DUR * 100));
    dirty = false;
  }
  gsap.ticker.add(function () { if (tl.isActive() || dirty) update(); });

  function play() {
    if (!built) { pending = true; return; }
    if (ended || tl.time() >= DUR - .05) { tl.seek(0); ended = false; }
    endEl.hidden = true;
    tl.play(); setPlayIcon(true);
  }
  function pause() { tl.pause(); setPlayIcon(false); dirty = true; }
  function toggle() { if (tl.isActive()) { userPaused = true; pause(); } else { userPaused = false; play(); } }
  function seek(t) {
    t = Math.max(0, Math.min(DUR - .01, t));
    tl.seek(t, false); ended = false; endEl.hidden = true; dirty = true; update();
  }
  tl.eventCallback("onComplete", function () {
    ended = true; setPlayIcon(false); dirty = true;
    endEl.hidden = false;
  });

  bigBtn.addEventListener("click", function (e) { e.stopPropagation(); userPaused = false; play(); });
  playBtn.addEventListener("click", toggle);
  frame.addEventListener("click", function (e) {
    if (e.target.closest("button,a")) return;
    toggle();
  });
  frame.addEventListener("keydown", function (e) {
    if (e.key === " " || e.key === "Enter" || e.key === "k") { e.preventDefault(); toggle(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); seek(tl.time() + 5); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); seek(tl.time() - 5); }
  });
  document.getElementById("filmReplay").addEventListener("click", function (e) { e.stopPropagation(); ended = false; seek(0); userPaused = false; play(); });
  chapsEl.addEventListener("click", function (e) {
    var b = e.target.closest(".chap"); if (!b) return;
    var i = +b.getAttribute("data-i");
    seek(CH[i].t + (i ? .05 : 0)); userPaused = false; play();
  });

  /* السحب على الشريط (من اليمين للشمال) */
  function timeAt(x) {
    var r = track.getBoundingClientRect();
    for (var i = 0; i < segs.length; i++) {
      var sr = segs[i].getBoundingClientRect();
      if (x <= sr.right + 2 && x >= sr.left - 2) {
        var p = (x - sr.left) / sr.width;
        return CH[i].t + Math.max(0, Math.min(1, p)) * (ends(i) - CH[i].t);
      }
    }
    return x < r.left ? 0 : DUR - .01;
  }
  var dragging = false, wasPlaying = false;
  track.addEventListener("pointerdown", function (e) {
    dragging = true; wasPlaying = tl.isActive(); tl.pause();
    track.setPointerCapture(e.pointerId); seek(timeAt(e.clientX));
  });
  track.addEventListener("pointermove", function (e) { if (dragging) seek(timeAt(e.clientX)); });
  track.addEventListener("pointerup", function () { dragging = false; if (wasPlaying) play(); else setPlayIcon(false); });
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); seek(tl.time() + 5); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); seek(tl.time() - 5); }
  });

  /* ---------- المقاس + ملء الشاشة ---------- */
  var pfs = false;
  function isFs() { return document.fullscreenElement === frame || document.webkitFullscreenElement === frame; }
  function fit() {
    var w = frame.clientWidth, h = frame.clientHeight, full = isFs() || pfs;
    var compact = !full && w < 640;
    stage.classList.toggle("compact", compact);
    player.classList.toggle("is-compact", compact);
    if (full && pfs && h > w) {
      var s = Math.min(h / 1280, w / 720);
      stage.style.transform = "translate(" + (w / 2) + "px," + (h / 2) + "px) rotate(90deg) scale(" + s + ") translate(-640px,-360px)";
      return;
    }
    stage.style.transform = "";
    var sc = full ? Math.min(w / 1280, h / 720) : w / 1280;
    stage.style.setProperty("--s", sc);
    stage.style.setProperty("--ox", (full ? (w - 1280 * sc) / 2 : 0) + "px");
    stage.style.setProperty("--oy", (full ? (h - 720 * sc) / 2 : 0) + "px");
  }
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(frame); else window.addEventListener("resize", fit);
  fit();

  function exitPfs() { pfs = false; frame.classList.remove("is-pfs"); document.documentElement.style.overflow = ""; fit(); }
  fsBtn.addEventListener("click", function () {
    if (isFs()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    if (pfs) { exitPfs(); return; }
    var req = frame.requestFullscreen || frame.webkitRequestFullscreen;
    var fallback = function () { pfs = true; frame.classList.add("is-pfs"); document.documentElement.style.overflow = "hidden"; fit(); };
    if (req) {
      try {
        var r = req.call(frame);
        if (r && r.then) r.then(function () {
          try { screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").catch(function () { }); } catch (e) { }
        }).catch(fallback);
      } catch (e) { fallback(); }
    } else fallback();
    if (!tl.isActive()) { userPaused = false; play(); }
  });
  pfsX.addEventListener("click", function (e) { e.stopPropagation(); if (isFs()) (document.exitFullscreen || document.webkitExitFullscreen).call(document); else exitPfs(); });
  document.addEventListener("fullscreenchange", fit);
  document.addEventListener("webkitfullscreenchange", fit);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && pfs) exitPfs(); });

  /* ---------- يشتغل لما يبان ---------- */
  function start() {
    if (built) return;
    build(); built = true;
    tl.time(.001); tl.time(0);
    dirty = true; update();
    if (pending || (visible && !reduce && !userPaused)) play();
  }
  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  var timer = setTimeout(start, 1800);
  ready.then(function () { clearTimeout(timer); requestAnimationFrame(start); });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        visible = en.isIntersecting && en.intersectionRatio >= .45;
        if (!built) return;
        if (visible && !userPaused && !ended && !reduce && !tl.isActive()) play();
        else if (!visible && tl.isActive() && !isFs() && !pfs) { pause(); }
      });
    }, { threshold: [0, .45, .7] }).observe(frame);
  } else visible = true;

  window.FILM = { tl: tl, seek: seek, play: play, pause: pause, update: update, CH: CH, get built() { return built; } };
})();
