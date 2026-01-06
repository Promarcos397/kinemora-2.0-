import { app, BrowserWindow, dialog, ipcMain, session, protocol, net } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
            nodeIntegration: true,
            contextIsolation: false, // Allowed for this local app to simplify IPC usage
            webSecurity: false // Disable CORS for streaming
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

    // Add Permissions-Policy header to allow YouTube features
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        const headers = { ...details.responseHeaders };

        // Grant permissions for YouTube embed features
        headers['Permissions-Policy'] = ['autoplay=*, encrypted-media=*, picture-in-picture=*, clipboard-write=*, accelerometer=*, gyroscope=*'];

        callback({ cancel: false, responseHeaders: headers });
    });

    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.log('Failed to load:', errorCode, errorDescription);
    });

    win.once('ready-to-show', () => {
        win.show();
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

app.whenReady().then(() => {
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
