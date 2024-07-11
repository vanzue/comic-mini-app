import { Card } from "./types";

export function getSampleCards(): Card[] {
  return [
    { title: "Work Diary", subtitle: "RED", image: "https://comicstorage.blob.core.windows.net/comics/modern%20style%201-min.png", classification: "personal" },
    { title: "Love Story", subtitle: "RED", image: "https://comicstorage.blob.core.windows.net/comics/landing2.png", classification: "personal" },
    { title: "Therapeutic Series", subtitle: "RED", image: "https://comicstorage.blob.core.windows.net/comics/landing-3.png", classification: "personal" },
    { title: "Anniversary Celebrate", subtitle: "Enterprise", image: "https://comicstorage.blob.core.windows.net/comics/landing-4.png", classification: "govent" },
    { title: "Cafeteria Activities", subtitle: "Enterprise", image: "https://comicstorage.blob.core.windows.net/comics/landing-5.png", classification: "govent" },
    { title: "Publicity Report", subtitle: "Government", image: "https://comicstorage.blob.core.windows.net/comics/landing-6.png", classification: "govent" },
    { title: "Startup Experience", subtitle: "Tiktok", image: "https://comicstorage.blob.core.windows.net/comics/landing-7.png", classification: "social" },
    { title: "Heiress Romance", subtitle: "Tiktok", image: "https://comicstorage.blob.core.windows.net/comics/landing-8.png", classification: "social" },
    { title: "Nostalgic Childhood", subtitle: "Tiktok", image: "https://comicstorage.blob.core.windows.net/comics/landing-9.png", classification: "social" },
  ];
}