@echo off
chcp 65001 >nul
echo ========================================
echo 测试更新检查功能
echo ========================================
echo.

python auto_updater.py

echo.
echo 按任意键退出...
pause >nul
