import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="min-h-screen pt-20 bg-gradient-to-b from-midnight to-navy relative overflow-hidden scroll-smooth">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-purple-600 filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-600 filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Personal Story Section */}
          <motion.div 
            className="mb-24"
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
              my personal story
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-6">
                  MiniBlog was founded in 2022 with a simple mission: to create a space where readers could find thoughtful, well-researched content across a variety of topics that matter in everyday life.
                </p>
                <p className="text-lg text-gray-300 mb-6">
                  What began as a small personal blog has grown into a platform that brings together diverse voices and perspectives, all united by a commitment to quality content that informs, inspires, and occasionally challenges conventional thinking.
                </p>
                <p className="text-lg text-gray-300">
                  Today, MiniBlog reaches readers across the globe, but our fundamental approach remains unchanged: we believe in the power of well-crafted stories and insights to connect people and ideas.
                </p>
              </div>
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1, delay: 0.4 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className="absolute -right-4 -bottom-4 w-full h-full bg-cyan-400 rounded-xl opacity-20"></div>
                <img 
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
                  alt="Team Meeting"
                  className="rounded-xl w-full relative z-10"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Professional Story Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white text-right">
              my professional story
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="order-2 md:order-1 relative"
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1, delay: 0.8 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className="absolute -left-4 -bottom-4 w-full h-full bg-purple-400 rounded-xl opacity-20"></div>
                <img 
                  src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg"
                  alt="Professional Environment"
                  className="rounded-xl w-full relative z-10"
                />
              </motion.div>
              <motion.div 
                className="order-1 md:order-2"
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1, delay: 1 }}
              >
                <p className="text-lg text-gray-300 mb-6">
                  With over a decade of experience in software development, I've had the privilege of working on projects that push the boundaries of what's possible in web and mobile applications.
                </p>
                <p className="text-lg text-gray-300 mb-6">
                  My journey has taken me from startups to enterprise organizations, where I've led teams in developing innovative solutions that combine cutting-edge technology with user-centered design principles.
                </p>
                <p className="text-lg text-gray-300">
                  I specialize in full-stack development, with a particular focus on creating scalable, performant applications that deliver exceptional user experiences while solving complex business challenges.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
