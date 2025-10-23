// components/onboarding/KYCVertification.js
'use client';
import { useState } from 'react';

export default function KYCVertification({ onNext, onBack }) {
  const [kycData, setKycData] = useState({
    fullName: '',
    organization: '',
    taxId: '',
    country: '',
    documentType: '',
    documentFile: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('KYC Data Submitted:', kycData);
    localStorage.setItem('onboardingKYC', JSON.stringify(kycData));
    if (onNext) onNext();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKycData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setKycData(prev => ({
      ...prev,
      documentFile: file ? file.name : null
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-green-800 mb-6">KYC Verification</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={kycData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization *</label>
              <input
                type="text"
                name="organization"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={kycData.organization}
                onChange={handleChange}
                placeholder="Company or organization name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax ID/Business Number *</label>
              <input
                type="text"
                name="taxId"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={kycData.taxId}
                onChange={handleChange}
                placeholder="Tax identification number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Country *</label>
              <input
                type="text"
                name="country"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={kycData.country}
                onChange={handleChange}
                placeholder="Country of operation"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Identity Document Type *</label>
            <select
              name="documentType"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={kycData.documentType}
              onChange={handleChange}
            >
              <option value="">Select Document Type</option>
              <option value="passport">Passport</option>
              <option value="drivers_license">Driver's License</option>
              <option value="national_id">National ID</option>
              <option value="business_license">Business License</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Document *</label>
            <input
              type="file"
              required
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.png,.doc,.docx"
            />
            {kycData.documentFile && (
              <p className="text-sm text-green-600 mt-2">
                Selected: {kycData.documentFile}
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-700">
              🔒 Your documents are encrypted and stored securely. We comply with global KYC/AML regulations.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
            >
              Continue to Documents
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}