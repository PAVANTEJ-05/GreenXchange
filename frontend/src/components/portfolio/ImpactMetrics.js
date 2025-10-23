// components/portfolio/ImpactMetrics.js
'use client';
import { useState, useEffect } from 'react';

export default function ImpactMetrics() {
  const [impactData, setImpactData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setImpactData({
        co2Reduced: 2450, // tons
        equivalentCars: 523,
        treesPlanted: 12250,
        energyGenerated: 1250000, // kWh
        homesPowered: 114,
        waterSaved: 45000 // cubic meters
      });
    }, 1000);
  }, []);

  if (!impactData) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      icon: '🌍',
      value: impactData.co2Reduced.toLocaleString(),
      label: 'Tons CO₂ Reduced',
      description: 'Equivalent to taking cars off the road for a year',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: '🚗',
      value: impactData.equivalentCars.toLocaleString(),
      label: 'Cars Off Road',
      description: 'Annual emissions equivalent',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: '🌳',
      value: impactData.treesPlanted.toLocaleString(),
      label: 'Trees Equivalent',
      description: 'Carbon sequestration capacity',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '⚡',
      value: (impactData.energyGenerated / 1000).toLocaleString() + 'K',
      label: 'kWh Clean Energy',
      description: 'Renewable energy generated',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '🏠',
      value: impactData.homesPowered.toLocaleString(),
      label: 'Homes Powered',
      description: 'Annual electricity needs',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: '💧',
      value: (impactData.waterSaved / 1000).toLocaleString() + 'K',
      label: 'Cubic Meters Water',
      description: 'Water conservation',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6">
      <h3 className="text-xl font-bold text-white mb-2">Environmental Impact</h3>
      <p className="text-gray-400 text-sm mb-6">Your portfolio's positive environmental contribution</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                <span className="text-white text-lg">{metric.icon}</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-gray-300 text-sm font-medium">{metric.label}</div>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Impact Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20">
        <div className="text-center">
          <h4 className="text-white font-semibold mb-2">Your Positive Impact</h4>
          <p className="text-emerald-400 text-sm">
            Equivalent to planting a forest of {Math.round(impactData.treesPlanted / 100)} acres
          </p>
        </div>
      </div>
    </div>
  );
}