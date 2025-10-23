// components/onboarding/AuditorMatching.js
'use client';
import { useState } from 'react';

export default function AuditorMatching() {
  const [selectedAuditor, setSelectedAuditor] = useState(null);
  const [matchingStatus, setMatchingStatus] = useState('selecting'); // selecting, matched, completed

  const availableAuditors = [
    {
      id: 1,
      name: 'GreenVerify International',
      specialization: ['Solar', 'Wind', 'Hydro'],
      rating: 4.8,
      projectsCompleted: 124,
      verificationTime: '2-3 days',
      description: 'Specialized in renewable energy projects with global certification standards'
    },
    {
      id: 2,
      name: 'EcoCert Solutions',
      specialization: ['Biomass', 'Carbon', 'Biodiversity'],
      rating: 4.6,
      projectsCompleted: 89,
      verificationTime: '3-4 days',
      description: 'Focus on agricultural and biodiversity credit verification'
    },
    {
      id: 3,
      name: 'Sustainable Audit Partners',
      specialization: ['Solar', 'Geothermal', 'Water'],
      rating: 4.9,
      projectsCompleted: 156,
      verificationTime: '1-2 days',
      description: 'Rapid verification with blockchain integration expertise'
    }
  ];

  const handleAuditorSelect = (auditor) => {
    setSelectedAuditor(auditor);
    setMatchingStatus('matched');
  };

  const confirmVerification = () => {
    setMatchingStatus('completed');
  };

  if (matchingStatus === 'completed') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-800 mb-4">Verification Initiated!</h2>
        <p className="text-gray-600 mb-6">
          Your project has been assigned to {selectedAuditor.name}. 
          They will contact you within 24 hours to begin the verification process.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="font-semibold text-green-800">Next Steps:</h4>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>• Auditor will review your documents</li>
            <li>• Site visit may be scheduled</li>
            <li>• Verification report will be generated</li>
            <li>• Green credits will be minted upon approval</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-green-800 mb-2">Select Verification Auditor</h2>
      <p className="text-gray-600 mb-6">Choose an accredited auditor for your project verification</p>

      {matchingStatus === 'selecting' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableAuditors.map((auditor) => (
            <div
              key={auditor.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleAuditorSelect(auditor)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800">{auditor.name}</h3>
                <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  ⭐ {auditor.rating}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{auditor.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Specialization:</span>
                  <span className="font-medium">{auditor.specialization.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Verification Time:</span>
                  <span className="font-medium">{auditor.verificationTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Projects Completed:</span>
                  <span className="font-medium">{auditor.projectsCompleted}</span>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                Select Auditor
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-blue-800 mb-2">Selected Auditor</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{selectedAuditor.name}</p>
                <p className="text-sm text-blue-600">Rating: ⭐ {selectedAuditor.rating}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Verification Time: {selectedAuditor.verificationTime}</p>
                <p className="text-sm text-blue-600">{selectedAuditor.projectsCompleted} projects completed</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h4 className="font-semibold text-green-800 mb-2">Verification Process</h4>
            <ol className="text-sm text-green-700 space-y-2">
              <li>1. Document review and validation</li>
              <li>2. On-site inspection (if required)</li>
              <li>3. Data analysis and impact assessment</li>
              <li>4. Verification report generation</li>
              <li>5. IPFS storage and hash generation</li>
              <li>6. Green credit NFT minting</li>
            </ol>
          </div>

          <button
            onClick={confirmVerification}
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 font-semibold"
          >
            Confirm & Start Verification Process
          </button>
        </div>
      )}
    </div>
  );
}