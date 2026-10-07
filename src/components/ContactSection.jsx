import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export default function ContactSection({ profile }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      setFeedback('Please fill out all required fields.');
      return;
    }

    try {
      setStatus('submitting');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setFeedback('Thank you for reaching out! Your message was received and I will reply shortly.');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to deliver message.');
      }
    } catch (err) {
      setStatus('error');
      setFeedback('Network error. Please try again or email directly.');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 border-b border-zinc-800/80 bg-[#090A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Inquiries Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
                Initiate Collaboration
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Let's Build Something Exceptional Together
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base mt-3 leading-relaxed">
                Whether you need a high-performance full-stack web application, an enterprise healthcare solution, or custom Point of Sale architecture, let's discuss your project.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <a
                href={`mailto:${profile?.email || 'chhusnain2345@gmail.com'}`}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center border border-indigo-800/40 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-medium">Direct Email</div>
                  <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {profile?.email || 'chhusnain2345@gmail.com'}
                  </div>
                </div>
              </a>

              <a
                href={`tel:${profile?.phone?.replace(/\s+/g, '') || '+923099694193'}`}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center border border-zinc-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-medium">Phone & WhatsApp</div>
                  <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {profile?.phone || '+92 309 9694193'}
                  </div>
                </div>
              </a>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center border border-zinc-700 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-medium">Base Location</div>
                  <div className="text-sm font-semibold text-white">
                    {profile?.location || 'Lahore, Pakistan'}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Quick WhatsApp Button */}
            {profile?.whatsapp_url && (
              <div>
                <a
                  href={profile.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Send a Message</h3>
              <p className="text-xs text-zinc-400 mb-6">
                All submissions are stored securely in the database and monitored via the Admin CMS Dashboard.
              </p>

              {status === 'success' ? (
                <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Message Delivered</h4>
                  <p className="text-xs text-emerald-300">{feedback}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-2 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/50 flex items-center gap-2 text-xs text-red-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{feedback}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Your Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Subject / Project Scope
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g. Healthcare EHR Web App Development"
                      className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Your Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your project goals, timelines, or requirements..."
                      className="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>{status === 'submitting' ? 'Sending Message...' : 'Send Message Now'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
