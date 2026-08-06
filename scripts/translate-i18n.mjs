import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceLocaleDir = path.join(rootDir, 'src', 'locales');
const publicLocaleDir = path.join(rootDir, 'public', 'locales');
const sourceLocalePath = path.join(sourceLocaleDir, 'de.json');
const contentRoots = [
  path.join(rootDir, 'src', 'content', 'pages'),
  path.join(rootDir, 'src', 'content', 'news'),
  path.join(rootDir, 'src', 'pages'),
];

const { activeLanguages } = await import('../src/data/site.ts');

const targetLanguages = Object.fromEntries(
  activeLanguages
    .filter((lang) => lang !== 'de')
    .map((lang) => [lang, lang === 'en' ? 'EN-US' : lang.toUpperCase()]),
);

const PROTECTED_TERMS = [
  'Aikido',
  'Wanomichi',
  'Takemusu',
  'Ueshiba Morihei',
  'Morihei Ueshiba',
  'Saito Morihiro Sensei',
  'Hochburg-Ach',
  'Duttendorf',
  'Dojo',
  'O-Sensei',
  'Uke',
  'Nage',
];

const CONTEXT_HINT = [
  'Translate content for a traditional Aikido dojo website.',
  'Keep proper names and dojo terminology consistent.',
  `Protected terms: ${PROTECTED_TERMS.join(', ')}.`,
].join(' ');

let warnedMissingApiKey = false;

