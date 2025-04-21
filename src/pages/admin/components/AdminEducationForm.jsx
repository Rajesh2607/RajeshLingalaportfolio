import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../firebase/config';
import { collection, addDoc } from 'firebase/firestore'; // ✅ Correct import

const AdminEducationForm = () => {
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const educationRef = collection(db, 'educations'); // ✅ Reference to Firestore collection
      await addDoc(educationRef, {
        institution,
        degree,
        fieldOfStudy,
        startYear,
        endYear,
        timestamp: new Date(),
      });

      setMessage('Education details added successfully!');
      setInstitution('');
      setDegree('');
      setFieldOfStudy('');
      setStartYear('');
      setEndYear('');
    } catch (error) {
      console.error('Error adding education details:', error);
      setMessage('Error adding education details.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight to-navy py-16">
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Add Education Details</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="institution" className="block text-lg text-gray-700">Institution</label>
              <input
                type="text"
                id="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                placeholder="Enter institution name"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="degree" className="block text-lg text-gray-700">Degree</label>
              <input
                type="text"
                id="degree"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                placeholder="Enter degree"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="fieldOfStudy" className="block text-lg text-gray-700">Field of Study</label>
              <input
                type="text"
                id="fieldOfStudy"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                placeholder="Enter field of study"
                required
              />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startYear" className="block text-lg text-gray-700">Start Year</label>
                <input
                  type="number"
                  id="startYear"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                  placeholder="Enter start year"
                  required
                />
              </div>

              <div>
                <label htmlFor="endYear" className="block text-lg text-gray-700">End Year</label>
                <input
                  type="number"
                  id="endYear"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                  placeholder="Enter end year"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Add Education
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-6 text-center">
              <p className={`text-lg ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminEducationForm;
