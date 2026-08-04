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
    grid.innerHTML = '';
    config.services.forEach(function (service) {
      var label = serviceActionLabel(service.name);
      var encoded = encodeURIComponent('I need ' + service.name + '. Pickup:  Drop-off:  Date/time: ');

      var card = document.createElement('article');
      card.className = 'service-card';

      var title = document.createElement('h3');
      title.textContent = service.name;

      var description = document.createElement('p');
      description.textContent = service.description;

      var actions = document.createElement('div');
      actions.className = 'service-actions';

      var call = document.createElement('a');
      call.className = 'button button-call button-small';
      call.href = 'tel:+12528865996';
      call.textContent = 'Call for ' + label;

      var text = document.createElement('a');
      text.className = 'button button-text button-small';
      text.href = 'sms:+12528865996?body=' + encoded;
      text.textContent = 'Text for ' + label;

      actions.appendChild(call);
      actions.appendChild(text);
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(actions);
      grid.appendChild(card);
    });

    var serviceSelect = document.querySelector('#booking-form select[name="service"]');
    if (serviceSelect) {
      serviceSelect.innerHTML = '';

      var placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      placeholder.textContent = 'Select a service';
      serviceSelect.appendChild(placeholder);

      config.services.forEach(function (service) {
        var option = document.createElement('option');
        option.textContent = service.name;
        serviceSelect.appendChild(option);
      });
    }
  }

  function renderCatalogServices(config) {
    var grid = document.querySelector('[data-config-services-catalog]');
    if (!grid) return;
    grid.innerHTML = '';
    config.services.forEach(function (service) {
      var label = serviceActionLabel(service.name);
      var encoded = encodeURIComponent('I need ' + service.name + '. Pickup:  Drop-off:  Date/time: ');

      var card = document.createElement('article');
      card.className = 'panel stack';

      var title = document.createElement('h2');
      title.textContent = service.name;

      var description = document.createElement('p');
      description.textContent = service.description;

      var actions = document.createElement('div');
      actions.className = 'stack';

      var call = document.createElement('a');
      call.className = 'button button-call';
      call.href = 'tel:+12528865996';
      call.textContent = 'Call for ' + label;

      var text = document.createElement('a');
      text.className = 'button button-text';
      text.href = 'sms:+12528865996?body=' + encoded;
      text.textContent = 'Text ' + label + ' details';

      actions.appendChild(call);
      actions.appendChild(text);
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  function renderFleet(config) {
    var fleetNodes = document.querySelectorAll('[data-config-fleet]');
    if (!fleetNodes.length) return;
    fleetNodes.forEach(function (node) {
      node.innerHTML = '';
      config.fleet.forEach(function (item) {
        var card = document.createElement('article');
        card.className = 'panel stack';

        var title = document.createElement('h3');
        title.textContent = item.name;

        var description = document.createElement('p');
        description.textContent = item.description;

        card.appendChild(title);
        card.appendChild(description);
        node.appendChild(card);
      });
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
