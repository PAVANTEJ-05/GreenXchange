// // components/ClientOnly.js
// 'use client';
// import { useEffect, useState } from 'react';

// export default function ClientOnly({ children, fallback = null }) {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   return isClient ? children : fallback;
// }