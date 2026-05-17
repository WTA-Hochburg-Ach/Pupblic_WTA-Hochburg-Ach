# Anleitung - Aikido Website bearbeiten

## Inhalt
1. Neue Eintraege fuer Aktuelles und Termine
2. Wichtige Inhalte bearbeiten
3. Lokale Befehle
4. Deployment auf Cloudflare Workers

## Neue Eintraege fuer Aktuelles und Termine

Neue Eintraege liegen in `src/content/news/`.

### Dateiname

Nutze sprechende Dateinamen in Kleinbuchstaben mit Bindestrichen.

- `sommer-lehrgang-2026.md`
- `trainingsinfo-mai-2026.md`

### Frontmatter

Jeder Eintrag braucht mindestens diese Felder:

```md
---
title: Titel des Eintrags
date: 2026-05-10
preview: Kurzer Vorschautext fuer Karten und Timeline.
type: news
display: page
color: sage
---
```

### Verfuegbare Felder

- `title`: Ueberschrift des Eintrags
- `date`: Startdatum im Format `JJJJ-MM-TT`
- `endDate`: optionales Enddatum fuer mehrtaegige Termine
- `preview`: kurzer Teasertext
- `type`: `news` oder `event`
- `display`: `page` oder `modal`
- `location`: optionaler Ort
- `color`: `moss`, `sage` oder `gold`
- `pdfs.de`: optionaler Link zu einer deutschen PDF
- `pdfs.en`: optionaler Link zu einer englischen PDF

### Typische Beispiele

Kurze Neuigkeit:

```md
---
title: Trainingsbetrieb findet statt
date: 2026-04-23
preview: Alle regulaeren Einheiten finden derzeit wie geplant statt.
type: news
display: page
color: sage
---

Kurzer Infotext fuer die Detailseite.
```

Termin mit PDF:

```md
---
title: Lehrgang mit Daniel und Sonia Toutain
date: 2026-09-12
endDate: 2026-09-13
preview: Zweitaegiger Lehrgang in Hochburg-Ach.
type: event
location: Mehrzweckhalle der neuen Mittelschule, Duttendorf
display: modal
color: moss
pdfs:
  de: /downloads/lehrgang-hochburg-ach-de.pdf
  en: /downloads/lehrgang-hochburg-ach-en.pdf
---

Weitere Details zum Lehrgang.
```

## Wichtige Inhalte bearbeiten

Statische Seiteninhalte liegen in `src/content/pages/`.

- `index.md`: Startseite
- `ueber-uns.md`: Verein, Trainingsort, Probetraining, Trainer
- `training.md`: Trainingsinhalt
- `trainingsplan.md`: Wochenuebersicht
- `impressum.md`: Impressum und Ansprechpartner

Navigation, Footer und Kontaktseite liegen direkt in Astro-Dateien:

- `src/components/Navigation.astro`
- `src/components/Footer.astro`
- `src/pages/kontakt.astro`

Zentrale Daten liegen in:

- `src/data/site.ts`
- `src/lib/news.ts`

## Lokale Befehle

```bash
npm run dev
```

Startet die Astro-Entwicklung.

```bash
npm run generate:brochures
```

Erzeugt die PDF-Dateien in `public/downloads/`.

```bash
npm run build
```

Raeumt den Build-Ordner auf, erzeugt die PDF-Dateien neu und baut die Website nach `dist/`.

```bash
npm run preview
```

Lokale Vorschau des Astro-Builds.

```bash
npm run worker:dev
```

Startet die Cloudflare-Workers-Vorschau ueber Wrangler.

```bash
npm run worker:deploy
```

Deployt die Website auf Cloudflare Workers.

## Deployment auf Cloudflare Workers

Die Website wird jetzt fuer `dist/` gebaut und ueber `wrangler.jsonc` plus `worker/index.js` ausgeliefert.

Wichtige Dateien:

- `astro.config.mjs`
- `wrangler.jsonc`
- `worker/index.js`

Der Worker liefert statische Dateien aus `dist/` aus und loest saubere URLs wie `/news` automatisch auf die passende HTML-Datei auf.
