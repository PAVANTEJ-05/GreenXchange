// components/projects/ProjectCard.js
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProjectCard({ project }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'solar': return '☀️';
      case 'wind': return '💨';
      case 'forestry': return '🌳';
      case 'water': return '💧';
      default: return '🌱';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-cyan-500/30 transition-all duration-300 group"
    >
      {/* Project Image */}
      <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-20">{getCategoryIcon(project.category)}</span>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>

        {/* Funding Progress */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-full p-1">
            <div className="flex justify-between text-xs text-white mb-1 px-2">
              <span>Funding</span>
              <span>{project.funding}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.funding}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Category and Location */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getCategoryIcon(project.category)}</span>
            <span className="text-gray-400 text-sm capitalize">{project.category}</span>
          </div>
          <div className="text-gray-400 text-sm flex items-center space-x-1">
            <span>📍</span>
            <span>{project.location}</span>
          </div>
        </div>

        {/* Project Name */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {project.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Impact Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">
              {project.impact.co2Reduction > 1000 
                ? `${(project.impact.co2Reduction / 1000).toFixed(0)}K`
                : project.impact.co2Reduction
              }
            </div>
            <div className="text-gray-400 text-xs">tons CO₂</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-400">
              {project.investors}
            </div>
            <div className="text-gray-400 text-xs">investors</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {project.verification.split(' ')[0]}
            </div>
            <div className="text-gray-400 text-xs">standard</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-xs"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-lg text-xs">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Team Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs">🏢</span>
            </div>
            <div>
              <div className="text-white text-sm font-medium">{project.team.name}</div>
              <div className="text-gray-400 text-xs">{project.team.experience} experience</div>
            </div>
          </div>
          {project.team.verified && (
            <div className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30">
              Verified
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          href={`/projects/${project.id}`}
          className="w-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-cyan-400 py-3 rounded-xl font-semibold hover:from-emerald-500/20 hover:to-cyan-500/20 transition-all duration-300 border border-cyan-500/20 hover:border-cyan-500/40 flex items-center justify-center space-x-2 group"
        >
          <span>View Project Details</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </motion.div>
  );
}