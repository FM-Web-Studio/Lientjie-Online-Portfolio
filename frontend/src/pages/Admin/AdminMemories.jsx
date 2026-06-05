import { useState, useEffect } from 'react'
import { getAllMemories, updateMemory, deleteMemory, createMemory } from '../../firebase'
import { uploadFile } from '../../firebase'
import { useToast } from '../../context/ToastContext'
import styles from './AdminMemories.module.css'

export default function AdminMemories() {
  const { addToast } = useToast()
  const [memories, setMemories] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(null)   // memory id being edited inline
  const [uploading, setUploading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      setMemories(await getAllMemories())
    } catch { addToast({ type: 'error', title: 'Failed to load memories' }) }
    finally { setLoading(false) }
  }

  async function toggleActive(m) {
    try {
      await updateMemory(m.id, { active: !m.active })
      setMemories(prev => prev.map(x => x.id === m.id ? { ...x, active: !x.active } : x))
    } catch { addToast({ type: 'error', title: 'Update failed' }) }
  }

  async function saveCaption(m, caption) {
    try {
      await updateMemory(m.id, { caption })
      setMemories(prev => prev.map(x => x.id === m.id ? { ...x, caption } : x))
      setEditing(null)
      addToast({ type: 'success', title: 'Caption saved' })
    } catch { addToast({ type: 'error', title: 'Save failed' }) }
  }

  async function saveOrder(m, order) {
    const n = Number(order)
    if (isNaN(n)) return
    try {
      await updateMemory(m.id, { order: n })
      setMemories(prev =>
        [...prev.map(x => x.id === m.id ? { ...x, order: n } : x)]
          .sort((a, b) => a.order - b.order)
      )
    } catch { addToast({ type: 'error', title: 'Save failed' }) }
  }

  async function remove(m) {
    if (!window.confirm(`Delete "${m.caption}"?`)) return
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
      const url = await uploadFile(file, 'memories')
      const maxOrder = memories.reduce((m, x) => Math.max(m, x.order ?? 0), 0)
      await createMemory({
        filename: file.name,
        caption:  file.name.replace(/\.[^.]+$/, ''),
        url,
        order: maxOrder + 1,
      })
      addToast({ type: 'success', title: 'Memory added!' })
      await load()
    } catch { addToast({ type: 'error', title: 'Upload failed' }) }
    finally { setUploading(false); e.target.value = '' }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Memories</h1>
          <p className={styles.sub}>Photos shown on the home page.</p>
        </div>
        <label className={`${styles.uploadBtn} ${uploading ? styles.uploading : ''}`}>
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} hidden />
          {uploading ? 'Uploading…' : '+ Add Photo'}
        </label>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading…</p>
      ) : memories.length === 0 ? (
        <p className={styles.empty}>No memories yet. Upload a photo to get started.</p>
      ) : (
        <div className={styles.grid}>
          {memories.map(m => (
            <div key={m.id} className={`${styles.card} ${!m.active ? styles.inactive : ''}`}>
              <div className={styles.imgWrap}>
                <img src={m.url} alt={m.caption} className={styles.img} />
                <div className={styles.imgOverlay}>
                  <button
                    className={`${styles.visBtn} ${m.active ? styles.visBtnOn : ''}`}
                    onClick={() => toggleActive(m)}
                    title={m.active ? 'Hide from site' : 'Show on site'}
                  >
                    {m.active ? '👁 Visible' : '🙈 Hidden'}
                  </button>
                </div>
              </div>

              <div className={styles.meta}>
                {editing === m.id ? (
                  <CaptionEdit
                    initial={m.caption}
                    onSave={caption => saveCaption(m, caption)}
                    onCancel={() => setEditing(null)}
                  />
                ) : (
                  <button className={styles.captionBtn} onClick={() => setEditing(m.id)}>
                    <span className={styles.caption}>{m.caption || 'Add caption…'}</span>
                    <span className={styles.editIcon}>✎</span>
                  </button>
                )}

                <div className={styles.row}>
                  <label className={styles.orderLabel}>
                    Order
                    <input
                      type="number"
                      min="1"
                      defaultValue={m.order}
                      className={styles.orderInput}
                      onBlur={e => saveOrder(m, e.target.value)}
                    />
                  </label>
                  <button className={styles.deleteBtn} onClick={() => remove(m)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CaptionEdit({ initial, onSave, onCancel }) {
  const [val, setVal] = useState(initial)
  return (
    <div className={styles.captionForm}>
      <input
        className={styles.captionInput}
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onSave(val); if (e.key === 'Escape') onCancel() }}
        autoFocus
      />
      <button className={styles.saveSmall} onClick={() => onSave(val)}>Save</button>
      <button className={styles.cancelSmall} onClick={onCancel}>✕</button>
    </div>
  )
}
