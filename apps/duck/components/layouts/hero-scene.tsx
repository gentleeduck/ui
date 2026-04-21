'use client'

import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import type * as THREE from 'three'

function Model() {
  const { scene } = useGLTF('/hero.gltf')
  const ref = useRef<THREE.Group>(null)
  let t = 0

  useFrame((_, delta) => {
    if (!ref.current) return
    t += delta
    ref.current.rotation.y += delta * 0.3
    ref.current.position.y = Math.sin(t * 0.8) * 0.08
  })

  return <primitive ref={ref} object={scene} />
}

export function HeroScene() {
  return (
    <div className="mx-auto h-[420px] w-full max-w-2xl">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4f46e5" />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Canvas>
    </div>
  )
}
