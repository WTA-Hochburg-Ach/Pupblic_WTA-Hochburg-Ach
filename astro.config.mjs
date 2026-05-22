import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import compress from 'astro-compress';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  output: 'static',
  outDir: 'dist',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    icon({
      include: {
        lucide: ['*'],
      },
    }),
    compress(),
  ],
  vite: {
    plugins: [
      visualizer({
        filename: 'dist/bundle-visualizer.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
  },
});
