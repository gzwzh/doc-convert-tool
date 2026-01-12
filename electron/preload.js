const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Example API to expose to frontend
  // sendMessage: (message) => ipcRenderer.send('message', message),
});
