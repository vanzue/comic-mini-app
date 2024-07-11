export interface Card {
  image: string;
  title: string;
  subtitle: string;
  classification: string;
}

export interface LogonResponse {
  profile_done: boolean;
  session_token: string;
  user_description: string;
  seed: string;
  style: string;
}

export interface ComicPhoto {
  compressed_url: string,
  url: string,
  character: string,
  style: string,
  seed: string,
}

export interface CharacterStoryComic {
  compressed_url: string,
  url: string,
}

// keep consistent with web interface.
export interface ComicCollection {
  CollectionName: string,
  CompressedComics: string[],
  Comics: string[]
}