async function readEnvFile() {
  const envFiles = ['.env', 'deepl.env'];

  await Promise.all(
    envFiles.map(async (fileName) => {
      try {
        const content = await fs.readFile(path.join(rootDir, fileName), 'utf8');
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
      } catch {
        // Optional local env file.
      }
    }),
  );
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
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function looksLikeTranslatableText(text) {
  if (!text) return false;
  if (text.length < 2 || text.length > 3000) return false;
  if (!/[A-Za-zÄÖÜäöüß\u3040-\u30ff\u3400-\u9fff]/.test(text)) return false;
  if (/^(https?:|mailto:|tel:|\/|#|\.|_|\{|\[|\(|\)|'|"|,|import |export )/.test(text)) return false;
  if (/^(class|id|href|src|rel|type|data-|aria-|const|let|var)\b/.test(text)) return false;
  if (/^(common|nav|footer|meta|events|text|attr|gallery)\./.test(text)) return false;
  if (/\b(entry|item|linkedNews|baseUrl|window|document|Astro|props)\b/.test(text)) return false;
  if (/[?.]{2}|=>|\|\||&&|\?\?/.test(text)) return false;
  if (/\bwith[A-Z]\w+\(/.test(text)) return false;
  if (/\.(astro|css|js|ts|svg|png|jpe?g|webp|pdf|md|json|mjs)\b/i.test(text)) return false;
  if (/[{}<>=;`]/.test(text)) return false;
  if (/['"]\s*:/.test(text) || /:\s*['"]/.test(text)) return false;
  if (/\b[a-z0-9]+-[a-z0-9-]+\b/i.test(text) && !/\s/.test(text)) return false;
  if (/^[a-z0-9_-]+(?:\s+[a-z0-9_-]+)+$/i.test(text)) return false;
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
  if (looksLikeTranslatableText(text)) {
    set.add(text);
  }
}

function extractFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*/);
  return match ? match[1] : '';
}

function collectFrontmatterStrings(content, set) {
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) return;

  frontmatter.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
      return;
    }

    const namedLiteral = trimmed.match(
      /^(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*(['"])(.*?)\1\s*;?\s*$/,
    );
    if (namedLiteral) {
      addCandidate(set, namedLiteral[2]);
      return;
    }

    const objectLiteral = trimmed.match(/^[A-Za-z0-9_-]+\s*:\s*(['"])(.*?)\1\s*,?\s*$/);
    if (objectLiteral) {
      addCandidate(set, objectLiteral[2]);
      return;
    }

    const frontmatterField = trimmed.match(/^(title|description|preview|summary|kanji|kicker|label|headline)\s*:\s*(['"])(.*?)\2\s*$/i);
    if (frontmatterField) {
      addCandidate(set, frontmatterField[3]);
    }
  });
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function collectRenderableText(content, set) {
  const body = content
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h1|h2|h3|h4|h5|h6|li|dt|dd|blockquote|figcaption|button|label|legend|summary|small|strong|em|span|td|th)>/gi, '\n')
    .replace(/<\/(div|section|article|header|footer|aside|main|nav|figure|ul|ol|dl|table|thead|tbody|tr)>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[\s\S]*?\}/g, ' ')
    .replace(/\r/g, '');

  body
    .split(/\n{2,}/)
    .map((block) => normalizeText(decodeHtmlEntities(block)))
    .filter(Boolean)
    .forEach((block) => addCandidate(set, block));
}

async function collectSourceTexts() {
  const files = [
    ...(await listFiles(contentRoots[0], ['.md'])),
    ...(await listFiles(contentRoots[1], ['.md'])),
    ...(await listFiles(contentRoots[2], ['.astro'])),
  ];

  const texts = new Set();

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8');
    collectFrontmatterStrings(content, texts);
    collectRenderableText(content, texts);
  }

  return [...texts].sort((a, b) => a.localeCompare(b, 'de'));
}

async function syncGermanSourceTexts(de) {
  de.text = isPlainObject(de.text) ? de.text : {};
  de.attr = isPlainObject(de.attr) ? de.attr : {};

  const texts = await collectSourceTexts();
  const sourceSet = new Set(texts);
  let removed = 0;
  let added = 0;

  for (const key of Object.keys(de.text)) {
    if (!sourceSet.has(key)) {
      delete de.text[key];
      removed += 1;
    }
  }

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

  if (removed > 0) {
    console.log(`[i18n] ${removed} technische oder veraltete Texte aus src/locales/de.json entfernt.`);
  }

  return sourceSet;
}

function getTargetRecord(value) {
  if (isPlainObject(value) && typeof value.text === 'string') {
    return value;
  }

  if (typeof value === 'string') {
    return { text: value };
  }

  return null;
}

function shouldRefreshUntranslatedRecord(source, record) {
  if (!record || record.text !== source) return false;
  if (record._target) return false;
  if (!/[A-Za-zÄÖÜäöüß\u3040-\u30ff\u3400-\u9fff]/.test(source)) return false;

  const shortTechnicalOrBrand = /^(Aikido|WTA|PDF|DE|EN|FR|JA|\d|[A-Z0-9\s/+-]+$)/;
  if (shortTechnicalOrBrand.test(source) && source.split(/\s+/).length <= 2) {
    return false;
  }

  return true;
}

function collectMissingTranslations(sourceMap, targetMap, lang = 'de') {
  const missing = [];

  for (const [source, value] of Object.entries(sourceMap)) {
    if (source.startsWith('_')) continue;

    const record = getTargetRecord(targetMap?.[source]);
    if (!record || record._source !== value || !record.text || (lang !== 'de' && shouldRefreshUntranslatedRecord(source, record))) {
      missing.push({ source, value });
    }
  }

  return missing;
}

function setTranslationRecord(target, source, record) {
  target.text = isPlainObject(target.text) ? target.text : {};
  target.text[source] = record;
}

function pruneTechnicalTextEntries(locale, sourceKeys, lang) {
  if (!isPlainObject(locale.text)) return 0;

  let removed = 0;

  for (const key of Object.keys(locale.text)) {
    if (!sourceKeys.has(key)) {
      delete locale.text[key];
      removed += 1;
    }
  }

  if (removed > 0) {
    console.log(`[i18n] ${lang}: ${removed} veraltete Texte entfernt.`);
  }

  return removed;
}

function deeplEndpoint() {
  if (process.env.DEEPL_API_URL) {
    return process.env.DEEPL_API_URL;
  }

  return process.env.DEEPL_API_KEY?.endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';
}

function normalizeTranslationText(text, lang) {
  let normalized = normalizeText(text);
  normalized = normalized.replace(/\s+([,.;:!?%])/g, '$1');
  normalized = normalized.replace(/([,.;:!?%])(?=\S)/g, '$1 ');
  normalized = normalized.replace(/\s{2,}/g, ' ');

  if (lang === 'ja') {
    normalized = normalized
      .replace(/\s+([、。！？：；])/g, '$1')
      .replace(/([、。！？：；])(?=\S)/g, '$1 ');
  }

  for (const term of PROTECTED_TERMS) {
    const termPattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    normalized = normalized.replace(termPattern, term);
  }

  return normalized.trim();
}

function buildTranslationDiagnostics(source, translated, lang) {
  const issues = [];

  if (!translated) {
    issues.push('leere Übersetzung');
  }

  if (/[ÃÂ]|â€|�/.test(translated)) {
    issues.push('Encoding-Reste entdeckt');
  }

  const sourcePlaceholders = source.match(/\{[\w-]+\}/g) ?? [];
  const translatedPlaceholders = translated.match(/\{[\w-]+\}/g) ?? [];
  if (sourcePlaceholders.length !== translatedPlaceholders.length) {
    issues.push('Platzhalter-Anzahl passt nicht');
  }

  if (lang !== 'de' && translated === source) {
    issues.push('unübersetzt');
  }

  if (source.length > 40 && translated.length < Math.max(10, Math.floor(source.length * 0.35))) {
    issues.push('zu kurz für einen Absatz');
  }

  return issues;
}

function applyTranslationQualityGuards(source, translated, lang) {
  const cleaned = normalizeTranslationText(translated, lang);
  const issues = buildTranslationDiagnostics(source, cleaned, lang);
  return { text: cleaned, issues };
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
  body.set('source_lang', 'DE');
  body.set('target_lang', targetLang);
  body.set('preserve_formatting', '1');
  body.set('context', CONTEXT_HINT);
  texts.forEach((text) => body.append('text', text));

  try {
    const response = await fetch(deeplEndpoint(), {
      method: 'POST',
      headers: {
        authorization: `DeepL-Auth-Key ${apiKey}`,
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
  } catch (error) {
    console.warn(`[i18n] DeepL nicht erreichbar (${targetLang}): ${error.message}. Fallback auf Quelltexte.`);
    return texts;
  }
}

async function translateMissingForLanguage(de, target, lang, targetLang, sourceKeys) {
  pruneTechnicalTextEntries(target, sourceKeys, lang);
  const missing = collectMissingTranslations(de.text, target.text, lang);

  if (missing.length === 0) {
    console.log(`[i18n] ${lang}: alles aktuell.`);
    return false;
  }

  console.log(`[i18n] ${lang}: ${missing.length} fehlende oder geänderte Texte.`);

  const diagnostics = [];
  const chunkSize = 40;

  for (let index = 0; index < missing.length; index += chunkSize) {
    const chunk = missing.slice(index, index + chunkSize);
    const translated = await translateBatch(chunk.map((item) => item.source), targetLang);

    chunk.forEach((item, chunkIndex) => {
      const source = item.source;
      const rawTranslation = translated[chunkIndex] ?? source;
      const guarded = applyTranslationQualityGuards(source, rawTranslation, lang);

      if (guarded.issues.length > 0) {
        diagnostics.push({ source, issues: guarded.issues });
      }

      setTranslationRecord(target, source, {
        text: guarded.text || source,
        _source: source,
        _target: targetLang,
      });
    });
  }

  if (diagnostics.length > 0) {
    console.warn(`[i18n] ${lang}: Qualitätswarnungen für ${diagnostics.length} Einträge.`);
    diagnostics.slice(0, 20).forEach((entry) => {
      console.warn(`  - ${entry.issues.join(', ')} :: ${entry.source}`);
    });
    if (diagnostics.length > 20) {
      console.warn(`  - ... und ${diagnostics.length - 20} weitere`);
    }
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
  const sourceKeys = await syncGermanSourceTexts(de);

  await writeJson(sourceLocalePath, de);

  const locales = { de };

  for (const [lang, targetLang] of Object.entries(targetLanguages)) {
    const targetPath = path.join(sourceLocaleDir, `${lang}.json`);
    const target = await readJson(targetPath, {});
    const changed = await translateMissingForLanguage(de, target, lang, targetLang, sourceKeys);

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
