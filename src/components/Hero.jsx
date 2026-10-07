import React from 'react';
import { ArrowDown, Github, Linkedin, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function Hero({ profile }) {
  const scrollToProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-zinc-800/80 overflow-hidden">
      {/* Subtle radial ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial & Typographic Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed Metadata Kicker (Zero-Pill Rule) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for Full-Stack & Engineering Roles
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                {profile?.location || 'Lahore, Pakistan'}
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>CS Graduate (University of Sahiwal)</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Full-Stack Developer <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">
                & UI/UX Engineer
              </span>
            </h1>

            {/* Bio Prose */}
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
              {profile?.bio ||
                'Versatile Computer Science graduate with hands-on professional experience building web applications, custom platforms, and enterprise digital infrastructure. Proven track record in full-stack web development, utilizing advanced AI tools, and delivering high-performance medical billing software solutions.'}
            </p>

            {/* Resume Core Highlights Adjacency */}
            <div className="grid grid-cols-3 gap-4 pt-2 pb-2 border-y border-zinc-800/80">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {profile?.years_experience || 3}+
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {profile?.projects_completed || 24}+
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Projects Deployed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono tabular-nums">
                  EHR360
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Flagship Medical Billing</div>
              </div>
            </div>

            {/* CTAs and Social Links */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                onClick={scrollToProjects}
                className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-600/20 inline-flex items-center gap-2"
              >
                <span>View Featured Projects</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                onClick={scrollToContact}
                className="px-5 py-3 text-sm font-medium text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg transition-colors"
              >
                Contact Husnain
              </a>

              <div className="flex items-center gap-2 pl-2">
                <a
                  href={profile?.github_url || 'https://github.com/husnain-nawaz'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={profile?.linkedin_url || 'https://linkedin.com/in/husnain-nawaz'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${profile?.email || 'chhusnain2345@gmail.com'}`}
                  className="p-2.5 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
                  aria-label="Email Husnain"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Frame & Portrait Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Outer Framing Container */}
              <div className="relative rounded-2xl p-2 bg-gradient-to-b from-zinc-700/50 via-zinc-800/20 to-zinc-900/60 border border-zinc-800 shadow-2xl backdrop-blur-sm">
                
                {/* Visual Asset Container */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-950">
                  <img
                    src={profile?.avatar_url || '/src/assets/images/husnain_portrait_1791318756469.jpg'}
                    alt="Husnain Nawaz - Full-Stack Developer & UI/UX Engineer"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter contrast-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  
                  {/* Bottom Portrait Caption Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-sm font-semibold tracking-tight">Husnain Nawaz</div>
                    <div className="flex items-center gap-2 text-xs text-zinc-300 mt-0.5">
                      <span>React & Node.js</span>
                      <span aria-hidden="true">·</span>
                      <span>Express & MySQL</span>
                      <span aria-hidden="true">·</span>
                      <span>Rank Math SEO</span>
                    </div>
                  </div>
                </div>

                {/* Proof Badge Below Media */}
                <div className="mt-3 px-3 py-2.5 bg-zinc-900/90 rounded-lg border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Specialized in Medical EHR & Point of Sale Systems</span>
                  </div>
                  <span className="font-mono text-zinc-400 text-[11px]">BSCS '24</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
