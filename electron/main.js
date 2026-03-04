import { app, BrowserWindow, dialog, ipcMain, session, protocol, net } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// === SERVICES & UTILS (Global Scope) ===
const StreamZip = require('node-stream-zip');
const { Readable } = require('stream');
let downloadFile, getFileStream, getLibrary, getSeries, getIssues;

try {
    const drivePath = require.resolve('../services/DriveService.cjs');
    console.log('[Main] Loading DriveService from:', drivePath);
    const drive = require('../services/DriveService.cjs');
    console.log('[Main] DriveService exports:', Object.keys(drive));
    downloadFile = drive.downloadFile;
    getFileStream = drive.getFileStream;

    const supabasePath = require.resolve('../services/SupabaseService.cjs');
    console.log('[Main] Loading SupabaseService from:', supabasePath);
    const supabase = require('../services/SupabaseService.cjs');
    console.log('[Main] SupabaseService exports:', Object.keys(supabase));

    getLibrary = supabase.getLibrary;
    getSeries = supabase.getSeries;
    getIssues = supabase.getIssues;

    if (!getLibrary) console.error('[Main] CRITICAL: getLibrary is undefined!');

    console.log('[Main] Services loaded successfully');
} catch (e) {
    console.error('[Main] Failed to load services:', e);
    console.error('[Main] Stack:', e.stack);
}

const zipCache = new Map(); // Global cache for open CBZ archives

// SCRAPING: Ignore SSL certificate errors (streaming sites often have misconfigured certs)
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('allow-insecure-localhost');

// CRITICAL: Register custom protocol BEFORE app is ready
// This makes 'app://' a privileged scheme, treated like 'https://'
// which fixes YouTube iframe permission warnings
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'app',
        privileges: {
            standard: true,
            secure: true,
            supportFetchAPI: true,
            corsEnabled: true,
            stream: true
        }
    }
]);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    dialog.showErrorBox('Application Error', `Something went wrong:\n\n${error.stack || error.message}`);
    process.exit(1);
});

