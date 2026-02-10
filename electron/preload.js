const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取版本号
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // 检查更新
  checkUpdate: () => ipcRenderer.invoke('check-update'),
  
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
  
  // 是否为开发模式
  isDev: process.env.NODE_ENV === 'development'
});
