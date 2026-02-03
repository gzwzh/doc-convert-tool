import os
import shutil
import tempfile
from typing import Dict, Any
from .base import BaseConverter
from .excel_to_pdf import ExcelToPdfConverter
from .pdf_to_image import PdfToImageConverter

class ExcelToImageConverter(BaseConverter):
    """Excel 转图片转换器 (通过 PDF 中转)"""
    
    def __init__(self):
        super().__init__()
        self.excel_to_pdf = ExcelToPdfConverter()
        self.pdf_to_image = PdfToImageConverter()
        
    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        self.validate_input(input_path)
        self.update_progress(input_path, 5)
        
        # 创建临时 PDF 文件路径
        temp_dir = tempfile.gettempdir()
        temp_pdf = os.path.join(temp_dir, f"{os.path.splitext(os.path.basename(input_path))[0]}_temp.pdf")
        
        try:
            # 1. Excel -> PDF
            print(f"[ExcelToImage] Converting Excel to PDF: {temp_pdf}")
            
            # 设置 Excel 转 PDF 的进度回调
            def excel_progress(path, progress):
                # 映射 5% - 50%
                final_progress = 5 + int(progress * 0.45)
                self.update_progress(input_path, final_progress)
                
            self.excel_to_pdf.progress_callback = excel_progress
            
            pdf_result = self.excel_to_pdf.convert(input_path, temp_pdf)
            
            if not pdf_result.get('success'):
                raise Exception(f"Excel to PDF conversion failed: {pdf_result.get('error')}")
                
            self.update_progress(input_path, 50)
            
            # 2. PDF -> Image
            print(f"[ExcelToImage] Converting PDF to Image: {output_path}")
            
            # 设置 PDF 转 Image 的进度回调
            def img_progress(path, progress):
                # 映射 50% - 100%
                final_progress = 50 + int(progress * 0.5)
                self.update_progress(input_path, final_progress)
            
            self.pdf_to_image.progress_callback = img_progress
            
            # 传递选项（如 quality, merge, watermark 等）
            img_result = self.pdf_to_image.convert(temp_pdf, output_path, **options)
            
            return img_result
            
        finally:
            # 清理临时 PDF
            if os.path.exists(temp_pdf):
                try:
                    os.remove(temp_pdf)
                except:
                    pass
