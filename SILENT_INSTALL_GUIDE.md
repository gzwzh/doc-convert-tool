# 🔇 文档转换器 - 静默安装指南

## 📋 静默安装功能

新版本的NSIS安装程序现在完全支持静默安装，并且会自动创建桌面快捷方式和开始菜单项。

## 🚀 静默安装命令

### 基本静默安装
```cmd
文档转换器-Setup-1.0.0.exe /S
```

### 或者使用完整参数
```cmd
文档转换器-Setup-1.0.0.exe /SILENT
```

## ⚙️ 高级静默安装选项

### 指定安装目录
```cmd
文档转换器-Setup-1.0.0.exe /S /D=C:\MyPrograms\文档转换器
```

### 批处理脚本示例
```batch
@echo off
echo 开始静默安装文档转换器...
文档转换器-Setup-1.0.0.exe /S
if %errorlevel% == 0 (
    echo 安装成功完成！
) else (
    echo 安装失败，错误代码: %errorlevel%
)
pause
```

## ✨ 静默安装自动功能

### 🖥️ 自动创建的快捷方式
- **桌面快捷方式**: `文档转换器.lnk`
- **开始菜单**: `开始菜单\程序\文档转换器\`
  - 程序快捷方式
  - 卸载快捷方式

### 📁 默认安装位置
- **系统级安装**: `C:\Program Files\文档转换器\`
- **用户级安装**: `C:\Users\[用户名]\AppData\Local\Programs\文档转换器\`

## 🔧 企业部署示例

### PowerShell脚本
```powershell
# 企业静默部署脚本
$installerPath = "\\server\share\文档转换器-Setup-1.0.0.exe"
$installDir = "C:\Program Files\文档转换器"

Write-Host "开始部署文档转换器..."
Start-Process -FilePath $installerPath -ArgumentList "/S", "/D=$installDir" -Wait -NoNewWindow

if (Test-Path "$installDir\文档转换器.exe") {
    Write-Host "部署成功！" -ForegroundColor Green
} else {
    Write-Host "部署失败！" -ForegroundColor Red
}
```

### 组策略部署
```cmd
# 通过组策略进行静默部署
msiexec /i "文档转换器-Setup-1.0.0.exe" /quiet /norestart
```

## 📊 静默安装参数对比

| 参数 | 功能 | 示例 |
|------|------|------|
| `/S` | 静默安装 | `Setup.exe /S` |
| `/SILENT` | 静默安装（别名） | `Setup.exe /SILENT` |
| `/D=路径` | 指定安装目录 | `Setup.exe /S /D=C:\MyApp` |
| `/NCRC` | 跳过CRC检查 | `Setup.exe /S /NCRC` |

## 🔍 验证安装结果

### 检查安装是否成功
```cmd
# 检查程序是否安装
if exist "C:\Program Files\文档转换器\文档转换器.exe" (
    echo 程序安装成功
) else (
    echo 程序安装失败
)

# 检查桌面快捷方式
if exist "%USERPROFILE%\Desktop\文档转换器.lnk" (
    echo 桌面快捷方式创建成功
) else (
    echo 桌面快捷方式创建失败
)
```

### PowerShell验证脚本
```powershell
# 验证安装结果
$programPath = "C:\Program Files\文档转换器\文档转换器.exe"
$desktopShortcut = "$env:USERPROFILE\Desktop\文档转换器.lnk"

Write-Host "验证安装结果..." -ForegroundColor Yellow

if (Test-Path $programPath) {
    Write-Host "✅ 程序文件存在: $programPath" -ForegroundColor Green
} else {
    Write-Host "❌ 程序文件不存在: $programPath" -ForegroundColor Red
}

if (Test-Path $desktopShortcut) {
    Write-Host "✅ 桌面快捷方式存在: $desktopShortcut" -ForegroundColor Green
} else {
    Write-Host "❌ 桌面快捷方式不存在: $desktopShortcut" -ForegroundColor Red
}
```

## 🗑️ 静默卸载

### 卸载命令
```cmd
# 通过卸载程序静默卸载
"C:\Program Files\文档转换器\Uninstall 文档转换器.exe" /S
```

### 或通过控制面板
```cmd
# 通过程序和功能卸载
wmic product where name="文档转换器" call uninstall /nointeractive
```

## 🎯 使用场景

### 适用于：
- **🏢 企业批量部署** - IT管理员批量安装
- **🤖 自动化脚本** - CI/CD流程中的自动安装
- **📦 软件包管理** - 包管理器集成
- **🔄 静默更新** - 后台自动更新程序

### 优势：
- **⚡ 无用户交互** - 完全自动化安装
- **🖥️ 自动快捷方式** - 无需手动创建桌面图标
- **📂 系统集成** - 完整的Windows系统集成
- **🔧 可定制路径** - 支持自定义安装目录

## 🎊 总结

现在的NSIS安装程序支持完整的静默安装功能，包括：
- ✅ 静默安装 (`/S` 或 `/SILENT`)
- ✅ 自动创建桌面快捷方式
- ✅ 自动创建开始菜单项
- ✅ 完整的系统注册
- ✅ 支持静默卸载

非常适合企业环境和自动化部署！