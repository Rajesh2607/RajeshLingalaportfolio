import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Briefcase, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    period: '',
    description: [],
    order: 0,
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const q = query(collection(db, 'experiences'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const experienceData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExperiences(experienceData);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'experiences', editingId), formData);
      } else {
        await addDoc(collection(db, 'experiences'), formData);
      }
      setFormData({
        title: '',
        company: '',
        location: '',
        period: '',
        description: [],
        order: 0,
      });
      setEditingId(null);
      fetchExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Error saving experience');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteDoc(doc(db, 'experiences', id));
        fetchExperiences();
      } catch (error) {
        console.error('Error deleting experience:', error);
        alert('Error deleting experience');
      }
    }
  };

  const handleEdit = (experience) => {
    setFormData({
      ...experience,
      description: Array.isArray(experience.description)
        ? experience.description
        : experience.description
        ? [experience.description]
        : [],
    });
    setEditingId(experience.id);
  };

  const addDescriptionPoint = () => {
    setFormData({
      ...formData,
      description: [...formData.description, ''],
    });
  };

  const updateDescriptionPoint = (index, value) => {
    const newDescription = [...formData.description];
    newDescription[index] = value;
    setFormData({
      ...formData,
      description: newDescription,
    });
  };

  const removeDescriptionPoint = (index) => {
    setFormData({
      ...formData,
      description: formData.description.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#17c0f8]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#112240] rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Briefcase className="mr-2 text-[#17c0f8]" />
        Experience Management
      </h2>

      {/* Experience Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
              placeholder="e.g., Senior DevOps Engineer"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
              placeholder="e.g., Tech Solutions Inc."
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
              placeholder="e.g., Remote"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Period</label>
            <input
              type="text"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
              placeholder="e.g., 2022 - Present"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
              placeholder="e.g., 1"
              required
            />
          </div>
        </div>

        {/* Description Points */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Description Points</label>
          {formData.description.map((point, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={point}
                onChange={(e) => updateDescriptionPoint(index, e.target.value)}
                className="flex-1 px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
                placeholder="Add description point"
              />
              <button
                type="button"
                onClick={() => removeDescriptionPoint(index)}
                className="p-2 text-red-400 hover:text-red-300"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDescriptionPoint}
            className="flex items-center text-[#17c0f8] hover:text-[#17c0f8]/80"
          >
            <Plus size={20} className="mr-1" />
            Add Description Point
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-[#17c0f8] text-black rounded-lg hover:bg-[#17c0f8]/90 transition-colors"
          >
            <Save className="mr-2" size={20} />
            {editingId ? 'Update Experience' : 'Add Experience'}
          </button>
        </div>
      </form>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="bg-[#1d3a6e] p-4 rounded-lg text-white border border-gray-600"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-bold">{experience.title}</h3>
                <p className="text-sm text-gray-300">
                  {experience.company} • {experience.location}
                </p>
                <p className="text-sm text-gray-400">{experience.period}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(experience)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(experience.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-200">
              {(Array.isArray(experience.description)
                ? experience.description
                : [experience.description]
              ).map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceManager;
