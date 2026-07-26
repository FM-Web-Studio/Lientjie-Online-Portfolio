import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProjects, getProjects, getMemories } from '../../firebase'
import { ProjectCard, ProjectLightbox, Reveal } from '../../components'
import { ProjectCardSkeleton } from '../../components'
import { useContent } from '../../context/ContentContext'
import styles from './Home.module.css'

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export default function Home() {
  const { copy } = useContent()
  const t = copy('home')
  const QUOTES = [
    { text: t.quote1Text, author: t.quote1Author },
    { text: t.quote2Text, author: t.quote2Author },
    { text: t.quote3Text, author: t.quote3Author },
    { text: t.quote4Text, author: t.quote4Author },
    { text: t.quote5Text, author: t.quote5Author },
  ]
  const PROCESS = [
    { num: '01', title: t.process1Title, body: t.process1Body },
    { num: '02', title: t.process2Title, body: t.process2Body },
    { num: '03', title: t.process3Title, body: t.process3Body },
    { num: '04', title: t.process4Title, body: t.process4Body },
  ]
  const [projects,  setProjects]  = useState([])
  const [memories,  setMemories]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [active,    setActive]    = useState(null)
  const [quoteIdx] = useState(() => Math.floor(Math.random() * 5))
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
            {t.heroEyebrow}
          </p>

          <h1 className={`${styles.heroName} ${styles.anim2}`}>
            <em className={styles.nameFirst}>{t.heroNameFirst}</em>
            <span className={styles.nameLast}>{t.heroNameLast}<span className={styles.namePeriod} aria-hidden="true">.</span></span>
          </h1>

          <p className={`${styles.heroBio} ${styles.anim3}`}>
            {t.heroBio}
          </p>

          <div className={`${styles.heroCta} ${styles.anim4}`}>
            <Link to="/work" className={styles.btnPrimary}>
              {t.heroCtaPrimary} <ArrowRight />
            </Link>
            <Link to="/about" className={styles.btnGhost}>
              {t.heroCtaSecondary} <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className={`${styles.heroStats} ${styles.anim5}`}>
            <div className={styles.heroStat}>
              <strong>{t.stat1Value}</strong>
              <span>{t.stat1Label}</span>
            </div>
            <div className={styles.statDiv} aria-hidden="true" />
            <div className={styles.heroStat}>
              <strong>{t.stat2Value}</strong>
              <span>{t.stat2Label}</span>
            </div>
            <div className={styles.statDiv} aria-hidden="true" />
            <div className={styles.heroStat}>
              <strong>{t.stat3Value}</strong>
              <span>{t.stat3Label}</span>
            </div>
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <span className={styles.scrollLine} />
          <span className={styles.scrollDot} />
        </div>
      </section>

      {/* ── Selected Work - only rendered once we have something to show ── */}
      {(loading || projects.length > 0) && (
        <section className={styles.workSection}>
          <div className="container">
            <Reveal>
              <div className={styles.sectionHead}>
                <div>
                  <p className={styles.sectionEye}>{t.workEyebrow}</p>
                  <h2 className={styles.sectionTitle}>{t.workTitle}</h2>
                </div>
                <Link to="/work" className={styles.sectionLink}>
                  {t.workLink} <ArrowRight />
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
                <p className={styles.sectionEye}>{t.aboutEyebrow}</p>
                <h2 className={styles.aboutHeading}>{t.aboutHeading}</h2>
                <p className={styles.aboutBody}>{t.aboutBody}</p>
                <Link to="/about" className={styles.btnPrimary}>
                  {t.aboutCta} <ArrowRight />
                </Link>
              </div>
            </Reveal>

            <div className={styles.aboutNumbers}>
              {[
                { num: t.stat1Value, label: t.aboutNum1Label },
                { num: t.stat2Value, label: t.aboutNum2Label },
                { num: t.stat3Value, label: t.aboutNum3Label },
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
              <p className={styles.sectionEye}>{t.processEyebrow}</p>
              <h2 className={styles.sectionTitle}>{t.processTitle}</h2>
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
                <p className={styles.sectionEye}>{t.memoriesEyebrow}</p>
                <h2 className={styles.sectionTitle}>{t.memoriesTitle}</h2>
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
              <cite className={styles.quoteCite}>- {quote.author}</cite>
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
                <p className={styles.sectionEye}>{t.contactEyebrow}</p>
                <h2 className={styles.contactStripHeading}>{t.contactHeading}</h2>
              </div>
              <Link to="/contact" className={styles.btnPrimary}>
                {t.contactCta} <ArrowRight />
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
