"""
创建更新包脚本
用于生成增量更新包
"""
import os
import sys
import shutil
import zipfile
import hashlib
import json
from pathlib import Path
from datetime import datetime


def get_version():
    """获取当前版本号"""
    version_file = Path(__file__).parent / "version.txt"
    if version_file.exists():
        return version_file.read_text().strip()
    return "1.0.0"


def set_version(new_version):
    """设置新版本号"""
    version_file = Path(__file__).parent / "version.txt"
    version_file.write_text(new_version)
    
    # 同时更新配置文件
    config_file = Path(__file__).parent / "update_config.json"
    if config_file.exists():
        with open(config_file, 'r', encoding='utf-8') as f:
            config = json.load(f)
        config['current_version'] = new_version
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"✅ 版本号已更新为: {new_version}")


def calculate_sha256(file_path):
    """计算文件SHA256哈希值"""
    sha256_hash = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha256_hash.update(chunk)
    return sha256_hash.hexdigest()


def create_update_package(new_version, update_log=""):
    """创建更新包"""
    print("\n" + "="*60)
    print(f"创建更新包: v{new_version}")
    print("="*60)
    
    root_dir = Path(__file__).parent
    release_dir = root_dir / "release" / f"v{new_version}"
    release_dir.mkdir(parents=True, exist_ok=True)
    
    # 创建临时目录
    temp_dir = release_dir / "temp_update"
    if temp_dir.exists():
        shutil.rmtree(temp_dir)
    temp_dir.mkdir()
    
    print(f"\n准备更新文件到: {temp_dir}")
    
    # 更新包应该包含的文件
    # 注意: 更新包的结构必须与安装目录一致
    # 对于 Electron 应用，许多文件在 resources 目录下
    
    # 基础配置文件
    files_to_include = [
        "version.txt",
        "update_config.json",
        "package.json",
    ]
    
    # 源代码和脚本
    scripts_to_include = [
        "auto_updater.py",
        "update_checker_gui.py",
        "updater.py",
    ]
    
    # 复制基础文件
    for file_name in files_to_include + scripts_to_include:
        src_path = root_dir / file_name
        dst_path = temp_dir / file_name
        if src_path.exists():
            dst_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_path, dst_path)
            print(f"  ✓ {file_name}")
            
    # 尝试包含 resources 目录（Electron 核心）
    # 在生产安装中，version.txt 等通常在 resources 目录
    resources_dst = temp_dir / "resources"
    resources_dst.mkdir(exist_ok=True)
    for file_name in files_to_include:
        shutil.copy2(root_dir / file_name, resources_dst / file_name)
    
    # 尝试包含 electron 目录，以便更新 main.js
    electron_src = root_dir / "electron"
    if electron_src.exists():
        electron_dst = resources_dst / "electron"
        if electron_dst.exists():
            shutil.rmtree(electron_dst)
        shutil.copytree(electron_src, electron_dst)
        print("  ✓ resources/electron (包含修改后的 main.js)")
        
    # 尝试包含 app.asar (如果存在于 build 目录)
    asar_src = root_dir / "release" / "win-unpacked" / "resources" / "app.asar"
    if asar_src.exists():
        shutil.copy2(asar_src, resources_dst / "app.asar")
        print("  ✓ resources/app.asar (从 build 目录复制)")
    else:
        # 如果不存在，包含前端编译产物 (dist 目录)
        frontend_src = root_dir / "frontend" / "dist"
        if frontend_src.exists():
            frontend_dst = resources_dst / "frontend" / "dist"
            if frontend_dst.exists():
                shutil.rmtree(frontend_dst)
            shutil.copytree(frontend_src, frontend_dst)
            print(f"  ✓ resources/frontend/dist (完整前端代码已包含)")
        else:
            print("  ⚠️ 警告: 未找到 app.asar 也未找到 frontend/dist，前端代码将不会被更新!")
    
    # 尝试包含后端程序
    backend_exe = root_dir / "backend" / "dist" / "backend-server" / "backend-server.exe"
    if backend_exe.exists():
        backend_dst = resources_dst / "backend" / "dist" / "backend-server"
        backend_dst.mkdir(parents=True, exist_ok=True)
        shutil.copy2(backend_exe, backend_dst / "backend-server.exe")
        print("  ✓ resources/backend/dist/backend-server/backend-server.exe")
    
    # 如果有其他需要更新的文件，在这里添加
    # 例如: 前端资源、后端程序等
    
    # 创建ZIP包
    package_name = f"10031_v{new_version}_update.zip"
    package_path = release_dir / package_name
    
    print(f"\n正在创建更新包: {package_name}")
    
    with zipfile.ZipFile(package_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                file_path = Path(root) / file
                # 计算相对路径（不包含temp_dir本身）
                arcname = file_path.relative_to(temp_dir)
                zipf.write(file_path, arcname)
                print(f"  添加: {arcname}")
    
    # 计算哈希值
    file_hash = calculate_sha256(package_path)
    file_size = package_path.stat().st_size
    
    # 保存更新包信息
    info = {
        "version": new_version,
        "software_id": "10031",
        "package_type": "update",
        "filename": package_name,
        "file_size": file_size,
        "file_hash": file_hash,
        "update_log": update_log,
        "created_at": datetime.now().isoformat()
    }
    
    info_file = release_dir / f"v{new_version}_update_info.json"
    with open(info_file, 'w', encoding='utf-8') as f:
        json.dump(info, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ 更新包创建成功!")
    print(f"   文件: {package_path}")
    print(f"   大小: {file_size / 1024:.2f} KB")
    print(f"   SHA256: {file_hash}")
    print(f"   信息文件: {info_file}")
    
    # 清理临时目录
    shutil.rmtree(temp_dir)
    
    return package_path, file_hash, info


def main():
    print("\n" + "="*60)
    print("文档转换工具 - 更新包生成脚本")
    print("="*60)
    
    current_version = get_version()
    print(f"\n当前版本: {current_version}")
    print(f"软件编号: 10031")
    
    # 输入新版本号
    # print("\n请输入新版本号 (格式: x.y.z):")
    # new_version = input("新版本号: ").strip()
    
    if len(sys.argv) > 1:
        new_version = sys.argv[1]
    else:
        print("\n请输入新版本号 (格式: x.y.z):")
        new_version = input("新版本号: ").strip()
    
    if not new_version:
        print("❌ 版本号不能为空")
        return
    
    # 验证版本号格式
    parts = new_version.split('.')
    if len(parts) != 3 or not all(p.isdigit() for p in parts):
        print("❌ 版本号格式错误，应为 x.y.z 格式")
        return
    
    # 输入更新日志
    # print("\n请输入更新日志 (可选，直接回车跳过):")
    # print("提示: 可以输入多行，输入空行结束")
    # update_log_lines = []
    # while True:
    #     line = input()
    #     if not line:
    #         break
    #     update_log_lines.append(line)
    
    # update_log = "\n".join(update_log_lines) if update_log_lines else f"版本更新至 {new_version}"
    update_log = "Update to 1.0.1 - Fix version display issue"
    
    # 确认
    print("\n" + "="*60)
    print("更新包信息:")
    print("="*60)
    print(f"当前版本: {current_version}")
    print(f"新版本: {new_version}")
    print(f"更新日志:\n{update_log}")
    print("="*60)
    
    # confirm = input("\n是否创建更新包? (y/n): ").strip().lower()
    # if confirm != 'y':
    #     print("已取消")
    #     return
    confirm = 'y'
    
    # 1. 更新版本号
    set_version(new_version)
    
    # 2. 创建更新包
    package_path, file_hash, info = create_update_package(new_version, update_log)
    
    print("\n" + "="*60)
    print("更新包创建完成!")
    print("="*60)
    print(f"\n更新包位置: {package_path}")
    print(f"\n下一步:")
    print(f"1. 将更新包上传到软件版本管理平台")
    print(f"2. 软件编号: 10031")
    print(f"3. 版本号: {new_version}")
    print(f"4. SHA256: {file_hash}")
    print(f"5. 更新日志: {update_log}")
    print(f"\n上传地址: http://software.kunqiongai.com:8000/admin/")


if __name__ == '__main__':
    main()
