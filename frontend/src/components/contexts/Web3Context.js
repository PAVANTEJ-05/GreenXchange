// components/contexts/Web3Context.js
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [network, setNetwork] = useState('Ethereum Mainnet');

  // Mock wallet connection simulation
  const connectWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock Ethereum address
      const mockAccount = `0x${Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;

      setAccount(mockAccount);
      setIsConnected(true);
      setNetwork('Sepolia Testnet');

      // Store connection state
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('account', mockAccount);

    } catch (error) {
      setError('Failed to connect wallet');
      console.error('Wallet connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setNetwork('Ethereum Mainnet');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('account');
  };

  // Check for existing connection on mount
  useEffect(() => {
    const savedConnection = localStorage.getItem('walletConnected');
    const savedAccount = localStorage.getItem('account');
    
    if (savedConnection && savedAccount) {
      setAccount(savedAccount);
      setIsConnected(true);
      setNetwork('Sepolia Testnet');
    }
  }, []);

  const value = {
    account,
    isConnected,
    loading,
    error,
    network,
    connectWallet,
    disconnectWallet
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};