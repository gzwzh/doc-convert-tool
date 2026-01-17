from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Callable
import os

class BaseConverter(ABC):
    """基础转换器抽象类（优化版 - 参考 conversion_core）"""
    
    def __init__(self):
        self.supported_formats: List[str] = []
        self.progress_callback: Optional[Callable[[str, int], None]] = None
    
    @abstractmethod
    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """
        执行转换（子类必须实现）
        
        Args:
            input_path: 输入文件路径
            output_path: 输出文件路径
            **options: 转换选项
                - progress_callback: 进度回调函数 (file_path, progress) -> None
            
        Returns:
            转换结果字典
        """
        pass
    
    def set_progress_callback(self, callback: Callable[[str, int], None]):
        """设置进度回调函数"""
        self.progress_callback = callback
    
    def update_progress(self, file_path: str, progress: int):
        """更新进度（0-100）"""
        if self.progress_callback:
            try:
                self.progress_callback(file_path, min(max(progress, 0), 100))
            except Exception as e:
                print(f"[Progress callback error] {e}")
    
    def validate_input(self, input_path: str) -> bool:
        """验证输入文件是否有效（增强版）"""
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file not found: {input_path}")
        
        file_size = os.path.getsize(input_path)
        if file_size == 0:
            raise ValueError(f"Input file is empty: {input_path}")
        
        # 检查文件大小限制（默认 100MB）
        max_size = 100 * 1024 * 1024  # 100MB
        if file_size > max_size:
            print(f"[Warning] Large file detected: {file_size / 1024 / 1024:.2f}MB")
        
        return True
    
    def cleanup_on_error(self, output_path: str):
        """错误清理：如果转换失败，删除可能生成的残余文件"""
        if os.path.exists(output_path):
            try:
                os.remove(output_path)
            except Exception:
                pass

    def get_output_size(self, output_path: str) -> int:
        """获取输出文件大小"""
        if os.path.exists(output_path):
            return os.path.getsize(output_path)
        return 0
    
    def format_file_size(self, size_bytes: int) -> str:
        """格式化文件大小"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.2f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.2f} TB"
