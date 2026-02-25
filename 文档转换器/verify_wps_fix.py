"""
验证WPS窗口最小化修复是否生效
检查代码中是否包含正确的设置
"""

import os
import sys

def check_file_content(filepath, checks):
    """检查文件内容"""
    print(f"\n检查文件: {filepath}")
    print("="*60)
    
    if not os.path.exists(filepath):
        print(f"❌ 文件不存在")
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    all_passed = True
    for check_name, check_text in checks.items():
        if check_text in content:
            print(f"✅ {check_name}")
        else:
            print(f"❌ {check_name}")
            all_passed = False
    
    return all_passed

def main():
    print("="*60)
    print("WPS窗口最小化修复验证")
    print("="*60)
    
    # 检查各个文件
    files_to_check = {
        'backend/converters/ppt_to_image_wps.py': {
            'PowerPoint Visible=1': 'ppt_app.Visible = 1',
            'PowerPoint WindowState=2': 'ppt_app.WindowState = 2',
            'PowerPoint WithWindow=1': 'WithWindow=1',
            'WPS Visible=True': 'wps_app.Visible = True',
        },
        'backend/converters/ppt_to_video_wps.py': {
            'WPS Visible=True': 'wps_app.Visible = True',
            'WPS WindowState=2': 'wps_app.WindowState = 2',
        },
        'backend/converters/ppt_to_video_smart.py': {
            'PowerPoint Visible=1': 'ppt_app.Visible = 1',
            'PowerPoint WindowState=2': 'ppt_app.WindowState = 2',
            'PowerPoint WithWindow=1': 'WithWindow=1',
        },
        'backend/converters/ppt_to_video.py': {
            'PowerPoint Visible=1': 'ppt_app.Visible = 1',
            'PowerPoint WindowState=2': 'ppt_app.WindowState = 2',
            'PowerPoint WithWindow=True': 'WithWindow=True',
        }
    }
    
    all_files_ok = True
    for filepath, checks in files_to_check.items():
        if not check_file_content(filepath, checks):
            all_files_ok = False
    
    print("\n" + "="*60)
    if all_files_ok:
        print("✅ 所有文件检查通过！代码已正确修改")
    else:
        print("❌ 部分文件检查失败！代码可能未正确修改")
    print("="*60)
    
    # 检查缓存目录
    print("\n检查Python缓存目录:")
    print("="*60)
    
    cache_dirs = [
        'backend/__pycache__',
        'backend/converters/__pycache__',
        'backend/services/__pycache__',
        'backend/utils/__pycache__',
    ]
    
    has_cache = False
    for cache_dir in cache_dirs:
        if os.path.exists(cache_dir):
            file_count = len([f for f in os.listdir(cache_dir) if f.endswith('.pyc')])
            if file_count > 0:
                print(f"⚠️  {cache_dir} - {file_count} 个缓存文件")
                has_cache = True
        else:
            print(f"✅ {cache_dir} - 不存在")
    
    if has_cache:
        print("\n⚠️  警告: 发现Python缓存文件！")
        print("建议清除缓存后重启服务")
    else:
        print("\n✅ 没有发现缓存文件")
    
    print("="*60)

if __name__ == '__main__':
    main()
