import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  FileText
} from 'lucide-react';

const SocialMediaManager = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [newAccount, setNewAccount] = useState({ name: '', url: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'socialLinks'));
        const links = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setSocialLinks(links);
      } catch (error) {
        console.error('Error fetching social media accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleAddAccount = async () => {
    if (newAccount.name && newAccount.url) {
      try {
        const docRef = await addDoc(collection(db, 'socialLinks'), {
          name: newAccount.name,
          url: newAccount.url,
        });
        setSocialLinks([...socialLinks, { ...newAccount, id: docRef.id }]);
        setNewAccount({ name: '', url: '' });
      } catch (error) {
        console.error('Error adding social media account:', error);
      }
    }
  };

  const handleEditAccount = async () => {
    if (editing) {
      try {
        const docRef = doc(db, 'socialLinks', editing.id);
        await updateDoc(docRef, {
          name: editing.name,
          url: editing.url,
        });
        setSocialLinks(
          socialLinks.map((link) =>
            link.id === editing.id ? editing : link
          )
        );
        setEditing(null);
      } catch (error) {
        console.error('Error updating social media account:', error);
      }
    }
  };

  const handleDeleteAccount = async (id) => {
    try {
      await deleteDoc(doc(db, 'socialLinks', id));
      setSocialLinks(socialLinks.filter((link) => link.id !== id));
    } catch (error) {
      console.error('Error deleting social media account:', error);
    }
  };

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'github':
        return <Github className="w-8 h-8 text-purple-400" />;
      case 'linkedin':
        return <Linkedin className="w-8 h-8 text-purple-400" />;
      case 'twitter':
        return <Twitter className="w-8 h-8 text-purple-400" />;
      case 'youtube':
        return <Youtube className="w-8 h-8 text-purple-400" />;
      case 'instagram':
        return <Instagram className="w-8 h-8 text-purple-400" />;
      case 'facebook':
        return <Facebook className="w-8 h-8 text-purple-400" />;
      default:
        return <FileText className="w-8 h-8 text-purple-400" />;
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <section className="min-h-screen py-20 bg-midnight text-white overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
            Manage Social Media Accounts
          </span>
        </h2>

        {/* Add New Account */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddAccount();
          }}
          className="bg-navy p-6 rounded-xl mb-12 shadow-xl space-y-4"
        >
          <h3 className="text-2xl font-semibold mb-4">Add New Account</h3>
          <input
            type="text"
            placeholder="Account Name (e.g., GitHub)"
            value={newAccount.name}
            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-800 text-white"
          />
          <input
            type="url"
            placeholder="Account URL"
            value={newAccount.url}
            onChange={(e) => setNewAccount({ ...newAccount, url: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-800 text-white"
          />
          <button
            type="submit"
            className="w-full p-3 bg-cyan-400 hover:bg-cyan-500 rounded-lg text-white"
          >
            Add Account
          </button>
        </form>

        {/* Display Accounts */}
        <div className="space-y-6">
          {socialLinks.map((link) => (
            <div
              key={link.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between bg-navy p-6 rounded-xl shadow-xl space-y-4 md:space-y-0"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-400 bg-opacity-20 rounded-lg">
                  {getIcon(link.name)}
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{link.name}</h4>
                  <p className="text-gray-400 break-words">{link.url}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setEditing(link)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAccount(link.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Account Form */}
        {editing && (
          <div className="bg-navy p-6 rounded-xl shadow-xl mt-12 space-y-4">
            <h3 className="text-2xl font-semibold mb-4">Edit Account</h3>
            <input
              type="text"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-800 text-white"
            />
            <input
              type="url"
              value={editing.url}
              onChange={(e) => setEditing({ ...editing, url: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-800 text-white"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleEditAccount}
                className="p-3 w-full bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(null)}
                className="p-3 w-full bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SocialMediaManager;
