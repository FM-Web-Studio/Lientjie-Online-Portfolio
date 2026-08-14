import { useEffect, useState } from 'react'
import { subscribeBioSection } from '../../firebase'
import { PageHero, SectionHead, Ornament, SectionDots } from '../../components'
import Skeleton, { TimelineSkeleton, SkillSkeleton } from '../../components/Skeleton'
import { useInView, useSpotlight, useSectionTracker } from '../../hooks'
import { useContent } from '../../context/ContentContext'
import styles from './About.module.css'

function SkillBar({ label, level }) {
  const [ref, inView] = useInView(0.2)
  return (
    <div className={styles.skillItem}>
      <div className={styles.skillMeta}>
        <span className={styles.skillLabel}>{label}</span>
        <span className={styles.skillPct}>{level}%</span>
      </div>
      <div className={styles.skillTrack} ref={ref}>
        <div className={styles.skillFill} style={{ width: inView ? `${level}%` : '0%' }} />
      </div>
    </div>
  )
}

function TimelineEntry({ period, role, place, description }) {
  const spot = useSpotlight()
  return (
    <div className={`${styles.entry} k-spotlight`} {...spot}>
      <span className={styles.entryDot} aria-hidden="true" />
      <div className={styles.entryBody}>
        <span className={styles.period}>{period}</span>
        <h3 className={styles.entryRole}>{role}</h3>
        <p className={styles.entryPlace}>{place}</p>
        {description && <p className={styles.entryDesc}>{description}</p>}
      </div>
    </div>
  )
}

// The four bio documents, each on its own live listener.
const BIO_SECTIONS = ['profile', 'education', 'experience', 'skills']

