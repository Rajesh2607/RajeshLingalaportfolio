import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();

  // This would typically come from an API or database
  const blogPosts = [
    {
      id: 0,
      title: "The Future of Cloud Computing: Trends to Watch in 2024",
      date: "March 20, 2024",
      readTime: "12 min read",
      category: "Cloud Computing",
      content: `
        <h2>Introduction</h2>
        <p>Cloud computing continues to evolve at a rapid pace, transforming how businesses operate and innovate. As we progress through 2024, several key trends are shaping the future of cloud technology.</p>

        <h2>Edge Computing Revolution</h2>
        <p>Edge computing is becoming increasingly important as organizations seek to process data closer to its source. This trend is driven by the need for reduced latency and improved real-time processing capabilities.</p>
        <p>Key benefits of edge computing include:</p>
        <ul>
          <li>Reduced latency for real-time applications</li>
          <li>Improved data privacy and security</li>
          <li>Lower bandwidth costs</li>
          <li>Enhanced reliability and redundancy</li>
        </ul>

        <h2>Serverless Architecture</h2>
        <p>Serverless computing continues to gain traction, offering developers the ability to build and run applications without managing infrastructure. This approach provides several advantages:</p>
        <ul>
          <li>Automatic scaling based on demand</li>
          <li>Pay-per-use pricing model</li>
          <li>Reduced operational overhead</li>
          <li>Faster time to market</li>
        </ul>

        <h2>Multi-Cloud Strategies</h2>
        <p>Organizations are increasingly adopting multi-cloud strategies to optimize costs, improve reliability, and avoid vendor lock-in. This approach allows companies to leverage the best features from different cloud providers while maintaining flexibility.</p>

        <h2>Conclusion</h2>
        <p>The cloud computing landscape continues to evolve, offering new opportunities for innovation and efficiency. Organizations that stay ahead of these trends will be better positioned to leverage cloud technologies for competitive advantage.</p>
      `,
      author: {
        name: "Rajesh Lingala",
        avatar: "https://media.licdn.com/dms/image/v2/D5603AQHuipcZfSkjCA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726917248159?e=1746057600&v=beta&t=SZMUQoFc75YL9MpJGVqTUQEik8nEExuYkpTlMSBIFHA"
      },
      image: "https://images.unsplash.com/photo-1520869562399-e772f042f422?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
    },
    {
      id: 1,
      title: "Getting Started with AWS Cloud",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Cloud Computing",
      content: `
        <h2>Introduction to AWS</h2>
        <p>Amazon Web Services (AWS) is the world's leading cloud platform, offering a wide range of services for businesses of all sizes. This guide will help you get started with AWS fundamentals.</p>

        <h2>Core AWS Services</h2>
        <p>Let's explore some of the essential AWS services you'll need to know:</p>
        <ul>
          <li>EC2 (Elastic Compute Cloud) for virtual servers</li>
          <li>S3 (Simple Storage Service) for object storage</li>
          <li>RDS (Relational Database Service) for managed databases</li>
          <li>Lambda for serverless computing</li>
        </ul>

        <h2>Setting Up Your First Instance</h2>
        <p>Creating your first EC2 instance is a fundamental step in working with AWS. Here's what you need to consider:</p>
        <ul>
          <li>Choosing the right instance type</li>
          <li>Setting up security groups</li>
          <li>Managing SSH keys</li>
          <li>Configuring storage</li>
        </ul>

        <h2>Best Practices</h2>
        <p>When starting with AWS, keep these best practices in mind:</p>
        <ul>
          <li>Always use IAM roles and users</li>
          <li>Enable MFA for root account</li>
          <li>Regular backup and monitoring</li>
          <li>Cost optimization from day one</li>
        </ul>
      `,
      author: {
        name: "Rajesh Lingala",
        avatar: "https://media.licdn.com/dms/image/v2/D5603AQHuipcZfSkjCA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726917248159?e=1746057600&v=beta&t=SZMUQoFc75YL9MpJGVqTUQEik8nEExuYkpTlMSBIFHA"
      },
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const post = blogPosts.find(post => post.id === parseInt(id));

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="text-[#17c0f8] hover:text-white transition-colors">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Back Button */}
        <Link 
          to="/blog"
          className="inline-flex items-center text-[#17c0f8] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            {post.title}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {post.date}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              {post.readTime}
            </div>
            <div className="flex items-center">
              <Tag size={16} className="mr-2" />
              {post.category}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="flex items-center">
                <User size={16} className="mr-2 text-[#17c0f8]" />
                <span className="text-white font-medium">{post.author.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-lg prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.div>
    </div>
  );
};

export default BlogDetail;



