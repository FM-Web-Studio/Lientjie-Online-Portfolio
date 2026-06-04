import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects, deleteProject } from '../../lib/firestore'
import styles from './AdminProjects.module.css'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteProject(id)
      setProjects(ps => ps.filter(p => p.id !== id))
    } catch (err) {
      alert('Failed to delete project.')
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className={styles.topBar}>
        <h1 className={styles.heading}>Projects</h1>
        <Link to="/admin/projects/new" className={styles.addBtn}>
          + Add Project
        </Link>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading…</p>
      ) : projects.length === 0 ? (
        <p className={styles.empty}>No projects yet. <Link to="/admin/projects/new">Add one →</Link></p>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span className={styles.colNum}>#</span>
            <span className={styles.colImage}>Image</span>
            <span className={styles.colTitle}>Title</span>
            <span className={styles.colCat}>Category</span>
            <span className={styles.colYear}>Year</span>
            <span className={styles.colFeatured}>Featured</span>
            <span className={styles.colActions}>Actions</span>
          </div>
          {projects.map((p, i) => (
            <div key={p.id} className={styles.tableRow}>
              <span className={styles.colNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.colImage}>
                {p.coverImage && (
                  <img src={p.coverImage} alt="" className={styles.thumb} />
                )}
              </span>
              <span className={styles.colTitle}>{p.title}</span>
              <span className={styles.colCat}>
                <span className={styles.catTag}>{p.category}</span>
              </span>
              <span className={styles.colYear}>{p.year}</span>
              <span className={styles.colFeatured}>
                {p.featured ? (
                  <span className={styles.featuredYes}>Yes</span>
                ) : (
                  <span className={styles.featuredNo}>No</span>
                )}
              </span>
              <span className={styles.colActions}>
                <Link to={`/admin/projects/${p.id}/edit`} className={styles.editBtn}>
                  Edit
                </Link>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(p.id, p.title)}
                  disabled={deleting === p.id}
                >
                  {deleting === p.id ? '…' : 'Delete'}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
