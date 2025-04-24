import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../firebase/config';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';

const AdminEducationForm = () => {
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [message, setMessage] = useState('');
  const [educationList, setEducationList] = useState([]);
  const [editId, setEditId] = useState(null); // To track editing mode

  const fetchEducationData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'educations'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEducationList(data);
    } catch (error) {
      console.error('Error fetching education data:', error);
    }
  };

  useEffect(() => {
    fetchEducationData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const educationData = {
      institution,
      degree,
      fieldOfStudy,
      startYear,
      endYear,
      timestamp: new Date(),
    };

    try {
      if (editId) {
        const educationDoc = doc(db, 'educations', editId);
        await updateDoc(educationDoc, educationData);
        setMessage('Education updated successfully!');
      } else {
        await addDoc(collection(db, 'educations'), educationData);
        setMessage('Education added successfully!');
      }

      // Reset form
      setInstitution('');
      setDegree('');
      setFieldOfStudy('');
      setStartYear('');
      setEndYear('');
      setEditId(null);

      fetchEducationData(); // Refresh list
    } catch (error) {
      console.error('Error saving education:', error);
      setMessage('Error saving education details.');
    }
  };

  const handleEdit = (education) => {
    setEditId(education.id);
    setInstitution(education.institution);
    setDegree(education.degree);
    setFieldOfStudy(education.fieldOfStudy);
    setStartYear(education.startYear);
    setEndYear(education.endYear);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight to-navy py-16">
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
            {editId ? 'Edit Education Details' : 'Add Education Details'}
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Inputs */}
            <div className="mb-4">
              <label htmlFor="institution" className="block text-lg text-gray-700">Institution</label>
              <input type="text" id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full p-3 mt-2 border border-gray-300 rounded-md" required />
            </div>

            <div className="mb-4">
              <label htmlFor="degree" className="block text-lg text-gray-700">Degree</label>
              <input type="text" id="degree" value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full p-3 mt-2 border border-gray-300 rounded-md" required />
            </div>

            <div className="mb-4">
              <label htmlFor="fieldOfStudy" className="block text-lg text-gray-700">Field of Study</label>
              <input type="text" id="fieldOfStudy" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className="w-full p-3 mt-2 border border-gray-300 rounded-md" required />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startYear" className="block text-lg text-gray-700">Start Year</label>
                <input type="number" id="startYear" value={startYear} onChange={(e) => setStartYear(e.target.value)} className="w-full p-3 mt-2 border border-gray-300 rounded-md" required />
              </div>

              <div>
                <label htmlFor="endYear" className="block text-lg text-gray-700">End Year</label>
                <input type="number" id="endYear" value={endYear} onChange={(e) => setEndYear(e.target.value)} className="w-full p-3 mt-2 border border-gray-300 rounded-md" required />
              </div>
            </div>

            <div className="mb-4">
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300">
                {editId ? 'Update Education' : 'Add Education'}
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-4 text-center">
              <p className={`text-lg ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
            </div>
          )}

          <hr className="my-8" />

          {/* Education List */}
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Existing Education</h2>
          {educationList.length === 0 ? (
            <p className="text-gray-600">No education details available.</p>
          ) : (
            <div className="space-y-4">
              {educationList.map((edu) => (
                <div key={edu.id} className="p-4 bg-gray-100 rounded-md shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    <p className="text-gray-500 text-sm">{edu.startYear} - {edu.endYear}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(edu)}
                    className="mt-3 md:mt-0 bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminEducationForm;
