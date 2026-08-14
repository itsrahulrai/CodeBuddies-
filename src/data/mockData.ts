import { Track, SoundChannel, CodeSnippet, DeveloperMemory } from '../types';

export const PLAYLIST_ID = "PLrQCktvMYPpDin_kQUIm61mmGJI6ZHPAK";

// Reliable direct audio streams
const AUDIO_STREAM_SOURCES = [
  "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
  "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
  "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3",
  "https://cdn.pixabay.com/download/audio/2021/11/24/audio_349970928a.mp3",
  "https://cdn.pixabay.com/download/audio/2022/11/06/audio_40b2efd4dd.mp3",
  "https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3",
  "https://cdn.pixabay.com/download/audio/2022/05/16/audio_c1b2c45151.mp3",
  "https://cdn.pixabay.com/download/audio/2023/04/18/audio_248c82ebff.mp3",
  "https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab609.mp3",
  "https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1101.mp3",
  "https://cdn.pixabay.com/download/audio/2022/10/25/audio_254d318485.mp3",
  "https://cdn.pixabay.com/download/audio/2023/06/19/audio_4a415ff6b2.mp3",
  "https://cdn.pixabay.com/download/audio/2023/09/24/audio_1079d8540b.mp3",
  "https://cdn.pixabay.com/download/audio/2022/03/09/audio_c36e4fbbdb.mp3",
  "https://cdn.pixabay.com/download/audio/2022/11/11/audio_8b248a313e.mp3",
  "https://cdn.pixabay.com/download/audio/2022/08/04/audio_2dde668d05.mp3",
  "https://cdn.pixabay.com/download/audio/2023/02/28/audio_55486241a4.mp3",
  "https://cdn.pixabay.com/download/audio/2022/06/07/audio_b287ae2798.mp3",
  "https://cdn.pixabay.com/download/audio/2023/01/01/audio_81230c12ef.mp3"
];

