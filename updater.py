import sys
import os
import time
import zipfile
import shutil
import subprocess
import argparse
import traceback
import ctypes
import threading
import hashlib
import requests
from PySide6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QLabel, QProgressBar, QWidget
from PySide6.QtCore import Qt, Signal, QObject, QTimer
from PySide6.QtGui import QIcon, QFont

def log(msg):
    try:
        # 优先写入到用户临时目录，确保始终有写入权限
        temp_dir = os.environ.get('TEMP', os.environ.get('TMP', '.'))
        log_file = os.path.join(temp_dir, "updater_log.txt")
        
        # 同时尝试写入到程序目录作为备份
        try:
            if getattr(sys, 'frozen', False):
                base_path = os.path.dirname(sys.executable)
            else:
                base_path = os.path.dirname(os.path.abspath(__file__))
            local_log = os.path.join(base_path, "updater_log.txt")
            with open(local_log, "a", encoding="utf-8") as f:
                f.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} - {msg}\n")
        except:
            pass

        with open(log_file, "a", encoding="utf-8") as f:
            f.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} - {msg}\n")
    except:
        pass

class UpdateSignals(QObject):
    progress = Signal(int)
    status = Signal(str)
    finished = Signal(bool)

class UpdateWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowFlags(Qt.Window | Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.Tool)
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setFixedSize(450, 180)
        
        # Central widget with styling
        self.container = QWidget()
        self.container.setObjectName("container")
        self.container.setStyleSheet("""
            QWidget#container {
                background-color: qlineargradient(x1:0, y1:0, x2:1, y2:1, stop:0 #ffffff, stop:1 #f8f9fa);
                border: 1px solid #dcdfe6;
                border-radius: 12px;
            }
            QLabel#titleLabel {
                color: #2c3e50;
                font-size: 18px;
                font-weight: bold;
                font-family: "Segoe UI", "Microsoft YaHei";
            }
            QLabel#statusLabel {
                color: #5e6d82;
                font-size: 13px;
                font-family: "Segoe UI", "Microsoft YaHei";
            }
            QLabel#percentageLabel {
                color: #409eff;
                font-size: 13px;
                font-weight: bold;
                font-family: "Consolas", "Monaco";
            }
            QProgressBar {
                border: none;
                background-color: #ebeef5;
                height: 8px;
                border-radius: 4px;
            }
            QProgressBar::chunk {
                background-color: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #409eff, stop:1 #66b1ff);
                border-radius: 4px;
            }
        """)
        self.setCentralWidget(self.container)
        
        layout = QVBoxLayout(self.container)
        layout.setContentsMargins(35, 30, 35, 30)
        layout.setSpacing(12)
        
        # Title and Percentage Row
        header_layout = QVBoxLayout()
        header_layout.setSpacing(4)
        
        self.title_label = QLabel("正在升级系统")
        self.title_label.setObjectName("titleLabel")
        header_layout.addWidget(self.title_label)
        
        layout.addLayout(header_layout)
        
        # Status Row
        status_row = QWidget()
        status_row_layout = QVBoxLayout(status_row)
        status_row_layout.setContentsMargins(0, 0, 0, 0)
        status_row_layout.setSpacing(8)
        
        self.status_label = QLabel("准备就绪...")
        self.status_label.setObjectName("statusLabel")
        status_row_layout.addWidget(self.status_label)
        
        self.progress_bar = QProgressBar()
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)
        self.progress_bar.setTextVisible(False)
        status_row_layout.addWidget(self.progress_bar)
        
        layout.addWidget(status_row)
        
        # Percentage Label (Absolute positioned or in layout)
        self.percentage_label = QLabel("0%")
        self.percentage_label.setObjectName("percentageLabel")
        self.percentage_label.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        # Add to header or as a separate row
        layout.addWidget(self.percentage_label)
        
        # Shadow effect
        try:
            from PySide6.QtWidgets import QGraphicsDropShadowEffect
            from PySide6.QtGui import QColor
            shadow = QGraphicsDropShadowEffect(self)
            shadow.setBlurRadius(30)
            shadow.setColor(QColor(0, 0, 0, 60))
            shadow.setOffset(0, 8)
            self.container.setGraphicsEffect(shadow)
        except:
            pass

    def update_status(self, text):
        self.status_label.setText(text)

    def update_progress(self, value):
        self.progress_bar.setValue(value)
        self.percentage_label.setText(f"{value}%")

def is_process_running(pid):
    if pid <= 0:
        return False
    try:
        # 使用 ctypes 替代 tasklist 等外部命令
        kernel32 = ctypes.windll.kernel32
        PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
        process = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, False, pid)
        if process:
            exit_code = ctypes.c_ulong()
            kernel32.GetExitCodeProcess(process, ctypes.byref(exit_code))
            kernel32.CloseHandle(process)
            return exit_code.value == 259  # STILL_ACTIVE
        return False
    except:
        return False

