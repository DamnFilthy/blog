// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import compressor from "astro-compressor";

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: "http://localhost:4321",
  integrations: [mdx(), sitemap(), compressor()],

  vite: {
    plugins: [tailwindcss(), (await import("@playform/compress")).default(), compressor()],
  }
});