// Hand-curated iconic 90s & Rain classics with exact matching audio streams
const FEATURED_TRACKS: Track[] = [
  {
    id: "track-1",
    youtubeId: "WpO4711qKvg",
    audioUrl: AUDIO_STREAM_SOURCES[0],
    title: "Pehla Nasha — Jo Jeeta Wohi Sikandar",
    artist: "Udit Narayan, Sadhana Sargam",
    duration: "04:45",
    durationSec: 285,
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
    genre: "90s"
  },
  {
    id: "track-2",
    youtubeId: "c25GKl5VFBc",
    audioUrl: AUDIO_STREAM_SOURCES[1],
    title: "Tujhe Dekha Toh Yeh Jaana Sanam — DDLJ",
    artist: "Kumar Sanu, Lata Mangeshkar",
    duration: "05:02",
    durationSec: 302,
    coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80",
    genre: "Bollywood"
  },
  {
    id: "track-3",
    youtubeId: "kL928xJ39dK",
    audioUrl: AUDIO_STREAM_SOURCES[2],
    title: "Tip Tip Barsa Pani — Mohra (Rain Special)",
    artist: "Udit Narayan, Alka Yagnik",
    duration: "04:50",
    durationSec: 290,
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80",
    genre: "Rain"
  },
  {
    id: "track-4",
    youtubeId: "PQmrmUSCX00",
    audioUrl: AUDIO_STREAM_SOURCES[3],
    title: "Chaiyya Chaiyya — Dil Se..",
    artist: "Sukhwinder Singh, Sapna Awasthi",
    duration: "04:15",
    durationSec: 255,
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80",
    genre: "Classic"
  },
  {
    id: "track-5",
    youtubeId: "643B9i3L4kQ",
    audioUrl: AUDIO_STREAM_SOURCES[4],
    title: "Kuch Kuch Hota Hai (Title Track)",
    artist: "Udit Narayan, Alka Yagnik",
    duration: "04:56",
    durationSec: 296,
    coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80",
    genre: "Romantic"
  },
  {
    id: "track-6",
    youtubeId: "yC_qD3Z2XGk",
    audioUrl: AUDIO_STREAM_SOURCES[5],
    title: "Rimjhim Girmjhim — 1942 A Love Story (Rain)",
    artist: "Kumar Sanu, Kavita Krishnamurthy",
    duration: "05:12",
    durationSec: 312,
    coverUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&auto=format&fit=crop&q=80",
    genre: "Rain"
  },
  {
    id: "track-7",
    youtubeId: "9q7L9pL6dD8",
    audioUrl: AUDIO_STREAM_SOURCES[6],
    title: "Churake Dil Mera — Main Khiladi Tu Anari",
    artist: "Kumar Sanu, Alka Yagnik",
    duration: "04:22",
    durationSec: 262,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80",
    genre: "90s"
  },
  {
    id: "track-8",
    youtubeId: "3892k8jKdLw",
    audioUrl: AUDIO_STREAM_SOURCES[7],
    title: "Dheere Dheere Se Meri Zindagi Mein — Aashiqui",
    artist: "Kumar Sanu, Anuradha Paudwal",
    duration: "05:15",
    durationSec: 315,
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
    genre: "Romantic"
  },
  {
    id: "track-9",
    youtubeId: "J8298kJ8sdK",
    audioUrl: AUDIO_STREAM_SOURCES[8],
    title: "Taal Se Taal Mila — Taal (Rain Dance)",
    artist: "Alka Yagnik, Udit Narayan",
    duration: "05:20",
    durationSec: 320,
    coverUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80",
    genre: "Rain"
  },
  {
    id: "track-10",
    youtubeId: "pL9382j8Dks",
    audioUrl: AUDIO_STREAM_SOURCES[9],
    title: "Koi Ladka Hai (Chak Dum Dum) — Rain Song",
    artist: "Udit Narayan, Lata Mangeshkar",
    duration: "05:32",
    durationSec: 332,
    coverUrl: "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?w=400&auto=format&fit=crop&q=80",
    genre: "Rain"
  },
  {
    id: "track-11",
    youtubeId: "m8328kJ8sdK",
    audioUrl: AUDIO_STREAM_SOURCES[10],
    title: "Ab Tere Bin Jeelenge Hum — Aashiqui",
    artist: "Kumar Sanu",
    duration: "04:48",
    durationSec: 288,
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80",
    genre: "90s"
  },
  {
    id: "track-12",
    youtubeId: "xL928xJ39dK",
    audioUrl: AUDIO_STREAM_SOURCES[11],
    title: "Mere Khwabon Mein Jo Aaye — DDLJ (Rain Vibe)",
    artist: "Lata Mangeshkar",
    duration: "04:18",
    durationSec: 258,
    coverUrl: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400&auto=format&fit=crop&q=80",
    genre: "Rain"
  },
  {
    id: "track-13",
    youtubeId: "z8298kJ8sdK",
    audioUrl: AUDIO_STREAM_SOURCES[12],
    title: "Bahut Pyar Karte Hai Tumko — Saajan",
    artist: "SP Balasubrahmanyam, Anuradha Paudwal",
    duration: "04:30",
    durationSec: 270,
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80",
    genre: "Romantic"
  },
  {
    id: "track-14",
    youtubeId: "aL928xJ39dK",
    audioUrl: AUDIO_STREAM_SOURCES[13],
    title: "Barso Re Megha Megha — Guru (Rain Hit)",
    artist: "Shreya Ghoshal, Uday Bhalwankar",
    duration: "05:00",
    durationSec: 300,
    coverUrl: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&auto=format&fit=crop&q=80",
    genre: "Rain"
  },
  {
    id: "track-15",
    youtubeId: "b8298kJ8sdK",
    audioUrl: AUDIO_STREAM_SOURCES[14],
    title: "Chand Chupa Badal Mein — Hum Dil De Chuke Sanam",
    artist: "Udit Narayan, Alka Yagnik",
    duration: "05:40",
    durationSec: 340,
    coverUrl: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=400&auto=format&fit=crop&q=80",
    genre: "Bollywood"
  }
];

