import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Search, Filter, Grid, List, Eye, Calendar, Code, Layers } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import ProjectSkeleton from '../components/skeleton/ProjectSkeleton';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [domains, setDomains] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeDomain, setActiveDomain] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(true);
  const [mediaLoadStates, setMediaLoadStates] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projectData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setProjects(projectData);
        setFilteredProjects(projectData);

        // Extract unique domains and categories
        const uniqueDomains = ['All', ...new Set(projectData.map(p => p.domain).filter(Boolean))];
        const uniqueCategories = ['All', ...new Set(projectData.map(p => p.category).filter(Boolean))];
        
        setDomains(uniqueDomains);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on domain, category, and search term
  useEffect(() => {
    let filtered = projects;

    // Filter by domain
    if (activeDomain !== 'All') {
      filtered = filtered.filter(project => project.domain === activeDomain);
    }

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(project => project.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.technologies && project.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, activeDomain, activeCategory, searchTerm]);

  const handleMediaLoad = (id) => {
    setMediaLoadStates(prev => ({ ...prev, [id]: true }));
  };

  const clearFilters = () => {
    setActiveDomain('All');
    setActiveCategory('All');
    setSearchTerm('');
  };

  const ProjectCard = ({ project, index }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`group relative bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-400/10 ${
        viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
      }`}
      whileHover={{ y: -8 }}
    >
      {/* Project Image/Video */}
      <div className={`relative overflow-hidden ${
        viewMode === 'list' ? 'md:w-80 h-64 md:h-auto' : 'h-64'
      }`}>
        {!mediaLoadStates[project.id] && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 z-10">
            <div className="w-8 h-8 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
          </div>
        )}

        {project.mediaType === 'video' ? (
          <video
            src={project.media}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => handleMediaLoad(project.id)}
          />
        ) : (
          <img
            src={project.media}
            alt={project.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              mediaLoadStates[project.id] ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => handleMediaLoad(project.id)}
            onError={() => handleMediaLoad(project.id)}
          />
        )}

        {/* Overlay with links */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="flex space-x-3">
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
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ExternalLink size={20} />
                </motion.a>
              )}
            </div>
            <div className="flex items-center space-x-2 text-white/80 text-sm">
              <Eye size={16} />
              <span>View Project</span>
            </div>
          </div>
        </div>

        {/* Category and Domain badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          {project.category && (
            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-sm text-cyan-400 text-xs font-semibold rounded-full border border-cyan-400/30">
              {project.category}
            </span>
          )}
          {project.domain && (
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-600/20 backdrop-blur-sm text-purple-400 text-xs font-semibold rounded-full border border-purple-400/30">
              {project.domain}
            </span>
          )}
        </div>
      </div>

      {/* Project Content */}
      <div className={`p-6 flex flex-col justify-between ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Technologies */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(project.technologies || []).slice(0, viewMode === 'list' ? 8 : 4).map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="px-3 py-1 bg-[#0a192f] text-cyan-400 rounded-full text-xs font-medium border border-cyan-400/30 hover:bg-cyan-400/10 transition-colors duration-300"
              >
                {tech}
              </span>
            ))}
            {(project.technologies || []).length > (viewMode === 'list' ? 8 : 4) && (
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">
                +{(project.technologies || []).length - (viewMode === 'list' ? 8 : 4)} more
              </span>
            )}
          </div>

          {/* Project stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Code size={12} />
                <span>{(project.technologies || []).length} techs</span>
              </div>
              <div className="flex items-center space-x-1">
                <Layers size={12} />
                <span>{project.category || 'General'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f] overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative py-20 px-6 md:px-8 lg:px-12">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-600/5"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              My Projects
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            A showcase of my technical projects, from web applications to mobile apps, 
            demonstrating my skills across different domains and technologies
          </p>
        </motion.div>
      </div>

      {/* Controls Section */}
      <div className="px-6 md:px-8 lg:px-12 mb-12">
        <div className="max-w-7xl mx-auto">
          {/* Search and View Toggle */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects, technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-[#112240]/80 backdrop-blur-sm border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* View Mode and Filter Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-[#112240]/80 backdrop-blur-sm rounded-xl border border-gray-600/50 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 bg-[#112240]/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white hover:border-cyan-400/50 transition-all duration-300"
              >
                <Filter size={20} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-[#112240]/80 to-[#1a2f4a]/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Domain Filter */}
                  <div>
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Layers size={18} className="mr-2 text-cyan-400" />
                      Domain
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {domains.map((domain) => (
                        <button
                          key={domain}
                          onClick={() => setActiveDomain(domain)}
                          className={`px-4 py-2 rounded-xl border-2 font-medium transition-all duration-300 text-sm ${
                            activeDomain === domain
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-lg'
                              : 'text-cyan-400 border-cyan-400/50 hover:bg-cyan-400/10 hover:border-cyan-400'
                          }`}
                        >
                          {domain}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Code size={18} className="mr-2 text-purple-400" />
                      Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`px-4 py-2 rounded-xl border-2 font-medium transition-all duration-300 text-sm ${
                            activeCategory === category
                              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-transparent shadow-lg'
                              : 'text-purple-400 border-purple-400/50 hover:bg-purple-400/10 hover:border-purple-400'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(activeDomain !== 'All' || activeCategory !== 'All' || searchTerm) && (
                  <div className="mt-6 pt-6 border-t border-gray-700/50">
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-gradient-to-r from-red-500/20 to-pink-600/20 text-red-400 rounded-xl border border-red-400/30 hover:bg-red-500/30 transition-all duration-300"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-gray-400 text-lg">
              {loading ? (
                <span className="inline-block w-40 h-5 bg-gray-700 rounded animate-pulse"></span>
              ) : (
                <>
                  Showing {filteredProjects.length} of {projects.length} projects
                  {searchTerm && ` for "${searchTerm}"`}
                  {activeDomain !== 'All' && ` in ${activeDomain}`}
                  {activeCategory !== 'All' && ` • ${activeCategory}`}
                </>
              )}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="px-6 md:px-8 lg:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {Array(6).fill(null).map((_, i) => <ProjectSkeleton key={i} />)}
            </div>
          ) : filteredProjects.length > 0 ? (
            <motion.div
              layout
              className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1 max-w-5xl mx-auto'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="max-w-lg mx-auto">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">No projects found</h3>
                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                  {searchTerm
                    ? `No projects match "${searchTerm}"`
                    : 'No projects match the selected filters'}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 text-lg font-semibold"
                >
                  Show All Projects
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;