export default function About() {
  const { copy } = useContent()
  const t = copy('about')
  const info = copy('contact')
  const [bio, setBio] = useState({})
  const [loading, setLoading] = useState(true)

  /*
   * One listener per bio document. The loading flag clears once every one has
   * reported at least once, tracked with a Set of section names rather than a
   * counter: a listener that fires twice before its siblings fire at all
   * (which happens whenever one document is edited during first paint) would
   * push a counter to 4 early and reveal the page with empty sections.
   */
  useEffect(() => {
    const seen = new Set()
    const markSeen = section => {
      seen.add(section)
      if (seen.size === BIO_SECTIONS.length) setLoading(false)
    }

    const unsubs = BIO_SECTIONS.map(section =>
      subscribeBioSection(
        section,
        data => { setBio(prev => ({ ...prev, [section]: data })); markSeen(section) },
        err  => { console.error(`[About] ${section} failed:`, err); markSeen(section) },
      ),
    )
    return () => unsubs.forEach(u => u && u())
  }, [])

  const { profile, education, experience, skills } = bio

  const name  = profile?.name  ?? t.fallbackName
  const title = profile?.title ?? t.fallbackTitle

  const hasExperience = loading || experience?.items?.length > 0
  const hasSkills     = loading || skills?.categories?.length > 0

  const sections = [
    { id: 'profile',   label: t.sectionProfile   },
    { id: 'education', label: t.sectionEducation },
    ...(hasExperience ? [{ id: 'experience', label: t.sectionExperience }] : []),
    ...(hasSkills     ? [{ id: 'skills',     label: t.sectionSkills     }] : []),
  ]
  const { active, register, goTo } = useSectionTracker(sections.map(s => s.id))

  return (
    <>
      <SectionDots sections={sections} active={active} onJump={goTo} />

      <PageHero
        eyebrow={t.eyebrow}
        heading={
          /*
           * No loading skeleton here, deliberately.
           *
           * `name` and `title` already fall back to the copy defaults, so the
           * real heading can be rendered on the very first paint. Swapping a
           * one-line grey bar (and a missing sub) for a two-line name plus a
           * subtitle grew the hero the instant the bio snapshot landed and
           * shoved the whole page down - measured at CLS 0.085 on this route,
           * against 0.0006 on Home. Rendering the fallback immediately keeps
           * the box the same size before and after the data arrives, and a
           * real name reads better than a placeholder anyway.
           */
          <>{name.split(' ').map((w, i) => (
            i === 0
              ? <em key={i}>{w}<br /></em>
              : <span key={i}>{w}</span>
          ))}<span className="dot">.</span></>
        }
        sub={title}
        ornament="compass"
      />

      {/* ── 01 Profile ─────────────────────────────────────────── */}
      <section ref={register('profile')} data-section="profile" className={styles.section}>
        <span className={`deco-orn ${styles.ornProfile}`} aria-hidden="true">
          <Ornament variant="arc" />
        </span>

        <div className="container">
          <SectionHead num="01" eyebrow="Introduction" title={t.sectionProfile} />

          {/* The image column is held open while loading. Collapsing it to a
              single column and back reflows the bio and shifts the page. */}
          <div className={`${styles.profileGrid} ${!loading && !profile?.profileImage ? styles.noImage : ''}`}>
            {loading ? (
              <div className={styles.imageWrap} aria-hidden="true" />
            ) : profile?.profileImage && (
              <div className={`${styles.imageWrap} k-rise`}>
                <img
                  src={profile.profileImage}
                  alt={name}
                  className={styles.profileImg}
                  decoding="async"
                  onError={e => { e.currentTarget.parentElement.style.display = 'none' }}
                />
              </div>
            )}

            <div className={`${styles.profileText} k-rise`}>
              {loading ? (
                <div className={styles.skelStack}>
                  {[96, 92, 88, 94, 76, 48].map((w, i) => (
                    <Skeleton key={i} width={`${w}%`} style={{ display: 'block', marginBottom: 8 }} />
                  ))}
                </div>
              ) : (
                <p className={styles.bio}>{profile?.bio}</p>
              )}

              {loading ? (
                <div className={styles.contacts} aria-hidden="true">
                  {[42, 32, 36].map((w, i) => (
                    <Skeleton key={i} width={`${w}%`} height="0.95rem" />
                  ))}
                </div>
              ) : (
                <div className={styles.contacts}>
                  {info.email && (
                    <a href={`mailto:${info.email}`} className={styles.contactLink}>{info.email}</a>
                  )}
                  {info.phone && (
                    <a href={`tel:${info.phone}`} className={styles.contactLink}>{info.phone}</a>
                  )}
                  {info.location && (
                    <span className={styles.contactText}>{info.location}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 Education ───────────────────────────────────────── */}
      <section
        ref={register('education')}
        data-section="education"
        className={`${styles.section} ${styles.sectionAlt}`}
      >
        <span className="deco-grain" aria-hidden="true" />

        <div className="container">
          <SectionHead num="02" eyebrow="Background" title={t.sectionEducation} />
          <div className={styles.timeline}>
            <span className={`${styles.spine} k-draw-y`} aria-hidden="true" />
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <TimelineSkeleton key={i} />)
              : education?.items?.map((item, i) => (
                  <TimelineEntry
                    key={i}
                    period={item.period}
                    role={item.degree}
                    place={item.institution}
                    description={item.description}
                  />
                ))
            }
          </div>
        </div>
      </section>

      {/* ── 03 Experience ──────────────────────────────────────── */}
      {hasExperience && (
        <section ref={register('experience')} data-section="experience" className={styles.section}>
          <span className={`deco-orn ${styles.ornExperience}`} aria-hidden="true">
            <Ornament variant="colonnade" />
          </span>

          <div className="container">
            <SectionHead num="03" eyebrow="Practice" title={t.sectionExperience} />
            <div className={styles.timeline}>
              <span className={`${styles.spine} k-draw-y`} aria-hidden="true" />
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <TimelineSkeleton key={i} />)
                : experience?.items?.map((item, i) => (
                    <TimelineEntry
                      key={i}
                      period={item.period}
                      role={item.role}
                      place={item.company}
                      description={item.description}
                    />
                  ))
              }
            </div>
          </div>
        </section>
      )}

      {/* ── 04 Skills ──────────────────────────────────────────── */}
      {hasSkills && (
        <section
          ref={register('skills')}
          data-section="skills"
          className={`${styles.section} ${styles.sectionAlt}`}
        >
          <span className="deco-grain" aria-hidden="true" />

          <div className="container">
            <SectionHead num="04" eyebrow="Toolkit" title={t.sectionSkills} />
            <div className={`${styles.skillsGrid} k-stagger`}>
              {loading
                ? Array.from({ length: 3 }).map((_, gi) => (
                    <div key={gi}>
                      <Skeleton width="50%" height="0.7rem" style={{ display: 'block', marginBottom: 20 }} />
                      {Array.from({ length: 4 }).map((_, si) => <SkillSkeleton key={si} />)}
                    </div>
                  ))
                : skills?.categories?.map((cat, i) => (
                    <div key={cat.name} style={{ '--i': i }}>
                      <div className={styles.skillCat}>
                        <p className={styles.skillCatName}>{cat.name}</p>
                        <div className={styles.skillList}>
                          {cat.items.map(sk => (
                            <SkillBar key={sk.label} label={sk.label} level={sk.level} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </section>
      )}
    </>
  )
}
