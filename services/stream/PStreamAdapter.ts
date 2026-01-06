import {
    makeProviders,
    makeStandardFetcher,
    targets,
    makeSimpleProxyFetcher,
    Fetcher,
    setM3U8ProxyUrl
} from '@p-stream/providers';

// --- Configuration (Hardcoded from User/Analysis) ---
// User provided: "pstream's urls are prism.pstream.mov for proxy of m3u8"
// "backend.pstream.online is main backend"

const BACKEND_URL = 'https://backend.pstream.online';

// Speculative: Standard CORS proxy
const PROXY_URLS = [
    'https://kmovie-proxy.ibrahimar397.workers.dev/',
    'https://kmovie-proxy2.ibrahimar397.workers.dev/'
];

const M3U8_PROXY_URLS = [
    'https://kmovie-proxy.ibrahimar397.workers.dev/',
    'https://kmovie-proxy2.ibrahimar397.workers.dev/'
];

// Setup M3U8 Proxy immediately
function setupM3U8Proxy() {
    const proxyUrl = M3U8_PROXY_URLS[Math.floor(Math.random() * M3U8_PROXY_URLS.length)];
    if (proxyUrl) {
        console.log('[PStream] Setting M3U8 Proxy to:', proxyUrl);
        setM3U8ProxyUrl(proxyUrl);
    }
}
setupM3U8Proxy();

// --- Simple Load Balanced Fetcher Logic ---
// We implement this locally because we only need simple rotation.

function getLoadbalancedProxyUrl() {
    return PROXY_URLS[Math.floor(Math.random() * PROXY_URLS.length)];
}

function makeLoadBalancedSimpleProxyFetcher(): Fetcher {
    return async (url, ops) => {
        const proxyUrl = getLoadbalancedProxyUrl();
        // console.log('[PStream] Fetching via Proxy:', proxyUrl, url);
        const currentFetcher = makeSimpleProxyFetcher(
            proxyUrl,
            fetch
        );
        return currentFetcher(url, ops);
    };
}

// --- The Adapter ---

const providerEngine = makeProviders({
    fetcher: makeStandardFetcher(fetch),
    proxiedFetcher: makeLoadBalancedSimpleProxyFetcher(),
    target: targets.NATIVE, // Electron App = Native
    consistentIpForRequests: true,
});

export const PStreamAdapter = {
    search: async (query: string) => {
        return [];
    },

    getStreamLink: async (tmdbId: string, type: 'movie' | 'show', season?: number, episode?: number) => {
        try {
            console.log(`[PStream] Scraping stream for ${type} ${tmdbId}...`);

            const media = {
                type: type,
                title: '',
                releaseYear: 0,
                imdbId: '',
                tmdbId: tmdbId,
                season: season ? {
                    number: season,
                    tmdbId: ''
                } : undefined,
                episode: episode ? {
                    number: episode,
                    tmdbId: ''
                } : undefined
            };

            const output = await providerEngine.runAll({
                media: media as any,
                sourceOrder: ['quality', 'server']
            });

            if (!output) return null;

            // Map output to LocalStreamData
            const stream = (output.stream as any);
            return {
                sources: stream ? [{
                    url: stream.playlist,
                    quality: 'auto',
                    isM3U8: stream.type === 'hls'
                }] : [],
                subtitles: stream?.captions?.map((c: any) => ({
                    url: c.url,
                    lang: c.language
                })) || []
            };

        } catch (e) {
            console.error('[PStream] Scrape error:', e);
            return null;
        }
    }
};
