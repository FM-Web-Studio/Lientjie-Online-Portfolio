import { useEffect, useState } from 'react'
import { useInView } from '../../hooks'
import styles from './Reveal.module.css'

export default function Reveal({ children, delay = 0, threshold = 0.08 }) {
  const [ref, inView] = useInView(threshold)
  const [settled, setSettled] = useState(false)

  // `will-change` promotes this subtree to its own compositor layer. That is
  // worth it while the reveal runs, but a page with two dozen Reveals keeps
  // two dozen layers alive forever and scrolling stalls. Release once done.
  useEffect(() => {
    if (!inView || settled) return undefined
    const t = setTimeout(() => setSettled(true), delay + 650)
    return () => clearTimeout(t)
  }, [inView, settled, delay])

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${inView ? styles.visible : ''} ${settled ? styles.settled : ''}`}
      style={settled ? undefined : { transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
