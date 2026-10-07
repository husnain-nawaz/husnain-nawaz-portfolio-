import React, { useState, useEffect } from 'react';
import {
  X, LayoutDashboard, FileText, FolderGit2, User, 
  MessageSquare, Database, Shield, Plus, Edit, Trash2, 
  Check, AlertCircle, Save, Sparkles, ExternalLink, 
  Eye, RefreshCw, Smartphone, Monitor, Download, Key,
  Image as ImageIcon, ArrowRight
} from 'lucide-react';
import ResponsiveImageControl, { SYSTEM_IMAGE_PRESETS } from './ResponsiveImageControl.jsx';

export default function AdminDashboard({
  isOpen,
  onClose,
  token,
  onLogout,
  onDataUpdated,
}) {
  const [activeTab, setActiveTab] = useState('blogs'); // 'overview' | 'blogs' | 'projects' | 'profile' | 'media' | 'messages' | 'database' | 'security'
  
  // Data States
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', text: '' });

  // Media Studio States
  const [studioUrl, setStudioUrl] = useState('');
  const [studioTarget, setStudioTarget] = useState('profile');
  const [studioTargetId, setStudioTargetId] = useState('');

  // Blog Editor State
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: 'Engineering',
    tags: 'React, Node.js',
    status: 'published',
    read_time: '5 min read',
    focus_keyword: '',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    schema_type: 'BlogPosting',
    is_indexable: true,
  });

  // Real-time Rank Math SEO Analysis State
  const [seoResult, setSeoResult] = useState(null);
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Project Editor State
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    challenge: '',
    solution: '',
    results: '',
    category: 'Full-Stack & Systems',
    tags: 'React, Express',
    featured: true,
    order_index: 0,
    image_url: '',
    live_url: '',
    github_url: '',
    client_name: '',
    completion_date: '2026',
  });

  // MySQL Test State
  const [mysqlTestForm, setMysqlTestForm] = useState({
    host: 'localhost',
    port: 3306,
    user: '',
    password: '',
    database: 'husnain_portfolio',
  });
  const [mysqlTestResult, setMysqlTestResult] = useState(null);
  const [testingMysql, setTestingMysql] = useState(false);

  // Security Credentials State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newUsername: '',
    newEmail: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch all CMS data
  const fetchData = async () => {
    try {
      setLoading(true);
      const authHeader = { Authorization: `Bearer ${token}` };

      const [pRes, bRes, prjRes, msgRes, dbRes] = await Promise.all([
        fetch('/api/profile').then((r) => r.json()),
        fetch('/api/admin/blogs', { headers: authHeader }).then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/admin/messages', { headers: authHeader }).then((r) => r.json()),
        fetch('/api/admin/database-status', { headers: authHeader }).then((r) => r.json()),
      ]);

      setProfile(pRes || {});
      setBlogs(Array.isArray(bRes) ? bRes : []);
      setProjects(Array.isArray(prjRes) ? prjRes : []);
      setMessages(Array.isArray(msgRes) ? msgRes : []);
      setDbStatus(dbRes || null);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchData();
    }
  }, [isOpen, token]);

  // Real-time Rank Math SEO Evaluation Effect
  useEffect(() => {
    if (!token) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/admin/seo-analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: blogForm.meta_title || blogForm.title,
            slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            content: blogForm.content,
            metaDescription: blogForm.meta_description || blogForm.excerpt,
            focusKeyword: blogForm.focus_keyword,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setSeoResult(data);
        }
      } catch (e) {}
    }, 300);

    return () => clearTimeout(timer);
  }, [blogForm, token]);

  if (!isOpen) return null;

  const showNotification = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice({ type: '', text: '' }), 4000);
  };

  // ---------------------------------------------------------------------------
  // BLOG CRUD HANDLERS
  // ---------------------------------------------------------------------------
  const handleOpenBlogEditor = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setBlogForm({ ...blog });
    } else {
      setEditingBlog('new');
      setBlogForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '/src/assets/images/project_visualstock_1791318802924.jpg',
        category: 'Engineering',
        tags: 'React, Node.js, Express',
        status: 'published',
        read_time: '5 min read',
        focus_keyword: '',
        meta_title: '',
        meta_description: '',
        canonical_url: '',
        schema_type: 'BlogPosting',
        is_indexable: true,
      });
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const url = editingBlog === 'new' ? '/api/admin/blogs' : `/api/admin/blogs/${editingBlog.id}`;
      const method = editingBlog === 'new' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogForm),
      });

      if (res.ok) {
        showNotification('success', 'Blog post saved successfully with Rank Math SEO scores!');
        setEditingBlog(null);
        fetchData();
        if (onDataUpdated) onDataUpdated();
      } else {
        const data = await res.json();
        showNotification('error', data.error || 'Failed to save blog post.');
      }
    } catch (err) {
      showNotification('error', 'Network error saving blog.');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showNotification('success', 'Article deleted.');
        fetchData();
        if (onDataUpdated) onDataUpdated();
      }
    } catch (e) {
      showNotification('error', 'Failed to delete article.');
    }
  };

  // ---------------------------------------------------------------------------
  // PROJECT CRUD HANDLERS
  // ---------------------------------------------------------------------------
  const handleOpenProjectEditor = (project = null) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({ ...project });
    } else {
      setEditingProject('new');
      setProjectForm({
        title: '',
        slug: '',
        tagline: '',
        description: '',
        challenge: '',
        solution: '',
        results: '',
        category: 'Full-Stack & Systems',
        tags: 'React, Express, Node.js',
        featured: true,
        order_index: projects.length + 1,
        image_url: '/src/assets/images/project_nom_nosh_1791318773177.jpg',
        live_url: '',
        github_url: '',
        client_name: '',
        completion_date: '2026',
      });
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const url = editingProject === 'new' ? '/api/admin/projects' : `/api/admin/projects/${editingProject.id}`;
      const method = editingProject === 'new' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectForm),
      });

      if (res.ok) {
        showNotification('success', 'Project saved successfully!');
        setEditingProject(null);
        fetchData();
        if (onDataUpdated) onDataUpdated();
      } else {
        const data = await res.json();
        showNotification('error', data.error || 'Failed to save project.');
      }
    } catch (err) {
      showNotification('error', 'Network error.');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showNotification('success', 'Project deleted.');
        fetchData();
        if (onDataUpdated) onDataUpdated();
      }
    } catch (e) {}
  };

  // ---------------------------------------------------------------------------
  // PROFILE HANDLER
  // ---------------------------------------------------------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        showNotification('success', 'Profile and SEO defaults updated!');
        if (onDataUpdated) onDataUpdated();
      }
    } catch (e) {
      showNotification('error', 'Failed to update profile.');
    }
  };

  // ---------------------------------------------------------------------------
  // MYSQL TEST HANDLER
  // ---------------------------------------------------------------------------
  const handleTestMySQL = async (e) => {
    e.preventDefault();
    setTestingMysql(true);
    setMysqlTestResult(null);
    try {
      const res = await fetch('/api/admin/test-mysql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mysqlTestForm),
      });
      const data = await res.json();
      setMysqlTestResult(data);
    } catch (e) {
      setMysqlTestResult({ success: false, message: 'Server request failed.' });
    } finally {
      setTestingMysql(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SECURITY UPDATE HANDLER
  // ---------------------------------------------------------------------------
  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      showNotification('error', 'New passwords do not match.');
      return;
    }
    try {
      const res = await fetch('/api/auth/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(securityForm),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', 'Admin credentials updated securely!');
        setSecurityForm({
          currentPassword: '',
          newUsername: '',
          newEmail: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        showNotification('error', data.error || 'Failed to update credentials.');
      }
    } catch (e) {
      showNotification('error', 'Network error.');
    }
  };

  // Media Studio Apply Handler
  const handleApplyStudioImage = async () => {
    if (!studioUrl) {
      showNotification('error', 'Please enter or select an image URL first.');
      return;
    }

    try {
      if (studioTarget === 'profile') {
        const res = await fetch('/api/admin/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...profile, avatar_url: studioUrl }),
        });
        if (res.ok) {
          setProfile({ ...profile, avatar_url: studioUrl });
          showNotification('success', 'Profile portrait photo updated with new image URL!');
          if (onDataUpdated) onDataUpdated();
        }
      } else if (studioTarget === 'project') {
        if (!studioTargetId) {
          showNotification('error', 'Please choose which project to apply this image to.');
          return;
        }
        const proj = projects.find((p) => p.id === Number(studioTargetId));
        if (!proj) return;
        const res = await fetch(`/api/admin/projects/${proj.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...proj, image_url: studioUrl }),
        });
        if (res.ok) {
          showNotification('success', `Project "${proj.title}" image updated!`);
          fetchData();
          if (onDataUpdated) onDataUpdated();
        }
      } else if (studioTarget === 'blog') {
        if (!studioTargetId) {
          showNotification('error', 'Please choose which blog article to apply this image to.');
          return;
        }
        const blg = blogs.find((b) => b.id === Number(studioTargetId));
        if (!blg) return;
        const res = await fetch(`/api/admin/blogs/${blg.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...blg, featured_image: studioUrl }),
        });
        if (res.ok) {
          showNotification('success', `Article "${blg.title}" featured image updated!`);
          fetchData();
          if (onDataUpdated) onDataUpdated();
        }
      }
    } catch (e) {
      showNotification('error', 'Failed to update image.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-7xl h-[94vh] bg-[#0c0d14] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <div className="h-16 px-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Husnain Nawaz CMS</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  v2.0 · Hostinger & MySQL Ready
                </span>
              </h2>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {notice.text && (
              <div className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 ${
                notice.type === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
              }`}>
                {notice.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{notice.text}</span>
              </div>
            )}

            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
            >
              Sign Out
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Body (Sidebar + Main Area) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Nav */}
          <aside className="w-56 sm:w-64 border-r border-zinc-800 bg-[#090a0f] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
            <nav className="space-y-1.5 text-xs font-medium">
              <button
                onClick={() => { setActiveTab('overview'); setEditingBlog(null); setEditingProject(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & Stats</span>
              </button>

              <button
                onClick={() => { setActiveTab('blogs'); setEditingProject(null); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'blogs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Rank Math Blogs</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                  {blogs.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('projects'); setEditingBlog(null); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4" />
                  <span>Projects Manager</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                  {projects.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('profile'); setEditingBlog(null); setEditingProject(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile & Bio</span>
              </button>

              <button
                onClick={() => { setActiveTab('media'); setEditingBlog(null); setEditingProject(null); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'media' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span>Media & Images</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  Live URL
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('messages'); setEditingBlog(null); setEditingProject(null); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>Inquiries</span>
                </span>
                {messages.filter((m) => !m.is_read).length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                )}
              </button>

              <button
                onClick={() => { setActiveTab('database'); setEditingBlog(null); setEditingProject(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'database' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>MySQL & Hostinger</span>
              </button>

              <button
                onClick={() => { setActiveTab('security'); setEditingBlog(null); setEditingProject(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'security' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin Security</span>
              </button>
            </nav>

            {/* Bottom Driver Indicator */}
            <div className="pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Active Driver:</span>
                <span className="font-mono text-zinc-300">
                  {dbStatus?.isUsingMySQL ? 'MySQL' : 'Local JSON Store'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online
                </span>
              </div>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="flex-1 bg-[#0c0d14] overflow-y-auto p-6 sm:p-8">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8 max-w-5xl">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">System Dashboard</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Live analytics, SEO health, content inventory, and database synchronization.
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="text-xs text-zinc-400 font-medium">Projects Deployed</div>
                    <div className="text-3xl font-extrabold text-white mt-1 font-mono tabular-nums">
                      {projects.length}
                    </div>
                    <div className="text-[11px] text-indigo-400 mt-1">Bento & Case Studies</div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="text-xs text-zinc-400 font-medium">Published Articles</div>
                    <div className="text-3xl font-extrabold text-white mt-1 font-mono tabular-nums">
                      {blogs.length}
                    </div>
                    <div className="text-[11px] text-indigo-400 mt-1">Rank Math Indexable</div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="text-xs text-zinc-400 font-medium">Average SEO Score</div>
                    <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono tabular-nums">
                      {Math.round(blogs.reduce((acc, b) => acc + (b.rank_math_score || 85), 0) / (blogs.length || 1))}/100
                    </div>
                    <div className="text-[11px] text-emerald-400/80 mt-1">Google SERP Ready</div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="text-xs text-zinc-400 font-medium">Inquiries Received</div>
                    <div className="text-3xl font-extrabold text-white mt-1 font-mono tabular-nums">
                      {messages.length}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1">Direct Client Leads</div>
                  </div>
                </div>

                {/* Deployment & Environment Banner */}
                <div className="p-5 rounded-xl bg-indigo-950/20 border border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-400" />
                      <span>Hostinger & MySQL Deployment Readiness</span>
                    </h4>
                    <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
                      Your complete MySQL schema is compiled at <code className="text-indigo-300 font-mono">database/schema.sql</code>. Push to GitHub, clone to Hostinger Git repository, and point your Hostinger MySQL connection variables in <code className="text-indigo-300 font-mono">.env</code>.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('database')}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white whitespace-nowrap shadow-sm"
                  >
                    Open Hostinger Center
                  </button>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center justify-between">
                      <span>Recent Articles</span>
                      <button onClick={() => { setActiveTab('blogs'); handleOpenBlogEditor(); }} className="text-xs text-indigo-400 hover:underline">
                        + New Post
                      </button>
                    </h4>
                    <div className="space-y-2">
                      {blogs.slice(0, 3).map((b) => (
                        <div key={b.id} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs">
                          <span className="text-zinc-200 truncate max-w-[70%]">{b.title}</span>
                          <span className="font-mono text-emerald-400">{b.rank_math_score}/100</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center justify-between">
                      <span>Latest Inquiries</span>
                      <button onClick={() => setActiveTab('messages')} className="text-xs text-indigo-400 hover:underline">
                        View All
                      </button>
                    </h4>
                    <div className="space-y-2">
                      {messages.slice(0, 3).map((m) => (
                        <div key={m.id} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-white">{m.name}</span>
                            <span className="text-zinc-500 ml-2 truncate">{m.subject}</span>
                          </div>
                          <span className="text-[11px] text-zinc-400">{new Date(m.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: BLOGS & RANK MATH SEO */}
            {activeTab === 'blogs' && (
              <div className="space-y-6">
                {!editingBlog ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                      <div>
                        <h3 className="text-xl font-bold text-white">Rank Math SEO Blog Manager</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Create search engine optimized technical articles with real-time algorithmic audits.
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenBlogEditor()}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Write SEO Post</span>
                      </button>
                    </div>

                    {/* Blog Posts Table */}
                    <div className="bg-zinc-900/60 rounded-xl border border-zinc-800 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono tracking-wider text-[11px] border-b border-zinc-800">
                          <tr>
                            <th className="py-3 px-4">Title & Slug</th>
                            <th className="py-3 px-4">Focus Keyword</th>
                            <th className="py-3 px-4">Rank Math</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/80">
                          {blogs.map((b) => (
                            <tr key={b.id} className="hover:bg-zinc-800/30 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-semibold text-white truncate max-w-sm">{b.title}</div>
                                <div className="text-[11px] text-zinc-500 font-mono truncate max-w-sm">/blog/{b.slug}</div>
                              </td>
                              <td className="py-3 px-4 text-zinc-300 font-medium">
                                {b.focus_keyword || '—'}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                                  (b.rank_math_score || 85) >= 90 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                                }`}>
                                  <Sparkles className="w-3 h-3" />
                                  <span>{b.rank_math_score || 85}/100</span>
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  b.status === 'published' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/60' : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right space-x-2">
                                <button
                                  onClick={() => handleOpenBlogEditor(b)}
                                  className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                                  title="Edit & Optimize"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(b.id)}
                                  className="p-1.5 rounded bg-zinc-800 hover:bg-red-950 text-red-400 hover:text-red-300"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  /* POST EDITOR WITH LIVE RANK MATH SUITE */
                  <form onSubmit={handleSaveBlog} className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {editingBlog === 'new' ? 'Create New SEO Article' : 'Edit & Optimize Article'}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          Real-time scoring adjusts dynamically as you author content and meta tags.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingBlog(null)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save & Publish</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Article Content Authoring */}
                      <div className="lg:col-span-7 space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1">
                            Article Title <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={blogForm.title}
                            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                            placeholder="e.g. How We Scaled EHR360: High-Throughput Healthcare Architecture"
                            className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">
                              Permalink Slug
                            </label>
                            <input
                              type="text"
                              value={blogForm.slug}
                              onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                              placeholder="scaling-ehr360-architecture"
                              className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">
                              Category
                            </label>
                            <select
                              value={blogForm.category}
                              onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            >
                              <option value="Engineering">Engineering</option>
                              <option value="Architecture">Architecture</option>
                              <option value="SEO & Growth">SEO & Growth</option>
                              <option value="Full-Stack">Full-Stack</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1">
                            Short Excerpt (Summary)
                          </label>
                          <textarea
                            rows={2}
                            value={blogForm.excerpt}
                            onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                            placeholder="Concise overview of what this article delivers..."
                            className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-1">
                            Article Body (Markdown Supported) <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            rows={12}
                            required
                            value={blogForm.content}
                            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                            placeholder="## Introduction&#10;&#10;Write your deep technical guide here. Use ## for headings to gain Rank Math points..."
                            className="w-full p-3 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                          />
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Publication Status</label>
                            <select
                              value={blogForm.status}
                              onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                            >
                              <option value="published">Published (Public)</option>
                              <option value="draft">Draft (Private)</option>
                            </select>
                          </div>

                          <ResponsiveImageControl
                            label="Featured Article Image URL"
                            value={blogForm.featured_image}
                            onChange={(url) => setBlogForm({ ...blogForm, featured_image: url })}
                            aspectRatio="21:9"
                            placeholder="Enter image URL or choose preset"
                            helpText="Displays on post headers and Google SERP snippets. Toggle Desktop, Tablet, and Mobile to check responsive presentation."
                          />
                        </div>
                      </div>

                      {/* Right: RANK MATH SEO AUDITOR & GOOGLE SNIPPET PREVIEW */}
                      <div className="lg:col-span-5 space-y-5">
                        
                        {/* Rank Math Live Score Card */}
                        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-indigo-400" />
                              <h4 className="text-sm font-bold text-white">Rank Math SEO Auditor</h4>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                              (seoResult?.score || 0) >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}>
                              {seoResult?.score || 0}/100 · {seoResult?.grade || 'Analyzing'}
                            </div>
                          </div>

                          {/* Focus Keyword Field */}
                          <div>
                            <label className="block text-xs font-semibold text-indigo-400 mb-1">
                              Focus Keyword (Rank Math Anchor)
                            </label>
                            <input
                              type="text"
                              value={blogForm.focus_keyword}
                              onChange={(e) => setBlogForm({ ...blogForm, focus_keyword: e.target.value })}
                              placeholder="e.g. medical billing architecture"
                              className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-indigo-400"
                            />
                            <div className="text-[11px] text-zinc-400 mt-1 flex justify-between">
                              <span>Mentions: {seoResult?.keywordOccurrences || 0}</span>
                              <span>Density: {seoResult?.keywordDensity || 0}%</span>
                              <span>Words: {seoResult?.wordCount || 0}</span>
                            </div>
                          </div>

                          {/* SEO Title */}
                          <div>
                            <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1">
                              <span>Custom SEO Title</span>
                              <span className="font-mono text-zinc-500">{(blogForm.meta_title || blogForm.title).length}/60 chars</span>
                            </div>
                            <input
                              type="text"
                              value={blogForm.meta_title}
                              onChange={(e) => setBlogForm({ ...blogForm, meta_title: e.target.value })}
                              placeholder={blogForm.title || 'SEO Title for Google SERP'}
                              className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                            />
                          </div>

                          {/* Meta Description */}
                          <div>
                            <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1">
                              <span>Meta Description Snippet</span>
                              <span className="font-mono text-zinc-500">{(blogForm.meta_description || blogForm.excerpt).length}/160 chars</span>
                            </div>
                            <textarea
                              rows={2}
                              value={blogForm.meta_description}
                              onChange={(e) => setBlogForm({ ...blogForm, meta_description: e.target.value })}
                              placeholder={blogForm.excerpt || 'Compelling snippet that appears in Google search results...'}
                              className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                            />
                          </div>

                          {/* Google SERP Simulator */}
                          <div className="pt-3 border-t border-zinc-800">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                Google Search Preview
                              </span>
                              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded border border-zinc-800">
                                <button
                                  type="button"
                                  onClick={() => setPreviewDevice('desktop')}
                                  className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                                  title="Desktop SERP"
                                >
                                  <Monitor className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPreviewDevice('mobile')}
                                  className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                                  title="Mobile SERP"
                                >
                                  <Smartphone className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Simulated Google Card */}
                            <div className="p-3.5 rounded-lg bg-[#1a1b1e] border border-zinc-800 text-left font-sans">
                              <div className="text-[11px] text-[#bdc1c6] truncate flex items-center gap-1">
                                <span>https://husnainnawaz.dev</span>
                                <span>›</span>
                                <span>blog</span>
                                <span>›</span>
                                <span className="text-zinc-400">{blogForm.slug || 'url-slug'}</span>
                              </div>
                              <div className="text-[15px] text-[#8ab4f8] font-medium leading-snug truncate mt-0.5">
                                {blogForm.meta_title || blogForm.title || 'Your Article Title – Husnain Nawaz'}
                              </div>
                              <div className="text-xs text-[#bdc1c6] mt-1 line-clamp-2 leading-relaxed">
                                {blogForm.meta_description || blogForm.excerpt || 'Article summary preview in Google search results...'}
                              </div>
                            </div>
                          </div>

                          {/* Actionable Rank Math Checklist */}
                          <div className="pt-3 border-t border-zinc-800 space-y-2">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                              Rank Math Algorithmic Checklist
                            </div>
                            
                            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                              {seoResult?.tests?.map((t) => (
                                <div
                                  key={t.id}
                                  className={`p-2 rounded text-[11px] flex items-start gap-2 ${
                                    t.passed ? 'bg-emerald-950/25 border border-emerald-900/40 text-emerald-300' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                                  }`}
                                >
                                  <span className={`mt-0.5 shrink-0 ${t.passed ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                                    {t.passed ? '✓' : '✗'}
                                  </span>
                                  <div>
                                    <div className="font-semibold text-zinc-200">{t.label}</div>
                                    <div className="text-[10px] text-zinc-400 mt-0.5">{t.recommendation}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                      </div>

                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB: PROJECTS MANAGER */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {!editingProject ? (
                  <>
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                      <div>
                        <h3 className="text-xl font-bold text-white">Featured Projects & Case Studies</h3>
                        <p className="text-xs text-zinc-400">
                          Manage portfolio cards, technical architecture descriptions, and live URLs.
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenProjectEditor()}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Project</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((p) => (
                        <div key={p.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                          <div>
                            <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-zinc-950 mb-3">
                              <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-xs text-indigo-400 font-medium">{p.category}</div>
                            <h4 className="text-base font-bold text-white mt-0.5">{p.title}</h4>
                            <p className="text-xs text-zinc-300 mt-1 line-clamp-2">{p.tagline || p.description}</p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                            <span className="font-mono text-zinc-500 text-[11px] truncate max-w-[60%]">{p.tags}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenProjectEditor(p)}
                                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(p.id)}
                                className="p-1.5 rounded bg-zinc-800 hover:bg-red-950 text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSaveProject} className="space-y-4 max-w-3xl">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                      <h3 className="text-lg font-bold text-white">
                        {editingProject === 'new' ? 'Add Portfolio Project' : 'Edit Project Details'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 text-zinc-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
                        >
                          Save Project
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Category</label>
                        <input
                          type="text"
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={projectForm.tagline}
                        onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Full Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">The Engineering Challenge</label>
                        <textarea
                          rows={3}
                          value={projectForm.challenge}
                          onChange={(e) => setProjectForm({ ...projectForm, challenge: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Solution & Architecture</label>
                        <textarea
                          rows={3}
                          value={projectForm.solution}
                          onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Verified Real-World Results</label>
                      <input
                        type="text"
                        value={projectForm.results}
                        onChange={(e) => setProjectForm({ ...projectForm, results: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Technologies / Tags</label>
                        <input
                          type="text"
                          value={projectForm.tags}
                          onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Live URL</label>
                        <input
                          type="text"
                          value={projectForm.live_url}
                          onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">GitHub Repo URL</label>
                        <input
                          type="text"
                          value={projectForm.github_url}
                          onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <ResponsiveImageControl
                        label="Project Showcase Image URL"
                        value={projectForm.image_url}
                        onChange={(url) => setProjectForm({ ...projectForm, image_url: url })}
                        aspectRatio="16:9"
                        placeholder="Enter project screenshot URL or select preset"
                        helpText="Displayed in the Bento grid with desktop 16:9, tablet 4:3, and mobile card scaling."
                      />
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB: PROFILE & SEO DEFAULTS */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-3xl">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <h3 className="text-xl font-bold text-white">Profile & Brand Information</h3>
                    <p className="text-xs text-zinc-400">
                      Configure your global bio, contact numbers, and SEO defaults.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile</span>
                  </button>
                </div>

                {/* Profile Portrait / Avatar Changer */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <ResponsiveImageControl
                    label="Profile Portrait Photo URL"
                    value={profile.avatar_url || ''}
                    onChange={(url) => setProfile({ ...profile, avatar_url: url })}
                    isAvatar={true}
                    aspectRatio="1:1"
                    placeholder="Enter portrait URL (e.g. /src/assets/images/... or https://...)"
                    helpText="Appears on the homepage Hero card, author signatures, and metadata. Test how your photo scales across Desktop, Tablet, and Mobile."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name || ''}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={profile.title || ''}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Hero Professional Summary</label>
                  <textarea
                    rows={3}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email || ''}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Phone</label>
                    <input
                      type="text"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={profile.github_url || ''}
                      onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={profile.linkedin_url || ''}
                      onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">WhatsApp Link</label>
                    <input
                      type="text"
                      value={profile.whatsapp_url || ''}
                      onChange={(e) => setProfile({ ...profile, whatsapp_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
                    Default Website SEO Metadata
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Global Meta Title</label>
                      <input
                        type="text"
                        value={profile.meta_title || ''}
                        onChange={(e) => setProfile({ ...profile, meta_title: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Global Meta Description</label>
                      <textarea
                        rows={2}
                        value={profile.meta_description || ''}
                        onChange={(e) => setProfile({ ...profile, meta_description: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>

              </form>
            )}

            {/* TAB: MEDIA & RESPONSIVE IMAGE STUDIO */}
            {activeTab === 'media' && (
              <div className="space-y-8 max-w-5xl">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
                    <ImageIcon className="w-4 h-4" />
                    <span>Media Engine</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Responsive Image & Asset Studio
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                    Test how any image URL scales across Desktop (1440px / 16:9), Tablet (768px / 4:3), and Mobile (375px / cards), and assign it directly to your Profile, Projects, or Blogs with one click.
                  </p>
                </div>

                {/* Interactive Tester & Quick Assignment */}
                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Live URL Simulator & Tester</h4>
                    <p className="text-xs text-zinc-400">
                      Paste an image URL from Hostinger, Cloudinary, Imgur, or select from local project presets.
                    </p>
                  </div>

                  <ResponsiveImageControl
                    label="Image URL Under Test"
                    value={studioUrl}
                    onChange={(url) => setStudioUrl(url)}
                    aspectRatio="16:9"
                    placeholder="https://your-domain.com/uploads/photo.jpg or /src/assets/images/..."
                    helpText="Switch devices above to check responsive cropping and layout stability."
                  />

                  {/* One-Click Apply Action Bar */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-zinc-200">
                        Apply this Tested Image to:
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="radio"
                            name="studioTarget"
                            value="profile"
                            checked={studioTarget === 'profile'}
                            onChange={() => setStudioTarget('profile')}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>Profile Photo (Avatar)</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="radio"
                            name="studioTarget"
                            value="project"
                            checked={studioTarget === 'project'}
                            onChange={() => setStudioTarget('project')}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>A Project Showcase</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="radio"
                            name="studioTarget"
                            value="blog"
                            checked={studioTarget === 'blog'}
                            onChange={() => setStudioTarget('blog')}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>A Blog Featured Image</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {studioTarget === 'project' && (
                        <select
                          value={studioTargetId}
                          onChange={(e) => setStudioTargetId(e.target.value)}
                          className="px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white max-w-[200px]"
                        >
                          <option value="">Choose Project...</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </select>
                      )}

                      {studioTarget === 'blog' && (
                        <select
                          value={studioTargetId}
                          onChange={(e) => setStudioTargetId(e.target.value)}
                          className="px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white max-w-[200px]"
                        >
                          <option value="">Choose Blog Post...</option>
                          {blogs.map((b) => (
                            <option key={b.id} value={b.id}>{b.title}</option>
                          ))}
                        </select>
                      )}

                      <button
                        type="button"
                        onClick={handleApplyStudioImage}
                        disabled={!studioUrl}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply Image Now</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Available Presets Library */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Current Built-in Visual Assets</h4>
                    <p className="text-xs text-zinc-400">
                      High-fidelity assets bundled with your application. Click to test or copy URLs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SYSTEM_IMAGE_PRESETS.map((preset) => (
                      <div
                        key={preset.name}
                        className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-zinc-950 mb-2.5">
                            <img
                              src={preset.url}
                              alt={preset.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-semibold text-white">{preset.name}</span>
                            <span className="text-indigo-400 font-mono text-[10px]">{preset.category}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-2">
                            {preset.description}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setStudioUrl(preset.url);
                              showNotification('success', `Loaded "${preset.name}" into tester!`);
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                          >
                            <span>Load into Tester</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(preset.url);
                              showNotification('success', 'Image path copied!');
                            }}
                            className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white"
                            title="Copy Path"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hostinger Custom Image Upload Instructions */}
                <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-indigo-400" />
                    <span>How to Upload Your Own Images to Hostinger</span>
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    When your site is live on Hostinger, you can host your own photos easily:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-400">
                    <li>In Hostinger hPanel, open <strong>File Manager</strong> and go to <code className="text-zinc-200 font-mono">public_html/uploads/</code> (create the folder if it does not exist).</li>
                    <li>Upload your image file (e.g. <code className="text-zinc-200 font-mono">my-new-project.jpg</code>).</li>
                    <li>In this dashboard, simply set the Image URL to <code className="text-indigo-300 font-mono">/uploads/my-new-project.jpg</code> or the full URL <code className="text-indigo-300 font-mono">https://yourdomain.com/uploads/my-new-project.jpg</code>!</li>
                  </ol>
                </div>

              </div>
            )}

            {/* TAB: INQUIRIES & MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-zinc-800">
                  <h3 className="text-xl font-bold text-white">Client Inquiries & Contact Submissions</h3>
                  <p className="text-xs text-zinc-400">
                    Real-time messages sent through the portfolio contact form.
                  </p>
                </div>

                {messages.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 text-xs">
                    No messages received yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-5 rounded-xl border transition-colors ${
                          m.is_read ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-zinc-900/90 border-indigo-500/50'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{m.name}</span>
                            <span className="text-zinc-500 text-xs font-mono">({m.email})</span>
                          </div>
                          <span className="text-xs text-zinc-400 font-mono">
                            {new Date(m.created_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-indigo-400 mb-1">
                          Subject: {m.subject}
                        </div>

                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80 mt-2">
                          {m.message}
                        </p>

                        <div className="mt-3 flex items-center justify-end gap-3 text-xs">
                          <a
                            href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                          >
                            Reply via Email
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MYSQL & HOSTINGER DEPLOYMENT CENTER */}
            {activeTab === 'database' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    MySQL & Hostinger Deployment Center
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Everything you need to deploy this portfolio to GitHub and Hostinger with high security.
                  </p>
                </div>

                {/* Driver Status Card */}
                <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Active Persistence Engine
                    </span>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                      dbStatus?.isUsingMySQL ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    }`}>
                      {dbStatus?.isUsingMySQL ? 'MySQL Connection Pool Active' : 'Resilient Local Storage (Zero-Downtime Fallback)'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {dbStatus?.isUsingMySQL
                      ? 'The backend is actively executing queries on your configured MySQL server database with connection pooling and atomic transactions.'
                      : 'The backend is currently running on the resilient local JSON store because MySQL credentials are not yet set in .env. When you deploy to Hostinger, add your Hostinger database details to .env, and it will automatically connect to MySQL!'}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href="/api/admin/export-sql"
                      download="husnain_portfolio_schema.sql"
                      className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold inline-flex items-center gap-2 border border-zinc-700"
                    >
                      <Download className="w-4 h-4 text-indigo-400" />
                      <span>Download Ready-to-Import schema.sql</span>
                    </a>
                  </div>
                </div>

                {/* Live MySQL Connection Tester Tool */}
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Test Hostinger MySQL Connection</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Verify your Hostinger MySQL database credentials directly from this dashboard before saving to .env.
                    </p>
                  </div>

                  <form onSubmit={handleTestMySQL} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-300 mb-1">Host</label>
                        <input
                          type="text"
                          value={mysqlTestForm.host}
                          onChange={(e) => setMysqlTestForm({ ...mysqlTestForm, host: e.target.value })}
                          placeholder="localhost"
                          className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-300 mb-1">Database Name</label>
                        <input
                          type="text"
                          value={mysqlTestForm.database}
                          onChange={(e) => setMysqlTestForm({ ...mysqlTestForm, database: e.target.value })}
                          placeholder="u123456_portfolio"
                          className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-300 mb-1">MySQL Username</label>
                        <input
                          type="text"
                          value={mysqlTestForm.user}
                          onChange={(e) => setMysqlTestForm({ ...mysqlTestForm, user: e.target.value })}
                          placeholder="u123456_husnain"
                          className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-300 mb-1">MySQL Password</label>
                        <input
                          type="password"
                          value={mysqlTestForm.password}
                          onChange={(e) => setMysqlTestForm({ ...mysqlTestForm, password: e.target.value })}
                          placeholder="Hostinger MySQL Password"
                          className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={testingMysql}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${testingMysql ? 'animate-spin' : ''}`} />
                        <span>{testingMysql ? 'Testing...' : 'Test Connection'}</span>
                      </button>

                      {mysqlTestResult && (
                        <span className={`text-xs font-medium ${mysqlTestResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                          {mysqlTestResult.message}
                        </span>
                      )}
                    </div>
                  </form>
                </div>

                {/* Hostinger Step-by-Step Guide */}
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-indigo-400" />
                    <span>Step-by-Step Deployment Guide for GitHub & Hostinger</span>
                  </h4>

                  <ol className="list-decimal list-inside space-y-3 text-xs text-zinc-300 leading-relaxed">
                    <li>
                      <strong className="text-white">Push to GitHub:</strong> Initialize git, commit your files, and push to your private/public GitHub repository. Notice that <code className="text-indigo-300 font-mono">.env</code> is automatically excluded by <code className="text-indigo-300 font-mono">.gitignore</code> so your passwords remain 100% secret.
                    </li>
                    <li>
                      <strong className="text-white">Create MySQL Database in Hostinger:</strong> In your Hostinger hPanel, go to <em>Databases → MySQL Databases</em>, create a new database (e.g. <code className="text-indigo-300 font-mono">u123_husnain_portfolio</code>) and user.
                    </li>
                    <li>
                      <strong className="text-white">Import Schema:</strong> Open phpMyAdmin from Hostinger, click on your database, click <em>Import</em>, and upload the <code className="text-indigo-300 font-mono">database/schema.sql</code> file.
                    </li>
                    <li>
                      <strong className="text-white">Deploy on Hostinger (Node.js Application):</strong>
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-zinc-400">
                        <li>In Hostinger hPanel, navigate to <em>Node.js Selector</em> or <em>Git Deployment</em>.</li>
                        <li>Set Application Startup File: <code className="text-zinc-200 font-mono">server.js</code></li>
                        <li>Set Application root: <code className="text-zinc-200 font-mono">/public_html</code></li>
                        <li>Create your production <code className="text-zinc-200 font-mono">.env</code> file in Hostinger with your MySQL credentials and JWT secret.</li>
                        <li>Run <code className="text-zinc-200 font-mono">npm install && npm run build</code> and start the application!</li>
                      </ul>
                    </li>
                  </ol>
                </div>

              </div>
            )}

            {/* TAB: ADMIN SECURITY */}
            {activeTab === 'security' && (
              <form onSubmit={handleSaveSecurity} className="space-y-6 max-w-xl">
                <div className="pb-4 border-b border-zinc-800">
                  <h3 className="text-xl font-bold text-white">Admin Security & Credentials</h3>
                  <p className="text-xs text-zinc-400">
                    Update your admin username, email, and password. Requires current password verification.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Current Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                    placeholder="Enter current password to authorize changes"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">New Username (Optional)</label>
                    <input
                      type="text"
                      value={securityForm.newUsername}
                      onChange={(e) => setSecurityForm({ ...securityForm, newUsername: e.target.value })}
                      placeholder="e.g. husnain"
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Admin Email</label>
                    <input
                      type="email"
                      value={securityForm.newEmail}
                      onChange={(e) => setSecurityForm({ ...securityForm, newEmail: e.target.value })}
                      placeholder="chhusnain2345@gmail.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">New Password</label>
                    <input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                      placeholder="At least 6 characters"
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                      placeholder="Repeat new password"
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Key className="w-4 h-4" />
                  <span>Update Admin Credentials</span>
                </button>
              </form>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
