import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Code, Tag, Star, Layers, Loader, AlertCircle } from 'lucide-react';

const ProjectDetailModal = ({ project, isOpen, onClose }) => {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  // Memoize project data to prevent unnecessary re-renders
  const projectData = useMemo(() => {
    if (!project) return null;
    
    return {
      id: project.id,
      title: project.title || 'Untitled Project',
      description: project.description || 'No description available',
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      github: project.github || '',
      live: project.live || '',
      category: project.category || 'General',
      domain: project.domain || 'Other',
      media: project.media || '',
      mediaType: project.mediaType || 'image'
    };
  }, [project]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMediaLoaded(false);
      setMediaError(false);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Optimized close handler
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Optimized backdrop click handler
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Prevent event bubbling for links
  const handleLinkClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Media load handlers
  const handleMediaLoad = useCallback(() => {
    setMediaLoaded(true);
  }, []);

  const handleMediaError = useCallback(() => {
    setMediaError(true);
    setMediaLoaded(true);
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleClose]);

  if (!projectData) return null;

  // Simplified animation variants for better performance
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-700/50 bg-[#112240]/80">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
              
              <div className="pr-12">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Code size={20} className="text-cyan-400" />
                  </div>
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm font-semibold rounded-full border border-cyan-400/30">
                    {projectData.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-semibold rounded-full border border-purple-400/30">
                    {projectData.domain}
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">{projectData.title}</h2>
                
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Layers size={16} className="text-cyan-400" />
                    <span className="text-sm">{projectData.technologies.length} Technologies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm">Featured</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-6 space-y-8">
                {/* Project Media */}
                {projectData.media && (
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    {!mediaLoaded && !mediaError && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800">
                        <div className="text-center">
                          <Loader className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Loading media...</p>
                        </div>
                      </div>
                    )}

                    {mediaError ? (
                      <div className="w-full h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                        <div className="text-center text-gray-400">
                          <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                          <p className="text-sm">Media failed to load</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {projectData.mediaType === 'video' ? (
                          <video
                            src={projectData.media}
                            className={`w-full h-64 md:h-80 object-cover transition-opacity duration-300 ${
                              mediaLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            controls
                            preload="metadata"
                            onLoadedData={handleMediaLoad}
                            onError={handleMediaError}
                          />
                        ) : (
                          <img
                            src={projectData.media}
                            alt={projectData.title}
                            className={`w-full h-64 md:h-80 object-cover transition-opacity duration-300 ${
                              mediaLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            loading="lazy"
                            onLoad={handleMediaLoad}
                            onError={handleMediaError}
                          />
                        )}
                      </>
                    )}
                    
                    {/* Overlay */}
                    {mediaLoaded && !mediaError && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                        <div className="flex space-x-4">
                          {projectData.github && (
                            <a
                              href={projectData.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={handleLinkClick}
                              className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
                            >
                              <Github size={18} />
                              <span className="font-medium">Code</span>
                            </a>
                          )}
                          {projectData.live && (
                            <a
                              href={projectData.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={handleLinkClick}
                              className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/30 backdrop-blur-sm rounded-full text-cyan-300 hover:bg-cyan-500/50 transition-colors duration-200"
                            >
                              <ExternalLink size={18} />
                              <span className="font-medium">Demo</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Project Description */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Tag size={20} className="mr-2 text-cyan-400" />
                    Description
                  </h3>
                  <div className="bg-[#0a192f]/50 rounded-xl p-6 border border-gray-700/30">
                    <p className="text-gray-300 leading-relaxed">
                      {projectData.description}
                    </p>
                  </div>
                </div>

                {/* Technologies Grid */}
                {projectData.technologies.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Code size={20} className="mr-2 text-purple-400" />
                      Technologies ({projectData.technologies.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {projectData.technologies.map((tech, index) => (
                        <div
                          key={`${tech}-${index}`}
                          className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-3 text-center border border-gray-600/30 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-colors duration-200"
                        >
                          <span className="text-gray-300 font-medium text-sm">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Links */}
                {(projectData.github || projectData.live) && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <ExternalLink size={20} className="mr-2 text-blue-400" />
                      Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projectData.github && (
                        <a
                          href={projectData.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleLinkClick}
                          className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30 hover:border-gray-500/50 hover:bg-gray-700/30 transition-colors duration-200 group"
                        >
                          <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-gray-600/50 transition-colors duration-200">
                            <Github size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">Source Code</div>
                            <div className="text-gray-400 text-sm">View on GitHub</div>
                          </div>
                          <ExternalLink size={16} className="text-gray-400 group-hover:text-white transition-colors duration-200" />
                        </a>
                      )}
                      
                      {projectData.live && (
                        <a
                          href={projectData.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleLinkClick}
                          className="flex items-center space-x-3 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-500/30 transition-colors duration-200 group"
                        >
                          <div className="p-2 bg-cyan-500/30 rounded-lg group-hover:bg-cyan-500/50 transition-colors duration-200">
                            <ExternalLink size={20} className="text-cyan-300" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">Live Demo</div>
                            <div className="text-cyan-300 text-sm">View live project</div>
                          </div>
                          <ExternalLink size={16} className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Project Stats */}
                <div className="bg-gradient-to-r from-[#0a192f]/50 to-[#112240]/50 rounded-xl p-6 border border-gray-700/30">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-cyan-400 mb-1">{projectData.technologies.length}</div>
                      <div className="text-gray-400 text-sm">Technologies</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-400 mb-1 truncate">{projectData.category}</div>
                      <div className="text-gray-400 text-sm">Category</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400 mb-1 truncate">{projectData.domain}</div>
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

export default React.memo(ProjectDetailModal);