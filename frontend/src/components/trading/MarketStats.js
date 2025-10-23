// components/trading/MarketStats.js
'use client';
import { useState, useEffect } from 'react';

export default function MarketStats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Mock market data
    const mockStats = {
      volume: '2.4M',
      change: '+2.45%',
      changeType: 'positive',
      marketCap: '45.2M',
      activeOrders: '1,247',
      liquidity: 'High',
      high: '96.20',
      low: '94.80',
      spread: '0.50'
    };
    setStats(mockStats);
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Market Statistics</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-gray-400 text-xs mb-1">24h Volume</div>
          <div className="text-white font-semibold text-sm">${stats.volume}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-gray-400 text-xs mb-1">24h Change</div>
          <div className={`font-semibold text-sm ${
            stats.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
          }`}>
            {stats.change}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-gray-400 text-xs mb-1">Market Cap</div>
          <div className="text-white font-semibold text-sm">${stats.marketCap}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-gray-400 text-xs mb-1">Active Orders</div>
          <div className="text-white font-semibold text-sm">{stats.activeOrders}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-gray-400 text-xs mb-1">Liquidity</div>
          <div className="text-green-400 font-semibold text-sm">{stats.liquidity}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-gray-400 text-xs mb-1">24h High</div>
          <div className="text-white font-semibold text-sm">${stats.high}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-gray-400 text-xs mb-1">24h Low</div>
          <div className="text-white font-semibold text-sm">${stats.low}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-gray-400 text-xs mb-1">Spread</div>
          <div className="text-yellow-400 font-semibold text-sm">{stats.spread}</div>
        </div>
      </div>
    </div>
  );
}