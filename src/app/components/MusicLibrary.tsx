"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Album, Song, Era } from "../types/music";
import { usePlayerStore } from "../store/usePlayerStore";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";

interface MusicLibraryProps {
  albums: Album[];
}

const ERAS: Era[] = [
  "50s",
  "60s",
  "70s",
  "80s",
  "90s",
  "2000s",
  "2010s",
  "2020s",
];

export default function MusicLibrary({ albums = [] }: MusicLibraryProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const { currentSong, isPlaying, setCurrentSong, setPlaylist, pause } =
    usePlayerStore();

  // Group albums by era
  const albumsByEra = useMemo(() => {
    const grouped = new Map<Era, Album[]>();
    ERAS.forEach((era) => grouped.set(era, []));

    // Ensure albums is an array before calling forEach
    if (Array.isArray(albums)) {
      albums.forEach((album) => {
        const era = album.era as Era;
        if (grouped.has(era)) {
          grouped.get(era)!.push(album);
        }
      });
    }

    return grouped;
  }, [albums]);

  const handleSongClick = (song: Song, album: Album) => {
    if (currentSong?.id === song.id) {
      pause();
    } else {
      setPlaylist(album.songs);
      setCurrentSong(song);
    }
  };

  // If no albums are available, show a message
  if (!Array.isArray(albums) || albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Music Available
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          Upload some music files to get started. Files should be named in the
          format: artist-album-year-song.mp3
        </p>
      </div>
    );
  }

  if (selectedAlbum) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedAlbum(null)}
          className="mb-6 text-blue-600 hover:text-blue-700"
        >
          ← Back to Albums
        </button>

        <div className="flex items-start space-x-6">
          {selectedAlbum.coverUrl && (
            <div className="relative w-48 h-48">
              <Image
                src={selectedAlbum.coverUrl}
                alt={selectedAlbum.title}
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedAlbum.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedAlbum.artist} • {selectedAlbum.year} •{" "}
              {selectedAlbum.era}
            </p>

            <div className="mt-6 space-y-2">
              {selectedAlbum.songs.map((song) => (
                <div
                  key={song.id}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                    currentSong?.id === song.id
                      ? "bg-gray-100 dark:bg-gray-800"
                      : ""
                  }`}
                  onClick={() => handleSongClick(song, selectedAlbum)}
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {song.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDuration(song.duration)}
                    </p>
                  </div>

                  {currentSong?.id === song.id &&
                    (isPlaying ? (
                      <PauseIcon className="w-6 h-6 text-blue-600" />
                    ) : (
                      <PlayIcon className="w-6 h-6 text-blue-600" />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {ERAS.map((era) => {
        const eraAlbums = albumsByEra.get(era) || [];
        if (eraAlbums.length === 0) return null;

        return (
          <div key={era} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {era}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {eraAlbums.map((album) => (
                <div
                  key={album.id}
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedAlbum(album)}
                >
                  {album.coverUrl ? (
                    <div className="relative w-full aspect-square">
                      <Image
                        src={album.coverUrl}
                        alt={album.title}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">{album.title[0]}</span>
                    </div>
                  )}
                  <h3 className="mt-2 font-medium text-gray-900 dark:text-white">
                    {album.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {album.artist} • {album.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
