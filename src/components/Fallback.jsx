// Shown when WebGL is unavailable: a flat CSS version of the same five-layer stack.
export default function Fallback({ layers, active }) {
  return (
    <div className="fb" aria-hidden="true">
      {layers.map((l, i) => (<div key={l.id} className="fb__slab" data-on={i === active} style={{ '--i': i }}>{l.label}</div>))}
    </div>
  )
}
