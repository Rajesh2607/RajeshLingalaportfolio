import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroAnimation = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const images = ["/images/Profile.jpg","/images/icon.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageKey, setImageKey] = useState(0); // helps framer-motion trigger image change

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onFinish();
      }, 1000);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setImageKey((prev) => prev + 1); // triggers re-render for AnimatePresence
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-[#0a192f] to-[#17c0f8] flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1 } }}
          exit={{ opacity: 0, scale: 1.1, transition: { duration: 1 } }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: {
                  delay: 0.5,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 200,
                },
              }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-white overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imageKey}
                    src={images[currentIndex]}
                    alt="Rajesh Lingala"
                    className="w-full h-full object-cover absolute"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  />
                </AnimatePresence>
              </div>
            </motion.div>
            <motion.h1
              className="text-white font-bold text-4xl md:text-5xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 1, duration: 0.8 },
              }}
            >
              Welcome to My Portfolio
            </motion.h1>
            <motion.p
              className="text-gray-200 text-xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 1.5, duration: 0.8 },
              }}
            >
              Rajesh Lingala
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
