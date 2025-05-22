import React, { useEffect, useRef } from 'react';
import { Code, LineChart, Palette } from 'lucide-react';

const About = () => {
  const sectionRef = useRef(null);
  const uxRef = useRef(null);
  const fullStackRef = useRef(null);
  const dataAnalysisRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'transform-none');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      },
      { threshold: 0.1 }
    );

    const sections = [sectionRef, uxRef, fullStackRef, dataAnalysisRef];
    sections.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      sections.forEach(ref => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-midnight text-white transition-all duration-1000 ease-out opacity-0 translate-y-10"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center">
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
            What I Do?
          </span>
        </h2>

        {/* Gradient line below */}
        <div className="mt-2 h-1 w-52 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 rounded-full" />
      </div>


          {/* UX Design Section */}
          <div ref={uxRef} className="mb-20 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <div className="flex items-center mb-8">
              <Palette className="text-cyan-400 mr-4" size={32} />
              <h3 className="text-3xl font-bold text-white">UX Design</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg"
                  alt="UX Design Workspace"
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
              <div className="bg-navy bg-opacity-50 rounded-xl p-6">
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-200">
                    <span className="text-yellow-500 mr-2">⚡</span>
                    Creating user-centered designs with intuitive navigation and interactions
                  </li>
                  <li className="flex items-center text-gray-200">
                    <span className="text-yellow-500 mr-2">⚡</span>
                    Conducting user research and usability testing to improve experiences
                  </li>
                  <li className="flex items-center text-gray-200">
                    <span className="text-yellow-500 mr-2">⚡</span>
                    Developing high-fidelity prototypes and design systems
                  </li>
                </ul>
                <div className="flex flex-wrap gap-4 mt-6">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="Figma" className="h-12" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg" alt="Adobe XD" className="h-12" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg" alt="Sketch" className="h-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Full Stack Development Section */}
          <div ref={fullStackRef} className="mb-20 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <div className="flex items-center mb-8">
              <Code className="text-purple-400 mr-4" size={32} />
              <h3 className="text-3xl font-bold text-white">Full Stack Development</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 bg-navy bg-opacity-50 rounded-xl p-6">
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-200">
                    <span className="text-yellow-500 mr-2">⚡</span>
                    Building responsive website front end using React-Redux
                  </li>
                  <li className="flex items-center text-gray-200">
                    <span className="text-yellow-500 mr-2">⚡</span>
                    Developing mobile applications using Flutter, React Native
                  </li>
                  <li className="flex items-center text-gray-200">
                    <span className="text-yellow-500 mr-2">⚡</span>
                    Creating application backend in Node, Express
                  </li>
                </ul>
                <div className="flex flex-wrap gap-4 mt-6">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" className="h-12" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" className="h-12" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" className="h-12" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="h-12" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="h-12" />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
                  alt="Web Development"
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>

          {/* Data Analysis Section */}
          <div ref={dataAnalysisRef} className="opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <div className="flex items-center mb-8">
              <LineChart className="text-blue-400 mr-4" size={32} />
              <h3 className="text-3xl font-bold text-white">Data Analysis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg"
                  alt="Data Analytics"
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
              <div className="bg-navy bg-opacity-50 rounded-xl p-6">
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-200">
                    <span className="text-yellow-500 mr-2">⚡</span>
                    Analyzing complex datasets to extract meaningful insights
                  </li>
                  <li className="flex items-center text-gray-200">
                    <span className="text-yellow-500 mr-2">⚡</span>
                    Creating data visualization and interactive dashboards
                  </li>
                  <li className="flex items-center text-gray-200">
                    <span className="text-yellow-500 mr-2">⚡</span>
                    Implementing machine learning models for predictive analytics
                  </li>
                </ul>
                <div className="flex flex-wrap gap-4 mt-6">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" className="h-12" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" alt="Pandas" className="h-12" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" alt="TensorFlow" className="h-12" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" className="h-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
