import React, { useState } from 'react';
import { CloudRain, Keyboard, Coffee, Disc, Waves, Sliders, Building2, Volume2, Sparkles } from 'lucide-react';
import { INITIAL_SOUND_CHANNELS } from '../data/mockData';
import { SoundChannel } from '../types';
import { audioSynth } from '../utils/audioSynthesizer';

export const AmbientMixer: React.FC = () => {
  const [channels, setChannels] = useState<SoundChannel[]>(INITIAL_SOUND_CHANNELS);

  const toggleChannel = (id: SoundChannel['id']) => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const nextActive = !ch.active;
          const volNorm = ch.volume / 100;

          if (id === 'rain') {
            audioSynth.setRainActive(nextActive, volNorm);
          } else if (id === 'keyboard') {
            audioSynth.setKeyboardActive(nextActive, volNorm);
          } else if (id === 'city') {
            audioSynth.setCityActive(nextActive, volNorm);
          } else if (id === 'cafe') {
            audioSynth.setCafeActive(nextActive, volNorm);
          } else if (id === 'vinyl') {
            audioSynth.setVinylActive(nextActive, volNorm);
          } else if (id === 'waves') {
            audioSynth.setWavesActive(nextActive, volNorm);
          }
          return { ...ch, active: nextActive };
        }
        return ch;
      })
    );
  };

  const updateVolume = (id: SoundChannel['id'], newVol: number) => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const volNorm = newVol / 100;
          if (ch.active) {
            if (id === 'rain') audioSynth.setRainActive(true, volNorm);
            if (id === 'keyboard') audioSynth.setKeyboardActive(true, volNorm);
            if (id === 'city') audioSynth.setCityActive(true, volNorm);
            if (id === 'cafe') audioSynth.setCafeActive(true, volNorm);
            if (id === 'vinyl') audioSynth.setVinylActive(true, volNorm);
            if (id === 'waves') audioSynth.setWavesActive(true, volNorm);
          }
          return { ...ch, volume: newVol };
        }
        return ch;
      })
    );
  };

  const getIcon = (id: SoundChannel['id']) => {
    switch (id) {
      case 'rain':
        return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'keyboard':
        return <Keyboard className="w-5 h-5 text-amber-400" />;
      case 'city':
        return <Building2 className="w-5 h-5 text-sky-400" />;
      case 'cafe':
        return <Coffee className="w-5 h-5 text-orange-400" />;
      case 'vinyl':
        return <Disc className="w-5 h-5 text-pink-400" />;
      case 'waves':
        return <Waves className="w-5 h-5 text-purple-400" />;
      default:
        return <Sliders className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="ambient-mixer-section" className="w-full space-y-4">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-white">
            Ambient Sound Mixer & Layering
          </h3>
          <p className="font-mono text-xs text-slate-400">
            Layer synthesized rain, mechanical keys, and city night sounds over your lo-fi music.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              channels.forEach((ch) => {
                if (ch.active) toggleChannel(ch.id);
              });
            }}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-mono transition-all"
          >
            Mute All
          </button>
        </div>
      </div>

      {/* Mixer Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`rounded-2xl p-4 border transition-all ${
              ch.active
                ? 'border-[#22C7F2]/50 bg-[#0B1E2E]/90 shadow-lg shadow-[#22C7F2]/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl border ${ch.active ? 'bg-[#22C7F2]/10 border-[#22C7F2]/30' : 'bg-white/5 border-white/10'}`}>
                  {getIcon(ch.id)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-mono">{ch.name}</h4>
                  <p className={`font-mono text-[10px] font-bold ${ch.active ? 'text-[#22C7F2]' : 'text-slate-500'}`}>
                    {ch.active ? '● PLAYING' : '○ MUTED'}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleChannel(ch.id)}
                className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                  ch.active ? 'bg-[#22C7F2]' : 'bg-slate-700'
                }`}
                title={`Toggle ${ch.name}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    ch.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            {/* Volume Slider */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Volume</span>
                <span className="text-[#22C7F2] font-bold">{ch.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={ch.volume}
                onChange={(e) => updateVolume(ch.id, Number(e.target.value))}
                className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#22C7F2]"
              />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
