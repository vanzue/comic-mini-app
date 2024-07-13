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

export interface PollingOptions {
  jobId: string;
  interval: number; // 轮询间隔时间，单位毫秒
  maxAttempts?: number;
  onSuccess: (response: any) => void; 
  onFailure: (error: any) => void; 
}