def kill_process(pid):
    log(f"Attempting to kill process {pid}")
    try:
        # 使用 ctypes 直接终止进程，避免 taskkill 弹出控制台
        kernel32 = ctypes.windll.kernel32
        PROCESS_TERMINATE = 0x0001
        handle = kernel32.OpenProcess(PROCESS_TERMINATE, False, pid)
        if handle:
            kernel32.TerminateProcess(handle, 1)
            kernel32.CloseHandle(handle)
            log(f"Process {pid} terminated via ctypes")
            return True
        return False
    except Exception as e:
        log(f"Failed to kill process via ctypes: {e}")
        return False

def check_write_access(directory):
    try:
        test_file = os.path.join(directory, f".write_test_{int(time.time())}")
        with open(test_file, "w") as f:
            f.write("test")
        os.remove(test_file)
        return True
    except:
        return False

def kill_all_processes_in_dir(target_dir):
    """尝试关闭所有从目标目录运行的进程"""
    log(f"Searching for processes to kill in: {target_dir}")
    try:
        # 使用 wmic 获取所有进程的路径和 PID
        # wmic process get ExecutablePath,ProcessId
        cmd = 'wmic process get ExecutablePath,ProcessId /format:list'
        output = subprocess.check_output(cmd, shell=True).decode('utf-8', errors='ignore')
        
        target_dir = os.path.abspath(target_dir).lower()
        current_pid = os.getpid()
        
        processes = output.split('\n\n')
        for proc in processes:
            lines = proc.strip().split('\n')
            if len(lines) < 2:
                continue
            
            exe_path = ""
            pid = 0
            for line in lines:
                if line.startswith('ExecutablePath='):
                    exe_path = line.split('=', 1)[1].strip().lower()
                elif line.startswith('ProcessId='):
                    try:
                        pid = int(line.split('=', 1)[1].strip())
                    except:
                        pass
            
            if exe_path and pid and pid != current_pid:
                # 检查进程是否在目标目录下
                if exe_path.startswith(target_dir):
                    log(f"Found process {pid} at {exe_path}. Killing...")
                    kill_process(pid)
    except Exception as e:
        log(f"Error in kill_all_processes_in_dir: {e}")

