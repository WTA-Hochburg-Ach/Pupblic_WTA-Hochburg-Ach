(function () {
  'use strict';

  const BASE_URL = window.__SITE_BASE__ || '/';
  const STORAGE_KEY = 'aikido-lang';
  const DEFAULT_LANG = 'de';
  const ORIGINAL_TEXT = new WeakMap();
  const ORIGINAL_ATTRS = new WeakMap();
  const TRANSLATIONS = {};

  const LANGUAGES = {
    de: { code: 'DE', htmlLang: 'de', dateLocale: 'de-DE' },
    en: { code: 'EN', htmlLang: 'en', dateLocale: 'en-GB' },
    fr: { code: 'FR', htmlLang: 'fr', dateLocale: 'fr-FR' },
  };

  let currentLang = DEFAULT_LANG;

  function normalizeText(value) {
    return String(value ?? '').replace(/\s+/g, ' ').trim();
  }

  function getInitialLanguage() {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get('lang');

    if (fromQuery && LANGUAGES[fromQuery]) {
      return fromQuery;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES[stored]) {
      return stored;
    }

    const browserLang = navigator.language?.split('-')[0];
    if (browserLang && LANGUAGES[browserLang]) {
      return browserLang;
    }

    return DEFAULT_LANG;
  }

  function getPathKey() {
    const currentPath = window.location.pathname || '/';
    const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
    let path = currentPath;

    if (normalizedBase !== '/' && path.startsWith(normalizedBase)) {
      path = path.slice(normalizedBase.length - 1);
    }

    return path.replace(/^\/|\/$/g, '') || 'home';
  }

  function localeUrl(lang) {
    const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
    return `${normalizedBase}locales/${lang}.json`;
  }

  async function loadTranslations(lang) {
    if (TRANSLATIONS[lang]) {
      return TRANSLATIONS[lang];
    }

    try {
      const response = await fetch(localeUrl(lang), { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      TRANSLATIONS[lang] = await response.json();
    } catch (error) {
      console.warn(`[i18n] ${lang}.json konnte nicht geladen werden: ${error.message}`);
      TRANSLATIONS[lang] = {};
    }

    return TRANSLATIONS[lang];
  }

  function interpolate(value, dataset = {}) {
    return String(value).replace(/\{(\w+)\}/g, (_, key) => dataset[key] ?? `{${key}}`);
  }

  function unwrapTranslation(value) {
    if (value && typeof value === 'object' && typeof value.text === 'string') {
      return value.text;
    }

    return typeof value === 'string' ? value : undefined;
  }

  function t(key, fallback = '', dataset) {
    const parts = key.split('.');
    let value = TRANSLATIONS[currentLang];

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return interpolate(fallback || key, dataset);
      }
    }

    const text = unwrapTranslation(value);
    return text ? interpolate(text, dataset) : interpolate(fallback || key, dataset);
  }

  function translateExactText(value) {
    if (currentLang === DEFAULT_LANG) {
      return value;
    }

    const normalized = normalizeText(value);
    const translation = unwrapTranslation(TRANSLATIONS[currentLang]?.text?.[normalized]);
    return translation || value;
  }

  function translateExactAttribute(value) {
    if (currentLang === DEFAULT_LANG) {
      return value;
    }

    const normalized = normalizeText(value);
    const translation = unwrapTranslation(TRANSLATIONS[currentLang]?.attr?.[normalized]);
    return translation || value;
  }

  function shouldSkipElement(element) {
    return Boolean(
      element.closest(
        'script, style, template, svg, code, pre, textarea, input, option, [translate="no"], .notranslate, .hero-kanji, .hero-quote-jp, .logo, [data-i18n]',
      ),
    );
  }

  function updateLanguageSelector() {
    document.querySelectorAll('.lang-option').forEach((option) => {
      const lang = option.getAttribute('data-lang');
      const isActive = lang === currentLang;
      option.classList.toggle('active', isActive);
      option.setAttribute('aria-pressed', String(isActive));
    });
  }

  function updateDocumentTitle() {
    const html = document.documentElement;
    const pageKey = getPathKey();
    const metaKey = `meta.${pageKey}`;
    const pageTitle = t(metaKey, '', {});
    const originalTitle = html.dataset.pageTitle || '';
    const resolvedMetaTitle = pageTitle === metaKey ? '' : pageTitle;
    const resolvedPageTitle = resolvedMetaTitle || translateExactText(originalTitle) || originalTitle;
    const siteTitle = html.dataset.siteTitle || 'WTA-Hochburg-Ach';

    document.title = resolvedPageTitle && resolvedPageTitle !== siteTitle
      ? `${resolvedPageTitle} | ${siteTitle}`
      : siteTitle;
  }

  function formatDate(date, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
    return new Date(date).toLocaleDateString(LANGUAGES[currentLang]?.dateLocale || 'de-DE', options);
  }

  function formatDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (!endDate || Number.isNaN(end?.getTime())) {
      return formatDate(start);
    }

    const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
    if (sameMonth) {
      if (currentLang === 'en') {
        return `${start.getDate()}-${end.getDate()} ${formatDate(start, { month: 'long', year: 'numeric' })}`;
      }

      return `${start.getDate()}.-${end.getDate()}. ${formatDate(start, { month: 'long', year: 'numeric' })}`;
    }

    return `${formatDate(start)} - ${formatDate(end)}`;
  }

  function forEachMatch(root, selector, callback) {
    if (root instanceof Element && root.matches(selector)) {
      callback(root);
    }

    if (root.querySelectorAll) {
      root.querySelectorAll(selector).forEach(callback);
    }
  }

  function updateKeyedText(root = document) {
    forEachMatch(root, '[data-i18n]', (element) => {
      const key = element.getAttribute('data-i18n');
      if (!key) return;

      if (!ORIGINAL_TEXT.has(element)) {
        ORIGINAL_TEXT.set(element, element.textContent || '');
      }

      const fallback = ORIGINAL_TEXT.get(element) || '';
      element.textContent = t(key, fallback, element.dataset);
    });
  }

  function updateKeyedAttributes(root = document) {
    forEachMatch(root, '[data-i18n-attr]', (element) => {
      const descriptor = element.getAttribute('data-i18n-attr');
      if (!descriptor) return;

      if (!ORIGINAL_ATTRS.has(element)) {
        ORIGINAL_ATTRS.set(element, {});
      }

      const stored = ORIGINAL_ATTRS.get(element);

      descriptor.split(',').forEach((entry) => {
        const [attr, key] = entry.split(':');
        const attribute = attr?.trim();
        const translationKey = key?.trim();
        if (!attribute || !translationKey) return;

        if (!(attribute in stored)) {
          stored[attribute] = element.getAttribute(attribute) || '';
        }

        element.setAttribute(attribute, t(translationKey, stored[attribute], element.dataset));
      });
    });
  }

  function updateExactAttributes(root = document) {
    forEachMatch(root, '[aria-label], [title], [placeholder], [alt]', (element) => {
      if (element.hasAttribute('data-i18n-attr')) {
        return;
      }

      if (!ORIGINAL_ATTRS.has(element)) {
        ORIGINAL_ATTRS.set(element, {});
      }

      const stored = ORIGINAL_ATTRS.get(element);

      ['aria-label', 'title', 'placeholder', 'alt'].forEach((attribute) => {
        if (!element.hasAttribute(attribute)) {
          return;
        }

        if (!(attribute in stored)) {
          stored[attribute] = element.getAttribute(attribute) || '';
        }

        const original = stored[attribute];
        const translated = translateExactAttribute(original);
        element.setAttribute(attribute, translated);
      });
    });
  }

  function updateDates(root = document) {
    forEachMatch(root, '[data-date-start]', (element) => {
      const start = element.getAttribute('data-date-start');
      if (!start) return;

      const end = element.getAttribute('data-date-end') || '';
      element.textContent = formatDateRange(start, end || undefined);
    });
  }

  function updateExactTextNodes(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) {
          return NodeFilter.FILTER_REJECT;
        }

        if (!node.nodeValue || !normalizeText(node.nodeValue)) {
          return NodeFilter.FILTER_REJECT;
        }

        if (shouldSkipElement(parent)) {
          return NodeFilter.FILTER_REJECT;
        }

        if (!/[A-Za-z]/.test(normalizeText(node.nodeValue))) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let node = walker.nextNode();
    while (node) {
      if (!ORIGINAL_TEXT.has(node)) {
        ORIGINAL_TEXT.set(node, node.nodeValue);
      }

      const originalValue = ORIGINAL_TEXT.get(node) || '';
      const trimmedOriginal = normalizeText(originalValue);
      const translatedCore = currentLang === DEFAULT_LANG ? trimmedOriginal : translateExactText(trimmedOriginal);

      if (translatedCore && translatedCore !== trimmedOriginal) {
        const leading = originalValue.match(/^\s*/)?.[0] || '';
        const trailing = originalValue.match(/\s*$/)?.[0] || '';
        node.nodeValue = `${leading}${translatedCore}${trailing}`;
      } else if (node.nodeValue !== originalValue) {
        node.nodeValue = originalValue;
      }

      node = walker.nextNode();
    }
  }

  function markNoTranslateZones() {
    document.querySelectorAll('.hero-kanji, .hero-quote-jp').forEach((element) => {
      element.setAttribute('translate', 'no');
      element.setAttribute('lang', 'ja');
    });
  }

  function applyTranslations(root = document) {
    document.documentElement.lang = LANGUAGES[currentLang]?.htmlLang || currentLang;
    markNoTranslateZones();
    updateKeyedText(root);
    updateKeyedAttributes(root);
    updateDates(root);
    updateExactAttributes(root);
    updateExactTextNodes(root instanceof Document ? document.body : root);
    updateLanguageSelector();
    updateDocumentTitle();
  }

  function updateLanguageInUrl() {
    const url = new URL(window.location.href);

    if (currentLang === DEFAULT_LANG) {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', currentLang);
    }

    window.history.replaceState({}, '', url);
  }

  async function switchLanguage(lang) {
    if (!LANGUAGES[lang]) return;

    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    updateLanguageInUrl();
    await loadTranslations(lang);
    applyTranslations(document);
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
  }

  function initLanguageSelector() {
    document.querySelectorAll('.lang-option').forEach((option) => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        if (lang) {
          switchLanguage(lang);
        }
      });
    });
  }

  function initMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) {
            return;
          }

          applyTranslations(node);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  async function init() {
    currentLang = getInitialLanguage();
    await Promise.all([loadTranslations(DEFAULT_LANG), loadTranslations(currentLang)]);
    initLanguageSelector();
    applyTranslations(document);
    initMutationObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.i18n = {
    t,
    switchLanguage,
    getCurrentLang: () => currentLang,
    getLanguages: () => LANGUAGES,
    getLocale: () => LANGUAGES[currentLang]?.dateLocale || 'de-DE',
    formatDate,
    formatDateRange,
    translateTree: applyTranslations,
  };
})();
