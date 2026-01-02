export const API_KEY = 'c477878444affbf19e4818802309df39';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_PATH = 'https://image.tmdb.org/t/p/original';
export const LOGO_SIZE = 'w500';

export const REQUESTS = {
  fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213&language=en-US`,
  fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&language=en-US`,
  fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&language=en-US`,
  fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&language=en-US`,
  fetchRomanceMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749&language=en-US`,
  fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99&language=en-US`,
  fetchSciFiMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=878&language=en-US`,
  
  // TV Specifics
  fetchActionTV: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10759&language=en-US`,
  fetchComedyTV: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=35&language=en-US`,
  fetchDramaTV: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=18&language=en-US`,
  fetchCrimeTV: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=80&language=en-US`,
  fetchRealityTV: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=10764&language=en-US`,

  // New & Popular Specifics
  fetchTrendingTV: `${BASE_URL}/trending/tv/day?api_key=${API_KEY}&language=en-US`,
  fetchTrendingMovies: `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US`,
  fetchUpcoming: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,

  searchMulti: `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&include_adult=false`,
};

export const GENRES: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};