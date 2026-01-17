#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
批量转换示例

展示如何批量处理多个文件
"""

import sys
from pathlib import Path
from datetime import datetime
from conversion_core import (
    PDFConverter,
    WordConverter,
    ExcelConverter,
    ImageConverter
)


def batch_to_pdf(input_dir, output_dir):
    """批量转换为PDF"""
    print("\n【批量转PDF】")
    print("-" * 60)
    
    input_path = Path(input_dir)
    
    # 支持的扩展名
    supported_exts = ['.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', 
                      '.jpg', '.jpeg', '.png', '.bmp', '.txt', '.html', '.md']
    
    # 查找所有支持的文件
    files = []
    for ext in supported_exts:
        files.extend(input_path.glob(f'*{ext}'))
    
    if not files:
        print(f"在 {input_dir} 中没有找到支持的文件")
        return False
    
    print(f"找到 {len(files)} 个文件")
    print(f"支持的格式: {', '.join(supported_exts)}")
    
    # 创建转换器
    converter = PDFConverter(output_path=output_dir, config={})
    
    # 批量转换
    success_count = 0
    failed_files = []
    
    for i, file in enumerate(files, 1):
        print(f"\n[{i}/{len(files)}] {file.name}")
        
        try:
            result = converter.convert(str(file))
            
            if result['success']:
                print(f"  ✓ 成功: {Path(result['output_file']).name}")
                success_count += 1
            else:
                print(f"  ✗ 失败: {result['error']}")
                failed_files.append((file.name, result['error']))
                
        except Exception as e:
            print(f"  ✗ 异常: {e}")
            failed_files.append((file.name, str(e)))
    
    # 输出统计
    print("\n" + "=" * 60)
    print(f"批量转换完成: {success_count}/{len(files)} 成功")
    
    if failed_files:
        print("\n失败的文件:")
        for filename, error in failed_files:
            print(f"  - {filename}: {error}")
    
    return True


def batch_pdf_to_format(input_dir, output_dir, target_format='word'):
    """批量将PDF转换为指定格式"""
    print(f"\n【批量PDF转{target_format.upper()}】")
    print("-" * 60)
    
    input_path = Path(input_dir)
    pdf_files = list(input_path.glob('*.pdf'))
    
    if not pdf_files:
        print(f"在 {input_dir} 中没有找到PDF文件")
        return False
    
    print(f"找到 {len(pdf_files)} 个PDF文件")
    
    # 根据目标格式选择转换器
    if target_format.lower() == 'word':
        converter = WordConverter(
            output_path=output_dir,
            config={'output_format': 'docx', 'extract_images': True}
        )
    elif target_format.lower() == 'excel':
        converter = ExcelConverter(
            output_path=output_dir,
            config={'output_format': 'xlsx'}
        )
    elif target_format.lower() == 'image':
        converter = ImageConverter(
            output_path=output_dir,
            config={'output_format': 'png', 'quality': 'high'}
        )
    else:
        print(f"不支持的格式: {target_format}")
        return False
    
    # 批量转换
    success_count = 0
    start_time = datetime.now()
    
    for i, pdf_file in enumerate(pdf_files, 1):
        print(f"\n[{i}/{len(pdf_files)}] {pdf_file.name}")
        
        result = converter.convert(str(pdf_file))
        
        if result['success']:
            output_file = Path(result['output_file']).name
            print(f"  ✓ 成功: {output_file}")
            success_count += 1
        else:
            print(f"  ✗ 失败: {result['error']}")
    
    # 计算耗时
    elapsed = datetime.now() - start_time
    
    print("\n" + "=" * 60)
    print(f"批量转换完成: {success_count}/{len(pdf_files)} 成功")
    print(f"总耗时: {elapsed}")
    print(f"平均耗时: {elapsed / len(pdf_files) if pdf_files else 0}")
    
    return True


def batch_with_subdirs(input_dir, output_dir):
    """批量转换（包含子目录）"""
    print("\n【批量转换（含子目录）】")
    print("-" * 60)
    
    input_path = Path(input_dir)
    
    # 递归查找所有PDF文件
    pdf_files = list(input_path.rglob('*.pdf'))
    
    if not pdf_files:
        print(f"在 {input_dir} 及其子目录中没有找到PDF文件")
        return False
    
    print(f"找到 {len(pdf_files)} 个PDF文件")
    
    converter = WordConverter(
        output_path=output_dir,
        config={'output_format': 'docx'}
    )
    
    success_count = 0
    
    for i, pdf_file in enumerate(pdf_files, 1):
        # 保持目录结构
        relative_path = pdf_file.relative_to(input_path)
        print(f"\n[{i}/{len(pdf_files)}] {relative_path}")
        
        result = converter.convert(str(pdf_file))
        
        if result['success']:
            print(f"  ✓ 成功")
            success_count += 1
        else:
            print(f"  ✗ 失败: {result['error']}")
    
    print(f"\n批量转换完成: {success_count}/{len(pdf_files)} 成功")
    return True


def batch_with_filter(input_dir, output_dir, min_size_kb=0, max_size_kb=float('inf')):
    """按文件大小过滤批量转换"""
    print(f"\n【按文件大小过滤批量转换】({min_size_kb}KB - {max_size_kb}KB)")
    print("-" * 60)
    
    input_path = Path(input_dir)
    all_pdf_files = list(input_path.glob('*.pdf'))
    
    # 按大小过滤
    pdf_files = []
    for pdf_file in all_pdf_files:
        size_kb = pdf_file.stat().st_size / 1024
        if min_size_kb <= size_kb <= max_size_kb:
            pdf_files.append((pdf_file, size_kb))
    
    if not pdf_files:
        print(f"没有找到符合大小条件的PDF文件")
        return False
    
    print(f"找到 {len(pdf_files)} 个符合条件的PDF文件（共{len(all_pdf_files)}个）")
    
    converter = WordConverter(
        output_path=output_dir,
        config={'output_format': 'docx'}
    )
    
    success_count = 0
    
    for i, (pdf_file, size_kb) in enumerate(pdf_files, 1):
        print(f"\n[{i}/{len(pdf_files)}] {pdf_file.name} ({size_kb:.1f} KB)")
        
        result = converter.convert(str(pdf_file))
        
        if result['success']:
            print(f"  ✓ 成功")
            success_count += 1
        else:
            print(f"  ✗ 失败: {result['error']}")
    
    print(f"\n批量转换完成: {success_count}/{len(pdf_files)} 成功")
    return True


def main():
    """主函数"""
    print("=" * 60)
    print("批量转换示例")
    print("=" * 60)
    
    # 检查命令行参数
    if len(sys.argv) < 2:
        print("\n用法:")
        print("  python batch_convert.py <输入目录> [输出目录] [目标格式]")
        print("\n参数:")
        print("  输入目录   - 包含待转换文件的目录")
        print("  输出目录   - 转换结果输出目录（可选，默认: ./output）")
        print("  目标格式   - pdf/word/excel/image（可选，默认: pdf）")
        print("\n示例:")
        print("  python batch_convert.py ./documents/")
        print("  python batch_convert.py ./pdfs/ ./output/ word")
        print("  python batch_convert.py ./files/ ./results/ excel")
        return
    
    # 解析参数
    input_dir = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else './output'
    target_format = sys.argv[3] if len(sys.argv) > 3 else 'pdf'
    
    # 创建输出目录
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # 检查输入目录
    if not Path(input_dir).exists():
        print(f"\n错误: 找不到目录: {input_dir}")
        return
    
    # 根据目标格式执行批量转换
    if target_format.lower() == 'pdf':
        batch_to_pdf(input_dir, str(output_path))
    else:
        batch_pdf_to_format(input_dir, str(output_path), target_format)
    
    # 额外演示
    # batch_with_subdirs(input_dir, str(output_path))
    # batch_with_filter(input_dir, str(output_path), min_size_kb=100, max_size_kb=5000)
    
    print("\n" + "=" * 60)
    print("批量转换示例完成！")
    print(f"输出目录: {output_path.absolute()}")
    print("=" * 60)


if __name__ == '__main__':
    main()
