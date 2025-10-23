// components/marketplace/LivePriceTicker.js
'use client';
import { useEffect, useState } from 'react';

const STATIC_PRICES = [
  { symbol: "SOLAR-24", price: 85.20, change: 2.3 },
  { symbol: "WIND-24", price: 78.90, change: 1.8 },
  { symbol: "HYDRO-24", price: 72.40, change: 0.9 },
  { symbol: "BIO-24", price: 65.80, change: -0.5 },
  { symbol: "CARBON-24", price: 95.30, change: 3.2 },
  { symbol: "WATER-24", price: 88.70, change: 1.5 }
];

export default function LivePriceTicker() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="h-6 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Live Prices</h3>
      <div className="overflow-hidden">
        <div className="flex space-x-6 animate-marquee whitespace-nowrap">
          {STATIC_PRICES.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">{item.symbol}</span>
              <span className="text-gray-900 font-bold">${item.price}</span>
              <span className={`text-sm ${
                item.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}