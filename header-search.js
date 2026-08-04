(function () {
  var routeHints = [
    { keywords: ['home', 'index', 'book', 'booking', 'ride'], href: '/index.html#book-now' },
    { keywords: ['services', 'service', 'fleet', 'dispatch'], href: '/services.html' },
    { keywords: ['ai', 'podcast', 'studio', 'campaign'], href: '/ai-studio.html' },
    { keywords: ['payment', 'payments', 'pay', 'card', 'bank'], href: '/payments.html' },
    { keywords: ['admin', 'login', 'board'], href: '/admin-login.html' },
    { keywords: ['contact', 'phone', 'call', 'text', 'email'], href: '/contact.html' }
  ];

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function findRouteByHint(query) {
    for (var i = 0; i < routeHints.length; i += 1) {
      var hint = routeHints[i];
      for (var j = 0; j < hint.keywords.length; j += 1) {
        if (query.indexOf(hint.keywords[j]) !== -1) {
          return hint.href;
        }
      }
    }
    return '';
  }

  function findRouteByNav(query) {
    var links = document.querySelectorAll('.site-nav-links a');
    for (var i = 0; i < links.length; i += 1) {
      var text = normalize(links[i].textContent);
      if (text && text.indexOf(query) !== -1) {
        return links[i].getAttribute('href') || '';
      }
    }
    return '';
  }

  function clearFlash() {
    var prior = document.querySelector('.search-hit');
    if (prior) {
      prior.classList.remove('search-hit');
    }
  }

  function highlightOnPage(query) {
    if (!query) {
      return false;
    }

    var areas = document.querySelectorAll('main h1, main h2, main h3, main p, main li');
    for (var i = 0; i < areas.length; i += 1) {
      var text = normalize(areas[i].textContent);
      if (text.indexOf(query) !== -1) {
        clearFlash();
        areas[i].classList.add('search-hit');
        areas[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.setTimeout(clearFlash, 2200);
        return true;
      }
    }

    return false;
  }

  var forms = document.querySelectorAll('[data-header-search]');
  for (var f = 0; f < forms.length; f += 1) {
    (function (form) {
      var input = form.querySelector('input[type="search"]');
      if (!input) {
        return;
      }

      form.addEventListener('submit', function (event) {
        event.preventDefault();

        var query = normalize(input.value);
        if (!query) {
          return;
        }

        var target = findRouteByNav(query) || findRouteByHint(query);
        if (target) {
          window.location.assign(target);
          return;
        }

        var foundOnPage = highlightOnPage(query);
        if (!foundOnPage) {
          input.setCustomValidity('No matching page or section found.');
          input.reportValidity();
          window.setTimeout(function () {
            input.setCustomValidity('');
          }, 900);
        }
      });

      input.addEventListener('input', function () {
        input.setCustomValidity('');
      });
    })(forms[f]);
  }
})();
