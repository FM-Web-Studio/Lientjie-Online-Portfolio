import Ornament from '../Ornament'
import styles from './PageHero.module.css'

/**
 * Shared hero for the inner pages. Mirrors the Home hero's editorial
 * structure - ruled mono eyebrow, oversized serif heading, narrow sub - at a
 * smaller scale, with the same blueprint grid, pigment blob and drifting arc
 * behind it, so an inner page does not open on a bare field of plaster.
 *
 * `heading` may be a string or nodes, so a page can emphasise part of it.
 * `ornament` picks the drafting figure in the corner; each page passes a
 * different one so the inner pages are distinguishable at a glance.
 */
export default function PageHero({ eyebrow, heading, sub, ornament = 'plan' }) {
  return (
    <section className={styles.hero}>
      <div className={styles.deco} aria-hidden="true">
        <span className="deco-grid" />
        <span className={`deco-blob ${styles.blob}`} />
        <span className={`${styles.arc} k-drift-up`} />
        <span className={`deco-orn ${styles.orn}`}>
          <Ornament variant={ornament} />
        </span>
      </div>

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
