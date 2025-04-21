import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Award, Briefcase, BookOpen, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-1 ${isActive ? 'text-[#17c0f8]' : 'hover:text-[#17c0f8]'}`;

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">LINGALA RAJESH</div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6">
          <NavLink to="/" className={navLinkClass}>
            <Home size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/whoiam" className={navLinkClass}>
            <User size={20} />
            <span>Who I Am</span>
          </NavLink>
          <NavLink to="/certificates" className={navLinkClass}>
            <Award size={20} />
            <span>Certificates</span>
          </NavLink>
          <NavLink to="/projects" className={navLinkClass}>
            <Briefcase size={20} />
            <span>Projects</span>
          </NavLink>
          <NavLink to="/blog" className={navLinkClass}>
            <BookOpen size={20} />
            <span>Blog</span>
          </NavLink>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <NavLink to="/" className={navLinkClass} onClick={toggleMenu}>
            <Home size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/whoiam" className={navLinkClass} onClick={toggleMenu}>
            <User size={20} />
            <span>Who I Am</span>
          </NavLink>
          <NavLink to="/certificates" className={navLinkClass} onClick={toggleMenu}>
            <Award size={20} />
            <span>Certificates</span>
          </NavLink>
          <NavLink to="/projects" className={navLinkClass} onClick={toggleMenu}>
            <Briefcase size={20} />
            <span>Projects</span>
          </NavLink>
          <NavLink to="/blog" className={navLinkClass} onClick={toggleMenu}>
            <BookOpen size={20} />
            <span>Blog</span>
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
