'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Info,
  X,
  ExternalLink,
  Timer,
  Sliders,
  Code,
  Command,
  Eye,
  Search,
  Lightbulb,
  Clock,
} from 'lucide-react';

import { InteractiveCanvas } from '../components/InteractiveCanvas';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { AmbientMixer } from '../components/AmbientMixer';
import { ComputerMonitorIDE } from '../components/ComputerMonitorIDE';
import { ShortcutsModal } from '../components/ShortcutsModal';
import { TimeOfDayModal } from '../components/TimeOfDayModal';

import {
  DEFAULT_TRACKS,
  PLAYLIST_ID,
} from '../data/mockData';

import {
  TimeOfDayPeriod,
  TIME_OF_DAY_CONFIGS,
  getTimePeriodFromHour,
} from '../data/timeOfDayConfig';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function App() {
  /* =====================================================
     PLAYER STATE
  ===================================================== */

  const [isPlaying, setIsPlaying] =
    useState<boolean>(false);

  const [currentTrackIdx, setCurrentTrackIdx] =
    useState<number>(0);

  const [currentTime, setCurrentTime] =
    useState<number>(138);

  const [duration, setDuration] =
    useState<number>(225);

  const [volume, setVolume] =
    useState<number>(80);

  const [isMuted, setIsMuted] =
    useState<boolean>(false);

  /* =====================================================
     TIME OF DAY
  ===================================================== */

  // Default to 'night' for the very first render so server and client
  // markup match exactly; the real time-of-day is applied on mount below.
  const [systemPeriod, setSystemPeriod] =
    useState<TimeOfDayPeriod>('night');

  const [timePeriod, setTimePeriod] =
    useState<TimeOfDayPeriod>('night');

  const [isAutoTime, setIsAutoTime] =
    useState<boolean>(true);

  const [characterGender, setCharacterGender] =
    useState<'boy' | 'girl'>('boy');

  const [formattedClock, setFormattedClock] =
    useState<string>('');

  const [showTimeOfDayModal, setShowTimeOfDayModal] =
    useState<boolean>(false);

  /* =====================================================
     MODALS
  ===================================================== */

  const [showPlaylistModal, setShowPlaylistModal] =
    useState<boolean>(false);

  const [showAboutModal, setShowAboutModal] =
    useState<boolean>(false);

  const [showPomodoroModal, setShowPomodoroModal] =
    useState<boolean>(false);

  const [showAmbientModal, setShowAmbientModal] =
    useState<boolean>(false);

  const [showIdeModal, setShowIdeModal] =
    useState<boolean>(false);

  const [showShortcutsModal, setShowShortcutsModal] =
    useState<boolean>(false);

  const [zenMode, setZenMode] =
    useState<boolean>(false);

  /* =====================================================
     PLAYLIST FILTER
  ===================================================== */

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  const [selectedGenre, setSelectedGenre] =
    useState<string>('All');

  /* =====================================================
     LAMP
  ===================================================== */

  const [lampOn, setLampOn] =
    useState<boolean>(true);

  /* =====================================================
     MOUSE PARALLAX
  ===================================================== */

  const [mousePos, setMousePos] =
    useState<{
      x: number;
      y: number;
    }>({
      x: 0,
      y: 0,
    });

  /* =====================================================
     REFS
  ===================================================== */

  const playerRef =
    useRef<any>(null);

  const currentTrack =
    DEFAULT_TRACKS[currentTrackIdx] ||
    DEFAULT_TRACKS[0];

  const currentConfig =
    TIME_OF_DAY_CONFIGS[timePeriod] ||
    TIME_OF_DAY_CONFIGS.night;

  /* =====================================================
     REAL TIME CLOCK
  ===================================================== */

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const currentHour =
        now.getHours();

      const currentSysPeriod =
        getTimePeriodFromHour(
          currentHour
        );

      setSystemPeriod(
        currentSysPeriod
      );

      if (isAutoTime) {
        setTimePeriod(
          currentSysPeriod
        );
      }

      setFormattedClock(
        now.toLocaleTimeString(
          [],
          {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }
        )
      );
    };

    updateClock();

    const timer =
      setInterval(
        updateClock,
        1000
      );

    return () =>
      clearInterval(timer);
  }, [isAutoTime]);

  /* =====================================================
     MOUSE PARALLAX
  ===================================================== */

  useEffect(() => {
    const handleMouseMove =
      (e: MouseEvent) => {
        const x =
          (e.clientX /
            window.innerWidth) *
            2 -
          1;

        const y =
          (e.clientY /
            window.innerHeight) *
            2 -
          1;

        setMousePos({
          x,
          y,
        });
      };

    window.addEventListener(
      'mousemove',
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, []);

  /* =====================================================
     YOUTUBE PLAYER
  ===================================================== */

  useEffect(() => {
    const initYT = () => {
      if (
        window.YT &&
        window.YT.Player
      ) {
        playerRef.current =
          new window.YT.Player(
            'yt-hidden-iframe',
            {
              height: '1',
              width: '1',

              // Load the actual selected track (not the raw playlist) so the
              // audio that plays always matches the title shown on screen.
              videoId:
                DEFAULT_TRACKS[0]
                  .youtubeId,

              playerVars: {
                autoplay: 0,
                controls: 0,
                enablejsapi: 1,
                origin:
                  window.location
                    .origin,
              },

              events: {
                onReady:
                  (event: any) => {
                    event.target.setVolume(
                      volume
                    );
                  },

                onStateChange:
                  (
                    event: any
                  ) => {
                    if (
                      event.data ===
                        1 &&
                      !isPlaying
                    ) {
                      setIsPlaying(
                        true
                      );
                    } else if (
                      event.data ===
                        2 &&
                      isPlaying
                    ) {
                      setIsPlaying(
                        false
                      );
                    } else if (
                      event.data === 0
                    ) {
                      // Video ended naturally — advance to next track
                      handleNextTrack();
                    }
                  },
              },
            }
          );
      }
    };

    if (
      window.YT &&
      window.YT.Player
    ) {
      initYT();
    } else {
      window.onYouTubeIframeAPIReady =
        initYT;
    }
  }, []);

  /* =====================================================
     LOAD CORRECT VIDEO WHEN TRACK CHANGES
     (keeps audio in sync with the displayed title)
  ===================================================== */

  useEffect(() => {
    if (
      playerRef.current &&
      playerRef.current.loadVideoById &&
      playerRef.current.cueVideoById
    ) {
      try {
        if (isPlaying) {
          playerRef.current.loadVideoById(
            currentTrack.youtubeId
          );
        } else {
          playerRef.current.cueVideoById(
            currentTrack.youtubeId
          );
        }
      } catch {
        // Ignore YouTube errors
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIdx]);

  /* =====================================================
     PLAY / PAUSE
  ===================================================== */

  useEffect(() => {
    if (
      playerRef.current &&
      playerRef.current.playVideo
    ) {
      try {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch {
        // Ignore YouTube errors
      }
    }
  }, [isPlaying]);

  /* =====================================================
     AUDIO TIMER
  ===================================================== */

  useEffect(() => {
    let timer:
      ReturnType<
        typeof setInterval
      >;

    if (isPlaying) {
      timer =
        setInterval(() => {
          setCurrentTime(
            (prev) => {
              if (
                prev >= duration
              ) {
                handleNextTrack();
                return 0;
              }

              return prev + 1;
            }
          );
        }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [
    isPlaying,
    duration,
  ]);

  /* =====================================================
     PLAY / PAUSE BUTTON
  ===================================================== */

  const togglePlay = () => {
    setIsPlaying(
      (prev) => !prev
    );
  };

  /* =====================================================
     NEXT TRACK
  ===================================================== */

  const handleNextTrack = () => {
    const nextIdx =
      (currentTrackIdx + 1) %
      DEFAULT_TRACKS.length;

    setCurrentTrackIdx(
      nextIdx
    );

    setCurrentTime(0);

    setDuration(
      DEFAULT_TRACKS[
        nextIdx
      ].durationSec
    );
  };

  /* =====================================================
     PREVIOUS TRACK
  ===================================================== */

  const handlePrevTrack = () => {
    const prevIdx =
      (currentTrackIdx -
        1 +
        DEFAULT_TRACKS.length) %
      DEFAULT_TRACKS.length;

    setCurrentTrackIdx(
      prevIdx
    );

    setCurrentTime(0);

    setDuration(
      DEFAULT_TRACKS[
        prevIdx
      ].durationSec
    );
  };

  /* =====================================================
     VOLUME
  ===================================================== */

  const handleVolumeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val =
      Number(
        e.target.value
      );

    setVolume(val);

    setIsMuted(
      val === 0
    );

    if (
      playerRef.current &&
      playerRef.current
        .setVolume
    ) {
      try {
        playerRef.current.setVolume(
          val
        );
      } catch {
        // Ignore
      }
    }
  };

  /* =====================================================
     MUTE
  ===================================================== */

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);

      if (
        playerRef.current &&
        playerRef.current
          .unMute
      ) {
        try {
          playerRef.current.unMute();
        } catch {
          // Ignore
        }
      }
    } else {
      setIsMuted(true);

      if (
        playerRef.current &&
        playerRef.current
          .mute
      ) {
        try {
          playerRef.current.mute();
        } catch {
          // Ignore
        }
      }
    }
  };

  /* =====================================================
     FORMAT TIME
  ===================================================== */

  const formatTime = (
    secs: number
  ) => {
    const m =
      Math.floor(
        secs / 60
      );

    const s =
      Math.floor(
        secs % 60
      );

    return `${m < 10 ? '0' : ''}${m}:${
      s < 10 ? '0' : ''
    }${s}`;
  };

  /* =====================================================
     KEYBOARD SHORTCUTS
  ===================================================== */

  useEffect(() => {
    const handleKeyDown =
      (e: KeyboardEvent) => {
        if (
          [
            'INPUT',
            'TEXTAREA',
          ].includes(
            (
              e.target as HTMLElement
            )?.tagName
          )
        ) {
          return;
        }

        if (
          e.code === 'Space'
        ) {
          e.preventDefault();
          togglePlay();
        } else if (
          e.code === 'KeyM'
        ) {
          toggleMute();
        } else if (
          e.code === 'KeyP'
        ) {
          setShowPlaylistModal(
            (prev) => !prev
          );
        } else if (
          e.code === 'KeyA'
        ) {
          setShowAboutModal(
            (prev) => !prev
          );
        } else if (
          e.code === 'KeyT'
        ) {
          setShowPomodoroModal(
            (prev) => !prev
          );
        } else if (
          e.code === 'KeyS'
        ) {
          setShowAmbientModal(
            (prev) => !prev
          );
        } else if (
          e.code === 'KeyI'
        ) {
          setShowIdeModal(
            (prev) => !prev
          );
        } else if (
          e.code === 'KeyL'
        ) {
          setLampOn(
            (prev) => !prev
          );
        } else if (
          e.code === 'KeyZ'
        ) {
          setZenMode(
            (prev) => !prev
          );
        } else if (
          e.key === '?'
        ) {
          setShowShortcutsModal(
            (prev) => !prev
          );
        } else if (
          e.code ===
          'ArrowRight'
        ) {
          handleNextTrack();
        } else if (
          e.code ===
          'ArrowLeft'
        ) {
          handlePrevTrack();
        }
      };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    isPlaying,
    isMuted,
    currentTrackIdx,
  ]);

  /* =====================================================
     FILTER TRACKS
  ===================================================== */

  const filteredTracks =
    DEFAULT_TRACKS.filter(
      (track) => {
        const matchesSearch =
          track.title
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||
          track.artist
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            );

        const matchesGenre =
          selectedGenre ===
            'All' ||
          track.genre
            .toLowerCase()
            .includes(
              selectedGenre.toLowerCase()
            );

        return (
          matchesSearch &&
          matchesGenre
        );
      }
    );

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-[#07131F] text-[#F5F7FA] font-sans select-none">

      {/* =================================================
          HIDDEN YOUTUBE
      ================================================= */}

      <div className="hidden">
        <div id="yt-hidden-iframe" />
      </div>

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

        {/* Background */}

        <div
          className="absolute inset-0 transition-transform duration-500 ease-out scale-105"
          style={{
            transform: `translate3d(
              ${mousePos.x * -10}px,
              ${mousePos.y * -8}px,
              0
            )`,
          }}
        >
          <img
            src={
              characterGender ===
              'girl'
                ? currentConfig.bgImageGirl
                : currentConfig.bgImageBoy
            }
            alt={`Developer Workspace - ${currentConfig.name}`}
            className="w-full h-full object-cover object-center transition-all duration-1000 ease-in-out"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // If a background image 404s (e.g. missing from the deploy),
              // fail gracefully instead of showing a broken-image icon.
              (e.target as HTMLImageElement).style.display = 'none';
              // eslint-disable-next-line no-console
              console.error(
                'Background image failed to load:',
                (e.target as HTMLImageElement).src
              );
            }}
          />
        </div>

        {/* Character / Desk */}

        <div
          className="absolute inset-0 transition-transform duration-500 ease-out animate-breathe"
          style={{
            transform: `translate3d(
              ${mousePos.x * -18}px,
              ${mousePos.y * -14}px,
              0
            )`,
          }}
        >

          {/* Screen Glow */}

          <div
            className={`absolute top-1/3 right-1/4 w-[450px] h-[450px] rounded-full blur-3xl transition-opacity duration-1000 ${
              isPlaying
                ? 'bg-[#22C7F2]/25 animate-screen-glow'
                : 'bg-[#22C7F2]/10'
            }`}
          />

          {/* Sunlight */}

          <div
            className={`absolute top-0 right-10 w-[550px] h-[550px] ${currentConfig.sunlightGlow} rounded-full blur-3xl animate-sunlight transition-all duration-1000`}
          />

          {/* Lamp */}

          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              lampOn
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            <div className="absolute top-[28%] left-[14%] sm:left-[24%] w-40 h-40 bg-[#FFF3C4] rounded-full blur-2xl opacity-90 mix-blend-screen animate-pulse" />

            <div className="absolute top-[18%] left-[6%] sm:left-[16%] w-[420px] h-[420px] sm:w-[580px] sm:h-[580px] bg-radial from-[#FFDA8B]/70 via-[#FF9E44]/35 to-transparent rounded-full blur-3xl mix-blend-screen" />

            <div className="absolute bottom-[10%] left-[12%] sm:left-[22%] w-[520px] h-[240px] bg-[#FFE099]/40 rounded-full blur-2xl mix-blend-screen" />

            <div className="absolute inset-0 bg-[#FFB84D]/12 mix-blend-color-dodge" />
          </div>

        </div>

        {/* Gradient */}

        <div
          className={`absolute inset-0 bg-gradient-to-t ${currentConfig.gradientOverlay} transition-all duration-1000`}
        />

        <div
          className={`absolute inset-0 bg-gradient-to-b ${currentConfig.vignetteGradient} transition-all duration-1000`}
        />

        <div className="absolute inset-0 bg-radial from-transparent via-[#07131F]/20 to-[#07131F]/60" />

      </div>

      {/* =================================================
          PARTICLES
      ================================================= */}

      <InteractiveCanvas
        mode="particles"
        rainColor={
          currentConfig.rainColor
        }
        dustColor={
          currentConfig.dustColor
        }
      />

      {/* =================================================
          LOGO - TOP LEFT
      ================================================= */}

      {!zenMode && (
        <div className="fixed top-5 left-5 sm:top-6 sm:left-7 z-40">

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white drop-shadow-2xl">

            CODE
            <span className="text-[#22C7F2]">
              BUDDIES
            </span>

          </h1>

          <div className="mt-1 flex items-center gap-1.5">

            <span className="w-1.5 h-1.5 rounded-full bg-[#22C7F2] animate-pulse" />

            <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.25em] text-white/50">
              Coding Radio
            </span>

          </div>

        </div>
      )}

      {/* =================================================
          DESKTOP TOOL BAR - ONE LINE
      ================================================= */}

      {!zenMode && (
        <div className="hidden md:block fixed top-5 left-1/2 -translate-x-1/2 z-40">

          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#07131F]/60 backdrop-blur-xl border border-white/10 shadow-2xl">

            {/* Playlist */}

            <button
              onClick={() =>
                setShowPlaylistModal(
                  true
                )
              }
              className="h-9 px-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:text-[#22C7F2] hover:bg-[#22C7F2]/10 transition-all flex items-center gap-1.5 font-mono text-[11px]"
            >
              <ListMusic className="w-3.5 h-3.5" />

              <span>
                Playlist
              </span>
            </button>

            {/* Atmosphere */}

            <button
              onClick={() =>
                setShowTimeOfDayModal(
                  true
                )
              }
              className={`h-9 px-3 rounded-xl bg-white/5 border border-white/5 transition-all flex items-center gap-1.5 font-mono text-[11px] ${currentConfig.badgeText}`}
            >
              <Clock className="w-3.5 h-3.5" />

              <span>
                {currentConfig.name}
              </span>
            </button>

            {/* Timer */}

            <button
              onClick={() =>
                setShowPomodoroModal(
                  true
                )
              }
              className="h-9 px-3 rounded-xl bg-white/5 border border-white/5 text-[#FFD18A] hover:bg-[#FFD18A]/10 transition-all flex items-center gap-1.5 font-mono text-[11px]"
            >
              <Timer className="w-3.5 h-3.5" />

              <span>
                Timer
              </span>
            </button>

            {/* Sounds */}

            <button
              onClick={() =>
                setShowAmbientModal(
                  true
                )
              }
              className="h-9 px-3 rounded-xl bg-white/5 border border-white/5 text-[#22C7F2] hover:bg-[#22C7F2]/10 transition-all flex items-center gap-1.5 font-mono text-[11px]"
            >
              <Sliders className="w-3.5 h-3.5" />

              <span>
                Sounds
              </span>
            </button>

            {/* Terminal */}

            <button
              onClick={() =>
                setShowIdeModal(
                  true
                )
              }
              className="h-9 px-3 rounded-xl bg-white/5 border border-white/5 text-emerald-400 hover:bg-emerald-400/10 transition-all flex items-center gap-1.5 font-mono text-[11px]"
            >
              <Code className="w-3.5 h-3.5" />

              <span>
                Terminal
              </span>
            </button>

            {/* Lamp */}

            <button
              onClick={() =>
                setLampOn(!lampOn)
              }
              className={`h-9 w-9 rounded-xl bg-white/5 border border-white/5 transition-all flex items-center justify-center ${
                lampOn
                  ? 'text-[#FFD18A]'
                  : 'text-slate-500'
              }`}
              title="Study Lamp"
            >
              <Lightbulb
                className={`w-3.5 h-3.5 ${
                  lampOn
                    ? 'fill-[#FFD18A]'
                    : ''
                }`}
              />
            </button>

            {/* Character */}

            <button
              onClick={() =>
                setCharacterGender(
                  characterGender ===
                    'boy'
                    ? 'girl'
                    : 'boy'
                )
              }
              className={`h-9 w-9 rounded-xl bg-white/5 border border-white/5 transition-all flex items-center justify-center text-sm ${
                characterGender ===
                'girl'
                  ? 'text-[#FB7185]'
                  : 'text-[#22C7F2]'
              }`}
              title="Switch Character"
            >
              {characterGender ===
              'girl'
                ? '👩‍💻'
                : '👨‍💻'}
            </button>

            {/* Shortcuts */}

            <button
              onClick={() =>
                setShowShortcutsModal(
                  true
                )
              }
              className="h-9 w-9 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all flex items-center justify-center"
              title="Keyboard Shortcuts"
            >
              <Command className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          MOBILE BOTTOM TOOLBAR — always visible, no hamburger
      ================================================= */}

      {!zenMode && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom">
          <div className="bg-[#07131F]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
            <div className="scroll-tabs flex items-center gap-2 px-3 py-2.5 overflow-x-auto">

              <button
                onClick={() => setShowPlaylistModal(true)}
                className="shrink-0 flex flex-col items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#22C7F2] active:scale-95 transition-all"
              >
                <ListMusic className="w-4.5 h-4.5" />
                <span className="text-[10px] font-mono no-truncate">Playlist</span>
              </button>

              <button
                onClick={() => setShowTimeOfDayModal(true)}
                className="shrink-0 flex flex-col items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#FFD18A] active:scale-95 transition-all"
              >
                <Clock className="w-4.5 h-4.5" />
                <span className="text-[10px] font-mono no-truncate">Mood</span>
              </button>

              <button
                onClick={() => setShowPomodoroModal(true)}
                className="shrink-0 flex flex-col items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#FFD18A] active:scale-95 transition-all"
              >
                <Timer className="w-4.5 h-4.5" />
                <span className="text-[10px] font-mono no-truncate">Timer</span>
              </button>

              <button
                onClick={() => setShowAmbientModal(true)}
                className="shrink-0 flex flex-col items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#22C7F2] active:scale-95 transition-all"
              >
                <Sliders className="w-4.5 h-4.5" />
                <span className="text-[10px] font-mono no-truncate">Sounds</span>
              </button>

              <button
                onClick={() => setShowIdeModal(true)}
                className="shrink-0 flex flex-col items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 active:scale-95 transition-all"
              >
                <Code className="w-4.5 h-4.5" />
                <span className="text-[10px] font-mono no-truncate">Terminal</span>
              </button>

              <button
                onClick={() => setLampOn(!lampOn)}
                className={`shrink-0 flex flex-col items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 active:scale-95 transition-all ${
                  lampOn ? 'text-[#FFD18A]' : 'text-slate-500'
                }`}
              >
                <Lightbulb className={`w-4.5 h-4.5 ${lampOn ? 'fill-[#FFD18A]' : ''}`} />
                <span className="text-[10px] font-mono no-truncate">Lamp</span>
              </button>

              <button
                onClick={() =>
                  setCharacterGender(characterGender === 'boy' ? 'girl' : 'boy')
                }
                className={`shrink-0 flex flex-col items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 active:scale-95 transition-all ${
                  characterGender === 'girl' ? 'text-[#FB7185]' : 'text-[#22C7F2]'
                }`}
              >
                <span className="text-base leading-none">
                  {characterGender === 'girl' ? '👩‍💻' : '👨‍💻'}
                </span>
                <span className="text-[10px] font-mono no-truncate">
                  {characterGender === 'girl' ? 'Girl' : 'Boy'}
                </span>
              </button>

              <button
                onClick={() => setShowShortcutsModal(true)}
                className="shrink-0 flex flex-col items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 active:scale-95 transition-all"
              >
                <Command className="w-4.5 h-4.5" />
                <span className="text-[10px] font-mono no-truncate">Keys</span>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* =================================================
          ZEN MODE EXIT
      ================================================= */}

      {zenMode && (
        <button
          onClick={() =>
            setZenMode(false)
          }
          className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full bg-[#07131F]/90 border border-[#22C7F2]/50 text-[#22C7F2] font-mono text-xs flex items-center gap-2 backdrop-blur-md shadow-2xl hover:bg-[#22C7F2] hover:text-[#07131F] transition-all font-bold"
        >
          <Eye className="w-4 h-4" />

          <span>
            Exit Zen Mode
          </span>
        </button>
      )}

      {/* =================================================
          MAIN HERO
      ================================================= */}

      <main className="relative z-10 w-full h-full flex flex-col items-center justify-end px-4 sm:px-6 pb-28 md:pb-[8vh]">

        {/* Ambient Glow */}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none">

          <div className="absolute top-0 left-10 w-64 h-64 rounded-full bg-[#22C7F2]/10 blur-3xl" />

          <div className="absolute bottom-0 right-10 w-64 h-64 rounded-full bg-[#FFD18A]/10 blur-3xl" />

        </div>

        {/* =================================================
            PLAYER
        ================================================= */}

        <div className="w-full max-w-md relative z-10">

          {/* Floating Notes */}

          {isPlaying && (
            <div className="absolute -top-7 right-8 pointer-events-none z-20 flex items-center gap-3 text-[#22C7F2]">

              <span className="animate-float-note-1 text-sm font-bold opacity-80">
                ♪
              </span>

              <span className="animate-float-note-2 text-base font-bold text-[#FFD18A] opacity-90">
                ♫
              </span>

              <span className="animate-float-note-3 text-sm font-bold opacity-80">
                ♬
              </span>

            </div>
          )}

          {/* PLAYER CARD */}

          <div
            className={`w-full cinematic-glass rounded-3xl p-4 shadow-2xl transition-all duration-500 space-y-3.5 text-left relative overflow-hidden border border-white/15 ${
              isPlaying
                ? 'player-glow-active'
                : ''
            }`}
          >

            {/* Neon Line */}

            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#22C7F2] to-transparent opacity-60" />

            {/* TRACK INFO */}

            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-3 min-w-0">

                {/* Cover */}

                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/20 shadow-xl bg-black flex items-center justify-center">

                  <img
                    src={
                      currentTrack.coverUrl
                    }
                    alt={
                      currentTrack.title
                    }
                    className={`w-full h-full object-cover rounded-full ${
                      isPlaying
                        ? 'animate-spin-vinyl'
                        : 'animate-spin-vinyl-paused'
                    }`}
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute w-3.5 h-3.5 rounded-full bg-[#07131F] border-2 border-[#22C7F2] flex items-center justify-center">

                    <div className="w-1 h-1 rounded-full bg-white" />

                  </div>

                </div>

                {/* Title */}

                <div className="min-w-0">

                  <p className="text-xs font-bold text-[#F5F7FA] break-words font-mono">
                    {currentTrack.title}
                  </p>

                  <p className="text-[11px] text-slate-400 break-words font-mono mt-0.5">
                    {currentTrack.artist}
                  </p>

                </div>

              </div>

              {/* Genre */}

              <div className="flex flex-col items-end shrink-0 gap-1">

                <span className="px-2 py-0.5 rounded-full bg-[#22C7F2]/10 border border-[#22C7F2]/30 text-[10px] font-mono text-[#22C7F2] font-bold">
                  {currentTrack.genre}
                </span>

                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-3.5">

                    <span className="w-0.5 bg-[#22C7F2] rounded-full animate-eq-1" />
                    <span className="w-0.5 bg-[#22C7F2] rounded-full animate-eq-2" />
                    <span className="w-0.5 bg-[#22C7F2] rounded-full animate-eq-3" />
                    <span className="w-0.5 bg-[#22C7F2] rounded-full animate-eq-4" />
                    <span className="w-0.5 bg-[#22C7F2] rounded-full animate-eq-5" />

                  </div>
                )}

              </div>

            </div>

            {/* PROGRESS */}

            <div className="space-y-1 font-mono text-[10px] text-slate-400">

              <div className="w-full h-1.5 rounded-full bg-black/50 border border-white/10 overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-[#22C7F2] to-[#FFD18A] transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (currentTime /
                        Math.max(
                          duration,
                          1
                        )) *
                        100
                    )}%`,
                  }}
                />

              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-bold">

                <span>
                  {formatTime(
                    currentTime
                  )}
                </span>

                <span>
                  {currentTrack.duration}
                </span>

              </div>

            </div>

            {/* CONTROLS */}

            <div className="flex items-center justify-between">

              {/* Player Buttons */}

              <div className="flex items-center gap-2">

                <button
                  onClick={
                    handlePrevTrack
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={
                    togglePlay
                  }
                  className="w-9 h-9 rounded-full bg-[#22C7F2] text-[#07131F] flex items-center justify-center transition-all active:scale-95 shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-[#07131F]" />
                  ) : (
                    <Play className="w-4 h-4 fill-[#07131F] ml-0.5" />
                  )}
                </button>

                <button
                  onClick={
                    handleNextTrack
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

              </div>

              {/* Volume */}

              <div className="flex items-center gap-2">

                <button
                  onClick={
                    toggleMute
                  }
                  className="text-slate-400 hover:text-white"
                >
                  {isMuted ||
                  volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={
                    isMuted
                      ? 0
                      : volume
                  }
                  onChange={
                    handleVolumeChange
                  }
                  className="w-14 h-1 accent-[#22C7F2]"
                />

                <button
                  onClick={() =>
                    setShowPlaylistModal(
                      true
                    )
                  }
                  className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-[#22C7F2] transition-all"
                >
                  <ListMusic className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

      {/* =================================================
          PLAYLIST MODAL
      ================================================= */}

      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">

          <div className="w-full max-w-xl max-h-[90vh] overflow-hidden bg-[#0B2235] border border-white/15 rounded-3xl p-4 sm:p-6 shadow-2xl relative">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">

              <div className="flex items-center gap-3 min-w-0">

                <div className="p-2 rounded-xl bg-[#22C7F2]/10 border border-[#22C7F2]/30">

                  <ListMusic className="w-5 h-5 text-[#22C7F2]" />

                </div>

                <div className="min-w-0">

                  <h3 className="font-bold text-lg text-white break-words">
                    CODING PLAYLIST (
                    {
                      DEFAULT_TRACKS.length
                    } TRACKS)
                  </h3>

                  <p className="text-[11px] text-slate-400 break-words">
                    90s Hindi Classics, Rain Songs & Lo-Fi Focus
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setShowPlaylistModal(
                    false
                  )
                }
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Search */}

            <div className="relative mb-3">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                placeholder="Search songs, artists..."
                value={
                  searchQuery
                }
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-[#22C7F2]/50"
              />

            </div>

            {/* Genres */}

            <div className="flex gap-1.5 overflow-x-auto pb-3">

              {[
                'All',
                'Rain',
                '90s',
                'Bollywood',
                'Romantic',
                'Classic',
                'Lo-Fi',
              ].map(
                (tag) => {

                  const count =
                    tag === 'All'
                      ? DEFAULT_TRACKS.length
                      : DEFAULT_TRACKS.filter(
                          (t) =>
                            t.genre
                              .toLowerCase()
                              .includes(
                                tag.toLowerCase()
                              )
                        ).length;

                  return (
                    <button
                      key={tag}
                      onClick={() =>
                        setSelectedGenre(
                          tag
                        )
                      }
                      className={`px-3 py-1 rounded-full border shrink-0 text-[11px] ${
                        selectedGenre ===
                        tag
                          ? 'bg-[#22C7F2] text-[#07131F] border-[#22C7F2] font-bold'
                          : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      {tag}
                      {' '}
                      ({count})
                    </button>
                  );
                }
              )}

            </div>

            {/* Tracks */}

            <div className="space-y-2 max-h-72 overflow-y-auto">

              {filteredTracks.map(
                (track) => {

                  const originalIdx =
                    DEFAULT_TRACKS.findIndex(
                      (t) =>
                        t.id ===
                        track.id
                    );

                  const isCurrent =
                    currentTrackIdx ===
                    originalIdx;

                  return (
                    <div
                      key={
                        track.id
                      }
                      onClick={() => {

                        setCurrentTrackIdx(
                          originalIdx
                        );

                        setCurrentTime(
                          0
                        );

                        setDuration(
                          track.durationSec
                        );

                        setIsPlaying(
                          true
                        );

                        setShowPlaylistModal(
                          false
                        );
                      }}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#22C7F2]/15 border-[#22C7F2]/50'
                          : 'bg-white/5 border-white/5'
                      }`}
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <span className="text-xs text-slate-500 w-4">
                          {originalIdx +
                            1}
                        </span>

                        <img
                          src={
                            track.coverUrl
                          }
                          alt={
                            track.title
                          }
                          className="w-10 h-10 rounded-xl object-cover"
                        />

                        <div className="min-w-0">

                          <p className="text-xs font-bold text-white break-words">
                            {
                              track.title
                            }
                          </p>

                          <p className="text-[11px] text-slate-400 break-words">
                            {
                              track.artist
                            }
                          </p>

                        </div>

                      </div>

                      <span className="text-xs text-slate-400 shrink-0">
                        {
                          track.duration
                        }
                      </span>

                    </div>
                  );
                }
              )}

            </div>

            {/* Footer */}

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">

              <span className="text-[10px] text-slate-500 break-words">
                {PLAYLIST_ID}
              </span>

              <a
                href="https://youtube.com/playlist?list=PLrQCktvMYPpDin_kQUIm61mmGJI6ZHPAK&si=UiTDeH6CXLEmtyKy"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#22C7F2]/10 border border-[#22C7F2]/30 text-[#22C7F2] text-xs flex items-center gap-1.5 shrink-0"
              >
                Open Playlist
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          POMODORO MODAL
      ================================================= */}

      {showPomodoroModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">

          <div className="w-full max-w-md relative">

            <button
              onClick={() =>
                setShowPomodoroModal(
                  false
                )
              }
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-[#07131F] border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>

            <PomodoroTimer />

          </div>

        </div>
      )}

      {/* =================================================
          AMBIENT MODAL
      ================================================= */}

      {showAmbientModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">

          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0B2235] border border-white/15 rounded-3xl p-5 relative">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-2">

                <Sliders className="w-5 h-5 text-[#22C7F2]" />

                <h3 className="font-bold text-lg text-white">
                  AMBIENT SOUNDSCAPE MIXER
                </h3>

              </div>

              <button
                onClick={() =>
                  setShowAmbientModal(
                    false
                  )
                }
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <AmbientMixer />

          </div>

        </div>
      )}

      {/* =================================================
          IDE MODAL
      ================================================= */}

      {showIdeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">

          <div className="relative max-w-full overflow-auto">

            <button
              onClick={() =>
                setShowIdeModal(
                  false
                )
              }
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-[#07131F] border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>

            <ComputerMonitorIDE />

          </div>

        </div>
      )}

      {/* =================================================
          SHORTCUTS
      ================================================= */}

      <ShortcutsModal
        isOpen={
          showShortcutsModal
        }
        onClose={() =>
          setShowShortcutsModal(
            false
          )
        }
      />

      {/* =================================================
          ABOUT MODAL
      ================================================= */}

      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-[#0B2235] border border-white/15 rounded-3xl p-6 shadow-2xl">

            <div className="flex items-center justify-between border-b border-white/10 pb-3">

              <div className="flex items-center gap-2">

                <Info className="w-5 h-5 text-[#22C7F2]" />

                <h3 className="font-bold text-lg text-white">
                  ABOUT CODEBUDDIES RADIO
                </h3>

              </div>

              <button
                onClick={() =>
                  setShowAboutModal(
                    false
                  )
                }
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="mt-4 text-xs text-slate-300 leading-relaxed space-y-3">

              <p>
                <strong>
                  CodeBuddies Radio
                </strong>{' '}
                is an aesthetic digital coding sanctuary crafted for developers. Zone in with lo-fi beats and nostalgia while writing code.
              </p>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">

                <p className="text-[#22C7F2] font-bold mb-2">
                  Keyboard Shortcuts
                </p>

                <ul className="space-y-1 text-slate-400">

                  <li>
                    Space — Play / Pause
                  </li>

                  <li>
                    ← / → — Previous / Next
                  </li>

                  <li>
                    T — Pomodoro
                  </li>

                  <li>
                    S — Ambient Sounds
                  </li>

                  <li>
                    I — Live IDE
                  </li>

                  <li>
                    Z — Zen Mode
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          TIME OF DAY
      ================================================= */}

      <TimeOfDayModal
        isOpen={
          showTimeOfDayModal
        }
        onClose={() =>
          setShowTimeOfDayModal(
            false
          )
        }
        currentPeriod={
          timePeriod
        }
        isAutoMode={
          isAutoTime
        }
        onSelectPeriod={(
          period,
          isAuto
        ) => {
          setTimePeriod(
            period
          );

          setIsAutoTime(
            isAuto
          );
        }}
        systemPeriod={
          systemPeriod
        }
        formattedTime={
          formattedClock
        }
        characterGender={
          characterGender
        }
        onSelectGender={
          setCharacterGender
        }
      />

    </div>
  );
}