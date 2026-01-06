/**
 * StreamService - Concurrent Hybrid Streaming Provider
 * 
 * Strategies:
 * 1. Simultanous execution of Local (Electron) and Remote (REST) providers.
 * 2. Merges results from all sources for search.
 * 3. Races sources for stream links to get the fastest playback.
 */

import { localProviders } from './LocalProviders';
import { PStreamAdapter } from './PStreamAdapter';
import { SubtitleService } from '../SubtitleService';

const API_BASE_URL = 'https://consumet-api-ylr8.onrender.com';

// Available movie providers (in priority order)
const PROVIDERS = ['goku', 'dramacool', 'flixhq'] as const;
type Provider = typeof PROVIDERS[number];

export interface StreamSource {
    quality: string;
    url: string;
    isM3U8: boolean;
}

export interface StreamData {
    headers: { [key: string]: string };
    sources: StreamSource[];
    subtitles: { url: string; lang: string; label?: string }[];
}

interface SearchResult {
    id: string;
    title: string;
    url?: string;
    image?: string;
    releaseDate?: string;
    type?: string;
    provider: string;
}

class StreamService {
    private providerOrder: Provider[] = [...PROVIDERS];
    private localProviders: any = null;
    private isElectron: boolean = false;

    constructor() {
        // Detect Electron environment securely (UA check is more reliable in modern Electron)
        // Note: In standard Chrome, this will be false, which is CORRECT (we can't use node there).
        this.isElectron = typeof navigator !== 'undefined' && /Electron/i.test(navigator.userAgent);

        if (this.isElectron) {
            this.initLocalMode();
        } else {
            console.warn('StreamService: Web/Android detected (or Browser). Local Providers DISABLED.');
            console.log('StreamService: Using REST API:', API_BASE_URL);
            this.checkLatency();
        }
    }

    async initLocalMode() {
        try {
            // Import LocalProviders dynamic (or static if already imported)
            // Since we imported at top, we can just assign, but to be safe and async-friendly:
            // We use the imported 'localProviders' from './LocalProviders' directly.
            // But 'localProviders' is an object.
            // Let's just assign it.
            this.localProviders = localProviders;
            console.log('StreamService: Local Mode Active (Concurrent Hybrid Enabled)');
        } catch (e) {
            console.error('StreamService: Failed to load Local Mode', e);
            this.isElectron = false; // Fallback to pure REST
            this.checkLatency();
        }
    }

    async checkLatency() {
        if (this.isElectron) return; // Skip logic for pure REST optimization if we have local power

        console.log('Checking provider latency (REST)...');
        // ... (Existing latency logic kept for web fallback)
        const checks = this.providerOrder.map(async (provider) => {
            const pStart = Date.now();
            try {
                const response = await Promise.race([
                    fetch(`${API_BASE_URL}/movies/${provider}/test`),
                    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                ]);
                return { name: provider, time: Date.now() - pStart, alive: response.ok || response.status === 404 };
            } catch (e) {
                return { name: provider, time: 99999, alive: false };
            }
        });

        const results = await Promise.all(checks);
        results.sort((a, b) => (a.alive === b.alive ? a.time - b.time : a.alive ? -1 : 1));
        this.providerOrder = results.map(r => r.name);
        console.log('Providers reordered:', this.providerOrder); // Concise log
    }

    /**
     * Search using Concurrent Strategy (Local + Remote)
     */
    async search(query: string, ignoredProviders: string[] = []): Promise<SearchResult[]> {
        const encodedQuery = encodeURIComponent(query);
        console.log(`Searching via StreamService for: ${query} (Concurrent Hybrid)`);
        const providersToSearch = this.providerOrder.filter(p => !ignoredProviders.includes(p));

        // Create a flat list of all search tasks (Provider x Strategy)
        const tasks: Promise<SearchResult[]>[] = [];

        for (const provider of providersToSearch) {
            // 1. Remote Task
            tasks.push(this.searchRemote(provider, encodedQuery));

            // 2. Local Task (if available)
            if (this.isElectron && this.localProviders) {
                tasks.push(this.searchLocal(provider, query));
            }
        }

        // Wait for ALL to finish (settled) so we gather max results
        const results = await Promise.allSettled(tasks);

        // Aggregate
        const allResults: SearchResult[] = [];
        const seenIds = new Set<string>();

        for (const res of results) {
            if (res.status === 'fulfilled' && res.value.length > 0) {
                for (const item of res.value) {
                    // Simple deduplication key: provider + id
                    const key = `${item.provider}-${item.id}`;
                    if (!seenIds.has(key)) {
                        seenIds.add(key);
                        allResults.push(item);
                    }
                }
            }
        }

        console.log(`Concurrent Search Complete. Found ${allResults.length} results.`);
        return allResults;
    }

