'use client';

import { Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      className="bg-navy-800 py-8 overflow-x-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Animated Title & Tagline */}
          <div className="text-center md:text-left group">
            <motion.h2
              className="text-xl sm:text-2xl font-extrabold tracking-wide transform group-hover:scale-105 transition duration-500 ease-in-out"
              style={{
                backgroundImage: 'linear-gradient(90deg, #22d3ee, #a855f7, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% auto',
                animation: 'gradientMove 4s ease infinite',
                display: 'inline-block',
              }}
            >
              LINGALA RAJESH<span className="text-purple-400">.</span>
            </motion.h2>
            <p className="text-gray-400 mt-1 text-sm sm:text-base tracking-wide">
              Building real-world tech for real-world impact.
            </p>
          </div>

          {/* Right: Social Icons */}
          <motion.div
            className="flex justify-center space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <a
              href="https://github.com/Rajesh2607"
              className="text-gray-400 hover:text-white transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/lingala-rajesh-03a336280?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              className="text-gray-400 hover:text-white transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:rajeshlingala26072005@gmail.com"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              <Mail size={20} />
            </a>
          </motion.div>
        </div>

        {/* Bottom copyright */}
        <motion.p
          className="mt-8 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          © {new Date().getFullYear()} Lingala Rajesh. All rights reserved.
        </motion.p>
      </div>

      {/* Gradient animation keyframes */}
<style>{`
  @keyframes gradientMove {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`}</style>

    </motion.footer>
  );
};

export default Footer;
