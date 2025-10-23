// components/ui/DataCard.js
'use client';
import { useEffect, useState } from 'react';
import { getMarketData } from '@/utils/marketData';

export default function DataCard({ title, value, change, icon }) {
  const [displayValue, setDisplayValue] = useState('Loading...');

  useEffect(() => {
    // Use consistent data from marketData.js
    const marketData = getMarketData();
    
    // Set values based on title to ensure consistency
    const stats = marketData.stats;
    let finalValue = value;
    
    if (title === 'Total Volume') finalValue = stats.totalVolume;
    if (title === 'Active Projects') finalValue = stats.activeProjects;
    if (title === 'Credits Traded') finalValue = stats.creditsTraded;
    if (title === 'Average Price') finalValue = stats.averagePrice;
    
    setDisplayValue(finalValue);
  }, [title, value]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{displayValue}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-3xl text-green-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}