(function () {
  'use strict';

  const BASE_URL = window.__SITE_BASE__ || '/';
  const STORAGE_KEY = 'aikido-lang';
  const DEFAULT_LANG = 'de';

  const LANGUAGES = {
    de: { code: 'DE', htmlLang: 'de' },
    en: { code: 'EN', htmlLang: 'en' },
    fr: { code: 'FR', htmlLang: 'fr' },
  };

  const TRANSLATIONS = {
    de: {
      common: {
        language: 'Sprache',
        theme: 'Theme',
        theme_light: 'Hell',
        theme_dark: 'Dunkel',
      },
      nav: {
        about: 'Ueber uns',
        about_summary: 'Verein, Trainingsort, Probetraining und Trainer.',
        training: 'Training',
        training_summary: 'Aikido, Waffentraining und Trainingsaufbau.',
        schedule: 'Trainingsplan',
        events: 'Termine',
        events_summary: 'Kalender, Timeline, Ausschreibungen und PDF-Downloads.',
        news: 'Aktuelles',
        news_summary: 'Kurze Neuigkeiten und die chronologische Historie.',
        gallery: 'Galerie',
        gallery_summary: 'Bilder, Rueckblicke und Impressionen aus dem Dojo.',
        links: 'Links',
        links_summary: 'Partnerdojos, Netzwerk und hilfreiche Empfehlungen.',
        contact: 'Kontakt',
        contact_summary: 'Ansprechpartner, Adresse, Telefon und Anfahrt.',
      },
      footer: {
        dojo_title: 'WTA Hochburg-Ach',
        updates_title: 'Aktuelles',
        news_and_events: 'Aktuelles & Termine',
        event_overview: 'Terminuebersicht',
        legal_and_privacy: 'Impressum & Datenschutz',
        times_title: 'Trainingszeiten',
        times_monday: 'Montag: 18:00 - 19:30 Training',
        times_friday_questions: 'Freitag: 16:00 - 17:00 Fragen und Vertiefung',
        times_friday_training: 'Freitag: 17:00 - 18:30 Training',
        times_saturday: 'Samstag: 10:00 - 12:00 Waffentraining in ungeraden Wochen',
        contact_title: 'Kontakt',
        address_line1: 'Athaler Strasse 1',
        address_line2: '5122 Duttendorf',
        network_title: 'Netzwerk',
        copyright: 'Copyright {year} Wanomichi Takemusu Aikido Hochburg-Ach. Alle Rechte vorbehalten.',
        tagline: 'Aikido - der Weg der Harmonie',
      },
      meta: {
        home: 'Wanomichi Takemusu Aikido Hochburg-Ach',
        'ueber-uns': 'Ueber uns',
        training: 'Training',
        trainingsplan: 'Trainingsplan',
        termine: 'Termine',
        news: 'Aktuelles & Termine',
        links: 'Links',
        kontakt: 'Kontakt',
        legal: 'Impressum & Kontakt',
        impressum: 'Impressum & Kontakt',
        'foto-galerie': 'Foto-Galerie',
      },
    },
    en: {
      common: {
        language: 'Language',
        theme: 'Theme',
        theme_light: 'Light',
        theme_dark: 'Dark',
      },
      nav: {
        about: 'About',
        about_summary: 'Club, venue, trial training and trainer.',
        training: 'Training',
        training_summary: 'Aikido, weapons practice and class structure.',
        schedule: 'Schedule',
        events: 'Events',
        events_summary: 'Calendar, timeline, brochures and PDF downloads.',
        news: 'Updates',
        news_summary: 'Short news items and the chronological history.',
        gallery: 'Gallery',
        gallery_summary: 'Photos, retrospectives and impressions from the dojo.',
        links: 'Links',
        links_summary: 'Partner dojo links, network and useful recommendations.',
        contact: 'Contact',
        contact_summary: 'People, address, phone and directions.',
      },
      footer: {
        dojo_title: 'WTA Hochburg-Ach',
        updates_title: 'Updates',
        news_and_events: 'Updates & Events',
        event_overview: 'Event overview',
        legal_and_privacy: 'Legal notice & privacy',
        times_title: 'Training times',
        times_monday: 'Monday: 18:00 - 19:30 practice',
        times_friday_questions: 'Friday: 16:00 - 17:00 questions and review',
        times_friday_training: 'Friday: 17:00 - 18:30 practice',
        times_saturday: 'Saturday: 10:00 - 12:00 weapons practice on odd weeks',
        contact_title: 'Contact',
        address_line1: 'Athaler Strasse 1',
        address_line2: '5122 Duttendorf',
        network_title: 'Network',
        copyright: 'Copyright {year} Wanomichi Takemusu Aikido Hochburg-Ach. All rights reserved.',
        tagline: 'Aikido - the way of harmony',
      },
      meta: {
        home: 'Wanomichi Takemusu Aikido Hochburg-Ach',
        'ueber-uns': 'About',
        training: 'Training',
        trainingsplan: 'Schedule',
        termine: 'Events',
        news: 'Updates & Events',
        links: 'Links',
        kontakt: 'Contact',
        legal: 'Legal notice & contact',
        impressum: 'Legal notice & contact',
        'foto-galerie': 'Photo gallery',
      },
    },
    fr: {
      common: {
        language: 'Langue',
        theme: 'Theme',
        theme_light: 'Clair',
        theme_dark: 'Sombre',
      },
      nav: {
        about: 'A propos',
        about_summary: 'Club, lieu d entrainement, seance d essai et enseignant.',
        training: 'Entrainement',
        training_summary: 'Aikido, armes et structure des cours.',
        schedule: 'Horaires',
        events: 'Evenements',
        events_summary: 'Calendrier, timeline, brochures et telechargements PDF.',
        news: 'Actualites',
        news_summary: 'Courtes nouvelles et historique chronologique.',
        gallery: 'Galerie',
        gallery_summary: 'Photos, retrospectives et impressions du dojo.',
        links: 'Liens',
        links_summary: 'Dojos partenaires, reseau et recommandations utiles.',
        contact: 'Contact',
        contact_summary: 'Interlocuteurs, adresse, telephone et itineraire.',
      },
      footer: {
        dojo_title: 'WTA Hochburg-Ach',
        updates_title: 'Actualites',
        news_and_events: 'Actualites & evenements',
        event_overview: 'Vue des evenements',
        legal_and_privacy: 'Mentions legales & confidentialite',
        times_title: 'Horaires',
        times_monday: 'Lundi: 18:00 - 19:30 entrainement',
        times_friday_questions: 'Vendredi: 16:00 - 17:00 questions et approfondissement',
        times_friday_training: 'Vendredi: 17:00 - 18:30 entrainement',
        times_saturday: 'Samedi: 10:00 - 12:00 armes les semaines impaires',
        contact_title: 'Contact',
        address_line1: 'Athaler Strasse 1',
        address_line2: '5122 Duttendorf',
        network_title: 'Reseau',
        copyright: 'Copyright {year} Wanomichi Takemusu Aikido Hochburg-Ach. Tous droits reserves.',
        tagline: 'Aikido - la voie de l harmonie',
      },
      meta: {
        home: 'Wanomichi Takemusu Aikido Hochburg-Ach',
        'ueber-uns': 'A propos',
        training: 'Entrainement',
        trainingsplan: 'Horaires',
        termine: 'Evenements',
        news: 'Actualites & evenements',
        links: 'Liens',
        kontakt: 'Contact',
        legal: 'Mentions legales & contact',
        impressum: 'Mentions legales & contact',
        'foto-galerie': 'Galerie photo',
      },
    },
  };

  let currentLang = DEFAULT_LANG;

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

  function interpolate(value, dataset = {}) {
    return String(value).replace(/\{(\w+)\}/g, (_, key) => dataset[key] ?? `{${key}}`);
  }

  function t(key, fallback = '', dataset) {
    const keys = key.split('.');
    let value = TRANSLATIONS[currentLang];

    for (const part of keys) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return fallback || key;
      }
    }

    return typeof value === 'string' ? interpolate(value, dataset) : fallback || key;
  }

  function updateLanguageSelector() {
    const currentLangLabel = document.querySelector('[data-current-lang]');
    if (currentLangLabel) {
      currentLangLabel.textContent = LANGUAGES[currentLang]?.code || currentLang.toUpperCase();
    }

    document.querySelectorAll('.lang-option').forEach((option) => {
      option.classList.toggle('active', option.getAttribute('data-lang') === currentLang);
    });
  }

  function updateDocumentTitle() {
    const url = new URL(window.location.href);
    const path = url.pathname.replace(BASE_URL, '').replace(/^\/|\/$/g, '');
    const pageKey = path === '' ? 'home' : path;
    const title = TRANSLATIONS[currentLang]?.meta?.[pageKey];

    if (title) {
      document.title = title;
    }
  }

  function updatePageContent() {
    document.documentElement.lang = LANGUAGES[currentLang]?.htmlLang || currentLang;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (!key) return;
      element.textContent = t(key, element.textContent, element.dataset);
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
      const descriptor = element.getAttribute('data-i18n-attr');
      if (!descriptor) return;

      descriptor.split(',').forEach((entry) => {
        const [attr, key] = entry.split(':');
        if (!attr || !key) return;
        element.setAttribute(attr.trim(), t(key.trim(), element.getAttribute(attr.trim()) || '', element.dataset));
      });
    });

    updateLanguageSelector();
    updateDocumentTitle();
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
  }

  function updateLanguageInUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', currentLang);
    window.history.replaceState({}, '', url);
  }

  function switchLanguage(lang) {
    if (!LANGUAGES[lang]) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    updateLanguageInUrl();
    updatePageContent();
  }

  function initLanguageSelector() {
    document.querySelectorAll('.lang-option').forEach((option) => {
      option.addEventListener('click', (event) => {
        event.preventDefault();
        const lang = option.getAttribute('data-lang');
        if (lang) switchLanguage(lang);
      });
    });
  }

  function init() {
    currentLang = getInitialLanguage();
    initLanguageSelector();
    updatePageContent();
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
  };
})();
