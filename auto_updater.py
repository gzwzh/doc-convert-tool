"""
自动更新模块 - 按照软件版本管理平台规范实现
软件编号: 10031
"""
import os
import sys
import json
import hashlib
import shutil
import zipfile
import requests
from pathlib import Path
from typing import Optional, Dict, Any
from dataclasses import dataclass
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@dataclass
class UpdateInfo:
    """更新信息数据类"""
    has_update: bool
    version: Optional[str] = None
    update_log: Optional[str] = None
    download_url: Optional[str] = None
    package_size: Optional[int] = None
    package_hash: Optional[str] = None
    is_mandatory: bool = False
    release_date: Optional[str] = None


class AutoUpdater:
    """
    自动更新器 - 集成到应用中
    
    初始化参数:
    - server_url: 平台服务器地址 (如: 'http://software.kunqiongai.com:8000')
    - software_id: 软件唯一标识符 (如: '10031')
    - current_version: 当前版本号 (如: '1.0.0')
    - app_dir: 应用程序根目录路径
    """
    
    def __init__(self, server_url: str, software_id: str, current_version: str, app_dir: str):
        self.server_url = server_url.rstrip('/')
        self.software_id = software_id
        self.current_version = current_version
        self.app_dir = Path(app_dir)
        self.backup_dir = self.app_dir.parent / 'backup'
        self.temp_dir = self.app_dir.parent / 'temp_update'
        self.update_package_path: Optional[Path] = None
        
        self.backup_dir.mkdir(exist_ok=True)
        self.temp_dir.mkdir(exist_ok=True)
    
    def check_update(self) -> UpdateInfo:
        """检查是否有新版本"""
        try:
            url = f"{self.server_url}/api/v1/updates/check/"
            params = {
                'software': self.software_id,
                'version': self.current_version
            }
            
            logger.info(f"正在检查更新... (软件ID: {self.software_id}, 当前版本: {self.current_version})")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('has_update'):
                logger.info(f"发现新版本: {data.get('version')}")
                return UpdateInfo(
                    has_update=True,
                    version=data.get('version'),
                    update_log=data.get('update_log'),
                    download_url=data.get('download_url'),
                    package_size=data.get('package_size'),
                    package_hash=data.get('package_hash'),
                    is_mandatory=data.get('is_mandatory', False),
                    release_date=data.get('release_date')
                )
            else:
                logger.info("当前已是最新版本")
                return UpdateInfo(has_update=False)
                
        except Exception as e:
            logger.error(f"检查更新失败: {e}")
            return UpdateInfo(has_update=False)
    
    def download_update(self, update_info: UpdateInfo, progress_callback=None) -> bool:
        """下载更新包"""
        if not update_info.download_url:
            logger.error("下载地址为空")
            return False
        
        try:
            download_url = update_info.download_url
            if not download_url.startswith('http'):
                download_url = f"{self.server_url}{download_url}"
            
            filename = f"{self.software_id}_v{update_info.version}.zip"
            self.update_package_path = self.temp_dir / filename
            
            logger.info(f"开始下载: {filename}")
            
            # 断点续传
            headers = {}
            if self.update_package_path.exists():
                downloaded_size = self.update_package_path.stat().st_size
                if downloaded_size < (update_info.package_size or 0):
                    headers['Range'] = f'bytes={downloaded_size}-'
            
            response = requests.get(download_url, headers=headers, stream=True, timeout=30)
            response.raise_for_status()
            
            mode = 'ab' if 'Range' in headers else 'wb'
            downloaded = self.update_package_path.stat().st_size if self.update_package_path.exists() else 0
            
            with open(self.update_package_path, mode) as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if progress_callback and update_info.package_size:
                            progress_callback(downloaded, update_info.package_size)
            
            # 校验文件
            if update_info.package_hash:
                if not self._verify_hash(self.update_package_path, update_info.package_hash):
                    logger.error("文件校验失败")
                    self.update_package_path.unlink(missing_ok=True)
                    return False
            
            logger.info("下载完成")
            return True
            
        except Exception as e:
            logger.error(f"下载失败: {e}")
            return False
    
    def start_updater(self, update_info: UpdateInfo, exe_name: str = "文档转换器.exe") -> bool:
        """
        启动独立更新程序 (updater.exe)
        按照通用更新组件接入文档规范调用
        """
        try:
            updater_path = self.app_dir / "updater.exe"
            if not updater_path.exists():
                # 尝试在 resources 目录下查找
                updater_path = self.app_dir / "resources" / "updater.exe"
            
            if not updater_path.exists():
                logger.error("updater.exe 不存在")
                return False
            
            if not self.update_package_path or not self.update_package_path.exists():
                logger.error("更新包不存在")
                return False
            
            # 获取当前进程ID
            current_pid = os.getpid()
            
            # 构建命令行参数
            import subprocess
            cmd = [
                str(updater_path),
                "--zip", str(self.update_package_path),
                "--dir", str(self.app_dir),
                "--exe", exe_name,
                "--pid", str(current_pid)
            ]
            
            if update_info.package_hash:
                cmd.extend(["--hash", update_info.package_hash])
            
            logger.info(f"启动更新程序: {' '.join(cmd)}")
            
            # 启动独立更新程序
            subprocess.Popen(
                cmd,
                creationflags=subprocess.CREATE_NO_WINDOW | subprocess.DETACHED_PROCESS
            )
            
            logger.info("更新程序已启动，主程序即将退出")
            return True
            
        except Exception as e:
            logger.error(f"启动更新程序失败: {e}")
            return False
    
    def _verify_hash(self, file_path: Path, expected_hash: str) -> bool:
        """校验文件哈希"""
        sha256_hash = hashlib.sha256()
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(8192), b''):
                sha256_hash.update(chunk)
        return sha256_hash.hexdigest().lower() == expected_hash.lower()


