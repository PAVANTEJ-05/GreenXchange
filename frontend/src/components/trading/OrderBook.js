// components/trading/OrderBook.js
'use client';
import { useState, useEffect } from 'react';

export default function OrderBook({ asset }) {
  const [orders, setOrders] = useState({
    bids: [],
    asks: []
  });

  useEffect(() => {
    // Mock order book data
    const mockOrders = {
      bids: [
        { price: 95.50, quantity: 100, total: 9550 },
        { price: 95.25, quantity: 75, total: 7143.75 },
        { price: 95.00, quantity: 150, total: 14250 },
        { price: 94.75, quantity: 200, total: 18950 },
        { price: 94.50, quantity: 80, total: 7560 },
      ],
      asks: [
        { price: 96.00, quantity: 120, total: 11520 },
        { price: 96.25, quantity: 80, total: 7700 },
        { price: 96.50, quantity: 200, total: 19300 },
        { price: 96.75, quantity: 150, total: 14512.5 },
        { price: 97.00, quantity: 100, total: 9700 },
      ]
    };
    setOrders(mockOrders);
  }, [asset]);

  const OrderTable = ({ orders, type }) => (
    <div className="flex-1">
      <h4 className={`font-semibold mb-3 text-sm uppercase tracking-wide ${
        type === 'bids' ? 'text-green-400' : 'text-red-400'
      }`}>
        {type === 'bids' ? 'Bids (Buy)' : 'Asks (Sell)'}
      </h4>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400 pb-2 border-b border-gray-700">
          <span>Price</span>
          <span>Size</span>
          <span>Total</span>
        </div>
        {orders[type].map((order, index) => (
          <div
            key={index}
            className={`flex justify-between p-2 text-sm rounded hover:bg-gray-800 transition-colors cursor-pointer ${
              type === 'bids' ? 'text-green-300' : 'text-red-300'
            }`}
          >
            <span className="font-mono">{order.price.toFixed(2)}</span>
            <span className="font-mono">{order.quantity}</span>
            <span className="font-mono text-gray-400">{order.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Order Book</h3>
        <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">GC-001</span>
      </div>
      <div className="flex space-x-4">
        <OrderTable orders={orders} type="bids" />
        <OrderTable orders={orders} type="asks" />
      </div>
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Spread: 0.50 (0.52%)</span>
          <span className="text-yellow-400">High Volatility</span>
        </div>
      </div>
    </div>
  );
}