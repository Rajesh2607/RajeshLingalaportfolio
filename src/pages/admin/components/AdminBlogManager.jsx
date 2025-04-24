import React, { useEffect, useState } from 'react';
import { db, storage } from '../../../firebase/config';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [mode, setMode] = useState('view'); // view | add | edit
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [blogData, setBlogData] = useState({
    title: '',
    date: '',
    readTime: '',
    category: '',
    image: '',
    content: ''
  });

  const fetchBlogs = async () => {
    const snapshot = await getDocs(collection(db, 'blogs'));
    const blogList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBlogs(blogList);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'blogs', id));
    fetchBlogs();
  };

  const handleEdit = async (id) => {
    const docRef = doc(db, 'blogs', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setBlogData({
        title: data.title,
        date: data.date,
        readTime: data.readTime,
        category: data.category,
        image: data.image,
        content: data.content
      });
      setEditingId(id);
      setMode('edit');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = blogData.image;

    if (imageFile) {
      const imageRef = ref(storage, `BLOG_IMAGES/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const avatarRef = ref(storage, 'https://firebasestorage.googleapis.com/v0/b/myprofolio-34d7c.firebasestorage.app/o/profile%2FWhatsApp%20Image%202025-04-20%20at%2018.48.10_4a2d17cb.jpg?alt=media&token=5ac51520-47e7-4799-ab7a-439ef0a4efc2');
    const avatarUrl = await getDownloadURL(avatarRef);

    const newBlogData = {
      ...blogData,
      image: imageUrl,
      author: {
        name: 'LINGALA RAJESH',
        avatar: avatarUrl
      }
    };

    if (mode === 'add') {
      await addDoc(collection(db, 'blogs'), newBlogData);
    } else if (mode === 'edit') {
      await updateDoc(doc(db, 'blogs', editingId), newBlogData);
    }

    setBlogData({
      title: '',
      date: '',
      readTime: '',
      category: '',
      image: '',
      content: ''
    });
    setImageFile(null);
    setMode('view');
    setUploading(false);
    fetchBlogs();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      {mode === 'view' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Blogs</h1>
            <button
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                setBlogData({
                  title: '',
                  date: '',
                  readTime: '',
                  category: '',
                  image: '',
                  content: ''
                });
                setMode('add');
              }}
            >
              Add Blog
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Title</th>
                <th className="border-b p-2">Date</th>
                <th className="border-b p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td className="p-2 border-b">{blog.title}</td>
                  <td className="p-2 border-b">{blog.date}</td>
                  <td className="p-2 border-b flex gap-4">
                    <button
                      onClick={() => handleEdit(blog.id)}
                      className="text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(mode === 'add' || mode === 'edit') && (
        <div className="mt-10">
          <h1 className="text-3xl font-bold mb-6">{mode === 'add' ? 'Add' : 'Edit'} Blog</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="title" placeholder="Title" value={blogData.title} onChange={handleChange} className="w-full p-2 rounded bg-gray-700" />
            <input
  type="date"
  name="date"
  value={blogData.date}
  onChange={handleChange}
  className="w-full p-2 rounded bg-gray-700 text-black"
/><input name="readTime" placeholder="Read Time" value={blogData.readTime} onChange={handleChange} className="w-full p-2 rounded bg-gray-700" />
            <input name="category" placeholder="Category" value={blogData.category} onChange={handleChange} className="w-full p-2 rounded bg-gray-700" />
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 rounded bg-gray-700" />
            <ReactQuill value={blogData.content} onChange={value => setBlogData(prev => ({ ...prev, content: value }))} className="bg-white text-black rounded" />
            <div className="flex gap-4">
              <button type="submit" disabled={uploading} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                {uploading ? 'Uploading...' : mode === 'add' ? 'Add Blog' : 'Update Blog'}
              </button>
              <button
                type="button"
                onClick={() => setMode('view')}
                className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminBlogManager;
