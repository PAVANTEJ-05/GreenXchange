'use client';
import { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import NetworkStatus from './NetworkStatus';

export default function Web3Integration() {
  const { 
    account, 
    isConnected, 
    connectWallet, 
    disconnectWallet, 
    balance,
    isMetaMaskInstalled 
  } = useWeb3();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration by only rendering on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
      alert(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (bal) => {
    return parseFloat(bal).toFixed(4);
  };

  // Show nothing during SSR
  if (!isClient) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <div className="w-[140px] h-[40px] bg-primary-dark2 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  // Show install MetaMask button if not installed
  if (!isMetaMaskInstalled()) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center space-x-2 text-sm"
        >
          <span>🔌 Install MetaMask</span>
        </a>
      </div>
    );
  }

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end space-y-3">
      {isConnected && <NetworkStatus />}
      
      {!isConnected ? (
        <button 
          onClick={handleConnect}
          disabled={isConnecting}
          className="btn-primary flex items-center space-x-2 text-sm min-w-[140px] justify-center"
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      ) : (
        <div className="glass-panel rounded-lg px-4 py-3 flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse"></div>
            <div className="text-right">
              <div className="text-neutral-white font-mono text-sm font-medium">
                {formatAddress(account)}
              </div>
              <div className="text-neutral-gray text-xs">
                {formatBalance(balance)} ETH
              </div>
            </div>
          </div>
          
          <button 
            onClick={disconnectWallet}
            className="text-neutral-gray hover:text-accent-emerald transition-colors p-1 rounded"
            title="Disconnect"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}