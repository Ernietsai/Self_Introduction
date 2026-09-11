/**
 * =========================================================================
 * 🎨 Global Theme Configuration (全局色彩與主題統一配置)
 * =========================================================================
 * You can adjust all colors (Text, Smoke, Navbar) here in one place.
 * 所有文字顏色、煙霧顏色與導覽列色彩皆可在此統一修改，無需更動多個檔案。
 */

export const themeConfig = {
  // 🌫️ 煙霧動態背景配置 (Dynamic Smoke / Mist Settings)
  smoke: {
    density: 0.6, // 濃度倍率：0.1 (淡薄) ~ 1.0 (厚實濃郁)
    backgroundDark: '#07030e', // 網站最底層深色基底
    primaryPurple: 'rgba(147, 51, 234, 0.7)', // 核心紫霧 (Cloud 1)
    secondaryNeon: 'rgba(192, 132, 252, 0.65)', // 亮紫/洋紅光 (Cloud 2)
    cosmicIndigo: 'rgba(126, 34, 206, 0.6)', // 宇宙藍紫 (Cloud 3)
    lavenderAura: 'rgba(216, 180, 254, 0.5)', // 薰衣草光暈 (Cloud 4)
  },

  // ✍️ 頁面文字顏色 (Page Typography Colors)
  typography: {
    heading: '#ffffff', // 各頁面大標題 (h1, h2) 顏色
    body: '#d8b4fe', // 各頁面內文 (Editing...) 顏色
    subtext: 'rgba(255, 255, 255, 0.65)', // 輔助小字顏色
  },

  // 🍎 Apple Liquid Glass 標籤欄配置 (Navbar Capsule Settings)
  navbar: {
    textActive: '#ffffff', // 當前選中 / 滑鼠懸停 時的文字顏色 (白色)
    textInactive: 'rgba(255, 255, 255, 0.55)', // 未選中時的文字顏色 (灰色)
    capsuleBg: 'rgba(255, 255, 255, 0.04)', // 外部標籤列膠囊玻璃底色（提高透明度）
    capsuleBorder: 'rgba(255, 255, 255, 0.12)', // 外部標籤列邊框高光
    indicatorBg: 'rgba(255, 255, 255, 0.09)', // 內部滑動標籤膠囊底色（提高透明度）
    indicatorBorder: 'rgba(255, 255, 255, 0.22)', // 內部滑動標籤膠囊高光
    indicatorGlow: 'rgba(192, 132, 252, 0.18)', // 標籤膠囊外發光微暈
  },
};

/**
 * 將主題配置自動注入至 DOM 的 :root CSS 變數中
 */
export function applyThemeToRoot(config = themeConfig) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Typography
  root.style.setProperty('--theme-text-heading', config.typography.heading);
  root.style.setProperty('--theme-text-body', config.typography.body);
  root.style.setProperty('--theme-text-subtext', config.typography.subtext);

  // Navbar
  root.style.setProperty('--theme-nav-text-active', config.navbar.textActive);
  root.style.setProperty('--theme-nav-text-inactive', config.navbar.textInactive);
  root.style.setProperty('--theme-nav-capsule-bg', config.navbar.capsuleBg);
  root.style.setProperty('--theme-nav-capsule-border', config.navbar.capsuleBorder);
  root.style.setProperty('--theme-nav-indicator-bg', config.navbar.indicatorBg);
  root.style.setProperty('--theme-nav-indicator-border', config.navbar.indicatorBorder);
  root.style.setProperty('--theme-nav-indicator-glow', config.navbar.indicatorGlow);

  // Smoke
  root.style.setProperty('--theme-smoke-density', config.smoke.density);
  root.style.setProperty('--theme-smoke-bg', config.smoke.backgroundDark);
  root.style.setProperty('--theme-smoke-primary', config.smoke.primaryPurple);
  root.style.setProperty('--theme-smoke-secondary', config.smoke.secondaryNeon);
  root.style.setProperty('--theme-smoke-indigo', config.smoke.cosmicIndigo);
  root.style.setProperty('--theme-smoke-lavender', config.smoke.lavenderAura);
}

