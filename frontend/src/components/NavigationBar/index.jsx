import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks'
import styles from './NavigationBar.module.css'

const LINKS = [
  { label: 'Work',    to: '/work'    },
  { label: 'About',   to: '/about'   },
  { label: 'Contact', to: '/contact' },
]

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function NavigationBar() {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false })
  const navRef = useRef(null)
  const capsuleRef = useRef(null)

  const updatePill = useCallback(() => {
    if (!navRef.current) return
    const activeEl = navRef.current.querySelector('[data-active="true"]')
    if (!activeEl) {
      setPill(p => ({ ...p, visible: false }))
      return
    }
    const navRect = navRef.current.getBoundingClientRect()
    const elRect  = activeEl.getBoundingClientRect()
    setPill({ left: elRect.left - navRect.left, width: elRect.width, visible: true })
  }, [])

  useEffect(() => {
    updatePill()
  }, [location.pathname, updatePill])

  useEffect(() => {
    const fn = () => updatePill()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [updatePill])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleMouseMove(e) {
    if (!capsuleRef.current) return
    const rect = capsuleRef.current.getBoundingClientRect()
    capsuleRef.current.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
    capsuleRef.current.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
  }

  const close = () => setOpen(false)

  return (
    <>
      <div className={styles.navWrap}>
        <div
          className={styles.capsule}
          ref={capsuleRef}
          onMouseMove={handleMouseMove}
        >
          <Link to="/" className={styles.logo} onClick={close}>
            L<span className={styles.logoDot} aria-hidden="true">·</span>M
          </Link>

          <nav className={styles.navLinks} ref={navRef} aria-label="Main navigation">
            {pill.visible && (
              <span
                className={styles.pill}
                aria-hidden="true"
                style={{ left: pill.left, width: pill.width }}
              />
            )}
            {LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                data-active={location.pathname.startsWith(to) ? 'true' : 'false'}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.linkActive : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <button className={styles.themeBtn} onClick={toggle} aria-label="Toggle theme">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          <button
            className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ''}`}
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span /><span />
          </button>
        </div>
      </div>

      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`} aria-hidden={!open}>
        <div className={styles.overlayTop}>
          <span className={styles.overlayLogo}>L·M</span>
          <button className={styles.overlayClose} onClick={close} aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className={styles.overlayNav} aria-label="Mobile navigation">
          {LINKS.map(({ label, to }, i) => (
            <NavLink
              key={to}
              to={to}
              style={{ '--i': i }}
              className={({ isActive }) =>
                `${styles.overlayLink} ${isActive ? styles.overlayLinkActive : ''}`
              }
              onClick={close}
            >
              <span className={styles.overlayNum}>0{i + 1}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.overlayFoot}>
          <button className={styles.overlayTheme} onClick={() => { toggle(); close() }}>
            {theme === 'light' ? <><MoonIcon /> Dark mode</> : <><SunIcon /> Light mode</>}
          </button>
        </div>
      </div>
    </>
  )
}
