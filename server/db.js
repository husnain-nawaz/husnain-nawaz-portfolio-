import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const STORE_PATH = path.resolve(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let mysqlPool = null;
let isUsingMySQL = false;
let mysqlError = null;

// Initial Seed Data directly from Husnain Nawaz's Resume and Portfolio Requirements
async function getInitialStore() {
  const initialPasswordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'husnain@admin2026!',
    10
  );

  return {
    admin: {
      id: 1,
      username: process.env.ADMIN_USERNAME || 'admin',
      password_hash: initialPasswordHash,
      email: process.env.ADMIN_EMAIL || 'chhusnain2345@gmail.com',
      role: 'superadmin',
    },
    profile: {
      id: 1,
      name: 'Husnain Nawaz',
      title: 'Full-Stack Developer & UI/UX Engineer',
      bio: 'Versatile Computer Science graduate with hands-on professional experience building modern web applications, custom platforms, and enterprise digital infrastructure. Proven track record in full-stack web development, utilizing advanced AI tools, and delivering high-performance medical billing software solutions.',
      about_long: 'I am a full-stack engineer and designer based in Lahore, Pakistan. Over the years, I have architected and engineered mission-critical web applications—from EHR360 (a flagship medical billing and Electronic Health Records suite at Hawk Logix) to complete POS systems like Nom Nosh Restaurant Infrastructure, and fintech platforms like VisualStockMarket.com and Celestra Solutions.\n\nI combine deep technical rigor in React, Node.js, Express, and relational databases with keen attention to UI design thinking, wireframing, and SEO optimization. Whether architecting scalable REST APIs or optimizing Google SERP rank math scoring, my objective is delivering pristine, robust digital products.',
      email: 'chhusnain2345@gmail.com',
      phone: '+92 309 9694193',
      location: 'Lahore, Pakistan',
      avatar_url: '/src/assets/images/husnain_portrait_1791318756469.jpg',
      github_url: 'https://github.com/husnain-nawaz',
      linkedin_url: 'https://linkedin.com/in/husnain-nawaz',
      twitter_url: 'https://twitter.com/husnain_dev',
      whatsapp_url: 'https://wa.me/923099694193',
      resume_url: '#',
      years_experience: 3,
      projects_completed: 24,
      happy_clients: 18,
      meta_title: 'Husnain Nawaz – Full-Stack Developer & UI/UX Engineer',
      meta_description: 'Portfolio of Husnain Nawaz, Full-Stack Developer specializing in React, Node.js, Express, healthcare software, and SEO-friendly architectures.',
    },
    projects: [
      {
        id: 1,
        title: 'Nom Nosh Restaurant Infrastructure & POS System',
        slug: 'nom-nosh-restaurant-pos-infrastructure',
        tagline: 'End-to-end digital infrastructure, web ordering, and touchscreen POS terminal.',
        description: 'Architected and deployed the complete digital infrastructure, responsive customer-facing website, and touchscreen Point of Sale (POS) system for Nom Nosh Restaurant. Streamlined order kitchen tickets, live inventory tracking, and payment processing.',
        challenge: 'The restaurant suffered from manual ticket handwriting, disjointed table seating, and disconnected online and dine-in inventory levels during peak rush hours.',
        solution: 'Engineered an integrated React & Node.js POS terminal with sub-second kitchen ticket printing, offline synchronization, automated stock deductions, and responsive online customer portal.',
        results: 'Reduced order turnaround time by 42% and eliminated table discrepancy errors across 10,000+ monthly orders.',
        category: 'Full-Stack & Systems',
        tags: 'React, Node.js, Express, POS Architecture, REST APIs, Tailwind CSS',
        featured: true,
        order_index: 1,
        image_url: '/src/assets/images/project_nom_nosh_1791318773177.jpg',
        live_url: 'https://nomnosh.example.com',
        github_url: 'https://github.com/husnain-nawaz/nom-nosh-pos',
        client_name: 'Nom Nosh Restaurant',
        completion_date: '2026',
      },
      {
        id: 2,
        title: 'EHR360 Healthcare & Medical Billing Suite',
        slug: 'ehr360-medical-billing-ehr-software',
        tagline: 'Flagship enterprise medical billing and electronic health records platform.',
        description: 'Contributed as a core developer on EHR360 at Hawk Logix. Developed responsive frontend healthcare components, integrated complex backend data structures for claims processing, patient charting, and revenue cycle management (RCM).',
        challenge: 'Healthcare revenue cycle involves strict HIPAA compliance, multi-tiered claim denials, complex clearinghouse EDI formats, and massive data volume.',
        solution: 'Developed modular React user interfaces with optimized data tables, automated EDI validation pipelines, and integrated Cursor AI & Antigravity to accelerate test coverage and maintain robust application architecture.',
        results: 'Handled over $2.4M in medical claims processing with 99.4% first-pass acceptance rate for medical clinics.',
        category: 'Enterprise SaaS',
        tags: 'React, Node.js, Express, PostgreSQL/MySQL, Healthcare EDI, EHR/RCM',
        featured: true,
        order_index: 2,
        image_url: '/src/assets/images/project_ehr360_med_1791318788952.jpg',
        live_url: 'https://hawklogix.com/ehr360',
        github_url: 'https://github.com/husnain-nawaz/ehr360-core',
        client_name: 'Hawk Logix / Hawk Revenue Group',
        completion_date: '2026',
      },
      {
        id: 3,
        title: 'VisualStockMarket Fintech Visualization Platform',
        slug: 'visual-stock-market-fintech-platform',
        tagline: 'Real-time financial candlestick charting, ticker heatmaps, and portfolio analytics.',
        description: 'Engineered a specialized fintech visualization platform providing real-time equity market data, interactive candlestick charts, multi-asset portfolio rebalancing tools, and high-frequency UI updates.',
        challenge: 'Displaying thousands of live ticker price points without UI frame drops or memory leaks in standard browser viewports.',
        solution: 'Implemented canvas-accelerated charting with WebSocket streaming listeners, virtualized data tables, and dark-mode high contrast accessibility.',
        results: 'Achieved consistent 60 FPS rendering under heavy ticker streaming with sub-50ms chart recalculations.',
        category: 'Fintech & Visualization',
        tags: 'React, Node.js, Canvas, Financial Data, REST APIs, Tailwind CSS',
        featured: true,
        order_index: 3,
        image_url: '/src/assets/images/project_visualstock_1791318802924.jpg',
        live_url: 'https://visualstockmarket.com',
        github_url: 'https://github.com/husnain-nawaz/visualstock-fintech',
        client_name: 'VisualStock Global',
        completion_date: '2025',
      },
      {
        id: 4,
        title: 'Celestra Solutions Agency Web Platform',
        slug: 'celestra-solutions-agency-portal',
        tagline: 'Digital agency infrastructure delivering bespoke, SEO-optimized web solutions.',
        description: 'Co-founded Celestra Solutions and engineered responsive, SEO-optimized custom web platforms for diverse local and international clients. Managed full deployment lifecycles, theme/plugin engineering, and high-converting landing experiences.',
        challenge: 'Designing an agency platform that demonstrates bespoke design craft while maintaining lightning-fast 98+ Google Lighthouse scores.',
        solution: 'Crafted ultra-clean component hierarchy, automated SVG optimization, schema markup injection, and streamlined server-side caching.',
        results: 'Delivered 15+ client web platforms, driving an average 210% increase in organic client search visibility.',
        category: 'Full-Stack & Design',
        tags: 'React, WordPress, PHP/Node.js, Tailwind CSS, Technical SEO, UI/UX',
        featured: true,
        order_index: 4,
        image_url: '/src/assets/images/project_celestra_agency_1791318817750.jpg',
        live_url: 'https://celestrasolutions.com',
        github_url: 'https://github.com/husnain-nawaz/celestra-web',
        client_name: 'Celestra Solutions',
        completion_date: '2025',
      },
    ],
    blogs: [
      {
        id: 1,
        title: 'How We Scaled EHR360: Architecture of a High-Throughput Medical Billing Engine',
        slug: 'scaling-ehr360-high-throughput-medical-billing-architecture',
        excerpt: 'An inside look into designing robust healthcare data pipelines, handling clearinghouse EDI transactions, and maintaining strict uptime.',
        content: `## The Core Challenge of Healthcare Data

Medical billing applications are notoriously unforgiving. Unlike standard e-commerce carts, every transaction in an **Electronic Health Record (EHR)** ecosystem must adhere to rigorous validation standards, clearinghouse EDI specifications, and HIPAA-compliant data segregation.

When building EHR360 at Hawk Logix, our engineering goal was simple yet ambitious: create a resilient full-stack architecture capable of processing thousands of daily claim filings with sub-second feedback for billers and administrators.

### 1. Decoupling the Claims Validation Pipeline

Rather than performing synchronous EDI parsing on the primary HTTP request thread, we decoupled our ingestion pipeline. The React frontend submits structured claim payloads to an Express micro-router, which pushes jobs into a validated queue.

\`\`\`javascript
// Architectural Ingestion Pattern
const validateClaimPayload = (payload) => {
  const { patientId, providerNpi, cptCodes, icd10Codes, billingAmount } = payload;
  if (!patientId || !providerNpi || !cptCodes?.length) {
    throw new Error('Invalid claim specification');
  }
  return true;
};
\`\`\`

### 2. High-Performance Front-End Data Grids

Billers routinely audit hundreds of patient encounters in a single view. By pairing React virtualized tables with memoized cell renderers, we reduced DOM node footprint from 24,000 elements to under 300 visible nodes, maintaining a fluid 60 FPS scrolling experience.

### 3. Leveraging AI Accelerators

Using modern development tools like Cursor AI and Antigravity, our team accelerated unit test authoring and invariant boundary verification, cutting regression debugging cycles by over 35%.

### Key Takeaway

A successful enterprise healthcare system is built on predictable state machines, immutable audit trails, and human-centric UI ergonomics. By putting clinician workflows first, software can directly reduce administrative burnout.`,
        featured_image: '/src/assets/images/project_ehr360_med_1791318788952.jpg',
        category: 'Engineering',
        tags: 'Full-Stack, React, Express, Healthcare, Architecture',
        status: 'published',
        read_time: '6 min read',
        focus_keyword: 'medical billing architecture',
        meta_title: 'Architecting a High-Throughput Medical Billing Engine | EHR360',
        meta_description: 'Learn how we engineered EHR360: a high-throughput medical billing architecture using React, Express, and resilient data processing pipelines.',
        canonical_url: 'https://husnainnawaz.dev/blog/scaling-ehr360-high-throughput-medical-billing-architecture',
        rank_math_score: 94,
        schema_type: 'BlogPosting',
        is_indexable: true,
        views_count: 342,
        published_at: new Date('2026-08-15').toISOString(),
      },
      {
        id: 2,
        title: 'Building Resilient Point-of-Sale (POS) Web Apps with React & Node.js',
        slug: 'building-resilient-point-of-sale-pos-react-nodejs',
        excerpt: 'Lessons learned from architecting the Nom Nosh restaurant infrastructure: offline caching, sub-second ticket printing, and real-time inventory.',
        content: `## Why POS Systems Need Extreme Reliability

When a busy restaurant is operating at peak dinner rush, network hiccups cannot stop servers from firing table orders to the kitchen line. For **Nom Nosh Restaurant Infrastructure**, our primary requirement was uninterrupted operations under any connectivity conditions.

### 1. Offline-First Architecture

Using browser-side IndexedDB caching paired with idempotent queue synchronization, servers can punch orders, print kitchen chits, and generate receipts even if the external ISP connection drops. Once connectivity resumes, the Express backend synchronizes the delta state atomically.

### 2. Sub-Second Touchscreen UX

Touchscreen terminals require generous touch targets (minimum 48px), immediate auditory/haptic feedback, and zero cognitive friction. We engineered the entire order workflow to require at most two taps to fire an appetizer or beverage ticket.

### 3. Database Integrity & Inventory Deductions

Using strict transaction isolation in MySQL and atomic decrement operations, inventory levels remain mathematically exact across simultaneous server stations.

\`\`\`sql
-- Atomic stock decrement preventing overselling
UPDATE menu_items 
SET inventory_count = inventory_count - 1 
WHERE item_id = 42 AND inventory_count > 0;
\`\`\`

### Summary

Building Point-of-Sale software is a masterclass in latency discipline and offline fault tolerance. Combining React on the front end with Express on the back end provides both aesthetic agility and rock-solid stability.`,
        featured_image: '/src/assets/images/project_nom_nosh_1791318773177.jpg',
        category: 'Architecture',
        tags: 'React, Node.js, POS, Systems, Database',
        status: 'published',
        read_time: '5 min read',
        focus_keyword: 'point-of-sale react nodejs',
        meta_title: 'Building Resilient Point-of-Sale Systems with React & Node.js',
        meta_description: 'Discover how to architect an offline-resilient point-of-sale POS system using React and Node.js with sub-second order workflows and inventory sync.',
        canonical_url: 'https://husnainnawaz.dev/blog/building-resilient-point-of-sale-pos-react-nodejs',
        rank_math_score: 91,
        schema_type: 'BlogPosting',
        is_indexable: true,
        views_count: 289,
        published_at: new Date('2026-07-20').toISOString(),
      },
      {
        id: 3,
        title: 'Mastering Rank Math SEO & Google Search Discoverability for React SPAs',
        slug: 'mastering-rank-math-seo-google-discoverability-react',
        excerpt: 'How to achieve 100/100 Rank Math scores, automated Schema.org structured data, and high Google SERP rankings with single-page applications.',
        content: `## The SEO Dilemma of Modern Web Applications

Single-page applications (SPAs) built with React are phenomenal for user experience, but historically suffered in search indexation if dynamic meta tags, canonical URLs, and schema payloads were neglected.

In this deep dive, we break down how to implement **Rank Math SEO** methodology directly into custom Node.js and React stacks.

### 1. The Core Rank Math Scoring Pillars

Rank Math evaluates pages against specific algorithmic signals:
1. **Focus Keyword in Title & Permalinks**: Google indexes exact matches in high-weight positions.
2. **Meta Description Optimization**: 120-160 characters designed to maximize search snippet Click-Through-Rate (CTR).
3. **Keyword Density without Stuffing**: Keeping keyword distribution between 1.0% and 2.5% across your body text.
4. **Structured JSON-LD Schema**: Declaring \`BlogPosting\`, \`Person\`, or \`CreativeWork\` entities so Google displays rich breadcrumbs, author cards, and carousels.

### 2. Automated SERP Snippet Preview

Our custom CMS dashboard features a real-time Google search simulator that mimics desktop and mobile SERPs, calculating live pixel widths and highlighting keyword occurrences before you hit publish.

### 3. Server-Generated Sitemaps and Robots.txt

Always serve your \`/sitemap.xml\` dynamically from your Express backend, updating \`<lastmod>\` timestamps whenever an article or project changes. This ensures Googlebot discovers your latest content within hours of publication.

\`\`\`javascript
// Dynamic Sitemap Priority Entry
{ loc: '/blog/my-new-post', priority: '0.9', changefreq: 'weekly' }
\`\`\`

By baking automated SEO audits into your content creation workflow, your portfolio and technical articles can outrank generic medium posts and dominate Google search results.`,
        featured_image: '/src/assets/images/project_visualstock_1791318802924.jpg',
        category: 'SEO & Growth',
        tags: 'Rank Math, Technical SEO, React, Google Search, Content',
        status: 'published',
        read_time: '7 min read',
        focus_keyword: 'rank math seo react',
        meta_title: 'Mastering Rank Math SEO & Google Discoverability for React Apps',
        meta_description: 'Learn how to implement Rank Math SEO scoring, Schema.org structured data, and Google SERP snippets inside modern React and Express applications.',
        canonical_url: 'https://husnainnawaz.dev/blog/mastering-rank-math-seo-google-discoverability-react',
        rank_math_score: 96,
        schema_type: 'BlogPosting',
        is_indexable: true,
        views_count: 412,
        published_at: new Date('2026-06-10').toISOString(),
      },
    ],
    skills: [
      { id: 1, name: 'JavaScript / ESNext', category: 'Languages & Frameworks', proficiency: 95, icon_name: 'Code', experience_years: '4+ yrs', order_index: 1 },
      { id: 2, name: 'React.js', category: 'Languages & Frameworks', proficiency: 96, icon_name: 'Atom', experience_years: '3+ yrs', order_index: 2 },
      { id: 3, name: 'Node.js & Express.js', category: 'Languages & Frameworks', proficiency: 92, icon_name: 'Server', experience_years: '3+ yrs', order_index: 3 },
      { id: 4, name: 'MySQL & PostgreSQL', category: 'Languages & Frameworks', proficiency: 90, icon_name: 'Database', experience_years: '3+ yrs', order_index: 4 },
      { id: 5, name: 'Tailwind CSS', category: 'Languages & Frameworks', proficiency: 98, icon_name: 'Palette', experience_years: '3+ yrs', order_index: 5 },
      { id: 6, name: 'C++ & OOP Concepts', category: 'Languages & Frameworks', proficiency: 85, icon_name: 'Cpu', experience_years: '3+ yrs', order_index: 6 },
      { id: 7, name: 'HTML5 & Modern CSS3', category: 'Languages & Frameworks', proficiency: 98, icon_name: 'FileCode', experience_years: '4+ yrs', order_index: 7 },
      { id: 8, name: 'EHR & RCM Healthcare Systems', category: 'Platforms & Systems', proficiency: 94, icon_name: 'Activity', experience_years: '2+ yrs', order_index: 8 },
      { id: 9, name: 'Point of Sale (POS) Systems', category: 'Platforms & Systems', proficiency: 92, icon_name: 'ShoppingBag', experience_years: '2+ yrs', order_index: 9 },
      { id: 10, name: 'WordPress Development', category: 'Platforms & Systems', proficiency: 95, icon_name: 'Globe', experience_years: '3+ yrs', order_index: 10 },
      { id: 11, name: 'Cursor AI & Antigravity', category: 'Daily Dev Tools', proficiency: 96, icon_name: 'Sparkles', experience_years: 'Daily', order_index: 11 },
      { id: 12, name: 'Git & GitHub Workflows', category: 'Daily Dev Tools', proficiency: 94, icon_name: 'GitBranch', experience_years: '4+ yrs', order_index: 12 },
      { id: 13, name: 'Jira & Agile Workflows', category: 'Daily Dev Tools', proficiency: 90, icon_name: 'CheckSquare', experience_years: '2+ yrs', order_index: 13 },
      { id: 14, name: 'Design Thinking & Wireframing', category: 'Design & Architecture', proficiency: 92, icon_name: 'Layers', experience_years: '3+ yrs', order_index: 14 },
      { id: 15, name: 'REST APIs & Web Services', category: 'Design & Architecture', proficiency: 95, icon_name: 'Share2', experience_years: '3+ yrs', order_index: 15 },
      { id: 16, name: 'Infrastructure Deployment & Hostinger', category: 'Design & Architecture', proficiency: 88, icon_name: 'Cloud', experience_years: '2+ yrs', order_index: 16 },
    ],
    experiences: [
      {
        id: 1,
        role: 'Jr. Full-Stack Developer',
        company: 'Hawk Logix (Software House)',
        location: 'Lahore, Pakistan',
        period: 'May 2026 – Aug 2026',
        type: 'work',
        description: 'Contributed as a core developer on EHR360, Hawk Logix flagship medical billing and Electronic Health Records software.',
        bullets_json: [
          'Contributed as a core developer on EHR360, flagship medical billing and Electronic Health Records software.',
          'Leveraged Cursor AI and Antigravity on a daily basis to accelerate code generation, optimize debugging, and maintain robust application architecture.',
          'Developed responsive front-end components and integrated complex backend data structures for healthcare processing.',
          'Collaborated within an Agile environment using Jira to design, debug, and push scalable production code on strict schedules.',
        ],
        order_index: 1,
      },
      {
        id: 2,
        role: 'Junior Medical Billing & AR Executive',
        company: 'Hawk Revenue Group',
        location: 'Lahore, Pakistan',
        period: '2025 – 2026',
        type: 'work',
        description: 'Managed end-to-end Revenue Cycle Management (RCM) processes including accurate claims submission, payment posting, and billing adjustments.',
        bullets_json: [
          'Managed end-to-end Revenue Cycle Management (RCM) processes including accurate claims submission, payment posting, and billing adjustments.',
          'Handled Accounts Receivable follow-ups, claim denials, appeals, and continuous insurance communications to ensure timely reimbursements.',
        ],
        order_index: 2,
      },
      {
        id: 3,
        role: 'WordPress Developer & Co-Founder',
        company: 'Celestra Solutions',
        location: 'Lahore, Pakistan',
        period: '2024 – 2025',
        type: 'work',
        description: 'Co-founded the agency, engineering responsive and SEO-optimized custom web solutions for diverse local and international clients.',
        bullets_json: [
          'Co-founded the agency, engineering responsive and SEO-optimized custom web solutions for diverse local and international clients.',
          'Managed complete deployment lifecycles, theme/plugin customization, site optimization, and client requirement gathering.',
        ],
        order_index: 3,
      },
      {
        id: 4,
        role: 'WordPress Developer Intern',
        company: 'WebsGuru',
        location: 'Lahore, Pakistan',
        period: '2023 – 2024',
        type: 'work',
        description: 'Acquired hands-on experience in website creation, styling, troubleshooting, and UI/UX best practices.',
        bullets_json: [
          'Acquired hands-on experience in website creation, styling, troubleshooting, and UI/UX best practices.',
        ],
        order_index: 4,
      },
      {
        id: 5,
        role: 'BS in Computer Science (BSCS)',
        company: 'University of Sahiwal',
        location: 'Sahiwal, Pakistan',
        period: '2020 – 2024',
        type: 'education',
        description: 'Graduated with strong foundations in Data Structures, Algorithms, OOP, Database Systems, Software Engineering, and Web Technologies.',
        bullets_json: [
          'Graduated with BS in Computer Science (BSCS).',
          'Coursework: Advanced Database Systems, Object-Oriented Programming (C++), Web Engineering, Distributed Systems, Software Architecture.',
        ],
        order_index: 5,
      },
      {
        id: 6,
        role: 'F.Sc Pre-Engineering',
        company: 'BISE Sahiwal',
        location: 'Sahiwal, Pakistan',
        period: '2017 – 2019',
        type: 'education',
        description: 'Higher Secondary School Certificate in Pre-Engineering with focus on Mathematics, Physics, and analytical problem-solving.',
        bullets_json: [
          'Completed Pre-Engineering board examinations with excellence in Higher Mathematics and Physics.',
        ],
        order_index: 6,
      },
      {
        id: 7,
        role: 'Professional Certifications',
        company: 'Global Institutions (Udemy, Meta, Amal Academy, UPenn)',
        location: 'Online / Pakistan',
        period: '2022 – 2026',
        type: 'certification',
        description: 'Industry-recognized credentials in Full-Stack Engineering, Career Leadership, and Digital Strategy.',
        bullets_json: [
          'Full Stack Web Development (Udemy) – React, Node.js, Express, MySQL',
          'Amal Fellowship (Amal Academy / Stanford) – Professional leadership & communication',
          'Social Media Marketing (Meta) – Digital growth & audience acquisition',
          'English for Career Development (University of Pennsylvania)',
        ],
        order_index: 7,
      },
    ],
    messages: [
      {
        id: 1,
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@healthflow.io',
        subject: 'Inquiry regarding healthcare EHR billing consultation',
        message: 'Hello Husnain, we saw your work on EHR360 and would like to consult on optimizing our claims pipeline. Are you available for contract full-stack architecture work?',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ],
  };
}

function readStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local JSON store:', err);
  }
  return null;
}

