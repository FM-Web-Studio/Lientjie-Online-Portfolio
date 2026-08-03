import { useEffect, useState } from 'react'
import { getProjects } from '../../firebase'
import { ProjectCard, ProjectLightbox, PageHero, ProjectCardSkeleton } from '../../components'
import { useContent } from '../../context/ContentContext'
import styles from './Work.module.css'

export default function Work() {
  const { copy } = useContent()
  const t = copy('work')
  const CATS = ['All', ...t.categories.split(',').map(c => c.trim()).filter(Boolean)]
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('All')
  const [active,   setActive]   = useState(null)

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const visible = filter === 'All'
    ? projects
    : projects.filter(p => p.category?.toLowerCase() === filter.toLowerCase())

  const count = String(visible.length).padStart(2, '0')

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        heading={<><em>{t.heading1}</em><br />{t.heading2}<span className="dot">.</span></>}
        sub={t.sub}
      />

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className={styles.filterBar}>
        <div className={`container ${styles.filterInner}`}>
          <div className={styles.filters} role="group" aria-label="Filter projects">
            {CATS.map(cat => (
              <button
                key={cat}
                type="button"
                className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Live count doubles as the editorial index for the grid below. */}
          <p className={styles.count} aria-live="polite">
            {loading ? '—' : count}
            <span className={styles.countLabel}>
              {visible.length === 1 ? 'Project' : 'Projects'}
            </span>
          </p>
        </div>
      </div>

      {/* ── Grid ───────────────────────────────────────────────── */}
      <section className={styles.gridSection}>
        <div className="container">
          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
            </div>
          ) : visible.length === 0 ? (
            <p className={styles.empty}>{t.emptyText}</p>
          ) : (
            /* Keyed on the filter so the stagger replays when it changes. */
            <div className={`${styles.grid} k-stagger`} key={filter}>
              {visible.map((p, i) => (
                <div key={p.id} style={{ '--i': i % 3 }}>
                  <ProjectCard project={p} index={i} onClick={() => setActive(p)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {active && <ProjectLightbox project={active} onClose={() => setActive(null)} />}
    </>
  )
}
