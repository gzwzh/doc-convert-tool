@echo off
echo ============================================================
echo PPT转换修复 - 快速测试
echo ============================================================
echo.
echo 选择测试方式:
echo.
echo 1. 启动Electron应用测试 (推荐)
echo 2. 运行直接测试脚本
echo 3. 验证代码修改
echo 4. 清理并重启
echo.
set /p choice="请输入选项 (1-4): "

if "%choice%"=="1" (
    echo.
    echo 正在启动Electron应用...
    npm run dev
) else if "%choice%"=="2" (
    echo.
    echo 正在运行测试脚本...
    python test_ppt_conversion_direct.py
    pause
) else if "%choice%"=="3" (
    echo.
    echo 正在验证代码...
    python verify_wps_fix.py
    pause
) else if "%choice%"=="4" (
    echo.
    echo 正在清理进程和缓存...
    taskkill /F /IM python.exe 2>nul
    taskkill /F /IM POWERPNT.EXE 2>nul
    taskkill /F /IM wps.exe 2>nul
    if exist backend\__pycache__ rmdir /s /q backend\__pycache__
    if exist backend\converters\__pycache__ rmdir /s /q backend\converters\__pycache__
    echo 清理完成！
    echo.
    echo 正在启动服务...
    npm run dev
) else (
    echo 无效选项
    pause
)
