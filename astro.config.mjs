import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  outDir: 'dist',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
