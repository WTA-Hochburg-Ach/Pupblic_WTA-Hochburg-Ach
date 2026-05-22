# ANLEITUNG — Inhalte pflegen (Posts, Galerie, Assets, Übersetzungen)

Diese Anleitung beschreibt, wie neue Beiträge (News/Termine), Galerieeinträge, Bilder und Downloads strukturiert werden müssen, damit die Website korrekt funktioniert.

**Inhalt (kurz):**
- Wo Inhalte liegen
- Dateinamens- und Ordnerkonventionen
- Frontmatter-Felder für `news`
- Galerieeinträge (`src/data/gallery.ts`)
- Bilder, PDFs und Assets
- Übersetzungen / i18n
- Wichtige Befehle

---

## Wo liegen die Inhalte?

- News / Termine: `src/content/news/` (Unterordner: `YYYY/MM/nnn-slug.md` empfohlen)
- Statische Seiten: `src/content/pages/` (z.B. `index.md`, `ueber-uns.md`)
- Galerie-Index: `src/data/gallery.ts`
- Öffentliche Assets (Bilder, PDFs): `public/assets/` und `public/downloads/`
- Lokale Übersetzungsdateien: `src/locales/` und `public/locales/`

---

## Beiträge (News / Termine)

Datei-Standort und -Name
- Lege Beiträge unter `src/content/news/` an. Verwende eine Jahres-/Monats-Struktur, z.B.:
  `src/content/news/2026/09/001-lehrgang-daniel-sonia-toutain.md`
- Dateinamen: Kleinbuchstaben, Bindestriche, optional führende Nummern (`001_`) zur Sortierung.

Erforderliches Frontmatter
Das Projekt validiert Frontmatter über `src/content.config.ts`. Mindestens diese Felder sind relevant:

- `title` (string) — Überschrift
- `date` (Datum, Format `YYYY-MM-DD`) — Startdatum
- `endDate` (optional, Datum) — Enddatum für mehrtägige Events
- `preview` (optional, string) — Teasertext für Karten/Listen
- `type` (`news` | `event`) — Standard: `news`
- `display` (`page` | `modal`) — Standard: `page`
- `location` (optional, string)
- `time` (optional, string)
- `people` (optional, array of strings)
- `color` (`moss` | `sage` | `gold`) — Standard: `moss`
- `pdfs` (optional object) — `{ de?: '/downloads/file-de.pdf', en?: '/downloads/file-en.pdf' }`

Beispiel — einfache News:

---
````md
title: Trainingsbetrieb findet statt
date: 2026-04-23
preview: Alle regulären Einheiten finden derzeit wie geplant statt.
type: news
display: page
color: sage
````
---

Kurzer Fließtext mit Details.

Beispiel — Event mit Zeitraum und PDFs:

---
````md
title: Lehrgang mit Daniel und Sonia Toutain
date: 2026-09-12
endDate: 2026-09-13
preview: Zweitägiger Lehrgang in Hochburg-Ach.
type: event
location: Mehrzweckhalle der neuen Mittelschule, Duttendorf
display: modal
color: moss
pdfs:
  de: /downloads/lehrgang-hochburg-ach-de.pdf
  en: /downloads/lehrgang-hochburg-ach-en.pdf
````
---

Weitere Details zum Lehrgang.

Hinweise
- `date` und `endDate` werden als echte `Date`-Objekte verarbeitet — gültiges ISO-Datum verwenden.
- `preview` wird für Karten/Listen genutzt; halte ihn kurz (1–2 Sätze).
- Verlinke PDFs in `public/downloads/` und referenziere sie mit absoluten Pfaden ab Root (`/downloads/...`).

---

## Galerieeinträge (`src/data/gallery.ts`)

Die Galerie-Liste wird von `src/data/gallery.ts` geliefert. Jeder Eintrag hat diesen Typ:

```ts
export type GalleryEntry = {
  title: string;
  date: string; // 'YYYY-MM-DD'
  description: string;
  newsSlug?: string; // z.B. '2026/09/001-lehrgang-daniel-sonia-toutain'
  galleryHref?: string; // Pfad zu einer Fotogalerie (extern oder /assets/...) 
  coverImage?: string; // z.B. /assets/images/gallery/<slug>/cover.jpg
};
```

Bearbeitungsschritte
- Wenn ein Beitrag (Ausschreibung) existiert, setze `newsSlug` auf den Pfad ohne `.md` (Format: `YYYY/MM/nnn-slug`).
- `galleryHref` kann auf eine spezielle Galerie-URL oder ein Album verweisen.
- `coverImage` sollte ein Pfad in `public/assets/images/...` sein (relative Root-URL, also `/assets/…`).

Beispiel:

