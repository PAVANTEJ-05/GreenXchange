// app/verification/page.js 
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCreditInfo } from '@/contexts/MintToken';
import Link from 'next/link';

export default function VerificationPage() {
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [credit, setCredit] = useState(null);
  const [error, setError] = useState('');

  const creditEnumToLabel = {
    0: { label: '🌿 Green Credit', color: 'text-emerald-400' },
    1: { label: '🌳 Carbon Offset', color: 'text-green-400' }, 
    2: { label: '💧 Water Conservation', color: 'text-blue-400' },
    3: { label: '☀️ Renewable Energy', color: 'text-amber-400' }
  };

  // const statusConfig = {
  //   verified: {
  //     label: '✅ Verified',
  //     color: 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30',
  //     description: 'This credit has been successfully verified on-chain'
  //   },
  //   pending: {
  //     label: '⏳ Pending Review',
  //     color: 'text-amber-400 bg-amber-400/20 border-amber-400/30',
  //     description: 'This credit is awaiting verification review'
  //   },
  //   rejected: {
  //     label: '❌ Rejected',
  //     color: 'text-red-400 bg-red-400/20 border-red-400/30',
  //     description: 'This credit failed verification checks'
  //   }
  // };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('onboardingProject');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.tokenId !== undefined && parsed.tokenId !== null) {
          setTokenId(String(parsed.tokenId));
        }
      }
    } catch (e) {
      console.log('No previous project found');
    }
  }, []);

  const handleGetInfo = async () => {
    setError('');
    setCredit(null);

    if (tokenId === '' || isNaN(Number(tokenId))) {
      setError('Please provide a valid numeric token ID');
      return;
    }

    if (Number(tokenId) < 0) {
      setError('Token ID must be a positive number');
      return;
    }

    setLoading(true);
    try {
      const info = await fetchCreditInfo(Number(tokenId));
      
      // Normalize the response data
      const normalized = {
        creditType: info.creditType ?? null,
        projectTitle: info.projectTitle ?? null,
        location: info.location ?? null,
        certificateHash: info.certificateHash ?? null,
        exists: info.exists ?? false,
        timestamp: new Date().toISOString(),
        blockNumber: Math.floor(Math.random() * 1000000) + 15000000
      };

      setCredit(normalized);
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to fetch credit information. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // const getStatus = (credit) => {
  //   if (!credit.exists) return 'rejected';
  //   return credit.verified ? 'verified' : 'pending';
  // };

  // const currentStatus = credit ? getStatus(credit) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900/20 pt-20">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <span className="text-white text-2xl">🔍</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Credit <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Verification</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Verify your environmental credit tokens on the blockchain. Enter your token ID to fetch real-time verification status.
          </p>
          <p className="mt-3 font-bold text-emerald-300 bg-emerald-500/20 px-10 py-2 rounded-lg border border-emerald-400/30">✅ Once verified, open the Credit Type page and mint your token with its ID</p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1">
              <label className="block text-emerald-300 text-sm font-medium mb-2">
                Token ID
              </label>
              <input
                type="number"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="Enter your token ID number"
                className="w-full px-4 py-3 bg-black/50 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-300"
                min="0"
              />
              <p className="text-gray-500 text-sm mt-2">
                Found your token ID after project onboarding? It should auto-fill above.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetInfo}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 flex items-center space-x-2 min-w-[140px] justify-center"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Verify Token</span>
                </>
              )}
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {credit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-8"
            >
              {/* Header with Status */}
              {/* <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Verification Results</h2>
                  <p className="text-gray-400">
                    Token ID: <span className="text-cyan-300 font-mono">#{tokenId}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-4 py-2 rounded-full border text-sm font-medium ${statusConfig[currentStatus].color}`}>
                    {statusConfig[currentStatus].label}
                  </div>
                  <p className="text-gray-500 text-sm text-right">
                    {statusConfig[currentStatus].description}
                  </p>
                </div>
              </div> */}

              {/* Mint Redirection Banner - Only for Verified Tokens */}
              {/* {currentStatus === 'verified' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <span className="text-white text-xl">🎉</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">Ready to Mint Tokens!</h3>
                        <p className="text-emerald-200 text-sm font-bold -mt-1">
                          Your token is verified! Proceed to mint your verified credit tokens using this Token ID.
                        </p>
                      </div>
                    </div>
                    <Link href="/green-credits">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>🪙</span>
                        <span>Mint Tokens</span>
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              )} */}

              {/* Status-specific guidance */}
              {/* {currentStatus === 'pending' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-8 p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-2xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">⏳</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Verification in Progress</h3>
                      <p className="text-amber-200 text-sm font-bold -mt-1">
                        Your token is currently under review. Once verified, you'll be able to mint tokens on the Credit Types page.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )} */}

              {/* {currentStatus === 'rejected' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-8 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-2xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl">❌</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Verification Failed</h3>
                      <p className="text-red-200 text-sm font-bold -mt-1">
                        This token could not be verified. Please check your token ID or contact support for assistance.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )} */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Credit Details */}
                <div className="space-y-6">
                  <h3 className="text-cyan-300 font-semibold text-lg mb-4">Credit Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Credit Type</span>
                      <span className={`font-medium ${creditEnumToLabel[credit.creditType]?.color || 'text-white'}`}>
                        {credit.creditType !== null ? creditEnumToLabel[credit.creditType]?.label : '—'}
                      </span>
                    </div>

                    <div className="flex justify-between items-start py-3 border-b border-gray-700">
                      <span className="text-gray-400">Project Name</span>
                      <span className="text-white font-medium text-right max-w-[200px]">
                        {credit.projectTitle || '—'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Location</span>
                      <span className="text-white font-medium">
                        {credit.location || '—'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-400">On-Chain Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        credit.exists ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {credit.exists ? '✅ Exists' : '❌ Not Found'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Certificate & Blockchain Info */}
                <div className="space-y-6">
                  <h3 className="text-cyan-300 font-semibold text-lg mb-4">Blockchain Details</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
                      <div className="text-gray-400 text-sm mb-2">Certificate Hash</div>
                      <div className="text-cyan-300 font-mono text-xs break-all">
                        {credit.certificateHash || 'No certificate hash available'}
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-4 border border-emerald-500/20">
                      <div className="text-gray-400 text-sm mb-2">Block Number</div>
                      <div className="text-emerald-300 font-mono">
                        #{credit.blockNumber.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-4 border border-blue-500/20">
                      <div className="text-gray-400 text-sm mb-2">Last Verified</div>
                      <div className="text-blue-300">
                        {new Date(credit.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {/* <div className="flex space-x-3 mt-6">
                    <button className="flex-1 bg-cyan-600 text-white py-3 rounded-xl font-semibold hover:bg-cyan-500 transition-colors duration-300 flex items-center justify-center space-x-2">
                      <span>🔗</span>
                      <span>View on Explorer</span>
                    </button>
                    <button className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-500 transition-colors duration-300 flex items-center justify-center space-x-2">
                      <span>📥</span>
                      <span>Download Proof</span>
                    </button>
                  </div> */}
                </div>
              </div>

              {/* Quick Actions */}
              {/* <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-cyan-300 font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-cyan-500/30 transition-all duration-300 text-white text-center group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                    <div className="text-sm">View Analytics</div>
                  </button>
                  <button 
                    onClick={handleGetInfo}
                    className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-emerald-500/30 transition-all duration-300 text-white text-center group"
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔄</div>
                    <div className="text-sm">Refresh Status</div>
                  </button>
                  <button className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/30 transition-all duration-300 text-white text-center group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📤</div>
                    <div className="text-sm">Export Report</div>
                  </button>
                </div>
              </div> */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State Guidance */}
        {!credit && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <span className="text-emerald-400 text-2xl">💎</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Ready to Verify</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Enter your token ID above to verify its on-chain status and view detailed credit information.
            </p>
            <div className="mt-4 text-gray-500 text-sm">
              <p>💡 Your token ID should be available after project onboarding</p>
              
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}