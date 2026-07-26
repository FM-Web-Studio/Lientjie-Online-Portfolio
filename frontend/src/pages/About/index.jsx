import { useEffect, useState } from 'react'
import { getBioProfile, getBioSection } from '../../firebase'
import { Reveal } from '../../components'
import Skeleton, { TimelineSkeleton, SkillSkeleton } from '../../components/Skeleton'
import { useInView } from '../../hooks'
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

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className="container">
          <Reveal>
            <p className={styles.eyebrow}>{t.eyebrow}</p>
            {loading ? (
              <>
                <Skeleton width="55%" height="clamp(2.5rem,6vw,4rem)" style={{ display: 'block', marginBottom: 12 }} />
                <Skeleton width="30%" height="1rem" />
              </>
            ) : (
              <>
                <h1 className={styles.name}>
                  {(profile?.name ?? t.fallbackName).split(' ').map((w, i) => (
                    <span key={i} style={{ display: 'block' }}>{w}</span>
                  ))}
                </h1>
                <p className={styles.titleLine}>{profile?.title ?? t.fallbackTitle}</p>
              </>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── Profile ──────────────────────────────────── */}
      <section className={styles.profileSection}>
        <div className="container">
          <div className={`${styles.profileGrid} ${!profile?.profileImage ? styles.noImage : ''}`}>
            {profile?.profileImage && (
              <Reveal>
                <div className={styles.imageWrap}>
                  <img
                    src={profile.profileImage}
                    alt={profile.name ?? 'Profile'}
                    className={styles.profileImg}
                    onError={e => { e.currentTarget.parentElement.style.display = 'none' }}
                  />
                </div>
              </Reveal>
            )}
            <Reveal delay={profile?.profileImage ? 80 : 0}>
              <div className={styles.profileText}>
                <h2 className={styles.sectionTitle}>{t.sectionProfile}</h2>
                {loading ? (
                  <div className={styles.skelStack}>
                    {[90, 85, 70, 55].map(w => (
                      <Skeleton key={w} width={`${w}%`} style={{ display: 'block', marginBottom: 8 }} />
                    ))}
                  </div>
                ) : (
                  <p className={styles.bio}>{profile?.bio}</p>
                )}
                {!loading && (
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
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Education ────────────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <Reveal>
            <h2 className={styles.sectionTitle}>{t.sectionEducation}</h2>
          </Reveal>
          <div className={styles.timeline}>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <TimelineSkeleton key={i} />)
              : education?.items?.map((item, i) => (
                  <Reveal key={i} delay={i * 70}>
                    <div className={styles.entry}>
                      <div className={styles.entryDot} />
                      <div className={styles.entryBody}>
                        <span className={styles.period}>{item.period}</span>
                        <h3 className={styles.entryRole}>{item.degree}</h3>
                        <p className={styles.entryPlace}>{item.institution}</p>
                        {item.description && (
                          <p className={styles.entryDesc}>{item.description}</p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))
            }
          </div>
        </div>
      </section>

      {/* ── Experience ───────────────────────────────── */}
      {(loading || experience?.items?.length > 0) && (
        <section className={styles.section}>
          <div className="container">
            <Reveal>
              <h2 className={styles.sectionTitle}>{t.sectionExperience}</h2>
            </Reveal>
            <div className={styles.timeline}>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <TimelineSkeleton key={i} />)
                : experience?.items?.map((item, i) => (
                    <Reveal key={i} delay={i * 70}>
                      <div className={styles.entry}>
                        <div className={styles.entryDot} />
                        <div className={styles.entryBody}>
                          <span className={styles.period}>{item.period}</span>
                          <h3 className={styles.entryRole}>{item.role}</h3>
                          <p className={styles.entryPlace}>{item.company}</p>
                          {item.description && (
                            <p className={styles.entryDesc}>{item.description}</p>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  ))
              }
            </div>
          </div>
        </section>
      )}

      {/* ── Skills ───────────────────────────────────── */}
      {(loading || skills?.categories?.length > 0) && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className="container">
            <Reveal>
              <h2 className={styles.sectionTitle}>{t.sectionSkills}</h2>
            </Reveal>
            <div className={styles.skillsGrid}>
              {loading
                ? Array.from({ length: 3 }).map((_, gi) => (
                    <div key={gi}>
                      <Skeleton width="50%" height="0.7rem" style={{ display: 'block', marginBottom: 20 }} />
                      {Array.from({ length: 4 }).map((_, si) => <SkillSkeleton key={si} />)}
                    </div>
                  ))
                : skills?.categories?.map(cat => (
                    <Reveal key={cat.name}>
                      <div className={styles.skillCat}>
                        <p className={styles.skillCatName}>{cat.name}</p>
                        <div className={styles.skillList}>
                          {cat.items.map(sk => (
                            <SkillBar key={sk.label} label={sk.label} level={sk.level} />
                          ))}
                        </div>
                      </div>
                    </Reveal>
                  ))
              }
            </div>
          </div>
        </section>
      )}
    </>
  )
}
