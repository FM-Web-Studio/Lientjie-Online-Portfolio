import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProject, createProject, updateProject } from '../../lib/firestore'
import { uploadMultiple } from '../../lib/storage'
import styles from './AdminProjectForm.module.css'

const CATEGORIES = ['academic', 'installation', 'structural', 'urban', 'residential', 'competition']

const EMPTY = {
  title: '',
  description: '',
  longDescription: '',
  year: new Date().getFullYear(),
  category: 'academic',
  tags: '',
  coverImage: '',
  images: '',
  featured: false,
  order: 99,
}

export default function AdminProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm]       = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getProject(id)
      .then(p => {
        if (!p) { navigate('/admin/projects'); return }
        setForm({
          ...EMPTY,
          ...p,
          tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
          images: Array.isArray(p.images) ? p.images.join('\n') : '',
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id, isEdit, navigate])

  function update(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const urls = await uploadMultiple([file], `projects/${form.title || 'untitled'}`)
      setForm(f => ({ ...f, coverImage: urls[0] }))
    } catch { setError('Cover image upload failed.') }
    finally { setUploading(false) }
  }

  async function handleImagesUpload(e) {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    try {
      const urls = await uploadMultiple(files, `projects/${form.title || 'untitled'}`)
      setForm(f => ({
        ...f,
        images: f.images ? `${f.images}\n${urls.join('\n')}` : urls.join('\n'),
      }))
    } catch { setError('Image upload failed.') }
    finally { setUploading(false) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title) { setError('Title is required.'); return }
    setSaving(true)
    setError('')
    try {
      const data = {
        ...form,
        year: Number(form.year),
        order: Number(form.order),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: form.images.split('\n').map(u => u.trim()).filter(Boolean),
      }
      if (isEdit) {
        await updateProject(id, data)
      } else {
        await createProject(data)
      }
      navigate('/admin/projects')
    } catch (err) {
      setError('Save failed. Check console for details.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p style={{ color: 'var(--fg-3)', padding: '24px 0' }}>Loading…</p>

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <h1 className={styles.heading}>{isEdit ? 'Edit Project' : 'New Project'}</h1>
        <button type="button" className={styles.cancelBtn} onClick={() => navigate('/admin/projects')}>
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          {/* Left column */}
          <div className={styles.col}>
            <label className={styles.field}>
              <span className={styles.label}>Title *</span>
              <input name="title" value={form.title} onChange={update} required className={styles.input} placeholder="Project title" />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Short Description</span>
              <textarea name="description" value={form.description} onChange={update} rows={3} className={`${styles.input} ${styles.ta}`} placeholder="One-sentence summary shown on cards" />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Long Description</span>
              <textarea name="longDescription" value={form.longDescription} onChange={update} rows={5} className={`${styles.input} ${styles.ta}`} placeholder="Full description shown in lightbox" />
            </label>

            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>Year</span>
                <input type="number" name="year" value={form.year} onChange={update} className={styles.input} min="2000" max="2099" />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Category</span>
                <select name="category" value={form.category} onChange={update} className={styles.input}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Order</span>
                <input type="number" name="order" value={form.order} onChange={update} className={styles.input} min="1" />
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>Tags (comma-separated)</span>
              <input name="tags" value={form.tags} onChange={update} className={styles.input} placeholder="structural, campus, 2025" />
            </label>

            <label className={styles.checkRow}>
              <input type="checkbox" name="featured" checked={form.featured} onChange={update} className={styles.checkbox} />
              <span className={styles.checkLabel}>Show on home page (featured)</span>
            </label>
          </div>

          {/* Right column */}
          <div className={styles.col}>
            <label className={styles.field}>
              <span className={styles.label}>Cover Image URL</span>
              <input name="coverImage" value={form.coverImage} onChange={update} className={styles.input} placeholder="https://... or /images/..." />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Or upload cover image</span>
              <input type="file" accept="image/*" onChange={handleCoverUpload} className={styles.fileInput} disabled={uploading} />
            </label>
            {form.coverImage && (
              <img src={form.coverImage} alt="Cover preview" className={styles.preview} />
            )}

            <label className={styles.field}>
              <span className={styles.label}>Image URLs (one per line)</span>
              <textarea
                name="images"
                value={form.images}
                onChange={update}
                rows={6}
                className={`${styles.input} ${styles.ta}`}
                placeholder={'/images/Projects/Folly/Image 1.jpeg\n/images/Projects/Folly/Image 2.jpeg'}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Or upload multiple images</span>
              <input type="file" accept="image/*" multiple onChange={handleImagesUpload} className={styles.fileInput} disabled={uploading} />
            </label>
            {uploading && <p className={styles.uploadMsg}>Uploading…</p>}
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.formFooter}>
          <button type="submit" className={styles.saveBtn} disabled={saving || uploading}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
