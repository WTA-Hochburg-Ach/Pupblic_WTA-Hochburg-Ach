import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

export default defineConfig({
  output: 'static',
  outDir: 'dist',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [icon({
    include: {
      lucide: ['*'],
    },
  })],
});
