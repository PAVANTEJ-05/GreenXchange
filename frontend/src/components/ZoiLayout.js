'use client';
import { useEffect, useState } from 'react';
import ZoiGradientBackground from './ZoiGradientBackground';

export default function ZoiLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#000814]">
      {/* Exact ZOI gradient background */}
      <ZoiGradientBackground />
      
      {/* ZOI's gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#000814] via-transparent to-[#000814] pointer-events-none -z-5" />
      <div className="fixed inset-0 bg-gradient-to-t from-[#000814] via-transparent to-transparent pointer-events-none -z-5" />
      
      {/* ZOI loading animation */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000814]">
          <div className="text-center">
            <div className="w-6 h-6 border border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="text-white text-sm tracking-widest">LOADING</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {!isLoading && children}
      </div>
    </div>
  );
}