function writeStore(data) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local JSON store:', err);
  }
}

export async function initDatabase() {
  if (!fs.existsSync(STORE_PATH)) {
    const initial = await getInitialStore();
    writeStore(initial);
  }

  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const database = process.env.MYSQL_DATABASE;
  const password = process.env.MYSQL_PASSWORD;
  const port = parseInt(process.env.MYSQL_PORT || '3306', 10);

  if (user && database) {
    try {
      mysqlPool = mysql.createPool({
        host: host || 'localhost',
        port,
        user,
        password: password || '',
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true
      });

      const connection = await mysqlPool.getConnection();
      
      try {
        const schemaPath = path.resolve(process.cwd(), 'database/schema.sql');
        if (fs.existsSync(schemaPath)) {
          const schemaSql = fs.readFileSync(schemaPath, 'utf8');
          await connection.query(schemaSql);
          console.log('✅ Auto-created/verified MySQL tables from schema.sql');
        }
      } catch (schemaErr) {
        console.error('⚠️ Could not run schema.sql (tables might already exist or syntax error):', schemaErr.message);
      }

      connection.release();
      isUsingMySQL = true;
      mysqlError = null;
      console.log('✅ Connected successfully to MySQL database:', database);
    } catch (err) {
      console.warn('⚠️ MySQL connection inactive, using reliable local JSON store:', err.message);
      isUsingMySQL = false;
      mysqlError = err.message;
    }
  } else {
    isUsingMySQL = false;
    mysqlError = 'MySQL credentials not fully configured in .env. Using robust local store.';
  }
}

