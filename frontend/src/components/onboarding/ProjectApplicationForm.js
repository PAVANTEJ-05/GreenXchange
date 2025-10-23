// components/onboarding/ProjectApplicationForm.js
'use client';
import { useState } from 'react';

export default function ProjectApplicationForm({ onNext }) {
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    location: '',
    capacity: '',
    description: '',
    creditType: '',
    expectedCredits: ''
  });

  const creditTypes = [
    'Solar Energy',
    'Wind Energy', 
    'Hydroelectric',
    'Biomass',
    'Geothermal',
    'Carbon Sequestration',
    'Water Conservation',
    'Biodiversity'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Project Application Submitted:', formData);
    localStorage.setItem('onboardingProject', JSON.stringify(formData));
    if (onNext) onNext();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Project Name *</label>
        <input
          type="text"
          name="projectName"
          required
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          value={formData.projectName}
          onChange={handleChange}
          placeholder="Enter project name"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Project Type *</label>
        <select
          name="projectType"
          required
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          value={formData.projectType}
          onChange={handleChange}
        >
          <option value="" className="bg-gray-800">Select Type</option>
          <option value="solar_farm" className="bg-gray-800">Solar Farm</option>
          <option value="wind_farm" className="bg-gray-800">Wind Farm</option>
          <option value="hydro_plant" className="bg-gray-800">Hydro Plant</option>
          <option value="biomass_plant" className="bg-gray-800">Biomass Plant</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Green Credit Type *</label>
        <select
          name="creditType"
          required
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          value={formData.creditType}
          onChange={handleChange}
        >
          <option value="" className="bg-gray-800">Select Credit Type</option>
          {creditTypes.map(type => (
            <option key={type} value={type} className="bg-gray-800">{type}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Location *</label>
          <input
            type="text"
            name="location"
            required
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Capacity (MW) *</label>
          <input
            type="number"
            name="capacity"
            required
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="e.g., 10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Project Description *</label>
        <textarea
          name="description"
          rows={2}
          required
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your project..."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Expected Annual Credits *</label>
        <input
          type="number"
          name="expectedCredits"
          required
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          value={formData.expectedCredits}
          onChange={handleChange}
          placeholder="Estimated credits per year"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 font-semibold shadow-lg"
        >
          Save & Continue
        </button>
      </div>
    </form>
  );
}