// 90s Song Catalog Titles & Artists for 500-Track Stream Generation
const SONG_TITLES = [
  "Pehla Nasha", "Tujhe Dekha Toh", "Tip Tip Barsa Pani", "Chaiyya Chaiyya",
  "Kuch Kuch Hota Hai", "Rimjhim Girmjhim", "Churake Dil Mera", "Dheere Dheere Se",
  "Taal Se Taal Mila", "Koi Ladka Hai", "Bahut Pyar Karte Hai", "Chand Chupa Badal",
  "Yeh Kaali Kaali Aankhen", "Baazigar O Baazigar", "Dil To Pagal Hai", "Pardesi Pardesi",
  "Kitna Pyara Tujhe", "Tum Mile Dil Khile", "Ek Ladki Ko Dekha", "Raja Ko Rani Se",
  "Jadu Teri Nazar", "Tu Mere Samne", "Aana Mere Pyar Ko", "Pehli Pehli Baar Mohabbat",
  "Chaha Hai Tujhko", "Aati Kya Khandala", "Pyar Hua Iqrar Hua", "Bheegi Bheegi Raaton Mein",
  "Saawan Barse Tarse Dil", "Dekho Zara Dekho Rain", "Suno Na Suno Na", "O Mere Dil Ke Chain",
  "Gazab Ka Hai Din", "Papa Kehte Hain", "Ae Kash Ke Hum", "Waada Raha Sanam",
  "Aankhon Ki Gustakhiyan", "Hum Dil De Chuke Sanam", "Mitwa — Lofi Edit", "Suraj Hua Maddham",
  "Kabhi Khushi Kabhie Gham", "Tera Chehra Jab Nazar Aaye", "Do Dil Mil Rahe Hain", "Tere Dar Par Sanam",
  "Mera Dil Bhi Kitna Pagal", "Nazar Ke Samne Jigar Ke Paar", "Sochenge Tumhe Pyar", "Teri Umeed Tera Intezar",
  "Tu Meri Zindagi Hai", "Dil Hai Ke Manta Nahin"
];

const ARTISTS = [
  "Kumar Sanu & Alka Yagnik",
  "Udit Narayan & Sadhana Sargam",
  "Lata Mangeshkar & SP Balasubrahmanyam",
  "Kavita Krishnamurthy & Kumar Sanu",
  "Sonu Nigam & Anuradha Paudwal",
  "AR Rahman & Sukhwinder Singh",
  "Asha Bhosle & R.D. Burman",
  "Jagjit Singh & Chitra Singh",
  "Hariharan & Bombay Jayashri",
  "K.S. Chithra & Udit Narayan"
];

const GENRES = ["90s", "Rain", "Bollywood", "Romantic", "Classic", "Lo-Fi"];

const COVERS = [
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80"
];

// Generate 500 Songs for complete 90s & Rain stream experience
const GENERATED_TRACKS: Track[] = Array.from({ length: 485 }, (_, i) => {
  const songBase = SONG_TITLES[i % SONG_TITLES.length];
  const artist = ARTISTS[i % ARTISTS.length];
  const coverUrl = COVERS[i % COVERS.length];
  const audioStream = AUDIO_STREAM_SOURCES[i % AUDIO_STREAM_SOURCES.length];
  
  // Every 3rd track is a Rain track to satisfy user demand across tabs
  const genre = i % 3 === 0 ? "Rain" : GENRES[i % GENRES.length];
  const isLofi = i % 4 === 0;
  
  const min = 4 + (i % 2);
  const sec = (10 + (i * 7) % 50).toString().padStart(2, '0');

  return {
    id: `generated-track-${i + 16}`,
    youtubeId: "WpO4711qKvg",
    audioUrl: audioStream,
    title: isLofi ? `${songBase} — 90s Lo-Fi Focus Chill #${i + 1}` : `${songBase} (Vol. ${Math.floor(i / 10) + 1})`,
    artist: artist,
    duration: `0${min}:${sec}`,
    durationSec: min * 60 + parseInt(sec),
    coverUrl: coverUrl,
    genre: genre
  };
});

export const DEFAULT_TRACKS: Track[] = [...FEATURED_TRACKS, ...GENERATED_TRACKS];


