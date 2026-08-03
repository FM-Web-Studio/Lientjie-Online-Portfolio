import { useCallback, useRef } from 'react'

/**
 * Pointer-follow spotlight for `.k-spotlight` elements.
 *
 * The element's rect is measured once on pointer enter and cached, so the
 * pointermove handler only writes two custom properties and never reads
 * layout. Returns props to spread onto the target element.
 */
export default function useSpotlight() {
  const ref  = useRef(null)
  const rect = useRef(null)

  const onPointerEnter = useCallback(() => {
    if (ref.current) rect.current = ref.current.getBoundingClientRect()
  }, [])

  const onPointerMove = useCallback((e) => {
    const el = ref.current
    const r  = rect.current
    if (!el || !r) return
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [])

  const onPointerLeave = useCallback(() => { rect.current = null }, [])

  return { ref, onPointerEnter, onPointerMove, onPointerLeave }
}
