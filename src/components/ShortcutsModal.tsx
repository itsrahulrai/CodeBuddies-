import React from 'react';
import { HelpCircle, X, Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Spacebar', desc: 'Play / Pause Music Stream' },
    { key: '← / →', desc: 'Previous / Next Track' },
    { key: 'P / Q', desc: 'Open Playlist Queue' },
    { key: 'K', desc: 'Funny Thock Keystroke SFX' },
    { key: 'A', desc: 'About Code Buddy' },
    { key: 'M', desc: 'Mute / Unmute Audio' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Command className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-lg text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 font-mono text-xs">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between"
            >
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-bold">
                [{sc.key}]
              </span>
              <span className="text-slate-300">{sc.desc}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold font-mono text-xs transition-all"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
