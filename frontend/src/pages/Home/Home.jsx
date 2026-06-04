import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProjects } from '../../lib/firestore'
import ProjectCard from '../../components/Projects/ProjectCard'
import ProjectLightbox from '../../components/Projects/ProjectLightbox'
import { ProjectCardSkeleton } from '../../components/UI/Skeleton'
import { useInView } from '../../hooks/useInView'
import styles from './Home.module.css'

const QUOTES = [
  { text: 'Architecture is the learned game, correct and magnificent, of forms assembled in the light.', author: 'Le Corbusier' },
  { text: 'The mother art is architecture. Without an architecture of our own we have no soul of our own civilisation.', author: 'Frank Lloyd Wright' },
  { text: 'To create, one must first question everything.', author: 'Eileen Gray' },
  { text: 'Space has always been the spiritual dimension of architecture.', author: 'Arthur Erickson' },
]

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${inView ? styles.inView : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [active, setActive]     = useState(null)
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

  useEffect(() => {
    getFeaturedProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Architecture Portfolio</p>
            <h1 className={styles.heroName}>
              <em className={styles.nameFirst}>Lientjie</em>
              <span className={styles.nameLast}>Meiring</span>
            </h1>
            <div className={styles.heroRule} aria-hidden="true" />
            <p className={styles.heroSub}>Architecture Student&ensp;·&ensp;University of Johannesburg</p>
            <div className={styles.heroStats}>
              {[['05', 'Projects'], ['3rd', 'Year'], ['UJ', 'Johannesburg']].map(([n, l]) => (
                <div key={l} className={styles.heroStat}>
                  <span className={styles.statNum}>{n}</span>
                  <span className={styles.statLabel}>{l}</span>
                </div>
              ))}
            </div>
            <div className={styles.heroCta}>
              <Link to="/work" className={styles.btnPrimary}>View Work</Link>
              <Link to="/about" className={styles.btnGhost}>About Me</Link>
            </div>
          </div>
        </div>
        <div className={styles.scrollHint} aria-hidden="true">
          <span className={styles.scrollLine} />
          <span className={styles.scrollLabel}>Scroll</span>
        </div>
      </section>

      {/* ── Selected Work ─────────────────────────────── */}
      <section className={styles.workSection}>
        <div className="container">
          <Reveal>
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.sectionEye}>Selected Work</p>
                <h2 className={styles.sectionTitle}>Recent Projects</h2>
              </div>
              <Link to="/work" className={styles.sectionLink}>All Projects →</Link>
            </div>
          </Reveal>

          <div className={styles.projectGrid}>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))
              : projects.length === 0
              ? <p className={styles.empty}>No featured projects yet.</p>
              : projects.map((p, i) => (
                  <Reveal key={p.id} delay={i * 80}>
                    <ProjectCard project={p} index={i} onClick={() => setActive(p)} />
                  </Reveal>
                ))
            }
          </div>
        </div>
      </section>

      {/* ── About teaser ──────────────────────────────── */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <Reveal>
              <div className={styles.aboutText}>
                <p className={styles.sectionEye}>About</p>
                <h2 className={styles.aboutHeading}>
                  Designing Space,<br />Shaping Experience
                </h2>
                <p className={styles.aboutBody}>
                  Third-year architecture student at the University of Johannesburg,
                  exploring how built environments respond to culture, memory, and place.
                  My work investigates spatial composition, material honesty, and
                  the stories that architecture can hold.
                </p>
                <Link to="/about" className={styles.btnPrimary}>
                  More About Me
                </Link>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className={styles.aboutStats}>
                {[
                  { num: '05', label: 'Completed Projects' },
                  { num: '3rd', label: 'Year of Study' },
                  { num: '2027', label: 'Expected Graduation' },
                ].map(({ num, label }) => (
                  <div key={label} className={styles.bigStat}>
                    <span className={styles.bigStatNum}>{num}</span>
                    <span className={styles.bigStatLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Quote ─────────────────────────────────────── */}
      <section className={styles.quoteSection}>
        <div className="container">
          <Reveal>
            <blockquote className={styles.quote}>
              <p className={styles.quoteText}>"{quote.text}"</p>
              <cite className={styles.quoteCite}>— {quote.author}</cite>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <Reveal>
            <div className={styles.ctaInner}>
              <h2 className={styles.ctaHeading}>Let's Work Together</h2>
              <Link to="/contact" className={styles.btnPrimary}>Get In Touch</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {active && (
        <ProjectLightbox project={active} onClose={() => setActive(null)} />
      )}
    </>
  )
}
