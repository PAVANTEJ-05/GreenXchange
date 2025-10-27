// components/ui/Navigation.js 
'use client';
import { useState } from 'react';
import Link from 'next/link';
import WalletConnect from '../web3/WalletConnect';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#050F19] backdrop-blur-xl border-b border-white/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
              <span className="text-white font-bold text-lg">GX</span>
            </div>
            <span className="text-white font-bold text-xl">
              Green<span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">Xchange</span>
            </span>
          </div>

          {/* Enhanced Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white font-medium px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10">
              Home
            </Link>
            <Link href="/marketplace" className="text-white font-medium px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10">
              Marketplace
            </Link>
            {/* <Link href="/portfolio" className="text-white font-medium px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10">
              Portfolio
            </Link> */}
            <Link href="/onboarding" className="text-white font-medium px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10">
              Onboarding
            </Link>
            <Link href="/green-credits" className="text-white font-medium px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10">
              MintCredits
            </Link>
            <Link href="/verification" className="text-white font-medium px-4 py-2 rounded-xl transition-all duration-300 hover:bg-cyan-500/20">
             Verification
            </Link>
          </div>

          {/* Wallet Connect - Desktop */}
          <div className="hidden md:block">
            <WalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/20 mt-4">
            <div className="space-y-4">
              <Link 
                href="/" 
                className="block text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/marketplace" 
                className="block text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/portfolio" 
                className="block text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link 
                href="/onboarding" 
                className="block text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Onboarding
              </Link>
              <Link 
                href="/green-credits" 
                className="block text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Credit Types
              </Link>
              <Link 
                href="/verification" 
                className="block text-white font-medium px-4 py-3 rounded-xl transition-all duration-300 hover:bg-cyan-500/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Auditor Portal
              </Link>
              
              {/* Wallet Connect - Mobile */}
              <div className="pt-4 border-t border-white/20">
                <WalletConnect />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}