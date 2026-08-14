import { useState } from 'react'
import styles from './ProjectRow.module.css'

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

/**
 * A featured project as a large editorial row: image on one side, drawing-sheet
 * metadata on the other, alternating sides down the page.
 *
 * This replaces the horizontal rail that used to carry featured work. The rail
 * capped every image at 420px and put three of them in a 4:5 crop, which is
 * the wrong shape for architecture - plans, sections and elevations are wide,
 * and shrinking them to a phone-sized portrait card throws away the only thing
 * the visitor came to look at.
 *
 * The whole row is NOT one big <button>. The image is the primary control and
 * the text block carries its own explicit link, because a button wrapping a
 * heading, a paragraph and a nested link is invalid markup and screen readers
 * flatten it into one unreadable label.
 */
export default function ProjectRow({ project, index, flip, onOpen, viewLabel = 'View project' }) {
  const [imgError, setImgError] = useState(false)
  const num = String(index + 1).padStart(2, '0')
  const hasImage = !imgError && project.coverImage

  return (
    <article className={`${styles.row} ${flip ? styles.flip : ''}`}>
      <button
        type="button"
        className={styles.figure}
        onClick={onOpen}
        aria-label={`${viewLabel}: ${project.title}`}
      >
        <span className={styles.frame}>
          {hasImage ? (
            <img
              src={project.coverImage}
              alt={project.title}
              className={styles.img}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className={styles.fallback} aria-hidden="true">
              {project.title?.charAt(0) || '·'}
            </span>
          )}
        </span>

        {/* Drawing number, set over the image corner like a sheet stamp. */}
        <span className={styles.stamp} aria-hidden="true">
          <span className={styles.stampNum}>{num}</span>
          {project.year && <span className={styles.stampYear}>{project.year}</span>}
        </span>
      </button>

      <div className={styles.body}>
        <span className={styles.rule} aria-hidden="true" />

        {project.category && (
          <span className={styles.category}>{project.category}</span>
        )}

        <h3 className={styles.title}>{project.title || 'Untitled'}</h3>

        {project.description && (
          <p className={styles.desc}>{project.description}</p>
        )}

        {project.tags?.length > 0 && (
          <ul className={styles.tags}>
            {project.tags.map(tag => (
              <li key={tag} className={styles.tag}>{tag}</li>
            ))}
          </ul>
        )}

        <button type="button" className={styles.link} onClick={onOpen}>
          {viewLabel}
          <span className={styles.linkArrow} aria-hidden="true"><ArrowRight /></span>
        </button>
      </div>
    </article>
  )
}

/** Loading placeholder that matches the row's footprint, so the page does not
    reflow when the real rows arrive. */
export function ProjectRowSkeleton({ flip }) {
  return (
    <div className={`${styles.row} ${flip ? styles.flip : ''}`} aria-hidden="true">
      <div className={`${styles.figure} ${styles.figureSkel}`}>
        <span className={`${styles.frame} ${styles.skelBlock}`} />
      </div>
      <div className={styles.body}>
        <span className={styles.rule} />
        <span className={`${styles.skelLine} ${styles.skelSm}`} />
        <span className={`${styles.skelLine} ${styles.skelLg}`} />
        <span className={styles.skelLine} />
        <span className={`${styles.skelLine} ${styles.skelShort}`} />
      </div>
    </div>
  )
}
