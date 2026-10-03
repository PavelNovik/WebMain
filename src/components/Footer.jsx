import { studio } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import { openCookieSettings } from './CookieConsent.jsx'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>© {new Date().getFullYear()} {studio.name}</p>
        <p>{t.meta.tagline}</p>
        <div className="footer__links">
          <button type="button" className="link-btn" onClick={openCookieSettings}>
            {t.footer.cookies}
          </button>
          <a href="#top">{t.footer.top} <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  )
}
