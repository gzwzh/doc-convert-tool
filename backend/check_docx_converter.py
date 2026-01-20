"""
检查 DOCX 转 PDF 转换器的可用方法
"""
import os
import shutil

def check_microsoft_word():
    """检查 Microsoft Word 是否可用"""
    try:
        import win32com.client
        word = win32com.client.Dispatch("Word.Application")
        word.Quit()
        return True, "Microsoft Word 已安装并可用"
    except ImportError:
        return False, "缺少 pywin32 库 (pip install pywin32)"
    except Exception as e:
        return False, f"Microsoft Word 不可用: {str(e)}"

def check_libreoffice():
    """检查 LibreOffice 是否可用"""
    paths = [
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
    ]
    
    for path in paths:
        if os.path.exists(path):
            return True, f"LibreOffice 已安装: {path}"
    
    soffice = shutil.which("soffice")
    if soffice:
        return True, f"LibreOffice 已安装: {soffice}"
    
    return False, "LibreOffice 未安装"

def check_dependencies():
    """检查依赖库"""
    results = []
    
    try:
        import docx
        results.append(("✓", "python-docx", "已安装"))
    except ImportError:
        results.append(("✗", "python-docx", "未安装 (pip install python-docx)"))
    
    try:
        import weasyprint
        results.append(("✓", "weasyprint", "已安装"))
    except ImportError:
        results.append(("✗", "weasyprint", "未安装 (pip install weasyprint)"))
    
    try:
        import docx2pdf
        results.append(("✓", "docx2pdf", "已安装"))
    except ImportError:
        results.append(("✗", "docx2pdf", "未安装 (pip install docx2pdf)"))
    
    return results

if __name__ == "__main__":
    print("=" * 60)
    print("DOCX 转 PDF 转换器环境检查")
    print("=" * 60)
    
    print("\n【转换方法检查】")
    
    # 检查 Microsoft Word
    word_available, word_msg = check_microsoft_word()
    print(f"\n1. Microsoft Word (最佳质量)")
    print(f"   状态: {'✓ 可用' if word_available else '✗ 不可用'}")
    print(f"   说明: {word_msg}")
    
    # 检查 LibreOffice
    libre_available, libre_msg = check_libreoffice()
    print(f"\n2. LibreOffice (推荐)")
    print(f"   状态: {'✓ 可用' if libre_available else '✗ 不可用'}")
    print(f"   说明: {libre_msg}")
    if not libre_available:
        print(f"   下载: https://www.libreoffice.org/download/download/")
    
    print(f"\n3. HTML 中转 (兜底方案)")
    print(f"   状态: ✓ 始终可用")
    print(f"   说明: 基础文本提取,可能丢失部分格式")
    
    # 检查依赖库
    print("\n【依赖库检查】")
    deps = check_dependencies()
    for status, name, msg in deps:
        print(f"   {status} {name}: {msg}")
    
    # 推荐方案
    print("\n【推荐方案】")
    if word_available:
        print("   ✓ 当前使用 Microsoft Word 转换 (最佳)")
    elif libre_available:
        print("   ✓ 当前使用 LibreOffice 转换 (推荐)")
    else:
        print("   ⚠ 当前使用 HTML 兜底方案 (基础)")
        print("   建议: 安装 LibreOffice 以获得更好的转换质量")
        print("   下载: https://www.libreoffice.org/download/download/")
    
    print("\n" + "=" * 60)
