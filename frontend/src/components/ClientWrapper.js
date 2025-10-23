// // components/ClientWrapper.js
// 'use client';
// import { useEffect, useState } from 'react';
// import { getMarketData } from '@/utils/marketData';

// export default function ClientWrapper({ children, dataKey }) {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const marketData = getMarketData();
//     setData(marketData);
//   }, []);

//   if (!data) {
//     return (
//       <div className="animate-pulse">
//         <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//         <div className="h-6 bg-gray-200 rounded w-1/2"></div>
//       </div>
//     );
//   }

//   return children(data);
// }