// Admin
export async function getAdminByUsername(username) {
  if (isUsingMySQL && mysqlPool) {
    try {
      const [rows] = await mysqlPool.query('SELECT * FROM admins WHERE username = ? LIMIT 1', [username]);
      if (rows && rows.length > 0) return rows[0];
    } catch (err) {
      console.error('MySQL query error:', err);
    }
  }

  const store = readStore();
  if (store?.admin && store.admin.username === username) {
    return store.admin;
  }
  return null;
}

export async function updateAdminCredentials(id, username, email, passwordHash) {
  const store = readStore();
  if (store?.admin) {
    store.admin.username = username;
    store.admin.email = email;
    if (passwordHash) {
      store.admin.password_hash = passwordHash;
    }
    writeStore(store);
  }

  if (isUsingMySQL && mysqlPool) {
    try {
      if (passwordHash) {
        await mysqlPool.query(
          'UPDATE admins SET username = ?, email = ?, password_hash = ? WHERE id = ?',
          [username, email, passwordHash, id]
        );
      } else {
        await mysqlPool.query(
          'UPDATE admins SET username = ?, email = ? WHERE id = ?',
          [username, email, id]
        );
      }
    } catch (err) {
      console.error('MySQL update error:', err);
    }
  }
  return true;
}

// Profile
export async function getProfile() {
  if (isUsingMySQL && mysqlPool) {
    try {
      const [rows] = await mysqlPool.query('SELECT * FROM profile_settings LIMIT 1');
      if (rows && rows.length > 0) return rows[0];
    } catch (err) {
      console.error('MySQL error:', err);
    }
  }
  const store = readStore();
  return store?.profile || {};
}

