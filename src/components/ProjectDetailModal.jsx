import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Code, Calendar, Tag, Star, Layers } from 'lucide-react';

const ProjectDetailModal = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-700/50">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
              >
                <X size={24} />
              </button>
              
              <div className="pr-12">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Code size={20} className="text-cyan-400" />
                  </div>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm font-semibold rounded-full border border-cyan-400/30">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-semibold rounded-full border border-purple-400/30">
                    {project.domain}
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
                
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Layers size={16} className="text-cyan-400" />
                    <span className="text-sm">{project.technologies.length} Technologies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm">Featured Project</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-6 space-y-8">
                {/* Project Media */}
                {project.media && (
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    {project.mediaType === 'video' ? (
                      <video
                        src={project.media}
                        className="w-full h-64 md:h-80 object-cover"
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={project.media}
                        alt={project.title}
                        className="w-full h-64 md:h-80 object-cover"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Overlay with action buttons */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <div className="flex space-x-4">
                        {project.github && (
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleLinkClick}
                            className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Github size={18} />
                            <span className="font-medium">Source Code</span>
                          </motion.a>
                        )}
                        {project.live && (
                          <motion.a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleLinkClick}
                            className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/30 backdrop-blur-sm rounded-full text-cyan-300 hover:bg-cyan-500/50 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ExternalLink size={18} />
                            <span className="font-medium">Live Demo</span>
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Project Description */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Tag size={20} className="mr-2 text-cyan-400" />
                    Project Description
                  </h3>
                  <div className="bg-[#0a192f]/50 rounded-xl p-6 border border-gray-700/30">
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Technologies Used */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Code size={20} className="mr-2 text-purple-400" />
                    Technologies Used
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {project.technologies.map((tech, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-3 text-center border border-gray-600/30 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300"
                      >
                        <span className="text-gray-300 font-medium text-sm">{tech}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Project Links */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <ExternalLink size={20} className="mr-2 text-blue-400" />
                    Project Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30 hover:border-gray-500/50 hover:bg-gray-700/30 transition-all duration-300 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-gray-600/50 transition-colors">
                          <Github size={20} className="text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">Source Code</div>
                          <div className="text-gray-400 text-sm">View on GitHub</div>
                        </div>
                        <ExternalLink size={16} className="text-gray-400 ml-auto group-hover:text-white transition-colors" />
                      </motion.a>
                    )}
                    
                    {project.live && (
                      <motion.a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-500/30 transition-all duration-300 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="p-2 bg-cyan-500/30 rounded-lg group-hover:bg-cyan-500/50 transition-colors">
                          <ExternalLink size={20} className="text-cyan-300" />
                        </div>
                        <div>
                          <div className="text-white font-medium">Live Demo</div>
                          <div className="text-cyan-300 text-sm">View live project</div>
                        </div>
                        <ExternalLink size={16} className="text-cyan-400 ml-auto group-hover:text-cyan-300 transition-colors" />
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Project Stats */}
                <div className="bg-gradient-to-r from-[#0a192f]/50 to-[#112240]/50 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">{project.technologies.length}</div>
                      <div className="text-gray-400 text-sm">Technologies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">{project.category}</div>
                      <div className="text-gray-400 text-sm">Category</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">{project.domain}</div>
                      <div className="text-gray-400 text-sm">Domain</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;