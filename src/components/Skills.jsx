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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-12">
          <Code2 size={24} className="text-[#17c0f8] mr-2" />
          <h2 className="text-3xl font-bold text-white">Skills</h2>
        </div>

        {loading ? (
          <div className="text-white">Loading skills...</div>
        ) : (
          <div className="space-y-12">
            {Object.entries(skillsData).map(([category, skills], groupIndex) => (
              <div key={category}>
                <h3 className="text-xl text-white font-semibold mb-4 text-center">{category.toUpperCase()}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={`${category}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#112240] rounded-lg p-6 text-center hover:bg-[#1d3a6e] transition-colors"
                    >
                      <p className="font-medium text-gray-300">{skill}</p>
                    </motion.div>
                  ))}
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
