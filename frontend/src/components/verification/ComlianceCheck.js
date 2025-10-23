// components/verification/ComplianceCheck.js
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ComplianceCheck() {
  const [complianceChecks, setComplianceChecks] = useState([
    {
      id: 1,
      requirement: 'KYC Verification',
      status: 'passed',
      description: 'Identity verification completed',
      lastCheck: '2024-01-15',
      nextDue: '2025-01-15'
    },
    {
      id: 2,
      requirement: 'AML Screening',
      status: 'passed',
      description: 'Anti-money laundering check',
      lastCheck: '2024-01-10',
      nextDue: '2024-07-10'
    },
    {
      id: 3,
      requirement: 'Environmental Compliance',
      status: 'pending',
      description: 'Environmental impact assessment',
      lastCheck: '2024-01-12',
      nextDue: '2024-04-12'
    },
    {
      id: 4,
      requirement: 'Carbon Accounting Standards',
      status: 'failed',
      description: 'GHG protocol compliance',
      lastCheck: '2024-01-08',
      nextDue: '2024-02-08'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'text-green-400 bg-green-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-400">12</div>
          <div className="text-gray-300 text-sm">Passed Checks</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">❌</div>
          <div className="text-2xl font-bold text-red-400">2</div>
          <div className="text-gray-300 text-sm">Failed Checks</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-2xl font-bold text-yellow-400">3</div>
          <div className="text-gray-300 text-sm">Pending</div>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-cyan-400">85%</div>
          <div className="text-gray-300 text-sm">Compliance Score</div>
        </div>
      </motion.div>

      {/* Detailed Compliance List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Compliance Requirements</h3>
        
        <div className="space-y-4">
          {complianceChecks.map((check) => (
            <motion.div
              key={check.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {getStatusIcon(check.status)}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{check.requirement}</h4>
                  <p className="text-gray-400 text-sm">{check.description}</p>
                  <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                    <span>Last: {check.lastCheck}</span>
                    <span>Next: {check.nextDue}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                  {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                </span>
                <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Audit Trail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Audit Trail</h3>
        
        <div className="space-y-3">
          {[
            { action: 'KYC Verification Completed', user: 'System', timestamp: '2024-01-15 14:30', status: 'success' },
            { action: 'AML Screening Passed', user: 'Compliance Bot', timestamp: '2024-01-15 14:25', status: 'success' },
            { action: 'Environmental Review Started', user: 'Dr. Sharma', timestamp: '2024-01-15 14:20', status: 'info' },
            { action: 'Carbon Accounting Failed', user: 'Audit System', timestamp: '2024-01-15 14:15', status: 'error' }
          ].map((log, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-800/20 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                log.status === 'success' ? 'bg-green-400' :
                log.status === 'error' ? 'bg-red-400' : 'bg-cyan-400'
              }`} />
              <div className="flex-1">
                <p className="text-white text-sm">{log.action}</p>
                <p className="text-gray-400 text-xs">By {log.user} at {log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}