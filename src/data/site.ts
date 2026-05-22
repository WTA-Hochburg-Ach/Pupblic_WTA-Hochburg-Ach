export const activeLanguages = ['de', 'en', 'fr', 'ja'];

export const siteMeta = {
  name: 'Wanomichi Takemusu Aikido Hochburg-Ach',
  shortName: 'Aikido Hochburg-Ach',
  browserName: 'WTA-Hochburg-Ach',
  legalName: 'Wanomichi Takemusu Aikido Hochburg-Ach',
  description:
    'Traditionelles Aikido in Duttendorf mit regelmäßigem Training, Lehrgängen und einem offenen Vereinsleben.',
};

export const siteLegal = {
  copyrightOwner: siteMeta.legalName,
  copyrightNotice: 'Alle Rechte vorbehalten.',
  registrationNumber: '1580789299',
  liabilityNotice:
    'Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.',
  privacyNotice:
    'Diese Webseite dient der Information über den Verein. Bei einer Kontaktaufnahme per E-Mail oder Telefon werden die übermittelten Angaben ausschließlich zur Bearbeitung der Anfrage verwendet.',
  copyrightText:
    'Die Inhalte dieser Webseite, einschließlich Texte, Gestaltung und bereitgestellte Dokumente, unterliegen dem Urheberrecht, soweit nicht anders gekennzeichnet.',
};

export const siteLinks = {
  home: '',
  about: 'ueber-uns',
  training: 'training',
  schedule: 'trainingsplan',
  events: 'termine',
  news: 'news',
  gallery: 'foto-galerie',
  links: 'links',
  contact: 'kontakt',
  legal: 'impressum',
};

export const fontRecommendations = [
  {
    name: 'Fraunces',
    role: 'Hauptschrift fuer Ueberschriften',
    href: 'https://fonts.google.com/specimen/Fraunces',
  },
  {
    name: 'Cormorant Garamond',
    role: 'Klassische Alternative',
    href: 'https://fonts.google.com/specimen/Cormorant+Garamond',
  },
  {
    name: 'Libre Baskerville',
    role: 'Ruhige, gut lesbare Alternative',
    href: 'https://fonts.google.com/specimen/Libre+Baskerville',
  },
];

export const navItems = [
  {
    href: siteLinks.about,
    labelKey: 'nav.about',
    summaryKey: 'nav.about_summary',
    summary: 'Trainer, Etikette.',
  },
  {
    href: siteLinks.training,
    labelKey: 'nav.training',
    summaryKey: 'nav.training_summary',
    summary: 'Was erwartet dich? Probetraining, Trainingszeiten, Trainingsort ',
  },
  {
    href: siteLinks.events,
    labelKey: 'nav.events',
    summaryKey: 'nav.events_summary',
    summary: 'Als Nächstes und Kalender.',
  },
  {
    href: siteLinks.news,
    labelKey: 'nav.news',
    summaryKey: 'nav.news_summary',
    summary: 'Kurze Neuigkeiten und Chronik.',
  },
  {
    href: siteLinks.gallery,
    labelKey: 'nav.gallery',
    summaryKey: 'nav.gallery_summary',
    summary: 'Bilder, Rückblicke und Impressionen aus dem Dojo.',
  },
  {
    href: siteLinks.links,
    labelKey: 'nav.links',
    summaryKey: 'nav.links_summary',
    summary: '',
  },
  {
    href: siteLinks.contact,
    labelKey: 'nav.contact',
    summaryKey: 'nav.contact_summary',
    summary: 'Ansprechpartner, Adresse, Telefon und Anfahrt.',
  },
];

export const navSummaryFallbacks = Object.fromEntries(
  navItems.map((item) => [item.href, item.summary]),
) as Record<string, string>;

