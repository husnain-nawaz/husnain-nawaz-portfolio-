import React, { useState } from 'react';
import { Briefcase, GraduationCap, Award, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export default function ExperienceTimeline({ experiences }) {
  const [activeTab, setActiveTab] = useState('all');

  const workItems = experiences.filter((e) => e.type === 'work');
  const eduItems = experiences.filter((e) => e.type === 'education' || e.type === 'certification');

  return (
    <section id="experience" className="py-20 md:py-28 border-b border-zinc-800/80 bg-[#090A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
              Career Trajectory & Education
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Work Experience & Academic Credentials
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              Proven track record delivering commercial software, leading agency delivery, and building enterprise healthcare solutions.
            </p>
          </div>

          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Milestones
            </button>
            <button
              onClick={() => setActiveTab('work')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'work'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Professional Work
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'education'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Education & Certs
            </button>
          </div>
        </div>

        {/* 2-Column Split or Filtered Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Work Column */}
          {(activeTab === 'all' || activeTab === 'work') && (
            <div className={`${activeTab === 'all' ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-sm font-bold text-white uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Software Houses & Industry Experience</span>
              </div>

              <div className="relative pl-6 border-l border-zinc-800 space-y-8">
                {workItems.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Node Dot */}
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-900 border-2 border-indigo-500 group-hover:scale-125 transition-transform" />

                    {/* Metadata Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.role}
                      </h4>
                      <span className="text-xs font-mono text-zinc-400 tabular-nums">
                        {item.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-indigo-400 mb-3 font-medium">
                      <span>{item.company}</span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span className="text-zinc-400">{item.location}</span>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Bullet Highlights */}
                    {item.bullets_json && item.bullets_json.length > 0 && (
                      <ul className="space-y-1.5 pl-1">
                        {item.bullets_json.map((b, bIdx) => (
                          <li key={bIdx} className="text-xs text-zinc-400 flex items-start gap-2 leading-relaxed">
                            <span className="text-indigo-400 mt-0.5">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certs Column */}
          {(activeTab === 'all' || activeTab === 'education') && (
            <div className={`${activeTab === 'all' ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-6`}>
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-sm font-bold text-white uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Education & Credentials</span>
              </div>

              <div className="relative pl-6 border-l border-zinc-800 space-y-8">
                {eduItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-900 border-2 border-zinc-600 group-hover:border-indigo-400 group-hover:scale-125 transition-transform" />

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.role}
                      </h4>
                      <span className="text-xs font-mono text-zinc-400 tabular-nums">
                        {item.period}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-400 mb-2">
                      {item.company}
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed mb-2">
                      {item.description}
                    </p>

                    {item.bullets_json && item.bullets_json.length > 0 && (
                      <ul className="space-y-1 pl-1">
                        {item.bullets_json.map((b, bIdx) => (
                          <li key={bIdx} className="text-xs text-zinc-400 flex items-start gap-2">
                            <span className="text-emerald-400">✓</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
