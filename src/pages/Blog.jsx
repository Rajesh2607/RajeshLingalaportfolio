import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogCollection = collection(db, 'blogs');
      const blogSnapshot = await getDocs(blogCollection);
      const blogList = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogList);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Blog</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map(post => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-semibold text-white mb-2">{post.title}</h2>
            <p className="text-gray-400 text-sm">{post.date} • {post.readTime}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
