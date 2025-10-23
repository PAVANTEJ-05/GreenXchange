// components/trading/PriceChart.js
'use client';
import { useState, useEffect } from 'react';

export default function PriceChart({ asset }) {
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState('1D');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock chart data
      const data = [];
      let basePrice = 95;
      const points = timeframe === '1H' ? 60 : timeframe === '4H' ? 96 : 24;
      
      for (let i = 0; i < points; i++) {
        basePrice += (Math.random() - 0.5) * 2;
        basePrice = Math.max(90, Math.min(100, basePrice)); // Keep within reasonable range
        data.push({
          time: i,
          price: basePrice,
          volume: Math.random() * 1000
        });
      }
      
      setChartData(data);
      setIsLoading(false);
    };

    loadChartData();
  }, [timeframe, asset]);

  const timeframes = [
    { key: '1H', label: '1H' },
    { key: '4H', label: '4H' },
    { key: '1D', label: '1D' },
    { key: '1W', label: '1W' }
  ];

  // Simple SVG-based chart to avoid external dependencies
  const renderSimpleChart = () => {
    if (!chartData || chartData.length === 0) return null;

    const maxPrice = Math.max(...chartData.map(d => d.price));
    const minPrice = Math.min(...chartData.map(d => d.price));
    const range = maxPrice - minPrice;
    const width = 500;
    const height = 200;

    const points = chartData.map((point, index) => {
      const x = (index / (chartData.length - 1)) * width;
      const y = height - ((point.price - minPrice) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="rounded">
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1="0"
            x2={width}
            y1={height * ratio}
            y2={height * ratio}
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Area fill */}
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill="url(#chartGradient)"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        
        {/* Current price indicator */}
        <circle
          cx={width}
          cy={height - ((chartData[chartData.length - 1].price - minPrice) / range) * height}
          r="4"
          fill="#3B82F6"
        />
      </svg>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{asset} Price Chart</h3>
          {chartData && !isLoading && (
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold text-green-400">
                ${chartData[chartData.length - 1]?.price.toFixed(2)}
              </span>
              <span className="text-green-400 text-sm">
                +2.45% ↗
              </span>
            </div>
          )}
        </div>
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setTimeframe(tf.key)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                timeframe === tf.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64 relative">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <div className="h-full w-full">
            {renderSimpleChart()}
          </div>
        )}
      </div>
      
      {/* Chart legend */}
      {!isLoading && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
          <div className="flex space-x-4 text-xs text-gray-400">
            <div>O: <span className="text-white">${chartData[0]?.price.toFixed(2)}</span></div>
            <div>H: <span className="text-green-400">${Math.max(...chartData.map(d => d.price)).toFixed(2)}</span></div>
            <div>L: <span className="text-red-400">${Math.min(...chartData.map(d => d.price)).toFixed(2)}</span></div>
            <div>C: <span className="text-white">${chartData[chartData.length - 1]?.price.toFixed(2)}</span></div>
          </div>
          <div className="text-xs text-gray-500">
            {timeframe} • Updated just now
          </div>
        </div>
      )}
    </div>
  );
}