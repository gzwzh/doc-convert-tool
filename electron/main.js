const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');
const fs = require('fs');

let mainWindow;
let backendProcess;

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
    console.error(`后端错误: ${data}`);
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
}

// 应用启动
app.whenReady().then(async () => {
  console.log('应用启动中...');
  console.log('应用路径:', getAppPath());
  console.log('开发模式:', isDev);

  // 1. 检查更新（仅在生产环境）
  if (!isDev) {
    try {
      const shouldExit = await checkForUpdatesOnStartup();
      if (shouldExit) {
        console.log('退出应用以进行更新');
        return; // 不需要 app.quit()，因为 updater 会处理
      }
    } catch (err) {
      console.error('更新检查出错:', err);
    }
  }

  // 2. 启动后端服务
  startBackend();

  // 3. 等待后端启动
  setTimeout(() => {
    // 4. 创建主窗口
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 检查更新（启动时）
async function checkForUpdatesOnStartup() {
  const appPath = getAppPath();
  const configPath = path.join(appPath, 'update_config.json');
  const versionPath = path.join(appPath, 'version.txt');
  
  // 检查配置文件是否存在
  if (!fs.existsSync(configPath) || !fs.existsSync(versionPath)) {
    console.log('更新配置文件不存在，跳过更新检查');
    return false;
  }
  
  try {
    // 读取配置
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const currentVersion = fs.readFileSync(versionPath, 'utf-8').trim();
    
    if (!config.auto_check_update) {
      console.log('自动更新检查已禁用');
      return false;
    }
    
    console.log('当前版本:', currentVersion);
    console.log('检查更新:', config.server_url);
    
    // 检查更新
    const updateInfo = await checkUpdateFromServer(config.server_url, config.software_id, currentVersion);
    
    if (!updateInfo || !updateInfo.has_update) {
      console.log('当前已是最新版本');
      return false;
    }
    
    console.log('发现新版本:', updateInfo.version);
    
    // 显示更新对话框
    const result = await dialog.showMessageBox({
      type: 'info',
      title: '发现新版本',
      message: `发现新版本 ${updateInfo.version}\n当前版本: ${currentVersion}\n\n更新内容:\n${updateInfo.update_log || '暂无更新说明'}`,
      buttons: updateInfo.is_mandatory ? ['立即更新'] : ['立即更新', '稍后提醒'],
      defaultId: 0,
      cancelId: updateInfo.is_mandatory ? -1 : 1,
      noLink: true
    });
    
    if (result.response !== 0) {
      // 用户选择稍后更新
      if (updateInfo.is_mandatory) {
        // 强制更新被拒绝，退出应用
        app.quit();
        return true;
      }
      return false;
    }
    
    // 用户选择立即更新，启动 updater
    const updaterPath = path.join(appPath, 'updater.exe');
    
    if (!fs.existsSync(updaterPath)) {
      console.error('更新程序不存在:', updaterPath);
      dialog.showErrorBox('更新失败', '更新程序不存在');
      return false;
    }
    
    // 获取应用安装目录和主程序名称
    const appDir = path.dirname(process.execPath);
    const exeName = path.basename(process.execPath);
    
    // 先下载更新包到临时目录
    const tempDir = path.join(appDir, 'temp_update');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempZipPath = path.join(tempDir, 'update.zip');
    
    // 显示下载进度对话框
    console.log('开始下载更新包:', updateInfo.download_url);
    
    try {
      // 在主程序中下载，这样可以更好地处理错误
      await downloadUpdatePackage(updateInfo.download_url, tempZipPath, updateInfo.package_hash);
      
      console.log('下载完成，启动 updater.exe');
      
      // 构建 updater.exe 参数（使用本地 ZIP 文件）
      const args = [
        '--zip', tempZipPath,
        '--hash', updateInfo.package_hash || '',
        '--dir', appDir,
        '--exe', exeName,
        '--pid', process.pid.toString()
      ];
      
      console.log('启动更新程序:', updaterPath);
      console.log('应用目录:', appDir);
      console.log('主程序:', exeName);
      console.log('进程ID:', process.pid);
      console.log('参数:', args);
      
      // 启动 updater.exe（独立进程）
      const subprocess = spawn(updaterPath, args, {
        detached: true,
        stdio: 'ignore',
        windowsHide: false // 显示更新窗口
      });
      
      subprocess.unref(); // 允许父进程退出而不等待子进程
      
      // 立即退出主程序
      app.quit();
      return true;
      
    } catch (err) {
      console.error('下载更新包失败:', err);
      
      // 清理临时文件
      try {
        if (fs.existsSync(tempZipPath)) {
          fs.unlinkSync(tempZipPath);
        }
      } catch (e) {}
      
      // 询问用户是否重试
      const retryResult = await dialog.showMessageBox({
        type: 'error',
        title: '更新失败',
        message: '下载更新包失败',
        detail: `错误信息: ${err.message}\n\n您可以稍后在"关于"菜单中手动检查更新。`,
        buttons: ['重试', '稍后更新'],
        defaultId: 0,
        cancelId: 1
      });
      
      if (retryResult.response === 0) {
        // 用户选择重试，递归调用
        return await checkForUpdatesOnStartup();
      }
      
      return false;
    }
    
  } catch (err) {
    console.error('更新检查失败:', err);
    return false;
  }
}

// 从服务器检查更新
function checkUpdateFromServer(serverUrl, softwareId, currentVersion) {
  return new Promise((resolve) => {
    const url = `${serverUrl}/api/v1/updates/check/?software=${softwareId}&version=${currentVersion}`;
    
    console.log('请求更新信息:', url);
    
    const protocol = serverUrl.startsWith('https') ? require('https') : require('http');
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('更新检查结果:', result);
          resolve(result);
        } catch (err) {
          console.error('解析更新信息失败:', err);
          resolve(null);
        }
      });
    });
    
    req.on('error', (err) => {
      console.error('请求更新信息失败:', err);
      resolve(null);
    });
    
    req.setTimeout(10000, () => {
      console.error('请求更新信息超时');
      req.destroy();
      resolve(null);
    });
  });
}

