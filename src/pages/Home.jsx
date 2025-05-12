import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, MoreHorizontal, User } from 'lucide-react';
import { FaBehance } from 'react-icons/fa';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Experience from '../components/home/Experience';
import Skills from '../components/home/Skills';
import SkeletonLoaderForhome from '../components/skeleton/SkeletonLoaderForhome';
import ContactSection from '../components/home/Contact';
import { Typewriter } from 'react-simple-typewriter';
import Note from '../components/home/Note';

const Home = () => {
  const [about, setAbout] = useState({
    title: [],
    profilePic: '',
    description: '',
    resume: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // ✅ To avoid memory leaks

    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'content', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && isMounted) {
          setAbout(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAboutData();

    return () => {
      isMounted = false; // ✅ Cleanup when component unmounts
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a192f] overflow-hidden">
        <SkeletonLoaderForhome />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a192f] overflow-x-hidden">
      <HeroSection about={about} />
      <AboutSection about={about} />
      <Skills />
      <Experience />
      <ContactSection />
      <Note />
    </main>
  );
};

const HeroSection = ({ about }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <section
      id="hero"
      aria-label="Hero Section with profile introduction"
      className="min-h-[90vh] flex items-center justify-center pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 lg:px-8 w-full overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12"
      >
        {/* Text Content */}
        <header className="flex-1 text-center md:text-left max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-snug"
          >
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text animate-gradient bg-[length:200%_auto]">
              Hi Myself,
            </span>
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
          >
            Lingala Rajesh
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg md:text-2xl font-medium text-gray-300 mb-6 h-[50px] sm:h-[60px] overflow-hidden"
          >
            I'm{' '}
            <span className="text-cyan-400">
              <Typewriter
                words={Array.isArray(about.title) && about.title.length > 0
                  ? about.title
                  : ['Cloud & DevOps Engineer', 'UI/UX Designer', 'Full Stack Developer', 'Problem Solver']}
                loop={true}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
          </motion.p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 sm:gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-center justify-center gap-6"
            >
              <SocialLinks />
            </motion.div>
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={about.resume || '/resume.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-5 py-2 rounded-full shadow hover:shadow-lg transition-all duration-300 text-sm font-semibold"
          >
            View Resume/CV
          </motion.a>
        </header>

        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative w-72 h-72 sm:w-96 sm:h-96 flex-shrink-0 mb-8 md:mb-0"
        >
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full border-4 border-[#17c0f8] shadow-lg">
              <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={about.profilePic || 'https://via.placeholder.com/450'}
            alt="Profile of Lingala Rajesh"
            className={`w-full h-full object-cover rounded-full border-4 border-[#17c0f8] shadow-2xl transition-opacity duration-500 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
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
  href="https://www.behance.net/lingalarajesh"
  target="_blank"
  rel="noopener noreferrer"
  className="hover:scale-110 transition-transform"
>
  <FaBehance className="w-6 h-6 text-white" />
</a>

    <a
      href="/whoiam#connect"
      aria-label="Connect with Lingala Rajesh"
      className="relative group"
    >
      <div className="flex items-center gap-2 hover:bg-[#1d3a6e] text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md cursor-pointer">
        <MoreHorizontal size={24} />
        <span className="text-base sm:text-lg font-medium">More</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1 text-sm text-white bg-[#1a1a2e] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        Go to Connect With Me
      </div>
    </a>
  </nav>
);

const AboutSection = ({ about }) => (
  <section
    id="about"
    aria-label="About Section"
    className="py-16 sm:py-20 lg:py-24 bg-[#112240] text-white w-full overflow-hidden"
  >
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-center justify-center mb-8 sm:mb-12">
        <User size={24} className="text-[#17c0f8] mr-3 animate-pulse" />
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide">
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
            Short Bio About Me
          </span>
        </h2>
      </div>
      <article className="bg-[#1b3a70] p-6 sm:p-10 md:p-12 lg:p-16 rounded-3xl shadow-2xl border border-white/10 text-base sm:text-lg md:text-xl leading-relaxed text-justify font-light tracking-wide max-w-6xl mx-auto overflow-hidden">
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
