const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  showSaveDialog: (options) => ipcRenderer.invoke('dialog:showSaveDialog', options),
  saveFile: (filePath, buffer) => ipcRenderer.invoke('file:save', filePath, buffer),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  getBackendBaseUrl: () => ipcRenderer.invoke('backend:getBaseUrl'),
  getResourceUrl: (filename) => ipcRenderer.invoke('resource:getUrl', filename),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url)
});
