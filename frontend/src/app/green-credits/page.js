// app/green-credits/page.js
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mintApprovedToken , getBalanceOf} from "@/contexts/MintToken";

const GREEN_CREDIT_TYPES = [
  {
    id: 1,
    name: "Carbon Credits",
    icon: "🌳",
    description: "Verified removal or avoidance of CO₂ and greenhouse gases",
    benefits: ["CO₂ reduction & climate mitigation", "Supports reforestation & carbon capture", "Verified offsets for corporate reporting"],
    projects: ["Reforestation", "Soil Carbon Sequestration", "Direct Air Capture"],
    priceRange: "$85-110",
    demand: "Very High",
    color: "from-emerald-400 via-green-500 to-teal-600",
    bgGradient: "bg-gradient-to-br from-emerald-500/20 via-green-600/20 to-teal-700/20",
    borderColor: "border-emerald-400/50",
    stats: "1M+ Tons Offset"
  },
  {
    id: 2,
    name: "Green Energy Credits",
    icon: "⚡",
    description: "Clean electricity generation from renewable sources",
    benefits: ["Displaces fossil generation", "Supports renewable build-out", "Reduces grid carbon intensity"],
    projects: ["Solar Farms", "Onshore/Offshore Wind", "Small Hydro & Rooftop Solar"],
    priceRange: "$70-95",
    demand: "High",
    color: "from-yellow-400 via-orange-500 to-red-500",
    bgGradient: "bg-gradient-to-br from-yellow-500/20 via-orange-600/20 to-red-700/20",
    borderColor: "border-yellow-400/50",
    stats: "500K+ MWh Generated"
  },
  {
    id: 3,
    name: "Water Conservation Credits",
    icon: "💧",
    description: "Verified water savings and restoration projects",
    benefits: ["Improves water availability", "Protects aquatic ecosystems", "Supports sustainable agriculture"],
    projects: ["Efficient Irrigation", "Watershed Restoration", "Rainwater Harvesting"],
    priceRange: "$60-85",
    demand: "Growing",
    color: "from-blue-400 via-cyan-500 to-sky-600",
    bgGradient: "bg-gradient-to-br from-blue-500/20 via-cyan-600/20 to-sky-700/20",
    borderColor: "border-blue-400/50",
    stats: "2M+ Liters Saved"
  },
  {
    id: 4,
    name: "Renewable Resource Credits",
    icon: "♻️",
    description: "Renewable resource projects replacing non-renewable inputs",
    benefits: ["Reduces fossil feedstock use", "Promotes circular economy", "Creates local green jobs"],
    projects: ["Biomass-to-energy", "Bio-based materials", "Waste-to-resource"],
    priceRange: "$65-90",
    demand: "Medium",
    color: "from-purple-400 via-pink-500 to-rose-600",
    bgGradient: "bg-gradient-to-br from-purple-500/20 via-pink-600/20 to-rose-700/20",
    borderColor: "border-purple-400/50",
    stats: "100K+ Tons Recycled"
  }
];

