import axios from 'axios';
import { Movie } from '../types';

export interface SkipInterval {
    startTime: number;
    endTime: number;
    type: 'intro' | 'outro';
}

const INTRODB_BASE_URL = 'https://api.introdb.app';
const ANISKIP_BASE_URL = 'https://api.aniskip.com/v2';

/**
 * Fetches skip intervals for a TV show episode from IntroDB.
 */
const getIntroDBTimestamps = async (imdbId: string, season: number, episode: number): Promise<SkipInterval[]> => {
    try {
        const response = await axios.get(`${INTRODB_BASE_URL}/intro`, {
            params: {
                imdb_id: imdbId,
                season,
                episode,
            },
        });

        const data = response.data;
        if (data && data.start_ms && data.end_ms) {
            return [{
                startTime: data.start_ms / 1000,
                endTime: data.end_ms / 1000,
                type: 'intro',
            }];
        }
        return [];
    } catch (error) {
        // Silent fail is expected if no intro data exists
        return [];
    }
};

/**
 * Fetches skip intervals for an anime episode from AniSkip.
 * Requires a MyAnimeList (MAL) ID.
 */
const getAniSkipTimestamps = async (malId: number, episode: number): Promise<SkipInterval[]> => {
    try {
        const response = await axios.get(`${ANISKIP_BASE_URL}/skip-times/${malId}/${episode}`, {
            params: {
                types: ['op', 'ed'],
                episodeLength: 0, // Optional: helps with accuracy if known
            },
        });

        const results = response.data.results;
        if (!results || results.length === 0) return [];

        const intervals: SkipInterval[] = [];

        results.forEach((res: any) => {
            if (!res.interval || !res.skipType) return;

            const type = res.skipType === 'op' ? 'intro' : 'outro';
            intervals.push({
                startTime: res.interval.startTime,
                endTime: res.interval.endTime,
                type: type
            });
        });

        return intervals;
    } catch (error) {
        return [];
    }
};

/**
 * Main function to get skip intervals. Determines if content is Anime or TV Show
 * and routes to the appropriate provider.
 */
export const getSkipIntervals = async (
    movie: Movie,
    season: number,
    episode: number,
    imdbIdOverride?: string
): Promise<SkipInterval[]> => {
    // 0. Use override if provided
    const imdbId = imdbIdOverride || movie.imdb_id;

    // 1. Try AniSkip first if we suspect it's anime (or if we have a MAL ID)
    // Since we don't strictly have 'isAnime' flag in Movie type yet, we rely on having a MAL ID.
    // Note: Consumet often returns 'malId' in the movie object if it came from an anime provider.
    // We'll need to check if our Movie type fully supports this or if we pass it in differently. 

    // For now, let's assume if it has a MAL ID (mapped or direct), request AniSkip.
    // If we don't have that easily accessible, we might need to fetch it.

    // 2. Try IntroDB for standard TV shows if IMDb ID is present
    if (imdbId) {
        if (movie.media_type === 'tv' || !movie.media_type) { // Default to TV check if ambiguous but contains seasons
            const introDBResults = await getIntroDBTimestamps(imdbId, season, episode);
            if (introDBResults.length > 0) return introDBResults;
        }
    }

    // TODO: Add logic to fetch MAL ID for AniSkip if not present on Movie object
    // Currently, without a reliable way to know if it's anime + getting MAL ID, 
    // we primary support IntroDB for this iteration.

    return [];
};
