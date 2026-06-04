import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>LM</Link>
          <p className={styles.tagline}>Architecture Student · Johannesburg</p>
        </div>

        <nav className={styles.nav} aria-label="Footer">
          {[['Work', '/work'], ['About', '/about'], ['Contact', '/contact']].map(([l, to]) => (
            <Link key={to} to={to} className={styles.navLink}>{l}</Link>
          ))}
        </nav>

        <div className={styles.social}>
          <a href="https://www.instagram.com/live_love_lien" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            Instagram
          </a>
          <a href="mailto:meiringlientjie0214@gmail.com" className={styles.socialLink}>
            Email
          </a>
        </div>
      </div>
      <div className={styles.bar}>
        <p className={styles.copy}>© {new Date().getFullYear()} Lientjie Meiring</p>
      </div>
    </footer>
  )
}
