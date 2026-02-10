"""
更新检查GUI - 在应用启动时显示更新提示
"""
import sys
import os
from PySide6.QtWidgets import (QApplication, QDialog, QVBoxLayout, QHBoxLayout, 
                               QLabel, QPushButton, QTextEdit, QProgressBar, QWidget)
from PySide6.QtCore import Qt, Signal, QThread
from PySide6.QtGui import QFont, QIcon
from auto_updater import AutoUpdater, UpdateInfo, load_update_config, get_current_version


class DownloadThread(QThread):
    """下载线程"""
    progress = Signal(int, int)  # downloaded, total
    finished = Signal(bool)  # success
    
    def __init__(self, updater, update_info):
        super().__init__()
        self.updater = updater
        self.update_info = update_info
    
    def run(self):
        def progress_callback(downloaded, total):
            self.progress.emit(downloaded, total)
        
        success = self.updater.download_update(self.update_info, progress_callback)
        self.finished.emit(success)


class UpdateDialog(QDialog):
    """更新提示对话框"""
    
    def __init__(self, update_info: UpdateInfo, updater: AutoUpdater, parent=None):
        super().__init__(parent)
        self.update_info = update_info
        self.updater = updater
        self.download_thread = None
        
        self.setWindowTitle("发现新版本")
        self.setFixedSize(500, 400)
        self.setWindowFlags(Qt.Dialog | Qt.WindowCloseButtonHint)
        
        self.init_ui()
    
    def init_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(15)
        layout.setContentsMargins(20, 20, 20, 20)
        
        # 标题
        title_label = QLabel(f"发现新版本 {self.update_info.version}")
        title_font = QFont()
        title_font.setPointSize(14)
        title_font.setBold(True)
        title_label.setFont(title_font)
        layout.addWidget(title_label)
        
        # 当前版本信息
        version_label = QLabel(f"当前版本: {self.updater.current_version}")
        version_label.setStyleSheet("color: #666;")
        layout.addWidget(version_label)
        
        # 更新日志
        log_label = QLabel("更新内容:")
        log_label.setStyleSheet("font-weight: bold;")
        layout.addWidget(log_label)
        
        self.log_text = QTextEdit()
        self.log_text.setReadOnly(True)
        self.log_text.setPlainText(self.update_info.update_log or "暂无更新说明")
        self.log_text.setMaximumHeight(150)
        layout.addWidget(self.log_text)
        
        # 发布信息
        info_layout = QHBoxLayout()
        if self.update_info.release_date:
            date_label = QLabel(f"发布日期: {self.update_info.release_date}")
            date_label.setStyleSheet("color: #666; font-size: 11px;")
            info_layout.addWidget(date_label)
        
        if self.update_info.package_size:
            size_mb = self.update_info.package_size / 1024 / 1024
            size_label = QLabel(f"大小: {size_mb:.2f} MB")
            size_label.setStyleSheet("color: #666; font-size: 11px;")
            info_layout.addWidget(size_label)
        
        info_layout.addStretch()
        layout.addLayout(info_layout)
        
        # 强制更新提示
        if self.update_info.is_mandatory:
            warning_label = QLabel("⚠️ 此版本为强制更新，必须安装后才能继续使用")
            warning_label.setStyleSheet("color: #ff4444; font-weight: bold; padding: 10px; background: #fff3cd; border-radius: 4px;")
            layout.addWidget(warning_label)
        
        # 进度条（初始隐藏）
        self.progress_widget = QWidget()
        progress_layout = QVBoxLayout(self.progress_widget)
        progress_layout.setContentsMargins(0, 0, 0, 0)
        
        self.progress_label = QLabel("准备下载...")
        progress_layout.addWidget(self.progress_label)
        
        self.progress_bar = QProgressBar()
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)
        progress_layout.addWidget(self.progress_bar)
        
        self.progress_widget.setVisible(False)
        layout.addWidget(self.progress_widget)
        
        # 按钮
        button_layout = QHBoxLayout()
        button_layout.addStretch()
        
        if not self.update_info.is_mandatory:
            self.cancel_button = QPushButton("稍后提醒")
            self.cancel_button.clicked.connect(self.reject)
            button_layout.addWidget(self.cancel_button)
        
        self.update_button = QPushButton("立即更新")
        self.update_button.setDefault(True)
        self.update_button.setStyleSheet("""
            QPushButton {
                background-color: #409eff;
                color: white;
                border: none;
                padding: 8px 20px;
                border-radius: 4px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #66b1ff;
            }
            QPushButton:pressed {
                background-color: #3a8ee6;
            }
            QPushButton:disabled {
                background-color: #a0cfff;
            }
        """)
        self.update_button.clicked.connect(self.start_update)
        button_layout.addWidget(self.update_button)
        
        layout.addLayout(button_layout)
    
    def start_update(self):
        """开始更新"""
        self.update_button.setEnabled(False)
        if hasattr(self, 'cancel_button'):
            self.cancel_button.setEnabled(False)
        
        self.progress_widget.setVisible(True)
        self.progress_label.setText("正在下载更新包...")
        
        # 启动下载线程
        self.download_thread = DownloadThread(self.updater, self.update_info)
        self.download_thread.progress.connect(self.on_download_progress)
        self.download_thread.finished.connect(self.on_download_finished)
        self.download_thread.start()
    
    def on_download_progress(self, downloaded, total):
        """更新下载进度"""
        if total > 0:
            percent = int(downloaded / total * 100)
            self.progress_bar.setValue(percent)
            
            downloaded_mb = downloaded / 1024 / 1024
            total_mb = total / 1024 / 1024
            self.progress_label.setText(f"正在下载: {downloaded_mb:.2f} MB / {total_mb:.2f} MB ({percent}%)")
    
    def on_download_finished(self, success):
        """下载完成"""
        if success:
            self.progress_label.setText("下载完成，准备安装...")
            self.progress_bar.setValue(100)
            
            # 启动更新程序
            if self.updater.start_updater(self.update_info):
                # 更新程序已启动，主程序即将退出
                self.accept()
                # 退出应用
                QApplication.quit()
            else:
                self.progress_label.setText("启动更新程序失败")
                self.update_button.setEnabled(True)
                if hasattr(self, 'cancel_button'):
                    self.cancel_button.setEnabled(True)
        else:
            self.progress_label.setText("下载失败，请检查网络连接")
            self.update_button.setEnabled(True)
            if hasattr(self, 'cancel_button'):
                self.cancel_button.setEnabled(True)


