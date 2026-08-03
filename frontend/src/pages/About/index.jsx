import { useEffect, useState } from 'react'
import { getBioProfile, getBioSection } from '../../firebase'
import { PageHero, SectionHead } from '../../components'
import Skeleton, { TimelineSkeleton, SkillSkeleton } from '../../components/Skeleton'
import { useInView, useSpotlight } from '../../hooks'
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

export default function About() {
  const { copy } = useContent()
  const t = copy('about')
  const info = copy('contact')
  const [profile,    setProfile]    = useState(null)
  const [education,  setEducation]  = useState(null)
  const [experience, setExperience] = useState(null)
  const [skills,     setSkills]     = useState(null)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([
      getBioProfile(),
      getBioSection('education'),
      getBioSection('experience'),
      getBioSection('skills'),
    ])
      .then(([p, edu, exp, sk]) => {
        setProfile(p)
        setEducation(edu)
        setExperience(exp)
        setSkills(sk)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const name  = profile?.name  ?? t.fallbackName
  const title = profile?.title ?? t.fallbackTitle

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        heading={
          loading
            ? <Skeleton width="9ch" height="0.82em" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
            : <>{name.split(' ').map((w, i) => (
                i === 0
                  ? <em key={i}>{w}<br /></em>
                  : <span key={i}>{w}</span>
              ))}<span className="dot">.</span></>
        }
        sub={loading ? undefined : title}
      />

      {/* ── 01 Profile ─────────────────────────────────────────── */}
      <section className={styles.section}>
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
      <section className={`${styles.section} ${styles.sectionAlt}`}>
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
      {(loading || experience?.items?.length > 0) && (
        <section className={styles.section}>
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
      {(loading || skills?.categories?.length > 0) && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
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
