// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mi-blog.pages.dev',
  integrations: [sitemap()],
  trailingSlash: 'never',
});
