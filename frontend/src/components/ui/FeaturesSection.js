'use client';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturesSection() {
  useEffect(() => {
    gsap.fromTo(".feature-item", 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  const features = [
    {
      icon: "⚡",
      title: "Zero Gas Trading",
      description: "Trade carbon credits with no transaction fees using Yellow SDK state channels"
    },
    {
      icon: "🔒",
      title: "Enterprise Security",
      description: "Institutional-grade security with multi-sig and compliance frameworks"
    },
    {
      icon: "🌐",
      title: "Global Standards",
      description: "Compliant with international carbon credit verification standards"
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description: "Comprehensive dashboard with real-time market data and insights"
    },
    {
      icon: "🔄",
      title: "Instant Settlement",
      description: "Near-instant trade execution with secure on-chain finality"
    },
    {
      icon: "🔍",
      title: "Transparent Audit",
      description: "Fully verifiable on-chain records with IPFS-backed documentation"
    }
  ];

  return (
    <section className="features-section py-24 px-6 bg-primary-dark2">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-white mb-4">
            Enterprise <span className="gradient-text">Features</span>
          </h2>
          <div className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Built for institutions, verified by auditors, trusted by the market
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="feature-item glass-panel rounded-xl p-6 hover-lift">
              <div className="text-2xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-neutral-white mb-3">{feature.title}</h3>
              <div className="text-neutral-gray text-sm leading-relaxed">{feature.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}