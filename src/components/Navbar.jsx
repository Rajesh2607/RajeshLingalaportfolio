import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Award, Briefcase, BookOpen, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-1 ${isActive ? 'text-[#17c0f8]' : 'hover:text-[#17c0f8]'}`;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false); // Scrolling down
      } else {
        setShowNavbar(true); // Scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-black text-white p-6 fixed top-0 left-0 right-0 z-50 shadow-md transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center overflow-x-hidden">
        <div className="text-xl font-bold">LINGALA RAJESH</div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

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
