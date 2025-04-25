import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star, GitFork } from 'lucide-react';
import { db } from '../firebase/config';  // Import Firebase config
import { collection, getDocs } from 'firebase/firestore';  // Firestore functions
import ProjectSkeleton from '../components/skeleton/ProjectSkeleton';  // Skeleton loader component

const Projects = () => {
  const [projects, setProjects] = useState([]);  // State to store projects data
  const [loading, setLoading] = useState(true);  // Loading state for fetching data

  // Fetching data from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));  // Accessing 'projects' collection
        const projectData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectData);  // Setting the projects state with fetched data
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);  // Set loading to false after fetching data
      }
    };

    fetchProjects();  // Calling the function to fetch projects
  }, []);  // Empty dependency array to run the effect only once

  // If data is loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
          <ProjectSkeleton />;
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Featured Projects</h1>
        <p className="text-gray-400">A showcase of my technical projects and contributions</p>
        <p className="text-gray-300">click on project you will see the links option</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#112240] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
          >
            <div className="relative h-64">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-4">
                  <a href={project.github} className="text-white hover:text-[#17c0f8]" target="_blank" rel="noopener noreferrer">
                    <Github size={24} />
                  </a>
                  <a href={project.live} className="text-white hover:text-[#17c0f8]" target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={24} />
                  </a>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-3">{project.title}</h2>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
              {(project.technologies || []).map((tech, index) => (
                  <span
                  key={`${tech}-${index}`}
                    className="px-3 py-1 bg-[#1d3a6e] text-[#17c0f8] rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between text-gray-400">
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default Projects;
