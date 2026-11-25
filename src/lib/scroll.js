import Lenis from 'lenis'
export const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact']
// s = continuous position through the page, 0..4 (integer = a section is centred). The 3D scene reads it every frame.
export const scrollState = { s: 0 }

export function initScroll() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = reduce ? null : new Lenis({ lerp: 0.09 })
  let tops = []
  const measure = () => { tops = SECTIONS.map((id) => { const el = document.getElementById(id); return el ? el.getBoundingClientRect().top + scrollY : 0 }); tops.push(document.documentElement.scrollHeight) }
  const update = () => {
    const c = scrollY + innerHeight * 0.5; let i = 0
    for (let k = 0; k < 5; k++) if (c >= tops[k]) i = k
    scrollState.s = Math.min(4, i + Math.min(1, Math.max(0, (c - tops[i]) / Math.max(1, tops[i + 1] - tops[i]))))
    document.documentElement.style.setProperty('--p', (scrollY / Math.max(1, tops[5] - innerHeight)).toFixed(4))
  }
  measure(); update()
  lenis ? lenis.on('scroll', update) : addEventListener('scroll', update, { passive: true })
  const ro = new ResizeObserver(() => { measure(); update() }); ro.observe(document.body)
  let raf; const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }; if (lenis) raf = requestAnimationFrame(loop)
  return {
    to: (id) => { const el = document.getElementById(id); if (!el) return; lenis ? lenis.scrollTo(el, { duration: 1.4 }) : el.scrollIntoView() },
    destroy: () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('scroll', update); lenis?.destroy() }
  }
}