async function createWindow() {
    const isDev = !app.isPackaged;
    const iconPath = isDev
        ? path.join(__dirname, '../resources/icon.png')
        : path.join(process.resourcesPath, 'icon.png');

    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#141414',
        frame: false,
        show: true,
        icon: iconPath,
        webPreferences: {
            nodeIntegration: false, // Disable nodeIntegration for security (we use preload)
            contextIsolation: true, // Enable contextIsolation for preload
            webSecurity: false, // Disable CORS for streaming
            webviewTag: true, // Enable <webview> tag for VidSrc embed
            preload: path.join(__dirname, 'preload.cjs')
        },
        autoHideMenuBar: true,
    });

    // FIX: Modify YouTube headers to bypass 'app://' restriction and ensure playback
    session.defaultSession.webRequest.onBeforeSendHeaders(
        { urls: ['*://*.youtube.com/*', '*://*.googlevideo.com/*'] },
        (details, callback) => {
            const { requestHeaders } = details;
            // If request comes from app:// or file://, spoof it as coming from YouTube itself or a generic HTTPS site
            if (requestHeaders['Referer'] && (requestHeaders['Referer'].startsWith('app://') || requestHeaders['Referer'].startsWith('file://'))) {
                requestHeaders['Referer'] = 'https://www.youtube.com/';
                requestHeaders['Origin'] = 'https://www.youtube.com';
            }
            callback({ requestHeaders });
        }
    );

    // Window Control IPC Handlers
    ipcMain.on('window-minimize', () => win.minimize());
    ipcMain.on('window-maximize', () => {
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
    });
    ipcMain.on('window-close', () => win.close());

    // === VIDSRC BROWSERVIEW IMPLEMENTATION ===
    // NOTE: BrowserView was deprecated in Electron 30 and removed in Electron 39.
    // These handlers are stubbed out. Streaming uses Consumet API instead.

    ipcMain.handle('vidsrc-create', async () => {
        console.log('[VidSrc] BrowserView deprecated - use Consumet API instead');
        return { success: false, error: 'BrowserView deprecated in Electron 39' };
    });

    ipcMain.handle('vidsrc-destroy', () => {
        return { success: true };
    });

    ipcMain.on('vidsrc-resize', () => { });

    ipcMain.handle('vidsrc-execute', async () => {
        return { success: false, error: 'BrowserView deprecated' };
    });

    ipcMain.handle('vidsrc-find-video', async () => {
        return { found: false, error: 'BrowserView deprecated' };
    });
    // === END BROWSERVIEW IMPLEMENTATION ===

    // === P-STREAM PROVIDERS API STREAMING ===
    // Import the p-stream providers (Standard Fetcher for Node/Electron)
    const { makeProviders, makeStandardFetcher, targets } = await import('@p-stream/providers');

    // Initialize providers instance (Native target for Electron/Node environment)
    const fetcher = makeStandardFetcher(fetch);
    const providers = makeProviders({
        fetcher: fetcher,
        target: targets.NATIVE
    });
    console.log('[Main] Provider system initialized using @p-stream/providers');

    // Primary stream handler (routes through p-stream)
    ipcMain.handle('pstream-stream', async (event, { title, type, year, season, episode, tmdbId }) => {
        console.log(`[p-stream] Stream requested: ${title} (${type}), tmdbId=${tmdbId}`);
        try {
            const tid = String(tmdbId || '');
            const media = type === 'movie' || type !== 'tv'
                ? { type: 'movie', title, releaseYear: year, tmdbId: tid }
                : {
                    type: 'show', title, releaseYear: year, tmdbId: tid,
                    episode: { number: Number(episode) },
                    season: { number: Number(season) }
                };

            // Use specific fast sources for movies if possible to speed up discovery
            const sourceOrder = type === 'movie' || type !== 'tv' ? ['flixhq', 'sflix', 'goku'] : undefined;

            const streamResult = await providers.runAll({ media, sourceOrder });
            if (streamResult && streamResult.stream) {
                const stream = streamResult.stream;
                let sources = [];
                if (stream.type === 'hls') {
                    sources.push({ url: stream.playlist, quality: 'auto', isM3U8: true });
                } else if (stream.type === 'file' && stream.qualities) {
                    for (const [quality, fileObj] of Object.entries(stream.qualities)) {
                        if (fileObj && fileObj.url) sources.push({ url: fileObj.url, quality, isM3U8: false });
                    }
                }
                if (sources.length > 0) {
                    return {
                        success: true,
                        sources,
                        subtitles: (stream.captions || []).map(sub => ({ url: sub.url, lang: sub.language || 'Unknown' })),
                        provider: 'p-stream'
                    };
                }
            }
            return { success: false, error: 'No streams found' };
        } catch (err) {
            console.error('[p-stream] Stream error:', err.message);
            return { success: false, error: err.message };
        }
    });

    // Prefetch handler
    ipcMain.handle('pstream-prefetch', async (event, { title, type, year, season, episode, tmdbId }) => {
        const tid = String(tmdbId || '');
        const media = type === 'movie' || type !== 'tv'
            ? { type: 'movie', title, releaseYear: year, tmdbId: tid }
            : {
                type: 'show', title, releaseYear: year, tmdbId: tid,
                episode: { number: Number(episode) },
                season: { number: Number(season) }
            };

        providers.runAll({ media })
            .then(res => { if (res?.stream) console.log(`[Main] Prefetch success for ${title}`); })
            .catch(err => console.error(`[Main] Prefetch error for ${title}`, err.message));

        return { success: true, started: true };
    });

    // === BOOK SERVICE IPC HANDLERS - DEPRECATED ===
    ipcMain.handle('pstream-books-search', async () => ({ success: false, error: 'Manga/Comic scraping removed' }));
    ipcMain.handle('pstream-books-info', async () => ({ success: false, error: 'Manga/Comic scraping removed' }));
    ipcMain.handle('pstream-books-read', async () => ({ success: false, error: 'Manga/Comic scraping removed' }));
    // === END BOOK SERVICE ===

    // Enable streaming permissions
    win.webContents.session.setPermissionCheckHandler(() => true);
    win.webContents.session.setPermissionRequestHandler((_, __, callback) => callback(true));

    // === VIDSRC IFRAME EMBED: Block popups and new windows ===
    win.webContents.setWindowOpenHandler(({ url }) => {
        console.log('[Popup Blocked]', url);
        return { action: 'deny' };
    });

    // STREAMING HEADER FIX: Inject Referer/User-Agent for ALL streaming-related requests
    const STREAMING_DOMAINS = {
        // VidSrc embed domains (from vidsrc.domains NEW DOMAINS list)
        'vidsrc-embed.ru': 'https://vidsrc-embed.ru/',
        'vidsrc-embed.su': 'https://vidsrc-embed.su/',
        'vidsrc-me.ru': 'https://vidsrc-me.ru/',
        'vidsrc-me.su': 'https://vidsrc-me.su/',
        'vidsrcme.ru': 'https://vidsrcme.ru/',
        'vidsrcme.su': 'https://vidsrcme.su/',
        'vsrc.su': 'https://vsrc.su/',
        // Goku and related
        'goku.sx': 'https://goku.sx/',
        'gustyshine79.live': 'https://goku.sx/',
        'windglow99.pro': 'https://goku.sx/',
        'rabbitstream.net': 'https://rabbitstream.net/',
        // HiMovies and related
        'himovies.sx': 'https://himovies.sx/',
        'himovies.to': 'https://himovies.to/',
        'crawlr.cc': 'https://himovies.sx/',
        'videostr.net': 'https://himovies.sx/',
        // FlixHQ
        'flixhq.to': 'https://flixhq.to/',
        'rainbloom44.xyz': 'https://flixhq.to/',
        // SFlix
        'sflix.to': 'https://sflix.to/',
        'sflix.se': 'https://sflix.se/',
        // DramaCool
        'dramacool.ee': 'https://dramacool.ee/',
        'asianc.co': 'https://dramacool.ee/',
        // Turkish123
        'turkish123.ac': 'https://turkish123.ac/',
        // Common stream servers
        'vidcloud.co': 'https://vidcloud.co/',
        'vidcloud9.com': 'https://vidcloud9.com/',
        'mixdrop.co': 'https://mixdrop.co/',
        'streamtape.com': 'https://streamtape.com/',
        'upstream.to': 'https://upstream.to/',
        'mp4upload.com': 'https://mp4upload.com/',
        'dood.to': 'https://dood.to/',
        'filemoon.sx': 'https://filemoon.sx/',
    };

    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        const { requestHeaders } = details;

        // Always inject a standard browser User-Agent
        requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

        try {
            const url = new URL(details.url);
            const hostname = url.hostname;

            // Check if hostname matches any known streaming domain
            for (const [domain, referer] of Object.entries(STREAMING_DOMAINS)) {
                if (hostname.includes(domain) || hostname.endsWith('.' + domain)) {
                    requestHeaders['Referer'] = referer;
                    requestHeaders['Origin'] = referer.slice(0, -1);
                    break;
                }
            }

            // Fallback: If it looks like a streaming request, set a generic referer
            if (!requestHeaders['Referer'] && (
                details.url.includes('.m3u8') ||
                details.url.includes('.ts') ||
                details.url.includes('/embed') ||
                details.url.includes('/stream')
            )) {
                requestHeaders['Referer'] = url.origin + '/';
            }

        } catch (e) {
            // URL parsing failed, continue without modification
        }

        // Handle custom X-Kinemora headers from HLS.js (VideoPlayer)
        if (requestHeaders['X-Kinemora-Referer']) {
            requestHeaders['Referer'] = requestHeaders['X-Kinemora-Referer'];
            delete requestHeaders['X-Kinemora-Referer'];
        }
        if (requestHeaders['X-Kinemora-User-Agent']) {
            requestHeaders['User-Agent'] = requestHeaders['X-Kinemora-User-Agent'];
            delete requestHeaders['X-Kinemora-User-Agent'];
        }

        callback({ cancel: false, requestHeaders });
    });

    // === VIDSRC WEBVIEW: Apply same headers to webview partition ===
    const vidsrcSession = session.fromPartition('persist:vidsrc');

    // Inject headers for VidSrc webview
    vidsrcSession.webRequest.onBeforeSendHeaders((details, callback) => {
        const { requestHeaders } = details;

        // Always inject a standard browser User-Agent
        requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

        try {
            const url = new URL(details.url);
            const hostname = url.hostname;

            // Check if hostname matches any known streaming domain
            for (const [domain, referer] of Object.entries(STREAMING_DOMAINS)) {
                if (hostname.includes(domain) || hostname.endsWith('.' + domain)) {
                    requestHeaders['Referer'] = referer;
                    requestHeaders['Origin'] = referer.slice(0, -1);
                    break;
                }
            }

            // Fallback: If it looks like a streaming request, set a generic referer
            if (!requestHeaders['Referer']) {
                requestHeaders['Referer'] = url.origin + '/';
                requestHeaders['Origin'] = url.origin;
            }

        } catch (e) {
            // URL parsing failed, continue without modification
        }

        callback({ cancel: false, requestHeaders });
    });

    console.log('[Main] VidSrc webview session configured with header injection');

    // CORS HEADER INJECTION: Allow cross-origin requests from iframes like VidSrc
    // Only set headers if they don't already exist to avoid duplication
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        const headers = { ...details.responseHeaders };

        // Helper to set header only if not present
        const setIfMissing = (name, value) => {
            const lowerName = name.toLowerCase();
            const existing = Object.keys(headers).find(k => k.toLowerCase() === lowerName);
            if (!existing) {
                headers[name] = value;
            }
        };

        // CORS headers - only add if missing
        setIfMissing('Access-Control-Allow-Origin', ['*']);
        setIfMissing('Access-Control-Allow-Methods', ['GET, POST, PUT, DELETE, PATCH, OPTIONS']);
        setIfMissing('Access-Control-Allow-Headers', ['*']);

        // Grant permissions for video playback
        headers['Permissions-Policy'] = ['autoplay=*, encrypted-media=*, picture-in-picture=*, clipboard-write=*, accelerometer=*, gyroscope=*'];

        callback({ cancel: false, responseHeaders: headers });
    });

    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.log('Failed to load:', errorCode, errorDescription);
    });

    win.once('ready-to-show', () => {
        win.show();
    });

    // --- NEW P-STREAM PROXY REPLACEMENT (FIXED) ---
    // Handle 'request' IPC channel to perform native HTTP requests bypassing CORS
    // Fixed: Prioritizes headers from Renderer and handles binary video data
    ipcMain.handle('request', async (event, options) => {
        const { url, ...fetchOptions } = options || {};

        // Validate URL
        if (!url || typeof url !== 'string') {
            console.error('[IPC] Invalid URL:', url);
            throw new Error('Invalid URL provided to IPC request');
        }

        // Validate URL format
        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        } catch (e) {
            console.error('[IPC] Malformed URL:', url);
            throw new Error(`Malformed URL: ${url}`);
        }

        try {
            // console.log(`[IPC] Requesting: ${url.substring(0, 100)}...`);

            // 1. HEADER PRIORITY LOGIC
            // If the Renderer sent a Referer (e.g., from Goku), we MUST use it.
            // Only fall back to the static STREAMING_DOMAINS map if no Referer was provided.
            let referer = fetchOptions.headers?.Referer;

            if (!referer) {
                const hostname = parsedUrl.hostname;
                for (const [domain, expectedReferer] of Object.entries(STREAMING_DOMAINS)) {
                    if (hostname.includes(domain) || hostname.endsWith('.' + domain)) {
                        referer = expectedReferer;
                        // console.log(`[IPC] Auto-detected Referer: ${referer}`);
                        break;
                    }
                }
            }

            // Default fallback if still nothing
            if (!referer) {
                referer = parsedUrl.origin + '/';
            }

            // Import axios dynamically (ESM)
            const axios = (await import('axios')).default;

            // 2. BINARY DATA HANDLING
            // Critical for .ts video segments. 
            // If the renderer asked for 'arraybuffer', we must pass that to axios.
            const responseType = fetchOptions.responseType || 'text';

            // Use axios - it respects headers without Chromium interference
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': referer,
                    'Origin': new URL(referer).origin,
                    ...((fetchOptions.headers && typeof fetchOptions.headers === 'object') ? fetchOptions.headers : {})
                },
                responseType: responseType,
                validateStatus: () => true // Don't throw on non-2xx
            });

            // console.log(`[IPC] Response: ${response.status} | Type: ${responseType} | Len: ${response.data?.length || response.data?.byteLength}`);

            return {
                ok: response.status >= 200 && response.status < 300,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                // Pass the data back directly. 
                // If responseType was 'arraybuffer', this is a Buffer (Uint8Array), which IPC handles efficiently.
                body: response.data,
                url: url
            };

        } catch (error) {
            console.error('[IPC] Request failed:', error.message);
            throw new Error(error.message);
        }
    });

    // STREAMING API: Run p-stream providers in main process (bypasses browser XHR header restrictions)
    ipcMain.handle('stream:movie', async (event, { title, year, tmdbId }) => {
        try {
            console.log(`[Stream] Getting movie: "${title}" (${year}) via p-stream/providers`);

            const media = {
                type: 'movie',
                title: title,
                releaseYear: year,
                tmdbId: typeof tmdbId === 'string' ? tmdbId : String(tmdbId)
            };

            const streamResult = await providers.runAll({ media });

            if (streamResult && streamResult.stream) {
                console.log(`[Stream] ✅ Got stream from provider using p-stream`);
                const stream = streamResult.stream;

                // Map p-stream output to our standard VideoPlayer format
                let sources = [];
                if (stream.type === 'hls') {
                    sources.push({ url: stream.playlist, quality: 'auto', isM3U8: true, provider: 'p-stream' });
                } else if (stream.type === 'file') {
                    // Extract qualities from file stream
                    if (stream.qualities) {
                        for (const [quality, fileObj] of Object.entries(stream.qualities)) {
                            if (fileObj && fileObj.url) {
                                sources.push({ url: fileObj.url, quality: quality, isM3U8: fileObj.type === 'm3u8', provider: 'p-stream' });
                            }
                        }
                    }
                }

                if (sources.length > 0) {
                    return {
                        sources: sources,
                        headers: stream.headers || {},
                        subtitles: (stream.captions || []).map(sub => ({
                            url: sub.url,
                            lang: sub.language || sub.id || 'Unknown'
                        }))
                    };
                }
            }

            console.log('[Stream] All providers failed or returned null');
            return null;
        } catch (error) {
            console.error('[Stream] Movie stream error:', error);
            return null;
        }
    });

    ipcMain.handle('stream:tv', async (event, { title, season, episode, year, tmdbId }) => {
        try {
            console.log(`[Stream] Getting TV: "${title}" S${season}E${episode} via p-stream`);

            const tid = typeof tmdbId === 'string' ? tmdbId : String(tmdbId || '');
            const media = {
                type: 'show',
                title: title,
                releaseYear: year,
                tmdbId: tid,
                episode: { number: Number(episode) },
                season: { number: Number(season) }
            };

            const streamResult = await providers.runAll({ media });

            if (streamResult && streamResult.stream) {
                console.log(`[Stream] ✅ Got stream from provider using p-stream`);
                const stream = streamResult.stream;

                // Map p-stream output to our standard format
                let sources = [];
                if (stream.type === 'hls') {
                    sources.push({ url: stream.playlist, quality: 'auto', isM3U8: true, provider: 'p-stream' });
                } else if (stream.type === 'file') {
                    if (stream.qualities) {
                        for (const [quality, fileObj] of Object.entries(stream.qualities)) {
                            if (fileObj && fileObj.url) {
                                sources.push({ url: fileObj.url, quality: quality, isM3U8: fileObj.type === 'm3u8', provider: 'p-stream' });
                            }
                        }
                    }
                }

                if (sources.length > 0) {
                    return {
                        sources: sources,
                        headers: stream.headers || {},
                        subtitles: (stream.captions || []).map(sub => ({
                            url: sub.url,
                            lang: sub.language || sub.id || 'Unknown'
                        }))
                    };
                }
            }

            console.log('[Stream] All providers failed');
            return null;
        } catch (error) {
            console.error('[Stream] TV stream error:', error);
            return null;
        }
    });

    // Load the app
    if (isDev) {
        // In dev mode, use Vite dev server (can't use app:// with external server)
        win.loadURL('http://localhost:3000');
        win.webContents.openDevTools();
    } else {
        // In production, use our custom app:// protocol
        win.loadURL('app://kinemora/index.html');
    }
}

