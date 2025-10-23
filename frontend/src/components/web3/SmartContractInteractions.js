'use client';
import { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import TransactionModal from './TransactionModal';

export default function SmartContractInteractions() {
  const { contracts, account, isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState('mint');
  const [isClient, setIsClient] = useState(false);
  const [transactionState, setTransactionState] = useState({
    isModalOpen: false,
    status: 'idle',
    hash: '',
    error: null
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock function to mint a green credit NFT
  const handleMintCredit = async (creditData) => {
    if (!isConnected || !contracts.greenCreditNFT) {
      throw new Error('Wallet not connected or contract not available');
    }

    setTransactionState({
      isModalOpen: true,
      status: 'pending',
      hash: '',
      error: null
    });

    try {
      // For demo purposes, we'll simulate a transaction
      const mockTx = {
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        wait: async () => {
          // Simulate transaction confirmation
          await new Promise(resolve => setTimeout(resolve, 3000));
          return { status: 1 };
        }
      };

      setTransactionState(prev => ({
        ...prev,
        hash: mockTx.hash,
        status: 'confirming'
      }));

      const receipt = await mockTx.wait();
      
      if (receipt.status === 1) {
        setTransactionState(prev => ({
          ...prev,
          status: 'success'
        }));
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error) {
      console.error('Minting failed:', error);
      setTransactionState(prev => ({
        ...prev,
        status: 'error',
        error: error.message
      }));
    }
  };

  const closeModal = () => {
    setTransactionState({
      isModalOpen: false,
      status: 'idle',
      hash: '',
      error: null
    });
  };

  if (!isClient) {
    return (
      <div className="glass-panel rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-primary-dark2 rounded w-1/3 mb-6"></div>
          <div className="h-10 bg-primary-dark2 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-primary-dark2 rounded"></div>
            <div className="h-4 bg-primary-dark2 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-lg font-semibold text-neutral-white mb-6">
        Contract Interactions
      </h3>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-primary-dark2 rounded-lg p-1 mb-6">
        {['mint', 'trade', 'settle'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-accent-emerald text-white'
                : 'text-neutral-gray hover:text-neutral-white'
            }`}
          >
            {tab === 'mint' && 'Mint Credits'}
            {tab === 'trade' && 'Trade'}
            {tab === 'settle' && 'Settle'}
          </button>
        ))}
      </div>

      {/* Minting Interface */}
      {activeTab === 'mint' && (
        <div className="space-y-4">
          <h4 className="text-neutral-white font-medium">Mint Green Credit NFT</h4>
          <p className="text-neutral-gray text-sm">
            Create a new verified carbon credit as an ERC-721 NFT
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-gray mb-2">Project ID</label>
              <input 
                type="text" 
                className="w-full bg-primary-dark2 border border-border-color rounded-lg px-3 py-2 text-sm text-neutral-white"
                placeholder="SOL-CA-001"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-gray mb-2">Credit Type</label>
              <select className="w-full bg-primary-dark2 border border-border-color rounded-lg px-3 py-2 text-sm text-neutral-white">
                <option>Carbon Offset</option>
                <option>Renewable Energy</option>
                <option>Sustainable Development</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => handleMintCredit({
              projectId: 'SOL-CA-001',
              creditType: 'CarbonOffset',
              vintage: 2024,
              verificationHash: 'Qm...',
              amount: 1000
            })}
            className="btn-primary w-full text-sm py-3"
            disabled={!isConnected}
          >
            {isConnected ? 'Mint Credit NFT' : 'Connect Wallet to Mint'}
          </button>
        </div>
      )}

      {/* Trading Interface */}
      {activeTab === 'trade' && (
        <div className="space-y-4">
          <h4 className="text-neutral-white font-medium">Execute Trade</h4>
          <p className="text-neutral-gray text-sm">
            Trade carbon credits with zero gas fees using Yellow SDK
          </p>
          
          <div className="bg-primary-dark2 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-gray">Available Balance:</span>
              <span className="text-neutral-white">1,000 credits</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-gray">Gas Fees:</span>
              <span className="text-accent-emerald">$0.00</span>
            </div>
          </div>

          <button
            onClick={() => handleMintCredit({})}
            className="btn-primary w-full text-sm py-3"
            disabled={!isConnected}
          >
            {isConnected ? 'Execute Trade' : 'Connect Wallet to Trade'}
          </button>
        </div>
      )}

      <TransactionModal 
        isOpen={transactionState.isModalOpen}
        status={transactionState.status}
        hash={transactionState.hash}
        error={transactionState.error}
        onClose={closeModal}
      />
    </div>
  );
}