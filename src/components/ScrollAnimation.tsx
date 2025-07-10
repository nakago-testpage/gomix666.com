'use client';

import { useEffect } from 'react';

export default function ScrollAnimation() {
  useEffect(() => {
    // スクロールアニメーション用のIntersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 要素が画面内に入ったらvisibleクラスを追加
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        root: null, // ビューポートをルートとして使用
        rootMargin: '0px',
        threshold: 0.1, // 10%が見えたら発火
      }
    );

    // scroll-fade-inクラスを持つすべての要素を監視
    const elements = document.querySelectorAll('.scroll-fade-in');
    elements.forEach((el) => observer.observe(el));

    // クリーンアップ関数
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return null; // このコンポーネントは何もレンダリングしない
}
