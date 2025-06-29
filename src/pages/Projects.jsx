import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Code, Layers, Star, AlertCircle, Loader, FolderOpen } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [groupedProjects, setGroupedProjects] = useState({});
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        console.log('Fetched projects:', projectData);
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

  // Filter grouped projects by category
  const getFilteredGroupedProjects = () => {
    if (activeCategory === 'All') {
      return groupedProjects;
    }

    const filtered = {};
    Object.keys(groupedProjects).forEach(domain => {
      const filteredProjects = groupedProjects[domain].filter(
        project => project.category === activeCategory
      );
      if (filteredProjects.length > 0) {
        filtered[domain] = filteredProjects;
      }
    });

    return filtered;
  };

  const filteredGroupedProjects = getFilteredGroupedProjects();

  // Loading skeleton component
  const ProjectSkeleton = () => (
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
  );

  // Domain section skeleton
  const DomainSkeleton = () => (
    <div className="mb-20">
      <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-12 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array(3).fill(null).map((_, i) => <ProjectSkeleton key={i} />)}
      </div>
    </div>
  );

  // Project card component
  const ProjectCard = ({ project, index }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        className="group bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-400/10"
        whileHover={{ y: -8 }}
      >
        {/* Media Section */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {project.media && !imageError ? (
            <>
              {project.mediaType === 'video' ? (
                <video
                  src={project.media}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setImageError(true)}
                />
              ) : (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
                    </div>
                  )}
                  <img
                    src={project.media}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                </>
              )}
            </>
          ) : (
            // Fallback for missing or error media
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
              <div className="text-center text-gray-400">
                <Code size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">No preview available</p>
              </div>
            </div>
          )}

          {/* Overlay with action buttons */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div className="flex space-x-4">
              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github size={20} />
                </motion.a>
              )}
              {project.live && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-cyan-500/30 backdrop-blur-sm rounded-full text-cyan-300 hover:bg-cyan-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ExternalLink size={20} />
                </motion.a>
              )}
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm text-cyan-300 text-xs font-semibold rounded-full border border-cyan-400/30">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
            {project.title}
          </h3>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Code size={14} className="text-cyan-400 mr-2" />
              <span className="text-gray-300 text-sm font-medium">Technologies</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded-md text-xs font-medium border border-gray-600/50 hover:border-cyan-400/50 hover:text-cyan-300 transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-md text-xs font-medium">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="flex items-center space-x-3 text-gray-400 text-xs">
              <div className="flex items-center space-x-1">
                <Code size={12} />
                <span>{project.technologies.length} techs</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-medium">Featured</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Domain section component
  const DomainSection = ({ domain, projects, domainIndex }) => {
    const totalProjects = projects.length;
    const uniqueTechs = [...new Set(projects.flatMap(p => p.technologies))].length;

    return (
      <motion.section
        key={domain}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: domainIndex * 0.2, duration: 0.8 }}
        className="mb-20"
      >
        {/* Domain Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: domainIndex * 0.2 + 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl mb-6 shadow-xl"
          >
            <FolderOpen size={32} className="text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: domainIndex * 0.2 + 0.4 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              {domain}
            </span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: domainIndex * 0.2 + 0.5 }}
            className="flex flex-wrap justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <Layers size={16} className="text-cyan-400" />
              <span>{totalProjects} Project{totalProjects !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Code size={16} className="text-purple-400" />
              <span>{uniqueTechs} Technologies</span>
            </div>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </div>
      </motion.section>
    );
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f]">
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              Project Portfolio
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Explore my projects organized by domain - from web development to mobile apps, 
            each showcasing different technologies and innovative solutions
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{projects.length}</div>
              <div className="text-gray-400">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{Object.keys(groupedProjects).length}</div>
              <div className="text-gray-400">Domains</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{Math.max(0, categories.length - 1)}</div>
              <div className="text-gray-400">Categories</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Category Filter */}
      {categories.length > 1 && (
        <section className="px-6 md:px-8 lg:px-12 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#112240]/80 to-[#1a2f4a]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 text-center"
            >
              <h3 className="text-white font-semibold mb-6 flex items-center justify-center">
                <Code size={18} className="mr-2 text-purple-400" />
                Filter by Category
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-purple-400/50 hover:text-purple-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-gray-400">
                Showing {Object.values(filteredGroupedProjects).flat().length} of {projects.length} projects
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Projects by Domain */}
      <section className="px-6 md:px-8 lg:px-12 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div>
              {Array(3).fill(null).map((_, i) => <DomainSkeleton key={i} />)}
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
              className="text-center py-24"
            >
              <div className="max-w-lg mx-auto">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  <FolderOpen size={32} className="text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">No projects found</h3>
                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                  {projects.length === 0 
                    ? "No projects available in the database yet."
                    : "No projects match the selected category. Try selecting a different category."
                  }
                </p>
                <button
                  onClick={() => setActiveCategory('All')}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 text-lg font-semibold"
                >
                  Show All Projects
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;