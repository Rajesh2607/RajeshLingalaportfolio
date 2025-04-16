import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; // Make sure path is correct

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'certificates'));
        const certs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCertificates(certs);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white mt-20 text-xl">Loading Certificates...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Professional Certificates</h1>
        <p className="text-gray-400">A collection of my professional certifications and achievements</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#112240] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
          >
            <div className="relative h-48">
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <Award className="w-16 h-16 text-[#17c0f8]" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
              <div className="text-gray-400 mb-4">
                {cert.issuer && <p>Issued by {cert.issuer}</p>}
                {cert.date && <p>Date: {cert.date}</p>}
                {cert.credentialId && <p className="text-sm">Credential ID: {cert.credentialId}</p>}
              </div>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#17c0f8] hover:text-white transition-colors duration-300"
                >
                  <span className="mr-2">View Certificate</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;
