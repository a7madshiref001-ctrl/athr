/* ==========================================================================
   .ATHR Systems — البيانات
   كل الأصناف والأسعار والصور من الأنظمة الحقيقية (محصول فاخر · أريب · فرندس · سيزر)
   الأرقام التشغيلية (طلبات/مبيعات/أعضاء) وهمية للتوضيح — ومكتوب كده في الصفحة.
   ========================================================================== */
(function () {
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  /* لينكات نسخ العرض — اللي على localhost للتجربة قبل الرفع */
  var DEMO = LOCAL ? {
    areeb: "http://localhost:8871/", cezar: "http://localhost:8872/"
  } : {
    areeb: "https://areebcoffee.github.io/demo/", cezar: "https://cezar-gym.github.io/system/"
  };

  var img = function (p) { return "assets/img/" + p + ".webp"; };

  var BRANDS = {
    /* ---------------- محصول فاخر ---------------- */
    lc: {
      id: "lc", type: "cafe", name: "محصول فاخر", en: "LUXURY CROP", kind: "قهوة مختصة", city: "الطائف",
      cur: "ر.س", tag: "كافيه",
      t: { bg: "#F6F3EE", card: "#FFFFFF", ink: "#33231A", ink2: "#7A6656", pri: "#A67C50", acc: "#C69868", line: "#E9E1D6", on: "#FFFFFF", dark: false },
      logo: img("lc/logo"), mark: img("lc/mark"),
      secs: [{ id: "hot", t: "الساخنة" }, { id: "cold", t: "الباردة" }, { id: "v60", t: "V60" }, { id: "sweet", t: "الحلا" }],
      items: [
        { id: "spanish", n: "سبانش لاتيه حار", p: 18, s: "hot", im: "lc/spanish", d: "إسبريسو + حليب مكثّف", b: "hot" },
        { id: "latte", n: "لاتيه حار", p: 17, s: "hot", im: "lc/latte", d: "شوت إسبريسو وحليب مبخّر" },
        { id: "cappuccino", n: "كابتشينو", p: 16, s: "hot", im: "lc/cappuccino", d: "رغوة كثيفة" },
        { id: "flatwhite", n: "فلات وايت", p: 15, s: "hot", im: "lc/flatwhite", d: "دبل ريستريتو" },
        { id: "espresso", n: "إسبريسو", p: 12, s: "hot", im: "lc/espresso", d: "شوت مركّز" },
        { id: "spanishi", n: "سبانش لاتيه بارد", p: 18, s: "cold", im: "lc/spanish-iced", d: "على ثلج", b: "hot" },
        { id: "caramel", n: "آيس لاتيه كراميل", p: 18, s: "cold", im: "lc/caramel-iced", d: "كراميل + حليب" },
        { id: "coldbrew", n: "كولد برو", p: 24, s: "cold", im: "lc/coldbrew", d: "منقوع 18 ساعة", b: "chef" },
        { id: "matcha", n: "ماتشا كلاسيك", p: 22, s: "cold", im: "lc/matcha", d: "ماتشا ياباني", b: "hot" },
        { id: "hibiscus", n: "كركديه كلاسيك", p: 16, s: "cold", im: "lc/hibiscus", d: "بارد ومنعش" },
        { id: "mojito", n: "موهيتو توت أزرق", p: 18, s: "cold", im: "lc/mojito", d: "توت أزرق ونعناع" },
        { id: "sado", n: "سادو اثيوبيا حار", p: 18, s: "v60", im: "lc/sado", d: "توت أزرق · فراولة · عنب", b: "hot" },
        { id: "bensa", n: "بينسا اثيوبيا حار", p: 20, s: "v60", im: "lc/bensa", d: "قهوة إثيوبية" },
        { id: "lahermosa", n: "لاهرموسا كولومبيا حار", p: 20, s: "v60", im: "lc/lahermosa", d: "كولومبيا", b: "chef" },
        { id: "cookie", n: "كوكيز فانيليا", p: 10, s: "sweet", im: "lc/cookie-van", d: "طازة كل يوم" },
        { id: "cookiec", n: "كوكيز شوكلت", p: 10, s: "sweet", im: "lc/cookie-choc", d: "شوكولاتة بلجيكية" },
        { id: "matilda", n: "ماتيلدا كيك شوكلاته", p: 20, s: "sweet", im: "lc/matilda", d: "قطعة", b: "hot" },
        { id: "cheese", n: "تشيز كيك مانجو", p: 20, s: "sweet", im: "lc/cheesecake", d: "قطعة" },
        { id: "tiramisu", n: "تراميسو", p: 20, s: "sweet", im: "lc/tiramisu", d: "قطعة", b: "chef" },
        { id: "cinnabon", n: "سينابون كلاسيك", p: 16, s: "sweet", im: "lc/cinnabon", d: "قطعة" }
      ],
      offers: [
        { im: "lc/combo-start-day", t: "بداية اليوم", d: "لاتيه حار + كوكيز فانيليا", was: 27, p: 23 },
        { im: "lc/combo-for-two", t: "قعدة اثنين", d: "2 سبانش لاتيه حار + تراميسو", was: 56, p: 50 },
        { im: "lc/combo-specialty", t: "تجربة المختصة", d: "سادو اثيوبيا حار + ماتيلدا كيك", was: 38, p: 34 },
        { im: "lc/combo-work-break", t: "بريك الشغل", d: "سبانش لاتيه بارد + كوكيز شوكلت", was: 28, p: 24 }
      ],
      pair: { hot: "cookie", cold: "cookiec", v60: "matilda", sweet: "latte" },
      loyalty: { goal: 6, reward: "مشروب ساخن على حسابنا" },
      facts: [["55", "صنف"], ["4", "كومبو بالصور"], ["11", "قسم"]],
      line: "منيو بيطلب من الطاولة، ولوحة بتقولك كل اللي بيحصل في الكافيه.",
      chips: ["طلب من الطاولة", "كومبوهات بالصور", "إضافات مدفوعة", "«يمشي معاه»", "عرض بمواعيد", "فلتر التقييم", "كارت ولاء", "«محتاج قرار منك»", "صوت للطلبات", "لوحة أرقام"],
      shots: { phone: img("shots/lc-phone"), desk: img("shots/lc-desk"), scroll: true },
      urls: { menu: "https://a7madshiref001-ctrl.github.io/luxury-crop-demo/", owner: "https://a7madshiref001-ctrl.github.io/luxury-crop-demo/owner.html" },
      table: 4
    },

    /* ---------------- أريب ---------------- */
    areeb: {
      id: "areeb", type: "cafe", name: "أريب", en: "AREEB", kind: "قهوة مختصة", city: "السعودية",
      cur: "ر.س", tag: "كافيه",
      t: { bg: "#F2EAD6", card: "#FBF6EC", ink: "#33231A", ink2: "#7D6A57", pri: "#8C6239", acc: "#A67C50", line: "#E4D7BE", on: "#FFFFFF", dark: false },
      word: "أريب",
      secs: [{ id: "hot", t: "الساخنة" }, { id: "cold", t: "الباردة" }, { id: "drip", t: "المقطرة" }, { id: "sweet", t: "الحلويات" }],
      items: [
        { id: "spanish", n: "سبانيش لاتيه", p: 15, s: "hot", im: "areeb/spanish", d: "حليب مكثّف وإسبريسو", b: "hot" },
        { id: "latte", n: "لاتيه", p: 14, s: "hot", im: "areeb/latte", d: "ناعم وخفيف" },
        { id: "cappuccino", n: "كابتشينو", p: 12, s: "hot", im: "areeb/cappuccino", d: "وسط 12 · كبير 14", sz: [12, 14] },
        { id: "flatwhite", n: "فلات وايت", p: 13, s: "hot", im: "areeb/flatwhite", d: "دبل شوت" },
        { id: "cortado", n: "كورتادو", p: 12, s: "hot", im: "areeb/cortado", d: "نص ونص" },
        { id: "americano", n: "أمريكانو", p: 10, s: "hot", im: "areeb/americano", d: "إسبريسو وماء" },
        { id: "icespanish", n: "أيس سبانيش لاتيه", p: 16, s: "cold", im: "areeb/icespanish", d: "على ثلج", b: "hot" },
        { id: "icelatte", n: "أيس لاتيه", p: 14, s: "cold", im: "areeb/icelatte", d: "بارد ومنعش" },
        { id: "icematcha", n: "ماتشا لاتيه بارد", p: 15, s: "cold", im: "areeb/icematcha", d: "ماتشا ياباني" },
        { id: "mojito", n: "موهيتو", p: 14, s: "cold", im: "areeb/mojito", d: "نعناع وليمون" },
        { id: "hibiscus", n: "كركديه بارد", p: 16, s: "cold", im: "areeb/hibiscus", d: "بارد" },
        { id: "v60", n: "V60", p: 15, s: "drip", im: "areeb/v60", d: "محصول اليوم", b: "chef" },
        { id: "icedrip", n: "أيس دريب", p: 15, s: "drip", im: "areeb/icedrip", d: "مقطرة على ثلج" },
        { id: "daily", n: "قهوة اليوم", p: 8, s: "drip", im: "areeb/dailycoffee", d: "وسط 8 · كبير 11", sz: [8, 11] },
        { id: "waffle", n: "وافل أريب", p: 12, s: "sweet", im: "areeb/waffle", d: "توقيع أريب", b: "chef" },
        { id: "cookies", n: "كوكيز", p: 11, s: "sweet", im: "areeb/cookies", d: "طازة" },
        { id: "tiramisu", n: "تيراميسو", p: 19, s: "sweet", im: "areeb/tiramisu", d: "قطعة", b: "hot" },
        { id: "pudding", n: "بودينق شوكلاته", p: 19, s: "sweet", im: "areeb/pudding", d: "قطعة" }
      ],
      offers: [
        { im: "areeb/latte", t: "بداية اليوم", d: "لاتيه + كوكيز", was: 25, p: 21 },
        { im: "areeb/spanish", t: "قعدة اثنين", d: "2 سبانيش لاتيه + تيراميسو", was: 49, p: 42 },
        { im: "areeb/v60", t: "تجربة المختصة", d: "V60 + وافل أريب", was: 27, p: 23 },
        { im: "areeb/icespanish", t: "بريك الشغل", d: "أيس سبانيش + كرنشي شوكلاته", was: 21, p: 18 }
      ],
      pair: { hot: "cookies", cold: "waffle", drip: "waffle", sweet: "latte" },
      loyalty: { goal: 6, reward: "مشروب ساخن على حسابنا" },
      facts: [["30", "صنف بصورته"], ["5", "أقسام"], ["2", "وضع فاتح وغامق"]],
      line: "صورة لكل صنف بنفس الإضاءة، ومنيو بيطلب ويقترح ويعدّ لك المبيعات.",
      chips: ["30 صورة بنفس الإضاءة", "أحجام وسط/كبير", "وضع ليلي", "الأكثر طلبًا", "كومبو", "عرض بعدّاد", "كارت ولاء", "فلتر التقييم", "بحث", "لوحة أرقام"],
      shots: { phone: img("shots/areeb-phone"), desk: img("shots/areeb-desk"), scroll: true },
      urls: { menu: DEMO.areeb, owner: DEMO.areeb + "owner.html" },
      table: 7
    },

    /* ---------------- فرندس ---------------- */
    friends: {
      id: "friends", type: "rest", name: "فرندس", en: "FRIENDS", kind: "مطعم وجبات سريعة", city: "",
      cur: "ر.س", tag: "مطعم",
      t: { bg: "#141210", card: "#1E1B18", ink: "#F5EFE8", ink2: "#A89F95", pri: "#F97316", acc: "#FB923C", line: "#2E2A26", on: "#FFFFFF", dark: true },
      flag: true,
      secs: [{ id: "crepe", t: "الكريب" }, { id: "pizza", t: "البيتزا" }, { id: "sand", t: "السندوتشات" }, { id: "broast", t: "البروست" }],
      items: [
        { id: "crepeb", n: "كريب برجر", p: 14, s: "crepe", im: "friends/crepe", d: "برجر + صوص فريندز" },
        { id: "crepemix", n: "كريب ميكس لحوم فريندز", p: 25, s: "crepe", im: "friends/crepe", d: "أكثر صنف بيتطلب", b: "hot" },
        { id: "crepep", n: "كريب بسطرمة", p: 23, s: "crepe", im: "friends/crepe", d: "بسطرمة + موتزاريلا" },
        { id: "pizzas", n: "بيتزا سوسيس", p: 28, s: "pizza", im: "friends/pizza", d: "صغير 28 · وسط 35 · كبير 43", sz: [28, 35, 43] },
        { id: "pizzam", n: "بيتزا مكس لحوم", p: 33, s: "pizza", im: "friends/pizza", d: "صغير 33 · وسط 41 · كبير 45", sz: [33, 41, 45], b: "chef" },
        { id: "bigking", n: "بيج كينج", p: 26, s: "sand", im: "friends/burger", d: "دبل لحم + شيدر", b: "hot" },
        { id: "cheeseb", n: "سندوتش تشيز برجر", p: 18, s: "sand", im: "friends/burger", d: "برجر + شيدر" },
        { id: "doubleb", n: "دبل برجر جامبو", p: 24, s: "sand", im: "friends/burger", d: "قطعتين جامبو" },
        { id: "snack", n: "وجبة سناك بوكس", p: 28, s: "broast", im: "friends/broast", d: "3 قطع + بطاطس" },
        { id: "fcombo", n: "كومبو فريندز", p: 52, s: "broast", im: "friends/broast", d: "للشخصين", b: "chef" },
        { id: "strips", n: "وجبة كرسبي ستربس", p: 36, s: "broast", im: "friends/broast", d: "5 ستربس + صوص" }
      ],
      offers: [
        { im: "friends/crepe", t: "كومبو الربع", d: "كريب ميكس لحوم + بطاطس + مشروب", was: 37, p: 32 },
        { im: "friends/burger", t: "دبل ديل", d: "سندوتشين كرسبي + بطاطس شيدر + بيبسي", was: 64, p: 55 },
        { im: "friends/pizza", t: "ليلة بيتزا", d: "بيتزا مكس لحوم وسط + بطاطس + مشروب", was: 53, p: 45 },
        { im: "friends/broast", t: "سفرة العائلة", d: "فاميلي ميل 12 قطعة + بيبسي + كول سلو", was: 106, p: 95 }
      ],
      pair: { crepe: "snack", pizza: "cheeseb", sand: "snack", broast: "crepeb" },
      loyalty: { goal: 5, reward: "مشروب أو بطاطس مجانًا" },
      facts: [["190", "صنف"], ["7", "أقسام"], ["3", "طرق طلب"]],
      line: "190 صنف في 7 أقسام، والطلب بيوصل المطبخ بصوت جرس — وعليه حماية من الطلبات الوهمية.",
      chips: ["محلي · سفري · توصيل", "جرس للطلب الجديد", "حالات الطلب", "فاتورة 80mm", "حماية من الطلبات الوهمية", "دفع بتحويل", "ولاء بالرقم", "كود مكافأة للكاشير", "قاعدة عملاء", "حاسبة العائد"],
      shots: { phone: img("shots/friends-phone"), desk: img("shots/friends-desk"), scroll: true },
      urls: { menu: "https://friendsmenu.github.io/system-sa/", owner: "https://friendsmenu.github.io/system-sa/owner.html" },
      table: 12
    },

    /* ---------------- سيزر جيم ---------------- */
    cezar: {
      id: "cezar", type: "gym", name: "سيزر جيم", en: "CEZAR GYM", kind: "جيم · فرعين", city: "بني سويف الجديدة",
      cur: "ج", tag: "جيم",
      t: { bg: "#F3F1EB", card: "#FFFFFF", ink: "#17181C", ink2: "#6B6C66", pri: "#17181C", acc: "#BEF23C", line: "#E2DFD6", on: "#17181C", dark: false },
      facts: [["16", "وحدة"], ["2", "فرع من نظام واحد"], ["9", "أنواع تنبيهات"]],
      line: "نظام واحد بيدير فرعين: الأعضاء والجلسات والخزنة والكباتن والحصص والتقارير.",
      chips: ["اشتراكات بالجلسات", "فترات رجالة وسيدات", "دخول بالكود", "تجميد الاشتراك", "خزنة وتقفيل يوم", "بوفيه ومخزون", "كباتن وعمولات", "حصص بسعة", "عملاء محتملين", "رسايل جاهزة", "صيانة الأجهزة", "لوكرات", "صلاحيات بالـPIN"],
      shots: { phone: img("shots/cezar-phone"), desk: img("shots/cezar-desk"), scroll: false },
      urls: { menu: "https://cezar-gym.github.io/branches/", owner: DEMO.cezar },
      menuLabel: "موقع الجيم",
      branches: [
        { id: "b1", n: "الفرع الأول", sub: "بجوار كافيار · ميدان الجامع" },
        { id: "b2", n: "الفرع التاني", sub: "خلف بنك مصر · ميدان الجامع" }
      ],
      plans: [
        { id: "power", n: "باور", s: 8, p: { b1: 600, b2: 750 }, note: "يومين في الأسبوع" },
        { id: "bronze", n: "برونز", s: 12, p: { b1: 650, b2: 800 }, note: "3 أيام في الأسبوع" },
        { id: "silver", n: "سيلفر", s: 16, p: { b1: 700, b2: 850 }, note: "4 أيام في الأسبوع" },
        { id: "plat", n: "بلاتينيوم", s: 20, p: { b1: 750, b2: 900 }, note: "5 أيام في الأسبوع", pop: true },
        { id: "gold", n: "جولد", s: 24, p: { b1: 850, b2: 950 }, note: "6 أيام في الأسبوع", pop: true },
        { id: "top", n: "توب", s: 30, p: { b2: 1000 }, note: "الفرع التاني" },
        { id: "vip", n: "VIP", s: 30, p: { b2: 1200 }, note: "بيدخل الفرعين" }
      ]
    }
  };

  /* ---------------- English (لغة الصفحة الأساسية) ---------------- */
  var EN = {
    lc: { nameEn: "Luxury Crop", kindEn: "Specialty coffee · Taif", tagEn: "Café", curEn: "SAR",
      lineEn: "Customers order from the table. The owner sees everything in one dashboard.",
      factsEn: [["55", "items"], ["4", "photo combos"], ["1", "dashboard"]] },
    areeb: { nameEn: "Areeb", kindEn: "Specialty coffee", tagEn: "Café", curEn: "SAR",
      lineEn: "A photo for every item, all in the same light — plus a full ordering system.",
      factsEn: [["30", "item photos"], ["5", "sections"], ["2", "light & dark"]] },
    friends: { nameEn: "Friends", kindEn: "Fast food", tagEn: "Restaurant", curEn: "SAR",
      lineEn: "190 items. Orders reach the kitchen with a bell — and fake orders get stopped.",
      factsEn: [["190", "items"], ["7", "sections"], ["3", "ways to order"]] },
    cezar: { nameEn: "Cezar Gym", kindEn: "Gym · 2 branches", tagEn: "Gym", curEn: "EGP",
      lineEn: "One system runs two branches: members, sessions, cash, coaches and reports.",
      factsEn: [["16", "modules"], ["2", "branches"], ["9", "alert types"]] }
  };
  Object.keys(EN).forEach(function (k) { for (var x in EN[k]) BRANDS[k][x] = EN[k][x]; });

  /* ---------------- الفوايد — النظام ← الفايدة ← التفاصيل ---------------- */
  /* tr = [المكان، الوحدة] اللي «Try it» بيفتحها في اللوحة */
  var BEN = [
    { id: "cafe", t: "Cafés & restaurants", sub: "Luxury Crop · Areeb · Friends", ic: "coffee", items: [
      { t: "Customers order by themselves", s: "A photo menu on their phone. They choose and order from the table.",
        d: ["A photo, price and description for every item", "Sizes and add-ons, each with its price", "A QR code on every table — the table number comes with the order", "Opens from the camera. No app to download"], tr: ["lc", "orders"] },
      { t: "Every order arrives clear", s: "Orders reach your screen with a bell, already priced.",
        d: ["Dine-in, takeaway or delivery", "New → Preparing → Delivered", "Print a receipt on the cashier printer", "Notes like “no sugar” arrive written"], tr: ["lc", "orders"] },
      { t: "Bigger bills, without pushing", s: "The menu suggests what goes well with each order.",
        d: ["“Goes well with” under every item", "Photo combos with the saving shown", "Timed offers that open and close by themselves", "Best-seller and chef’s-pick badges"], tr: ["lc", "offers"] },
      { t: "Change anything in seconds", s: "Prices, sold-out items and offers. Every customer sees it right away.",
        d: ["Change a price — no reprinting", "Mark an item sold out with one tap", "Add a new item with its photo", "Swap the offer photo and price"], tr: ["lc", "menu"] },
      { t: "Customers come back", s: "A stamp card on their phone number.",
        d: ["The stamp counts only when the cashier delivers the order", "The reward is a one-time code", "A list of all your customers, ready to export"], tr: ["lc", "loyal"] },
      { t: "A better Google rating", s: "Happy customers go to Google. Unhappy ones talk to you first.",
        d: ["4–5 stars → your Google review page", "Lower → a private message to you, with their number", "See how many bad reviews you caught"], tr: ["lc", "reviews"] },
      { t: "No fake orders", s: "Checks run before any order reaches the kitchen.",
        d: ["A first order from a new number waits for a call", "A time limit between orders, and a daily cap", "Block any number", "Pay by bank transfer with a reference — no fees"], tr: ["friends", "guard"] },
      { t: "Know your numbers", s: "Sales, busy hours and slow items — and what to do next.",
        d: ["Compared with the last period", "Busy hours and busy days", "Items nobody orders", "How much the suggestions added"], tr: ["lc", "home"] }
    ] },
    { id: "gym", t: "Gyms", sub: "Cezar Gym", ic: "gym", items: [
      { t: "Fast check-in", s: "Type the member code. The session is counted.",
        d: ["Plan, sessions left and end date in one card", "Warns if it’s not their men/women hours", "Undo a check-in and the session comes back"], tr: ["cezar", "checkin"] },
      { t: "Plans by sessions, not days", s: "Entry stops when the sessions run out.",
        d: ["Freeze a plan — the end date moves by itself", "A different price for each branch", "Renew in one tap"], tr: ["cezar", "members"] },
      { t: "More renewals", s: "Ready lists and messages, with each member’s name.",
        d: ["Ending soon, expired, absent, owes money, birthdays", "One message, names filled in for you"], tr: ["cezar", "msgs"] },
      { t: "Cash you can trust", s: "Every payment and expense, by branch.",
        d: ["Close the day: drawer vs. system", "See who still owes money", "Every action saved with who did it"], tr: ["cezar", "cash"] },
      { t: "Two branches, one system", s: "See both together, or one at a time.",
        d: ["The owner sees everything", "A manager sees their branch only", "Reception sees only their work — PIN login"], tr: ["cezar", "roles"] },
      { t: "Everything else", s: "What a gym needs, in the same place.",
        d: ["Classes with limited spots", "Leads with follow-up dates", "Buffet sales and stock", "Machine maintenance and lockers"], tr: ["cezar", "classes"] }
    ] }
  ];

  window.SYS = {
    LOCAL: LOCAL,
    ig: "https://ig.me/m/ahmedshiref__",
    igHandle: "ahmedshiref__",
    brands: BRANDS,
    order: ["lc", "areeb", "friends", "cezar"],
    ben: BEN,
    img: img
  };
})();
