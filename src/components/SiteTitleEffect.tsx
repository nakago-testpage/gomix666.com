import React, { useEffect, useState, useRef } from 'react';

interface SiteTitleEffectProps {
  isMobile: boolean;
}

const SiteTitleEffect: React.FC<SiteTitleEffectProps> = ({ isMobile }) => {
  // デバッグ用の状態
  const [isStyleInjected, setIsStyleInjected] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  
  // アニメーションのインターバルIDを保存するためのref
  const animationRefs = useRef<{
    glowAnimation: NodeJS.Timeout | null;
    purpleGlitchAnimation: NodeJS.Timeout | null;
    redGlitchAnim: NodeJS.Timeout | null;
    noiseAnim: NodeJS.Timeout | null;
  }>({
    glowAnimation: null,
    purpleGlitchAnimation: null,
    redGlitchAnim: null,
    noiseAnim: null
  });
  
  // デバッグモードを切り替えるキーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey) {
        setDebugMode(prev => !prev);
        console.log('Debug mode:', !debugMode);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [debugMode]);
  
  // コンポーネントのマウント確認と直接DOM操作
  useEffect(() => {
    console.log('SiteTitleEffectコンポーネントがマウントされました');
    
    // 直接HTML要素を作成してボディに挿入
    if (typeof window !== 'undefined' && document.body) {
      // 既存の要素があれば削除
      const existingEffect = document.getElementById('direct-site-title-effect');
      if (existingEffect) {
        existingEffect.remove();
      }
      
      // 新しいコンテナを作成
      const effectContainer = document.createElement('div');
      effectContainer.id = 'direct-site-title-effect';
      effectContainer.style.position = 'fixed';
      effectContainer.style.top = '0';
      effectContainer.style.left = '0';
      effectContainer.style.width = '100%';
      effectContainer.style.height = '100%';
      effectContainer.style.display = 'flex';
      effectContainer.style.alignItems = 'center';
      effectContainer.style.justifyContent = 'center';
      effectContainer.style.pointerEvents = 'none';
      effectContainer.style.zIndex = '9999';
      // デバッグ用に背景色を追加（本番環境では削除）
      if (debugMode) {
        effectContainer.style.backgroundColor = 'rgba(0,0,0,0.1)';
      }
      
      // サイト名コンテナ
      const siteNameContainer = document.createElement('div');
      siteNameContainer.style.position = 'relative';
      siteNameContainer.style.padding = '10px';
      siteNameContainer.style.textAlign = 'center';
      siteNameContainer.style.width = 'auto';
      
      // メインテキスト - 強化版サイバーパンクエフェクト
      const mainText = document.createElement('div');
      mainText.id = 'direct-main-text';
      mainText.textContent = 'gomix666.com';
      mainText.style.fontFamily = '"VT323", "Courier New", monospace';
      mainText.style.color = '#ffffff';
      
      // 7層の発光シャドウ - より強力なグローエフェクト
      mainText.style.textShadow = 
        '0 0 5px #00ffff, ' + 
        '0 0 10px #00ffff, ' + 
        '0 0 15px #00ffff, ' + 
        '0 0 20px #00ffff, ' + 
        '0 0 35px #00ffff, ' + 
        '0 0 40px #00ffff, ' + 
        '0 0 50px rgba(0, 255, 255, 0.7), ' + 
        '0 0 75px rgba(0, 255, 255, 0.5), ' +
        '0 0 85px rgba(0, 255, 255, 0.4), ' +
        '0 0 95px rgba(0, 255, 255, 0.3)';
        
      mainText.style.position = 'relative';
      mainText.style.letterSpacing = isMobile ? '0.05em' : '0.15em';
      mainText.style.padding = '0.5em 0.8em';
      mainText.style.fontWeight = 'bold';
      mainText.style.zIndex = '100';
      mainText.style.display = 'block';
      mainText.style.opacity = '1';
      mainText.style.visibility = 'visible';
      
      // フォントサイズの最適化
      mainText.style.fontSize = isMobile ? 'clamp(0.7rem, 3vw, 1.2rem)' : 'clamp(1.2rem, 4vw, 1.8rem)';
      mainText.style.transform = isMobile ? 'scale(0.6)' : 'scale(0.8)';
      
      // テキストの輪郭を強調
      mainText.style.webkitTextStroke = '0.5px #00ffff';
      // textStrokeは標準プロパティではないため、webkit版のみ使用
      
      // グローアニメーションを直接適用
      let glowIntensity = 1;
      let increasing = false;
      animationRefs.current.glowAnimation = setInterval(() => {
        if (increasing) {
          glowIntensity += 0.05;
          if (glowIntensity >= 1) {
            glowIntensity = 1;
            increasing = false;
          }
        } else {
          glowIntensity -= 0.05;
          if (glowIntensity <= 0.5) {
            glowIntensity = 0.5;
            increasing = true;
          }
        }
        
        mainText.style.textShadow = 
          `0 0 ${5 * glowIntensity}px #00ffff, ` + 
          `0 0 ${10 * glowIntensity}px #00ffff, ` + 
          `0 0 ${15 * glowIntensity}px #00ffff, ` + 
          `0 0 ${20 * glowIntensity}px #00ffff, ` + 
          `0 0 ${35 * glowIntensity}px #00ffff, ` + 
          `0 0 ${40 * glowIntensity}px #00ffff, ` + 
          `0 0 ${50 * glowIntensity}px rgba(0, 255, 255, 0.7), ` + 
          `0 0 ${75 * glowIntensity}px rgba(0, 255, 255, 0.5)`;
      }, 50);
      
      // ノイズテクスチャオーバーレイの生成
      const noiseOverlay = document.createElement('div');
      noiseOverlay.id = 'noise-overlay';
      noiseOverlay.style.position = 'absolute';
      noiseOverlay.style.top = '0';
      noiseOverlay.style.left = '0';
      noiseOverlay.style.width = '100%';
      noiseOverlay.style.height = '100%';
      noiseOverlay.style.pointerEvents = 'none';
      noiseOverlay.style.zIndex = '10';
      noiseOverlay.style.opacity = '0.15';
      noiseOverlay.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
      noiseOverlay.style.backgroundSize = '100px 100px';
      noiseOverlay.style.mixBlendMode = 'overlay';
      
      // 紫のグリッチオーバーレイ - 強化版
      const purpleGlitch = document.createElement('div');
      purpleGlitch.id = 'direct-purple-glitch';
      purpleGlitch.textContent = 'gomix666.com';
      purpleGlitch.style.position = 'absolute';
      purpleGlitch.style.top = '0';
      purpleGlitch.style.left = '0';
      purpleGlitch.style.width = '100%';
      purpleGlitch.style.height = '100%';
      purpleGlitch.style.color = 'rgba(255, 0, 255, 0.8)';
      purpleGlitch.style.textShadow = '2px 0 rgba(255, 0, 255, 0.8), -2px 0 rgba(0, 255, 255, 0.8)';
      purpleGlitch.style.zIndex = '5';
      purpleGlitch.style.fontWeight = 'bold';
      purpleGlitch.style.fontFamily = '"VT323", "Courier New", monospace';
      purpleGlitch.style.fontSize = isMobile ? 'clamp(0.7rem, 3vw, 1.2rem)' : 'clamp(1.2rem, 4vw, 1.8rem)';
      purpleGlitch.style.transform = isMobile ? 'scale(0.6)' : 'scale(0.8)';
      purpleGlitch.style.letterSpacing = isMobile ? '0.05em' : '0.15em';
      purpleGlitch.style.padding = '0.5em 0.8em';
      purpleGlitch.style.pointerEvents = 'none';
      
      // 赤のグリッチオーバーレイ - 新規追加
      const redGlitch = document.createElement('div');
      redGlitch.id = 'direct-red-glitch';
      redGlitch.textContent = 'gomix666.com';
      redGlitch.style.position = 'absolute';
      redGlitch.style.top = '0';
      redGlitch.style.left = '0';
      redGlitch.style.width = '100%';
      redGlitch.style.height = '100%';
      redGlitch.style.color = 'rgba(255, 0, 0, 0.8)';
      redGlitch.style.textShadow = '-2px 0 rgba(255, 0, 0, 0.8), 2px 0 rgba(0, 255, 255, 0.8)';
      redGlitch.style.zIndex = '4';
      redGlitch.style.fontWeight = 'bold';
      redGlitch.style.fontFamily = '"VT323", "Courier New", monospace';
      redGlitch.style.fontSize = isMobile ? 'clamp(0.7rem, 3vw, 1.2rem)' : 'clamp(1.2rem, 4vw, 1.8rem)';
      redGlitch.style.transform = isMobile ? 'scale(0.6)' : 'scale(0.8)';
      redGlitch.style.letterSpacing = isMobile ? '0.05em' : '0.15em';
      redGlitch.style.padding = '0.5em 0.8em';
      redGlitch.style.pointerEvents = 'none';
      redGlitch.style.opacity = '0.8';
      
      // 赤のグリッチアニメーション
      let redOffset = 0;
      animationRefs.current.redGlitchAnim = setInterval(() => {
        // ランダムなグリッチ効果
        if (Math.random() > 0.8) {
          redOffset = Math.random() > 0.5 ? Math.random() * 3 : -Math.random() * 3;
          redGlitch.style.transform = isMobile ? 
            `scale(0.6) translate(${redOffset}px, 0)` : 
            `scale(0.8) translate(${redOffset}px, 0)`;
          
          // 瞬間的な表示/非表示
          if (Math.random() > 0.9) {
            redGlitch.style.opacity = '0';
            setTimeout(() => {
              redGlitch.style.opacity = '0.8';
            }, Math.random() * 30);
          }
        } else {
          // 通常状態に戻す
          redGlitch.style.transform = isMobile ? 'scale(0.6)' : 'scale(0.8)';
        }
      }, 100);
      
      // ノイズアニメーション
      let noisePos = 0;
      animationRefs.current.noiseAnim = setInterval(() => {
        noisePos += 1;
        noiseOverlay.style.backgroundPosition = `${noisePos % 100}px ${noisePos % 100}px`;
        
        // ランダムな不透明度変化
        if (Math.random() > 0.95) {
          noiseOverlay.style.opacity = (0.1 + Math.random() * 0.2).toString();
        }
      }, 50);
      
      // 紫のグリッチアニメーション - 強化版
      let purpleOffset = 0;
      animationRefs.current.purpleGlitchAnimation = setInterval(() => {
        // ランダムなグリッチ効果
        if (Math.random() > 0.7) {
          purpleOffset = Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 5;
          purpleGlitch.style.transform = isMobile ? 
            `scale(0.6) translate(${purpleOffset}px, 0)` : 
            `scale(0.8) translate(${purpleOffset}px, 0)`;
          
          // 瞬間的な表示/非表示
          if (Math.random() > 0.85) {
            purpleGlitch.style.opacity = '0';
            setTimeout(() => {
              purpleGlitch.style.opacity = '1';
            }, Math.random() * 50);
          }
        } else {
          // 通常状態に戻す
          purpleGlitch.style.transform = isMobile ? 'scale(0.6)' : 'scale(1)';
        }
      }, 200);
      
      // 注: 赤のグリッチオーバーレイは上で既に定義されているため、ここでの重複定義を削除
      
      // 要素を組み立ててDOMに挿入
      siteNameContainer.appendChild(mainText);
      siteNameContainer.appendChild(purpleGlitch);
      siteNameContainer.appendChild(redGlitch);
      effectContainer.appendChild(siteNameContainer);
      document.body.appendChild(effectContainer);
      
      console.log('直接DOM操作でサイト名エフェクトを挿入しました');
    }
    
    return () => {
      console.log('SiteTitleEffectコンポーネントがアンマウントされました');
      
      // アニメーションのクリア - refから安全に参照
      Object.values(animationRefs.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
      
      // refをリセット
      animationRefs.current = {
        glowAnimation: null,
        purpleGlitchAnimation: null,
        redGlitchAnim: null,
        noiseAnim: null
      };
      
      // DOM要素の削除
      const effectContainer = document.getElementById('direct-site-title-effect');
      if (effectContainer) {
        effectContainer.remove();
      }
    };
  }, [isMobile]);

  // アニメーションのキーフレームを定義するuseEffect
  useEffect(() => {
    // 既存のスタイル要素を削除
    const existingStyle = document.getElementById('site-title-effect-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // スタイル要素を作成
    const styleElement = document.createElement('style');
    styleElement.id = 'site-title-effect-styles';
    styleElement.setAttribute('data-priority', 'high');
    
    // キーフレームとスタイルを定義
    styleElement.innerHTML = `
      /* サイト名エフェクトのアニメーションキーフレーム */
      @keyframes textGlow {
        0% { text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff, 0 0 35px #00ffff, 0 0 40px #00ffff, 0 0 50px rgba(0, 255, 255, 0.7), 0 0 75px rgba(0, 255, 255, 0.5); }
        50% { text-shadow: 0 0 2px #00ffff, 0 0 5px #00ffff, 0 0 7px #00ffff, 0 0 10px #00ffff, 0 0 17px #00ffff, 0 0 20px #00ffff, 0 0 25px rgba(0, 255, 255, 0.7), 0 0 37px rgba(0, 255, 255, 0.5); }
        100% { text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff, 0 0 35px #00ffff, 0 0 40px #00ffff, 0 0 50px rgba(0, 255, 255, 0.7), 0 0 75px rgba(0, 255, 255, 0.5); }
      }

      @keyframes textFlicker {
        0% { opacity: 1; }
        3% { opacity: 0.8; }
        6% { opacity: 1; }
        7% { opacity: 0.4; }
        8% { opacity: 1; }
        9% { opacity: 0.9; }
        10% { opacity: 0.7; }
        20% { opacity: 1; }
        50% { opacity: 0.9; }
        70% { opacity: 1; }
        73% { opacity: 0.5; }
        75% { opacity: 1; }
        100% { opacity: 1; }
      }

      @keyframes textBroken {
        0% { transform: skewX(0); }
        1% { transform: skewX(3deg); }
        2% { transform: skewX(0); }
        3% { transform: skewX(-3deg); }
        4% { transform: skewX(0); }
        5% { transform: skewX(2deg); }
        6% { transform: skewX(0); }
        50% { transform: skewX(0); }
        51% { transform: skewX(2deg); }
        52% { transform: skewX(0); }
        53% { transform: skewX(-2deg); }
        54% { transform: skewX(0); }
        55% { transform: skewX(1deg); }
        56% { transform: skewX(0); }
        100% { transform: skewX(0); }
      }

      @keyframes glitchEffect {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
      }

      @keyframes glitchEffect2 {
        0% { transform: translate(0); }
        20% { transform: translate(2px, -2px); }
        40% { transform: translate(2px, 2px); }
        60% { transform: translate(-2px, -2px); }
        80% { transform: translate(-2px, 2px); }
        100% { transform: translate(0); }
      }

      @keyframes noiseShift {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(0); }
        75% { transform: translateX(5px); }
        100% { transform: translateX(0); }
      }

      @keyframes horizontalGlitch {
        0% { transform: translateX(-100%); opacity: 0.5; }
        50% { transform: translateX(100%); opacity: 0.2; }
        100% { transform: translateX(-100%); opacity: 0.5; }
      }
    `;
    
    // スタイル要素をドキュメントに追加
    document.head.appendChild(styleElement);
    
    // スタイルが正常に注入されたことを記録
    setIsStyleInjected(true);
    console.log('Site title effect styles injected successfully');
    
    // クリーンアップ関数
    return () => {
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
        setIsStyleInjected(false);
      }
    };
  }, []);

  // メインテキストのスタイル
  const mainTextStyle: React.CSSProperties = {
    fontFamily: '"VT323", "Courier New", monospace',
    color: '#ffffff',
    textShadow: 
      '0 0 5px #00ffff, ' + 
      '0 0 10px #00ffff, ' + 
      '0 0 15px #00ffff, ' + 
      '0 0 20px #00ffff, ' + 
      '0 0 35px #00ffff, ' + 
      '0 0 40px #00ffff, ' + 
      '0 0 50px rgba(0, 255, 255, 0.7), ' + 
      '0 0 75px rgba(0, 255, 255, 0.5)',
    position: 'relative',
    letterSpacing: isMobile ? '0.05em' : '0.15em',
    padding: '0.5em 0.8em',
    WebkitTextStroke: '1px rgba(0, 255, 255, 0.9)',
    fontWeight: 'bold',
    mixBlendMode: 'screen',
    filter: 'blur(0.7px)',
    zIndex: 100,
    display: 'block',
    opacity: 1,
    visibility: 'visible',
    fontSize: isMobile ? 'clamp(0.7rem, 3vw, 1.2rem)' : 'clamp(1.8rem, 5vw, 2.8rem)',
    transform: isMobile ? 'scale(0.6)' : 'scale(1)',
    animation: 'textGlow 2s infinite, textFlicker 5s infinite, textBroken 8s infinite'
  };

  // 紫のグリッチオーバーレイのスタイル
  const purpleGlitchStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    color: 'rgba(255, 0, 255, 0.8)',
    textShadow: '2px 0 rgba(255, 0, 255, 0.8), -2px 0 rgba(0, 255, 255, 0.8)',
    zIndex: 5,
    fontWeight: 'bold',
    fontFamily: '"VT323", "Courier New", monospace',
    fontSize: isMobile ? 'clamp(0.7rem, 3vw, 1.2rem)' : 'clamp(1.8rem, 5vw, 2.8rem)',
    transform: isMobile ? 'scale(0.6)' : 'scale(1)',
    letterSpacing: isMobile ? '0.05em' : '0.15em',
    padding: '0.5em 0.8em',
    pointerEvents: 'none',
    animation: 'glitchEffect 4s infinite alternate-reverse'
  };

  // 赤のグリッチオーバーレイのスタイル
  const redGlitchStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    color: 'rgba(255, 0, 0, 0.8)',
    textShadow: '-2px 0 rgba(255, 0, 0, 0.8), 2px 0 rgba(0, 255, 255, 0.8)',
    zIndex: 4,
    fontWeight: 'bold',
    fontFamily: '"VT323", "Courier New", monospace',
    fontSize: isMobile ? 'clamp(0.7rem, 3vw, 1.2rem)' : 'clamp(1.8rem, 5vw, 2.8rem)',
    transform: isMobile ? 'scale(0.6)' : 'scale(1)',
    letterSpacing: isMobile ? '0.05em' : '0.15em',
    padding: '0.5em 0.8em',
    pointerEvents: 'none',
    animation: 'glitchEffect2 4.5s infinite alternate-reverse'
  };

  // ノイズオーバーレイのスタイル
  const noiseOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
    opacity: 0.05,
    mixBlendMode: 'overlay',
    pointerEvents: 'none',
    zIndex: 3,
    animation: 'noiseShift 3s infinite linear'
  };

  // 水平グリッチラインのスタイル
  const horizontalGlitchStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '100%',
    height: '2px',
    backgroundColor: 'rgba(0, 255, 255, 0.8)',
    zIndex: 6,
    pointerEvents: 'none',
    animation: 'horizontalGlitch 7s infinite linear'
  };

  // 2つ目の水平グリッチラインのスタイル
  const horizontalGlitch2Style: React.CSSProperties = {
    ...horizontalGlitchStyle,
    top: '30%',
    animation: 'horizontalGlitch 5s infinite linear',
    animationDelay: '2.5s'
  };

  // コンテナのスタイル
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 1000
  };

  // 内部コンテナのスタイル
  const innerContainerStyle: React.CSSProperties = {
    position: 'relative',
    padding: '10px',
    textAlign: 'center',
    width: 'auto',
    pointerEvents: 'none'
  };

  // デバッグモードのスタイル
  const debugContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#00ff00',
    padding: '10px',
    borderRadius: '5px',
    zIndex: 2000,
    fontFamily: 'monospace',
    fontSize: '12px',
    maxWidth: '300px',
    display: debugMode ? 'block' : 'none'
  };

  return (
    <>
      <div style={containerStyle}>
        <div style={innerContainerStyle}>
          {/* メインサイト名テキスト */}
          <div style={mainTextStyle} id="main-site-title">
            gomix666.com
          </div>
          
          {/* 紫のグリッチオーバーレイ */}
          <div style={purpleGlitchStyle} id="purple-glitch-overlay">
            gomix666.com
          </div>
          
          {/* 赤のグリッチオーバーレイ */}
          <div style={redGlitchStyle} id="red-glitch-overlay">
            gomix666.com
          </div>
          
          {/* ノイズオーバーレイ */}
          <div style={noiseOverlayStyle} id="noise-overlay"></div>
          
          {/* 水平グリッチライン */}
          <div style={horizontalGlitchStyle} id="horizontal-glitch-1"></div>
          <div style={horizontalGlitch2Style} id="horizontal-glitch-2"></div>
        </div>
      </div>

      {/* デバッグ情報表示 */}
      <div style={debugContainerStyle}>
        <div>Debug Mode: ACTIVE (Ctrl+D to toggle)</div>
        <div>Styles Injected: {isStyleInjected ? '✅' : '❌'}</div>
        <div>Mobile Mode: {isMobile ? '✅' : '❌'}</div>
        <div>Z-Index: {containerStyle.zIndex}</div>
        <div>Elements:</div>
        <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
          <li>Main Text</li>
          <li>Purple Glitch</li>
          <li>Red Glitch</li>
          <li>Noise Overlay</li>
          <li>Horizontal Lines (2)</li>
        </ul>
        <div style={{ fontSize: '10px', marginTop: '5px' }}>
          If animations aren't visible, check browser console for errors
        </div>
      </div>
    </>
  );
};

export default SiteTitleEffect;
