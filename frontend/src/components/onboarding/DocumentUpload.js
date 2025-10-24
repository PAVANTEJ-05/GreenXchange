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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* rest of your UI unchanged */}
      <div className="mt-6 flex justify-between items-center">
        <button className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600">
          Save Draft
        </button>
        <button 
          className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-300"
          disabled={uploadedRequired < totalRequired}
          onClick={regToken}
        >
          Submit for Verification
        </button>
      </div>
    </div>
  );
}
