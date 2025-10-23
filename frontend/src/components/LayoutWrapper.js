'use client';
import { useEffect, useState } from 'react';
import ZoiBackground from './ZoiBackground';

export default function LayoutWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Smooth ZOI Gradient Background - covers entire site */}
      <ZoiBackground />
      
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000814]">
          <div className="text-center">
            <div className="w-6 h-6 border border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="text-white text-sm tracking-widest">GREENXCHANGE</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {!isLoading && children}
      </div>
    </div>
  );
}