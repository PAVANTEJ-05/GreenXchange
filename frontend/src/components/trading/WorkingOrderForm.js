// components/trading/WorkingOrderForm.js
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkingOrderForm({ asset }) {
  const [orderType, setOrderType] = useState('market');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isBuy, setIsBuy] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPlacing(true);
    
    const order = {
      type: orderType,
      price: orderType === 'market' ? null : parseFloat(price),
      quantity: parseFloat(quantity),
      isBuy,
      asset,
      timestamp: Date.now()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Order placed:', order);
    setOrderStatus({
      success: true,
      message: `${isBuy ? 'Buy' : 'Sell'} order for ${quantity} ${asset} placed successfully!`,
      order
    });
    
    setIsPlacing(false);
    setQuantity('');
    setPrice('');
    
    // Clear status after 3 seconds
    setTimeout(() => setOrderStatus(null), 3000);
  };

  const estimatedCost = (parseFloat(price) || 95.80) * (parseFloat(quantity) || 0);

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Place Order</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isBuy ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <span className="text-sm text-gray-400">{isBuy ? 'BUY MODE' : 'SELL MODE'}</span>
          </div>
        </div>

        {/* Order Status */}
        <AnimatePresence>
          {orderStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3 rounded-lg mb-4 ${
                orderStatus.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
              }`}
            >
              <p className={`text-sm ${orderStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                {orderStatus.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buy/Sell Toggle */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsBuy(true)}
            className={`py-4 rounded-xl font-bold text-lg transition-all border-2 ${
              isBuy 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent shadow-2xl shadow-green-500/25'
                : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-green-500/50'
            }`}
          >
            BUY
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsBuy(false)}
            className={`py-4 rounded-xl font-bold text-lg transition-all border-2 ${
              !isBuy 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-transparent shadow-2xl shadow-red-500/25'
                : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-red-500/50'
            }`}
          >
            SELL
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Type */}
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-2">ORDER TYPE</label>
            <div className="grid grid-cols-3 gap-2">
              {['market', 'limit', 'stop'].map((type) => (
                <motion.button
                  key={type}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOrderType(type)}
                  className={`py-2 text-sm rounded-lg border transition-all ${
                    orderType === type
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-lg shadow-cyan-500/25'
                      : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:border-cyan-500/50'
                  }`}
                >
                  {type.toUpperCase()}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Price Input */}
          {orderType !== 'market' && (
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-2">
                {orderType === 'limit' ? 'LIMIT PRICE' : 'STOP PRICE'}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          )}

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-2">QUANTITY</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="0"
              step="0.001"
              required
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800/30 rounded-xl p-4 space-y-2 border border-gray-700/50">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Estimated Cost:</span>
              <span className="text-white font-mono">${estimatedCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Fee:</span>
              <span className="text-green-400 font-mono">$0.00</span>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isPlacing || !quantity}
            whileHover={{ scale: isPlacing ? 1 : 1.02 }}
            whileTap={{ scale: isPlacing ? 1 : 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              isBuy 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
            } text-white shadow-2xl relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPlacing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>PLACING ORDER...</span>
              </div>
            ) : (
              <span>{isBuy ? 'EXECUTE BUY' : 'EXECUTE SELL'}</span>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}