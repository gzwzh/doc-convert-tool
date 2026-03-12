const { app, BrowserWindow, ipcMain, dialog, net, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');
const fs = require('fs');

// 加载国际化配置
const zhLocale = require('./locales/zh.json');
const t = (key) => {
  const keys = key.split('.');
  let result = zhLocale;
  for (const k of keys) {
    if (result[k]) {
      result = result[k];
    } else {
      return key;
    }
  }
  return result;
};

// 获取应用配置
const pkg = require('../package.json');
const SOFTWARE_ID = pkg.softwareId || '10031';
const UPDATE_CHECK_URL = 'http://software.kunqiongai.com:8000/api/v1/updates/check/';

// 动态获取当前版本
function getCurrentVersion() {
  try {
    const versionPath = path.join(process.resourcesPath, 'version.txt');
    if (fs.existsSync(versionPath)) {
      return fs.readFileSync(versionPath, 'utf8').trim();
    }
  } catch (e) {
    console.error('读取 version.txt 失败:', e);
  }
  return pkg.version || '1.0.0';
}

let mainWindow;
let backendProcess;

// 检查更新
async function checkUpdate() {
  if (isDev) return; // 开发环境跳过更新检查

  const currentVersion = getCurrentVersion();
  console.log(`检查更新: software=${SOFTWARE_ID}, version=${currentVersion}`);
  
  const url = `${UPDATE_CHECK_URL}?software=${SOFTWARE_ID}&version=${currentVersion}`;
  
  const request = net.request(url);
  request.on('response', (response) => {
    let body = '';
    response.on('data', (chunk) => {
      body += chunk.toString();
    });
    response.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.has_update) {
          console.log('发现新版本:', data.version);
          handleUpdate(data);
        } else {
          console.log('当前已是最新版本');
        }
      } catch (e) {
        console.error('解析更新响应失败:', e);
      }
    });
  });
  request.on('error', (error) => {
    console.error('检查更新请求失败:', error);
  });
  request.end();
}

// 处理更新
function handleUpdate(updateInfo) {
  const dialogOpts = {
    type: 'info',
    buttons: [t('update.update_now'), t('update.later')],
    title: t('update.title'),
    message: `${t('update.found_new_version')} v${updateInfo.version}`,
    detail: `${t('update.update_log')}:\n${updateInfo.update_log || t('update.no_update_log')}\n\n${t('update.ask_update')}`
  };

  dialog.showMessageBox(mainWindow, dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      startUpdater(updateInfo);
    }
  });
}

// 启动更新程序
function startUpdater(updateInfo) {
  const appPath = getAppPath();
  const updaterPath = path.join(appPath, 'updater.exe');
  
  if (!fs.existsSync(updaterPath)) {
    console.error('更新程序不存在:', updaterPath);
    dialog.showErrorBox(t('update.failed'), t('update.updater_missing'));
    return;
  }

  const args = [
    '--url', updateInfo.download_url,
    '--hash', updateInfo.package_hash || '',
    '--dir', appPath,
    '--exe', isDev ? path.basename(process.execPath) : path.relative(appPath, process.execPath),
    '--pid', process.pid.toString()
  ];

  console.log('启动更新程序:', updaterPath, args);

  const subprocess = spawn(updaterPath, args, {
    detached: true,
    stdio: 'ignore',
    windowsHide: false
  });

  subprocess.unref();
  app.quit();
}

// 获取应用目录
function getAppPath() {
  if (isDev) {
    return __dirname.replace(/[\\/]electron$/, '');
  }
  // 生产环境：返回 resources 目录
  return process.resourcesPath;
}

