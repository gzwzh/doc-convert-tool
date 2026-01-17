#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
测试 PDF 到 PPT 转换器
"""

import os
from backend.converters.pdf_to_ppt import PdfToPptConverter


def test_pdf_to_ppt():
    """测试 PDF 到 PPT 转换"""
    converter = PdfToPptConverter()
    
    # 检查是否有测试 PDF 文件
    test_pdf = "test_input.docx"  # 使用现有的测试文件
    
    if not os.path.exists(test_pdf):
        print(f"测试文件不存在: {test_pdf}")
        print("请先创建一个测试 PDF 文件")
        return
    
    # 设置进度回调
    def progress_callback(file_path, progress):
        print(f"转换进度: {progress}%")
    
    converter.set_progress_callback(progress_callback)
    
    # 测试转换
    output_path = "test_output/test_pdf_to_ppt.pptx"
    os.makedirs("test_output", exist_ok=True)
    
    try:
        print(f"\n开始转换: {test_pdf} -> {output_path}")
        print("=" * 50)
        
        result = converter.convert(test_pdf, output_path, quality='high')
        
        print("=" * 50)
        print(f"\n转换结果:")
        print(f"  成功: {result.get('success')}")
        print(f"  输出文件: {result.get('output_path')}")
        print(f"  文件大小: {converter.format_file_size(result.get('size', 0))}")
        print(f"  页数: {result.get('page_count', 'N/A')}")
        print(f"  转换方法: {result.get('method', 'N/A')}")
        
        if result.get('warning'):
            print(f"  警告: {result.get('warning')}")
        
        if os.path.exists(output_path):
            print(f"\n✅ 转换成功! 输出文件已生成: {output_path}")
        else:
            print(f"\n❌ 转换失败: 输出文件未生成")
            
    except Exception as e:
        print(f"\n❌ 转换失败: {str(e)}")


if __name__ == "__main__":
    print("PDF 到 PPT 转换器测试")
    print("=" * 50)
    test_pdf_to_ppt()
