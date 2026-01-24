#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
转换器修复脚本
自动检测并修复常见问题
"""

import os
import sys
import subprocess
import requests
from pathlib import Path

def print_header(text):
    print("\n" + "=" * 60)
    print(text)
    print("=" * 60)

def print_step(text):
    print(f"\n→ {text}")

def print_success(text):
    print(f"  ✓ {text}")

def print_error(text):
    print(f"  ✗ {text}")

def check_and_install_dependencies():
    """检查并安装缺失的依赖"""
    print_header("检查依赖包")
    
    requirements_file = Path("backend/requirements.txt")
    if not requirements_file.exists():
        print_error("requirements.txt 文件不存在")
        return False
    
    print_step("读取 requirements.txt")
    with open(requirements_file, 'r') as f:
        requirements = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    
    print_success(f"找到 {len(requirements)} 个依赖包")
    
    missing_packages = []
    for req in requirements:
        package_name = req.split('==')[0].split('>=')[0].split('<=')[0]
        try:
            __import__(package_name.replace('-', '_'))
            print_success(f"{package_name} 已安装")
        except ImportError:
            print_error(f"{package_name} 未安装")
            missing_packages.append(req)
    
    if missing_packages:
        print_step(f"发现 {len(missing_packages)} 个缺失的包")
        print("  缺失的包:", ", ".join(missing_packages))
        
        response = input("\n是否安装缺失的包? (y/n): ")
        if response.lower() == 'y':
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install"] + missing_packages)
                print_success("依赖包安装完成")
                return True
            except subprocess.CalledProcessError as e:
                print_error(f"安装失败: {e}")
                return False
    else:
        print_success("所有依赖包已安装")
        return True

def check_backend_service():
    """检查后端服务"""
    print_header("检查后端服务")
    
    try:
        response = requests.get("http://127.0.0.1:8002/api/health", timeout=5)
        if response.status_code == 200:
            print_success("后端服务运行正常")
            data = response.json()
            print(f"  状态: {data.get('status')}")
            print(f"  支持的转换: {len(data.get('supported_conversions', []))} 种")
            return True
        else:
            print_error(f"后端服务响应异常: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("无法连接到后端服务")
        print("\n  请在另一个终端运行:")
        print("  python backend/main.py")
        return False
    except Exception as e:
        print_error(f"检查失败: {e}")
        return False

def test_html_to_pdf():
    """测试HTML转PDF功能"""
    print_header("测试 HTML 转 PDF")
    
    # 创建测试HTML
    test_html = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>测试</title>
</head>
<body>
    <h1>测试HTML转PDF</h1>
    <p>这是一个测试文档。</p>
</body>
</html>"""
    
    test_file = "test_fix.html"
    with open(test_file, 'w', encoding='utf-8') as f:
        f.write(test_html)
    
    print_step("发送转换请求")
    
    try:
        with open(test_file, 'rb') as f:
            files = {'file': ('test.html', f, 'text/html')}
            data = {
                'target_format': 'pdf',
                'page_size': 'A4',
                'orientation': '纵向'
            }
            
            response = requests.post(
                'http://127.0.0.1:8002/api/convert/general',
                files=files,
                data=data,
                timeout=30
            )
        
        # 清理测试文件
        if os.path.exists(test_file):
            os.remove(test_file)
        
        if response.status_code == 200:
            result = response.json()
            print_success("HTML转PDF功能正常")
            print(f"  输出文件: {result.get('filename')}")
            print(f"  文件大小: {result.get('size')} bytes")
            print(f"  转换方法: {result.get('method')}")
            return True
        else:
            print_error(f"转换失败: {response.status_code}")
            print(f"  错误信息: {response.text[:200]}")
            return False
            
    except Exception as e:
        print_error(f"测试失败: {e}")
        return False

