'use client';

import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Torus, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

// モバイルデバイスを検出するカスタムフック
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // モバイルデバイスの検出 - より確実に検出するよう改善
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /iphone|ipad|ipod|android|blackberry|windows phone|opera mini|silk|mobile|tablet|phone/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // コンソールにデバッグ情報を出力
      console.log('Device detection:', {
        userAgent,
        width: window.innerWidth,
        isMobileDevice,
        isSmallScreen,
        isTouchDevice
      });
      
      setIsMobile(isMobileDevice || isSmallScreen || isTouchDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return isMobile;
}

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
  // モバイルデバイスかどうかを検出
  const isMobile = useIsMobile();
  
  // モバイル表示時はオブジェクトを大きくするが、サイト名と重なるように調整
  const scale = isMobile ? 2.0 : 1.0; // モバイルでは2.0倍に拡大（2.5倍から調整）
  
  // 初期角度を設定して立体的に見せる
  return (
    <group 
      position={isMobile ? [0, -2, 0] : [0, 0, 0]} // モバイル表示時の位置を下に調整
      rotation={[Math.PI / 6, Math.PI / 4, 0]} 
      scale={scale}>
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
  
  // サイト名の重複を避けるため、表示しない
  return (
    <group ref={ref}>
      {/* サイト名の重複を避けるためコメントアウト
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
      */}
    </group>
  );
}

