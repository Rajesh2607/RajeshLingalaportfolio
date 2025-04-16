import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowRight, Search, Filter, TrendingUp, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Cloud Computing', 'DevOps', 'Container Orchestration', 'Software Engineering', 'UI/UX Design'];
  
  const featuredPost = {
    id: 0,
    title: "The Future of Cloud Computing: Trends to Watch in 2024",
    date: "March 20, 2024",
    readTime: "12 min read",
    category: "Cloud Computing",
    excerpt: "Explore the emerging trends in cloud computing, from edge computing to serverless architecture. Learn how these innovations are shaping the future of technology and business.",
    image: "https://images.unsplash.com/photo-1520869562399-e772f042f422?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
    author: {
      name: "Rajesh Lingala",
      avatar: "https://media.licdn.com/dms/image/v2/D5603AQHuipcZfSkjCA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726917248159?e=1746057600&v=beta&t=SZMUQoFc75YL9MpJGVqTUQEik8nEExuYkpTlMSBIFHA"
    }
  };

  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with AWS Cloud",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Cloud Computing",
      excerpt: "Learn the basics of AWS Cloud and how to set up your first instance. This comprehensive guide covers EC2, S3, and basic networking concepts to help you get started with cloud computing.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      author: {
        name: "Rajesh Lingala",
        avatar: "https://media.licdn.com/dms/image/v2/D5603AQHuipcZfSkjCA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726917248159?e=1746057600&v=beta&t=SZMUQoFc75YL9MpJGVqTUQEik8nEExuYkpTlMSBIFHA"
      }
    },
    {
      id: 2,
      title: "DevOps Best Practices for 2024",
      date: "March 10, 2024",
      readTime: "7 min read",
      category: "DevOps",
      excerpt: "Explore the essential DevOps practices that every team should follow in 2024. From CI/CD pipelines to infrastructure as code, learn how to improve your development workflow.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      author: {
        name: "Rajesh Lingala",
        avatar: "https://media.licdn.com/dms/image/v2/D5603AQHuipcZfSkjCA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726917248159?e=1746057600&v=beta&t=SZMUQoFc75YL9MpJGVqTUQEik8nEExuYkpTlMSBIFHA"
      }
    },
    {
      id: 3,
      title: "Mastering Kubernetes for Enterprise",
      date: "March 5, 2024",
      readTime: "10 min read",
      category: "Container Orchestration",
      excerpt: "Deep dive into advanced Kubernetes concepts and best practices for enterprise-scale deployments. Learn about service mesh, operators, and advanced deployment strategies.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      author: {
        name: "Rajesh Lingala",
        avatar: "https://media.licdn.com/dms/image/v2/D5603AQHuipcZfSkjCA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726917248159?e=1746057600&v=beta&t=SZMUQoFc75YL9MpJGVqTUQEik8nEExuYkpTlMSBIFHA"
      }
    },
    {
      id: 4,
      title: "The Art of UI/UX Design in Modern Web Development",
      date: "March 1, 2024",
      readTime: "8 min read",
      category: "UI/UX Design",
      excerpt: "Discover the principles of modern UI/UX design and how to create engaging user experiences. Learn about design systems, accessibility, and user-centered design approaches.",
      image: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      author: {
        name: "Rajesh Lingala",
        avatar: "https://media.licdn.com/dms/image/v2/D5603AQHuipcZfSkjCA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726917248159?e=1746057600&v=beta&t=SZMUQoFc75YL9MpJGVqTUQEik8nEExuYkpTlMSBIFHA"
      }
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Technical Blog</h1>
        <p className="text-gray-400">Insights and tutorials on Cloud Computing, DevOps, and Software Engineering</p>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#112240] p-6 rounded-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1d3a6e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-[#17c0f8]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#1d3a6e] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17c0f8]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <Link to={`/blog/${featuredPost.id}`} className="block">
          <div className="bg-[#112240] rounded-lg overflow-hidden">
            <div className="relative h-96">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent">
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="text-[#17c0f8]" size={20} />
                    <span className="text-white font-semibold">Featured Post</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">{featuredPost.title}</h2>
                  <div className="flex items-center space-x-4">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="text-white">
                      <p className="font-medium">{featuredPost.author.name}</p>
                      <div className="flex items-center space-x-4 text-sm opacity-75">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {featuredPost.date}
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>

      {/* Latest Posts */}
      <div className="mb-12">
        <div className="flex items-center space-x-2 mb-6">
          <BookOpen className="text-[#17c0f8]" size={24} />
          <h2 className="text-2xl font-bold text-white">Latest Posts</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: post.id * 0.1 }}
              className="bg-[#112240] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-2 bg-[#17c0f8] text-black rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">{post.author.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">{post.title}</h2>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <Link 
                  to={`/blog/${post.id}`}
                  className="flex items-center text-[#17c0f8] hover:text-white transition-colors duration-300"
                >
                  Read More
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* No Results Message */}
      {filteredPosts.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p>No posts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Blog;