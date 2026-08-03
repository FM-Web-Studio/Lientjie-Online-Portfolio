import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProjects, getProjects } from '../../firebase'
import { ProjectRail, ProjectLightbox, SectionHead, CountUp } from '../../components'
import { useSpotlight } from '../../hooks'
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

function ProcessCard({ num, title, body }) {
  const spot = useSpotlight()
  return (
    <div className={`${styles.processCard} k-lift k-spotlight`} {...spot}>
      <span className={styles.processNum}>{num}</span>
      <h3 className={styles.processTitle}>{title}</h3>
      <p className={styles.processBody}>{body}</p>
    </div>
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
  const STATS = [
    { value: t.stat1Value, label: t.stat1Label },
    { value: t.stat2Value, label: t.stat2Label },
    { value: t.stat3Value, label: t.stat3Label },
  ]
  const ABOUT_NUMS = [
    { value: t.stat1Value, label: t.aboutNum1Label },
    { value: t.stat2Value, label: t.aboutNum2Label },
    { value: t.stat3Value, label: t.aboutNum3Label },
  ]

  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [active,   setActive]   = useState(null)
  const [quoteIdx] = useState(() => Math.floor(Math.random() * 5))
  const quote = QUOTES[quoteIdx]

  useEffect(() => {
    getFeaturedProjects()
      .then(featured => (featured.length > 0 ? featured : getProjects().then(a => a.slice(0, 6))))
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroArt} aria-hidden="true">
          <span className={`${styles.arcOuter} k-drift-up`} />
          <span className={`${styles.arcInner} k-drift-down`} />
        </div>

        <div className={`container ${styles.heroInner}`}>
          <div className={`${styles.heroType} k-hero-out`}>
            <p className={`${styles.eyebrow} ${styles.in1}`}>
              <span className={styles.eyebrowRule} aria-hidden="true" />
              {t.heroEyebrow}
            </p>

            <h1 className={styles.heroName}>
              <em className={`${styles.nameFirst} ${styles.in2}`}>{t.heroNameFirst}</em>
              <span className={`${styles.nameLast} ${styles.in3}`}>
                {t.heroNameLast}
                <span className={styles.namePeriod} aria-hidden="true">.</span>
              </span>
            </h1>

            <p className={`${styles.heroBio} ${styles.in4}`}>{t.heroBio}</p>

            <div className={`${styles.heroCta} ${styles.in5}`}>
              <Link to="/work" className={styles.btnPrimary}>
                {t.heroCtaPrimary} <ArrowRight />
              </Link>
              <Link to="/about" className={styles.btnGhost}>
                {t.heroCtaSecondary} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <dl className={`${styles.heroStats} ${styles.in6}`}>
            {STATS.map(({ value, label }) => (
              <div key={label} className={styles.heroStat}>
                <dt className={styles.statLabel}>{label}</dt>
                <dd className={styles.statValue}>
                  <CountUp value={value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <span className={styles.scrollCue} aria-hidden="true">
          <span className={styles.scrollLine} />
        </span>
      </section>

      {/* ── Marquee - the process vocabulary, drifting on scroll ── */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={`${styles.marqueeTrack} k-marquee-track`}>
          {[0, 1, 2].map(rep => (
            PROCESS.map(({ num, title }) => (
              <span key={`${rep}-${num}`} className={styles.marqueeItem}>
                {title}
                <span className={styles.marqueeDot}>◦</span>
              </span>
            ))
          ))}
        </div>
      </div>

      {/* ── 01 Selected work ───────────────────────────────────── */}
      <section className={styles.section}>
        <div className="container">
          <SectionHead
            num="01"
            eyebrow={t.workEyebrow}
            title={t.workTitle}
            linkTo="/work"
            linkLabel={t.workLink}
          />
          {loading ? (
            <div className={styles.railSkeleton}>
              {[0, 1, 2].map(i => <div key={i} className={styles.railSkelCard} />)}
            </div>
          ) : (
            <ProjectRail
              projects={projects}
              onOpen={setActive}
              emptyText="Projects are on their way."
            />
          )}
        </div>
      </section>

      {/* ── 02 About ───────────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <SectionHead num="02" eyebrow={t.aboutEyebrow} title={t.aboutHeading} />

          <div className={styles.aboutGrid}>
            <div className={`${styles.aboutBody} k-rise`}>
              <p>{t.aboutBody}</p>
              <Link to="/about" className={styles.btnPrimary}>
                {t.aboutCta} <ArrowRight />
              </Link>
            </div>

            <div className={`${styles.numbers} k-stagger`}>
              {ABOUT_NUMS.map(({ value, label }, i) => (
                <div key={label} className={styles.number} style={{ '--i': i }}>
                  <span className={styles.numberRule} aria-hidden="true" />
                  <CountUp value={value} className={styles.numberValue} />
                  <span className={styles.numberLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 Process ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className="container">
          <SectionHead num="03" eyebrow={t.processEyebrow} title={t.processTitle} />
          <div className={`${styles.processGrid} k-stagger`}>
            {PROCESS.map(({ num, title, body }, i) => (
              <div key={num} style={{ '--i': i }}>
                <ProcessCard num={num} title={title} body={body} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ──────────────────────────────────────────────── */}
      <section className={styles.quoteSection} aria-label="Quote">
        <div className="container">
          <blockquote className={`${styles.quote} k-rise`}>
            <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
            <p className={styles.quoteText}>{quote.text}</p>
            <cite className={styles.quoteCite}>{quote.author}</cite>
          </blockquote>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section className={styles.contactSection}>
        <div className="container">
          <Link to="/contact" className={`${styles.contactPanel} k-rise`}>
            <span className={styles.contactEyebrow}>{t.contactEyebrow}</span>
            <span className={styles.contactHeading}>{t.contactHeading}</span>
            <span className={styles.contactAction}>
              {t.contactCta}
              <span className={styles.contactArrow} aria-hidden="true">
                <ArrowRight />
              </span>
            </span>
          </Link>
        </div>
      </section>

      {active && <ProjectLightbox project={active} onClose={() => setActive(null)} />}
    </>
  )
}
