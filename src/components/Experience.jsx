import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; // Import your Firebase configuration

// Variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const ExperienceCard = ({ experience, index }) => {
  return (
    <motion.div
      key={experience.id}
      variants={itemVariants}
      className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
        index % 2 === 0 ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Timeline Node */}
      <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4">
        <div className="w-4 h-4 bg-[#17c0f8] rounded-full" />
        <div className="absolute w-8 h-8 bg-[#17c0f8] rounded-full -m-2 animate-ping opacity-20" />
      </div>

      {/* Content */}
      <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
        <div className="bg-[#1d3a6e] p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h3 className="text-xl font-bold text-white">{experience.title}</h3>
            <span className="px-3 py-1 bg-[#17c0f8]/10 text-[#17c0f8] rounded-full text-sm">
              {experience.company}
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-400 mb-4">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {experience.period}
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              {experience.location}
            </div>
          </div>

          <ul className="space-y-2">
            {(Array.isArray(experience.description)
              ? experience.description
              : [experience.description] // fallback to an array
            ).map((item, i) => (
              <li key={i} className="text-gray-300 flex items-start">
                <span className="mr-2 text-[#17c0f8]">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Spacer for timeline alignment */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
};

const Experience = () => {
  const [experiences, setExperiences] = useState([]);

  // Fetch experience data from Firestore
  useEffect(() => {
    const fetchExperienceData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'experiences'));
        const experienceList = querySnapshot.docs.map((doc) => doc.data());
        setExperiences(experienceList);
      } catch (error) {
        console.error('Error fetching experience data: ', error);
      }
    };

    fetchExperienceData();
  }, []);

  return (
    <section className="py-20 bg-[#112240]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-12">
          <Briefcase size={24} className="text-[#17c0f8] mr-2" />
          <h2 className="text-3xl font-bold text-white">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
              Experience
            </span>
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#17c0f8] to-[#0a192f]" />

          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.id} experience={experience} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
