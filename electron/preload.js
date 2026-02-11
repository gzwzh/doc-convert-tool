const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取版本号
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // 窗口控制
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),
  windowIsMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  
  // 监听窗口状态变化
  onWindowMaximized: (callback) => {
    ipcRenderer.on('window-maximized', (event, isMaximized) => callback(isMaximized));
  },
  
  // 平台信息
  platform: process.platform,
  
  // 外部打开 URL
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // 选择目录
  selectDirectory: () => ipcRenderer.invoke('select-directory'),

  // 下载文件
  downloadFile: (url, dirPath, filename) => ipcRenderer.invoke('download-file', { url, dirPath, filename }),

  // 是否为开发模式
  isDev: process.env.NODE_ENV === 'development',

  // 获取后端基础 URL
  getBackendBaseUrl: () => ipcRenderer.invoke('get-backend-base-url')
});
