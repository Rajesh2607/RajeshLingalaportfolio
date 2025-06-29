import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Code, Layers, Star, AlertCircle, Loader, Filter } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import ProjectDetailModal from '../components/ProjectDetailModal';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [groupedProjects, setGroupedProjects] = useState({});
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch projects from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const querySnapshot = await getDocs(collection(db, 'projects'));
        
        if (querySnapshot.empty) {
          console.log('No projects found in database');
          setProjects([]);
          setGroupedProjects({});
          return;
        }

        const projectData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          projectData.push({
            id: doc.id,
            title: data.title || 'Untitled Project',
            description: data.description || 'No description available',
            technologies: Array.isArray(data.technologies) ? data.technologies : [],
            github: data.github || '',
            live: data.live || '',
            category: data.category || 'General',
            domain: data.domain || 'Other',
            media: data.media || '',
            mediaType: data.mediaType || 'image'
          });
        });

        setProjects(projectData);

        // Group projects by domain
        const grouped = {};
        projectData.forEach(project => {
          const domain = project.domain;
          if (!grouped[domain]) {
            grouped[domain] = [];
          }
          grouped[domain].push(project);
        });

        setGroupedProjects(grouped);

        // Extract unique categories
        const uniqueCategories = ['All'];
        projectData.forEach(project => {
          if (project.category && !uniqueCategories.includes(project.category)) {
            uniqueCategories.push(project.category);
          }
        });
        
        setCategories(uniqueCategories);

      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Optimized modal functions
  const openModal = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
  }, []);

  // Memoized filtered projects
  const filteredGroupedProjects = useMemo(() => {
    let filtered = {};

    // Filter by category only
    if (activeCategory === 'All') {
      filtered = { ...groupedProjects };
    } else {
      Object.keys(groupedProjects).forEach(domain => {
        const filteredProjects = groupedProjects[domain].filter(
          project => project.category === activeCategory
        );
        if (filteredProjects.length > 0) {
          filtered[domain] = filteredProjects;
        }
      });
    }

    return filtered;
  }, [groupedProjects, activeCategory]);

  // Loading skeleton component
  const ProjectSkeleton = React.memo(() => (
    <div className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-700"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
          <div className="h-6 w-18 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  ));

  // Optimized Project card component
  const ProjectCard = React.memo(({ project, index, onProjectClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleCardClick = useCallback(() => {
      onProjectClick(project);
    }, [project, onProjectClick]);

    const handleLinkClick = useCallback((e) => {
      e.stopPropagation();
    }, []);

    const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
    }, []);

    const handleImageError = useCallback(() => {
      setImageError(true);
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className="group bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-xl cursor-pointer"
        whileHover={{ y: -4 }}
        onClick={handleCardClick}
        style={{ willChange: 'transform' }}
      >
        {/* Optimized Media Section */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {project.media && !imageError ? (
            <>
              {project.mediaType === 'video' ? (
                <video
                  src={project.media}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onError={handleImageError}
                  style={{ willChange: 'transform' }}
                />
              ) : (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
                    </div>
                  )}
                  <img
                    src={project.media}
                    alt={project.title}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ willChange: 'transform, opacity' }}
                  />
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
              <div className="text-center text-gray-400">
                <Code size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">No preview</p>
              </div>
            </div>
          )}

          {/* Simplified overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
                >
                  <Github size={18} />
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="p-2 bg-cyan-500/30 backdrop-blur-sm rounded-full text-cyan-300 hover:bg-cyan-500/50 transition-colors duration-200"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-cyan-500/20 backdrop-blur-sm text-cyan-300 text-xs font-semibold rounded-full border border-cyan-400/30">
              {project.category}
            </span>
          </div>
        </div>

        {/* Optimized Content Section */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-1">
            {project.title}
          </h3>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>

          {/* Simplified Technologies */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded text-xs font-medium border border-gray-600/50"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs font-medium">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Simplified Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
            <div className="flex items-center space-x-1 text-gray-400 text-xs">
              <Code size={10} />
              <span>{project.technologies.length} techs</span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star size={10} fill="currentColor" />
              <span className="text-xs font-medium">Featured</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  });

  // Optimized Domain section component
  const DomainSection = React.memo(({ domain, projects, domainIndex }) => {
    const totalProjects = projects.length;
    const uniqueTechs = [...new Set(projects.flatMap(p => p.technologies))].length;

    return (
      <motion.section
        key={domain}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: domainIndex * 0.1, duration: 0.6 }}
        className="mb-16"
      >
        {/* Simplified Domain Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              {domain}
            </span>
          </h2>
          
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full mx-auto mb-4"></div>
          
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <Layers size={14} className="text-cyan-400" />
              <span>{totalProjects} Project{totalProjects !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Code size={14} className="text-purple-400" />
              <span>{uniqueTechs} Technologies</span>
            </div>
          </div>
        </div>

        {/* Optimized Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              onProjectClick={openModal}
            />
          ))}
        </div>
      </motion.section>
    );
  });

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <AlertCircle size={64} className="text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalFilteredProjects = Object.values(filteredGroupedProjects).flat().length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f]">
      {/* Optimized Hero Section */}
      <section className="relative py-16 px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              Project Portfolio
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            Explore my projects organized by domain - click any card to view complete details
          </p>

          {/* Simplified Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">{projects.length}</div>
              <div className="text-gray-400 text-sm">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{Object.keys(groupedProjects).length}</div>
              <div className="text-gray-400 text-sm">Domains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{Math.max(0, categories.length - 1)}</div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Category Filter Only */}
      {categories.length > 1 && (
        <section className="px-6 md:px-8 lg:px-12 mb-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#112240]/80 to-[#1a2f4a]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
            >
              <div className="text-center">
                <h3 className="text-white font-semibold mb-4 flex items-center justify-center">
                  <Filter size={16} className="mr-2 text-cyan-400" />
                  Filter by Category
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                        activeCategory === category
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-cyan-400/50 hover:text-cyan-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="mt-3 text-gray-400 text-sm">
                  Showing {totalFilteredProjects} of {projects.length} projects
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Optimized Projects by Domain */}
      <section className="px-6 md:px-8 lg:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="space-y-16">
              {Array(2).fill(null).map((_, i) => (
                <div key={i} className="space-y-8">
                  <div className="text-center">
                    <div className="h-10 bg-gray-700 rounded w-48 mx-auto mb-4 animate-pulse"></div>
                    <div className="h-1 w-32 bg-gray-700 rounded mx-auto animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array(3).fill(null).map((_, j) => <ProjectSkeleton key={j} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : Object.keys(filteredGroupedProjects).length > 0 ? (
            Object.entries(filteredGroupedProjects).map(([domain, domainProjects], domainIndex) => (
              <DomainSection
                key={domain}
                domain={domain}
                projects={domainProjects}
                domainIndex={domainIndex}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="max-w-lg mx-auto">
                <Code size={48} className="mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-bold text-white mb-4">No projects found</h3>
                <p className="text-gray-400 mb-6">
                  {projects.length === 0 
                    ? "No projects available yet."
                    : "No projects match your selected category."
                  }
                </p>
                <button
                  onClick={() => setActiveCategory('All')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Show All Projects
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Optimized Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Projects;