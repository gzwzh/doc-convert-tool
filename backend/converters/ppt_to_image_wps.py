"""
PPT转图片转换器 - 使用WPS直接导出
支持PNG和JPG格式
"""

import os
import time
import shutil
import zipfile
from typing import Dict, Any
from .base import BaseConverter


class PptToImageWpsConverter(BaseConverter):
    """PPT转图片转换器（使用WPS）"""
    
    def __init__(self):
        super().__init__()
        self.office_type = self._detect_office()
        
    def _detect_office(self) -> str:
        """检测可用的Office软件"""
        try:
            import win32com.client
            import pythoncom
            
            pythoncom.CoInitialize()
            
            # 1. 优先尝试PowerPoint
            try:
                ppt_app = win32com.client.Dispatch("PowerPoint.Application")
                version = ppt_app.Version
                ppt_app.Quit()
                pythoncom.CoUninitialize()
                print(f"[PptToImageWps] 检测到 Microsoft PowerPoint {version}")
                return "PowerPoint"
            except:
                pass
            
            # 2. 尝试WPS
            for app_name in ['KWPP.Application', 'WPP.Application']:
                try:
                    wps_app = win32com.client.Dispatch(app_name)
                    wps_app.Quit()
                    pythoncom.CoUninitialize()
                    print(f"[PptToImageWps] 检测到 WPS Office ({app_name})")
                    return app_name
                except:
                    continue
            
            pythoncom.CoUninitialize()
            
        except ImportError:
            pass
        
        return None
    
    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        """转换PPT为图片"""
        
        print(f"[PptToImageWps] 开始转换: {input_path}")
        print(f"[PptToImageWps] 使用: {self.office_type or '未检测到Office软件'}")
        
        self.validate_input(input_path)
        self.update_progress(input_path, 5)
        
        if not self.office_type:
            raise Exception("未检测到PowerPoint或WPS。请安装其中之一")
        
        try:
            import win32com.client
            import pythoncom
        except ImportError:
            raise Exception("pywin32未安装")
        
        # 获取目标格式
        target_format = os.path.splitext(output_path)[1].lower()[1:]  # 去掉点号
        if target_format not in ['png', 'jpg', 'jpeg']:
            target_format = 'png'
        
        # 标准化格式名称
        if target_format == 'jpeg':
            target_format = 'jpg'
        
        format_upper = target_format.upper()
        
        print(f"[PptToImageWps] 目标格式: {format_upper}")
        
        # 导出图片
        image_files = []
        last_error = None
        
        try:
            if self.office_type == "PowerPoint":
                print(f"[PptToImageWps] 尝试使用 PowerPoint...")
                image_files = self._ppt_to_images_powerpoint(input_path, format_upper)
            else:
                print(f"[PptToImageWps] 尝试使用 WPS...")
                image_files = self._ppt_to_images_wps(input_path, format_upper)
        except Exception as e:
            last_error = e
            print(f"[PptToImageWps] {self.office_type} 失败: {e}")
            
            # 如果PowerPoint失败，尝试WPS
            if self.office_type == "PowerPoint":
                print(f"[PptToImageWps] 回退到 WPS...")
                try:
                    # 重新检测WPS
                    pythoncom.CoInitialize()
                    for app_name in ['KWPP.Application', 'WPP.Application']:
                        try:
                            test_app = win32com.client.Dispatch(app_name)
                            test_app.Quit()
                            self.office_type = app_name
                            print(f"[PptToImageWps] 找到 WPS: {app_name}")
                            break
                        except:
                            continue
                    pythoncom.CoUninitialize()
                    
                    if self.office_type in ['KWPP.Application', 'WPP.Application']:
                        image_files = self._ppt_to_images_wps(input_path, format_upper)
                except Exception as e2:
                    print(f"[PptToImageWps] WPS 也失败: {e2}")
                    raise Exception(f"PowerPoint和WPS都无法转换: PowerPoint错误={last_error}, WPS错误={e2}")
        
        if not image_files:
            raise Exception(f"未能生成图片。最后错误: {last_error}")
        
        print(f"[PptToImageWps] 生成了 {len(image_files)} 张图片")
        self.update_progress(input_path, 80)
        
        # 如果只有一张图片，直接返回
        if len(image_files) == 1:
            shutil.move(image_files[0], output_path)
            self.update_progress(input_path, 100)
            
            return {
                'success': True,
                'output_path': output_path,
                'size': os.path.getsize(output_path),
                'pages': 1,
                'converter': self.office_type
            }
        
        # 多张图片，打包成ZIP
        zip_path = output_path.replace(f'.{target_format}', '.zip')
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for img_file in image_files:
                zipf.write(img_file, os.path.basename(img_file))
        
        # 清理临时图片
        for img_file in image_files:
            try:
                os.remove(img_file)
            except:
                pass
        
        self.update_progress(input_path, 100)
        print(f"[PptToImageWps] 转换完成: {zip_path}")
        
        return {
            'success': True,
            'output_path': zip_path,
            'size': os.path.getsize(zip_path),
            'pages': len(image_files),
            'converter': self.office_type
        }
    
    def _ppt_to_images_powerpoint(self, ppt_path: str, format_type: str) -> list:
        """使用PowerPoint导出图片"""
        
        import win32com.client
        import pythoncom
        
        pythoncom.CoInitialize()
        ppt_app = None
        presentation = None
        
        try:
            abs_path = os.path.abspath(ppt_path)
            
            # 启动PowerPoint
            ppt_app = win32com.client.Dispatch("PowerPoint.Application")
            
            # 打开文件
            try:
                presentation = ppt_app.Presentations.Open(abs_path, ReadOnly=1)
            except:
                presentation = ppt_app.Presentations.Open(abs_path)
            
            time.sleep(1)
            
            slide_count = presentation.Slides.Count
            print(f"[PptToImageWps] PowerPoint: {slide_count} 页")
            
            # 创建临时目录
            temp_dir = os.path.join(os.path.dirname(ppt_path), f"temp_images_{int(time.time())}")
            os.makedirs(temp_dir, exist_ok=True)
            
            # 导出图片
            image_files = []
            for i in range(1, slide_count + 1):
                slide = presentation.Slides(i)
                output_file = os.path.join(temp_dir, f"slide_{i:04d}.{format_type.lower()}")
                
                try:
                    slide.Export(output_file, format_type, 1920, 1080)
                except:
                    slide.Export(output_file, format_type)
                
                if os.path.exists(output_file):
                    image_files.append(output_file)
                    if i % 5 == 0 or i == slide_count:
                        print(f"[PptToImageWps] 已导出 {i}/{slide_count}")
            
            return image_files
            
        finally:
            if presentation:
                try:
                    presentation.Close()
                except:
                    pass
            if ppt_app:
                try:
                    ppt_app.Quit()
                except:
                    pass
            pythoncom.CoUninitialize()
    
    def _ppt_to_images_wps(self, ppt_path: str, format_type: str) -> list:
        """使用WPS导出图片"""
        
        import win32com.client
        import pythoncom
        
        pythoncom.CoInitialize()
        wps_app = None
        presentation = None
        
        try:
            abs_path = os.path.abspath(ppt_path)
            
            # 启动WPS - 不设置Visible属性
            wps_app = win32com.client.Dispatch(self.office_type)
            
            # 打开文件
            try:
                presentation = wps_app.Presentations.Open(abs_path, ReadOnly=1)
            except:
                presentation = wps_app.Presentations.Open(abs_path)
            
            time.sleep(1)
            
            slide_count = presentation.Slides.Count
            print(f"[PptToImageWps] WPS: {slide_count} 页")
            
            # 创建临时目录
            temp_dir = os.path.join(os.path.dirname(ppt_path), f"temp_images_{int(time.time())}")
            os.makedirs(temp_dir, exist_ok=True)
            
            # 导出图片
            image_files = []
            for i in range(1, slide_count + 1):
                slide = presentation.Slides(i)
                output_file = os.path.join(temp_dir, f"slide_{i:04d}.{format_type.lower()}")
                
                try:
                    slide.Export(output_file, format_type, 1920, 1080)
                except:
                    try:
                        slide.Export(output_file, format_type)
                    except Exception as e:
                        print(f"[PptToImageWps] 第{i}页导出失败: {e}")
                        continue
                
                if os.path.exists(output_file):
                    image_files.append(output_file)
                    if i % 5 == 0 or i == slide_count:
                        print(f"[PptToImageWps] 已导出 {i}/{slide_count}")
            
            return image_files
            
        finally:
            if presentation:
                try:
                    presentation.Close()
                except:
                    pass
            if wps_app:
                try:
                    wps_app.Quit()
                except:
                    pass
            pythoncom.CoUninitialize()