// 启动后端服务
function startBackend() {
  const appPath = getAppPath();
  const backendPath = isDev 
    ? path.join(appPath, 'backend', 'main.py')
    : path.join(appPath, 'backend', 'dist', 'backend-server', 'backend-server.exe');

  console.log('启动后端服务:', backendPath);

  if (isDev) {
    // 开发环境：使用 Python 运行
    backendProcess = spawn('python', [backendPath], {
      cwd: path.dirname(backendPath),
      env: { ...process.env, BACKEND_PORT: '8002' }
    });
  } else {
    // 生产环境：运行打包后的 exe
    if (fs.existsSync(backendPath)) {
      backendProcess = spawn(backendPath, [], {
        cwd: path.dirname(backendPath),
        env: { ...process.env, BACKEND_PORT: '8002' },
        windowsHide: true
      });
    } else {
      console.error('后端程序不存在:', backendPath);
      dialog.showErrorBox('启动失败', '后端服务程序不存在，请重新安装应用');
      app.quit();
      return;
    }
  }

  backendProcess.stdout.on('data', (data) => {
    console.log(`后端输出: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    const output = data.toString();
    if (output.toLowerCase().includes('error')) {
      console.error(`后端错误: ${output}`);
    } else {
      console.log(`后端日志: ${output}`);
    }
  });

  backendProcess.on('close', (code) => {
    console.log(`后端进程退出，代码: ${code}`);
  });
}

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1050,  // 设置最小宽度
    minHeight: 800, // 设置最小高度
    frame: false, // 隐藏默认标题栏
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // 允许加载本地资源
      partition: 'persist:main' // 使用持久化分区，方便后续清理缓存
    },
    icon: path.join(__dirname, '..', 'frontend', 'public', 'app.ico'),
    show: false,
    backgroundColor: '#ffffff',
    titleBarStyle: 'hidden' // 隐藏标题栏
  });

  // 加载前端
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境：从 resources 目录加载
    const frontendPath = path.join(process.resourcesPath, 'frontend', 'dist', 'index.html');
    console.log('加载前端文件:', frontendPath);
    
    if (fs.existsSync(frontendPath)) {
      mainWindow.loadFile(frontendPath);
    } else {
      // 尝试从 app.asar 加载
      const asarPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
      console.log('尝试从 asar 加载:', asarPath);
      
      if (fs.existsSync(asarPath)) {
        mainWindow.loadFile(asarPath);
      } else {
        console.error('前端文件不存在');
        console.error('尝试路径1:', frontendPath);
        console.error('尝试路径2:', asarPath);
        dialog.showErrorBox('启动失败', '前端资源文件不存在，请重新安装应用');
        app.quit();
      }
    }
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 监听窗口最大化/还原状态
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximized', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-maximized', false);
  });

  // 处理 window.open 调用，在外部浏览器中打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 应用启动
app.whenReady().then(async () => {
  console.log('应用启动中...');
  console.log('应用路径:', getAppPath());
  console.log('开发模式:', isDev);

  // 启动后端服务
  startBackend();

  // 检查更新
  checkUpdate();

  // 等待后端启动
  setTimeout(() => {
    // 创建主窗口
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 应用退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // 关闭后端进程
  if (backendProcess) {
    console.log('关闭后端进程...');
    backendProcess.kill();
  }
});

// IPC 通信
ipcMain.handle('get-version', () => {
  return getCurrentVersion();
});

ipcMain.handle('get-backend-base-url', () => {
  return 'http://127.0.0.1:8002';
});

// 窗口控制
ipcMain.handle('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle('window-is-maximized', () => {
  if (mainWindow) {
    return mainWindow.isMaximized();
  }
  return false;
});

// 外部浏览器打开 URL
ipcMain.handle('open-external', async (event, url) => {
  if (url) {
    await shell.openExternal(url);
  }
});

// 选择目录
ipcMain.handle('select-directory', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

// 下载文件并保存
ipcMain.handle('download-file', async (event, { url, dirPath, filename }) => {
  return new Promise((resolve) => {
    try {
      const filePath = path.join(dirPath, filename);
      const fileStream = fs.createWriteStream(filePath);
      
      const request = net.request(url);
      
      request.on('response', (response) => {
        if (response.statusCode !== 200) {
          fileStream.close();
          fs.unlinkSync(filePath); // 删除不完整的文件
          resolve({ success: false, error: `HTTP ${response.statusCode}` });
          return;
        }

        response.on('data', (chunk) => {
          fileStream.write(chunk);
        });

        response.on('end', () => {
          fileStream.end();
          resolve({ success: true, path: filePath });
        });

        response.on('error', (err) => {
          fileStream.close();
          fs.unlinkSync(filePath);
          resolve({ success: false, error: err.message });
        });
      });

      request.on('error', (err) => {
        fileStream.close();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        resolve({ success: false, error: err.message });
      });

      request.end();
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
});
