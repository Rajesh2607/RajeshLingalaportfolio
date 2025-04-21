import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Globe, Code2, User } from 'lucide-react';
import { db } from '../firebase/config'; // Import Firebase config
import { doc, getDoc } from 'firebase/firestore'; // Firestore methods
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import SkeletonLoader from '../components/skeleton/SkeletonLoaderForhome'; // Skeleton loader component


const Home = () => {
  const [about, setAbout] = useState({
    title: '',
    profilePic: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch about data from Firestore
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'content', 'about'); // Document reference
        const docSnap = await getDoc(docRef); // Get the document
        if (docSnap.exists()) {
          setAbout(docSnap.data()); // Set the data into the state
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a192f] p-4">
        <SkeletonLoader />
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-[#0a192f]">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
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
                className="text-xl text-gray-300 mb-6"
              >
                {about.title || 'Student'}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex space-x-4"
              >
                <a href="https://github.com/Rajesh2607" className="text-white hover:text-[#17c0f8] transition-colors">
                  <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/lingala-rajesh-03a336280?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="text-white hover:text-[#17c0f8] transition-colors">
                  <Linkedin size={24} />
                </a>
                <a href="mailto:rajeshlingala26072005@email.com" className="text-white hover:text-[#17c0f8] transition-colors">
                  <Mail size={24} />
                </a>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 flex justify-center"
            >
              <img
                src={about.profilePic || 'https://via.placeholder.com/450'} // Use the fetched profile picture
                alt="Rajesh Lingala"
                className="w-[450px] h-[450px] rounded-full border-4 border-[#17c0f8] shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="py-24 bg-[#112240] text-white"
>
  <div className="max-w-8xl mx-auto ">
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
      {about.description || "I'm a passionate Cloud and DevOps Engineer with a strong background in UI Design. With expertise in cloud platforms, containerization, and automation, I help organizations build and maintain scalable infrastructure while ensuring beautiful and functional user interfaces."}
    </p>
  </div>
  </div>
</motion.section>


      {/* Skills Section */}
      <Skills />

      {/* Experience Section */}
      <Experience />
    </div>
  );
};

export default Home;
