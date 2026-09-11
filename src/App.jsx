import { useEffect } from 'react';
import Navbar from './components/Navbar';
import { ActiveBackground } from './components/backgrounds';
import { applyThemeToRoot } from './config/theme';
import Home from './pages/Home';
import Project1 from './pages/Project1';
import Project2 from './pages/Project2';
import Project3 from './pages/Project3';
import Project4 from './pages/Project4';

export default function App() {
  useEffect(() => {
    // 統一將 src/config/theme.js 中的所有色彩與煙霧參數注入至 CSS :root
    applyThemeToRoot();
  }, []);

  return (
    <>
      {/* 動態煙霧背景層（參數與色彩統一於 src/config/theme.js 調整） */}
      <ActiveBackground />

      <Navbar />
      <main>
        <Home />
        <Project1 />
        <Project2 />
        <Project3 />
        <Project4 />
      </main>
    </>
  );
}