#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
快速入门示例 - 文档转换核心逻辑库

演示最基本的使用方法
"""

from pathlib import Path
from conversion_core import PDFConverter, WordConverter, ImageConverter


def main():
    """主函数"""
    print("=" * 60)
    print("文档转换核心逻辑库 - 快速入门")
    print("=" * 60)
    
    # 创建输出目录
    output_dir = Path('./output')
    output_dir.mkdir(exist_ok=True)
    
    # 示例1: Word转PDF
    print("\n【示例1】Word转PDF")
    print("-" * 60)
    
    pdf_converter = PDFConverter(
        output_path=str(output_dir),
        config={}
    )
    
    # 假设有一个test.docx文件
    # result = pdf_converter.convert('test.docx')
    # if result['success']:
    #     print(f"✓ 转换成功: {result['output_file']}")
    # else:
    #     print(f"✗ 转换失败: {result['error']}")
    
    print("提示: 请准备一个Word文件并取消注释上面的代码")
    
    # 示例2: PDF转Word
    print("\n【示例2】PDF转Word")
    print("-" * 60)
    
    word_converter = WordConverter(
        output_path=str(output_dir),
        config={
            'output_format': 'docx',
            'extract_images': True,
            'extract_tables': True
        },
        progress_callback=lambda file, progress: print(f"进度: {progress}%")
    )
    
    # result = word_converter.convert('test.pdf')
    # if result['success']:
    #     print(f"✓ 转换成功: {result['output_file']}")
    # else:
    #     print(f"✗ 转换失败: {result['error']}")
    
    print("提示: 请准备一个PDF文件并取消注释上面的代码")
    
    # 示例3: PDF转图片
    print("\n【示例3】PDF转图片")
    print("-" * 60)
    
    image_converter = ImageConverter(
        output_path=str(output_dir),
        config={
            'output_format': 'png',
            'quality': 'high',
            'dpi': 200
        }
    )
    
    # result = image_converter.convert('test.pdf')
    # if result['success']:
    #     print(f"✓ 转换成功: {result['output_file']}")
    # else:
    #     print(f"✗ 转换失败: {result['error']}")
    
    print("提示: 请准备一个PDF文件并取消注释上面的代码")
    
    print("\n" + "=" * 60)
    print("快速入门完成！")
    print("更多示例请查看 examples/ 目录下的其他文件")
    print("=" * 60)


if __name__ == '__main__':
    main()
