// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: "domain.com",
  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  }
});