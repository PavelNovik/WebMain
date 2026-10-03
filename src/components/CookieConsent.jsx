import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/index.jsx'

const STORAGE_KEY = 'cookie-consent-v1'
const OPEN_EVENT = 'cookie-settings:open'

export function getConsent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

// Сохраняет выбор и сообщает о нём остальному коду (например, для запуска аналитики):
// window.addEventListener('cookie-consent', (e) => e.detail.analytics && loadAnalytics())
function saveConsent(choice) {
  const value = { necessary: true, ...choice, date: new Date().toISOString() }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* приватный режим — просто не запоминаем */
  }
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: value }))
  // Google Consent Mode v2, если gtag будет подключён
  window.gtag?.('consent', 'update', {
    analytics_storage: value.analytics ? 'granted' : 'denied',
    ad_storage: value.marketing ? 'granted' : 'denied',
    ad_user_data: value.marketing ? 'granted' : 'denied',
    ad_personalization: value.marketing ? 'granted' : 'denied',
  })
  return value
}

export default function CookieConsent() {
  const { t } = useLang()
  const c = t.cookies
  const [banner, setBanner] = useState(false)
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false })
  const dialog = useRef(null)

  useEffect(() => {
    const stored = getConsent()
    if (stored) setPrefs({ analytics: !!stored.analytics, marketing: !!stored.marketing })
    else setBanner(true)

    const open = () => {
      const s = getConsent()
      if (s) setPrefs({ analytics: !!s.analytics, marketing: !!s.marketing })
      dialog.current?.showModal()
    }
    window.addEventListener(OPEN_EVENT, open)
    return () => window.removeEventListener(OPEN_EVENT, open)
  }, [])

  const decide = (choice) => {
    const v = saveConsent(choice)
    setPrefs({ analytics: v.analytics, marketing: v.marketing })
    setBanner(false)
    if (dialog.current?.open) dialog.current.close()
  }

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))

  return (
    <>
      {banner && (
        <section className="cookie" role="region" aria-labelledby="cookie-title">
          <div className="cookie__text">
            <h2 id="cookie-title">
              <span aria-hidden="true">🍪 </span>
              {c.title}
            </h2>
            <p>{c.text}</p>
          </div>
          <div className="cookie__actions">
            {/* «Принять» и «Отклонить» одинаково заметны — требование GDPR / UODO */}
            <button type="button" className="btn btn--small" onClick={() => decide({ analytics: true, marketing: true })}>
              {c.acceptAll}
            </button>
            <button type="button" className="btn btn--small btn--ghost" onClick={() => decide({ analytics: false, marketing: false })}>
              {c.rejectAll}
            </button>
            <button type="button" className="link-btn" onClick={openCookieSettings}>
              {c.settings}
            </button>
          </div>
        </section>
      )}

      <dialog className="cookie-dialog" ref={dialog} aria-labelledby="cookie-dialog-title">
        <form method="dialog" className="cookie-dialog__inner">
          <div className="cookie-dialog__head">
            <h2 id="cookie-dialog-title">{c.dialogTitle}</h2>
            <button type="submit" className="icon-btn" aria-label={c.close}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <p className="cookie-dialog__lead">{c.text}</p>

          <ul className="cookie-dialog__list">
            {['necessary', 'analytics', 'marketing'].map((key) => {
              const cat = c.categories[key]
              const locked = key === 'necessary'
              return (
                <li key={key} className="cookie-cat">
                  <div>
                    <h3 id={`cc-${key}`}>{cat.title}</h3>
                    <p id={`cc-${key}-desc`}>{cat.text}</p>
                  </div>
                  {locked ? (
                    <span className="cookie-cat__always">{c.always}</span>
                  ) : (
                    <label className="switch">
                      <input
                        type="checkbox"
                        role="switch"
                        checked={prefs[key]}
                        onChange={() => toggle(key)}
                        aria-labelledby={`cc-${key}`}
                        aria-describedby={`cc-${key}-desc`}
                      />
                      <span className="switch__track" aria-hidden="true" />
                    </label>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="cookie-dialog__actions">
            <button type="button" className="btn btn--small btn--ghost" onClick={() => decide({ analytics: false, marketing: false })}>
              {c.rejectAll}
            </button>
            <button type="button" className="btn btn--small btn--ghost" onClick={() => decide(prefs)}>
              {c.save}
            </button>
            <button type="button" className="btn btn--small" onClick={() => decide({ analytics: true, marketing: true })}>
              {c.acceptAll}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
