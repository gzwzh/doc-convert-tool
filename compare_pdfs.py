#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
对比PDF文件
"""

import PyPDF2
from pathlib import Path

print("=" * 60)
print("对比PDF文件")
print("=" * 60)

downloads_dir = Path("backend/downloads")

# 测试生成的PDF（应该是好的）
test_pdfs = [
    "api_test_20cols_result.pdf",
    "diagnose_test.pdf",
    "test_20cols_20cols.pdf"
]

# 你转换的PDF（可能有问题）
your_pdfs = [
    "服务器账号部署发布情况_34894447.pdf",
    "服务器账号部署发布情况_7aa74b09.pdf"
]

print("\n测试PDF（使用新代码生成）:")
for pdf_name in test_pdfs:
    pdf_path = downloads_dir / pdf_name
    if pdf_path.exists():
        try:
            with open(pdf_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                page = reader.pages[0]
                
                # 获取页面尺寸
                width = float(page.mediabox.width)
                height = float(page.mediabox.height)
                
                # 转换为毫米（1 point = 0.352778 mm）
                width_mm = width * 0.352778
                height_mm = height * 0.352778
                
                print(f"\n  {pdf_name}")
                print(f"    页数: {len(reader.pages)}")
                print(f"    页面尺寸: {width_mm:.1f}mm x {height_mm:.1f}mm")
                
                # 判断纸张类型
                if abs(width_mm - 297) < 10 and abs(height_mm - 210) < 10:
                    print(f"    纸张: A4横向")
                elif abs(width_mm - 210) < 10 and abs(height_mm - 297) < 10:
                    print(f"    纸张: A4纵向")
                elif abs(width_mm - 420) < 10 and abs(height_mm - 297) < 10:
                    print(f"    纸张: A3横向")
                elif abs(width_mm - 297) < 10 and abs(height_mm - 420) < 10:
                    print(f"    纸张: A3纵向")
                else:
                    print(f"    纸张: 自定义")
                
        except Exception as e:
            print(f"\n  {pdf_name}: 读取失败 - {e}")

print("\n\n你转换的PDF:")
for pdf_name in your_pdfs:
    pdf_path = downloads_dir / pdf_name
    if pdf_path.exists():
        try:
            with open(pdf_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                page = reader.pages[0]
                
                width = float(page.mediabox.width)
                height = float(page.mediabox.height)
                width_mm = width * 0.352778
                height_mm = height * 0.352778
                
                print(f"\n  {pdf_name}")
                print(f"    页数: {len(reader.pages)}")
                print(f"    页面尺寸: {width_mm:.1f}mm x {height_mm:.1f}mm")
                
                if abs(width_mm - 297) < 10 and abs(height_mm - 210) < 10:
                    print(f"    纸张: A4横向")
                elif abs(width_mm - 210) < 10 and abs(height_mm - 297) < 10:
                    print(f"    纸张: A4纵向")
                elif abs(width_mm - 420) < 10 and abs(height_mm - 297) < 10:
                    print(f"    纸张: A3横向")
                elif abs(width_mm - 297) < 10 and abs(height_mm - 420) < 10:
                    print(f"    纸张: A3纵向")
                else:
                    print(f"    纸张: 自定义")
                
        except Exception as e:
            print(f"\n  {pdf_name}: 读取失败 - {e}")

print("\n" + "=" * 60)
print("对比结论")
print("=" * 60)
print("\n如果测试PDF使用A3横向，而你的PDF使用其他纸张，")
print("说明代码没有生效，需要重新启动应用。")
print("\n如果纸张相同，但效果不同，可能是Excel文件本身的问题。")
