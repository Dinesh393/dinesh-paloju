import { useEffect, useState } from 'react'
import { scrollState } from './scroll'
// Index of the section nearest the viewport centre. State changes only when it changes.
export function useActive() {
  const [a, setA] = useState(0)
  useEffect(() => { let raf, last = 0; const l = () => { const i = Math.round(scrollState.s); if (i !== last) { last = i; setA(i) } raf = requestAnimationFrame(l) }; l(); return () => cancelAnimationFrame(raf) }, [])
  return a
}
export const hasWebGL = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } }
export const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
