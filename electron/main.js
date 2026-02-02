const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const net = require('net');
const { spawn } = require('child_process');

let backendProcess = null;
let backendPort = 8002;

function getBackendExecutablePath() {
  const exeName = process.platform === 'win32' ? 'backend-server.exe' : 'backend-server';
  const candidates = [
    path.join(process.resourcesPath, 'backend', 'dist', 'backend-server', exeName),
    path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'dist', 'backend-server', exeName),
    path.join(process.resourcesPath, 'backend', 'dist', exeName),
    path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'dist', exeName)
  ];
  
  // 添加调试日志
  console.log('[Backend] Searching for backend executable...');
  console.log('[Backend] resourcesPath:', process.resourcesPath);
  
  for (const candidate of candidates) {
    console.log('[Backend] Checking:', candidate);
    if (fs.existsSync(candidate)) {
      console.log('[Backend] Found backend at:', candidate);
      return candidate;
    }
  }
  
  console.error('[Backend] Backend executable not found! Tried:', candidates);
  return candidates[0];
}

function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => resolve(false));
    server.listen(port, '127.0.0.1', () => {
      server.close(() => resolve(true));
    });
  });
}

async function findAvailablePort(startPort, maxAttempts = 50) {
  for (let port = startPort; port < startPort + maxAttempts; port += 1) {
    const available = await checkPortAvailable(port);
    if (available) return port;
  }
  return startPort;
}

async function startBackend() {
  if (backendProcess) {
    console.log('[Backend] Backend process already running');
    return;
  }
  
  backendPort = await findAvailablePort(8002);
  console.log('[Backend] Using port:', backendPort);
  
  if (app.isPackaged) {
    const executablePath = getBackendExecutablePath();
    console.log('[Backend] Starting backend executable:', executablePath);
    
    backendProcess = spawn(executablePath, [], {
      stdio: ['ignore', 'pipe', 'pipe'], // 捕获输出用于调试
      windowsHide: false, // 暂时显示窗口以便调试
      env: { ...process.env, BACKEND_PORT: String(backendPort) }
    });
    
    // 捕获输出日志
    backendProcess.stdout.on('data', (data) => {
      console.log('[Backend stdout]:', data.toString());
    });
    
    backendProcess.stderr.on('data', (data) => {
      console.error('[Backend stderr]:', data.toString());
    });
  } else {
    const pythonExecutable = process.env.PYTHON || 'python';
    const backendEntry = path.join(__dirname, '../backend/main.py');
    console.log('[Backend] Starting Python backend:', backendEntry);
    
    backendProcess = spawn(pythonExecutable, [backendEntry], {
      stdio: 'ignore',
      windowsHide: true,
      env: { ...process.env, BACKEND_PORT: String(backendPort) }
    });
  }
  
  backendProcess.on('error', (err) => {
    console.error('[Backend] Process error:', err);
    backendProcess = null;
  });
  
  backendProcess.on('exit', (code, signal) => {
    console.log('[Backend] Process exited with code:', code, 'signal:', signal);
    backendProcess = null;
  });
  
  console.log('[Backend] Backend process started with PID:', backendProcess.pid);
}

// 禁用GPU加速以避免缓存错误
app.disableHardwareAcceleration();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1350,
    height: 875,
    minWidth: 1125,
    minHeight: 740,
    frame: false, // 隐藏原生标题栏
    title: '文档转换器', // 设置窗口标题
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      cache: false, // 禁用缓存
    },
  });

  // 拦截新窗口请求，在外部浏览器打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (app.isPackaged) {
    const indexPath = path.join(__dirname, '../frontend/dist/index.html');
    console.log('[Frontend] Loading from:', indexPath);
    mainWindow.loadFile(indexPath);
    
    // 打包版本不打开开发者工具
    // mainWindow.webContents.openDevTools();
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

app.whenReady().then(async () => {
  await startBackend();
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

  ipcMain.handle('backend:getBaseUrl', async () => `http://127.0.0.1:${backendPort}`);
  
  // 在外部浏览器打开链接
  ipcMain.handle('shell:openExternal', async (event, url) => {
    try {
      await shell.openExternal(url);
      return { success: true };
    } catch (error) {
      console.error('Failed to open external URL:', error);
      return { success: false, error: error.message };
    }
  });
  
  // 获取资源文件URL
  ipcMain.handle('resource:getUrl', async (event, filename) => {
    try {
      let resourcePath;
      if (app.isPackaged) {
        // 打包后，资源在frontend/dist目录
        resourcePath = path.join(process.resourcesPath, 'app.asar', 'frontend', 'dist', filename);
        // 如果在asar中找不到，尝试unpacked目录
        if (!fs.existsSync(resourcePath)) {
          resourcePath = path.join(process.resourcesPath, 'app.asar.unpacked', 'frontend', 'dist', filename);
        }
        // 如果还找不到，尝试直接在resources下
        if (!fs.existsSync(resourcePath)) {
          resourcePath = path.join(process.resourcesPath, filename);
        }
      } else {
        // 开发环境，资源在frontend/public目录
        resourcePath = path.join(__dirname, '../frontend/public', filename);
      }
      
      if (fs.existsSync(resourcePath)) {
        // 返回file://协议的URL
        return `file://${resourcePath.replace(/\\/g, '/')}`;
      }
      
      console.error('[Resource] File not found:', filename, 'tried:', resourcePath);
      return null;
    } catch (error) {
      console.error('[Resource] Error loading resource:', error);
      return null;
    }
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

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
});
