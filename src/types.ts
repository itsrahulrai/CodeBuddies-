export interface Track {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  duration: string;
  durationSec: number;
  coverUrl: string;
  genre: string;
}

export interface SoundChannel {
  id: 'rain' | 'keyboard' | 'cafe' | 'vinyl' | 'waves';
  name: string;
  icon: string;
  volume: number;
  active: boolean;
  color: string;
}

export interface CodeSnippet {
  id: string;
  filename: string;
  language: string;
  description: string;
  code: string;
}

export interface DeveloperMemory {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  quote: string;
  likes: number;
  isLiked?: boolean;
  tag: 'Meme' | 'Relatable' | 'Fix' | '2 AM';
}

export type CanvasMode = 'particles' | 'matrix' | 'rain' | 'stars';

export interface PomodoroSettings {
  workTime: number; // in seconds
  breakTime: number; // in seconds
}
