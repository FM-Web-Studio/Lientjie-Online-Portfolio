import { useCallback, useEffect, useRef, useState } from 'react'
import { getLenis } from './useMomentumScroll'

/**
 * Tracks which page section the reader is currently in, and scrolls to one on
 * demand. Drives the side progress dots on the long editorial pages.
 *
 * Usage:
 *   const { active, register, goTo } = useSectionTracker(ids)
 *   <section ref={register('work')} data-section="work">
 *
 * `ids` is the ordered list of section ids. It is joined into a string for the
 * effect's dependency list rather than passed as an array: a caller that
 * derives the list inline (`[...(hasSkills ? ['skills'] : [])]`) hands us a new
 * array identity on every render, which would tear down and rebuild the
 * observer on every render if the array itself were the dependency.
 */
export default function useSectionTracker(ids = []) {
  const els = useRef({})
  const [active, setActive] = useState(ids[0] ?? null)

  const key = ids.join('|')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined

    // A band across the vertical middle of the viewport. A section becomes
    // "active" when it crosses the reader's eyeline, not when it first peeks
    // in at the bottom edge - otherwise the dots run a section ahead of what
    // is actually being read.
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.dataset.section)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    Object.values(els.current).forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [key])

  const register = useCallback(id => el => {
    if (el) els.current[id] = el
    else delete els.current[id]
  }, [])

  // Lenis owns the scroll position, so handing the target to it keeps the
  // jump inside the same interpolation as a wheel gesture. The native
  // scrollIntoView is the fallback for reduced-motion visitors, where the
  // Lenis instance is deliberately never created.
  const goTo = useCallback(id => {
    const el = els.current[id]
    if (!el) return
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(el, { offset: 0 })
    else el.scrollIntoView({ behavior: 'auto', block: 'start' })
  }, [])

  return { active, register, goTo }
}