def show_update_dialog(update_info: UpdateInfo, updater: AutoUpdater) -> bool:
    """
    显示更新对话框
    返回: True表示用户选择更新，False表示取消
    """
    dialog = UpdateDialog(update_info, updater)
    result = dialog.exec()
    return result == QDialog.Accepted


def check_for_updates_on_startup(app_dir: str) -> bool:
    """
    应用启动时检查更新
    返回: True表示需要退出应用（正在更新），False表示继续运行
    """
    config = load_update_config(app_dir)
    
    if not config.get('auto_check_update', True):
        return False
    
    current_version = get_current_version(app_dir)
    
    updater = AutoUpdater(
        server_url=config['server_url'],
        software_id=config['software_id'],
        current_version=current_version,
        app_dir=app_dir
    )
    
    update_info = updater.check_update()
    
    if not update_info.has_update:
        return False
    
    # 显示更新对话框
    app = QApplication.instance()
    if app is None:
        app = QApplication(sys.argv)
    
    result = show_update_dialog(update_info, updater)
    
    # 如果是强制更新且用户没有选择更新，则退出应用
    if update_info.is_mandatory and not result:
        return True
    
    return result


if __name__ == '__main__':
    # 测试代码
    app = QApplication(sys.argv)
    
    app_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 模拟更新信息
    from auto_updater import UpdateInfo
    
    test_update_info = UpdateInfo(
        has_update=True,
        version="1.0.1",
        update_log="- 修复了若干bug\n- 优化了性能\n- 新增了一些功能",
        download_url="http://example.com/update.zip",
        package_size=10485760,  # 10MB
        package_hash="abc123",
        is_mandatory=False,
        release_date="2024-02-10"
    )
    
    config = load_update_config(app_dir)
    updater = AutoUpdater(
        server_url=config['server_url'],
        software_id=config['software_id'],
        current_version=get_current_version(app_dir),
        app_dir=app_dir
    )
    
    show_update_dialog(test_update_info, updater)
