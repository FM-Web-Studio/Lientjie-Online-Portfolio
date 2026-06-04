import { useEffect, useState, useCallback } from 'react'
import styles from './ProjectLightbox.module.css'

export default function ProjectLightbox({ project, onClose }) {
  const [idx, setIdx] = useState(0)
  const [imgError, setImgError] = useState({})
  const images = project.images?.length ? project.images : [project.coverImage].filter(Boolean)

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  function handleImgError(i) {
    setImgError(prev => ({ ...prev, [i]: true }))
  }

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.panel} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{project.title}</h2>
            <p className={styles.subtitle}>
              <span className={styles.cat}>{project.category}</span>
              <span>·</span>
              <span>{project.year}</span>
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Main image */}
        <div className={styles.stage}>
          {!imgError[idx] && images[idx] ? (
            <img
              key={idx}
              src={images[idx]}
              alt={`${project.title} — ${idx + 1}`}
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
              <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={prev} aria-label="Previous">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className={`${styles.navBtn} ${styles.navNext}`} onClick={next} aria-label="Next">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
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
          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${i === idx ? styles.thumbActive : ''}`}
                  onClick={() => setIdx(i)}
                  aria-label={`Image ${i + 1}`}
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
              {project.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
