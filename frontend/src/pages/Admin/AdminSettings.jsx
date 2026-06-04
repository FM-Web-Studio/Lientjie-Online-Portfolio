import { useState, useEffect } from 'react'
import { getSettings, updateSettings } from '../../lib/firestore'
import styles from './AdminSettings.module.css'

const EMPTY = {
  email: '',
  phone: '',
  location: '',
  social: { instagram: '', linkedin: '', facebook: '' },
}

export default function AdminSettings() {
  const [form,    setForm]    = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  useEffect(() => {
    getSettings('contact')
      .then(data => { if (data) setForm({ ...EMPTY, ...data, social: { ...EMPTY.social, ...data.social } }) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function update(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function updateSocial(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, social: { ...f.social, [name]: value } }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSettings('contact', form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch { alert('Save failed.') }
    finally { setSaving(false) }
  }

  if (loading) return <p style={{ color: 'var(--fg-3)', padding: '24px 0' }}>Loading…</p>

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Settings</h1>
      <p className={styles.sub}>Contact details shown on the Connect page.</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input name="email" type="email" value={form.email} onChange={update}
                placeholder="email@example.com" className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone</label>
              <input name="phone" value={form.phone} onChange={update}
                placeholder="+27 74 695 4980" className={styles.input} />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Location</label>
              <input name="location" value={form.location} onChange={update}
                placeholder="Roodepoort, Gauteng, South Africa" className={styles.input} />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Social Links</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Instagram URL</label>
              <input name="instagram" value={form.social.instagram} onChange={updateSocial}
                placeholder="https://www.instagram.com/username" className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>LinkedIn URL</label>
              <input name="linkedin" value={form.social.linkedin} onChange={updateSocial}
                placeholder="https://www.linkedin.com/in/username" className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Facebook URL</label>
              <input name="facebook" value={form.social.facebook} onChange={updateSocial}
                placeholder="https://www.facebook.com/username" className={styles.input} />
            </div>
          </div>
        </section>

        <div className={styles.footer}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
