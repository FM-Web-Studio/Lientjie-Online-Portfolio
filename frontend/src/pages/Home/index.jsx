import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProjects, getProjects, getMemories } from '../../firebase'
import { ProjectCard, ProjectLightbox, Reveal } from '../../components'
import { ProjectCardSkeleton } from '../../components'
import styles from './Home.module.css'

const QUOTES = [
  { text: 'Architecture is the learned game, correct and magnificent, of forms assembled in the light.', author: 'Le Corbusier' },
  { text: 'The mother art is architecture. Without an architecture of our own we have no soul of our own civilisation.', author: 'Frank Lloyd Wright' },
  { text: 'To create, one must first question everything.', author: 'Eileen Gray' },
  { text: 'Space has always been the spiritual dimension of architecture.', author: 'Arthur Erickson' },
  { text: 'Every great architect is — necessarily — a great poet.', author: 'Frank Lloyd Wright' },
]

const PROCESS = [
  { num: '01', title: 'Concept',  body: 'Every design begins with a question. I explore ideas through sketching, reading, and listening to the site.' },
  { num: '02', title: 'Space',    body: 'Space is the medium of architecture. I shape rooms, thresholds, and voids to create emotional experiences.' },
  { num: '03', title: 'Material', body: 'Honest materials carry truth. I investigate how concrete, timber, glass, and light each tell a story.' },
  { num: '04', title: 'Detail',   body: 'The detail is where architecture becomes real. A well-crafted joint speaks of care and intention.' },
]

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export default function Home() {
  const [projects,  setProjects]  = useState([])
  const [memories,  setMemories]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [active,    setActive]    = useState(null)
  const [quoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length))
  const quote = QUOTES[quoteIdx]

  useEffect(() => {
    Promise.all([
      getFeaturedProjects()
        .then(featured => featured.length > 0 ? featured : getProjects().then(a => a.slice(0, 3))),
      getMemories(),
    ])
      .then(([p, m]) => { setProjects(p); setMemories(m) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroArc} aria-hidden="true" />
        <div className={styles.heroLines} aria-hidden="true">
          <span /><span /><span />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <p className={`${styles.eyebrow} ${styles.anim1}`}>
            <span className={styles.eyebrowLine} aria-hidden="true" />
            Architecture Portfolio
          </p>

          <h1 className={`${styles.heroName} ${styles.anim2}`}>
            <em className={styles.nameFirst}>Lientjie</em>
            <span className={styles.nameLast}>Meiring<span className={styles.namePeriod} aria-hidden="true">.</span></span>
          </h1>

          <p className={`${styles.heroBio} ${styles.anim3}`}>
            A third-year architecture student at the University of Johannesburg,
            fascinated by how space shapes the way we feel, move, and belong.
          </p>

          <div className={`${styles.heroCta} ${styles.anim4}`}>
            <Link to="/work" className={styles.btnPrimary}>
              Explore Work <ArrowRight />
            </Link>
            <Link to="/about" className={styles.btnGhost}>
              My Story <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className={`${styles.heroStats} ${styles.anim5}`}>
            <div className={styles.heroStat}>
              <strong>05</strong>
              <span>Projects</span>
            </div>
            <div className={styles.statDiv} aria-hidden="true" />
            <div className={styles.heroStat}>
              <strong>3rd</strong>
              <span>Year of Study</span>
            </div>
            <div className={styles.statDiv} aria-hidden="true" />
            <div className={styles.heroStat}>
              <strong>2027</strong>
              <span>Expected Graduate</span>
            </div>
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <span className={styles.scrollLine} />
          <span className={styles.scrollDot} />
        </div>
      </section>

      {/* ── Selected Work — only rendered once we have something to show ── */}
      {(loading || projects.length > 0) && (
        <section className={styles.workSection}>
          <div className="container">
            <Reveal>
              <div className={styles.sectionHead}>
                <div>
                  <p className={styles.sectionEye}>Selected Work</p>
                  <h2 className={styles.sectionTitle}>Recent Projects</h2>
                </div>
                <Link to="/work" className={styles.sectionLink}>
                  View All <ArrowRight />
                </Link>
              </div>
            </Reveal>

            <div className={styles.projectGrid}>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
                : projects.map((p, i) => (
                    <Reveal key={p.id} delay={i * 90}>
                      <ProjectCard project={p} index={i} onClick={() => setActive(p)} />
                    </Reveal>
                  ))
              }
            </div>
          </div>
        </section>
      )}

      {/* ── About Teaser ────────────────────────────── */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <Reveal>
              <div className={styles.aboutText}>
                <p className={styles.sectionEye}>About Me</p>
                <h2 className={styles.aboutHeading}>
                  Designing Space,<br />Shaping Experience
                </h2>
                <p className={styles.aboutBody}>
                  My work investigates spatial composition, material honesty,
                  and the stories that architecture can tell. I believe every
                  building is an opportunity to serve and uplift the people
                  who move through it.
                </p>
                <Link to="/about" className={styles.btnPrimary}>
                  More About Me <ArrowRight />
                </Link>
              </div>
            </Reveal>

            <div className={styles.aboutNumbers}>
              {[
                { num: '05', label: 'Projects completed' },
                { num: '3rd', label: 'Year of study' },
                { num: '2027', label: 'Expected graduation' },
              ].map(({ num, label }, i) => (
                <Reveal key={label} delay={i * 80}>
                  <div className={styles.bigNum}>
                    <span className={styles.bigNumVal}>{num}</span>
                    <span className={styles.bigNumLabel}>{label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ─────────────────────────────────── */}
      <section className={styles.processSection}>
        <div className="container">
          <Reveal>
            <div className={styles.processMeta}>
              <p className={styles.sectionEye}>Approach</p>
              <h2 className={styles.sectionTitle}>How I Work</h2>
            </div>
          </Reveal>
          <div className={styles.processGrid}>
            {PROCESS.map(({ num, title, body }, i) => (
              <Reveal key={num} delay={i * 70}>
                <div className={styles.processCard}>
                  <span className={styles.processNum}>{num}</span>
                  <h3 className={styles.processTitle}>{title}</h3>
                  <p className={styles.processBody}>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Memories ────────────────────────────────── */}
      {memories.length > 0 && (
        <section className={styles.memoriesSection}>
          <div className="container">
            <Reveal>
              <div className={styles.memoriesMeta}>
                <p className={styles.sectionEye}>Memories</p>
                <h2 className={styles.sectionTitle}>A Few Moments</h2>
              </div>
            </Reveal>
            <div className={styles.memoriesGrid}>
              {memories.map((m, i) => (
                <Reveal key={m.id} delay={i * 60}>
                  <div className={styles.polaroid} style={{ '--r': `${(i % 2 === 0 ? 1 : -1) * (1 + (i % 3))}deg` }}>
                    <div className={styles.polaroidImg}>
                      <img src={m.url} alt={m.caption} loading="lazy" />
                    </div>
                    {m.caption && (
                      <p className={styles.polaroidCaption}>{m.caption}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Quote ───────────────────────────────────── */}
      <section className={styles.quoteSection} aria-label="Inspirational quote">
        <div className="container">
          <Reveal>
            <blockquote className={styles.quoteBlock}>
              <span className={styles.quoteDecor} aria-hidden="true">"</span>
              <p className={styles.quoteText}>{quote.text}</p>
              <cite className={styles.quoteCite}>— {quote.author}</cite>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ── Contact strip ───────────────────────────── */}
      <section className={styles.contactStrip}>
        <div className="container">
          <Reveal>
            <div className={styles.contactStripInner}>
              <div>
                <p className={styles.sectionEye}>Get In Touch</p>
                <h2 className={styles.contactStripHeading}>
                  Open for studio placements,<br />collaborations &amp; enquiries.
                </h2>
              </div>
              <Link to="/contact" className={styles.btnPrimary}>
                Say Hello <ArrowRight />
              </Link>
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
