from .base import BaseConverter
from .docx_to_pdf import DocxToPdfConverter
from .pdf_to_image import PdfToImageConverter
from typing import Dict, Any
import os


class DocxToImageConverter(BaseConverter):
    """DOCX 到图片转换器（优化版 - 参考 conversion_core）
    
    优化内容：
    1. 添加进度回调（通过中间转换器传递）
    2. 更好的临时文件管理
    3. 支持质量设置
    """
    
    def __init__(self):
        super().__init__()
        self.supported_formats = ['png', 'jpg', 'jpeg']
        self.pdf_converter = DocxToPdfConverter()
        self.image_converter = PdfToImageConverter()

    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """将 DOCX 转换为图片（通过 PDF 中转）"""
        temp_pdf_path = None
        try:
            self.validate_input(input_path)
            self.update_progress(input_path, 5)

            base_dir = os.path.dirname(output_path) or os.getcwd()
            base_name = os.path.splitext(os.path.basename(output_path))[0]
            temp_pdf_path = os.path.join(base_dir, base_name + "_temp.pdf")

            # 步骤1: DOCX → PDF (5% ~ 50%)
            self.update_progress(input_path, 10)
            self.pdf_converter.convert(input_path, temp_pdf_path, **options)
            self.update_progress(input_path, 50)
            
            # 步骤2: PDF → Image (50% ~ 100%)
            result = self.image_converter.convert(temp_pdf_path, output_path, **options)
            result['method'] = 'docx_via_pdf'
            
            return result
            
        except Exception as e:
            self.cleanup_on_error(output_path)
            raise Exception(f"DOCX to Image conversion failed: {str(e)}")
        finally:
            # 清理临时 PDF
            if temp_pdf_path and os.path.exists(temp_pdf_path):
                try:
                    os.remove(temp_pdf_path)
                except Exception:
                    pass

