// components/marketplace/TokenGrid.js
'use client';
import { useEffect, useState } from 'react';

const STATIC_TOKENS = [
  {
    id: 1,
    project: "Rajasthan Solar Park",
    type: "Solar Energy",
    vintage: 2024,
    price: "$85.20",
    verified: true,
    co2Reduced: "45 tons"
  },
  {
    id: 2,
    project: "Himalayan Wind Farm", 
    type: "Wind Energy",
    vintage: 2024,
    price: "$78.90",
    verified: true,
    co2Reduced: "38 tons"
  },
  {
    id: 3,
    project: "Ganges Hydro Project",
    type: "Hydroelectric",
    vintage: 2024,
    price: "$72.40",
    verified: true, 
    co2Reduced: "52 tons"
  }
];

export default function TokenGrid() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {STATIC_TOKENS.map((token) => (
        <div key={token.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">{token.project}</h3>
              <p className="text-sm text-gray-600">{token.type}</p>
            </div>
            {token.verified && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Verified
              </span>
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Vintage:</span>
              <span className="font-medium">{token.vintage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Price:</span>
              <span className="font-bold text-green-600">{token.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">CO₂ Reduced:</span>
              <span className="font-medium">{token.co2Reduced}</span>
            </div>
          </div>
          
          <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors">
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}