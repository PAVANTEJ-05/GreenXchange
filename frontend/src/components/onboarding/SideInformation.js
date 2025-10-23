// components/onboarding/SideInformation.js
'use client';
import { useState, useEffect } from 'react';

const projectFacts = [
  {
    icon: "🌍",
    title: "Global Impact",
    description: "Join 500+ projects across 45 countries reducing carbon emissions",
    stat: "2.5M+ Tons CO₂ Reduced"
  },
  {
    icon: "⚡",
    title: "Renewable Energy",
    description: "Solar, wind, hydro and biomass projects creating clean energy",
    stat: "1.2M MWh Generated"
  },
  {
    icon: "💰",
    title: "Economic Value",
    description: "Turn environmental impact into tradable digital assets",
    stat: "$45M+ Volume Traded"
  },
  {
    icon: "🔒",
    title: "Blockchain Secured",
    description: "Every credit is verified and secured on the blockchain",
    stat: "100% Transparent"
  }
];

const stepInformation = {
  1: {
    title: "About Project Registration",
    points: [
      "Register your renewable energy project",
      "Get verified by accredited auditors", 
      "Start generating green credits",
      "Join our global sustainability network"
    ],
    benefits: [
      "Monetize your environmental impact",
      "Access global carbon markets",
      "Enhance your ESG credentials",
      "Support sustainable development"
    ]
  },
  2: {
    title: "KYC Verification Process",
    points: [
      "Secure identity verification",
      "Business registration validation",
      "AML compliance check",
      "Project ownership confirmation"
    ],
    benefits: [
      "Build trust with investors",
      "Ensure regulatory compliance", 
      "Protect against fraud",
      "Global market access"
    ]
  },
  3: {
    title: "Document Requirements",
    points: [
      "Project feasibility studies",
      "Environmental impact assessments",
      "Technical specifications",
      "Financial projections"
    ],
    benefits: [
      "Streamlined verification",
      "Faster credit issuance",
      "Increased investor confidence",
      "Market credibility"
    ]
  },
  4: {
    title: "Auditor Selection",
    points: [
      "Choose from accredited partners",
      "Global verification standards",
      "Transparent audit process",
      "Quick turnaround times"
    ],
    benefits: [
      "Independent validation",
      "International recognition",
      "Quality assurance",
      "Market acceptance"
    ]
  }
};

export default function SideInformation({ currentStep }) {
  const [currentFact, setCurrentFact] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('side-info');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % projectFacts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentInfo = stepInformation[currentStep] || stepInformation[1];

  return (
    <div id="side-info" className="space-y-8">
      {/* Project Facts Carousel */}
      <div className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <span className="text-emerald-400 mr-2">📊</span>
          GreenXchange Impact
        </h3>
        
        <div className="space-y-4">
          <div key={currentFact} className="animate-fadeIn">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{projectFacts[currentFact].icon}</div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">{projectFacts[currentFact].title}</h4>
                <p className="text-gray-400 text-xs mt-1">{projectFacts[currentFact].description}</p>
                <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-lg px-3 py-2 mt-2">
                  <p className="text-emerald-400 text-sm font-bold">{projectFacts[currentFact].stat}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-4">
            {projectFacts.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentFact ? 'bg-emerald-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step-specific Information */}
      <div className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <span className="text-cyan-400 mr-2">💡</span>
          {currentInfo.title}
        </h3>

        <div className="space-y-4">
          {/* Process Points */}
          <div>
            <h4 className="text-gray-300 text-sm font-semibold mb-2">Process:</h4>
            <ul className="space-y-2">
              {currentInfo.points.map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                  </div>
                  <span className="text-gray-400 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="text-gray-300 text-sm font-semibold mb-2">Benefits:</h4>
            <div className="grid grid-cols-1 gap-2">
              {currentInfo.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-lg px-3 py-2"
                >
                  <p className="text-emerald-400 text-xs font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <span className="text-cyan-400 mr-2">🚀</span>
          Why Choose GreenXchange?
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl text-emerald-400 mb-1">⏱️</div>
            <div className="text-white text-sm font-bold">24-48h</div>
            <div className="text-gray-400 text-xs">Verification</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-cyan-400 mb-1">🌐</div>
            <div className="text-white text-sm font-bold">45+</div>
            <div className="text-gray-400 text-xs">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-emerald-400 mb-1">🛡️</div>
            <div className="text-white text-sm font-bold">100%</div>
            <div className="text-gray-400 text-xs">Secure</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-cyan-400 mb-1">💎</div>
            <div className="text-white text-sm font-bold">500+</div>
            <div className="text-gray-400 text-xs">Projects</div>
          </div>
        </div>
      </div>
    </div>
  );
}