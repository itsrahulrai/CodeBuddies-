import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, Info, Radio, Sparkles, X, ExternalLink, Menu, Eye, Search, Clock } from 'lucide-react';
import { InteractiveCanvas } from './components/InteractiveCanvas';
import { TimeOfDayModal } from './components/TimeOfDayModal';
import { DEFAULT_TRACKS, PLAYLIST_ID } from './data/mockData';
import { TimeOfDayPeriod, TIME_OF_DAY_CONFIGS, getTimePeriodFromHour } from './data/timeOfDayConfig';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(138); // 02:18
  const [duration, setDuration] = useState<number>(225); // 03:45
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Time-of-Day & Character Gender Feature State
  const [systemPeriod, setSystemPeriod] = useState<TimeOfDayPeriod>(() => getTimePeriodFromHour(new Date().getHours()));
  const [timePeriod, setTimePeriod] = useState<TimeOfDayPeriod>(() => getTimePeriodFromHour(new Date().getHours()));
  const [isAutoTime, setIsAutoTime] = useState<boolean>(true);
  const [characterGender, setCharacterGender] = useState<'boy' | 'girl'>('boy');
  const [formattedClock, setFormattedClock] = useState<string>('');
  const [showTimeOfDayModal, setShowTimeOfDayModal] = useState<boolean>(false);

  // Modals & Feature States
  const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Playlist Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  
  // Mouse Parallax coordinates
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const playerRef = useRef<any>(null);
  const currentTrack = DEFAULT_TRACKS[currentTrackIdx] || DEFAULT_TRACKS[0];

  const currentConfig = TIME_OF_DAY_CONFIGS[timePeriod] || TIME_OF_DAY_CONFIGS.night;

  // Real-time System Clock & Time-of-Day Auto Sync
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentSysPeriod = getTimePeriodFromHour(currentHour);
      
      setSystemPeriod(currentSysPeriod);
      if (isAutoTime) {
        setTimePeriod(currentSysPeriod);
      }
      
      setFormattedClock(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [isAutoTime]);

  // Mouse Parallax Event Listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
              if (event.data === 1 && !isPlaying) {
                setIsPlaying(true);
              } else if (event.data === 2 && isPlaying) {
                setIsPlaying(false);
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

  // Sync Play/Pause state
  useEffect(() => {
    if (playerRef.current && playerRef.current.playVideo) {
      try {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch {
        // Fallback for iframe policy
      }
    }
  }, [isPlaying]);

  // Audio duration timer loop
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

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIdx + 1) % DEFAULT_TRACKS.length;
    setCurrentTrackIdx(nextIdx);
    setCurrentTime(0);
    setDuration(DEFAULT_TRACKS[nextIdx].durationSec);
    if (playerRef.current && playerRef.current.nextVideo) {
      try { playerRef.current.nextVideo(); } catch { /* ignore */ }
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIdx - 1 + DEFAULT_TRACKS.length) % DEFAULT_TRACKS.length;
    setCurrentTrackIdx(prevIdx);
    setCurrentTime(0);
    setDuration(DEFAULT_TRACKS[prevIdx].durationSec);
    if (playerRef.current && playerRef.current.previousVideo) {
      try { playerRef.current.previousVideo(); } catch { /* ignore */ }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (playerRef.current && playerRef.current.setVolume) {
      try { playerRef.current.setVolume(val); } catch { /* ignore */ }
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (playerRef.current && playerRef.current.unMute) {
        try { playerRef.current.unMute(); } catch { /* ignore */ }
      }
    } else {
      setIsMuted(true);
      if (playerRef.current && playerRef.current.mute) {
        try { playerRef.current.mute(); } catch { /* ignore */ }
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'KeyP') {
        setShowPlaylistModal((prev) => !prev);
      } else if (e.code === 'KeyA') {
        setShowAboutModal((prev) => !prev);
      } else if (e.code === 'KeyZ') {
        setZenMode((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNextTrack();
      } else if (e.code === 'ArrowLeft') {
        handlePrevTrack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, currentTrackIdx]);

  // Filter Tracks
  const filteredTracks = DEFAULT_TRACKS.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === 'All' ||
      track.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="relative w-screen h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#07131F] text-[#F5F7FA] font-sans select-none flex flex-col justify-between">
      
      {/* Hidden YouTube IFrame */}
      <div className="hidden">
        <div id="yt-hidden-iframe"></div>
      </div>

      {/* 1. HERO ARTWORK BACKGROUND (85% Focus) WITH 3D PARALLAX */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Sky & Background Parallax Layer */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out scale-105"
          style={{
            transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * -8}px, 0)`
          }}
        >
          <img
            src={characterGender === 'girl' ? currentConfig.bgImageGirl : currentConfig.bgImageBoy}
            alt={`Developer Workspace - ${currentConfig.name} (${characterGender})`}
            className="w-full h-full object-cover object-center sm:object-[50%_35%] transition-all duration-1000 ease-in-out"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Character & Desk Parallax + Breathing Movement Layer */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out animate-breathe"
          style={{
            transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -14}px, 0)`
          }}
        >
          {/* Dynamic Sunlight / Sky Ray Shimmer based on Time of Day */}
          <div className={`absolute top-0 right-10 w-[550px] h-[550px] ${currentConfig.sunlightGlow} rounded-full blur-3xl animate-sunlight pointer-events-none transition-all duration-1000`}></div>
        </div>

        {/* Dynamic Atmospheric & Vignette Gradient Overlays based on Time-of-Day */}
        <div className={`absolute inset-0 bg-gradient-to-t ${currentConfig.gradientOverlay} transition-all duration-1000 pointer-events-none`}></div>
        <div className={`absolute inset-0 bg-gradient-to-b ${currentConfig.vignetteGradient} transition-all duration-1000 pointer-events-none`}></div>
      </div>

      {/* Floating Dust Particles & Rain Streaks in Sunlight Overlay */}
      <InteractiveCanvas
        mode="particles"
        rainColor={currentConfig.rainColor}
        dustColor={currentConfig.dustColor}
      />

      {/* Zen Mode Exit Button */}
      {zenMode && (
        <button
          onClick={() => setZenMode(false)}
          className="fixed top-5 right-5 z-50 px-4 py-2 rounded-full bg-[#07131F]/90 border border-[#22C7F2]/50 text-[#22C7F2] font-mono text-xs flex items-center space-x-2 backdrop-blur-md shadow-2xl hover:bg-[#22C7F2] hover:text-[#07131F] transition-all font-bold"
        >
          <Eye className="w-4 h-4" />
          <span>Exit Zen Mode</span>
        </button>
      )}

      {/* 2. TOP LEFT BRANDING & HEADER */}
      <header className={`fixed top-4 sm:top-6 left-4 sm:left-8 z-30 pointer-events-auto transition-opacity duration-500 ${zenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-col items-start space-y-0.5">
          <h1 id="app-title" className="text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-none text-[#F5F7FA] drop-shadow-lg">
            CODEBUDDIES
          </h1>
          <p className="font-mono text-[9px] sm:text-[10px] text-[#22C7F2] tracking-[0.2em] uppercase font-bold">
            LO-FI & RAIN RADIO
          </p>
        </div>
      </header>

      {/* 3. MAIN FLOATING MUSIC PLAYER */}
      <main className={`relative z-10 w-full max-w-xl mx-auto px-4 flex-1 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 pt-4 pb-24 transition-opacity duration-500 ${zenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

        {/* SLEEK FLOATING MUSIC PLAYER CARD */}
        <div className="w-full max-w-sm sm:max-w-md relative z-10">
            
            {/* Floating Music Notes Animation when Playing */}
            {isPlaying && (
              <div className="absolute -top-5 right-6 pointer-events-none z-20 flex items-center space-x-2 text-[#22C7F2]">
                <span className="animate-float-note-1 text-xs font-bold opacity-80">♪</span>
                <span className="animate-float-note-2 text-sm font-bold text-[#FFD18A] opacity-90">♫</span>
                <span className="animate-float-note-3 text-xs font-bold opacity-80">♬</span>
              </div>
            )}

            <div className="w-full cinematic-glass rounded-3xl p-3.5 sm:p-4 transition-all duration-300 space-y-3 text-left relative overflow-hidden border border-white/15">
              
              {/* Top Subtle Neon Edge Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#22C7F2] to-transparent opacity-60"></div>

              {/* Track Info Header */}
              <div className="flex items-center justify-between gap-2.5">
                
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Spinning Vinyl Cover Artwork */}
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/20 bg-black flex items-center justify-center">
                    <img
                      src={currentTrack.coverUrl}
                      alt={currentTrack.title}
                      className={`w-full h-full object-cover rounded-full ${isPlaying ? 'animate-spin-vinyl' : 'animate-spin-vinyl-paused'}`}
                      referrerPolicy="no-referrer"
                    />
                    {/* Vinyl Center Badge */}
                    <div className="absolute w-3.5 h-3.5 rounded-full bg-[#07131F] border-2 border-[#22C7F2] flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-white"></div>
                    </div>
                  </div>

                  {/* Title, Artist & Genre Pill */}
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-[#F5F7FA] truncate font-mono">
                        {currentTrack.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate font-mono mt-0.5">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>

                {/* Animated Waveform Equalizer or Genre Chip */}
                <div className="flex flex-col items-end shrink-0 space-y-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#22C7F2]/10 border border-[#22C7F2]/30 text-[10px] font-mono text-[#22C7F2] font-bold">
                    {currentTrack.genre}
                  </span>
                  {isPlaying && (
                    <div className="flex items-end space-x-0.5 h-3.5 px-1">
                      <span className="w-0.5 bg-[#22C7F2] rounded-full animate-eq-1"></span>
                      <span className="w-0.5 bg-[#22C7F2] rounded-full animate-eq-2"></span>
                      <span className="w-0.5 bg-[#22C7F2] rounded-full animate-eq-3"></span>
                      <span className="w-0.5 bg-[#22C7F2] rounded-full animate-eq-4"></span>
                      <span className="w-0.5 bg-[#22C7F2] rounded-full animate-eq-5"></span>
                      <span className="w-0.5 bg-[#22C7F2] rounded-full animate-eq-6"></span>
                    </div>
                  )}
                </div>

              </div>

              {/* Track Progress Bar */}
              <div className="space-y-1 font-mono text-[10px] text-slate-400">
                <div className="w-full h-1.5 rounded-full bg-black/50 border border-white/10 overflow-hidden relative cursor-pointer group">
                  <div
                    className="h-full bg-gradient-to-r from-[#22C7F2] to-[#FFD18A] transition-all duration-300 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>{formatTime(currentTime)}</span>
                  <span>{currentTrack.duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-0.5 font-mono text-xs text-slate-300">
                
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <button
                    onClick={handlePrevTrack}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Previous Track"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full bg-[#22C7F2] hover:bg-[#22C7F2]/90 text-[#07131F] flex items-center justify-center transition-all active:scale-95"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-[#07131F] text-[#07131F]" />
                    ) : (
                      <Play className="w-4 h-4 fill-[#07131F] text-[#07131F] ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={handleNextTrack}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Next Track"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume & Playlist Modal Trigger */}
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <div className="flex items-center space-x-1.5">
                    <button onClick={toggleMute} className="text-slate-400 hover:text-white">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-14 sm:w-16 h-1 bg-slate-800 accent-[#22C7F2] rounded-lg cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => setShowPlaylistModal(true)}
                    className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-[#22C7F2] hover:bg-white/10 transition-all"
                    title="Open Playlist (500 Songs)"
                  >
                    <ListMusic className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>

      </main>

      {/* 3. SINGLE-LINE BOTTOM TOOLS DOCK (MOBILE RESPONSIVE & HORIZONTALLY SCROLLABLE) */}
      <footer className={`fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-[96vw] sm:max-w-max transition-all duration-300 pointer-events-auto ${zenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center space-x-1.5 sm:space-x-2 py-1.5 px-2 sm:px-3.5 rounded-full bg-[#07131F]/90 border border-white/15 backdrop-blur-xl shadow-2xl overflow-x-auto no-scrollbar justify-start sm:justify-center">
          
          {/* 1. Atmosphere / Time of Day */}
          <button
            onClick={() => setShowTimeOfDayModal(true)}
            className={`px-3 py-1.5 rounded-full bg-black/40 border transition-all flex items-center space-x-1.5 shrink-0 text-xs font-mono ${currentConfig.badgeBorder} ${currentConfig.badgeText}`}
            title="Time-of-Day Atmosphere"
          >
            <Clock className="w-3.5 h-3.5 animate-spin-slow" />
            <span className="whitespace-nowrap">{currentConfig.name}</span>
          </button>

          {/* 2. Full Playlist */}
          <button
            onClick={() => setShowPlaylistModal(true)}
            className="px-3 py-1.5 rounded-full bg-black/40 border border-white/15 text-slate-200 hover:text-[#22C7F2] hover:border-[#22C7F2]/40 transition-all flex items-center space-x-1.5 shrink-0 text-xs font-mono"
            title="Coding Playlist (500 Tracks)"
          >
            <ListMusic className="w-3.5 h-3.5 text-[#22C7F2]" />
            <span className="whitespace-nowrap">Playlist</span>
          </button>

          {/* 3. Zen Mode (Artwork View) */}
          <button
            onClick={() => setZenMode(true)}
            className="px-3 py-1.5 rounded-full bg-black/40 border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-1.5 shrink-0 text-xs font-mono"
            title="Zen Mode (Hide UI for artwork)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Zen</span>
          </button>

        </div>
      </footer>

      {/* 5. PLAYLIST MODAL / DRAWER WITH SEARCH & GENRE FILTERS */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="w-full max-w-xl max-h-[92vh] flex flex-col bg-[#0B2235]/95 border border-white/15 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-3 sm:space-y-4 relative text-left overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#22C7F2]/10 border border-[#22C7F2]/30 text-[#22C7F2]">
                  <ListMusic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">CODING PLAYLIST ({DEFAULT_TRACKS.length} TRACKS)</h3>
                  <p className="font-mono text-[11px] text-slate-400">90s Hindi Classics, Rain Songs & Lo-Fi Focus Streams</p>
                </div>
              </div>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input & Genre Pills */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search 500+ songs, artists, rain tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22C7F2]/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none">
                {['All', 'Rain', '90s', 'Bollywood', 'Romantic', 'Classic', 'Lo-Fi'].map((tag) => {
                  const count = tag === 'All' 
                    ? DEFAULT_TRACKS.length 
                    : DEFAULT_TRACKS.filter((t) => t.genre.toLowerCase().includes(tag.toLowerCase())).length;

                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedGenre(tag)}
                      className={`px-3 py-1 rounded-full border transition-all shrink-0 flex items-center space-x-1 ${
                        selectedGenre === tag
                          ? tag === 'Rain'
                            ? 'bg-[#22C7F2] text-[#07131F] border-[#22C7F2] font-bold shadow-md'
                            : 'bg-[#22C7F2] text-[#07131F] border-[#22C7F2] font-bold shadow-sm'
                          : tag === 'Rain'
                            ? 'bg-[#22C7F2]/10 border-[#22C7F2]/30 text-[#22C7F2] hover:bg-[#22C7F2]/20'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{tag === 'Rain' ? '🌧️ Rain' : tag}</span>
                      <span className="text-[10px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Track List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredTracks.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-mono text-xs space-y-1">
                  <p>No matching tracks found.</p>
                  <p className="text-[10px] text-slate-500">Try searching for "Pehla Nasha", "Kumar Sanu", or "Rain".</p>
                </div>
              ) : (
                filteredTracks.map((track) => {
                  const originalIdx = DEFAULT_TRACKS.findIndex((t) => t.id === track.id);
                  const isCurrent = currentTrackIdx === originalIdx;

                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        setCurrentTrackIdx(originalIdx);
                        setCurrentTime(0);
                        setIsPlaying(true);
                        setShowPlaylistModal(false);
                      }}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-[#22C7F2]/15 border-[#22C7F2]/50 text-[#22C7F2] shadow-lg'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="font-mono text-xs text-slate-500 w-4 font-bold">{originalIdx + 1}</span>
                        <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/10" />
                        <div className="min-w-0 text-left">
                          <p className="font-mono text-xs font-bold text-white truncate">{track.title}</p>
                          <p className="font-mono text-[11px] text-slate-400 truncate">{track.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono text-slate-400 border border-white/5 hidden sm:inline-block">
                          {track.genre}
                        </span>
                        <span className="font-mono text-xs text-slate-400">{track.duration}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with Playlist Link */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-[11px]">YouTube Playlist ID: <span className="text-[#FFD18A]">{PLAYLIST_ID}</span></span>
              <a
                href="https://youtube.com/playlist?list=PLrQCktvMYPpDin_kQUIm61mmGJI6ZHPAK&si=UiTDeH6CXLEmtyKy"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#22C7F2]/10 border border-[#22C7F2]/30 text-[#22C7F2] hover:bg-[#22C7F2] hover:text-[#07131F] font-bold transition-all flex items-center gap-1.5 text-xs"
              >
                <span>Open Playlist on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* 4. ABOUT MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#0B2235] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 relative text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-[#22C7F2]" />
                <h3 className="font-display font-bold text-lg text-white">ABOUT CODEBUDDIES RADIO</h3>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>CodeBuddies Radio</strong> is an aesthetic digital coding sanctuary crafted for developers. Zone in with lo-fi beats & 90s nostalgia while writing code in a peaceful 100vh atmosphere.
              </p>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 font-mono text-[11px]">
                <p className="text-[#22C7F2] font-bold">Quick Keyboard Shortcuts:</p>
                <ul className="space-y-1 text-slate-400">
                  <li><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Space</kbd> Play / Pause Stream</li>
                  <li><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">← / →</kbd> Previous / Next Track</li>
                  <li><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">P</kbd> Coding Playlist</li>
                  <li><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">A</kbd> About Sanctuary</li>
                  <li><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Z</kbd> Zen Focus Mode</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 font-mono text-[11px] text-slate-400 flex justify-between">
              <span>Code. Music. Focus.</span>
              <span className="text-[#22C7F2]">100vh Aesthetic Experience</span>
            </div>
          </div>
        </div>
      )}

      {/* 11. TIME-OF-DAY ATMOSPHERE MODAL */}
      <TimeOfDayModal
        isOpen={showTimeOfDayModal}
        onClose={() => setShowTimeOfDayModal(false)}
        currentPeriod={timePeriod}
        isAutoMode={isAutoTime}
        onSelectPeriod={(period, isAuto) => {
          setTimePeriod(period);
          setIsAutoTime(isAuto);
        }}
        systemPeriod={systemPeriod}
        formattedTime={formattedClock}
        characterGender={characterGender}
        onSelectGender={setCharacterGender}
      />

    </div>
  );
}
