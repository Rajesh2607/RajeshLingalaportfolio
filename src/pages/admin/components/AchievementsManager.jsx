import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Trophy, Award, Bookmark, Medal } from 'lucide-react';

const AchievementsManager = () => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    organization: '',
    year: '',
    description: '',
    icon: 'Trophy' // Default icon
  });
  const [loading, setLoading] = useState(true);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'achievements'));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAchievements(data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement({
      ...newAchievement,
      [name]: value
    });
  };

  // Add a new achievement
  const handleAddAchievement = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'achievements'), newAchievement);
      setAchievements([...achievements, newAchievement]);
      setNewAchievement({
        title: '',
        organization: '',
        year: '',
        description: '',
        icon: 'Trophy' // Reset to default icon
      });
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  };

  // Delete an achievement
  const handleDeleteAchievement = async (id) => {
    try {
      const achievementRef = doc(db, 'achievements', id);
      await deleteDoc(achievementRef);
      setAchievements(achievements.filter((ach) => ach.id !== id));
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  // Update an achievement
  const handleUpdateAchievement = async (id) => {
    const updatedAchievement = {
      ...newAchievement,
      id: undefined // Don't update the ID
    };

    try {
      const achievementRef = doc(db, 'achievements', id);
      await updateDoc(achievementRef, updatedAchievement);
      setAchievements(
        achievements.map((ach) => (ach.id === id ? { ...ach, ...updatedAchievement } : ach))
      );
      setNewAchievement({
        title: '',
        organization: '',
        year: '',
        description: '',
        icon: 'Trophy'
      });
    } catch (error) {
      console.error('Error updating achievement:', error);
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }

  return (
    <section className="py-20 bg-midnight text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
              Achievements Manager
            </span>
          </h2>

          {/* Form for Adding/Updating Achievements */}
          <form onSubmit={handleAddAchievement} className="bg-navy p-6 rounded-xl mb-12 shadow-xl">
            <h3 className="text-2xl font-semibold mb-4">Add New Achievement</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={newAchievement.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full p-3 rounded-lg bg-gray-800 text-white"
              />
              <input
                type="text"
                name="organization"
                value={newAchievement.organization}
                onChange={handleChange}
                placeholder="Organization"
                className="w-full p-3 rounded-lg bg-gray-800 text-white"
              />
              <input
                type="text"
                name="year"
                value={newAchievement.year}
                onChange={handleChange}
                placeholder="Year"
                className="w-full p-3 rounded-lg bg-gray-800 text-white"
              />
              <textarea
                name="description"
                value={newAchievement.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-3 rounded-lg bg-gray-800 text-white"
              ></textarea>
              <div className="flex items-center space-x-4">
                <label className="text-white">Select Icon</label>
                <select
                  name="icon"
                  value={newAchievement.icon}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 rounded-lg"
                >
                  <option value="Trophy">Trophy</option>
                  <option value="Award">Award</option>
                  <option value="Bookmark">Bookmark</option>
                  <option value="Medal">Medal</option>
                </select>
              </div>
              <button type="submit" className="mt-4 p-3 bg-cyan-400 text-white rounded-lg">
                Add Achievement
              </button>
            </div>
          </form>

          {/* Displaying Current Achievements */}
          <div className="space-y-8">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-navy bg-opacity-70 rounded-xl p-6 shadow-xl border-l-4 border-purple-400">
                <div className="flex flex-col md:flex-row">
                  <div className="mb-4 md:mb-0 md:mr-6 flex items-start">
                    <div className="p-3 bg-purple-400 bg-opacity-20 rounded-lg">
                      {React.createElement(achievement.icon || Trophy, { size: 28, className: 'text-purple-400' })}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                      <h3 className="text-xl font-semibold text-white">{achievement.title}</h3>
                      <span className="text-sm text-cyan-400 mt-1 md:mt-0">{achievement.year}</span>
                    </div>
                    <p className="text-gray-300 mb-3">{achievement.organization}</p>
                    <p className="text-gray-400">{achievement.description}</p>
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => handleDeleteAchievement(achievement.id)}
                        className="p-2 bg-red-600 text-white rounded-lg"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleUpdateAchievement(achievement.id)}
                        className="p-2 bg-blue-600 text-white rounded-lg"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsManager;
