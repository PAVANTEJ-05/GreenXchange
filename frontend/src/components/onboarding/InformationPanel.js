// components/onboarding/InformationPanel.js
'use client';
import { useState, useEffect } from 'react';

const stepInstructions = {
  1: {
    title: "Project Information Required",
    description: "We need details about your green energy project to create verifiable credits",
    fields: [
      {
        name: "Project Name & Location",
        purpose: "Identify and locate your project for verification",
        example: "e.g., Rajasthan Solar Park, India"
      },
      {
        name: "Project Type & Capacity", 
        purpose: "Determine credit type and environmental impact",
        example: "e.g., Solar Farm, 50MW capacity"
      },
      {
        name: "Expected Credits",
        purpose: "Estimate annual green credit generation",
        example: "e.g., 5,000 credits per year"
      }
    ],
    tips: [
      "Have your project documents ready",
      "Be specific about location and capacity",
      "Provide accurate energy production estimates"
    ]
  },
  2: {
    title: "Identity Verification",
    description: "Secure KYC process to ensure project ownership and compliance",
    fields: [
      {
        name: "Personal/Business Details",
        purpose: "Verify identity and organization legitimacy",
        example: "Legal name, tax ID, business registration"
      },
      {
        name: "Document Upload",
        purpose: "Proof of identity and business ownership",
        example: "Passport, business license, utility bills"
      }
    ],
    tips: [
      "Use clear, readable documents",
      "Ensure documents are not expired",
      "Business documents must match application details"
    ]
  },
  3: {
    title: "Project Documentation",
    description: "Technical documents required for project verification",
    fields: [
      {
        name: "Technical Specifications",
        purpose: "Verify project feasibility and technology",
        example: "Equipment specs, installation details"
      },
      {
        name: "Environmental Impact", 
        purpose: "Calculate carbon reduction and environmental benefits",
        example: "Emission reports, impact assessments"
      }
    ],
    tips: [
      "Include all relevant certifications",
      "Provide detailed technical data",
      "Environmental reports should be recent"
    ]
  },
  4: {
    title: "Auditor Selection",
    description: "Choose verification partner for independent validation",
    fields: [
      {
        name: "Auditor Profile Review",
        purpose: "Select accredited verification partner",
        example: "Review ratings, specialization, turnaround time"
      }
    ],
    tips: [
      "Check auditor specialization matches your project type",
      "Consider verification timeline requirements",
      "Review past project success rates"
    ]
  }
};

export default function InformationPanel({ currentStep, onStart }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [currentStep]);

  const currentInstructions = stepInstructions[currentStep] || stepInstructions[1];

  return (
    <div className={`space-y-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Main Instruction Card */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">💡</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{currentInstructions.title}</h3>
            <p className="text-gray-400 text-sm">{currentInstructions.description}</p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span>Start Filling Information</span>
          <span className="text-lg">📝</span>
        </button>
      </div>

      {/* Required Fields */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6">
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <span className="text-emerald-400 mr-2">📋</span>
          Information You'll Need
        </h4>
        
        <div className="space-y-4">
          {currentInstructions.fields.map((field, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-xs font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-white font-medium text-sm mb-1">{field.name}</h5>
                  <p className="text-gray-400 text-xs mb-2">{field.purpose}</p>
                  <div className="bg-black/50 rounded px-3 py-2 border border-gray-700">
                    <p className="text-emerald-400 text-xs font-mono">{field.example}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Helpful Tips */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6">
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <span className="text-cyan-400 mr-2">💎</span>
          Helpful Tips
        </h4>
        
        <div className="space-y-2">
          {currentInstructions.tips.map((tip, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
              <span className="text-gray-400 text-sm">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}