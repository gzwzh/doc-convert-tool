const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// 禁用GPU加速以避免缓存错误
app.disableHardwareAcceleration();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false, // 隐藏原生标题栏
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      cache: false, // 禁用缓存
    },
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  } else {
    // 前端在 Vite 开发服务器 5173 端口运行
    mainWindow.loadURL('http://localhost:5173', {
      extraHeaders: 'pragma: no-cache\n' // 禁用HTTP缓存
    });
    mainWindow.webContents.openDevTools();
    
    // 禁用缓存
    mainWindow.webContents.session.clearCache();
  }
}

app.whenReady().then(() => {
  // IPC Handlers
  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (canceled) {
      return null;
    } else {
      return filePaths[0];
    }
  });

  ipcMain.handle('dialog:showSaveDialog', async (event, options) => {
    const { canceled, filePath } = await dialog.showSaveDialog(options);
    if (canceled) {
      return null;
    } else {
      return filePath;
    }
  });

  ipcMain.handle('file:save', async (event, filePath, buffer) => {
    try {
      fs.writeFileSync(filePath, Buffer.from(buffer));
      return { success: true };
    } catch (error) {
      console.error('File save error:', error);
      return { success: false, error: error.message };
    }
  });

  // 窗口控制 IPC 处理
  ipcMain.on('window-minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.minimize();
  });

  ipcMain.on('window-maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });

  ipcMain.on('window-close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.close();
  });

  createWindow();

  // Here you can spawn the Python backend
  // Example:
  // const { spawn } = require('child_process');
  // const pythonProcess = spawn('python', [path.join(__dirname, '../backend/main.py')]);

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
