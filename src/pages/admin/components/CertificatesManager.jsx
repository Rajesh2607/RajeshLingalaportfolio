import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Award, Plus, Trash2, Edit2, Save, ExternalLink } from 'lucide-react';

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
    domain: '' // keep as string for input (comma separated)
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

    // Convert domain string to array (split by comma, trim spaces, filter out empty)
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#17c0f8]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#112240] rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Award className="mr-2 text-[#17c0f8]" />
        Certificates Management
      </h2>

      {/* Certificate Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Issuer</label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Date</label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Credential ID</label>
            <input
              type="text"
              value={formData.credentialId}
              onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Domain</label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
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
            className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">Certificate Link</label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full px-3 py-2 bg-[#1d3a6e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
            placeholder="https://www.certificate-link.com"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-[#17c0f8] text-black rounded-lg hover:bg-[#17c0f8]/90 transition-colors"
          >
            <Save className="mr-2" size={20} />
            {editingId ? 'Update Certificate' : 'Add Certificate'}
          </button>
        </div>
      </form>

      {/* Certificates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="bg-[#1d3a6e] p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white">{certificate.title}</h3>
                <p className="text-gray-400">{certificate.issuer}</p>
                <p className="text-sm text-gray-400">{certificate.date}</p>
                <p className="text-sm text-gray-400">ID: {certificate.credentialId}</p>
                <p className="text-sm text-[#17c0f8]">
                  Domain: {Array.isArray(certificate.domain) ? certificate.domain.join(', ') : certificate.domain}
                </p>
                {certificate.link && (
                  <a
                    href={certificate.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#17c0f8] flex items-center mt-2 hover:underline"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    View Certificate
                  </a>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(certificate)}
                  className="p-2 text-[#17c0f8] hover:text-[#17c0f8]/80"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(certificate.id)}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            {certificate.image && (
              <img
                src={certificate.image}
                alt={certificate.title}
                className="mt-4 w-full h-32 object-cover rounded-md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificatesManager;
