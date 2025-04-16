import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

const SkillManager = () => {
  const [skillsData, setSkillsData] = useState({});
  const [newCategory, setNewCategory] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch all categories and skills
  const fetchSkills = async () => {
    const querySnapshot = await getDocs(collection(db, 'skills'));
    const data = {};
    querySnapshot.forEach((docSnap) => {
      data[docSnap.id] = docSnap.data().items || [];
    });
    setSkillsData(data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await setDoc(doc(db, 'skills', newCategory), { items: [] });
    setNewCategory('');
    fetchSkills();
  };

  // Add skill to category
  const handleAddSkill = async () => {
    if (!selectedCategory || !newSkill.trim()) return;
    const updatedSkills = [...(skillsData[selectedCategory] || []), newSkill];
    await updateDoc(doc(db, 'skills', selectedCategory), {
      items: updatedSkills,
    });
    setNewSkill('');
    fetchSkills();
  };

  // Delete skill from category
  const handleDeleteSkill = async (category, skill) => {
    const updatedSkills = skillsData[category].filter((s) => s !== skill);
    await updateDoc(doc(db, 'skills', category), {
      items: updatedSkills,
    });
    fetchSkills();
  };

  // Delete entire category
  const handleDeleteCategory = async (category) => {
    await deleteDoc(doc(db, 'skills', category));
    fetchSkills();
  };

  return (
    <div className="p-8 bg-[#0a192f] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🛠️ Admin Skill Manager</h1>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl mb-2">➕ Add New Category</h2>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g., Web Development"
            className="w-full p-2 text-black rounded mb-2"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Category
          </button>
        </div>

        <div>
          <h2 className="text-xl mb-2">➕ Add Skill to Category</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 text-black rounded mb-2"
          >
            <option value="">Select Category</option>
            {Object.keys(skillsData).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., Python"
            className="w-full p-2 text-black rounded mb-2"
          />
          <button
            onClick={handleAddSkill}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Add Skill
          </button>
        </div>
      </div>

      <div className="space-y-10">
        {Object.entries(skillsData).map(([category, skills]) => (
          <div key={category} className="bg-[#112240] p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">{category}</h3>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="text-red-400 hover:text-red-600"
              >
                Delete Category
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skills.map((skill, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-[#1c2a3f] px-4 py-2 rounded"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleDeleteSkill(category, skill)}
                    className="ml-4 text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillManager;
