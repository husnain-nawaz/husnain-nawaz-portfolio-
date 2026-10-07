import React from 'react';
import { 
  Code, Atom, Server, Database, Palette, Cpu, 
  Activity, ShoppingBag, Globe, Sparkles, GitBranch, 
  CheckSquare, Layers, Share2, Cloud, Check 
} from 'lucide-react';

const iconMap = {
  Code, Atom, Server, Database, Palette, Cpu, 
  Activity, ShoppingBag, Globe, Sparkles, GitBranch, 
  CheckSquare, Layers, Share2, Cloud
};

export default function SkillsSection({ skills }) {
  // Group by category
  const categories = [
    'Languages & Frameworks',
    'Platforms & Systems',
    'Daily Dev Tools',
    'Design & Architecture'
  ];

  return (
    <section id="skills" className="py-20 md:py-28 border-b border-zinc-800/80 bg-[#090A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
            Technical Stack & Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered for Scalability, Speed & Precision
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Hands-on expertise across modern full-stack architectures, healthcare EHR pipelines, rapid AI developer workflows, and responsive UI engineering.
          </p>
        </div>

        {/* 4 Category Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((catTitle, idx) => {
            const catSkills = skills.filter((s) => s.category.toLowerCase() === catTitle.toLowerCase());

            return (
              <div 
                key={catTitle}
                className="bg-zinc-900/50 rounded-2xl border border-zinc-800/80 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-zinc-400 mb-1">0{idx + 1}</div>
                  <h3 className="text-lg font-bold text-white mb-6 border-b border-zinc-800 pb-3">
                    {catTitle}
                  </h3>

                  <div className="space-y-4">
                    {catSkills.map((skill) => {
                      const IconComponent = iconMap[skill.icon_name] || Code;
                      return (
                        <div key={skill.id} className="group">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-medium text-zinc-200 group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                              <IconComponent className="w-3.5 h-3.5 text-indigo-400" />
                              {skill.name}
                            </span>
                            <span className="text-zinc-400 font-mono tabular-nums text-[11px]">
                              {skill.experience_years}
                            </span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-all duration-500"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800/60 text-[11px] text-zinc-400">
                  {catSkills.length} Verified Proficiencies
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
