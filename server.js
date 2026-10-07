import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import {
  initDatabase,
  getAdminByUsername,
  updateAdminCredentials,
  getProfile,
  updateProfile,
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getSkills,
  updateSkills,
  getExperiences,
  updateExperiences,
  getMessages,
  createMessage,
  markMessageRead,
  deleteMessage,
  testMySQLConnection,
  getDatabaseStatus,
} from './server/db.js';

import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyAdminToken,
} from './server/auth.js';

import {
  analyzeRankMathSeo,
  generateSitemapXml,
} from './server/seo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.resolve(__dirname, 'server/uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  app.use('/uploads', express.static(uploadsDir));

  // Initialize DB & Seed Data
  await initDatabase();

  // ---------------------------------------------------------------------------
  // PUBLIC ROUTES
  // ---------------------------------------------------------------------------
  
  // Profile & Hero Info
  app.get('/api/profile', async (req, res) => {
    try {
      const profile = await getProfile();
      res.json(profile);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  // Projects
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await getProjects();
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.get('/api/projects/:slug', async (req, res) => {
    try {
      const project = await getProjectBySlug(req.params.slug);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  // Blogs (Public: Published only)
  app.get('/api/blogs', async (req, res) => {
    try {
      const blogs = await getBlogs(false);
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  });

  app.get('/api/blogs/:slug', async (req, res) => {
    try {
      const blog = await getBlogBySlug(req.params.slug);
      if (!blog) return res.status(404).json({ error: 'Article not found' });
      res.json(blog);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch article' });
    }
  });

  // Skills
  app.get('/api/skills', async (req, res) => {
    try {
      const skills = await getSkills();
      res.json(skills);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch skills' });
    }
  });

  // Experience & Education
  app.get('/api/experience', async (req, res) => {
    try {
      const exp = await getExperiences();
      res.json(exp);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch experience' });
    }
  });

  // Contact Form Submission
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
      }
      const created = await createMessage({ name, email, subject: subject || 'Portfolio Contact Inquiry', message });
      res.status(201).json({ success: true, message: 'Message sent successfully!', data: created });
    } catch (err) {
      res.status(500).json({ error: 'Failed to submit contact message' });
    }
  });

  // ---------------------------------------------------------------------------
  // AUTHENTICATION
  // ---------------------------------------------------------------------------
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const admin = await getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const isMatch = await comparePassword(password, admin.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = generateToken({
        id: admin.id,
        username: admin.username,
        role: admin.role,
      });

      res.json({
        success: true,
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      res.status(500).json({ error: 'Authentication error' });
    }
  });

  app.get('/api/auth/me', verifyAdminToken, async (req, res) => {
    try {
      const admin = await getAdminByUsername(req.admin.username);
      if (!admin) return res.status(404).json({ error: 'Admin not found' });
      res.json({
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to verify admin' });
    }
  });

  app.post('/api/auth/update-credentials', verifyAdminToken, async (req, res) => {
    try {
      const { currentPassword, newUsername, newEmail, newPassword } = req.body;
      const admin = await getAdminByUsername(req.admin.username);
      if (!admin) return res.status(404).json({ error: 'Admin not found' });

      const isMatch = await comparePassword(currentPassword, admin.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password does not match' });
      }

      let newHash;
      if (newPassword && newPassword.trim().length >= 6) {
        newHash = await hashPassword(newPassword.trim());
      }

      await updateAdminCredentials(
        admin.id,
        newUsername || admin.username,
        newEmail || admin.email,
        newHash
      );

      res.json({ success: true, message: 'Admin credentials updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update credentials' });
    }
  });

  // ---------------------------------------------------------------------------
  // ADMIN CMS ROUTES (Protected)
  // ---------------------------------------------------------------------------

  // Upload Image
  app.post('/api/admin/upload', verifyAdminToken, async (req, res) => {
    try {
      const { fileData, fileName } = req.body;
      if (!fileData || !fileName) return res.status(400).json({ error: 'Missing file data or name' });
      
      const base64Data = fileData.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const safeFileName = `${Date.now()}_${fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;
      const savePath = path.join(__dirname, 'server/uploads', safeFileName);
      
      fs.writeFileSync(savePath, buffer);
      
      res.json({ url: `/uploads/${safeFileName}` });
    } catch (err) {
      console.error('Upload Error:', err);
      res.status(500).json({ error: 'Image upload failed' });
    }
  });

  // Profile Update
  app.put('/api/admin/profile', verifyAdminToken, async (req, res) => {
    try {
      const updated = await updateProfile(req.body);
      res.json({ success: true, profile: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Projects CRUD
  app.post('/api/admin/projects', verifyAdminToken, async (req, res) => {
    try {
      const { title, tagline, description, category, tags, image_url } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }
      const slug = (req.body.slug || title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const project = await createProject({
        ...req.body,
        slug,
        category: category || 'Full-Stack',
        tags: tags || 'React, Express',
        image_url: image_url || '/src/assets/images/project_nom_nosh_1791318773177.jpg',
      });
      res.status(201).json(project);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.put('/api/admin/projects/:id', verifyAdminToken, async (req, res) => {
    try {
      const updated = await updateProject(Number(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: 'Project not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  app.delete('/api/admin/projects/:id', verifyAdminToken, async (req, res) => {
    try {
      await deleteProject(Number(req.params.id));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Blogs CRUD (Admin gets all, including drafts)
  app.get('/api/admin/blogs', verifyAdminToken, async (req, res) => {
    try {
      const blogs = await getBlogs(true);
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  });

  app.post('/api/admin/blogs', verifyAdminToken, async (req, res) => {
    try {
      const { title, content, focus_keyword, meta_description, meta_title } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const slug = (req.body.slug || title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Real-time Rank Math SEO score calculation
      const seoResult = analyzeRankMathSeo({
        title: meta_title || title,
        slug,
        content,
        metaDescription: meta_description || '',
        focusKeyword: focus_keyword || '',
      });

      const blog = await createBlog({
        ...req.body,
        slug,
        rank_math_score: seoResult.score,
        featured_image: req.body.featured_image || '/src/assets/images/project_visualstock_1791318802924.jpg',
      });

      res.status(201).json(blog);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create blog' });
    }
  });

  app.put('/api/admin/blogs/:id', verifyAdminToken, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { title, content, focus_keyword, meta_description, meta_title, slug } = req.body;

      let scoreUpdates = {};
      if (title && content) {
        const seoResult = analyzeRankMathSeo({
          title: meta_title || title,
          slug: slug || '',
          content,
          metaDescription: meta_description || '',
          focusKeyword: focus_keyword || '',
        });
        scoreUpdates.rank_math_score = seoResult.score;
      }

      const updated = await updateBlog(id, {
        ...req.body,
        ...scoreUpdates,
      });

      if (!updated) return res.status(404).json({ error: 'Blog post not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update blog post' });
    }
  });

  app.delete('/api/admin/blogs/:id', verifyAdminToken, async (req, res) => {
    try {
      await deleteBlog(Number(req.params.id));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete blog' });
    }
  });

  // Real-time Rank Math SEO Analyzer Endpoint
  app.post('/api/admin/seo-analyze', verifyAdminToken, (req, res) => {
    try {
      const { title, slug, content, metaDescription, focusKeyword } = req.body;
      const result = analyzeRankMathSeo({
        title: title || '',
        slug: slug || '',
        content: content || '',
        metaDescription: metaDescription || '',
        focusKeyword: focusKeyword || '',
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'SEO analysis calculation error' });
    }
  });

  // Skills & Experience Admin Management
  app.put('/api/admin/skills', verifyAdminToken, async (req, res) => {
    try {
      const updated = await updateSkills(req.body.skills);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update skills' });
    }
  });

  app.put('/api/admin/experience', verifyAdminToken, async (req, res) => {
    try {
      const updated = await updateExperiences(req.body.experiences);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update experiences' });
    }
  });

  // Contact Messages Admin
  app.get('/api/admin/messages', verifyAdminToken, async (req, res) => {
    try {
      const messages = await getMessages();
      res.json(messages);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.put('/api/admin/messages/:id/read', verifyAdminToken, async (req, res) => {
    try {
      await markMessageRead(Number(req.params.id));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to mark message' });
    }
  });

  app.delete('/api/admin/messages/:id', verifyAdminToken, async (req, res) => {
    try {
      await deleteMessage(Number(req.params.id));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete message' });
    }
  });

  // Database Management & Hostinger Status
  app.get('/api/admin/database-status', verifyAdminToken, (req, res) => {
    const status = getDatabaseStatus();
    res.json(status);
  });

  app.post('/api/admin/test-mysql', verifyAdminToken, async (req, res) => {
    const result = await testMySQLConnection(req.body);
    res.json(result);
  });

  app.get('/api/admin/export-sql', verifyAdminToken, (req, res) => {
    const schemaPath = path.resolve(__dirname, 'database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf-8');
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="husnain_portfolio_schema.sql"');
      res.send(sql);
    } else {
      res.status(404).json({ error: 'Schema file not found' });
    }
  });

  // ---------------------------------------------------------------------------
  // SEO ENDPOINTS: Dynamic Sitemap & Robots.txt
  // ---------------------------------------------------------------------------
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const blogs = await getBlogs(false);
      const projects = await getProjects();
      const hostUrl = req.protocol + '://' + req.get('host');
      const xml = generateSitemapXml(hostUrl, blogs, projects);
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      res.status(500).send('Error generating sitemap');
    }
  });

  app.get('/robots.txt', (req, res) => {
    const hostUrl = req.protocol + '://' + req.get('host');
    const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${hostUrl}/sitemap.xml
`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(robots);
  });

  // ---------------------------------------------------------------------------
  // DEV / PROD FRONTEND INTEGRATION
  // ---------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Portfolio and CMS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
