const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    request: (options) => ipcRenderer.invoke('request', options),
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),

    // Streaming API (runs in main process to bypass browser header restrictions)
    getMovieStream: (title, year, tmdbId) => ipcRenderer.invoke('stream:movie', { title, year, tmdbId }),
    getTvStream: (title, season, episode, year, tmdbId) => ipcRenderer.invoke('stream:tv', { title, season, episode, year, tmdbId }),

    // VidSrc BrowserView API (still available for fallback)
    vidsrc: {
        create: (url, bounds) => ipcRenderer.invoke('vidsrc-create', { url, bounds }),
        destroy: () => ipcRenderer.invoke('vidsrc-destroy'),
        resize: (bounds) => ipcRenderer.send('vidsrc-resize', bounds),
        execute: (script) => ipcRenderer.invoke('vidsrc-execute', script),
        findVideo: () => ipcRenderer.invoke('vidsrc-find-video'),
        onLoaded: (callback) => {
            ipcRenderer.on('vidsrc-loaded', callback);
            return () => ipcRenderer.removeListener('vidsrc-loaded', callback);
        },
    },

    // Consumet API - Primary streaming method
    consumet: {
        getStream: (title, type, year, season, episode) =>
            ipcRenderer.invoke('consumet-stream', { title, type, year, season, episode }),
        prefetchStream: (title, type, year, season, episode) =>
            ipcRenderer.invoke('consumet-prefetch', { title, type, year, season, episode }),
        // Book Service (Manga/Comics)
        books: {
            search: (query, type) => ipcRenderer.invoke('consumet-books-search', { query, type }),
            getInfo: (id, type) => ipcRenderer.invoke('consumet-books-info', { id, type }),
            getPages: (chapterId, type) => ipcRenderer.invoke('consumet-books-read', { chapterId, type })
        }
    },

    // Local Library API (Feature #1)
    local: {
        scan: (folderPath) => ipcRenderer.invoke('library-scan', folderPath),
        getPages: (cbzPath) => ipcRenderer.invoke('comic-get-pages', cbzPath)
    },

    // Cloud Library API (Feature #2)
    cloud: {
        getLibrary: () => ipcRenderer.invoke('cloud-library'),
        getSeries: () => ipcRenderer.invoke('cloud-series'),
        getIssues: (seriesId) => ipcRenderer.invoke('cloud-issues', seriesId),
        stream: (fileId) => ipcRenderer.invoke('drive-stream', fileId)
    },

    // Subtitle Fetch (bypasses CORS via main process)
    fetchSubtitle: (url) => ipcRenderer.invoke('fetch-subtitle', url)
}
);
