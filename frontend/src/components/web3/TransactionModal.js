'use client';
import { useEffect } from 'react';

export default function TransactionModal({ isOpen, status, hash, error, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: '⏳',
        title: 'Transaction Pending',
        message: 'Please confirm the transaction in your wallet',
        color: 'text-yellow-400'
      },
      confirming: {
        icon: '🔍',
        title: 'Confirming Transaction',
        message: 'Waiting for blockchain confirmation...',
        color: 'text-blue-400'
      },
      success: {
        icon: '✅',
        title: 'Transaction Successful',
        message: 'Your transaction was completed successfully',
        color: 'text-green-400'
      },
      error: {
        icon: '❌',
        title: 'Transaction Failed',
        message: error || 'An error occurred with your transaction',
        color: 'text-red-400'
      }
    };
    
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className={`text-4xl mb-4 ${statusConfig.color}`}>
            {statusConfig.icon}
          </div>
          
          <h3 className={`text-xl font-semibold mb-2 ${statusConfig.color}`}>
            {statusConfig.title}
          </h3>
          
          <p className="text-neutral-gray mb-6">
            {statusConfig.message}
          </p>

          {hash && (
            <div className="bg-primary-dark2 rounded-lg p-4 mb-6">
              <p className="text-neutral-gray text-sm mb-1">Transaction Hash:</p>
              <p className="text-neutral-white font-mono text-sm break-all">
                {hash}
              </p>
              <a
                href={`https://etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-emerald text-sm hover:underline mt-2 inline-block"
              >
                View on Explorer ↗
              </a>
            </div>
          )}

          {(status === 'success' || status === 'error') && (
            <button
              onClick={onClose}
              className="btn-primary w-full py-3"
            >
              {status === 'success' ? 'Continue' : 'Try Again'}
            </button>
          )}

          {(status === 'pending' || status === 'confirming') && (
            <div className="flex items-center justify-center space-x-2 text-neutral-gray text-sm">
              <div className="w-4 h-4 border-2 border-accent-emerald border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}