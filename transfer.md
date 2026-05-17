Für ein Astro-Projekt ist die sauberste Lösung normalerweise:

i18n-Struktur mit JSON/Markdown-Dateien
Automatische Übersetzung via DeepL/OpenAI/Google
Watcher-Hook beim npm run dev
Nur neue/geänderte Keys übersetzen

Damit bekommst du:

automatische Übersetzung ohne manuelles Eingreifen
kein erneutes Übersetzen aller Texte
stabile Schlüssel statt kaputter String-Erkennung
einfache Sprach-Toggles (de/en/fr)
Empfehlung: Astro + i18next/paraglide + Auto-Translate Script
Architektur
Beispielstruktur
src/
  locales/
    de.json
    en.json
    fr.json

de.json = Hauptsprache:

{
  "hero.title": "Willkommen",
  "hero.subtitle": "Meine Webseite"
}

en.json und fr.json werden automatisch erzeugt/ergänzt.

Warum NICHT direkte String-Erkennung im HTML?

Schlecht:

<h1>Willkommen</h1>

Besser:

<h1>{t("hero.title")}</h1>

Denn:

Änderungen können erkannt werden
fehlende Übersetzungen sind eindeutig
keine kaputten Regex-Parser
professioneller Standard
Beste technische Lösung
Option A — DeepL API (empfohlen)

DeepL API

Vorteile:

beste Übersetzungsqualität für DE/EN/FR
sehr natürlich
perfekt für Webseiten

Nachteil:

API-Key nötig
kostenlos begrenzt
Option B — OpenAI API

OpenAI API Platform

Gut wenn:

du schon OpenAI verwendest
Kontext wichtig ist
UI-Texte intelligenter formuliert werden sollen

Aber:

teurer
langsamer
für reine UI-Strings oft Overkill
Mein konkreter Vorschlag
Stack
Astro
i18next
eigenes Node-Script
DeepL API
chokidar File Watcher
Workflow
Beim npm run dev

Automatisch:

de.json lesen
prüfen welche Keys in en/fr fehlen
nur fehlende/geänderte Texte übersetzen
JSON-Dateien aktualisieren
Astro startet normal
Beispiel Implementation
Installation
npm install i18next chokidar dotenv

Für DeepL:

npm install deepl-node
.env
DEEPL_API_KEY=xxxx
scripts/translate.js
import fs from "fs";
import deepl from "deepl-node";

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

const de = JSON.parse(fs.readFileSync("./src/locales/de.json"));
const enPath = "./src/locales/en.json";
const frPath = "./src/locales/fr.json";

const en = fs.existsSync(enPath)
  ? JSON.parse(fs.readFileSync(enPath))
  : {};

const fr = fs.existsSync(frPath)
  ? JSON.parse(fs.readFileSync(frPath))
  : {};

async function translateMissing(targetObj, targetLang) {
  for (const key in de) {
    if (!targetObj[key] || targetObj[key]._source !== de[key]) {
      const result = await translator.translateText(
        de[key],
        "de",
        targetLang
      );

      targetObj[key] = {
        text: result.text,
        _source: de[key]
      };

      console.log(`${key} -> ${targetLang}`);
    }
  }
}

await translateMissing(en, "en-US");
await translateMissing(fr, "fr");

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(frPath, JSON.stringify(fr, null, 2));
package.json
{
  "scripts": {
    "translate": "node scripts/translate.js",
    "dev": "npm run translate && astro dev"
  }
}

Jetzt:

jedes npm run dev
erkennt neue/geänderte deutsche Texte
übersetzt automatisch
aktualisiert nur betroffene Keys
Noch besser: Live Watcher

Wenn du willst, dass während des Entwickelns SOFORT übersetzt wird:

npm install chokidar

Dann watchst du de.json.

Sobald gespeichert:

Übersetzung läuft
Dateien werden aktualisiert
Astro HMR refreshed automatisch

Das fühlt sich dann wie „magische“ automatische Übersetzung an.

Sehr wichtige Empfehlung
Niemals übersetzte Texte manuell editieren

Sonst überschreibt das Script deine Änderungen.

Besser:

de.json = Source of Truth
alle anderen Sprachen generiert
Alternative moderne Lösung
Paraglide JS

Sehr modern für:

Astro
Svelte
Next.js

Vorteile:

typsicher
sehr schnell
moderne i18n Architektur

Aber:

automatische Übersetzung musst du trotzdem selbst anbinden

Für dein Ziel würde ich trotzdem:

Paraglide + eigenes Übersetzungsscript
ODER
i18next + DeepL

nehmen.

Meine klare Empfehlung

Für dein Projekt:

Beste Kombination
Astro
DeepL API
JSON locale files
automatisches Node-Script
optional chokidar watcher

Das ist:

robust
skalierbar
professionell
billig
einfach wartbar

und exakt das, was viele echte Produktionsprojekte machen.