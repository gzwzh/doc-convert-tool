"""
测试 DOCX 转 PDF 转换
"""
import os
import sys
from converters.docx_to_pdf import DocxToPdfConverter

def test_conversion(input_file):
    """测试转换功能"""
    if not os.path.exists(input_file):
        print(f"错误: 文件不存在 - {input_file}")
        return False
    
    # 创建输出路径
    output_file = input_file.replace('.docx', '_converted.pdf')
    
    print(f"输入文件: {input_file}")
    print(f"输出文件: {output_file}")
    print("-" * 60)
    
    try:
        converter = DocxToPdfConverter()
        result = converter.convert(input_file, output_file)
        
        print("✓ 转换成功!")
        print(f"转换方法: {result.get('method', 'unknown')}")
        print(f"输出大小: {result.get('size', 0)} bytes")
        
        if os.path.exists(output_file):
            print(f"✓ 输出文件已生成: {output_file}")
            return True
        else:
            print("✗ 输出文件未生成")
            return False
            
    except Exception as e:
        print(f"✗ 转换失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python test_docx_conversion.py <docx文件路径>")
        print("示例: python test_docx_conversion.py uploads/test.docx")
        sys.exit(1)
    
    input_file = sys.argv[1]
    success = test_conversion(input_file)
    sys.exit(0 if success else 1)
