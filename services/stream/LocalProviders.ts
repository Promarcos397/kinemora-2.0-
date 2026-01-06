import { MOVIES, StreamingServers } from '@consumet/extensions';

// Define the shape of search results and stream data to match StreamService
export interface LocalSearchResult {
    id: string;
    title: string;
    url: string;
    image: string;
    releaseDate?: string;
    type?: string;
    provider: string; // 'flixhq' | 'goku' | 'dramacool'
}

export interface LocalStreamSource {
    quality: string;
    url: string;
    isM3U8: boolean;
}

export interface LocalStreamData {
    headers: { [key: string]: string };
    sources: LocalStreamSource[];
    subtitles: { url: string; lang: string }[];
}

// Override FlixHQ baseUrl to use a working mirror (To bypass dead flixhq.to)
const flixhq = new MOVIES.FlixHQ();
(flixhq as any).baseUrl = 'https://flixhq.bz';
console.log('[LocalProviders] FlixHQ baseUrl overridden to:', (flixhq as any).baseUrl);

const providers = {
    flixhq: flixhq,
    goku: new MOVIES.Goku(),
    dramacool: new MOVIES.DramaCool(),
};

type ProviderName = keyof typeof providers;

export const localProviders = {
    /**
     * Search specific provider locally
     */
    search: async (providerName: string, query: string): Promise<LocalSearchResult[]> => {
        const provider = providers[providerName as ProviderName];
        if (!provider) return [];

        try {
            const results = await provider.search(query);
            console.log(`[Local] Search ${providerName} found ${results.results.length} results.`);
            return results.results.map((r: any) => ({
                id: r.id,
                title: r.title,
                url: r.url,
                image: r.image,
                releaseDate: r.releaseDate,
                type: r.type,
                provider: providerName
            }));
        } catch (error) {
            console.error(`Local search error on ${providerName}:`, error);
            return [];
        }
    },

    /**
     * Get Media Info locally (for episodes list)
     */
    getMediaInfo: async (providerName: string, id: string): Promise<any | null> => {
        const provider = providers[providerName as ProviderName];
        if (!provider) return null;

        try {
            const info = await provider.fetchMediaInfo(id);
            if (info) {
                console.log(`[Local] Fetched info for ${id} on ${providerName}. Episodes count: ${info.episodes?.length || 0}`);
            }
            return {
                ...info,
                provider: providerName
            };
        } catch (error) {
            console.error(`Local info fetch error on ${providerName}:`, error);
            return null;
        }
    },

    /**
     * Get Stream Link locally
     * Implements "Server Race" strategy: Fetches all available servers in parallel 
     * and returns the first one that responds with valid sources.
     */
    getStreamLink: async (providerName: string, episodeId: string, mediaId: string): Promise<LocalStreamData | null> => {
        const provider = providers[providerName as ProviderName];
        if (!provider) return null;

        try {
            let servers: any[] = [];

            // 1. Fetch Servers (Provider-specific signatures)
            console.log(`[Local] Fetching servers for ${providerName}...`);
            if (providerName === 'dramacool') {
                servers = await (provider as any).fetchEpisodeServers(episodeId);
            } else {
                // FlixHQ and Goku take (episodeId, mediaId)
                servers = await (provider as any).fetchEpisodeServers(episodeId, mediaId);
            }

            if (!servers || servers.length === 0) {
                console.warn(`[Local] No servers found directly on ${providerName} for episode ${episodeId}`);
                return null;
            }

            console.log(`[Local] ${providerName} found ${servers.length} servers:`, servers.map(s => s.name));

            // Server Priority Tuning (Phase A): Prefer VidCloud
            servers.sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                if (aName.includes('vidcloud') && !bName.includes('vidcloud')) return -1;
                if (!aName.includes('vidcloud') && bName.includes('vidcloud')) return 1;
                return 0;
            });

            // 2. Race Servers: Try to fetch sources from ALL servers in parallel
            // The first one to return valid sources wins.
            const serverTasks = servers.map(async (server: any) => {
                try {
                    const serverName = server.name;
                    // console.log(`[Local] Trying server ${serverName} on ${providerName}...`); // Too verbose
                    let sourceData: any;

                    if (providerName === 'dramacool') {
                        sourceData = await (provider as any).fetchEpisodeSources(episodeId, serverName);
                    } else {
                        sourceData = await (provider as any).fetchEpisodeSources(episodeId, mediaId, serverName);
                    }

                    if (sourceData && sourceData.sources && sourceData.sources.length > 0) {
                        console.log(`[Local] SUCCESS: Found sources on ${providerName} via ${serverName}`);
                        return sourceData;
                    }
                } catch (e) {
                    // console.warn(`[Local] Failed server ${server.name} on ${providerName}:`, e);
                }
                return null;
            });

            // Wait for the first successful non-null result
            const validResult = await Promise.any(serverTasks.map(p => p.then(res => {
                if (!res) throw new Error('No sources');
                return res;
            })));

            return {
                headers: validResult.headers || {},
                sources: validResult.sources.map((s: any) => ({
                    quality: s.quality || 'auto',
                    url: s.url,
                    isM3U8: s.isM3U8
                })),
                subtitles: validResult.subtitles || []
            };

        } catch (error) {
            // All promises rejected means no servers worked
            console.error(`Local stream fetch error on ${providerName} (All servers failed):`, error);
            return null;
        }
    }
};
