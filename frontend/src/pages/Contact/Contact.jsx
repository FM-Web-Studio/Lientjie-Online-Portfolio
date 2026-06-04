import { useState } from 'react'
import { createMessage } from '../../lib/firestore'
import { useInView } from '../../hooks/useInView'
import styles from './Contact.module.css'

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={`${styles.reveal} ${inView ? styles.inView : ''}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const EMPTY = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form,    setForm]    = useState(EMPTY)
  const [errors,  setErrors]  = useState({})
  const [touched, setTouched] = useState({})
  const [status,  setStatus]  = useState('idle') // idle | sending | sent | error

  function validate(data) {
    const e = {}
    if (!data.name.trim())    e.name    = 'Name is required'
    if (!data.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Invalid email'
    if (!data.message.trim()) e.message = 'Message is required'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate({ ...form, [name]: value })[name] }))
    }
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched(t => ({ ...t, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validate(form)[name] }))
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
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* Header */}
      <section className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>Contact</p>
          <h1 className={styles.heading}>Let's Connect</h1>
          <p className={styles.sub}>Available for studio opportunities, collaborations, and general enquiries.</p>
        </div>
      </section>

      {/* Body */}
      <section className={styles.body}>
        <div className="container">
          <div className={styles.grid}>

            {/* Form */}
            <Reveal>
              <div className={styles.formWrap}>
                {status === 'sent' ? (
                  <div className={styles.success}>
                    <h3 className={styles.successTitle}>Message received.</h3>
                    <p className={styles.successBody}>Thank you for reaching out — I'll be in touch within 24 hours.</p>
                    <button className={styles.resetBtn} onClick={() => setStatus('idle')}>
                      Send another
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
                        />
                        {errors.name && touched.name && <span className={styles.err}>{errors.name}</span>}
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                          id="email" name="email" type="email"
                          value={form.email} onChange={handleChange} onBlur={handleBlur}
                          className={`${styles.input} ${errors.email && touched.email ? styles.inputErr : ''}`}
                          placeholder="you@email.com"
                        />
                        {errors.email && touched.email && <span className={styles.err}>{errors.email}</span>}
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
                      {errors.message && touched.message && <span className={styles.err}>{errors.message}</span>}
                    </div>
                    {status === 'error' && (
                      <p className={styles.errMsg}>Something went wrong. Please try again.</p>
                    )}
                    <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                      {status === 'sending' ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Details */}
            <Reveal delay={100}>
              <aside className={styles.details}>
                {[
                  { label: 'Email',         value: 'meiringlientjie0214@gmail.com', href: 'mailto:meiringlientjie0214@gmail.com' },
                  { label: 'Phone',         value: '+27 74 695 4980',               href: 'tel:+27746954980' },
                  { label: 'Location',      value: 'Roodepoort, Gauteng, South Africa' },
                  { label: 'Instagram',     value: '@live_love_lien',               href: 'https://www.instagram.com/live_love_lien', external: true },
                  { label: 'Response time', value: 'Within 24 hours' },
                ].map(({ label, value, href, external }) => (
                  <div key={label} className={styles.detailRow}>
                    <p className={styles.detailLabel}>{label}</p>
                    {href ? (
                      <a href={href} className={styles.detailLink} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{value}</a>
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
