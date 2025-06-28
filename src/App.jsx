import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';

import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Certificates from './pages/Certificates';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail'; // Blog details fetched from Firebase
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import WhoIAm from './pages/WhoIAm';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [showContent, setShowContent] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-[#0a192f] overflow-x-hidden">
        <AnimatePresence>
          {!showContent && (
            <IntroAnimation onFinish={() => setShowContent(true)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="min-h-screen"
            >
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/*"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />

                {/* Public Routes */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
                      <main className="flex-1 pt-16">
                        <ScrollToTop />
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/certificates" element={<Certificates />} />
                          <Route path="/projects" element={<Projects />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:id" element={<BlogDetail />} />
                          <Route path="/whoiam" element={<WhoIAm />} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  }
                />
              </Routes>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Analytics />
    </Router>
  );
}

export default App;