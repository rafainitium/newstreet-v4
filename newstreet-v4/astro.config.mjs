import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.newst.com',
  output: 'static',
  build: { inlineStylesheets: 'never' },
});
