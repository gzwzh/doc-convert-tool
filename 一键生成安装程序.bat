@echo off
chcp 65001 >nul
title 一键生成安装程序

echo.
echo ========================================
echo 文档转换工具 - 一键生成安装程序
echo ========================================
echo.
echo 软件编号: 10031
echo 当前版本: 1.0.0
echo.
echo 本脚本将自动完成:
echo   1. 构建前端 (React + Vite)
echo   2. 构建后端 (Python + PyInstaller)
echo   3. 打包 Electron 应用
echo   4. 生成 NSIS 安装程序 (.exe)
echo   5. 生成便携版程序 (.exe)
echo.
echo 注意: 此过程可能需要 10-20 分钟
echo ========================================
echo.

npm run build

echo.
echo ========================================
echo 构建完成！
echo.
echo 生成的文件位于: release\1.0.0\
echo   - installer\文档转换器-Setup-1.0.0.exe
echo   - portable\文档转换器-Portable-1.0.0.exe
echo.
echo ========================================
echo 按任意键退出...
pause >nul
