import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import ProjectSkeleton from '../components/skeleton/ProjectSkeleton';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [imageLoadStates, setImageLoadStates] = useState({});

  const handleImageLoad = (id) => {
    setImageLoadStates(prev => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projectData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectData);
        setFilteredProjects(projectData);

        const uniqueCategories = [
          'All',
          ...new Set(projectData.map(project => project.category).filter(Boolean))
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => project.category === category);
      setFilteredProjects(filtered);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Featured Projects</h1>
        <p className="text-gray-400">A showcase of my technical projects and contributions</p>
        <p className="text-gray-300">Click on a project to see the links</p>
      </motion.div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center mb-10 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleFilterChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${
              selectedCategory === category
                ? 'bg-[#17c0f8] text-[#0a192f]'
                : 'bg-[#112240] text-[#17c0f8] border-[#17c0f8]'
            } hover:bg-[#17c0f8] hover:text-[#0a192f] transition-colors duration-300`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Skeleton Loader */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ProjectSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#112240] rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-2xl relative group"
            >
              {/* Badge */}
              {project.category && (
                <div className="absolute top-3 right-3 bg-[#1d3a6e] text-[#17c0f8] text-xs font-semibold px-3 py-1 rounded-full z-10">
                  {project.category}
                </div>
              )}

              {/* Image */}
              <div className="relative h-56 overflow-hidden group">
                {!imageLoadStates[project.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-md border-4 border-[#17c0f8] shadow-lg z-10">
                    <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:blur-md ${
                    imageLoadStates[project.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(project.id)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 group-hover:bg-opacity-50 group-hover:opacity-100 transition-all duration-700 ease-in-out">
                  <div className="flex space-x-5">
                    <a href={project.github} className="text-white hover:text-[#17c0f8]" target="_blank" rel="noopener noreferrer">
                      <Github size={24} />
                    </a>
                    <a href={project.live} className="text-white hover:text-[#17c0f8]" target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={24} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-3">{project.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(project.technologies || []).map((tech, i) => (
                    <span
                      key={`${tech}-${i}`}
                      className="px-3 py-1 bg-[#1d3a6e] text-[#17c0f8] rounded-full text-xs font-medium tracking-wide"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
