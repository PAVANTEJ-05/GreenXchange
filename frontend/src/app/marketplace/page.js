// src/app/marketplace/page.js
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Marketplace() {
  const [selectedAsset, setSelectedAsset] = useState('GC-001');
  const [isClient, setIsClient] = useState(false);
  const [orderData, setOrderData] = useState({
    bids: [],
    asks: [],
    trades: [],
    stats: {}
  });

  useEffect(() => {
    setIsClient(true);
    
    // Generate data on client side only
    const bids = [95.50, 95.25, 95.00, 94.75].map(price => ({
      price,
      quantity: Math.floor(price * 10)
    }));
    
    const asks = [96.00, 96.25, 96.50, 96.75].map(price => ({
      price,
      quantity: Math.floor(price * 10)
    }));
    
    const trades = [95.75, 95.80, 95.70, 95.85].map((price, i) => ({
      price,
      quantity: Math.floor(price * 10),
      time: `12:4${i}`,
      type: i % 2 === 0 ? 'buy' : 'sell'
    }));
    
    const stats = {
      volume: '$2.4M',
      change: '+2.45%',
      marketCap: '$45.2M',
      activeOrders: '1,247'
    };

    setOrderData({ bids, asks, trades, stats });
  }, []);

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
      asset: selectedAsset,
      timestamp: Date.now()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Order placed:', order);
    setOrderStatus({
      success: true,
      message: `${isBuy ? 'Buy' : 'Sell'} order for ${quantity} ${selectedAsset} placed successfully!`,
      order
    });
    
    setIsPlacing(false);
    setQuantity('');
    setPrice('');
    
    // Clear status after 3 seconds
    setTimeout(() => setOrderStatus(null), 3000);
  };

  const estimatedCost = (parseFloat(price) || 95.80) * (parseFloat(quantity) || 0);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
              QUANTUM TRADER
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-900/50 rounded-2xl p-6 h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%'] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ 
              backgroundSize: '200% auto'
            }}
          >
            QUANTUM TRADER
          </motion.h1>
          <motion.p 
            className="text-gray-300 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Next Generation 3D Trading Platform
          </motion.p>
        </motion.div>

        {/* Asset Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center space-x-3 mb-8"
        >
          {['GC-001', 'GC-002', 'GC-003', 'GC-004'].map((asset) => (
            <motion.button
              key={asset}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedAsset(asset)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-sm border ${
                selectedAsset === asset
                  ? 'bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow-2xl border-transparent'
                  : 'bg-gray-900/50 text-gray-300 border-gray-700/50 hover:border-cyan-500/50'
              }`}
            >
              {asset}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Trading Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Order Book */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Order Book</h3>
              <div className="space-y-2">
                <div className="text-green-400 text-sm">BIDS</div>
                {orderData.bids.map((order, i) => (
                  <div key={i} className="flex justify-between text-green-300 text-sm">
                    <span>{order.price.toFixed(2)}</span>
                    <span>{order.quantity}</span>
                  </div>
                ))}
                <div className="text-red-400 text-sm mt-4">ASKS</div>
                {orderData.asks.map((order, i) => (
                  <div key={i} className="flex justify-between text-red-300 text-sm">
                    <span>{order.price.toFixed(2)}</span>
                    <span>{order.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading History */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Trades</h3>
              <div className="space-y-2">
                {orderData.trades.map((trade, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                      ${trade.price.toFixed(2)}
                    </span>
                    <span className="text-gray-300">{trade.quantity}</span>
                    <span className="text-gray-500 text-xs">{trade.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center Column */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Chart */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedAsset} Price Chart</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-green-400">$95.80</span>
                    <span className="text-green-400 text-sm">+2.45% ↗</span>
                  </div>
                </div>
                <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
                  {['1H', '4H', '1D', '1W'].map((tf) => (
                    <button
                      key={tf}
                      className="px-3 py-1 text-xs rounded-md text-gray-400 hover:text-white transition-colors"
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-64 bg-gradient-to-b from-cyan-500/10 to-green-500/5 rounded-lg flex items-center justify-center border border-cyan-500/20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-3 animate-spin" />
                  <p className="text-cyan-300 text-sm">3D Chart Loading...</p>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Place Order</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isBuy ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                  <span className="text-sm text-gray-400">{isBuy ? 'BUY MODE' : 'SELL MODE'}</span>
                </div>
              </div>

              {/* Order Status */}
              {orderStatus && (
                <div className={`p-3 rounded-lg mb-4 ${
                  orderStatus.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
                }`}>
                  <p className={`text-sm ${orderStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                    {orderStatus.message}
                  </p>
                </div>
              )}

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
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Market Stats */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Market Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">24h Volume</div>
                  <div className="text-white font-semibold text-sm">$2.4M</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">24h Change</div>
                  <div className="text-green-400 font-semibold text-sm">+2.45%</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Market Cap</div>
                  <div className="text-white font-semibold text-sm">$45.2M</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Active Orders</div>
                  <div className="text-white font-semibold text-sm">1,247</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}