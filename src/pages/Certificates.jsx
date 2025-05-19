import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [loading, setLoading] = useState(true);
  const [imageLoadedMap, setImageLoadedMap] = useState({});
  const [isImageLoadingMap, setIsImageLoadingMap] = useState({});

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

        const loadingState = {};
        certs.forEach(cert => {
          loadingState[cert.id] = true;
        });
        setIsImageLoadingMap(loadingState);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleImageLoad = (id) => {
    setIsImageLoadingMap(prev => ({ ...prev, [id]: false }));
    setImageLoadedMap(prev => ({ ...prev, [id]: true }));
  };

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

  // Filter certificates based on selectedDomain
  const getFilteredCertificatesByDomain = () => {
    const grouped = {};

    certificates.forEach(cert => {
      if (selectedDomain !== 'All' && cert.domain !== selectedDomain) return;
      if (!grouped[cert.domain]) grouped[cert.domain] = [];
      grouped[cert.domain].push(cert);
    });

    return grouped;
  };

  const groupedCertificates = getFilteredCertificatesByDomain();

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

      {/* Domain-based Sections */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        Object.keys(groupedCertificates).map(domain => (
          <div key={domain} className="mb-16">
            {selectedDomain === 'All' && (
              <div className="flex justify-center mb-6">
  <h2 className="text-3xl font-bold text-[#17c0f8] ">
    {domain}  Certificates
  </h2>
</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {groupedCertificates[domain].map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#112240] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative h-48">
                    {isImageLoadingMap[cert.id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                        <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className={`w-full h-full object-cover transition-opacity duration-500 rounded-lg ${
                        isImageLoadingMap[cert.id] ? 'opacity-0' : 'opacity-100'
                      }`}
                      onLoad={() => handleImageLoad(cert.id)}
                      onError={() =>
                        setIsImageLoadingMap(prev => ({ ...prev, [cert.id]: false }))
                      }
                      loading="lazy"
                    />
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
        ))
      )}
    </div>
  );
};

export default Certificates;
