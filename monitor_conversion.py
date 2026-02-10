#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
实时监控Excel转PDF转换过程
"""

import time
import requests
from pathlib import Path

print("=" * 60)
print("实时监控Excel转PDF转换")
print("=" * 60)

# 检查后端
print("\n检查后端服务...")
try:
    response = requests.get("http://localhost:8002/api/health", timeout=5)
    print(f"✅ 后端服务正常 (端口8002)")
except:
    print(f"❌ 后端服务不可用")
    exit(1)

# 检查转换器代码
print("\n检查转换器代码...")
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from converters.excel_to_pdf import ExcelToPdfConverter
import inspect

converter = ExcelToPdfConverter()
source = inspect.getsource(converter._convert_with_excel)

# 检查关键优化
checks = {
    "智能纸张选择": "col_count <= 6" in source,
    "列宽余量": "1.15" in source,
    "缩放策略": "setup.Zoom = 85" in source,
}

print("\n当前代码特性:")
for feature, exists in checks.items():
    status = "✅" if exists else "❌"
    print(f"  {status} {feature}")

if not all(checks.values()):
    print("\n⚠️ 警告: 代码可能未正确更新!")
else:
    print("\n✅ 代码已包含所有优化特性")

# 监控downloads目录
print("\n" + "=" * 60)
print("开始监控转换...")
print("=" * 60)
print("\n请在应用中上传Excel文件并转换为PDF")
print("我会实时显示生成的文件...\n")

downloads_dir = Path("backend/downloads")
known_files = set(downloads_dir.glob("*.pdf")) if downloads_dir.exists() else set()

try:
    while True:
        time.sleep(1)
        
        if not downloads_dir.exists():
            continue
            
        current_files = set(downloads_dir.glob("*.pdf"))
        new_files = current_files - known_files
        
        if new_files:
            for new_file in new_files:
                size = new_file.stat().st_size
                print(f"\n🎉 检测到新PDF文件:")
                print(f"   文件: {new_file.name}")
                print(f"   大小: {size / 1024:.2f} KB")
                print(f"   路径: {new_file}")
                print(f"\n   请打开此文件查看转换效果!")
                print(f"   如果文字清晰、内容完整，说明优化生效")
                print(f"   如果还是缩成一团，说明使用了旧代码\n")
            
            known_files = current_files
            
except KeyboardInterrupt:
    print("\n\n监控已停止")
