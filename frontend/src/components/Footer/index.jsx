import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            L<span className={styles.logoDot}>·</span>M
          </Link>
          <p className={styles.tagline}>Architecture Portfolio</p>
        </div>

        <nav className={styles.nav} aria-label="Footer navigation">
          <Link to="/work"    className={styles.navLink}>Work</Link>
          <Link to="/about"   className={styles.navLink}>About</Link>
          <Link to="/contact" className={styles.navLink}>Contact</Link>
        </nav>

        <p className={styles.copy}>
          © {new Date().getFullYear()} Lientjie Meiring
        </p>
      </div>
    </footer>
  )
}
