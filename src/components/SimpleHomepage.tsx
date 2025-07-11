'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, Trail, Float } from '@react-three/drei';

// ブラックホールの中心部分
interface BlackHoleCoreProps {
  glowIntensity: number;
}

function BlackHoleCore({ glowIntensity }: BlackHoleCoreProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current) {
      // 繊細な脈動
      const time = state.clock.getElapsedTime();
      glowRef.current.scale.setScalar(1.0 + Math.sin(time * 0.3) * 0.03);
    }
  });

  return (
    <group>
      {/* 中心の球体 - 暗い青緑色 */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial
          color="#001a1a"
          emissive="#003333"
          emissiveIntensity={glowIntensity * 0.2}
          metalness={0.2}
          roughness={0.8}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      
      {/* 内側の発光層 - 薄い青緑色 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshStandardMaterial
          color="#00cccc"
          emissive="#00ffff"
          emissiveIntensity={glowIntensity * 0.8}
          transparent={true}
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* 繊細な光の線 */}
      <group>
        {Array.from({ length: 30 }).map((_, i) => {
          const angle = (i / 30) * Math.PI * 2;
          const length = 0.5 + Math.random() * 1.5;
          const x = Math.cos(angle) * 2.1;
          const y = Math.sin(angle) * 2.1;
          const z = (Math.random() - 0.5) * 0.3;
          
          return (
            <mesh key={i} position={[x, y, z]} rotation={[0, 0, angle]}>
              <boxGeometry args={[length, 0.02 + Math.random() * 0.04, 0.02]} />
              <meshBasicMaterial 
                color={new THREE.Color('#00e5e5')} 
                transparent 
                opacity={0.3 + Math.random() * 0.2}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* 繊細な光の粒子 */}
      <Sparkles
        count={20}
        size={3}
        scale={[4, 4, 4]}
        position={[0, 0, 0]}
        color="#00e5e5"
        opacity={0.5}
      />
    </group>
  );
}

// AccretionDiskコンポーネントの型定義
interface AccretionDiskProps {
  glowIntensity: number;
}

// 青白い炎のようなもやもやしたコロナを表現するコンポーネント
function FlameCorona({ glowIntensity }: { glowIntensity: number }) {
  const flameGroupRef = useRef<THREE.Group>(null);
  const flameRefs = useRef<THREE.Mesh[]>([]);
  
  // 炎のパーティクルの数
  const flameCount = 60;
  
  // 初期化時に各炎のパラメータを設定
  const flameParams = useMemo(() => {
    return Array.from({ length: flameCount }).map(() => ({
      scale: 0.5 + Math.random() * 1.5,
      speed: 0.2 + Math.random() * 0.8,
      radius: 3.5 + Math.random() * 1.5,
      phaseOffset: Math.random() * Math.PI * 2,
      heightOffset: (Math.random() - 0.5) * 0.5,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }));
  }, []);
  
  // 炎のメッシュを参照配列に保存するための関数
  const setFlameRef = (index: number) => (mesh: THREE.Mesh | null) => {
    if (mesh) {
      flameRefs.current[index] = mesh;
    }
  };
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // 全体の回転
    if (flameGroupRef.current) {
      flameGroupRef.current.rotation.z = time * 0.03;
    }
    
    // 個々の炎のアニメーション
    flameRefs.current.forEach((flame, i) => {
      if (!flame) return;
      
      const params = flameParams[i];
      const t = time * params.speed + params.phaseOffset;
      
      // 脈動する動き
      const pulse = 0.8 + Math.sin(t * 0.8) * 0.2;
      flame.scale.set(
        params.scale * pulse,
        params.scale * (1 + Math.sin(t * 1.2) * 0.3),
        params.scale * pulse
      );
      
      // 位置の微妙な変化
      const angle = (i / flameCount) * Math.PI * 2 + time * params.rotationSpeed;
      flame.position.x = Math.cos(angle) * params.radius * (0.95 + Math.sin(t * 1.5) * 0.05);
      flame.position.y = Math.sin(angle) * params.radius * (0.95 + Math.cos(t * 1.3) * 0.05);
      flame.position.z = params.heightOffset + Math.sin(t * 0.7) * 0.1;
      
      // 炎が中心を向くように回転
      flame.lookAt(0, 0, 0);
    });
  });
  
  return (
    <group ref={flameGroupRef} rotation={[Math.PI / 2, 0, 0]}>
      {Array.from({ length: flameCount }).map((_, i) => {
        const angle = (i / flameCount) * Math.PI * 2;
        const radius = 3.5 + Math.random() * 1.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 0.5;
        
        return (
          <mesh 
            key={i} 
            ref={setFlameRef(i)}
            position={[x, y, z]}
          >
            <planeGeometry args={[0.8, 1.2]} />
            <meshBasicMaterial
              color={new THREE.Color(Math.random() > 0.7 ? '#a0ffff' : '#80ffff')}
              transparent={true}
              opacity={0.3 + Math.random() * 0.3}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function AccretionDisk({ glowIntensity }: AccretionDiskProps) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const middleRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (outerRingRef.current) {
      // 外側のリングをゆっくり回転
      outerRingRef.current.rotation.z = time * 0.05;
    }
    if (middleRingRef.current) {
      // 中間リングを逆方向に回転
      middleRingRef.current.rotation.z = -time * 0.08;
      // 微妙な脈動も追加
      middleRingRef.current.scale.setScalar(1.0 + Math.sin(time * 0.3) * 0.02);
    }
    if (innerRingRef.current) {
      // 内側のリングをより速く回転
      innerRingRef.current.rotation.z = time * 0.12;
    }
  });
  
  return (
    <group>
      {/* 青白い炎のようなもやもやしたコロナ */}
      <FlameCorona glowIntensity={glowIntensity} />
      
      {/* 外側の繊細なリング - 青白く幻想的な色合い */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5.2, 0.03, 16, 100]} />
        <meshStandardMaterial 
          color={new THREE.Color('#80ffff')}
          emissive={new THREE.Color('#00ffff')}
          emissiveIntensity={glowIntensity * 1.5}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
      
      {/* 中間のメインリング - 青白く幻想的な色合い */}
      <mesh ref={middleRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.5, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color={new THREE.Color('#a0ffff')}
          emissive={new THREE.Color('#80ffff')}
          emissiveIntensity={glowIntensity * 2.0}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      {/* 内側の繊細なリング - 青白く幻想的な色合い */}
      <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.8, 0.02, 16, 100]} />
        <meshBasicMaterial
          color={new THREE.Color('#c0ffff')}
          transparent={true}
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// 太陽コロナの粒子
interface CoronaParticle {
  position: number[];
  speed: number;
  size: number;
  color: string;
}

function ParticleStream() {
  const particlesRef = useRef<THREE.Points>(null);
  const { clock } = useThree();
  
  // 非常に繊細な粒子の生成
  const particles = useMemo<CoronaParticle[]>(() => {
    return Array.from({ length: 150 }, () => {
      // 複数の軌道に分散させて配置
      const theta = Math.random() * Math.PI * 2;
      const orbitLayers = [3.8, 4.5, 5.2]; // 3つの軌道レイヤー
      const r = orbitLayers[Math.floor(Math.random() * orbitLayers.length)] + (Math.random() - 0.5) * 0.1;
      
      // 青緑系の繊細な色合い
      const colors = ['#00ffff', '#80ffff', '#00e5e5', '#00cccc', '#40e0d0'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        position: [
          r * Math.cos(theta),
          r * Math.sin(theta),
          (Math.random() - 0.5) * 0.1, // 非常に薄いz軸分布
        ],
        speed: 0.01 + Math.random() * 0.01, // 非常にゆっくりとした速度
        size: 0.01 + Math.random() * 0.02, // 非常に小さな粒子
        color: color,
      };
    });
  }, []);
  
  // 粒子のアニメーション
  useFrame(() => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
    const time = clock.getElapsedTime();
    
    for (let i = 0; i < particles.length; i++) {
      const i3 = i * 3;
      const particle = particles[i];
      
      // 非常に繊細な動き
      const x = particle.position[0];
      const y = particle.position[1];
      const z = particle.position[2];
      
      // 各粒子ごとに少しずつ異なる速度で回転
      const angle = time * particle.speed;
      const newX = x * Math.cos(angle) - y * Math.sin(angle);
      const newY = x * Math.sin(angle) + y * Math.cos(angle);
      
      // 極めて微細な揺れ
      const zOscillation = Math.sin(time * 0.5 + i * 0.1) * 0.01;
      
      positions[i3] = newX;
      positions[i3 + 1] = newY;
      positions[i3 + 2] = z + zOscillation;
      
      // 非常に繊細な明滅効果
      sizes[i] = particle.size * (0.95 + Math.sin(time * 0.8 + i * 0.2) * 0.05);
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.size.needsUpdate = true;
  });

  // 粒子の頂点とサイズを作成
  const vertices = useMemo(() => {
    const positions = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);
    const colors = new Float32Array(particles.length * 3);
    
    for (let i = 0; i < particles.length; i++) {
      const i3 = i * 3;
      positions[i3] = particles[i].position[0];
      positions[i3 + 1] = particles[i].position[1];
      positions[i3 + 2] = particles[i].position[2];
      
      sizes[i] = particles[i].size;
      
      // 色を設定
      const color = new THREE.Color(particles[i].color);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return { positions, sizes, colors };
  }, [particles]);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute 
          args={[vertices.positions, 3]}
          attach="attributes-position"
          count={particles.length}
          itemSize={3}
        />
        <bufferAttribute 
          args={[vertices.colors, 3]}
          attach="attributes-color"
          count={particles.length}
          itemSize={3}
        />
        <bufferAttribute 
          args={[vertices.sizes, 1]}
          attach="attributes-size"
          count={particles.length}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors={true}
        transparent={true}
        opacity={0.4}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 深海魚のような動的オブジェクト
function DeepSeaCreature() {
  const fishRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const finRef = useRef<THREE.Mesh>(null);
  
  // ランダムな初期位置と動きのパラメータ
  const params = useMemo(() => ({
    speed: 0.2 + Math.random() * 0.3,
    radius: 8 + Math.random() * 4,
    height: Math.random() * 4 - 2,
    tailSpeed: 2 + Math.random() * 2,
    finSpeed: 1 + Math.random() * 1.5,
    direction: Math.random() > 0.5 ? 1 : -1,
    startAngle: Math.random() * Math.PI * 2,
  }), []);
  
  useFrame((state) => {
    if (!fishRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const angle = params.startAngle + time * params.speed * params.direction;
    
    // 円形の軌道に沿って移動
    const x = Math.cos(angle) * params.radius;
    const z = Math.sin(angle) * params.radius;
    const y = params.height + Math.sin(time * 0.3) * 0.5;
    
    fishRef.current.position.set(x, y, z);
    
    // 進行方向を向く
    fishRef.current.rotation.y = angle + Math.PI / 2 * params.direction;
    
    // 尾びれと胸びれのアニメーション
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(time * params.tailSpeed) * 0.3;
    }
    if (finRef.current) {
      finRef.current.rotation.z = Math.sin(time * params.finSpeed) * 0.2;
    }
  });
  
  // 発光する軌跡を作成
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Trail
        width={0.5}
        length={8}
        color={new THREE.Color('#80ffff')}
        attenuation={(width) => width * width}
      >
        <group ref={fishRef}>
          {/* 魚の体 */}
          <mesh>
            <coneGeometry args={[0.2, 1.0, 8]} />
            <meshStandardMaterial
              color="#80ffff"
              emissive="#00ffff"
              emissiveIntensity={2}
              transparent={true}
              opacity={0.8}
            />
          </mesh>
          
          {/* 尾びれ */}
          <mesh ref={tailRef} position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.3, 0.4, 4]} />
            <meshStandardMaterial
              color="#a0ffff"
              emissive="#80ffff"
              emissiveIntensity={1.5}
              transparent={true}
              opacity={0.7}
            />
          </mesh>
          
          {/* 胸びれ */}
          <mesh ref={finRef} position={[0.1, 0, 0.2]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.4, 0.2]} />
            <meshStandardMaterial
              color="#c0ffff"
              emissive="#a0ffff"
              emissiveIntensity={1.5}
              transparent={true}
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* 発光する目 */}
          <mesh position={[0.4, 0.1, 0.1]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </Trail>
    </Float>
  );
}

// メインコンポーネント
export default function SimpleHomepage() {
  const [glowIntensity, setGlowIntensity] = useState(1.0);
  
  // 背景色の設定 - より深い青色
  const backgroundColor = useMemo(() => new THREE.Color("rgb(0, 5, 20)"), []);
  
  // 光の脈動アニメーション
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => {
        // 0.8から1.2の間でゆっくり脈動
        return 1.0 + Math.sin(Date.now() * 0.0005) * 0.2;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  // 動的なロゴのスタイル設定
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const [subTextOpacity, setSubTextOpacity] = useState(0.8);
  const [noiseOffset, setNoiseOffset] = useState({ x: 0, y: 0 });
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  
  // ロゴの動的な動き
  useEffect(() => {
    const animateLogo = () => {
      const time = Date.now() * 0.001;
      setLogoPosition({
        x: Math.sin(time * 0.5) * 5,
        y: Math.cos(time * 0.3) * 3
      });
      setSubTextOpacity(0.6 + Math.sin(time * 0.8) * 0.2);
      
      // ノイズ効果のためのランダムなオフセット
      setNoiseOffset({
        x: (Math.random() - 0.5) * 2 * glitchIntensity,
        y: (Math.random() - 0.5) * 2 * glitchIntensity
      });
      
      // 時々グリッチ効果を強める
      if (Math.random() < 0.01) { // 1%の確率でグリッチ発生
        setGlitchIntensity(Math.random() * 5);
        setTimeout(() => setGlitchIntensity(0), 200); // 0.2秒後に元に戻す
      }
    };
    
    const interval = setInterval(animateLogo, 50);
    return () => clearInterval(interval);
  }, [glitchIntensity]);
  
  // タイトルのスタイル設定 - ノイズとブラー効果を追加
  const titleStyle = useMemo(() => {
    // RGBずれ効果のためのスタイル
    const rgbShift = glitchIntensity > 0 ? `
      text-shadow: 
        ${1 + noiseOffset.x}px ${noiseOffset.y}px 0 rgba(255, 0, 0, 0.7),
        ${-1 + noiseOffset.x}px ${noiseOffset.y}px 0 rgba(0, 255, 255, 0.7),
        ${noiseOffset.x}px ${1 + noiseOffset.y}px 0 rgba(0, 0, 255, 0.7),
        0 0 ${3 * glowIntensity}px #00ffff, 
        0 0 ${6 * glowIntensity}px #00e5e5
    ` : `
      text-shadow: 0 0 ${3 * glowIntensity}px #00ffff, 0 0 ${6 * glowIntensity}px #00e5e5
    `;
    
    return {
      color: '#80ffff',
      textShadow: rgbShift,
      filter: `blur(${0.3 * glowIntensity + glitchIntensity * 0.3}px)`,
      letterSpacing: '0.1em',
      transform: `translate(${logoPosition.x + noiseOffset.x}px, ${logoPosition.y + noiseOffset.y}px)`,
      transition: glitchIntensity > 0 ? 'none' : 'transform 0.5s ease-out',
      position: 'relative',
      display: 'inline-block',
      zIndex: 10,
    };
  }, [glowIntensity, logoPosition, noiseOffset, glitchIntensity]);

  // 画面幅を検出してモバイルかどうかを判断
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`w-full ${isMobile ? '' : 'h-screen'}`}>
      <Canvas
        camera={{ position: [0, 2, 15], fov: 60 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[backgroundColor]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 10]} intensity={1.5} />
        <fog attach="fog" args={[backgroundColor, 15, 30]} />
        
        <BlackHoleCore glowIntensity={glowIntensity} />
        <AccretionDisk glowIntensity={glowIntensity} />
        <ParticleStream />
        
        {/* 深海魚のような生物を複数配置 */}
        {Array.from({ length: 5 }).map((_, i) => (
          <DeepSeaCreature key={i} />
        ))}
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate={!isMobile}
          autoRotateSpeed={0.5}
          // 初期角度を設定（X軸周りに15度傾ける）
          minPolarAngle={Math.PI / 2 - 0.3} // 約15度上から見る
          maxPolarAngle={Math.PI / 2 - 0.3} // 角度を固定
        />
      </Canvas>
      
      {/* オーバーレイテキスト - 動的に動くロゴ（ノイズ/ブラー効果付き） */}
      <div className={`absolute top-0 left-0 w-full ${isMobile ? 'h-screen' : 'h-full'} flex items-center justify-center ${isMobile ? '' : 'pointer-events-none'}`}>
        <div className="text-center">
          <div className="relative">
            {/* グリッチ効果のためのクローン要素（少しずれた位置に表示） */}
            {glitchIntensity > 0 && (
              <>
                <h1 
                  className="text-5xl md:text-7xl font-bold mb-6 absolute" 
                  style={{
                    ...titleStyle,
                    opacity: 0.3,
                    color: '#ff00ff',
                    left: `${noiseOffset.x * 2}px`,
                    top: `${noiseOffset.y * 2}px`,
                    filter: `blur(${0.5 * glowIntensity}px)`,
                  }}
                >
                  gomix666.com
                </h1>
                <h1 
                  className="text-5xl md:text-7xl font-bold mb-6 absolute" 
                  style={{
                    ...titleStyle,
                    opacity: 0.3,
                    color: '#00ffff',
                    left: `${-noiseOffset.x * 2}px`,
                    top: `${-noiseOffset.y * 2}px`,
                    filter: `blur(${0.5 * glowIntensity}px)`,
                  }}
                >
                  gomix666.com
                </h1>
              </>
            )}
            
            {/* メインのテキスト */}
            <h1 
              className="text-5xl md:text-7xl font-bold mb-6 relative" 
              style={titleStyle}
            >
              gomix666.com
            </h1>
          </div>
          
          <p 
            className="text-lg md:text-xl text-cyan-100 relative"
            style={{
              letterSpacing: '0.15em',
              opacity: subTextOpacity,
              textShadow: `0 0 ${2 * glowIntensity}px #00e5e5`,
              filter: `blur(${0.15 * glowIntensity + glitchIntensity * 0.1}px)`,
              transform: `translateY(${logoPosition.y * 0.5}px)`,
              transition: glitchIntensity > 0 ? 'none' : 'transform 0.7s ease-out, opacity 0.7s ease-out'
            }}
          >
            幸せになりたい
          </p>
        </div>
      </div>
    </div>
  );
}
