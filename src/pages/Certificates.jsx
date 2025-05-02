import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('All');
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

        const domainList = ['All', ...new Set(certs.map(cert => cert.domain).filter(Boolean))];
        setDomains(domainList);
        setFilteredCertificates(certs);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  useEffect(() => {
    if (selectedDomain === 'All') {
      setFilteredCertificates(certificates);
    } else {
      const filtered = certificates.filter(cert => cert.domain === selectedDomain);
      setFilteredCertificates(filtered);
    }
  }, [selectedDomain, certificates]);

  const SkeletonCard = () => (
    <div className="bg-[#112240] rounded-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-[#1a2a3f]"></div>
      <div className="p-6 space-y-3">
        <div className="h-5 bg-[#1a2a3f] rounded w-3/4"></div>
        <div className="h-4 bg-[#1a2a3f] rounded w-1/2"></div>
        <div className="h-4 bg-[#1a2a3f] rounded w-2/3"></div>
        <div className="h-4 bg-[#1a2a3f] rounded w-1/3 mt-2"></div>
      </div>
    </div>
  );

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

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        {domains.map((domain, index) => (
          <button
            key={index}
            onClick={() => setSelectedDomain(domain)}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              selectedDomain === domain
                ? 'border-[#17c0f8] bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text'
                : 'border-[#17c0f8] text-[#17c0f8] hover:bg-[#17c0f8] hover:text-white transition'
            }`}
            
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filteredCertificates.map((cert, index) => (
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
                    {cert.credentialId && (
                      <p className="text-sm">Credential ID: {cert.credentialId}</p>
                    )}
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
