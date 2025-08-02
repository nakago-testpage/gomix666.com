'use client';

import React, { useRef, useMemo, Suspense, useState, useEffect, CSSProperties } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Torus, Html, Stars } from '@react-three/drei';
import SiteTitleEffect from './SiteTitleEffect';
import SimpleTitleEffect from './SimpleTitleEffect';
import * as THREE from 'three';
// グローバルCSSを使用 - CSS Modulesは使用しない
import '../app/globals.css';

// デバッグ用コンソール出力
const DEBUG = true;

// コンポーネントがマウントされたことを確認する関数
function logDebugInfo(message: string, data?: any) {
  if (DEBUG && typeof window !== 'undefined') {
    console.log(`[DEBUG] ${message}`, data || '');
    
    // DOMにデバッグ表示を追加
    const debugElement = document.createElement('div');
    debugElement.style.position = 'fixed';
    debugElement.style.bottom = '10px';
    debugElement.style.left = '10px';
    debugElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
    debugElement.style.color = '#00ff00';
    debugElement.style.padding = '5px';
    debugElement.style.zIndex = '9999';
    debugElement.style.fontSize = '12px';
    debugElement.style.maxWidth = '80%';
    debugElement.style.overflow = 'auto';
    debugElement.textContent = `${message}: ${data ? JSON.stringify(data) : ''}`;
    document.body.appendChild(debugElement);
    
    // 5秒後に削除
    setTimeout(() => {
      document.body.removeChild(debugElement);
    }, 5000);
  }
}

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
  
  // モバイル表示時はオブジェクトをより大きくし、中央に配置
  const scale = isMobile ? 3.0 : 1.0; // モバイルでは3.0倍に拡大
  
  // 初期角度を設定して立体的に見せる
  return (
    <group 
      position={isMobile ? [0, -0.5, 0] : [0, 0, 0]} // モバイル表示時の位置を中央に調整
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

// アニメーションのキーフレームを定義
const keyframes = {
  textGlow: `
    0% { text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff; }
    50% { text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff; }
    100% { text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff; }
  `,
  textFlicker: `
    0% { opacity: 1; }
    3% { opacity: 0.8; }
    6% { opacity: 1; }
    7% { opacity: 0.6; }
    8% { opacity: 1; }
    9% { opacity: 0.9; }
    10% { opacity: 1; }
    30% { opacity: 1; }
    35% { opacity: 0.7; }
    40% { opacity: 1; }
    75% { opacity: 1; }
    76% { opacity: 0.8; }
    77% { opacity: 1; }
    78% { opacity: 0.9; }
    79% { opacity: 1; }
    100% { opacity: 1; }
  `,
  textBroken: `
    0% { filter: blur(0.5px); transform: translate(0, 0); }
    10% { filter: blur(1px); transform: translate(-3px, 0); }
    20% { filter: blur(0.7px); transform: translate(3px, 0); }
    30% { filter: blur(1.2px); transform: translate(-3px, 0); }
    40% { filter: blur(0.5px); transform: translate(3px, 0); }
    50% { filter: blur(1.5px); transform: translate(-3px, 0); }
    60% { filter: blur(0.7px); transform: translate(3px, 0); }
    70% { filter: blur(1.2px); transform: translate(-3px, 0); }
    80% { filter: blur(0.5px); transform: translate(3px, 0); }
    90% { filter: blur(1px); transform: translate(-3px, 0); }
    100% { filter: blur(0.5px); transform: translate(0, 0); }
  `,
  glitchEffect: `
    0% { transform: translate(0, 0); }
    20% { transform: translate(-3px, 0); }
    40% { transform: translate(3px, 0); }
    60% { transform: translate(-3px, 0); }
    80% { transform: translate(3px, 0); }
    100% { transform: translate(0, 0); }
  `,
  glitchEffect2: `
    0% { transform: translate(0, 0); }
    20% { transform: translate(3px, 0); }
    40% { transform: translate(-3px, 0); }
    60% { transform: translate(3px, 0); }
    80% { transform: translate(-3px, 0); }
    100% { transform: translate(0, 0); }
  `,
  noiseShift: `
    0% { background-position: 0 0; }
    100% { background-position: 100% 100%; }
  `,
  horizontalGlitch: `
    0% { top: 10%; }
    20% { top: 40%; }
    40% { top: 20%; }
    60% { top: 80%; }
    80% { top: 30%; }
    100% { top: 10%; }
  `,
  flickerOverlay: `
    0% { opacity: 0; }
    5% { opacity: 0.3; }
    10% { opacity: 0; }
    15% { opacity: 0.3; }
    20% { opacity: 0; }
    25% { opacity: 0.3; }
    30% { opacity: 0; }
    70% { opacity: 0; }
    75% { opacity: 0.3; }
    80% { opacity: 0; }
    85% { opacity: 0.3; }
    90% { opacity: 0; }
    100% { opacity: 0; }
  `,
  flickerOn: `
    0% { opacity: 0; }
    10% { opacity: 0; }
    10.1% { opacity: 0.5; }
    10.2% { opacity: 0; }
    20% { opacity: 0; }
    20.1% { opacity: 0.7; }
    20.6% { opacity: 0; }
    30% { opacity: 0; }
    30.1% { opacity: 0.2; }
    30.2% { opacity: 0; }
    40% { opacity: 0; }
    40.1% { opacity: 0.5; }
    40.2% { opacity: 0; }
    100% { opacity: 0; }
  `,
};

// --- Main Component ---
export default function DynamicHomepage() {
  // マウント時にデバッグ情報を表示
  useEffect(() => {
    logDebugInfo('DynamicHomepage mounted', { 
      isBrowser: typeof window !== 'undefined',
      userAgent: navigator.userAgent,
      screenSize: { width: window.innerWidth, height: window.innerHeight }
    });
    
    // グローバルCSSが適用されているか確認
    const testElement = document.createElement('div');
    testElement.className = 'site-name-cyberpunk';
    document.body.appendChild(testElement);
    const computedStyle = window.getComputedStyle(testElement);
    const hasStyles = computedStyle.textShadow !== '' || computedStyle.animation !== '';
    document.body.removeChild(testElement);
    
    logDebugInfo('Global CSS check', { hasStyles });
    
    // Three.jsのサポート確認
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        logDebugInfo('WebGL not supported', { webglSupport: false });
      } else {
        // WebGLコンテキストを正しい型にキャスト
        const webgl = gl as WebGLRenderingContext;
        logDebugInfo('WebGL supported', { 
          webglSupport: true,
          glVersion: webgl.getParameter(webgl.VERSION),
          glVendor: webgl.getParameter(webgl.VENDOR),
          glRenderer: webgl.getParameter(webgl.RENDERER)
        });
      }
    } catch (e: any) {
      logDebugInfo('WebGL check error', { error: e?.message || 'Unknown error' });
    }
    
    // クリーンアップ関数
    return () => {
      logDebugInfo('DynamicHomepage unmounted');
    };
  }, []);
  
  // モバイルデバイスを検出
  const isMobile = useIsMobile();
  const [canvasError, setCanvasError] = useState(true); // デフォルトでフォールバック表示を有効化
  
  // マウント後にキャンバスエラー状態をリセットしてThree.jsの初期化を試みる
  useEffect(() => {
    // デバッグ用にフォールバック表示を有効化した状態をログ出力
    logDebugInfo('DynamicHomepage fallback active', { fallbackEnabled: true });
    
    // 3秒後にThree.jsの初期化を試みる
    const timer = setTimeout(() => {
      try {
        // WebGLサポート確認
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (gl) {
          logDebugInfo('WebGL supported, attempting to initialize Three.js');
          setCanvasError(false); // Three.jsの初期化を試みる
        } else {
          logDebugInfo('WebGL not supported, staying with fallback');
        }
      } catch (e: any) {
        logDebugInfo('Error checking WebGL support', { error: e?.message || 'Unknown error' });
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // モバイルデバイスではキャンバスのポインターイベントを無効化
  const canvasStyle = {
    width: '100%',
    height: '100%',
    touchAction: isMobile ? 'none' : 'auto',
    pointerEvents: isMobile ? 'none' as const : 'auto' as const
  };
  
  // フォールバックコンテンツのスタイル
  const fallbackStyles = {
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    title: {
      fontFamily: "'VT323', 'Courier New', monospace",
      color: '#ffffff',
      fontSize: isMobile ? 'clamp(1.5rem, 5vw, 2.5rem)' : 'clamp(2.5rem, 8vw, 4rem)',
      textShadow: `
        0 0 5px #00ffff, 
        0 0 10px #00ffff, 
        0 0 15px #00ffff, 
        0 0 20px #00ffff, 
        0 0 35px #00ffff, 
        0 0 40px #00ffff, 
        0 0 50px rgba(0, 255, 255, 0.7), 
        0 0 75px rgba(0, 255, 255, 0.5)
      `,
      position: 'relative' as const,
      zIndex: 10,
      letterSpacing: '0.15em',
      padding: '0.5em 0.8em',
      WebkitTextStroke: '1px rgba(0, 255, 255, 0.9)',
      fontWeight: 'bold',
      mixBlendMode: 'screen' as const,
      filter: 'blur(0.7px)',
      animation: 'textGlow 2s infinite ease-in-out, textFlicker 5s infinite',
    },
    noiseOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      opacity: 0.15,
      mixBlendMode: 'overlay' as const,
      pointerEvents: 'none' as const,
      zIndex: 5,
    },
  };

  // エラー発生時のフォールバック表示
  if (canvasError) {
    return (
      <div style={fallbackStyles.container}>
        <div style={fallbackStyles.noiseOverlay}></div>
        <h1 style={fallbackStyles.title}>gomix666.com</h1>
      </div>
    );
  }

  // モバイルとPCでカメラ設定を変更
  const cameraSettings = isMobile 
    ? { position: [0, 0, 8] as [number, number, number], fov: 60 } // モバイル用：より近くから見てオブジェクトを大きく表示、視野角を広めに
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
  
  // グローバルスタイルを追加（アニメーション定義）- SSR対応版
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      console.log('サイト名エフェクト初期化開始 - デバッグ情報');
      
      // 既存のスタイル要素があれば削除
      const existingStyle = document.getElementById('dynamic-homepage-styles');
      if (existingStyle) {
        existingStyle.remove();
        console.log('既存のスタイル要素を削除しました');
      }
      
      // デバッグ情報を出力
      logDebugInfo('サイト名エフェクト初期化開始', { 
        timestamp: new Date().toISOString()
      });
      
      // 新しいスタイル要素を作成
      const styleEl = document.createElement('style');
      styleEl.id = 'dynamic-homepage-styles';
      styleEl.innerHTML = `
        /* アニメーションのキーフレーム定義 */
        @keyframes textGlow {
          0% { text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff; }
          50% { text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff, 0 0 35px #00ffff, 0 0 40px #00ffff, 0 0 50px rgba(0, 255, 255, 0.7), 0 0 75px rgba(0, 255, 255, 0.5); }
          100% { text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff; }
        }
        
        @keyframes textFlicker {
          0% { opacity: 1; }
          3% { opacity: 0.8; }
          6% { opacity: 1; }
          7% { opacity: 0.4; }
          8% { opacity: 1; }
          9% { opacity: 0.9; }
          10% { opacity: 0.8; }
          20% { opacity: 1; }
          50% { opacity: 0.8; }
          70% { opacity: 0.9; }
          72% { opacity: 0.2; }
          73% { opacity: 0.95; }
          74% { opacity: 0; }
          75% { opacity: 1; }
          85% { opacity: 0.7; }
          86% { opacity: 1; }
          90% { opacity: 1; }
          98% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        @keyframes textBroken {
          0% { clip-path: inset(0 0 0 0); }
          5% { clip-path: inset(30% 0 20% 0); }
          5.5% { clip-path: inset(0 0 0 0); }
          6% { clip-path: inset(10% 0 40% 0); }
          6.5% { clip-path: inset(0 0 0 0); }
          7% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(0 0 0 0); }
          20.5% { clip-path: inset(0 30% 0 10%); }
          21% { clip-path: inset(0 0 0 0); }
          92% { clip-path: inset(0 0 0 0); }
          92.5% { clip-path: inset(40% 10% 0 10%); }
          93% { clip-path: inset(0 0 0 0); }
          93.5% { clip-path: inset(10% 0 25% 0); }
          94% { clip-path: inset(0 0 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        
        @keyframes glitchEffect {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 3px); }
          40% { transform: translate(-3px, -3px); }
          60% { transform: translate(3px, 3px); }
          80% { transform: translate(3px, -3px); }
          100% { transform: translate(0); }
        }
        
        @keyframes glitchEffect2 {
          0% { transform: translate(0); }
          20% { transform: translate(3px, -3px); }
          40% { transform: translate(3px, 3px); }
          60% { transform: translate(-3px, -3px); }
          80% { transform: translate(-3px, 3px); }
          100% { transform: translate(0); }
        }
        
        @keyframes noiseShift {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(3%, 7%); }
          30% { transform: translate(7%, -3%); }
          40% { transform: translate(-5%, 5%); }
          50% { transform: translate(5%, 5%); }
          60% { transform: translate(7%, -7%); }
          70% { transform: translate(-3%, 3%); }
          80% { transform: translate(1%, -1%); }
          90% { transform: translate(-1%, 3%); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes horizontalGlitch {
          0% { transform: translateX(0); opacity: 0; }
          10% { transform: translateX(0); opacity: 0.7; }
          11% { transform: translateX(30px); opacity: 0.7; }
          15% { transform: translateX(-20px); opacity: 0.7; }
          18% { transform: translateX(0); opacity: 0; }
          20% { opacity: 0; }
          30% { opacity: 0; }
          31% { transform: translateX(0); opacity: 0.7; }
          32% { transform: translateX(-20px); opacity: 0.7; }
          33% { transform: translateX(0); opacity: 0; }
          80% { opacity: 0; }
          85% { transform: translateX(0); opacity: 0.7; }
          95% { transform: translateX(0); opacity: 0.7; }
          100% { transform: translateX(0); opacity: 0; }
        }
        
        /* サイト名のサイバーパンク風スタイル - インライン強化版 */
        #site-name-text {
          font-family: "VT323", "Courier New", monospace !important;
          color: #ffffff !important;
          text-shadow: 
            0 0 5px #00ffff !important, 
            0 0 10px #00ffff !important, 
            0 0 15px #00ffff !important, 
            0 0 20px #00ffff !important, 
            0 0 35px #00ffff !important, 
            0 0 40px #00ffff !important, 
            0 0 50px rgba(0, 255, 255, 0.7) !important, 
            0 0 75px rgba(0, 255, 255, 0.5) !important;
          position: relative !important;
          animation: textGlow 2s infinite, textFlicker 5s infinite, textBroken 8s infinite !important;
          letter-spacing: 0.15em !important;
          padding: 0.5em 0.8em !important;
          -webkit-text-stroke: 1px rgba(0, 255, 255, 0.9) !important;
          font-weight: bold !important;
          mix-blend-mode: screen !important;
          filter: blur(0.7px) !important;
          z-index: 100 !important;
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        /* サイト名のサイバーパンク風スタイル - クラス版 */
        .site-name-cyberpunk-direct {
          font-family: "VT323", "Courier New", monospace !important;
          color: #ffffff !important;
          text-shadow: 
            0 0 5px #00ffff !important, 
            0 0 10px #00ffff !important, 
            0 0 15px #00ffff !important, 
            0 0 20px #00ffff !important, 
            0 0 35px #00ffff !important, 
            0 0 40px #00ffff !important, 
            0 0 50px rgba(0, 255, 255, 0.7) !important, 
            0 0 75px rgba(0, 255, 255, 0.5) !important;
          position: relative !important;
          animation: textGlow 2s infinite, textFlicker 5s infinite, textBroken 8s infinite !important;
          letter-spacing: 0.15em !important;
          padding: 0.5em 0.8em !important;
          -webkit-text-stroke: 1px rgba(0, 255, 255, 0.9) !important;
          font-weight: bold !important;
          mix-blend-mode: screen !important;
          z-index: 100 !important;
          filter: blur(0.7px) !important;
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        /* サイト名のアニメーション適用 */
        .site-name {
          animation: textGlow 2s infinite, textFlicker 5s infinite, textBroken 8s infinite;
        }
        .noise-overlay {
          animation: noiseShift 3s infinite linear;
        }
        .horizontal-glitch {
          animation: horizontalGlitch 7s infinite linear;
        }
        .horizontal-glitch-2 {
          animation: horizontalGlitch 5s infinite linear;
          animation-delay: 2.5s;
        }
        .color-overlay-red {
          animation: flickerOverlay 4s infinite;
          animation-delay: 1.5s;
        }
        .color-overlay-cyan {
          animation: flickerOverlay 3.5s infinite;
          animation-delay: 3s;
        }
        .flicker-overlay {
          animation: flickerOn 10s infinite;
        }
        .glitch-text-red {
          animation: glitchEffect 4s infinite;
        }
        .glitch-text-purple {
          animation: glitchEffect2 4.5s infinite;
        }
        
        /* 不足しているグリッチオーバーレイクラス */
        .glitch-overlay-purple {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: rgba(255, 0, 255, 0.8);
          text-shadow: 2px 0 rgba(255, 0, 255, 0.8), -2px 0 rgba(0, 255, 255, 0.8);
          z-index: 5;
          font-weight: bold;
          animation: glitchEffect 2s infinite;
          font-family: "VT323", "Courier New", monospace;
          padding: 0.5em 0.8em;
          pointer-events: none;
        }
        
        .glitch-overlay-red {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: rgba(255, 0, 0, 0.8);
          text-shadow: -2px 0 rgba(255, 0, 0, 0.8), 2px 0 rgba(0, 255, 255, 0.8);
          z-index: 4;
          font-weight: bold;
          animation: glitchEffect2 2.5s infinite;
          font-family: "VT323", "Courier New", monospace;
          padding: 0.5em 0.8em;
          pointer-events: none;
        }
        
        /* ノイズオーバーレイ */
        .noise-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.05;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 3;
        }
        
        /* 水平グリッチライン */
        .horizontal-glitch, .horizontal-glitch-2 {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: rgba(0, 255, 255, 0.8);
          z-index: 6;
          pointer-events: none;
        }
        
        /* フリッカーオーバーレイ */
        @keyframes flickerOverlay {
          0% { opacity: 0; }
          10% { opacity: 0.1; }
          15% { opacity: 0; }
          20% { opacity: 0.1; }
          25% { opacity: 0; }
          30% { opacity: 0.1; }
          35% { opacity: 0; }
          40% { opacity: 0.1; }
          45% { opacity: 0; }
          50% { opacity: 0.1; }
          55% { opacity: 0; }
          60% { opacity: 0.1; }
          65% { opacity: 0; }
          70% { opacity: 0.1; }
          75% { opacity: 0; }
          80% { opacity: 0.1; }
          85% { opacity: 0; }
          90% { opacity: 0.1; }
          95% { opacity: 0; }
          100% { opacity: 0.1; }
        }
        
        @keyframes flickerOn {
          0% { opacity: 0; }
          5% { opacity: 0.8; }
          10% { opacity: 0; }
          15% { opacity: 0.4; }
          20% { opacity: 0; }
          25% { opacity: 0.6; }
          30% { opacity: 0; }
          35% { opacity: 0.3; }
          40% { opacity: 0; }
          45% { opacity: 0.5; }
          50% { opacity: 0; }
          55% { opacity: 0.7; }
          60% { opacity: 0; }
          65% { opacity: 0.9; }
          70% { opacity: 0; }
          75% { opacity: 0.2; }
          80% { opacity: 0; }
          85% { opacity: 0.1; }
          90% { opacity: 0; }
          95% { opacity: 0.3; }
          100% { opacity: 0; }
        }
      `;
      
      // スタイル要素をヘッドに追加
      document.head.appendChild(styleEl);
      
      // クリーンアップ関数
      return () => {
        if (styleEl && document.head.contains(styleEl)) {
          document.head.removeChild(styleEl);
        }
      };
    }
    // SSRの場合は何もしない
    return () => {};
  }, []);

  return (
    <div style={containerStyle}>
      {/* Three.jsキャンバス */}
      <Canvas
        camera={cameraSettings}
        style={canvasStyle}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#000000'));
          logDebugInfo('Three.js Canvas created', { gl });
        }}
      >
        {/* 背景 */}
        <CosmicOceanBackground />
        
        {/* 宇宙空間の星 */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* 3Dオブジェクト */}
        <SolarSystemMonument />
        
        {/* サイト名 - HTML要素として表示 - モバイルでは非表示 */}
        {!isMobile && (
          <Html
            center
            position={[0, 0, 0]}
            distanceFactor={10}
            occlude={[]} // オクルージョンを無効化
          >
            <div id="site-name-text" className="site-name-cyberpunk-direct">
              gomix666.com
            </div>
          </Html>
        )}
        
        {/* PCではカメラコントロールを有効化 */}
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
      
      {/* 画面中央のサイト名テキスト - サイバーパンクエフェクト強化版 */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-50">
        <div id="main-site-title" className="cyberpunk-site-name">
          <style dangerouslySetInnerHTML={{ __html: `
            /* キーフレーム定義 */
            @keyframes cyberpunkGlow {
              0% { text-shadow: 
                0 0 5px #00ffff, 
                0 0 10px #00ffff, 
                0 0 15px #00ffff, 
                0 0 20px #00ffff, 
                0 0 35px #00ffff, 
                0 0 40px #00ffff, 
                0 0 50px rgba(0, 255, 255, 0.7), 
                0 0 75px rgba(0, 255, 255, 0.5); }
              50% { text-shadow: 
                0 0 10px #00ffff, 
                0 0 20px #00ffff, 
                0 0 25px #00ffff, 
                0 0 30px #00ffff, 
                0 0 45px #00ffff, 
                0 0 50px #00ffff, 
                0 0 60px rgba(0, 255, 255, 0.7), 
                0 0 85px rgba(0, 255, 255, 0.5); }
              100% { text-shadow: 
                0 0 5px #00ffff, 
                0 0 10px #00ffff, 
                0 0 15px #00ffff, 
                0 0 20px #00ffff, 
                0 0 35px #00ffff, 
                0 0 40px #00ffff, 
                0 0 50px rgba(0, 255, 255, 0.7), 
                0 0 75px rgba(0, 255, 255, 0.5); }
            }
            
            @keyframes cyberpunkFlicker {
              0% { opacity: 1; }
              3% { opacity: 0.8; }
              6% { opacity: 1; }
              7% { opacity: 0.4; }
              8% { opacity: 1; }
              9% { opacity: 0.9; }
              10% { opacity: 0.8; }
              20% { opacity: 1; }
              50% { opacity: 0.8; }
              70% { opacity: 0.9; }
              72% { opacity: 0.2; }
              73% { opacity: 0.95; }
              74% { opacity: 0; }
              75% { opacity: 1; }
              85% { opacity: 0.7; }
              86% { opacity: 1; }
              90% { opacity: 1; }
              98% { opacity: 0.5; }
              100% { opacity: 1; }
            }
            
            @keyframes purpleGlitch {
              0% { transform: translate(0); }
              10% { transform: translate(-2px, 2px); }
              20% { transform: translate(2px, -2px); }
              30% { transform: translate(-2px, -2px); }
              40% { transform: translate(2px, 2px); }
              50% { transform: translate(-2px, 2px); }
              60% { transform: translate(2px, -2px); }
              70% { transform: translate(0); }
              80% { transform: translate(-2px, 2px); }
              90% { transform: translate(2px, -2px); }
              100% { transform: translate(0); }
            }
            
            @keyframes redGlitch {
              0% { transform: translate(0); }
              10% { transform: translate(2px, -2px); }
              20% { transform: translate(-2px, 2px); }
              30% { transform: translate(2px, 2px); }
              40% { transform: translate(-2px, -2px); }
              50% { transform: translate(2px, -2px); }
              60% { transform: translate(-2px, 2px); }
              70% { transform: translate(0); }
              80% { transform: translate(2px, -2px); }
              90% { transform: translate(-2px, 2px); }
              100% { transform: translate(0); }
            }
            
            @keyframes noiseAnimation {
              0% { background-position: 0% 0%; }
              100% { background-position: 100% 100%; }
            }
            
            @keyframes scanline {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(100%); }
            }
            
            /* メインスタイル */
            .cyberpunk-site-name {
              font-family: "VT323", "Courier New", monospace;
              color: #ffffff;
              font-size: clamp(2rem, 10vw, 5rem);
              letter-spacing: 0.15em;
              text-align: center;
              position: relative;
              padding: 0.5em;
              font-weight: bold;
              -webkit-text-stroke: 1px rgba(0, 255, 255, 0.9);
              animation: cyberpunkGlow 2s infinite ease-in-out, cyberpunkFlicker 5s infinite;
              z-index: 100;
              text-transform: lowercase;
              transform: scale(1.2);
            }
            
            /* 紫のグリッチオーバーレイ */
            .cyberpunk-site-name::before {
              content: 'gomix666.com';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              color: rgba(255, 0, 255, 0.8);
              text-shadow: 2px 0 rgba(255, 0, 255, 0.8), -2px 0 rgba(0, 255, 255, 0.8);
              z-index: 5;
              font-weight: bold;
              animation: purpleGlitch 2s infinite;
              padding: 0.5em;
              pointer-events: none;
            }
            
            /* 赤のグリッチオーバーレイ */
            .cyberpunk-site-name::after {
              content: 'gomix666.com';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              color: rgba(255, 0, 0, 0.8);
              text-shadow: -2px 0 rgba(255, 0, 0, 0.8), 2px 0 rgba(0, 255, 255, 0.8);
              z-index: 4;
              font-weight: bold;
              animation: redGlitch 2.5s infinite;
              padding: 0.5em;
              pointer-events: none;
            }
            
            /* ノイズオーバーレイ */
            .noise-overlay {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
              opacity: 0.05;
              mix-blend-mode: overlay;
              pointer-events: none;
              z-index: 6;
              animation: noiseAnimation 8s infinite linear;
            }
            
            /* スキャンライン */
            .scanline {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 10px;
              background: linear-gradient(to bottom, rgba(0, 255, 255, 0.2), transparent);
              opacity: 0.3;
              z-index: 7;
              pointer-events: none;
              animation: scanline 4s infinite linear;
            }
          `}} />
          
          {/* メインテキスト */}
          gomix666.com
          
          {/* ノイズオーバーレイ */}
          <div className="noise-overlay"></div>
          
          {/* スキャンライン */}
          <div className="scanline"></div>
        </div>
      </div>
    </div>
  );
}
