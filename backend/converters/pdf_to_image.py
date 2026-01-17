import fitz  # PyMuPDF
import os
import zipfile
from PIL import Image
from .base import BaseConverter
from typing import Dict, Any

class PdfToImageConverter(BaseConverter):
    """PDF 到 图片转换器（优化版 - 参考 conversion_core）
    
    优化内容：
    1. 添加质量设置（ultra/high/medium）
    2. 添加合并模式（垂直/水平拼接）
    3. 添加透明背景支持
    4. 添加进度回调
    5. 更灵活的DPI设置
    """
    
    # 质量预设
    QUALITY_SETTINGS = {
        'ultra': {'dpi': 300, 'quality': 100},
        'high': {'dpi': 200, 'quality': 95},
        'medium': {'dpi': 150, 'quality': 85}
    }
    
    def __init__(self):
        super().__init__()
        self.supported_formats = ['png', 'jpg', 'jpeg', 'bmp', 'tiff']
    
    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """将 PDF 转换为图片（增强版）"""
        try:
            self.validate_input(input_path)
            self.update_progress(input_path, 5)
            
            # 获取选项
            target_ext = output_path.split('.')[-1].lower()
            if target_ext == 'jpeg': target_ext = 'jpg'
            
            quality = options.get('quality', 'high')  # ultra/high/medium
            merge = options.get('merge', False)  # 是否合并多页
            merge_order = options.get('merge_order', 'vertical')  # vertical/horizontal
            transparent = options.get('transparent', False)  # 透明背景
            
            # 获取质量设置
            quality_settings = self.QUALITY_SETTINGS.get(quality, self.QUALITY_SETTINGS['high'])
            dpi = quality_settings['dpi']
            zoom = dpi / 72.0  # 转换为缩放比例
            
            self.update_progress(input_path, 10)
            
            doc = fitz.open(input_path)
            page_count = doc.page_count
            
            if page_count == 0:
                doc.close()
                raise Exception("PDF file is empty")
            
            self.update_progress(input_path, 15)
            
            temp_files = []
            base_name = os.path.splitext(os.path.basename(output_path))[0]
            output_dir = os.path.dirname(output_path) or os.getcwd()
            
            mat = fitz.Matrix(zoom, zoom)
            images = []
            
            # 转换每一页
            for page_num in range(page_count):
                page = doc.load_page(page_num)
                pix = page.get_pixmap(matrix=mat, alpha=transparent)
                
                # 转换为 PIL Image
                if transparent:
                    img = Image.frombytes("RGBA", [pix.width, pix.height], pix.samples)
                else:
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                
                images.append(img)
                
                # 更新进度 (15% ~ 60%)
                progress = 15 + int(((page_num + 1) / page_count) * 45)
                self.update_progress(input_path, progress)
            
            doc.close()
            self.update_progress(input_path, 65)
            
            # 处理合并模式
            if merge and page_count > 1:
                final_output = self._merge_images(
                    images, output_path, target_ext, 
                    merge_order, transparent, quality_settings
                )
                self.update_progress(input_path, 100)
                
                return {
                    'success': True,
                    'output_path': final_output,
                    'size': self.get_output_size(final_output),
                    'page_count': page_count,
                    'merged': True,
                    'quality': quality
                }
            else:
                # 保存单独的图片
                final_output = self._save_separate_images(
                    images, output_path, target_ext, 
                    base_name, output_dir, quality_settings
                )
                self.update_progress(input_path, 100)
                
                return {
                    'success': True,
                    'output_path': final_output,
                    'size': self.get_output_size(final_output),
                    'page_count': page_count,
                    'merged': False,
                    'quality': quality
                }
            
        except Exception as e:
            self.cleanup_on_error(output_path)
            raise Exception(f"PDF to Image conversion failed: {str(e)}")
    
    def _merge_images(self, images, output_path, target_ext, 
                     merge_order, transparent, quality_settings):
        """合并多张图片"""
        if merge_order == 'vertical':
            # 垂直拼接
            total_width = max(img.width for img in images)
            total_height = sum(img.height for img in images)
            
            mode = 'RGBA' if transparent else 'RGB'
            bg_color = (255, 255, 255, 0) if transparent else (255, 255, 255)
            merged = Image.new(mode, (total_width, total_height), bg_color)
            
            y_offset = 0
            for img in images:
                merged.paste(img, (0, y_offset))
                y_offset += img.height
        else:
            # 水平拼接
            total_width = sum(img.width for img in images)
            total_height = max(img.height for img in images)
            
            mode = 'RGBA' if transparent else 'RGB'
            bg_color = (255, 255, 255, 0) if transparent else (255, 255, 255)
            merged = Image.new(mode, (total_width, total_height), bg_color)
            
            x_offset = 0
            for img in images:
                merged.paste(img, (x_offset, 0))
                x_offset += img.width
        
        # 保存合并后的图片
        self._save_image(merged, output_path, target_ext, quality_settings)
        return output_path
    
    def _save_separate_images(self, images, output_path, target_ext, 
                              base_name, output_dir, quality_settings):
        """保存单独的图片"""
        temp_files = []
        
        for idx, img in enumerate(images):
            if len(images) == 1:
                page_filename = output_path
            else:
                page_filename = os.path.join(output_dir, f"{base_name}_page_{idx+1}.{target_ext}")
            
            self._save_image(img, page_filename, target_ext, quality_settings)
            temp_files.append(page_filename)
        
        # 多页打包 ZIP
        if len(images) > 1:
            final_output = os.path.splitext(output_path)[0] + ".zip"
            with zipfile.ZipFile(final_output, 'w') as zf:
                for f in temp_files:
                    zf.write(f, os.path.basename(f))
                    os.remove(f)
            return final_output
        else:
            return output_path
    
    def _save_image(self, img, path, target_ext, quality_settings):
        """保存图片"""
        if target_ext in ['jpg', 'jpeg']:
            # JPEG 不支持透明通道
            if img.mode == 'RGBA':
                # 创建白色背景
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            img.save(path, 'JPEG', quality=quality_settings['quality'], optimize=True)
        elif target_ext == 'png':
            img.save(path, 'PNG', optimize=True)
        else:
            img.save(path, target_ext.upper())