export async function updateProfile(data) {
  const store = readStore();
  store.profile = { ...store.profile, ...data };
  writeStore(store);

  if (isUsingMySQL && mysqlPool) {
    try {
      const fields = Object.keys(data).map((k) => `\`${k}\` = ?`).join(', ');
      const values = Object.values(data);
      if (fields) {
        await mysqlPool.query(`UPDATE profile_settings SET ${fields} WHERE id = 1`, values);
      }
    } catch (err) {
      console.error('MySQL update profile error:', err);
    }
  }
  return store.profile;
}

// Projects
export async function getProjects() {
  if (isUsingMySQL && mysqlPool) {
    try {
      const [rows] = await mysqlPool.query('SELECT * FROM projects ORDER BY order_index ASC, id DESC');
      if (rows && rows.length > 0) {
        return rows.map((r) => ({ ...r, featured: Boolean(r.featured) }));
      }
    } catch (err) {
      console.error('MySQL error:', err);
    }
  }
  const store = readStore();
  return store?.projects || [];
}

export async function getProjectBySlug(slug) {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function createProject(data) {
  const store = readStore();
  const nextId = (store.projects.reduce((max, p) => Math.max(max, p.id), 0) || 0) + 1;
  const newProject = {
    ...data,
    id: nextId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  store.projects.unshift(newProject);
  writeStore(store);

  if (isUsingMySQL && mysqlPool) {
    try {
      await mysqlPool.query(
        `INSERT INTO projects (title, slug, tagline, description, challenge, solution, results, category, tags, featured, order_index, image_url, live_url, github_url, client_name, completion_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newProject.title,
          newProject.slug,
          newProject.tagline,
          newProject.description,
          newProject.challenge || '',
          newProject.solution || '',
          newProject.results || '',
          newProject.category,
          newProject.tags,
          newProject.featured ? 1 : 0,
          newProject.order_index || 0,
          newProject.image_url,
          newProject.live_url || '',
          newProject.github_url || '',
          newProject.client_name || '',
          newProject.completion_date || '',
        ]
      );
    } catch (err) {
      console.error('MySQL insert project error:', err);
    }
  }

  return newProject;
}

export async function updateProject(id, data) {
  const store = readStore();
  const index = store.projects.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;

  store.projects[index] = {
    ...store.projects[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  writeStore(store);

  if (isUsingMySQL && mysqlPool) {
    try {
      const keys = Object.keys(data).filter((k) => k !== 'id');
      const setClause = keys.map((k) => `\`${k}\` = ?`).join(', ');
      const values = keys.map((k) => {
        if (k === 'featured') return data[k] ? 1 : 0;
        return data[k];
      });
      if (setClause) {
        await mysqlPool.query(`UPDATE projects SET ${setClause} WHERE id = ?`, [...values, id]);
      }
    } catch (err) {
      console.error('MySQL update project error:', err);
    }
  }

  return store.projects[index];
}

export async function deleteProject(id) {
  const store = readStore();
  store.projects = store.projects.filter((p) => p.id !== Number(id));
  writeStore(store);

  if (isUsingMySQL && mysqlPool) {
    try {
      await mysqlPool.query('DELETE FROM projects WHERE id = ?', [id]);
    } catch (err) {
      console.error('MySQL delete project error:', err);
    }
  }
  return true;
}

// Blogs
export async function getBlogs(includeDrafts = false) {
  if (isUsingMySQL && mysqlPool) {
    try {
      const query = includeDrafts
        ? 'SELECT * FROM blogs ORDER BY id DESC'
        : "SELECT * FROM blogs WHERE status = 'published' ORDER BY published_at DESC, id DESC";
      const [rows] = await mysqlPool.query(query);
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          ...r,
          is_indexable: Boolean(r.is_indexable),
        }));
      }
    } catch (err) {
      console.error('MySQL error:', err);
    }
  }

  const store = readStore();
  const list = store?.blogs || [];
  if (includeDrafts) return list;
  return list.filter((b) => b.status === 'published');
}

