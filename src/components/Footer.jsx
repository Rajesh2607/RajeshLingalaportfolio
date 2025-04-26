import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-800 py-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6">
          <a
            href="https://github.com/Rajesh2607"
            className="text-gray-400 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/lingala-rajesh-03a336280?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            className="text-gray-400 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:rajeshlingala26072005@gmail.com"
            className="text-gray-400 hover:text-white"
          >
            <Mail size={20} />
          </a>
        </div>
        <p className="mt-8 text-center text-gray-400">
          © {new Date().getFullYear()} Lingala Rajesh. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
