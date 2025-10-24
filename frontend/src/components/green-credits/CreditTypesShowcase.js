'use client';
import React, { useState } from "react";
import { mintApprovedToken } from "@/contexts/MintToken";
const GREEN_CREDIT_TYPES = [
  {
    id: 1,
    name: "Carbon Credits",
    icon: "🌳",
    description:
      "Credits representing verified removal or avoidance of CO₂ and other greenhouse gases from the atmosphere.",
    benefits: [
      "CO₂ reduction & climate mitigation",
      "Supports reforestation & carbon capture",
      "Verified offsets for corporate reporting"
    ],
    projects: ["Reforestation", "Soil Carbon Sequestration", "Direct Air Capture (DAC)"],
    priceRange: "$85-110",
    demand: "Very High"
  },
  {
    id: 2,
    name: "Green (Renewable Energy) Credits",
    icon: "⚡",
    description:
      "Credits issued for generation of clean electricity from renewable sources that displace fossil-fuel power.",
    benefits: [
      "Displaces fossil generation",
      "Supports renewable build-out",
      "Reduces grid carbon intensity"
    ],
    projects: ["Solar Farms", "Onshore/Offshore Wind", "Small Hydro & Rooftop Solar"],
    priceRange: "$70-95",
    demand: "High"
  },
  {
    id: 3,
    name: "Water Conservation Credits",
    icon: "💧",
    description:
      "Credits for verified water savings and restoration projects that increase water security and ecosystem health.",
    benefits: [
      "Improves water availability",
      "Protects aquatic ecosystems",
      "Supports sustainable agriculture"
    ],
    projects: ["Efficient Irrigation", "Watershed Restoration", "Rainwater Harvesting"],
    priceRange: "$60-85",
    demand: "Growing"
  },
  {
    id: 4,
    name: "Renewable Resource Credits",
    icon: "♻️",
    description:
      "Credits for renewable resource projects that replace non-renewable inputs and close material loops (bioenergy, circular solutions).",
    benefits: [
      "Reduces fossil feedstock use",
      "Promotes circular economy",
      "Creates local green jobs"
    ],
    projects: ["Biomass-to-energy (sustainably sourced)", "Bio-based materials", "Waste-to-resource initiatives"],
    priceRange: "$65-90",
    demand: "Medium"
  }
];

export default function CreditTypesShowcase() {
  const [selectedType, setSelectedType] = useState(GREEN_CREDIT_TYPES[0]);
  const [showModal, setShowModal] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState("");

  const handleMint = () => {
    if (!tokenId || !amount) {
      alert("Please enter both Token ID and Amount");
      return;
    }
    if (amount > 1000) {
      alert("Maximum mint amount allowed is 1000");
      return;
    }
    console.log("Minting token:", { tokenId, amount });
    alert(`Mint request submitted for Token ID ${tokenId} with amount ${amount}`);
    setShowModal(false);
  };

  const inputinfo ={
    tokenId: tokenId,
    amount: amount
  };

console.log("Mint Input Info:", inputinfo);
    localStorage.setItem('MintInfo', JSON.stringify(inputinfo));
const projectInfo = JSON.parse(localStorage.getItem("MintInfo"));

const MintToken = async () => {
    try {
      const tx = await  mintApprovedToken(
        projectInfo.tokenId,
        projectInfo.amount,
      
      );

      // Wait for transaction confirmation
      // await tx.wait();
      // Redirect after success
      console.log("Mint Token successful ✅", tx);
    
    } catch (error) {
      console.error("Error during Minting:", error);
      alert("Minting Failed.");
    }
  };





  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-green-900 mb-4">
          Green Credit Types
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the diverse range of environmental credits available for trading on our platform. 
          Each credit represents verified environmental benefits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Credit Type List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
            <h3 className="font-semibold text-gray-800 mb-4">Credit Categories</h3>
            <div className="space-y-2">
              {GREEN_CREDIT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedType.id === type.id
                      ? 'bg-green-100 border border-green-300 text-green-800'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.demand} Demand</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Selected Type Details */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{selectedType.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold">{selectedType.name}</h3>
                  <p className="text-green-100">{selectedType.description}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Environmental Benefits</h4>
                    <div className="space-y-2">
                      {selectedType.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Project Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedType.projects.map((project, index) => (
                        <span
                          key={index}
                          className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
                        >
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Market Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Range:</span>
                        <span className="font-bold text-green-600">{selectedType.priceRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Demand:</span>
                        <span className={`font-bold ${
                          selectedType.demand === 'Very High' ? 'text-red-600' :
                          selectedType.demand === 'High' ? 'text-orange-600' :
                          selectedType.demand === 'Growing' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {selectedType.demand}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Verification:</span>
                        <span className="font-bold text-green-600">Required</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Trading Volume</h4>
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full w-full"></div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Mint Approved Credit Token
                </button>
                <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold">
                  Learn About Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Mint Your Approved Credit Token
            </h2>

            <div className="mb-3">
              <label className="block text-gray-700 mb-1">Token ID</label>
              <input
                type="number"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="Enter Token ID"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Amount (max 1000)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                max="1000"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-200"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={MintToken}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Mint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
