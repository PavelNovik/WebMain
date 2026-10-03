import { portfolioColors } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import { useParallax } from '../hooks/useParallax.js'
import SectionHead from './SectionHead.jsx'

export default function Portfolio() {
  const { t } = useLang()
  const s = t.portfolio
  const orb = useParallax(0.3)
  return (
    <section className="section" id="portfolio" aria-labelledby="portfolio-title">
      <div className="orb orb--pink" ref={orb} aria-hidden="true" />
      <div className="container">
        <SectionHead id="portfolio-title" eyebrow={s.eyebrow} title={s.title} />
        <ul className="grid grid--3">
          {s.items.map((p, i) => (
            <li
              className="work"
              key={i}
              data-reveal
              style={{ '--delay': `${i * 70}ms`, '--accent': portfolioColors[i] }}
            >
              <div className="work__preview" aria-hidden="true">
                <div className="work__browser">
                  <i /><i /><i />
                </div>
                <div className="work__mock">
                  <span className="work__line work__line--lg" />
                  <span className="work__line" />
                  <span className="work__line work__line--sm" />
                  <span className="work__btn" />
                </div>
              </div>
              <div className="work__info">
                <h3>{p.title}</h3>
                <p>{p.type}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
