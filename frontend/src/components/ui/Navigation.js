// components/ui/Navigation.js - UPDATED
'use client';
import { useState } from 'react';
import Link from 'next/link';
import WalletConnect from '../web3/WalletConnect';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-primary-dark/95 backdrop-blur-md border-b border-border-color">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Professional Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-emerald rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-semibold text-neutral-white">GreenXchange</span>
              <div className="text-xs text-neutral-gray font-medium">ETH GLOBAL</div>
            </div>
          </Link>

          {/* Professional Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-neutral-white hover:text-accent-emerald transition-colors duration-200 font-medium text-sm">
              Home
            </Link>
            <Link href="/marketplace" className="text-neutral-white hover:text-accent-emerald transition-colors duration-200 font-medium text-sm">
              Marketplace
            </Link>
            <Link href="/portfolio" className="text-neutral-white hover:text-accent-emerald transition-colors duration-200 font-medium text-sm">
              Portfolio
            </Link>
            <Link href="/green-credits" className="text-neutral-white hover:text-accent-emerald transition-colors duration-200 font-medium text-sm">
              Green Credits
            </Link>
            <Link href="/onboarding" className="text-neutral-white hover:text-accent-emerald transition-colors duration-200 font-medium text-sm">
              Onboarding
            </Link>
            
            {/* 🔐 UPDATED VERIFICATION LINK - Stands out for Auditors */}
            <Link 
              href="/verification" 
              className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 hover:text-blue-200 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm group relative overflow-hidden"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">🔍</span>
              <span>Verification</span>
              <span className="text-xs bg-blue-500/40 px-2 py-1 rounded-full border border-blue-400/50">
                Auditors
              </span>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </div>

          {/* Wallet Connect - Desktop */}
          <div className="hidden md:block">
            <WalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-neutral-white p-2 rounded-lg hover:bg-primary-dark2 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Professional Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border-color">
            <div className="space-y-3">
              <Link 
                href="/" 
                className="block text-neutral-white hover:text-accent-emerald transition-colors duration-200 font-medium text-sm py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/marketplace" 
                className="block text-neutral-white hover:text-accent-emerald transition-colors duration-200 font-medium text-sm py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/portfolio" 
                className="block text-neutral-white hover:text-accent-emerald transition-colors duration-200 font-medium text-sm py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link 
                href="/green-credits" 
                className="block text-neutral-white hover:text-accent-emerald transition-colors duration-200 font-medium text-sm py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Green Credits
              </Link>
              <Link 
                href="/onboarding" 
                className="block text-neutral-white hover:text-accent-emerald transition-colors duration-200 font-medium text-sm py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Onboarding
              </Link>
              
              {/* 🔐 UPDATED VERIFICATION LINK - Mobile */}
              <Link 
                href="/verification" 
                className="flex items-center space-x-3 bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-xl font-medium text-sm mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">🔍</span>
                <span>Verification</span>
                <span className="text-xs bg-blue-500/40 px-2 py-1 rounded-full border border-blue-400/50 ml-auto">
                  Auditors
                </span>
              </Link>
              
              {/* Wallet Connect - Mobile */}
              <div className="pt-4 border-t border-border-color">
                <WalletConnect />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}