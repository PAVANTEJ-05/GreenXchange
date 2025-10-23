// app/projects/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Mock data - in real app, this would come from API
const projectData = {
  1: {
    id: 1,
    name: 'Rajasthan Solar Farm',
    description: 'Large-scale solar power generation project in the Thar Desert, providing clean energy to 50,000 households and displacing fossil fuel-based power generation.',
    fullDescription: `The Rajasthan Solar Farm is a groundbreaking renewable energy project located in the heart of the Thar Desert. Spanning over 500 hectares, this solar farm utilizes state-of-the-art photovoltaic technology to generate clean, sustainable electricity.

Key Features:
• 250 MW installed capacity
• Advanced single-axis tracking systems
• Water-free robotic cleaning technology
• Grid-connected with smart distribution

Environmental Impact:
This project displaces approximately 45,000 tons of CO₂ emissions annually by replacing coal-based power generation. It contributes significantly to India's renewable energy targets and provides reliable electricity to rural communities.`,
    category: 'solar',
    status: 'verified',
    location: 'Jaisalmer, Rajasthan, India',
    coordinates: { lat: 26.9157, lng: 70.9083 },
    impact: {
      co2Reduction: 45000,
      energyProduced: 120,
      householdsPowered: 50000,
      jobsCreated: 250,
      landUsed: 500,
      lifetime: 25
    },
    images: [
      '/projects/solar-farm-1.jpg',
      '/projects/solar-farm-2.jpg',
      '/projects/solar-farm-3.jpg'
    ],
    verification: {
      standard: 'Gold Standard',
      level: 'Premium',
      date: '2024-01-15',
      auditor: 'Dr. Rajesh Sharma',
      report: 'https://ipfs.io/ipfs/QmVerificationHash'
    },
    funding: {
      target: 5000000,
      raised: 4250000,
      investors: 234,
      deadline: '2024-06-30'
    },
    team: {
      name: 'Green Energy India',
      description: 'A leading renewable energy developer with 8 years of experience in solar project development.',
      members: [
        { name: 'Amit Kumar', role: 'Project Director', experience: '12 years' },
        { name: 'Priya Sharma', role: 'Environmental Specialist', experience: '8 years' },
        { name: 'Rohan Patel', role: 'Technical Lead', experience: '10 years' }
      ],
      verified: true,
      website: 'https://greenenergyindia.com'
    },
    documents: [
      { name: 'Environmental Impact Assessment', type: 'PDF', size: '2.4 MB' },
      { name: 'Technical Specifications', type: 'PDF', size: '1.8 MB' },
      { name: 'Financial Projections', type: 'XLSX', size: '3.2 MB' }
    ],
    tags: ['Solar', 'Renewable Energy', 'Carbon Offset', 'Grid Connected', 'Large Scale'],
    credits: {
      available: 45000,
      price: 45,
      retired: 12000
    }
  }
};

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const projectId = params.id;
    setProject(projectData[projectId]);
  }, [params.id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading project...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'solar': return '☀️';
      case 'wind': return '💨';
      case 'forestry': return '🌳';
      case 'water': return '💧';
      default: return '🌱';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-gray-400 mb-8"
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>›</span>
          <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
          <span>›</span>
          <span className="text-white">{project.name}</span>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 rounded-3xl border border-gray-700/50 p-8 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Image */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl h-64 flex items-center justify-center">
                <span className="text-8xl opacity-30">{getCategoryIcon(project.category)}</span>
              </div>
            </div>

            {/* Project Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(project.category)}</span>
                    <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                  </div>
                  <p className="text-gray-400 text-lg">{project.description}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{project.impact.co2Reduction.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">tons CO₂/year</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{project.impact.householdsPowered.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">households</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{project.impact.energyProduced} MW</div>
                  <div className="text-gray-400 text-sm">capacity</div>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Funding Progress</span>
                  <span>{Math.round((project.funding.raised / project.funding.target) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(project.funding.raised / project.funding.target) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-3 rounded-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>${project.funding.raised.toLocaleString()} raised</span>
                  <span>${project.funding.target.toLocaleString()} target</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all">
                  Invest in Project
                </button>
                <button className="border border-gray-600 text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all">
                  Contact Team
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex overflow-x-auto space-x-1 mb-8 bg-gray-800/30 rounded-xl p-1 border border-gray-700/50"
        >
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'impact', label: 'Impact', icon: '🌍' },
            { id: 'team', label: 'Team', icon: '👥' },
            { id: 'documents', label: 'Documents', icon: '📋' },
            { id: 'verification', label: 'Verification', icon: '✅' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 rounded-3xl border border-gray-700/50 p-8"
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Project Overview</h2>
              <div className="prose prose-invert max-w-none">
                {project.fullDescription.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-300 mb-4">{paragraph}</p>
                ))}
              </div>
              
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-700/30 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">📍 Location Details</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Region:</strong> {project.location}</p>
                    <p><strong>Coordinates:</strong> {project.coordinates.lat}, {project.coordinates.lng}</p>
                    <p><strong>Land Area:</strong> {project.impact.landUsed} hectares</p>
                  </div>
                </div>
                
                <div className="bg-gray-700/30 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">📈 Project Timeline</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Project Lifetime:</strong> {project.impact.lifetime} years</p>
                    <p><strong>Verification Date:</strong> {project.verification.date}</p>
                    <p><strong>Funding Deadline:</strong> {project.funding.deadline}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Environmental Impact</h2>
              {/* Impact visualization will go here */}
              <div className="text-center py-12 text-gray-400">
                Impact visualization charts coming soon...
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Project Team</h2>
              <div className="space-y-6">
                {project.team.members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-gray-700/30 rounded-2xl p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                      <p className="text-cyan-400">{member.role}</p>
                      <p className="text-gray-400 text-sm">{member.experience} experience</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Project Documents</h2>
              <div className="space-y-3">
                {project.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700/30 rounded-2xl p-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">📄</span>
                      <div>
                        <h3 className="text-white font-medium">{doc.name}</h3>
                        <p className="text-gray-400 text-sm">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Verification Details</h2>
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Verification Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Standard:</span>
                        <span className="text-white">{project.verification.standard}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level:</span>
                        <span className="text-green-400">{project.verification.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-white">{project.verification.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auditor:</span>
                        <span className="text-white">{project.verification.auditor}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Verification Report</h3>
                    <p className="text-gray-300 mb-4">
                      Full verification report available on IPFS for transparent audit trail.
                    </p>
                    <button className="bg-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-colors">
                      View Full Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}