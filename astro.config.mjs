// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from "astro-pagefind";
import compressor from "astro-compressor";

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: "https://web-impulse.ru/",
  integrations: [mdx(), sitemap(), compressor()],

  build: {
    format: "directory",
  },
  
  vite: {
    plugins: [tailwindcss(), pagefind(), (await import("@playform/compress")).default(), compressor()],
  }
});