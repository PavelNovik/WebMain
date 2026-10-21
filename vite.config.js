import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Адрес сайта для canonical, hreflang, sitemap и Schema.org: переменная окружения SITE_URL,
// иначе — studio.siteUrl из src/config.js. (Автоподстановка домена Vercel не используется:
// после переименования проекта она отдавала старый адрес с редиректом.)
const siteUrl = process.env.SITE_URL || ''

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  define: {
    __SITE_URL__: JSON.stringify(siteUrl),
  },
})
