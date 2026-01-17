import os
from .base import BaseConverter
from typing import Dict, Any


class TxtToSpeechConverter(BaseConverter):
    """TXT 到语音转换器 - 使用 Windows SAPI 或 pyttsx3"""
    
    def __init__(self):
        super().__init__()
        self.supported_formats = ['mp3', 'wav']
        self.engine = None
        self._init_engine()
    
    def _init_engine(self):
        """初始化语音引擎"""
        try:
            import pyttsx3
            self.engine = pyttsx3.init()
        except:
            self.engine = None
    
    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """将 TXT 转换为语音文件"""
        try:
            self.validate_input(input_path)
            
            if not self.engine:
                raise Exception("语音引擎初始化失败，请安装 pyttsx3: pip install pyttsx3")
            
            with open(input_path, 'r', encoding='utf-8') as f:
                text = f.read()
            
            if not text.strip():
                raise Exception("文本内容为空")
            
            # 配置语音参数
            rate = options.get('rate', 150)  # 语速
            volume = options.get('volume', 1.0)  # 音量 0-1
            
            self.engine.setProperty('rate', rate)
            self.engine.setProperty('volume', volume)
            
            # 保存为音频文件
            self.engine.save_to_file(text, output_path)
            self.engine.runAndWait()
            
            if not os.path.exists(output_path):
                raise Exception("音频文件生成失败")
            
            return {
                'success': True,
                'output_path': output_path,
                'size': self.get_output_size(output_path)
            }
            
        except Exception as e:
            self.cleanup_on_error(output_path)
            raise Exception(f"TXT to Speech conversion failed: {str(e)}")
