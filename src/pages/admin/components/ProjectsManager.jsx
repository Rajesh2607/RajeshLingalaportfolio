import React, { useState } from 'react';
import { db } from '../../../firebase/config';  // Import Firebase config
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';  // Firestore functions
import { Github, ExternalLink, Trash } from 'lucide-react';  // For Icons

const ProjectManager = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [github, setGithub] = useState('');
  const [live, setLive] = useState('');
  const [image, setImage] = useState('');
  const [projects, setProjects] = useState([]);  // To store fetched projects

  // Fetch existing projects from Firestore
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

  // Adding a new project to Firestore
  const addProject = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'projects'), {
        title,
        description,
        technologies: technologies.split(',').map((tech) => tech.trim()),
        github,
        live,
        image,
      });
      fetchProjects();  // Reload the projects after adding
      clearForm();  // Clear the form
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      fetchProjects();  // Reload the projects after deleting
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Update a project (just an example with title)
  const updateProject = async (id) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, {
        title: 'Updated Project Title',  // Update with new data
      });
      fetchProjects();  // Reload after updating
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  // Clear the form
  const clearForm = () => {
    setTitle('');
    setDescription('');
    setTechnologies('');
    setGithub('');
    setLive('');
    setImage('');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-6">Manage Projects</h1>

      {/* Add New Project Form */}
      <form onSubmit={addProject} className="bg-[#1d3a6e] p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Add New Project</h2>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project Title"
            className="w-full p-3 text-black rounded"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project Description"
            className="w-full p-3 text-black rounded"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            placeholder="Technologies (comma separated)"
            className="w-full p-3 text-black rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="url"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="GitHub Link"
            className="w-full p-3 text-black rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="url"
            value={live}
            onChange={(e) => setLive(e.target.value)}
            placeholder="Live Demo Link"
            className="w-full p-3 text-black rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Project Image URL"
            className="w-full p-3 text-black rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-[#17c0f8] p-3 text-white rounded">
          Add Project
        </button>
      </form>

      {/* Displaying existing projects */}
      <h2 className="text-3xl font-semibold text-white mb-4">Existing Projects</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#112240] p-6 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <p className="text-gray-400">{project.description}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => updateProject(project.id)}
                className="text-white hover:text-[#17c0f8] flex items-center"
              >
                <span>Update</span>
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="text-red-500 hover:text-red-400 flex items-center"
              >
                <Trash size={20} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager;
