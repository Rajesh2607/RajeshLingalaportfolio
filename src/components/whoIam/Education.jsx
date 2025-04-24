import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const Education = () => {
  const sectionRef = useRef(null);
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'educations'));
        const data = querySnapshot.docs.map((doc) => doc.data());

        const sortedData = data.sort(
          (a, b) => parseInt(b.endYear || 0) - parseInt(a.endYear || 0)
        );
        setEducationData(sortedData);
      } catch (error) {
        console.error('Error fetching education data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');

          const items = document.querySelectorAll('.education-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('opacity-100');
              item.classList.remove('opacity-0', 'translate-y-10');
            }, 300 * index);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [educationData]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <section 
      id="education" 
      ref={sectionRef}
      className="py-20 bg-navy text-white transition-all duration-1000 ease-out opacity-0 translate-y-10"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
              Education
            </span>
          </h2>

          <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-400 before:via-cyan-400 before:to-blue-400 space-y-12">
            {educationData.map((edu, index) => (
              <div 
                key={index}
                className="education-item opacity-0 translate-y-10 transition-all duration-700 ease-out"
              >
                <div className="absolute left-0 w-4 h-4 bg-cyan-400 rounded-full transform -translate-x-2 mt-1.5"></div>
                <div className="bg-midnight bg-opacity-70 rounded-xl p-6 md:p-8 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="text-xl font-semibold text-purple-300">{edu.institution}</div>
                    <div className="flex items-center text-cyan-400 mt-2 md:mt-0">
                      <Calendar className="mr-2" size={16} />
                      <span>{edu.startYear || 'Unknown'} - {edu.endYear || 'Present'}</span>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <GraduationCap className="text-purple-400 mr-3" size={20} />
                    <p className="text-white font-medium">{edu.degree}</p>
                  </div>
                  <p className="text-gray-400 italic">{edu.fieldOfStudy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
