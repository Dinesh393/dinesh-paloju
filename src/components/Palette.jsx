import { useEffect, useMemo, useRef, useState } from 'react'

// Command palette (Ctrl/Cmd+K): jump anywhere, open a project, download the resume, switch theme.
export default function Palette({ open, onClose, actions }) {
  const [q, setQ] = useState(''), [i, setI] = useState(0), inp = useRef()
  const list = useMemo(() => actions.filter((a) => `${a.label} ${a.group}`.toLowerCase().includes(q.toLowerCase())), [q, actions])
  useEffect(() => { if (open) { setQ(''); setI(0); setTimeout(() => inp.current?.focus(), 0) } }, [open])
  useEffect(() => setI(0), [q])
  if (!open) return null
  const run = (a) => { onClose(); a.run() }
  const key = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => (x + 1) % Math.max(1, list.length)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => (x - 1 + list.length) % Math.max(1, list.length)) }
    else if (e.key === 'Enter' && list[i]) run(list[i])
    else if (e.key === 'Escape') onClose()
  }
  return (
    <div className="pal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pal__box" role="dialog" aria-modal="true" aria-label="Command palette">
        <input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={key} role="combobox" aria-expanded="true" aria-controls="pal-list"
          aria-activedescendant={list[i] ? `pal-${list[i].id}` : undefined} placeholder="Jump to a section, open a project, get the resume" />
        <ul id="pal-list" role="listbox">
          {list.map((a, n) => (
            <li key={a.id} id={`pal-${a.id}`} role="option" aria-selected={n === i} onMouseEnter={() => setI(n)} onClick={() => run(a)}>
              <span>{a.label}</span><kbd>{a.group}</kbd>
            </li>))}
          {!list.length && <li className="pal__empty">No match</li>}
        </ul>
      </div>
    </div>
  )
}
