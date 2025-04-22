import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  FileText,
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
        return <Github className="w-8 h-8 text-white" />;
      case 'linkedin':
        return <Linkedin className="w-8 h-8 text-white" />;
      case 'twitter':
        return <Twitter className="w-8 h-8 text-white" />;
      case 'youtube':
        return <Youtube className="w-8 h-8 text-white" />;
      case 'instagram':
        return <Instagram className="w-8 h-8 text-white" />;
      case 'facebook':
        return <Facebook className="w-8 h-8 text-white" />;
      case 'adobe':
        return <FileText className="w-8 h-8 text-white" />;
      default:
        return <FileText className="w-8 h-8 text-white" />;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a192f] p-8">
      <h2 className="text-3xl text-white mb-4">Manage Social Media Accounts</h2>

      {/* Add New Account */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl mb-4">Add New Account</h3>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Account Name (e.g., GitHub)"
            value={newAccount.name}
            onChange={(e) =>
              setNewAccount({ ...newAccount, name: e.target.value })
            }
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              newAccount.name &&
              newAccount.url &&
              handleAddAccount()
            }
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="url"
            placeholder="Account URL"
            value={newAccount.url}
            onChange={(e) =>
              setNewAccount({ ...newAccount, url: e.target.value })
            }
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              newAccount.name &&
              newAccount.url &&
              handleAddAccount()
            }
            className="p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddAccount}
            className="p-2 bg-blue-600 text-white rounded"
          >
            Add Account
          </button>
        </div>
      </div>

      {/* Display Accounts */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl mb-4">Current Accounts</h3>
        <div className="space-y-4">
          {socialLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-800 rounded-lg">
                  {getIcon(link.name)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{link.name}</h4>
                  <p>{link.url}</p>
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setEditing(link)}
                  className="bg-yellow-500 text-white p-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAccount(link.id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Account */}
      {editing && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
          <h3 className="text-2xl mb-4">Edit Account</h3>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                editing.name &&
                editing.url &&
                handleEditAccount()
              }
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="url"
              value={editing.url}
              onChange={(e) =>
                setEditing({ ...editing, url: e.target.value })
              }
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                editing.name &&
                editing.url &&
                handleEditAccount()
              }
              className="p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleEditAccount}
              className="p-2 bg-green-600 text-white rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditing(null)}
              className="p-2 bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaManager;
