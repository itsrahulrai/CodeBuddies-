import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, ListMusic, Music, Disc } from 'lucide-react';
import { DEFAULT_TRACKS, PLAYLIST_ID } from '../data/mockData';
import { Track } from '../types';

interface YouTubeAudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubeAudioPlayer: React.FC<YouTubeAudioPlayerProps> = ({
  isPlaying,
  onTogglePlay,
}) => {
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [currentTrackIdx, setCurrentTrackIdx] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(225);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showTracklist, setShowTracklist] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const currentTrack = tracks[currentTrackIdx] || DEFAULT_TRACKS[0];

  // Initialize YouTube IFrame Player
  useEffect(() => {
    const initYT = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player('yt-hidden-iframe', {
          height: '1',
          width: '1',
          playerVars: {
            listType: 'playlist',
            list: PLAYLIST_ID,
            autoplay: 0,
            controls: 0,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(volume);
            },
            onStateChange: (event: any) => {
              // 1 = PLAYING, 2 = PAUSED
              if (event.data === 1 && !isPlaying) {
                // sync state
              }
            }
          }
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initYT();
    } else {
      window.onYouTubeIframeAPIReady = initYT;
    }
  }, []);

  // Sync Play/Pause state with YouTube IFrame
  useEffect(() => {
    if (playerRef.current && playerRef.current.playVideo) {
      try {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch {
        // iframe fallback
      }
    }
  }, [isPlaying]);

  // Timer loop for progress bar
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  const handleNextTrack = () => {
    let nextIdx = (currentTrackIdx + 1) % tracks.length;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * tracks.length);
    }
    setCurrentTrackIdx(nextIdx);
    setCurrentTime(0);
    setDuration(tracks[nextIdx].durationSec);

    if (playerRef.current && playerRef.current.nextVideo) {
      try { playerRef.current.nextVideo(); } catch { /* ignore */ }
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIdx - 1 + tracks.length) % tracks.length;
    setCurrentTrackIdx(prevIdx);
    setCurrentTime(0);
    setDuration(tracks[prevIdx].durationSec);

    if (playerRef.current && playerRef.current.previousVideo) {
      try { playerRef.current.previousVideo(); } catch { /* ignore */ }
    }
  };

  const handleSelectTrack = (idx: number) => {
    setCurrentTrackIdx(idx);
    setCurrentTime(0);
    setDuration(tracks[idx].durationSec);
    setShowTracklist(false);

    if (playerRef.current && playerRef.current.playVideoAt) {
      try { playerRef.current.playVideoAt(idx); } catch { /* ignore */ }
    }
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (playerRef.current && playerRef.current.setVolume) {
      try { playerRef.current.setVolume(newVol); } catch { /* ignore */ }
    }
  };

  const handleMuteToggle = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (playerRef.current && playerRef.current.mute) {
      try {
        if (nextMute) playerRef.current.mute();
        else playerRef.current.unMute();
      } catch { /* ignore */ }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / duration) * 100;

  return (
    <>
      {/* Offscreen YouTube Player Anchor */}
      <div className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none overflow-hidden z-[-1]">
        <div id="yt-hidden-iframe"></div>
      </div>

      {/* Floating Bottom Music Dock */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50">
        <div className="glass-panel rounded-3xl p-4 border border-white/20 shadow-2xl space-y-3 bg-[#0a0f1d]/90 backdrop-blur-2xl">
          
          {/* Progress Seekbar */}
          <div className="flex items-center space-x-3 w-full font-mono text-xs text-slate-400">
            <span className="min-w-[42px]">{formatTime(currentTime)}</span>
            
            <div className="flex-1 relative flex items-center h-2 cursor-pointer group">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-400 group-hover:h-2 transition-all"
              />
            </div>

            <span className="min-w-[42px]">{formatTime(duration)}</span>
          </div>

          {/* Main Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Track Info */}
            <div className="flex items-center space-x-3 min-w-[200px] max-w-[320px]">
              <div className="relative w-12 h-12 rounded-2xl bg-slate-800 border border-white/15 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-lg">
                <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Disc className="w-6 h-6 text-cyan-400 animate-spin" />
                  </div>
                )}
              </div>

              <div className="overflow-hidden">
                <h4 className="font-bold text-xs sm:text-sm text-white truncate hover:text-cyan-300 transition-colors">
                  {currentTrack.title}
                </h4>
                <p className="font-mono text-[11px] text-slate-400 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Equalizer spectrum bars animation */}
            <div className="hidden md:flex items-center space-x-1 h-6">
              <span className={`w-1 rounded-full bg-cyan-400 ${isPlaying ? 'animate-eq-1' : 'h-2'}`}></span>
              <span className={`w-1 rounded-full bg-pink-400 ${isPlaying ? 'animate-eq-2' : 'h-3'}`}></span>
              <span className={`w-1 rounded-full bg-amber-400 ${isPlaying ? 'animate-eq-3' : 'h-1'}`}></span>
              <span className={`w-1 rounded-full bg-purple-400 ${isPlaying ? 'animate-eq-4' : 'h-4'}`}></span>
              <span className={`w-1 rounded-full bg-cyan-400 ${isPlaying ? 'animate-eq-5' : 'h-2'}`}></span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center space-x-3 mx-auto sm:mx-0">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-2 rounded-xl transition-all ${
                  isShuffle ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
                title="Shuffle Tracks"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrevTrack}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition-all active:scale-95"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-11 h-11 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 transition-all flex items-center justify-center text-slate-950 font-bold"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-slate-950 text-slate-950" /> : <Play className="w-5 h-5 ml-0.5 fill-slate-950 text-slate-950" />}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition-all active:scale-95"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowTracklist(true)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-cyan-500/30 flex items-center space-x-1 text-xs font-mono font-bold"
                title="Open Playlist Tracklist"
              >
                <ListMusic className="w-4 h-4" />
                <span className="hidden sm:inline">PLAYLIST</span>
              </button>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center space-x-2">
              <button onClick={handleMuteToggle} className="text-slate-400 hover:text-white">
                {isMuted ? <VolumeX className="w-4 h-4 text-pink-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

          </div>

        </div>
      </footer>

      {/* Playlist Drawer Modal */}
      {showTracklist && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-cyan-400" />
                <span>YouTube Playlist Songs</span>
              </h3>
              <button
                onClick={() => setShowTracklist(false)}
                className="text-slate-400 hover:text-white text-lg font-mono"
              >
                ✕
              </button>
            </div>

            <p className="font-mono text-xs text-slate-400">
              Playlist: <span className="text-cyan-300 font-bold">{PLAYLIST_ID}</span>
            </p>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {tracks.map((tr, idx) => (
                <button
                  key={tr.id}
                  onClick={() => handleSelectTrack(idx)}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                    currentTrackIdx === idx
                      ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <img src={tr.coverUrl} alt={tr.title} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="truncate">
                      <p className="text-xs truncate">{tr.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{tr.artist}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-slate-400 ml-2">{tr.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