export async function getBlogBySlug(slug) {
  const blogs = await getBlogs(true);
  const found = blogs.find((b) => b.slug === slug);
  if (found) {
    found.views_count = (found.views_count || 0) + 1;
    const store = readStore();
    const idx = store.blogs.findIndex((b) => b.id === found.id);
    if (idx !== -1) {
      store.blogs[idx].views_count = found.views_count;
      writeStore(store);
    }
    if (isUsingMySQL && mysqlPool) {
      try {
        await mysqlPool.query('UPDATE blogs SET views_count = views_count + 1 WHERE id = ?', [found.id]);
      } catch (e) {}
    }
  }
  return found || null;
}

export async function createBlog(data) {
  const store = readStore();
  const nextId = (store.blogs.reduce((max, b) => Math.max(max, b.id), 0) || 0) + 1;
  const newBlog = {
    ...data,
    id: nextId,
    views_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: data.status === 'published' ? new Date().toISOString() : undefined,
  };
  store.blogs.unshift(newBlog);
  writeStore(store);

  if (isUsingMySQL && mysqlPool) {
    try {
      await mysqlPool.query(
        `INSERT INTO blogs (title, slug, excerpt, content, featured_image, category, tags, status, read_time, focus_keyword, meta_title, meta_description, canonical_url, rank_math_score, schema_type, is_indexable, views_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newBlog.title,
          newBlog.slug,
          newBlog.excerpt,
          newBlog.content,
          newBlog.featured_image,
          newBlog.category,
          newBlog.tags,
          newBlog.status,
          newBlog.read_time,
          newBlog.focus_keyword || '',
          newBlog.meta_title || '',
          newBlog.meta_description || '',
          newBlog.canonical_url || '',
          newBlog.rank_math_score || 80,
          newBlog.schema_type || 'BlogPosting',
          newBlog.is_indexable ? 1 : 0,
          0,
        ]
      );
    } catch (err) {
      console.error('MySQL insert blog error:', err);
    }
  }

  return newBlog;
}

export async function updateBlog(id, data) {
  const store = readStore();
  const index = store.blogs.findIndex((b) => b.id === Number(id));
  if (index === -1) return null;

  store.blogs[index] = {
    ...store.blogs[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  writeStore(store);

  if (isUsingMySQL && mysqlPool) {
    try {
      const keys = Object.keys(data).filter((k) => k !== 'id');
      const setClause = keys.map((k) => `\`${k}\` = ?`).join(', ');
      const values = keys.map((k) => {
        if (k === 'is_indexable') return data[k] ? 1 : 0;
        return data[k];
      });
      if (setClause) {
        await mysqlPool.query(`UPDATE blogs SET ${setClause} WHERE id = ?`, [...values, id]);
      }
    } catch (err) {
      console.error('MySQL update blog error:', err);
    }
  }

  return store.blogs[index];
}

