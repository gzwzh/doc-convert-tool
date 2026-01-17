import os
import subprocess
import shutil
import html
from docx import Document
from .base import BaseConverter
from .html_to_pdf import HtmlToPdfConverter
from typing import Dict, Any


class DocxToPdfConverter(BaseConverter):
    """DOCX 到 PDF 转换器（优化版 - 参考 conversion_core）
    
    优化内容：
    1. 添加进度回调支持
    2. 多策略降级（Word → LibreOffice → HTML）
    3. 更详细的错误信息
    4. 支持页面设置选项
    """
    
    def __init__(self):
        super().__init__()
        self.supported_formats = ['pdf']
        self.html_converter = HtmlToPdfConverter()
        self.soffice_path = self._find_libreoffice()
    
    def _find_libreoffice(self) -> str:
        """查找 LibreOffice 路径"""
        paths = [
            r"C:\Program Files\LibreOffice\program\soffice.exe",
            r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        ]
        for path in paths:
            if os.path.exists(path):
                return path
        return shutil.which("soffice")
    
    def _has_word(self) -> bool:
        """检查是否有 Microsoft Word"""
        try:
            import win32com.client
            word = win32com.client.Dispatch("Word.Application")
            word.Quit()
            return True
        except:
            return False
    
    def _convert_with_word(self, input_path: str, output_path: str) -> Dict[str, Any]:
        """使用 Microsoft Word 转换"""
        from docx2pdf import convert
        convert(input_path, output_path)
        return {'method': 'microsoft_word'}
    
    def _convert_with_libreoffice(self, input_path: str, output_path: str) -> Dict[str, Any]:
        """使用 LibreOffice 转换"""
        output_dir = os.path.dirname(output_path) or os.getcwd()
        cmd = [self.soffice_path, '--headless', '--convert-to', 'pdf', '--outdir', output_dir, input_path]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            raise Exception(f"LibreOffice 转换失败: {result.stderr}")
        
        # 重命名输出文件
        input_basename = os.path.splitext(os.path.basename(input_path))[0]
        generated_pdf = os.path.join(output_dir, input_basename + '.pdf')
        if generated_pdf != output_path and os.path.exists(generated_pdf):
            if os.path.exists(output_path):
                os.remove(output_path)
            os.rename(generated_pdf, output_path)
        
        return {'method': 'libreoffice'}
    
    def _convert_with_html(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """使用 HTML 中转方式转换（兜底方案）"""
        doc = Document(input_path)
        lines = [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '<meta charset="utf-8">',
            '<style>',
            'html, body { background-color: #ffffff; color: #000000; margin: 20px; font-family: "Microsoft YaHei", "SimSun", sans-serif; }',
            'p { margin: 0.5em 0; line-height: 1.6; }',
            '</style>',
            '</head>',
            '<body>',
        ]
        
        for para in doc.paragraphs:
            text = html.escape(para.text or '')
            lines.append(f"<p>{text}</p>")
        
        lines.append('</body></html>')
        
        base_dir = os.path.dirname(output_path) or os.getcwd()
        base_name = os.path.splitext(os.path.basename(output_path))[0]
        temp_html_path = os.path.join(base_dir, base_name + "_temp.html")
        
        try:
            with open(temp_html_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(lines))
            self.html_converter.convert(temp_html_path, output_path, **options)
        finally:
            if os.path.exists(temp_html_path):
                os.remove(temp_html_path)
        
        return {'method': 'html_fallback'}

    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """将 DOCX 转换为 PDF（多策略降级）"""
        try:
            self.validate_input(input_path)
            self.update_progress(input_path, 5)
            
            result = {}
            errors = []
            
            # 策略1: Microsoft Word（效果最好，保留格式）
            if self._has_word():
                try:
                    self.update_progress(input_path, 10)
                    result = self._convert_with_word(input_path, output_path)
                    self.update_progress(input_path, 100)
                    
                    return {
                        'success': True,
                        'output_path': output_path,
                        'size': self.get_output_size(output_path),
                        **result
                    }
                except Exception as e1:
                    errors.append(f"Word: {str(e1)}")
                    print(f"[Word conversion failed] {e1}")
                    self.update_progress(input_path, 20)
            
            # 策略2: LibreOffice（开源方案）
            if self.soffice_path:
                try:
                    self.update_progress(input_path, 30)
                    result = self._convert_with_libreoffice(input_path, output_path)
                    self.update_progress(input_path, 100)
                    
                    return {
                        'success': True,
                        'output_path': output_path,
                        'size': self.get_output_size(output_path),
                        **result
                    }
                except Exception as e2:
                    errors.append(f"LibreOffice: {str(e2)}")
                    print(f"[LibreOffice conversion failed] {e2}")
                    self.update_progress(input_path, 50)
            
            # 策略3: HTML 中转（兜底方案，基础文本提取）
            try:
                self.update_progress(input_path, 60)
                result = self._convert_with_html(input_path, output_path, **options)
                self.update_progress(input_path, 100)
                
                result['warning'] = 'Used HTML fallback (basic text extraction only)'
                return {
                    'success': True,
                    'output_path': output_path,
                    'size': self.get_output_size(output_path),
                    **result
                }
            except Exception as e3:
                errors.append(f"HTML: {str(e3)}")
                print(f"[HTML conversion failed] {e3}")
            
            # 所有策略都失败
            error_msg = "All conversion methods failed: " + "; ".join(errors)
            raise Exception(error_msg)
            
        except Exception as e:
            self.cleanup_on_error(output_path)
            raise Exception(f"DOCX to PDF conversion failed: {str(e)}")
