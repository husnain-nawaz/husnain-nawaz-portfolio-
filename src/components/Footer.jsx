import React from 'react';
import { Github, Linkedin, Mail, Shield, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenAdmin }) {
  return (
    <footer className="py-12 bg-[#06070a] border-t border-zinc-900 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Attribution */}
          <div className="text-center md:text-left">
            <div className="text-sm font-bold text-zinc-300">
              Husnain Nawaz
            </div>
            <div className="mt-1">
              Full-Stack Developer & UI/UX Engineer · Lahore, Pakistan
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-400">
            <a href="/sitemap.xml" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
              <span>Sitemap.xml</span>
              <ExternalLink className="w-3 h-3 text-zinc-600" />
            </a>
            <a href="/robots.txt" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
              <span>Robots.txt</span>
              <ExternalLink className="w-3 h-3 text-zinc-600" />
            </a>
            <button
              onClick={onOpenAdmin}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1 font-medium"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin CMS Portal</span>
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-zinc-400">
            <a
              href="https://github.com/husnain-nawaz"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/husnain-nawaz"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:chhusnain2345@gmail.com"
              className="hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-zinc-900/80 text-center text-[11px] text-zinc-600">
          © {new Date().getFullYear()} Husnain Nawaz. Built with React JS, Express JS, and MySQL Hostinger Ready Architecture.
        </div>
      </div>
    </footer>
  );
}
