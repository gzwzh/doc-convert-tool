from xhtml2pdf import pisa
from bs4 import BeautifulSoup, Comment
from .base import BaseConverter
from typing import Dict, Any
import os
import logging
from html2image import Html2Image
from PIL import Image
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HtmlToPdfConverter(BaseConverter):
    """HTML 到 PDF 转换器（优化版 - 参考 conversion_core）
    
    优化内容：
    1. 添加进度回调
    2. 多策略降级（浏览器截图 → xhtml2pdf）
    3. 支持丰富的页面设置选项
    4. 更好的中文字体支持
    """
    
    def __init__(self):
        super().__init__()
        self.supported_formats = ['pdf']
        
        # Initialize Html2Image
        try:
            # Auto-detect Edge on Windows
            edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
            if not os.path.exists(edge_path):
                 edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
            
            if os.path.exists(edge_path):
                logger.info(f"Using Edge browser at {edge_path}")
                self.hti = Html2Image(browser_executable=edge_path)
            else:
                logger.warning("Edge browser not found, trying default Chrome...")
                self.hti = Html2Image()
                
        except Exception as e:
            logger.warning(f"Failed to initialize Html2Image: {e}")
            self.hti = None

        # Register Fonts for xhtml2pdf Fallback
        try:
            # Register Microsoft YaHei
            # Note: msyh.ttc is a collection. subfontIndex=0 is usually the regular weight.
            if os.path.exists(r"C:\Windows\Fonts\msyh.ttc"):
                pdfmetrics.registerFont(TTFont('Microsoft YaHei', r"C:\Windows\Fonts\msyh.ttc", subfontIndex=0))
                logger.info("Registered font: Microsoft YaHei")
            elif os.path.exists(r"C:\Windows\Fonts\simsun.ttc"):
                 pdfmetrics.registerFont(TTFont('SimSun', r"C:\Windows\Fonts\simsun.ttc", subfontIndex=0))
                 logger.info("Registered font: SimSun")
        except Exception as e:
            logger.warning(f"Failed to register fonts: {e}")
    
    def convert_via_image(self, input_path: str, output_path: str) -> bool:
        """
        Convert HTML to PDF via Screenshot (HTML -> Image -> PDF)
        Returns True if successful, False otherwise.
        """
        if not self.hti:
            logger.warning("Html2Image not initialized, skipping image conversion.")
            return False

        try:
            self.update_progress(input_path, 10)
            
            temp_img = output_path + ".png"
            output_dir = os.path.dirname(output_path)
            output_filename = os.path.basename(temp_img)
            
            # Update output path for this conversion
            self.hti.output_path = output_dir
            
            logger.info(f"Attempting image conversion for {input_path}...")
            
            self.update_progress(input_path, 20)
            
            # Read HTML and inject white background if not present
            with open(input_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # Inject white background CSS to prevent black background issue
            bg_css = '<style>html, body { background-color: #ffffff !important; }</style>'
            if '<head>' in html_content:
                html_content = html_content.replace('<head>', f'<head>{bg_css}')
            elif '<html>' in html_content:
                html_content = html_content.replace('<html>', f'<html><head>{bg_css}</head>')
            else:
                html_content = f'<html><head>{bg_css}</head><body>{html_content}</body></html>'
            
            self.update_progress(input_path, 30)
            
            # Screenshot using html_str instead of html_file to use modified content
            # Note: html2image screenshot saves to self.output_path / save_as
            self.hti.screenshot(
                html_str=html_content, 
                save_as=output_filename,
                size=(1280, 5000) 
            )
            
            full_temp_img_path = os.path.join(output_dir, output_filename)
            
            self.update_progress(input_path, 60)
            
            if os.path.exists(full_temp_img_path):
                # Convert Image to PDF
                image = Image.open(full_temp_img_path)
                rgb_image = image.convert('RGB')
                rgb_image.save(output_path, "PDF", resolution=100.0)
                image.close() # Close file handle
                
                self.update_progress(input_path, 80)
                
                # Cleanup
                try:
                    os.remove(full_temp_img_path)
                except Exception as cleanup_err:
                    logger.warning(f"Failed to remove temp image: {cleanup_err}")
                    
                return True
            else:
                logger.error(f"Screenshot file not found at {full_temp_img_path}")
                return False
                
        except Exception as e:
            logger.error(f"Image conversion failed with error: {e}")
            return False

    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """将 HTML 转换为 PDF（多策略）"""
        try:
            self.validate_input(input_path)
            self.update_progress(input_path, 5)
            
            # 策略1: 浏览器截图转换（效果最好，支持复杂样式）
            if self.convert_via_image(input_path, output_path):
                 return {
                    'success': True,
                    'output_path': output_path,
                    'size': self.get_output_size(output_path),
                    'method': 'browser_screenshot'
                }
            
            logger.info("Falling back to xhtml2pdf conversion...")
            self.update_progress(input_path, 30)
            
            # 策略2: xhtml2pdf 降级方案
            with open(input_path, "r", encoding='utf-8') as source_file:
                source_html = source_file.read()

            soup = BeautifulSoup(source_html, 'html.parser')

            self.update_progress(input_path, 40)

            # --- Font Handling (Inject CSS for Registered Font) ---
            # We use the font we registered in __init__
            font_css = """
                @font-face {
                    font-family: 'Microsoft YaHei';
                    src: url('C:/Windows/Fonts/msyh.ttc');
                }
                body, div, p, span, h1, h2, h3, h4, h5, h6, table, li {
                    font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
                }
            """
            font_style = soup.new_tag('style')
            font_style.string = font_css
            
            if soup.head:
                soup.head.insert(0, font_style)
            else:
                 if not soup.html:
                    soup.append(soup.new_tag('html'))
                 if not soup.head:
                    if soup.html: soup.html.insert(0, soup.new_tag('head'))
                    else: soup.append(soup.new_tag('head'))
                 soup.head.insert(0, font_style)

            self.update_progress(input_path, 50)

            # 1. Cleanup Options
            if options.get('remove_scripts', False):
                for script in soup(["script", "noscript"]):
                    script.decompose()
            
            if options.get('remove_comments', False):
                for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
                    comment.extract()

            if options.get('remove_empty_tags', False):
                for tag in soup.find_all():
                    if len(tag.get_text(strip=True)) == 0 and len(tag.find_all()) == 0 and not tag.attrs:
                        # Skip void elements like br, img, hr, input, meta, link
                        if tag.name not in ['br', 'img', 'hr', 'input', 'meta', 'link']:
                            tag.decompose()

            self.update_progress(input_path, 60)

            # 2. CSS Handling
            css_handling = options.get('css_handling')
            if css_handling == '移除 CSS':
                for style in soup(["style"]):
                    style.decompose()
                for link in soup.find_all("link", rel="stylesheet"):
                    link.decompose()
                # Remove inline styles
                for tag in soup.find_all(True):
                    if tag.has_attr('style'):
                        del tag['style']
            
            # 3. Custom CSS
            custom_css = options.get('custom_css')
            if custom_css:
                new_style = soup.new_tag('style')
                new_style.string = custom_css
                if soup.head:
                    soup.head.append(new_style)
                else:
                    soup.append(new_style)

            self.update_progress(input_path, 70)

            # 4. Page Settings (Inject @page CSS)
            page_size = options.get('page_size', 'A4')
            orientation = options.get('orientation', 'portrait') # '纵向' -> portrait, '横向' -> landscape?
            
            # Map Chinese to English if necessary (Frontend passes '纵向'/'横向')
            if orientation == '纵向':
                orientation = 'portrait'
            elif orientation == '横向':
                orientation = 'landscape'
            
            page_css = f"@page {{ size: {page_size} {orientation}; margin: 1cm; }}"
            page_style = soup.new_tag('style')
            page_style.string = page_css
            if soup.head:
                soup.head.append(page_style)
            else:
                soup.append(page_style)

            # Convert back to string
            final_html = str(soup)
            
            self.update_progress(input_path, 80)
            
            with open(output_path, "wb") as output_file:
                pisa_status = pisa.CreatePDF(
                    final_html,
                    dest=output_file,
                    encoding='utf-8'
                )
            
            if pisa_status.err:
                raise Exception(f"PDF generation error: {pisa_status.err}")
            
            self.update_progress(input_path, 100)
            
            return {
                'success': True,
                'output_path': output_path,
                'size': self.get_output_size(output_path),
                'method': 'xhtml2pdf'
            }
            
        except Exception as e:
            self.cleanup_on_error(output_path)
            raise Exception(f"HTML to PDF conversion failed: {str(e)}")
