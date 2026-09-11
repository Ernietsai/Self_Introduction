import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'cat-mario', label: 'Cat Mario' },
  { id: 'galaxy-war', label: 'Galaxy War' },
  { id: 'starship-simulator', label: 'Starship Simulator' },
  { id: 'magic-ecology', label: 'Magic Ecology' },
];

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [buttonWidth, setButtonWidth] = useState(null);

  const controls = useAnimationControls();
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const isClickScrolling = useRef(false);
  const clickScrollTimeout = useRef(null);
  const buttonRefs = useRef([]);
  const textRefs = useRef([]);
  const isInitialized = useRef(false);

  // =========================================================================
  // 1. 測量所有標籤文字寬度，以最寬者決定所有按鈕的相同寬度
  // =========================================================================
  useEffect(() => {
    const calculateUniformWidth = () => {
      if (!textRefs.current.length) return;
      const textWidths = textRefs.current.map((el) => (el ? el.scrollWidth : 0));
      const maxTextWidth = Math.max(...textWidths);
      // 在最寬文字基礎上加上舒適的兩側內距（共約 36px）
      const uniform = Math.max(maxTextWidth + 36, 110);
      setButtonWidth(uniform);
    };

    calculateUniformWidth();
    if (document.fonts) {
      document.fonts.ready.then(calculateUniformWidth);
    }
    window.addEventListener('resize', calculateUniformWidth);
    return () => window.removeEventListener('resize', calculateUniformWidth);
  }, []);

  // =========================================================================
  // 2. 初始化與縮放時同步標籤膠囊位置
  // =========================================================================
  useEffect(() => {
    if (buttonWidth && buttonRefs.current[activeIndex]) {
      const activeEl = buttonRefs.current[activeIndex];
      controls.set({
        x: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        scaleY: 1,
      });
      isInitialized.current = true;
    }
  }, [buttonWidth, activeIndex, controls]);

  // =========================================================================
  // 3. 頁面滾動即時監聽（當使用者手動滾動頁面時平滑更新膠囊位置）
  // =========================================================================
  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrolling.current) return;

      const scrollPosition = window.scrollY + 180;
      let detectedIndex = 0;

      NAV_ITEMS.forEach((item, index) => {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            detectedIndex = index;
          }
        }
      });

      if (detectedIndex !== activeIndexRef.current) {
        setActiveIndex(detectedIndex);
        const targetEl = buttonRefs.current[detectedIndex];
        if (targetEl) {
          controls.start({
            x: targetEl.offsetLeft,
            width: targetEl.offsetWidth,
            scaleY: 1,
            transition: { duration: 0.32, ease: [0.25, 1, 0.35, 1] },
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  // =========================================================================
  // 4. 點擊標籤按鈕的核心物理流動邏輯：
  //    - 點擊當下標籤：標籤膠囊不動，頁面平滑捲動至頂端
  //    - 點擊其他標籤：
  //      * 立即向目標位置滑動（零延遲啟動）
  //      * 靠近目標側以較快速度移動，遠離目標側以較慢速度跟隨 -> 水平拉長
  //      * 高度略微變細 (scaleY 縮小)，呈現流體體積守恆感
  //      * 到達目的地前使用完全對稱的反向動畫：靠近目標側先抵達邊界減速，遠離側快速跟上收攏 -> 回復原寬度與高度
  // =========================================================================
  const handleNavClick = (targetIndex, targetId) => {
    const section = document.getElementById(targetId);
    if (!section) return;

    const targetScrollTop = Math.max(0, section.offsetTop - 75);
    const currentIdx = activeIndexRef.current;

    if (targetIndex === currentIdx) {
      // 點擊當下頁面：標籤膠囊完全不動，純滾動至頁面頂部
      window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
    } else {
      // 點擊其所不在的標籤：立即向目標位置滑動
      const currentEl = buttonRefs.current[currentIdx];
      const targetEl = buttonRefs.current[targetIndex];

      if (currentEl && targetEl) {
        const startLeft = currentEl.offsetLeft;
        const targetLeft = targetEl.offsetLeft;
        const baseWidth = targetEl.offsetWidth || buttonWidth;
        const delta = targetLeft - startLeft;
        const absDelta = Math.abs(delta);

        // 依據距離計算流體拉長量（上限為 baseWidth * 0.55）
        const stretch = Math.min(absDelta * 0.40, baseWidth * 0.55);
        // 高度依拉長程度變細，保持流體視覺拉伸感
        const minScaleY = Math.max(0.82, 1 - (stretch / baseWidth) * 0.28);
        const midScaleY = 1 - (1 - minScaleY) * 0.65;

        let keyframeX;
        let keyframeWidth;
        let keyframeScaleY;

        if (delta > 0) {
          // 向右滑動 (Moving Right):
          // 靠近目標側 (右邊界 R = x + width) 加速衝刺，遠離目標側 (左邊界 L = x) 慢速起步
          // 抵達前對稱：右邊界先抵達目標邊界減速，左邊界快速縮回 targetLeft
          keyframeX = [
            startLeft,
            startLeft + delta * 0.16, // 左側慢速起步
            startLeft + delta * 0.48, // 中段維持拉伸流動
            startLeft + delta * 0.82, // 左側快速追趕收攏
            targetLeft,               // 鎖定目標位置
          ];
          keyframeWidth = [
            baseWidth,
            baseWidth + stretch * 0.95, // 右側衝出，寬度顯著拉長
            baseWidth + stretch,        // 最大拉長峰值
            baseWidth + stretch * 0.35, // 對稱反向收縮
            baseWidth,                  // 回復原寬度
          ];
          keyframeScaleY = [1, minScaleY, minScaleY, midScaleY, 1];
        } else {
          // 向左滑動 (Moving Left):
          // 靠近目標側 (左邊界 L = x) 加速衝刺，遠離目標側 (右邊界 R = x + width) 慢速起步
          // 抵達前對稱：左邊界先抵達 targetLeft 減速，右邊界快速追上收攏
          keyframeX = [
            startLeft,
            startLeft + delta * 0.62, // 左側快速衝刺
            startLeft + delta * 0.78, // 左側先到達目標邊界
            startLeft + delta * 0.94, // 左側就位減速
            targetLeft,               // 鎖定目標位置
          ];
          keyframeWidth = [
            baseWidth,
            baseWidth + stretch * 0.95, // 右側落後，寬度顯著拉長
            baseWidth + stretch,        // 最大拉長峰值
            baseWidth + stretch * 0.35, // 對稱反向收縮
            baseWidth,                  // 回復原寬度
          ];
          keyframeScaleY = [1, minScaleY, minScaleY, midScaleY, 1];
        }

        // 立即向目標滑動（零延遲）
        controls.start({
          x: keyframeX,
          width: keyframeWidth,
          scaleY: keyframeScaleY,
          transition: {
            duration: 0.48,
            times: [0, 0.26, 0.52, 0.78, 1],
            ease: [0.25, 1, 0.35, 1],
          },
        });
      }

      setActiveIndex(targetIndex);

      // 鎖定滾動監聽，防止平滑滾動過程中途經其他區塊時被誤觸發
      isClickScrolling.current = true;
      if (clickScrollTimeout.current) clearTimeout(clickScrollTimeout.current);

      window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });

      clickScrollTimeout.current = setTimeout(() => {
        isClickScrolling.current = false;
      }, 750);
    }
  };

  return (
    <header className="navbar-viewport-wrapper">
      {/* 標籤列膠囊 (Apple Liquid Glass Capsule) */}
      <nav className="navbar-capsule" role="navigation" aria-label="Main Navigation">
        {/* 標籤膠囊 (圖層位於標籤列膠囊之上，文字之下) */}
        <motion.div
          className="navbar-indicator-pill"
          animate={controls}
          initial={false}
          style={{
            opacity: buttonWidth ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* 內部每個按鈕（等寬，視內部文字最寬者而定） */}
        {NAV_ITEMS.map((item, index) => {
          const isActive = activeIndex === index;
          const isHovered = hoveredIndex === index;

          return (
            <button
              key={item.id}
              ref={(el) => (buttonRefs.current[index] = el)}
              className={`navbar-btn ${isActive ? 'is-active' : ''} ${isHovered ? 'is-hovered' : ''}`}
              style={buttonWidth ? { width: `${buttonWidth}px` } : {}}
              onClick={() => handleNavClick(index, item.id)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              type="button"
            >
              <span ref={(el) => (textRefs.current[index] = el)}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}