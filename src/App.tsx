import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, Info, X, ExternalLink, Eye, Search, Clock, Sparkles, Music2, Youtube, RefreshCw, Check } from 'lucide-react';
import { InteractiveCanvas } from './components/InteractiveCanvas';
import { TimeOfDayModal } from './components/TimeOfDayModal';
import { DEFAULT_TRACKS, PLAYLIST_ID as DEFAULT_PLAYLIST_ID } from './data/mockData';
import { Track } from './types';
import { TimeOfDayPeriod, TIME_OF_DAY_CONFIGS, getTimePeriodFromHour } from './data/timeOfDayConfig';
import { audioSynth } from './utils/audioSynthesizer';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(285);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // YouTube Playlist Integration State
  const [playlistId, setPlaylistId] = useState<string>(DEFAULT_PLAYLIST_ID);
  const [customPlaylistInput, setCustomPlaylistInput] = useState<string>('https://youtube.com/playlist?list=PLrQCktvMYPpDin_kQUIm61mmGJI6ZHPAK&si=UiTDeH6CXLEmtyKy');
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [activeTrack, setActiveTrack] = useState<{
    title: string;
    artist: string;
    coverUrl: string;
    genre: string;
    videoId?: string;
  }>({
    title: DEFAULT_TRACKS[0].title,
    artist: DEFAULT_TRACKS[0].artist,
    coverUrl: DEFAULT_TRACKS[0].coverUrl,
    genre: DEFAULT_TRACKS[0].genre,
    videoId: DEFAULT_TRACKS[0].youtubeId
  });

  const [isYouTubeReady, setIsYouTubeReady] = useState<boolean>(false);
  const [ytError, setYtError] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

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

  // Playlist Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  
  // Mouse Parallax coordinates
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const currentConfig = TIME_OF_DAY_CONFIGS[timePeriod] || TIME_OF_DAY_CONFIGS.night;

  // Initialize YouTube Iframe Player for Playlist (PLrQCktvMYPpDin_kQUIm61mmGJI6ZHPAK)
  useEffect(() => {
    let checkTimer: NodeJS.Timeout;

    const setupPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      try {
        if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
          ytPlayerRef.current.destroy();
        }

        ytPlayerRef.current = new window.YT.Player('youtube-stream-iframe', {
          height: '1',
          width: '1',
          playerVars: {
            listType: 'playlist',
            list: playlistId,
            autoplay: 0,
            controls: 0,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              setIsYouTubeReady(true);
              setYtError(false);
              event.target.setVolume(volume);
              if (isMuted) event.target.mute();

              // Fetch playlist video IDs if available
              try {
                const playlistIds = event.target.getPlaylist();
                if (playlistIds && Array.isArray(playlistIds) && playlistIds.length > 0) {
                  const dynamicTracks: Track[] = playlistIds.map((vId: string, idx: number) => ({
                    id: `yt-${vId}-${idx}`,
                    youtubeId: vId,
                    audioUrl: DEFAULT_TRACKS[idx % DEFAULT_TRACKS.length].audioUrl,
                    title: DEFAULT_TRACKS[idx % DEFAULT_TRACKS.length]?.title || `Playlist Track #${idx + 1}`,
                    artist: DEFAULT_TRACKS[idx % DEFAULT_TRACKS.length]?.artist || "YouTube Playlist",
                    duration: DEFAULT_TRACKS[idx % DEFAULT_TRACKS.length]?.duration || "04:30",
                    durationSec: DEFAULT_TRACKS[idx % DEFAULT_TRACKS.length]?.durationSec || 270,
                    coverUrl: `https://img.youtube.com/vi/${vId}/hqdefault.jpg`,
                    genre: "Playlist"
                  }));
                  setPlaylistTracks(dynamicTracks);
                }
              } catch (e) {
                console.log("Could not read YT playlist array directly", e);
              }
            },
            onStateChange: (event: any) => {
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              if (event.data === 1) {
                setIsPlaying(true);
                try {
                  const videoData = event.target.getVideoData();
                  if (videoData && videoData.title) {
                    setActiveTrack({
                      title: videoData.title,
                      artist: videoData.author || "YouTube Music",
                      coverUrl: videoData.video_id
                        ? `https://img.youtube.com/vi/${videoData.video_id}/hqdefault.jpg`
                        : DEFAULT_TRACKS[0].coverUrl,
                      genre: "YouTube Live",
                      videoId: videoData.video_id
                    });
                  }
                  const dur = event.target.getDuration();
                  if (dur && dur > 0) {
                    setDuration(dur);
                  }
                  const idx = event.target.getPlaylistIndex();
                  if (typeof idx === 'number' && idx >= 0) {
                    setCurrentTrackIdx(idx);
                  }
                } catch (e) {
                  console.log("Error reading video metadata", e);
                }
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                handleNextTrack();
              }
            },
            onError: (err: any) => {
              console.warn("YouTube Player error:", err);
              setYtError(true);
            }
          }
        });
      } catch (err) {
        console.warn("Failed to instantiate YT Player", err);
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      window.onYouTubeIframeAPIReady = setupPlayer;
      checkTimer = setInterval(() => {
        if (window.YT && window.YT.Player && !ytPlayerRef.current) {
          setupPlayer();
          clearInterval(checkTimer);
        }
      }, 500);
    }

    return () => {
      if (checkTimer) clearInterval(checkTimer);
    };
  }, [playlistId]);

  // Synchronize playback progress timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        if (ytPlayerRef.current && isYouTubeReady && !ytError) {
          try {
            const cur = ytPlayerRef.current.getCurrentTime();
            if (typeof cur === 'number') {
              setCurrentTime(cur);
            }
            const dur = ytPlayerRef.current.getDuration();
            if (typeof dur === 'number' && dur > 0 && dur !== duration) {
              setDuration(dur);
            }
          } catch {
            setCurrentTime((prev) => prev + 1);
          }
        } else if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        } else {
          setCurrentTime((prev) => (prev >= duration ? 0 : prev + 1));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isYouTubeReady, ytError, duration]);

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

  const togglePlay = () => {
    const nextPlayState = !isPlaying;
    setIsPlaying(nextPlayState);

    if (ytPlayerRef.current && isYouTubeReady && !ytError) {
      try {
        if (nextPlayState) {
          ytPlayerRef.current.playVideo();
        } else {
          ytPlayerRef.current.pauseVideo();
        }
        return;
      } catch (err) {
        console.warn("YouTube play command failed, falling back to audio tag", err);
      }
    }

    if (audioRef.current) {
      if (nextPlayState) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIdx + 1) % playlistTracks.length;
    setCurrentTrackIdx(nextIdx);
    setCurrentTime(0);

    if (ytPlayerRef.current && isYouTubeReady && !ytError) {
      try {
        ytPlayerRef.current.nextVideo();
        return;
      } catch {}
    }

    const nextTrack = playlistTracks[nextIdx];
    setActiveTrack({
      title: nextTrack.title,
      artist: nextTrack.artist,
      coverUrl: nextTrack.coverUrl,
      genre: nextTrack.genre,
      videoId: nextTrack.youtubeId
    });
    setDuration(nextTrack.durationSec);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIdx - 1 + playlistTracks.length) % playlistTracks.length;
    setCurrentTrackIdx(prevIdx);
    setCurrentTime(0);

    if (ytPlayerRef.current && isYouTubeReady && !ytError) {
      try {
        ytPlayerRef.current.previousVideo();
        return;
      } catch {}
    }

    const prevTrack = playlistTracks[prevIdx];
    setActiveTrack({
      title: prevTrack.title,
      artist: prevTrack.artist,
      coverUrl: prevTrack.coverUrl,
      genre: prevTrack.genre,
      videoId: prevTrack.youtubeId
    });
    setDuration(prevTrack.durationSec);
  };

  const handleSelectTrack = (idx: number) => {
    setCurrentTrackIdx(idx);
    setCurrentTime(0);
    setIsPlaying(true);
    setShowPlaylistModal(false);

    if (ytPlayerRef.current && isYouTubeReady && !ytError) {
      try {
        ytPlayerRef.current.playVideoAt(idx);
        return;
      } catch {}
    }

    const selectedTrack = playlistTracks[idx];
    if (selectedTrack) {
      setActiveTrack({
        title: selectedTrack.title,
        artist: selectedTrack.artist,
        coverUrl: selectedTrack.coverUrl,
        genre: selectedTrack.genre,
        videoId: selectedTrack.youtubeId
      });
      setDuration(selectedTrack.durationSec);
      if (audioRef.current) {
        audioRef.current.src = selectedTrack.audioUrl;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);

    if (ytPlayerRef.current && isYouTubeReady) {
      try {
        ytPlayerRef.current.setVolume(val);
        if (val === 0) ytPlayerRef.current.mute();
        else ytPlayerRef.current.unMute();
      } catch {}
    }

    if (audioRef.current) {
      audioRef.current.volume = val / 100;
      audioRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);

    if (ytPlayerRef.current && isYouTubeReady) {
      try {
        if (nextMute) ytPlayerRef.current.mute();
        else ytPlayerRef.current.unMute();
      } catch {}
    }

    if (audioRef.current) {
      audioRef.current.muted = nextMute;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    setCurrentTime(newTime);

    if (ytPlayerRef.current && isYouTubeReady && !ytError) {
      try {
        ytPlayerRef.current.seekTo(newTime, true);
        return;
      } catch {}
    }

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Import custom playlist link handler
  const handleLoadCustomPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPlaylistInput.trim()) return;

    let extractedId = customPlaylistInput.trim();
    if (extractedId.includes('list=')) {
      const match = extractedId.match(/list=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        extractedId = match[1];
      }
    } else if (extractedId.includes('youtu.be/')) {
      const match = extractedId.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        extractedId = match[1];
      }
    }

    setPlaylistId(extractedId);
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 3000);

    if (ytPlayerRef.current && isYouTubeReady) {
      try {
        ytPlayerRef.current.loadPlaylist({
          list: extractedId,
          listType: 'playlist',
          index: 0
        });
        setIsPlaying(true);
      } catch (err) {
        console.warn("Could not load playlist directly", err);
      }
    }
  };

  const formatTime = (secs: number) => {
    const safeSecs = Math.max(0, Math.floor(secs || 0));
    const m = Math.floor(safeSecs / 60);
    const s = Math.floor(safeSecs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'KeyP' || e.code === 'KeyQ') {
        setShowPlaylistModal((prev) => !prev);
      } else if (e.code === 'KeyA') {
        setShowAboutModal((prev) => !prev);
      } else if (e.code === 'KeyZ') {
        setZenMode((prev) => !prev);
      } else if (e.code === 'KeyN' || e.code === 'ArrowRight') {
        handleNextTrack();
      } else if (e.code === 'KeyP' && e.altKey || e.code === 'ArrowLeft') {
        handlePrevTrack();
      } else if (e.code === 'KeyK' || e.code === 'KeyH') {
        audioSynth.playKeyClick(1.2, 'thock');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTrackIdx, isMuted, playlistTracks]);

  // Filter Tracks
  const filteredTracks = playlistTracks.filter((track) => {
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
      
      {/* Hidden YouTube Iframe Stream Player (Plays exact playlist in background) */}
      <div className="fixed -top-96 -left-96 w-1 h-1 opacity-0 pointer-events-none overflow-hidden" tabIndex={-1}>
        <div id="youtube-stream-iframe"></div>
      </div>

      {/* HTML5 Audio Player Engine with Exact Song Synchronization Fallback */}
      <audio
        ref={audioRef}
        src={DEFAULT_TRACKS[currentTrackIdx % DEFAULT_TRACKS.length].audioUrl}
        preload="auto"
        onEnded={handleNextTrack}
      />

      {/* 1. HERO ARTWORK BACKGROUND (85% Focus) WITH 3D PARALLAX */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        
        {/* Sky & Background Parallax Layer */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out scale-105"
          style={{
            transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * -8}px, 0)`
          }}
        >
          <img
            src={characterGender === 'girl' ? currentConfig.bgImageGirl : currentConfig.bgImageBoy}
            alt={`Developer Workspace - ${currentConfig.name} (${characterGender})`}
            loading="eager"
            decoding="async"
            className="w-full h-full min-w-full min-h-full object-cover object-[50%_35%] block transition-all duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Character & Desk Parallax + Breathing Movement Layer */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out animate-breathe pointer-events-none"
          style={{
            transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -14}px, 0)`
          }}
        >
          {/* Dynamic Sunlight / Sky Ray Shimmer based on Time of Day */}
          <div className={`absolute top-0 right-4 sm:right-10 w-[320px] sm:w-[550px] h-[320px] sm:h-[550px] ${currentConfig.sunlightGlow} rounded-full blur-3xl animate-sunlight pointer-events-none transition-all duration-1000`}></div>
        </div>

        {/* Dynamic Atmospheric & Vignette Gradient Overlays based on Time-of-Day */}
        <div className={`absolute inset-0 bg-gradient-to-t ${currentConfig.gradientOverlay} transition-all duration-1000 pointer-events-none opacity-80 sm:opacity-100`}></div>
        <div className={`absolute inset-0 bg-gradient-to-b ${currentConfig.vignetteGradient} transition-all duration-1000 pointer-events-none opacity-80 sm:opacity-100`}></div>
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
          className="fixed top-5 right-5 z-50 px-4 py-2 rounded-full bg-black/80 border border-white/20 text-white font-mono text-xs flex items-center space-x-2 backdrop-blur-md shadow-2xl hover:bg-white hover:text-black transition-all font-bold"
        >
          <Eye className="w-4 h-4" />
          <span>Exit Zen Mode</span>
        </button>
      )}

      {/* 2. MINIMALIST TOP BAR (MATCHING SCREENSHOT LAYOUT) */}
      <header className={`fixed top-3 sm:top-5 left-3 sm:left-8 right-3 sm:right-8 z-30 pointer-events-auto flex items-center justify-between transition-opacity duration-500 ${zenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Left: Brand Icon + Title + Route Subtitle */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-400/90 text-black flex items-center justify-center font-black text-base shadow-lg shrink-0">
            <span>💻</span>
          </div>
          <div>
            <h1 id="app-title" className="text-sm sm:text-base font-extrabold tracking-tight leading-none text-white drop-shadow-md">
              CODE BUDDY
            </h1>
            <p className="font-mono text-[8px] sm:text-[9.5px] text-slate-300 tracking-[0.14em] uppercase font-semibold mt-0.5 opacity-85">
              DEV SANCTUARY • LOCALHOST:3000
            </p>
          </div>
        </div>

        {/* Right: Digital Clock + Live Status + Clean Capsule Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Clock & Status */}
          <div className="text-right font-mono hidden xs:block">
            <div className="text-sm sm:text-base font-bold text-white tracking-wide leading-none flex items-baseline justify-end space-x-1">
              <span>{formattedClock ? formattedClock.slice(0, 5) : '16:51'}</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal">
                {formattedClock ? formattedClock.slice(6, 8) : '00'}
              </span>
            </div>
            <div className="flex items-center justify-end space-x-1.5 text-[9px] sm:text-[10px] text-amber-300/90 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-semibold uppercase tracking-wider">{playlistTracks.length} TRACKS</span>
            </div>
          </div>

          {/* Action Tray: Who's coding? + Atmosphere + Sounds + Zen */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Who's coding? Avatar Toggle */}
            <button
              onClick={() => setCharacterGender((prev) => (prev === 'boy' ? 'girl' : 'boy'))}
              className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 hover:border-white/30 text-slate-200 hover:text-white transition-all text-xs font-mono flex items-center space-x-1.5 shadow-sm active:scale-95"
              title="Toggle Developer Avatar (Boy / Girl)"
            >
              <span>{characterGender === 'boy' ? '👨‍💻' : '👩‍💻'}</span>
              <span className="hidden sm:inline font-sans text-[11px] font-medium">Who's coding?</span>
            </button>

            {/* Atmosphere Modal Trigger */}
            <button
              onClick={() => setShowTimeOfDayModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 hover:border-white/30 text-slate-200 hover:text-white transition-all text-xs font-mono flex items-center space-x-1 shadow-sm active:scale-95"
              title="Change Time of Day & Atmosphere"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden md:inline font-sans text-[11px] font-medium">{currentConfig.name}</span>
            </button>

            {/* Zen Mode */}
            <button
              onClick={() => setZenMode(true)}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 hover:border-white/30 text-slate-300 hover:text-white transition-all shadow-sm"
              title="Zen Focus Mode (Z)"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* 3. CENTER HERO: ICONIC DISPLAY TYPOGRAPHY & INTERACTIVE ACTION BUTTON */}
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-20 pointer-events-none transition-all duration-700 ${zenMode ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        
        {/* Track Label Eyebrow */}
        <div className="text-center space-y-1 mb-1">
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.28em] sm:tracking-[0.35em] text-slate-200 uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 flex items-center justify-center space-x-2">
            <span>{playlistTracks.length} TRACKS • NON-STOP STREAM</span>
          </p>
        </div>

        {/* Massive White Headline */}
        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tight text-center select-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)] leading-none">
          CODE BUDDY
        </h2>

        {/* Subtitle Tagline */}
        <p className="font-mono text-[9.5px] sm:text-[11px] tracking-[0.22em] text-amber-200/90 uppercase font-semibold mt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          ALL NIGHT ON LOCALHOST
        </p>

        {/* Center Interactive Action Button */}
        <div className="mt-5 pointer-events-auto">
          <button
            onClick={() => audioSynth.playKeyClick(1.2, 'thock')}
            className="px-4 py-2 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/20 hover:border-cyan-400/60 text-slate-200 hover:text-white transition-all shadow-2xl flex items-center space-x-2.5 group active:scale-95 cursor-pointer"
            title="Click or press 'K' for mechanical switch keystroke"
          >
            <div className="p-1 rounded-lg bg-white/10 group-hover:bg-cyan-400 group-hover:text-black transition-colors text-slate-300">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-left font-mono">
              <div className="text-[11px] font-bold text-white tracking-wide leading-tight group-hover:text-cyan-300 transition-colors">
                मैकेनिकल कीस्ट्रोक
              </div>
              <div className="text-[8.5px] text-slate-400 tracking-wider uppercase font-sans">
                THOCK KEYSTROKE (K)
              </div>
            </div>
          </button>
        </div>

      </div>

      {/* 4. FLOATING PILL PLAYER & KEYBOARD SHORTCUTS */}
      <footer className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-[94vw] sm:max-w-2xl px-2 transition-all duration-500 pointer-events-auto flex flex-col items-center space-y-2.5 ${zenMode ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        
        {/* Floating Capsule Player */}
        <div className="w-full bg-[#181a1d]/85 hover:bg-[#181a1d]/95 backdrop-blur-2xl border border-white/15 hover:border-white/25 rounded-full px-3.5 sm:px-5 py-2.5 sm:py-3 shadow-[0_16px_40px_rgba(0,0,0,0.7)] transition-all flex items-center justify-between gap-3 relative">
          
          {/* Left: Spinning Vinyl Cover + Track Title + Scrubber */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            
            {/* Circular Vinyl Art */}
            <div
              onClick={() => setShowPlaylistModal(true)}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-white/20 bg-black flex items-center justify-center cursor-pointer group shadow-md"
              title="Click to browse playlist (Q)"
            >
              <img
                src={activeTrack.coverUrl}
                alt={activeTrack.title}
                className={`w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform ${isPlaying ? 'animate-spin-vinyl' : 'animate-spin-vinyl-paused'}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-[#181a1d] border border-white/60"></div>
            </div>

            {/* Song Meta + Scrubber */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <p className="text-xs sm:text-sm font-bold text-white truncate font-sans tracking-tight leading-tight">
                  {activeTrack.title}
                </p>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate font-sans mt-0.5 flex items-center space-x-1.5">
                <span>{activeTrack.artist}</span>
                {isPlaying && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                )}
              </p>

              {/* Minimal Scrubber & Timestamps */}
              <div className="flex items-center space-x-2 font-mono text-[9px] text-slate-400 mt-1">
                <span className="shrink-0">{formatTime(currentTime)}</span>
                <div
                  onClick={handleSeek}
                  className="w-full h-1 rounded-full bg-white/15 hover:bg-white/25 overflow-hidden relative cursor-pointer flex items-center"
                  title="Seek position (← / →)"
                >
                  <div
                    className="h-full bg-cyan-400 transition-all duration-100 rounded-full"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="shrink-0">{formatTime(duration)}</span>
              </div>
            </div>

          </div>

          {/* Right: Controls (Previous, Solid White Play Circle, Next, Volume, Playlist) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0 text-slate-300">
            
            {/* Previous */}
            <button
              onClick={handlePrevTrack}
              className="p-1.5 rounded-full text-slate-300 hover:text-white transition-all active:scale-95"
              title="Previous Track (← or P)"
            >
              <SkipBack className="w-4 h-4 fill-slate-300 hover:fill-white" />
            </button>

            {/* Solid White Circular Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-slate-100 text-black flex items-center justify-center shadow-lg active:scale-90 transition-all font-bold shrink-0"
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-black text-black" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black text-black ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={handleNextTrack}
              className="p-1.5 rounded-full text-slate-300 hover:text-white transition-all active:scale-95"
              title="Next Track (→ or N)"
            >
              <SkipForward className="w-4 h-4 fill-slate-300 hover:fill-white" />
            </button>

            {/* Volume Toggle */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full text-slate-300 hover:text-white transition-all hidden xs:block"
              title={isMuted ? "Unmute (M)" : "Mute (M)"}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Queue / Playlist */}
            <button
              onClick={() => setShowPlaylistModal(true)}
              className="p-1.5 rounded-full text-slate-300 hover:text-white transition-all"
              title="Open Tracklist / Queue (Q)"
            >
              <ListMusic className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Bottom Inline Keyboard Shortcuts Bar */}
        <div className="hidden sm:flex items-center space-x-3 text-[10px] font-mono text-slate-400 select-none">
          <div className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-white font-bold text-[9px]">Space</kbd>
            <span className="uppercase tracking-wider">PLAY / PAUSE</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-white font-bold text-[9px]">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-white font-bold text-[9px]">→</kbd>
            <span className="uppercase tracking-wider">SEEK</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-white font-bold text-[9px]">N</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-white font-bold text-[9px]">P</kbd>
            <span className="uppercase tracking-wider">TRACK</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-white font-bold text-[9px]">Q</kbd>
            <span className="uppercase tracking-wider">QUEUE</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-white font-bold text-[9px]">K</kbd>
            <span className="uppercase tracking-wider">KEYSTROKE</span>
          </div>
        </div>

      </footer>

      {/* 6. PLAYLIST MODAL / DRAWER WITH CUSTOM YOUTUBE URL INPUT & SEARCH */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="w-full max-w-xl max-h-[92vh] flex flex-col bg-[#0B2235]/95 border border-white/15 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-3 sm:space-y-4 relative text-left overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white flex items-center space-x-2">
                    <span>YOUTUBE PLAYLIST</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono">
                      {playlistTracks.length} TRACKS
                    </span>
                  </h3>
                  <p className="font-mono text-[11px] text-slate-400">
                    Active: <span className="text-amber-300 font-semibold">{playlistId}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Playlist Link Input */}
            <form onSubmit={handleLoadCustomPlaylist} className="bg-black/50 p-2.5 rounded-2xl border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span className="font-bold flex items-center space-x-1.5 text-cyan-300">
                  <Youtube className="w-3.5 h-3.5 text-rose-400" />
                  <span>Load Custom YouTube Playlist / Link:</span>
                </span>
                {importSuccess && (
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Loaded!</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Paste YouTube playlist URL or ID"
                  value={customPlaylistInput}
                  onChange={(e) => setCustomPlaylistInput(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold font-mono text-xs shrink-0 transition-all shadow-md active:scale-95 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Load</span>
                </button>
              </div>
            </form>

            {/* Search Input & Genre Pills */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tracks, artists, rain songs in playlist..."
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
                    ? playlistTracks.length 
                    : playlistTracks.filter((t) => t.genre.toLowerCase().includes(tag.toLowerCase())).length;

                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedGenre(tag)}
                      className={`px-3 py-1 rounded-full border transition-all shrink-0 flex items-center space-x-1 ${
                        selectedGenre === tag
                          ? 'bg-[#22C7F2] text-[#07131F] border-[#22C7F2] font-bold shadow-sm'
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
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredTracks.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-mono text-xs space-y-1">
                  <p>No matching tracks found in playlist.</p>
                  <p className="text-[10px] text-slate-500">Try searching for other song titles or artists.</p>
                </div>
              ) : (
                filteredTracks.map((track, idx) => {
                  const originalIdx = playlistTracks.findIndex((t) => t.id === track.id);
                  const isCurrent = currentTrackIdx === originalIdx;

                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(originalIdx)}
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
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-black font-mono text-[10px] font-bold">
                            Playing
                          </span>
                        )}
                        <span className="font-mono text-xs text-slate-400">{track.duration}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with Playlist Link */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-[11px]">Stream: <span className="text-[#FFD18A]">YouTube API + Lo-Fi</span></span>
              <a
                href={`https://youtube.com/playlist?list=${playlistId}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white font-bold transition-all flex items-center gap-1.5 text-xs"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* 7. ABOUT MODAL */}
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
                  <li><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">P / Q</kbd> Coding Playlist Queue</li>
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

      {/* 8. TIME-OF-DAY ATMOSPHERE MODAL */}
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

