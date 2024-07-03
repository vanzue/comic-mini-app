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
