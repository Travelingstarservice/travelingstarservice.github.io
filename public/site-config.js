(function () {
  var STORAGE_KEY = 'tss.site.config.v1';
  var API_BASE_KEY = 'tss.api.base.v1';

  var DEFAULT_CONFIG = {
    brandName: 'Traveling Star Service',
    showBanner: true,
    bannerImage: '/traveling-star-flag.jpeg',
    services: [
      {
        name: 'Airport transfers',
        description: 'Efficient pickup and drop-off for early departures, late arrivals, and everything in between.'
      },
      {
        name: 'Local rides',
        description: 'Quick trips across town for errands, appointments, and essential travel.'
      },
      {
        name: 'Events and gatherings',
        description: 'Arrive together and leave on your own timeline with flexible service plans.'
      },
      {
        name: 'Custom routes',
        description: 'Need something specific? Send the route details and we\'ll work around your schedule.'
      }
    ],
    fleet: [
      {
        name: 'Local Ride Team',
        description: 'Daily city and county pickup/drop-off service coverage.'
      },
      {
        name: 'Airport Transfer Team',
        description: 'Dedicated airport schedule and long-distance trip windows.'
      }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeApiBase(value) {
    var raw = String(value || '').trim();
    if (!raw) return '';

    if (/^https?:\/\//i.test(raw)) {
      return raw.replace(/\/$/, '').replace(/\/api$/i, '') + '/api';
    }

    if (raw[0] !== '/') {
      raw = '/' + raw;
    }

    raw = raw.replace(/\/$/, '').replace(/\/api$/i, '');
    return raw + '/api';
  }

  function getApiBase() {
    try {
      var queryValue = new URLSearchParams(window.location.search).get('apiBase');
      if (queryValue) {
        var normalizedFromQuery = normalizeApiBase(queryValue);
        if (normalizedFromQuery) {
          localStorage.setItem(API_BASE_KEY, normalizedFromQuery);
          return normalizedFromQuery;
        }
      }

      var saved = localStorage.getItem(API_BASE_KEY);
      if (saved) {
        return normalizeApiBase(saved);
      }
    } catch (err) {
      // ignore storage/query parse errors and fall back to relative API path
    }

    return '/api';
  }

  function setApiBase(value) {
    var normalized = normalizeApiBase(value);
    if (!normalized) {
      localStorage.removeItem(API_BASE_KEY);
      return '';
    }
    localStorage.setItem(API_BASE_KEY, normalized);
    return normalized;
  }

  function buildApiUrl(path) {
    var suffix = String(path || '').trim();
    if (suffix[0] !== '/') {
      suffix = '/' + suffix;
    }
    return getApiBase() + suffix;
  }

  function normalizeItems(items, fallback) {
    if (!Array.isArray(items)) {
      return clone(fallback);
    }

    var normalized = items
      .map(function (item) {
        var name = String((item && item.name) || '').trim();
        var description = String((item && item.description) || '').trim();
        if (!name || !description) {
          return null;
        }
        return { name: name, description: description };
      })
      .filter(Boolean);

    return normalized.length ? normalized : clone(fallback);
  }

  function normalizeConfig(raw) {
    var base = clone(DEFAULT_CONFIG);
    if (!raw || typeof raw !== 'object') {
      return base;
    }

    base.brandName = String(raw.brandName || base.brandName).trim() || base.brandName;
    base.showBanner = raw.showBanner !== false;
    base.bannerImage = String(raw.bannerImage || base.bannerImage).trim() || base.bannerImage;
    base.services = normalizeItems(raw.services, DEFAULT_CONFIG.services);
    base.fleet = normalizeItems(raw.fleet, DEFAULT_CONFIG.fleet);
    return base;
  }

  function loadConfig() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return clone(DEFAULT_CONFIG);
      }
      return normalizeConfig(JSON.parse(raw));
    } catch (err) {
      return clone(DEFAULT_CONFIG);
    }
  }

  function saveConfig(config) {
    var normalized = normalizeConfig(config);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  }

  async function fetchRemoteConfig() {
    var response = await fetch(buildApiUrl('/settings/site-config'), {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch remote config: HTTP ' + response.status);
    }

    var payload = await response.json();
    var config = normalizeConfig(payload && payload.config);
    saveConfig(config);
    return config;
  }

  async function saveRemoteConfig(config, token) {
    if (!token) {
      throw new Error('Missing admin token');
    }

    var normalized = normalizeConfig(config);
    var response = await fetch(buildApiUrl('/settings/site-config'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ config: normalized })
    });

    if (!response.ok) {
      throw new Error('Failed to save remote config: HTTP ' + response.status);
    }

    var payload = await response.json();
    var serverConfig = normalizeConfig(payload && payload.config);
    saveConfig(serverConfig);
    return serverConfig;
  }

  function applyGlobal(config) {
    var brandNodes = document.querySelectorAll('.brand span');
    brandNodes.forEach(function (node) {
      node.textContent = config.brandName;
    });

    var banner = document.querySelector('.flag-banner');
    var bannerImage = document.querySelector('.flag-banner img');
    if (banner) {
      banner.style.display = config.showBanner ? '' : 'none';
    }
    if (bannerImage && config.bannerImage) {
      bannerImage.src = config.bannerImage;
      bannerImage.alt = config.brandName + ' flag';
    }
  }

  function serviceActionLabel(name) {
    var lower = String(name || '').toLowerCase();
    if (lower.indexOf('airport') >= 0) return 'airport ride';
    if (lower.indexOf('local') >= 0) return 'local ride';
    if (lower.indexOf('event') >= 0) return 'event service';
    if (lower.indexOf('custom') >= 0) return 'custom route';
    return 'service';
  }

  function renderHomeServices(config) {
    var grid = document.querySelector('[data-config-services-home]');
    if (!grid) return;

    var html = config.services
      .map(function (service) {
        var label = serviceActionLabel(service.name);
        var encoded = encodeURIComponent('I need ' + service.name + '. Pickup:  Drop-off:  Date/time: ');
        return '' +
          '<article class="service-card">' +
          '  <h3>' + service.name + '</h3>' +
          '  <p>' + service.description + '</p>' +
          '  <div class="service-actions">' +
          '    <a class="button button-call button-small" href="tel:+12528865996">Call for ' + label + '</a>' +
          '    <a class="button button-text button-small" href="sms:+12528865996?body=' + encoded + '">Text for ' + label + '</a>' +
          '  </div>' +
          '</article>';
      })
      .join('');

    grid.innerHTML = html;

    var serviceSelect = document.querySelector('#booking-form select[name="service"]');
    if (serviceSelect) {
      var options = ['<option value="" selected disabled>Select a service</option>']
        .concat(config.services.map(function (service) {
          return '<option>' + service.name + '</option>';
        }))
        .join('');
      serviceSelect.innerHTML = options;
    }
  }

  function renderCatalogServices(config) {
    var grid = document.querySelector('[data-config-services-catalog]');
    if (!grid) return;

    var html = config.services
      .map(function (service) {
        var label = serviceActionLabel(service.name);
        var encoded = encodeURIComponent('I need ' + service.name + '. Pickup:  Drop-off:  Date/time: ');
        return '' +
          '<article class="panel stack">' +
          '  <h2>' + service.name + '</h2>' +
          '  <p>' + service.description + '</p>' +
          '  <div class="stack">' +
          '    <a class="button button-call" href="tel:+12528865996">Call for ' + label + '</a>' +
          '    <a class="button button-text" href="sms:+12528865996?body=' + encoded + '">Text ' + label + ' details</a>' +
          '  </div>' +
          '</article>';
      })
      .join('');

    grid.innerHTML = html;
  }

  function renderFleet(config) {
    var fleetNodes = document.querySelectorAll('[data-config-fleet]');
    if (!fleetNodes.length) return;

    var html = config.fleet
      .map(function (item) {
        return '' +
          '<article class="panel stack">' +
          '  <h3>' + item.name + '</h3>' +
          '  <p>' + item.description + '</p>' +
          '</article>';
      })
      .join('');

    fleetNodes.forEach(function (node) {
      node.innerHTML = html;
    });
  }

  function applyConfig(config) {
    applyGlobal(config);
    renderHomeServices(config);
    renderCatalogServices(config);
    renderFleet(config);
  }

  window.TSSSiteConfig = {
    defaults: clone(DEFAULT_CONFIG),
    load: loadConfig,
    save: saveConfig,
    fetchRemote: fetchRemoteConfig,
    saveRemote: saveRemoteConfig,
    getApiBase: getApiBase,
    setApiBase: setApiBase,
    buildApiUrl: buildApiUrl,
    apply: applyConfig,
    normalize: normalizeConfig
  };

  document.addEventListener('DOMContentLoaded', function () {
    var localConfig = loadConfig();
    applyConfig(localConfig);

    fetchRemoteConfig()
      .then(function (remoteConfig) {
        applyConfig(remoteConfig);
      })
      .catch(function () {
        // Keep local config applied when API is unavailable.
      });
  });
})();
