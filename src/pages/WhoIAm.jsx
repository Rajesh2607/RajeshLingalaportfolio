import React from 'react';
import { motion } from 'framer-motion';

const WhoIAm = () => {
  return (
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
  );
};

export default WhoIAm;
