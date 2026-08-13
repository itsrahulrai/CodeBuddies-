import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Copy, Check, Terminal, Code2, Zap, Sparkles, FastForward } from 'lucide-react';
import { CODE_SNIPPETS } from '../data/mockData';
import { audioSynth } from '../utils/audioSynthesizer';

interface CodeEditorAnimationProps {
  keySfxEnabled: boolean;
}

export const CodeEditorAnimation: React.FC<CodeEditorAnimationProps> = ({ keySfxEnabled }) => {
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const [typedCharCount, setTypedCharCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '> [SYSTEM] Initializing CodeBuddies 2 AM IDE Studio...',
    '> [AUDIO] Connecting YouTube Stream PLrQCktvMYPpDin_kQUIm61mmGJI6ZHPAK...',
    '> [STATUS] Ready for live compilation.'
  ]);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);

  const activeSnippet = CODE_SNIPPETS[activeTabIdx];
  const fullText = activeSnippet.code;
  const terminalRef = useRef<HTMLDivElement>(null);

  // Character typing loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTyping && typedCharCount < fullText.length) {
      const baseDelay = 30 / speedMultiplier;
      timer = setTimeout(() => {
        setTypedCharCount((prev) => prev + 1);
        if (keySfxEnabled && Math.random() < 0.4) {
          audioSynth.playKeyClick();
        }
      }, baseDelay);
    }
    return () => clearTimeout(timer);
  }, [typedCharCount, isTyping, speedMultiplier, fullText, keySfxEnabled]);

  // Tab switch handler
  const handleTabSelect = (idx: number) => {
    setActiveTabIdx(idx);
    setTypedCharCount(0);
    setIsTyping(true);
  };

  const handleRestart = () => {
    setTypedCharCount(0);
    setIsTyping(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setTerminalLogs((prev) => [
      ...prev,
      `> [EXECUTE] Running ${activeSnippet.filename}...`,
      `> [COMPILING] Optimizing AST & WebAudio nodes...`
    ]);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `> [SUCCESS] Execution complete in 12ms. (0 errors, 0 warnings)`,
        `> [OUTPUT] Stream active: PLrQCktvMYPpDin_kQUIm61mmGJI6ZHPAK [320kbps]`
      ]);
      setIsRunningSim(false);
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 1200);
  };

  const currentlyVisibleCode = fullText.slice(0, typedCharCount);

  // Line numbers calculation
  const lines = currentlyVisibleCode.split('\n');

  return (
    <section id="code-editor-section" className="w-full space-y-4">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-bold mb-1">
            <Code2 className="w-3.5 h-3.5" />
            <span>REAL-TIME CODING ANIMATION</span>
          </div>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Live IDE & Terminal Execution Engine
          </h3>
        </div>

        {/* Speed Controls & Tab Actions */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <FastForward className="w-3 h-3 text-cyan-400" />
              <span>Speed:</span>
            </span>
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeedMultiplier(spd)}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  speedMultiplier === spd
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsTyping(!isTyping)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 flex items-center space-x-1.5 transition-all"
          >
            {isTyping ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isTyping ? 'Pause Typer' : 'Resume'}</span>
          </button>

          <button
            onClick={handleRestart}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
            title="Restart Typing"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
          </button>

        </div>
      </div>

      {/* Main IDE Container */}
      <div className="glass-panel rounded-3xl border border-white/15 overflow-hidden shadow-2xl">
        
        {/* IDE Top Window Bar */}
        <div className="px-4 py-3 bg-[#0a0e1a] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          
          {/* Mac window dots & File Tabs */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            </div>

            {/* File Tabs */}
            <div className="flex items-center space-x-1 font-mono text-xs">
              {CODE_SNIPPETS.map((snip, idx) => (
                <button
                  key={snip.id}
                  onClick={() => handleTabSelect(idx)}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                    activeTabIdx === idx
                      ? 'bg-[#141c2e] text-cyan-300 border border-cyan-500/30 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Code2 className="w-3 h-3 text-cyan-400" />
                  <span>{snip.filename}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Copy Snippet & Run Simulation Actions */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 flex items-center space-x-1 transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleRunSimulation}
              disabled={isRunningSim}
              className="px-3.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{isRunningSim ? 'Running...' : 'RUN SIMULATION'}</span>
            </button>
          </div>

        </div>

        {/* IDE Content Area: Editor + Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[320px] max-h-[420px]">
          
          {/* Left Column: Typing Code Editor */}
          <div className="lg:col-span-8 p-4 bg-[#080c16] font-mono text-xs sm:text-sm overflow-y-auto custom-scrollbar flex">
            
            {/* Line Numbers */}
            <div className="select-none pr-4 text-right text-slate-600 border-r border-white/10 flex flex-col space-y-1 font-mono">
              {Array.from({ length: Math.max(lines.length, 12) }).map((_, i) => (
                <span key={i}>{String(i + 1).padStart(2, '0')}</span>
              ))}
            </div>

            {/* Typed Code Area */}
            <div className="pl-4 flex-1 text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
              {currentlyVisibleCode}
              <span className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 align-middle blinking-cursor shadow-neon-cyan"></span>
            </div>

          </div>

          {/* Right Column: Terminal Output Logs */}
          <div className="lg:col-span-4 p-4 bg-[#05070d] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between font-mono text-xs">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-cyan-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>TERMINAL OUTPUT</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              <div ref={terminalRef} className="space-y-1.5 text-[11px] text-slate-300 max-h-[220px] overflow-y-auto custom-scrollbar">
                {terminalLogs.map((log, i) => (
                  <p
                    key={i}
                    className={
                      log.includes('SUCCESS')
                        ? 'text-emerald-400 font-bold'
                        : log.includes('EXECUTE')
                        ? 'text-cyan-300'
                        : log.includes('AUDIO')
                        ? 'text-amber-300'
                        : 'text-slate-400'
                    }
                  >
                    {log}
                  </p>
                ))}
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500">
              <span>LANG: {activeSnippet.language.toUpperCase()}</span>
              <span className="text-cyan-400 font-bold">STATUS: 200 OK</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
