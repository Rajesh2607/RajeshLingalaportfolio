import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Award, Plus, Trash2, Edit2, Save, ExternalLink, Shield, Calendar, Building, Sparkles, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CertificatesManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialId: '',
    image: '',
    link: '',
    domain: ''
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'certificates'));
      const certificateData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCertificates(certificateData);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const domainArray = formData.domain
      .split(',')
      .map(d => d.trim())
      .filter(d => d.length > 0);

    const dataToSave = {
      ...formData,
      domain: domainArray
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'certificates', editingId), dataToSave);
      } else {
        await addDoc(collection(db, 'certificates'), dataToSave);
      }
      setFormData({
        title: '',
        issuer: '',
        date: '',
        credentialId: '',
        image: '',
        link: '',
        domain: ''
      });
      setEditingId(null);
      fetchCertificates();
    } catch (error) {
      console.error('Error saving certificate:', error);
      alert('Error saving certificate');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await deleteDoc(doc(db, 'certificates', id));
        fetchCertificates();
      } catch (error) {
        console.error('Error deleting certificate:', error);
        alert('Error deleting certificate');
      }
    }
  };

  const handleEdit = (certificate) => {
    setFormData({
      ...certificate,
      domain: Array.isArray(certificate.domain) ? certificate.domain.join(', ') : certificate.domain || ''
    });
    setEditingId(certificate.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl p-6 border border-emerald-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl flex items-center justify-center">
            <Award size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-emerald-400" />
              Certificates Management
            </h2>
            <p className="text-gray-300">Manage your professional certifications</p>
          </div>
        </div>
      </motion.div>

      {/* Certificate Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Plus size={20} className="mr-2 text-green-400" />
          {editingId ? 'Edit Certificate' : 'Add New Certificate'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Award size={16} className="mr-2 text-emerald-400" />
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Certificate title"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Building size={16} className="mr-2 text-blue-400" />
                Issuer
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Issuing organization"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Calendar size={16} className="mr-2 text-purple-400" />
                Date
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Issue date"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Shield size={16} className="mr-2 text-cyan-400" />
                Credential ID
              </label>
              <input
                type="text"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Credential ID"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Tag size={16} className="mr-2 text-orange-400" />
                Domain
              </label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Separate multiple domains with commas"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent backdrop-blur-sm"
              placeholder="Certificate image URL"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2 flex items-center">
              <ExternalLink size={16} className="mr-2 text-green-400" />
              Certificate Link
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
              placeholder="https://www.certificate-link.com"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Save className="mr-2" size={20} />
              {editingId ? 'Update Certificate' : 'Add Certificate'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Certificates List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Existing Certificates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2">{certificate.title}</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Building size={14} className="mr-2 text-blue-400" />
                        {certificate.issuer}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-purple-400" />
                        {certificate.date}
                      </div>
                      <div className="flex items-center">
                        <Shield size={14} className="mr-2 text-cyan-400" />
                        ID: {certificate.credentialId}
                      </div>
                      <div className="flex items-center">
                        <Tag size={14} className="mr-2 text-orange-400" />
                        {Array.isArray(certificate.domain) ? certificate.domain.join(', ') : certificate.domain}
                      </div>
                    </div>
                    {certificate.link && (
                      <a
                        href={certificate.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-3 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        View Certificate
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(certificate)}
                      className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(certificate.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {certificate.image && (
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="w-full h-32 object-cover rounded-xl border border-slate-600/50"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CertificatesManager;