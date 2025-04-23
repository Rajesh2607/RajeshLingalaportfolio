import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const Hero = () => {
  const [personal, setPersonal] = useState(null);
  const [professional, setProfessional] = useState(null);

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

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">

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
                <div>
                  <p className="text-lg text-gray-300 mb-6">{personal.description}</p>
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
                    src={professional.imageUrl}
                    alt="Professional"
                    className="rounded-xl w-full relative z-10"
                  />
                </motion.div>
                <motion.div 
                  className="order-1 md:order-2"
                  initial={{ opacity: 0, y: 50 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 1, delay: 1 }}
                >
                  <p className="text-lg text-gray-300">{professional.description}</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
