import os
from .base import BaseConverter
from .pdf_to_image import PdfToImageConverter
from typing import Dict, Any


class PdfToPsdConverter(BaseConverter):
    """PDF 到 PSD 转换器 - 通过PNG中间格式实现"""
    
    def __init__(self):
        super().__init__()
        self.supported_formats = ['psd']
        self.pdf_to_image = PdfToImageConverter()
    
    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """将 PDF 转换为 PSD（通过PNG中间格式）"""
        temp_png_path = None
        try:
            self.validate_input(input_path)
            self.update_progress(input_path, 10)
            
            # 生成临时PNG文件
            base_dir = os.path.dirname(output_path) or os.getcwd()
            base_name = os.path.splitext(os.path.basename(output_path))[0]
            temp_png_path = os.path.join(base_dir, base_name + "_temp.png")
            
            # 第一步：PDF -> PNG（第一页）
            self.pdf_to_image.convert(input_path, temp_png_path, **options)
            self.update_progress(input_path, 50)
            
            # 第二步：PNG -> PSD
            try:
                from PIL import Image
                
                # 读取PNG
                img = Image.open(temp_png_path)
                
                # 转换为RGB模式
                if img.mode == 'RGBA':
                    # 保留alpha通道
                    pass
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # 使用psd-tools创建PSD（如果可用）
                try:
                    from psd_tools import PSDImage
                    from psd_tools.api.layers import PixelLayer
                    import numpy as np
                    
                    # 创建新的PSD
                    psd = PSDImage.new('RGB', img.size, color=0)
                    
                    # 添加图层
                    layer = PixelLayer.frompil(img, psd)
                    psd.append(layer)
                    
                    # 保存
                    psd.save(output_path)
                    
                    method = 'pdf->png->psd (psd-tools)'
                    
                except ImportError:
                    # 降级方案：保存为TIFF（Photoshop可以打开）
                    # 或者直接重命名PNG为PSD（简单但不标准）
                    import shutil
                    shutil.copy(temp_png_path, output_path)
                    
                    method = 'pdf->png->psd (png-copy)'
                    note = 'Saved as PNG with .psd extension. Install psd-tools for proper PSD format.'
                
                self.update_progress(input_path, 100)
                
                return {
                    'success': True,
                    'output_path': output_path,
                    'size': self.get_output_size(output_path),
                    'method': method,
                    'note': note if 'note' in locals() else 'Basic PSD format'
                }
                
            except ImportError:
                raise Exception("PIL/Pillow not installed. Install with: pip install Pillow")
            
        except Exception as e:
            self.cleanup_on_error(output_path)
            raise Exception(f"PDF to PSD conversion failed: {str(e)}")
        finally:
            # 清理临时PNG文件
            if temp_png_path and os.path.exists(temp_png_path):
                try:
                    os.remove(temp_png_path)
                except:
                    pass
