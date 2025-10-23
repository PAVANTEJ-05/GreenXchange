// components/sections/VerificationSection.js
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function VerificationSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-primary-dark to-primary-dark2">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-neutral-white mb-6">
            Project Verification
          </h2>
          <p className="text-neutral-gray text-lg max-w-3xl mx-auto">
            Our certified auditors ensure every green credit project meets the highest standards of quality, 
            compliance, and environmental impact through rigorous multi-step verification processes.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {[
            {
              icon: '🔍',
              title: 'Rigorous Audit Process',
              description: 'Multi-step verification by certified environmental auditors'
            },
            {
              icon: '📊',
              title: 'Transparent Tracking',
              description: 'Every verification step documented on blockchain'
            },
            {
              icon: '🛡️',
              title: 'Quality Guarantee',
              description: 'Only verified projects receive green credit certification'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-primary-dark2/50 backdrop-blur-sm rounded-2xl p-8 border border-border-color hover:border-accent-emerald/30 transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-neutral-white mb-4">{feature.title}</h3>
              <p className="text-neutral-gray">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Auditor Access CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-3xl p-12 max-w-4xl mx-auto relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-neutral-white mb-6">
                Auditor Verification Portal
              </h3>
              <p className="text-neutral-gray text-lg mb-8 max-w-2xl mx-auto">
                Access the secure verification portal to review, audit, and approve green credit projects. 
                This area is exclusively for certified auditors.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/verification"
                  className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-blue-500/25"
                >
                  <span className="text-xl">🔐</span>
                  <span>Access Auditor Portal</span>
                </Link>
                
                <div className="text-center sm:text-left">
                  <p className="text-blue-300 text-sm font-medium">Certified Auditors Only</p>
                  <p className="text-neutral-gray text-xs">Requires verified credentials</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}