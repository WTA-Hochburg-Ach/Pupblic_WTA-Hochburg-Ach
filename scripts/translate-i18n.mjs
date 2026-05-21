import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceLocaleDir = path.join(rootDir, 'src', 'locales');
const publicLocaleDir = path.join(rootDir, 'public', 'locales');
const sourceLocalePath = path.join(sourceLocaleDir, 'de.json');

const { activeLanguages } = await import('../src/data/site.ts');

const targetLanguages = Object.fromEntries(
  activeLanguages
    .filter((lang) => lang !== 'de')
    .map((lang) => {
      if (lang === 'en') return ['en', 'EN-US'];
      return [lang, lang.toUpperCase()];
    }),
);

let warnedMissingApiKey = false;

function readEnvFile() {
  return fs
    .readFile(path.join(rootDir, '.env'), 'utf8')
    .then((content) => {
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
          return;
        }

        const [rawKey, ...rawValue] = trimmed.split('=');
        const key = rawKey.trim();
        const value = rawValue.join('=').trim().replace(/^['"]|['"]$/g, '');

        if (key && process.env[key] === undefined) {
          process.env[key] = value;
        }
      });
    })
    .catch(() => {});
}

async function readJson(filePath, fallback = {}) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return fallback;
    }

    throw error;
  }
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function shouldCollectText(value) {
  const text = normalizeText(value);

  if (text.length < 2 || text.length > 2000) return false;
  if (!/[A-Za-zÄÖÜäöüß]/.test(text)) return false;
  if (/^(https?:|mailto:|tel:|\/|#|\.|_|\{|\[|\(|\)|'|"|,|import |export )/.test(text)) return false;
  if (/^(class|id|href|src|rel|type|data-|aria-|const|let|var)\b/.test(text)) return false;
  if (/^(common|nav|footer|meta|events|text|attr)\./.test(text)) return false;
  if (/\b(entry|item|linkedNews|baseUrl)\b/.test(text)) return false;
  if (/[?.]{2}|=>|\|\||&&|\?\?/.test(text)) return false;
  if (/\bwith[A-Z]\w+\(/.test(text)) return false;
  if (/\.(astro|css|js|ts|svg|png|jpe?g|webp|pdf|md|json|mjs)\b/i.test(text)) return false;
  if (/[{}<>=;`]/.test(text)) return false;
  if (/['"]\s*:/.test(text) || /:\s*['"]/.test(text)) return false;
  if (/^[\w-]+:[\w-]+$/.test(text)) return false;
  if (/^[a-z0-9_-]+$/.test(text)) return false;
  if (/^[A-Za-z0-9_-]{18,}$/.test(text)) return false;

  return true;
}

async function listFiles(dir, extensions, files = []) {
  let entries = [];

  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return files;
    throw error;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (['node_modules', '.astro', 'dist'].includes(entry.name)) continue;
      await listFiles(fullPath, extensions, files);
    } else if (extensions.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function addCandidate(set, value) {
  const text = normalizeText(value);
  if (shouldCollectText(text)) {
    set.add(text);
  }
}

function collectYamlStrings(content, set) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return;

  match[1].split(/\r?\n/).forEach((line) => {
    const value = line.match(/^\s*[\w-]+:\s*(.+?)\s*$/)?.[1];
    if (!value) return;

    addCandidate(set, value.replace(/^['"]|['"]$/g, ''));
  });
}

function collectQuotedStrings(content, set) {
  const stripped = content
    .replace(/import[\s\S]*?;$/gm, '')
    .replace(/from\s+['"][^'"]+['"]/g, '')
    .replace(/class:list=\{[\s\S]*?\}/g, '');

  const pattern = /(['"`])((?:\\.|(?!\1).){2,500})\1/g;
  let match;

  while ((match = pattern.exec(stripped))) {
    const value = match[2]
      .replace(/\\n/g, ' ')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/`/g, '');

    addCandidate(set, value);
  }
}

function collectHtmlText(content, set) {
  const stripped = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  const withoutTags = stripped
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/\n\s*\n/g, '|||') // Markdown paragraphs split
    .replace(/<[^>]+>/g, '|||') // HTML tags
    .replace(/\{[\s\S]*?\}/g, '|||') // Astro expressions
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');

  withoutTags.split('|||').forEach((block) => {
    const text = normalizeText(block);
    addCandidate(set, text);
  });
}

async function collectSourceTexts() {
  const files = await listFiles(path.join(rootDir, 'src'), ['.astro', '.md', '.ts']);
  const texts = new Set();

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8');

    if (filePath.endsWith('.md') || filePath.endsWith('.astro')) {
      collectYamlStrings(content, texts);
      collectHtmlText(content, texts);
    }
  }

  return [...texts].sort((a, b) => a.localeCompare(b, 'de'));
}

async function syncGermanSourceTexts(de) {
  de.text = isPlainObject(de.text) ? de.text : {};
  de.attr = isPlainObject(de.attr) ? de.attr : {};

  const texts = await collectSourceTexts();
  let added = 0;

  for (const text of texts) {
    if (!(text in de.text)) {
      de.text[text] = text;
      added += 1;
    }
  }

  de.text = Object.fromEntries(Object.entries(de.text).sort(([a], [b]) => a.localeCompare(b, 'de')));

  if (added > 0) {
    console.log(`[i18n] ${added} neue deutsche Texte in src/locales/de.json aufgenommen.`);
  }

  return added;
}

function getTargetRecord(value) {
  if (isPlainObject(value) && typeof value.text === 'string') {
    return value;
  }

  if (typeof value === 'string') {
    return { text: value, _source: undefined };
  }

  return null;
}

function collectMissingTranslations(source, target, trail = [], missing = []) {
  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith('_')) continue;

    const nextTrail = [...trail, key];

    if (typeof value === 'string') {
      const record = getTargetRecord(target?.[key]);

      if (!record || record._source !== value || !record.text) {
        missing.push({ path: nextTrail, source: value });
      }

      continue;
    }

    if (isPlainObject(value)) {
      collectMissingTranslations(value, isPlainObject(target?.[key]) ? target[key] : {}, nextTrail, missing);
    }
  }

  return missing;
}

function setNestedRecord(target, trail, record) {
  let cursor = target;

  trail.slice(0, -1).forEach((part) => {
    if (!isPlainObject(cursor[part]) || 'text' in cursor[part]) {
      cursor[part] = {};
    }

    cursor = cursor[part];
  });

  cursor[trail.at(-1)] = record;
}

function deeplEndpoint() {
  if (process.env.DEEPL_API_URL) {
    return process.env.DEEPL_API_URL;
  }

  return process.env.DEEPL_API_KEY?.endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';
}

async function translateBatch(texts, targetLang) {
  const apiKey = process.env.DEEPL_API_KEY;

  if (!apiKey) {
    if (!warnedMissingApiKey) {
      console.warn('[i18n] Kein DEEPL_API_KEY gefunden. Neue Texte bleiben vorerst deutsch.');
      warnedMissingApiKey = true;
    }

    return texts;
  }

  const body = new URLSearchParams();
  body.set('auth_key', apiKey);
  body.set('source_lang', 'DE');
  body.set('target_lang', targetLang);
  body.set('preserve_formatting', '1');
  texts.forEach((text) => body.append('text', text));

  const response = await fetch(deeplEndpoint(), {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`DeepL ${response.status}: ${details}`);
  }

  const data = await response.json();
  return data.translations.map((item) => item.text);
}

async function translateMissingForLanguage(de, target, lang, targetLang) {
  const missing = collectMissingTranslations(de, target);

  if (missing.length === 0) {
    console.log(`[i18n] ${lang}: alles aktuell.`);
    return false;
  }

  console.log(`[i18n] ${lang}: ${missing.length} fehlende/geänderte Texte.`);

  const chunkSize = 40;
  for (let index = 0; index < missing.length; index += chunkSize) {
    const chunk = missing.slice(index, index + chunkSize);
    const translated = await translateBatch(chunk.map((item) => item.source), targetLang);

    chunk.forEach((item, chunkIndex) => {
      setNestedRecord(target, item.path, {
        text: translated[chunkIndex] ?? item.source,
        _source: item.source,
      });
    });
  }

  return true;
}

async function syncPublicLocales(locales) {
  await fs.mkdir(publicLocaleDir, { recursive: true });

  await Promise.all(
    Object.entries(locales).map(([lang, data]) => writeJson(path.join(publicLocaleDir, `${lang}.json`), data)),
  );
}

export async function runTranslation() {
  await readEnvFile();
  await fs.mkdir(sourceLocaleDir, { recursive: true });

  const de = await readJson(sourceLocalePath, {});
  const addedGermanTexts = await syncGermanSourceTexts(de);

  if (addedGermanTexts > 0) {
    await writeJson(sourceLocalePath, de);
  }

  const locales = { de };

  for (const [lang, targetLang] of Object.entries(targetLanguages)) {
    const targetPath = path.join(sourceLocaleDir, `${lang}.json`);
    const target = await readJson(targetPath, {});
    const changed = await translateMissingForLanguage(de, target, lang, targetLang);

    if (changed) {
      await writeJson(targetPath, target);
    }

    locales[lang] = target;
  }

  await syncPublicLocales(locales);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runTranslation().catch((error) => {
    console.error(`[i18n] ${error.message}`);
    process.exitCode = 1;
  });
}
