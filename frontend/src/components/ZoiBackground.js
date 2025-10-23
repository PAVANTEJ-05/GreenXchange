'use client';
import { useEffect, useRef } from 'react';

export default function ZoiBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement tracking
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Color palette with black, white, and your blues
    const colors = [
      [10, 26, 42],     // #0A1A2A - Deep navy
      [16, 47, 68],     // #102F44 - Dark cyan-blue
      [28, 66, 92],     // #1C425C - Muted teal-blue
      [46, 86, 116],    // #2E5674 - Cool steel blue
      [60, 106, 138],   // #3C6A8A - Mid-blue highlight
      [5, 15, 25],      // #050F19 - Black touch
      [240, 240, 245, 0.1]  // White touch - very subtle
    ];

    // Current target colors for smooth transitions
    let currentColors = {
      main: [...colors[0]],
      secondary: [...colors[2]],
      accent: [...colors[4]],
      white: [...colors[6]]
    };

    let targetColors = {
      main: [...colors[1]],
      secondary: [...colors[3]],
      accent: [...colors[5]],
      white: [...colors[6]]
    };

    let colorProgress = 0;
    let time = 0;
    let animationFrameId;

    // Function to smoothly interpolate between colors
    const interpolateColor = (start, end, progress) => {
      return [
        start[0] + (end[0] - start[0]) * progress,
        start[1] + (end[1] - start[1]) * progress,
        start[2] + (end[2] - start[2]) * progress,
        start[3] !== undefined ? start[3] + ((end[3] || 0) - (start[3] || 0)) * progress : undefined
      ];
    };

    // Function to pick random target color
    const getRandomTargetColor = () => {
      const randomColor = [...colors[Math.floor(Math.random() * colors.length)]];
      return randomColor;
    };

    const animate = () => {
      time += 0.008;
      colorProgress += 0.012;
      
      // Smooth color transitions
      if (colorProgress >= 1) {
        colorProgress = 0;
        currentColors.main = [...targetColors.main];
        currentColors.secondary = [...targetColors.secondary];
        currentColors.accent = [...targetColors.accent];
        currentColors.white = [...targetColors.white];
        
        // Set new random targets
        targetColors.main = getRandomTargetColor();
        targetColors.secondary = getRandomTargetColor();
        targetColors.accent = getRandomTargetColor();
        targetColors.white = Math.random() > 0.7 ? [240, 240, 245, 0.08] : [240, 240, 245, 0.02];
      }

      // Interpolate current colors
      const mainColor = interpolateColor(currentColors.main, targetColors.main, colorProgress);
      const secondaryColor = interpolateColor(currentColors.secondary, targetColors.secondary, colorProgress);
      const accentColor = interpolateColor(currentColors.accent, targetColors.accent, colorProgress);
      const whiteColor = interpolateColor(currentColors.white, targetColors.white, colorProgress);

      // Clear with deep black background
      ctx.fillStyle = '#050F19';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Get mouse position
      const mouseX = mouseRef.current.x || canvas.width / 2;
      const mouseY = mouseRef.current.y || canvas.height / 2;

      // Main mouse-following gradient - VERY SMALL circle
      const gradient1 = ctx.createRadialGradient(
        mouseX + Math.sin(time) * 10, // Smaller movement
        mouseY + Math.cos(time * 0.9) * 8,
        0,
        mouseX,
        mouseY,
        Math.max(canvas.width, canvas.height) * 0.12 // Much smaller radius
      );

      gradient1.addColorStop(0, `rgba(${mainColor.slice(0, 3).join(',')}, 0.3)`);
      gradient1.addColorStop(0.4, `rgba(${secondaryColor.slice(0, 3).join(',')}, 0.15)`);
      gradient1.addColorStop(0.8, `rgba(${accentColor.slice(0, 3).join(',')}, 0.08)`);
      gradient1.addColorStop(1, 'rgba(5, 15, 25, 0)');

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // White touch gradient - very subtle
      const whiteGradient = ctx.createRadialGradient(
        mouseX + Math.cos(time * 1.2) * 10,
        mouseY + Math.sin(time * 1.1) * 8,
        0,
        mouseX,
        mouseY,
        Math.max(canvas.width, canvas.height) * 0.08 // Very small white circle
      );

      whiteGradient.addColorStop(0, `rgba(${whiteColor[0]}, ${whiteColor[1]}, ${whiteColor[2]}, ${whiteColor[3] || 0.05})`);
      whiteGradient.addColorStop(1, 'rgba(240, 240, 245, 0)');

      ctx.fillStyle = whiteGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Secondary gradient - background movement
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7 + Math.cos(time * 0.4) * 80,
        canvas.height * 0.3 + Math.sin(time * 0.5) * 60,
        0,
        canvas.width * 0.7,
        canvas.height * 0.3,
        Math.max(canvas.width, canvas.height) * 0.25
      );

      gradient2.addColorStop(0, `rgba(${secondaryColor.slice(0, 3).join(',')}, 0.15)`);
      gradient2.addColorStop(0.6, `rgba(${accentColor.slice(0, 3).join(',')}, 0.08)`);
      gradient2.addColorStop(1, 'rgba(5, 15, 25, 0)');

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Third gradient - flowing background
      const gradient3 = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(time * 0.6) * 100,
        canvas.height * 0.7 + Math.cos(time * 0.7) * 70,
        0,
        canvas.width * 0.3,
        canvas.height * 0.7,
        Math.max(canvas.width, canvas.height) * 0.3
      );

      gradient3.addColorStop(0, `rgba(${accentColor.slice(0, 3).join(',')}, 0.12)`);
      gradient3.addColorStop(0.7, `rgba(${mainColor.slice(0, 3).join(',')}, 0.06)`);
      gradient3.addColorStop(1, 'rgba(5, 15, 25, 0)');

      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ 
        width: '100vw', 
        height: '100vh',
        background: '#050F19'
      }}
    />
  );
}