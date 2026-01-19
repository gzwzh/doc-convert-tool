import os
import uuid
from typing import Dict, Any, List
from backend.converters.json_to_yaml import JsonToYamlConverter
from backend.converters.json_to_xml import JsonToXmlConverter
from backend.converters.xml_to_json import XmlToJsonConverter
from backend.converters.xml_to_yaml import XmlToYamlConverter
from backend.converters.docx_to_txt import DocxToTxtConverter
from backend.converters.docx_to_pdf import DocxToPdfConverter
from backend.converters.docx_to_image import DocxToImageConverter
from backend.converters.docx_to_epub import DocxToEpubConverter
from backend.converters.html_to_pdf import HtmlToPdfConverter
from backend.converters.html_to_txt import HtmlToTxtConverter
from backend.converters.html_to_markdown import HtmlToMarkdownConverter
from backend.converters.html_to_image import HtmlToImageConverter
from backend.converters.html_to_docx import HtmlToDocxConverter
from backend.converters.html_to_json import HtmlToJsonConverter
from backend.converters.html_to_gif import HtmlToGifConverter
from backend.converters.html_to_svg import HtmlToSvgConverter
from backend.converters.pdf_to_txt import PdfToTxtConverter
from backend.converters.pdf_to_json import PdfToJsonConverter
from backend.converters.pdf_to_base64 import PdfToBase64Converter
from backend.converters.pdf_to_md import PdfToMdConverter
from backend.converters.pdf_to_svg import PdfToSvgConverter
from backend.converters.pdf_to_epub import PdfToEpubConverter
from backend.converters.pdf_to_gif import PdfToGifConverter
from backend.converters.pdf_to_webp import PdfToWebpConverter
from backend.converters.txt_to_pdf import TxtToPdfConverter
from backend.converters.txt_to_image import TxtToImageConverter
from backend.converters.txt_to_speech import TxtToSpeechConverter
from backend.converters.txt_to_ascii import TxtToAsciiConverter
from backend.converters.txt_to_binary import TxtToBinaryConverter
from backend.converters.txt_to_csv import TxtToCsvConverter
from backend.converters.txt_to_hex import TxtToHexConverter
from backend.converters.pdf_to_docx import PdfToDocxConverter
from backend.converters.json_to_csv import JsonToCsvConverter
from backend.converters.json_to_pdf import JsonToPdfConverter
from backend.converters.json_to_base64 import JsonToBase64Converter
from backend.converters.xml_to_csv import XmlToCsvConverter
from backend.converters.xml_to_txt import XmlToTxtConverter
from backend.converters.xml_to_pdf import XmlToPdfConverter
from backend.converters.xml_to_xlsx import XmlToXlsxConverter
from backend.converters.txt_to_html import TxtToHtmlConverter
from backend.converters.pdf_to_html import PdfToHtmlConverter
from backend.converters.pdf_to_image import PdfToImageConverter
from backend.converters.pdf_to_ppt import PdfToPptConverter
from backend.converters.json_to_html import JsonToHtmlConverter
from backend.converters.xml_to_html import XmlToHtmlConverter
from backend.converters.json_to_image import JsonToImageConverter
from backend.converters.json_to_svg import JsonToSvgConverter
from backend.converters.xml_to_image import XmlToImageConverter
from backend.converters.xml_to_svg import XmlToSvgConverter
from backend.converters.pdf_to_rtf import PdfToRtfConverter
from backend.converters.pdf_to_psd import PdfToPsdConverter

# 配置常量（后续可移至 config.py）
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))
DOWNLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "downloads"))

# 确保目录存在
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

