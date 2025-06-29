import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Filter, Grid, List, Code, Layers, Star, Calendar } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import ProjectSkeleton from '../components/skeleton/ProjectSkeleton';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [domains, setDomains] = useState(['All']);
  const [categories, setCategories] = useState(['All']);
  const [activeDomain, setActiveDomain] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [mediaLoadStates, setMediaLoadStates] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects...');
        const querySnapshot = await getDocs(collection(db, 'projects'));
        console.log('Query snapshot size:', querySnapshot.size);
        
        const projectData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Project data:', data);
          return {
            id: doc.id,
            ...data,
          };
        });
        
        console.log('Processed project data:', projectData);
        setProjects(projectData);
        setFilteredProjects(projectData);

        // Pre-set all media as loaded to avoid loading issues
        const initialLoadStates = {};
        projectData.forEach(project => {
          initialLoadStates[project.id] = true; // Set to true by default
        });
        setMediaLoadStates(initialLoadStates);

        // Extract unique domains and categories
        const uniqueDomains = ['All'];
        const uniqueCategories = ['All'];
        
        projectData.forEach(project => {
          if (project.domain && !uniqueDomains.includes(project.domain)) {
            uniqueDomains.push(project.domain);
          }
          if (project.category && !uniqueCategories.includes(project.category)) {
            uniqueCategories.push(project.category);
          }
        });
        
        console.log('Unique domains:', uniqueDomains);
        console.log('Unique categories:', uniqueCategories);
        
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

  useEffect(() => {
    let filtered = [...projects];

    if (activeDomain !== 'All') {
      filtered = filtered.filter(project => project.domain === activeDomain);
    }

    if (activeCategory !== 'All') {
      filtered = filtered.filter(project => project.category === activeCategory);
    }

    console.log('Filtered projects:', filtered);
    setFilteredProjects(filtered);
  }, [projects, activeDomain, activeCategory]);

  const handleMediaLoad = (id) => {
    setMediaLoadStates(prev => ({ ...prev, [id]: true }));
  };

  const ProjectCard = ({ project, index }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative bg-gradient-to-br from-[#0f1629] to-[#1a2332] rounded-3xl overflow-hidden border border-gray-800/50 hover:border-cyan-400/30 transition-all duration-700 hover:shadow-2xl hover:shadow-cyan-400/5"
      whileHover={{ y: -12, scale: 1.02 }}
    >
      {/* Project Media */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Always show media without loading spinner for better UX */}
        {project.media && (
          <>
            {project.mediaType === 'video' ? (
              <video
                src={project.media}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => handleMediaLoad(project.id)}
                onError={() => console.log('Video load error for project:', project.id)}
              />
            ) : (
              <img
                src={project.media}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                onLoad={() => handleMediaLoad(project.id)}
                onError={() => console.log('Image load error for project:', project.id)}
              />
            )}
          </>
        )}

        {/* Fallback for missing media */}
        {!project.media && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
            <div className="text-center text-gray-400">
              <Code size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">No preview available</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Action Buttons */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex space-x-4">
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={24} />
              </motion.a>
            )}
            {project.live && (
              <motion.a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-cyan-500/20 backdrop-blur-md rounded-full text-cyan-400 hover:bg-cyan-500/30 transition-all duration-300 border border-cyan-400/30"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink size={24} />
              </motion.a>
            )}
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
          {project.category && (
            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-md text-cyan-300 text-sm font-semibold rounded-full border border-cyan-400/30">
              {project.category}
            </span>
          )}
          {project.domain && (
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-600/20 backdrop-blur-md text-purple-300 text-sm font-semibold rounded-full border border-purple-400/30">
              {project.domain}
            </span>
          )}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
            {project.title || 'Untitled Project'}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed opacity-90">
            {project.description && project.description.length > 120 
              ? `${project.description.slice(0, 120)}...` 
              : project.description || 'No description available'}
          </p>
        </div>
      </div>

      {/* Project Details */}
      <div className="p-8">
        {/* Technologies */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Code size={18} className="text-cyan-400 mr-2" />
            <span className="text-gray-300 font-medium">Technologies</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(project.technologies || []).slice(0, 6).map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 rounded-lg text-xs font-medium border border-gray-600/50 hover:border-cyan-400/50 hover:text-cyan-300 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
            {(project.technologies || []).length > 6 && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-400 rounded-lg text-xs font-medium border border-gray-600/50">
                +{(project.technologies || []).length - 6}
              </span>
            )}
          </div>
        </div>

        {/* Project Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center space-x-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <Layers size={14} />
              <span>{project.category || 'General'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Code size={14} />
              <span>{(project.technologies || []).length} techs</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-medium">Featured</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0f1419] to-[#0a0f1c]">
      {/* Hero Section */}
      <section className="relative py-24 px-6 md:px-8 lg:px-12 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
                Featured
              </span>
              <br />
              <span className="text-white">Projects</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto"
          >
            Explore my collection of innovative projects spanning web development, 
            mobile applications, and cutting-edge technologies
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{projects.length}</div>
              <div className="text-gray-400">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{Math.max(0, domains.length - 1)}</div>
              <div className="text-gray-400">Domains</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{Math.max(0, categories.length - 1)}</div>
              <div className="text-gray-400">Categories</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Filters Section */}
      <section className="px-6 md:px-8 lg:px-12 mb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#0f1629]/80 to-[#1a2332]/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8"
          >
            {/* View Mode Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
              <div className="flex items-center space-x-6">
                <h2 className="text-2xl font-bold text-white">Browse Projects</h2>
                <div className="flex items-center bg-gray-800/50 rounded-2xl border border-gray-700/50 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>

              <div className="text-gray-400">
                Showing {filteredProjects.length} of {projects.length} projects
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Domain Filter */}
              <div>
                <h3 className="text-white font-semibold mb-6 flex items-center text-lg">
                  <Layers size={20} className="mr-3 text-cyan-400" />
                  Filter by Domain
                </h3>
                <div className="flex flex-wrap gap-3">
                  {domains.map((domain) => (
                    <motion.button
                      key={domain}
                      onClick={() => setActiveDomain(domain)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                        activeDomain === domain
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-cyan-400/50 hover:text-cyan-300'
                      }`}
                    >
                      {domain}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-white font-semibold mb-6 flex items-center text-lg">
                  <Code size={20} className="mr-3 text-purple-400" />
                  Filter by Category
                </h3>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                        activeCategory === category
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-purple-400/50 hover:text-purple-300'
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 md:px-8 lg:px-12 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array(6).fill(null).map((_, i) => <ProjectSkeleton key={i} />)}
            </div>
          ) : filteredProjects.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
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
              className="text-center py-24"
            >
              <div className="max-w-lg mx-auto">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                  <Filter size={40} className="text-gray-500" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">No projects found</h3>
                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                  {projects.length === 0 
                    ? "No projects available in the database yet."
                    : "No projects match the selected filters. Try adjusting your selection."
                  }
                </p>
                <motion.button
                  onClick={() => {
                    setActiveDomain('All');
                    setActiveCategory('All');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 text-lg font-semibold"
                >
                  Show All Projects
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;