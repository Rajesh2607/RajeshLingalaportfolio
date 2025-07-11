import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const SkeletonStory = ({ reversed = false }) => (
  <div className="mb-24 animate-pulse">
    <h1 className={`text-5xl md:text-7xl font-bold mb-8 text-white ${reversed ? 'text-right' : ''}`}>
      <div className="h-10 bg-gray-700 rounded w-2/3 mx-auto" />
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {!reversed && (
        <div className="space-y-4">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-800 rounded w-5/6" />
          <div className="h-4 bg-gray-700 rounded w-4/6" />
        </div>
      )}
      <div className="w-full h-64 bg-gray-800 rounded-xl" />
      {reversed && (
        <div className="space-y-4">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-800 rounded w-5/6" />
          <div className="h-4 bg-gray-700 rounded w-4/6" />
        </div>
      )}
    </div>
  </div>
);

const Hero = () => {
  const [personal, setPersonal] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const personalSnap = await getDoc(doc(db, 'hero', 'Personal'));
        const professionalSnap = await getDoc(doc(db, 'hero', 'Professional'));

        if (personalSnap.exists()) {
          setPersonal({ id: 'Personal', ...personalSnap.data() });
        }
        if (professionalSnap.exists()) {
          setProfessional({ id: 'Professional', ...professionalSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <section className="min-h-screen pt-20 bg-gradient-to-b from-midnight to-navy relative overflow-hidden scroll-smooth">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-purple-600 filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-600 filter blur-3xl"></div>
      </div>
<div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(150)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <>
              <SkeletonStory />
              <SkeletonStory reversed />
            </>
          ) : (
            <>
              {/* Personal Story */}
              {personal && (
                <motion.div 
                  className="mb-24"
                  initial={{ opacity: 0, y: 50 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
                    My Personal Story
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="max-h-[450px] overflow-y-auto pr-3 
                  scrollbar-thin scrollbar-thumb-[#1e293b] 
                  scrollbar-track-transparent hover:scrollbar-thumb-[#334155] 
                  scrollbar-thumb-rounded-md transition-all duration-300">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {personal.description}
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
                        src={personal.imageUrl}
                        alt="Personal"
                        className="rounded-xl w-full relative z-10"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Professional Story */}
              {professional && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white text-right">
                    My Professional Story
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
                        src={professional.imageUrl}
                        alt="Professional"
                        className="rounded-xl w-full relative z-10"
                      />
                    </motion.div>
                    <motion.div
                    className="order-1 md:order-2 max-h-[450px] overflow-y-auto pr-2 rounded 
                              scrollbar-thin scrollbar-track-transparent 
                              scrollbar-thumb-gradient-to-b from-purple-500 via-cyan-400 to-blue-500 
                              scrollbar-thumb-rounded-lg scrollbar-track-rounded-full 
                              transition-all duration-300 text-lg text-gray-300"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                  >
                    <div className="pr-2">
                      {professional.description}
                    </div>
                  </motion.div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
