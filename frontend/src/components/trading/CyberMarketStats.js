// components/trading/CyberMarketStats.js
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CyberMarketStats() {
  const [stats, setStats] = useState({});
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats({
        volume: (2.4 + Math.random() * 0.5).toFixed(1) + 'M',
        change: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 3).toFixed(2) + '%',
        changeType: Math.random() > 0.5 ? 'positive' : 'negative',
        marketCap: (45.2 + Math.random() * 2).toFixed(1) + 'M',
        activeOrders: Math.floor(1247 + Math.random() * 100),
        liquidity: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
        high: (96.2 + Math.random() * 0.5).toFixed(2),
        low: (94.8 - Math.random() * 0.5).toFixed(2),
        spread: (0.5 + Math.random() * 0.2).toFixed(2)
      });
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { key: 'volume', label: '24h Volume', color: 'cyan', prefix: '$' },
    { key: 'change', label: '24h Change', color: stats.changeType === 'positive' ? 'green' : 'red' },
    { key: 'marketCap', label: 'Market Cap', color: 'purple', prefix: '$' },
    { key: 'activeOrders', label: 'Active Orders', color: 'blue' },
    { key: 'liquidity', label: 'Liquidity', color: 'green' },
    { key: 'high', label: '24h High', color: 'green', prefix: '$' },
    { key: 'low', label: '24h Low', color: 'red', prefix: '$' },
    { key: 'spread', label: 'Spread', color: 'yellow' }
  ];

  const getColorClass = (color) => {
    const colors = {
      cyan: 'from-cyan-500 to-blue-500',
      green: 'from-green-500 to-emerald-500',
      red: 'from-red-500 to-pink-500',
      purple: 'from-purple-500 to-indigo-500',
      blue: 'from-blue-500 to-cyan-500',
      yellow: 'from-yellow-500 to-orange-500'
    };
    return colors[color] || colors.cyan;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse-slow" />
      
      <div className="relative z-10">
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-bold text-white">Market Pulse</h3>
          <motion.div
            animate={{ 
              scale: pulse ? [1, 1.1, 1] : 1,
              color: pulse ? ['#00ff88', '#0088ff', '#00ff88'] : '#00ff88'
            }}
            transition={{ duration: 0.5 }}
            className="text-green-400 text-sm font-mono"
          >
            LIVE
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`bg-gradient-to-br ${getColorClass(stat.color)}/10 backdrop-blur-sm rounded-xl p-3 border ${
                stat.color === 'green' ? 'border-green-500/20 hover:border-green-500/40' :
                stat.color === 'red' ? 'border-red-500/20 hover:border-red-500/40' :
                stat.color === 'cyan' ? 'border-cyan-500/20 hover:border-cyan-500/40' :
                stat.color === 'purple' ? 'border-purple-500/20 hover:border-purple-500/40' :
                stat.color === 'blue' ? 'border-blue-500/20 hover:border-blue-500/40' :
                'border-yellow-500/20 hover:border-yellow-500/40'
              } transition-all group`}
            >
              <div className="text-xs text-gray-400 mb-1 group-hover:text-white transition-colors">
                {stat.label}
              </div>
              <motion.div 
                className={`text-sm font-bold font-mono ${
                  stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'red' ? 'text-red-400' :
                  stat.color === 'cyan' ? 'text-cyan-400' :
                  stat.color === 'purple' ? 'text-purple-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  'text-yellow-400'
                }`}
                key={stats[stat.key]}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {stat.prefix}{stats[stat.key]}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Market Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-4 pt-4 border-t border-gray-700/50"
        >
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Market Status</span>
            <motion.span 
              className="text-green-400 font-mono flex items-center space-x-1"
              animate={{ 
                textShadow: ['0 0 5px #00ff88', '0 0 15px #00ff88', '0 0 5px #00ff88']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
              <span>BULLISH TREND</span>
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}