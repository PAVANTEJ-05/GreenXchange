// components/ui/HeroSection.js
'use client';
import { useEffect, useState } from 'react';
import { getMarketData } from '@/utils/marketData';

export default function HeroSection() {
  const [stats, setStats] = useState({
    totalVolume: 'Loading...',
    activeProjects: 'Loading...',
    creditsTraded: 'Loading...'
  });

  useEffect(() => {
    const marketData = getMarketData();
    setStats(marketData.stats);
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Green Credit Marketplace
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Trade Verified Environmental Credits on Blockchain
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.totalVolume}</div>
            <div className="text-sm opacity-90">Total Volume</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <div className="text-sm opacity-90">Active Projects</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.creditsTraded}</div>
            <div className="text-sm opacity-90">Credits Traded</div>
          </div>
        </div>
      </div>
    </div>
  );
}