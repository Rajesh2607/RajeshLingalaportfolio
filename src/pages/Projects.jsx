import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import ProjectSkeleton from '../components/skeleton/ProjectSkeleton';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [groupedByDomain, setGroupedByDomain] = useState({});
  const [activeDomain, setActiveDomain] = useState('All');
  const [loading, setLoading] = useState(true);
  const [mediaLoadStates, setMediaLoadStates] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projectData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectData);

        const domainGroups = {};
        projectData.forEach(project => {
          const domain = project.domain || 'Others';
          if (!domainGroups[domain]) {
            domainGroups[domain] = [];
          }
          domainGroups[domain].push(project);
        });

        setGroupedByDomain(domainGroups);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleMediaLoad = (id) => {
    setMediaLoadStates(prev => ({ ...prev, [id]: true }));
  };

  const domainNames = ['All', ...Object.keys(groupedByDomain)];

  const getFilteredDomains = () => {
    if (activeDomain === 'All') return groupedByDomain;
    return { [activeDomain]: groupedByDomain[activeDomain] };
  };

  const filteredDomains = getFilteredDomains();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Featured Projects</h1>
        <p className="text-gray-400">A showcase of my technical projects grouped by domain</p>
        <p className="text-gray-400">Hover over a project for Links to view</p>
      </motion.div>
 
      {/* Domain Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {domainNames.map((domain) => (
          <button
            key={domain}
            onClick={() => setActiveDomain(domain)}
            className={`px-4 py-2 rounded-md border ${
              activeDomain === domain
                ? 'bg-[#17c0f8] text-white border-transparent'
                : 'text-[#17c0f8] border-[#17c0f8] hover:bg-[#17c0f8] hover:text-white'
            } transition`}
          >
            {domain}
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
        Object.keys(filteredDomains).map((domain, domainIndex) => (
          <section key={domain} className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: domainIndex * 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-[#17c0f8]">{domain}</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredDomains[domain].map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#112240] rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-2xl relative group"
                >
                  {project.category && (
                    <div className="absolute top-3 right-3 bg-[#1d3a6e] text-[#17c0f8] text-xs font-semibold px-3 py-1 rounded-full z-10">
                      {project.category}
                    </div>
                  )}

                  {/* Media Section */}
                  <div className="relative h-56 overflow-hidden group">
                    {!mediaLoadStates[project.id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-md border-4 border-[#17c0f8] shadow-lg z-10">
                        <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                      </div>
                    )}

                    {project.mediaType === 'video' ? (
                      <video
                        src={project.media}
                        className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:blur-md"
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
                        className={`w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:blur-md ${
                          mediaLoadStates[project.id] ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => handleMediaLoad(project.id)}
                        onError={() => handleMediaLoad(project.id)}
                      />
                    )}

                    {/* Hover Overlay */}
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

                  {/* Text Section */}
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
          </section>
        ))
      )}
    </div>
  );
};

export default Projects;
