// components/marketplace/TradingView.js
'use client';
import { useEffect, useState } from 'react';

export default function TradingView() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Trading Chart - SOLAR-24</h3>
      <div className="h-64 bg-gradient-to-b from-green-50 to-blue-50 rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📈</div>
          <p>Trading Chart Visualization</p>
          <p className="text-sm mt-2">Live price data integration</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-4 text-center">
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-sm text-gray-600">Open</div>
          <div className="font-semibold">$84.50</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-sm text-gray-600">High</div>
          <div className="font-semibold">$86.20</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-sm text-gray-600">Low</div>
          <div className="font-semibold">$83.80</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-sm text-gray-600">Volume</div>
          <div className="font-semibold">18.5K</div>
        </div>
      </div>
    </div>
  );
}