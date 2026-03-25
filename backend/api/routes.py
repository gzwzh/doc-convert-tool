# backend/api/routes.py
import base64
import hashlib
import hmac
import json
import os
import time
import urllib.error
import urllib.request
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List
from backend.services.converter_service import ConverterService, UPLOAD_DIR
from backend.utils.file_handler import FileHandler
from backend.utils.validator import Validator
from backend.utils.diagnostics import run_all_diagnostics

router = APIRouter()
converter_service = ConverterService()
file_handler = FileHandler(UPLOAD_DIR)
validator = Validator()

AUTH_BASE_URL = "https://api-web.kunqiongai.com"
LOGIN_SECRET_KEY = os.environ.get("DESKTOP_LOGIN_SECRET_KEY", "7530bfb1ad6c41627b0f0620078fa5ed")


def _encode_signed_nonce(signed_nonce: dict) -> str:
    encoded = base64.urlsafe_b64encode(
        json.dumps(signed_nonce, separators=(",", ":")).encode("utf-8")
    ).decode("utf-8")
    return encoded.rstrip("=")


def _generate_signed_nonce() -> dict:
    nonce = uuid.uuid4().hex
    timestamp = int(time.time())
    message = f"{nonce}|{timestamp}".encode("utf-8")
    signature = base64.b64encode(
        hmac.new(LOGIN_SECRET_KEY.encode("utf-8"), message, hashlib.sha256).digest()
    ).decode("utf-8")
    return {
        "nonce": nonce,
        "timestamp": timestamp,
        "signature": signature,
    }


def _fetch_base_web_login_url() -> str:
    request = urllib.request.Request(
        f"{AUTH_BASE_URL}/soft_desktop/get_web_login_url",
        data=b"",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=10) as response:
        payload = json.loads(response.read().decode("utf-8"))

    if payload.get("code") == 1 and payload.get("data", {}).get("login_url"):
        return payload["data"]["login_url"]

    raise ValueError(payload.get("msg") or "Failed to fetch login URL")

@router.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "ok"}

@router.get("/diagnostics")
async def diagnostics():
    """诊断环境接口"""
    return run_all_diagnostics()


@router.post("/auth/login-url")
async def get_auth_login_url():
    try:
        signed_nonce = _generate_signed_nonce()
        encoded_nonce = _encode_signed_nonce(signed_nonce)
        base_login_url = _fetch_base_web_login_url()
        login_url = f"{base_login_url}?client_type=desktop&client_nonce={encoded_nonce}"
        return {"url": login_url, "encoded_nonce": encoded_nonce}
    except urllib.error.URLError as exc:
        raise HTTPException(status_code=502, detail=f"Upstream auth service unavailable: {exc}") from exc
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to build login URL: {exc}") from exc

@router.post("/convert/json")
async def convert_json(
    file: UploadFile = File(...),
    target_format: str = Form(...),
    indent: Optional[int] = Form(2),
    sort_keys: Optional[bool] = Form(False)
):
    """
    JSON 转换接口
    """
    input_path = None
    try:
        # 1. 验证目标格式
        allowed_targets = [tgt for src, tgt in converter_service.converters.keys() if src == 'json']
        target_format = validator.validate_target_format(target_format, allowed_targets)
        
        # 2. 保存上传文件
        input_path = await file_handler.save_upload_file(file)
        
        # 3. 准备转换选项
        options = {
            'indent': indent,
            'sort_keys': sort_keys
        }
        options = validator.validate_json_options(options)
        
        # 4. 执行转换
        result = converter_service.convert_file(
            input_path, 
            target_format, 
            original_filename=file.filename,
            **options
        )
        
        return result
        
    except ValueError as e:
        print(f"ValueError during conversion: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Unexpected error during conversion: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")
    finally:
        # 5. 清理临时上传文件
        if input_path:
            file_handler.cleanup_file(input_path)

@router.post("/convert/xml")
async def convert_xml(
    file: UploadFile = File(...),
    target_format: str = Form(...),
    indent: Optional[int] = Form(2),
    sort_keys: Optional[bool] = Form(False)
):
    """
    XML 转换接口
    """
    input_path = None
    try:
        # 1. 验证目标格式
        allowed_targets = [tgt for src, tgt in converter_service.converters.keys() if src == 'xml']
        target_format = validator.validate_target_format(target_format, allowed_targets)
        
        # 2. 保存上传文件
        input_path = await file_handler.save_upload_file(file)
        
        # 3. 准备转换选项
        options = {
            'indent': indent,
            'sort_keys': sort_keys
        }
        # 复用 JSON 的选项验证逻辑，因为参数相似
        options = validator.validate_json_options(options)
        
        # 4. 执行转换
        result = converter_service.convert_file(
            input_path, 
            target_format, 
            original_filename=file.filename,
            **options
        )
        
        return result
        
    except ValueError as e:
        print(f"ValueError during conversion: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Unexpected error during conversion: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")
    finally:
        # 5. 清理临时上传文件
        if input_path:
            file_handler.cleanup_file(input_path)

