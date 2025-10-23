// components/portfolio/PortfolioStats.js
'use client';
import { useState, useEffect } from 'react';

export default function PortfolioStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalValue: 173315,
        totalCredits: 2100,
        activeProjects: 2,
        monthlyGrowth: 12.5,
        portfolioDiversity: 78
      });
    }, 1000);
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Value */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Portfolio Value</p>
            <p className="text-2xl font-bold text-white">${stats.totalValue.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <span className="text-emerald-400 text-lg">💰</span>
          </div>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-emerald-400 text-sm">↑ {stats.monthlyGrowth}% this month</span>
        </div>
      </div>

      {/* Total Credits */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-xl p-4 border border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Credits</p>
            <p className="text-2xl font-bold text-white">{stats.totalCredits.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
            <span className="text-cyan-400 text-lg">🌿</span>
          </div>
        </div>
        <p className="text-cyan-400 text-sm mt-2">Active credits</p>
      </div>

      {/* Active Projects */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-4 border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Active Projects</p>
            <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
          </div>
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <span className="text-blue-400 text-lg">🏭</span>
          </div>
        </div>
        <p className="text-blue-400 text-sm mt-2">Generating credits</p>
      </div>

      {/* Portfolio Diversity */}
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Diversity Score</p>
            <p className="text-2xl font-bold text-white">{stats.portfolioDiversity}%</p>
          </div>
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <span className="text-purple-400 text-lg">📊</span>
          </div>
        </div>
        <p className="text-purple-400 text-sm mt-2">Well diversified</p>
      </div>

      {/* Monthly Impact */}
      <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl p-4 border border-orange-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">CO₂ Reduced</p>
            <p className="text-2xl font-bold text-white">2.4K</p>
          </div>
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <span className="text-orange-400 text-lg">🌍</span>
          </div>
        </div>
        <p className="text-orange-400 text-sm mt-2">Tons this month</p>
      </div>
    </div>
  );
}