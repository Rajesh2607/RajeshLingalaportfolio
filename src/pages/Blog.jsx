import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ImageWithLoader = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-600 rounded-md animate-pulse z-10">
          <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        className={`w-full h-full object-cover rounded-md transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      const blogCollection = collection(db, 'blogs');
      const blogSnapshot = await getDocs(blogCollection);
      const blogList = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogList);
      setFilteredBlogs(blogList);
      setIsLoading(false);

      const uniqueCategories = ['All', ...new Set(blogList.map(blog => blog.category))];
      setCategories(uniqueCategories);
    };

    fetchBlogs();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog => blog.category === category);
      setFilteredBlogs(filtered);
    }
  };

  return (
    <div className="w-full min-h-screen py-12 px-4 md:px-8 bg-[#0a192f] flex flex-col items-center">
            {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">My Personal Blogs</h1>
        
        <p className="text-gray-300">Click on a domain to view specific Blog</p>
      </motion.div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={`px-4 py-2 rounded-md border ${
              selectedCategory === category
                ? 'bg-[#17c0f8] text-white border-transparent'
                : 'text-[#17c0f8] border-[#17c0f8] hover:bg-[#17c0f8] hover:text-white'
            } transition`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Cards */}
      <div className="w-full max-w-7xl grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading
          ? Array(6)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-[#112240] p-4 rounded-lg shadow-md animate-pulse w-full"
                >
                  <div className="w-full h-48 bg-[#112240] rounded-md mb-4"></div>
                  <div className="h-6 bg-[#112240] rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-[#112240] rounded w-1/2"></div>
                </div>
              ))
          : filteredBlogs.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="bg-[#112240] hover:bg-[#1f2937] transition-colors duration-300 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow w-full flex flex-col cursor-pointer"
          >
            <div className="relative w-full h-48">
              <ImageWithLoader
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow">
                {post.category || 'General'}
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <h2 className="text-xl font-bold text-white">{post.title}</h2>
            </div>
          </Link>

            ))}
      </div>
    </div>
  );
};

export default Blog;
