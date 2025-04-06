// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from "astro-pagefind";
import compressor from "astro-compressor";

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: "https://shiryaev.io/",
  integrations: [mdx(), sitemap(), compressor()],

  build: {
    format: "directory",
  },
  
  vite: {
    plugins: [tailwindcss(), pagefind(), (await import("@playform/compress")).default(), compressor()],

    server: {
      watch: {
        ignored: ['**/*.php'] // Игнорировать PHP-файлы при разработке
      }
    },
    
    build: {
      rollupOptions: {
        external: ['**/*.php'] // Не включать PHP-файлы в сборку
      }
    }
  },

  experimental: {
    svg: true,
  }
});