import { useEffect, useState } from 'react'
import { getProjects } from '../../lib/firestore'
import ProjectCard from '../../components/Projects/ProjectCard'
import ProjectLightbox from '../../components/Projects/ProjectLightbox'
import { ProjectCardSkeleton } from '../../components/UI/Skeleton'
import { useInView } from '../../hooks/useInView'
import styles from './Projects.module.css'

const CATS = ['All', 'Academic', 'Installation', 'Structural', 'Urban']

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={`${styles.reveal} ${inView ? styles.inView : ''}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('All')
  const [active, setActive]     = useState(null)

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
      {/* Header */}
      <section className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>Portfolio</p>
          <h1 className={styles.heading}>All Projects</h1>
          <p className={styles.sub}>Architecture projects spanning academic studios, structural studies, and installations.</p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className={styles.filterBar}>
        <div className="container">
          <div className={styles.filters}>
            {CATS.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className={styles.grid}>
        <div className="container">
          {loading ? (
            <div className={styles.projectGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <p className={styles.empty}>No projects found.</p>
          ) : (
            <div className={styles.projectGrid}>
              {visible.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
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
