/**
 * Consumet API Service
 * Connects to self-hosted Consumet API for movie/TV/Anime streaming
 * Primary provider: Goku
 */

const https = require('https');
const http = require('http');

// Consumet API hosted on Render
const CONSUMET_BASE = 'https://consumet-api-halv.onrender.com';

// Providers Configuration
const MOVIE_PROVIDERS = ['goku', 'flixhq', 'himovies', 'sflix'];
const ANIME_PROVIDERS = ['hianime'];
const ALL_PROVIDERS = [...MOVIE_PROVIDERS, ...ANIME_PROVIDERS];

// === BOOK SERVICE (MANGA & COMICS) ===
const BOOK_PROVIDERS = {
    MANGA: 'mangadex',
    COMICS: 'mangadex' // Reliable fallback for now
};

// Simple in-memory cache for prefetching
// Key: "title-year-type-season-episode", Value: Result Object
const streamCache = new Map();

/**
 * Make HTTP request to Consumet API
 */
function fetchAPI(path) {
    return new Promise((resolve, reject) => {
        const url = `${CONSUMET_BASE}${path}`;
        console.log(`[Consumet] Fetching: ${url}`);

        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    console.error('[Consumet] Parse error:', e.message);
                    resolve(null);
                }
            });
        }).on('error', (err) => {
            console.error('[Consumet] Request error:', err.message);
            resolve(null);
        });
    });
}

const { MANGA } = require('@consumet/extensions');
const path = require('path');
const fs = require('fs');

// INTERNAL Providers
// const suwayomi = require('./suwayomi-service.cjs'); // DEPRECATED

const goku = new MANGA.MangaDex();

let USE_SUWAYOMI = false; // Disabled in favor of direct scraping



/**
 * Search for Books (Manga/Comics)
 * @param {string} query 
 * @param {'manga' | 'comic'} type 
 */
