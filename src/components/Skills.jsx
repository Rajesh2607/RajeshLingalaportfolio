import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const Skills = () => {
  const [skillsData, setSkillsData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'skills'));
      const skills = {};

      querySnapshot.forEach(doc => {
        const data = doc.data();
        // Assuming each document has an array field called 'items'
        if (Array.isArray(data.items)) {
          skills[doc.id] = data.items;
        }
      });

      setSkillsData(skills);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20 bg-[#0a192f]"
    >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 rounded-lg blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-12">
          <Code2 size={24} className="text-[#17c0f8] mr-2" />
          <h2 className="text-3xl font-bold text-white">
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">

          Skills
          </span>
          </h2>
        </div>

        {loading ? (
              <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 bg-[#0a192f]"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center mb-12">
                  <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse mr-2" />
                  <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
                </div>
        
                <div className="space-y-12">
                  {[1, 2, 3].map((group) => (
                    <div key={group}>
                      <div className="text-center mb-6">
                        <div className="h-6 w-48 bg-gray-700 rounded mx-auto animate-pulse" />
                      </div>
        
                      <div className="w-full flex justify-center">
                        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center max-w-6xl">
                          {[1, 2, 3].map((item) => (
                            <motion.div
                              key={item}
                              className="bg-[#112240] rounded-xl 
                                         px-4 py-3 text-sm 
                                         sm:px-6 sm:py-4 sm:text-base 
                                         md:px-8 md:py-5 md:text-lg 
                                         min-w-[140px] sm:min-w-[160px] md:min-w-[180px] 
                                         h-12 sm:h-14 md:h-16 
                                         animate-pulse"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
        ) : (
          <div className="space-y-12">
            {Object.entries(skillsData).map(([category, skills], groupIndex) => (
              <div key={category}>
                <h3 className="text-xl sm:text-2xl text-white font-semibold mb-6 text-center">
                  {category.toUpperCase()}
                </h3>

                <div className="w-full flex justify-center">
                  <div className="flex flex-wrap gap-4 sm:gap-6 justify-center max-w-6xl">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={`${category}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-[#112240] rounded-xl 
                                  px-4 py-3 text-sm 
                                  sm:px-6 sm:py-4 sm:text-base 
                                  md:px-8 md:py-5 md:text-lg 
                                  text-center hover:bg-[#1d3a6e] transition-colors min-w-[140px] sm:min-w-[160px] md:min-w-[180px]"
                      >
                        <p className="font-semibold text-gray-300">{skill}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Skills;
