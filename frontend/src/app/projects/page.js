// app/projects/page.js - UPDATED
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilters from '@/components/projects/ProjectFilters';

export default function ProjectsDirectory() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    location: 'all',
    impact: 'all'
  });

  // Mock projects data
  useEffect(() => {
    const mockProjects = [
      {
        id: 1,
        name: 'Rajasthan Solar Farm',
        description: 'Large-scale solar power generation project in the Thar Desert, providing clean energy to 50,000 households.',
        category: 'solar',
        status: 'verified',
        location: 'India',
        impact: {
          co2Reduction: 45000,
          energyProduced: 120,
          householdsPowered: 50000
        },
        image: '/projects/solar-farm.jpg',
        verification: 'Gold Standard',
        funding: 85,
        investors: 234,
        tags: ['Solar', 'Renewable Energy', 'Carbon Offset'],
        team: {
          name: 'Green Energy India',
          verified: true,
          experience: '8 years'
        }
      },
      {
        id: 2,
        name: 'Himalayan Wind Power',
        description: 'Wind energy project in the Himalayan foothills harnessing high-altitude winds for sustainable power.',
        category: 'wind',
        status: 'verified',
        location: 'Nepal',
        impact: {
          co2Reduction: 32000,
          energyProduced: 85,
          householdsPowered: 35000
        },
        image: '/projects/wind-power.jpg',
        verification: 'Verified Carbon Standard',
        funding: 92,
        investors: 187,
        tags: ['Wind', 'High-Altitude', 'Clean Energy'],
        team: {
          name: 'Mountain Renewables',
          verified: true,
          experience: '6 years'
        }
      },
      {
        id: 3,
        name: 'Western Ghats Reforestation',
        description: 'Large-scale afforestation project restoring native forests and biodiversity in the Western Ghats.',
        category: 'forestry',
        status: 'pending',
        location: 'India',
        impact: {
          co2Reduction: 75000,
          treesPlanted: 250000,
          biodiversityIndex: 85
        },
        image: '/projects/reforestation.jpg',
        verification: 'In Review',
        funding: 45,
        investors: 89,
        tags: ['Reforestation', 'Biodiversity', 'Carbon Sequestration'],
        team: {
          name: 'Eco Restoration Foundation',
          verified: true,
          experience: '12 years'
        }
      },
      {
        id: 4,
        name: 'Ganges River Cleanup',
        description: 'Water conservation and purification project restoring the Ganges river ecosystem.',
        category: 'water',
        status: 'verified',
        location: 'India',
        impact: {
          co2Reduction: 15000,
          waterPurified: 5000000,
          communitiesServed: 25
        },
        image: '/projects/water-cleanup.jpg',
        verification: 'Gold Standard',
        funding: 78,
        investors: 156,
        tags: ['Water Conservation', 'Ecosystem', 'Community'],
        team: {
          name: 'Aqua Pure Initiatives',
          verified: true,
          experience: '10 years'
        }
      }
    ];

    setProjects(mockProjects);
    setFilteredProjects(mockProjects);
    setLoading(false);
  }, []);

  // Filter projects based on search and filters
  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(project => project.category === filters.category);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    setFilteredProjects(filtered);
  }, [filters, projects]);

  const categories = [
    { id: 'all', name: 'All Projects', count: projects.length },
    { id: 'solar', name: 'Solar Energy', count: projects.filter(p => p.category === 'solar').length },
    { id: 'wind', name: 'Wind Energy', count: projects.filter(p => p.category === 'wind').length },
    { id: 'forestry', name: 'Forestry', count: projects.filter(p => p.category === 'forestry').length },
    { id: 'water', name: 'Water Conservation', count: projects.filter(p => p.category === 'water').length }
  ];

  const locations = ['all', 'India', 'Nepal', 'Bangladesh', 'Sri Lanka'];
  const statuses = ['all', 'verified', 'pending', 'active'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Green Projects</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore verified environmental projects generating tradable green credits. 
            Each project undergoes rigorous verification and impact assessment.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: 'Total Projects', value: projects.length, icon: '🌱' },
            { label: 'Verified Projects', value: projects.filter(p => p.status === 'verified').length, icon: '✅' },
            { label: 'Total Impact', value: '250K+ tons CO₂', icon: '📊' },
            { label: 'Active Investors', value: '1.2K+', icon: '👥' }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-700/50">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <ProjectFilters 
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          locations={locations}
          statuses={statuses}
        />

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl border border-emerald-500/20 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Have a Green Project?</h3>
            <p className="text-gray-300 mb-6">
              Register your environmental project to get verified and start generating tradable green credits.
            </p>
            <Link 
              href="/onboarding"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300"
            >
              <span>🚀</span>
              <span>Register Your Project</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}