import React, { useState } from 'react';
import { ArrowUpRight, Github, Sparkles, Filter } from 'lucide-react';
import ProjectDetailModal from './ProjectDetailModal.jsx';

export default function ProjectsSection({ projects }) {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['all', 'Full-Stack & Systems', 'Enterprise SaaS', 'Fintech & Visualization', 'Full-Stack & Design'];

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.category.toLowerCase().includes(filter.toLowerCase()) || filter.toLowerCase().includes(p.category.toLowerCase());
  });

  return (
    <section id="projects" className="py-20 md:py-28 border-b border-zinc-800/80 bg-[#090A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
              Featured Case Studies
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Design Systems & Production Architecture
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              From mission-critical electronic health records to high-throughput POS terminals and fintech visualization platforms.
            </p>
          </div>

          {/* Interactive Filter Tabs (Segmented control) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                  filter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {cat === 'all' ? 'All Works' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {filteredProjects.map((project, idx) => {
            const isLarge = project.featured && idx === 0;
            const colSpan = isLarge ? 'lg:col-span-8' : idx === 1 ? 'lg:col-span-4' : 'lg:col-span-6';

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`${colSpan} group cursor-pointer relative bg-zinc-900/70 hover:bg-zinc-900 rounded-2xl border border-zinc-800/80 hover:border-zinc-700/80 overflow-hidden transition-all duration-300 flex flex-col`}
              >
                {/* Visual Image Slot */}
                <div className={`relative ${isLarge ? 'aspect-[16/9]' : 'aspect-[16/10]'} w-full overflow-hidden bg-zinc-950`}>
                  <img
                    src={project.image_url}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

                  {/* Top-Right Quick Expand Icon */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900/90 text-white flex items-center justify-center border border-zinc-700/60 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-colors shadow-md">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata (Zero-Pill Rule) */}
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                      <span className="text-indigo-400 font-medium">{project.category}</span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span>{project.client_name || 'Production Web App'}</span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span>{project.completion_date || '2026'}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-zinc-300 text-sm mt-2 line-clamp-2 leading-relaxed">
                      {project.tagline || project.description}
                    </p>
                  </div>

                  {/* Bottom Tech Bar */}
                  <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                    <span className="truncate max-w-[80%] font-mono text-[11px] text-zinc-400">
                      {project.tags}
                    </span>
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform font-medium">
                      Case Study →
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
