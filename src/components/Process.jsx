import { useLang } from '../i18n/index.jsx'
import SectionHead from './SectionHead.jsx'

export default function Process() {
  const { t } = useLang()
  const s = t.process
  return (
    <section className="section" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead id="process-title" eyebrow={s.eyebrow} title={s.title} text={s.text} />
        <ol className="timeline">
          {s.steps.map((step, i) => (
            <li className="timeline__item" key={i} data-reveal style={{ '--delay': `${i * 80}ms` }}>
              <span className="timeline__dot" aria-hidden="true">{i + 1}</span>
              <div className="card timeline__card">
                <p className="timeline__day">{step.day}</p>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
