// Пререндер: готовый HTML для каждого языка (/, /en/, /uk/) + robots.txt, sitemap.xml, llms.txt.
// Поисковики и ИИ-краулеры, не исполняющие JS, видят весь контент сразу.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const server = path.resolve('dist-server/entry-server.js')
const { render, renderHead, robotsTxt, sitemapXml, llmsTxt, languages, langPath } = await import(
  pathToFileURL(server).href
)

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

for (const lang of languages) {
  const html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace('<!--app-head-->', renderHead(lang))
    .replace('<div id="root"></div>', `<div id="root">${render(lang)}</div>`)
  const dir = path.join(dist, langPath(lang))
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
  console.log(`  prerendered ${langPath(lang)}`)
}

fs.writeFileSync(path.join(dist, 'robots.txt'), robotsTxt())
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemapXml())
fs.writeFileSync(path.join(dist, 'llms.txt'), llmsTxt())
fs.rmSync(path.resolve('dist-server'), { recursive: true, force: true })
console.log('  robots.txt, sitemap.xml, llms.txt written')
