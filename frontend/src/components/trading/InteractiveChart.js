// components/trading/InteractiveChart.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveChart({ asset }) {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('1D');
  const canvasRef = useRef(null);

  useEffect(() => {
    const generateChartData = () => {
      const data = [];
      let price = 95;
      const points = timeframe === '1H' ? 60 : timeframe === '4H' ? 96 : 24;
      
      for (let i = 0; i < points; i++) {
        price += (Math.random() - 0.5) * 2;
        price = Math.max(92, Math.min(98, price));
        data.push({ time: i, price });
      }
      setChartData(data);
    };

    generateChartData();
  }, [timeframe, asset]);

  useEffect(() => {
    if (chartData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const prices = chartData.map(d => d.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const range = maxPrice - minPrice;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 255, 136, 0.01)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw price line
    ctx.beginPath();
    chartData.forEach((point, i) => {
      const x = (i / (chartData.length - 1)) * width;
      const y = height - ((point.price - minPrice) / range) * height;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Fill area under line
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 255, 136, 0.2)';
    ctx.fill();

  }, [chartData]);

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">{asset} Price Chart</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl font-bold text-green-400">
              ${chartData[chartData.length - 1]?.price.toFixed(2) || '95.80'}
            </span>
            <span className="text-green-400 text-sm">+2.45% ↗</span>
          </div>
        </div>
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
          {['1H', '4H', '1D', '1W'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                timeframe === tf
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64 relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={256}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}