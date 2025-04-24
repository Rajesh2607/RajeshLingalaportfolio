import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react'; // Make sure lucide-react is installed

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const fetchBlog = async () => {
    const docRef = doc(db, 'blogs', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPost(docSnap.data());
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (!post) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back to Blog */}
        <Link to="/blog" className="inline-flex items-center text-[#17c0f8] hover:text-white transition-colors mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to Blog
        </Link>

        {/* Title */}
        <motion.h1
          className="text-4xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {post.title}
        </motion.h1>

        {/* Meta Info */}
        <div className="text-center text-gray-400">
          <span>{post.date}</span> • <span>{post.readTime} min read</span> •{' '}
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">{post.category}</span>
        </div>

        {/* Cover Image */}
        {post.image && (
          <motion.img
            src={post.image}
            alt={post.title}
            className="w-full max-h-[400px] object-cover rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
        )}

        {/* Author */}
        <div className="flex items-center gap-4 pt-4">
          <img
            src={post.author?.avatar}
            alt={post.author?.name}
            className="w-10 h-10 rounded-full"
          />
          <span className="text-sm text-gray-300">By {post.author?.name}</span>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-lg max-w-none bg-[#0f172a] p-6 rounded-xl text-gray-100 prose-headings:text-white prose-strong:text-white prose-a:text-cyan-400 hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};

export default BlogDetail;
