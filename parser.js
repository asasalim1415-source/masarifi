/* محلل رسائل البنوك — يعمل على الجهاز فقط */
const Parser = (() => {
  const AR = '٠١٢٣٤٥٦٧٨٩', FA = '۰۱۲۳۴۵۶۷۸۹';
  function normV1(s) {
    return String(s || '')
      .replace(/[٠-٩]/g, d => AR.indexOf(d))
      .replace(/[۰-۹]/g, d => FA.indexOf(d))
      .replace(/٫/g, '.').replace(/٬/g, ',')
      .replace(/\r/g, '')
      .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
      .replace(/：/g, ':');
  }
  function norm(s) {
    return normV1(s).replace(/[\u061c\u00a0\u2007\u202f]/g, m => m === '\u061c' ? '' : ' ');
  }
  const CUR = '(SAR|SR|USD|EUR|GBP|AED|KWD|BHD|QAR|OMR|EGP|TRY|\\$|ر\\.?\\s?س\\.?|ريال(?:\\s*سعودي)?|رس|دولار)';
  const NUM = '(\\d{1,3}(?:,\\d{3})+(?:\\.\\d{1,2})?|\\d+(?:\\.\\d{1,2})?)';
  const LABEL = '(?:مبلغ|المبلغ|بمبلغ|بقيمة|قيمة|amount|amt|ايداع|إيداع|خصم|الاجمالي|الإجمالي|total|(?<=^|[\\s:])بـ?(?=\\s*:?\\s*(?:SAR|SR|USD|EUR|GBP|AED|QAR|TRY|رس|ر\\.?\\s?س|\\d)))';
  const reLabeled = new RegExp(LABEL + '\\s*:?\\s*(?:' + CUR + '\\s*)?' + NUM + '(?:\\s*' + CUR + ')?', 'i');
  const reCurFirst = new RegExp(CUR + '\\s*' + NUM, 'i');
  const reCurLast = new RegExp(NUM + '\\s*' + CUR, 'i');
  const reBalLine = /(رصيد|الرصيد|balance|bal\b|رسوم|fee|fees|الحد|limit|متاح|الضريبة)/i;
  const reFeeLine = /(رسوم|fee|fees|الضريبة)/i;

  function curCode(c) {
    if (!c) return 'SAR';
    const u = c.toUpperCase().replace(/\s/g, '');
    if (/^(SAR|SR)$/.test(u) || /ر\.?س|ريال|رس/.test(c)) return 'SAR';
    if (u === '$' || /دولار/.test(c)) return 'USD';
    return u;
  }
  const num = s => parseFloat(String(s).replace(/,/g, ''));

  function findAmount(text) {
    const lines = text.split('\n');
    const good = lines.filter(l => !reBalLine.test(l));
    const tries = [good.join('\n'), text];
    for (const t of tries) {
      let m = t.match(reLabeled);
      if (m) return { amount: num(m[2]), currency: curCode(m[1] || m[3]) };
      m = t.match(reCurFirst);
      if (m) return { amount: num(m[2]), currency: curCode(m[1]) };
      m = t.match(reCurLast);
      if (m) return { amount: num(m[1]), currency: curCode(m[2]) };
      if (t === tries[0]) continue;
    }
    return null;
  }
  function findSarAlt(text) {
    const re = new RegExp('(?:SAR|SR|ر\\.?\\s?س\\.?|ريال)\\s*' + NUM + '|' + NUM + '\\s*(?:SAR|SR|ر\\.?\\s?س\\.?|ريال)', 'gi');
    const lines = text.split('\n').filter(l => !reBalLine.test(l)).join('\n');
    const m = re.exec(lines);
    return m ? num(m[1] || m[2]) : null;
  }

  const SKIP_OTP = /(رمز\s*(?:التحقق|التفعيل|الدخول|السري|المرور)|كلمة\s*(?:المرور|السر)|\bOTP\b|one[-\s]?time|verification\s*code|لا\s*تشارك)/i;
  const SKIP_DECLINED = /(مرفوض|رفض|declined|غير\s*ناجح|لم\s*تتم|فشل|failed|insufficient|غير\s*كاف)/i;
  const INCOME = /(وارد|واردة|إيداع|ايداع|راتب|مكافأة|مكافاة|مكافئة|استرداد|مسترد|إرجاع|ارجاع|إضافة|اضافة|أضيف|اضيف|أضفنا|استلام|استلمت|شحن|credit(?:ed)?|incoming|deposit|salary|bonus|refund|received|added|top\s*-?up)/i;
  const EXPENSE = /(شراء|سحب|صادرة|صادر|سداد|خصم|دفع|مدفوع|اشتراك|purchase|withdraw|outgoing|payment|debit|paid|\bpos\b|spent)/i;

  function kindOf(text, type) {
    if (type === 'income') {
      if (/راتب|salary/i.test(text)) return 'راتب';
      if (/مكاف[أائ]ة|bonus/i.test(text)) return 'مكافأة';
      if (/إضافة\s*الأموال|اضافة\s*الاموال|money\s*added|added\s*to|شحن|top\s*-?up/i.test(text)) return 'إضافة رصيد';
      if (/بين\s*حساباتك/i.test(text)) return 'حوالة بين حساباتك';
      if (/استرداد|مسترد|إرجاع|ارجاع|refund/i.test(text)) return 'استرداد';
      if (/حوال|تحويل|transfer/i.test(text)) return 'حوالة واردة';
      if (/إيداع|ايداع|deposit/i.test(text)) return 'إيداع';
      return 'إضافة رصيد';
    }
    if (/انترنت|إنترنت|online|internet|ecom/i.test(text)) return 'شراء إنترنت';
    if (/سحب|withdraw|atm|صراف/i.test(text)) return 'سحب نقدي';
    if (/سداد|فاتور|مفوتر|bill|sadad/i.test(text)) return 'سداد فاتورة';
    if (/بين\s*حساباتك/i.test(text)) return 'حوالة بين حساباتك';
    if (/حوال|تحويل|transfer/i.test(text)) return 'حوالة صادرة';
    if (/دولي|international/i.test(text)) return 'شراء دولي';
    if (/اشتراك|subscription/i.test(text)) return 'اشتراك';
    if (/شراء|purchase|pos|نقاط\s*البيع/i.test(text)) return 'شراء';
    return 'خصم';
  }

  const BAD_VAL = /^[\d\s*xX#.\-;]+$|^[\d\s*xX#.\-;]*(مدى|فيزا|ماستر|visa|mada|master|apple\s*pay|ابل\s*باي)|^(SAR|SR|USD|TRY|QAR|EUR)$|ريال/i;
  function findMerchant(text, type, kind) {
    const fields = [];
    const lines = text.split('\n');
    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      let m = line.match(/^\s*(لدى|عند|من\s*عند|متجر|التاجر|مفوتر|المفوتر|الجهة|إلى|الى|لـ|من|المستفيد|المرسل|اسم\s*المستفيد)\s*:?\s*(.+?)\s*$/i)
        || line.match(/^\s*(at|merchant|biller|to|from|beneficiary|sender)(?:\s*:\s*|\s+)(.+?)\s*$/i);
      if (m) {
        let v = m[2].replace(/^[\d*xX#\s]+;\s*/, '').replace(/\.{2,}\s*$/, '').replace(/\*+$/, '').trim();
        const nx = (lines[li + 1] || '').trim();
        if (BAD_VAL.test(v) && nx && !nx.includes(':') && /[A-Za-z\u0621-\u064a]{3}/.test(nx) && !/^(في|عبر|مبلغ|رصيد)/.test(nx)) v = nx;
        fields.push({ k: m[1].toLowerCase().replace(/\s+/g, ''), v });
      }
    }
    const pick = keys => {
      for (const f of fields) if (keys.includes(f.k) && !BAD_VAL.test(f.v)) return f.v;
      return null;
    };
    let v = null;
    if (kind === 'سداد فاتورة') v = pick(['مفوتر', 'المفوتر', 'biller', 'الجهة']);
    if (!v && type === 'income') v = pick(['من', 'from', 'المرسل', 'sender']);
    if (!v && /حوالة/.test(kind)) v = pick(['لـ', 'إلى', 'الى', 'to', 'المستفيد', 'beneficiary', 'اسمالمستفيد']);
    if (!v) v = pick(['لدى', 'عند', 'منعند', 'متجر', 'التاجر', 'at', 'merchant', 'لـ']);
    if (!v) {
      const m = text.match(/(?:لدى|عند|\bat|من\s*متجر|في\s*متجر|للتاجر)\s*:?\s*([^\n،,:]+?)(?=\s+(?:بتاريخ|بمبلغ|on|الساعة|رصيد|في\s+\d|الرصيد)|[\n،,]|\s*$)/i);
      if (m && !BAD_VAL.test(m[1])) v = m[1];
    }
    if (!v) v = pick(['من', 'from', 'إلى', 'الى', 'to', 'مفوتر', 'biller']);
    return v ? v.replace(/\s+/g, ' ').trim().slice(0, 60) : '';
  }

  function findDate(text, now) {
    const m = text.match(/(\d{1,4})[-\/](\d{1,2})[-\/](\d{1,4})(?:[^\d\n]{0,8}(\d{1,2}):(\d{2}))?/);
    if (!m) {
      const md = text.match(/(?:^|[\s:])(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})/);
      if (!md) return null;
      const mo = +md[1], d = +md[2];
      if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
      let dt = new Date(now.getFullYear(), mo - 1, d, +md[3], +md[4]);
      if (dt.getTime() > now.getTime() + 2 * 864e5) dt = new Date(now.getFullYear() - 1, mo - 1, d, +md[3], +md[4]);
      return dt;
    }
    const [a, b, c] = [m[1], m[2], m[3]];
    const hh = m[4] ? +m[4] : 12, mm = m[5] ? +m[5] : 0;
    const y4 = y => (y.length <= 2 ? 2000 + +y : +y);
    const cands = [];
    const mk = (y, mo, d) => {
      if (mo < 1 || mo > 12 || d < 1 || d > 31) return;
      const dt = new Date(y, mo - 1, d, hh, mm);
      if (dt.getMonth() !== mo - 1) return;
      cands.push(dt);
    };
    if (a.length === 4) mk(+a, +b, +c);
    else if (c.length === 4) mk(+c, +b, +a);
    else { mk(y4(a), +b, +c); mk(y4(c), +b, +a); }
    const limit = now.getTime() + 2 * 864e5;
    const ok = cands.filter(d => d.getTime() <= limit && d.getFullYear() > 2000);
    if (!ok.length) return null;
    ok.sort((x, y) => Math.abs(now - x) - Math.abs(now - y));
    return ok[0];
  }

  function hash(s) {
    const t = normV1(s).replace(/\s+/g, ' ').trim();
    let h = 2166136261;
    for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36) + t.length.toString(36);
  }

  function merchantKey(m) {
    return String(m || '').toUpperCase()
      .replace(/[\d#*_.\-\/]+/g, ' ').replace(/\s+/g, ' ').trim()
      .split(' ').slice(0, 2).join(' ');
  }

  const listOf = v => (Array.isArray(v) ? v : String(v || '').split(/[,،]/)).map(k => String(k).trim().toLowerCase()).filter(Boolean);
  function numsIn(text) {
    const to = [], from = [];
    for (const line of text.split('\n')) {
      const isTo = /^\s*(?:إلى|الى|لـ|to\b)/i.test(line);
      const re = /(?:^|[^\d])(\d{4})(?!\d)/g; let m;
      if (!/(?:بطاقة|card|عبر|by|من|from|إلى|الى|لـ|to\b|a\/c|حساب|account|[*xX]{2,})/i.test(line)) continue;
      while ((m = re.exec(line))) (isTo ? to : from).push(m[1]);
    }
    return { to, from };
  }
  function detectBank(text, senders, fallback, type) {
    const t = text.toLowerCase();
    for (const s of senders || []) if (listOf(s.keywords).some(k => t.includes(k))) return s.id;
    const { to, from } = numsIn(text);
    const order = type === 'income' ? [...to, ...from] : [...from, ...to];
    for (const n of order) for (const s of senders || []) if (listOf(s.nums).includes(n)) return s.id;
    return fallback || '';
  }

  function parse(raw, opts = {}) {
    const now = opts.now || new Date();
    const text = norm(raw).trim();
    const res = { raw: String(raw).trim(), hash: hash(raw) };
    if (!text) return { ...res, ok: false, reason: 'فارغة' };
    if (SKIP_OTP.test(text)) return { ...res, ok: false, reason: 'رمز تحقق' };
    if (SKIP_DECLINED.test(text)) return { ...res, ok: false, reason: 'عملية مرفوضة' };
    const amt = findAmount(text);
    if (!amt || !(amt.amount > 0)) return { ...res, ok: false, reason: 'لم أجد مبلغاً' };
    const type = /استرداد|مسترد|إرجاع|ارجاع|refund/i.test(text) ? 'income'
      : /شراء|purchase|سحب|withdraw|سداد|صادر|outgoing|خصم|debit|اشتراك|spent/i.test(text) ? 'expense'
      : INCOME.test(text) ? 'income' : 'expense';
    const kind = kindOf(text, type);
    let sar = amt.amount;
    let estimated = false;
    let fee = 0;
    if (amt.currency !== 'SAR') {
      const alt = findSarAlt(text);
      if (alt) sar = alt;
      else { sar = +(amt.amount * (RATES[amt.currency] || 1)).toFixed(2); estimated = true; }
    }
    for (const line of text.split('\n')) if (reFeeLine.test(line)) {
      const fm = line.match(new RegExp('(?:SAR|SR|ر\\.?\\s?س|رس)\\s*' + NUM + '|' + NUM + '\\s*(?:SAR|SR|ر\\.?\\s?س|رس)', 'i'));
      if (fm) fee += num(fm[1] || fm[2]);
    }
    if (fee > 0 && type === 'expense') sar = +(sar + fee).toFixed(2);
    const cardM = text.match(/(?:بطاقة|البطاقة|card|by|من|حساب|الحساب|account|acc|الى|إلى|to)\s*:?\s*[*xX#.]*\s*(\d{4})\b/i) || text.match(/[*xX]{2,}\s*(\d{3,4})/);
    const balRe = new RegExp('(?:الرصيد(?:\\s*المتاح)?|رصيد|balance|bal)\\s*:?\\s*(?:' + CUR + '\\s*)?' + NUM, 'i');
    const balM = text.match(balRe);
    const date = findDate(text, now) || now;
    return {
      ...res, ok: true, type, kind,
      amount: amt.amount, currency: amt.currency, sar, estimated,
      merchant: findMerchant(text, type, kind),
      card: cardM ? cardM[1] : '',
      balance: balM ? num(balM[2]) : null,
      date: date.toISOString(),
      fee,
      bank: opts.bank || detectBank(text, opts.senders, '', type),
      transferLike: /حوال|تحويل|transfer|إضافة\s*الأموال|اضافة\s*الاموال|money\s*added|شحن|top\s*-?up|بين\s*حساباتك/i.test(text)
    };
  }

  function split(text) {
    return norm(text)
      .split(/\n\s*(?:-{3,}|_{3,}|={3,}|\*{3,}|•{3,})\s*\n|\n\s*\n+/)
      .map(s => s.replace(/^\s*(?:-{3,}|_{3,}|={3,})\s*$/gm, '').trim())
      .filter(s => s.length > 4);
  }

  const RATES = { USD: 3.75, EUR: 4.05, GBP: 4.75, AED: 1.02, KWD: 12.2, BHD: 9.95, QAR: 1.03, OMR: 9.74, EGP: 0.077, TRY: 0.11 };
  return { parse, split, merchantKey, hash, norm, numsIn, RATES };
})();
if (typeof module !== 'undefined') module.exports = Parser;
