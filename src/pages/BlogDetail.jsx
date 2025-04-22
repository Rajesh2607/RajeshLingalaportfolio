import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost(docSnap.data());
      } else {
        setPost(null);
      }
    };

    fetchPost();
  }, [id]);

  if (post === null) {
    return (
      <div className="container mx-auto px-4 py-12 text-white text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link to="/blog" className="text-[#17c0f8] hover:text-white transition-colors">
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <Link to="/blog" className="inline-flex items-center text-[#17c0f8] hover:text-white transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to Blog
        </Link>

        <div className="mb-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-4">
            {post.title}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            <div className="flex items-center"><Calendar size={16} className="mr-2" />{post.date}</div>
            <div className="flex items-center"><Clock size={16} className="mr-2" />{post.readTime}</div>
            <div className="flex items-center"><Tag size={16} className="mr-2" />{post.category}</div>
          </div>

          <div className="flex items-center gap-4">
            <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
            <div>
              <div className="flex items-center">
                <User size={16} className="mr-2 text-[#17c0f8]" />
                <span className="text-white font-medium">{post.author.name}</span>
              </div>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <img src={post.image} alt={post.title} className="w-full h-[400px] object-cover rounded-lg" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </motion.div>
    </div>
  );
};

export default BlogDetail;
