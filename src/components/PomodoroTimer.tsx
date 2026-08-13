import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, CheckCircle2, Sparkles } from 'lucide-react';
import { audioSynth } from '../utils/audioSynthesizer';

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(3);

  const totalDuration = mode === 'work' ? 25 * 60 : 5 * 60;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed session
      audioSynth.playCoffeeSip();
      if (mode === 'work') {
        setCompletedSessions((prev) => prev + 1);
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/15 shadow-2xl space-y-6 flex flex-col justify-between">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Timer className="w-5 h-5 text-cyan-400" />
          <h3 className="font-display font-bold text-lg text-white">Focus Station</h3>
        </div>

        {/* Mode Switch Pills */}
        <div className="flex items-center space-x-1 p-1 bg-white/5 rounded-xl border border-white/10 font-mono text-xs">
          <button
            onClick={() => switchMode('work')}
            className={`px-3 py-1 rounded-lg transition-all ${
              mode === 'work' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-3 py-1 rounded-lg transition-all ${
              mode === 'break' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            5m Break
          </button>
        </div>
      </div>

      {/* Main Timer Dial */}
      <div className="text-center space-y-2 relative py-2">
        <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">
          {mode === 'work' ? '⚡ DEEP CODING SESSION' : '☕ REST & HYDRATE'}
        </p>

        <h2 className="font-mono font-black text-5xl sm:text-6xl text-white tracking-wider glow-cyan">
          {formatTime(timeLeft)}
        </h2>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10 mt-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Controls & Session Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTimer}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold text-xs flex items-center space-x-1.5 shadow-neon-cyan transition-all active:scale-95"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Completed Stats */}
        <div className="flex items-center space-x-1.5 font-mono text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{completedSessions} Sessions Done</span>
        </div>
      </div>

    </div>
  );
};
