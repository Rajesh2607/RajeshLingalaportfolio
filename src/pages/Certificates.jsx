import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Award, Shield, Calendar, Hash, Layers, Star, AlertCircle, Loader } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [groupedCertificates, setGroupedCertificates] = useState({});
  const [domains, setDomains] = useState(['All']);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadedMap, setImageLoadedMap] = useState({});
  const [imageErrorMap, setImageErrorMap] = useState({});

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const querySnapshot = await getDocs(collection(db, 'certificates'));
        
        if (querySnapshot.empty) {
          console.log('No certificates found in database');
          setCertificates([]);
          setGroupedCertificates({});
          return;
        }

        const certs = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          certs.push({
            id: doc.id,
            title: data.title || 'Untitled Certificate',
            issuer: data.issuer || 'Unknown Issuer',
            date: data.date || 'Date not specified',
            credentialId: data.credentialId || 'N/A',
            image: data.image || '',
            link: data.link || '',
            domain: Array.isArray(data.domain) ? data.domain : (data.domain ? [data.domain] : ['General'])
          });
        });

        console.log('Fetched certificates:', certs);
        setCertificates(certs);

        // Group certificates by domain
        const grouped = {};
        certs.forEach(cert => {
          cert.domain.forEach(domain => {
            if (!grouped[domain]) {
              grouped[domain] = [];
            }
            grouped[domain].push(cert);
          });
        });

        setGroupedCertificates(grouped);

        // Extract unique domains
        const uniqueDomains = ['All', ...Object.keys(grouped)];
        setDomains(uniqueDomains);

      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError('Failed to load certificates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleImageLoad = (id) => {
    setImageLoadedMap(prev => ({ ...prev, [id]: true }));
  };

  const handleImageError = (id) => {
    setImageErrorMap(prev => ({ ...prev, [id]: true }));
  };

  // Filter grouped certificates by selected domain
  const getFilteredGroupedCertificates = () => {
    if (selectedDomain === 'All') {
      return groupedCertificates;
    }
    return { [selectedDomain]: groupedCertificates[selectedDomain] || [] };
  };

  const filteredGroupedCertificates = getFilteredGroupedCertificates();

  // Certificate card component
  const CertificateCard = ({ cert, index }) => {
    const isImageLoaded = imageLoadedMap[cert.id];
    const hasImageError = imageErrorMap[cert.id];

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        className="group bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-400/10"
        whileHover={{ y: -8 }}
      >
        {/* Certificate Image */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {cert.image && !hasImageError ? (
            <>
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              )}
              <img
                src={cert.image}
                alt={cert.title}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(cert.id)}
                onError={() => handleImageError(cert.id)}
                loading="lazy"
              />
            </>
          ) : (
            // Fallback for missing or error image
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
              <div className="text-center text-gray-400">
                <Award size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">Certificate Image</p>
              </div>
            </div>
          )}

          {/* Overlay with action button */}
          {cert.link && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <motion.a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-cyan-500/30 backdrop-blur-sm rounded-full text-cyan-300 hover:bg-cyan-500/50 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink size={24} />
              </motion.a>
            </div>
          )}

          {/* Verified badge */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 backdrop-blur-sm text-green-300 text-xs font-semibold rounded-full border border-green-400/30">
              <Shield size={12} />
              <span>Verified</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
            {cert.title}
          </h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-gray-400">
              <Award size={14} className="text-cyan-400 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{cert.issuer}</span>
            </div>
            
            <div className="flex items-center text-gray-400">
              <Calendar size={14} className="text-purple-400 mr-2 flex-shrink-0" />
              <span className="text-sm">{cert.date}</span>
            </div>
            
            {cert.credentialId && cert.credentialId !== 'N/A' && (
              <div className="flex items-center text-gray-400">
                <Hash size={14} className="text-blue-400 mr-2 flex-shrink-0" />
                <span className="text-xs font-mono bg-gray-800/50 px-2 py-1 rounded border border-gray-600/50">
                  {cert.credentialId}
                </span>
              </div>
            )}
          </div>

          {/* Domains */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Layers size={14} className="text-cyan-400 mr-2" />
              <span className="text-gray-300 text-sm font-medium">Domains</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cert.domain.slice(0, 3).map((domain, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded-md text-xs font-medium border border-gray-600/50 hover:border-cyan-400/50 hover:text-cyan-300 transition-all duration-300"
                >
                  {domain}
                </span>
              ))}
              {cert.domain.length > 3 && (
                <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-md text-xs font-medium">
                  +{cert.domain.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-medium">Certified</span>
            </div>
            
            {cert.link && (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm font-medium"
              >
                <span>View</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Domain section component
  const DomainSection = ({ domain, certificates, domainIndex }) => {
    const totalCertificates = certificates.length;
    const uniqueIssuers = [...new Set(certificates.map(c => c.issuer))].length;

    return (
      <motion.section
        key={domain}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: domainIndex * 0.2, duration: 0.8 }}
        className="mb-20"
      >
        {/* Beautiful Domain Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: domainIndex * 0.2 + 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              {domain}
            </span>
          </motion.h2>
          
          {/* Beautiful gradient line under domain name */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: domainIndex * 0.2 + 0.5, duration: 1, ease: "easeOut" }}
            className="relative mx-auto mb-6"
            style={{ maxWidth: "200px" }}
          >
            <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"></div>
            <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full blur-sm opacity-60"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: domainIndex * 0.2 + 0.6 }}
            className="flex flex-wrap justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <Award size={16} className="text-cyan-400" />
              <span>{totalCertificates} Certificate{totalCertificates !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield size={16} className="text-purple-400" />
              <span>{uniqueIssuers} Issuer{uniqueIssuers !== 1 ? 's' : ''}</span>
            </div>
          </motion.div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {certificates.map((cert, index) => (
              <CertificateCard key={`${cert.id}-${domain}`} cert={cert} index={index} />
            ))}
          </AnimatePresence>
        </div>
      </motion.section>
    );
  };

  // Loading skeleton
  const CertificateSkeleton = () => (
    <div className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-700"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  const DomainSkeleton = () => (
    <div className="mb-20">
      <div className="text-center mb-12">
        <div className="h-12 bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-1 w-32 bg-gray-700 rounded mx-auto mb-6 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array(3).fill(null).map((_, i) => <CertificateSkeleton key={i} />)}
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <AlertCircle size={64} className="text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f]">
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              Professional Certificates
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            A comprehensive collection of my professional certifications and achievements, 
            organized by domain to showcase expertise across various technologies
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{certificates.length}</div>
              <div className="text-gray-400">Total Certificates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{Object.keys(groupedCertificates).length}</div>
              <div className="text-gray-400">Domains</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {[...new Set(certificates.map(c => c.issuer))].length}
              </div>
              <div className="text-gray-400">Issuers</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Domain Filter */}
      {domains.length > 1 && (
        <section className="px-6 md:px-8 lg:px-12 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#112240]/80 to-[#1a2f4a]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 text-center"
            >
              <h3 className="text-white font-semibold mb-6 flex items-center justify-center">
                <Layers size={18} className="mr-2 text-purple-400" />
                Filter by Domain
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {domains.map((domain) => (
                  <button
                    key={domain}
                    onClick={() => setSelectedDomain(domain)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      selectedDomain === domain
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-cyan-400/50 hover:text-cyan-300'
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-gray-400">
                Showing {Object.values(filteredGroupedCertificates).flat().length} of {certificates.length} certificates
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Certificates by Domain */}
      <section className="px-6 md:px-8 lg:px-12 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div>
              {Array(3).fill(null).map((_, i) => <DomainSkeleton key={i} />)}
            </div>
          ) : Object.keys(filteredGroupedCertificates).length > 0 ? (
            Object.entries(filteredGroupedCertificates).map(([domain, domainCertificates], domainIndex) => (
              <DomainSection
                key={domain}
                domain={domain}
                certificates={domainCertificates}
                domainIndex={domainIndex}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="max-w-lg mx-auto">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  <Award size={32} className="text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">No certificates found</h3>
                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                  {certificates.length === 0 
                    ? "No certificates available in the database yet."
                    : "No certificates match the selected domain. Try selecting a different domain."
                  }
                </p>
                <button
                  onClick={() => setSelectedDomain('All')}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 text-lg font-semibold"
                >
                  Show All Certificates
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Certificates;