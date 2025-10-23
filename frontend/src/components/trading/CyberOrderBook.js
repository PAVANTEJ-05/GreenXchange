// components/trading/CyberOrderBook.js
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CyberOrderBook({ asset }) {
  const [orders, setOrders] = useState({ bids: [], asks: [] });
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const generateOrders = () => {
      const bids = [];
      const asks = [];
      
      for (let i = 0; i < 8; i++) {
        const bidPrice = 95.50 - i * 0.25;
        const askPrice = 96.00 + i * 0.25;
        
        bids.push({
          price: bidPrice,
          quantity: Math.floor(Math.random() * 200) + 50,
          total: 0,
          id: `bid-${i}`
        });
        
        asks.push({
          price: askPrice,
          quantity: Math.floor(Math.random() * 200) + 50,
          total: 0,
          id: `ask-${i}`
        });
      }
      
      setOrders({ bids, asks });
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    };

    generateOrders();
    const interval = setInterval(generateOrders, 3000);
    return () => clearInterval(interval);
  }, [asset]);

  const OrderRow = ({ order, type, index }) => (
    <motion.div
      initial={{ opacity: 0, x: type === 'bids' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex justify-between p-3 text-sm rounded-lg mb-1 border-l-4 ${
        type === 'bids' 
          ? 'border-l-green-400 bg-green-400/10' 
          : 'border-l-red-400 bg-red-400/10'
      } hover:bg-gray-700/30 transition-all duration-200 group`}
    >
      <span className={`font-mono ${
        type === 'bids' ? 'text-green-300' : 'text-red-300'
      } group-hover:scale-105 transition-transform`}>
        {order.price.toFixed(2)}
      </span>
      <span className="font-mono text-gray-300">{order.quantity}</span>
      <span className="font-mono text-gray-400">
        {(order.price * order.quantity).toLocaleString()}
      </span>
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse-slow" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <motion.h3 
            className="text-xl font-bold text-white"
            animate={{ textShadow: pulse ? '0 0 10px #00ff88' : 'none' }}
            transition={{ duration: 0.3 }}
          >
            Order Book
          </motion.h3>
          <motion.span 
            className="text-sm text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20"
            whileHover={{ scale: 1.05 }}
          >
            {asset}
          </motion.span>
        </div>
        
        <div className="flex space-x-4">
          {/* Bids */}
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-400 mb-3">
              <span>BIDS</span>
              <span className="text-green-400">BUY</span>
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {orders.bids.map((order, index) => (
                  <OrderRow key={order.id} order={order} type="bids" index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Asks */}
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-400 mb-3">
              <span>ASKS</span>
              <span className="text-red-400">SELL</span>
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {orders.asks.map((order, index) => (
                  <OrderRow key={order.id} order={order} type="asks" index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="mt-4 pt-4 border-t border-gray-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Spread</span>
            <span className="text-yellow-400 font-mono">0.50 (0.52%)</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}