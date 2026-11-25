import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Text, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../../lib/scroll'
import mono from '@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff?url'

const PAL = {
  light: { slab: ['#E7E2D5', '#DCD6C6'], ink: '#15171A', mute: '#6A6E75', accent: '#FF4F1F' },
  dark: { slab: ['#2C2F34', '#25282C'], ink: '#ECE9E2', mute: '#8B9096', accent: '#FF6B3D' }
}
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }

// A five-layer Java backend stack. The section you are reading lifts out of it; a request packet rides down the front as you scroll.
export default function Stack({ layers, dark, reduced, activeProject, onHover, onPick }) {
  const pal = PAL[dark ? 'dark' : 'light']
  const { size, viewport } = useThree()
  const narrow = size.width < 900
  const root = useRef(), slabs = useRef([]), mats = useRef([]), packet = useRef()
  const acts = useRef([0, 0, 0, 0, 0]), ex = useRef(0), mouse = useRef({ x: 0, y: 0 })
  const A = useMemo(() => new THREE.Color(), []), B = useMemo(() => new THREE.Color(), [])
  useEffect(() => { const m = (e) => { mouse.current.x = e.clientX / innerWidth - 0.5; mouse.current.y = e.clientY / innerHeight - 0.5 }; addEventListener('pointermove', m); return () => removeEventListener('pointermove', m) }, [])

  useFrame((_, dt) => {
    const s = scrollState.s, k = reduced ? 1 : 1 - Math.exp(-dt * 4)
    ex.current += (sm(0.1, 0.9, s) - ex.current) * k
    const gap = 0.36 + ex.current * 0.5, r = root.current
    const tx = narrow ? 0 : viewport.width * 0.23
    r.position.x += (tx - r.position.x) * k; r.position.y = -0.3
    r.rotation.y += (0.75 + s * 0.3 + mouse.current.x * 0.25 - r.rotation.y) * k
    r.rotation.x += (mouse.current.y * 0.06 - r.rotation.x) * k
    B.set(pal.accent)
    layers.forEach((_, i) => {
      acts.current[i] += (clamp(1 - Math.abs(s - i) * 1.7, 0, 1) - acts.current[i]) * k
      const a = acts.current[i], g = slabs.current[i]
      g.position.y = (2 - i) * gap; g.position.x = a * 0.8
      A.set(pal.slab[i % 2]); mats.current[i].color.copy(A).lerp(B, a * 0.78)
    })
    packet.current.position.y = (2 - s) * gap
    packet.current.rotation.y = reduced ? 0 : s * 3
  })

  return (
    <>
      <group ref={root}>
        {layers.map((l, i) => (
          <group key={l.id} ref={(el) => (slabs.current[i] = el)}>
            <RoundedBox args={[4.4, 0.3, 2.8]} radius={0.06} smoothness={4}
              onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; onHover(i) }}
              onPointerOut={() => { document.body.style.cursor = ''; onHover(null) }}
              onClick={(e) => { e.stopPropagation(); onPick(i) }}>
              <meshStandardMaterial ref={(el) => (mats.current[i] = el)} color={pal.slab[i % 2]} roughness={0.6} />
            </RoundedBox>
            <Text font={mono} fontSize={0.2} letterSpacing={0.12} color={pal.ink} rotation={[-Math.PI / 2, 0, 0]} position={[-1.95, 0.16, 1.1]} anchorX="left" anchorY="bottom">{l.label.toUpperCase()}</Text>
            <Text font={mono} fontSize={0.2} color={pal.ink} rotation={[-Math.PI / 2, 0, 0]} position={[1.95, 0.16, 1.1]} anchorX="right" anchorY="bottom">{`0${i + 1}`}</Text>
          </group>
        ))}
        <mesh ref={packet} position={[0, 0, 1.75]}><boxGeometry args={[0.26, 0.26, 0.26]} /><meshStandardMaterial color={pal.accent} emissive={pal.accent} emissiveIntensity={0.3} /></mesh>
        <ContactShadows position={[0, -2.5, 0]} opacity={dark ? 0.5 : 0.28} scale={14} blur={2.6} far={4.5} resolution={256} />
      </group>
    </>
  )
}
