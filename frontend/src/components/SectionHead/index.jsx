import { Link } from 'react-router-dom'
import styles from './SectionHead.module.css'

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

/**
 * Numbered editorial section header - "01 —— SELECTED WORK" over a display
 * title, with an optional trailing link. The index rule draws itself across
 * as the header enters the viewport.
 */
export default function SectionHead({ num, eyebrow, title, linkTo, linkLabel, tone = 'default' }) {
  return (
    <header className={`${styles.head} ${tone === 'invert' ? styles.invert : ''}`}>
      <div className={styles.index}>
        {num && <span className={styles.num}>{num}</span>}
        <span className={`${styles.rule} k-draw-x`} aria-hidden="true" />
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      </div>

      <div className={styles.row}>
        <h2 className={`${styles.title} k-rise`}>{title}</h2>
        {linkTo && linkLabel && (
          <Link to={linkTo} className={styles.link}>
            {linkLabel} <ArrowRight />
          </Link>
        )}
      </div>
    </header>
  )
}