app.whenReady().then(async () => {
    // Register custom protocol handler to serve local files
    // This makes our app run from app://kinemora/ instead of file://
    // YouTube and other embeds will treat this as a secure origin
    protocol.handle('app', (request) => {
        // app://kinemora/path -> /path
        let pathname = new URL(request.url).pathname;

        // Remove leading slash for Windows compatibility
        if (pathname.startsWith('/')) {
            pathname = pathname.substring(1);
        }

        // Default to index.html
        if (!pathname || pathname === '') {
            pathname = 'index.html';
        }

        // Resolve path relative to dist folder
        const filePath = path.join(__dirname, '../dist', pathname);

        // Security: Ensure we're still within dist folder
        const distPath = path.join(__dirname, '../dist');
        if (!filePath.startsWith(distPath)) {
            return new Response('Forbidden', { status: 403 });
        }

        try {
            // Use net.fetch with file:// URL
            return net.fetch(pathToFileURL(filePath).toString());
        } catch (e) {
            console.error('Protocol handler error:', e);
            return new Response('Not Found', { status: 404 });
        }
    });

    // === NEW: SMART COMIC STREAMING PROTOCOL (Local + Cloud) ===
    // Usage: comic://stream?path=...&file=... OR comic://image?id=...


    protocol.handle('comic', async (request) => {
        const url = new URL(request.url);

        // 1. CLOUD: Drive Image Proxy
        if (url.host === 'image') {
            const fileId = url.searchParams.get('id');
            if (!fileId) return new Response('Missing ID', { status: 400 });
            try {
                const result = await getFileStream(fileId);
                if (!result.success) {
                    console.error('[Comic] Drive Error:', result.error);
                    return new Response(`Drive Error: ${result.error}`, { status: 500 });
                }
                const webStream = Readable.toWeb(result.stream);
                return new Response(webStream);
            } catch (e) {
                console.error('[Comic] Stream Exception:', e);
                return new Response(`Stream Exception: ${e.message}`, { status: 500 });
            }
        }

        // 2. LOCAL: CBZ Reading
        const cbzPath = url.searchParams.get('path');
        const entryName = url.searchParams.get('file');

        if (!cbzPath || !entryName) return new Response('Bad Request', { status: 400 });

        try {
            let zip = zipCache.get(cbzPath);
            if (!zip) {
                console.log('[Comic] Opening Pipe:', cbzPath);
                zip = new StreamZip.async({ file: cbzPath });
                zipCache.set(cbzPath, zip);

                if (zipCache.size > 10) {
                    const firstKey = zipCache.keys().next().value;
                    zipCache.get(firstKey).close();
                    zipCache.delete(firstKey);
                }
            }

            const data = await zip.entryData(entryName);
            const ext = path.extname(entryName).toLowerCase();
            const mimeType = ext === '.webp' ? 'image/webp' :
                ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                    ext === '.png' ? 'image/png' : 'application/octet-stream';

            return new Response(data, {
                headers: { 'Content-Type': mimeType }
            });

        } catch (err) {
            console.error('[Comic] Stream failed:', err.message);
            return new Response('Not Found', { status: 404 });
        }
    });

    // === NEW: LIBRARY SCANNER IPC ===
    ipcMain.handle('library-scan', async (event, folderPath) => {
        try {
            console.log('[Library] Scanning:', folderPath);
            const files = fs.readdirSync(folderPath);
            const comics = [];

            // Check for covers folder
            const coversPath = path.join(folderPath, 'covers');
            const hasCovers = fs.existsSync(coversPath) && fs.statSync(coversPath).isDirectory();

            for (const file of files) {
                if (file.toLowerCase().endsWith('.cbz')) {
                    const filePath = path.join(folderPath, file);
                    let coverUrl = null;

                    // 1. Try sidecar cover (from user's 'covers' folder)
                    if (hasCovers) {
                        // User said: "filename.cbz" -> "filename.jpg" (or similar) in covers folder
                        // Assuming exact name match without extension + .jpg
                        const baseName = path.basename(file, '.cbz');
                        const possibleCover = path.join(coversPath, baseName + '.jpg');
                        // Try .jpeg, .png too? User said ".jpg" usually
                        if (fs.existsSync(possibleCover)) {
                            coverUrl = `file://${possibleCover.replace(/\\/g, '/')}`;
                        } else {
                            // Try exact filename match in covers
                            const possibleCover2 = path.join(coversPath, file); // e.g. comic.cbz (folder?) no
                            // User audio said "named after its respective comic file name"
                        }
                    }

                    // 2. If no sidecar, use smart "peek" to get page 1?
                    // We can add that later. For now, try to use comic protocol for page 1?
                    // coverUrl = `comic://stream?path=${encodeURIComponent(filePath)}&file=001.webp` (Guessed)

                    comics.push({
                        title: path.basename(file, '.cbz'),
                        path: filePath,
                        filename: file,
                        cover: coverUrl,
                        size: fs.statSync(filePath).size
                    });
                }
            }
            return { success: true, comics };
        } catch (err) {
            return { success: false, error: err.message };
        }
    });

    // Also helper to "Peek" the file list of a CBZ (for the Reader)
    ipcMain.handle('comic-get-pages', async (event, cbzPath) => {
        try {
            // Re-use cache if possible
            let zip = zipCache.get(cbzPath);
            if (!zip) {
                zip = new StreamZip.async({ file: cbzPath });
                zipCache.set(cbzPath, zip);
            }

            const entries = await zip.entries();
            // Filter images and sort
            const images = Object.values(entries)
                .filter(e => !e.isDirectory && /\.(webp|jpg|jpeg|png)$/i.test(e.name))
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
                .map(e => ({
                    name: e.name,
                    url: `comic://stream?path=${encodeURIComponent(cbzPath)}&file=${encodeURIComponent(e.name)}`
                }));

            return { success: true, pages: images };
        } catch (err) {
            return { success: false, error: err.message };
        }
    });

    // === NEW: CLOUD LIBRARY IPCs ===
    ipcMain.handle('cloud-library', async () => {
        console.log('[IPC] cloud-library called. getLibrary type:', typeof getLibrary);
        if (typeof getLibrary !== 'function') {
            return { success: false, error: 'SupabaseService not loaded - check .env file and console for errors' };
        }
        return await getLibrary();
    });

    ipcMain.handle('cloud-series', async () => {
        console.log('[IPC] cloud-series called. getSeries type:', typeof getSeries);
        if (typeof getSeries !== 'function') {
            return { success: false, error: 'SupabaseService not loaded' };
        }
        return await getSeries();
    });

    ipcMain.handle('cloud-issues', async (event, seriesId) => {
        if (typeof getIssues !== 'function') {
            return { success: false, error: 'SupabaseService not loaded' };
        }
        return await getIssues(seriesId);
    });

    ipcMain.handle('drive-stream', async (event, fileId) => {
        console.log('[IPC] drive-stream called for:', fileId);
        if (typeof downloadFile !== 'function') {
            return { success: false, error: 'DriveService not loaded - check credentials.json' };
        }
        return await downloadFile(fileId);
    });

    // === SUBTITLE FETCH PROXY (bypasses CORS) ===
    ipcMain.handle('fetch-subtitle', async (event, url) => {
        try {
            console.log('[Main] Fetching subtitle:', url);
            let finalUrl = url;

            // Handle OpenSubtitles v1 API custom protocol
            if (url.startsWith('opensubtitles://')) {
                const fileId = url.replace('opensubtitles://', '');

                // Read API key from environment, if any
                const apiKey = process.env.VITE_OPENSUBTITLES_API_KEY || '';
                const headers = {
                    'User-Agent': 'Kinemora v2',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                };
                if (apiKey) {
                    headers['Api-Key'] = apiKey;
                }

                console.log('[Main] Getting AWS download link from OpenSubtitles for file:', fileId);
                const dlResponse = await net.fetch('https://api.opensubtitles.com/api/v1/download', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ file_id: parseInt(fileId) })
                });

                if (!dlResponse.ok) {
                    throw new Error(`OpenSubtitles download API returned ${dlResponse.status}`);
                }

                const dlData = await dlResponse.json();
                if (!dlData.link) {
                    throw new Error('No download link found in OpenSubtitles response');
                }
                finalUrl = dlData.link;
                console.log('[Main] Resolved OpenSubtitles link:', finalUrl);
            }

            const response = await net.fetch(finalUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const text = await response.text();
            console.log('[Main] Subtitle fetched, length:', text.length);
            console.log('[Main] Subtitle prefix preview:', text.substring(0, 200).replace(/\n/g, '\\n'));
            return { success: true, text };
        } catch (err) {
            console.error('[Main] Subtitle fetch error:', err.message);
            return { success: false, error: err.message };
        }
    });

});

app.whenReady().then(createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});