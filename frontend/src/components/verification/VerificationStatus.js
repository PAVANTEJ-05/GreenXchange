// components/verification/VerificationStatus.js
'use client';
import { useState } from 'react';

const VERIFICATION_STEPS = [
  { id: 1, name: 'Document Submission', status: 'completed', description: 'All project documents uploaded and verified' },
  { id: 2, name: 'KYC Verification', status: 'completed', description: 'Identity and organization verification passed' },
  { id: 3, name: 'Technical Review', status: 'in-progress', description: 'Project feasibility and impact assessment in progress' },
  { id: 4, name: 'Site Audit', status: 'pending', description: 'Physical verification scheduled for next week' },
  { id: 5, name: 'Credit Issuance', status: 'pending', description: 'Green credit NFTs will be minted upon approval' }
];

export default function VerificationStatus() {
  const [currentProject, setCurrentProject] = useState({
    name: 'Rajasthan Solar Park Phase 2',
    type: 'Solar Energy',
    creditsExpected: '5,000',
    auditor: 'GreenVerify International',
    startDate: '2024-01-15'
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verification Status</h2>
          <p className="text-gray-600">Track your project verification progress</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Current Auditor</div>
          <div className="font-semibold text-green-700">{currentProject.auditor}</div>
        </div>
      </div>

      {/* Project Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-green-800 font-medium">Project</div>
            <div className="font-bold text-green-900">{currentProject.name}</div>
          </div>
          <div>
            <div className="text-sm text-green-800 font-medium">Credit Type</div>
            <div className="font-bold text-green-900">{currentProject.type}</div>
          </div>
          <div>
            <div className="text-sm text-green-800 font-medium">Expected Credits</div>
            <div className="font-bold text-green-900">{currentProject.creditsExpected}</div>
          </div>
        </div>
      </div>

      {/* Verification Timeline */}
      <div className="space-y-6">
        {VERIFICATION_STEPS.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.status === 'completed' ? 'bg-green-500 text-white' :
                step.status === 'in-progress' ? 'bg-blue-500 text-white' :
                'bg-gray-300 text-gray-600'
              }`}>
                {getStatusIcon(step.status)}
              </div>
              {index < VERIFICATION_STEPS.length - 1 && (
                <div className={`w-1 h-16 ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{step.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(step.status)}`}>
                  {step.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{step.description}</p>
              
              {step.status === 'in-progress' && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-700">Estimated completion: 2 days</span>
                    <span className="text-sm text-blue-700">65%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              )}

              {step.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="flex items-center text-green-700">
                    <span className="text-sm">Completed on Jan 20, 2024</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex space-x-4 pt-6 border-t border-gray-200">
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Upload Additional Documents
        </button>
        <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          Contact Auditor
        </button>
        <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          View Requirements
        </button>
      </div>
    </div>
  );
}