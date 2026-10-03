export default function SectionHead({ id, eyebrow, title, text }) {
  return (
    <div className="section-head" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {text && <p className="section-head__text">{text}</p>}
    </div>
  )
}
