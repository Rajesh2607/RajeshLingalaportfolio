import React, { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db,storage } from '../../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const HeroManager = () => {
  const [formData, setFormData] = useState({
    section: 'personal', // 'personal' or 'professional'
    heading: '',
    description: '',
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.heading || !formData.description || !formData.image) {
      alert('All fields are required');
      return;
    }

    try {
      const storageRef = ref(storage, `hero-images/${Date.now()}-${formData.image.name}`);
      await uploadBytes(storageRef, formData.image);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'hero'), {
        section: formData.section,
        heading: formData.heading,
        description: formData.description,
        imageUrl: downloadURL,
        timestamp: new Date()
      });

      alert('Hero content added successfully!');
      setFormData({
        section: 'personal',
        heading: '',
        description: '',
        image: null,
      });
      setPreview(null);
    } catch (error) {
      console.error('Error uploading data: ', error);
      alert('Error uploading data.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1a33] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Hero Manager (Admin)</h1>

      <form onSubmit={handleSubmit} className="bg-[#112244] p-6 rounded-xl shadow-lg max-w-2xl">
        <div className="mb-4">
          <label className="block text-sm mb-2">Section</label>
          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1c2a45] text-white"
          >
            <option value="personal">Personal Story</option>
            <option value="professional">Professional Story</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Heading</label>
          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1c2a45] text-white"
            placeholder="Enter heading"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full p-2 rounded bg-[#1c2a45] text-white"
            placeholder="Enter description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 bg-[#1c2a45] rounded text-white"
          />
          {preview && (
            <div className="mt-4">
              <p className="text-sm mb-2">Preview:</p>
              <img src={preview} alt="Preview" className="rounded-lg w-full max-w-sm" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default HeroManager;
