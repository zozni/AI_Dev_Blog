import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';
import './App.css';

function App() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorDotPos, setCursorDotPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // 🆕 배경 텍스트용

  // 커서 이동 추적
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setTimeout(() => {
        setCursorDotPos({ x: e.clientX, y: e.clientY });
      }, 50);

      // 🆕 배경 텍스트 패럴랙스 (마우스 위치 기반)
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 타이핑 효과 (기존 코드 유지)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        e.target.classList.add('typing-active');
        setTimeout(() => {
          e.target.classList.remove('typing-active');
        }, 600);
        createConfetti(e.clientX || cursorPos.x, e.clientY || cursorPos.y);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [cursorPos]);

  // 클릭 폭죽 효과 (기존 코드 유지)
  useEffect(() => {
    const handleClick = (e) => {
      createFirework(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // 팡파레 함수 (기존 코드 유지)
  const createConfetti = (x, y) => {
    const colors = ['#00d9ff', '#00ff88', '#a855f7', '#ec4899', '#f97316', '#eab308'];
    const particleCount = 5;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const velocity = 50 + Math.random() * 50;
      particle.style.setProperty('--x', `${Math.cos(angle) * velocity}px`);
      particle.style.setProperty('--y', `${Math.sin(angle) * velocity}px`);

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  };

  // 폭죽 함수 (기존 코드 유지)
  const createFirework = (x, y) => {
    const colors = ['#00d9ff', '#00ff88', '#a855f7', '#ec4899', '#f97316', '#eab308'];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = (i / particleCount) * 360 * (Math.PI / 180);
      const velocity = 100 + Math.random() * 50;
      particle.style.setProperty('--x', `${Math.cos(angle) * velocity}px`);
      particle.style.setProperty('--y', `${Math.sin(angle) * velocity}px`);

      const size = 6 + Math.random() * 6;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1200);
    }

    const burst = document.createElement('div');
    burst.className = 'firework-burst';
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 600);
  };

  return (
    <Router>
      <div className="App">
        {/* 🆕 배경 타이포그래피 */}
        <div 
          className="floating-typography parallax"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))`
          }}
        >
          AI DEV
        </div>

        {/* 커스텀 커서 */}
        <div className="custom-cursor">
          <div 
            className="cursor-dot" 
            style={{ 
              left: `${cursorDotPos.x}px`, 
              top: `${cursorDotPos.y}px` 
            }}
          />
          <div 
            className="cursor-pointer" 
            style={{ 
              left: `${cursorPos.x}px`, 
              top: `${cursorPos.y}px` 
            }}
          />
        </div>

        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/create" element={<PostForm />} />
          <Route path="/edit/:id" element={<PostForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;