// components/portfolio/PortfolioOverview.js
'use client';
import { useState } from 'react';
import PortfolioStats from './PortfolioStats';
import CreditHoldings from './CreditHoldings';
import TransactionHistory from './TransactionHistory';
import ImpactMetrics from './ImpactMetrics';

export default function PortfolioOverview() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'holdings', name: 'My Credits', icon: '🌿' },
    { id: 'transactions', name: 'Transactions', icon: '💸' },
    { id: 'impact', name: 'Impact', icon: '🌍' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <PortfolioStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CreditHoldings />
              <TransactionHistory />
            </div>
          </div>
        );
      case 'holdings':
        return <CreditHoldings />;
      case 'transactions':
        return <TransactionHistory />;
      case 'impact':
        return <ImpactMetrics />;
      default:
        return <PortfolioStats />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-2">
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {renderContent()}
    </div>
  );
}