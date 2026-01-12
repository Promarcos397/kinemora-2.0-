/**
 * Consumet Streaming Service
 * 
 * Calls Electron main process via IPC for streaming.
 * Main process runs Consumet (bypasses browser XHR header restrictions).
 * Providers (in fallback order): Goku → HiMovies → FlixHQ → SFlix
 */

import { StreamResult } from '../../types';

/**
 * Get movie stream via IPC (main process)
 */
export async function getMovieStream(
    title: string,
    year?: number,
    tmdbId?: string
): Promise<StreamResult | null> {
    console.log(`[Consumet] Getting movie stream: "${title}" (${year})`);

    if (!window.electron?.getMovieStream) {
        console.error('[Consumet] Electron IPC not available');
        return null;
    }

    try {
        const result = await window.electron.getMovieStream(title, year || 0, tmdbId || '');
        if (result) {
            console.log(`[Consumet] Got ${result.sources.length} sources`);
        }
        return result;
    } catch (error: any) {
        console.error('[Consumet] Movie stream error:', error.message);
        return null;
    }
}

/**
 * Get TV episode stream via IPC (main process)
 */
export async function getTvStream(
    title: string,
    season: number,
    episode: number,
    year?: number,
    tmdbId?: string
): Promise<StreamResult | null> {
    console.log(`[Consumet] Getting TV stream: "${title}" S${season}E${episode}`);

    if (!window.electron?.getTvStream) {
        console.error('[Consumet] Electron IPC not available');
        return null;
    }

    try {
        const result = await window.electron.getTvStream(title, season, episode, year || 0, tmdbId || '');
        if (result) {
            console.log(`[Consumet] Got ${result.sources.length} sources`);
        }
        return result;
    } catch (error: any) {
        console.error('[Consumet] TV stream error:', error.message);
        return null;
    }
}

export const consumetService = {
    getMovieStream,
    getTvStream,
    providers: ['Goku', 'HiMovies', 'FlixHQ', 'SFlix']
};