    private async searchRemote(provider: string, encodedQuery: string): Promise<SearchResult[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/movies/${provider}/${encodedQuery}`);
            if (!response.ok) return [];
            const data = await response.json();
            return (data.results || []).map((r: any) => ({ ...r, provider }));
        } catch { return []; }
    }

    private async searchLocal(provider: string, query: string): Promise<SearchResult[]> {
        try {
            return await this.localProviders.search(provider, query);
        } catch { return []; }
    }



    /**
     * Get Stream Link using Fastest Wins (Race) Strategy
     * We try Local (Zero Latency) and Remote (Reliability) simultaneously.
     * First one to return a valid stream wins!
     */
    async getStreamLink(
        episodeId: string,
        mediaId: string,
        providerName?: string,
        tmdbId?: string, // P-Stream needs these
        type?: 'movie' | 'show',
        season?: number,
        episode?: number,
        imdbId?: string // Added for OpenSubtitles
    ): Promise<StreamData | null> {
        const provider = providerName || this.providerOrder[0];
        console.log(`Getting Stream Link for ${episodeId} on ${provider}...`);

        const tasks: Promise<StreamData | null>[] = [];

        // 1. Remote Task (Reliable)
        const remotePromise = (async () => {
            const url = `${API_BASE_URL}/movies/${provider}/watch?episodeId=${encodeURIComponent(episodeId)}&mediaId=${encodeURIComponent(mediaId)}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Remote 404');
            const data = await res.json();
            console.log(`[Remote] Stream Found on ${provider}!`);
            return {
                headers: data.headers || {},
                sources: data.sources || [],
                subtitles: data.subtitles || []
            };
        })();
        tasks.push(remotePromise);

        // 2. Local Task (Consumet)
        if (this.isElectron && this.localProviders) {
            tasks.push(
                this.localProviders.getStreamLink(provider, episodeId, mediaId)
                    .then((res: any) => {
                        if (res) {
                            console.log(`[StreamService] Local Stream Found on ${provider}!`);
                            return res;
                        }
                        throw new Error('Local stream not found');
                    })
            );
        }

        // 3. P-Stream Engine (Engine 3) - Only if we have TMDB ID
        if (this.isElectron && tmdbId && type) {
            tasks.push(
                PStreamAdapter.getStreamLink(tmdbId, type, season, episode)
                    .then((res: any) => {
                        if (res) {
                            console.log(`[StreamService] P-Stream Found!`);
                            return res;
                        }
                        throw new Error('P-Stream stream not found');
                    })
            );
        }

        // 4. OpenSubtitles Task (Parallel)
        const subtitleTask = (async () => {
            // Only fetch if we have IMDB ID
            if (imdbId) {
                return await SubtitleService.getOpenSubtitles(imdbId, season, episode);
            }
            return [];
        })();

        // Race for the stream!
        try {
            const result = await Promise.any(tasks);

            if (result) {
                // Wait for subtitles to finish (don't block stream on it, but we want to merge if fast enough? 
                // Alternatively, return stream immediately and let UI fetch subs? 
                // StreamData EXPECTS subs included.
                // We should probably wait for subtitlestask with a timeout.

                try {
                    const extraSubs = await Promise.race([
                        subtitleTask,
                        new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 3000)) // 3s timeout for subs
                    ]);
                    if (extraSubs.length > 0) {
                        console.log(`[StreamService] Merging ${extraSubs.length} OpenSubtitles.`);
                        result.subtitles = [...extraSubs, ...(result.subtitles || [])];
                    }
                } catch (e) { console.warn("[StreamService] Subtitle merge failed", e); }

                return result;
            }
            return null;
        } catch (e) {
            console.error('All stream fetch attempts failed:', e);
            return null;
        }
    }

    async getInfo(id: string, providerName?: string) {
        // Similar concurrent logic for Info
        const provider = providerName || this.providerOrder[0];
        const tasks: Promise<any>[] = [];

        if (this.isElectron && this.localProviders) {
            tasks.push(this.localProviders.getMediaInfo(provider, id));
        }

        tasks.push(
            fetch(`${API_BASE_URL}/movies/${provider}/info?id=${encodeURIComponent(id)}`)
                .then(res => res.ok ? res.json() : null)
                .then(data => data ? { ...data, provider } : null)
        );

        try {
            const result = await Promise.any(tasks.map(p => p.then(res => {
                if (!res) throw new Error('No info');
                return res;
            })));
            return result;
        } catch {
            return null;
        }
    }
}

export const streamService = new StreamService();
