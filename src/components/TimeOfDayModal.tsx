import React from 'react';
import { X, Clock, Sunrise, Sun, Sunset, Moon, Sparkles, Check, RefreshCw, User } from 'lucide-react';
import { TimeOfDayPeriod, TIME_OF_DAY_CONFIGS } from '../data/timeOfDayConfig';

interface TimeOfDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPeriod: TimeOfDayPeriod;
  isAutoMode: boolean;
  onSelectPeriod: (period: TimeOfDayPeriod, isAuto: boolean) => void;
  systemPeriod: TimeOfDayPeriod;
  formattedTime: string;
  characterGender: 'boy' | 'girl';
  onSelectGender: (gender: 'boy' | 'girl') => void;
}

export const TimeOfDayModal: React.FC<TimeOfDayModalProps> = ({
  isOpen,
  onClose,
  currentPeriod,
  isAutoMode,
  onSelectPeriod,
  systemPeriod,
  formattedTime,
  characterGender,
  onSelectGender
}) => {
  if (!isOpen) return null;

  const periods: { id: TimeOfDayPeriod; label: string; hours: string; icon: React.ReactNode }[] = [
    {
      id: 'morning',
      label: 'Morning Focus',
      hours: '05:00 AM – 11:59 AM',
      icon: <Sunrise className="w-5 h-5 text-[#FFD166]" />
    },
    {
      id: 'afternoon',
      label: 'Afternoon Flow',
      hours: '12:00 PM – 04:59 PM',
      icon: <Sun className="w-5 h-5 text-[#38BDF8]" />
    },
    {
      id: 'sunset',
      label: 'Golden Twilight',
      hours: '05:00 PM – 08:59 PM',
      icon: <Sunset className="w-5 h-5 text-[#FB7185]" />
    },
    {
      id: 'night',
      label: 'Late Night Lo-Fi',
      hours: '09:00 PM – 04:59 AM',
      icon: <Moon className="w-5 h-5 text-[#22C7F2]" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#07131F]/95 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-[#F5F7FA] font-sans overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#22C7F2]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#22C7F2]/10 border border-[#22C7F2]/30 text-[#22C7F2] font-mono text-[10px] uppercase font-bold tracking-widest">
              <Clock className="w-3.5 h-3.5 animate-spin-slow" />
              <span>TIME-OF-DAY ATMOSPHERE</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white pt-1">
              Atmospheric Environment
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Auto-syncs background artwork & CSS gradients with local system clock
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Character Gender Selector */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono text-xs text-slate-300">
            <User className="w-4 h-4 text-[#22C7F2]" />
            <span className="font-bold">PROGRAMMER AVATAR:</span>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10">
            <button
              onClick={() => onSelectGender('boy')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
                characterGender === 'boy'
                  ? 'bg-[#22C7F2] text-[#07131F] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>👨‍💻 Boy</span>
            </button>
            <button
              onClick={() => onSelectGender('girl')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
                characterGender === 'girl'
                  ? 'bg-[#FB7185] text-[#07131F] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>👩‍💻 Girl</span>
            </button>
          </div>
        </div>

        {/* Live System Time Banner */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#22C7F2]/15 border border-[#22C7F2]/30 flex items-center justify-center text-[#22C7F2]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">SYSTEM LOCAL CLOCK</div>
              <div className="text-sm font-bold text-white flex items-center space-x-2">
                <span>{formattedTime}</span>
                <span className="text-[10px] text-[#22C7F2] bg-[#22C7F2]/15 px-2 py-0.5 rounded-full border border-[#22C7F2]/30 uppercase font-bold">
                  {TIME_OF_DAY_CONFIGS[systemPeriod].name}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectPeriod(systemPeriod, true)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              isAutoMode
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoMode ? 'animate-spin-slow' : ''}`} />
            <span>{isAutoMode ? 'AUTO SYNC ON' : 'ENABLE AUTO'}</span>
          </button>
        </div>

        {/* Selectable Time Periods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {periods.map((item) => {
            const config = TIME_OF_DAY_CONFIGS[item.id];
            const isSelected = currentPeriod === item.id;
            const isSystemMatch = systemPeriod === item.id;
            const bgImg = characterGender === 'girl' ? config.bgImageGirl : config.bgImageBoy;

            return (
              <button
                key={item.id}
                onClick={() => onSelectPeriod(item.id, false)}
                className={`relative group p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? `${config.badgeBg} ${config.badgeBorder} ring-2 ring-${config.accentColor}/40`
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {/* Micro Thumbnail Background Preview */}
                <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none">
                  <img
                    src={bgImg}
                    alt={config.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                      {item.icon}
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${isSelected ? config.badgeText : 'text-white'}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {item.hours}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="relative z-10 mt-3 flex items-center justify-between text-[10px] font-mono pt-2 border-t border-white/10 text-slate-400">
                  <span>{config.sublabel}</span>
                  {isSystemMatch && (
                    <span className="text-[#22C7F2] font-bold">SYSTEM MATCH</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-[11px] font-mono text-slate-400 flex items-center justify-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD18A]" />
          <span>Gradients, lighting, and hero room artwork transition automatically.</span>
        </div>

      </div>
    </div>
  );
};
