import { useLang } from '../i18n/index.jsx'
import SectionHead from './SectionHead.jsx'

export default function Faq() {
  const { t } = useLang()
  const s = t.faq
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="container container--narrow">
        <SectionHead id="faq-title" eyebrow={s.eyebrow} title={s.title} />
        <div className="faq">
          {s.items.map((f, i) => (
            <details className="faq__item card" key={i} data-reveal style={{ '--delay': `${i * 60}ms` }}>
              <summary>
                <h3>{f.q}</h3>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
