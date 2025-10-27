// components/onboarding/DocumentUpload.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerCredit } from "@/contexts/MintToken";

export default function DocumentUpload() {
  const [uploadedDocs, setUploadedDocs] = useState({
    projectProposal: null,
    environmentalImpact: null,
    feasibilityStudy: null,
    financialDocuments: null,
    permits: null
  });

  const router = useRouter();

  const documentTypes = [
    { id: 'projectProposal', name: 'Project Proposal', required: false },
    { id: 'environmentalImpact', name: 'Environmental Impact Assessment', required: false },
    { id: 'feasibilityStudy', name: 'Feasibility Study', required: false },
    { id: 'financialDocuments', name: 'Financial Documents', required: false },
    { id: 'permits', name: 'Government Permits & Licenses', required: false }
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

  const projectInfo = JSON.parse(localStorage.getItem("onboardingProject"));

  const regToken = async () => {
    try {
      const tx = await registerCredit(
        projectInfo.tokenId,
        projectInfo.creditType,
        projectInfo.projectName,
        projectInfo.location,
        projectInfo.certificateHash
      );

      // Wait for transaction confirmation
      // await tx.wait();

      // Redirect after success
      router.push('/verification');
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Transaction failed or rejected.");
    }
  };

  const { uploadedRequired, totalRequired } = getUploadStatus();

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl border border-gray-100">
  {/* rest of your UI unchanged */}
  <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
    <button className="w-full sm:w-auto bg-white text-gray-700 py-3 px-8 rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm">
      Save Draft
    </button>
    <button 
      className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-8 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:shadow-none"
      disabled={uploadedRequired < totalRequired}
      onClick={regToken}
    >
      Submit for Verification
    </button>
  </div>
</div>

  );
}
