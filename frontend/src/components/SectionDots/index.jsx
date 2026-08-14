import styles from './SectionDots.module.css'

/**
 * Fixed right-edge reading-position nav. Each section gets a dot; the one the
 * reader is in is filled, and hovering reveals its label. Driven by
 * useSectionTracker, which owns the IntersectionObserver and the Lenis jump.
 *
 * Hidden below 900px: on a phone the dots would sit under the thumb and there
 * is not enough viewport width for the labels to appear without covering the
 * content they describe.
 */
export default function SectionDots({ sections, active, onJump }) {
  if (!sections?.length) return null

  return (
    <nav className={styles.dots} aria-label="Page sections">
      {sections.map(({ id, label }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            className={`${styles.dot} ${isActive ? styles.dotActive : ''}`}
            onClick={() => onJump(id)}
            aria-label={label}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className={styles.label}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
