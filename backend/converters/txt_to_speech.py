import os
from .base import BaseConverter
from typing import Dict, Any


class TxtToSpeechConverter(BaseConverter):
    """TXT 到语音转换器（优化版 - 参考 conversion_core）
    
    优化内容：
    1. 添加进度回调支持
    2. 支持 MP3 和 WAV 格式
    3. 使用 gTTS (Google Text-to-Speech) 作为主要引擎
    4. pyttsx3 作为降级方案
    5. 支持多语言
    """
    
    def __init__(self):
        super().__init__()
        self.supported_formats = ['mp3', 'wav']
    
    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """将 TXT 转换为语音文件（多策略）"""
        try:
            self.validate_input(input_path)
            self.update_progress(input_path, 5)
            
            with open(input_path, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
            
            if not text.strip():
                raise Exception("文本内容为空")
            
            self.update_progress(input_path, 15)
            
            # 获取选项
            rate = options.get('rate', 150)  # 语速
            volume = options.get('volume', 1.0)  # 音量 0-1
            language = options.get('language', 'en')  # 语言代码
            
            target_format = output_path.split('.')[-1].lower()
            
            # 策略1: 使用 gTTS (推荐,支持 MP3)
            if target_format == 'mp3':
                try:
                    result = self._convert_with_gtts(text, output_path, language)
                    self.update_progress(input_path, 100)
                    return result
                except Exception as e1:
                    print(f"[gTTS failed] {e1}, trying pyttsx3...")
                    self.update_progress(input_path, 30)
            
            # 策略2: 使用 pyttsx3 (降级方案,主要支持 WAV)
            try:
                result = self._convert_with_pyttsx3(text, output_path, rate, volume)
                self.update_progress(input_path, 100)
                return result
            except Exception as e2:
                raise Exception(f"All TTS engines failed. gTTS: {str(e1) if target_format == 'mp3' else 'skipped'}, pyttsx3: {str(e2)}")
            
        except Exception as e:
            self.cleanup_on_error(output_path)
            raise Exception(f"TXT to Speech conversion failed: {str(e)}")
    
    def _convert_with_gtts(self, text: str, output_path: str, language: str = 'en') -> Dict[str, Any]:
        """使用 gTTS 转换（主策略 - 支持 MP3）"""
        try:
            from gtts import gTTS
        except ImportError:
            raise Exception("gTTS not installed. Install with: pip install gtts")
        
        # 语言映射
        lang_map = {
            'en': 'en',
            '英语': 'en',
            'zh': 'zh-CN',
            '中文': 'zh-CN',
            '中文 (普通话)': 'zh-CN',
            'es': 'es',
            '西班牙语': 'es',
            'fr': 'fr',
            '法语': 'fr',
            'de': 'de',
            '德语': 'de'
        }
        
        lang_code = lang_map.get(language, 'en')
        
        # 创建 TTS 对象
        tts = gTTS(text=text, lang=lang_code, slow=False)
        
        # 保存为 MP3
        tts.save(output_path)
        
        if not os.path.exists(output_path):
            raise Exception("Audio file generation failed")
        
        return {
            'success': True,
            'output_path': output_path,
            'size': self.get_output_size(output_path),
            'method': 'gtts',
            'language': lang_code
        }
    
    def _convert_with_pyttsx3(self, text: str, output_path: str, rate: int = 150, volume: float = 1.0) -> Dict[str, Any]:
        """使用 pyttsx3 转换（降级方案 - 主要支持 WAV）"""
        try:
            import pyttsx3
        except ImportError:
            raise Exception("pyttsx3 not installed. Install with: pip install pyttsx3")
        
        engine = pyttsx3.init()
        
        # 配置语音参数
        engine.setProperty('rate', rate)
        engine.setProperty('volume', volume)
        
        # 保存为音频文件
        engine.save_to_file(text, output_path)
        engine.runAndWait()
        
        if not os.path.exists(output_path):
            raise Exception("Audio file generation failed")
        
        return {
            'success': True,
            'output_path': output_path,
            'size': self.get_output_size(output_path),
            'method': 'pyttsx3'
        }
