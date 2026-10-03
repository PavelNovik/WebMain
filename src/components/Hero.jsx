import { useRef } from 'react'
import { useLang } from '../i18n/index.jsx'
import { useScrollFrame } from '../hooks/useParallax.js'

export default function Hero() {
  const { t } = useLang()
  const hero = t.hero
  const content = useRef(null)

  // Текст первого экрана отстаёт от прокрутки и плавно гаснет.
  useScrollFrame((y) => {
    const el = content.current
    if (!el) return
    const p = Math.min(y / window.innerHeight, 1)
    el.style.transform = `translate3d(0, ${(y * 0.35).toFixed(1)}px, 0)`
    el.style.opacity = (1 - p * 1.2).toFixed(3)
  })

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero__content" ref={content}>
        <p className="badge">
          <span className="badge__dot" aria-hidden="true" />
          {hero.badge}
        </p>
        <h1 className="hero__title" id="hero-title">
          {hero.title[0]}
          <br />
          <span className="gradient-text">{hero.title[1]}</span>
        </h1>
        <p className="hero__text">{hero.text}</p>
        <div className="hero__actions">
          <a href="#contact" className="btn">{hero.cta}</a>
          <a href="#services" className="btn btn--ghost">{hero.secondary}</a>
        </div>
        <ul className="hero__stats">
          {hero.stats.map((s, i) => (
            <li key={i}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <a href="#advantages" className="scroll-hint" aria-label={hero.scroll}>
        <span aria-hidden="true" />
      </a>
    </section>
  )
}
