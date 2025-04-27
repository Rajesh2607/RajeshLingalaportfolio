import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import {
  BookOpen,
  Award,
  Briefcase,
  Code2,
  LogOut,
  User,
  Wrench,
  Medal,
  Menu, // Added Menu icon
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
  const [activeSection, setActiveSection] = useState('about');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar toggle
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return <AboutManager />;
      case 'experience':
        return <ExperienceManager />;
      case 'certificates':
        return <CertificatesManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'education':
        return <AdminEducationForm />;
      case 'adminBlog':
        return <AdminBlogManager />;
      case 'skills':
        return <SkillManager />;
      case 'hero':
        return <HeroManager />;
      case 'achievements':
        return <AchievementsManager />;
      case 'socialMedia':
        return <SocialMediaManager />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] flex">

      {/* Sidebar */}
      <div className={`bg-[#112240] text-white relative transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 flex items-center justify-between">
          {/* If sidebar open show Title else show only Menu */}
          {sidebarOpen ? (
            <h2 className="text-xl font-bold text-[#17c0f8]">Admin</h2>
          ) : (
            <Menu size={24} className="text-white" onClick={() => setSidebarOpen(true)} />
          )}
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="text-white hover:text-[#17c0f8]">
              <Menu size={24} />
            </button>
          )}
        </div>
        <nav className="mt-8 space-y-2">
          <SidebarButton label="About" icon={<User size={20} />} isActive={activeSection === 'about'} onClick={() => setActiveSection('about')} sidebarOpen={sidebarOpen} />
          <SidebarButton label="Experience" icon={<Briefcase size={20} />} isActive={activeSection === 'experience'} onClick={() => setActiveSection('experience')} sidebarOpen={sidebarOpen} />
          <SidebarButton label="Certificates" icon={<Award size={20} />} isActive={activeSection === 'certificates'} onClick={() => setActiveSection('certificates')} sidebarOpen={sidebarOpen} />
          <SidebarButton label="Projects" icon={<Code2 size={20} />} isActive={activeSection === 'projects'} onClick={() => setActiveSection('projects')} sidebarOpen={sidebarOpen} />
          <SidebarButton label="Education" icon={<BookOpen size={20} />} isActive={activeSection === 'education'} onClick={() => setActiveSection('education')} sidebarOpen={sidebarOpen} />
          <SidebarButton label="Blog" icon={<BookOpen size={20} />} isActive={activeSection === 'adminBlog'} onClick={() => setActiveSection('adminBlog')} sidebarOpen={sidebarOpen} />
          <SidebarButton label="Skills" icon={<Wrench size={20} />} isActive={activeSection === 'skills'} onClick={() => setActiveSection('skills')} sidebarOpen={sidebarOpen} />
          <SidebarButton label="Hero" icon={<User size={20} />} isActive={activeSection === 'hero'} onClick={() => setActiveSection('hero')} sidebarOpen={sidebarOpen} />
          <SidebarButton label="Achievements" icon={<Medal size={20} />} isActive={activeSection === 'achievements'} onClick={() => setActiveSection('achievements')} sidebarOpen={sidebarOpen} />
          <SidebarButton label="Social Media" icon={<User size={20} />} isActive={activeSection === 'socialMedia'} onClick={() => setActiveSection('socialMedia')} sidebarOpen={sidebarOpen} />
        </nav>
        {/* Logout button */}
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-500/10 hover:bg-red-500/20 rounded-md"
          >
            <LogOut size={16} className="mr-2" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex items-center mb-8">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="bg-[#112240] text-white p-2 rounded-md hover:bg-[#1d3a6e] transition-all mr-4"
            >
              <Menu size={24} />
            </button>
          )}
          <h2 className="text-2xl font-bold text-[#17c0f8]">Admin Dashboard</h2>
        </div>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// SidebarButton Component
const SidebarButton = ({ label, icon, isActive, onClick, sidebarOpen }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
      isActive ? 'bg-[#1d3a6e] text-[#17c0f8]' : 'hover:bg-[#1d3a6e]'
    }`}
  >
    {icon}
    {sidebarOpen && <span className="ml-3">{label}</span>}
  </button>
);

export default AdminDashboard;
