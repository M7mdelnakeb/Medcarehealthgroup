// اللغة (عربي افتراضي) + القائمة على الموبايل + الظهور التدريجي
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('langBtn');
  var titles = {
    ar: document.title,
    en: root.getAttribute('data-title-en') || document.title
  };

  function setLang(lang) {
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });
    document.querySelectorAll('[data-ar-ph]').forEach(function (el) {
      el.placeholder = el.getAttribute('data-' + lang + '-ph');
    });
    document.title = titles[lang];
    if (btn) { btn.textContent = lang === 'ar' ? 'English' : 'العربية'; btn.lang = lang === 'ar' ? 'en' : 'ar'; }
    var f = document.getElementById('formLang'); if (f) f.value = lang;
    document.querySelectorAll('a[href^="/privacy"], a[href^="/"][data-keep-lang]').forEach(function (a) {
      var base = a.getAttribute('href').split('?')[0];
      a.setAttribute('href', lang === 'en' ? base + '?lang=en' : base);
    });
    try { localStorage.setItem('mch-lang', lang); } catch (e) {}
  }

  var start = 'ar';
  var q = new URLSearchParams(location.search).get('lang');
  if (q === 'en' || q === 'ar') start = q;
  else { try { start = localStorage.getItem('mch-lang') || 'ar'; } catch (e) {} }
  if (start === 'en') setLang('en');
  if (btn) btn.addEventListener('click', function () { setLang(root.lang === 'ar' ? 'en' : 'ar'); });

  // القائمة على الموبايل
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  // ظل الشريط العلوي
  var bar = document.querySelector('.topbar');
  function onScroll() { if (bar) bar.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // أزرار التوظيف بتختار نوع الطلب في النموذج
  document.querySelectorAll('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = document.querySelector('select[name="service"]');
      if (sel) sel.value = a.getAttribute('data-pick');
    });
  });

  // الظهور التدريجي
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