class ConverterService:
    """转换服务编排层"""
    
    def __init__(self):
        # 注册所有转换器
        # key: (source_format, target_format)
        self.converters = {
            # JSON 转换
            ('json', 'yaml'): JsonToYamlConverter(),
            ('json', 'yml'): JsonToYamlConverter(),
            ('json', 'xml'): JsonToXmlConverter(),
            ('json', 'csv'): JsonToCsvConverter(),
            ('json', 'html'): JsonToHtmlConverter(),
            ('json', 'pdf'): JsonToPdfConverter(),
            ('json', 'base64'): JsonToBase64Converter(),
            ('json', 'png'): JsonToImageConverter(),
            ('json', 'jpg'): JsonToImageConverter(),
            ('json', 'jpeg'): JsonToImageConverter(),
            ('json', 'svg'): JsonToSvgConverter(),
            # XML 转换
            ('xml', 'json'): XmlToJsonConverter(),
            ('xml', 'yaml'): XmlToYamlConverter(),
            ('xml', 'yml'): XmlToYamlConverter(),
            ('xml', 'csv'): XmlToCsvConverter(),
            ('xml', 'html'): XmlToHtmlConverter(),
            ('xml', 'txt'): XmlToTxtConverter(),
            ('xml', 'pdf'): XmlToPdfConverter(),
            ('xml', 'xlsx'): XmlToXlsxConverter(),
            ('xml', 'png'): XmlToImageConverter(),
            ('xml', 'jpg'): XmlToImageConverter(),
            ('xml', 'jpeg'): XmlToImageConverter(),
            ('xml', 'svg'): XmlToSvgConverter(),
            # DOCX 转换
            ('docx', 'txt'): DocxToTxtConverter(),
            ('docx', 'pdf'): DocxToPdfConverter(),
            ('docx', 'png'): DocxToImageConverter(),
            ('docx', 'jpg'): DocxToImageConverter(),
            ('docx', 'jpeg'): DocxToImageConverter(),
            ('docx', 'epub'): DocxToEpubConverter(),
            # HTML 转换
            ('html', 'pdf'): HtmlToPdfConverter(),
            ('html', 'txt'): HtmlToTxtConverter(),
            ('html', 'text'): HtmlToTxtConverter(),
            ('html', 'md'): HtmlToMarkdownConverter(),
            ('html', 'markdown'): HtmlToMarkdownConverter(),
            ('html', 'png'): HtmlToImageConverter(),
            ('html', 'jpg'): HtmlToImageConverter(),
            ('html', 'jpeg'): HtmlToImageConverter(),
            ('html', 'docx'): HtmlToDocxConverter(),
            ('html', 'doc'): HtmlToDocxConverter(),
            ('html', 'json'): HtmlToJsonConverter(),
            ('html', 'gif'): HtmlToGifConverter(),
            ('html', 'svg'): HtmlToSvgConverter(),
            # PDF 转换
            ('pdf', 'txt'): PdfToTxtConverter(),
            ('pdf', 'docx'): PdfToDocxConverter(),
            ('pdf', 'doc'): PdfToDocxConverter(),
            ('pdf', 'html'): PdfToHtmlConverter(),
            ('pdf', 'png'): PdfToImageConverter(),
            ('pdf', 'jpg'): PdfToImageConverter(),
            ('pdf', 'jpeg'): PdfToImageConverter(),
            ('pdf', 'bmp'): PdfToImageConverter(),
            ('pdf', 'tiff'): PdfToImageConverter(),
            ('pdf', 'json'): PdfToJsonConverter(),
            ('pdf', 'base64'): PdfToBase64Converter(),
            ('pdf', 'md'): PdfToMdConverter(),
            ('pdf', 'svg'): PdfToSvgConverter(),
            ('pdf', 'epub'): PdfToEpubConverter(),
            ('pdf', 'gif'): PdfToGifConverter(),
            ('pdf', 'webp'): PdfToWebpConverter(),
            ('pdf', 'pptx'): PdfToPptConverter(),
            ('pdf', 'ppt'): PdfToPptConverter(),
            ('pdf', 'rtf'): PdfToRtfConverter(),
            ('pdf', 'psd'): PdfToPsdConverter(),
            # TXT 转换
            ('txt', 'pdf'): TxtToPdfConverter(),
            ('txt', 'html'): TxtToHtmlConverter(),
            ('txt', 'png'): TxtToImageConverter(),
            ('txt', 'jpg'): TxtToImageConverter(),
            ('txt', 'jpeg'): TxtToImageConverter(),
            ('txt', 'mp3'): TxtToSpeechConverter(),
            ('txt', 'wav'): TxtToSpeechConverter(),
            ('txt', 'ascii'): TxtToAsciiConverter(),
            ('txt', 'binary'): TxtToBinaryConverter(),
            ('txt', 'bin'): TxtToBinaryConverter(),
            ('txt', 'csv'): TxtToCsvConverter(),
            ('txt', 'hex'): TxtToHexConverter(),
        }
    
    def convert_file(self, input_path: str, target_format: str, **options) -> Dict[str, Any]:
        """
        统一转换入口
        """
        source_format = input_path.split('.')[-1].lower()
        target_format = target_format.lower()
        
        converter_key = (source_format, target_format)
        if converter_key not in self.converters:
            raise ValueError(f"Unsupported conversion: {source_format} to {target_format}")
        
        # 生成输出路径
        unique_id = str(uuid.uuid4())
        output_filename = f"{unique_id}.{target_format}"
        output_path = os.path.join(DOWNLOAD_DIR, output_filename)
        
        # 调用具体转换器
        converter = self.converters[converter_key]
        result = converter.convert(input_path, output_path, **options)
        
        # 补充返回信息
        print(f"[ConverterService] Output path: {output_path}")
        print(f"[ConverterService] Output file exists: {os.path.exists(output_path)}")
        result.update({
            'filename': output_filename,
            'download_url': f"/downloads/{output_filename}"
        })
        
        return result

    def get_supported_conversions(self) -> List[Dict[str, str]]:
        """获取支持的转换列表"""
        return [
            {'source': src, 'target': tgt} 
            for src, tgt in self.converters.keys()
        ]
