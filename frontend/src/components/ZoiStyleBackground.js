'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ZoiStyleBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with ZOI's dark blue aesthetic
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000814, 0); // ZOI's deep navy background
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Create floating geometric shapes like ZOI
    const shapesGroup = new THREE.Group();
    
    // Main central orb (like ZOI's central light)
    const mainOrbGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const mainOrbMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88, // ZOI's teal color
      transparent: true,
      opacity: 0.1,
      wireframe: true
    });
    const mainOrb = new THREE.Mesh(mainOrbGeometry, mainOrbMaterial);
    shapesGroup.add(mainOrb);

    // Floating particles around central orb
    const particleCount = 150;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i += 3) {
      // Orbital distribution
      const radius = 2 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);

      // ZOI color palette - teals and cyans
      colorArray[i] = 0.0;     // R
      colorArray[i + 1] = 0.8 + Math.random() * 0.2; // G
      colorArray[i + 2] = 0.5 + Math.random() * 0.3; // B
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    shapesGroup.add(particles);

    // Floating geometric shapes (cubes, torus, etc.)
    const geometries = [
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
      new THREE.TorusGeometry(0.6, 0.2, 8, 16),
      new THREE.OctahedronGeometry(0.7),
      new THREE.ConeGeometry(0.5, 1, 8)
    ];

    geometries.forEach((geometry, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.1,
        wireframe: true
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      const angle = (index / geometries.length) * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      
      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * radius
      );
      
      mesh.userData = { 
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2 
      };
      shapesGroup.add(mesh);
    });

    scene.add(shapesGroup);

    // Light orbs in background (like ZOI's distant lights)
    const lightOrbs = new THREE.Group();
    for(let i = 0; i < 8; i++) {
      const geometry = new THREE.SphereGeometry(0.3, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.05
      });
      
      const orb = new THREE.Mesh(geometry, material);
      const angle = (i / 8) * Math.PI * 2;
      const radius = 8 + Math.random() * 3;
      
      orb.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * radius
      );
      
      lightOrbs.add(orb);
    }
    scene.add(lightOrbs);

    camera.position.z = 10;

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate main shapes
      shapesGroup.rotation.y = elapsedTime * 0.1;
      shapesGroup.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

      // Animate floating shapes
      shapesGroup.children.forEach((child, index) => {
        if (index > 1) { // Skip main orb and particles
          child.rotation.x = elapsedTime * child.userData.speed;
          child.rotation.y = elapsedTime * child.userData.speed * 0.7;
          child.position.y = Math.sin(elapsedTime * child.userData.speed + child.userData.offset) * 0.3;
        }
      });

      // Pulse main orb opacity
      mainOrbMaterial.opacity = 0.1 + Math.sin(elapsedTime * 0.5) * 0.05;

      // Rotate light orbs slowly
      lightOrbs.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}