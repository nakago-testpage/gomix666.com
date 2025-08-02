import React from 'react';
import styles from './SimpleTitleEffect.module.css';

interface SimpleTitleEffectProps {
  isMobile?: boolean;
}

const SimpleTitleEffect: React.FC<SimpleTitleEffectProps> = ({ isMobile = false }) => {
  return (
    <div className={styles.container}>
      {/* メインテキスト */}
      <div className={`${styles.mainText} ${isMobile ? styles.mobile : ''}`}>
        gomix666.com
      </div>
      
      {/* グリッチエフェクト - 赤 */}
      <div className={`${styles.glitchText} ${styles.redGlitch} ${isMobile ? styles.mobile : ''}`}>
        gomix666.com
      </div>
      
      {/* グリッチエフェクト - 青 */}
      <div className={`${styles.glitchText} ${styles.blueGlitch} ${isMobile ? styles.mobile : ''}`}>
        gomix666.com
      </div>
      
      {/* ノイズオーバーレイ */}
      <div className={styles.noiseOverlay}></div>
      
      {/* 水平グリッチライン */}
      <div className={styles.horizontalGlitch}></div>
    </div>
  );
};

export default SimpleTitleEffect;
