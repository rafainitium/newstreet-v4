import { defineConfig } from 'astro/config';

export default defineConfig({
  /* NO `site` WHILE THIS IS A TEST BUILD.
     This read 'https://www.newst.com', which put a canonical link and an
     `og:url` on the live domain into every page of a preview that is not the
     live site — a public second copy of the firm's content, claiming to be
     that content's home. Unset, `Base.astro` emits no canonical and marks the
     build `noindex, nofollow`. Set it to the real origin when this becomes the
     real site and both come back on their own. */
  output: 'static',
  build: { inlineStylesheets: 'never' },
});
