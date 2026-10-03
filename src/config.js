// Общие настройки, не зависящие от языка. Тексты — в src/i18n/*.js

export const studio = {
  name: 'Pixel Studio',
  // Боевой адрес сайта — нужен для canonical, sitemap, hreflang и разметки Schema.org.
  // При сборке на Vercel подставляется домен проекта (см. vite.config.js).
  siteUrl: __SITE_URL__ || 'https://pixelstudio.pl',
  email: 'hello@pixelstudio.pl',
  telegram: 'pixelstudio',
  phone: '+48 500 000 000',
  country: 'PL',
}

export const video = {
  // Видео «перематывается» скроллом. Файл готовится командой `npm run video`
  // из video-src/webAppletree.mp4 (каждый кадр ключевой — иначе перемотка дёргается).
  src: '/video/webAppletree-scrub.mp4',
  scrubUntil: 'contact', // id раздела, к которому видео доходит до последнего кадра
  scrubEndOffset: 0.5, // последний кадр, когда верх раздела на середине экрана (0 — у верхнего края)
  scrubSmoothing: 0.12, // 0..1: меньше — плавнее и «инертнее», 1 — без сглаживания
  poster: '', // например '/video/poster.jpg' — кадр, пока видео грузится
  // false — на мобильных показываем только градиент (экономия трафика)
  enableOnMobile: true,
}

// Минимальные цены в PLN — для структурированных данных (Schema.org).
// Порядок совпадает с services.items в переводах.
export const servicePrices = [1500, 2500, 4500]

// Акцентные цвета карточек портфолио (порядок как в portfolio.items)
export const portfolioColors = ['#c47a3d', '#2fbf8f', '#3d7bff', '#e5487f', '#9a6bff', '#f0b429']

export const navIds = ['advantages', 'services', 'process', 'portfolio', 'faq', 'contact']