async function searchBooks(query, type = 'manga') {

    const provider = type === 'manga' ? BOOK_PROVIDERS.MANGA : BOOK_PROVIDERS.COMICS;

    let serviceType = type;
    if (provider === 'mangadex') {
        serviceType = 'manga'; // Force 'manga' path for mangadex
    }

    const basePath = `/${serviceType}/${provider}`;
    const encoded = encodeURIComponent(query);

    const response = await fetchAPI(`${basePath}/${encoded}`);

    // Filter and clean results
    if (response && response.results) {
        response.results = response.results.filter(book => {
            // 1. Remove Explicit Content
            const isSafe = book.contentRating !== 'erotica' && book.contentRating !== 'pornographic';

            // 2. Remove Doujinshi / Fan content based on title
            const titleLower = (book.title || '').toLowerCase();
            const isDoujin = titleLower.includes('doujinshi') || titleLower.includes('fan colored');

            return isSafe && !isDoujin;
        });

        // 3. Deduplicate
        const seenTitles = new Set();
        response.results = response.results.filter(book => {
            // Simplify title to alphanumeric for loose matching
            const simpleTitle = (book.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            if (seenTitles.has(simpleTitle)) return false;

            seenTitles.add(simpleTitle);
            return true;
        });
    }

    return response;
}

async function getBookDetails(id, type = 'manga') {

    // MangaDex Logic
    try {
        // Ensure ID is clean for MangaDex
        const cleanId = id.replace('/manga/mangadex/', '').replace('/manga/', '');
        return await goku.fetchMangaInfo(cleanId);
    } catch (e) {
        console.error('[Consumet] Details Error:', e);
        return null;
    }
}
/**
 * Get Pages for a Chapter
 * @param {string} chapterId
 * @param {'manga' | 'comic'} type
 */
async function getChapterPages(chapterId, type) {

    // MangaDex Logic
    try {
        return await goku.fetchChapterPages(chapterId);
    } catch (e) {
        console.error('[Consumet] Pages Error:', e);
        return [];
    }
}

/**
 * Get the base path for a provider
 */
function getProviderBasePath(provider) {
    if (ANIME_PROVIDERS.includes(provider)) {
        return `/anime/${provider}`;
    }
    return `/movies/${provider}`;
}

/**
 * Search for a movie/TV/Anime by title
 */
async function search(title, provider = 'goku') {
    const encoded = encodeURIComponent(title);
    const basePath = getProviderBasePath(provider);
    return await fetchAPI(`${basePath}/${encoded}`);
}

/**
 * Get media info (episodes, etc.)
 */
async function getMediaInfo(mediaId, provider = 'goku') {
    const basePath = getProviderBasePath(provider);
    return await fetchAPI(`${basePath}/info?id=${encodeURIComponent(mediaId)}`);
}

/**
 * Get streaming sources for an episode
 */
async function getStreamSources(episodeId, mediaId, provider = 'goku', server = '') {
    const basePath = getProviderBasePath(provider);

    // Anime providers (HiAnime) have a different watch URL structure
    if (ANIME_PROVIDERS.includes(provider)) {
        // hianime uses /watch/:episodeId?server=...&category=sub
        let path = `${basePath}/watch/${encodeURIComponent(episodeId)}?category=sub`; // Default to sub
        if (server) path += `&server=${server}`;
        return await fetchAPI(path);
    }

    // Movie providers
    let path = `${basePath}/watch?episodeId=${encodeURIComponent(episodeId)}&mediaId=${encodeURIComponent(mediaId)}`;
    if (server) {
        path += `&server=${server}`;
    }
    return await fetchAPI(path);
}

/**
 * Find best matching result from search results
 */
function findBestMatch(results, title, type, year = null) {
    if (!results || !results.length) return null;

    const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Filter by type if available
    const typeFilter = type === 'tv' ? ['TV Series', 'tv', 'ONA', 'OVA', 'Special'] : ['Movie', 'movie', 'Special'];

    for (const result of results) {
        const resultTitle = (result.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const resultType = result.type || '';

        const titleMatch = resultTitle.includes(normalizedTitle) || normalizedTitle.includes(resultTitle);
        const typeMatch = !resultType || typeFilter.some(t => resultType.toLowerCase().includes(t.toLowerCase()));

        let yearMatch = true;
        if (year && result.releaseDate) {
            const resultYear = parseInt(result.releaseDate);
            if (!isNaN(resultYear)) {
                yearMatch = Math.abs(resultYear - year) <= 2; // Allow 2 year difference
            }
        }

        if (titleMatch && typeMatch && yearMatch) {
            return result;
        }
    }

    // Fallback: Fuzzy match using first result
    const firstResult = results[0];
    const firstTitle = (firstResult.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (firstTitle.includes(normalizedTitle) || normalizedTitle.includes(firstTitle)) {
        return firstResult;
    }
    return null;
}

/**
 * Main function: Get stream for a movie/TV show
 * @param {boolean} prefetch - If true, just cache the result and don't log errors aggressively
 */
async function getStream(title, type, year = null, season = 1, episode = 1, prefetch = false) {
    // Check cache
    const cacheKey = `${title}-${year}-${type}-${season}-${episode}`;
    if (streamCache.has(cacheKey)) {
        console.log(`[Consumet] Returning cached stream for: ${title}`);
        return streamCache.get(cacheKey);
    }

    if (!prefetch) console.log(`[Consumet] Getting stream for: ${title} (${type})`);

    // Determine provider order based on type
    // If it's likely Anime (based on strict genre check? hard to know here), prioritize Anime providers?
    // For now, iterate all unique providers.

    for (const provider of ALL_PROVIDERS) {
        try {
            // Step 1: Search
            const searchResults = await search(title, provider);
            if (!searchResults || !searchResults.results || !searchResults.results.length) continue;

            // Step 2: Match
            const match = findBestMatch(searchResults.results, title, type, year);
            if (!match) continue;

            // Step 3: Media Info
            const mediaInfo = await getMediaInfo(match.id, provider);
            if (!mediaInfo || !mediaInfo.episodes || !mediaInfo.episodes.length) continue;

            // Step 4: Find Episode
            let targetEpisode;
            if (type === 'tv' || ANIME_PROVIDERS.includes(provider)) {
                targetEpisode = mediaInfo.episodes.find(ep =>
                    ep.season === season && ep.number === episode
                );

                if (!targetEpisode && season === 1) {
                    targetEpisode = mediaInfo.episodes.find(ep => ep.number === episode);
                }
            } else {
                targetEpisode = mediaInfo.episodes[0];
            }

            if (!targetEpisode) continue;

            // Step 5: Sources
            const sources = await getStreamSources(targetEpisode.id, match.id, provider);
            if (!sources || !sources.sources || !sources.sources.length) continue;

            if (!prefetch) console.log(`[Consumet] Success with ${provider}!`);

            const result = {
                success: true,
                provider: provider,
                mediaId: match.id,
                episodeId: targetEpisode.id,
                sources: sources.sources.map(s => ({
                    url: s.url,
                    quality: s.quality || 'auto',
                    isM3U8: s.isM3U8 !== false,
                })),
                subtitles: (sources.subtitles || []).map(s => ({
                    url: s.url,
                    lang: s.lang || 'Unknown',
                    label: s.lang || 'Unknown',
                })),
            };

            // Cache the result
            streamCache.set(cacheKey, result);
            return result;

        } catch (error) {
            if (!prefetch) console.error(`[Consumet] Error with ${provider}:`, error.message);
        }
    }

    if (!prefetch) console.log('[Consumet] All providers failed');
    return { success: false, error: 'No stream found' };
}

module.exports = {
    search,
    getMediaInfo,
    getStreamSources,
    getStream,
    getProviderBasePath,
    // Books
    searchBooks,
    getBookDetails,
    getChapterPages,

    ALL_PROVIDERS,
    CONSUMET_BASE,
    CONSUMET_BASE
};
