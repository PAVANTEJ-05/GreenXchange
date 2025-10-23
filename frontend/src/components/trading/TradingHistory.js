// components/trading/TradingHistory.js
'use client';
import { useState, useEffect } from 'react';

export default function TradingHistory({ asset }) {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    // Mock trade history
    const mockTrades = [
      { id: 1, price: 95.75, quantity: 50, timestamp: Date.now() - 300000, type: 'buy' },
      { id: 2, price: 95.80, quantity: 25, timestamp: Date.now() - 240000, type: 'sell' },
      { id: 3, price: 95.70, quantity: 100, timestamp: Date.now() - 180000, type: 'buy' },
      { id: 4, price: 95.85, quantity: 75, timestamp: Date.now() - 120000, type: 'sell' },
      { id: 5, price: 95.90, quantity: 60, timestamp: Date.now() - 60000, type: 'buy' },
      { id: 6, price: 95.65, quantity: 45, timestamp: Date.now() - 30000, type: 'sell' },
      { id: 7, price: 95.95, quantity: 80, timestamp: Date.now() - 15000, type: 'buy' },
    ];
    setTrades(mockTrades);
  }, [asset]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Trades</h3>
        <div className="flex space-x-2">
          <button className="text-xs text-gray-400 hover:text-white transition-colors">1H</button>
          <button className="text-xs text-gray-400 hover:text-white transition-colors">4H</button>
          <button className="text-xs text-white bg-blue-600 px-2 py-1 rounded">24H</button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        <div className="flex justify-between text-xs text-gray-400 pb-2 border-b border-gray-700">
          <span>Price</span>
          <span>Quantity</span>
          <span>Time</span>
        </div>
        {trades.map((trade) => (
          <div 
            key={trade.id} 
            className="flex justify-between items-center p-2 hover:bg-gray-800 rounded transition-colors"
          >
            <span className={`font-mono text-sm ${
              trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trade.price.toFixed(2)}
            </span>
            <span className="font-mono text-gray-300 text-sm">
              {trade.quantity}
            </span>
            <span className="text-gray-400 text-xs font-mono">
              {formatTime(trade.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}