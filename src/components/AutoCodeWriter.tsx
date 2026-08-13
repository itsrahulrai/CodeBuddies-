import React, { useState, useEffect } from 'react';
import { Terminal, Code, Cpu } from 'lucide-react';

const CODE_SNIPPETS = [
  `// 2 AM MacBook Studio Session
import { Play90sHindi, Nostalgia } from 'codebuddies-radio';

function DeveloperLateNightSession() {
  const currentMood = Nostalgia.MODE_90S_CLASSICS;
  const coffeeCup = { status: "steaming", refill: true };
  
  const activePlaylist = [
    "Pehla Nasha",
    "Tujhe Dekha Toh Yeh Jaana Sanam",
    "Chaiyya Chaiyya (Lofi)"
  ];

  return (
    <StudioWorkspace 
      ambientLighting="warm_sunlight_blue_shadows"
      macbookPro="active"
      keyboards="rgb_typing"
      rainOutside={true}
    />
  );
}

export default DeveloperLateNightSession;`,
  `// Auto-scaling audio processing loop
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();

function processSpectrum(buffer) {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  return data.map(freq => Math.sin(freq * 0.05) * 100);
}

// Keep coding under rain drops...`,
  `// 90s Bollywood Evergreen Stream
const streamConfig = {
  quality: '24-bit/96kHz',
  vibe: 'cozy_monsoon_rain',
  studyDeskLamp: 'warm_gold_glow',
  focusMode: true,
};

console.log("Listening to 90s Hindi classics while coding...");`
];

export const AutoCodeWriter: React.FC = () => {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentFullText = CODE_SNIPPETS[snippetIndex];

    if (charIndex < currentFullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentFullText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, Math.random() * 35 + 25); // Typing speed
      return () => clearTimeout(timeout);
    } else {
      // Pause before resetting/changing snippet
      const pauseTimeout = setTimeout(() => {
        setDisplayedText('');
        setCharIndex(0);
        setSnippetIndex((prev) => (prev + 1) % CODE_SNIPPETS.length);
      }, 4000);
      return () => clearTimeout(pauseTimeout);
    }
  }, [charIndex, snippetIndex]);

  const lines = displayedText.split('\n');

  return (
    <div className="w-full max-w-md cinematic-glass rounded-xl border border-white/10 p-3 text-left font-mono text-[11px] shadow-2xl relative overflow-hidden group">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-slate-400 text-[10px]">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          <span className="ml-2 text-[#22C7F2] font-semibold flex items-center gap-1">
            <Code className="w-3 h-3" />
            MacBook Pro — Live Code
          </span>
        </div>
        <div className="flex items-center space-x-2 text-slate-500">
          <span className="flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            TYPING
          </span>
        </div>
      </div>

      {/* Code Area */}
      <div className="max-h-28 overflow-y-auto pr-1 text-slate-300 space-y-0.5 leading-relaxed selection:bg-[#22C7F2]/30">
        {lines.map((line, idx) => (
          <div key={idx} className="flex">
            <span className="w-6 text-slate-600 select-none text-right pr-2 shrink-0">{idx + 1}</span>
            <span className="whitespace-pre text-[#22C7F2]/90">
              {line}
              {idx === lines.length - 1 && (
                <span className="inline-block w-1.5 h-3.5 bg-[#FFD38A] ml-0.5 align-middle blinking-cursor"></span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
