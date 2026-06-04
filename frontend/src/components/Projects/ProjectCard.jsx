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
          <span className={styles.overlayLabel}>View Project</span>
        </div>
        {project.category && (
          <span className={styles.categoryBadge}>{project.category}</span>
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
        <span className={styles.year}>{project.year}</span>
      </div>
    </article>
  )
}
