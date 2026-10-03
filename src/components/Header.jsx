import { useEffect, useRef, useState } from 'react'
import { navIds, studio } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import LangSwitcher from './LangSwitcher.jsx'

export default function Header() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const burger = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Мобильное меню: блокируем прокрутку, закрываем по Esc и возвращаем фокус на кнопку
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burger.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1101px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header__inner">
        <a href="#top" className="logo" onClick={close} aria-label={`${studio.name} — ${t.nav.home}`}>
          <span className="logo__mark" aria-hidden="true">P</span>
          <span aria-hidden="true">{studio.name}</span>
        </a>
        <nav className="nav" id="site-nav" aria-label={t.nav.label}>
          <ul className="nav__list">
            {navIds.map((id, i) => (
              <li key={id}>
                <a href={`#${id}`} onClick={close}>{t.nav.items[i]}</a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn--small nav__cta" onClick={close}>
            {t.nav.cta}
          </a>
        </nav>
        <div className="header__tools">
          <LangSwitcher />
          <button
            ref={burger}
            type="button"
            className="burger"
            aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
