import React, { useEffect, useState } from 'react';
import { Award, Bookmark, Medal, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../../firebase/config'; // Make sure to import your Firestore instance
import { collection, getDocs } from 'firebase/firestore';
import 'react-loading-skeleton/dist/skeleton.css';


const Achievements = () => {
  const [achievementData, setAchievementData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'achievements')); // Replace 'achievements' with your actual Firestore collection name
        const data = querySnapshot.docs.map((doc) => doc.data());

        // Optionally, you can sort the achievements if needed
        // const sortedData = data.sort((a, b) => (b.year || 0) - (a.year || 0));
        setAchievementData(data);
      } catch (error) {
        console.error('Error fetching achievements data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Loading spinner while fetching data
  if (loading) {
    return (
      <section id="achievements" className="py-20 bg-midnight text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Activities & Achievements
              </span>
            </h2>
  
            <div className="grid grid-cols-1 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-navy bg-opacity-70 rounded-xl p-6 md:p-8 shadow-xl border-l-4 border-purple-400"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="mb-4 md:mb-0 md:mr-6 flex items-start">
                      <div className="w-12 h-12 bg-purple-400 bg-opacity-20 rounded-lg" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-600 rounded w-1/2" />
                      <div className="h-3 bg-gray-700 rounded w-1/3" />
                      <div className="h-3 bg-gray-700 rounded w-full" />
                      <div className="h-3 bg-gray-800 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="py-20 bg-midnight text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
            Activities & Achievements
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-8">
            {achievementData.map((achievement, index) => {
              const Icon = achievement.icon || Trophy; // Fallback to Trophy if no icon is provided
              return (
                <motion.div
                  key={index}
                  className="opacity-0 translate-x-20"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 * index }}
                >
                  <div className="bg-navy bg-opacity-70 rounded-xl p-6 md:p-8 shadow-xl border-l-4 border-purple-400 hover:border-cyan-400 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="mb-4 md:mb-0 md:mr-6 flex items-start">
                        <div className="p-3 bg-purple-400 bg-opacity-20 rounded-lg">
                          <Icon className="text-purple-400" size={28} />
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                          <h3 className="text-xl font-semibold text-white">{achievement.title}</h3>
                          <span className="text-sm text-cyan-400 mt-1 md:mt-0">{achievement.year}</span>
                        </div>
                        <p className="text-gray-300 mb-3">{achievement.organization}</p>
                        <p className="text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
