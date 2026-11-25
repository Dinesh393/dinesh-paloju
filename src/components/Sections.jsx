import { useEffect, useRef, useState } from 'react'

const todo = (v) => typeof v === 'string' && v.includes('[EDIT ME')
// Text with an [EDIT ME ...] tail gets the tail highlighted so gaps are impossible to miss.
const Flagged = ({ text }) => { const [a, b] = text.split('[EDIT ME'); return <>{a}{b !== undefined && <span className="todo">[EDIT ME{b}</span>}</> }
const Ext = ({ href, children }) => (todo(href) ? <span className="todo">{children} [EDIT ME]</span> : <a className="lnk" href={href} target="_blank" rel="noreferrer">{children}</a>)

export function R({ as: Tag = 'div', d = 0, className = '', children, ...p }) {
  const ref = useRef(), [on, setOn] = useState(false)
  useEffect(() => { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold: 0.12 }); io.observe(ref.current); return () => io.disconnect() }, [])
  return <Tag ref={ref} className={`rv ${on ? 'in' : ''} ${className}`} style={{ '--d': d }} {...p}>{children}</Tag>
}
const Kicker = ({ n, label }) => <R as="p" className="kicker mono"><b>{String(n).padStart(2, '0')}</b> / {label}</R>

export function Hero({ meta, hero, go }) {
  return (
    <section id="hero" className="sec sec--hero" aria-labelledby="h1">
      <R as="p" className="kicker mono">Java developer / Hyderabad, India</R>
      <R as="h1" id="h1" d={1} className="name">Paloju<br />Dinesh</R>
      <R as="p" d={2} className="lead">{hero.line}</R>
      <R d={3} className="cta">
        <button className="btn btn--solid" onClick={() => go('projects')}>See projects</button>
        <a className="btn" href={meta.resume} download>Resume (PDF)</a>
      </R>
      <R as="p" d={4} className="status"><i aria-hidden="true" />{hero.status}</R>
      <R as="dl" d={5} className="stats">
        {hero.stats.map((s) => (<div key={s.label}><dt className="mono">{s.label}</dt><dd>{s.value}</dd></div>))}
      </R>
    </section>
  )
}

export function About({ about, layer }) {
  return (
    <section id="about" className="sec" aria-labelledby="h-about">
      <Kicker n={2} label={layer.label} />
      <R as="h2" id="h-about" d={1} className="h2">{about.lead}</R>
      <R as="ul" d={2} className="tl">
        {about.rows.map((r) => (
          <li key={r.entity + r.detail}>
            <span className="mono tl__p">{r.period}</span>
            <span className="tl__b"><b>{r.entity}</b><span>{r.detail}{r.todo && <> <span className="todo">{r.todo}</span></>}</span></span>
            <span className="mono tl__k">{r.kind}</span>
          </li>))}
      </R>
      <R d={3} className="ai"><h3>{about.ai.title}</h3><p><Flagged text={about.ai.text} /></p></R>
    </section>
  )
}

export function Skills({ groups, projects, layer }) {
  const [hov, setHov] = useState(null)
  return (
    <section id="skills" className="sec" aria-labelledby="h-skills">
      <Kicker n={3} label={layer.label} />
      <R as="h2" id="h-skills" d={1} className="h2">Skills, and the projects that used them</R>
      <div className="skills">
        {groups.map((g, gi) => (
          <R key={g.group} d={gi % 2 + 1} className="sk">
            <h3 className="mono">{g.group}</h3>
            <ul>
              {g.items.map((s) => (
                <li key={s.name} tabIndex={0} data-dim={hov && hov !== s.name} onMouseEnter={() => setHov(s.name)} onMouseLeave={() => setHov(null)} onFocus={() => setHov(s.name)} onBlur={() => setHov(null)}>
                  <span>{s.name}</span>
                </li>))}
            </ul>
          </R>))}
      </div>
    </section>
  )
}

export function Projects({ projects, layer, activeId, setActive, openId, setOpen }) {
  return (
    <section id="projects" className="sec" aria-labelledby="h-proj">
      <Kicker n={4} label={layer.label} />
      <R as="h2" id="h-proj" d={1} className="h2">Selected work</R>
      <ol className="plist">
        {projects.map((p, i) => {
          const open = openId === p.id
          return (
            <R as="li" key={p.id} d={i + 1} className="proj" data-open={open} data-active={activeId === p.id} onMouseEnter={() => setActive(p.id)}>
              <button className="proj__head" aria-expanded={open} aria-controls={`pp-${p.id}`} onFocus={() => setActive(p.id)} onClick={() => { setActive(p.id); setOpen(open ? null : p.id) }}>
                <span className="mono proj__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="proj__t"><b>{p.title}</b><small>{p.type}</small></span>
                <span className="mono proj__tools">{p.tools.slice(0, 3).join(' · ')}</span>
                <span className="proj__x" aria-hidden="true" />
              </button>
              <div className="proj__panel" id={`pp-${p.id}`} role="region" aria-label={`${p.title} details`} {...(open ? {} : { inert: '' })}>
                <div className="proj__in">
                  <div className="cols">
                    <div><h4 className="mono">Problem</h4><p>{p.problem}</p><h4 className="mono">Approach</h4><p>{p.approach}</p></div>
                    <div><h4 className="mono">Tools</h4><p>{p.tools.join(', ')}</p></div>
                  </div>
                  <ul className="kpis">{p.kpis.map((k) => (<li key={k.label}><b>{k.value}</b><span className="mono">{k.label}</span></li>))}</ul>
                  {p.bar && <div className="gauge" role="img" aria-label={`${p.bar.label}: ${p.bar.value} percent`}><i style={{ '--w': p.bar.value + '%' }} /><span className="mono">{p.bar.label}</span></div>}
                  <ol className="flow">{p.flow.map((f, k) => (<li key={f} style={{ '--i': k }} className="mono">{f}</li>))}</ol>
                  <p className="note mono">{p.figureNote}</p>
                  <p className="links"><Ext href={p.github}>GitHub</Ext>{p.live !== '' && <Ext href={p.live}>Live demo</Ext>}</p>
                </div>
              </div>
            </R>)
        })}
      </ol>
    </section>
  )
}

export function Contact({ meta, contact, layer }) {
  return (
    <section id="contact" className="sec sec--contact" aria-labelledby="h-contact">
      <Kicker n={5} label={layer.label} />
      <R as="h2" id="h-contact" d={1} className="name name--s">{contact.cta}</R>
      <R as="p" d={2} className="lead">{contact.line}</R>
      <R d={3}><a className="mail" href={`mailto:${meta.email}`}>{meta.email}</a></R>
      <R as="ul" d={4} className="outs">
        <li><a href={meta.resume} download><span>Resume</span><span className="mono">PDF</span></a></li>
        <li><a href={meta.linkedin} target="_blank" rel="noreferrer"><span>LinkedIn</span><span className="mono">linkedin.com/in/dinesh-paloju</span></a></li>
        <li><a href={meta.github} target="_blank" rel="noreferrer"><span>GitHub</span><span className="mono">Dinesh393</span></a></li>
      </R>
      <p className="foot mono">{meta.name} · {meta.location} · Press Ctrl/Cmd + K to jump around</p>
    </section>
  )
}