export function summarizeHeadings(markdown = '', fallback = '') {
  const markdownHeadings = Array.from(markdown.matchAll(/^##\s+(.+)$/gm), (match) => match[1]);
  const htmlHeadings = Array.from(markdown.matchAll(/<h2[^>]*>(.*?)<\/h2>/gis), (match) => match[1]);
  const headings = [...markdownHeadings, ...htmlHeadings]
    .map((heading) => heading.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  return headings.length > 0 ? headings.join(', ') : fallback;
}

export const venue = {
  name: 'Mehrzweckhalle der neuen Mittelschule',
  street: 'Athaler Strasse 1',
  postalCode: '5122',
  city: 'Duttendorf',
  country: 'Oesterreich',
  mapQuery: 'Athaler Strasse 1, 5122 Duttendorf',
};

export const contactData = {
  email: 'dojo@aikido-hochburg-ach.at',
  phone: {
    href: 'tel:+436504600020',
    compact: '+43 650 4600020',
    split: ['+43 650', '4600020'],
  },
  whatsapp: {
    href: 'https://wa.me/436504600020',
    label: 'WhatsApp Christian',
    phoneLabel: '+43 650 4600020',
  },
  socialinstagram: {
    href: 'https://www.instagram.com/aikido_hochburg_ach?igsh=NXQ5dnpqMGphZndt',
    label: 'Instagram',
  },
  socialfacebook: {
    href: 'https://www.facebook.com/share/1QDmhZywhG/?mibextid=wwXIfr',
    label: 'Facebook',
  },
};

export const boardMembers = [
  {
    role: 'Obmann',
    name: 'Christian Dostal',
    street: 'Birkenweg 29',
    cityLine: '5122 Hochburg-Ach',
    country: 'Oesterreich',
    phoneLabel: '+43 650 / 4600020',
    phoneHref: 'tel:+436504600020',
    splitPhone: false,
    email: contactData.email,
  },
  {
    role: 'Obmannstellvertreterin',
    name: 'Karin Sturm',
    street: 'Sternstrasse 11',
    cityLine: '84577 Tuessling',
    country: 'Deutschland',
    phoneLabel: '+49 157 / 71977750',
    phoneHref: 'tel:+4915771977750',
    splitPhone: false,
    email: contactData.email,
  },
  {
    role: 'Kassierin',
    name: 'Sandra Šolaja-Pelzer',
    street: 'Franziskanerstrasse 2',
    cityLine: '84503 Altoetting',
    country: 'Deutschland',
    phoneLabel: '+49 163 / 1760984',
    phoneHref: 'tel:+491631760984',
    splitPhone: false,
    email: contactData.email,
  },
];

export const trainingSchedule = [
  {
    day: 'Montag',
    time: '18:00 - 19:30',
    label: 'Training',
  },
  {
    day: 'Freitag',
    time: '16:00 - 17:00',
    label: 'Fragen und Vertiefung',
  },
  {
    day: 'Freitag',
    time: '17:00 - 18:30',
    label: 'Training',
  },
  {
    day: 'Samstag',
    time: '10:00 - 12:00',
    label: 'Waffentraining in ungeraden Wochen',
  },
];

export const partnerLinks = [
  {
    label: 'Wanomichi Frankreich',
    href: 'https://www.wanomichi.fr/',
  },
  {
    label: 'Wanomichi United Kingdom',
    href: 'https://wanomichi.uk/',
  },
  {
    label: 'Aikido Braunau',
    href: 'http://www.aikido-braunau.at',
  },
  {
    label: 'ASKOe Ried Aikido',
    href: 'https://www.askoeried.at/allgemein-3/',
  },
  {
    label: 'Takemusu Aikido Jena',
    href: 'https://aikido.uni-jena.de/takemusu/',
  },
  {
    label: 'Aikido Ampertal',
    href: 'https://www.aikido-ampertal.de/',
  },
];

export const footerLinks = [
  {
    titleKey: 'footer.dojo_title',
    items: [
      { href: siteLinks.about, labelKey: 'nav.about' },
      { href: siteLinks.training, labelKey: 'nav.training' },
      { href: siteLinks.schedule, labelKey: 'nav.schedule' },
      { href: siteLinks.contact, labelKey: 'nav.contact' },
    ],
  },
  {
    titleKey: 'footer.updates_title',
    items: [
      { href: siteLinks.news, labelKey: 'footer.news_and_events' },
      { href: siteLinks.events, labelKey: 'footer.event_overview' },
      { href: siteLinks.gallery, labelKey: 'nav.gallery' },
      { href: siteLinks.legal, labelKey: 'footer.legal_and_privacy' },
    ],
  },
];

export const footerSocialLinks = [
  {
    label: 'E-Mail',
    href: `mailto:${contactData.email}`,
    icon: 'lucide:mail',
  },
  {
    label: 'Telefon',
    href: contactData.phone.href,
    icon: 'lucide:phone',
  },
  {
    label: contactData.whatsapp.label,
    href: contactData.whatsapp.href,
    icon: 'lucide:message-circle',
    external: true,
  },
  {
    label: 'Instagram',
    href: contactData.socialinstagram.href,
    icon: 'lucide:instagram',
    external: true,
  },
  {
    label: 'Facebook',
    href: contactData.socialfacebook.href,
    icon: 'lucide:facebook',
    external: true,
  },
  {
    label: 'Google Maps',
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapQuery)}`,
    icon: 'lucide:map-pin',
    external: true,
  },
];