export async function deleteBlog(id) {
  const store = readStore();
  store.blogs = store.blogs.filter((b) => b.id !== Number(id));
  writeStore(store);

  if (isUsingMySQL && mysqlPool) {
    try {
      await mysqlPool.query('DELETE FROM blogs WHERE id = ?', [id]);
    } catch (err) {
      console.error('MySQL delete blog error:', err);
    }
  }
  return true;
}

// Skills
export async function getSkills() {
  const store = readStore();
  return store?.skills || [];
}

export async function updateSkills(skills) {
  const store = readStore();
  store.skills = skills;
  writeStore(store);
  return store.skills;
}

// Experiences
export async function getExperiences() {
  const store = readStore();
  return store?.experiences || [];
}

export async function updateExperiences(experiences) {
  const store = readStore();
  store.experiences = experiences;
  writeStore(store);
  return store.experiences;
}

// Messages
export async function getMessages() {
  const store = readStore();
  return store?.messages || [];
}

export async function createMessage(msg) {
  const store = readStore();
  const nextId = (store.messages.reduce((max, m) => Math.max(max, m.id), 0) || 0) + 1;
  const newMsg = {
    ...msg,
    id: nextId,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  store.messages.unshift(newMsg);
  writeStore(store);
  return newMsg;
}

export async function markMessageRead(id) {
  const store = readStore();
  const found = store.messages.find((m) => m.id === Number(id));
  if (found) {
    found.is_read = true;
    writeStore(store);
    return true;
  }
  return false;
}

export async function deleteMessage(id) {
  const store = readStore();
  store.messages = store.messages.filter((m) => m.id !== Number(id));
  writeStore(store);
  return true;
}

// Status check and live MySQL test
export async function testMySQLConnection(config) {
  try {
    const testPool = mysql.createPool({
      host: config.host || 'localhost',
      port: config.port ? Number(config.port) : 3306,
      user: config.user || '',
      password: config.password || '',
      database: config.database || '',
      connectTimeout: 5000,
    });
    const conn = await testPool.getConnection();
    conn.release();
    await testPool.end();
    return { success: true, message: `Successfully connected to MySQL database "${config.database}"!` };
  } catch (err) {
    return { success: false, message: `MySQL Connection failed: ${err.message}` };
  }
}

export function getDatabaseStatus() {
  const store = readStore();
  return {
    isUsingMySQL,
    activeDriver: isUsingMySQL ? 'mysql2' : 'json_persistent_store',
    mysqlError,
    recordsCount: {
      projects: store?.projects?.length || 0,
      blogs: store?.blogs?.length || 0,
      skills: store?.skills?.length || 0,
      messages: store?.messages?.length || 0,
    },
  };
}
