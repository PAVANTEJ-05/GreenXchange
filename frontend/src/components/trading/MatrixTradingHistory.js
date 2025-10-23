// src/app/marketplace/page.js
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import OrderBook from '@/components/trading/OrderBook';
import OrderForm from '@/components/trading/OrderForm';
import TradingHistory from '@/components/trading/TradingHistory';
import PriceChart from '@/components/trading/PriceChart';

export default function Marketplace() {
  const [selectedAsset, setSelectedAsset] = useState('GC-001');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%'] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ 
              backgroundSize: '200% auto'
            }}
          >
            QUANTUM TRADER
          </motion.h1>
          <motion.p 
            className="text-gray-300 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Next Generation Green Credit Trading Platform
          </motion.p>
        </motion.div>

        {/* Asset Selection */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center space-x-3 mb-8"
        >
          {['GC-001', 'GC-002', 'GC-003', 'GC-004'].map((asset, index) => (
            <motion.button
              key={asset}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                boxShadow: '0 10px 30px -5px rgba(0, 255, 136, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedAsset(asset)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-sm border ${
                selectedAsset === asset
                  ? 'bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow-2xl border-transparent'
                  : 'bg-gray-900/50 text-gray-300 border-gray-700/50 hover:border-cyan-500/50'
              }`}
            >
              {asset}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Trading Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Left Column */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <OrderBook asset={selectedAsset} />
          </motion.div>

          {/* Center Column */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <PriceChart asset={selectedAsset} />
            <OrderForm asset={selectedAsset} />
          </motion.div>

          {/* Right Column */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <TradingHistory asset={selectedAsset} />
            
            {/* Market Stats */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Market Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">24h Volume</div>
                  <div className="text-white font-semibold text-sm">$2.4M</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">24h Change</div>
                  <div className="text-green-400 font-semibold text-sm">+2.45%</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Market Cap</div>
                  <div className="text-white font-semibold text-sm">$45.2M</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Active Orders</div>
                  <div className="text-white font-semibold text-sm">1,247</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>Powered by Quantum Blockchain Technology • Real-time Market Data • Secure Trading</p>
        </motion.div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00ff88, #0088ff);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}