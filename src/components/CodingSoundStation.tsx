import React, { useState } from 'react';
import { 
  Keyboard, 
  Server, 
  CloudRain, 
  Coffee, 
  Waves, 
  Disc, 
  Sparkles, 
  Terminal, 
  GitBranch, 
  CheckCircle2, 
  Volume2, 
  X, 
  Play,
  RotateCcw
} from 'lucide-react';
import { audioSynth, KeyboardSwitchType } from '../utils/audioSynthesizer';

interface CodingSoundStationProps {
  onClose?: () => void;
}

interface SoundLayersState {
  keyboard: boolean;
  server: boolean;
  rain: boolean;
  cafe: boolean;
  waves: boolean;
  vinyl: boolean;
}

export const CodingSoundStation: React.FC<CodingSoundStationProps> = ({ onClose }) => {
  const [layers, setLayers] = useState<SoundLayersState>({
    keyboard: false,
    server: false,
    rain: false,
    cafe: false,
    waves: false,
    vinyl: false,
  });

  const [switchType, setSwitchType] = useState<KeyboardSwitchType>('thock');
  const [activeFX, setActiveFX] = useState<string | null>(null);

  const toggleLayer = (key: keyof SoundLayersState) => {
    setLayers((prev) => {
      const nextVal = !prev[key];
      if (key === 'keyboard') audioSynth.setKeyboardActive(nextVal, 0.45, switchType);
      if (key === 'server') audioSynth.setServerActive(nextVal, 0.4);
      if (key === 'rain') audioSynth.setRainActive(nextVal, 0.35);
      if (key === 'cafe') audioSynth.setCafeActive(nextVal, 0.3);
      if (key === 'waves') audioSynth.setWavesActive(nextVal, 0.35);
      if (key === 'vinyl') audioSynth.setVinylActive(nextVal, 0.3);
      return { ...prev, [key]: nextVal };
    });
  };

  const handleSwitchChange = (type: KeyboardSwitchType) => {
    setSwitchType(type);
    audioSynth.playKeyClick(1.2, type);
    if (layers.keyboard) {
      audioSynth.setKeyboardActive(true, 0.45, type);
    }
  };

  const triggerFX = (name: string, fn: () => void) => {
    setActiveFX(name);
    fn();
    setTimeout(() => setActiveFX(null), 400);
  };

  const stopAllLayers = () => {
    setLayers({
      keyboard: false,
      server: false,
      rain: false,
      cafe: false,
      waves: false,
      vinyl: false,
    });
    audioSynth.setKeyboardActive(false);
    audioSynth.setServerActive(false);
    audioSynth.setRainActive(false);
    audioSynth.setCafeActive(false);
    audioSynth.setWavesActive(false);
    audioSynth.setVinylActive(false);
  };

  const continuousLayers = [
    {
      key: 'keyboard' as const,
      label: 'Mechanical Keystrokes',
      desc: 'Burst coding typing flow',
      icon: Keyboard,
      color: 'text-cyan-400',
      activeBorder: 'border-cyan-400/60 bg-cyan-950/40 text-white',
    },
    {
      key: 'server' as const,
      label: 'Datacenter Server Hum',
      desc: '60Hz rack hum & fan airflow',
      icon: Server,
      color: 'text-emerald-400',
      activeBorder: 'border-emerald-400/60 bg-emerald-950/40 text-white',
    },
    {
      key: 'rain' as const,
      label: 'Rain on Window',
      desc: 'Filtered calming rainfall',
      icon: CloudRain,
      color: 'text-sky-400',
      activeBorder: 'border-sky-400/60 bg-sky-950/40 text-white',
    },
    {
      key: 'cafe' as const,
      label: 'Coffeehouse Study',
      desc: 'Warm background chatter',
      icon: Coffee,
      color: 'text-amber-400',
      activeBorder: 'border-amber-400/60 bg-amber-950/40 text-white',
    },
    {
      key: 'waves' as const,
      label: 'Theta Binaural Waves',
      desc: '7Hz frequency for deep flow',
      icon: Waves,
      color: 'text-purple-400',
      activeBorder: 'border-purple-400/60 bg-purple-950/40 text-white',
    },
    {
      key: 'vinyl' as const,
      label: 'Vinyl Record Crackle',
      desc: 'Analog vintage dust texture',
      icon: Disc,
      color: 'text-pink-400',
      activeBorder: 'border-pink-400/60 bg-pink-950/40 text-white',
    },
  ];

  const anyLayerActive = Object.values(layers).some(Boolean);

  return (
    <div className="w-full bg-[#07131F]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 font-mono text-left text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-[#22C7F2]/10 border border-[#22C7F2]/30 text-[#22C7F2]">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Coding Sound Deck
            </h3>
            <p className="text-[9.5px] text-slate-400 font-sans">
              Layer immersive developer soundscapes & SFX
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {anyLayerActive && (
            <button
              onClick={stopAllLayers}
              className="text-[10px] text-rose-300 hover:text-white px-2 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-1 transition-all"
              title="Mute all soundscapes"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Mute All</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Switch Type Selector (For Keyboard) */}
      <div className="bg-black/40 rounded-2xl p-2.5 border border-white/10 space-y-1.5">
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Keyboard Profile:</span>
          <span className="text-[#22C7F2] font-semibold">{switchType.toUpperCase()}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            onClick={() => handleSwitchChange('thock')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
              switchType === 'thock'
                ? 'bg-[#22C7F2] text-[#07131F] border-[#22C7F2] shadow-sm'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            🪵 Thock (Lubed)
          </button>
          <button
            onClick={() => handleSwitchChange('clicky')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
              switchType === 'clicky'
                ? 'bg-[#22C7F2] text-[#07131F] border-[#22C7F2] shadow-sm'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            ⚡ Clicky (Cherry)
          </button>
          <button
            onClick={() => handleSwitchChange('creamy')}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
              switchType === 'creamy'
                ? 'bg-[#22C7F2] text-[#07131F] border-[#22C7F2] shadow-sm'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            🍨 Creamy Tactile
          </button>
        </div>
      </div>

      {/* Ambient Soundscapes (Continuous Loops) */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Continuous Ambient Layers
        </span>
        <div className="grid grid-cols-2 gap-2">
          {continuousLayers.map((layer) => {
            const isActive = layers[layer.key];
            const Icon = layer.icon;

            return (
              <button
                key={layer.key}
                onClick={() => toggleLayer(layer.key)}
                className={`p-2.5 rounded-2xl border transition-all flex flex-col justify-between text-left ${
                  isActive
                    ? `${layer.activeBorder} shadow-lg scale-[1.02]`
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-4 h-4 ${isActive ? layer.color : 'text-slate-400'}`} />
                  <span
                    className={`text-[8.5px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      isActive ? 'bg-[#22C7F2] text-[#07131F]' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {isActive ? 'Active' : 'Off'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-[11.5px] font-bold leading-tight text-white">{layer.label}</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{layer.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instant Coder SFX Soundboard */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#FFB703]" />
            <span>Developer Sound FX Triggers</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => triggerFX('build', () => audioSynth.playBuildSuccess())}
            className={`p-2 rounded-xl border text-center transition-all ${
              activeFX === 'build'
                ? 'bg-emerald-500 text-black border-emerald-400 scale-95 font-bold shadow-lg'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
            }`}
            title="Trigger IDE Build Success Chime"
          >
            <div className="flex items-center justify-center space-x-1 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Build Succeeded</span>
            </div>
            <div className="text-[8.5px] opacity-75 font-sans mt-0.5">npm run build</div>
          </button>

          <button
            onClick={() => triggerFX('git', () => audioSynth.playGitPush())}
            className={`p-2 rounded-xl border text-center transition-all ${
              activeFX === 'git'
                ? 'bg-sky-500 text-black border-sky-400 scale-95 font-bold shadow-lg'
                : 'bg-sky-500/10 border-sky-500/30 text-sky-300 hover:bg-sky-500/20'
            }`}
            title="Trigger Git Push Synced SFX"
          >
            <div className="flex items-center justify-center space-x-1 text-[11px] font-bold">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Git Push</span>
            </div>
            <div className="text-[8.5px] opacity-75 font-sans mt-0.5">origin main</div>
          </button>

          <button
            onClick={() => triggerFX('bell', () => audioSynth.playTerminalBell())}
            className={`p-2 rounded-xl border text-center transition-all ${
              activeFX === 'bell'
                ? 'bg-amber-500 text-black border-amber-400 scale-95 font-bold shadow-lg'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
            title="Trigger Terminal ANSI Bell"
          >
            <div className="flex items-center justify-center space-x-1 text-[11px] font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal Bell</span>
            </div>
            <div className="text-[8.5px] opacity-75 font-sans mt-0.5">ANSI \a Beep</div>
          </button>
        </div>
      </div>
    </div>
  );
};
