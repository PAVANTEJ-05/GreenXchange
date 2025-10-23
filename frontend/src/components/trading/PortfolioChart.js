// components/trading/PortfolioChart.js
'use client';
import { useState, useEffect } from 'react';

export default function PortfolioChart() {
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    // Mock performance data
    const data = [];
    let value = 10000;
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      value += (Math.random() - 0.4) * 500;
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(value, 0)
      });
    }
    setPerformanceData(data);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
      <div className="h-64 flex items-end space-x-1">
        {performanceData.map((point, index) => (
          <div
            key={index}
            className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
            style={{ 
              height: `${(point.value / 15000) * 100}%`,
              minHeight: '2px'
            }}
            title={`${point.date}: $${point.value.toFixed(2)}`}
          />
        ))}
      </div>
    </div>
  );
}