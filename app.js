/* مصاريفي — كل البيانات محفوظة على الجهاز فقط */
(() => {
const KEY = 'masarif.v1';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const fmt = n => (Math.round((+n || 0) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n, cls = '') => `<span class="num ${cls}">${fmt(n)}</span><span class="cur">ر.س</span>`;
const LOC = 'ar-SA-u-ca-gregory-nu-latn';
const dShort = d => new Intl.DateTimeFormat(LOC, { day: 'numeric', month: 'short' }).format(new Date(d));
const dLong = d => new Intl.DateTimeFormat(LOC, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(d));
const dTime = d => new Intl.DateTimeFormat(LOC, { hour: 'numeric', minute: '2-digit' }).format(new Date(d));
const mKey = d => { const x = new Date(d); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0'); };
const mName = k => { const [y, m] = k.split('-'); return new Intl.DateTimeFormat(LOC, { month: 'long', year: 'numeric' }).format(new Date(+y, +m - 1, 1)); };
const mShortName = k => { const [y, m] = k.split('-'); return new Intl.DateTimeFormat(LOC, { month: 'short' }).format(new Date(+y, +m - 1, 1)); };
const shiftM = (k, n) => { const [y, m] = k.split('-').map(Number); return mKey(new Date(y, m - 1 + n, 1)); };
const COLORS = ['#C8762B', '#8A5BB8', '#2F6FA3', '#2E8B6E', '#B5465B', '#6F7D2B', '#3B8C9E', '#A0632E', '#5A63B8', '#7C8580', '#C2548F', '#4C8A3A', '#B08A1E', '#6A5ACD', '#D0603A', '#2C7F8F'];
const DEFAULT_CATS = [
  ['food', 'طعام', 0, 'مطاعم,بقالة,توصيل,قهوة'],
  ['sweets', 'حلى', 10, 'حلى,كوفي,بساكيت'],
  ['snacks', 'طراوع', 12, 'بساكيت,بطاطسات'],
  ['clothes', 'لبس', 1, 'ملابس,أحذية,عطور,إكسسوارات'],
  ['car', 'سيارة', 2, 'وقود,صيانة,غسيل,تأمين ومخالفات'],
  ['study', 'دراسة', 3, 'رسوم,كتب وأدوات,دورات'],
  ['bills', 'فواتير', 6, 'جوال,إنترنت,كهرباء,ماء'],
  ['home', 'سكن', 7, 'إيجار,أثاث,صيانة المنزل'],
  ['health', 'صحة', 4, 'صيدلية,مستشفى وعيادة,نادي رياضي'],
  ['fun', 'ترفيه', 8, 'سينما,ألعاب,طلعات'],
  ['subs', 'اشتراكات', 13, 'تطبيقات,بث'],
  ['travel', 'سفر', 15, 'طيران,فنادق,مواصلات'],
  ['family', 'عائلة', 5, ''],
  ['gifts', 'هدايا ومناسبات', 14, ''],
  ['charity', 'صدقات وزكاة', 11, ''],
  ['other', 'أخرى', 9, '']
];
const DEFAULT_ACCOUNTS = [
  { id: 'rajhi', name: 'الراجحي', opening: null, asOf: null },
  { id: 'barq', name: 'برق', opening: null, asOf: null },
  { id: 'stc', name: 'stc bank', opening: null, asOf: null },
  { id: 'snb', name: 'الأهلي', opening: null, asOf: null },
  { id: 'urpay', name: 'urpay', opening: null, asOf: null },
  { id: 'saib', name: 'سفر العربي', opening: null, asOf: null },
  { id: 'cash', name: 'كاش', opening: null, asOf: null }
];
const DEFAULT_SENDERS = [
  { id: 'rajhi', name: 'الراجحي', sender: 'AlRajhiBank', keywords: 'alrajhibank', nums: '' },
  { id: 'barq', name: 'برق', sender: 'Barq', keywords: 'barq,to a/c,visa card:', nums: '' },
  { id: 'stc', name: 'stc bank', sender: 'stc bank', keywords: 'stc bank', nums: '' },
  { id: 'snb', name: 'الأهلي', sender: 'SNB-AlAhli', keywords: 'شراء-pos,مدى-ابل*', nums: '' },
  { id: 'urpay', name: 'urpay', sender: 'urpay', keywords: 'urpay', nums: '' },
  { id: 'saib', name: 'سفر العربي', sender: 'SAIB', keywords: 'سفر', nums: '' }
];

const KEYWORDS = {
  food: /HARDEE|MCDONALD|KFC|BAIK|البيك|هرفي|STARBUCK|KUDU|كودو|SHAWARMA|شاورما|مطعم|كافيه|كوفي|COFFEE|CAFE|JAHEZ|جاهز|HUNGER|هنقر|CHEFZ|مرسول|MRSOOL|TAMIMI|DANUBE|دانوب|PANDA|بنده|OTHAIM|العثيم|LULU|لولو|CARREFOUR|كارفور|BAKERY|مخبز|PIZZA|بيتزا|BURGER|برجر|DOMINO|NINJA|نينجا|TOYOU|تويو|بقالة|SUPERMARKET|ماركت/i,
  clothes: /CENTREPOINT|CENTER POINT|سنتربوينت|MAX FASHION|\bMAX\b|H&M|ZARA|زارا|NAMSHI|نمشي|SHEIN|شي ان|ADIDAS|NIKE|BATA|REDTAG|ريد تاغ|SPLASH|AMERICAN EAGLE|DEFACTO|LC WAIKIKI|خياط|ملابس|اقمشة|أقمشة|عطور|عباي/i,
  car: /DREES|الدريس|SASCO|ساسكو|PETROMIN|بترومين|NAFT|نفط|وقود|محطة|PETROL|FUEL|AUTO|زيت|كفرات|TYRE|TIRE|ورشة|غسيل|CAR WASH|NAJM|نجم|تأمين مركبة|مرور|PARKING|مواقف|SAL\b|ADNOC|ALDREES/i,
  study: /UNIVERSITY|جامعة|COLLEGE|كلية|SCHOOL|مدرسة|COURSERA|UDEMY|JARIR|جرير|مكتبة|LIBRARY|BOOK|كتب|رسوم دراس|TUITION|اكاديمية|أكاديمية|ACADEMY|معهد|دورة/i,
  sweets: /حلويات|حلى|SWEET|DESSERT|CAKE|كيك|DUNKIN|KRISPY|CINNABON|BASKIN|ايس كريم|آيس|ICE CREAM|SAADEDDIN|سعد الدين|CHOCOLATE|شوكولا|PATCHI|باتشي/i,
  bills: /\bSTC\b|اس تي سي|MOBILY|موبايلي|\bZAIN\b|زين|SAWA|سوا|الكهرباء|ELECTRICITY|\bSEC\b|المياه|WATER|فاتورة/i,
  health: /NAHDI|النهدي|DAWAA|الدواء|صيدلي|PHARMA|HOSPITAL|مستشفى|CLINIC|عيادة|مجمع طبي|DENTAL|اسنان|أسنان|FITNESS|GYM|نادي/i,
  subs: /NETFLIX|نتفلكس|SHAHID|شاهد|SPOTIFY|ANGHAMI|انغامي|APPLE\.COM|ITUNES|GOOGLE|YOUTUBE|DISNEY|OSN|ICLOUD|CHATGPT|OPENAI|CLAUDE|ANTHROPIC/i,
  travel: /SAUDIA|السعودية للطيران|FLYNAS|ناس|FLYADEAL|اديل|BOOKING|AGODA|ALMOSAFER|المسافر|HOTEL|فندق|AIRBNB|UBER|CAREEM|كريم|بولت|BOLT|قطار|SAR TRAIN/i,
  fun: /CINEMA|سينما|VOX|MUVI|AMC|PLAYSTATION|STEAM|XBOX|NINTENDO|ملاهي|BOULEVARD|بوليفارد/i,
  home: /IKEA|ايكيا|إيكيا|HOME ?CENTER|هوم سنتر|SACO|ساكو|ACE\b|ايجار|إيجار|EJAR/i
};

function defaults() {
  return {
    v: 3, demo: false, txns: [], rules: {}, srcRules: {}, hideBal: false,
    categories: DEFAULT_CATS.map(([id, name, ci, subs]) => ({ id, name, color: COLORS[ci], budget: 0, subs: subs ? subs.split(',') : [] })),
    accounts: DEFAULT_ACCOUNTS.map(a => ({ ...a })),
    sources: [{ id: 'salary', name: 'راتب' }, { id: 'other-in', name: 'دخل آخر' }],
    senders: DEFAULT_SENDERS.map(x => ({ ...x })),
    fixed: [], lastBackup: null, pin: null
  };
}

let mem = null;
function load() {
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {}
  return mem;
}
function save() {
  mem = S;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
}

function demoData() {
  const d = defaults(); d.demo = true;
  const now = new Date();
  const ago = (days, h = 13, m = 10) => { const x = new Date(now); x.setDate(x.getDate() - days); x.setHours(h, m, 0, 0); return x; };
  const ymd = x => `${String(x.getFullYear()).slice(2)}-${x.getMonth() + 1}-${x.getDate()} ${String(x.getHours()).padStart(2, '0')}:${String(x.getMinutes()).padStart(2, '0')}`;
  const msgs = [
    [`شراء عبر نقاط البيع\nبطاقة:4567;مدى-ابل باي\nمبلغ:SAR 38.00\nلدى:ALBAIK 112\nفي:${ymd(ago(0, 14, 5))}`, 'food'],
    [`شراء عبر نقاط البيع\nبطاقة:4567;مدى-ابل باي\nمبلغ:SAR 165.50\nلدى:ALDREES 0441\nفي:${ymd(ago(1, 8, 40))}`, null],
    [`PoS Purchase\nBy:4567;mada-Apple Pay\nAmount:SAR 289.00\nAt:CENTREPOINT JED\nDate:${ymd(ago(2, 19, 15))}`, null],
    [`برق: تم خصم مبلغ 52.00 ر.س من محفظتك لدى جاهز بتاريخ ${ago(3).getFullYear()}/${ago(3).getMonth() + 1}/${ago(3).getDate()} الساعة 21:10`, 'food'],
    [`شراء انترنت\nبطاقة:8812;فيزا\nمبلغ:USD 19.99\nلدى:COURSERA\nفي:${ymd(ago(4, 10, 0))}`, 'study'],
    [`حوالة واردة: محلية\nعبر:SNB\nمبلغ:SAR 1,500.00\nالى:3344\nمن:مؤسسة الندى للتصميم\nفي:${ymd(ago(5, 11, 30))}`, null],
    [`سحب صراف\nمبلغ:SAR 300\nبطاقة:4567\nفي:${ymd(ago(6, 20, 0))}`, 'other'],
    [`شراء عبر نقاط البيع\nبطاقة:4567;مدى\nمبلغ:SAR 412.75\nلدى:TAMIMI MARKETS\nفي:${ymd(ago(8, 18, 20))}`, 'food'],
    [`إيداع راتب\nايداع:SAR 12,000.00\nالى:3344\nفي:${ymd(ago(Math.max(now.getDate() - 1, 0), 7, 0))}`, 'salary'],
    [`شراء عبر نقاط البيع\nبطاقة:4567;مدى\nمبلغ:SAR 95.00\nلدى:PETROMIN EXPRESS\nفي:${ymd(ago(15, 9, 0))}`, 'car'],
    [`شراء عبر نقاط البيع\nبطاقة:4567;مدى\nمبلغ:SAR 640.00\nلدى:JARIR BOOKSTORE\nفي:${ymd(ago(26, 17, 0))}`, 'study'],
    [`شراء عبر نقاط البيع\nبطاقة:4567;مدى\nمبلغ:SAR 1,180.00\nلدى:DANUBE\nفي:${ymd(ago(33, 18, 0))}`, 'food'],
    [`شراء عبر نقاط البيع\nبطاقة:4567;مدى\nمبلغ:SAR 520.00\nلدى:NAMSHI\nفي:${ymd(ago(40, 12, 0))}`, 'clothes'],
    [`إيداع راتب\nايداع:SAR 12,000.00\nالى:3344\nفي:${ymd(ago(42, 7, 0))}`, 'salary'],
    [`شراء عبر نقاط البيع\nبطاقة:4567;مدى\nمبلغ:SAR 310.00\nلدى:SASCO 22\nفي:${ymd(ago(47, 12, 0))}`, 'car'],
    [`شراء عبر نقاط البيع\nبطاقة:4567;مدى\nمبلغ:SAR 860.00\nلدى:PANDA\nفي:${ymd(ago(64, 12, 0))}`, 'food'],
    [`إيداع راتب\nايداع:SAR 12,000.00\nالى:3344\nفي:${ymd(ago(72, 7, 0))}`, 'salary'],
    [`شراء عبر نقاط البيع\nبطاقة:4567;مدى\nمبلغ:SAR 2,400.00\nلدى:UNIVERSITY BOOKS\nفي:${ymd(ago(75, 12, 0))}`, 'study']
  ];
  msgs.push([`شراء عبر نقاط البيع\nبطاقة:4567;مدى\nمبلغ:SAR 24.00\nلدى:SAADEDDIN 07\nفي:${ymd(ago(2, 22, 5))}`, 'sweets', 'بساكيت']);
  for (const [raw, cat, sub] of msgs) {
    const p = Parser.parse(raw, { senders: d.senders, bank: 'rajhi', now });
    if (!p.ok) continue;
    const t = toTxn(p);
    if (t.type === 'expense') { t.categoryId = cat; t.sub = sub || null; } else if (t.type === 'income') t.sourceId = cat;
    d.txns.push(t);
  }
  const cash = toTxn({ type: 'expense', amount: 18, currency: 'SAR', sar: 18, merchant: 'بقالة الحي', kind: 'مصروف يدوي', date: ago(1, 21, 30).toISOString(), bank: 'cash', raw: '', hash: 'demo-cash' });
  cash.categoryId = 'snacks'; cash.sub = 'بطاطسات'; d.txns.push(cash);
  const asOf = ago(12, 0, 0).toISOString();
  d.accounts.find(a => a.id === 'rajhi').opening = 8400; d.accounts.find(a => a.id === 'barq').opening = 450; d.accounts.find(a => a.id === 'cash').opening = 120;
  d.accounts.forEach(a => a.asOf = asOf);
  return d;
}
function toTxn(p) {
  const atm = p.type === 'expense' && p.kind === 'سحب نقدي';
  return {
    id: uid(), type: atm ? 'atm' : p.type, amount: p.amount, currency: p.currency, sar: p.sar, estimated: !!p.estimated,
    merchant: p.merchant || '', kind: p.kind, card: p.card || '', balance: p.balance ?? null, date: p.date, bank: p.bank || 'rajhi',
    to: atm ? 'cash' : null, categoryId: null, sub: null, sourceId: null, ignored: false, note: '', raw: p.raw || '', hash: p.hash, createdAt: new Date().toISOString(),
    transferLike: !atm && !!p.transferLike, bankUnknown: !p.bank
  };
}
function migrate(d) {
  if (!d.accounts) {
    d.accounts = DEFAULT_ACCOUNTS.map(a => ({ ...a }));
    for (const s of d.senders || []) if (!d.accounts.find(a => a.id === s.id)) d.accounts.splice(d.accounts.length - 1, 0, { id: s.id, name: s.name, opening: null, asOf: null });
  }
  for (const [id, name, ci, subs] of DEFAULT_CATS) {
    const c = d.categories.find(x => x.id === id);
    if (c) { if (!Array.isArray(c.subs)) c.subs = subs ? subs.split(',') : []; }
    else d.categories.splice(Math.max(d.categories.length - 1, 0), 0, { id, name, color: COLORS[ci], budget: 0, subs: subs ? subs.split(',') : [] });
  }
  d.categories.forEach(c => { if (!Array.isArray(c.subs)) c.subs = []; });
  for (const t of d.txns) {
    if (t.type === 'expense' && t.kind === 'سحب نقدي') { t.type = 'atm'; t.to = 'cash'; t.categoryId = null; }
    if (!t.bank) t.bank = d.accounts[0].id;
    if (t.sub === undefined) t.sub = null;
  }
  if (d.hideBal === undefined) d.hideBal = false;
  // v3: more banks, card numbers, fixed payments, backup date, lock — nothing existing is removed
  d.senders = d.senders || [];
  const OLD_KEYS = { rajhi: 'الراجحي,alrajhi,rajhi', barq: 'برق,barq' };
  for (const def of DEFAULT_SENDERS) {
    const s = d.senders.find(x => x.id === def.id);
    if (!s) d.senders.push({ ...def });
    else {
      if (s.keywords === OLD_KEYS[def.id]) s.keywords = def.keywords;
      if (!s.nums) s.nums = def.nums;
    }
  }
  for (const def of DEFAULT_ACCOUNTS) if (!d.accounts.find(a => a.id === def.id)) {
    const ci = d.accounts.findIndex(a => a.id === 'cash');
    d.accounts.splice(ci < 0 ? d.accounts.length : ci, 0, { ...def });
  }
  if (!Array.isArray(d.fixed)) d.fixed = [];
  if (d.lastBackup === undefined) d.lastBackup = null;
  if (d.pin === undefined) d.pin = null;
  d.v = 3;
  return d;
}

let S = load();
if (!S) S = demoData(); else { S = migrate(S); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
mem = S;
const ui = { view: 'home', month: mKey(new Date()), addTab: 'sms', parsed: [], bankSel: '', q: '', filter: 'all', manualType: 'expense', confirmWipe: false, subPick: {} };

/* ---------- helpers ---------- */
const cat = id => S.categories.find(c => c.id === id);
const src = id => S.sources.find(s => s.id === id);
const acct = id => S.accounts.find(a => a.id === id);
const bankName = id => (acct(id) || S.senders.find(s => s.id === id) || {}).name || '';
const isMove = t => t.type === 'atm' || t.type === 'transfer';
const title = t => t.type === 'atm' ? 'سحب من الصراف' : t.type === 'transfer' ? 'تحويل بين حساباتك' : (t.merchant || t.kind || (t.type === 'income' ? 'دخل' : 'مصروف'));
const counted = t => !t.ignored && (t.type === 'expense' ? !!t.categoryId : t.type === 'income' ? !!t.sourceId : false);
const catLabel = t => { const c = cat(t.categoryId); return c ? c.name + (t.sub ? ' · ' + t.sub : '') : ''; };
function balanceOf(a) {
  if (a.opening === null || a.opening === undefined) return null;
  const from = a.asOf ? new Date(a.asOf).getTime() : 0;
  let b = +a.opening;
  for (const t of S.txns) {
    if (new Date(t.date).getTime() < from) continue;
    if (t.type === 'income' && t.bank === a.id) b += t.sar;
    else if (t.type === 'expense' && t.bank === a.id) b -= t.sar;
    else if (isMove(t)) { if (t.bank === a.id) b -= t.sar; if (t.to === a.id) b += t.sar; }
  }
  return b;
}
const hidden = () => S.hideBal;
function fixedPaid(f, mk) {
  if (f.paid && f.paid[mk]) return true;
  const kw = String(f.match || '').trim().toLowerCase();
  return S.txns.some(t => t.type === 'expense' && !t.ignored && mKey(t.date) === mk && (
    (kw && (t.merchant || '').toLowerCase().includes(kw)) ||
    (f.categoryId && t.categoryId === f.categoryId && Math.abs(t.sar - f.amount) <= Math.max(1, f.amount * 0.05))));
}
function upcomingFixed() {
  const mk = mKey(new Date());
  return (S.fixed || []).filter(f => !fixedPaid(f, mk)).sort((a, b) => a.day - b.day);
}
const daysSince = iso => iso ? (Date.now() - new Date(iso).getTime()) / 864e5 : Infinity;
const balHtml = n => n === null ? '<span class="sub">غير محدد</span>' : hidden() ? '<span class="num masked">••••••</span>' : money(n, n < 0 ? 'exp' : '');
const acctOptions = sel => S.accounts.map(a => `<option value="${a.id}" ${a.id === sel ? 'selected' : ''}>${esc(a.name)}</option>`).join('');
const pendingExp = () => S.txns.filter(t => t.type === 'expense' && !t.categoryId && !t.ignored).sort(byDate);
const pendingInc = () => S.txns.filter(t => t.type === 'income' && !t.sourceId && !t.ignored).sort(byDate);
const byDate = (a, b) => new Date(b.date) - new Date(a.date);
function ruleOf(k) { const r = S.rules[k]; if (!r) return null; return typeof r === 'string' ? { c: r, s: null } : r; }
// Suggestions only: the app never assigns a category or source by itself.
function suggestCategory(t) {
  const k = Parser.merchantKey(t.merchant);
  const r = k && ruleOf(k);
  if (r && cat(r.c)) return { c: r.c, s: r.s && cat(r.c).subs.includes(r.s) ? r.s : null, prev: true };
  for (const id of ['sweets', 'subs', 'bills', 'health', 'travel', 'fun', 'home', 'food', 'clothes', 'car', 'study'])
    if (KEYWORDS[id] && cat(id) && KEYWORDS[id].test(t.merchant || '')) return { c: id, s: null, prev: false };
  return null;
}
function suggestSource(t) {
  const k = Parser.merchantKey(t.merchant);
  if (k && S.srcRules[k] && src(S.srcRules[k])) return S.srcRules[k];
  return null;
}
function monthTotals(k) {
  let inc = 0, exp = 0;
  for (const t of S.txns) {
    if (!counted(t) || mKey(t.date) !== k) continue;
    if (t.type === 'income') inc += t.sar; else exp += t.sar;
  }
  return { inc, exp };
}
function toast(msg) {
  document.querySelectorAll('.toast').forEach(e => e.remove());
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2600);
}
const ICON = {
  home: '<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/></svg>',
  list: '<svg viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24"><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>'
};

/* ---------- rows ---------- */
function dotFor(t) {
  if (isMove(t)) return `<span class="dot" style="background:var(--muted)">⇄</span>`;
  if (t.type === 'income') {
    const s = src(t.sourceId);
    return s ? `<span class="dot" style="background:var(--income)">${esc(s.name[0])}</span>` : `<span class="dot empty">؟</span>`;
  }
  const c = cat(t.categoryId);
  return c ? `<span class="dot" style="background:${esc(c.color)}">${esc(c.name[0])}</span>` : `<span class="dot empty">؟</span>`;
}
function rowHtml(t) {
  const lbl = isMove(t) ? `${bankName(t.bank)} ← ${bankName(t.to)}` : t.type === 'income' ? (src(t.sourceId) || {}).name : catLabel(t);
  const meta = isMove(t) ? [lbl, dTime(t.date)].join(' · ') : [lbl || (t.ignored ? 'مستبعد' : 'غير مصنف'), t.kind, bankName(t.bank), dTime(t.date)].filter(Boolean).join(' · ');
  const sign = t.type === 'income' ? '+' : isMove(t) ? '' : '−';
  return `<button class="row" data-act="edit" data-id="${t.id}">${dotFor(t)}
    <span style="min-width:0"><div class="t">${esc(title(t))}</div><div class="m">${esc(meta)}</div></span>
    <span class="amt ${t.type === 'income' ? 'inc' : ''}" style="${t.ignored ? 'opacity:.5;text-decoration:line-through' : ''}"><span class="num">${sign}${fmt(t.sar)}</span>${t.currency !== 'SAR' ? `<div class="m"><span class="num">${esc(t.currency)} ${fmt(t.amount)}</span></div>` : ''}</span></button>`;
}
function grouped(list) {
  let out = '', last = '';
  for (const t of list) {
    const d = new Date(t.date).toDateString();
    if (d !== last) { out += `<div class="day">${esc(dLong(t.date))}</div>`; last = d; }
    out += rowHtml(t);
  }
  return out;
}

/* ---------- views ---------- */
function vHome() {
  const k = mKey(new Date());
  const { inc, exp } = monthTotals(k);
  const pe = pendingExp(), pi = pendingInc();
  const recent = S.txns.filter(t => counted(t) || isMove(t)).sort(byDate).slice(0, 8);
  let h = `<header class="top"><div><h1>مصاريفي</h1><div class="sub">${esc(mName(k))}</div></div>
    <label class="btn small" for="homeFile">تحديث من الرسائل</label><input id="homeFile" type="file" accept=".txt,text/plain" hidden></header>`;
  if (S.demo) h += `<div class="banner"><span>هذه بيانات تجريبية لتجربة التطبيق.</span><button class="btn small" data-act="clear-demo">امسحها وابدأ</button></div>`;
  const bals = S.accounts.map(a => ({ a, b: balanceOf(a) }));
  const set = bals.filter(x => x.b !== null);
  const up = upcomingFixed(), upSum = up.reduce((x, f) => x + (+f.amount || 0), 0);
  const total = set.reduce((s, x) => s + x.b, 0);
  h += `<section><div class="wallet">
    <div class="w-top"><div><span class="lbl">الرصيد الحالي</span><div class="w-total">${set.length ? balHtml(total) : '<span class="sub" style="font-size:15px">حدد رصيد حساباتك للبدء</span>'}</div></div>
      <div class="btns"><button class="iconbtn eye" data-act="togglebal" aria-label="${hidden() ? 'إظهار الرصيد' : 'إخفاء الرصيد'}">${hidden() ? ICON.eyeOff : ICON.eye}</button><button class="iconbtn" data-act="balform">${set.length ? 'تعديل' : 'تحديد الرصيد'}</button></div></div>
    <div class="w-accts">${bals.map(({ a, b }) => `<button class="w-acct" data-act="balform" data-id="${a.id}"><span class="lbl">${esc(a.name)}</span><span class="w-val">${balHtml(b)}</span></button>`).join('')}</div>
    ${set.length && up.length ? `<div class="w-after"><span>بعد المدفوعات القادمة</span><span class="w-val">${balHtml(total - upSum)}</span></div>` : ''}
  </div></section>`;
  if (!S.demo && S.txns.length && daysSince(S.lastBackup) > 7 && daysSince(S.backupSnooze) > 2)
    h += `<section><div class="banner"><span>${S.lastBackup ? `آخر نسخة احتياطية قبل ${Math.floor(daysSince(S.lastBackup))} يوماً.` : 'لم تحفظ نسخة احتياطية بعد.'} بياناتك على هذا الجوال فقط.</span><span class="btns"><button class="btn small" data-act="backup">احفظ نسخة</button><button class="btn small sec" data-act="snoozebackup">لاحقاً</button></span></div></section>`;
  if (up.length) {
    h += `<section><div class="sec-head"><h2>مدفوعات قادمة</h2><span class="sub">هذا الشهر · <span class="num">${fmt(upSum)}</span></span></div><div class="list">
      ${up.map(f => { const c = cat(f.categoryId); const late = f.day < new Date().getDate();
        return `<div class="row"><span class="dot" style="background:${c ? esc(c.color) : 'var(--muted)'}">${esc((f.name || '؟')[0])}</span>
        <span style="min-width:0"><div class="t">${esc(f.name)}</div><div class="m">${late ? '<span class="late">متأخرة · </span>' : ''}يوم <span class="num">${f.day}</span>${c ? ' · ' + esc(c.name) : ''}</div></span>
        <span class="amt"><span class="num">${fmt(f.amount)}</span><div><button class="iconbtn small" data-act="fixedpaid" data-id="${f.id}">دُفعت</button></div></span></div>`; }).join('')}
    </div></section>`;
  }
  h += `<section><div class="ledger">
    <div><span class="lbl">الدخل</span><span class="val inc">${money(inc)}</span></div>
    <div><span class="lbl">المصروف</span><span class="val exp">${money(exp)}</span></div>
    <div><span class="lbl">المتبقي</span><span class="val">${money(inc - exp)}</span></div></div></section>`;
  if (pi.length) {
    h += `<section><div class="sec-head"><h2>دخل جديد <span class="count num">${pi.length}</span></h2></div>`;
    for (const t of pi) h += incomeCard(t);
    h += `</section>`;
  }
  h += `<section><div class="sec-head"><h2>آخر المدفوعات${pe.length ? ` <span class="count num">${pe.length}</span>` : ''}</h2><span class="sub">اختر البند</span></div>`;
  if (!pe.length) h += `<div class="list"><div class="empty-state">كل المدفوعات مصنفة. الصق رسائل جديدة من البنك لتظهر هنا.</div></div>`;
  for (const t of pe) h += expenseCard(t);
  h += `</section>`;
  h += `<section><div class="sec-head"><h2>آخر العمليات المصنفة</h2><button class="iconbtn" data-act="go" data-v="history">عرض الكل</button></div>
    <div class="list">${recent.length ? recent.map(rowHtml).join('') : '<div class="empty-state">لا توجد عمليات بعد.</div>'}</div></section>`;
  return h;
}
function cardHead(t) {
  const meta = [t.kind, t.bankUnknown ? '' : bankName(t.bank), dShort(t.date) + ' ' + dTime(t.date), t.card ? '•' + t.card : ''].filter(Boolean).join(' · ');
  const pickAcct = t.bankUnknown ? `<label class="acct-pick">أي حساب؟ <select class="tacct" data-id="${t.id}"><option value="">اختر</option>${acctOptions('')}</select></label>` : '';
  return `<div class="hd"><div><div style="font-weight:600">${esc(title(t))}</div><div class="sub">${esc(meta)}</div>${pickAcct}</div>
    <div style="text-align:end"><div style="font-weight:600" class="${t.type === 'income' ? 'inc' : ''}">${money(t.sar)}</div>
    ${t.currency !== 'SAR' ? `<span class="tag warn">${esc(t.currency)} ${fmt(t.amount)}${t.estimated ? ' · تقديري' : ''}</span>` : ''}</div></div>`;
}
function findCounterpart(t) {
  const tt = new Date(t.date).getTime();
  return S.txns.find(o => o !== t && o.type === (t.type === 'expense' ? 'income' : 'expense') && !o.ignored && o.transferLike && !o.notTransfer
    && Math.abs(o.sar - t.sar) < 0.01 && o.bank !== t.bank && Math.abs(new Date(o.date).getTime() - tt) <= 30 * 60000);
}
function transferCard(t) {
  const out = t.type === 'expense';
  const cp = findCounterpart(t);
  const others = S.accounts.filter(a => a.id !== t.bank);
  const sameBank = /بين حساباتك/.test(t.kind);
  let chips = '';
  if (cp) chips += `<button class="chip on" data-act="mktransfer" data-id="${t.id}" data-o="${cp.bank}" data-cp="${cp.id}">نعم: ${esc(out ? bankName(t.bank) + ' ← ' + bankName(cp.bank) : bankName(cp.bank) + ' ← ' + bankName(t.bank))}</button>`;
  if (sameBank) chips += `<button class="chip" data-act="mktransfer" data-id="${t.id}" data-o="${t.bank}">نعم، داخل ${esc(bankName(t.bank))}</button>`;
  chips += others.filter(a => !cp || a.id !== cp.bank).map(a => `<button class="chip" data-act="mktransfer" data-id="${t.id}" data-o="${a.id}">${out ? 'نعم، إلى' : 'نعم، من'} ${esc(a.name)}</button>`).join('');
  chips += `<button class="chip ghost" data-act="nottransfer" data-id="${t.id}">لا، ${out ? 'مصروف' : 'دخل'}</button>`;
  return `<div class="pend xfer">${cardHead(t)}
    <div class="question">هل هذا تحويل بين حساباتك؟${t.merchant ? ` <span class="sub">(${out ? 'إلى' : 'من'} ${esc(t.merchant)})</span>` : ''}</div>
    <div class="chips">${chips}</div></div>`;
}
function expenseCard(t) {
  if (t.transferLike && !t.notTransfer) return transferCard(t);
  const picked = ui.subPick[t.id] && cat(ui.subPick[t.id]);
  if (picked) {
    return `<div class="pend">${cardHead(t)}
      <div class="question"><span class="chip on" style="pointer-events:none"><i style="background:${esc(picked.color)}"></i>${esc(picked.name)}</span> اختر التفصيل:</div>
      <div class="chips">${picked.subs.map(s => `<button class="chip" data-act="setsub" data-id="${t.id}" data-c="${picked.id}" data-s="${esc(s)}">${esc(s)}</button>`).join('')}
      <button class="chip ghost" data-act="setsub" data-id="${t.id}" data-c="${picked.id}" data-s="">بدون تفصيل</button>
      <button class="chip ghost" data-act="unpick" data-id="${t.id}">رجوع</button></div></div>`;
  }
  const sg = suggestCategory(t), sc = sg && cat(sg.c);
  const sugRow = sc ? `<div class="sug"><span>${sg.prev ? 'صنّفته سابقاً:' : 'اقتراح:'} <b>${esc(sc.name)}${sg.s ? ' · ' + esc(sg.s) : ''}</b></span>
    <button class="btn small" data-act="acceptsug" data-id="${t.id}" data-c="${sc.id}" data-s="${esc(sg.s || '')}" data-prev="${sg.prev ? 1 : ''}">${sg.prev ? 'نعم، نفسه' : 'نعم'}</button></div>` : '';
  return `<div class="pend">${cardHead(t)}${sugRow}<div class="chips">
    ${S.categories.map(c => `<button class="chip" data-act="setcat" data-id="${t.id}" data-c="${c.id}"><i style="background:${esc(c.color)}"></i>${esc(c.name)}${c.subs.length ? '<span class="more">‹</span>' : ''}</button>`).join('')}
    <button class="chip ghost" data-act="newcat" data-id="${t.id}">+ بند جديد</button>
    <button class="chip ghost" data-act="ignore" data-id="${t.id}">تجاهل</button></div></div>`;
}
function incomeCard(t) {
  if (t.transferLike && !t.notTransfer) return transferCard(t);
  const from = t.merchant ? ` من ${esc(t.merchant)}` : '';
  return `<div class="pend in">${cardHead(t)}
    <div class="question">وصلك <b>${money(t.sar)}</b> (${esc(t.kind)}${from}). ما مصدره؟</div>
    ${(() => { const ss = suggestSource(t), so = ss && src(ss); return so ? `<div class="sug"><span>سجّلته سابقاً: <b>${esc(so.name)}</b></span><button class="btn small" data-act="setsrc" data-id="${t.id}" data-s="${so.id}">نعم، نفسه</button></div>` : ''; })()}
    <div class="chips">${S.sources.map(s => `<button class="chip" data-act="setsrc" data-id="${t.id}" data-s="${s.id}">${esc(s.name)}</button>`).join('')}
    <button class="chip ghost" data-act="newsrc" data-id="${t.id}">+ مصدر جديد</button>
    <button class="chip ghost" data-act="ignore" data-id="${t.id}">تجاهل</button></div></div>`;
}

function vAdd() {
  let h = `<header class="top"><h1>إضافة</h1></header>
  <div class="seg" role="tablist"><button class="${ui.addTab === 'sms' ? 'on' : ''}" data-act="addtab" data-t="sms">من رسائل البنك</button><button class="${ui.addTab === 'manual' ? 'on' : ''}" data-act="addtab" data-t="manual">إدخال يدوي</button></div>`;
  if (ui.addTab === 'sms') {
    h += `<section><div class="card">
      <label class="f">البنك أو المحفظة<select id="bankSel"><option value="">تحديد تلقائي</option>${S.senders.map(s => `<option value="${s.id}" ${ui.bankSel === s.id ? 'selected' : ''}>${esc(s.name)} (${esc(s.sender)})</option>`).join('')}</select></label>
      <label class="f">الصق رسالة أو عدة رسائل (افصل بينها بسطر فارغ أو ---)
        <textarea id="smsBox" dir="auto" placeholder="شراء عبر نقاط البيع&#10;بطاقة:4567;مدى-ابل باي&#10;مبلغ:SAR 45.50&#10;لدى:HARDEES&#10;في:26-11-7 21:30">${esc(ui.smsText || '')}</textarea></label>
      <div class="btns"><button class="btn" data-act="parse">استخراج العمليات</button><button class="btn sec" data-act="paste">لصق من الحافظة</button><label class="btn sec" for="smsFile">فتح ملف الرسائل</label><input id="smsFile" type="file" accept=".txt,text/plain" hidden></div>
      <div class="hint">لا يُرسل أي شيء خارج جهازك. الرسائل المكررة ورموز التحقق تُتجاهل تلقائياً.</div></div></section>`;
    if (ui.parsed.length) {
      const fresh = ui.parsed.filter(p => p.ok && !p.dup);
      h += `<section><div class="sec-head"><h2>النتيجة</h2><span class="sub">${fresh.length} جديدة من ${ui.parsed.length}</span></div><div class="list">`;
      for (const p of ui.parsed) {
        const tag = !p.ok ? `<span class="tag">${esc(p.reason)}</span>` : p.dup ? `<span class="tag">مسجلة سابقاً</span>` : `<span class="tag new">جديدة</span>`;
        h += `<div class="row"><span class="dot ${p.ok ? '' : 'empty'}" style="${p.ok ? `background:${p.type === 'income' ? 'var(--income)' : 'var(--expense)'}` : ''}">${p.ok ? (p.type === 'income' ? '+' : '−') : '×'}</span>
          <span style="min-width:0"><div class="t">${p.ok ? esc(p.merchant || p.kind) : esc(p.raw.split('\n')[0])}</div><div class="m">${p.ok ? esc([p.kind, bankName(p.bank), dShort(p.date) + ' ' + dTime(p.date)].filter(Boolean).join(' · ')) : ''}</div></span>
          <span class="amt">${p.ok ? `<span class="num">${fmt(p.sar)}</span>` : ''}<div>${tag}</div></span></div>`;
      }
      h += `</div>${fresh.length ? `<button class="btn block" data-act="savep">حفظ ${fresh.length} عملية</button>` : ''}</section>`;
    }
  } else {
    const t = ui.manualType;
    const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const mc = cat(ui.mCat) || S.categories[0];
    const defAcct = t === 'atm' ? (S.accounts.find(a => a.id !== 'cash') || S.accounts[0]).id : (ui.mAcct || (t === 'expense' ? 'cash' : S.accounts[0].id));
    h += `<section><div class="card">
      <div class="seg"><button class="${t === 'expense' ? 'on' : ''}" data-act="mtype" data-t="expense">مصروف</button><button class="${t === 'income' ? 'on' : ''}" data-act="mtype" data-t="income">دخل</button><button class="${t === 'atm' ? 'on' : ''}" data-act="mtype" data-t="atm">سحب صراف</button></div>
      <div class="grid2"><label class="f">المبلغ (ر.س)<input id="mAmt" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0.00"></label>
      <label class="f">التاريخ<input id="mDate" type="datetime-local" value="${now.toISOString().slice(0, 16)}"></label></div>`;
    if (t === 'atm') {
      h += `<div class="grid2"><label class="f">من حساب<select id="mAcct">${acctOptions(defAcct)}</select></label>
        <label class="f">إلى<select id="mTo">${acctOptions('cash')}</select></label></div>
        <div class="hint">يُخصم المبلغ من البنك ويُضاف إلى الكاش، ولا يُحسب مصروفاً. سجّل ما تصرفه من الكاش كمصروف على حساب «كاش».</div>`;
    } else {
      h += `<label class="f">${t === 'expense' ? 'الجهة أو الوصف' : 'من'}<input id="mMer" type="text" placeholder="${t === 'expense' ? 'مثال: بقالة، مطعم' : 'مثال: شركة، عميل'}"></label>
      <label class="f">${t === 'expense' ? 'دُفع من' : 'أُضيف إلى'}<select id="mAcct">${acctOptions(defAcct)}</select></label>`;
      if (t === 'expense') {
        h += `<div class="grid2"><label class="f">البند<select id="mCat">${S.categories.map(c => `<option value="${c.id}" ${c.id === mc.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
        <label class="f">التفصيل<select id="mSub" ${mc.subs.length ? '' : 'disabled'}><option value="">${mc.subs.length ? '— بدون —' : 'لا يوجد'}</option>${mc.subs.map(s => `<option>${esc(s)}</option>`).join('')}</select></label></div>`;
      } else {
        h += `<label class="f">مصدر الدخل<select id="mCat">${S.sources.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>`;
      }
    }
    h += `<label class="f">ملاحظة<input id="mNote" type="text"></label>
      <button class="btn block" data-act="savem">حفظ</button></div></section>`;
  }
  return h;
}

function vHistory() {
  const q = ui.q.trim().toLowerCase();
  let list = S.txns.slice().sort(byDate).filter(t => {
    if (ui.filter === 'expense' && t.type !== 'expense') return false;
    if (ui.filter === 'income' && t.type !== 'income') return false;
    if (ui.filter === 'pending' && (counted(t) || t.ignored || isMove(t))) return false;
    if (ui.filter === 'atm' && !isMove(t)) return false;
    if (!q) return true;
    return [title(t), t.kind, t.note, catLabel(t), (src(t.sourceId) || {}).name, bankName(t.bank)].join(' ').toLowerCase().includes(q);
  });
  const f = (k, l) => `<button class="${ui.filter === k ? 'on' : ''}" data-act="filter" data-f="${k}">${l}</button>`;
  return `<header class="top"><h1>السجل</h1><span class="sub"><span class="num">${list.length}</span> عملية</span></header>
    <input id="q" type="search" placeholder="ابحث باسم التاجر أو البند" value="${esc(ui.q)}">
    <div class="seg" style="margin-top:10px">${f('all', 'الكل')}${f('expense', 'مصروف')}${f('income', 'دخل')}${f('atm', 'تحويلات')}${f('pending', 'غير مصنف')}</div>
    <section><div class="list">${list.length ? grouped(list.slice(0, 300)) : '<div class="empty-state">لا توجد نتائج.</div>'}</div></section>`;
}

function donut(parts, total) {
  const R = 58, C = 2 * Math.PI * R; let off = 0;
  let s = `<svg viewBox="0 0 150 150" width="150" height="150" role="img" aria-label="توزيع المصروف"><g transform="rotate(-90 75 75)">
    <circle cx="75" cy="75" r="${R}" fill="none" stroke="var(--sunk)" stroke-width="18"/>`;
  for (const p of parts) {
    const len = total ? (p.v / total) * C : 0;
    s += `<circle cx="75" cy="75" r="${R}" fill="none" stroke="${esc(p.color)}" stroke-width="18" stroke-dasharray="${Math.max(len - 1.5, 0.01)} ${C}" stroke-dashoffset="${-off}"/>`;
    off += len;
  }
  s += `</g><text x="75" y="70" text-anchor="middle">المصروف</text><text class="center-big" x="75" y="92" text-anchor="middle">${fmt(total).replace(/\.00$/, '')}</text></svg>`;
  return s;
}
function niceMax(v) { if (v <= 0) return 100; const p = Math.pow(10, Math.floor(Math.log10(v))); for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p; return 10 * p; }
function bars(k) {
  const ms = []; for (let i = 5; i >= 0; i--) ms.push(shiftM(k, -i));
  const data = ms.map(m => ({ m, ...monthTotals(m) }));
  const max = niceMax(Math.max(...data.map(d => Math.max(d.inc, d.exp))));
  const W = 340, H = 180, L = 46, B = 24, T = 10, plotH = H - B - T, cw = (W - L - 8) / 6;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W * 1.4}px;display:block" role="img" aria-label="الدخل والمصروف لآخر ستة أشهر" direction="ltr">`;
  for (const f of [0, 0.5, 1]) {
    const y = T + plotH - f * plotH;
    s += `<line class="gridl" x1="${L}" x2="${W - 4}" y1="${y}" y2="${y}"/><text x="${L - 6}" y="${y + 3}" text-anchor="end">${(max * f).toLocaleString('en-US')}</text>`;
  }
  data.forEach((d, i) => {
    const x = L + i * cw + cw / 2, bw = Math.min(14, cw / 3);
    const hi = (d.inc / max) * plotH, he = (d.exp / max) * plotH;
    s += `<rect class="b-in" x="${x - bw - 1}" y="${T + plotH - hi}" width="${bw}" height="${hi}" rx="2"><title>دخل ${fmt(d.inc)}</title></rect>`;
    s += `<rect class="b-ex" x="${x + 1}" y="${T + plotH - he}" width="${bw}" height="${he}" rx="2"><title>مصروف ${fmt(d.exp)}</title></rect>`;
    s += `<text x="${x}" y="${H - 7}" text-anchor="middle" style="${d.m === k ? 'fill:var(--ink);font-weight:600' : ''}">${esc(mShortName(d.m))}</text>`;
  });
  return s + `</svg>`;
}
function vReports() {
  const k = ui.month;
  const { inc, exp } = monthTotals(k);
  const tx = S.txns.filter(t => counted(t) && mKey(t.date) === k);
  const byCat = S.categories.map(c => ({ id: c.id, name: c.name, color: c.color, budget: +c.budget || 0, v: tx.filter(t => t.type === 'expense' && t.categoryId === c.id).reduce((a, t) => a + t.sar, 0) }))
    .filter(c => c.v > 0 || c.budget > 0).sort((a, b) => b.v - a.v);
  const merch = {};
  for (const t of tx) if (t.type === 'expense') { const n = t.merchant || t.kind; merch[n] = merch[n] || { n, v: 0, c: 0 }; merch[n].v += t.sar; merch[n].c++; }
  const top = Object.values(merch).sort((a, b) => b.v - a.v).slice(0, 5);
  const bySrc = S.sources.map(s => ({ name: s.name, v: tx.filter(t => t.type === 'income' && t.sourceId === s.id).reduce((a, t) => a + t.sar, 0) })).filter(s => s.v > 0).sort((a, b) => b.v - a.v);
  const rate = inc > 0 ? Math.round(((inc - exp) / inc) * 100) : null;
  const pend = S.txns.filter(t => !t.ignored && !counted(t) && mKey(t.date) === k).length;
  let h = `<header class="top"><h1>التقرير</h1><button class="btn small sec" data-act="export">تصدير CSV</button></header>
    <div class="monthnav"><button data-act="month" data-n="-1" aria-label="الشهر السابق">›</button><h2>${esc(mName(k))}</h2><button data-act="month" data-n="1" aria-label="الشهر التالي">‹</button></div>`;
  if (pend) h += `<section><div class="banner"><span>${pend} عملية في هذا الشهر غير مصنفة ولا تدخل في التقرير.</span><button class="btn small" data-act="go" data-v="home">صنّفها</button></div></section>`;
  h += `<section><div class="ledger">
    <div><span class="lbl">الدخل</span><span class="val inc">${money(inc)}</span></div>
    <div><span class="lbl">المصروف</span><span class="val exp">${money(exp)}</span></div>
    <div><span class="lbl">نسبة الادخار</span><span class="val num">${rate === null ? '—' : rate + '%'}</span></div></div></section>`;
  h += `<section><h2>حسب البند</h2><div class="card">`;
  if (!byCat.length) h += `<div class="empty-state">لا مصروفات مصنفة في هذا الشهر.</div>`;
  else {
    h += `<div class="donut-wrap">${donut(byCat.filter(c => c.v > 0), exp)}<div class="legend">`;
    for (const c of byCat) {
      const pct = exp ? Math.round((c.v / exp) * 100) : 0;
      h += `<div class="lg"><i style="background:${esc(c.color)}"></i><span>${esc(c.name)} <span class="sub num">${pct}%</span></span><span class="num">${fmt(c.v)}</span>`;
      const subs = {};
      for (const t of tx) if (t.type === 'expense' && t.categoryId === c.id) { const s = t.sub || 'بدون تفصيل'; subs[s] = (subs[s] || 0) + t.sar; }
      const sl = Object.entries(subs).sort((a, b) => b[1] - a[1]);
      if (sl.length && !(sl.length === 1 && sl[0][0] === 'بدون تفصيل'))
        h +=`<div class="subs">${sl.map(([n, v]) => `<span>${esc(n)} <span class="num">${fmt(v)}</span></span>`).join('')}</div>`;
      if (c.budget > 0) {
        const r = c.v / c.budget;
        h += `<div class="bar ${r > 1 ? 'over' : ''}"><b style="width:${Math.min(r, 1) * 100}%;background:${esc(c.color)}"></b></div><span class="sub" style="grid-column:2/4;font-size:11px">${r > 1 ? 'تجاوزت الميزانية بـ ' : 'المتبقي من الميزانية '}<span class="num">${fmt(Math.abs(c.budget - c.v))}</span> من <span class="num">${fmt(c.budget)}</span></span>`;
      }
      h += `</div>`;
    }
    h += `</div></div>`;
  }
  h += `</div></section>`;
  h += `<section><div class="sec-head"><h2>آخر ستة أشهر</h2><div class="keyrow"><span class="k-in">دخل</span><span class="k-ex">مصروف</span></div></div><div class="card chart-scroll">${bars(k)}</div></section>`;
  h += `<section><h2>أكثر الجهات صرفاً</h2><div class="list">${top.length ? top.map(m => `<div class="row"><span class="dot empty num">${m.c}</span><span style="min-width:0"><div class="t">${esc(m.n)}</div><div class="m">${m.c} عملية</div></span><span class="amt num">${fmt(m.v)}</span></div>`).join('') : '<div class="empty-state">لا توجد بيانات.</div>'}</div></section>`;
  h += `<section><h2>مصادر الدخل</h2><div class="list">${bySrc.length ? bySrc.map(s => `<div class="row"><span class="dot" style="background:var(--income)">${esc(s.name[0])}</span><span class="t">${esc(s.name)}</span><span class="amt num inc">${fmt(s.v)}</span></div>`).join('') : '<div class="empty-state">لا دخل مسجل في هذا الشهر.</div>'}</div></section>`;
  return h;
}

function vSettings() {
  const rules = Object.keys(S.rules).map(k => [k, ruleOf(k)]).filter(([, r]) => r && cat(r.c));
  let h = `<header class="top"><h1>الإعدادات</h1></header>`;
  h += `<section><div class="sec-head"><h2>الحسابات والرصيد</h2><button class="iconbtn" data-act="acctform">+ حساب</button></div><div class="list">
    ${S.accounts.map(a => `<div class="set-row"><div class="grow"><div>${esc(a.name)}</div><div class="sub">${balanceOf(a) === null ? 'الرصيد غير محدد' : 'الرصيد ' + (hidden() ? '••••' : fmt(balanceOf(a)))}</div></div><button class="iconbtn" data-act="balform" data-id="${a.id}">ضبط الرصيد</button>${a.id !== 'cash' && !S.senders.find(s => s.id === a.id) ? `<button class="iconbtn" data-act="acctdel" data-id="${a.id}">حذف</button>` : ''}</div>`).join('')}</div>
    <div class="hint">ضبط الرصيد يعني: «رصيدي الآن كذا». بعدها يُخصم كل مصروف ويُضاف كل دخل تلقائياً، والعمليات الأقدم من وقت الضبط لا تؤثر.</div></section>`;
  h += `<section><div class="sec-head"><h2>المصاريف الثابتة</h2><button class="iconbtn" data-act="fixedform">+ إضافة</button></div><div class="list">
    ${(S.fixed || []).length ? S.fixed.map(f => `<div class="set-row"><div class="grow"><div>${esc(f.name)}</div><div class="sub">يوم <span class="num">${f.day}</span> من كل شهر · <span class="num">${fmt(f.amount)}</span>${cat(f.categoryId) ? ' · ' + esc(cat(f.categoryId).name) : ''}${fixedPaid(f, mKey(new Date())) ? ' · دُفعت هذا الشهر' : ''}</div></div><button class="iconbtn" data-act="fixedform" data-id="${f.id}">تعديل</button></div>`).join('')
      : '<div class="empty-state">أضف الإيجار والاشتراكات والفواتير الشهرية، فيعرض لك التطبيق المتبقي من رصيدك بعدها.</div>'}</div></section>`;
  h += `<section><h2>قفل التطبيق</h2><div class="list"><div class="set-row"><div class="grow"><div>${S.pin ? 'الرمز السري مفعّل' : 'بدون قفل'}</div><div class="sub">${S.pin ? 'يُطلب عند فتح التطبيق وبعد دقيقة من الخروج منه' : 'رمز من ٤ أرقام يُطلب عند فتح التطبيق'}</div></div>
    ${S.pin ? `<button class="iconbtn" data-act="pinform" data-m="change">تغيير</button><button class="iconbtn" data-act="pinform" data-m="off">إيقاف</button>` : `<button class="iconbtn" data-act="pinform" data-m="on">تفعيل</button>`}</div></div></section>`;
  h += `<section><div class="sec-head"><h2>بنود المصروفات</h2><button class="iconbtn" data-act="catform">+ إضافة</button></div><div class="list">
    ${S.categories.map(c => `<div class="set-row"><span class="dot" style="background:${esc(c.color)}">${esc(c.name[0])}</span><div class="grow"><div>${esc(c.name)}</div><div class="sub">${c.subs.length ? esc(c.subs.join('، ')) : 'بدون تفاصيل'}${+c.budget ? ` · ميزانية <span class="num">${fmt(c.budget)}</span>` : ''}</div></div><button class="iconbtn" data-act="catform" data-id="${c.id}">تعديل</button></div>`).join('')}</div></section>`;
  h += `<section><div class="sec-head"><h2>مصادر الدخل</h2><button class="iconbtn" data-act="srcform">+ إضافة</button></div><div class="list">
    ${S.sources.map(s => `<div class="set-row"><span class="dot" style="background:var(--income)">${esc(s.name[0])}</span><div class="grow"><div>${esc(s.name)}</div></div><button class="iconbtn" data-act="srcform" data-id="${s.id}">تعديل</button></div>`).join('')}</div></section>`;
  h += `<section><div class="sec-head"><h2>البنوك والمحافظ</h2><button class="iconbtn" data-act="sndform">+ إضافة</button></div><div class="list">
    ${S.senders.map(s => `<div class="set-row"><div class="grow"><div>${esc(s.name)} <span class="mono">${esc(s.sender)}</span></div><div class="sub">${s.nums ? 'أرقام: ' + esc(s.nums) : 'بدون أرقام بطاقات'}</div></div><button class="iconbtn" data-act="sndform" data-id="${s.id}">تعديل</button></div>`).join('')}</div>
    <div class="hint">يعرف التطبيق بنك كل رسالة من أرقام بطاقاتك وحساباتك. إذا لم يعرفه سيسألك.</div></section>`;
  h += `<section><h2>تصنيفاتك السابقة</h2><div class="list">${rules.length ? rules.map(([k, r]) => `<div class="set-row"><div class="grow"><div class="mono" style="display:inline-block">${esc(k)}</div></div><span class="chip"><i style="background:${esc(cat(r.c).color)}"></i>${esc(cat(r.c).name)}${r.s ? ' · ' + esc(r.s) : ''}</span><button class="iconbtn" data-act="delrule" data-k="${esc(k)}" aria-label="حذف">حذف</button></div>`).join('') : '<div class="empty-state">عندما تصنّف عملية لمحل، يتذكره التطبيق هنا ويذكّرك به في المرة القادمة.</div>'}</div></section>`;
  h += `<section><details class="card" ${S.txns.length < 3 || S.demo ? 'open' : ''}><summary>ربط رسائل الآيفون تلقائياً</summary>
    <p class="hint" style="margin:0">لا يسمح الآيفون لأي تطبيق ويب بقراءة الرسائل، لكن أتمتة في تطبيق الاختصارات تحفظ رسائل البنك في ملف، والتطبيق يقرؤه بضغطة.</p>
    <ol class="steps">
      <li>في <b>الاختصارات</b>: أتمتة جديدة ← <b>رسالة</b> ← «تحتوي الرسالة على» <span class="mono">SAR</span> ← <b>تشغيل فورًا</b>.</li>
      <li>أضف إجراء <b>إلحاق بملف نصي</b>: النص <b>إدخال الاختصار</b> ثم سطر جديد و <span class="mono">---</span>، ومسار الملف <span class="mono">رسائل البنك.txt</span>.</li>
      <li>كرر الأتمتة بكلمة <span class="mono">ريال</span> ثم <span class="mono">ر.س</span> ثم <span class="mono">رس</span>، بنفس الملف.</li>
      <li>في الرئيسية اضغط <b>تحديث من الرسائل</b> واختر الملف من الملفات ← iCloud Drive ← Shortcuts. المكرر يُتجاهل.</li>
    </ol></details></section>`;
  h += `<section><h2>النسخ الاحتياطي</h2><div class="card">
    <div class="hint">بياناتك على هذا الجهاز فقط. خذ نسخة احتياطية من وقت لآخر.</div>
    <div class="btns"><button class="btn sec" data-act="backup">حفظ نسخة احتياطية</button><button class="btn sec" data-act="copybackup">نسخ النص</button></div>
    <label class="f">استعادة من ملف<input id="restoreFile" type="file" accept=".json,application/json,text/plain"></label>
    <label class="f">أو الصق نص النسخة الاحتياطية<textarea id="restoreBox" style="min-height:70px" dir="ltr"></textarea></label>
    <button class="btn sec" data-act="restore">استعادة</button></div></section>`;
  h += `<section><div class="card">${ui.confirmWipe
    ? `<div>سيُحذف كل شيء من هذا الجهاز ولا يمكن التراجع. هل أنت متأكد؟</div><div class="btns"><button class="btn danger" data-act="wipe">نعم، احذف كل البيانات</button><button class="btn sec" data-act="nowipe">إلغاء</button></div>`
    : `<button class="btn danger" data-act="askwipe">حذف كل البيانات</button>`}</div></section>`;
  return h;
}

/* ---------- render ---------- */
function render() {
  const views = { home: vHome, add: vAdd, history: vHistory, reports: vReports, settings: vSettings };
  $('#app').innerHTML = views[ui.view]();
  const pc = pendingExp().length + pendingInc().length;
  const tab = (v, label, icon, extra = '') => `<button class="${ui.view === v ? 'on' : ''} ${extra}" data-act="go" data-v="${v}" aria-label="${label}">${icon}<span>${label}</span>${v === 'home' && pc ? `<span class="badge num">${pc}</span>` : ''}</button>`;
  $('#tabs').innerHTML = `<div class="in">${tab('home', 'الرئيسية', ICON.home)}${tab('history', 'السجل', ICON.list)}
    <button class="add ${ui.view === 'add' ? 'on' : ''}" data-act="go" data-v="add" aria-label="إضافة"><span class="plus">${ICON.plus}</span><span>إضافة</span></button>
    ${tab('reports', 'التقرير', ICON.chart)}${tab('settings', 'الإعدادات', ICON.gear)}</div>`;
}
function go(v) { ui.view = v; ui.confirmWipe = false; render(); window.scrollTo(0, 0); }

/* ---------- sheets ---------- */
function sheet(html, onMount) {
  closeSheet();
  const sc = document.createElement('div'); sc.className = 'scrim'; sc.id = 'scrim';
  sc.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  sc.addEventListener('click', e => { if (e.target === sc) closeSheet(); });
  document.body.appendChild(sc);
  onMount && onMount(sc);
}
function closeSheet() { const s = $('#scrim'); if (s) s.remove(); }

function editSheet(id) {
  const t = S.txns.find(x => x.id === id); if (!t) return;
  const loc = new Date(t.date); loc.setMinutes(loc.getMinutes() - loc.getTimezoneOffset());
  const head = `<div class="grid2"><label class="f">المبلغ (ر.س)<input id="eAmt" type="number" step="0.01" inputmode="decimal" value="${t.sar}"></label>
    <label class="f">التاريخ<input id="eDate" type="datetime-local" value="${loc.toISOString().slice(0, 16)}"></label></div>`;
  if (isMove(t)) {
    sheet(`<h2>${esc(title(t))}</h2>${head}
      <div class="grid2"><label class="f">من حساب<select id="eAcct">${acctOptions(t.bank)}</select></label><label class="f">إلى<select id="eTo">${acctOptions(t.to)}</select></label></div>
      <label class="f">ملاحظة<input id="eNote" type="text" value="${esc(t.note)}"></label>
      ${t.raw ? `<details><summary class="sub">نص الرسالة الأصلية</summary><pre class="raw" dir="auto">${esc(t.raw)}</pre></details>` : ''}
      <div class="btns"><button class="btn" data-act="esave" data-id="${t.id}">حفظ</button><button class="btn sec" data-act="close">إلغاء</button><span style="flex:1"></span><button class="btn danger" data-act="edel" data-id="${t.id}">حذف</button></div>`);
    return;
  }
  const opts = (t.type === 'expense' ? S.categories : S.sources).map(c => `<option value="${c.id}" ${(t.type === 'expense' ? t.categoryId : t.sourceId) === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  const c = cat(t.categoryId);
  sheet(`<h2>${t.type === 'income' ? 'تعديل دخل' : 'تعديل مصروف'}</h2>${head}
    <div class="grid2"><label class="f">${t.type === 'income' ? 'من' : 'الجهة'}<input id="eMer" type="text" value="${esc(t.merchant)}"></label>
    <label class="f">${t.type === 'income' ? 'أُضيف إلى' : 'دُفع من'}<select id="eAcct">${acctOptions(t.bank)}</select></label></div>
    <div class="grid2"><label class="f">${t.type === 'income' ? 'مصدر الدخل' : 'البند'}<select id="eCat"><option value="">— غير مصنف —</option>${opts}</select></label>
    ${t.type === 'expense' ? `<label class="f">التفصيل<select id="eSub">${subOptions(c, t.sub)}</select></label>` : ''}</div>
    <label class="f">ملاحظة<input id="eNote" type="text" value="${esc(t.note)}"></label>
    <label class="f" style="display:flex;gap:8px;align-items:center;color:var(--ink)"><input id="eIgn" type="checkbox" ${t.ignored ? 'checked' : ''}> لا تحسبها في التقرير (مثل التحويل بين حساباتي)</label>
    ${t.raw ? `<details><summary class="sub">نص الرسالة الأصلية</summary><pre class="raw" dir="auto">${esc(t.raw)}</pre></details>` : ''}
    <div class="btns"><button class="btn" data-act="esave" data-id="${t.id}">حفظ</button><button class="btn sec" data-act="close">إلغاء</button><span style="flex:1"></span><button class="btn danger" data-act="edel" data-id="${t.id}">حذف</button></div>`);
}
function catSheet(id, forTxn) {
  const c = id ? cat(id) : null;
  const color = c ? c.color : COLORS[S.categories.length % COLORS.length];
  sheet(`<h2>${c ? 'تعديل البند' : 'بند جديد'}</h2>
    <label class="f">الاسم<input id="cName" type="text" value="${esc(c ? c.name : '')}" placeholder="مثال: صحة، فواتير، ترفيه"></label>
    <label class="f">التفاصيل (اختيارات داخل البند، افصل بينها بفاصلة)<input id="cSubs" type="text" value="${esc(c ? c.subs.join('، ') : '')}" placeholder="مثال: حلى، كوفي، بساكيت"></label>
    <label class="f">ميزانية شهرية (اختياري)<input id="cBud" type="number" inputmode="decimal" value="${c && +c.budget ? c.budget : ''}" placeholder="0"></label>
    <div class="f">اللون<div class="chips" id="cColors">${COLORS.map(x => `<button class="chip ${x === color ? 'on' : ''}" data-act="pickcolor" data-col="${x}" aria-label="لون"><i style="background:${x};width:16px;height:16px"></i></button>`).join('')}</div></div>
    <div class="btns"><button class="btn" data-act="csave" data-id="${id || ''}" data-t="${forTxn || ''}">حفظ</button><button class="btn sec" data-act="close">إلغاء</button><span style="flex:1"></span>
    ${c && S.categories.length > 1 ? `<button class="btn danger" data-act="cdel" data-id="${id}">حذف</button>` : ''}</div>`, sc => { sc.dataset.color = color; });
}
function srcSheet(id, forTxn) {
  const s = id ? src(id) : null;
  sheet(`<h2>${s ? 'تعديل المصدر' : 'مصدر دخل جديد'}</h2>
    <label class="f">الاسم<input id="sName" type="text" value="${esc(s ? s.name : '')}" placeholder="مثال: عمل حر، إيجار"></label>
    <div class="btns"><button class="btn" data-act="ssave" data-id="${id || ''}" data-t="${forTxn || ''}">حفظ</button><button class="btn sec" data-act="close">إلغاء</button><span style="flex:1"></span>
    ${s && S.sources.length > 1 ? `<button class="btn danger" data-act="sdel" data-id="${id}">حذف</button>` : ''}</div>`);
}
function fixedSheet(id) {
  const f = id ? S.fixed.find(x => x.id === id) : null;
  sheet(`<h2>${f ? 'تعديل مصروف ثابت' : 'مصروف ثابت جديد'}</h2>
    <label class="f">الاسم<input id="fName" type="text" value="${esc(f ? f.name : '')}" placeholder="مثال: الإيجار، اشتراك نتفلكس"></label>
    <div class="grid2"><label class="f">المبلغ (ر.س)<input id="fAmt" type="number" inputmode="decimal" step="0.01" value="${f ? f.amount : ''}"></label>
    <label class="f">يوم الدفع من الشهر<input id="fDay" type="number" inputmode="numeric" min="1" max="31" value="${f ? f.day : ''}" placeholder="1 – 31"></label></div>
    <label class="f">البند<select id="fCat"><option value="">— بدون —</option>${S.categories.map(c => `<option value="${c.id}" ${f && f.categoryId === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
    <label class="f">كلمة من اسم الجهة في رسالة البنك (اختياري)<input id="fMatch" type="text" dir="auto" value="${esc(f ? f.match || '' : '')}" placeholder="مثال: NETFLIX"></label>
    <div class="hint">تُعلَّم «مدفوعة» تلقائياً إذا وصلت رسالة فيها هذه الكلمة، أو مصروف بنفس البند وبمبلغ قريب في نفس الشهر.</div>
    <div class="btns"><button class="btn" data-act="fixedsave" data-id="${id || ''}">حفظ</button><button class="btn sec" data-act="close">إلغاء</button><span style="flex:1"></span>
    ${f ? `<button class="btn danger" data-act="fixeddel" data-id="${f.id}">حذف</button>` : ''}</div>`);
}
function pinSheet(mode) {
  const ttl = { on: 'تفعيل الرمز السري', change: 'تغيير الرمز السري', off: 'إيقاف القفل' }[mode];
  sheet(`<h2>${ttl}</h2>
    ${mode !== 'on' ? `<label class="f">الرمز الحالي<input id="pOld" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label>` : ''}
    ${mode !== 'off' ? `<div class="grid2"><label class="f">الرمز الجديد (٤ أرقام)<input id="pNew" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label>
      <label class="f">أعد كتابته<input id="pNew2" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label></div>
      <div class="hint">إذا نسيت الرمز لن تتمكن من فتح بياناتك، إلا بحذفها واستعادة نسخة احتياطية. احفظ نسخة احتياطية الآن.</div>` : ''}
    <div class="btns"><button class="btn" data-act="pinsave" data-m="${mode}">حفظ</button><button class="btn sec" data-act="close">إلغاء</button></div>`,
    sc => { const el = sc.querySelector('input'); if (el) el.focus(); });
}
function subOptions(c, sel) {
  if (!c || !c.subs.length) return '<option value="">لا يوجد</option>';
  return `<option value="">— بدون —</option>${c.subs.map(s => `<option ${s === sel ? 'selected' : ''}>${esc(s)}</option>`).join('')}`;
}
function balSheet(focusId) {
  sheet(`<h2>الرصيد الحالي</h2>
    <div class="hint">اكتب رصيد كل حساب الآن كما يظهر في تطبيق البنك. من هذه اللحظة يُخصم كل مصروف ويُضاف كل دخل تلقائياً.</div>
    ${S.accounts.map(a => `<label class="f">${esc(a.name)}<input id="bal-${a.id}" type="number" inputmode="decimal" step="0.01" value="${balanceOf(a) === null ? '' : (Math.round(balanceOf(a) * 100) / 100)}" placeholder="غير محدد"></label>`).join('')}
    <div class="btns"><button class="btn" data-act="balsave">حفظ</button><button class="btn sec" data-act="close">إلغاء</button></div>`,
    sc => { const el = focusId && sc.querySelector('#bal-' + focusId); if (el) el.focus(); });
}
function acctSheet() {
  sheet(`<h2>حساب جديد</h2>
    <label class="f">الاسم<input id="aName" type="text" placeholder="مثال: الأهلي، STC Pay"></label>
    <label class="f">الرصيد الحالي (اختياري)<input id="aBal" type="number" inputmode="decimal" step="0.01"></label>
    <div class="btns"><button class="btn" data-act="acctsave">حفظ</button><button class="btn sec" data-act="close">إلغاء</button></div>`);
}
function sndSheet(id) {
  const s = id ? S.senders.find(x => x.id === id) : null;
  sheet(`<h2>${s ? 'تعديل المرسل' : 'مرسل جديد'}</h2>
    <label class="f">الاسم الظاهر<input id="nName" type="text" value="${esc(s ? s.name : '')}" placeholder="مثال: الأهلي"></label>
    <label class="f">اسم المرسل في الرسائل<input id="nSender" type="text" dir="ltr" value="${esc(s ? s.sender : '')}" placeholder="SNB-AlAhli"></label>
    <label class="f">كلمات تميّز رسائله (مفصولة بفاصلة)<input id="nKeys" type="text" value="${esc(s ? s.keywords : '')}" placeholder="مثال: urpay"></label>
    <label class="f">آخر ٤ أرقام لبطاقاتك وحساباتك فيه<input id="nNums" type="text" inputmode="numeric" dir="ltr" value="${esc(s ? s.nums || '' : '')}" placeholder="1234,5678"></label>
    <div class="hint">يتعرّف التطبيق على البنك من هذه الأرقام. وعندما تغيّر حساب عملية يدوياً، يضيف رقم بطاقتها هنا تلقائياً.</div>
    <div class="btns"><button class="btn" data-act="nsave" data-id="${id || ''}">حفظ</button><button class="btn sec" data-act="close">إلغاء</button><span style="flex:1"></span>
    ${s ? `<button class="btn danger" data-act="ndel" data-id="${id}">حذف</button>` : ''}</div>`);
}

/* ---------- lock ---------- */
async function hashPin(pin) {
  const msg = 'masarifi:' + pin;
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
    return 's256:' + [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) { return 'fnv:' + Parser.hash(msg); }
}
let lockEntry = '', lockedAt = null, hiddenAt = null;
function showLock() {
  if (!S.pin || $('#lock')) return;
  lockEntry = '';
  const el = document.createElement('div'); el.id = 'lock'; el.className = 'lock'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'التطبيق مقفل');
  el.innerHTML = `<div class="lock-in"><h1>مصاريفي</h1><div class="sub" id="lockMsg">أدخل الرمز السري</div>
    <div class="pin-dots" id="pinDots">${'<i></i>'.repeat(4)}</div>
    <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-act="pinkey" data-k="${n}">${n}</button>`).join('')}
      <button data-act="pinforgot" class="kp-sm">نسيت؟</button><button data-act="pinkey" data-k="0">0</button><button data-act="pinkey" data-k="del" class="kp-sm" aria-label="حذف">⌫</button></div></div>`;
  document.body.appendChild(el);
}
async function pinKey(k) {
  if (k === 'del') lockEntry = lockEntry.slice(0, -1); else if (lockEntry.length < 4) lockEntry += k;
  document.querySelectorAll('#pinDots i').forEach((d, i) => d.classList.toggle('on', i < lockEntry.length));
  if (lockEntry.length === 4) {
    const ok = (await hashPin(lockEntry)) === S.pin;
    if (ok) { $('#lock').remove(); lockEntry = ''; }
    else { lockEntry = ''; $('#lockMsg').textContent = 'رمز غير صحيح، حاول مرة أخرى'; const d = $('#pinDots'); d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); setTimeout(() => document.querySelectorAll('#pinDots i').forEach(x => x.classList.remove('on')), 250); }
  }
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) hiddenAt = Date.now();
  else if (S.pin && hiddenAt && Date.now() - hiddenAt > 60000) { closeSheet(); showLock(); }
});
document.addEventListener('keydown', e => { if ($('#lock') && /^[0-9]$/.test(e.key)) pinKey(e.key); else if ($('#lock') && e.key === 'Backspace') pinKey('del'); });

/* ---------- actions ---------- */
function assignCategory(t, cid, sub = null) {
  t.categoryId = cid; t.sub = sub || null; t.ignored = false;
  delete ui.subPick[t.id];
  const k = Parser.merchantKey(t.merchant);
  if (k) S.rules[k] = { c: cid, s: t.sub };
  save(); render();
  toast(`صُنّفت كـ${cat(cid).name + (t.sub ? ' · ' + t.sub : '')}`);
}
function assignSource(t, sid) {
  t.sourceId = sid; t.ignored = false;
  const k = Parser.merchantKey(t.merchant);
  if (k) S.srcRules[k] = sid;
  save(); render(); toast(`سُجّل الدخل كـ${src(sid).name}`);
}
function leaveDemo() { if (S.demo) { S.txns = []; S.rules = {}; S.srcRules = {}; S.demo = false; S.accounts.forEach(a => { a.opening = null; a.asOf = null; }); } }
function addParsed(list) {
  if (list.some(p => p.ok)) leaveDemo();
  let n = 0;
  const have = new Set(S.txns.flatMap(t => [t.hash, t.hash2].filter(Boolean)));
  for (const p of list) {
    if (!p.ok || have.has(p.hash)) continue;
    const t = toTxn(p);
    if (!acct(t.bank)) { t.bank = (S.accounts.find(a => a.id !== 'cash') || S.accounts[0]).id; t.bankUnknown = true; }
    if (t.transferLike) {
      const tt = new Date(t.date).getTime();
      const done = S.txns.find(o => o.type === 'transfer' && !o.hash2 && Math.abs(o.sar - t.sar) < 0.01 && Math.abs(new Date(o.date).getTime() - tt) <= 30 * 60000
        && (t.type === 'income' ? o.to === t.bank : o.bank === t.bank));
      if (done) { done.hash2 = p.hash; have.add(p.hash); continue; }
    }
    if (t.type === 'atm') { if (!acct(t.to)) t.to = S.accounts[S.accounts.length - 1].id; }
    else if (t.transferLike) { /* ask first */ }
    /* categories and income sources are chosen by you; the card shows your previous choice */
    S.txns.push(t); have.add(p.hash); n++;
  }
  save();
  return { n };
}
function runParse(text) {
  const parts = Parser.split(text);
  const have = new Set(S.txns.flatMap(t => [t.hash, t.hash2].filter(Boolean)));
  const seen = new Set();
  ui.parsed = parts.map(m => {
    const p = Parser.parse(m, { senders: S.senders, bank: ui.bankSel || undefined });
    p.dup = have.has(p.hash) || seen.has(p.hash); seen.add(p.hash);
    return p;
  });
}
function csv() {
  const head = ['التاريخ', 'النوع', 'المبلغ (ر.س)', 'العملة الأصلية', 'المبلغ الأصلي', 'الجهة', 'نوع العملية', 'البند/المصدر', 'التفصيل', 'الحساب', 'إلى حساب', 'مستبعد', 'ملاحظة'];
  const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = S.txns.slice().sort(byDate).map(t => [new Date(t.date).toISOString().slice(0, 16).replace('T', ' '), t.type === 'income' ? 'دخل' : t.type === 'atm' ? 'سحب صراف' : t.type === 'transfer' ? 'تحويل بين حساباتك' : 'مصروف', t.sar.toFixed(2), t.currency, t.amount, t.merchant, t.kind,
    t.type === 'income' ? (src(t.sourceId) || {}).name : (cat(t.categoryId) || {}).name, t.sub || '', bankName(t.bank), t.to ? bankName(t.to) : '', t.ignored ? 'نعم' : '', t.note].map(q).join(','));
  return '﻿' + [head.map(q).join(','), ...rows].join('\n');
}
async function shareOrDownload(name, text, type) {
  const blob = new Blob([text], { type });
  try {
    const file = new File([blob], name, { type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: name }); return true; }
  } catch (e) { if (e && e.name === 'AbortError') return true; }
  try {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return true;
  } catch (e) { return false; }
}
async function copyText(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg); }
  catch (e) {
    sheet(`<h2>انسخ النص</h2><textarea id="copyBox" dir="ltr" readonly>${esc(text)}</textarea><button class="btn sec" data-act="close">تم</button>`, sc => { const t = sc.querySelector('#copyBox'); t.focus(); t.select(); });
  }
}
function restore(text) {
  try {
    const d = JSON.parse(text);
    if (!d || !Array.isArray(d.txns) || !Array.isArray(d.categories)) throw 0;
    S = migrate(Object.assign(defaults(), d)); S.demo = false; save(); ui.view = 'home'; render(); toast(`استُعيدت ${S.txns.length} عملية`);
  } catch (e) { toast('النص ليس نسخة احتياطية صالحة من مصاريفي'); }
}

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act, id = b.dataset.id, t = id ? S.txns.find(x => x.id === id) : null;
  switch (a) {
    case 'go': go(b.dataset.v); break;
    case 'pinkey': pinKey(b.dataset.k); break;
    case 'pinforgot': {
      const box = $('#lock .lock-in');
      if (b.dataset.sure) {
        S = defaults(); save(); $('#lock').remove(); go('settings'); toast('حُذفت البيانات. استعد نسختك الاحتياطية من هنا');
      } else {
        b.dataset.sure = '1';
        $('#lockMsg').textContent = 'لا يمكن استرجاع الرمز. اضغط «نسيت؟» مرة أخرى لحذف البيانات من هذا الجوال، ثم استعد نسختك الاحتياطية.';
      }
      break;
    }
    case 'pinform': pinSheet(b.dataset.m); break;
    case 'pinsave': {
      const m = b.dataset.m;
      if (m !== 'on') { const old = ($('#pOld').value || '').trim(); if ((await hashPin(old)) !== S.pin) { toast('الرمز الحالي غير صحيح'); break; } }
      if (m === 'off') { S.pin = null; save(); closeSheet(); render(); toast('أُوقف القفل'); break; }
      const a1 = $('#pNew').value.trim(), a2 = $('#pNew2').value.trim();
      if (!/^\d{4}$/.test(a1)) { toast('الرمز ٤ أرقام'); break; }
      if (a1 !== a2) { toast('الرمزان غير متطابقين'); break; }
      S.pin = await hashPin(a1); save(); closeSheet(); render(); toast('فُعّل الرمز السري'); break;
    }
    case 'fixedform': fixedSheet(id); break;
    case 'fixedsave': {
      const name = $('#fName').value.trim(), amount = parseFloat($('#fAmt').value), day = parseInt($('#fDay').value, 10);
      if (!name) { toast('اكتب الاسم'); break; }
      if (!(amount > 0)) { toast('اكتب المبلغ'); break; }
      if (!(day >= 1 && day <= 31)) { toast('يوم الدفع بين 1 و 31'); break; }
      const data = { name, amount, day, categoryId: $('#fCat').value || null, match: $('#fMatch').value.trim() };
      const f = b.dataset.id && S.fixed.find(x => x.id === b.dataset.id);
      if (f) Object.assign(f, data); else S.fixed.push({ id: 'f' + uid(), paid: {}, ...data });
      save(); closeSheet(); render(); toast('حُفظ المصروف الثابت'); break;
    }
    case 'fixeddel': {
      if (!b.dataset.sure) { b.dataset.sure = '1'; b.textContent = 'تأكيد الحذف'; break; }
      S.fixed = S.fixed.filter(x => x.id !== b.dataset.id); save(); closeSheet(); render(); break;
    }
    case 'fixedpaid': {
      const f = S.fixed.find(x => x.id === b.dataset.id); if (!f) break;
      f.paid = f.paid || {}; f.paid[mKey(new Date())] = true; save(); render(); toast(`عُلّمت «${f.name}» مدفوعة لهذا الشهر`); break;
    }
    case 'snoozebackup': S.backupSnooze = new Date().toISOString(); save(); render(); break;
    case 'close': closeSheet(); break;
    case 'clear-demo': S = defaults(); save(); render(); toast('ابدأ بلصق رسائل البنك'); break;
    case 'setcat': {
      if (!t) break;
      const c = cat(b.dataset.c);
      if (c && c.subs.length) { ui.subPick[t.id] = c.id; render(); } else assignCategory(t, b.dataset.c);
      break;
    }
    case 'setsub': if (t) assignCategory(t, b.dataset.c, b.dataset.s); break;
    case 'acceptsug': {
      if (!t) break;
      const c = cat(b.dataset.c); if (!c) break;
      if (b.dataset.s || b.dataset.prev || !c.subs.length) assignCategory(t, c.id, b.dataset.s || null);
      else { ui.subPick[t.id] = c.id; render(); }
      break;
    }
    case 'mktransfer': {
      if (!t) break;
      const o = b.dataset.o, cp = b.dataset.cp && S.txns.find(x => x.id === b.dataset.cp);
      const out = t.type === 'expense';
      t.type = 'transfer'; t.categoryId = null; t.sub = null; t.sourceId = null; t.bankUnknown = false;
      if (out) { t.to = o; } else { t.to = t.bank; t.bank = o; }
      if (cp) { t.hash2 = cp.hash; S.txns = S.txns.filter(x => x !== cp); }
      save(); render(); toast(`سُجّل تحويلاً: ${bankName(t.bank)} ← ${bankName(t.to)}`); break;
    }
    case 'nottransfer': {
      if (!t) break;
      t.notTransfer = true;
      save(); render(); break;
    }
    case 'unpick': delete ui.subPick[id]; render(); break;
    case 'togglebal': S.hideBal = !S.hideBal; save(); render(); break;
    case 'balform': balSheet(id); break;
    case 'balsave': {
      const now = new Date().toISOString();
      for (const ac of S.accounts) {
        const el = $('#bal-' + ac.id); if (!el) continue;
        const raw = el.value.trim();
        if (raw === '') { ac.opening = null; ac.asOf = null; continue; }
        const v = parseFloat(raw); if (isNaN(v)) continue;
        const cur = balanceOf(ac);
        if (cur === null || Math.abs(cur - v) > 0.004) { ac.opening = v; ac.asOf = now; }
      }
      if (S.demo) S.demo = false;
      save(); closeSheet(); render(); toast('حُفظ الرصيد'); break;
    }
    case 'acctform': acctSheet(); break;
    case 'acctsave': {
      const name = $('#aName').value.trim(); if (!name) { toast('اكتب اسم الحساب'); break; }
      const v = parseFloat($('#aBal').value);
      const cashIdx = S.accounts.findIndex(x => x.id === 'cash');
      S.accounts.splice(cashIdx < 0 ? S.accounts.length : cashIdx, 0, { id: 'a' + uid(), name, opening: isNaN(v) ? null : v, asOf: isNaN(v) ? null : new Date().toISOString() });
      save(); closeSheet(); render(); toast('أُضيف الحساب'); break;
    }
    case 'acctdel': {
      if (S.txns.some(x => x.bank === id || x.to === id)) { toast('لا يمكن حذف حساب عليه عمليات'); break; }
      if (!b.dataset.sure) { b.dataset.sure = '1'; b.textContent = 'تأكيد'; break; }
      S.accounts = S.accounts.filter(x => x.id !== id); save(); render(); break;
    }
    case 'setsrc': if (t) assignSource(t, b.dataset.s); break;
    case 'ignore': if (t) { t.ignored = true; save(); render(); toast('استُبعدت من التقرير'); } break;
    case 'newcat': catSheet(null, id); break;
    case 'newsrc': srcSheet(null, id); break;
    case 'addtab': ui.addTab = b.dataset.t; render(); break;
    case 'mtype': ui.manualType = b.dataset.t; ui.mAcct = null; render(); break;
    case 'paste': {
      try { const txt = await navigator.clipboard.readText(); if (txt) { ui.smsText = txt; render(); runParse(txt); render(); } }
      catch (err) { $('#smsBox').focus(); toast('الصق النص في المربع يدوياً'); }
      break;
    }
    case 'parse': {
      ui.smsText = $('#smsBox').value; ui.bankSel = $('#bankSel').value;
      if (!ui.smsText.trim()) { toast('الصق رسالة أولاً'); break; }
      runParse(ui.smsText); render(); break;
    }
    case 'savep': {
      const { n } = addParsed(ui.parsed);
      ui.parsed = []; ui.smsText = ''; save(); go('home');
      toast(`أُضيفت ${n} عملية`); break;
    }
    case 'savem': {
      const amt = parseFloat($('#mAmt').value);
      if (!(amt > 0)) { toast('اكتب مبلغاً أكبر من صفر'); $('#mAmt').focus(); break; }
      const d = $('#mDate').value ? new Date($('#mDate').value) : new Date();
      const mt = ui.manualType;
      const tx = toTxn({ type: mt === 'atm' ? 'expense' : mt, amount: amt, currency: 'SAR', sar: amt, merchant: mt === 'atm' ? '' : $('#mMer').value.trim(), kind: mt === 'atm' ? 'سحب نقدي' : mt === 'income' ? 'دخل يدوي' : 'مصروف يدوي', date: d.toISOString(), bank: $('#mAcct').value, raw: '', hash: 'm' + uid() });
      tx.note = $('#mNote').value.trim();
      if (mt === 'atm') { tx.to = $('#mTo').value; if (tx.to === tx.bank) { toast('اختر حسابين مختلفين'); break; } }
      else if (mt === 'expense') { tx.categoryId = $('#mCat').value; tx.sub = $('#mSub').value || null; }
      else tx.sourceId = $('#mCat').value;
      leaveDemo(); S.txns.push(tx); save(); go('home'); toast('حُفظت العملية'); break;
    }
    case 'filter': ui.filter = b.dataset.f; render(); break;
    case 'edit': editSheet(id); break;
    case 'esave': {
      if (!t) break;
      const v = parseFloat($('#eAmt').value); if (v > 0) { if (t.currency === 'SAR') t.amount = v; t.sar = v; t.estimated = false; }
      if ($('#eDate').value) t.date = new Date($('#eDate').value).toISOString();
      t.note = $('#eNote').value.trim();
      if ($('#eAcct').value !== t.bank) { t.bank = $('#eAcct').value; learnNums(t, t.bank); }
      t.bankUnknown = false;
      if (isMove(t)) { t.to = $('#eTo').value; t.bankUnknown = false; save(); closeSheet(); render(); toast('حُفظت التعديلات'); break; }
      t.merchant = $('#eMer').value.trim(); t.ignored = $('#eIgn').checked;
      const c = $('#eCat').value || null;
      if (t.type === 'expense') {
        const sub = ($('#eSub') && $('#eSub').value) || null;
        const ch = c && (c !== t.categoryId || sub !== t.sub);
        t.categoryId = c; t.sub = c && cat(c).subs.includes(sub) ? sub : null;
        if (ch) { const k = Parser.merchantKey(t.merchant); if (k) S.rules[k] = { c, s: t.sub }; }
      }
      else t.sourceId = c;
      save(); closeSheet(); render(); toast('حُفظت التعديلات'); break;
    }
    case 'edel': {
      if (b.dataset.sure) { S.txns = S.txns.filter(x => x.id !== id); save(); closeSheet(); render(); toast('حُذفت العملية'); }
      else { b.dataset.sure = '1'; b.textContent = 'اضغط مرة أخرى للحذف'; }
      break;
    }
    case 'month': ui.month = shiftM(ui.month, +b.dataset.n); render(); break;
    case 'export': { const ok = await shareOrDownload(`masarifi-${mKey(new Date())}.csv`, csv(), 'text/csv'); if (!ok) copyText(csv(), 'نُسخ ملف CSV'); break; }
    case 'catform': catSheet(id); break;
    case 'pickcolor': { const sc = $('#scrim'); sc.dataset.color = b.dataset.col; sc.querySelectorAll('#cColors .chip').forEach(x => x.classList.toggle('on', x === b)); break; }
    case 'csave': {
      const name = $('#cName').value.trim(); if (!name) { toast('اكتب اسم البند'); break; }
      const color = $('#scrim').dataset.color, budget = parseFloat($('#cBud').value) || 0;
      const subs = [...new Set($('#cSubs').value.split(/[,،]/).map(x => x.trim()).filter(Boolean))];
      let c = id ? cat(id) : null;
      if (c) { Object.assign(c, { name, color, budget, subs }); S.txns.forEach(x => { if (x.categoryId === c.id && x.sub && !subs.includes(x.sub)) x.sub = null; }); }
      else { c = { id: 'c' + uid(), name, color, budget, subs }; S.categories.splice(Math.max(S.categories.findIndex(x => x.id === 'other'), 0) || S.categories.length, 0, c); }
      save(); closeSheet();
      const tt = b.dataset.t && S.txns.find(x => x.id === b.dataset.t);
      if (tt) { if (c.subs.length) { ui.subPick[tt.id] = c.id; render(); } else assignCategory(tt, c.id); } else render();
      break;
    }
    case 'cdel': {
      if (!b.dataset.sure) { b.dataset.sure = '1'; b.textContent = 'تأكيد: عملياته تصبح غير مصنفة'; break; }
      S.categories = S.categories.filter(c => c.id !== id);
      S.txns.forEach(x => { if (x.categoryId === id) { x.categoryId = null; x.sub = null; } });
      for (const k in S.rules) { const r = ruleOf(k); if (r && r.c === id) delete S.rules[k]; }
      save(); closeSheet(); render(); break;
    }
    case 'srcform': srcSheet(id); break;
    case 'ssave': {
      const name = $('#sName').value.trim(); if (!name) { toast('اكتب اسم المصدر'); break; }
      let s = id ? src(id) : null;
      if (s) s.name = name; else { s = { id: 's' + uid(), name }; S.sources.push(s); }
      save(); closeSheet();
      const tt = b.dataset.t && S.txns.find(x => x.id === b.dataset.t);
      if (tt) assignSource(tt, s.id); else render();
      break;
    }
    case 'sdel': {
      if (!b.dataset.sure) { b.dataset.sure = '1'; b.textContent = 'تأكيد الحذف'; break; }
      S.sources = S.sources.filter(s => s.id !== id);
      S.txns.forEach(x => { if (x.sourceId === id) x.sourceId = null; });
      save(); closeSheet(); render(); break;
    }
    case 'sndform': sndSheet(id); break;
    case 'nsave': {
      const name = $('#nName').value.trim(), sender = $('#nSender').value.trim(), keywords = $('#nKeys').value.trim(), nums = $('#nNums').value.replace(/[^\d,،]/g, '').replace(/،/g, ',');
      if (!name) { toast('اكتب الاسم'); break; }
      const s = id ? S.senders.find(x => x.id === id) : null;
      if (s) { Object.assign(s, { name, sender, keywords, nums }); const ac = acct(s.id); if (ac) ac.name = name; }
      else {
        const nid = 'b' + uid(); S.senders.push({ id: nid, name, sender, keywords, nums });
        const ci = S.accounts.findIndex(x => x.id === 'cash');
        S.accounts.splice(ci < 0 ? S.accounts.length : ci, 0, { id: nid, name, opening: null, asOf: null });
      }
      save(); closeSheet(); render(); break;
    }
    case 'ndel': S.senders = S.senders.filter(x => x.id !== id); save(); closeSheet(); render(); break;
    case 'delrule': delete S.rules[b.dataset.k]; save(); render(); break;
    case 'backup': {
      const day = new Date().toISOString().slice(0, 10);
      const ok = await shareOrDownload(`masarifi-backup-${day}.json`, JSON.stringify(S), 'application/json');
      if (!ok) copyText(JSON.stringify(S), 'نُسخت النسخة الاحتياطية');
      S.lastBackup = new Date().toISOString(); save(); render(); break;
    }
    case 'copybackup': copyText(JSON.stringify(S), 'نُسخت النسخة الاحتياطية'); S.lastBackup = new Date().toISOString(); save(); break;
    case 'restore': {
      const f = $('#restoreFile').files[0];
      if (f) { const r = new FileReader(); r.onload = () => restore(r.result); r.readAsText(f); }
      else if ($('#restoreBox').value.trim()) restore($('#restoreBox').value);
      else toast('اختر ملفاً أو الصق النص');
      break;
    }
    case 'askwipe': ui.confirmWipe = true; render(); break;
    case 'nowipe': ui.confirmWipe = false; render(); break;
    case 'wipe': S = defaults(); save(); ui.confirmWipe = false; go('home'); toast('حُذفت كل البيانات'); break;
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'q') { ui.q = e.target.value; const pos = e.target.selectionStart; render(); const q = $('#q'); q.focus(); try { q.setSelectionRange(pos, pos); } catch (x) {} }
  if (e.target.id === 'smsBox') ui.smsText = e.target.value;
});
function learnNums(t, accId) {
  const snd = S.senders.find(x => x.id === accId);
  if (!snd || !t.raw) return;
  const { to, from } = Parser.numsIn(Parser.norm(t.raw));
  const own = t.type === 'income' ? to : from;
  if (!own.length) return;
  const cur = String(snd.nums || '').split(/[,،]/).map(x => x.trim()).filter(Boolean);
  for (const n of own.slice(0, 1)) if (!cur.includes(n)) cur.push(n);
  snd.nums = cur.join(',');
}
document.addEventListener('change', e => {
  if (e.target.classList.contains('tacct') && e.target.value) {
    const t = S.txns.find(x => x.id === e.target.dataset.id);
    if (t) { t.bank = e.target.value; t.bankUnknown = false; learnNums(t, t.bank); save(); render(); toast(`سُجّلت على ${bankName(t.bank)}`); }
    return;
  }
  if (e.target.id === 'homeFile' && e.target.files[0]) {
    const r = new FileReader();
    r.onload = () => {
      const list = Parser.split(String(r.result || '')).map(m => Parser.parse(m, { senders: S.senders }));
      const { n } = addParsed(list);
      render();
      toast(n ? `أُضيفت ${n} عملية، صنّفها من الرئيسية` : 'لا توجد عمليات جديدة في الملف');
    };
    r.onerror = () => toast('تعذّرت قراءة الملف');
    r.readAsText(e.target.files[0]);
    return;
  }
  if (e.target.id === 'smsFile' && e.target.files[0]) {
    const r = new FileReader();
    r.onload = () => { ui.smsText = String(r.result || ''); ui.bankSel = ($('#bankSel') || {}).value || ''; runParse(ui.smsText); render(); if (!ui.parsed.length) toast('الملف فارغ'); };
    r.readAsText(e.target.files[0]);
  }
  if (e.target.id === 'mCat' && ui.manualType === 'expense') { ui.mCat = e.target.value; const el = $('#mSub'); const c = cat(e.target.value); el.innerHTML = subOptions(c, null); el.disabled = !(c && c.subs.length); }
  if (e.target.id === 'mAcct') ui.mAcct = e.target.value;
  if (e.target.id === 'eCat' && $('#eSub')) { const c = cat(e.target.value); $('#eSub').innerHTML = subOptions(c, null); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

/* رسالة قادمة عبر الرابط ?sms=... (من اختصار الآيفون) */
try {
  const p = new URLSearchParams(location.search);
  const sms = p.get('sms');
  if (sms) {
    const { n } = addParsed(Parser.split(sms).map(m => Parser.parse(m, { senders: S.senders })));
    history.replaceState(null, '', location.pathname);
    setTimeout(() => toast(n ? `أُضيفت ${n} عملية من الرسالة` : 'الرسالة مسجلة سابقاً'), 300);
  }
} catch (e) {}

render();
showLock();
})();
