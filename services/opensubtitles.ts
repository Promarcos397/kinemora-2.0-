/* eslint-disable no-console */
import { labelToLanguageCode } from "@p-stream/providers";

// Simplified type for now, matching kinemora's needs
export interface OpenSubtitleItem {
    id: string;
    language: string;
    display: string;
    url: string;
    type: string;
    opensubtitles: boolean;
}

export async function scrapeOpenSubtitlesCaptions(
    imdbId: string,
    season?: number,
    episode?: number,
): Promise<OpenSubtitleItem[]> {
    try {
        const url = `https://rest.opensubtitles.org/search/${season && episode ? `episode-${episode}/` : ""
            }imdbid-${imdbId.replace('tt', '')}${season && episode ? `/season-${season}` : ""}`;

        const response = await fetch(url, {
            headers: {
                "X-User-Agent": "VLSub 0.10.2",
            },
        });

        if (!response.ok) {
            throw new Error(`OpenSubtitles API returned ${response.status}`);
        }

        const data = await response.json();
        const openSubtitlesCaptions: OpenSubtitleItem[] = [];

        for (const caption of data) {
            const downloadUrl = caption.SubDownloadLink.replace(".gz", "").replace(
                "download/",
                "download/subencoding-utf8/",
            );
            const language = labelToLanguageCode(caption.LanguageName) || "";

            if (!downloadUrl || !language) continue;

            openSubtitlesCaptions.push({
                id: downloadUrl, // Using URL as ID for simple dedupe
                language,
                display: caption.LanguageName,
                url: downloadUrl,
                type: caption.SubFormat || "srt",
                opensubtitles: true,
            });
        }

        return openSubtitlesCaptions;
    } catch (error) {
        console.error("Error fetching OpenSubtitles:", error);
        return [];
    }
}
