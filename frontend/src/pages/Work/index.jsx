import { useEffect, useState } from 'react'
import { subscribeProjects } from '../../firebase'
import {
  ProjectCard, ProjectLightbox, PageHero, ProjectCardSkeleton, Ornament,
} from '../../components'
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

  // Live, so reordering or editing a project in the admin panel is reflected
  // here immediately rather than on the visitor's next reload.
  useEffect(() => {
    const unsubscribe = subscribeProjects(
      items => { setProjects(items); setLoading(false) },
      err   => { console.error('[Work] projects failed:', err); setLoading(false) },
    )
    return unsubscribe
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
        ornament="plan"
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
        <span className={`deco-orn ${styles.ornGrid}`} aria-hidden="true">
          <Ornament variant="elevation" />
        </span>

        <div className="container">
          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 4 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
            </div>
          ) : visible.length === 0 ? (
            <p className={styles.empty}>{t.emptyText}</p>
          ) : (
            /* Keyed on the filter so the stagger replays when it changes.
               `--i` cycles over 2, matching the two-column grid - at the old
               modulo 3 the reveal delays no longer lined up with the rows. */
            <div className={`${styles.grid} k-stagger`} key={filter}>
              {visible.map((p, i) => (
                <div key={p.id} style={{ '--i': i % 2 }}>
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
