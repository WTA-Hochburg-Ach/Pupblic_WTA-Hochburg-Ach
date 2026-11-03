import { build } from 'esbuild';

await build({
  entryPoints: ['worker/index.js'],
  outfile: 'dist/_worker.js',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
});
