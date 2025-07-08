'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Torus, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';
import FloatingText from './FloatingText';

// --- Background Component: Cosmic Ocean ---
function CosmicOceanBackground() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(() => ({ 
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2() }
  }), []);
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float u_time;
          varying vec2 vUv;
          
          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
          }
          
          float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
              mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), 
              u.y
            );
          }
          
          void main() {
            vec2 uv = vUv * 2.0 - 1.0;
            float t = u_time * 0.1;
            
            // Ocean effect
            vec2 p = uv * 3.0 + noise(uv * 2.0 + t) * 0.5;
            float d = length(p) * 0.5;
            float n = noise(p + t);
            d = mix(d, n, 0.5);
            
            // Colors - emerald and cyan theme
            vec3 color1 = vec3(0.0, 0.15, 0.2);
            vec3 color2 = vec3(0.0, 0.6, 0.6);
            vec3 finalColor = mix(color1, color2, smoothstep(0.1, 0.6, d));
            
            // Stars
            float stars = pow(random(vUv * 1000.0 + t * 0.1), 20.0);
            finalColor += vec3(stars) * 0.5;
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// --- Solar System Monument ---
function Planet({ position, size, color, speed, orbitRadius }: { 
  position: [number, number, number], 
  size: number, 
  color: string,
  speed: number,
  orbitRadius: number
}) {
  const ref = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    const x = Math.cos(t) * orbitRadius;
    const z = Math.sin(t) * orbitRadius;
    ref.current.position.set(x, position[1], z);
    ref.current.rotation.y += 0.01;
  });
  
  return (
    <group ref={ref} position={position}>
      <Sphere args={[size, 16, 16]}>
        <meshBasicMaterial color={color} wireframe />
      </Sphere>
    </group>
  );
}

function SolarSystemMonument() {
  return (
    <group position={[0, 0, 0]}>
      {/* Sun - glowing center */}
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial color="#00ffcc" wireframe />
      </Sphere>
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial color="#00ffff" />
      </Sphere>
      
      {/* Planets */}
      <Planet position={[0, 0, 0]} size={0.3} color="#ff8c00" speed={0.8} orbitRadius={2.5} />
      <Planet position={[0, 0, 0]} size={0.4} color="#4682b4" speed={0.5} orbitRadius={4} />
      <Planet position={[0, 0, 0]} size={0.6} color="#00ffcc" speed={0.3} orbitRadius={6.5} />
      <Planet position={[0, 0, 0]} size={0.35} color="#b0c4de" speed={0.2} orbitRadius={8.5} />
      
      {/* Rings - multiple for better effect */}
      <group position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <Torus args={[6.5, 0.05, 16, 100]}>
          <meshBasicMaterial color="#00ffff" wireframe />
        </Torus>
        <Torus args={[8.5, 0.03, 16, 100]}>
          <meshBasicMaterial color="#00ffaa" wireframe />
        </Torus>
      </group>
    </group>
  );
}

// --- Orbiting Domain Name ---
function DomainNameRing() {
  const ref = useRef<THREE.Group>(null!);
  const radius = 10;
  const speed = -0.1;
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    ref.current.position.set(x, 0, z);
  });
  
  return (
    <group ref={ref}>
      <Html center>
        <div
          style={{
            color: '#00ffff',
            textShadow: '0 0 5px #00ffff, 0 0 10px #00ffff',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '1.5rem',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          gomix666.com
        </div>
      </Html>
    </group>
  );
}

// --- Main Component ---
export default function DynamicHomepage() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10">
      <Canvas camera={{ position: [0, 5, 18], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight color="#ffffff" intensity={1} distance={100} />
          
          {/* Stars Background */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Main Site Title */}
          <Html position={[0, 2.5, 0]} center>
            <div
              style={{
                color: 'white',
                textShadow: '0 0 8px cyan, 0 0 15px cyan',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '2.5rem',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              gomix666.com
            </div>
          </Html>
          
          {/* Floating Text */}
          <Html position={[-18, 10, 0]}>
            <FloatingText text={`幸せになりたい
人生七転八倒

失敗に次ぐ失敗で借金300万
それでもあきらめられない

幸せを勝ち取るために
なんでも挑戦
投資、副業、
そしてブログ？

私の挑戦を
どうか笑ってやってください`} />
          </Html>
          
          <SolarSystemMonument />
          <DomainNameRing />
          <CosmicOceanBackground />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.05} 
          minDistance={10} 
          maxDistance={30} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI * 2 / 3} 
        />
      </Canvas>
    </div>
  );
}
