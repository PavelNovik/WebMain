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

// Фон — раскадровка видео, которая «проигрывается» скроллом.
// Кадры готовятся командой `npm run frames` из video-src/webAppletree.mp4.
export const video = {
  framesDir: '/frames',
  // Экраны уже этой пропорции (ширина/высота) получают «мобильный» набор кадров —
  // только центр картинки, вдвое легче. Совпадает с media в <link rel="preload"> в index.html.
  mobileMaxAspect: 0.95,
  scrubUntil: 'contact', // id раздела, к которому видео доходит до последнего кадра
  scrubEndOffset: 0.5, // последний кадр, когда верх раздела на середине экрана (0 — у верхнего края)
  scrubSmoothing: 0.12, // 0..1: меньше — плавнее и «инертнее», 1 — без сглаживания
  // false — на мобильных показываем только градиент (экономия трафика)
  enableOnMobile: true,
}

// Минимальные цены в PLN — для структурированных данных (Schema.org).
// Порядок совпадает с services.items в переводах.
export const servicePrices = [1500, 2500, 4500]

// Карточки портфолио (порядок как в portfolio.items в переводах).
// url + image — реальный проект со скриншотом; без них — карточка-заглушка.
export const portfolio = [
  {
    url: 'https://photograph1.vercel.app/',
    image: '/portfolio/mk-photography',
    color: '#b8935a',
  },
  {
    url: 'https://kawiarnia-ten.vercel.app/',
    image: '/portfolio/ziarno',
    color: '#c47a3d',
  },
  { color: '#2fbf8f' },
  { color: '#3d7bff' },
  { color: '#e5487f' },
  { color: '#f0b429' },
]

export const navIds = ['advantages', 'services', 'process', 'portfolio', 'faq', 'contact']
