import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './ProjectRail.module.css'

function Chevron({ dir }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={dir === 'prev' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  )
}

function Slide({ project, index, onOpen }) {
  const [imgError, setImgError] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <article className={styles.slide}>
      <button
        type="button"
        className={`${styles.slideBtn} k-lift`}
        onClick={onOpen}
        aria-label={`View ${project.title}`}
      >
        <div className={styles.frame}>
          {!imgError && project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.title}
              className={styles.img}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={styles.fallback}><span>{project.title.charAt(0)}</span></div>
          )}
          <span className={styles.slideNum} aria-hidden="true">{num}</span>
          {project.category && <span className={styles.badge}>{project.category}</span>}
        </div>

        <div className={styles.meta}>
          <h3 className={styles.title}>{project.title}</h3>
          {project.year && <span className={styles.year}>{project.year}</span>}
        </div>
        {project.description && <p className={styles.desc}>{project.description}</p>}
      </button>
    </article>
  )
}

/**
 * Horizontally scrolling project rail.
 *
 * Scrolling is native `overflow-x` with scroll-snap, so the browser handles it
 * on the compositor. The progress bar is driven by a CSS scroll timeline off
 * the rail itself - no scroll listener feeds it. The only listener is a cheap
 * passive one that flips the two arrow-disabled booleans.
 */
export default function ProjectRail({ projects, onOpen, emptyText }) {
  const rail = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd,   setAtEnd]   = useState(false)

  const sync = useCallback(() => {
    const el = rail.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const start = el.scrollLeft <= 4
    const end   = el.scrollLeft >= max - 4
    // Only touch state when a boolean actually flips, so a full drag across
    // the rail causes two renders rather than one per frame.
    setAtStart(p => (p === start ? p : start))
    setAtEnd(p => (p === end ? p : end))
  }, [])

  useEffect(() => {
    const el = rail.current
    if (!el) return undefined
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync, projects.length])

  const step = (dir) => {
    const el = rail.current
    if (!el) return
    const slide = el.querySelector(`.${styles.slide}`)
    const by = slide ? slide.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: dir === 'next' ? by : -by, behavior: 'smooth' })
  }

  // The page uses Lenis for momentum scrolling, which claims wheel events on
  // the root. Translate a horizontal-dominant wheel gesture into rail scroll
  // ourselves so trackpad swipes still work here.
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
    const el = rail.current
    if (!el) return
    e.stopPropagation()
    el.scrollLeft += e.deltaX
  }

  if (!projects.length) {
    return <p className={styles.empty}>{emptyText}</p>
  }

  return (
    <div className={styles.wrap}>
      <div
        className={styles.rail}
        ref={rail}
        onWheel={onWheel}
        tabIndex={0}
        role="region"
        aria-label="Project carousel - scroll horizontally"
      >
        {projects.map((p, i) => (
          <Slide key={p.id} project={p} index={i} onOpen={() => onOpen?.(p)} />
        ))}
        <div className={styles.railPad} aria-hidden="true" />
      </div>

      <div className={styles.controls}>
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressFill} />
        </div>

        <div className={styles.arrows}>
          <button
            type="button" className={styles.arrow} onClick={() => step('prev')}
            disabled={atStart} aria-label="Previous projects"
          >
            <Chevron dir="prev" />
          </button>
          <button
            type="button" className={styles.arrow} onClick={() => step('next')}
            disabled={atEnd} aria-label="Next projects"
          >
            <Chevron dir="next" />
          </button>
        </div>
      </div>
    </div>
  )
}
