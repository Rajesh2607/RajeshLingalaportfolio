import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost(docSnap.data());
      }
    };
    fetchBlog();
  }, [id]);

  const isLoading = !post;

  return (
    <div className="min-h-screen bg-[#121826] text-white px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-[#17c0f8] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Blog
        </Link>

        {/* Title */}
        <motion.h1
          className="text-4xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isLoading ? <Skeleton width="60%" height={40} className="mx-auto" /> : post.title}
        </motion.h1>

        {/* Meta Info */}
        <div className="text-center text-gray-400 text-sm space-x-2">
          {isLoading ? (
            <Skeleton width="80%" height={20} className="mx-auto" />
          ) : (
            <>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime} min read</span>
              <span>•</span>
              <span className="bg-blue-600 text-white px-2 py-1 rounded">
                {post.category}
              </span>
            </>
          )}
        </div>

        {/* Image */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {isLoading || !imageLoaded ? (
            <Skeleton height={300} className="rounded-xl" />
          ) : null}

          {!isLoading && (
            <motion.img
              key={post.image}
              src={post.image}
              alt={post.title}
              loading="lazy"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.95 }}
              transition={{ duration: 0.5 }}
              onLoad={() => setImageLoaded(true)}
              className={`w-full max-h-[400px] object-cover rounded-xl shadow-lg ${
                imageLoaded ? '' : 'hidden'
              }`}
            />
          )}
        </motion.div>

        {/* Author */}
        <div className="flex items-center gap-4 pt-4">
          {isLoading ? (
            <>
              <Skeleton circle width={40} height={40} />
              <Skeleton width={100} height={20} />
            </>
          ) : (
            <>
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full"
                loading="lazy"
              />
              <span className="text-sm text-gray-300">By {post.author.name}</span>
            </>
          )}
        </div>

        {/* Blog Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none"
        >
          {isLoading ? (
            <Skeleton count={8} />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="prose prose-invert"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail;
