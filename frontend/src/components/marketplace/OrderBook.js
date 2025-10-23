// components/marketplace/OrderBook.js
'use client';
import { useEffect, useState } from 'react';

const STATIC_ORDER_BOOK = {
  bids: [
    { price: 85.10, amount: 1200, total: 102120 },
    { price: 85.00, amount: 850, total: 72250 },
    { price: 84.90, amount: 1500, total: 127350 },
    { price: 84.80, amount: 920, total: 78016 },
    { price: 84.70, amount: 1100, total: 93170 }
  ],
  asks: [
    { price: 85.30, amount: 800, total: 68240 },
    { price: 85.40, amount: 1250, total: 106750 },
    { price: 85.50, amount: 950, total: 81225 },
    { price: 85.60, amount: 1100, total: 94160 },
    { price: 85.70, amount: 750, total: 64275 }
  ]
};

export default function OrderBook() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map(col => (
            <div key={col}>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              {[1,2,3,4,5].map(row => (
                <div key={row} className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Book - SOLAR-24</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Bids */}
        <div>
          <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
            <span>Bid Price</span>
            <span>Amount</span>
            <span>Total</span>
          </div>
          {STATIC_ORDER_BOOK.bids.map((order, index) => (
            <div key={index} className="flex justify-between text-sm mb-1">
              <span className="text-green-600">${order.price}</span>
              <span>{order.amount.toLocaleString()}</span>
              <span>${order.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
        
        {/* Asks */}
        <div>
          <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
            <span>Ask Price</span>
            <span>Amount</span>
            <span>Total</span>
          </div>
          {STATIC_ORDER_BOOK.asks.map((order, index) => (
            <div key={index} className="flex justify-between text-sm mb-1">
              <span className="text-red-600">${order.price}</span>
              <span>{order.amount.toLocaleString()}</span>
              <span>${order.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}