// --- Floating Text Component ---
function FloatingTextComponent({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null!);
  
  // テキストを行ごとに分割
  const lines = text.split('\n');
  
  return (
    <div
      ref={ref}
      style={{
        color: '#00ffff',
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: 'clamp(0.6rem, 1.5vw, 0.9rem)',
        pointerEvents: 'none',
        maxWidth: '400px',
        transform: 'scale(1)',
        transformOrigin: 'center center',
        lineHeight: '1.3',
        letterSpacing: '0.01em'
      }}
    >
      {lines.map((line, index) => (
        <div 
          key={index}
          className={line.trim() === '' ? 'h-3' : 'floating-text-line'}
          style={{
            textShadow: '0 0 5px #00ffff, 0 0 10px #00ffff',
            animation: line.trim() === '' ? 'none' : `floatIn 1.5s ease-out ${index * 0.4}s both`
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

// --- Main Component ---
export default function DynamicHomepage() {
  // モバイルデバイスかどうかを検出
  const isMobile = useIsMobile();
  
  // モバイルデバイスではキャンバスのポインターイベントを無効化
  const canvasStyle = isMobile ? {
    pointerEvents: 'none' as const, // モバイルではポインターイベントを無効化
    touchAction: 'auto' as const, // タッチアクションを有効化
  } : {};

  // モバイル表示時のカメラ位置とFOVを調整
  const cameraSettings = isMobile 
    ? { position: [0, 0, 10] as [number, number, number], fov: 40 } // モバイル用：より近くから見る、視野角を広めに
    : { position: [5, 3, 15] as [number, number, number], fov: 60 }; // PC用：従来の設定

  // モバイル表示時のスタイル調整
  const containerStyle = {
    position: 'relative' as const,
    zIndex: 0,
    maxHeight: '100vh',
    overflow: 'hidden', // オーバーフローを防止
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <div className="relative w-full h-screen" style={containerStyle}>
      <Canvas camera={cameraSettings} style={canvasStyle}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          {/* Stars Background */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Main Site Title - Responsive - モバイルでもPCと同様にオブジェクトと重なるように調整 */}
          <Html 
            position={isMobile ? [0, 0, 2] : [0, 2.5, 0]} 
            center 
            transform 
            occlude
            distanceFactor={isMobile ? 2 : 10} // モバイルではさらに近くに調整
          >
            <div
              style={{
                color: '#00ffff',
                textShadow: `
                  0 0 15px #00ffff, 
                  0 0 25px #00ffff, 
                  0 0 35px #00ffff, 
                  0 0 45px rgba(0, 255, 255, 0.7), 
                  0 0 75px rgba(0, 255, 255, 0.5), 
                  0 0 95px rgba(0, 255, 255, 0.4),
                  0 0 120px rgba(0, 255, 255, 0.3)
                `,
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: isMobile ? 'clamp(0.9rem, 4vw, 1.5rem)' : 'clamp(1.8rem, 5vw, 2.8rem)', // モバイルではより大きく調整
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                transform: isMobile ? 'scale(1)' : 'scale(1)', // モバイルでもスケールを1に設定
                opacity: 1, // 完全に不透明にして目立たせる
                transformOrigin: 'center center',
                animation: 'textGlow 2s infinite alternate, textFlicker 5s infinite',
                letterSpacing: '0.1em',
                padding: '0.8em 1.2em',
                position: 'relative',
                WebkitTextStroke: '1px rgba(0, 255, 255, 0.5)', // テキストの外柄を追加
                filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))', // ドロップシャドウを追加
              }}
            >
              gomix666.com
              
              {/* ノイズエフェクトを強化 */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'5\' stitchTiles=\'stitch\' /%3E%3CfeColorMatrix type=\'matrix\' values=\'1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.8 0\' /%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                  backgroundSize: 'cover',
                  opacity: 0.6, // 不透明度をさらに上げる
                  mixBlendMode: 'overlay',
                  pointerEvents: 'none',
                  animation: 'noiseShift 3s infinite linear',
                  zIndex: 1, // 重なり順を確保
                }}
              />
              
              {/* グリッチエフェクトを追加 */}
              <div 
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: '-2px',
                  right: 0,
                  bottom: 0,
                  color: '#ff00ff',
                  opacity: 0.5,
                  pointerEvents: 'none',
                  animation: 'glitchEffect 4s infinite alternate',
                  clipPath: 'polygon(0 15%, 100% 15%, 100% 30%, 0 30%, 0 45%, 100% 45%, 100% 75%, 0 75%)',
                }}
              >
                gomix666.com
              </div>
              
              {/* 赤のグリッチエフェクト */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '2px',
                  right: 0,
                  bottom: 0,
                  color: '#ff0000',
                  opacity: 0.5,
                  pointerEvents: 'none',
                  animation: 'glitchEffect2 3s infinite alternate-reverse',
                  clipPath: 'polygon(0 10%, 100% 10%, 100% 25%, 0 25%, 0 40%, 100% 40%, 100% 65%, 0 65%)',
                }}
              >
                gomix666.com
              </div>
            </div>
          </Html>
          
          {/* 3Dテキスト表示は無効化 */}
          {/* <Html position={[-15, 5, 0]} transform={false} occlude distanceFactor={18}>
            <div className="max-w-md md:max-w-lg">
              <FloatingTextComponent text={`幸せになりたい
人生七転八倒

失敗に次ぐ失敗で借金300万
それでもあきらめられない

幸せを勝ち取るために
なんでも挑戦
投資、副業、
そしてブログ？

私の挑戦を
どうか笑ってやってください`} />
            </div>
          </Html> */}
          
          <SolarSystemMonument />
          <DomainNameRing />
          <CosmicOceanBackground />
        </Suspense>
        {/* モバイルデバイスでは操作を無効化、PCでのみ有効 */}
        {!isMobile && (
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.05} 
            minDistance={10} 
            maxDistance={30} 
            minPolarAngle={Math.PI / 3} 
            maxPolarAngle={Math.PI * 2 / 3}
            // 初期位置はカメラ設定で指定するため、ここでは指定しない
          />
        )}
        {/* モバイルデバイスでは自動回転のみ有効（操作不可） */}
        {isMobile && (
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false} 
            autoRotate 
            autoRotateSpeed={0.03} // モバイルでは回転速度を遅く
            minDistance={10} 
            maxDistance={30}
            // 初期位置はカメラ設定で指定するため、ここでは指定しない
          />
        )}
      </Canvas>
      
      {/* Floating Text - Visible on all screens */}
      <div className="absolute inset-0 flex flex-col items-start justify-start pt-16 px-4 pointer-events-none z-10">
        {/* サイト名の重複を避けるため削除 */}
        <div className="p-4 max-w-[280px] ml-4">
          <div className={`text-cyan-300 ${isMobile ? 'text-xs' : 'text-sm'} mx-auto text-shadow-cyan font-medium`}>
            {[
              '幸せになりたい',
              '人生七転八倒',
              '',
              '失敗に次ぐ失敗で借金300万',
              'それでもあきらめられない',
              '',
              '幸せを勝ち取るために',
              'なんでも挑戦',
              '投資、副業、',
              'そしてブログ？',
              '',
              '私の挑戦を',
              'どうか笑ってやってください'
            ].map((line, index) => (
              <div 
                key={index} 
                className={line === '' ? 'h-2' : 'floating-text-line'}
                style={{
                  animation: line === '' ? 'none' : `floatIn 1.5s ease-out ${index * 0.4}s both`
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
