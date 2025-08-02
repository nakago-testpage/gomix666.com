'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// クライアントサイドでのみレンダリングするために動的インポート
const DynamicHomepage = dynamic(() => import('@/components/DynamicHomepage'), {
  ssr: false,
  loading: () => <div className="w-full h-screen flex items-center justify-center bg-gray-900">Loading...</div>
});

// デバッグ用のスタイル
const debugStyles = {
  container: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1000,
  },
  title: {
    color: '#00ffff',
    fontSize: '2rem',
    fontFamily: 'monospace',
    textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
    marginBottom: '20px',
    animation: 'pulse 2s infinite',
  },
  info: {
    color: '#ffffff',
    fontSize: '1rem',
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '10px',
    borderRadius: '5px',
    maxWidth: '80%',
  },
  button: {
    backgroundColor: '#00ffff',
    color: '#000000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    marginTop: '20px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  }
};

// サイバーパンク風スタイルのテスト要素
export default function HomeClient() {
  const [showDebug, setShowDebug] = useState(false); // デバッグモードはデフォルトで無効
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // マウント時にデバッグ情報を収集
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDebugInfo({
        userAgent: navigator.userAgent,
        screenSize: { width: window.innerWidth, height: window.innerHeight },
        timestamp: new Date().toISOString(),
      });
      
      // URLパラメータでデバッグモードを制御
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('debug') === 'true') {
        setShowDebug(true);
      }
    }
  }, []);
  
  // サイバーパンク風サイト名スタイル - 極端に目立つスタイルに変更
  const cyberpunkStyles = {
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
      border: '10px solid red', // 極端に目立つ赤いボーダー
    },
    title: {
      fontFamily: "'VT323', 'Courier New', monospace",
      color: '#ff00ff', // マゼンタ色に変更
      fontSize: 'clamp(3rem, 10vw, 6rem)', // サイズを大きく
      textShadow: `
        0 0 10px #ff00ff, 
        0 0 20px #ff00ff, 
        0 0 30px #ff00ff, 
        0 0 40px #ff00ff, 
        0 0 50px #ff00ff, 
        0 0 60px #ff00ff, 
        0 0 70px rgba(255, 0, 255, 0.7), 
        0 0 80px rgba(255, 0, 255, 0.5)
      `,
      position: 'relative' as const,
      zIndex: 10,
      letterSpacing: '0.2em',
      padding: '0.5em 0.8em',
      WebkitTextStroke: '2px rgba(255, 0, 255, 0.9)',
      fontWeight: 'bold',
      mixBlendMode: 'screen' as const,
      filter: 'blur(0.5px)',
      animation: 'pulse 2s infinite', // パルスアニメーション
      background: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '10px',
      border: '3px solid #ff00ff',
    },
    noiseOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      opacity: 0.3, // 不透明度を上げる
      mixBlendMode: 'overlay' as const,
      pointerEvents: 'none' as const,
      zIndex: 5,
    },
    glitchEffect: {
      position: 'absolute' as const,
      content: '""',
      top: 0,
      left: '-5px', // より目立つように
      width: 'calc(100% + 10px)', // より目立つように
      height: '100%',
      background: 'transparent',
      borderLeft: '5px solid rgba(255, 0, 255, 0.9)', // 太く、より不透明に
      borderRight: '5px solid rgba(0, 255, 255, 0.9)', // 太く、より不透明に
      mixBlendMode: 'screen' as const,
      zIndex: 9,
    },
    debugInfo: {
      position: 'absolute' as const,
      bottom: '20px',
      left: '20px',
      color: '#ff0000', // 赤色
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '14px',
      zIndex: 100,
      maxWidth: '80%',
      overflowWrap: 'break-word' as const,
      border: '2px solid #ff0000',
    },
    keyframes: `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `,
  };

  // CSSアニメーションのキーフレームを追加
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // 既存のスタイル要素を確認
      let styleElement = document.getElementById('cyberpunk-keyframes');
      
      // 存在しない場合は作成
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'cyberpunk-keyframes';
        document.head.appendChild(styleElement);
      }
      
      // キーフレームを追加
      styleElement.innerHTML = `
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes flicker {
          0% { opacity: 1; }
          25% { opacity: 0.8; }
          50% { opacity: 0.9; }
          75% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `;
    }
  }, []);

  return (
    <div className="w-full h-screen bg-black">
      {showDebug ? (
        <div style={debugStyles.container}>
          <h1 style={debugStyles.title}>gomix666.com</h1>
          <div style={debugStyles.info}>
            <p>Debug Mode: {process.env.NODE_ENV}</p>
            <p>Time: {debugInfo?.timestamp || 'Loading...'}</p>
            <p>Screen: {debugInfo?.screenSize ? `${debugInfo.screenSize.width}x${debugInfo.screenSize.height}` : 'Unknown'}</p>
            <p>UA: {debugInfo?.userAgent || 'Unknown'}</p>
          </div>
          <button 
            style={debugStyles.button}
            onClick={() => setShowDebug(false)}
          >
            Load Cyberpunk Site Name
          </button>
        </div>
      ) : (
        // サイバーパンク風サイト名を直接表示 - より目立つバージョン
        <div style={cyberpunkStyles.container}>
          <div style={cyberpunkStyles.noiseOverlay}></div>
          <div style={cyberpunkStyles.glitchEffect}></div>
          <h1 style={cyberpunkStyles.title}>gomix666.com</h1>
          
          {/* デバッグ情報を表示 */}
          <div style={cyberpunkStyles.debugInfo}>
            <p><strong>デバッグ情報:</strong></p>
            <p>Build: {process.env.NODE_ENV} ({new Date().toISOString()})</p>
            <p>Screen: {debugInfo?.screenSize ? `${debugInfo.screenSize.width}x${debugInfo.screenSize.height}` : 'Unknown'}</p>
            <p>Browser: {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'SSR'}</p>
            <p>CSSアニメーションテスト: このテキストが点滅していれば成功</p>
            <button 
              onClick={() => alert('スタイルテスト成功!')} 
              style={{ 
                background: '#ff00ff', 
                color: 'white', 
                padding: '5px 10px', 
                border: 'none',
                borderRadius: '5px',
                marginTop: '10px',
                cursor: 'pointer',
                animation: 'flicker 1s infinite'
              }}
            >
              テストボタン
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
