// components/onboarding/DocumentUpload.js
'use client';
import { useState } from 'react';

export default function DocumentUpload() {
  const [uploadedDocs, setUploadedDocs] = useState({
    projectProposal: null,
    environmentalImpact: null,
    feasibilityStudy: null,
    financialDocuments: null,
    permits: null
  });

  const documentTypes = [
    { id: 'projectProposal', name: 'Project Proposal', required: true },
    { id: 'environmentalImpact', name: 'Environmental Impact Assessment', required: true },
    { id: 'feasibilityStudy', name: 'Feasibility Study', required: true },
    { id: 'financialDocuments', name: 'Financial Documents', required: false },
    { id: 'permits', name: 'Government Permits & Licenses', required: true }
  ];

  const handleFileUpload = (docType, file) => {
    setUploadedDocs(prev => ({
      ...prev,
      [docType]: file
    }));
  };

  const getUploadStatus = () => {
    const totalRequired = documentTypes.filter(doc => doc.required).length;
    const uploadedRequired = documentTypes.filter(doc => 
      doc.required && uploadedDocs[doc.id]
    ).length;
    return { uploadedRequired, totalRequired };
  };

  const { uploadedRequired, totalRequired } = getUploadStatus();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Project Documentation</h2>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {uploadedRequired}/{totalRequired} Required Documents
        </div>
      </div>

      <div className="space-y-6">
        {documentTypes.map((doc) => (
          <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">
                {doc.name}
                {doc.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
              {uploadedDocs[doc.id] && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  ✓ Uploaded
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {doc.id === 'projectProposal' && 'Detailed project description, objectives, and implementation plan'}
              {doc.id === 'environmentalImpact' && 'Assessment of environmental benefits and impact measurements'}
              {doc.id === 'feasibilityStudy' && 'Technical and economic feasibility analysis'}
              {doc.id === 'financialDocuments' && 'Financial statements and funding details'}
              {doc.id === 'permits' && 'Required government approvals and licenses'}
            </p>

            <div className="flex items-center space-x-4">
              <input
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                onChange={(e) => handleFileUpload(doc.id, e.target.files[0])}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              
              {uploadedDocs[doc.id] && (
                <span className="text-sm text-green-600 font-medium">
                  {uploadedDocs[doc.id].name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-semibold text-blue-800 mb-2">📁 Document Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Maximum file size: 10MB per document</li>
          <li>• Accepted formats: PDF, DOC, DOCX, JPG, PNG</li>
          <li>• All documents are encrypted and stored on IPFS</li>
          <li>• Verification typically takes 3-5 business days</li>
        </ul>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600">
          Save Draft
        </button>
        <button 
          className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-300"
          disabled={uploadedRequired < totalRequired}
        >
          Submit for Verification
        </button>
      </div>
    </div>
  );
}