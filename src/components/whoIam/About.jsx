import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { 
  Code, 
  LineChart, 
  Palette,
  Monitor,
  Database,
  Smartphone,
  Globe,
  Cpu,
  Server,
  Layers,
  Terminal,
  GitBranch,
  Package,
  Settings
} from 'lucide-react';

const About = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping for dynamic icons
  const iconMap = {
    Code,
    Palette,
    LineChart,
    Monitor,
    Database,
    Smartphone,
    Globe,
    Cpu,
    Server,
    Layers,
    Terminal,
    GitBranch,
    Package,
    Settings
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'aboutSections'));
        const sectionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort by order
        setSections(sectionsData.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Error fetching about sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || Code;
  };

  if (loading) {
    return (
      <section
        id="about"
        className="py-20 bg-midnight text-white transition-all duration-1000 ease-out"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-center">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                  What I Do?
                </span>
              </h2>
              <br />
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative"
                style={{ maxWidth: "180px" }}
              >
                <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 through-cyan-400 to-transparent rounded-full"></div>
                <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-60"></div>
              </motion.div>
            </div>

            {/* Loading Skeletons */}
            <div className="space-y-20">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex items-center mb-8">
                    <div className="w-8 h-8 bg-gray-700 rounded mr-4"></div>
                    <div className="h-8 bg-gray-700 rounded w-64"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className={index % 2 === 0 ? '' : 'order-2 md:order-1'}>
                      <div className="w-full h-48 bg-gray-700 rounded-lg"></div>
                    </div>
                    <div className={index % 2 === 0 ? '' : 'order-1 md:order-2'}>
                      <div className="bg-navy bg-opacity-50 rounded-xl p-6 space-y-4">
                        <div className="h-4 bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                        <div className="flex gap-4 mt-6">
                          <div className="h-12 w-12 bg-gray-700 rounded"></div>
                          <div className="h-12 w-12 bg-gray-700 rounded"></div>
                          <div className="h-12 w-12 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="py-20 bg-midnight text-white transition-all duration-1000 ease-out"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-center">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                What I Do?
              </span>
            </h2>
            <br />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative"
              style={{ maxWidth: "180px" }}
            >
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 through-cyan-400 to-transparent rounded-full"></div>
              <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-60"></div>
            </motion.div>
          </div>

          {/* Dynamic Sections */}
          {sections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No sections available. Please add content from the admin panel.</p>
            </div>
          ) : (
            <div className="space-y-20">
              {sections.map((section, index) => {
                const IconComponent = getIconComponent(section.icon || 'Code');
                const isReversed = index % 2 !== 0;

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="mb-20"
                  >
                    <div className="flex items-center mb-8">
                      <IconComponent className="text-cyan-400 mr-4" size={32} />
                      <h3 className="text-3xl font-bold text-white">{section.title}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div className={isReversed ? 'order-2 md:order-1' : ''}>
                        {section.image ? (
                          <img
                            src={section.image}
                            alt={section.title}
                            className="rounded-lg shadow-xl w-full h-64 object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                            <IconComponent size={64} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className={`bg-navy bg-opacity-50 rounded-xl p-6 ${isReversed ? 'order-1 md:order-2' : ''}`}>
                        <p className="text-gray-200 mb-6 leading-relaxed">
                          {section.description}
                        </p>
                        
                        {section.skills && section.skills.length > 0 && (
                          <div>
                            <h4 className="text-white font-medium mb-4">Key Skills:</h4>
                            <ul className="space-y-3">
                              {section.skills.map((skill, skillIndex) => {
                                const SkillIcon = getIconComponent(skill.icon);
                                return (
                                  <li key={skillIndex} className="flex items-center text-gray-200">
                                    <span className="text-yellow-500 mr-3">
                                      <SkillIcon size={16} />
                                    </span>
                                    {skill.name}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;