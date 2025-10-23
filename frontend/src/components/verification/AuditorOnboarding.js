// components/verification/AuditorOnboarding.js
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AuditorOnboarding() {
  const [auditors, setAuditors] = useState([
    {
      id: 1,
      name: 'Dr. Rajesh Sharma',
      specialization: 'Renewable Energy',
      experience: '15 years',
      status: 'verified',
      completed: 47,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Prof. Anita Patel',
      specialization: 'Environmental Science',
      experience: '12 years',
      status: 'verified',
      completed: 32,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Mr. Amit Kumar',
      specialization: 'Carbon Accounting',
      experience: '8 years',
      status: 'pending',
      completed: 0,
      rating: 0
    }
  ]);

  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    credentials: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new auditor to the list
    const newAuditor = {
      id: Date.now(),
      name: formData.name,
      specialization: formData.specialization,
      experience: formData.experience,
      status: 'pending',
      completed: 0,
      rating: 0
    };
    setAuditors(prev => [...prev, newAuditor]);
    setShowOnboardingForm(false);
    setFormData({ name: '', email: '', specialization: '', experience: '', credentials: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h3 className="text-xl font-bold text-white">Auditor Network</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowOnboardingForm(true)}
          className="bg-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
        >
          + Add Auditor
        </motion.button>
      </motion.div>

      {/* Onboarding Form */}
      {showOnboardingForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6"
        >
          <h4 className="text-lg font-bold text-white mb-4">New Auditor Onboarding</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              >
                <option value="">Select Specialization</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Environmental Science">Environmental Science</option>
                <option value="Carbon Accounting">Carbon Accounting</option>
                <option value="Forestry">Forestry</option>
                <option value="Water Resources">Water Resources</option>
              </select>
              <input
                type="text"
                placeholder="Years of Experience"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>
            <textarea
              placeholder="Professional Credentials & Certifications"
              value={formData.credentials}
              onChange={(e) => setFormData({...formData, credentials: e.target.value})}
              rows="3"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => setShowOnboardingForm(false)}
                className="bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Auditors Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {auditors.map((auditor) => (
          <motion.div
            key={auditor.id}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                {auditor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h4 className="text-white font-semibold text-lg">{auditor.name}</h4>
              <p className="text-cyan-400 text-sm">{auditor.specialization}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Experience:</span>
                <span className="text-white">{auditor.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`${
                  auditor.status === 'verified' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {auditor.status === 'verified' ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Projects:</span>
                <span className="text-white">{auditor.completed}</span>
              </div>
              {auditor.rating > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating:</span>
                  <span className="text-yellow-400">⭐ {auditor.rating}</span>
                </div>
              )}
            </div>
            
            <button className="w-full mt-4 bg-cyan-500/20 text-cyan-400 py-2 rounded-lg hover:bg-cyan-500/30 transition-colors">
              View Profile
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}