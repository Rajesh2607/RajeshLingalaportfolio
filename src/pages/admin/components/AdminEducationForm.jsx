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
  const [editId, setEditId] = useState(null);

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

      setInstitution('');
      setDegree('');
      setFieldOfStudy('');
      setStartYear('');
      setEndYear('');
      setEditId(null);

      fetchEducationData();
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
    <div className="min-h-screen bg-[#0f172a] py-16">
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl mx-auto bg-[#162138] rounded-2xl shadow-2xl p-10">
          <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400">
            {editId ? 'Edit Education Details' : 'Add Education Details'}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="institution" className="block text-lg font-medium text-cyan-300">Institution</label>
                <input type="text" id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)}
                  className="mt-2 w-full p-3 border border-cyan-600 rounded-lg bg-[#0f172a] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" required />
              </div>

              <div>
                <label htmlFor="degree" className="block text-lg font-medium text-cyan-300">Degree</label>
                <input type="text" id="degree" value={degree} onChange={(e) => setDegree(e.target.value)}
                  className="mt-2 w-full p-3 border border-cyan-600 rounded-lg bg-[#0f172a] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" required />
              </div>

              <div>
                <label htmlFor="fieldOfStudy" className="block text-lg font-medium text-cyan-300">Field of Study</label>
                <input type="text" id="fieldOfStudy" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="mt-2 w-full p-3 border border-cyan-600 rounded-lg bg-[#0f172a] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startYear" className="block text-lg font-medium text-cyan-300">Start Year</label>
                  <input type="number" id="startYear" value={startYear} onChange={(e) => setStartYear(e.target.value)}
                    className="mt-2 w-full p-3 border border-cyan-600 rounded-lg bg-[#0f172a] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" required />
                </div>

                <div>
                  <label htmlFor="endYear" className="block text-lg font-medium text-cyan-300">End Year</label>
                  <input type="number" id="endYear" value={endYear} onChange={(e) => setEndYear(e.target.value)}
                    className="mt-2 w-full p-3 border border-cyan-600 rounded-lg bg-[#0f172a] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" required />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-[#0f172a] font-semibold rounded-lg transition duration-300">
                {editId ? 'Update Education' : 'Add Education'}
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-6 text-center">
              <p className={`text-lg font-medium ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            </div>
          )}

          <hr className="my-10 border-cyan-700" />

          <h2 className="text-3xl font-bold mb-6 text-cyan-300">Existing Education</h2>

          {educationList.length === 0 ? (
            <p className="text-cyan-200 text-center">No education details available.</p>
          ) : (
            <div className="space-y-6">
              {educationList.map((edu) => (
                <div key={edu.id} className="p-6 bg-[#0f172a] rounded-xl border border-cyan-700 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold text-xl text-white">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-cyan-300">{edu.institution}</p>
                    <p className="text-cyan-500 text-sm">{edu.startYear} - {edu.endYear}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(edu)}
                    className="mt-4 md:mt-0 bg-cyan-400 hover:bg-cyan-500 text-[#0f172a] px-6 py-2 rounded-lg font-medium transition duration-300"
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
