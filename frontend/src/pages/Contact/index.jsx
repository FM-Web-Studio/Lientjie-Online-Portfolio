import { useState } from 'react'
import { createMessage } from '../../firebase'
import { Reveal } from '../../components'
import { useToast } from '../../context/ToastContext'
import styles from './Contact.module.css'

const EMPTY = { name: '', email: '', subject: '', message: '' }

const DETAILS = [
  { label: 'Email',         value: 'meiringlientjie0214@gmail.com', href: 'mailto:meiringlientjie0214@gmail.com' },
  { label: 'Phone',         value: '+27 74 695 4980',               href: 'tel:+27746954980' },
  { label: 'Location',      value: 'Roodepoort, Gauteng' },
  { label: 'Instagram',     value: '@live_love_lien',               href: 'https://www.instagram.com/live_love_lien', external: true },
  { label: 'Response time', value: 'Within 24 hours' },
]

function validate(data) {
  const e = {}
  if (!data.name.trim())    e.name    = 'Name is required'
  if (!data.email.trim())   e.email   = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Invalid email address'
  if (!data.message.trim()) e.message = 'Message is required'
  return e
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

export default function Contact() {
  const { addToast } = useToast()
  const [form,    setForm]    = useState(EMPTY)
  const [errors,  setErrors]  = useState({})
  const [touched, setTouched] = useState({})
  const [status,  setStatus]  = useState('idle')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (touched[name]) {
      setErrors(p => ({ ...p, [name]: validate({ ...form, [name]: value })[name] }))
    }
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched(t => ({ ...t, [name]: true }))
    setErrors(p => ({ ...p, [name]: validate(form)[name] }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      setTouched({ name: true, email: true, subject: true, message: true })
      return
    }
    setStatus('sending')
    try {
      await createMessage(form)
      setStatus('sent')
      setForm(EMPTY)
      setTouched({})
      addToast({
        type: 'success',
        title: 'Message sent!',
        message: "I'll be in touch within 24 hours.",
      })
    } catch {
      setStatus('error')
      addToast({
        type: 'error',
        title: 'Something went wrong',
        message: 'Please try again or email me directly.',
      })
    }
  }

  return (
    <>
      <section className={styles.header}>
        <div className="container">
          <Reveal>
            <p className={styles.eyebrow}>Contact</p>
            <h1 className={styles.heading}>Say<br />Hello.</h1>
            <p className={styles.sub}>
              Available for studio opportunities, collaborations,
              and general enquiries. I'd love to hear from you.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.body}>
        <div className="container">
          <div className={styles.grid}>

            <Reveal>
              <div className={styles.formWrap}>
                {status === 'sent' ? (
                  <div className={styles.success}>
                    <div className={styles.successIcon} aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className={styles.successTitle}>Message received.</h3>
                    <p className={styles.successBody}>
                      Thank you for reaching out — I'll be in touch within 24 hours.
                    </p>
                    <button className={styles.resetBtn} onClick={() => setStatus('idle')}>
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="name">Name</label>
                        <input
                          id="name" name="name" type="text"
                          value={form.name} onChange={handleChange} onBlur={handleBlur}
                          className={`${styles.input} ${errors.name && touched.name ? styles.inputErr : ''}`}
                          placeholder="Your name"
                          autoComplete="name"
                        />
                        {errors.name && touched.name && (
                          <span className={styles.err} role="alert">{errors.name}</span>
                        )}
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                          id="email" name="email" type="email"
                          value={form.email} onChange={handleChange} onBlur={handleBlur}
                          className={`${styles.input} ${errors.email && touched.email ? styles.inputErr : ''}`}
                          placeholder="you@email.com"
                          autoComplete="email"
                        />
                        {errors.email && touched.email && (
                          <span className={styles.err} role="alert">{errors.email}</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="subject">Subject</label>
                      <input
                        id="subject" name="subject" type="text"
                        value={form.subject} onChange={handleChange}
                        className={styles.input}
                        placeholder="What's this about?"
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="message">Message</label>
                      <textarea
                        id="message" name="message"
                        value={form.message} onChange={handleChange} onBlur={handleBlur}
                        rows={6}
                        className={`${styles.input} ${styles.textarea} ${errors.message && touched.message ? styles.inputErr : ''}`}
                        placeholder="Your message…"
                      />
                      {errors.message && touched.message && (
                        <span className={styles.err} role="alert">{errors.message}</span>
                      )}
                    </div>

                    {status === 'error' && (
                      <p className={styles.errMsg} role="alert">Something went wrong. Please try again.</p>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                      {status === 'sending' ? 'Sending…' : <><SendIcon /> Send Message</>}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <aside className={styles.details}>
                <h2 className={styles.detailsTitle}>Contact Details</h2>
                {DETAILS.map(({ label, value, href, external }) => (
                  <div key={label} className={styles.detailRow}>
                    <p className={styles.detailLabel}>{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className={styles.detailLink}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className={styles.detailValue}>{value}</p>
                    )}
                  </div>
                ))}
              </aside>
            </Reveal>

          </div>
        </div>
      </section>
    </>
  )
}
