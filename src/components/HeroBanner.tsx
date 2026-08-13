import React, { useState, useEffect } from 'react';
import { Coffee, Code2, Heart, RefreshCw, Terminal, Music } from 'lucide-react';
import { INITIAL_MEMORIES } from '../data/mockData';
import { audioSynth } from '../utils/audioSynthesizer';

interface HeroBannerProps {
  onScrollToCode: () => void;
  onScrollToMixer: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onScrollToCode,
  onScrollToMixer,
  isPlaying,
  onTogglePlay,
}) => {
  const [caffeine, setCaffeine] = useState<number>(85);
  const [memoryIndex, setMemoryIndex] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMemoryIndex((prev) => (prev + 1) % INITIAL_MEMORIES.length);
      setLiked(false);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const handleSipCoffee = () => {
    audioSynth.playCoffeeSip();
    setCaffeine((prev) => Math.min(100, prev + 15));
  };

  const currentMem = INITIAL_MEMORIES[memoryIndex];

  return (
    <section className="w-full space-y-6">
      
      {/* Hero Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Hero Banner (8 Cols) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/10 shadow-lg">
          
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-semibold">
              <span>STREAM & CODE STUDIO</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Those 2 AM <span className="text-cyan-400">Coding Nights</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              A serene lo-fi radio station & interactive development canvas designed for late-night coders, thinkers, and builders.
            </p>
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
            <button
              onClick={onTogglePlay}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-2 active:scale-95"
            >
              <Music className="w-4 h-4" />
              <span>{isPlaying ? 'PAUSE PLAYLIST' : 'PLAY LO-FI STREAM'}</span>
            </button>

            <button
              onClick={onScrollToCode}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs font-bold transition-all flex items-center gap-2"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>LIVE IDE</span>
            </button>

            <button
              onClick={onScrollToMixer}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs font-bold transition-all flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>SOUND MIXER</span>
            </button>
          </div>

        </div>

        {/* Side Widgets (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Caffeine Level */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Coffee className="w-4 h-4 text-amber-400" />
                <span className="font-display font-bold text-sm text-white">Focus Coffee Stamina</span>
              </div>
              <button
                onClick={handleSipCoffee}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold transition-all"
              >
                +15% SIP
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Caffeine Meter</span>
                <span className="text-amber-300 font-bold">{caffeine}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${caffeine}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 2 AM Developer Memory Capsule */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 flex-1 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="font-bold text-cyan-400">2 AM MEMORY</span>
              <button
                onClick={() => setMemoryIndex((prev) => (prev + 1) % INITIAL_MEMORIES.length)}
                className="p-1 text-slate-400 hover:text-white transition-all"
                title="Next memory"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="font-mono text-xs text-slate-300 leading-relaxed italic">
              "{currentMem.quote}"
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-2">
                <img src={currentMem.avatar} alt={currentMem.author} className="w-5 h-5 rounded-full object-cover" />
                <span className="text-slate-300 font-bold">{currentMem.author}</span>
              </div>

              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[11px] transition-all ${
                  liked ? 'bg-pink-500/20 text-pink-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className={`w-3 h-3 ${liked ? 'fill-pink-400' : ''}`} />
                <span>{currentMem.likes + (liked ? 1 : 0)}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

