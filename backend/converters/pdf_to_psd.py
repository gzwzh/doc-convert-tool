import os
import fitz
import zipfile
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
        temp_files = []
        try:
            self.validate_input(input_path)
            self.update_progress(input_path, 5)
            
            # 获取页数
            doc = fitz.open(input_path)
            page_count = doc.page_count
            doc.close()
            
            # 解析页面范围
            raw_page_range = options.get('pdf_page_range') or options.get('page_range')
            pages = self.parse_page_range(raw_page_range, total_pages=page_count)
            
            # 确定要处理的页面
            if pages is None:
                pages_to_process = range(page_count)
            else:
                pages_to_process = pages
            
            base_dir = os.path.dirname(output_path) or os.getcwd()
            base_name = os.path.splitext(os.path.basename(output_path))[0]
            
            processed_count = 0
            total_to_process = len(pages_to_process)
            output_files = []
            
            for page_num in pages_to_process:
                if page_num < 0 or page_num >= page_count:
                    continue
                
                # 构造临时文件名
                temp_png_path = os.path.join(base_dir, f"{base_name}_temp_{page_num}.png")
                temp_files.append(temp_png_path)
                
                # 构造输出文件名
                if total_to_process == 1:
                    current_output_path = output_path
                else:
                    current_output_path = os.path.join(base_dir, f"{base_name}_page_{page_num+1}.psd")
                
                # 第一步：PDF -> PNG（单页）
                # 覆盖 page_range 选项只处理当前页
                current_options = options.copy()
                current_options['pdf_page_range'] = str(page_num + 1)
                current_options['page_range'] = str(page_num + 1)
                
                self.pdf_to_image.convert(input_path, temp_png_path, **current_options)
                
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
                        psd.save(current_output_path)
                        
                        method = 'pdf->png->psd (psd-tools)'
                        
                    except ImportError:
                        # 降级方案：保存为TIFF（Photoshop可以打开）
                        # 或者直接重命名PNG为PSD（简单但不标准）
                        import shutil
                        shutil.copy(temp_png_path, current_output_path)
                        
                        method = 'pdf->png->psd (png-copy)'
                        note = 'Saved as PNG with .psd extension. Install psd-tools for proper PSD format.'
                    
                    if total_to_process > 1:
                        output_files.append(current_output_path)
                    
                    processed_count += 1
                    # 更新进度
                    progress = 10 + int((processed_count / total_to_process) * 80)
                    self.update_progress(input_path, progress)
                    
                except ImportError:
                    raise Exception("PIL/Pillow not installed. Install with: pip install Pillow")
            
            # 如果多页，打包为 ZIP
            final_output = output_path
            if total_to_process > 1:
                final_output = os.path.splitext(output_path)[0] + ".zip"
                with zipfile.ZipFile(final_output, 'w') as zf:
                    for f in output_files:
                        zf.write(f, os.path.basename(f))
                        os.remove(f) # 删除生成的 PSD 单页文件
            
            self.update_progress(input_path, 100)
            
            return {
                'success': True,
                'output_path': final_output,
                'size': self.get_output_size(final_output),
                'method': method if 'method' in locals() else 'unknown',
                'note': note if 'note' in locals() else 'Basic PSD format',
                'page_count': processed_count
            }
            
        except Exception as e:
            self.cleanup_on_error(output_path)
            raise Exception(f"PDF to PSD conversion failed: {str(e)}")
        finally:
            # 清理临时PNG文件
            for f in temp_files:
                if os.path.exists(f):
                    try:
                        os.remove(f)
                    except:
                        pass
