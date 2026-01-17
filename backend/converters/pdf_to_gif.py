import fitz  # PyMuPDF
import os
from PIL import Image
from .base import BaseConverter
from typing import Dict, Any


class PdfToGifConverter(BaseConverter):
    """PDF 到 GIF 转换器 - 多页 PDF 转为动画 GIF"""
    
    def __init__(self):
        super().__init__()
        self.supported_formats = ['gif']
    
    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """将 PDF 转换为 GIF 动画"""
        try:
            self.validate_input(input_path)
            
            doc = fitz.open(input_path)
            page_count = doc.page_count
            
            # 配置参数
            zoom = options.get('zoom', 1.5)
            duration = options.get('duration', 1000)  # 每帧持续时间(毫秒)
            loop = options.get('loop', 0)  # 0 表示无限循环
            
            mat = fitz.Matrix(zoom, zoom)
            images = []
            
            for page_num in range(page_count):
                page = doc.load_page(page_num)
                pix = page.get_pixmap(matrix=mat)
                
                # 转换为 PIL Image
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                images.append(img)
            
            doc.close()
            
            if not images:
                raise Exception("No pages found in PDF")
            
            # 保存为 GIF
            images[0].save(
                output_path,
                save_all=True,
                append_images=images[1:] if len(images) > 1 else [],
                duration=duration,
                loop=loop
            )
            
            return {
                'success': True,
                'output_path': output_path,
                'size': self.get_output_size(output_path),
                'page_count': page_count
            }
            
        except Exception as e:
            self.cleanup_on_error(output_path)
            raise Exception(f"PDF to GIF conversion failed: {str(e)}")
