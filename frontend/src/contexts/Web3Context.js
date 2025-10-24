'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext({
  account: '',
  provider: null,
  signer: null,
  network: null,
  isConnected: false,
  balance: '0',
  contracts: {},
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isMetaMaskInstalled: () => false,
});

let listenersAdded = false; // prevent duplicate listeners

export function Web3Provider({ children }) {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [contracts, setContracts] = useState({});

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Try reconnecting on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      checkExistingConnection();
    }
  }, []);

  const checkExistingConnection = async () => {
    if (!isMetaMaskInstalled()) return;
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await initializeWeb3(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  };

  const initializeWeb3 = async (accountAddress) => {
    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      setAccount(accountAddress);
      setProvider(web3Provider);
      setSigner(web3Signer);
      setNetwork(network);
      setIsConnected(true);

      const balance = await web3Provider.getBalance(accountAddress);
      setBalance(ethers.utils.formatEther(balance));

      setupEventListeners(web3Provider);
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
    }
  };

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('Please install MetaMask to use this dApp');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      await initializeWeb3(accounts[0]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const setupEventListeners = (provider) => {
    if (listenersAdded || !window.ethereum) return;
    listenersAdded = true;

    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        initializeWeb3(accounts[0]);
      }
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  };

  const disconnectWallet = () => {
    setAccount('');
    setProvider(null);
    setSigner(null);
    setNetwork(null);
    setIsConnected(false);
    setBalance('0');
    setContracts({});
  };

  const value = {
    account,
    provider,
    signer,
    network,
    isConnected,
    balance,
    contracts,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  return useContext(Web3Context);
};