@router.post("/convert/general")
async def convert_general(
    file: UploadFile = File(...),
    target_format: str = Form(...),
    # 通用选项
    encoding: Optional[str] = Form('utf-8'),
    # HTML 选项
    enable_preview: Optional[bool] = Form(False),
    code_mode: Optional[bool] = Form(False),  # 新增：代码模式
    css_handling: Optional[str] = Form(None),
    compress_css: Optional[bool] = Form(False),
    custom_css: Optional[str] = Form(None),
    remove_scripts: Optional[bool] = Form(False),
    remove_comments: Optional[bool] = Form(False),
    compress_html: Optional[bool] = Form(False),
    remove_empty_tags: Optional[bool] = Form(False),
    page_size: Optional[str] = Form(None),
    orientation: Optional[str] = Form(None),
    # 图片选项
    quality: Optional[int] = Form(85),
    background_color: Optional[str] = Form('#ffffff'),
    # 水印选项
    watermark_text: Optional[str] = Form(''),
    watermark_opacity: Optional[int] = Form(30),
    watermark_size: Optional[int] = Form(40),
    watermark_color: Optional[str] = Form('#cccccc'),
    watermark_angle: Optional[int] = Form(45),
    watermark_position: Optional[str] = Form('center'),
    # CSV 选项
    csv_delimiter: Optional[str] = Form(None),
    # PDF 页面选择
    pdf_page_selection: Optional[str] = Form(None),
    pdf_page_range: Optional[str] = Form(None),
    # GIF 动画选项
    animation_delay: Optional[int] = Form(100),
    loop_animation: Optional[bool] = Form(True)
):
    """
    通用转换接口 (DOCX, HTML, PDF, TXT)
    """
    print(f"\n{'='*60}")
    print(f"[API] 收到转换请求")
    print(f"[API] 文件名: {file.filename}")
    print(f"[API] 目标格式: {target_format}")
    print(f"{'='*60}\n")
    
    input_path = None
    try:
        # 1. 获取源格式
        filename = file.filename
        if not filename:
            raise ValueError("Filename is missing")
        source_format = filename.split('.')[-1].lower()
        print(f"[API] 源格式: {source_format}")
        
        # 2. 验证目标格式
        allowed_targets = [tgt for src, tgt in converter_service.converters.keys() if src == source_format]
        if not allowed_targets:
            raise ValueError(f"Unsupported source format: {source_format}")
            
        target_format = validator.validate_target_format(target_format, allowed_targets)
        print(f"[API] 验证目标格式成功: {target_format}")
        
        # 3. 保存上传文件
        print("[API] 开始保存上传文件...")
        input_path = await file_handler.save_upload_file(file)
        print(f"[API] 文件已保存: {input_path}")
        
        # 4. 准备转换选项
        options = {
            'encoding': encoding,
            'enable_preview': enable_preview,
            'code_mode': code_mode,  # 新增
            'css_handling': css_handling,
            'compress_css': compress_css,
            'custom_css': custom_css,
            'remove_scripts': remove_scripts,
            'remove_comments': remove_comments,
            'compress_html': compress_html,
            'remove_empty_tags': remove_empty_tags,
            'page_size': page_size,
            'orientation': orientation,
            'quality': quality,
            'background_color': background_color,
            'watermark_text': watermark_text,
            'watermark_opacity': watermark_opacity,
            'watermark_size': watermark_size,
            'watermark_color': watermark_color,
            'watermark_angle': watermark_angle,
            'watermark_position': watermark_position,
            'csv_delimiter': csv_delimiter,
            'pdf_page_selection': pdf_page_selection,
            'pdf_page_range': pdf_page_range,
            'animation_delay': animation_delay,
            'loop_animation': loop_animation
        }
        
        # 5. 执行转换
        print(f"[API] 调用 converter_service.convert_file...")
        result = converter_service.convert_file(
            input_path, 
            target_format, 
            original_filename=file.filename,
            **options
        )
        print(f"[API] 转换完成，结果: {result}")
        
        return result
        
    except ValueError as e:
        print(f"[API] ValueError during conversion: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        import traceback
        traceback_str = traceback.format_exc()
        # 使用 logger 记录错误堆栈，确保写入日志文件
        from backend.utils.logger import logger
        logger.error(f"[API] Unexpected error during conversion: {e}\n{traceback_str}")
        print(f"[API] Unexpected error during conversion: {e}")
        print(traceback_str)
        # 返回详细的错误信息，方便调试
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}\nTraceback: {traceback_str}")
    finally:
        # 6. 清理临时上传文件
        if input_path:
            file_handler.cleanup_file(input_path)


@router.get("/health")
async def health_check():
    return {"status": "healthy", "supported_conversions": converter_service.get_supported_conversions()}
