import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, Upload, Save, X, Plus, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AboutManager = () => {
  const [about, setAbout] = useState({
    title: [],
    description: '',
    profilePic: '',
    resume: '',
  });
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const docRef = doc(db, 'content', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAbout({
          ...data,
          title: Array.isArray(data.title) ? data.title : [data.title],
        });
        setPreviewUrl(data.profilePic);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      showNotification('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        showNotification('error', 'Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        showNotification('error', 'File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setUploadProgress(0);
    
    try {
      let profilePicUrl = about.profilePic;

      if (file) {
        setUploadProgress(25);
        const storageRef = ref(storage, `profile/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        setUploadProgress(75);
        profilePicUrl = await getDownloadURL(storageRef);
        setUploadProgress(100);
      }

      const docRef = doc(db, 'content', 'about');
      await updateDoc(docRef, {
        ...about,
        profilePic: profilePicUrl,
      });

      showNotification('success', 'About section updated successfully!');
      setFile(null);
    } catch (error) {
      console.error('Error updating about section:', error);
      showNotification('error', 'Failed to update about section');
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const handleAddTitle = () => {
    if (newTitle.trim() !== '') {
      setAbout({ ...about, title: [...about.title, newTitle.trim()] });
      setNewTitle('');
    }
  };

  const handleRemoveTitle = (index) => {
    const updatedTitles = about.title.filter((_, i) => i !== index);
    setAbout({ ...about, title: updatedTitles });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
              notification.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                : 'bg-red-500/20 border border-red-500/50 text-red-400'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#112240] to-[#1a2f4a] rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">About Section Management</h2>
            <p className="text-gray-400">Manage your personal information and profile</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <ImageIcon size={20} className="mr-2 text-cyan-400" />
            Profile Picture
          </h3>
          
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-dashed border-gray-600">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                  <div className="text-center text-white">
                    <Upload size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-medium">Change Photo</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* File Info */}
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                Recommended: Square image, at least 400x400px
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Titles Section */}
          <div className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Professional Titles</h3>
            
            {/* Add New Title */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTitle()}
                className="flex-1 px-4 py-2 bg-[#0a192f] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Add new title (e.g., Full Stack Developer)"
              />
              <button
                type="button"
                onClick={handleAddTitle}
                disabled={!newTitle.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Title List */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <AnimatePresence>
                {about.title.map((title, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between bg-[#0a192f] p-3 rounded-lg border border-gray-600"
                  >
                    <span className="text-white flex-1">{title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTitle(index)}
                      className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
            <textarea
              value={about.description}
              onChange={(e) => setAbout({ ...about, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 bg-[#0a192f] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
              placeholder="Write a compelling description about yourself..."
            />
            <div className="mt-2 text-right">
              <span className="text-xs text-gray-400">
                {about.description.length} characters
              </span>
            </div>
          </div>

          {/* Resume URL */}
          <div className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Resume URL</h3>
            <input
              type="url"
              value={about.resume}
              onChange={(e) => setAbout({ ...about, resume: e.target.value })}
              className="w-full px-4 py-3 bg-[#0a192f] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              placeholder="https://yourdomain.com/your-resume.pdf"
            />
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2" size={20} />
              Save Changes
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default AboutManager;