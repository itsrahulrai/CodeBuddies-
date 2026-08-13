import React, { useState, useEffect } from 'react';
import { Code, Terminal, Sparkles } from 'lucide-react';

const REALTIME_CODE_LINES = [
  `// 2 AM MacBook Studio Session - 90s Hindi Stream`,
  `import { PlayNostalgia, FocusMode } from 'codebuddies-radio';`,
  ``,
  `function DeveloperWorkspace() {`,
  `  const currentTrack = "Pehla Nasha (1992)";`,
  `  const coffee = { temperature: "hot", cup: "ceramic" };`,
  `  const rainDrops = "gentle_monsoon";`,
  ``,
  `  // Typing on mechanical keyboard under study lamp glow...`,
  `  return (`,
  `    <MacBookStudioWorkspace`,
  `      screenGlow="#22C7F2"`,
  `      studyLamp="warm_golden_light"`,
  `      rainOutside={true}`,
  `    />`,
  `  );`,
  `}`,
  ``,
  `export default DeveloperWorkspace;`
];

export const ComputerMonitorIDE: React.FC = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);

  useEffect(() => {
    if (currentLineIdx >= REALTIME_CODE_LINES.length) {
      const resetTimeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIdx(0);
        setCurrentCharIdx(0);
      }, 5000);
      return () => clearTimeout(resetTimeout);
    }

    const currentFullLine = REALTIME_CODE_LINES[currentLineIdx];

    if (currentCharIdx < currentFullLine.length) {
      const charTimer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          if (newLines.length <= currentLineIdx) {
            newLines.push(currentFullLine.substring(0, currentCharIdx + 1));
          } else {
            newLines[currentLineIdx] = currentFullLine.substring(0, currentCharIdx + 1);
          }
          return newLines;
        });
        setCurrentCharIdx((prev) => prev + 1);
      }, Math.random() * 30 + 20); // Fast realistic typing rhythm
      return () => clearTimeout(charTimer);
    } else {
      const lineTimer = setTimeout(() => {
        setCurrentLineIdx((prev) => prev + 1);
        setCurrentCharIdx(0);
      }, 300);
      return () => clearTimeout(lineTimer);
    }
  }, [currentLineIdx, currentCharIdx]);

  return (
    <div className="w-80 cinematic-glass rounded-xl border border-[#22C7F2]/30 p-3 font-mono text-[11px] shadow-2xl relative overflow-hidden backdrop-blur-xl bg-[#071522]/85 text-left">
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22C7F2] via-[#FFD38A] to-[#FF8A4C]"></div>

      {/* Screen Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px]">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          <span className="ml-1.5 text-[#22C7F2] font-semibold flex items-center gap-1 font-mono">
            <Code className="w-3 h-3" />
            MacBook — Developer System
          </span>
        </div>
        <div className="flex items-center space-x-1 text-emerald-400 font-mono text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>TYPING CODE</span>
        </div>
      </div>

      {/* Code Editor Screen Container */}
      <div className="h-44 overflow-hidden text-slate-300 space-y-1 font-mono leading-relaxed text-[10.5px]">
        {displayedLines.map((line, idx) => (
          <div key={idx} className="flex items-start">
            <span className="w-5 text-slate-600 select-none text-right pr-2 shrink-0 text-[9px]">{idx + 1}</span>
            <span className="whitespace-pre text-[#22C7F2] break-all">
              {line}
              {idx === currentLineIdx && (
                <span className="inline-block w-1.5 h-3 bg-[#FFD38A] ml-0.5 align-middle blinking-cursor"></span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
