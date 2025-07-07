'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const starVertexShader = `
  attribute float size;
  attribute float twinkleSpeed;
  attribute float twinkleOffset;
  uniform float time;
  varying float vOpacity;

  void main() {
    // Twinkle calculation using a sine wave, mapped to the 0.0-1.0 range
    vOpacity = (sin(time * twinkleSpeed + twinkleOffset) + 1.0) / 2.0;
    // Make the twinkle effect sharper by powering the result
    vOpacity = pow(vOpacity, 2.0);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Make stars in the distance appear smaller
    gl_PointSize = size * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  varying float vOpacity;
  uniform vec3 color;

  void main() {
    // Render stars as circles
    if (distance(gl_PointCoord, vec2(0.5, 0.5)) > 0.5) discard;
    
    // Apply the calculated twinkle opacity
    gl_FragColor = vec4(color, vOpacity);
  }
`;

function Stars() {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 5000;

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinkleSpeeds = new Float32Array(count);
    const twinkleOffsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Position stars randomly in a large cube
      positions[i3 + 0] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      // Assign random properties for size and twinkling effect
      sizes[i] = Math.random() * 1.5 + 0.5;
      twinkleSpeeds[i] = Math.random() * 0.5 + 0.1;
      twinkleOffsets[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('twinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1));
    geo.setAttribute('twinkleOffset', new THREE.BufferAttribute(twinkleOffsets, 1));

    const shaderUniforms = {
      time: { value: 0 },
      color: { value: new THREE.Color('white') },
    };

    return { geometry: geo, uniforms: shaderUniforms };
  }, []);

  // Pass the elapsed time to the shader on every frame
  useFrame((state) => {
    if (pointsRef.current) {
      (pointsRef.current.material as THREE.ShaderMaterial).uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points ref={pointsRef}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </points>
  );
}


export default function StarrySky() {
  return (
    // This div places the canvas behind all other content
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <Stars />
      </Canvas>
    </div>
  );
}
