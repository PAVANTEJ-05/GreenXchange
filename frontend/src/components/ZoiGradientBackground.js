// components/ZoiGradientBackground.js - SIMPLIFIED
'use client';
import { useEffect, useRef } from 'react';

export default function ZoiGradientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // ZOI's exact colors
    const colors = [
      { r: 0, g: 255, b: 136 },    // #00ff88
      { r: 59, g: 130, b: 246 },   // #3b82f6
      { r: 139, g: 92, b: 246 },   // #8b5cf6
      { r: 6, g: 182, b: 212 },    // #06b6d4
    ];

    // Create gradient mesh
    const points = [];
    const cols = 6;
    const rows = 6;
    
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        points.push({
          x: (i / cols) * canvas.width,
          y: (j / rows) * canvas.height,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    let animationFrame;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Clear with dark background
      ctx.fillStyle = '#000814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gradient mesh
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const topLeft = points[i * (rows + 1) + j];
          const topRight = points[(i + 1) * (rows + 1) + j];
          const bottomLeft = points[i * (rows + 1) + (j + 1)];

          const gradient = ctx.createLinearGradient(
            topLeft.x, topLeft.y,
            topRight.x, bottomLeft.y
          );

          gradient.addColorStop(0, `rgba(${topLeft.color.r}, ${topLeft.color.g}, ${topLeft.color.b}, 0.2)`);
          gradient.addColorStop(1, `rgba(${topRight.color.r}, ${topRight.color.g}, ${topRight.color.b}, 0.1)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(topLeft.x, topLeft.y);
          ctx.lineTo(topRight.x, topRight.y);
          ctx.lineTo(bottomLeft.x, bottomLeft.y);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Animate points
      points.forEach(point => {
        point.x += Math.sin(time + point.x * 0.01) * 0.3;
        point.y += Math.cos(time + point.y * 0.01) * 0.3;
        
        // Keep within bounds
        if (point.x < 0) point.x = canvas.width;
        if (point.x > canvas.width) point.x = 0;
        if (point.y < 0) point.y = canvas.height;
        if (point.y > canvas.height) point.y = 0;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}