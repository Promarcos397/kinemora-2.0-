import { app, BrowserWindow, dialog, ipcMain, session, protocol, net } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function createWindow() {
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
            preload: path.join(__dirname, 'preload.cjs')
        },
        autoHideMenuBar: true,
    });

    // Window Control IPC Handlers
    ipcMain.on('window-minimize', () => win.minimize());
    ipcMain.on('window-maximize', () => {
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
    });
    ipcMain.on('window-close', () => win.close());

    // Enable streaming permissions
    win.webContents.session.setPermissionCheckHandler(() => true);
    win.webContents.session.setPermissionRequestHandler((_, __, callback) => callback(true));

    // STREAMING HEADER FIX: Inject Referer/User-Agent for ALL streaming-related requests
    const STREAMING_DOMAINS = {
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

    // STREAMING API: Run Consumet in main process (bypasses browser XHR header restrictions)
    ipcMain.handle('stream:movie', async (event, { title, year, tmdbId }) => {
        try {
            console.log(`[Stream] Getting movie: "${title}" (${year})`);
            const { MOVIES } = await import('@consumet/extensions');

            const providers = [
                { name: 'Goku', create: () => new MOVIES.Goku() },
                { name: 'HiMovies', create: () => new MOVIES.HiMovies() },
                { name: 'FlixHQ', create: () => new MOVIES.FlixHQ() },
                { name: 'SFlix', create: () => new MOVIES.SFlix() },
            ];

            for (const { name, create } of providers) {
                try {
                    console.log(`[Stream] Trying ${name}...`);
                    const provider = create();
                    const searchResults = await provider.search(title);

                    if (!searchResults?.results?.length) continue;

                    const match = searchResults.results.find(r =>
                        r.title?.toLowerCase().includes(title.toLowerCase()) ||
                        title.toLowerCase().includes(r.title?.toLowerCase())
                    ) || searchResults.results[0];

                    console.log(`[Stream] Found: ${match.title}`);
                    const info = await provider.fetchMediaInfo(match.id);

                    if (!info?.episodes?.length) continue;

                    const sources = await provider.fetchEpisodeSources(info.episodes[0].id, match.id);

                    if (sources?.sources?.length) {
                        console.log(`[Stream] ✅ Got ${sources.sources.length} sources from ${name}`);
                        return {
                            sources: sources.sources.map(s => ({
                                url: s.url,
                                quality: s.quality || 'auto',
                                isM3U8: s.isM3U8 ?? s.url.includes('.m3u8'),
                                provider: name
                            })),
                            headers: sources.headers || {},
                            subtitles: (sources.subtitles || []).map(sub => ({
                                url: sub.url,
                                lang: sub.lang || 'Unknown'
                            }))
                        };
                    }
                } catch (err) {
                    console.error(`[Stream] ${name} error:`, err.message);
                }
            }

            console.log('[Stream] All providers failed');
            return null;
        } catch (error) {
            console.error('[Stream] Movie stream error:', error);
            return null;
        }
    });

    ipcMain.handle('stream:tv', async (event, { title, season, episode, year, tmdbId }) => {
        try {
            console.log(`[Stream] Getting TV: "${title}" S${season}E${episode}`);
            const { MOVIES } = await import('@consumet/extensions');

            const providers = [
                { name: 'Goku', create: () => new MOVIES.Goku() },
                { name: 'HiMovies', create: () => new MOVIES.HiMovies() },
                { name: 'FlixHQ', create: () => new MOVIES.FlixHQ() },
                { name: 'SFlix', create: () => new MOVIES.SFlix() },
            ];

            for (const { name, create } of providers) {
                try {
                    console.log(`[Stream] Trying ${name}...`);
                    const provider = create();
                    const searchResults = await provider.search(title);

                    if (!searchResults?.results?.length) continue;

                    const match = searchResults.results[0];
                    console.log(`[Stream] Found: ${match.title}`);

                    const info = await provider.fetchMediaInfo(match.id);
                    if (!info?.episodes?.length) continue;

                    const targetEp = info.episodes.find(ep =>
                        ep.season === season && ep.episode === episode
                    ) || info.episodes.find(ep => ep.number === episode);

                    if (!targetEp) continue;

                    const sources = await provider.fetchEpisodeSources(targetEp.id, match.id);

                    if (sources?.sources?.length) {
                        console.log(`[Stream] ✅ Got ${sources.sources.length} sources from ${name}`);
                        return {
                            sources: sources.sources.map(s => ({
                                url: s.url,
                                quality: s.quality || 'auto',
                                isM3U8: s.isM3U8 ?? s.url.includes('.m3u8'),
                                provider: name
                            })),
                            headers: sources.headers || {},
                            subtitles: (sources.subtitles || []).map(sub => ({
                                url: sub.url,
                                lang: sub.lang || 'Unknown'
                            }))
                        };
                    }
                } catch (err) {
                    console.error(`[Stream] ${name} error:`, err.message);
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

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});