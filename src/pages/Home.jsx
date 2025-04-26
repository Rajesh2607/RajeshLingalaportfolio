import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, MoreHorizontal, User } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import SkeletonLoader from '../components/skeleton/SkeletonLoaderForhome';
import ContactSection from '../components/Contact';

// Main Home Component
const Home = () => {
  const [about, setAbout] = useState({
    title: '',
    profilePic: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Disable horizontal scroll
    document.body.style.overflowX = 'hidden';

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

    // Cleanup function to reset overflow
    return () => {
      document.body.style.overflowX = 'auto'; // Reset on component unmount
    };
  }, []);

  if (loading) {
    return (
      <div>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a192f]">
      <div className="overflow-x-hidden">
        <HeroSection about={about} />
        <AboutSection about={about} />
        <Skills />
        <Experience />
        <ContactSection />
      </div>
    </main>
  );
};

// Hero Section Component
const HeroSection = ({ about }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <section
      id="hero"
      aria-label="Hero Section with profile introduction"
      className="min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-x-hidden"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 rounded-lg blur-3xl"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-4"
      >
        <header className="flex-1 text-center md:text-left max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative inline-block"
          >
            <motion.p
              className="text-4xl md:text-5xl font-bold tracking-tight"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="relative">
                <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-blue-400/20 blur-lg"></span>
                <span className="relative bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text animate-gradient bg-[length:200%_auto]">
                  Hi Myself,
                </span>
              </span>
            </motion.p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight mt-4"
          >
            Lingala Rajesh
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl sm:text-3xl font-semibold tracking-wide text-gray-300 mb-8"
          >
            An {about.title || 'Cloud & DevOps Engineer'}
          </motion.p>
          <div className="flex flex-col items-start gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-6"
            >
              <SocialLinks />
            </motion.div>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={about.resume || '/resume.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-5 py-2 mt-6 rounded-full shadow hover:shadow-lg transition-all duration-300 text-sm font-semibold"
            >
              View My Resume/CV
            </motion.a>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px]"
        >
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full border-4 border-[#17c0f8] shadow-lg">
              <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={about.profilePic || 'https://via.placeholder.com/450'}
            alt="Profile of Lingala Rajesh"
            className={`w-full h-full rounded-full border-4 border-[#17c0f8] shadow-2xl transition-all duration-300 ${
              isImageLoading ? 'invisible' : 'visible'
            }`}
            onLoad={handleImageLoad}
            loading="lazy"
          />
          <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(23,192,248,0.3)] pointer-events-none"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Social Links Component
const SocialLinks = () => (
  <nav aria-label="Social Links" className="flex items-center space-x-4">
    <a
      href="https://github.com/Rajesh2607"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit GitHub Profile"
      className="text-white hover:text-[#17c0f8] transition-colors"
    >
      <Github size={24} />
    </a>
    <a
      href="https://www.linkedin.com/in/lingala-rajesh-03a336280"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit LinkedIn Profile"
      className="text-white hover:text-[#17c0f8] transition-colors"
    >
      <Linkedin size={24} />
    </a>
    <a
      href="/whoiam#connect"
      aria-label="Connect with Lingala Rajesh"
      className="relative group"
    >
      <div className="flex items-center gap-2 bg-[#112240] hover:bg-[#1d3a6e] text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md cursor-pointer">
        <MoreHorizontal size={24} />
        <span className="text-base sm:text-lg font-medium">More</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1 text-sm text-white bg-[#1a1a2e] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        Go to Connect With Me
      </div>
    </a>
  </nav>
);

// About Section Component
const AboutSection = ({ about }) => (
  <section
    id="about"
    aria-label="About Section"
    className="py-24 bg-[#112240] text-white overflow-x-hidden"
  >
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-8xl mx-auto"
    >
      <div className="flex items-center justify-center mb-12">
        <User size={24} className="text-[#17c0f8] mr-3 animate-pulse" />
        <h2 className="text-3xl md:text-3xl font-extrabold tracking-wide">
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
            Short Bio About Me
          </span>
        </h2>
      </div>
      <article className="bg-[#1b3a70] p-12 sm:p-16 md:p-24 rounded-3xl shadow-2xl border border-white/10 text-lg sm:text-xl md:text-2xl leading-relaxed text-justify font-light tracking-wide max-w-6xl mx-auto">
        <p>
          {about.description ||
            "I'm a passionate Cloud and DevOps Engineer with a strong background in UI Design. With expertise in cloud platforms, containerization, and automation, I help organizations build and maintain scalable infrastructure while ensuring beautiful and functional user interfaces."}
        </p>
        <a
          href="/whoiam#"
          aria-label="See more about Lingala Rajesh"
          className="relative group inline-block mt-6"
        >
          <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out">
            <MoreHorizontal size={20} />
            <span className="text-sm sm:text-base font-semibold">See more about me</span>
          </div>
        </a>
      </article>
    </motion.div>
  </section>
);

export default Home;
