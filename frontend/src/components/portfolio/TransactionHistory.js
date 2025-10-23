// components/portfolio/TransactionHistory.js
'use client';
import { useState } from 'react';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'purchase',
      creditType: 'Solar Energy',
      amount: 500,
      price: 85.20,
      total: 42600,
      date: '2024-01-15',
      status: 'completed',
      project: 'Rajasthan Solar Park'
    },
    {
      id: 2,
      type: 'sale',
      creditType: 'Wind Energy',
      amount: 200,
      price: 78.90,
      total: 15780,
      date: '2024-01-10',
      status: 'completed',
      project: 'Himalayan Wind Farm'
    },
    {
      id: 3,
      type: 'purchase',
      creditType: 'Hydroelectric',
      amount: 450,
      price: 70.00,
      total: 31500,
      date: '2024-01-08',
      status: 'pending',
      project: 'Ganges Hydro Project'
    },
    {
      id: 4,
      type: 'retirement',
      creditType: 'Solar Energy',
      amount: 100,
      price: 0,
      total: 0,
      date: '2024-01-05',
      status: 'completed',
      project: 'Corporate Sustainability'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'purchase': return '⬇️';
      case 'sale': return '⬆️';
      case 'retirement': return '♻️';
      default: return '⚡';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'purchase': return 'text-emerald-400';
      case 'sale': return 'text-red-400';
      case 'retirement': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>

      <div className="space-y-3">
        {transactions.map(transaction => (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center space-x-4 flex-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                transaction.type === 'purchase' ? 'bg-emerald-500/20' : 
                transaction.type === 'sale' ? 'bg-red-500/20' : 'bg-cyan-500/20'
              }`}>
                <span className="text-lg">{getTypeIcon(transaction.type)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-white font-semibold capitalize">{transaction.type}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {transaction.creditType} • {transaction.project}
                </p>
                <p className="text-gray-500 text-xs">{transaction.date}</p>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
                {transaction.type === 'purchase' ? '-' : '+'}{transaction.amount} credits
              </div>
              {transaction.type !== 'retirement' && (
                <div className="text-white text-sm">
                  ${transaction.total.toLocaleString()}
                </div>
              )}
              {transaction.type === 'retirement' && (
                <div className="text-cyan-400 text-sm">Retired</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <button className="bg-gray-800 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
          View All Transactions
        </button>
      </div>
    </div>
  );
}