import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runTranslation } from './translate-i18n.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const watchRoots = [
  path.join(rootDir, 'src', 'locales'),
  path.join(rootDir, 'src', 'content'),
  path.join(rootDir, 'src', 'pages'),
  path.join(rootDir, 'src', 'components'),
  path.join(rootDir, 'src', 'data'),
];

let queued = false;
let running = false;
let timer;
const watchedFiles = new Set();
const watchOptions = { interval: 900 };

async function translateQueued() {
  if (running) {
    queued = true;
    return;
  }

  running = true;

  try {
    await runTranslation();
  } catch (error) {
    console.error(`[i18n] ${error.message}`);
  } finally {
    running = false;

    if (queued) {
      queued = false;
      translateQueued();
    }
  }
}

function debounceTranslate() {
  clearTimeout(timer);
  timer = setTimeout(() => translateQueued(), 250);
}

async function listWatchFiles(dir, files = []) {
  let entries = [];

  try {
    entries = await fsp.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await listWatchFiles(fullPath, files);
    } else if (/\.(astro|md|ts|json)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function watchFile(filePath) {
  if (watchedFiles.has(filePath)) {
    return;
  }

  watchedFiles.add(filePath);
  fs.watchFile(filePath, watchOptions, (current, previous) => {
    if (current.mtimeMs !== previous.mtimeMs) {
      debounceTranslate();
    }
  });
}

async function refreshWatchedFiles() {
  const files = (await Promise.all(watchRoots.map((dir) => listWatchFiles(dir)))).flat();
  files.forEach(watchFile);
}

await translateQueued();

await refreshWatchedFiles();
const refreshTimer = setInterval(refreshWatchedFiles, 3000);

const astro = spawn('astro', ['dev'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

function shutdown(signal) {
  clearInterval(refreshTimer);
  watchedFiles.forEach((filePath) => fs.unwatchFile(filePath));
  astro.kill(signal);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

astro.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
