import { studio, servicePrices, portfolio } from './config.js'
import { dictionaries, languages, defaultLang, langPath } from './i18n/index.jsx'

const abs = (path) => studio.siteUrl.replace(/\/$/, '') + path

// Schema.org: организация, сайт, услуги с ценами и FAQ — для поисковиков и ИИ-ассистентов.
export function jsonLd(lang) {
  const t = dictionaries[lang]
  const url = abs(langPath(lang))
  const orgId = abs('/#organization')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': orgId,
        name: studio.name,
        url: abs('/'),
        email: studio.email,
        telephone: studio.phone,
        description: t.meta.description,
        slogan: t.meta.tagline,
        areaServed: { '@type': 'Country', name: studio.country },
        address: { '@type': 'PostalAddress', addressCountry: studio.country },
        knowsLanguage: languages,
        priceRange: `${servicePrices[0]}–${servicePrices[servicePrices.length - 1]}+ PLN`,
        sameAs: [`https://t.me/${studio.telegram}`],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: t.services.title,
          itemListElement: t.services.items.map((s, i) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.title,
              description: s.features.join(', '),
            },
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: servicePrices[i],
              priceCurrency: 'PLN',
            },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': abs('/#website'),
        url: abs('/'),
        name: studio.name,
        publisher: { '@id': orgId },
        inLanguage: languages,
      },
      {
        '@type': 'WebPage',
        '@id': url + '#webpage',
        url,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: lang,
        isPartOf: { '@id': abs('/#website') },
        about: { '@id': orgId },
      },
      {
        '@type': 'FAQPage',
        '@id': url + '#faq',
        inLanguage: lang,
        mainEntity: t.faq.items.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

// Описание всех тегов <head> для языка: [тег, атрибуты, текст]
function headTags(lang) {
  const t = dictionaries[lang]
  const url = abs(langPath(lang))
  return [
    ['meta', { name: 'description', content: t.meta.description }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' }],
    ['link', { rel: 'canonical', href: url }],
    ...languages.map((l) => ['link', { rel: 'alternate', hreflang: l, href: abs(langPath(l)) }]),
    ['link', { rel: 'alternate', hreflang: 'x-default', href: abs(langPath(defaultLang)) }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: studio.name }],
    ['meta', { property: 'og:title', content: t.meta.title }],
    ['meta', { property: 'og:description', content: t.meta.description }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:locale', content: t.locale }],
    ...languages
      .filter((l) => l !== lang)
      .map((l) => ['meta', { property: 'og:locale:alternate', content: dictionaries[l].locale }]),
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: t.meta.title }],
    ['meta', { name: 'twitter:description', content: t.meta.description }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd(lang)).replace(/</g, '\\u003c')],
  ]
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Для пререндера: строка HTML
export function renderHead(lang) {
  const tags = headTags(lang).map(([tag, attrs, text]) => {
    const a = Object.entries(attrs).map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
    return tag === 'script' ? `<script data-seo${a}>${text}</script>` : `<${tag} data-seo${a}>`
  })
  return [`<title>${esc(dictionaries[lang].meta.title)}</title>`, ...tags].join('\n    ')
}

// Для клиента: обновить <head> при переключении языка
export function applyHead(lang) {
  document.documentElement.lang = lang
  document.title = dictionaries[lang].meta.title
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
  const frag = document.createDocumentFragment()
  headTags(lang).forEach(([tag, attrs, text]) => {
    const el = document.createElement(tag)
    el.setAttribute('data-seo', '')
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    if (text) el.textContent = text
    frag.appendChild(el)
  })
  document.head.appendChild(frag)
}

export function robotsTxt() {
  const aiBots = [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
    'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot',
    'CCBot', 'meta-externalagent', 'DuckAssistBot',
  ]
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI search & assistants are welcome',
    ...aiBots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    `Sitemap: ${abs('/sitemap.xml')}`,
    '',
  ].join('\n')
}

export function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10)
  const alternates = [
    ...languages.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(langPath(l))}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(langPath(defaultLang))}"/>`,
  ].join('\n')
  const urls = languages
    .map(
      (l) => `  <url>
    <loc>${abs(langPath(l))}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${l === defaultLang ? '1.0' : '0.8'}</priority>
${alternates}
  </url>`
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}

// llms.txt — краткое описание сайта в Markdown для языковых моделей (llmstxt.org)
export function llmsTxt() {
  const t = dictionaries.en
  const lines = [
    `# ${studio.name}`,
    '',
    `> ${t.meta.description}`,
    '',
    `Web studio based in Poland building small, fast websites: business card sites, landing pages and single-page applications (SPA), typically delivered in 7 days at a fixed price. Languages: Polish, English, Ukrainian.`,
    '',
    '## Pages',
    '',
    ...languages.map((l) => `- [${dictionaries[l].name}](${abs(langPath(l))}): ${dictionaries[l].meta.title}`),
    '',
    '## Services and pricing',
    '',
    ...t.services.items.map(
      (s, i) => `- **${s.title}** — from ${servicePrices[i]} PLN, ${s.term}. Includes: ${s.features.join(', ')}.`
    ),
    '',
    '## Process (7 days)',
    '',
    ...t.process.steps.map((s) => `- ${s.day}: ${s.title} — ${s.text}`),
    '',
    '## Recent work',
    '',
    ...t.portfolio.items
      .map((p, i) => portfolio[i]?.url && `- [${p.title}](${portfolio[i].url}): ${p.type}`)
      .filter(Boolean),
    '',
    '## Why choose us',
    '',
    ...t.advantages.items.map((a) => `- ${a.title}: ${a.text}`),
    '',
    '## FAQ',
    '',
    ...t.faq.items.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
    '## Contact',
    '',
    `- Email: ${studio.email}`,
    `- Telegram: https://t.me/${studio.telegram}`,
    `- Phone: ${studio.phone}`,
    `- Contact form: ${abs('/#contact')}`,
    '',
  ]
  return lines.join('\n')
}
