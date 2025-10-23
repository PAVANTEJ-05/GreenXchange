// 'use client';
// import { useEffect, useRef } from 'react';

// export default function AnimatedBackground() {
//   const mountRef = useRef(null);
  
//   useEffect(() => {
//     if (!mountRef.current) return;

//     // Simple particle animation without Three.js
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     mountRef.current.appendChild(canvas);

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     const particles = [];
//     const particleCount = 100;

//     // Create particles
//     for (let i = 0; i < particleCount; i++) {
//       particles.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         size: Math.random() * 2 + 1,
//         speedX: (Math.random() - 0.5) * 0.5,
//         speedY: (Math.random() - 0.5) * 0.5,
//         color: i % 4 === 0 ? '#f59e0b' : // solar
//                i % 4 === 1 ? '#059669' : // carbon  
//                i % 4 === 2 ? '#3b82f6' : // energy
//                '#06b6d4' // water
//       });
//     }

//     function animate() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
      
//       // Update and draw particles
//       particles.forEach(particle => {
//         particle.x += particle.speedX;
//         particle.y += particle.speedY;

//         // Wrap around edges
//         if (particle.x < 0) particle.x = canvas.width;
//         if (particle.x > canvas.width) particle.x = 0;
//         if (particle.y < 0) particle.y = canvas.height;
//         if (particle.y > canvas.height) particle.y = 0;

//         // Draw particle
//         ctx.beginPath();
//         ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
//         ctx.fillStyle = particle.color;
//         ctx.globalAlpha = 0.6;
//         ctx.fill();
//       });

//       // Draw connecting lines
//       ctx.strokeStyle = '#10B981';
//       ctx.globalAlpha = 0.1;
//       ctx.lineWidth = 1;

//       for (let i = 0; i < particles.length; i++) {
//         for (let j = i + 1; j < particles.length; j++) {
//           const dx = particles[i].x - particles[j].x;
//           const dy = particles[i].y - particles[j].y;
//           const distance = Math.sqrt(dx * dx + dy * dy);

//           if (distance < 100) {
//             ctx.beginPath();
//             ctx.moveTo(particles[i].x, particles[i].y);
//             ctx.lineTo(particles[j].x, particles[j].y);
//             ctx.stroke();
//           }
//         }
//       }

//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (mountRef.current && canvas.parentNode) {
//         mountRef.current.removeChild(canvas);
//       }
//     };
//   }, []);

//   return <div ref={mountRef} className="three-bg-container" />;
// }