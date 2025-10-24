// components/web3/WalletConnect.js
'use client';
import { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';

export default function WalletConnect() {
  const { 
    account, 
    isConnected, 
    loading, 
    error, 
    network,
    balance,
    connectWallet, 
    disconnectWallet 
  } = useWeb3();

  const [showNetworkModal, setShowNetworkModal] = useState(false);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  if (loading) {
    return (
      <button 
        disabled
        className="bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 opacity-50"
      >
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Connecting...</span>
      </button>
    );
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center space-x-3">
        {/* Network Indicator */}
        <div className="hidden sm:flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm">{network.name}</span>
        </div>

        {/* Account Address & Balance */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white px-4 py-2 rounded-lg border border-emerald-500/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="font-mono text-sm">{formatAddress(account)}</span>
            <span className="font-mono text-sm">({parseFloat(balance).toFixed(4)} ETH)</span>
          </div>
        </div>

        {/* Disconnect Button */}
        <button 
          onClick={handleDisconnect}
          className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <button 
        onClick={handleConnect}
        className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg"
      >
        Connect Wallet
      </button>
      
      {error && (
        <div className="bg-red-500/20 text-red-400 px-3 py-2 rounded border border-red-500/30 text-sm">
          {error.message}
        </div>
      )}
    </div>
  );
}