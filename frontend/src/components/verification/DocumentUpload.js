// components/verification/DocumentUpload.js
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DocumentUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    
    // Simulate IPFS upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type,
      status: 'uploaded',
      ipfsHash: 'Qm' + Math.random().toString(36).substr(2, 44),
      timestamp: new Date().toISOString()
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Upload Documents</h3>
        
        <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-gray-300 mb-2">Drag & drop files or click to browse</p>
            <p className="text-gray-400 text-sm">Supports PDF, DOC, JPG, PNG (Max 10MB each)</p>
          </label>
        </div>

        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-cyan-500/20 rounded-lg border border-cyan-500/30"
          >
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-cyan-300">Uploading to IPFS...</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Uploaded Files List */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Uploaded Documents</h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {uploadedFiles.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📄</div>
                <div>
                  <p className="text-white font-medium text-sm">{file.name}</p>
                  <p className="text-gray-400 text-xs">{file.size} • {file.ipfsHash}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded">Verified</span>
                <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  🔗
                </button>
              </div>
            </motion.div>
          ))}
          
          {uploadedFiles.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📂</div>
              <p>No documents uploaded yet</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}