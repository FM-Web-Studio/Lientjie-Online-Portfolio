import { useEffect, useRef } from 'react'
import { useInView } from '../../hooks'

const DURATION = 1200

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Stat values are author-entered and mixed - '05', '3rd', '2027'. Pull the
 * leading integer off the front and keep its zero padding and its suffix, so
 * '05' counts 00→05 and '3rd' counts 0rd→3rd. Anything without a leading
 * digit is left alone.
 *
 * Values of 1000 and up are refused: those are years ('2027'), and counting
 * one up renders a stream of meaningless dates before it lands.
 */
function parse(value) {
  const m = String(value ?? '').match(/^(\d+)([\s\S]*)$/)
  if (!m) return null
  const n = Number(m[1])
  if (n >= 1000) return null
  return { n, pad: m[1].length, suffix: m[2] }
}

/**
 * Counts up to `value` the first time it scrolls into view.
 *
 * The running number is written straight to the DOM node rather than held in
 * state, so a 1.2s count costs zero React renders. The final value is what
 * renders initially, so if the animation never runs the correct number is
 * already on screen.
 */
export default function CountUp({ value, className }) {
  const [ref, inView] = useInView(0.4)
  const out = useRef(null)

  useEffect(() => {
    const el = out.current
    if (!inView || !el) return undefined

    const parsed = parse(value)
    if (!parsed || prefersReduced()) return undefined

    let raf = 0
    let startedAt = 0

    const tick = (now) => {
      if (!startedAt) startedAt = now
      const p = Math.min(1, (now - startedAt) / DURATION)
      const eased = 1 - Math.pow(1 - p, 3)
      el.textContent =
        String(Math.round(parsed.n * eased)).padStart(parsed.pad, '0') + parsed.suffix
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span className={className} ref={ref}>
      <span ref={out}>{value}</span>
    </span>
  )
}
