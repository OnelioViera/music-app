export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  coverUrl?: string;
  year?: number;
  genre?: string;
  era?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  era: string;
  coverUrl?: string;
  songs: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  createdAt: Date;
  updatedAt: Date;
}

export type PlayerState = {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  playlist: Song[];
  currentIndex: number;
};

export type Era =
  | "50s"
  | "60s"
  | "70s"
  | "80s"
  | "90s"
  | "2000s"
  | "2010s"
  | "2020s";
