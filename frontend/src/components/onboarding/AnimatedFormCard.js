// components/onboarding/AnimatedFormCard.js
'use client';
import { useEffect, useRef, useState } from 'react';

export default function AnimatedFormCard({ 
  title, 
  subtitle, 
  icon,
  stepNumber,
  isActive = true,
  onClick 
}) {
  const cardRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    if (!isActive) return;
    
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 3;
    const rotateX = ((centerY - y) / centerY) * 3;

    card.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
      scale3d(1.02, 1.02, 1.02)
    `;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
  };

  const handleClick = () => {
    if (isActive && onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`
        relative bg-gradient-to-br from-gray-900 to-black
        rounded-2xl border-2 border-gray-700 p-6 shadow-2xl backdrop-blur-sm
        transition-all duration-300 ease-out overflow-hidden
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${isActive ? 'cursor-pointer hover:border-emerald-500' : 'cursor-default'}
        w-full max-w-sm mx-auto
      `}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease, opacity 0.6s ease, border-color 0.3s ease',
        height: '240px',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
      }}
    >
      {/* Card Header - Clean and spaced */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">GX</span>
          </div>
          <div className="text-white text-sm font-bold">GreenXchange</div>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs px-2 py-1 rounded-full font-bold">
          STEP {stepNumber}
        </div>
      </div>

      {/* Main Content Area - Clear and centered */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <span className="text-2xl text-emerald-400">{icon}</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 leading-tight">{title}</h2>
        <p className="text-gray-400 text-sm leading-relaxed">{subtitle}</p>
      </div>

      {/* Action Button - Clear call to action */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold text-sm">
          <span>Click to Start</span>
          <span className="text-lg">→</span>
        </div>
      </div>

      {/* Visual Elements - Non-interfering */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-gray-500 text-xs">Ready</span>
      </div>

      {/* Card Number - Moved to bottom right and smaller */}
      <div className="absolute bottom-4 right-4">
        <div className="text-gray-600 text-xs font-mono">•••• 2024</div>
      </div>

      {/* Shine Effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          transform: `translateX(${mousePosition.x - 150}px) translateY(${mousePosition.y - 150}px)`,
        }}
      />
    </div>
  );
}