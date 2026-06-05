import { useState, useEffect } from 'react'
import { getBioProfile, getBioSection, updateBioSection, uploadFile } from '../../firebase'
import styles from './AdminAbout.module.css'

// ── Shared helpers ────────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, name, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.input}
    />
  )
}

function Textarea({ value, onChange, name, placeholder, rows = 4 }) {
  return (
    <textarea
      name={name}
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`${styles.input} ${styles.ta}`}
    />
  )
}

function SaveBtn({ saving, saved, onClick }) {
  return (
    <button className={styles.saveBtn} onClick={onClick} disabled={saving}>
      {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
    </button>
  )
}

// ── Profile tab ───────────────────────────────────────────────────────────────

function ProfileTab({ initial }) {
  const [form, setForm]       = useState(initial ?? {})
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { setForm(initial ?? {}) }, [initial])

  function update(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file, 'profile')
      setForm(f => ({ ...f, profileImage: url }))
    } catch { alert('Image upload failed.') }
    finally { setUploading(false) }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateBioSection('profile', form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch { alert('Save failed.') }
    finally { setSaving(false) }
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.formGrid}>
        <Field label="Full Name">
          <Input name="name" value={form.name} onChange={update} placeholder="Lientjie Meiring" />
        </Field>
        <Field label="Title">
          <Input name="title" value={form.title} onChange={update} placeholder="Architecture Student" />
        </Field>
        <Field label="Subtitle">
          <Input name="subtitle" value={form.subtitle} onChange={update} placeholder="Aspiring Architect & Design Enthusiast" />
        </Field>
        <Field label="Location">
          <Input name="location" value={form.location} onChange={update} placeholder="Roodepoort, Gauteng, South Africa" />
        </Field>
        <Field label="Email">
          <Input name="email" value={form.email} onChange={update} type="email" placeholder="email@example.com" />
        </Field>
        <Field label="Phone">
          <Input name="phone" value={form.phone} onChange={update} placeholder="+27 74 695 4980" />
        </Field>
      </div>

      <Field label="Bio">
        <Textarea name="bio" value={form.bio} onChange={update} rows={5}
          placeholder="Short professional bio shown on the About page…" />
      </Field>

      <Field label="Profile Image">
        {form.profileImage && (
          <img src={form.profileImage} alt="Profile" className={styles.imagePreview}
            onError={e => e.currentTarget.style.display = 'none'} />
        )}
        <Input name="profileImage" value={form.profileImage} onChange={update}
          placeholder="https://… (paste URL or upload below)" />
        <label className={styles.uploadLabel}>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className={styles.fileInput} />
          {uploading ? 'Uploading…' : 'Upload new image'}
        </label>
      </Field>

      <SaveBtn saving={saving} saved={saved} onClick={handleSave} />
    </div>
  )
}

// ── Education tab ─────────────────────────────────────────────────────────────

const EDU_EMPTY = { institution: '', degree: '', period: '', description: '' }

