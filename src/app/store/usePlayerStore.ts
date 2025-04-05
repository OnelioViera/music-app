import { create } from "zustand";
import { PlayerState, Song } from "../types/music";

interface PlayerStore extends PlayerState {
  setCurrentSong: (song: Song) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  setPlaylist: (songs: Song[]) => void;
  nextSong: () => void;
  previousSong: () => void;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 1,
  playlist: [],
  currentIndex: -1,
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialState,

  setCurrentSong: (song: Song) =>
    set((state) => ({
      currentSong: song,
      isPlaying: true,
      currentIndex: state.playlist.findIndex((s) => s.id === song.id),
    })),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  setVolume: (volume: number) => set({ volume }),

  setPlaylist: (songs: Song[]) => set({ playlist: songs, currentIndex: 0 }),

  nextSong: () => {
    const { playlist, currentIndex } = get();
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      set({
        currentSong: playlist[nextIndex],
        currentIndex: nextIndex,
        isPlaying: true,
      });
    }
  },

  previousSong: () => {
    const { playlist, currentIndex } = get();
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      set({
        currentSong: playlist[prevIndex],
        currentIndex: prevIndex,
        isPlaying: true,
      });
    }
  },
}));
