import React, { useEffect, useState } from 'react';
import { db, storage } from '../../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const HeroManager = () => {
  const [currentSection, setCurrentSection] = useState('Personal');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchData = async () => {
    try {
      const docRef = doc(db, 'hero', currentSection);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDescription(data.description || '');
        setImageUrl(data.imageUrl || '');
        setPreview(null);
        setNewImage(null);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentSection]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = imageUrl;

      if (newImage) {
        const storageRef = ref(storage, `hero-images/${Date.now()}-${newImage.name}`);
        await uploadBytes(storageRef, newImage);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, 'hero', currentSection);
      await updateDoc(docRef, {
        description,
        imageUrl: finalImageUrl
      });

      alert(`${currentSection} section updated successfully.`);
      fetchData(); // refresh after update
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1a33] text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Update Hero Section</h1>

      <div className="flex gap-4 mb-6">
        {['Personal', 'Professional'].map((section) => (
          <button
            key={section}
            onClick={() => setCurrentSection(section)}
            className={`px-4 py-2 rounded ${currentSection === section ? 'bg-cyan-500' : 'bg-[#1c2a45]'}`}
          >
            {section}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-[#112244] p-6 rounded-xl shadow-lg">
        <div className="mb-4">
          <label className="block text-sm mb-2">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full p-2 rounded bg-[#1c2a45] text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Change Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 bg-[#1c2a45] rounded text-white"
          />
          {(preview || imageUrl) && (
            <div className="mt-4">
              <p className="text-sm mb-2">Preview:</p>
              <img
                src={preview || imageUrl}
                alt="Preview"
                className="rounded-lg w-full max-w-sm"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded"
        >
          Update {currentSection}
        </button>
      </form>
    </div>
  );
};

export default HeroManager;
