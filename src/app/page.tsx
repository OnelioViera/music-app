"use client";

import { useEffect, useState } from "react";
import { Album } from "./types/music";
import MusicLibrary from "./components/MusicLibrary";
import AudioPlayer from "./components/AudioPlayer";

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch albums from your API
    fetch("/api/albums")
      .then((res) => res.json())
      .then((data) => {
        setAlbums(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching albums:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Personal Music Player
          </h1>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto pb-24">
        <MusicLibrary albums={albums} />
      </main>

      <AudioPlayer />
    </div>
  );
}
