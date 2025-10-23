// utils/marketData.js
// STATIC DATA - No randomness, same everywhere

export const marketStats = {
  totalVolume: "$4.1M",
  activeProjects: "128", 
  creditsTraded: "45.2K",
  averagePrice: "$89.50"
};

export const creditTypes = [
  {
    id: 1,
    name: "Solar Energy",
    volume: "18.5K",
    price: "$85.20",
    change: "+2.3%",
    changeValue: 2.3,
    color: "bg-yellow-500"
  },
  {
    id: 2,
    name: "Wind Energy",
    volume: "12.3K",
    price: "$78.90", 
    change: "+1.8%",
    changeValue: 1.8,
    color: "bg-blue-500"
  },
  {
    id: 3,
    name: "Hydroelectric",
    volume: "8.7K",
    price: "$72.40",
    change: "+0.9%",
    changeValue: 0.9,
    color: "bg-cyan-500"
  },
  {
    id: 4, 
    name: "Biomass",
    volume: "3.2K",
    price: "$65.80",
    change: "-0.5%",
    changeValue: -0.5,
    color: "bg-green-600"
  },
  {
    id: 5,
    name: "Carbon Sequestration",
    volume: "2.1K",
    price: "$95.30",
    change: "+3.2%",
    changeValue: 3.2,
    color: "bg-emerald-700"
  },
  {
    id: 6,
    name: "Water Conservation", 
    volume: "1.8K",
    price: "$88.70",
    change: "+1.5%",
    changeValue: 1.5,
    color: "bg-sky-600"
  }
];

export const livePrices = [
  { symbol: "SOLAR-24", price: 85.20, change: 2.3 },
  { symbol: "WIND-24", price: 78.90, change: 1.8 },
  { symbol: "HYDRO-24", price: 72.40, change: 0.9 },
  { symbol: "BIO-24", price: 65.80, change: -0.5 },
  { symbol: "CARBON-24", price: 95.30, change: 3.2 },
  { symbol: "WATER-24", price: 88.70, change: 1.5 }
];

// Static order book data
export const orderBookData = {
  bids: [
    { price: 85.10, amount: 1200, total: 102120 },
    { price: 85.00, amount: 850, total: 72250 },
    { price: 84.90, amount: 1500, total: 127350 },
    { price: 84.80, amount: 920, total: 78016 },
    { price: 84.70, amount: 1100, total: 93170 }
  ],
  asks: [
    { price: 85.30, amount: 800, total: 68240 },
    { price: 85.40, amount: 1250, total: 106750 },
    { price: 85.50, amount: 950, total: 81225 },
    { price: 85.60, amount: 1100, total: 94160 },
    { price: 85.70, amount: 750, total: 64275 }
  ]
};

// Static demo tokens
export const demoTokens = [
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

// Single function to get ALL data
export function getMarketData() {
  return {
    stats: marketStats,
    credits: creditTypes,
    prices: livePrices,
    orderBook: orderBookData,
    tokens: demoTokens
  };
}