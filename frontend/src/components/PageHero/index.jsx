import styles from './PageHero.module.css'

/**
 * Shared hero for the inner pages. Mirrors the Home hero's editorial
 * structure - ruled eyebrow, oversized serif heading, narrow sub - at a
 * smaller scale, with the same drifting arc behind it.
 *
 * `heading` may be a string or nodes, so a page can emphasise part of it.
 */
export default function PageHero({ eyebrow, heading, sub }) {
  return (
    <section className={styles.hero}>
      <span className={`${styles.arc} k-drift-up`} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <p className={`${styles.eyebrow} ${styles.in1}`}>
          <span className={styles.rule} aria-hidden="true" />
          {eyebrow}
        </p>

        <h1 className={`${styles.heading} ${styles.in2}`}>{heading}</h1>

        {sub && <p className={`${styles.sub} ${styles.in3}`}>{sub}</p>}
      </div>
    </section>
  )
}
