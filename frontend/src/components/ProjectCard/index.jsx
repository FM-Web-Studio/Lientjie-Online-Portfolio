import { useState } from 'react'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ project, index, onClick }) {
  const [imgError, setImgError] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <article
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
      aria-label={`View ${project.title}`}
    >
      <div className={styles.imageWrap}>
        {!imgError && project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className={styles.image}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.imageFallback}>
            <span>{project.title.charAt(0)}</span>
          </div>
        )}
        <div className={styles.overlay}>
          <span className={styles.overlayPill}>
            Explore
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
        {project.category && (
          <span className={styles.badge}>{project.category}</span>
        )}
      </div>

      <div className={styles.meta}>
        <span className={styles.num}>{num}</span>
        <div className={styles.info}>
          <h3 className={styles.title}>{project.title}</h3>
          {project.description && (
            <p className={styles.desc}>{project.description}</p>
          )}
        </div>
        {project.year && <span className={styles.year}>{project.year}</span>}
      </div>
    </article>
  )
}
