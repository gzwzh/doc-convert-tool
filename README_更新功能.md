# 文档转换工具 - 更新功能说明

## ✅ 已完成

### 1. 更新功能核心模块
- `version.txt` - 版本号：1.0.0
- `update_config.json` - 软件编号：10031
- `auto_updater.py` - 自动更新核心
- `update_checker_gui.py` - 更新GUI界面
- `updater.exe` - 独立更新程序

### 2. Electron 集成
- `electron/main.js` - 主程序（已集成更新检查）
- `electron/preload.js` - 预加载脚本
- `electron-builder.yml` - 打包配置（已包含更新文件）

### 3. 更新包
- `release/v1.0.1/10031_v1.0.1_update.zip` - 测试更新包

## 🚀 使用方法

### 生成安装程序

**方式1：使用批处理文件**
```
双击运行: 一键生成安装程序.bat
```

**方式2：使用命令行**
```bash
npm run build
```

生成的文件：
```
release/1.0.0/
├── installer/文档转换器-Setup-1.0.0.exe    # NSIS安装程序
└── portable/文档转换器-Portable-1.0.0.exe  # 便携版
```

### 创建更新包

```bash
python create_update_package.py
```

按提示输入新版本号和更新日志。

### 测试更新功能

```bash
# 测试更新检查
python auto_updater.py

# 或双击运行
test_update_check.bat
```

## 📋 更新流程

### 应用启动时的更新流程

```
1. 应用启动
   ↓
2. 检查更新 (仅生产环境)
   ↓
3. 有新版本？
   ├─ 是 → 显示更新对话框
   │         ↓
   │      用户确认？
   │      ├─ 是 → 下载更新包
   │      │        ↓
   │      │     启动 updater.exe
   │      │        ↓
   │      │     应用退出
   │      │        ↓
   │      │     更新完成后重启
   │      │
   │      └─ 否 → 继续启动
   │
   └─ 否 → 继续启动
```

### 独立更新程序流程

```
updater.exe 启动
   ↓
等待主程序退出
   ↓
解压更新包
   ↓
覆盖文件（跳过updater.exe）
   ↓
重启主程序
   ↓
更新完成
```

## 🔧 技术细节

### Electron 主程序集成

`electron/main.js` 中的关键代码：

```javascript
// 应用启动时检查更新
app.whenReady().then(async () => {
  // 1. 检查更新（仅在生产环境）
  if (!isDev) {
    const shouldExit = await checkForUpdates();
    if (shouldExit) {
      app.quit();
      return;
    }
  }
  
  // 2. 启动后端服务
  startBackend();
  
  // 3. 创建主窗口
  createWindow();
});
```

### 打包配置

`electron-builder.yml` 确保更新文件被打包：

```yaml
extraResources:
  - version.txt
  - update_config.json
  - auto_updater.py
  - update_checker_gui.py
  - updater.exe
```

## 📦 上传到平台

### 1. 上传安装程序

访问：http://software.kunqiongai.com:8000/admin/

- 软件编号：10031
- 版本号：1.0.0
- 上传文件：`release/1.0.0/installer/文档转换器-Setup-1.0.0.exe`

### 2. 上传更新包

- 软件编号：10031
- 版本号：1.0.1
- 上传文件：`release/v1.0.1/10031_v1.0.1_update.zip`
- 更新日志：版本号变更为1.0.1

### 3. 计算SHA256

**PowerShell:**
```powershell
Get-FileHash "release\1.0.0\installer\文档转换器-Setup-1.0.0.exe" -Algorithm SHA256
```

**Python:**
```python
import hashlib

def calculate_sha256(file_path):
    sha256_hash = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha256_hash.update(chunk)
    return sha256_hash.hexdigest()

print(calculate_sha256("release/1.0.0/installer/文档转换器-Setup-1.0.0.exe"))
```

## ✅ 验证清单

运行验证脚本：
```bash
node test_electron_update.js
```

应该看到：
```
✓ 所有检查通过！更新功能已正确集成
```

## 🎯 下一步

1. **生成安装程序**
   ```bash
   npm run build
   ```

2. **测试安装**
   - 运行生成的安装程序
   - 验证应用正常启动

3. **测试更新**
   - 上传v1.0.0到平台
   - 上传v1.0.1更新包到平台
   - 运行v1.0.0应用
   - 验证更新提示
   - 确认更新流程

## 📝 注意事项

1. **开发环境** - 更新检查被禁用，避免干扰开发
2. **生产环境** - 启动时自动检查更新
3. **updater.exe** - 不会被更新包覆盖
4. **版本号** - 必须遵循 x.y.z 格式
5. **软件编号** - 固定为 10031

## 🐛 故障排除

### 问题：更新检查失败

**原因**：网络问题或服务器地址错误

**解决**：
1. 检查 `update_config.json` 中的 `server_url`
2. 确认网络连接
3. 验证服务器正常运行

### 问题：更新下载失败

**原因**：下载链接无效

**解决**：
1. 确认更新包已上传到平台
2. 检查下载链接是否可访问

### 问题：更新安装失败

**原因**：文件被占用

**解决**：
1. 确保主程序已完全退出
2. 关闭杀毒软件
3. 以管理员权限运行

---

**软件编号**: 10031  
**当前版本**: 1.0.0  
**更新服务器**: http://software.kunqiongai.com:8000
