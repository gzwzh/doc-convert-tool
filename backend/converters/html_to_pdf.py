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
            # 为了尽量避免内容被截断,将高度调大一些
            self.hti.screenshot(
                html_str=html_content, 
                save_as=output_filename,
                size=(1280, 12000)
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
            
            skip_image = False
            if options.get('page_size') or options.get('orientation') or options.get('page_range') or options.get('watermark_text'):
                skip_image = True
            
            if not skip_image and self.convert_via_image(input_path, output_path):
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
            font_css = """
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
            raw_page_size = options.get('page_size') or 'A4'
            raw_orientation = options.get('orientation') or 'portrait'

            # Normalize orientation (Frontend may pass '纵向'/'横向')
            orientation = str(raw_orientation).strip()
            if orientation == '纵向':
                orientation = 'portrait'
            elif orientation == '横向':
                orientation = 'landscape'
            orientation = orientation.lower()

            # Map page size name to concrete width/height (in cm)
            size_key = str(raw_page_size).strip().upper()
            size_map = {
                'A4': (21.0, 29.7),
                'A3': (29.7, 42.0),
                'LETTER': (21.59, 27.94),
                'LEGAL': (21.59, 35.56),
            }
            width_cm, height_cm = size_map.get(size_key, size_map['A4'])

            # Apply orientation by swapping width/height for landscape
            if orientation == 'landscape':
                width_cm, height_cm = height_cm, width_cm

            page_css = f"@page {{ size: {width_cm}cm {height_cm}cm; margin: 1cm; }}"
            page_style = soup.new_tag('style')
            page_style.string = page_css
            if soup.head:
                soup.head.append(page_style)
            else:
                soup.append(page_style)

            watermark_text = options.get('watermark_text')
            if watermark_text:
                watermark_size = options.get('watermark_size', 40)
                watermark_color = options.get('watermark_color', '#cccccc')
                watermark_opacity = options.get('watermark_opacity', 30)
                watermark_angle = options.get('watermark_angle', 45)
                watermark_position = options.get('watermark_position', 'center')

                try:
                    watermark_size = int(watermark_size)
                except Exception:
                    watermark_size = 40

                try:
                    watermark_opacity = int(watermark_opacity)
                except Exception:
                    watermark_opacity = 30

                if watermark_opacity < 0:
                    watermark_opacity = 0
                if watermark_opacity > 100:
                    watermark_opacity = 100

                try:
                    watermark_angle = float(watermark_angle)
                except Exception:
                    watermark_angle = 45.0

                position_map = {
                    'top-left': ('20%', '20%'),
                    'top': ('15%', '50%'),
                    'top-right': ('20%', '80%'),
                    'left': ('50%', '15%'),
                    'center': ('50%', '50%'),
                    'right': ('50%', '85%'),
                    'bottom-left': ('80%', '20%'),
                    'bottom': ('85%', '50%'),
                    'bottom-right': ('80%', '80%'),
                }
                top, left = position_map.get(watermark_position, ('50%', '50%'))

                opacity_value = watermark_opacity / 100.0

                watermark_css = f"""
.pdf-watermark {{
    position: fixed;
    top: {top};
    left: {left};
    transform: translate(-50%, -50%) rotate({watermark_angle}deg);
    color: {watermark_color};
    font-size: {watermark_size}px;
    opacity: {opacity_value};
    pointer-events: none;
    white-space: nowrap;
    z-index: 9999;
}}
"""

                wm_style = soup.new_tag('style')
                wm_style.string = watermark_css
                if soup.head:
                    soup.head.append(wm_style)
                else:
                    soup.append(wm_style)

                if not soup.body:
                    body_tag = soup.new_tag('body')
                    soup.append(body_tag)
                    body = body_tag
                else:
                    body = soup.body

                watermark_div = soup.new_tag('div', attrs={'class': 'pdf-watermark'})
                watermark_div.string = watermark_text
                body.append(watermark_div)

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

            page_range = options.get('page_range')
            if page_range:
                self._apply_page_range(output_path, page_range)
            
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

    def _apply_page_range(self, output_path: str, page_range: str) -> None:
        try:
            import fitz
        except ImportError as e:
            raise Exception(f"PyMuPDF not installed: {e}")

        if not page_range:
            return

        doc = fitz.open(output_path)
        total_pages = len(doc)

        pages = []
        parts = [p.strip() for p in page_range.split(',') if p.strip()]
        for part in parts:
            if '-' in part:
                segment = part.split('-', 1)
                try:
                    start = int(segment[0])
                    end = int(segment[1])
                except Exception:
                    continue
                if start < 1:
                    start = 1
                if end > total_pages:
                    end = total_pages
                if start <= end:
                    pages.extend(range(start - 1, end))
            else:
                try:
                    num = int(part)
                except Exception:
                    continue
                if 1 <= num <= total_pages:
                    pages.append(num - 1)

        pages = sorted(set(pages))
        if not pages:
            doc.close()
            return

        new_doc = fitz.open()
        for pno in pages:
            new_doc.insert_pdf(doc, from_page=pno, to_page=pno)

        temp_path = output_path + ".tmp"
        new_doc.save(temp_path)
        new_doc.close()
        doc.close()

        os.replace(temp_path, output_path)
