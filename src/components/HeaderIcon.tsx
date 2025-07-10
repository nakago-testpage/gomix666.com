'use client';

import { useRef, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GodRays, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';

// A simple black sphere for the sun.
const BlackSun = () => (
  <mesh>
    <sphereGeometry args={[2, 64, 64]} />
    <meshStandardMaterial color="#111111" roughness={0.9} />
  </mesh>
);

// The new, physically separate rotating ring.
const CoronaRing = () => {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    // Rotate the ring independently for a dynamic effect.
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.4; // Rotates around the sun
      ringRef.current.rotation.x += delta * 0.1; // Tilts for dynamic effect
    }
  });

  return (
    <mesh ref={ringRef}>
      {/* A thin torus geometry to act as the ring */}
      <torusGeometry args={[2.2, 0.03, 16, 100]} />
      {/* A basic, emissive-like material that glows brightly */}
      <meshBasicMaterial color="#ff8800" toneMapped={false} />
    </mesh>
  );
};

// An invisible sphere that acts as the light source for the GodRays effect.
// It now uses forwardRef to correctly accept the ref from the Scene component.
const GlowSphereForGodRays = forwardRef<THREE.Mesh>((props, ref) => (
  <mesh ref={ref} position={[0, 0, 0]}>
    <sphereGeometry args={[2.5, 64, 64]} />
    <meshBasicMaterial color="#ff8800" transparent opacity={0} />
  </mesh>
));
GlowSphereForGodRays.displayName = 'GlowSphereForGodRays';

const Scene = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const godRaysSourceRef = useRef<THREE.Mesh>(null!);

  // Gently rotate the entire group for a subtle parallax effect.
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <BlackSun />
        <CoronaRing />
      </group>

      {/* This invisible sphere is the light source for GodRays */}
      <GlowSphereForGodRays ref={godRaysSourceRef} />

      <EffectComposer>
        <GodRays
          sun={godRaysSourceRef}
          // Props are passed directly, not in a 'config' object.
          weight={0.3}
          density={0.9}
          decay={0.95}
          exposure={0.4}
          samples={60}
          clampMax={1.0}
        />
      </EffectComposer>
    </>
  );
};

const HeaderIcon = () => {
  return (
    <div className="w-10 h-10 block" style={{ marginLeft: '4px', marginRight: '4px' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Scene />
      </Canvas>
    </div>
  );
};

export default HeaderIcon;
