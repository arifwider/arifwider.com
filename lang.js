// Language switch. Loaded in <head> so the language is set before first paint.
// Blocks marked data-l="en" / data-l="de" are shown or hidden by CSS based on <html lang>.
//
// Without JavaScript the switch still works: its links point to #en / #de and
// styles.css shows the matching language (see "No-JavaScript fallback" there).
(function () {
  var root = document.documentElement;
  root.classList.add('js'); // turns the CSS-only fallback off

  function saved() {
    try { return localStorage.getItem('lang'); } catch (e) { return null; }
  }

  function save(lang) {
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  function apply(lang) {
    root.lang = lang;
    var title = root.getAttribute('data-title-' + lang);
    if (title) document.title = title;
    var links = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('data-set-lang') === lang) {
        links[i].setAttribute('aria-current', 'true');
      } else {
        links[i].removeAttribute('aria-current');
      }
    }
  }

  // A link ending in #de or #en names the language explicitly and wins over the saved choice.
  // The hash is removed again so the address stays clean.
  function takeHash() {
    var lang = location.hash === '#de' ? 'de' : location.hash === '#en' ? 'en' : null;
    if (lang) {
      save(lang);
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    }
    return lang;
  }

  var fromHash = takeHash();

  // Same-page links such as index.html#de do not reload the page, so listen for them too.
  window.addEventListener('hashchange', function () {
    var lang = takeHash();
    if (lang) apply(lang);
  });

  var browserIsGerman = (navigator.language || '').toLowerCase().indexOf('de') === 0;
  var initial = fromHash || saved() || (browserIsGerman ? 'de' : 'en');
  root.lang = initial;

  document.addEventListener('DOMContentLoaded', function () {
    apply(initial);

    document.addEventListener('click', function (event) {
      var link = event.target.closest('[data-set-lang]');
      if (!link) return;
      event.preventDefault();
      var lang = link.getAttribute('data-set-lang');
      apply(lang);
      save(lang);
    });

    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  });
})();