def load_update_config(app_dir: str) -> Dict[str, Any]:
    """加载更新配置"""
    config_file = Path(app_dir) / "update_config.json"
    if config_file.exists():
        with open(config_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    # 默认配置
    return {
        "server_url": "http://software.kunqiongai.com:8000",
        "software_id": "10031",
        "current_version": "1.0.0",
        "auto_check_update": True,
        "auto_download": False,
        "auto_install": False
    }


def get_current_version(app_dir: str) -> str:
    """获取当前版本号"""
    version_file = Path(app_dir) / "version.txt"
    if version_file.exists():
        with open(version_file, 'r', encoding='utf-8') as f:
            return f.read().strip()
    return "1.0.0"


def check_and_prompt_update(app_dir: str) -> Optional[UpdateInfo]:
    """
    检查更新并提示用户
    返回更新信息，如果没有更新或用户取消则返回None
    """
    config = load_update_config(app_dir)
    
    if not config.get('auto_check_update', True):
        logger.info("自动检查更新已禁用")
        return None
    
    current_version = get_current_version(app_dir)
    
    updater = AutoUpdater(
        server_url=config['server_url'],
        software_id=config['software_id'],
        current_version=current_version,
        app_dir=app_dir
    )
    
    update_info = updater.check_update()
    
    if not update_info.has_update:
        return None
    
    return update_info


if __name__ == '__main__':
    # 测试代码
    app_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("=" * 60)
    print("自动更新测试")
    print("=" * 60)
    
    config = load_update_config(app_dir)
    print(f"\n配置信息:")
    print(f"  服务器: {config['server_url']}")
    print(f"  软件ID: {config['software_id']}")
    print(f"  当前版本: {get_current_version(app_dir)}")
    
    updater = AutoUpdater(
        server_url=config['server_url'],
        software_id=config['software_id'],
        current_version=get_current_version(app_dir),
        app_dir=app_dir
    )
    
    print("\n正在检查更新...")
    update_info = updater.check_update()
    
    if update_info.has_update:
        print(f"\n发现新版本: {update_info.version}")
        print(f"更新日志:\n{update_info.update_log}")
        print(f"是否强制更新: {'是' if update_info.is_mandatory else '否'}")
        print(f"发布日期: {update_info.release_date}")
    else:
        print("\n当前已是最新版本")