// 下载更新包（优化版本，使用流式处理）
function downloadUpdatePackage(url, destPath, expectedHash) {
  return new Promise((resolve, reject) => {
    console.log('开始下载:', url);
    console.log('保存到:', destPath);
    
    const protocol = url.startsWith('https') ? require('https') : require('http');
    const crypto = require('crypto');
    const { pipeline } = require('stream');
    const { Transform } = require('stream');
    
    const file = fs.createWriteStream(destPath);
    const hash = crypto.createHash('sha256');
    
    let downloadedSize = 0;
    let totalSize = 0;
    let lastLogTime = Date.now();
    let lastLogSize = 0;
    
    // 创建一个 Transform 流来计算哈希和进度
    const progressTransform = new Transform({
      transform(chunk, encoding, callback) {
        hash.update(chunk);
        downloadedSize += chunk.length;
        
        // 每秒输出一次进度
        const now = Date.now();
        if (now - lastLogTime >= 1000) {
          if (totalSize > 0) {
            const progress = ((downloadedSize / totalSize) * 100).toFixed(1);
            const speed = ((downloadedSize - lastLogSize) / 1024 / 1024).toFixed(2);
            const downloaded = (downloadedSize / 1024 / 1024).toFixed(2);
            const total = (totalSize / 1024 / 1024).toFixed(2);
            console.log(`下载进度: ${progress}% (${downloaded}/${total} MB) 速度: ${speed} MB/s`);
            lastLogTime = now;
            lastLogSize = downloadedSize;
          }
        }
        
        callback(null, chunk);
      }
    });
    
    const req = protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.end();
        reject(new Error(`下载失败: HTTP ${res.statusCode}`));
        return;
      }
      
      totalSize = parseInt(res.headers['content-length'] || '0');
      console.log('文件大小:', (totalSize / 1024 / 1024).toFixed(2), 'MB');
      
      // 使用 pipeline 自动处理背压
      pipeline(
        res,
        progressTransform,
        file,
        (err) => {
          if (err) {
            console.error('下载管道错误:', err);
            reject(new Error(`下载出错: ${err.message}`));
          } else {
            const actualHash = hash.digest('hex');
            console.log('下载完成');
            console.log('计算的 SHA256:', actualHash);
            
            if (expectedHash && actualHash.toLowerCase() !== expectedHash.toLowerCase()) {
              try {
                fs.unlinkSync(destPath);
              } catch (e) {}
              reject(new Error('文件校验失败，SHA256 不匹配'));
            } else {
              console.log('SHA256 校验通过');
              resolve();
            }
          }
        }
      );
    });
    
    req.on('error', (err) => {
      file.end();
      reject(new Error(`网络错误: ${err.message}`));
    });
    
    req.setTimeout(300000, () => { // 5 分钟超时
      req.destroy();
      file.end();
      reject(new Error('下载超时（5分钟）'));
    });
  });
}

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
  const appPath = getAppPath();
  const versionFile = path.join(appPath, 'version.txt');
  console.log('Fetching version from:', versionFile);
  
  if (fs.existsSync(versionFile)) {
    const version = fs.readFileSync(versionFile, 'utf-8').trim();
    console.log('Version found in file:', version);
    return version;
  }
  const appVersion = app.getVersion();
  console.log('Version file not found, using app.getVersion():', appVersion);
  return appVersion;
});

ipcMain.handle('check-update', async () => {
  const appPath = getAppPath();
  const configPath = path.join(appPath, 'update_config.json');
  const versionPath = path.join(appPath, 'version.txt');
  
  if (!fs.existsSync(configPath) || !fs.existsSync(versionPath)) {
    return { has_update: false };
  }
  
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const currentVersion = fs.readFileSync(versionPath, 'utf-8').trim();
    
    const updateInfo = await checkUpdateFromServer(config.server_url, config.software_id, currentVersion);
    
    return {
      has_update: updateInfo?.has_update || false,
      version: updateInfo?.version || '',
      update_log: updateInfo?.update_log || ''
    };
  } catch (err) {
    console.error('检查更新失败:', err);
    return { has_update: false };
  }
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
