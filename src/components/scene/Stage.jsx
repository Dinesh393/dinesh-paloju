import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import Stack from './Stack.jsx'

export default function Stage(props) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ fov: 30, position: [8, 5.5, 12] }} gl={{ antialias: true, alpha: true }} onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}>
      <ambientLight intensity={0.5} /><directionalLight position={[6, 9, 6]} intensity={1.4} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.2} position={[0, 6, 4]} scale={[12, 6, 1]} />
        <Lightformer form="rect" intensity={1} position={[-6, 2, -3]} scale={[6, 6, 1]} rotation-y={Math.PI / 2} />
      </Environment>
      <Suspense fallback={null}><Stack {...props} /></Suspense>
    </Canvas>
  )
}
