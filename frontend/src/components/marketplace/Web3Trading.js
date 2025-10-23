// components/marketplace/Web3Trading.js
'use client';
import { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';

export default function Web3Trading() {
  const { isConnected, account } = useWeb3();
  const [activeTab, setActiveTab] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const creditTypes = [
    { symbol: 'SOLAR-24', price: 85.20, change: 2.3 },
    { symbol: 'WIND-24', price: 78.90, change: 1.8 },
    { symbol: 'CARBON-24', price: 95.30, change: 3.2 }
  ];

  const handleTrade = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet to trade');
      return;
    }

    setLoading(true);
    
    // Simulate trade execution
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful trade
      console.log(`Trade executed: ${activeTab} ${amount} credits at $${price}`);
      alert(`Trade executed successfully! ${activeTab.toUpperCase()} ${amount} credits`);
      
      // Reset form
      setAmount('');
      setPrice('');
    } catch (error) {
      console.error('Trade failed:', error);
      alert('Trade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-8 text-center">
        <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔒</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Wallet Required</h3>
        <p className="text-gray-400 mb-6">Connect your wallet to start trading green credits</p>
        <div className="flex justify-center">
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        <span className="text-emerald-400 text-sm">Connected: {account?.slice(0, 8)}...</span>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'buy' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Buy Credits
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'sell' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Sell Credits
        </button>
      </div>

      <form onSubmit={handleTrade} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Credit Type</label>
          <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {creditTypes.map(credit => (
              <option key={credit.symbol} value={credit.symbol}>
                {credit.symbol} - ${credit.price} ({credit.change > 0 ? '+' : ''}{credit.change}%)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Cost</span>
            <span className="text-white font-semibold">
              ${amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
            activeTab === 'buy' 
              ? 'bg-emerald-500 hover:bg-emerald-600' 
              : 'bg-red-500 hover:bg-red-600'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `${activeTab === 'buy' ? 'Buy' : 'Sell'} Credits`
          )}
        </button>
      </form>
    </div>
  );
}