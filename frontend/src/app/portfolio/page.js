// app/portfolio/page.js
import PortfolioOverview from '@/components/portfolio/PortfolioOverview';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-black py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Portfolio Dashboard</h1>
              <p className="text-gray-400">Manage your green credit investments and track impact</p>
            </div>
          </div>
        </div>

        {/* Portfolio Content */}
        <PortfolioOverview />
      </div>
    </div>
  );
}