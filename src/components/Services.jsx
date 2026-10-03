import { useLang } from '../i18n/index.jsx'
import { useParallax } from '../hooks/useParallax.js'
import SectionHead from './SectionHead.jsx'

export default function Services() {
  const { t } = useLang()
  const s = t.services
  const orb = useParallax(-0.25)
  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="orb orb--cyan" ref={orb} aria-hidden="true" />
      <div className="container">
        <SectionHead id="services-title" eyebrow={s.eyebrow} title={s.title} text={s.text} />
        <ul className="grid grid--3 grid--prices">
          {s.items.map((item, i) => (
            <li
              key={i}
              className={`card price ${item.featured ? 'price--featured' : ''}`}
              data-reveal
              style={{ '--delay': `${i * 90}ms` }}
            >
              {item.featured && <p className="price__tag">{s.featured}</p>}
              <h3>{item.title}</h3>
              <p className="price__value">{item.price}</p>
              <p className="price__term">{s.term}: {item.term}</p>
              <ul className="price__list">
                {item.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`btn ${item.featured ? '' : 'btn--ghost'} btn--block`}
                aria-label={`${s.order}: ${item.title}`}
              >
                {s.order}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
