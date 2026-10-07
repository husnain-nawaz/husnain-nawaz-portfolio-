export function analyzeRankMathSeo(data) {
  const keyword = (data.focusKeyword || '').trim().toLowerCase();
  const title = (data.title || '').trim();
  const slug = (data.slug || '').trim().toLowerCase();
  const content = (data.content || '').trim();
  const metaDesc = (data.metaDescription || '').trim();

  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  const descLower = metaDesc.toLowerCase();

  // Word count and keyword density calculation
  const words = content.replace(/<[^>]*>?/gm, ' ').split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  
  let keywordOccurrences = 0;
  if (keyword) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = contentLower.match(new RegExp(`\\b${escaped}\\b`, 'gi'));
    keywordOccurrences = matches ? matches.length : 0;
  }
  const keywordDensity = wordCount > 0 ? ((keywordOccurrences / wordCount) * 100) : 0;

  const tests = [
    // 1. Focus Keyword in Title
    {
      id: 'keyword-in-title',
      label: 'Focus Keyword in SEO Title',
      category: 'Basic SEO',
      passed: Boolean(keyword && titleLower.includes(keyword)),
      recommendation: keyword && titleLower.includes(keyword)
        ? 'Great! The focus keyword appears in the SEO title.'
        : `Add "${keyword || 'your focus keyword'}" near the beginning of your title.`,
      points: 15,
    },
    // 2. Focus Keyword in Meta Description
    {
      id: 'keyword-in-desc',
      label: 'Focus Keyword in Meta Description',
      category: 'Basic SEO',
      passed: Boolean(keyword && descLower.includes(keyword)),
      recommendation: keyword && descLower.includes(keyword)
        ? 'Awesome! The focus keyword appears in the meta description.'
        : `Ensure "${keyword || 'your keyword'}" is clearly included in the meta description snippet.`,
      points: 15,
    },
    // 3. Focus Keyword in URL Slug
    {
      id: 'keyword-in-url',
      label: 'Focus Keyword in URL Slug',
      category: 'Basic SEO',
      passed: Boolean(keyword && (slug.includes(keyword.replace(/\s+/g, '-')) || slug.includes(keyword))),
      recommendation: keyword && (slug.includes(keyword.replace(/\s+/g, '-')) || slug.includes(keyword))
        ? 'Your URL slug contains the focus keyword.'
        : 'Include your focus keyword in the permalink slug for cleaner indexation.',
      points: 10,
    },
    // 4. Focus Keyword in First 10% of Content
    {
      id: 'keyword-in-intro',
      label: 'Focus Keyword in Introduction',
      category: 'Basic SEO',
      passed: Boolean(keyword && contentLower.slice(0, 300).includes(keyword)),
      recommendation: keyword && contentLower.slice(0, 300).includes(keyword)
        ? 'Your focus keyword appears in the first 10% of the article.'
        : 'Mention the keyword in the first paragraph to establish topical relevance.',
      points: 10,
    },
    // 5. Content Length
    {
      id: 'content-length',
      label: 'Content Word Count',
      category: 'Basic SEO',
      passed: wordCount >= 400,
      recommendation: wordCount >= 600
        ? `Exceptional depth! Content has ${wordCount} words.`
        : wordCount >= 400
        ? `Good length (${wordCount} words). Recommended: 600+ words for competitive search queries.`
        : `Content is short (${wordCount} words). Aim for at least 400-600 words for strong ranking.`,
      points: wordCount >= 600 ? 15 : wordCount >= 400 ? 10 : 3,
    },
    // 6. Keyword Density
    {
      id: 'keyword-density',
      label: 'Keyword Density',
      category: 'Additional SEO',
      passed: Boolean(keyword && keywordDensity >= 0.8 && keywordDensity <= 3.0),
      recommendation: keywordDensity >= 0.8 && keywordDensity <= 3.0
        ? `Optimal keyword density of ${keywordDensity.toFixed(2)}% (${keywordOccurrences} mentions).`
        : keywordDensity > 3.0
        ? `Keyword density is high (${keywordDensity.toFixed(2)}%). Avoid keyword stuffing.`
        : `Keyword density is low (${keywordDensity.toFixed(2)}%). Mention the keyword naturally a few more times.`,
      points: 10,
    },
    // 7. Title Length (Optimal 30-65 characters)
    {
      id: 'title-length',
      label: 'SEO Title Length',
      category: 'Title Readability',
      passed: title.length >= 30 && title.length <= 65,
      recommendation: title.length >= 30 && title.length <= 65
        ? `Perfect title length (${title.length} characters).`
        : title.length < 30
        ? `Title is too brief (${title.length} chars). Target 35–60 characters to maximize SERP CTR.`
        : `Title is too long (${title.length} chars). It may be truncated in Google search snippets.`,
      points: 10,
    },
    // 8. Meta Description Length (Optimal 110-165 characters)
    {
      id: 'desc-length',
      label: 'Meta Description Length',
      category: 'Title Readability',
      passed: metaDesc.length >= 110 && metaDesc.length <= 165,
      recommendation: metaDesc.length >= 110 && metaDesc.length <= 165
        ? `Meta description length is ideal (${metaDesc.length} characters).`
        : metaDesc.length < 110
        ? `Meta description is short (${metaDesc.length} chars). Expand to 120-160 characters.`
        : `Meta description is long (${metaDesc.length} chars). May be cut off on mobile devices.`,
      points: 10,
    },
    // 9. Heading Structure & Readability (Check for H2, H3 or markdown)
    {
      id: 'heading-structure',
      label: 'Subheadings and Content Structure',
      category: 'Content Readability',
      passed: Boolean(content.includes('##') || content.includes('<h2') || content.includes('###')),
      recommendation: content.includes('##') || content.includes('<h2')
        ? 'Great! The article uses subheadings (H2/H3) for easy reading.'
        : 'Use Markdown subheadings (## Section Title) to break up paragraphs for readers and Google crawlers.',
      points: 5,
    },
  ];

  let passedScore = 0;
  for (const t of tests) {
    if (t.passed) {
      passedScore += t.points;
    }
  }

  const score = Math.min(100, Math.max(10, Math.round(passedScore)));

  let grade = 'Needs Improvement';
  if (score >= 80) grade = 'Great';
  else if (score >= 65) grade = 'Good';
  else if (score >= 45) grade = 'Needs Improvement';
  else grade = 'Poor';

  return {
    score,
    grade,
    wordCount,
    keywordOccurrences,
    keywordDensity: Number(keywordDensity.toFixed(2)),
    tests,
  };
}

export function generateSitemapXml(baseUrl, blogs = [], projects = []) {
  const currentDate = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: `${baseUrl}/`, lastmod: currentDate, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/#about`, lastmod: currentDate, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/#skills`, lastmod: currentDate, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/#projects`, lastmod: currentDate, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/#experience`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/#blog`, lastmod: currentDate, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/#contact`, lastmod: currentDate, changefreq: 'monthly', priority: '0.6' },
  ];

  for (const blog of blogs) {
    urls.push({
      loc: `${baseUrl}/blog/${blog.slug}`,
      lastmod: blog.updated_at ? new Date(blog.updated_at).toISOString().split('T')[0] : currentDate,
      changefreq: 'weekly',
      priority: '0.85',
    });
  }

  for (const project of projects) {
    urls.push({
      loc: `${baseUrl}/project/${project.slug}`,
      lastmod: project.updated_at ? new Date(project.updated_at).toISOString().split('T')[0] : currentDate,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
  xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

  for (const u of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${u.loc}</loc>\n`;
    xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}
