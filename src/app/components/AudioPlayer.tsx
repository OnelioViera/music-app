"use client";

import { useEffect, useRef } from "react";
import { Howl } from "howler";
import Image from "next/image";
import { usePlayerStore } from "../store/usePlayerStore";
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
} from "@heroicons/react/24/solid";

export default function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    volume,
    play,
    pause,
    nextSong,
    previousSong,
    setVolume,
  } = usePlayerStore();

  const howlerRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (currentSong) {
      if (howlerRef.current) {
        howlerRef.current.unload();
      }

      howlerRef.current = new Howl({
        src: [currentSong.url],
        volume: volume,
        html5: true,
        onend: () => {
          nextSong();
        },
      });

      if (isPlaying) {
        howlerRef.current.play();
      }
    }

    return () => {
      if (howlerRef.current) {
        howlerRef.current.unload();
      }
    };
  }, [currentSong, volume, isPlaying, nextSong]);

  useEffect(() => {
    if (howlerRef.current) {
      if (isPlaying) {
        howlerRef.current.play();
      } else {
        howlerRef.current.pause();
      }
    }
  }, [isPlaying]);

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentSong.coverUrl && (
            <div className="relative w-12 h-12">
              <Image
                src={currentSong.coverUrl}
                alt={currentSong.title}
                fill
                className="rounded-md object-cover"
              />
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {currentSong.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentSong.artist}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={previousSong}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <BackwardIcon className="w-6 h-6" />
          </button>

          <button
            onClick={isPlaying ? pause : play}
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6 text-white" />
            ) : (
              <PlayIcon className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={nextSong}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <ForwardIcon className="w-6 h-6" />
          </button>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24"
        />
      </div>
    </div>
  );
}
