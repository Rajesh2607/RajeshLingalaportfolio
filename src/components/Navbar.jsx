import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Award, Briefcase, BookOpen,User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">LINGALA RAJESH</div>
        <div className="flex space-x-6">
          <NavLink to="/" className={({ isActive }) => `flex items-center space-x-1 ${isActive ? 'text-[#17c0f8]' : 'hover:text-[#17c0f8]'}`}>
            <Home size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/whoiam" className={({ isActive }) => `flex items-center space-x-1 ${isActive ? 'text-[#17c0f8]' : 'hover:text-[#17c0f8]'}`}>
          <User size={20} />
          <span>Who I Am</span>
        </NavLink>

          <NavLink to="/certificates" className={({ isActive }) => `flex items-center space-x-1 ${isActive ? 'text-[#17c0f8]' : 'hover:text-[#17c0f8]'}`}>
            <Award size={20} />
            <span>Certificates</span>
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `flex items-center space-x-1 ${isActive ? 'text-[#17c0f8]' : 'hover:text-[#17c0f8]'}`}>
            <Briefcase size={20} />
            <span>Projects</span>
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => `flex items-center space-x-1 ${isActive ? 'text-[#17c0f8]' : 'hover:text-[#17c0f8]'}`}>
            <BookOpen size={20} />
            <span>Blog</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;