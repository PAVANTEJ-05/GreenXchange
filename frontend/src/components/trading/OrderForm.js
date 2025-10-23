// components/trading/OrderForm.js
'use client';
import { useState } from 'react';

export default function OrderForm({ asset, onOrderPlaced }) {
  const [orderType, setOrderType] = useState('market');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isBuy, setIsBuy] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const order = {
      type: orderType,
      price: orderType === 'limit' ? parseFloat(price) : null,
      quantity: parseFloat(quantity),
      isBuy,
      asset,
      timestamp: Date.now()
    };

    console.log('Order placed:', order);
    onOrderPlaced?.(order);
    
    // Reset form
    if (orderType === 'market') {
      setPrice('');
    }
    setQuantity('');
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Place Order</h3>
      
      {/* Buy/Sell Toggle */}
      <div className="flex space-x-2 mb-4 bg-gray-800 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setIsBuy(true)}
          className={`flex-1 py-3 rounded-md text-sm font-medium transition-all ${
            isBuy 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          BUY
        </button>
        <button
          type="button"
          onClick={() => setIsBuy(false)}
          className={`flex-1 py-3 rounded-md text-sm font-medium transition-all ${
            !isBuy 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          SELL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
            <option value="stop">Stop Order</option>
          </select>
        </div>

        {/* Price Input (for limit orders) */}
        {orderType !== 'market' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {orderType === 'limit' ? 'Limit Price' : 'Stop Price'}
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
        )}

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            step="0.001"
            required
          />
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800 rounded-lg p-3 space-y-2 text-sm">
          <div className="flex justify-between text-gray-300">
            <span>Estimated Cost:</span>
            <span className="text-white">
              ${((parseFloat(price) || 95.80) * (parseFloat(quantity) || 0)).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Fee:</span>
            <span className="text-white">$0.00</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg ${
            isBuy 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isBuy ? 'BUY' : 'SELL'} {asset || 'GC-001'}
        </button>
      </form>
    </div>
  );
}