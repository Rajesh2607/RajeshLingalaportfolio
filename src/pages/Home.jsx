import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import Skills from '../components/home/Skills';
import Experience from '../components/home/Experience';
import ContactSection from '../components/home/Contact';
import Note from '../components/home/Note';
import SkeletonLoaderForhome from '../components/skeleton/SkeletonLoaderForhome';

const Home = () => {
  const [about, setAbout] = useState({
    title: [],
    profilePic: '',
    description: '',
    resume: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'content', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && isMounted) {
          setAbout(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAboutData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0a192f]">
        <SkeletonLoaderForhome />
      </div>
    );
  }

  return (
    <main className="bg-[#0a192f] overflow-x-hidden">
      <HeroSection about={about} />
      <AboutSection about={about} />
      <Skills />
      <Experience />
      <ContactSection />
      <Note />
    </main>
  );
};

export default Home;
