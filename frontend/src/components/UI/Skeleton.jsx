import styles from './Skeleton.module.css'

/** Inline text/block skeleton placeholder */
export default function Skeleton({ width, height = '1rem', style = {}, className = '' }) {
  return (
    <span
      className={`${styles.skel} ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  )
}

/** Full card skeleton matching ProjectCard dimensions */
export function ProjectCardSkeleton() {
  return (
    <div className={styles.cardSkel} aria-hidden="true">
      <div className={styles.cardImage} />
      <div className={styles.cardBody}>
        <span className={`${styles.skel} ${styles.tag}`} />
        <span className={`${styles.skel} ${styles.title}`} />
        <span className={`${styles.skel} ${styles.line}`} style={{ width: '90%' }} />
        <span className={`${styles.skel} ${styles.line}`} style={{ width: '70%' }} />
      </div>
    </div>
  )
}

/** Timeline entry skeleton for Bio page */
export function TimelineSkeleton() {
  return (
    <div className={styles.tlSkel} aria-hidden="true">
      <div className={styles.tlDot} />
      <div className={styles.tlBody}>
        <span className={`${styles.skel} ${styles.tlPeriod}`} />
        <span className={`${styles.skel} ${styles.tlRole}`} />
        <span className={`${styles.skel} ${styles.tlPlace}`} />
        <span className={`${styles.skel} ${styles.line}`} style={{ width: '88%' }} />
        <span className={`${styles.skel} ${styles.line}`} style={{ width: '65%' }} />
      </div>
    </div>
  )
}

/** Skill row skeleton */
export function SkillSkeleton() {
  return (
    <div className={styles.skillSkel} aria-hidden="true">
      <span className={`${styles.skel} ${styles.skillLabel}`} />
      <span className={`${styles.skel} ${styles.skillBar}`} />
    </div>
  )
}
