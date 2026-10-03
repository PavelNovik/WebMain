import { useLang } from '../i18n/index.jsx'
import { useParallax } from '../hooks/useParallax.js'
import SectionHead from './SectionHead.jsx'

export default function Advantages() {
  const { t } = useLang()
  const s = t.advantages
  const orb = useParallax(0.35)
  return (
    <section className="section" id="advantages" aria-labelledby="advantages-title">
      <div className="orb orb--violet" ref={orb} aria-hidden="true" />
      <div className="container">
        <SectionHead id="advantages-title" eyebrow={s.eyebrow} title={s.title} text={s.text} />
        <ul className="grid grid--3">
          {s.items.map((a, i) => (
            <li className="card" key={i} data-reveal style={{ '--delay': `${i * 70}ms` }}>
              <div className="card__icon" aria-hidden="true">{a.icon}</div>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
