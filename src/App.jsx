import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ProjectsSection from './components/ProjectsSection.jsx';
import SkillsSection from './components/SkillsSection.jsx';
import ExperienceTimeline from './components/ExperienceTimeline.jsx';
import BlogSection from './components/BlogSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import AdminLoginModal from './components/admin/AdminLoginModal.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin Auth States
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin_token') || null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Load public portfolio data
  const loadPortfolioData = async () => {
    try {
      const [pRes, prjRes, sRes, eRes, bRes] = await Promise.all([
        fetch('/api/profile').then((r) => r.json()).catch(() => null),
        fetch('/api/projects').then((r) => r.json()).catch(() => []),
        fetch('/api/skills').then((r) => r.json()).catch(() => []),
        fetch('/api/experience').then((r) => r.json()).catch(() => []),
        fetch('/api/blogs').then((r) => r.json()).catch(() => []),
      ]);

      if (pRes) setProfile(pRes);
      if (Array.isArray(prjRes)) setProjects(prjRes);
      if (Array.isArray(sRes)) setSkills(sRes);
      if (Array.isArray(eRes)) setExperiences(eRes);
      if (Array.isArray(bRes)) setBlogs(bRes);
    } catch (err) {
      console.error('Error loading portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  // Handle Admin Button Click in Navbar / Footer
  const handleOpenAdmin = () => {
    if (adminToken) {
      setIsDashboardOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (token) => {
    setAdminToken(token);
    setIsDashboardOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminToken(null);
    setIsDashboardOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex items-center justify-center text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">Loading portfolio experience...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#E4E4E7] antialiased flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* 3-Zone Top Navigation */}
      <Navbar onOpenAdmin={handleOpenAdmin} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Split-Screen Hero */}
        <Hero profile={profile} />

        {/* Featured Bento Projects */}
        <ProjectsSection projects={projects} />

        {/* 4-Category Technical Skills */}
        <SkillsSection skills={skills} />

        {/* Career & Education Timeline */}
        <ExperienceTimeline experiences={experiences} />

        {/* Rank Math SEO Articles */}
        <BlogSection blogs={blogs} />

        {/* Interactive Inquiries & Contact */}
        <ContactSection profile={profile} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Full CMS Dashboard */}
      {isDashboardOpen && adminToken && (
        <AdminDashboard
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
          token={adminToken}
          onLogout={handleLogout}
          onDataUpdated={loadPortfolioData}
        />
      )}
    </div>
  );
}
