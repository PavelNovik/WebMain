import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Адрес сайта для canonical, hreflang, sitemap и Schema.org:
// 1) SITE_URL — задать вручную (например, когда будет свой домен);
// 2) на Vercel — основной домен проекта (подставляется автоматически);
// 3) иначе — значение из src/config.js.
const siteUrl =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  ''

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  define: {
    __SITE_URL__: JSON.stringify(siteUrl),
  },
})
