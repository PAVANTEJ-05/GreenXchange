// components/portfolio/CreditHoldings.js
'use client';
import { useState } from 'react';

export default function CreditHoldings() {
  const [holdings, setHoldings] = useState([
    {
      id: 1,
      project: "Rajasthan Solar Park",
      type: "Solar Energy",
      credits: 1250,
      value: 106250,
      price: 85.00,
      status: "Active",
      vintage: 2024,
      verified: true,
      change: 2.3
    },
    {
      id: 2,
      project: "Himalayan Wind Farm",
      type: "Wind Energy",
      credits: 850,
      value: 67065,
      price: 78.90,
      status: "Active",
      vintage: 2024,
      verified: true,
      change: 1.8
    },
    {
      id: 3,
      project: "Ganges Hydro Project",
      type: "Hydroelectric",
      credits: 450,
      value: 31500,
      price: 70.00,
      status: "Pending",
      vintage: 2024,
      verified: false,
      change: 0.9
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30';
      case 'Pending': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'Retired': return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Solar Energy': return '☀️';
      case 'Wind Energy': return '💨';
      case 'Hydroelectric': return '💧';
      case 'Biomass': return '🌿';
      default: return '⚡';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Your Credit Holdings</h3>
        <div className="flex space-x-2">
          <button className="bg-gray-800 text-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-gray-700 transition-colors">
            Filter
          </button>
          <button className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-sm border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
            Add Credits
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {holdings.map(holding => (
          <div key={holding.id} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center justify-between">
              {/* Project Info */}
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">{getTypeIcon(holding.type)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-white font-semibold">{holding.project}</h4>
                    {holding.verified && (
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full border border-emerald-500/30">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{holding.type} • Vintage {holding.vintage}</p>
                </div>
              </div>

              {/* Credit Details */}
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2 mb-1">
                  <p className="text-white font-bold text-lg">{holding.credits.toLocaleString()}</p>
                  <span className="text-gray-400 text-sm">credits</span>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <p className="text-emerald-400 font-semibold">${holding.value.toLocaleString()}</p>
                  <span className={`text-xs ${holding.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {holding.change >= 0 ? '↗' : '↘'} {Math.abs(holding.change)}%
                  </span>
                </div>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs mt-1 border ${getStatusColor(holding.status)}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                  <span>{holding.status}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-700">
              <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                View Details
              </button>
              <button className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                Trade
              </button>
              {holding.status === 'Active' && (
                <button className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg text-sm border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors">
                  Retire
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Portfolio Total</p>
            <p className="text-2xl font-bold text-white">2,450 credits</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Total Value</p>
            <p className="text-2xl font-bold text-emerald-400">$204,815</p>
          </div>
        </div>
      </div>
    </div>
  );
}