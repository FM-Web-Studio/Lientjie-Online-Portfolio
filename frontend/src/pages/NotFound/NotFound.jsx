import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <section className={`tone-accent-soft ${styles.page}`}>
      <div className="grid12">
        <div className={styles.body}>
          <p className={styles.eyebrow}>Error 404</p>
          <h1 className={styles.code}>
            Not<span className={styles.codeLast}>found<span className="dot">.</span></span>
          </h1>
          <p className={styles.text}>
            This page has been moved, renamed, or never drawn. The work is all
            still here.
          </p>
          <div className={styles.actions}>
            <Link to="/" className="btn btn-accent">Back to index</Link>
            <Link to="/work" className="btn">View work</Link>
          </div>
        </div>

        {/* A drafting grid occupying the right-hand columns, so the page is
            composed rather than being a centred message in empty space. */}
        <div className={styles.plate} aria-hidden="true" />
      </div>
    </section>
  )
}
