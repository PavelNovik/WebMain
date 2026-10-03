import { useCallback, useEffect, useState } from 'react'
import VideoBackground from './components/VideoBackground.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Advantages from './components/Advantages.jsx'
import Services from './components/Services.jsx'
import Process from './components/Process.jsx'
import Portfolio from './components/Portfolio.jsx'
import Faq from './components/Faq.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import { useReveal } from './hooks/useReveal.js'
import { LangProvider, langFromPath, langPath, useLang } from './i18n/index.jsx'
import { applyHead } from './seo.js'

export default function App({ initialLang }) {
  const [lang, setLangState] = useState(initialLang)
  useReveal(lang)

  // Смена языка без перезагрузки: меняем URL (/, /en/, /uk/) и <head>
  const setLang = useCallback((next) => {
    if (next === lang) return
    history.pushState(null, '', langPath(next) + location.hash)
    setLangState(next)
  }, [lang])

  useEffect(() => {
    applyHead(lang)
  }, [lang])

  useEffect(() => {
    const onPop = () => setLangState(langFromPath(location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <LangProvider lang={lang} setLang={setLang}>
      <SkipLink />
      <CookieConsent />
      <VideoBackground />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Advantages />
        <Services />
        <Process />
        <Portfolio />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </LangProvider>
  )
}

function SkipLink() {
  const { t } = useLang()
  return <a href="#main" className="skip-link">{t.nav.skip}</a>
}
