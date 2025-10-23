// components/sections/PlatformFeatures.js
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PlatformFeatures() {
  const features = [
    {
      icon: "🔒",
      title: "Blockchain Security",
      description: "Every green credit is minted as an NFT on Ethereum, ensuring tamper-proof ownership and transparent transaction history.",
      details: [
        "Immutable ownership records",
        "Transparent verification history",
        "Secure smart contract execution"
      ]
    },
    {
      icon: "🌿",
      title: "Green Credit Verification",
      description: "All credits undergo rigorous verification by accredited environmental auditors before being tokenized.",
      details: [
        "Third-party auditor verification",
        "IPFS document storage",
        "Real-time impact tracking"
      ]
    },
    {
      icon: "⚡",
      title: "Instant Trading",
      description: "Trade green credits instantly with our off-chain order book powered by Yellow SDK for zero gas fees.",
      details: [
        "Off-chain order matching",
        "Instant settlement",
        "Zero gas fees during trading"
      ]
    },
    {
      icon: "📊",
      title: "Portfolio Management",
      description: "Track your environmental impact and investment performance with real-time analytics and reporting.",
      details: [
        "Real-time portfolio tracking",
        "CO₂ reduction metrics",
        "Investment performance analytics"
      ]
    }
  ];

  const securityFeatures = [
    {
      title: "Smart Contract Audits",
      description: "All contracts undergo multiple security audits by leading blockchain security firms.",
      icon: "🛡️"
    },
    {
      title: "IPFS Document Storage",
      description: "Verification documents stored on decentralized IPFS for permanent, tamper-proof records.",
      icon: "📁"
    },
    {
      title: "KYC/AML Compliance",
      description: "Full regulatory compliance with global KYC and anti-money laundering standards.",
      icon: "📝"
    },
    {
      title: "Multi-Signature Wallets",
      description: "Secure multi-sig wallet infrastructure for enhanced fund protection.",
      icon: "💰"
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How <span className="text-cyan-400">GreenXchange</span> Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A seamless, secure platform for trading verified environmental credits with blockchain transparency and institutional-grade security.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-800 p-6 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-cyan-300">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-2xl border border-cyan-500/20 p-8 mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Security</h3>
            <p className="text-cyan-200 text-lg">
              Your investments and environmental impact are protected by multiple layers of security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/onboarding"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-cyan-600 hover:to-emerald-600 transition-all duration-300"
            >
              Start Your Project
            </Link>
            <Link 
              href="/portfolio"
              className="border border-cyan-500 text-cyan-400 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-cyan-500/10 transition-all duration-300"
            >
              Explore Portfolio
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}