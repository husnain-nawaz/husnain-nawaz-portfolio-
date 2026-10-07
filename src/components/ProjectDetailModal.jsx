import React, { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle, Calendar, Building2, Layers } from 'lucide-react';

export default function ProjectDetailModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Media */}
        <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-700/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            {/* Unboxed metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
              <span>{project.category}</span>
              <span aria-hidden="true" className="text-zinc-500">·</span>
              <span>{project.client_name || 'Independent Platform'}</span>
              <span aria-hidden="true" className="text-zinc-500">·</span>
              <span>{project.completion_date || '2026'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-base text-zinc-300 leading-relaxed">
            {project.description}
          </p>

          {/* Deep Case Study Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.challenge && (
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  The Engineering Challenge
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {project.challenge}
                </p>
              </div>
            )}

            {project.solution && (
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                  Architecture & Solution
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            )}
          </div>

          {project.results && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  Verified Real-World Results
                </h4>
                <p className="text-sm text-zinc-300">
                  {project.results}
                </p>
              </div>
            </div>
          )}

          {/* Tech Stack Unboxed Text */}
          <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300">Technologies Used:</span>{' '}
              {project.tags}
            </div>

            <div className="flex items-center gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