```ts
{
  title: 'Lehrgang mit Daniel und Sonia Toutain',
  date: '2026-09-12',
  description: 'Ausschreibung und spätere Eindrücke zum Lehrgang in Hochburg-Ach.',
  newsSlug: '2026/09/001-lehrgang-daniel-sonia-toutain',
  coverImage: '/assets/images/gallery/lehrgang-2026/cover.jpg',
  galleryHref: '/assets/images/gallery/lehrgang-2026/index.html'
}
```

Hinweis: Die Galerie-Komponente erzeugt Links zu `eventHref` (auf Basis von `newsSlug`) und zu `galleryHref`.

---

## Bilder, PDFs und sonstige Assets

- Bilder: Lege alle Bilder in `public/assets/images/` ab. Für Galerien empfehle ich Unterordner pro Event, z. B.:
  `public/assets/images/gallery/lehrgang-2026/cover.jpg`, `.../01.jpg`, `.../02.jpg`
- PDF-Downloads: `public/downloads/` — referenziere sie in Beiträgen mit `/downloads/DATEINAME.pdf`.
- Logos/Icons: `public/assets/images/logo/` oder bestehende Ordner verwenden.

Best Practices
- Dateinamen: Kleinbuchstaben, Bindestriche, keine Leerzeichen.
- Bildgrößen: Für Gallerie-Cover ca. 1600px breit, optimiert (WebP/JPEG) und `loading="lazy"` verwenden.
- Verwende sinnvolle `alt`-Texte, besonders für Inline-Bilder.

### Astro Image Component verwenden

Für bessere Performance solltest du lokale Bilder in `src/assets/` ablegen und über die Astro `Image`-Komponente importieren.

1. Datei in `src/assets/` ablegen.
2. In einer Astro-Komponente importieren:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image src={heroImage} alt="Hero-Bild" width={1200} height={600} />
```

3. Für Logos und Icons funktioniert das genauso:

```astro
import { Image } from 'astro:assets';
import logoDark from '../assets/logo_dark.svg';

<Image src={logoDark} alt="Logo" class="theme-logo" />
```

4. Für dekorative Grafiken nutze `loading="lazy"`:

```astro
import brush from '../assets/brush.svg';

<Image src={brush} alt="" class="footer-brush" loading="lazy" />
```

5. Für kritische Header-Bilder oder Logos kannst du `loading="eager"` setzen.

6. Wenn du ein bestehendes `<img src="/...">` findest, tausche es aus gegen:

```astro
import someImage from '../assets/some-image.jpg';
<Image src={someImage} alt="..." width={800} height={500} />
```

> Wichtig: Nutze `public/` nur für Dateien, die nicht von Astro optimiert werden müssen. Alle Bilder, die du optimieren willst, sollten idealerweise in `src/assets/` landen.

---

## Übersetzungen (i18n)

- Lokale Übersetzungen befinden sich in `src/locales/` (Quelltexte) und `public/locales/` (lokale JSON für die App).
- Wenn du UI-Texte ändern willst: `src/locales/{de,en,fr,ja}.json` anpassen.
- Automatische Übersetzungen / Helpers: `scripts/translate-i18n.mjs` prüfen.

Hinweis: Inhaltsübersetzungen (Posts) werden aktuell durch separate Beiträge/Zweige verwaltet — überprüfe, ob du zusätzliche `news`-Einträge für `en`/`fr` benötigst.

---

## Wichtige Befehle

Lokale Entwicklung:

```bash
npm run dev
```

Build (inkl. PDFs und Vorbereitung für Deploy):

```bash
npm run build
npm run preview
```

PDFs/Broschüren erzeugen:

```bash
npm run generate:brochures
```

Übersetzungen (falls vorhanden):

```bash
npm run translate-i18n
```

Cloudflare Workers (Dev / Deploy):

```bash
npm run worker:dev
npm run worker:deploy
```

---

## Pflegehinweise & Checkliste vor Veröffentlichung

- Dateiname & Ordnerstruktur prüfen: `src/content/news/YYYY/MM/nnn-slug.md`
- Frontmatter validieren: alle Pflichtfelder vorhanden (`title`, `date`, ggf. `type`).
- Bilder/PDFs in `public/` ablegen und Pfade prüfen (`/assets/...`, `/downloads/...`).
- `src/data/gallery.ts` anpassen, wenn Galerie vorhanden sein soll.
- `npm run dev` starten und Beitrag lokal prüfen (Seite `/news` bzw. `news/<slug>` aufrufen).
- Bei Übersetzungen: entsprechende Locale-Dateien updaten.

---

Wenn du möchtest, kann ich einen neuen Beitrag / Galerieneintrag als Template anlegen oder die Datei `gallery.ts` für einen neuen Event aktualisieren. Sage mir einfach welches Event/Datum/Titel und ich erledige das.

© Team — Anleitung zur Pflege der Website
