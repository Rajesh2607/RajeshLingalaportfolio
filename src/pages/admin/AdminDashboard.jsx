import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Award,
  Briefcase,
  Code2,
  LogOut,
  User,
  Wrench,
  Medal,
  Menu,
  X,
  Settings,
  Share2,
  FileText,
  ChevronRight,
  Activity
} from 'lucide-react';

import AboutManager from './components/AboutManager';
import ExperienceManager from './components/ExperienceManager';
import CertificatesManager from './components/CertificatesManager';
import ProjectsManager from './components/ProjectsManager';
import SkillManager from './components/SkillManager';
import AdminEducationForm from './components/AdminEducationForm';
import AchievementsManager from './components/AchievementsManager';
import SocialMediaManager from './components/SocialMediaManager';
import HeroManager from './components/HeroManager';
import AdminBlogManager from './components/AdminBlogManager';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, color: 'text-blue-400' },
    { id: 'about', label: 'About', icon: User, color: 'text-green-400' },
    { id: 'hero', label: 'Hero Section', icon: FileText, color: 'text-purple-400' },
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'text-orange-400' },
    { id: 'education', label: 'Education', icon: BookOpen, color: 'text-indigo-400' },
    { id: 'skills', label: 'Skills', icon: Wrench, color: 'text-yellow-400' },
    { id: 'projects', label: 'Projects', icon: Code2, color: 'text-cyan-400' },
    { id: 'certificates', label: 'Certificates', icon: Award, color: 'text-emerald-400' },
    { id: 'achievements', label: 'Achievements', icon: Medal, color: 'text-pink-400' },
    { id: 'adminBlog', label: 'Blog', icon: BookOpen, color: 'text-red-400' },
    { id: 'socialMedia', label: 'Social Media', icon: Share2, color: 'text-violet-400' },
  ];

  const renderContent = () => {
    const components = {
      dashboard: <DashboardOverview />,
      about: <AboutManager />,
      experience: <ExperienceManager />,
      certificates: <CertificatesManager />,
      projects: <ProjectsManager />,
      education: <AdminEducationForm />,
      adminBlog: <AdminBlogManager />,
      skills: <SkillManager />,
      hero: <HeroManager />,
      achievements: <AchievementsManager />,
      socialMedia: <SocialMediaManager />,
    };

    return components[activeSection] || <DashboardOverview />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a192f] via-[#0f1419] to-[#0a192f] flex overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? (isMobile ? '280px' : '280px') : '80px',
          x: isMobile && !sidebarOpen ? '-100%' : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`bg-gradient-to-b from-[#112240] to-[#1a2f4a] text-white relative border-r border-gray-700/50 z-50 flex flex-col ${
          isMobile ? 'fixed h-full' : 'sticky top-0 h-screen'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Settings size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                    Admin Panel
                  </h2>
                  <p className="text-xs text-gray-400">Portfolio Management</p>
                </div>
              </motion.div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto">
                <Settings size={20} className="text-white" />
              </div>
            )}
            
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
          {menuItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={() => handleSectionChange(item.id)}
              sidebarOpen={sidebarOpen}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-3"
              >
                {loading ? 'Signing out...' : 'Sign Out'}
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#112240]/80 backdrop-blur-sm border-b border-gray-700/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
                >
                  <Menu size={24} />
                </button>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage your portfolio content
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-6 h-[calc(100vh-88px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Enhanced Sidebar Button Component
const SidebarButton = ({ item, isActive, onClick, sidebarOpen }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-lg group ${
      isActive
        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-400/30'
        : 'hover:bg-white/5 text-gray-300 hover:text-white'
    }`}
  >
    <item.icon 
      size={20} 
      className={`flex-shrink-0 ${isActive ? item.color : 'text-gray-400 group-hover:text-white'}`} 
    />
    
    {sidebarOpen && (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between w-full ml-3"
      >
        <span className="font-medium">{item.label}</span>
        {isActive && (
          <ChevronRight size={16} className="text-cyan-400" />
        )}
      </motion.div>
    )}
  </motion.button>
);

// Dashboard Overview Component
const DashboardOverview = () => {
  const stats = [
    { label: 'Total Projects', value: '12', color: 'from-blue-500 to-cyan-500', icon: Code2 },
    { label: 'Certificates', value: '8', color: 'from-green-500 to-emerald-500', icon: Award },
    { label: 'Blog Posts', value: '5', color: 'from-purple-500 to-pink-500', icon: BookOpen },
    { label: 'Skills', value: '25+', color: 'from-orange-500 to-red-500', icon: Wrench },
  ];

  const quickActions = [
    { label: 'Add New Project', action: 'projects', icon: Code2, color: 'bg-blue-500' },
    { label: 'Write Blog Post', action: 'adminBlog', icon: BookOpen, color: 'bg-purple-500' },
    { label: 'Update About', action: 'about', icon: User, color: 'bg-green-500' },
    { label: 'Add Certificate', action: 'certificates', icon: Award, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 text-left group"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon size={20} className="text-white" />
              </div>
              <h4 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                {action.label}
              </h4>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
        <div className="bg-gradient-to-br from-[#112240] to-[#1a2f4a] rounded-xl p-6 border border-gray-700/50">
          <div className="space-y-4">
            {[
              { action: 'Updated About section', time: '2 hours ago', type: 'update' },
              { action: 'Added new project', time: '1 day ago', type: 'create' },
              { action: 'Published blog post', time: '3 days ago', type: 'publish' },
              { action: 'Updated skills', time: '1 week ago', type: 'update' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'create' ? 'bg-green-400' :
                  activity.type === 'update' ? 'bg-blue-400' :
                  'bg-purple-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-white">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;