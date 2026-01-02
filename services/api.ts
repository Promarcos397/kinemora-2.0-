import axios from 'axios';
import { API_KEY, BASE_URL } from '../constants';
import { VideoResponse, TMDBResponse, VideoResult } from '../types';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const getMovieVideos = async (id: number, type: 'movie' | 'tv') => {
  try {
    const response = await api.get<VideoResponse>(`/${type}/${id}/videos`);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching videos for ${type} ${id}:`, error);
    return [];
  }
};

export const getMovieImages = async (id: number, type: 'movie' | 'tv') => {
  try {
    const response = await api.get(`/${type}/${id}/images`, {
        params: { include_image_language: 'en,null' }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching images for ${type} ${id}:`, error);
    return null;
  }
};

export const getMovieCredits = async (id: number, type: 'movie' | 'tv') => {
  try {
    const response = await api.get(`/${type}/${id}/credits`);
    return response.data.cast || [];
  } catch (error) {
    console.error(`Error fetching credits for ${type} ${id}:`, error);
    return [];
  }
};

export const getMovieDetails = async (id: number, type: 'movie' | 'tv') => {
    try {
        const response = await api.get(`/${type}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for ${type} ${id}:`, error);
        return null;
    }
};

export const getSeasonDetails = async (id: number, seasonNumber: number) => {
    try {
        const response = await api.get(`/tv/${id}/season/${seasonNumber}`);
        return response.data.episodes || [];
    } catch (error) {
        console.error(`Error fetching season ${seasonNumber} for tv ${id}:`, error);
        return [];
    }
};

export const getRecommendations = async (id: number, type: 'movie' | 'tv') => {
  try {
    const response = await api.get<TMDBResponse>(`/${type}/${id}/recommendations`);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching recommendations for ${type} ${id}:`, error);
    return [];
  }
};

export const searchMovies = async (query: string) => {
  try {
    const response = await api.get<TMDBResponse>('/search/multi', {
        params: { 
            query, 
            include_adult: false 
        }
    });
    return response.data.results;
  } catch (error) {
    console.error("Search error", error);
    return [];
  }
};

// Generic fetcher that can handle full URLs (axios ignores baseURL if url is absolute)
export const fetchData = async (url: string) => {
    try {
        const response = await api.get<TMDBResponse>(url);
        return response.data.results;
    } catch (error) {
        console.error("Fetch error", error);
        return [];
    }
}

/**
 * Fetches the best available YouTube trailer for a given movie or TV show.
 * Priority:
 * 1. Site: YouTube
 * 2. Type: Trailer
 * 3. Fallback: First available YouTube video.
 * 
 * Note: We intentionally DO NOT prioritize 'Official' trailers because they often
 * have strict embedding restrictions (Error 150) preventing playback on external sites.
 */
export const fetchTrailer = async (id: number, type: 'movie' | 'tv'): Promise<string | null> => {
    try {
        const videos = await getMovieVideos(id, type);
        
        if (!videos || videos.length === 0) return null;

        // Filter for YouTube videos only
        const youtubeVideos = videos.filter(v => v.site === "YouTube");
        
        if (youtubeVideos.length === 0) return null;

        // 1. Filter by Type "Trailer"
        const trailers = youtubeVideos.filter(v => v.type === "Trailer");

        if (trailers.length > 0) {
            // Return first found trailer.
            // Prioritizing 'official' often leads to Error 150 (Embed Blocked).
            // Non-official uploads (e.g. from aggregators like 'Rotten Tomatoes Trailers') 
            // are more likely to allow embedding.
            return trailers[0].key;
        }

        // 2. Fallback to first available YouTube video if no "Trailer" type exists
        return youtubeVideos[0].key;

    } catch (error) {
        console.error("Error in fetchTrailer:", error);
        return null;
    }
};

export default api;