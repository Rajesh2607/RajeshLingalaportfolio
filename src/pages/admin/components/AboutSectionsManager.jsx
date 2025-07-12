import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Code, 
  LineChart, 
  Palette, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Upload, 
  Image as ImageIcon,
  Sparkles,
  Tag,
  FileText,
  Settings,
  Monitor,
  Database,
  Smartphone,
  Globe,
  Cpu,
  Server,
  Layers,
  Terminal,
  GitBranch,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AboutSectionsManager = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    skills: [],
    order: 0
  });
  const [newSkill, setNewSkill] = useState({ name: '', icon: 'Code' });

  // Available icons for skills
  const iconOptions = [
    { value: 'Code', label: 'Code', icon: Code },
    { value: 'Palette', label: 'Palette', icon: Palette },
    { value: 'LineChart', label: 'Line Chart', icon: LineChart },
    { value: 'Monitor', label: 'Monitor', icon: Monitor },
    { value: 'Database', label: 'Database', icon: Database },
    { value: 'Smartphone', label: 'Smartphone', icon: Smartphone },
    { value: 'Globe', label: 'Globe', icon: Globe },
    { value: 'Cpu', label: 'CPU', icon: Cpu },
    { value: 'Server', label: 'Server', icon: Server },
    { value: 'Layers', label: 'Layers', icon: Layers },
    { value: 'Terminal', label: 'Terminal', icon: Terminal },
    { value: 'GitBranch', label: 'Git Branch', icon: GitBranch },
    { value: 'Package', label: 'Package', icon: Package },
    { value: 'Settings', label: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'aboutSections'));
      const sectionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSections(sectionsData.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      setImageFile(file);
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `about-sections/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const dataToSave = {
        ...formData,
        image: imageUrl
      };

      if (editingId) {
        await updateDoc(doc(db, 'aboutSections', editingId), dataToSave);
      } else {
        await addDoc(collection(db, 'aboutSections'), dataToSave);
      }

      setFormData({
        title: '',
        description: '',
        image: '',
        skills: [],
        order: 0
      });
      setImageFile(null);
      setEditingId(null);
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Error saving section');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteDoc(doc(db, 'aboutSections', id));
        fetchSections();
      } catch (error) {
        console.error('Error deleting section:', error);
        alert('Error deleting section');
      }
    }
  };

  const handleEdit = (section) => {
    setFormData({
      title: section.title || '',
      description: section.description || '',
      image: section.image || '',
      skills: section.skills || [],
      order: section.order || 0
    });
    setEditingId(section.id);
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { ...newSkill }]
      });
      setNewSkill({ name: '', icon: 'Code' });
    }
  };

  const removeSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };

  const getIconComponent = (iconName) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Code;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-400" />
              About Sections Management
            </h2>
            <p className="text-gray-300">Manage the "What I Do" sections with skills and images</p>
          </div>
        </div>
      </motion.div>

      {/* Section Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Plus size={20} className="mr-2 text-green-400" />
          {editingId ? 'Edit Section' : 'Add New Section'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Tag size={16} className="mr-2 text-blue-400" />
                Section Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="e.g., UX Design"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Display order"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2 flex items-center">
              <FileText size={16} className="mr-2 text-cyan-400" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
              placeholder="Section description"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2 flex items-center">
              <ImageIcon size={16} className="mr-2 text-pink-400" />
              Section Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-500/20 file:text-pink-300 hover:file:bg-pink-500/30"
            />
            {formData.image && (
              <div className="mt-4">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border border-slate-600/50"
                />
              </div>
            )}
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-white text-sm font-medium mb-4">Skills</label>
            
            {/* Add New Skill */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Skill name"
              />
              <select
                value={newSkill.icon}
                onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                className="px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addSkill}
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              >
                <Plus size={18} className="mr-2" />
                Add Skill
              </button>
            </div>

            {/* Skills List */}
            <div className="space-y-2">
              <AnimatePresence>
                {formData.skills.map((skill, index) => {
                  const IconComponent = getIconComponent(skill.icon);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-600/50"
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent size={20} className="text-cyan-400" />
                        <span className="text-white">{skill.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    image: '',
                    skills: [],
                    order: 0
                  });
                  setEditingId(null);
                  setImageFile(null);
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={20} />
                  {editingId ? 'Update Section' : 'Add Section'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Sections List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Existing Sections</h3>
        <div className="space-y-6">
          <AnimatePresence>
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-white">{section.title}</h4>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-400/30">
                        Order: {section.order}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{section.description}</p>
                    
                    {section.skills && section.skills.length > 0 && (
                      <div>
                        <h5 className="text-white font-medium mb-2">Skills:</h5>
                        <div className="flex flex-wrap gap-2">
                          {section.skills.map((skill, skillIndex) => {
                            const IconComponent = getIconComponent(skill.icon);
                            return (
                              <div
                                key={skillIndex}
                                className="flex items-center space-x-2 px-3 py-1 bg-slate-700/50 text-gray-300 rounded-lg border border-slate-600/50"
                              >
                                <IconComponent size={14} />
                                <span className="text-sm">{skill.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center space-y-4">
                    {section.image && (
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-48 h-32 object-cover rounded-xl border border-slate-600/50"
                      />
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(section)}
                        className="flex items-center px-3 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="flex items-center px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AboutSectionsManager;