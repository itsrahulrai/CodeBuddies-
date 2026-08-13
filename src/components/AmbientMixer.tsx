import React, { useState } from 'react';
import { CloudRain, Keyboard, Coffee, Disc, Waves, Sliders, Volume2, VolumeX } from 'lucide-react';
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
          if (id === 'rain') {
            audioSynth.setRainActive(nextActive, ch.volume / 100);
          } else if (id === 'waves') {
            audioSynth.setWavesActive(nextActive, ch.volume / 100);
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
          if (id === 'rain' && ch.active) {
            audioSynth.setRainActive(true, newVol / 100);
          } else if (id === 'waves' && ch.active) {
            audioSynth.setWavesActive(true, newVol / 100);
          }
          return { ...ch, volume: newVol };
        }
        return ch;
      })
    );
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'Keyboard':
        return <Keyboard className="w-5 h-5 text-amber-400" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-orange-400" />;
      case 'Disc':
        return <Disc className="w-5 h-5 text-pink-400" />;
      case 'Waves':
        return <Waves className="w-5 h-5 text-purple-400" />;
      default:
        return <Sliders className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="ambient-mixer-section" className="w-full space-y-4">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold mb-1">
          <Sliders className="w-3.5 h-3.5" />
          <span>SOUND SCAPE GENERATOR</span>
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
          Late Night Ambient Sound Mixer
        </h3>
      </div>

      {/* Mixer Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`glass-panel rounded-2xl p-5 border transition-all ${
              ch.active
                ? 'border-cyan-400/50 bg-[#121929]/90 shadow-neon-cyan'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  {getIcon(ch.icon)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{ch.name}</h4>
                  <p className="font-mono text-[10px] text-slate-400">{ch.active ? 'ACTIVE' : 'MUTED'}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleChannel(ch.id)}
                className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                  ch.active ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    ch.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            {/* Volume Slider */}
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Volume</span>
                <span className="text-cyan-300 font-bold">{ch.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={ch.volume}
                onChange={(e) => updateVolume(ch.id, Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
