import styles from './Skeleton.module.css'

export default function Skeleton({ width = '100%', height = '1rem', style = {} }) {
  return (
    <span
      className={styles.skel}
      style={{ width, height, display: 'block', ...style }}
      aria-hidden="true"
    />
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage} aria-hidden="true" />
      <div className={styles.cardMeta}>
        <Skeleton width="20%" height="0.75rem" />
        <Skeleton width="65%" height="1rem" style={{ marginTop: 8 }} />
        <Skeleton width="30%" height="0.75rem" style={{ marginTop: 6 }} />
      </div>
    </div>
  )
}

export function TimelineSkeleton() {
  return (
    <div className={styles.timeline}>
      <div className={styles.timelineDot} aria-hidden="true" />
      <div className={styles.timelineBody}>
        <Skeleton width="25%" height="0.7rem" />
        <Skeleton width="55%" height="1rem" style={{ marginTop: 8 }} />
        <Skeleton width="40%" height="0.75rem" style={{ marginTop: 6 }} />
        <Skeleton width="85%" height="0.8rem" style={{ marginTop: 8 }} />
      </div>
    </div>
  )
}

export function SkillSkeleton() {
  return (
    <div className={styles.skill}>
      <div className={styles.skillMeta}>
        <Skeleton width="45%" height="0.75rem" />
        <Skeleton width="20%" height="0.75rem" />
      </div>
      <Skeleton width="100%" height="4px" style={{ marginTop: 8, borderRadius: 2 }} />
    </div>
  )
}