def check_converter_files():
    """检查转换器文件完整性"""
    print_header("检查转换器文件")
    
    converter_dir = Path("backend/converters")
    if not converter_dir.exists():
        print_error(f"转换器目录不存在: {converter_dir}")
        return False
    
    required_files = [
        'base.py',
        '__init__.py',
        'html_to_pdf.py',
        'json_to_yaml.py',
        'xml_to_json.py',
        'txt_to_pdf.py'
    ]
    
    missing_files = []
    for file in required_files:
        file_path = converter_dir / file
        if file_path.exists():
            print_success(f"{file} 存在")
        else:
            print_error(f"{file} 缺失")
            missing_files.append(file)
    
    if missing_files:
        print_error(f"发现 {len(missing_files)} 个缺失的文件")
        return False
    else:
        print_success("所有核心转换器文件完整")
        return True

def check_frontend_config():
    """检查前端配置"""
    print_header("检查前端配置")
    
    api_file = Path("frontend/src/services/api.js")
    if not api_file.exists():
        print_error("前端API文件不存在")
        return False
    
    with open(api_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查API_BASE_URL
    if "API_BASE_URL = 'http://127.0.0.1:8002'" in content:
        print_success("API_BASE_URL 配置正确")
    else:
        print_error("API_BASE_URL 配置可能不正确")
        print("  请检查 frontend/src/services/api.js")
        return False
    
    # 检查convertGeneral函数
    if "export const convertGeneral" in content:
        print_success("convertGeneral 函数存在")
    else:
        print_error("convertGeneral 函数缺失")
        return False
    
    return True

def generate_report():
    """生成诊断报告"""
    print_header("生成诊断报告")
    
    report = []
    report.append("# 转换器诊断报告\n")
    report.append(f"生成时间: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    
    # 运行所有检查
    checks = {
        "依赖包": check_and_install_dependencies(),
        "转换器文件": check_converter_files(),
        "前端配置": check_frontend_config(),
        "后端服务": check_backend_service(),
        "HTML转PDF": test_html_to_pdf()
    }
    
    report.append("## 检查结果\n\n")
    for name, result in checks.items():
        status = "✅ 通过" if result else "❌ 失败"
        report.append(f"- {name}: {status}\n")
    
    report.append("\n## 总结\n\n")
    if all(checks.values()):
        report.append("✅ 所有检查通过，系统运行正常！\n")
    else:
        report.append("❌ 发现问题，请查看上面的详细信息。\n")
    
    report_file = "诊断报告.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.writelines(report)
    
    print_success(f"报告已保存到: {report_file}")

def main():
    print("\n")
    print("╔" + "═" * 58 + "╗")
    print("║" + " " * 15 + "转换器修复工具" + " " * 29 + "║")
    print("╚" + "═" * 58 + "╝")
    
    try:
        # 1. 检查依赖
        deps_ok = check_and_install_dependencies()
        
        # 2. 检查转换器文件
        files_ok = check_converter_files()
        
        # 3. 检查前端配置
        frontend_ok = check_frontend_config()
        
        # 4. 检查后端服务
        backend_ok = check_backend_service()
        
        # 5. 测试HTML转PDF
        if backend_ok:
            test_ok = test_html_to_pdf()
        else:
            test_ok = False
            print("\n⚠️  跳过功能测试 (后端服务未运行)")
        
        # 总结
        print_header("修复完成")
        
        all_ok = deps_ok and files_ok and frontend_ok and backend_ok and test_ok
        
        if all_ok:
            print("\n✅ 所有检查通过！系统运行正常。")
            print("\n如果前端仍然显示转换失败，请尝试:")
            print("  1. 清除浏览器缓存 (Ctrl+Shift+Delete)")
            print("  2. 硬刷新页面 (Ctrl+Shift+R)")
            print("  3. 检查浏览器控制台的错误信息")
        else:
            print("\n❌ 发现问题，请查看上面的详细信息。")
            print("\n常见解决方案:")
            print("  1. 安装缺失的依赖: pip install -r backend/requirements.txt")
            print("  2. 启动后端服务: python backend/main.py")
            print("  3. 检查文件完整性")
        
        print("\n" + "=" * 60)
        
    except KeyboardInterrupt:
        print("\n\n操作已取消")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ 发生错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
