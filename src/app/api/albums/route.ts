import { NextResponse } from "next/server";
import { list, put } from "@vercel/blob";
import { Album, Era } from "../../types/music";
import { nanoid } from "nanoid";

// Mock data for development
const mockAlbums: Album[] = [
  {
    id: nanoid(),
    title: "Example Album",
    artist: "Example Artist",
    year: 2024,
    era: "2020s",
    songs: [
      {
        id: nanoid(),
        title: "Example Song 1",
        artist: "Example Artist",
        album: "Example Album",
        duration: 180,
        url: "",
        era: "2020s",
      },
      {
        id: nanoid(),
        title: "Example Song 2",
        artist: "Example Artist",
        album: "Example Album",
        duration: 210,
        url: "",
        era: "2020s",
      },
    ],
  },
  {
    id: nanoid(),
    title: "Retro Album",
    artist: "Retro Artist",
    year: 1985,
    era: "80s",
    songs: [
      {
        id: nanoid(),
        title: "Retro Song 1",
        artist: "Retro Artist",
        album: "Retro Album",
        duration: 240,
        url: "",
        era: "80s",
      },
    ],
  },
];

function getEraFromYear(year: number): Era {
  if (year < 1960) return "50s";
  if (year < 1970) return "60s";
  if (year < 1980) return "70s";
  if (year < 1990) return "80s";
  if (year < 2000) return "90s";
  if (year < 2010) return "2000s";
  if (year < 2020) return "2010s";
  return "2020s";
}

export async function GET() {
  try {
    // Check if BLOB_READ_WRITE_TOKEN is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("Vercel Blob token not configured, using mock data");
      return NextResponse.json(mockAlbums);
    }

    // List all blobs in the music directory
    const { blobs } = await list();

    // Group blobs by album (assuming filename format: artist-album-year-song.mp3)
    const albumMap = new Map<string, Album>();

    blobs.forEach((blob) => {
      const filename = blob.pathname.split("/").pop() || "";
      const [artist, album, yearStr, ...songParts] = filename.split("-");
      const songTitle = songParts.join("-").replace(".mp3", "");
      const year = parseInt(yearStr) || new Date().getFullYear();
      const era = getEraFromYear(year);

      const albumKey = `${artist}-${album}-${year}`;

      if (!albumMap.has(albumKey)) {
        albumMap.set(albumKey, {
          id: nanoid(),
          title: album,
          artist: artist,
          year: year,
          era: era,
          songs: [],
        });
      }

      const currentAlbum = albumMap.get(albumKey)!;
      currentAlbum.songs.push({
        id: nanoid(),
        title: songTitle,
        artist: artist,
        album: album,
        duration: 0,
        url: blob.url,
        era: era,
      });
    });

    const albums = Array.from(albumMap.values());
    return NextResponse.json(albums.length > 0 ? albums : mockAlbums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    // Return mock data in case of any error
    return NextResponse.json(mockAlbums);
  }
}

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert the file to ArrayBuffer
    const bytes = await file.arrayBuffer();

    // Upload to Vercel Blob
    const blob = await put(file.name, bytes, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
