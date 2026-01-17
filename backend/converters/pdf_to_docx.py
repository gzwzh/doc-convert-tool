from pdf2docx import Converter
from .base import BaseConverter
from typing import Dict, Any
import os

class PdfToDocxConverter(BaseConverter):
    """PDF 到 DOCX 转换器（优化版 - 参考 conversion_core）
    
    优化内容：
    1. 添加进度回调支持
    2. 添加多策略降级（pdf2docx → PyMuPDF）
    3. 添加页码范围选择
    4. 添加图片提取选项
    5. 更详细的错误处理
    """
    
    def __init__(self):
        super().__init__()
        self.supported_formats = ['docx', 'doc']
    
    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """将 PDF 转换为 DOCX（多策略）"""
        try:
            self.validate_input(input_path)
            self.update_progress(input_path, 5)
            
            # 确保输出目录存在
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # 获取选项
            extract_images = options.get('extract_images', True)
            page_range = options.get('page_range', None)  # 例如: "1-5,8,10-12"
            
            self.update_progress(input_path, 10)
            
            # 策略1: 使用 pdf2docx（推荐，效果最好）
            try:
                result = self._convert_with_pdf2docx(
                    input_path, output_path, 
                    extract_images=extract_images,
                    page_range=page_range
                )
                self.update_progress(input_path, 100)
                return result
            except Exception as e1:
                print(f"[pdf2docx failed] {e1}, trying PyMuPDF fallback...")
                self.update_progress(input_path, 30)
                
                # 策略2: 使用 PyMuPDF 降级方案
                try:
                    result = self._convert_with_pymupdf(
                        input_path, output_path,
                        extract_images=extract_images
                    )
                    self.update_progress(input_path, 100)
                    result['method'] = 'pymupdf_fallback'
                    result['warning'] = 'pdf2docx failed, used PyMuPDF fallback (basic text extraction)'
                    return result
                except Exception as e2:
                    raise Exception(f"All conversion methods failed. pdf2docx: {str(e1)}, PyMuPDF: {str(e2)}")
            
        except Exception as e:
            self.cleanup_on_error(output_path)
            raise Exception(f"PDF to DOCX conversion failed: {str(e)}")
    
    def _convert_with_pdf2docx(self, input_path: str, output_path: str, 
                               extract_images: bool = True, 
                               page_range: str = None) -> Dict[str, Any]:
        """使用 pdf2docx 转换（主策略）"""
        cv = Converter(input_path)
        
        # 解析页码范围
        start_page = 0
        end_page = None
        
        if page_range:
            # 简单解析，例如 "1-5" -> start=0, end=5
            try:
                if '-' in page_range:
                    parts = page_range.split('-')
                    start_page = int(parts[0]) - 1  # 转为0-based
                    end_page = int(parts[1])
            except:
                print(f"[Warning] Invalid page_range: {page_range}, using all pages")
        
        self.update_progress(input_path, 20)
        
        # 转换
        cv.convert(output_path, start=start_page, end=end_page)
        cv.close()
        
        self.update_progress(input_path, 90)
        
        return {
            'success': True,
            'output_path': output_path,
            'size': self.get_output_size(output_path),
            'method': 'pdf2docx'
        }
    
    def _convert_with_pymupdf(self, input_path: str, output_path: str,
                              extract_images: bool = True) -> Dict[str, Any]:
        """使用 PyMuPDF 降级方案（基础文本提取）"""
        try:
            import fitz  # PyMuPDF
            from docx import Document
            from docx.shared import Pt, Inches
            from io import BytesIO
        except ImportError as e:
            raise Exception(f"PyMuPDF or python-docx not installed: {e}")
        
        doc_pdf = fitz.open(input_path)
        doc_word = Document()
        
        total_pages = len(doc_pdf)
        self.update_progress(input_path, 40)
        
        for page_num in range(total_pages):
            page = doc_pdf[page_num]
            
            # 提取文本
            text = page.get_text("text")
            if text.strip():
                doc_word.add_paragraph(text)
            
            # 提取图片（如果启用）
            if extract_images:
                image_list = page.get_images(full=True)
                for img_index, img in enumerate(image_list):
                    try:
                        xref = img[0]
                        base_image = doc_pdf.extract_image(xref)
                        if base_image:
                            image_bytes = base_image["image"]
                            img_stream = BytesIO(image_bytes)
                            
                            para = doc_word.add_paragraph()
                            run = para.add_run()
                            run.add_picture(img_stream, width=Inches(4))
                    except Exception as e:
                        print(f"[Image extraction failed] Page {page_num+1}, Image {img_index+1}: {e}")
            
            # 更新进度
            progress = 40 + int(((page_num + 1) / total_pages) * 50)
            self.update_progress(input_path, progress)
            
            # 添加分页符
            if page_num < total_pages - 1:
                doc_word.add_page_break()
        
        doc_pdf.close()
        doc_word.save(output_path)
        
        return {
            'success': True,
            'output_path': output_path,
            'size': self.get_output_size(output_path)
        }
