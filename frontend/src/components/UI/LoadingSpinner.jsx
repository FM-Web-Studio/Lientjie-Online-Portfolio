import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner({ fullPage = false }) {
  return (
    <div className={`${styles.wrap} ${fullPage ? styles.fullPage : ''}`}>
      <div className={styles.ring} />
    </div>
  )
}
