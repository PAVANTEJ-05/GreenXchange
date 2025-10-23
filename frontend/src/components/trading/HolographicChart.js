// components/trading/HolographicChart.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HolographicChart({ asset }) {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('1D');
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadChart = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const data = [];
      let price = 95;
      const points = 50;
      
      for (let i = 0; i < points; i++) {
        price += (Math.random() - 0.48) * 2;
        price = Math.max(92, Math.min(98, price));
        data.push({ time: i, price, volume: Math.random() });
      }
      
      setChartData(data);
      setIsLoading(false);
      drawHolographicChart(data);
    };

    loadChart();
  }, [timeframe]);

  const drawHolographicChart = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (data.length === 0) return;
    
    const prices = data.map(d => d.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const range = maxPrice - minPrice;
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw price line with glow effect
    ctx.beginPath();
    data.forEach((point, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((point.price - minPrice) / range) * height;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    // Glow effect
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Remove shadow for fill
    ctx.shadowBlur = 0;
    
    // Fill with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 255, 136, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    
    // Draw current price point
    const lastPoint = data[data.length - 1];
    const lastX = width;
    const lastY = height - ((lastPoint.price - minPrice) / range) * height;
    
    ctx.beginPath();
    ctx.arc(lastX, lastY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#00ff88';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(lastX, lastY, 12, 0, 2 * Math.PI);
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const timeframes = ['1H', '4H', '1D', '1W'];

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse-slow" />
      
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <motion.h3 
              className="text-xl font-bold text-white mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {asset} Price
            </motion.h3>
            <AnimatePresence mode="wait">
              {!isLoading && (
                <motion.div
                  key="price"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2"
                >
                  <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                    ${chartData[chartData.length - 1]?.price.toFixed(2)}
                  </span>
                  <motion.span 
                    className="text-green-400 text-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    +2.45% ↗
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex space-x-1 bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl border border-gray-700/50">
            {timeframes.map((tf) => (
              <motion.button
                key={tf}
                onClick={() => setTimeframe(tf)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1 text-xs rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </motion.button>
            ))}
          </div>
        </div>
        
        <div className="h-64 relative">
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="relative">
                    <motion.div
                      className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-green-500 rounded-full mx-auto mb-3"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-cyan-300 text-sm"
                  >
                    Loading quantum data...
                  </motion.p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={256}
                  className="w-full h-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}