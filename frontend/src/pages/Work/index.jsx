import { useEffect, useState } from 'react'
import { getProjects } from '../../firebase'
import { ProjectCard, ProjectLightbox, Reveal } from '../../components'
import { ProjectCardSkeleton } from '../../components'
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

  return (
    <>
      <section className={styles.header}>
        <div className="container">
          <Reveal>
            <p className={styles.eyebrow}>{t.eyebrow}</p>
            <h1 className={styles.heading}>
              {t.heading1}<br /><em>{t.heading2}</em>.
            </h1>
            <p className={styles.sub}>{t.sub}</p>
          </Reveal>
        </div>
      </section>

      <div className={styles.filterBar}>
        <div className="container">
          <div className={styles.filters} role="group" aria-label="Filter projects">
            {CATS.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className={styles.gridSection}>
        <div className="container">
          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
            </div>
          ) : visible.length === 0 ? (
            <p className={styles.empty}>{t.emptyText}</p>
          ) : (
            <div className={styles.grid}>
              {visible.map((p, i) => (
                <Reveal key={p.id} delay={i * 50}>
                  <ProjectCard project={p} index={i} onClick={() => setActive(p)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {active && (
        <ProjectLightbox project={active} onClose={() => setActive(null)} />
      )}
    </>
  )
}
