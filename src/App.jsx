import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import content from './data/content.json'
import { initScroll, scrollState } from './lib/scroll'
import { useActive, hasWebGL, prefersReduced } from './lib/hooks'
import { Hero, About, Skills, Projects, Contact } from './components/Sections.jsx'
import Palette from './components/Palette.jsx'
import Fallback from './components/Fallback.jsx'

const Stage = lazy(() => import('./components/scene/Stage.jsx'))

export default function App() {
  const { meta, layers, projects } = content
  const [webgl] = useState(hasWebGL), [reduced] = useState(prefersReduced)
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('theme') !== 'light' } catch { return true } })
  const [pal, setPal] = useState(false), [hover, setHover] = useState(null)
  const [activeId, setActive] = useState(projects[0].id), [openId, setOpen] = useState(null)
  const active = useActive(), sc = useRef()

  useEffect(() => { sc.current = initScroll(); return () => sc.current.destroy() }, [])
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch { /* storage blocked */ } }, [dark])
  useEffect(() => {
    const k = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal((o) => !o) } }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [])

  const go = useCallback((id) => sc.current?.to(id), [])
  const download = () => { const a = document.createElement('a'); a.href = meta.resume; a.download = ''; a.click() }
  const actions = useMemo(() => [
    ...layers.map((l, i) => ({ id: `go-${l.section}`, group: 'Go to', label: `${l.section === 'hero' ? 'Top' : l.section[0].toUpperCase() + l.section.slice(1)} (layer ${i + 1}, ${l.label})`, run: () => go(l.section) })),
    ...projects.map((p) => ({ id: `p-${p.id}`, group: 'Project', label: `Open ${p.title}`, run: () => { setActive(p.id); setOpen(p.id); go('projects') } })),
    { id: 'resume', group: 'Link', label: 'Download resume (PDF)', run: download },
    { id: 'mail', group: 'Link', label: `Email ${meta.email}`, run: () => (location.href = `mailto:${meta.email}`) },
    { id: 'gh', group: 'Link', label: 'GitHub', run: () => window.open(meta.github, '_blank', 'noopener') },
    { id: 'li', group: 'Link', label: 'LinkedIn', run: () => window.open(meta.linkedin, '_blank', 'noopener') },
    { id: 'theme', group: 'Theme', label: dark ? 'Switch to light theme' : 'Switch to dark theme', run: () => setDark((d) => !d) }
  ], [layers, projects, meta, dark, go])

  const shown = hover ?? active
  return (
    <>
      <a className="skip" href="#about">Skip to content</a>
      <header className="nav">
        <button className="nav__brand" onClick={() => go('hero')} aria-label="Back to top"><i aria-hidden="true" />Paloju Dinesh</button>
        <nav aria-label="Sections">
          {layers.slice(1).map((l) => (<button key={l.id} className="nav__l" data-on={layers[active]?.id === l.id} onClick={() => go(l.section)}>{l.section[0].toUpperCase() + l.section.slice(1)}</button>))}
        </nav>
        <div className="nav__r">
          <button className="nav__k mono" onClick={() => setPal(true)} aria-label="Open command palette">Ctrl K</button>
          <button className="nav__t" onClick={() => setDark(!dark)} aria-pressed={dark} aria-label="Dark theme">{dark ? 'Dark' : 'Light'}</button>
        </div>
      </header>

      <div className="stage" aria-hidden="true">
        {webgl ? <Suspense fallback={null}>
          <Stage layers={layers} dark={dark} reduced={reduced} activeProject={activeId} onHover={setHover} onPick={(i) => go(layers[i].section)} />
        </Suspense> : <Fallback layers={layers} active={active} />}
      </div>
      <aside className="caption mono" aria-hidden="true"><b>{`0${shown + 1}`}</b> {layers[shown].label}</aside>
      <ol className="rail" aria-label="Layers">
        {layers.map((l, i) => (<li key={l.id}><button onClick={() => go(l.section)} data-on={i === active} aria-label={`Layer ${i + 1}: ${l.label}`} aria-current={i === active ? 'true' : undefined}><span className="mono">{`0${i + 1}`}</span></button></li>))}
      </ol>
      <i className="bar" aria-hidden="true" />

      <main>
        <Hero meta={meta} hero={content.hero} go={go} />
        <About about={content.about} layer={layers[1]} />
        <Skills groups={content.skillGroups} projects={projects} layer={layers[2]} />
        <Projects projects={projects} layer={layers[3]} activeId={activeId} setActive={setActive} openId={openId} setOpen={setOpen} />
        <Contact meta={meta} contact={content.contact} layer={layers[4]} />
      </main>
      <Palette open={pal} onClose={() => setPal(false)} actions={actions} />
    </>
  )
}
