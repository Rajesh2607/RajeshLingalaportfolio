import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ImageWithLoader = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-300 animate-pulse rounded-md">
          <div className="w-6 h-6 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        className={`${className} transition-opacity duration-500 ${
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
    <div className="container mx-auto px-4  py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Blog</h1>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300'
            } hover:bg-blue-500 transition`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading
          ? Array(6)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-lg shadow-md animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-600 rounded-md mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))
          : filteredBlogs.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <ImageWithLoader
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-2xl font-semibold text-white mb-2">{post.title}</h2>
                <p className="text-gray-400 text-sm">
                  {post.date} • {post.readTime}
                </p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Blog;
