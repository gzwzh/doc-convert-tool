"""
诊断PPT文件和PowerPoint环境
"""

import os
import sys

def diagnose_ppt(ppt_path):
    """诊断PPT文件"""
    
    print("="*60)
    print("PPT转视频诊断工具")
    print("="*60)
    
    # 1. 检查文件
    print("\n[1] 检查文件...")
    if not os.path.exists(ppt_path):
        print(f"✗ 文件不存在: {ppt_path}")
        return False
    
    print(f"✓ 文件存在: {ppt_path}")
    print(f"  文件大小: {os.path.getsize(ppt_path)} bytes")
    print(f"  文件名: {os.path.basename(ppt_path)}")
    
    # 2. 检查PowerPoint
    print("\n[2] 检查PowerPoint...")
    try:
        import win32com.client
        import pythoncom
        print("✓ pywin32已安装")
    except ImportError:
        print("✗ pywin32未安装")
        return False
    
    # 3. 尝试启动PowerPoint
    print("\n[3] 启动PowerPoint...")
    pythoncom.CoInitialize()
    
    try:
        ppt_app = win32com.client.Dispatch("PowerPoint.Application")
        version = ppt_app.Version
        print(f"✓ PowerPoint启动成功")
        print(f"  版本: {version}")
    except Exception as e:
        print(f"✗ PowerPoint启动失败: {e}")
        pythoncom.CoUninitialize()
        return False
    
    # 4. 尝试打开PPT
    print("\n[4] 尝试打开PPT文件...")
    ppt_app.Visible = 1
    ppt_app.DisplayAlerts = 0
    
    try:
        abs_path = os.path.abspath(ppt_path)
        print(f"  绝对路径: {abs_path}")
        
        presentation = ppt_app.Presentations.Open(
            abs_path,
            ReadOnly=True,
            Untitled=False,
            WithWindow=True
        )
        
        slide_count = presentation.Slides.Count
        print(f"✓ PPT打开成功！")
        print(f"  幻灯片数: {slide_count}")
        
        # 关闭
        presentation.Close()
        print("✓ PPT已关闭")
        
        success = True
        
    except Exception as e:
        print(f"✗ 打开PPT失败")
        print(f"  错误类型: {type(e).__name__}")
        print(f"  错误信息: {e}")
        
        import traceback
        print("\n详细错误:")
        traceback.print_exc()
        
        success = False
    
    # 5. 清理
    print("\n[5] 清理...")
    try:
        ppt_app.Quit()
        print("✓ PowerPoint已退出")
    except:
        pass
    
    pythoncom.CoUninitialize()
    
    print("\n" + "="*60)
    if success:
        print("✓ 诊断完成：PPT文件可以正常打开")
        print("  转换功能应该可以正常工作")
    else:
        print("✗ 诊断完成：PPT文件无法打开")
        print("  建议：")
        print("  1. 检查文件是否损坏")
        print("  2. 尝试用PowerPoint手动打开文件")
        print("  3. 如果有密码保护，请先解除")
        print("  4. 尝试另存为新文件")
    print("="*60)
    
    return success

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使用方法: python diagnose_ppt.py <ppt文件路径>")
        print("\n示例:")
        print('  python diagnose_ppt.py "助农电商平台开题答辩.pptx"')
        print('  python diagnose_ppt.py backend/uploads/test.pptx')
        sys.exit(1)
    
    ppt_path = sys.argv[1]
    success = diagnose_ppt(ppt_path)
    
    sys.exit(0 if success else 1)
