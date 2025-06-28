import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, User, Tag, ArrowRight } from 'lucide-react';

const ImageWithLoader = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg animate-pulse z-10">
          <div className="w-8 h-8 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
        </div>
      )}
      {hasError ? (
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Tag size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover rounded-lg transition-all duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );
};

const BlogCard = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Link
        to={`/blog/${post.id}`}
        className="block h-full bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-700/50 hover:border-cyan-400/50"
      >
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <ImageWithLoader
            src={post.image}
            alt={post.title}
            className="w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg">
              <Tag size={12} className="mr-1" />
              {post.category || 'General'}
            </span>
          </div>

          {/* Read More Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <ArrowRight size={24} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4 flex-1 flex flex-col">
          {/* Title */}
          <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2 flex-1">
            {post.title}
          </h2>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-400 mt-auto">
            <div className="flex items-center space-x-4">
              {post.date && (
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{post.date}</span>
                </div>
              )}
              {post.readTime && (
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{post.readTime} min read</span>
                </div>
              )}
            </div>
          </div>

          {/* Author */}
          {post.author && (
            <div className="flex items-center space-x-3 pt-3 border-t border-gray-700/50">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <User size={12} />
                <span>{post.author.name}</span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-2xl overflow-hidden animate-pulse border border-gray-700/50 h-full">
    <div className="h-56 bg-gradient-to-br from-gray-700 to-gray-800"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-700 rounded-lg w-3/4"></div>
      <div className="flex space-x-4">
        <div className="h-4 bg-gray-700 rounded w-20"></div>
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </div>
      <div className="flex items-center space-x-3 pt-2">
        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const blogCollection = collection(db, 'blogs');
        const blogSnapshot = await getDocs(blogCollection);
        const blogList = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort blogs by date (newest first)
        const sortedBlogs = blogList.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setBlogs(sortedBlogs);
        setFilteredBlogs(sortedBlogs);

        const uniqueCategories = ['All', ...new Set(blogList.map(blog => blog.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.category && blog.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBlogs(filtered);
  }, [selectedCategory, searchTerm, blogs]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f] overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative py-20 px-6 md:px-8 lg:px-12">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-600/5"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              My Blog
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Insights, tutorials, and thoughts on web development, technology, and design
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-[#112240]/80 backdrop-blur-sm border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 text-lg"
            />
          </div>
        </motion.div>
      </div>

      {/* Main Content Container */}
      <div className="px-6 md:px-8 lg:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-6 py-3 rounded-2xl border-2 font-semibold transition-all duration-300 text-base ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-xl transform scale-105'
                    : 'text-cyan-400 border-cyan-400/50 hover:bg-cyan-400/10 hover:border-cyan-400 hover:scale-105 hover:shadow-lg'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Blog Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <p className="text-gray-400 text-lg">
              {isLoading ? (
                <span className="inline-block w-40 h-5 bg-gray-700 rounded animate-pulse"></span>
              ) : (
                <>
                  Showing {filteredBlogs.length} of {blogs.length} articles
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </>
              )}
            </p>
          </motion.div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
            {isLoading
              ? Array(6).fill(null).map((_, index) => <SkeletonCard key={index} />)
              : filteredBlogs.length > 0
              ? filteredBlogs.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))
              : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-20"
                  >
                    <div className="max-w-lg mx-auto">
                      <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                        <Search size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">No articles found</h3>
                      <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                        {searchTerm
                          ? `No articles match "${searchTerm}"`
                          : `No articles in ${selectedCategory} category`}
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All');
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 text-lg font-semibold"
                      >
                        Show All Articles
                      </button>
                    </div>
                  </motion.div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;