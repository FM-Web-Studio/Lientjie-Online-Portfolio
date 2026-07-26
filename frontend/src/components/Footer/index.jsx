import { Link } from 'react-router-dom'
import { useContent } from '../../context/ContentContext'
import styles from './Footer.module.css'

export default function Footer() {
  const { copy } = useContent()
  const brand = copy('brand')
  const info = copy('contact')
  const socials = [
    info.instagram && { label: 'Instagram', href: info.instagram },
    info.linkedin && { label: 'LinkedIn', href: info.linkedin },
    info.facebook && { label: 'Facebook', href: info.facebook },
  ].filter(Boolean)

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            L<span className={styles.logoDot}>·</span>M
          </Link>
          <p className={styles.tagline}>{brand.footerTagline}</p>
        </div>

        <nav className={styles.nav} aria-label="Footer navigation">
          <Link to="/work"    className={styles.navLink}>Work</Link>
          <Link to="/about"   className={styles.navLink}>About</Link>
          <Link to="/contact" className={styles.navLink}>Contact</Link>
          {socials.map(s => (
            <a key={s.label} href={s.href} className={styles.navLink} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
        </nav>

        <p className={styles.copy}>
          © {new Date().getFullYear()} {brand.siteName}
        </p>
      </div>
    </footer>
  )
}
