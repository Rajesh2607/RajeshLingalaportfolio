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
  Medal, // Add Medal icon for Achievements
} from 'lucide-react';

import AboutManager from './components/AboutManager';
import ExperienceManager from './components/ExperienceManager';
import CertificatesManager from './components/CertificatesManager';
import ProjectsManager from './components/ProjectsManager';
import SkillManager from './components/SkillManager.jsx';
import AdminEducationForm from './components/AdminEducationForm.jsx';
import AchievementsManager from './components/AchievementsManager'; // ✅ Import AchievementsManager
import SocialMedia from '../../components/whoIam/SocialMedia.jsx';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('about');
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
      case 'blogs':
        return <BlogsManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'skills':
        return <SkillManager />;
      case 'education':
        return <AdminEducationForm />;
      case 'achievements': // ✅ New case for achievements
        return <AchievementsManager />; // ✅ Render AchievementsManager
      case 'socialMedia':
        return <SocialMedia />;
        default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#112240] text-white relative">
        <div className="p-4">
          <h2 className="text-xl font-bold text-[#17c0f8]">Admin Dashboard</h2>
        </div>
        <nav className="mt-8">
          <SidebarButton
            label="About"
            icon={<User size={20} className="mr-3" />}
            isActive={activeSection === 'about'}
            onClick={() => setActiveSection('about')}
          />
          <SidebarButton
            label="Experience"
            icon={<Briefcase size={20} className="mr-3" />}
            isActive={activeSection === 'experience'}
            onClick={() => setActiveSection('experience')}
          />
          <SidebarButton
            label="Certificates"
            icon={<Award size={20} className="mr-3" />}
            isActive={activeSection === 'certificates'}
            onClick={() => setActiveSection('certificates')}
          />
          <SidebarButton
            label="Blogs"
            icon={<BookOpen size={20} className="mr-3" />}
            isActive={activeSection === 'blogs'}
            onClick={() => setActiveSection('blogs')}
          />
          <SidebarButton
            label="Projects"
            icon={<Code2 size={20} className="mr-3" />}
            isActive={activeSection === 'projects'}
            onClick={() => setActiveSection('projects')}
          />
          <SidebarButton
            label="Education"
            icon={<BookOpen size={20} className="mr-3" />}
            isActive={activeSection === 'education'}
            onClick={() => setActiveSection('education')}
          />
          <SidebarButton
            label="Skills"
            icon={<Wrench size={20} className="mr-3" />}
            isActive={activeSection === 'skills'}
            onClick={() => setActiveSection('skills')}
          />
          <SidebarButton
            label="Achievements" // ✅ New label for Achievements
            icon={<Medal size={20} className="mr-3" />} // ✅ Icon for Achievements
            isActive={activeSection === 'achievements'} // ✅ Check if Achievements is active
            onClick={() => setActiveSection('achievements')} // ✅ Set active section to achievements
          />
          <SidebarButton
            label="Social Media"
            icon={<User size={20} className="mr-3" />}
            isActive={activeSection === 'socialMedia'}
            onClick={() => setActiveSection('socialMedia')}
          />
        </nav>

        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-500/10 hover:bg-red-500/20 rounded-md"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

// Sidebar Button Reusable Component
const SidebarButton = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left ${
      isActive ? 'bg-[#1d3a6e] text-[#17c0f8]' : 'hover:bg-[#1d3a6e]'
    }`}
  >
    {icon}
    {label}
  </button>
);

// Placeholder for BlogsManager
const BlogsManager = () => <div className="text-white">Blogs Manager (Coming Soon)</div>;

export default AdminDashboard;
