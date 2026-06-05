import { useInView } from '../../hooks'
import styles from './Reveal.module.css'

export default function Reveal({ children, delay = 0, threshold = 0.08 }) {
  const [ref, inView] = useInView(threshold)

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${inView ? styles.visible : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
