
export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv' | 'person' | string;
  genre_ids?: number[];
  adult?: boolean;
  original_language?: string;
  // For search results when media_type is 'person'
  known_for?: Movie[];
  // Detailed fields
  runtime?: number;
  number_of_seasons?: number;
  genres?: { id: number; name: string }[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path?: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  vote_average: number;
  runtime?: number;
}

export interface TMDBResponse {
  results: Movie[];
  page: number;
  total_results: number;
  total_pages: number;
}

export interface VideoResult {
  key: string;
  site: string;
  type: string;
  official?: boolean;
  id?: string;
  iso_639_1?: string;
  iso_3166_1?: string;
  name?: string;
  size?: number;
}

export interface VideoResponse {
  results: VideoResult[];
}

export interface RowProps {
  title: string;
  fetchUrl?: string;
  data?: Movie[];
  onSelect: (movie: Movie) => void;
  isLargeRow?: boolean;
}
