'use client';
import { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';

export default function NetworkStatus() {
  const { network, isConnected } = useWeb3();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isConnected || !network) return null;

  const getNetworkInfo = (chainId) => {
    const networks = {
      1: { name: 'Ethereum', color: 'bg-blue-500' },
      5: { name: 'Goerli', color: 'bg-yellow-500' },
      11155111: { name: 'Sepolia', color: 'bg-purple-500' },
      137: { name: 'Polygon', color: 'bg-indigo-500' },
      80001: { name: 'Mumbai', color: 'bg-pink-500' }
    };
    
    return networks[chainId] || { name: `Chain ${chainId}`, color: 'bg-gray-500' };
  };

  const networkInfo = getNetworkInfo(network.chainId);

  return (
    <div className="flex items-center space-x-2 glass-panel rounded-lg px-3 py-1">
      <div className={`w-2 h-2 rounded-full ${networkInfo.color} animate-pulse`}></div>
      <span className="text-neutral-gray text-xs font-medium">
        {networkInfo.name}
      </span>
    </div>
  );
}