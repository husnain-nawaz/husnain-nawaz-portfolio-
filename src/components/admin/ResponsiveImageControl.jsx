import React, { useState } from 'react';
import { 
  Monitor, Smartphone, Tablet, Image as ImageIcon, 
  ExternalLink, Check, AlertCircle, RefreshCw, Sparkles, Copy 
} from 'lucide-react';

export const SYSTEM_IMAGE_PRESETS = [
  {
    name: 'Husnain Portrait',
    category: 'Avatar & Profile',
    url: '/src/assets/images/husnain_portrait_1791318756469.jpg',
    description: 'Studio headshot portrait of Husnain Nawaz in navy shirt',
  },
  {
    name: 'Nom Nosh POS Terminal',
    category: 'Project',
    url: '/src/assets/images/project_nom_nosh_1791318773177.jpg',
    description: 'Restaurant point-of-sale touchscreen & kitchen ticketing',
  },
  {
    name: 'EHR360 Medical Billing',
    category: 'Project',
    url: '/src/assets/images/project_ehr360_med_1791318788952.jpg',
    description: 'Healthcare SaaS dashboard & revenue cycle charts',
  },
  {
    name: 'VisualStock Fintech',
    category: 'Project',
    url: '/src/assets/images/project_visualstock_1791318802924.jpg',
    description: 'Candlestick trading terminal & financial analytics',
  },
  {
    name: 'Celestra Solutions',
    category: 'Project',
    url: '/src/assets/images/project_celestra_agency_1791318817750.jpg',
    description: 'Modern digital agency website & responsive branding',
  },
];

export default function ResponsiveImageControl({
  label = 'Image URL',
  value = '',
  onChange,
  placeholder = 'Enter image URL (e.g. /uploads/photo.jpg or https://...)',
  aspectRatio = '16:9', // '16:9', '4:3', '1:1', '21:9'
  isAvatar = false,
  helpText = 'Supports local paths (/src/assets/...) or live HTTPS URLs (Hostinger, Cloudinary, Imgur).',
}) {
  const [deviceView, setDeviceView] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [fitMode, setFitMode] = useState('cover'); // 'cover' | 'contain'
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (value) {
      navigator.clipboard?.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getContainerClasses = () => {
    if (isAvatar) {
      if (deviceView === 'mobile') return 'w-24 h-24 rounded-full mx-auto';
      if (deviceView === 'tablet') return 'w-36 h-36 rounded-2xl mx-auto';
      return 'w-48 h-48 rounded-2xl mx-auto';
    }

    if (deviceView === 'mobile') {
      return 'w-full max-w-[280px] aspect-[9/16] max-h-[380px] mx-auto rounded-xl';
    }
    if (deviceView === 'tablet') {
      return 'w-full max-w-[420px] aspect-[4/3] mx-auto rounded-xl';
    }
    // Desktop
    if (aspectRatio === '1:1') return 'w-full max-w-[320px] aspect-square mx-auto rounded-xl';
    if (aspectRatio === '4:3') return 'w-full aspect-[4/3] rounded-xl';
    if (aspectRatio === '21:9') return 'w-full aspect-[21/9] rounded-xl';
    return 'w-full aspect-[16/9] rounded-xl';
  };

  return (
    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3.5">
      {/* Label and Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>{label}</span>
        </label>

        {/* Device Viewport Toggle */}
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => setDeviceView('desktop')}
            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              deviceView === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
            title="Desktop 16:9 Viewport"
          >
            <Monitor className="w-3 h-3" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceView('tablet')}
            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              deviceView === 'tablet' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
            title="Tablet 4:3 Viewport"
          >
            <Tablet className="w-3 h-3" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceView('mobile')}
            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
              deviceView === 'mobile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
            title="Mobile Phone Viewport"
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* URL Input Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setImgError(false);
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-xs bg-zinc-900 border border-zinc-700/80 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500 transition-colors"
        />

        {value && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            title="Copy Image URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Quick Preset Selector Buttons */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-medium text-zinc-400 flex items-center justify-between">
          <span>Quick Presets:</span>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[10px] text-zinc-500 hover:text-red-400"
            >
              Clear URL
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SYSTEM_IMAGE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setImgError(false);
                onChange(preset.url);
              }}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors border ${
                value === preset.url
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live Responsive Preview Frame */}
      <div className="pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
          <span className="flex items-center gap-1 font-medium">
            <span>Responsive Simulation:</span>
            <span className="text-indigo-400 font-mono capitalize">{deviceView} View</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
              className="px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-300 border border-zinc-800 hover:text-white"
            >
              Fit: {fitMode}
            </button>
          </div>
        </div>

        {/* Viewport Sandbox Canvas */}
        <div className="p-3 bg-[#08090d] rounded-xl border border-zinc-800/90 flex items-center justify-center min-h-[160px] overflow-hidden">
          {value && !imgError ? (
            <div className={`relative overflow-hidden bg-zinc-950 border border-zinc-700/50 shadow-lg ${getContainerClasses()}`}>
              <img
                src={value}
                alt="Responsive Preview"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className={`w-full h-full ${fitMode === 'contain' ? 'object-contain' : 'object-cover'} transition-all`}
              />
              <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-mono text-zinc-300">
                {deviceView.toUpperCase()} · {fitMode}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 space-y-1.5 text-zinc-500">
              {imgError ? (
                <>
                  <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
                  <div className="text-xs text-amber-300 font-medium">Image URL failed to load</div>
                  <div className="text-[11px] text-zinc-500">Check the URL link or select one of the presets above.</div>
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 mx-auto text-zinc-600" />
                  <div className="text-xs text-zinc-400">No image URL specified</div>
                  <div className="text-[11px] text-zinc-600">Enter a URL or select a preset to preview responsively.</div>
                </>
              )}
            </div>
          )}
        </div>

        <p className="text-[11px] text-zinc-500 mt-2">
          {helpText}
        </p>
      </div>

    </div>
  );
}
