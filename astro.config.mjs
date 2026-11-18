// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://shalant.github.io/ElizabethRose.com/
// If we later point a custom domain (e.g. elizabethrose.com) at the site,
// delete `base`, set `site` to the custom domain, and add public/CNAME.
export default defineConfig({
  site: 'https://shalant.github.io',
  base: '/ElizabethRose.com',
});
