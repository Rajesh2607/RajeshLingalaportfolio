import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, MoreHorizontal, User } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Experience from '../components/Experience';
import Skills from '../components/Skills';

const Home = () => {
  const [about, setAbout] = useState({
    title: '',
    profilePic: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  // Fetch about data from Firestore
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'content', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAbout(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a192f]">
      {/* Hero Section */}
      <HeroSection about={about} />

      {/* About Section */}
      <AboutSection about={about} />

      {/* Skills Section */}
      <Skills />

      {/* Experience Section */}
      <Experience />
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ about }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
  >
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            LINGALA RAJESH
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold tracking-wide text-gray-300 mb-6 animate-fade-in"
          >
            {about.title || 'Student'}
          </motion.p>
          <SocialLinks />
        </div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-1 flex justify-center"
        >
          <img
            src={about.profilePic || 'https://via.placeholder.com/450'}
            alt="Rajesh Lingala"
            className="w-[450px] h-[450px] rounded-full border-4 border-[#17c0f8] shadow-lg"
          />
        </motion.div>
      </div>
    </div>
  </motion.section>
);

// Social Links Component
const SocialLinks = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="flex items-center space-x-4"
  >
    <a
      href="https://github.com/Rajesh2607"
      className="text-white hover:text-[#17c0f8] transition-colors"
    >
      <Github size={24} />
    </a>
    <a
      href="https://www.linkedin.com/in/lingala-rajesh-03a336280?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      className="text-white hover:text-[#17c0f8] transition-colors"
    >
      <Linkedin size={24} />
    </a>
    <a href="/whoiam#connect" className="relative group">
      <div className="flex items-center gap-2 bg-[#112240] hover:bg-[#1d3a6e] text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md cursor-pointer">
        <MoreHorizontal size={24} />
        <span className="text-base sm:text-lg font-medium">More</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1 text-sm text-white bg-[#1a1a2e] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        Go to Connect With Me
      </div>
    </a>
  </motion.div>
);

// About Section Component
const AboutSection = ({ about }) => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="py-24 bg-[#112240] text-white"
  >
    <div className="max-w-8xl mx-auto">
      <div className="flex items-center justify-center mb-12">
        <User size={24} className="text-[#17c0f8] mr-3 animate-pulse" />
        <h2 className="text-3xl md:text-3xl font-extrabold text-white tracking-wide">
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
            Short Bio About Me
          </span>
        </h2>
      </div>
      <div className="bg-[#1b3a70] p-12 sm:p-16 md:p-24 rounded-3xl shadow-2xl border border-white/10 text-lg sm:text-xl md:text-2xl leading-relaxed text-white text-justify font-light tracking-wide max-w-6xl mx-auto">
        <p>
          {about.description ||
            "I'm a passionate Cloud and DevOps Engineer with a strong background in UI Design. With expertise in cloud platforms, containerization, and automation, I help organizations build and maintain scalable infrastructure while ensuring beautiful and functional user interfaces."}
        </p>
      </div>
    </div>
  </motion.section>
);

export default Home;
