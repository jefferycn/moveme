export interface seasonResponse {
  episode_count: number;
  id: number;
  name: string;
  season_number: number;
}

export interface tvResponse {
  id: number;
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: seasonResponse[];
}

export interface episodeResponse {
  episode_number: number;
  id: number;
  name: string;
}

export interface stats {
  name: string;
  count: number;
}

export interface MatchResult {
  source: string;
  value: number;
}

export interface Prompt {
  type: String | Function;
  name: String | Function;
  message: String | Function;
  initial: String | Function;
  format: Function;
  onRender: Function;
  onState: Function;
}
