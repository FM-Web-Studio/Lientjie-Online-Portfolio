import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribeFeaturedProjects } from '../../firebase'
import {
  ProjectLightbox, ProjectRow, ProjectRowSkeleton,
  SectionHead, CountUp, Ornament, SectionDots,
} from '../../components'
import { useSectionTracker } from '../../hooks'
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

// How many featured projects the home page carries as full editorial rows.
// Four is the point where the page still reads as a selection rather than the
// Work page duplicated; the rest live behind "View all".
const FEATURED_COUNT = 4

const SECTIONS = [
  { id: 'hero',    label: 'Intro'   },
  { id: 'work',    label: 'Work'    },
  { id: 'about',   label: 'About'   },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
]

export default function Home() {
  const { copy } = useContent()
  const t = copy('home')

  const PROCESS = [
    { num: '01', title: t.process1Title, body: t.process1Body, orn: 'plan'      },
    { num: '02', title: t.process2Title, body: t.process2Body, orn: 'arch'      },
    { num: '03', title: t.process3Title, body: t.process3Body, orn: 'elevation' },
    { num: '04', title: t.process4Title, body: t.process4Body, orn: 'stair'     },
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

  /*
   * The quote is picked once per mount from whichever quote fields are
   * actually filled in. The old version indexed a fixed 0-4 range, so
   * blanking quote 3 in the admin panel left a one-in-five chance of
   * rendering an empty blockquote with a stray attribution dash.
   */
  const quote = useMemo(() => {
    const filled = [1, 2, 3, 4, 5]
      .map(i => ({ text: t[`quote${i}Text`], author: t[`quote${i}Author`] }))
      .filter(q => q.text?.trim())
    if (filled.length === 0) return null
    return filled[Math.floor(Math.random() * filled.length)]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Live subscription rather than a one-shot read, so an admin reordering or
  // re-flagging a project sees the home page update without a reload.
  useEffect(() => {
    const unsubscribe = subscribeFeaturedProjects(
      items => { setProjects(items.slice(0, FEATURED_COUNT)); setLoading(false) },
      err   => { console.error('[Home] featured projects failed:', err); setLoading(false) },
      FEATURED_COUNT,
    )
    return unsubscribe
  }, [])

  const { active: activeSection, register, goTo } = useSectionTracker(
    SECTIONS.map(s => s.id),
  )

  return (
    <>
      <SectionDots sections={SECTIONS} active={activeSection} onJump={goTo} />

      {/* ══ Hero ═══════════════════════════════════════════════════
          Full height, blueprint-gridded, with the display name as the
          only thing competing for attention. */}
      <section ref={register('hero')} data-section="hero" className={styles.hero}>
        <div className={styles.heroDeco} aria-hidden="true">
          <span className="deco-grid" />
          <span className={`deco-blob ${styles.blobClay}`} />
          <span className={`deco-blob ${styles.blobInk}`} />
          <span className={`${styles.arcOuter} k-drift-up`} />
          <span className={`${styles.arcInner} k-drift-down`} />
          <span className={`deco-orn ${styles.ornHeroTR}`}><Ornament variant="compass" /></span>
          <span className={`deco-orn ${styles.ornHeroBR}`}><Ornament variant="colonnade" /></span>
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

          {/* The stats read as a drawing-sheet title block: ruled cells,
              mono labels, serif figures. */}
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

      {/* ══ Marquee ════════════════════════════════════════════════ */}
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

      {/* ══ 01 Selected work ═══════════════════════════════════════
          Full-width alternating rows on the wide measure. Deliberately
          the widest thing on the page. */}
      <section
        ref={register('work')}
        data-section="work"
        className={`${styles.section} ${styles.workSection}`}
      >
        <div className="container">
          <SectionHead
            num="01"
            eyebrow={t.workEyebrow}
            title={t.workTitle}
            linkTo="/work"
            linkLabel={t.workLink}
          />
        </div>

        <div className={`container-wide ${styles.rows}`}>
          {loading ? (
            /* FEATURED_COUNT skeletons, not two. Each row is roughly a
               viewport tall, so holding space for two while four arrive let
               the page grow by two row-heights the moment the snapshot
               landed - which yanks the content out from under anyone who has
               already started scrolling. Reserving the full expected count
               costs nothing and keeps the scroll position honest. */
            Array.from({ length: FEATURED_COUNT }, (_, i) => (
              <ProjectRowSkeleton key={i} flip={i % 2 === 1} />
            ))
          ) : projects.length === 0 ? (
            <p className={`container ${styles.empty}`}>Projects are on their way.</p>
          ) : (
            projects.map((p, i) => (
              <div key={p.id} className="k-rise">
                <ProjectRow
                  project={p}
                  index={i}
                  flip={i % 2 === 1}
                  onOpen={() => setActive(p)}
                  viewLabel="View project"
                />
              </div>
            ))
          )}
        </div>
      </section>

      {/* ══ 02 About ═══════════════════════════════════════════════
          Two columns where the heading sticks while the body scrolls
          past it - a different shape from every other section. */}
      <section
        ref={register('about')}
        data-section="about"
        className={`${styles.section} ${styles.aboutSection}`}
      >
        <span className={`deco-orn ${styles.ornAbout}`} aria-hidden="true">
          <Ornament variant="arc" />
        </span>

        <div className={`container ${styles.stickyGrid}`}>
          <div className={styles.stickyCol}>
            <div className={styles.stickyInner}>
              <SectionHead num="02" eyebrow={t.aboutEyebrow} title={t.aboutHeading} />
            </div>
          </div>

          <div className={styles.flowCol}>
            <p className={`${styles.aboutBody} k-rise`}>{t.aboutBody}</p>

            <div className={`${styles.numbers} k-stagger`}>
              {ABOUT_NUMS.map(({ value, label }, i) => (
                <div key={label} className={styles.number} style={{ '--i': i }}>
                  <span className={styles.numberRule} aria-hidden="true" />
                  <CountUp value={value} className={styles.numberValue} />
                  <span className={styles.numberLabel}>{label}</span>
                </div>
              ))}
            </div>

            <Link to="/about" className={`${styles.btnPrimary} k-rise`}>
              {t.aboutCta} <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 03 Process ═════════════════════════════════════════════
          A numbered spine, not four identical cards. Each step is a
          band on a vertical rule with its own drafting figure. */}
      <section
        ref={register('process')}
        data-section="process"
        className={`${styles.section} ${styles.processSection}`}
      >
        <span className="deco-grain" aria-hidden="true" />

        <div className="container">
          <SectionHead num="03" eyebrow={t.processEyebrow} title={t.processTitle} />

          <ol className={styles.spine}>
            <span className={`${styles.spineRule} k-draw-y`} aria-hidden="true" />
            {PROCESS.map(({ num, title, body, orn }) => (
              <li key={num} className={`${styles.step} k-rise`}>
                <span className={styles.stepMark} aria-hidden="true">
                  <span className={styles.stepNum}>{num}</span>
                </span>

                <div className={styles.stepBody}>
                  <h3 className={styles.stepTitle}>{title}</h3>
                  <p className={styles.stepText}>{body}</p>
                </div>

                <span className={styles.stepOrn} aria-hidden="true">
                  <Ornament variant={orn} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ Quote ══════════════════════════════════════════════════
          A full-bleed inverted band. The tonal flip is what gives the
          scroll its beat - without it the page is one continuous
          plaster field from nav to footer. */}
      {quote && (
        <section className={styles.quoteSection} aria-label="Quote">
          <span className="deco-grid" aria-hidden="true" />
          <span className={`deco-orn ${styles.ornQuote}`} aria-hidden="true">
            <Ornament variant="arch" />
          </span>

          <div className="container">
            <blockquote className={`${styles.quote} k-rise`}>
              <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
              <p className={styles.quoteText}>{quote.text}</p>
              {quote.author && <cite className={styles.quoteCite}>{quote.author}</cite>}
            </blockquote>
          </div>
        </section>
      )}

      {/* ══ Contact ════════════════════════════════════════════════ */}
      <section
        ref={register('contact')}
        data-section="contact"
        className={styles.contactSection}
      >
        <div className="container">
          <Link to="/contact" className={`${styles.contactPanel} k-rise`}>
            <span className={`deco-orn ${styles.ornContact}`} aria-hidden="true">
              <Ornament variant="colonnade" />
            </span>

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
