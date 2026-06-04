import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logOut } from '../../lib/auth'
import { useAuth } from '../../context/AuthContext'
import styles from './AdminLayout.module.css'

const NAV = [
  { label: 'Dashboard', to: '/admin',          end: true },
  { label: 'Projects',  to: '/admin/projects', end: false },
]

export default function AdminLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logOut()
    navigate('/admin/login')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <span className={styles.sidebarLogo}>LM Admin</span>
          <nav className={styles.sideNav}>
            {NAV.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `${styles.sideLink} ${isActive ? styles.sideLinkActive : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className={styles.sidebarBottom}>
          <p className={styles.userEmail}>{user?.email}</p>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
