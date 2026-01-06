
// Helper for language codes (can be expanded)
const langMap: Record<string, string> = {
    'English': 'en',
    'Spanish': 'es',
    'French': 'fr',
    'German': 'de',
    'Italian': 'it',
    'Portuguese': 'pt',
    'Russian': 'ru',
    'Japanese': 'ja',
    'Korean': 'ko',
    'Chinese': 'zh',
    'Arabic': 'ar',
    'Turkish': 'tr',
    'Dutch': 'nl',
    'Polish': 'pl',
    'Swedish': 'sv',
    'Danish': 'da',
    'Finnish': 'fi',
    'Norwegian': 'no',
    'Hungarian': 'hu',
    'Greek': 'el',
    'Hebrew': 'he',
    'Czech': 'cs',
    'Romanian': 'ro',
    'Thai': 'th',
    'Vietnamese': 'vi',
    'Indonesian': 'id'
};

function labelToLanguageCode(label: string): string {
    // Basic mapping or try to parse
    const normalized = label.split(' ')[0]; // "English (US)" -> "English"
    return langMap[normalized] || 'en'; // Default to en if unknown or keep raw? 
    // Actually, returning 'en' for unknown might be bad.
    // Let's attempt to match common names.
}

export interface SubtitleTrack {
    url: string;
    lang: string;
    label: string;
}

export const SubtitleService = {
    getOpenSubtitles: async (imdbId: string, season?: number, episode?: number): Promise<SubtitleTrack[]> => {
        try {
            if (!imdbId) return [];

            // Clean ID (remove 'tt')
            const cleanId = imdbId.replace('tt', '');

            // Construct URL
            // Format: https://rest.opensubtitles.org/search/episode-<E>/imdbid-<ID>/season-<S>
            // or imdbid-<ID> for movies
            let url = '';
            if (season && episode) {
                url = `https://rest.opensubtitles.org/search/episode-${episode}/imdbid-${cleanId}/season-${season}`;
            } else {
                url = `https://rest.opensubtitles.org/search/imdbid-${cleanId}`;
            }

            console.log(`[SubtitleService] Fetching OpenSubtitles for ${imdbId}...`, url);

            // Check if running in Electron (Node.js context - no CORS)
            const isElectron = typeof window !== 'undefined' && (window as any).electron;

            let fetchUrl = url;
            let headers: Record<string, string> = {
                "X-User-Agent": "VLSub 0.10.2",
            };

            // In browser context, try direct (may work with Electron's webSecurity disabled)
            // OpenSubtitles REST API requires X-User-Agent header

            const response = await fetch(fetchUrl, { headers });

            if (!response.ok) {
                console.warn(`[SubtitleService] OpenSubtitles API returned ${response.status}`);
                return [];
            }

            const data = await response.json();
            console.log('[SubtitleService] Raw response:', data);
            const captions: SubtitleTrack[] = [];

            if (Array.isArray(data)) {
                for (const caption of data) {
                    // Legacy logic: Replace .gz with .srt endpoint via 'subencoding-utf8'
                    // Original: http://dl.opensubtitles.org/en/download/src-api/vrf-19f80c57/sid-s0t.../file/1956578054.gz
                    // Target: .../download/subencoding-utf8/...

                    let downloadUrl = caption.SubDownloadLink;
                    if (downloadUrl) {
                        downloadUrl = downloadUrl.replace(".gz", "").replace("download/", "download/subencoding-utf8/");

                        const label = caption.LanguageName || 'Unknown';
                        const lang = caption.ISO639 || labelToLanguageCode(label);

                        captions.push({
                            url: downloadUrl,
                            label: label,
                            lang: lang
                        });
                    }
                }
            }

            console.log(`[SubtitleService] Found ${captions.length} subtitles.`);
            return captions;

        } catch (error) {
            console.error("[SubtitleService] Error fetching OpenSubtitles:", error);
            return [];
        }
    }
};
