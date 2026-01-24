#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
OCR识别使用示例

展示如何使用百度千帆OCR服务
"""

import sys
import os
from pathlib import Path
from conversion_core import OCRConversionService, OCRConfig


def ocr_to_word(pdf_path, api_key, output_dir):
    """OCR识别转Word"""
    print("\n【示例1】OCR识别转Word（支持公式和印章）")
    print("-" * 60)
    
    config = {
        'model': 'auto',          # 自动选择最佳模型
        'has_seal': True,         # 识别印章
        'has_formula': True,      # 识别公式
        'has_chart': False,       # 不识别图表
        'target_format': 'word',  # 输出Word格式
        'output_dir': output_dir
    }
    
    service = OCRConversionService(api_key=api_key, config=config)
    
    # 进度回调
    def progress_callback(current, total, message):
        percent = int(current / total * 100) if total > 0 else 0
        print(f"[{current}/{total}] {percent}% - {message}")
    
    result = service.convert(
        file_path=pdf_path,
        progress_callback=progress_callback
    )
    
    if result['success']:
        print(f"\n✓ OCR成功！")
        print(f"  输出文件: {result['output_file']}")
        if 'pages' in result:
            print(f"  处理页数: {len(result['pages'])}")
    else:
        print(f"\n✗ OCR失败: {result['error']}")
        if 'error_code' in result:
            print(f"  错误码: {result['error_code']}")
    
    return result['success']


def ocr_to_excel(pdf_path, api_key, output_dir):
    """OCR识别转Excel（专注表格）"""
    print("\n【示例2】OCR识别转Excel（专注表格数据）")
    print("-" * 60)
    
    config = {
        'model': 'auto',
        'has_seal': False,        # 不需要识别印章
        'has_formula': False,     # 不需要识别公式
        'has_chart': False,
        'target_format': 'excel',  # 输出Excel格式
        'output_dir': output_dir
    }
    
    service = OCRConversionService(api_key=api_key, config=config)
    
    result = service.convert(
        file_path=pdf_path,
        progress_callback=lambda c, t, m: print(f"[{c}/{t}] {m}")
    )
    
    if result['success']:
        print(f"\n✓ OCR成功！")
        print(f"  输出文件: {result['output_file']}")
    else:
        print(f"\n✗ OCR失败: {result['error']}")
    
    return result['success']


def ocr_with_specific_model(pdf_path, api_key, output_dir):
    """使用指定OCR模型"""
    print("\n【示例3】使用指定OCR模型")
    print("-" * 60)
    
    models = [
        ('deepseek-ocr', '通用文档识别，速度快'),
        ('paddleocr-vl', '多模态OCR，支持版面分析'),
        ('pp-structurev3', '文档结构理解，支持印章/表格/公式')
    ]
    
    for model, description in models:
        print(f"\n使用模型: {model} - {description}")
        
        config = {
            'model': model,
            'has_seal': True,
            'has_formula': True,
            'has_chart': False,
            'target_format': 'word',
            'output_dir': output_dir
        }
        
        service = OCRConversionService(api_key=api_key, config=config)
        
        # result = service.convert(pdf_path)
        # if result['success']:
        #     print(f"  ✓ 成功: {result['output_file']}")
        # else:
        #     print(f"  ✗ 失败: {result['error']}")
    
    print("\n提示: 取消注释上面的代码以实际运行")


def batch_ocr(input_dir, api_key, output_dir):
    """批量OCR识别"""
    print("\n【示例4】批量OCR识别")
    print("-" * 60)
    
    input_path = Path(input_dir)
    pdf_files = list(input_path.glob('*.pdf'))
    
    if not pdf_files:
        print(f"在 {input_dir} 中没有找到PDF文件")
        return False
    
    print(f"找到 {len(pdf_files)} 个PDF文件")
    
    config = {
        'model': 'auto',
        'has_seal': True,
        'has_formula': True,
        'has_chart': False,
        'target_format': 'word',
        'output_dir': output_dir
    }
    
    service = OCRConversionService(api_key=api_key, config=config)
    
    success_count = 0
    for i, pdf_file in enumerate(pdf_files, 1):
        print(f"\n[{i}/{len(pdf_files)}] 识别: {pdf_file.name}")
        
        result = service.convert(str(pdf_file))
        
        if result['success']:
            print(f"  ✓ 成功: {result['output_file']}")
            success_count += 1
        else:
            print(f"  ✗ 失败: {result['error']}")
    
    print(f"\n批量OCR完成: {success_count}/{len(pdf_files)} 成功")
    return True


def main():
    """主函数"""
    print("=" * 60)
    print("OCR识别使用示例")
    print("=" * 60)
    
    # 获取API密钥
    api_key = os.environ.get('BAIDU_QIANFAN_API_KEY')
    
    if not api_key:
        print("\n错误: 未设置API密钥！")
        print("\n请先设置环境变量:")
        print("  export BAIDU_QIANFAN_API_KEY='your_api_key'  # Linux/macOS")
        print("  set BAIDU_QIANFAN_API_KEY=your_api_key      # Windows CMD")
        print("  $env:BAIDU_QIANFAN_API_KEY='your_api_key'   # Windows PowerShell")
        print("\n或者在代码中直接设置:")
        print("  api_key = 'your_api_key'")
        return
    
    # 检查命令行参数
    if len(sys.argv) < 2:
        print("\n用法:")
        print("  python ocr_example.py <pdf文件路径>")
        print("  python ocr_example.py <pdf文件目录>  # 批量识别")
        print("\n示例:")
        print("  python ocr_example.py scan.pdf")
        print("  python ocr_example.py ./scans/")
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
        # 单个文件OCR
        if input_path.suffix.lower() != '.pdf':
            print(f"\n错误: 不是PDF文件: {input_path}")
            return
        
        pdf_path = str(input_path)
        
        # 演示各种OCR方式
        ocr_to_word(pdf_path, api_key, str(output_dir))
        ocr_to_excel(pdf_path, api_key, str(output_dir))
        ocr_with_specific_model(pdf_path, api_key, str(output_dir))
        
    elif input_path.is_dir():
        # 批量OCR
        batch_ocr(str(input_path), api_key, str(output_dir))
    
    print("\n" + "=" * 60)
    print("示例运行完成！")
    print(f"输出目录: {output_dir.absolute()}")
    print("=" * 60)


if __name__ == '__main__':
    main()
