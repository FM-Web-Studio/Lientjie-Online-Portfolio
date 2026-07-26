import { useState, useEffect } from 'react'
import { getAllMemories, updateMemory, deleteMemory, createMemory, uploadFile } from '../../../firebase'
import { useToast } from '../../../context/ToastContext'
import styles from '../Admin.module.css'

export default function MemoriesSection() {
  const { addToast } = useToast()
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setMemories(await getAllMemories()) }
    catch { addToast({ type: 'error', title: 'Failed to load memories' }) }
    finally { setLoading(false) }
  }

  async function toggleActive(m) {
    try {
      await updateMemory(m.id, { active: !m.active })
      setMemories(prev => prev.map(x => x.id === m.id ? { ...x, active: !x.active } : x))
    } catch { addToast({ type: 'error', title: 'Update failed' }) }
  }

  async function saveCaption(m, caption) {
    if (caption === (m.caption || '')) return
    try {
      await updateMemory(m.id, { caption })
      setMemories(prev => prev.map(x => x.id === m.id ? { ...x, caption } : x))
    } catch { addToast({ type: 'error', title: 'Save failed' }) }
  }

  async function saveOrder(m, order) {
    const n = Number(order)
    if (Number.isNaN(n)) return
    try {
      await updateMemory(m.id, { order: n })
      setMemories(prev => [...prev.map(x => x.id === m.id ? { ...x, order: n } : x)].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    } catch { addToast({ type: 'error', title: 'Save failed' }) }
  }

  async function remove(m) {
    if (!window.confirm(`Delete "${m.caption || 'this memory'}"?`)) return
    try {
      await deleteMemory(m.id)
      setMemories(prev => prev.filter(x => x.id !== m.id))
      addToast({ type: 'success', title: 'Memory deleted' })
    } catch { addToast({ type: 'error', title: 'Delete failed' }) }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file, 'portfolio/memories')
      const maxOrder = memories.reduce((mx, x) => Math.max(mx, x.order ?? 0), 0)
      await createMemory({ filename: file.name, caption: file.name.replace(/\.[^.]+$/, ''), url, order: maxOrder + 1 })
      addToast({ type: 'success', title: 'Memory added' })
      await load()
    } catch { addToast({ type: 'error', title: 'Upload failed' }) }
    finally { setUploading(false); e.target.value = '' }
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <p className={styles.intro} style={{ margin: 0 }}>Photos shown on the home page.</p>
        <label className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm} ${styles.uploadBtn}`}>
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} hidden />
          {uploading ? 'Uploading…' : '+ Add Photo'}
        </label>
      </div>

      {loading ? <p className={styles.empty}>Loading…</p>
        : memories.length === 0 ? <p className={styles.empty}>No memories yet. Upload a photo to get started.</p>
        : (
          <div className={styles.memGrid}>
            {memories.map(m => (
              <div key={m.id} className={`${styles.memCard} ${!m.active ? styles.dimmed : ''}`}>
                <img src={m.url} alt={m.caption} className={styles.memImg} />
                <div className={styles.memBody}>
                  <input className={styles.memInput} defaultValue={m.caption} placeholder="Add caption…" onBlur={e => saveCaption(m, e.target.value)} />
                  <div className={styles.memRow}>
                    <label className={styles.meta} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      Order
                      <input type="number" min="1" defaultValue={m.order} className={styles.orderInput} onBlur={e => saveOrder(m, e.target.value)} />
                    </label>
                    <div className={styles.listRowActions}>
                      <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`} onClick={() => toggleActive(m)}>{m.active ? 'Hide' : 'Show'}</button>
                      <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} onClick={() => remove(m)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