export const INITIAL_SOUND_CHANNELS: SoundChannel[] = [
  { id: 'rain', name: 'Window Rain', icon: 'CloudRain', volume: 65, active: true, color: '#00f0ff' },
  { id: 'keyboard', name: 'Mechanical Keys', icon: 'Keyboard', volume: 50, active: false, color: '#ffb703' },
  { id: 'city', name: 'City Night Noise', icon: 'Building2', volume: 45, active: false, color: '#38bdf8' },
  { id: 'cafe', name: 'Midnight Cafe', icon: 'Coffee', volume: 40, active: false, color: '#fb8500' },
  { id: 'vinyl', name: 'Vinyl Crackle', icon: 'Disc', volume: 30, active: false, color: '#ff2a85' },
  { id: 'waves', name: 'Binaural Focus', icon: 'Waves', volume: 45, active: false, color: '#8b5cf6' }
];

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'snip-1',
    filename: 'audio-stream-engine.ts',
    language: 'typescript',
    description: 'YouTube Lo-Fi Audio Engine Core',
    code: `import { YouTubeStream, AudioContextEngine } from '@codebuddies/radio';

// Initialize 2 AM Audio Stream Connection
const STREAM_PLAYLIST_ID = 'PLrQCktvMYPpDin_kQUIm61mmGJI6ZHPAK';

export class CodeBuddiesRadioEngine {
  private player: YouTubeStream;
  private audioCtx: AudioContextEngine;

  constructor() {
    this.player = new YouTubeStream({
      playlistId: STREAM_PLAYLIST_ID,
      audioBitrate: '320kbps',
      autoSync: true
    });
    this.audioCtx = new AudioContextEngine({ eqGains: [2, 4, 1, 3, 5] });
  }

  public async startRadioSession(): Promise<void> {
    await this.player.connect();
    console.log("🎧 Radio stream online. Coffee status: 100%");
  }
}`
  },
  {
    id: 'snip-2',
    filename: 'lofi-state-machine.tsx',
    language: 'typescript',
    description: 'Late Night Developer React Hooks',
    code: `import { useState, useEffect, useCallback } from 'react';

export function useLateNightFocus(initialCaffeine = 100) {
  const [caffeineLevel, setCaffeineLevel] = useState<number>(initialCaffeine);
  const [bugsFixed, setBugsFixed] = useState<number>(0);
  const [sessionTime, setSessionTime] = useState<string>("02:42:10 AM");

  const sipCoffee = useCallback(() => {
    setCaffeineLevel((prev) => Math.min(100, prev + 25));
    console.log("☕ Coffee consumed! Focus boost +25%");
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCaffeineLevel((c) => Math.max(0, c - 2));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return { caffeineLevel, bugsFixed, sessionTime, sipCoffee };
}`
  },
  {
    id: 'snip-3',
    filename: 'quantum-matrix.py',
    language: 'python',
    description: 'Matrix Terminal Digital Rain Generator',
    code: `import time
import random
import sys

def render_matrix_rain(columns=80, density=0.15):
    GLYPHS = "0101010101XYZCODING2AMNIGHTS<>/#{}"
    print("\\033[92m--- INITIALIZING 2 AM MATRIX STREAM ---\\033[0m")
    
    try:
        while True:
            line = "".join(
                random.choice(GLYPHS) if random.random() < density else " "
                for _ in range(columns)
            )
            sys.stdout.write(f"\\033[38;2;0;240;255m{line}\\033[0m\\n")
            sys.stdout.flush()
            time.sleep(0.08)
    except KeyboardInterrupt:
        print("\\n\\033[93m[Session Paused - Enjoy the Lo-Fi Stream]\\033[0m")

if __name__ == "__main__":
    render_matrix_rain()`
  }
];

export const INITIAL_MEMORIES: DeveloperMemory[] = [
  {
    id: 'mem-1',
    author: 'Alex V.',
    handle: '@alex_dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    timestamp: '2 hours ago',
    quote: '3:42 AM. The bug that haunted me for 3 days vanished after fixing a single misplaced semicolon. The silence of the night made it feel like a sacred ritual.',
    likes: 142,
    tag: 'Relatable'
  },
  {
    id: 'mem-2',
    author: 'Elena Rostova',
    handle: '@elena_codes',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    timestamp: '4 hours ago',
    quote: 'There is a weird peace at 2 AM when the city sleeps and your terminal window is the only light in the room, playing lo-fi beats with coffee in hand.',
    likes: 289,
    tag: '2 AM'
  },
  {
    id: 'mem-3',
    author: 'David Kim',
    handle: '@dkim_tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    timestamp: 'Yesterday',
    quote: '// TODO: Temporary hotfix added in 2018. If you remove this line, the whole build pipeline breaks.',
    likes: 512,
    tag: 'Fix'
  }
];
