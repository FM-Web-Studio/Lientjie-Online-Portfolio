import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { signOut } from '../../firebase'
import styles from './AdminLayout.module.css'

const NAV = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Projects',  to: '/admin/projects' },
  { label: 'Memories',  to: '/admin/memories' },
  { label: 'About',     to: '/admin/about' },
  { label: 'Settings',  to: '/admin/settings' },
]

export default function AdminLayout() {
  const { user } = useAuth()

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>LM</span>
          <span className={styles.brandSub}>Admin</span>
        </div>

        <nav className={styles.nav} aria-label="Admin navigation">
          {NAV.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.userRow}>
          <span className={styles.userEmail} title={user?.email}>
            {user?.email}
          </span>
          <button className={styles.signOutBtn} onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
