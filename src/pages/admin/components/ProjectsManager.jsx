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
import { Trash } from 'lucide-react';

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
        mediaPath: mediaStoragePath || mediaPath || '', // include existing if updating
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-6">Manage Projects</h1>

      <form onSubmit={handleSubmit} className="bg-[#1d3a6e] p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {editingId ? 'Update Project' : 'Add New Project'}
        </h2>

        <input
          className="w-full p-3 text-black rounded mb-4"
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-3 text-black rounded mb-4"
          rows="4"
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full p-3 text-black rounded mb-4"
          type="text"
          placeholder="Category (e.g., Web App, Mobile App)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          className="w-full p-3 text-black rounded mb-4"
          type="text"
          placeholder="Domain (e.g., EdTech, HealthTech)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <input
          className="w-full p-3 text-black rounded mb-4"
          type="text"
          placeholder="Technologies (comma separated)"
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
        />

        <input
          className="w-full p-3 text-black rounded mb-4"
          type="url"
          placeholder="GitHub Link"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
        />

        <input
          className="w-full p-3 text-black rounded mb-4"
          type="url"
          placeholder="Live Demo Link"
          value={live}
          onChange={(e) => setLive(e.target.value)}
        />

        <input
          className="w-full p-3 bg-white rounded mb-2"
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaChange}
        />

        {mediaPreview && (
          <div className="mt-2">
            {mediaType === 'image' ? (
              <img src={mediaPreview} alt="Preview" className="w-64 rounded border-2 border-white" />
            ) : (
              <video src={mediaPreview} controls className="w-64 rounded border-2 border-white" />
            )}
          </div>
        )}

        <button type="submit" className="w-full mt-4 bg-[#17c0f8] p-3 text-white rounded">
          {editingId ? 'Update Project' : 'Add Project'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={clearForm}
            className="w-full mt-2 bg-gray-500 p-3 text-white rounded"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h2 className="text-3xl font-semibold text-white mb-4">Existing Projects</h2>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#112240] p-6 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                {project.category && (
                  <p className="text-sm text-[#17c0f8] mb-1">Category: {project.category}</p>
                )}
                {project.domain && (
                  <p className="text-sm text-[#17c0f8] mb-2">Domain: {project.domain}</p>
                )}
                <p className="text-gray-400">{project.description}</p>

                {project.media && (
                  <div className="mt-2">
                    {project.mediaType === 'image' ? (
                      <img src={project.media} alt={project.title} className="w-64 rounded" />
                    ) : (
                      <video src={project.media} controls className="w-64 rounded" />
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-4 mt-4 md:mt-0">
                <button
                  onClick={() => startUpdate(project)}
                  className="text-white hover:text-[#17c0f8]"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteProject(project.id, project.mediaPath)}
                  className="text-red-500 hover:text-red-400 flex items-center"
                >
                  <Trash size={20} />
                  <span className="ml-1">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager;
