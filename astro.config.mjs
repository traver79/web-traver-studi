import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://traver79.github.io',
  base: '/web-traver-studi',
  trailingSlash: 'always',
  output: 'static',
  devToolbar: { enabled: false },
});
