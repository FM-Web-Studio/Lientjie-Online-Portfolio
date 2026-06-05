import { useEffect, useState, useCallback, useRef } from 'react'
import styles from './ProjectLightbox.module.css'

export default function ProjectLightbox({ project, onClose }) {
  const [idx, setIdx]         = useState(0)
  const [imgError, setImgError] = useState({})
  const panelRef              = useRef(null)

  const images = project.images?.length
    ? project.images
    : [project.coverImage].filter(Boolean)

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIdx(i => (i + 1)                 % images.length), [images.length])

  useEffect(() => {
    const scrollW = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow     = 'hidden'
    document.body.style.paddingRight = `${scrollW}px`
    panelRef.current?.focus()

    return () => {
      document.body.style.overflow     = ''
      document.body.style.paddingRight = ''
    }
  }, [])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  const handleImgError = i => setImgError(p => ({ ...p, [i]: true }))

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>{project.title}</h2>
            <p className={styles.sub}>
              {project.category && <span className={styles.cat}>{project.category}</span>}
              {project.category && project.year && <span className={styles.dot}>·</span>}
              {project.year && <span>{project.year}</span>}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6"  y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Image stage */}
        <div className={styles.stage}>
          {!imgError[idx] && images[idx] ? (
            <img
              key={idx}
              src={images[idx]}
              alt={`${project.title} — ${idx + 1} of ${images.length}`}
              className={styles.mainImg}
              onError={() => handleImgError(idx)}
            />
          ) : (
            <div className={styles.imgFallback}>
              <span>{project.title.charAt(0)}</span>
            </div>
          )}

          {images.length > 1 && (
            <>
              <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={prev} aria-label="Previous image">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button className={`${styles.navBtn} ${styles.navNext}`} onClick={next} aria-label="Next image">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <span className={styles.counter}>{idx + 1} / {images.length}</span>
            </>
          )}
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          {(project.longDescription || project.description) && (
            <p className={styles.desc}>{project.longDescription || project.description}</p>
          )}

          <div className={styles.bottomRow}>
            {images.length > 1 && (
              <div className={styles.thumbs} role="list" aria-label="Image thumbnails">
                {images.map((src, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === idx ? styles.thumbActive : ''}`}
                    onClick={() => setIdx(i)}
                    aria-label={`View image ${i + 1}`}
                    role="listitem"
                  >
                    {!imgError[i] ? (
                      <img src={src} alt="" onError={() => handleImgError(i)} />
                    ) : (
                      <div className={styles.thumbFallback} />
                    )}
                  </button>
                ))}
              </div>
            )}

            {project.tags?.length > 0 && (
              <div className={styles.tags}>
                {project.tags.map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
