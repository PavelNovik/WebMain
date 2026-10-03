import { useEffect, useRef, useState } from 'react'
import { studio } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import SectionHead from './SectionHead.jsx'

const empty = { name: '', contact: '', type: 1, message: '' }

export default function Contact() {
  const { t, lang } = useLang()
  const c = t.contact
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const nameRef = useRef(null)
  const contactRef = useRef(null)
  const successRef = useRef(null)

  // Тексты ошибок должны быть на текущем языке
  useEffect(() => setErrors({}), [lang])
  useEffect(() => {
    if (sent) successRef.current?.focus()
  }, [sent])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = c.errName
    if (!form.contact.trim()) next.contact = c.errContact
    setErrors(next)
    if (next.name) return nameRef.current.focus()
    if (next.contact) return contactRef.current.focus()
    // TODO: отправка заявки (Telegram-бот / email / CRM)
    setSent(true)
    setForm(empty)
  }

  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container contact">
        <div className="contact__intro">
          <SectionHead id="contact-title" eyebrow={c.eyebrow} title={c.title} text={c.text} />
          <ul className="contact__links" data-reveal>
            <li>
              <span>Telegram</span>
              <a href={`https://t.me/${studio.telegram}`} target="_blank" rel="noopener noreferrer">
                @{studio.telegram}
                <span className="sr-only"> {c.newTab}</span>
              </a>
            </li>
            <li>
              <span>Email</span>
              <a href={`mailto:${studio.email}`}>{studio.email}</a>
            </li>
            <li>
              <span>{c.phone}</span>
              <a href={`tel:${studio.phone.replace(/[^\d+]/g, '')}`}>{studio.phone}</a>
            </li>
          </ul>
        </div>

        <form className="card form" onSubmit={submit} noValidate data-reveal aria-labelledby="contact-title">
          {sent ? (
            <div className="form__success" role="status">
              <div className="form__success-icon" aria-hidden="true">✓</div>
              <h3 ref={successRef} tabIndex={-1}>{c.successTitle}</h3>
              <p>{c.successText}</p>
              <button type="button" className="btn btn--ghost" onClick={() => setSent(false)}>
                {c.again}
              </button>
            </div>
          ) : (
            <>
              <div className={`field ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor="f-name">
                  {c.name} <span className="field__req">({c.required})</span>
                </label>
                <input
                  id="f-name"
                  ref={nameRef}
                  value={form.name}
                  onChange={set('name')}
                  placeholder={c.namePh}
                  autoComplete="name"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'f-name-err' : undefined}
                />
                {errors.name && <small id="f-name-err">{errors.name}</small>}
              </div>
              <div className={`field ${errors.contact ? 'has-error' : ''}`}>
                <label htmlFor="f-contact">
                  {c.contact} <span className="field__req">({c.required})</span>
                </label>
                <input
                  id="f-contact"
                  ref={contactRef}
                  value={form.contact}
                  onChange={set('contact')}
                  placeholder={c.contactPh}
                  required
                  aria-invalid={!!errors.contact}
                  aria-describedby={errors.contact ? 'f-contact-err' : undefined}
                />
                {errors.contact && <small id="f-contact-err">{errors.contact}</small>}
              </div>
              <fieldset className="field">
                <legend>{c.type}</legend>
                <div className="chips">
                  {c.types.map((label, i) => (
                    <label key={i} className={`chip ${Number(form.type) === i ? 'is-active' : ''}`}>
                      <input
                        type="radio"
                        name="type"
                        value={i}
                        checked={Number(form.type) === i}
                        onChange={set('type')}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="field">
                <label htmlFor="f-message">{c.message}</label>
                <textarea
                  id="f-message"
                  rows="4"
                  value={form.message}
                  onChange={set('message')}
                  placeholder={c.messagePh}
                />
              </div>
              <button type="submit" className="btn btn--block">{c.submit}</button>
              <p className="form__note">{c.note}</p>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
