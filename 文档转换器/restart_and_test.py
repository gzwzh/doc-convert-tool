"""
完整的重启和测试流程
1. 停止所有相关进程
2. 清除Python缓存
3. 验证代码修改
4. 提供测试指引
"""

import os
import sys
import subprocess
import shutil
import time

def kill_processes():
    """停止所有相关进程"""
    print("="*60)
    print("步骤1: 停止相关进程")
    print("="*60)
    
    processes = ['python.exe', 'POWERPNT.EXE', 'wps.exe', 'wpp.exe']
    
    for proc in processes:
        print(f"停止 {proc}...")
        try:
            result = subprocess.run(
                ['taskkill', '/F', '/IM', proc],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                print(f"  ✅ {proc} 已停止")
            else:
                print(f"  ℹ️  {proc} 未运行")
        except Exception as e:
            print(f"  ⚠️  停止 {proc} 失败: {e}")
    
    time.sleep(2)
    print()

def clear_cache():
    """清除Python缓存"""
    print("="*60)
    print("步骤2: 清除Python缓存")
    print("="*60)
    
    cache_dirs = [
        'backend/__pycache__',
        'backend/converters/__pycache__',
        'backend/services/__pycache__',
        'backend/utils/__pycache__',
        'backend/api/__pycache__',
    ]
    
    for cache_dir in cache_dirs:
        if os.path.exists(cache_dir):
            try:
                shutil.rmtree(cache_dir)
                print(f"✅ 已删除: {cache_dir}")
            except Exception as e:
                print(f"⚠️  删除失败 {cache_dir}: {e}")
        else:
            print(f"ℹ️  不存在: {cache_dir}")
    
    print()

def verify_code():
    """验证代码修改"""
    print("="*60)
    print("步骤3: 验证代码修改")
    print("="*60)
    
    try:
        result = subprocess.run(
            ['python', 'verify_wps_fix.py'],
            capture_output=True,
            text=True,
            timeout=30
        )
        print(result.stdout)
        if result.returncode == 0:
            return True
        else:
            print(f"⚠️  验证脚本返回错误: {result.returncode}")
            return False
    except Exception as e:
        print(f"❌ 验证失败: {e}")
        return False

def check_backend_status():
    """检查后端服务状态"""
    print("="*60)
    print("步骤4: 检查后端服务状态")
    print("="*60)
    
    # 检查是否有Python进程在运行
    try:
        result = subprocess.run(
            ['tasklist'],
            capture_output=True,
            text=True
        )
        
        python_count = result.stdout.lower().count('python.exe')
        
        if python_count > 0:
            print(f"⚠️  发现 {python_count} 个Python进程正在运行")
            print("   后端服务可能已经在运行")
            return True
        else:
            print("ℹ️  没有Python进程在运行")
            print("   需要启动后端服务")
            return False
    except Exception as e:
        print(f"⚠️  检查失败: {e}")
        return False

def main():
    print("="*60)
    print("PPT转换修复 - 完整重启流程")
    print("="*60)
    print()
    print("此脚本将:")
    print("1. 停止所有相关进程")
    print("2. 清除Python缓存")
    print("3. 验证代码修改")
    print("4. 检查服务状态")
    print()
    
    choice = input("是否继续? (y/n): ")
    if choice.lower() != 'y':
        print("已取消")
        return
    
    print()
    
    # 执行步骤
    kill_processes()
    clear_cache()
    code_ok = verify_code()
    backend_running = check_backend_status()
    
    # 总结和指引
    print("="*60)
    print("完成总结")
    print("="*60)
    print()
    
    if code_ok:
        print("✅ 代码验证通过")
    else:
        print("❌ 代码验证失败")
        print("   请检查文件是否正确修改")
        return
    
    print()
    print("="*60)
    print("下一步操作")
    print("="*60)
    print()
    
    if not backend_running:
        print("后端服务未运行,请选择启动方式:")
        print()
        print("方式1: 开发模式 (推荐)")
        print("  npm run dev")
        print()
        print("方式2: 生产模式")
        print("  npm start")
        print()
    else:
        print("后端服务正在运行")
        print()
        print("如果要重启服务:")
        print("1. 先停止当前服务 (Ctrl+C)")
        print("2. 然后运行: npm run dev")
        print()
    
    print("="*60)
    print("测试方法")
    print("="*60)
    print()
    print("方法1: 通过Electron应用测试")
    print("  1. 启动应用: npm run dev")
    print("  2. 上传PPT文件")
    print("  3. 选择转换为PNG或MP4")
    print("  4. 观察是否有窗口弹出")
    print()
    print("方法2: 直接运行测试脚本")
    print("  python test_ppt_conversion_direct.py")
    print()
    print("预期结果:")
    print("  ✅ 转换成功")
    print("  ✅ 窗口最小化到任务栏")
    print("  ✅ 不会弹出全屏窗口")
    print("  ❌ 不应该出现RPC错误")
    print()
    print("="*60)

if __name__ == '__main__':
    main()
