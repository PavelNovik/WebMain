import { portfolio } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import { useParallax } from '../hooks/useParallax.js'
import SectionHead from './SectionHead.jsx'

const host = (url) => new URL(url).host

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
          {s.items.map((p, i) => {
            const meta = portfolio[i] || {}
            const style = { '--delay': `${i * 70}ms`, '--accent': meta.color, '--accent-ink': meta.ink }
            return meta.url ? (
              <li className="work work--live" key={i} data-reveal style={style}>
                <a href={meta.url} target="_blank" rel="noopener" className="work__link">
                  <div className="work__preview">
                    <div className="work__browser" aria-hidden="true">
                      <i /><i /><i />
                      <span className="work__url">{host(meta.url)}</span>
                    </div>
                    <div className="work__shot">
                      <img
                        src={`${meta.image}-640.webp`}
                        srcSet={`${meta.image}-640.webp 640w, ${meta.image}-1200.webp 1200w`}
                        sizes="(max-width: 620px) 92vw, (max-width: 960px) 46vw, 380px"
                        width="1200"
                        height="716"
                        loading="lazy"
                        decoding="async"
                        alt=""
                      />
                      <span className="work__visit" aria-hidden="true">
                        {s.visit} <span>↗</span>
                      </span>
                    </div>
                  </div>
                  <div className="work__info">
                    <h3>{p.title}</h3>
                    <p>{p.type}</p>
                  </div>
                  <span className="sr-only">
                    {s.visit} — {t.contact.newTab}
                  </span>
                </a>
              </li>
            ) : (
              <li className="work" key={i} data-reveal style={style}>
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
            )
          })}
        </ul>
      </div>
    </section>
  )
}