function EducationTab({ initial }) {
  const [items,   setItems]   = useState(initial?.items ?? [])
  const [editing, setEditing] = useState(null) // null | 'new' | number
  const [form,    setForm]    = useState(EDU_EMPTY)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  useEffect(() => { setItems(initial?.items ?? []) }, [initial])

  function update(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  async function persist(newItems) {
    setSaving(true)
    try {
      await updateBioSection('education', { items: newItems })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { alert('Save failed.') }
    finally { setSaving(false) }
  }

  function openAdd()  { setForm(EDU_EMPTY); setEditing('new') }
  function openEdit(i) { setForm(items[i]);  setEditing(i) }
  function cancel()   { setEditing(null) }

  async function confirmSave() {
    const trimmed = { institution: form.institution.trim(), degree: form.degree.trim(), period: form.period.trim(), description: form.description.trim() }
    if (!trimmed.institution || !trimmed.degree) return
    const newItems = editing === 'new'
      ? [...items, trimmed]
      : items.map((it, i) => i === editing ? trimmed : it)
    setItems(newItems)
    setEditing(null)
    await persist(newItems)
  }

  async function remove(i) {
    if (!window.confirm('Delete this entry?')) return
    const newItems = items.filter((_, idx) => idx !== i)
    setItems(newItems)
    await persist(newItems)
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.listHeader}>
        <h3 className={styles.listTitle}>Education ({items.length})</h3>
        <button className={styles.addBtn} onClick={openAdd}>+ Add Entry</button>
      </div>

      {items.map((item, i) => (
        <div key={i} className={styles.listItem}>
          <div className={styles.listItemInfo}>
            <span className={styles.listItemTitle}>{item.degree}</span>
            <span className={styles.listItemSub}>{item.institution} · {item.period}</span>
          </div>
          <div className={styles.listItemActions}>
            <button className={styles.editBtn} onClick={() => openEdit(i)}>Edit</button>
            <button className={styles.deleteBtn} onClick={() => remove(i)}>Delete</button>
          </div>
        </div>
      ))}

      {editing !== null && (
        <div className={styles.inlineForm}>
          <h4 className={styles.inlineTitle}>{editing === 'new' ? 'Add Entry' : 'Edit Entry'}</h4>
          <div className={styles.formGrid}>
            <Field label="Institution">
              <Input name="institution" value={form.institution} onChange={update} placeholder="University of Johannesburg" />
            </Field>
            <Field label="Degree / Qualification">
              <Input name="degree" value={form.degree} onChange={update} placeholder="Bachelor of Architecture" />
            </Field>
            <Field label="Period">
              <Input name="period" value={form.period} onChange={update} placeholder="2023 – Present" />
            </Field>
          </div>
          <Field label="Description">
            <Textarea name="description" value={form.description} onChange={update} placeholder="Brief description…" rows={3} />
          </Field>
          <div className={styles.inlineActions}>
            <button className={styles.saveBtn} onClick={confirmSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button className={styles.cancelBtn} onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}

      {saved && <p className={styles.savedMsg}>✓ Saved</p>}
    </div>
  )
}

// ── Experience tab ────────────────────────────────────────────────────────────

const EXP_EMPTY = { company: '', role: '', period: '', description: '' }

function ExperienceTab({ initial }) {
  const [items,   setItems]   = useState(initial?.items ?? [])
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(EXP_EMPTY)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  useEffect(() => { setItems(initial?.items ?? []) }, [initial])

  function update(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  async function persist(newItems) {
    setSaving(true)
    try {
      await updateBioSection('experience', { items: newItems })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { alert('Save failed.') }
    finally { setSaving(false) }
  }

  function openAdd()   { setForm(EXP_EMPTY); setEditing('new') }
  function openEdit(i) { setForm(items[i]);  setEditing(i) }
  function cancel()    { setEditing(null) }

  async function confirmSave() {
    const trimmed = { company: form.company.trim(), role: form.role.trim(), period: form.period.trim(), description: form.description.trim() }
    if (!trimmed.company || !trimmed.role) return
    const newItems = editing === 'new'
      ? [...items, trimmed]
      : items.map((it, i) => i === editing ? trimmed : it)
    setItems(newItems)
    setEditing(null)
    await persist(newItems)
  }

  async function remove(i) {
    if (!window.confirm('Delete this entry?')) return
    const newItems = items.filter((_, idx) => idx !== i)
    setItems(newItems)
    await persist(newItems)
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.listHeader}>
        <h3 className={styles.listTitle}>Experience ({items.length})</h3>
        <button className={styles.addBtn} onClick={openAdd}>+ Add Entry</button>
      </div>

      {items.map((item, i) => (
        <div key={i} className={styles.listItem}>
          <div className={styles.listItemInfo}>
            <span className={styles.listItemTitle}>{item.role}</span>
            <span className={styles.listItemSub}>{item.company} · {item.period}</span>
          </div>
          <div className={styles.listItemActions}>
            <button className={styles.editBtn} onClick={() => openEdit(i)}>Edit</button>
            <button className={styles.deleteBtn} onClick={() => remove(i)}>Delete</button>
          </div>
        </div>
      ))}

      {editing !== null && (
        <div className={styles.inlineForm}>
          <h4 className={styles.inlineTitle}>{editing === 'new' ? 'Add Entry' : 'Edit Entry'}</h4>
          <div className={styles.formGrid}>
            <Field label="Company / Organisation">
              <Input name="company" value={form.company} onChange={update} placeholder="Klad Studios Architecture" />
            </Field>
            <Field label="Role / Position">
              <Input name="role" value={form.role} onChange={update} placeholder="Job Shadow" />
            </Field>
            <Field label="Period">
              <Input name="period" value={form.period} onChange={update} placeholder="2023" />
            </Field>
          </div>
          <Field label="Description">
            <Textarea name="description" value={form.description} onChange={update} placeholder="Brief description…" rows={3} />
          </Field>
          <div className={styles.inlineActions}>
            <button className={styles.saveBtn} onClick={confirmSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button className={styles.cancelBtn} onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}

      {saved && <p className={styles.savedMsg}>✓ Saved</p>}
    </div>
  )
}

// ── Skills tab ────────────────────────────────────────────────────────────────

function SkillsTab({ initial }) {
  const [cats,   setCats]   = useState(initial?.categories ?? [])
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  useEffect(() => { setCats(initial?.categories ?? []) }, [initial])

  function updateCatName(ci, val) {
    setCats(prev => prev.map((c, i) => i === ci ? { ...c, name: val } : c))
  }

  function addCategory() {
    setCats(prev => [...prev, { name: '', items: [{ label: '', level: 70 }] }])
  }

  function removeCategory(ci) {
    if (!window.confirm('Delete this skill category?')) return
    setCats(prev => prev.filter((_, i) => i !== ci))
  }

  function addSkill(ci) {
    setCats(prev => prev.map((c, i) => i === ci
      ? { ...c, items: [...(c.items || []), { label: '', level: 70 }] }
      : c
    ))
  }

  function removeSkill(ci, si) {
    setCats(prev => prev.map((c, i) => i === ci
      ? { ...c, items: c.items.filter((_, j) => j !== si) }
      : c
    ))
  }

  function updateSkill(ci, si, key, val) {
    setCats(prev => prev.map((c, i) => i === ci
      ? { ...c, items: c.items.map((sk, j) => j === si ? { ...sk, [key]: val } : sk) }
      : c
    ))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateBioSection('skills', { categories: cats })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch { alert('Save failed.') }
    finally { setSaving(false) }
  }

  return (
    <div className={styles.tabContent}>
      {cats.map((cat, ci) => (
        <div key={ci} className={styles.skillCat}>
          <div className={styles.skillCatHeader}>
            <input
              className={`${styles.input} ${styles.catNameInput}`}
              value={cat.name}
              onChange={e => updateCatName(ci, e.target.value)}
              placeholder="Category name (e.g. Software)"
            />
            <button className={styles.deleteBtn} onClick={() => removeCategory(ci)}>Remove</button>
          </div>
          <div className={styles.skillRows}>
            {(cat.items || []).map((sk, si) => (
              <div key={si} className={styles.skillRow}>
                <input
                  className={`${styles.input} ${styles.skillNameInput}`}
                  value={sk.label}
                  onChange={e => updateSkill(ci, si, 'label', e.target.value)}
                  placeholder="Skill name"
                />
                <div className={styles.levelWrap}>
                  <input
                    type="range" min="0" max="100" step="5"
                    value={sk.level}
                    onChange={e => updateSkill(ci, si, 'level', Number(e.target.value))}
                    className={styles.levelSlider}
                  />
                  <span className={styles.levelVal}>{sk.level}%</span>
                </div>
                <button className={styles.deleteBtn} onClick={() => removeSkill(ci, si)}>✕</button>
              </div>
            ))}
          </div>
          <button className={styles.addSkillBtn} onClick={() => addSkill(ci)}>+ Add Skill</button>
        </div>
      ))}

      <button className={styles.addBtn} onClick={addCategory} style={{ marginTop: 8 }}>
        + Add Category
      </button>

      <div className={styles.saveRow}>
        <SaveBtn saving={saving} saved={saved} onClick={handleSave} />
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TABS = ['Profile', 'Education', 'Experience', 'Skills']

export default function AdminAbout() {
  const [tab,     setTab]     = useState('Profile')
  const [data,    setData]    = useState({ profile: null, education: null, experience: null, skills: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getBioProfile(),
      getBioSection('education'),
      getBioSection('experience'),
      getBioSection('skills'),
    ])
      .then(([profile, education, experience, skills]) =>
        setData({ profile, education, experience, skills })
      )
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>About</h1>
      <p className={styles.sub}>Edit all content shown on the About page.</p>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.loading}>Loading…</p>
      ) : (
        <>
          {tab === 'Profile'    && <ProfileTab    initial={data.profile}    />}
          {tab === 'Education'  && <EducationTab  initial={data.education}  />}
          {tab === 'Experience' && <ExperienceTab initial={data.experience} />}
          {tab === 'Skills'     && <SkillsTab     initial={data.skills}     />}
        </>
      )}
    </div>
  )
}
