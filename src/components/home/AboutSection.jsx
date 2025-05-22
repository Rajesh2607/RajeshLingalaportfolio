import React from 'react';
import { motion } from 'framer-motion';
import { User, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection = ({ about }) => (
  <section
    id="about"
    className="py-16 sm:py-20 lg:py-24 bg-[#112240] text-white w-full"
  >
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8"
    >
<div className="flex flex-col items-center justify-center mb-8 sm:mb-12">
  <div className="flex items-center">
    <User size={24} className="text-[#17c0f8] mr-3 animate-pulse" />
    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide">
      <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
        Short Bio About Me
      </span>
    </h2>
  </div>

  {/* Gradient line below */}
  <div className="mt-2 h-1 lg:w-96 sm:w-48 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 rounded-full" />
</div>


      <article className="bg-[#1b3a70] p-6 sm:p-10 md:p-12 lg:p-16 rounded-3xl shadow-2xl border border-white/10 text-base sm:text-lg md:text-xl leading-relaxed text-justify font-light tracking-wide max-w-6xl mx-auto">
        <p>
          {about.description ||
            "I'm a passionate Cloud and DevOps Engineer with a strong background in UI Design. With expertise in cloud platforms, containerization, and automation, I help organizations build and maintain scalable infrastructure while ensuring beautiful and functional user interfaces."}
        </p>

        <Link
          to="/whoiam#"
          aria-label="See more about Lingala Rajesh"
          className="relative group inline-block mt-6"
        >
          <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out">
            <MoreHorizontal size={20} />
            <span className="text-sm sm:text-base font-semibold">See more about me</span>
          </div>
        </Link>
      </article>
    </motion.div>
  </section>
);

export default AboutSection;
