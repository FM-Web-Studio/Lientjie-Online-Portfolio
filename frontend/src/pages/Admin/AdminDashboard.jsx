import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects, getMessages } from '../../firebase'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const [projectCount, setProjectCount] = useState(null)
  const [messages, setMessages]         = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([getProjects(), getMessages()])
      .then(([projects, msgs]) => {
        setProjectCount(projects.length)
        setMessages(msgs)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const unread = messages.filter(m => !m.read).length

  return (
    <div>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.sub}>Manage the portfolio content.</p>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{loading ? '—' : projectCount}</span>
          <span className={styles.statLabel}>Projects</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{loading ? '—' : messages.length}</span>
          <span className={styles.statLabel}>Messages</span>
        </div>
        {unread > 0 && (
          <div className={`${styles.stat} ${styles.statAlert}`}>
            <span className={styles.statNum}>{unread}</span>
            <span className={styles.statLabel}>Unread</span>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Link to="/admin/projects" className={styles.actionCard}>
          <h3 className={styles.actionTitle}>Manage Projects</h3>
          <p className={styles.actionDesc}>Add, edit, and reorder portfolio projects</p>
          <span className={styles.actionArrow}>→</span>
        </Link>
        <Link to="/admin/projects/new" className={styles.actionCard}>
          <h3 className={styles.actionTitle}>Add New Project</h3>
          <p className={styles.actionDesc}>Create a new project entry</p>
          <span className={styles.actionArrow}>→</span>
        </Link>
      </div>

      {/* Recent messages */}
      {messages.length > 0 && (
        <div className={styles.msgSection}>
          <h2 className={styles.msgHeading}>Recent Messages</h2>
          <div className={styles.msgList}>
            {messages.slice(0, 5).map(m => (
              <div key={m.id} className={`${styles.msg} ${!m.read ? styles.msgUnread : ''}`}>
                <div className={styles.msgMeta}>
                  <span className={styles.msgName}>{m.name}</span>
                  <span className={styles.msgEmail}>{m.email}</span>
                </div>
                {m.subject && <p className={styles.msgSubject}>{m.subject}</p>}
                <p className={styles.msgBody}>{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
