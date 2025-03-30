// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: SITE.url,
  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    locales: ["ru", "en"],
    defaultLocale: "en",
    routing: {
        prefixDefaultLocale: false
    }
  }
});