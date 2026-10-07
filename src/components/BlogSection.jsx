import React, { useState } from 'react';
import { Sparkles, Clock, ArrowUpRight, Search, CheckCircle2 } from 'lucide-react';
import BlogPostModal from './BlogPostModal.jsx';

export default function BlogSection({ blogs }) {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', 'Engineering', 'Architecture', 'SEO & Growth'];

  const filteredBlogs = blogs.filter((b) => {
    if (activeCategory === 'all') return true;
    return b.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <section id="blog" className="py-20 md:py-28 border-b border-zinc-800/80 bg-[#090A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-3" />
              <span>Rank Math SEO-Driven Technical Writing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineering Insights & Search-Optimized Articles
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              In-depth articles engineered for developer ergonomics and Google search visibility with automated Rank Math algorithmic scoring.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Posts' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-in-a-row Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => {
            const score = blog.rank_math_score || 85;
            const scoreColor = score >= 90 ? 'text-emerald-400 border-emerald-800/50 bg-emerald-950/40' : 'text-amber-400 border-amber-800/50 bg-amber-950/40';

            return (
              <article
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="group cursor-pointer bg-zinc-900/60 hover:bg-zinc-900 rounded-2xl border border-zinc-800/80 hover:border-zinc-700/80 overflow-hidden flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

                    {/* Rank Math Floating Score Badge */}
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold border backdrop-blur-md ${scoreColor} flex items-center gap-1`}>
                      <span className="font-mono">{score}/100</span>
                      <span className="text-[10px] text-zinc-300">SEO</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    {/* Unboxed Metadata */}
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                      <span className="text-indigo-400 font-medium">{blog.category}</span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span className="flex items-center gap-1 text-zinc-400">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {blog.read_time || '5 min read'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-zinc-300 text-xs sm:text-sm mt-3 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer with Focus Keyword */}
                <div className="px-6 py-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <div className="truncate max-w-[70%]">
                    <span className="text-zinc-500">Keyword:</span>{' '}
                    <span className="text-zinc-300 font-medium">{blog.focus_keyword || 'SEO'}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>Read</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </article>
            );
          })}
        </div>

      </div>

      {/* Blog Article Reader Modal */}
      {selectedBlog && (
        <BlogPostModal
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      )}
    </section>
  );
}
