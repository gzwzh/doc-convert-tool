#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
验证PPT转换代码是否已更新
"""

import sys
import os
import inspect

# 添加backend到路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

print("=" * 60)
print("验证PPT转换代码")
print("=" * 60)

# 检查所有PPT转换器
converters = [
    ('ppt_to_image_wps', 'PptToImageWpsConverter'),
    ('ppt_to_video_wps', 'PptToVideoWpsConverter'),
    ('ppt_to_video_smart', 'PptToVideoSmartConverter'),
    ('ppt_to_video', 'PptToVideoConverter'),
]

all_ok = True

for module_name, class_name in converters:
    print(f"\n检查 {module_name}.{class_name}...")
    
    try:
        # 动态导入
        module = __import__(f'converters.{module_name}', fromlist=[class_name])
        converter_class = getattr(module, class_name)
        
        # 获取convert方法的源代码
        if hasattr(converter_class, 'convert'):
            source = inspect.getsource(converter_class.convert)
        else:
            # 某些转换器可能在其他方法中
            source = inspect.getsource(converter_class)
        
        # 检查关键代码
        checks = {
            "Visible = 1 或 True": ("Visible = 1" in source or "Visible = True" in source),
            "没有 Visible = 0": "Visible = 0" not in source,
            "没有 Visible = False": "Visible = False" not in source or "DisplayAlerts = False" in source,  # DisplayAlerts可以是False
        }
        
        module_ok = True
        for check_name, result in checks.items():
            status = "✅" if result else "❌"
            print(f"  {status} {check_name}")
            if not result:
                module_ok = False
                all_ok = False
        
        if module_ok:
            print(f"  ✅ {class_name} 代码正确")
        else:
            print(f"  ❌ {class_name} 代码可能未更新")
            
            # 显示相关代码片段
            print(f"\n  相关代码片段:")
            for line in source.split('\n'):
                if 'Visible' in line and not line.strip().startswith('#'):
                    print(f"    {line}")
        
    except Exception as e:
        print(f"  ❌ 检查失败: {e}")
        all_ok = False

print(f"\n{'='*60}")
if all_ok:
    print("✅ 所有转换器代码已正确更新")
    print("\n如果还是出现RPC错误，可能是:")
    print("1. 后端进程未重启")
    print("2. Python缓存未清除")
    print("3. 使用了旧的Python进程")
else:
    print("❌ 部分转换器代码未更新")
    print("\n请检查上述文件并确保:")
    print("1. Visible = 1 或 Visible = True")
    print("2. 没有 Visible = 0")
    print("3. 没有 Visible = False (除了DisplayAlerts)")

print(f"\n{'='*60}")
print("后端进程检查")
print(f"{'='*60}")

import subprocess
result = subprocess.run(
    ['powershell', '-Command', 
     'Get-Process python -ErrorAction SilentlyContinue | Select-Object Id, StartTime | Format-Table -AutoSize'],
    capture_output=True,
    text=True
)

print(result.stdout)

print("\n如果有多个Python进程，请停止所有进程:")
print("  taskkill /F /IM python.exe")
print("\n然后重新启动:")
print("  npm run dev")
