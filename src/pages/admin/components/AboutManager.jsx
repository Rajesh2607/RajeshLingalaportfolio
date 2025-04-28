import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, Upload, Save, X } from 'lucide-react';

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
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let profilePicUrl = about.profilePic;

      if (file) {
        const storageRef = ref(storage, `profile/${file.name}`);
        await uploadBytes(storageRef, file);
        profilePicUrl = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, 'content', 'about');
      await updateDoc(docRef, {
        ...about,
        profilePic: profilePicUrl,
      });

      alert('About section updated successfully!');
    } catch (error) {
      console.error('Error updating about section:', error);
      alert('Error updating about section');
    } finally {
      setSaving(false);
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#17c0f8]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#112240] rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <User className="mr-2 text-[#17c0f8]" />
        About Section Management
      </h2>

      <div className="space-y-6">
        {/* Profile Picture Upload */}
        <div className="flex flex-col md:flex-row md:items-center">
          <label className="block text-white text-sm font-medium mb-2">Profile Picture</label>
          <div className="flex items-start space-x-4 md:w-1/2">
            <div className="w-32 h-32 relative rounded-lg overflow-hidden bg-[#1d3a6e]">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <User size={40} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="flex items-center px-4 py-2 bg-[#1d3a6e] text-white rounded-lg cursor-pointer hover:bg-[#2d4a7e] transition-colors">
                <Upload className="mr-2" size={20} />
                Choose Image
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="mt-2 text-sm text-gray-400">
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>
        </div>

        {/* Title Array Input */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Titles</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
              placeholder="Add new title"
            />
            <button
              type="button"
              onClick={handleAddTitle}
              className="px-4 py-2 bg-[#17c0f8] text-black rounded-md hover:bg-[#17c0f8]/90"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {about.title.map((t, index) => (
              <div key={index} className="flex items-center bg-[#1d3a6e] p-2 rounded-md">
                <span className="flex-1 text-white">{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTitle(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Description</label>
          <textarea
            value={about.description}
            onChange={(e) => setAbout({ ...about, description: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
            placeholder="Enter your professional description..."
          />
        </div>

        {/* Resume URL */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Resume URL</label>
          <input
            type="text"
            value={about.resume}
            onChange={(e) => setAbout({ ...about, resume: e.target.value })}
            className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
            placeholder="e.g., https://yourdomain.com/your-resume.pdf"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-[#17c0f8] text-black rounded-lg hover:bg-[#17c0f8]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2" size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutManager;
