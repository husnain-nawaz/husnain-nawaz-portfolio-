import React, { useEffect } from 'react';
import { X, Calendar, Clock, Share2, Tag, ArrowLeft, Check, Sparkles } from 'lucide-react';

export default function BlogPostModal({ blog, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!blog) return null;

  // Simple clean markdown parser for headings, code blocks, bold, lists
  const renderFormattedContent = (content) => {
    const lines = (content || '').split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-lg font-bold text-white mt-6 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-xl sm:text-2xl font-bold text-white mt-8 mb-3 border-b border-zinc-800 pb-2">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold text-white mt-8 mb-4">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('```')) {
        return null; // Handle code blocks below or simple representation
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="text-zinc-300 ml-4 list-disc text-sm sm:text-base my-1">
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-3" />;
      }
      return (
        <p key={idx} className="text-zinc-300 text-sm sm:text-base leading-relaxed my-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with back button & close */}
        <div className="p-4 sm:px-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Rank Math Score Indicator */}
            {blog.rank_math_score && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rank Math: {blog.rank_math_score}/100</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Image Banner */}
        <div className="relative aspect-[21/9] w-full bg-zinc-950 overflow-hidden">
          <img
            src={blog.featured_image}
            alt={blog.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        </div>

        {/* Article Header & Prose */}
        <div className="p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            <span className="text-indigo-400 font-semibold">{blog.category}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {blog.read_time || '5 min read'}
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>Focus Keyword: <strong className="text-zinc-200">{blog.focus_keyword}</strong></span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-zinc-300 italic">
            "{blog.excerpt}"
          </div>

          {/* Formatted Content */}
          <div className="prose prose-invert max-w-none space-y-3">
            {renderFormattedContent(blog.content)}
          </div>

          {/* SEO SERP Snippet Box */}
          <div className="pt-8 border-t border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Google Search Snippet (Simulated)
            </h4>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-sans">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1 truncate mb-1">
                <span>https://husnainnawaz.dev</span>
                <span>›</span>
                <span>blog</span>
                <span>›</span>
                <span className="text-zinc-300">{blog.slug}</span>
              </div>
              <div className="text-base text-blue-400 font-medium hover:underline cursor-pointer truncate">
                {blog.meta_title || blog.title}
              </div>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {blog.meta_description || blog.excerpt}
              </p>
            </div>
          </div>

          {/* Author Footnote */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <div>
              Written by <strong className="text-white">Husnain Nawaz</strong> · Full-Stack Engineer & Designer
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.origin + `/blog/${blog.slug}`);
                alert('Article permalink copied to clipboard!');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
