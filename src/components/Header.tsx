import React, { useState, useEffect } from 'react';
import { Radio, Volume2, VolumeX, HelpCircle, Laptop, Clock, Code2, Sliders, Timer, MessageSquare } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'soundscape' | 'focus' | 'stories' | 'all';
  setActiveTab: (tab: 'studio' | 'soundscape' | 'focus' | 'stories' | 'all') => void;
  onOpenHelp: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  keySfxActive: boolean;
  onToggleKeySfx: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenHelp,
  crtEnabled,
  onToggleCrt,
  keySfxActive,
  onToggleKeySfx,
}) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 bg-[#080b13]/90 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Mark */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight">
                CODEBUDDIES <span className="text-cyan-400">RADIO</span>
              </h1>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            </div>
            <p className="font-mono text-[11px] text-slate-400">
              2 AM Lo-Fi Stream & Live IDE
            </p>
          </div>
        </div>

        {/* Center Workspace View Tabs */}
        <nav className="flex items-center space-x-1 p-1 bg-white/5 rounded-2xl border border-white/10 font-mono text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'studio'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Studio IDE</span>
          </button>
          <button
            onClick={() => setActiveTab('soundscape')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'soundscape'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Mixer</span>
          </button>
          <button
            onClick={() => setActiveTab('focus')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'focus'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Focus</span>
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'stories'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Capsules</span>
          </button>
        </nav>

        {/* Right Utility Bar */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          
          {/* Clock Pill */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-cyan-300">{timeString || '02:00:00 AM'}</span>
          </div>

          {/* CRT Filter */}
          <button
            onClick={onToggleCrt}
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-all active:scale-95 ${
              crtEnabled
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle Scanlines"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="font-bold">CRT {crtEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Key SFX */}
          <button
            onClick={onToggleKeySfx}
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-all active:scale-95 ${
              keySfxActive
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle Mechanical Key Clicks"
          >
            {keySfxActive ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="font-bold">KEY SFX</span>
          </button>

          {/* Help Shortcuts */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
            title="Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};

