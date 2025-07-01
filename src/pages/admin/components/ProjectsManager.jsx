import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase/config';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { Trash, Code, Github, ExternalLink, Upload, Save, Plus, Edit, Sparkles, Tag, Globe, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectManager = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [github, setGithub] = useState('');
  const [live, setLive] = useState('');
  const [category, setCategory] = useState('');
  const [domain, setDomain] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [mediaPath, setMediaPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async (file) => {
    const ext = file.name.split('.').pop();
    const fileName = `${file.name}_${Date.now()}.${ext}`;
    const mediaStoragePath = `project_media/${fileName}`;
    const mediaRef = ref(storage, mediaStoragePath);
    await uploadBytes(mediaRef, file);
    const downloadUrl = await getDownloadURL(mediaRef);
    return { downloadUrl, mediaStoragePath };
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.type.startsWith('video') ? 'video' : 'image';
      setMediaType(type);
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let mediaUrl = '';
      let mediaStoragePath = '';

      if (mediaFile) {
        const upload = await uploadMedia(mediaFile);
        mediaUrl = upload.downloadUrl;
        mediaStoragePath = upload.mediaStoragePath;
      }

      const projectData = {
        title,
        description,
        technologies: technologies.split(',').map((tech) => tech.trim()),
        github,
        live,
        category,
        domain,
        media: mediaUrl || mediaPreview,
        mediaType,
        mediaPath: mediaStoragePath || mediaPath || '',
      };

      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), projectData);
      } else {
        await addDoc(collection(db, 'projects'), projectData);
      }

      fetchProjects();
      clearForm();
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  const deleteProject = async (id, mediaPath) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        if (mediaPath) {
          const mediaRef = ref(storage, mediaPath);
          await deleteObject(mediaRef).catch(() => {});
        }
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const startUpdate = (project) => {
    setTitle(project.title);
    setDescription(project.description);
    setTechnologies(project.technologies.join(', '));
    setGithub(project.github);
    setLive(project.live);
    setCategory(project.category || '');
    setDomain(project.domain || '');
    setMediaPreview(project.media || '');
    setMediaType(project.mediaType || null);
    setEditingId(project.id);
    setMediaPath(project.mediaPath || '');
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setTechnologies('');
    setGithub('');
    setLive('');
    setCategory('');
    setDomain('');
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setEditingId(null);
    setMediaPath(null);
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
        className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl p-6 border border-cyan-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center">
            <Code size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-cyan-400" />
              Projects Management
            </h2>
            <p className="text-gray-300">Manage your project portfolio</p>
          </div>
        </div>
      </motion.div>

      {/* Project Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Plus size={20} className="mr-2 text-green-400" />
          {editingId ? 'Update Project' : 'Add New Project'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Code size={16} className="mr-2 text-cyan-400" />
                Project Title
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Tag size={16} className="mr-2 text-purple-400" />
                Category
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                type="text"
                placeholder="Category (e.g., Web App, Mobile App)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Globe size={16} className="mr-2 text-green-400" />
                Domain
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                type="text"
                placeholder="Domain (e.g., EdTech, HealthTech)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Technologies</label>
              <input
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm"
                type="text"
                placeholder="Technologies (comma separated)"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <Github size={16} className="mr-2 text-gray-400" />
                GitHub Link
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent backdrop-blur-sm"
                type="url"
                placeholder="GitHub Link"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2 flex items-center">
                <ExternalLink size={16} className="mr-2 text-blue-400" />
                Live Demo Link
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                type="url"
                placeholder="Live Demo Link"
                value={live}
                onChange={(e) => setLive(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Project Description</label>
            <textarea
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm resize-none"
              rows="4"
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2 flex items-center">
              <ImageIcon size={16} className="mr-2 text-pink-400" />
              Project Media
            </label>
            <input
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-500/20 file:text-pink-300 hover:file:bg-pink-500/30"
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
            />

            {mediaPreview && (
              <div className="mt-4">
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="Preview" className="w-64 rounded-xl border-2 border-slate-600/50" />
                ) : (
                  <video src={mediaPreview} controls className="w-64 rounded-xl border-2 border-slate-600/50" />
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Save className="mr-2" size={20} />
              {editingId ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Projects List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Existing Projects</h3>
        <div className="space-y-6">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-xl"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{project.title}</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.category && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-400/30">
                          {project.category}
                        </span>
                      )}
                      {project.domain && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full border border-green-400/30">
                          {project.domain}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4">{project.description}</p>

                    {project.media && (
                      <div className="mb-4">
                        {project.mediaType === 'image' ? (
                          <img src={project.media} alt={project.title} className="w-64 rounded-xl border border-slate-600/50" />
                        ) : (
                          <video src={project.media} controls className="w-64 rounded-xl border border-slate-600/50" />
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-700/50 text-gray-300 text-xs rounded-lg border border-slate-600/50">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => startUpdate(project)}
                      className="flex items-center px-4 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                    >
                      <Edit size={16} className="mr-2" />
                      Update
                    </button>
                    <button
                      onClick={() => deleteProject(project.id, project.mediaPath)}
                      className="flex items-center px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;