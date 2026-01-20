import os
import logging
from html2image import Html2Image
from PIL import Image
from .base import BaseConverter
from typing import Dict, Any

logger = logging.getLogger(__name__)


class HtmlToImageConverter(BaseConverter):
    """HTML 到图片转换器（优化版 - 参考 conversion_core）
    
    优化内容：
    1. 添加进度回调
    2. 支持多种浏览器（Edge/Chrome）
    3. 可配置截图尺寸和质量
    4. 自动处理透明背景
    """
    
    def __init__(self):
        super().__init__()
        self.supported_formats = ['png', 'jpg', 'jpeg']
        self.hti = None
        self._init_browser()
    
    def _init_browser(self):
        """初始化浏览器"""
        try:
            # Windows: 优先使用 Edge
            edge_paths = [
                r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
            ]
            
            for edge_path in edge_paths:
                if os.path.exists(edge_path):
                    logger.info(f"Using Edge browser at {edge_path}")
                    self.hti = Html2Image(browser_executable=edge_path)
                    return
            
            # 尝试 Chrome
            chrome_paths = [
                r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            ]
            
            for chrome_path in chrome_paths:
                if os.path.exists(chrome_path):
                    logger.info(f"Using Chrome browser at {chrome_path}")
                    self.hti = Html2Image(browser_executable=chrome_path)
                    return
            
            # 使用默认
            logger.warning("No browser found, using default")
            self.hti = Html2Image()
            
        except Exception as e:
            logger.error(f"Failed to initialize Html2Image: {e}")
            self.hti = None
    
    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """将 HTML 转换为图片（浏览器截图）"""
        try:
            self.validate_input(input_path)
            self.update_progress(input_path, 5)
            
            if not self.hti:
                raise Exception("浏览器初始化失败，无法进行截图转换")
            
            # 读取 HTML 内容
            with open(input_path, 'r', encoding='utf-8', errors='ignore') as f:
                html_content = f.read()
            
            self.update_progress(input_path, 15)
            
            # 注入白色背景防止黑屏
            bg_css = '''<style>
                html, body { 
                    background-color: #ffffff !important; 
                    margin: 0;
                    padding: 20px;
                }
            </style>'''
            
            if '<head>' in html_content:
                html_content = html_content.replace('<head>', f'<head>{bg_css}')
            elif '<html>' in html_content:
                html_content = html_content.replace('<html>', f'<html><head>{bg_css}</head>')
            else:
                html_content = f'<html><head>{bg_css}</head><body>{html_content}</body></html>'
            
            # 配置参数
            # 宽度可以由前端指定,默认为 1280
            width = int(options.get('width') or 1280)
            # 为了尽量包含更多内容,默认高度设大一些(例如 4000 像素)
            # 如需更长页面,前端可以传入 height 覆盖
            height = int(options.get('height') or 4000)
            quality = options.get('quality', 90)
            
            self.update_progress(input_path, 25)
            
            # 设置输出目录
            output_dir = os.path.dirname(output_path) or os.getcwd()
            self.hti.output_path = output_dir
            
            # 先截图为 PNG
            temp_filename = os.path.basename(output_path) + '_temp.png'
            
            self.update_progress(input_path, 30)
            
            self.hti.screenshot(
                html_str=html_content,
                save_as=temp_filename,
                size=(width, height)
            )
            
            temp_path = os.path.join(output_dir, temp_filename)
            
            if not os.path.exists(temp_path):
                raise Exception("截图失败，未生成图片文件")
            
            self.update_progress(input_path, 70)
            
            # 根据目标格式处理
            target_ext = output_path.split('.')[-1].lower()
            
            if target_ext in ['jpg', 'jpeg']:
                # 转换为 JPG
                img = Image.open(temp_path)
                rgb_img = img.convert('RGB')
                rgb_img.save(output_path, 'JPEG', quality=quality)
                img.close()
                os.remove(temp_path)
            else:
                # PNG 直接重命名
                if temp_path != output_path:
                    if os.path.exists(output_path):
                        os.remove(output_path)
                    os.rename(temp_path, output_path)
            
            self.update_progress(input_path, 100)
            
            return {
                'success': True,
                'output_path': output_path,
                'size': self.get_output_size(output_path),
                'width': width,
                'height': height
            }
            
        except Exception as e:
            self.cleanup_on_error(output_path)
            raise Exception(f"HTML to Image conversion failed: {str(e)}")
