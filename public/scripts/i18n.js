(function () {
  'use strict';

  const BASE_URL = window.__SITE_BASE__ || '/';
  const STORAGE_KEY = 'aikido-lang';
  const DEFAULT_LANG = 'de';
  const ORIGINAL_TEXT = new WeakMap();
  const ORIGINAL_ATTRS = new WeakMap();

  const LANGUAGES = {
    de: { code: 'DE', htmlLang: 'de', dateLocale: 'de-DE' },
    en: { code: 'EN', htmlLang: 'en', dateLocale: 'en-GB' },
    fr: { code: 'FR', htmlLang: 'fr', dateLocale: 'fr-FR' },
  };

  const TRANSLATIONS = {
    de: {
      common: {
        language: 'Sprache',
        language_toggle: 'Sprache waehlen',
        theme: 'Theme',
        theme_toggle: 'Farbschema wechseln',
        theme_light: 'Hell',
        theme_dark: 'Dunkel',
        menu_open: 'Menue oeffnen',
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
        home: 'WTA-Hochburg-Ach',
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
        '404': 'Seite nicht gefunden',
      },
      events: {
        detail_count_one: '{count} Termin an diesem Tag',
        detail_count_other: '{count} Termine an diesem Tag',
        detail_none: 'Kein Termin an diesem Tag',
        empty_day: 'An diesem Tag ist kein Termin eingetragen.',
        time: 'Zeit',
        place: 'Ort',
        people: 'Personen',
        tba: 'wird bekanntgegeben',
        modal_loading: 'Laden...',
        modal_error: 'Der Inhalt konnte gerade nicht geladen werden.',
        pdf_de: 'PDF Deutsch',
        pdf_en: 'PDF English',
        pdf_short_de: 'PDF DE',
        pdf_short_en: 'PDF EN',
        preview: 'Vorschau',
        open_page: 'Seite oeffnen',
        details: 'Details',
        aria_count_one: '{count} Termin',
        aria_count_other: '{count} Termine',
        aria_none: 'kein Termin',
      },
    },
    en: {
      common: {
        language: 'Language',
        language_toggle: 'Choose language',
        theme: 'Theme',
        theme_toggle: 'Switch color theme',
        theme_light: 'Light',
        theme_dark: 'Dark',
        menu_open: 'Open menu',
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
        home: 'WTA-Hochburg-Ach',
        'ueber-uns': 'About us',
        training: 'Training',
        trainingsplan: 'Schedule',
        termine: 'Events',
        news: 'Updates & Events',
        links: 'Links',
        kontakt: 'Contact',
        legal: 'Legal notice & contact',
        impressum: 'Legal notice & contact',
        'foto-galerie': 'Photo gallery',
        '404': 'Page not found',
      },
      events: {
        detail_count_one: '{count} event on this day',
        detail_count_other: '{count} events on this day',
        detail_none: 'No event on this day',
        empty_day: 'There is no event scheduled for this day.',
        time: 'Time',
        place: 'Location',
        people: 'People',
        tba: 'to be announced',
        modal_loading: 'Loading...',
        modal_error: 'The content could not be loaded right now.',
        pdf_de: 'PDF German',
        pdf_en: 'PDF English',
        pdf_short_de: 'PDF DE',
        pdf_short_en: 'PDF EN',
        preview: 'Preview',
        open_page: 'Open page',
        details: 'Details',
        aria_count_one: '{count} event',
        aria_count_other: '{count} events',
        aria_none: 'no event',
      },
    },
    fr: {
      common: {
        language: 'Langue',
        language_toggle: 'Choisir la langue',
        theme: 'Theme',
        theme_toggle: 'Changer le theme',
        theme_light: 'Clair',
        theme_dark: 'Sombre',
        menu_open: 'Ouvrir le menu',
      },
      nav: {
        about: 'A propos',
        about_summary: 'Club, lieu, cours d essai et enseignant.',
        training: 'Entrainement',
        training_summary: 'Aikido, armes et structure des cours.',
        schedule: 'Horaires',
        events: 'Evenements',
        events_summary: 'Calendrier, timeline, brochures et telechargements PDF.',
        news: 'Actualites',
        news_summary: 'Nouvelles breves et historique chronologique.',
        gallery: 'Galerie',
        gallery_summary: 'Photos, retrospectives et impressions du dojo.',
        links: 'Liens',
        links_summary: 'Dojos partenaires, reseau et recommandations utiles.',
        contact: 'Contact',
        contact_summary: 'Personnes, adresse, telephone et itineraire.',
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
        home: 'WTA-Hochburg-Ach',
        'ueber-uns': 'A propos de nous',
        training: 'Entrainement',
        trainingsplan: 'Horaires',
        termine: 'Evenements',
        news: 'Actualites & evenements',
        links: 'Liens',
        kontakt: 'Contact',
        legal: 'Mentions legales & contact',
        impressum: 'Mentions legales & contact',
        'foto-galerie': 'Galerie photo',
        '404': 'Page introuvable',
      },
      events: {
        detail_count_one: '{count} evenement ce jour',
        detail_count_other: '{count} evenements ce jour',
        detail_none: 'Aucun evenement ce jour',
        empty_day: 'Aucun evenement n est inscrit pour ce jour.',
        time: 'Heure',
        place: 'Lieu',
        people: 'Personnes',
        tba: 'sera annonce',
        modal_loading: 'Chargement...',
        modal_error: 'Le contenu ne peut pas etre charge pour le moment.',
        pdf_de: 'PDF allemand',
        pdf_en: 'PDF anglais',
        pdf_short_de: 'PDF DE',
        pdf_short_en: 'PDF EN',
        preview: 'Apercu',
        open_page: 'Ouvrir la page',
        details: 'Details',
        aria_count_one: '{count} evenement',
        aria_count_other: '{count} evenements',
        aria_none: 'aucun evenement',
      },
    },
  };

  const EXACT_TEXT_TRANSLATIONS = {
    en: {
      'Ueber uns': 'About us',
      'Kontakt': 'Contact',
      'Ruhe': 'Calm',
      'Bewegung': 'Movement',
      'Praesenz': 'Presence',
      'Traditionelles Aikido in Duttendorf. Offen fuer Einsteiger:innen, Wiedereinsteiger:innen und alle, die Bewegung, Konzentration und ruhiges Miteinander suchen.':
        'Traditional Aikido in Duttendorf. Open to beginners, returning students and everyone looking for movement, focus and calm practice together.',
      'Woher kommt Aikido?': 'Where does Aikido come from?',
      'Aikido wurde von Ueshiba Morihei entwickelt und verbindet Kampfkunst, Koerperarbeit und einen Weg der inneren Haltung.':
        'Aikido was developed by Ueshiba Morihei and combines martial art, bodywork and a path of inner attitude.',
      'O-Sensei Ueshiba Morihei (1883 bis 1969) hat Aikido ab den 1920er Jahren aus verschiedenen traditionellen Budo- und Jujutsu-Schulen heraus entwickelt. Die heute bekannte Form entstand nicht auf einmal, sondern durch jahrzehntelanges Training, Forschen und Verfeinern.':
        'O-Sensei Ueshiba Morihei (1883 to 1969) developed Aikido from the 1920s onward out of several traditional Budo and Jujutsu schools. The form we know today did not appear all at once, but through decades of training, research and refinement.',
      'Wesentlich ist die Idee, einen Angriff nicht hart gegen hart zu stoppen, sondern ihn aufzunehmen, umzulenken und in eine kreisfoermige Bewegung zu ueberfuehren. Dadurch entsteht Kontrolle ohne unnoetige Haerte.':
        'At its core is the idea of not stopping an attack by force against force, but of receiving it, redirecting it and guiding it into a circular movement. This creates control without unnecessary hardness.',
      'Aikido versteht Technik, Aufmerksamkeit und Haltung als Einheit. Genau darin liegt fuer viele Menschen der besondere Reiz: Es ist eine Kampfkunst mit klarer Form und zugleich ein Weg, Praesenz, Verbindung und Ruhe zu trainieren.':
        'Aikido sees technique, attention and posture as one whole. That is exactly what makes it special for many people: it is a martial art with a clear form and at the same time a way to train presence, connection and calm.',
      'Was ist Aikido?': 'What is Aikido?',
      'Aikido ist eine japanische Kampfkunst, in der Bewegung, Timing und Koerperzentrum wichtiger sind als Kraft oder Konkurrenz.':
        'Aikido is a Japanese martial art in which movement, timing and body center matter more than strength or competition.',
      'Im Training arbeiten wir mit Partneruebungen, Falltechnik, Hebeln, Wuerfen und klaren Grundformen. Angriffe werden nicht frontal geblockt, sondern ueber Linien, Winkel und Kreisbewegungen aufgenommen.':
        'In training we work with partner drills, ukemi, locks, throws and clear basics. Attacks are not blocked head on, but received through lines, angles and circular movement.',
      'Abgerundet wird das Training durch Buki Waza, also das Ueben mit Holzschwert, Stock und Holzmesser. Dadurch werden Distanz, Haltung und Verbindung noch klarer erfahrbar.':
        'Training is rounded out by Buki Waza, practice with wooden sword, staff and wooden knife. This makes distance, posture and connection even clearer to experience.',
      'Unser Dojo orientiert sich an der Lehre von Saito Morihiro Sensei und pflegt eine ruhige, konzentrierte Trainingskultur ohne Leistungsdruck.':
        'Our dojo follows the teaching of Saito Morihiro Sensei and cultivates a calm, focused training culture without performance pressure.',
      'Fuer wen ist Aikido?': 'Who is Aikido for?',
      'Aikido ist fuer Menschen jeden Alters geeignet. Du brauchst keine Vorkenntnisse, nur Neugier und Offenheit.':
        'Aikido is suitable for people of all ages. You do not need previous experience, only curiosity and openness.',
      'Bewegung ohne Druck': 'Movement without pressure',
      'Ideal fuer alle, die harmonische Bewegung ohne Wettkampf oder Konkurrenz suchen.':
        'Ideal for anyone looking for harmonious movement without competition or rivalry.',
      'Ruhe im Alltag': 'Calm in everyday life',
      'Ein konzentrierter Gegenpol zu einem hektischen Tagesrhythmus.':
        'A focused counterbalance to a hectic daily rhythm.',
      'Balance und Stabilitaet': 'Balance and stability',
      'Foerdert Koerperbewusstsein, Praesenz und eine klare, aufrechte Bewegung.':
        'Supports body awareness, presence and clear, upright movement.',
      'Dojo-Kultur erleben': 'Experience dojo culture',
      'Spannend fuer Menschen mit Interesse an japanischer Kampfkunst, Etikette und Tradition.':
        'Especially interesting for people with an interest in Japanese martial arts, etiquette and tradition.',
      'Neugierig geworden?': 'Curious now?',
      'Wenn du ein Probetraining machen moechtest, melde dich kurz bei uns. Trainingsort, Ablauf und erste Hinweise findest du auf unseren Ueber-uns- und Kontaktseiten.':
        'If you would like to try a training session, just send us a short message. You can find the venue, the process and first notes on our About and Contact pages.',
      'Zum Trainingsort': 'To the training venue',
      'Der Verein wurde am 10. Februar 2026 gegruendet und steht fuer traditionelles Aikido mit ruhiger, praeziser Trainingskultur.':
        'The club was founded on 10 February 2026 and stands for traditional Aikido with a calm, precise training culture.',
      'Unsere Ausrichtung ist durch die Arbeit, den Austausch und die Inspiration von Edmund Kern sowie Daniel Toutain gepraegt. Im Mittelpunkt stehen saubere Grundlagen, Verbindung, Haltung und ein freundliches Miteinander auf und neben der Matte.':
        'Our orientation is shaped by the work, exchange and inspiration of Edmund Kern and Daniel Toutain. The focus is on clean fundamentals, connection, posture and a friendly spirit on and off the mat.',
      'Trainingsort': 'Training venue',
      'Mehrzweckhalle der neuen Mittelschule': 'Multipurpose hall of the new middle school',
      'Der Trainingsort liegt in Duttendorf in der Gemeinde Hochburg-Ach. Ueber Google Maps kannst du die Route direkt oeffnen.':
        'The training venue is in Duttendorf in the municipality of Hochburg-Ach. You can open the route directly in Google Maps.',
      'In Google Maps oeffnen': 'Open in Google Maps',
      'Probetraining': 'Trial class',
      'Ein Probetraining ist nach kurzer Anmeldung jederzeit moeglich.':
        'A trial class is possible at any time after a short registration.',
      'Bitte nimm vorher Kontakt mit uns auf, damit wir dich gut empfangen koennen. Fuer das erste Training reichen lange Sportbekleidung oder ein Trainingsanzug sowie Hausschuhe. Trainiert wird barfuss oder in rutschfesten Socken.':
        'Please contact us first so we can welcome you properly. For your first class, long sportswear or a tracksuit and indoor shoes are enough. Training is done barefoot or in non-slip socks.',
      'Kontakt aufnehmen': 'Get in touch',
      'Trainer': 'Instructor',
      'Christian begann seine Aikido-Laufbahn 2004 in Steyr. In Hochburg-Ach begleitet er das Training mit ruhiger, genauer Arbeit an Grundlagen, Haltung und Verbindung.':
        'Christian began his Aikido path in 2004 in Steyr. In Hochburg-Ach he guides the training with calm, precise work on basics, posture and connection.',
      'Etikette': 'Etiquette',
      'Wir trainieren aufmerksam, respektvoll und ohne Leistungsdruck. Vor dem Betreten der Matte gruessen wir kurz an, Schmuck wird abgelegt und Fragen sind jederzeit willkommen.':
        'We train attentively, respectfully and without performance pressure. Before stepping onto the mat we bow briefly, jewelry is removed and questions are always welcome.',
      'Unser Training folgt der Lehre von Saito Morihiro Sensei und verbindet Koerperarbeit, Aufmerksamkeit und Waffentraining.':
        'Our training follows the teaching of Saito Morihiro Sensei and combines bodywork, attention and weapons practice.',
      'Was erwartet dich?': 'What can you expect?',
      'Aikido ist eine japanische Kampfkunst, deren Koerpertechniken auf klassischen Schulen wie Yagyu-ryu und Daito-ryu Jujutsu beruhen. Statt sich einem Angriff frontal entgegenzustellen, wird er ueber Winkel, Distanz und Kreisbewegungen aufgenommen.':
        'Aikido is a Japanese martial art whose body techniques are rooted in classical schools such as Yagyu-ryu and Daito-ryu Jujutsu. Instead of confronting an attack head on, it is received through angles, distance and circular movement.',
      'Zum Training gehoeren Grundformen, Partnerarbeit, Falltechnik, Hebel und Wuerfe. Ziel ist es, Kontrolle und Verbindung zu entwickeln, ohne unnoetige Haerte einzusetzen.':
        'Training includes basics, partner work, ukemi, locks and throws. The aim is to develop control and connection without using unnecessary hardness.',
      'Ergaenzt wird das Taijutsu durch Buki Waza mit Holzschwert, Stock und Holzmesser. Dadurch werden Linien, Timing und Zentrierung noch klarer erfahrbar.':
        'Taijutsu is complemented by Buki Waza with wooden sword, staff and wooden knife. This makes lines, timing and centering even clearer.',
      'Trainingszeiten': 'Training times',
      'Montag': 'Monday',
      'Freitag': 'Friday',
      'Samstag': 'Saturday',
      'Training': 'Practice',
      'Fragen und Vertiefung': 'Questions and review',
      'Waffentraining in ungeraden Wochen': 'Weapons practice on odd weeks',
      'Unsere regulaeren Einheiten finden in der Mehrzweckhalle der neuen Mittelschule in Duttendorf statt.':
        'Our regular sessions take place in the multipurpose hall of the new middle school in Duttendorf.',
      'Wochenuebersicht': 'Weekly overview',
      'Bitte melde dich vor einem ersten Besuch kurz bei uns, damit wir dich gut empfangen koennen.':
        'Please get in touch briefly before your first visit so we can welcome you properly.',
      'Links': 'Links',
      'Partnerdojos, Wegbegleiter und hilfreiche externe Seiten rund um unser Netzwerk.':
        'Partner dojos, companions and useful external pages across our network.',
      'Foto-Galerie': 'Photo gallery',
      'Einblicke ins Dojo, in Lehrgaenge und in unser gemeinsames Training.':
        'Insights into the dojo, seminars and our training together.',
      'Die Galerie wird gerade kuratiert. Sobald die ersten Bildserien vorbereitet sind, findest du sie hier gesammelt mit kurzen Rueckblicken und Kontext zu den jeweiligen Veranstaltungen.':
        'The gallery is currently being curated. As soon as the first photo sets are ready, you will find them collected here with short recaps and context for the respective events.',
      'Demnaechst geplant': 'Coming next',
      'Training im Dojo': 'Training in the dojo',
      'Momentaufnahmen aus regulaeren Einheiten und Grundlagenarbeit.':
        'Snapshots from regular sessions and basics work.',
      'Lehrgaenge': 'Seminars',
      'Rueckblicke auf Seminare, Gasttrainer:innen und besondere Wochenenden.':
        'Recaps of seminars, guest instructors and special weekends.',
      'Vereinsleben': 'Club life',
      'Impressionen aus Begegnung, Austausch und gemeinsamen Momenten neben der Matte.':
        'Impressions from meetings, exchange and shared moments off the mat.',
      'Impressum & Datenschutz': 'Legal notice & privacy',
      'Verein': 'Club',
      'Verantwortliche Personen': 'Responsible persons',
      'Trainingsort & Kontakt': 'Training venue & contact',
      'Haftungshinweis': 'Liability notice',
      'Trotz sorgfaeltiger inhaltlicher Kontrolle uebernehmen wir keine Haftung fuer die Inhalte externer Links. Fuer den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich.':
        'Despite careful checking of content, we accept no liability for the content of external links. The operators of the linked pages are solely responsible for their content.',
      'Datenschutz': 'Privacy',
      'Diese Webseite dient der Information ueber den Verein. Bei einer Kontaktaufnahme per E-Mail oder Telefon werden die uebermittelten Angaben ausschliesslich zur Bearbeitung der Anfrage verwendet.':
        'This website serves to provide information about the club. If you contact us by email or phone, the transmitted details are used exclusively to handle your request.',
      'Urheberrecht': 'Copyright',
      'Die Inhalte dieser Webseite, einschliesslich Texte, Gestaltung und bereitgestellte Dokumente, unterliegen dem Urheberrecht, soweit nicht anders gekennzeichnet.':
        'The contents of this website, including texts, design and provided documents, are subject to copyright unless stated otherwise.',
      'Externe Links': 'External links',
      'Telefon:': 'Phone:',
      'E-Mail:': 'Email:',
      'ZVR-Zahl:': 'Association register no.:',
      'Obmann:': 'Chairman:',
      '2. Vorstand:': 'Vice chairman:',
      'Kassier:': 'Treasurer:',
      'Trainingsort:': 'Training venue:',
      'Google Maps:': 'Google Maps:',
      'Trainingsort oeffnen': 'Open training venue',
      'Obmann': 'Chairman',
      '2. Vorstand': 'Vice chairman',
      'Kassier': 'Treasurer',
      'Oesterreich': 'Austria',
      'Deutschland': 'Germany',
      'Fragen zum Training, Verein oder zu kommenden Terminen? Wir freuen uns auf deine Nachricht.':
        'Questions about training, the club or upcoming events? We look forward to your message.',
      'Schnell erreichbar': 'Quick contact',
      'E-Mail schreiben': 'Write an email',
      'Anrufen': 'Call',
      'Route oeffnen': 'Open route',
      'Direkter Kontakt': 'Direct contact',
      'Mail': 'Mail',
      'Telefon': 'Phone',
      'Ort': 'Location',
      'Ansprechpartner': 'Contacts',
      'Google Maps': 'Google Maps',
      'Die Halle liegt in Duttendorf in der Gemeinde Hochburg-Ach. Ueber Google Maps kannst du die Route direkt oeffnen.':
        'The hall is in Duttendorf in the municipality of Hochburg-Ach. You can open the route directly in Google Maps.',
      'Schreib uns': 'Write to us',
      'Wenn du bei einem Training vorbeischauen oder Fragen zu Lehrgaengen hast, melde dich einfach direkt per E-Mail.':
        'If you would like to visit a training session or have questions about seminars, simply contact us directly by email.',
      'Aktuelles & Termine': 'Updates & Events',
      'Kurze Neuigkeiten, kommende Lehrgaenge und die gesamte Chronik findest du hier in einer gemeinsamen Uebersicht.':
        'Short news items, upcoming seminars and the full history are collected here in one overview.',
      'Alle Eintraege sind chronologisch nach Datum geordnet. Termine fuehren zu ihrer Ausschreibung oder zu einer Detailseite, kurze News bleiben kompakt und schnell lesbar.':
        'All entries are arranged chronologically by date. Events lead to their brochure or a detail page, while short news items remain compact and quick to read.',
      'Kurzmeldungen': 'Brief updates',
      'Weiter lesen': 'Read more',
      'Aktuell gibt es keine Kurzmeldung aus den letzten sieben Tagen. Aeltere Beitraege stehen unten in der Chronik.':
        'There is currently no short update from the last seven days. Older entries can be found below in the archive.',
      'Kommende Termine': 'Upcoming events',
      'Chronik': 'Archive',
      'Termin': 'Event',
      'Aktuelles': 'Update',
      'Termine': 'Events',
      'Kalender, Timeline und Ausschreibungen fuer Lehrgaenge und besondere Trainings findest du gesammelt auf dieser Seite.':
        'Calendar, timeline and brochures for seminars and special training sessions are collected on this page.',
      'Klicke auf einen markierten Tag. Die passende Terminbeschreibung oeffnet sich sofort links, ohne dass die Seite neu geladen werden muss.':
        'Click on a marked day. The matching event description opens immediately on the left without reloading the page.',
      'Als Naechstes': 'Coming up',
      'Zur Ausschreibung': 'View details',
      'Schnellansicht': 'Quick view',
      'Kalender': 'Calendar',
      'Termin Details': 'Event details',
      'Lehrgang': 'Seminar',
      'Besonderes Event': 'Special event',
      'Zeit': 'Time',
      'Personen': 'People',
      'siehe Ausschreibung': 'see brochure',
      'wird bekanntgegeben': 'to be announced',
      'Seite oeffnen': 'Open page',
      'Details': 'Details',
      'Vorschau': 'Preview',
      'An diesem Tag ist kein Termin eingetragen.': 'There is no event scheduled for this day.',
      'Markierte Tage enthalten einen oder mehrere Termine.': 'Highlighted days contain one or more events.',
      'Heute': 'Today',
      'Mo': 'Mon',
      'Di': 'Tue',
      'Mi': 'Wed',
      'Do': 'Thu',
      'Fr': 'Fri',
      'Sa': 'Sat',
      'So': 'Sun',
      'Timeline': 'Timeline',
      'Seite': 'Page',
      'Popup': 'Popup',
      'Popup oeffnen': 'Open popup',
      'Laden...': 'Loading...',
      'Zur Uebersicht': 'Back to overview',
      'PDF Deutsch': 'PDF German',
      'Seite nicht gefunden': 'Page not found',
      'Die gesuchte Seite existiert nicht oder wurde verschoben.': 'The page you are looking for does not exist or has been moved.',
      'Zur Startseite': 'Back to home',
      'Neue Trainingszeiten': 'New training times',
      'Montag 18:00-19:30, Freitag mit Vertiefung ab 16:00 und Samstag Waffen in ungeraden Wochen.':
        'Monday 18:00-19:30, Friday with review from 16:00 and Saturday weapons practice on odd weeks.',
      'Ab 2026 gelten folgende Trainingszeiten:': 'The following training times apply from 2026 onward:',
      'Montag: 18:00 bis 19:30': 'Monday: 18:00 to 19:30',
      'Freitag: 16:00 bis 17:00 Fragen und Vertiefung': 'Friday: 16:00 to 17:00 questions and review',
      'Freitag: 17:00 bis 18:30 Training': 'Friday: 17:00 to 18:30 practice',
      'Samstag: 10:00 bis 12:00 Waffentraining in den ungeraden Wochen': 'Saturday: 10:00 to 12:00 weapons practice on odd weeks',
      'Bitte nimm vor einem ersten Besuch Kontakt mit uns auf, damit wir dich gut einplanen koennen.':
        'Please contact us before your first visit so we can plan well for you.',
      'Trainingsbetrieb findet statt': 'Training is taking place',
      'Alle regulaeren Einheiten finden derzeit wie geplant statt.': 'All regular sessions are currently taking place as planned.',
      'Alle regulaeren Einheiten in Duttendorf finden derzeit wie geplant statt.': 'All regular sessions in Duttendorf are currently taking place as planned.',
      'Wir freuen uns auf das Training am Montag, die Einheiten am Freitag und das Waffentraining in den ungeraden Wochen.':
        'We are looking forward to Monday training, the Friday sessions and weapons practice on odd weeks.',
      'Wenn sich an Uhrzeiten oder Orten etwas aendert, aktualisieren wir den Hinweis direkt in der Chronik.':
        'If times or locations change, we will update the note directly in the archive.',
      'Weihnachtstraining': 'Christmas training',
      'Gemeinsames Abschlusstraining mit anschliessender Feier.': 'Shared final training session followed by a celebration.',
      'Gemeinsames Abschlusstraining mit anschliessender kleiner Feier zum Jahresabschluss.':
        'Shared final training session with a small year-end celebration afterwards.',
      'Lehrgang mit Daniel und Sonia Toutain': 'Seminar with Daniel and Sonia Toutain',
      'Zweitaegiger Lehrgang in Hochburg-Ach am 12. und 13. September 2026.':
        'Two-day seminar in Hochburg-Ach on 12 and 13 September 2026.',
      'Am 12. und 13. September 2026 findet in Hochburg-Ach ein Lehrgang mit Daniel und Sonia Toutain statt.':
        'A seminar with Daniel and Sonia Toutain will take place in Hochburg-Ach on 12 and 13 September 2026.',
      'Trainiert wird in der Mehrzweckhalle der neuen Mittelschule in Duttendorf.':
        'Training will take place in the multipurpose hall of the new middle school in Duttendorf.',
      'Die Ausschreibung steht auf Deutsch und Englisch als PDF bereit. Ueber die Vorschau kann sie direkt im Browser geoeffnet werden.':
        'The brochure is available as a PDF in German and English. You can open it directly in the browser via preview.',
      'Ushi Deshi mit Daniel und Sonia Toutain': 'Ushi Deshi with Daniel and Sonia Toutain',
      'Ushi Deshi in Birach vom 14. bis 18. September 2026.': 'Ushi Deshi in Birach from 14 to 18 September 2026.',
      'Vom 14. bis 18. September 2026 findet in Birach ein Ushi Deshi mit Daniel und Sonia Toutain statt.':
        'From 14 to 18 September 2026, an Ushi Deshi with Daniel and Sonia Toutain will take place in Birach.',
      'Geplant ist eine intensive Trainingswoche mit taeglichen Einheiten und gemeinsamer Zeit vor Ort.':
        'An intensive training week with daily sessions and shared time on site is planned.',
      'Die Ausschreibung ist bereits auf Deutsch und Englisch verlinkt und kann direkt als PDF geoeffnet oder heruntergeladen werden.':
        'The brochure is already linked in German and English and can be opened or downloaded directly as a PDF.',
      'nach Trainingsplan': 'according to schedule',
    },
    fr: {
      'Ueber uns': 'A propos de nous',
      'Kontakt': 'Contact',
      'Ruhe': 'Calme',
      'Bewegung': 'Mouvement',
      'Praesenz': 'Presence',
      'Traditionelles Aikido in Duttendorf. Offen fuer Einsteiger:innen, Wiedereinsteiger:innen und alle, die Bewegung, Konzentration und ruhiges Miteinander suchen.':
        'Aikido traditionnel a Duttendorf. Ouvert aux debutant:e:s, aux pratiquant:e:s de retour et a toutes les personnes qui cherchent mouvement, concentration et calme ensemble.',
      'Woher kommt Aikido?': 'D ou vient l Aikido ?',
      'Aikido wurde von Ueshiba Morihei entwickelt und verbindet Kampfkunst, Koerperarbeit und einen Weg der inneren Haltung.':
        'L Aikido a ete developpe par Ueshiba Morihei et unit art martial, travail du corps et cheminement interieur.',
      'O-Sensei Ueshiba Morihei (1883 bis 1969) hat Aikido ab den 1920er Jahren aus verschiedenen traditionellen Budo- und Jujutsu-Schulen heraus entwickelt. Die heute bekannte Form entstand nicht auf einmal, sondern durch jahrzehntelanges Training, Forschen und Verfeinern.':
        'O-Sensei Ueshiba Morihei (1883 a 1969) a developpe l Aikido a partir des annees 1920 en s appuyant sur plusieurs ecoles traditionnelles de Budo et de Jujutsu. La forme connue aujourd hui n est pas apparue d un seul coup, mais par des decennies d entrainement, de recherche et d affinage.',
      'Wesentlich ist die Idee, einen Angriff nicht hart gegen hart zu stoppen, sondern ihn aufzunehmen, umzulenken und in eine kreisfoermige Bewegung zu ueberfuehren. Dadurch entsteht Kontrolle ohne unnoetige Haerte.':
        'L idee essentielle est de ne pas stopper une attaque par la durete contre la durete, mais de la recevoir, de la rediriger et de la conduire dans un mouvement circulaire. Cela cree du controle sans durete inutile.',
      'Aikido versteht Technik, Aufmerksamkeit und Haltung als Einheit. Genau darin liegt fuer viele Menschen der besondere Reiz: Es ist eine Kampfkunst mit klarer Form und zugleich ein Weg, Praesenz, Verbindung und Ruhe zu trainieren.':
        'L Aikido considere technique, attention et posture comme une unite. C est justement ce qui fait son attrait pour beaucoup de personnes : un art martial a la forme claire et en meme temps un chemin pour entrainer presence, lien et calme.',
      'Was ist Aikido?': 'Qu est-ce que l Aikido ?',
      'Aikido ist eine japanische Kampfkunst, in der Bewegung, Timing und Koerperzentrum wichtiger sind als Kraft oder Konkurrenz.':
        'L Aikido est un art martial japonais dans lequel le mouvement, le timing et le centre du corps sont plus importants que la force ou la concurrence.',
      'Im Training arbeiten wir mit Partneruebungen, Falltechnik, Hebeln, Wuerfen und klaren Grundformen. Angriffe werden nicht frontal geblockt, sondern ueber Linien, Winkel und Kreisbewegungen aufgenommen.':
        'A l entrainement, nous travaillons avec des exercices a deux, des chutes, des clefs, des projections et des bases claires. Les attaques ne sont pas bloquees de face, mais recues par des lignes, des angles et des mouvements circulaires.',
      'Abgerundet wird das Training durch Buki Waza, also das Ueben mit Holzschwert, Stock und Holzmesser. Dadurch werden Distanz, Haltung und Verbindung noch klarer erfahrbar.':
        'L entrainement est complete par le Buki Waza, c est-a-dire la pratique avec sabre en bois, baton et couteau en bois. Cela rend la distance, la posture et le lien encore plus tangibles.',
      'Unser Dojo orientiert sich an der Lehre von Saito Morihiro Sensei und pflegt eine ruhige, konzentrierte Trainingskultur ohne Leistungsdruck.':
        'Notre dojo suit l enseignement de Saito Morihiro Sensei et cultive une pratique calme et concentree sans pression de performance.',
      'Fuer wen ist Aikido?': 'Pour qui est l Aikido ?',
      'Aikido ist fuer Menschen jeden Alters geeignet. Du brauchst keine Vorkenntnisse, nur Neugier und Offenheit.':
        'L Aikido convient aux personnes de tout age. Il ne faut aucune experience prealable, seulement de la curiosite et de l ouverture.',
      'Bewegung ohne Druck': 'Mouvement sans pression',
      'Ideal fuer alle, die harmonische Bewegung ohne Wettkampf oder Konkurrenz suchen.':
        'Ideal pour toutes les personnes qui cherchent un mouvement harmonieux sans competition.',
      'Ruhe im Alltag': 'Calme au quotidien',
      'Ein konzentrierter Gegenpol zu einem hektischen Tagesrhythmus.':
        'Un contrepoint concentre a un rythme de journee agite.',
      'Balance und Stabilitaet': 'Equilibre et stabilite',
      'Foerdert Koerperbewusstsein, Praesenz und eine klare, aufrechte Bewegung.':
        'Favorise la conscience du corps, la presence et un mouvement clair et droit.',
      'Dojo-Kultur erleben': 'Decouvrir la culture du dojo',
      'Spannend fuer Menschen mit Interesse an japanischer Kampfkunst, Etikette und Tradition.':
        'Passionnant pour les personnes interessees par les arts martiaux japonais, l etiquette et la tradition.',
      'Neugierig geworden?': 'Curieux ?',
      'Wenn du ein Probetraining machen moechtest, melde dich kurz bei uns. Trainingsort, Ablauf und erste Hinweise findest du auf unseren Ueber-uns- und Kontaktseiten.':
        'Si tu souhaites faire un cours d essai, envoie-nous simplement un message. Tu trouveras le lieu, le deroulement et les premieres informations sur nos pages A propos et Contact.',
      'Zum Trainingsort': 'Vers le lieu d entrainement',
      'Der Verein wurde am 10. Februar 2026 gegruendet und steht fuer traditionelles Aikido mit ruhiger, praeziser Trainingskultur.':
        'Le club a ete fonde le 10 fevrier 2026 et represente un Aikido traditionnel avec une culture d entrainement calme et precise.',
      'Unsere Ausrichtung ist durch die Arbeit, den Austausch und die Inspiration von Edmund Kern sowie Daniel Toutain gepraegt. Im Mittelpunkt stehen saubere Grundlagen, Verbindung, Haltung und ein freundliches Miteinander auf und neben der Matte.':
        'Notre orientation est marquee par le travail, l echange et l inspiration d Edmund Kern et de Daniel Toutain. Au centre se trouvent des bases propres, le lien, la posture et une atmosphere amicale sur et hors du tatami.',
      'Trainingsort': 'Lieu d entrainement',
      'Mehrzweckhalle der neuen Mittelschule': 'Salle polyvalente de la nouvelle ecole moyenne',
      'Der Trainingsort liegt in Duttendorf in der Gemeinde Hochburg-Ach. Ueber Google Maps kannst du die Route direkt oeffnen.':
        'Le lieu d entrainement se trouve a Duttendorf dans la commune de Hochburg-Ach. Tu peux ouvrir directement l itineraire via Google Maps.',
      'In Google Maps oeffnen': 'Ouvrir dans Google Maps',
      'Probetraining': 'Cours d essai',
      'Ein Probetraining ist nach kurzer Anmeldung jederzeit moeglich.':
        'Un cours d essai est possible a tout moment apres une courte inscription.',
      'Bitte nimm vorher Kontakt mit uns auf, damit wir dich gut empfangen koennen. Fuer das erste Training reichen lange Sportbekleidung oder ein Trainingsanzug sowie Hausschuhe. Trainiert wird barfuss oder in rutschfesten Socken.':
        'Merci de nous contacter avant afin que nous puissions bien t accueillir. Pour le premier entrainement, une tenue de sport longue ou un survetement ainsi que des chaussures d interieur suffisent. L entrainement se fait pieds nus ou avec des chaussettes antiderapantes.',
      'Kontakt aufnehmen': 'Prendre contact',
      'Trainer': 'Enseignant',
      'Christian begann seine Aikido-Laufbahn 2004 in Steyr. In Hochburg-Ach begleitet er das Training mit ruhiger, genauer Arbeit an Grundlagen, Haltung und Verbindung.':
        'Christian a commence son parcours d Aikido en 2004 a Steyr. A Hochburg-Ach, il accompagne l entrainement avec un travail calme et precis sur les bases, la posture et le lien.',
      'Etikette': 'Etiquette',
      'Wir trainieren aufmerksam, respektvoll und ohne Leistungsdruck. Vor dem Betreten der Matte gruessen wir kurz an, Schmuck wird abgelegt und Fragen sind jederzeit willkommen.':
        'Nous nous entrainons avec attention, respect et sans pression de performance. Avant d entrer sur le tatami, nous saluons brievement, les bijoux sont retires et les questions sont toujours bienvenues.',
      'Unser Training folgt der Lehre von Saito Morihiro Sensei und verbindet Koerperarbeit, Aufmerksamkeit und Waffentraining.':
        'Notre entrainement suit l enseignement de Saito Morihiro Sensei et unit travail du corps, attention et armes.',
      'Was erwartet dich?': 'Qu est-ce qui t attend ?',
      'Aikido ist eine japanische Kampfkunst, deren Koerpertechniken auf klassischen Schulen wie Yagyu-ryu und Daito-ryu Jujutsu beruhen. Statt sich einem Angriff frontal entgegenzustellen, wird er ueber Winkel, Distanz und Kreisbewegungen aufgenommen.':
        'L Aikido est un art martial japonais dont les techniques corporelles reposent sur des ecoles classiques comme le Yagyu-ryu et le Daito-ryu Jujutsu. Au lieu d affronter une attaque de front, elle est recue par les angles, la distance et les mouvements circulaires.',
      'Zum Training gehoeren Grundformen, Partnerarbeit, Falltechnik, Hebel und Wuerfe. Ziel ist es, Kontrolle und Verbindung zu entwickeln, ohne unnoetige Haerte einzusetzen.':
        'L entrainement comprend des bases, du travail a deux, des chutes, des clefs et des projections. L objectif est de developper controle et lien sans durete inutile.',
      'Ergaenzt wird das Taijutsu durch Buki Waza mit Holzschwert, Stock und Holzmesser. Dadurch werden Linien, Timing und Zentrierung noch klarer erfahrbar.':
        'Le Taijutsu est complete par le Buki Waza avec sabre en bois, baton et couteau en bois. Les lignes, le timing et le centrage deviennent ainsi encore plus perceptibles.',
      'Trainingszeiten': 'Horaires d entrainement',
      'Montag': 'Lundi',
      'Freitag': 'Vendredi',
      'Samstag': 'Samedi',
      'Training': 'Entrainement',
      'Fragen und Vertiefung': 'Questions et approfondissement',
      'Waffentraining in ungeraden Wochen': 'Entrainement aux armes les semaines impaires',
      'Unsere regulaeren Einheiten finden in der Mehrzweckhalle der neuen Mittelschule in Duttendorf statt.':
        'Nos seances regulieres ont lieu dans la salle polyvalente de la nouvelle ecole moyenne a Duttendorf.',
      'Wochenuebersicht': 'Vue hebdomadaire',
      'Bitte melde dich vor einem ersten Besuch kurz bei uns, damit wir dich gut empfangen koennen.':
        'Merci de nous contacter avant une premiere visite afin que nous puissions bien t accueillir.',
      'Links': 'Liens',
      'Partnerdojos, Wegbegleiter und hilfreiche externe Seiten rund um unser Netzwerk.':
        'Dojos partenaires, compagnons de route et pages externes utiles autour de notre reseau.',
      'Foto-Galerie': 'Galerie photo',
      'Einblicke ins Dojo, in Lehrgaenge und in unser gemeinsames Training.':
        'Apercus du dojo, des stages et de notre entrainement commun.',
      'Die Galerie wird gerade kuratiert. Sobald die ersten Bildserien vorbereitet sind, findest du sie hier gesammelt mit kurzen Rueckblicken und Kontext zu den jeweiligen Veranstaltungen.':
        'La galerie est actuellement en cours de preparation. Des que les premieres series d images seront pretes, tu les trouveras ici avec de courts retours et du contexte sur les evenements correspondants.',
      'Demnaechst geplant': 'Bientot prevu',
      'Training im Dojo': 'Entrainement au dojo',
      'Momentaufnahmen aus regulaeren Einheiten und Grundlagenarbeit.':
        'Instantanes de seances regulieres et du travail des bases.',
      'Lehrgaenge': 'Stages',
      'Rueckblicke auf Seminare, Gasttrainer:innen und besondere Wochenenden.':
        'Retours sur les seminaires, les enseignant:e:s invites et les week-ends particuliers.',
      'Vereinsleben': 'Vie du club',
      'Impressionen aus Begegnung, Austausch und gemeinsamen Momenten neben der Matte.':
        'Impressions de rencontres, d echanges et de moments partages hors du tatami.',
      'Impressum & Datenschutz': 'Mentions legales & confidentialite',
      'Verein': 'Club',
      'Verantwortliche Personen': 'Personnes responsables',
      'Trainingsort & Kontakt': 'Lieu d entrainement & contact',
      'Haftungshinweis': 'Avis de responsabilite',
      'Trotz sorgfaeltiger inhaltlicher Kontrolle uebernehmen wir keine Haftung fuer die Inhalte externer Links. Fuer den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich.':
        'Malgre un controle soigneux du contenu, nous n assumons aucune responsabilite pour le contenu des liens externes. Les exploitants des pages liees en sont seuls responsables.',
      'Datenschutz': 'Confidentialite',
      'Diese Webseite dient der Information ueber den Verein. Bei einer Kontaktaufnahme per E-Mail oder Telefon werden die uebermittelten Angaben ausschliesslich zur Bearbeitung der Anfrage verwendet.':
        'Ce site sert a informer sur le club. En cas de prise de contact par e-mail ou telephone, les donnees transmises sont utilisees exclusivement pour traiter la demande.',
      'Urheberrecht': 'Droit d auteur',
      'Die Inhalte dieser Webseite, einschliesslich Texte, Gestaltung und bereitgestellte Dokumente, unterliegen dem Urheberrecht, soweit nicht anders gekennzeichnet.':
        'Les contenus de ce site, y compris les textes, la mise en page et les documents fournis, sont proteges par le droit d auteur sauf indication contraire.',
      'Externe Links': 'Liens externes',
      'Telefon:': 'Telephone :',
      'E-Mail:': 'E-mail :',
      'ZVR-Zahl:': 'Numero d association :',
      'Obmann:': 'President :',
      '2. Vorstand:': 'Vice-president :',
      'Kassier:': 'Tresorier :',
      'Trainingsort:': 'Lieu d entrainement :',
      'Google Maps:': 'Google Maps :',
      'Trainingsort oeffnen': 'Ouvrir le lieu d entrainement',
      'Obmann': 'President',
      '2. Vorstand': 'Vice-president',
      'Kassier': 'Tresorier',
      'Oesterreich': 'Autriche',
      'Deutschland': 'Allemagne',
      'Fragen zum Training, Verein oder zu kommenden Terminen? Wir freuen uns auf deine Nachricht.':
        'Des questions sur l entrainement, le club ou les evenements a venir ? Nous nous rejouissons de ton message.',
      'Schnell erreichbar': 'Contact rapide',
      'E-Mail schreiben': 'Ecrire un e-mail',
      'Anrufen': 'Appeler',
      'Route oeffnen': 'Ouvrir l itineraire',
      'Direkter Kontakt': 'Contact direct',
      'Mail': 'Mail',
      'Telefon': 'Telephone',
      'Ort': 'Lieu',
      'Ansprechpartner': 'Contacts',
      'Google Maps': 'Google Maps',
      'Die Halle liegt in Duttendorf in der Gemeinde Hochburg-Ach. Ueber Google Maps kannst du die Route direkt oeffnen.':
        'La salle se trouve a Duttendorf dans la commune de Hochburg-Ach. Tu peux ouvrir directement l itineraire via Google Maps.',
      'Schreib uns': 'Ecris-nous',
      'Wenn du bei einem Training vorbeischauen oder Fragen zu Lehrgaengen hast, melde dich einfach direkt per E-Mail.':
        'Si tu veux assister a un entrainement ou si tu as des questions sur les stages, contacte-nous simplement par e-mail.',
      'Aktuelles & Termine': 'Actualites & evenements',
      'Kurze Neuigkeiten, kommende Lehrgaenge und die gesamte Chronik findest du hier in einer gemeinsamen Uebersicht.':
        'Tu trouveras ici, dans une vue commune, les nouvelles breves, les stages a venir et toute la chronologie.',
      'Alle Eintraege sind chronologisch nach Datum geordnet. Termine fuehren zu ihrer Ausschreibung oder zu einer Detailseite, kurze News bleiben kompakt und schnell lesbar.':
        'Toutes les entrees sont classees chronologiquement par date. Les evenements menent a leur brochure ou a une page detaillee, les breves restent compactes et rapides a lire.',
      'Kurzmeldungen': 'Breves',
      'Weiter lesen': 'Lire la suite',
      'Aktuell gibt es keine Kurzmeldung aus den letzten sieben Tagen. Aeltere Beitraege stehen unten in der Chronik.':
        'Il n y a actuellement aucune breve des sept derniers jours. Les publications plus anciennes se trouvent plus bas dans la chronologie.',
      'Kommende Termine': 'Evenements a venir',
      'Chronik': 'Chronologie',
      'Termin': 'Evenement',
      'Aktuelles': 'Actualite',
      'Termine': 'Evenements',
      'Kalender, Timeline und Ausschreibungen fuer Lehrgaenge und besondere Trainings findest du gesammelt auf dieser Seite.':
        'Calendrier, timeline et brochures pour les stages et entrainements particuliers sont reunis sur cette page.',
      'Klicke auf einen markierten Tag. Die passende Terminbeschreibung oeffnet sich sofort links, ohne dass die Seite neu geladen werden muss.':
        'Clique sur un jour marque. La description correspondante s ouvre aussitot a gauche sans recharger la page.',
      'Als Naechstes': 'A venir',
      'Zur Ausschreibung': 'Voir la brochure',
      'Schnellansicht': 'Vue rapide',
      'Kalender': 'Calendrier',
      'Termin Details': 'Details de l evenement',
      'Lehrgang': 'Stage',
      'Besonderes Event': 'Evenement special',
      'Zeit': 'Heure',
      'Personen': 'Personnes',
      'siehe Ausschreibung': 'voir la brochure',
      'wird bekanntgegeben': 'sera annonce',
      'Seite oeffnen': 'Ouvrir la page',
      'Details': 'Details',
      'Vorschau': 'Apercu',
      'An diesem Tag ist kein Termin eingetragen.': 'Aucun evenement n est inscrit pour ce jour.',
      'Markierte Tage enthalten einen oder mehrere Termine.': 'Les jours marques contiennent un ou plusieurs evenements.',
      'Heute': 'Aujourd hui',
      'Mo': 'Lu',
      'Di': 'Ma',
      'Mi': 'Me',
      'Do': 'Je',
      'Fr': 'Ve',
      'Sa': 'Sa',
      'So': 'Di',
      'Timeline': 'Timeline',
      'Seite': 'Page',
      'Popup': 'Popup',
      'Popup oeffnen': 'Ouvrir le popup',
      'Laden...': 'Chargement...',
      'Zur Uebersicht': 'Retour a la vue d ensemble',
      'PDF Deutsch': 'PDF allemand',
      'Seite nicht gefunden': 'Page introuvable',
      'Die gesuchte Seite existiert nicht oder wurde verschoben.': 'La page recherchee n existe pas ou a ete deplacee.',
      'Zur Startseite': 'Retour a l accueil',
      'Neue Trainingszeiten': 'Nouveaux horaires d entrainement',
      'Montag 18:00-19:30, Freitag mit Vertiefung ab 16:00 und Samstag Waffen in ungeraden Wochen.':
        'Lundi 18:00-19:30, vendredi avec approfondissement a partir de 16:00 et samedi armes les semaines impaires.',
      'Ab 2026 gelten folgende Trainingszeiten:': 'Les horaires suivants s appliquent a partir de 2026 :',
      'Montag: 18:00 bis 19:30': 'Lundi : 18:00 a 19:30',
      'Freitag: 16:00 bis 17:00 Fragen und Vertiefung': 'Vendredi : 16:00 a 17:00 questions et approfondissement',
      'Freitag: 17:00 bis 18:30 Training': 'Vendredi : 17:00 a 18:30 entrainement',
      'Samstag: 10:00 bis 12:00 Waffentraining in den ungeraden Wochen': 'Samedi : 10:00 a 12:00 armes les semaines impaires',
      'Bitte nimm vor einem ersten Besuch Kontakt mit uns auf, damit wir dich gut einplanen koennen.':
        'Merci de nous contacter avant une premiere visite afin que nous puissions bien t integrer a l organisation.',
      'Trainingsbetrieb findet statt': 'Les entrainements ont lieu',
      'Alle regulaeren Einheiten finden derzeit wie geplant statt.': 'Toutes les seances regulieres ont actuellement lieu comme prevu.',
      'Alle regulaeren Einheiten in Duttendorf finden derzeit wie geplant statt.': 'Toutes les seances regulieres a Duttendorf ont actuellement lieu comme prevu.',
      'Wir freuen uns auf das Training am Montag, die Einheiten am Freitag und das Waffentraining in den ungeraden Wochen.':
        'Nous nous rejouissons de l entrainement du lundi, des seances du vendredi et des armes les semaines impaires.',
      'Wenn sich an Uhrzeiten oder Orten etwas aendert, aktualisieren wir den Hinweis direkt in der Chronik.':
        'Si des horaires ou des lieux changent, nous mettrons l information a jour directement dans la chronologie.',
      'Weihnachtstraining': 'Entrainement de Noel',
      'Gemeinsames Abschlusstraining mit anschliessender Feier.': 'Entrainement commun de fin d annee avec fete ensuite.',
      'Gemeinsames Abschlusstraining mit anschliessender kleiner Feier zum Jahresabschluss.':
        'Entrainement commun de fin d annee avec petite fete ensuite.',
      'Lehrgang mit Daniel und Sonia Toutain': 'Stage avec Daniel et Sonia Toutain',
      'Zweitaegiger Lehrgang in Hochburg-Ach am 12. und 13. September 2026.':
        'Stage de deux jours a Hochburg-Ach les 12 et 13 septembre 2026.',
      'Am 12. und 13. September 2026 findet in Hochburg-Ach ein Lehrgang mit Daniel und Sonia Toutain statt.':
        'Les 12 et 13 septembre 2026, un stage avec Daniel et Sonia Toutain aura lieu a Hochburg-Ach.',
      'Trainiert wird in der Mehrzweckhalle der neuen Mittelschule in Duttendorf.':
        'L entrainement aura lieu dans la salle polyvalente de la nouvelle ecole moyenne a Duttendorf.',
      'Die Ausschreibung steht auf Deutsch und Englisch als PDF bereit. Ueber die Vorschau kann sie direkt im Browser geoeffnet werden.':
        'La brochure est disponible en allemand et en anglais au format PDF. Elle peut etre ouverte directement dans le navigateur via l apercu.',
      'Ushi Deshi mit Daniel und Sonia Toutain': 'Ushi Deshi avec Daniel et Sonia Toutain',
      'Ushi Deshi in Birach vom 14. bis 18. September 2026.': 'Ushi Deshi a Birach du 14 au 18 septembre 2026.',
      'Vom 14. bis 18. September 2026 findet in Birach ein Ushi Deshi mit Daniel und Sonia Toutain statt.':
        'Du 14 au 18 septembre 2026, un Ushi Deshi avec Daniel et Sonia Toutain aura lieu a Birach.',
      'Geplant ist eine intensive Trainingswoche mit taeglichen Einheiten und gemeinsamer Zeit vor Ort.':
        'Une semaine intensive d entrainement avec des seances quotidiennes et du temps partage sur place est prevue.',
      'Die Ausschreibung ist bereits auf Deutsch und Englisch verlinkt und kann direkt als PDF geoeffnet oder heruntergeladen werden.':
        'La brochure est deja liee en allemand et en anglais et peut etre ouverte ou telechargee directement en PDF.',
      'nach Trainingsplan': 'selon les horaires',
    },
  };

  const EXACT_ATTRIBUTE_TRANSLATIONS = {
    en: {
      'Google Maps Trainingsort': 'Google Maps training venue',
      'Google Maps Standort': 'Google Maps location',
      'Vorheriger Monat': 'Previous month',
      'Naechster Monat': 'Next month',
      'Monat auswaehlen': 'Choose month',
      'Jahr auswaehlen': 'Choose year',
    },
    fr: {
      'Google Maps Trainingsort': 'Lieu d entrainement Google Maps',
      'Google Maps Standort': 'Position Google Maps',
      'Vorheriger Monat': 'Mois precedent',
      'Naechster Monat': 'Mois suivant',
      'Monat auswaehlen': 'Choisir le mois',
      'Jahr auswaehlen': 'Choisir l annee',
    },
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

  function interpolate(value, dataset = {}) {
    return String(value).replace(/\{(\w+)\}/g, (_, key) => dataset[key] ?? `{${key}}`);
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

    return typeof value === 'string' ? interpolate(value, dataset) : interpolate(fallback || key, dataset);
  }

  function translateExactText(value) {
    if (currentLang === DEFAULT_LANG) {
      return value;
    }

    const normalized = normalizeText(value);
    const translation = EXACT_TEXT_TRANSLATIONS[currentLang]?.[normalized];
    return translation || value;
  }

  function translateExactAttribute(value) {
    if (currentLang === DEFAULT_LANG) {
      return value;
    }

    const normalized = normalizeText(value);
    const translation = EXACT_ATTRIBUTE_TRANSLATIONS[currentLang]?.[normalized];
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

  function switchLanguage(lang) {
    if (!LANGUAGES[lang]) return;

    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    updateLanguageInUrl();
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

  function init() {
    currentLang = getInitialLanguage();
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
