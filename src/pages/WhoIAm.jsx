import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/whoIam/Hero';
import Achievements from '../components/whoIam/Achievements';
import Education from '../components/whoIam/Education';
import SocialMedia from '../components/whoIam/SocialMedia';
import About from '../components/whoIam/About';
import { useLocation } from 'react-router-dom';
import SkeletonLoaderForWhoIAm from '../components/skeleton/SkeletonLoaderForWhoIAm';

const WhoIAm = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading effect (you can skip this if you fetch real data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle hash-based scroll after loading is done
  useEffect(() => {
    if (!loading && location.hash === '#connect') {
      setTimeout(() => {
        const section = document.getElementById('connect');
        section?.scrollIntoView({ behavior: 'smooth' });
      }, 300); // Adjust delay if needed
    }
  }, [loading, location]);

  if (loading) return <SkeletonLoaderForWhoIAm />;

  return (
    <div className="overflow-x-hidden">
      <div className="min-h-screen bg-[#0a192f] text-white flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#17c0f8]">Who I Am</h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            I’m a passionate developer focused on building full-stack solutions with modern web technologies.
            With a keen eye for design and user experience, I bring ideas to life through clean and efficient code.
            My mission is to create impactful digital experiences that solve real-world problems.
          </p>
        </motion.div>
      </div>
  
      <section className="bg-[#0a192f] py-20">
        <div className="container mx-auto px-6 space-y-20">
          <Hero />
          <Education />
          <About />
          <Achievements />
          <div id="connect">
            <SocialMedia />
          </div>
        </div>
      </section>
    </div>
  );

};

export default WhoIAm;
