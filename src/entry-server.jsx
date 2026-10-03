import { renderToString } from 'react-dom/server'
import App from './App.jsx'

export { renderHead, robotsTxt, sitemapXml, llmsTxt } from './seo.js'
export { languages, langPath } from './i18n/index.jsx'

export function render(lang) {
  return renderToString(<App initialLang={lang} />)
}