export default function GreenCreditsPage() {
  const [flippedCard, setFlippedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [balanceToken, setBalanceToken] = useState("");

  const handleCardClick = (cardId) => {
    setFlippedCard(flippedCard === cardId ? null : cardId);
  };

  // const handleMint = () => {
  //   if (!tokenId || !amount) {
  //     alert("Please enter both Token ID and Amount");
  //     return;
  //   }
  //   if (amount > 1000) {
  //     alert("Maximum mint amount allowed is 1000");
  //     return;
  //   }
  //   console.log("Minting token:", { tokenId, amount });
  //   alert(`Mint request submitted for Token ID ${tokenId} with amount ${amount}`);
  //   setShowModal(false);
  // };

  const inputinfo = {
    tokenId: tokenId,
    amount: amount
  };


  console.log("Mint Input Info:", inputinfo);
  localStorage.setItem('MintInfo', JSON.stringify(inputinfo));
  
  const projectInfo = JSON.parse(localStorage.getItem("MintInfo"));

  const BalanceOf = async () => {
    if (!balanceToken) {
      alert("Please enter a Token ID.");
      return;
    }
    try {
      const tx = await getBalanceOf(balanceToken);
      console.log("Fetched balance successfully ✅", tx);
      setBalance(tx.toString());
    } catch (error) {
      console.error("Error during fetching balance:", error);
      alert("Fetch Failed.");
      setBalance(null);
    }
  };

  const MintToken = async () => {
    try {
      const tx = await mintApprovedToken(projectInfo.tokenId, projectInfo.amount);
      console.log("Mint Token successful ✅", tx);
      setShowModal(false);
    } catch (error) {
      console.error("Error during Minting:", error);
      alert("Minting Failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050F19] via-[#0A1A2F] to-[#0F2A47] overflow-hidden relative flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 60, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 pt-8"
        >
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4"
          >
            Green <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">Credits</span>
          </motion.h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Click on any credit type to flip and mint your verified tokens
          </p>
        </motion.div>
 {/* Balance Checker Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 "
        >
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              Check Token Balance
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Token ID</label>
                <input
                  type="number"
                  value={balanceToken}
                  onChange={(e) => setBalanceToken(e.target.value)}
                  placeholder="Enter Token ID"
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={BalanceOf}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-lg hover:from-blue-600 hover:to-sky-600 transition-all font-semibold text-sm"
              >
                Check Balance
              </motion.button>
            </div>
            
            {balance !== null && (
              <div className="mt-4 text-center bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-gray-300 text-sm">Balance:</p>
                <p className="text-2xl font-bold text-emerald-300">{balance}</p>
              </div>
            )}
          </div>
        </motion.div>
        {/* 4 Cards Grid - Vertical Rectangular Layout */}
        <div className="grid grid-cols-1 mt-11 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
          {GREEN_CREDIT_TYPES.map((card) => (
            <motion.div
              key={card.id}
              className="relative w-full h-80 cursor-pointer" 
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card Container with Flip Animation */}
              <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: flippedCard === card.id ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front of Card */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl border-2 border-white/20 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Card Header */}
                  <div className={`w-full h-28 rounded-t-3xl bg-gradient-to-r ${card.color} relative overflow-hidden flex items-center justify-center`}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-12 -right-12 w-24 h-24 bg-white/10 rounded-full"
                    />
                    <div className="text-center z-10">
                      <div className="text-4xl mb-1">{card.icon}</div>
                      <h2 className="text-xl font-bold text-white">{card.name}</h2>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed text-center">
                        {card.description}
                      </p>
                      
                      <div className={`${card.bgGradient} border ${card.borderColor} rounded-xl p-3 mb-3`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-semibold text-xs">Price</p>
                            <p className="text-emerald-300 text-base font-bold">{card.priceRange}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold text-xs">Demand</p>
                            <p className={`text-sm font-bold ${
                              card.demand === 'Very High' ? 'text-red-300' :
                              card.demand === 'High' ? 'text-orange-300' :
                              card.demand === 'Growing' ? 'text-green-300' : 'text-blue-300'
                            }`}>
                              {card.demand}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <span className="bg-white/5 text-white px-3 py-1 rounded-lg text-xs border border-white/10">
                          {card.stats}
                        </span>
                      </div>
                    </div>

                    <div className="text-center pt-2 border-t border-white/10">
                      <p className="text-emerald-300 text-xs font-semibold">Click to flip and mint →</p>
                    </div>
                  </div>
                </div>

                {/* Back of Card - Minting Side */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl border-2 border-white/20 bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl p-4 flex flex-col justify-between"
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)" 
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                        <span className="text-white text-base">{card.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{card.name}</h3>
                        <p className="text-gray-400 text-xs">Mint Verified Tokens</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-xs mb-4 leading-relaxed">
                      Ready to mint your verified {card.name.toLowerCase()} tokens
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <p className="text-gray-400 text-xs mb-1">Price</p>
                        <p className="text-emerald-300 font-bold text-sm">{card.priceRange}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <p className="text-gray-400 text-xs mb-1">Impact</p>
                        <p className="text-cyan-300 text-xs font-semibold">{card.stats}</p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 text-sm"
                  >
                    🪙 Mint Tokens
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-sm md:text-base">
            💡 Click any card to flip and access minting options
          </p>
        </motion.div>

        {/* Mint Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-2xl border border-white/20 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold text-white mb-4 text-center">
                  Mint Credit Token
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Token ID</label>
                    <input
                      type="number"
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                      placeholder="Enter Token ID"
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Amount (max 1000)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      max="1000"
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all font-semibold text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={MintToken}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all font-semibold text-sm"
                  >
                    Mint Token
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
       
      </div>
    </div>
  );
}