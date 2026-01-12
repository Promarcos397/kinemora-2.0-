const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    request: (options) => ipcRenderer.invoke('request', options),
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),

    // Streaming API (runs in main process to bypass browser header restrictions)
    getMovieStream: (title, year, tmdbId) => ipcRenderer.invoke('stream:movie', { title, year, tmdbId }),
    getTvStream: (title, season, episode, year, tmdbId) => ipcRenderer.invoke('stream:tv', { title, season, episode, year, tmdbId })
});
