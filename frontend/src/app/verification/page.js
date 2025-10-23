// app/verification/page.js - WITH LOGIN SYSTEM
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentUpload from '@/components/verification/DocumentUpload';
import VerificationWorkflow from '@/components/verification/VerificationWorkflow';
import AuditorOnboarding from '@/components/verification/AuditorOnboarding';
import ComplianceCheck from '@/components/verification/ComplianceCheck';

export default function Verification() {
  const [activeTab, setActiveTab] = useState('workflow');
  const [showAccessModal, setShowAccessModal] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Mock auditor credentials (in real app, this would be from backend)
  const auditorCredentials = [
    { email: 'auditor1@ethglobe.com', password: 'auditor123', name: 'Dr. Rajesh Sharma' },
    { email: 'auditor2@ethglobe.com', password: 'auditor123', name: 'Prof. Anita Patel' },
    { email: 'admin@ethglobe.com', password: 'admin123', name: 'Admin User' }
  ];

  const tabs = [
    { id: 'workflow', label: 'Verification Queue', icon: '⚡' },
    { id: 'upload', label: 'Documents', icon: '📄' },
    { id: 'auditors', label: 'Auditors', icon: '👨‍💼' },
    { id: 'compliance', label: 'Compliance', icon: '🛡️' }
  ];

  const handleAuditorAccess = () => {
    setShowAccessModal(false);
    setShowLogin(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const auditor = auditorCredentials.find(
      cred => cred.email === loginData.email && cred.password === loginData.password
    );

    if (auditor) {
      setIsLoggedIn(true);
      setShowLogin(false);
      // In real app, you would set auth token here
      localStorage.setItem('auditor', JSON.stringify(auditor));
    } else {
      setLoginError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAccessModal(true);
    setLoginData({ email: '', password: '' });
    localStorage.removeItem('auditor');
  };

  // Check if already logged in
  useEffect(() => {
    const savedAuditor = localStorage.getItem('auditor');
    if (savedAuditor) {
      setIsLoggedIn(true);
      setShowAccessModal(false);
      setShowLogin(false);
    }
  }, []);

  // Access Warning Modal
  if (showAccessModal) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 max-w-md w-full relative z-10"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30"
            >
              <span className="text-3xl">🔐</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Auditor Portal
            </h1>
            <p className="text-gray-400">
              Secure Verification Access
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6"
          >
            <div className="flex items-start space-x-3">
              <span className="text-yellow-400 text-lg mt-0.5">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-300 text-sm mb-1">
                  Certified Auditors Only
                </h3>
                <p className="text-yellow-200/80 text-xs">
                  This portal requires auditor credentials for access
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-3 mb-8">
            {[
              'Certified Green Credit Auditor',
              'KYC Verified Identity', 
              'Professional Certification'
            ].map((req, index) => (
              <motion.div
                key={req}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-3 text-sm"
              >
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="text-gray-300">{req}</span>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAuditorAccess}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all"
            >
              Continue to Login
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-700/50 text-gray-300 py-3.5 rounded-xl font-semibold hover:bg-gray-600/50 transition-all border border-gray-600/50"
            >
              Return to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Login Form
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <span className="text-2xl">🔑</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Auditor Login
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access the portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="auditor@ethglobe.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3"
              >
                <p className="text-red-400 text-sm text-center">{loginError}</p>
              </motion.div>
            )}

            {/* Demo Credentials Hint */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
              <p className="text-blue-400 text-xs text-center">
                Demo: auditor1@ethglobe.com / auditor123
              </p>
            </div>

            <div className="space-y-3">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all"
              >
                Login to Portal
              </motion.button>
              
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="w-full bg-gray-700/50 text-gray-300 py-3.5 rounded-xl font-semibold hover:bg-gray-600/50 transition-all border border-gray-600/50"
              >
                Go Back
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // Main Portal (only accessible after login)
  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header with Logout */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <div className="flex justify-between items-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>Back to Home</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-colors border border-red-500/30"
            >
              <span>🚪</span>
              <span>Logout</span>
            </motion.button>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
              <span className="text-2xl">🔍</span>
            </div>
            <h1 className="text-4xl font-bold text-white">
              Verification Portal
            </h1>
          </div>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Welcome back, <span className="text-blue-400 font-semibold">
              {JSON.parse(localStorage.getItem('auditor'))?.name}
            </span>
          </p>
        </motion.div>

        {/* Rest of the portal content remains same */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {/* Stats grid... */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-3 mb-12 justify-center"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-2xl shadow-blue-500/25'
                  : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-blue-500/30'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 mb-8"
        >
          {activeTab === 'upload' && <DocumentUpload />}
          {activeTab === 'workflow' && <VerificationWorkflow />}
          {activeTab === 'auditors' && <AuditorOnboarding />}
          {activeTab === 'compliance' && <ComplianceCheck />}
        </motion.div>
      </div>
    </div>
  );
}