def update_worker(args, signals):
    try:
        # 0. Check write access
        if not check_write_access(args.dir):
            log(f"No write access to {args.dir}")
            signals.status.emit("失败：没有写入权限，请以管理员身份运行")
            signals.finished.emit(False)
            return

        # 1. Wait and kill processes
        signals.status.emit("正在关闭相关进程...")
        signals.progress.emit(5)
        
        # 首先尝试优雅关闭传入的 PID
        if args.pid:
            start_time = time.time()
            timeout = 5
            while is_process_running(args.pid):
                if time.time() - start_time > timeout:
                    break
                time.sleep(0.5)
        
        # 强力清除目录下所有进程（包括 Electron 子进程和后端）
        kill_all_processes_in_dir(args.dir)
        time.sleep(1) # 等待操作系统释放句柄
        
        signals.progress.emit(10)
        
        # 2. Handle download if URL is provided
        zip_path = args.zip
        if args.url:
            signals.status.emit("正在下载更新包...")
            try:
                temp_dir = os.path.dirname(args.zip) if args.zip else os.environ.get('TEMP', '.')
                if not zip_path:
                    zip_path = os.path.join(temp_dir, "update_package.zip")
                
                # 优化下载参数
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive'
                }
                
                # 使用 Session 优化连接复用
                session = requests.Session()
                adapter = requests.adapters.HTTPAdapter(pool_connections=1, pool_maxsize=1, max_retries=3)
                session.mount('http://', adapter)
                session.mount('https://', adapter)
                
                response = session.get(args.url, stream=True, timeout=(5, 30), headers=headers)
                response.raise_for_status()
                total_size = int(response.headers.get('content-length', 0))
                
                downloaded = 0
                sha256 = hashlib.sha256()
                
                # 确保临时目录存在
                os.makedirs(os.path.dirname(zip_path), exist_ok=True)
                
                # 使用较大的缓冲区优化写入性能
                buffer_size = 128 * 1024 # 128KB
                with open(zip_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=buffer_size):
                        if chunk:
                            f.write(chunk)
                            sha256.update(chunk)
                            downloaded += len(chunk)
                            if total_size > 0:
                                progress = 10 + int(downloaded / total_size * 40) # 10% to 50%
                                signals.progress.emit(progress)
                                # 强制 GUI 刷新（通过信号处理）
                
                # 校验文件是否存在且大小不为0
                if not os.path.exists(zip_path) or os.path.getsize(zip_path) == 0:
                    raise Exception("下载的文件无效或为空")
                
                # Verify hash if provided
                if args.hash:
                    signals.status.emit("正在校验文件...")
                    actual_hash = sha256.hexdigest()
                    if actual_hash.lower() != args.hash.lower():
                        log(f"Hash mismatch. Expected: {args.hash}, Actual: {actual_hash}")
                        signals.status.emit("校验失败：下载文件损坏")
                        signals.finished.emit(False)
                        return
                
                log("Download successful")
            except Exception as e:
                log(f"Download failed: {traceback.format_exc()}")
                signals.status.emit(f"下载失败: {str(e)}")
                signals.finished.emit(False)
                return
        
        # 3. Install update
        signals.status.emit("正在安装更新...")
        signals.progress.emit(50)
        
        # 预检：确保 zip 文件有效
        if not zipfile.is_zipfile(zip_path):
            log(f"Invalid zip file: {zip_path}")
            signals.status.emit("更新包格式错误")
            signals.finished.emit(False)
            return

        max_retries = 5
        success = False
        for i in range(max_retries):
            try:
                # 显式关闭之前的句柄（如果存在）
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    files = zip_ref.namelist()
                    total_files = len(files)
                    for idx, file in enumerate(files):
                        # 规范化路径，防止目录遍历漏洞
                        if ".." in file or file.startswith("/") or file.startswith("\\"):
                            continue
                            
                        if "updater.exe" in file.lower():
                            continue
                        
                        # 确保目标目录存在
                        target_path = os.path.join(args.dir, file)
                        if file.endswith('/') or file.endswith('\\'):
                            os.makedirs(target_path, exist_ok=True)
                            continue
                            
                        os.makedirs(os.path.dirname(target_path), exist_ok=True)
                        
                        # 尝试提取并处理占用情况
                        try:
                            # 如果目标文件已存在，尝试重命名它以避免占用冲突
                            if os.path.exists(target_path) and not os.path.isdir(target_path):
                                try:
                                    temp_old = target_path + ".old"
                                    if os.path.exists(temp_old):
                                        os.remove(temp_old)
                                    os.rename(target_path, temp_old)
                                except Exception as e:
                                    log(f"Warning: Could not rename {file} to .old: {e}")
                            
                            zip_ref.extract(file, args.dir)
                            
                            # 提取成功后尝试删除 .old 文件
                            temp_old = target_path + ".old"
                            if os.path.exists(temp_old):
                                try:
                                    os.remove(temp_old)
                                except:
                                    pass # 删不掉也没关系，下次更新会处理
                        except Exception as e:
                            # 针对单个文件的权限错误进行重试
                            log(f"Error extracting {file}: {e}, retrying...")
                            time.sleep(1)
                            zip_ref.extract(file, args.dir)

                        progress = 50 + int((idx + 1) / total_files * 40) # 50% to 90%
                        signals.progress.emit(progress)
                
                success = True
                log("Extraction successful")
                break
            except Exception as e:
                log(f"Error during installation (attempt {i+1}/{max_retries}): {traceback.format_exc()}")
                signals.status.emit(f"正在重试 ({i+1}/{max_retries})...")
                time.sleep(2)
        
        if not success:
            signals.status.emit("安装失败：文件被占用或损坏")
            signals.finished.emit(False)
            return

        signals.progress.emit(95)
        signals.status.emit("清理并重启...")
        
        # 4. Cleanup
        try:
            if zip_path and os.path.exists(zip_path):
                os.remove(zip_path)
                log("Cleaned up zip file")
        except Exception as e:
            log(f"Failed to remove zip: {e}")

        # 5. Restart
        exe_path = os.path.join(args.dir, args.exe)
        if os.path.exists(exe_path):
            try:
                subprocess.Popen([exe_path], cwd=args.dir, 
                               creationflags=subprocess.CREATE_NO_WINDOW | subprocess.DETACHED_PROCESS)
                log("Application restarted")
                signals.progress.emit(100)
                signals.finished.emit(True)
            except Exception as e:
                log(f"Failed to restart application: {e}")
                signals.status.emit("启动失败，请手动打开程序")
                signals.finished.emit(False)
        else:
            log(f"Executable not found: {exe_path}")
            signals.status.emit("未找到主程序")
            signals.finished.emit(False)
            
    except Exception as e:
        log(f"Critical error in worker: {traceback.format_exc()}")
        signals.status.emit("更新出错，请联系支持")
        signals.finished.emit(False)

def main():
    parser = argparse.ArgumentParser(description='Independent Updater')
    parser.add_argument('--zip', help='Path to local update zip file')
    parser.add_argument('--url', help='URL to download update package')
    parser.add_argument('--hash', help='Expected SHA256 hash of the package')
    parser.add_argument('--dir', required=True, help='Installation directory')
    parser.add_argument('--exe', required=True, help='Main executable name to restart')
    parser.add_argument('--pid', type=int, help='PID of the main process to wait for')
    
    args = parser.parse_args()
    
    app = QApplication(sys.argv)
    window = UpdateWindow()
    window.show()
    
    screen_geometry = app.primaryScreen().geometry()
    window.move((screen_geometry.width() - window.width()) // 2,
                (screen_geometry.height() - window.height()) // 2)
    
    signals = UpdateSignals()
    signals.status.connect(window.update_status)
    signals.progress.connect(window.update_progress)
    
    def on_finished(success):
        if success:
            QTimer.singleShot(1000, app.quit)
        else:
            QTimer.singleShot(5000, app.quit)
            
    signals.finished.connect(on_finished)
    
    worker_thread = threading.Thread(target=update_worker, args=(args, signals))
    worker_thread.daemon = True
    worker_thread.start()
    
    sys.exit(app.exec())

if __name__ == '__main__':
    main()
