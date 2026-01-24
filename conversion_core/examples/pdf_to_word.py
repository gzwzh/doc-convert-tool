#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PDF转Word完整示例

展示PDF转Word的各种高级用法
"""

import sys
from pathlib import Path
from conversion_core import WordConverter


def simple_convert(pdf_path, output_dir):
    """基础转换"""
    print("\n【方式1】基础转换")
    print("-" * 60)
    
    converter = WordConverter(
        output_path=output_dir,
        config={'output_format': 'docx'}
    )
    
    result = converter.convert(pdf_path)
    
    if result['success']:
        print(f"✓ 转换成功: {result['output_file']}")
    else:
        print(f"✗ 转换失败: {result['error']}")
    
    return result['success']


def convert_with_images(pdf_path, output_dir):
    """提取图片和表格"""
    print("\n【方式2】提取图片和表格")
    print("-" * 60)
    
    converter = WordConverter(
        output_path=output_dir,
        config={
            'output_format': 'docx',
            'extract_images': True,  # 提取图片
            'extract_tables': True   # 提取表格
        }
    )
    
    result = converter.convert(pdf_path)
    
    if result['success']:
        print(f"✓ 转换成功: {result['output_file']}")
    else:
        print(f"✗ 转换失败: {result['error']}")
    
    return result['success']


def convert_with_progress(pdf_path, output_dir):
    """带进度显示"""
    print("\n【方式3】带进度显示")
    print("-" * 60)
    
    def progress_callback(file_path, progress):
        """进度回调"""
        filename = Path(file_path).name
        bar_length = 40
        filled = int(bar_length * progress / 100)
        bar = '█' * filled + '░' * (bar_length - filled)
        print(f'\r{filename}: [{bar}] {progress}%', end='', flush=True)
    
    converter = WordConverter(
        output_path=output_dir,
        config={
            'output_format': 'docx',
            'extract_images': True,
            'extract_tables': True
        },
        progress_callback=progress_callback
    )
    
    result = converter.convert(pdf_path)
    print()  # 换行
    
    if result['success']:
        print(f"✓ 转换成功: {result['output_file']}")
    else:
        print(f"✗ 转换失败: {result['error']}")
    
    return result['success']


def convert_page_range(pdf_path, output_dir):
    """转换指定页面范围"""
    print("\n【方式4】转换指定页面")
    print("-" * 60)
    
    converter = WordConverter(
        output_path=output_dir,
        config={
            'output_format': 'docx',
            'page_range': '1-5,10,15-20',  # 转换第1-5页、第10页、第15-20页
            'extract_images': True,
            'extract_tables': True
        }
    )
    
    result = converter.convert(pdf_path)
    
    if result['success']:
        print(f"✓ 转换成功: {result['output_file']}")
        print(f"  转换页面: {converter.config['page_range']}")
    else:
        print(f"✗ 转换失败: {result['error']}")
    
    return result['success']


def convert_to_doc(pdf_path, output_dir):
    """转换为DOC格式（兼容旧版Word）"""
    print("\n【方式5】转换为DOC格式")
    print("-" * 60)
    
    converter = WordConverter(
        output_path=output_dir,
        config={
            'output_format': 'doc',  # 注意：这里是 'doc'
            'extract_images': True,
            'extract_tables': True
        }
    )
    
    result = converter.convert(pdf_path)
    
    if result['success']:
        print(f"✓ 转换成功: {result['output_file']}")
    else:
        print(f"✗ 转换失败: {result['error']}")
    
    return result['success']


def batch_convert(input_dir, output_dir):
    """批量转换"""
    print("\n【方式6】批量转换目录下所有PDF")
    print("-" * 60)
    
    input_path = Path(input_dir)
    pdf_files = list(input_path.glob('*.pdf'))
    
    if not pdf_files:
        print(f"在 {input_dir} 中没有找到PDF文件")
        return False
    
    print(f"找到 {len(pdf_files)} 个PDF文件")
    
    converter = WordConverter(
        output_path=output_dir,
        config={
            'output_format': 'docx',
            'extract_images': True,
            'extract_tables': True
        }
    )
    
    success_count = 0
    for i, pdf_file in enumerate(pdf_files, 1):
        print(f"\n[{i}/{len(pdf_files)}] 转换: {pdf_file.name}")
        result = converter.convert(str(pdf_file))
        
        if result['success']:
            print(f"  ✓ 成功: {result['output_file']}")
            success_count += 1
        else:
            print(f"  ✗ 失败: {result['error']}")
    
    print(f"\n批量转换完成: {success_count}/{len(pdf_files)} 成功")
    return True


def main():
    """主函数"""
    print("=" * 60)
    print("PDF转Word完整示例")
    print("=" * 60)
    
    # 检查命令行参数
    if len(sys.argv) < 2:
        print("\n用法:")
        print("  python pdf_to_word.py <pdf文件路径>")
        print("  python pdf_to_word.py <pdf文件目录>  # 批量转换")
        print("\n示例:")
        print("  python pdf_to_word.py example.pdf")
        print("  python pdf_to_word.py ./pdf_files/")
        return
    
    input_path = Path(sys.argv[1])
    output_dir = Path('./output')
    output_dir.mkdir(exist_ok=True)
    
    # 检查输入路径
    if not input_path.exists():
        print(f"\n错误: 找不到文件或目录: {input_path}")
        return
    
    # 判断是文件还是目录
    if input_path.is_file():
        # 单个文件转换
        if input_path.suffix.lower() != '.pdf':
            print(f"\n错误: 不是PDF文件: {input_path}")
            return
        
        pdf_path = str(input_path)
        
        # 演示各种转换方式
        simple_convert(pdf_path, str(output_dir))
        convert_with_images(pdf_path, str(output_dir))
        convert_with_progress(pdf_path, str(output_dir))
        convert_page_range(pdf_path, str(output_dir))
        convert_to_doc(pdf_path, str(output_dir))
        
    elif input_path.is_dir():
        # 批量转换目录
        batch_convert(str(input_path), str(output_dir))
    
    print("\n" + "=" * 60)
    print("示例运行完成！")
    print(f"输出目录: {output_dir.absolute()}")
    print("=" * 60)


if __name__ == '__main__':
    main()
