// components/verification/VerificationWorkflow.js - Minimal version
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function VerificationWorkflow() {
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Solar Farm Project - Rajasthan',
      status: 'under_review',
      auditor: 'You',
      submitted: '2 days ago',
      category: 'Renewable Energy'
    },
    {
      id: 2,
      name: 'Wind Energy - Gujarat Coast',
      status: 'pending',
      auditor: 'Unassigned',
      submitted: '1 day ago',
      category: 'Renewable Energy'
    }
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Projects List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects Awaiting Review</h3>
          
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedProject?.id === project.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{project.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'under_review' ? 'Under Review' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                  <span>Submitted {project.submitted}</span>
                  <span>Auditor: {project.auditor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
        
        {selectedProject ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Project Name</label>
                <p className="text-gray-900">{selectedProject.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <p className="text-gray-900">{selectedProject.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="text-gray-900 capitalize">{selectedProject.status.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Approve Project
              </button>
              <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                Request Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-2xl mb-2 block">📋</span>
            <p>Select a project to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}