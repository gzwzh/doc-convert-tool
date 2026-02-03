import os
import time
from typing import Dict, Any
from .base import BaseConverter
import platform

class PptToVideoConverter(BaseConverter):
    """PPT 转视频转换器 (仅限 Windows, 需要安装 PowerPoint)"""
    
    def __init__(self):
        super().__init__()
        
    def convert(self, input_path: str, output_path: str, **options) -> Dict[str, Any]:
        self.validate_input(input_path)
        self.update_progress(input_path, 5)
        
        if platform.system() != 'Windows':
            raise Exception("PPT to Video conversion is only supported on Windows")
            
        try:
            import win32com.client
            import pythoncom
        except ImportError:
            raise Exception("pywin32 library not found. Please install it.")
            
        # 创建临时工作目录
        import tempfile
        import shutil
        import uuid
        
        # 1. 复制输入文件到纯 ASCII 路径的临时文件，避免中文路径或文件名问题
        # 同时也解决了文件占用问题
        temp_dir = tempfile.gettempdir()
        temp_input_name = f"ppt_temp_{uuid.uuid4().hex}.pptx"
        temp_input_path = os.path.join(temp_dir, temp_input_name)
        
        try:
            shutil.copy2(input_path, temp_input_path)
            print(f"[PptToVideo] Copied input to temp file: {temp_input_path}")
            working_input_path = temp_input_path
        except Exception as e:
            print(f"[PptToVideo] Failed to copy to temp file: {e}. Using original path.")
            working_input_path = input_path

        ppt_app = None
        presentation = None
        
        try:
            # 初始化 COM
            pythoncom.CoInitialize()
            
            # 尝试清理残留的 PowerPoint 进程（可选，但推荐）
            # os.system("taskkill /F /IM POWERPNT.EXE") 
            # 注意：这会杀掉用户正在运行的所有 PPT，可能不友好。但在服务器环境通常没问题。
            
            # 尝试使用 PowerShell Unblock-File 解锁文件 (Mark of the Web)
            # 对临时文件也执行一次
            try:
                import subprocess
                subprocess.run(["powershell", "Unblock-File", "-Path", f"'{working_input_path}'"], check=True, capture_output=True)
                print(f"[PptToVideo] Unblock-File executed for {working_input_path}")
            except Exception as e:
                print(f"[PptToVideo] Warning: Failed to unblock file: {e}")

            # 启动 PowerPoint
            try:
                # 使用 EnsureDispatch 确保能获取到实例
                ppt_app = win32com.client.Dispatch("PowerPoint.Application")
                
                # 尝试访问一个属性来验证 COM 对象是否活跃
                _ = ppt_app.Version
                
                ppt_app.Visible = 1 # 必须设置为可见
                ppt_app.DisplayAlerts = 0 # 关闭所有弹窗警告
            except Exception as e:
                # 如果启动失败，可能是因为死进程占用了 COM 端口
                print(f"[PptToVideo] First attempt to start PowerPoint failed: {e}. Trying to kill zombie processes...")
                try:
                    os.system("taskkill /F /IM POWERPNT.EXE")
                    time.sleep(2) # 等待清理
                    ppt_app = win32com.client.Dispatch("PowerPoint.Application")
                    ppt_app.Visible = 1
                    ppt_app.DisplayAlerts = 0
                except Exception as e2:
                    raise Exception(f"Failed to start PowerPoint even after cleanup. Error: {e2}")
                
            self.update_progress(input_path, 20)
            
            # 打开演示文稿
            # CreateVideo 需要窗口句柄才能高效工作
            try:
                presentation = ppt_app.Presentations.Open(working_input_path, WithWindow=True)
                # 增加短暂延时，确保加载完成
                time.sleep(2)
            except Exception as e:
                # 如果Open失败，可能是因为Protected View的限制，或者其他COM错误
                # 尝试先关闭Protected View (虽然Unblock-File应该解决了)
                raise Exception(f"Failed to open presentation: {e}")
            
            # 处理受保护视图 (Protected View)
            # 即使 Unblock-File 执行了，有时可能仍会进入受保护视图
            if ppt_app.ProtectedViewWindows.Count > 0:
                print(f"[PptToVideo] Protected View detected for {working_input_path}")
                try:
                    pv_window = ppt_app.ProtectedViewWindows(1)
                    if pv_window:
                        # 检查是否是当前文件的窗口
                        # 注意：如果多个文件同时打开，这里可能需要遍历
                        presentation = pv_window.Edit() # 这会返回一个新的可编辑 Presentation 对象
                        print("[PptToVideo] Successfully enabled editing from Protected View")
                except Exception as e:
                     print(f"[PptToVideo] Error editing Protected View: {e}")
                     # 尝试继续，也许 presentation 变量仍然可用？通常不可用。
                     # 如果Edit失败，通常意味着无法转换
                     raise Exception(f"Cannot exit Protected View: {e}")
            
            self.update_progress(input_path, 40)
            
            # 导出视频
            # ppSaveAsMP4 = 39, ppSaveAsWMV = 37
            output_format = 39  # MP4
            
            # 配置视频参数
            resolution = options.get('resolution', 1080)  # 默认 1080p
            quality = options.get('quality', 60)  # 默认质量
            
            # 使用临时输出文件（纯ASCII路径），避免输出路径的中文/编码问题
            temp_output_name = f"ppt_out_{uuid.uuid4().hex}.mp4"
            temp_output_path = os.path.join(temp_dir, temp_output_name)
            print(f"[PptToVideo] Exporting to temp video: {temp_output_path}")
            
            # 激活窗口，确保它在前台（某些环境下必要）
            try:
                if presentation.Windows.Count > 0:
                    presentation.Windows(1).Activate()
                    # ppWindowMaximized = 3
                    presentation.Windows(1).WindowState = 3
            except:
                pass

            # CreateVideo(FileName, UseTimingsAndNarrations, DefaultSlideDuration, VertResolution, FramesPerSecond, Quality)
            # UseTimingsAndNarrations: Default True
            # DefaultSlideDuration: Default 5 seconds
            # VertResolution: 1080, 720, 480...
            # FramesPerSecond: Default 30
            # Quality: 1-100
            
            # 使用 5 秒作为默认幻灯片持续时间，而不是 60 秒
            use_timings = options.get('use_timings', True)
            fps = options.get('fps', 30)
            
            try:
                # 尝试使用 CreateVideo 方法
                presentation.CreateVideo(temp_output_path, use_timings, 5, resolution, fps, quality)
                
                self.update_progress(input_path, 50)
                
                # 等待导出完成
                start_time = time.time()
                
                while True:
                    time.sleep(1)
                    
                    try:
                        status = presentation.CreateVideoStatus
                        
                        if status == 3: # Done
                            break
                        elif status == 4: # Failed
                            raise Exception("PowerPoint reported video creation failure (Status=4)")
                        elif status == 0: # None
                             if time.time() - start_time > 10:
                                 if os.path.exists(temp_output_path) and os.path.getsize(temp_output_path) > 0:
                                     break 
                                 elif time.time() - start_time > 60:
                                     raise Exception("Video export failed to start (Status remains 0)")
                    except Exception as e:
                        print(f"Error checking status: {e}")
                        # 异常情况下，尝试 SaveAs 作为回退
                        raise e 
                        
                    # 超时保护
                    if time.time() - start_time > 600:
                        raise Exception("Video export timed out")
                        
            except Exception as e:
                print(f"[PptToVideo] CreateVideo failed: {e}. Trying SaveAs fallback...")
                
                # 回退策略：尝试使用 SaveAs 方法导出 MP4
                # ppSaveAsMP4 = 39
                try:
                    # 先删除可能存在的空文件
                    if os.path.exists(temp_output_path):
                        try: os.remove(temp_output_path)
                        except: pass
                        
                    presentation.SaveAs(temp_output_path, 39)
                    
                    # SaveAs 是异步的吗？通常是同步的，但对于视频导出可能会立即返回
                    # 轮询文件直到不再增长
                    start_time = time.time()
                    last_size = -1
                    stable_count = 0
                    
                    while True:
                        time.sleep(2)
                        if not os.path.exists(temp_output_path):
                            if time.time() - start_time > 30: # 30秒还没文件，失败
                                raise Exception("SaveAs failed to create output file")
                            continue
                            
                        current_size = os.path.getsize(temp_output_path)
                        if current_size == last_size and current_size > 0:
                            stable_count += 1
                            if stable_count >= 5: # 10秒大小不变，认为完成
                                break
                        else:
                            last_size = current_size
                            stable_count = 0
                            self.update_progress(input_path, 75) # 模拟进度
                            
                        if time.time() - start_time > 600:
                             raise Exception("SaveAs video export timed out")
                             
                except Exception as save_err:
                    raise Exception(f"Both CreateVideo and SaveAs failed. CreateVideo error: {e}. SaveAs error: {save_err}")

            # 转换成功，将临时文件移动到最终目标
            if os.path.exists(temp_output_path):
                # 确保目标目录存在
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                # 移动覆盖
                if os.path.exists(output_path):
                    try: os.remove(output_path)
                    except: pass
                shutil.move(temp_output_path, output_path)
                print(f"[PptToVideo] Moved temp output to: {output_path}")
            else:
                raise Exception("Output file missing after conversion")

            self.update_progress(input_path, 100)
            
            return {
                'success': True,
                'output_path': output_path,
                'size': os.path.getsize(output_path)
            }
            
        except Exception as e:
            raise Exception(f"PPT to Video failed: {str(e)}")
            
        finally:
            # 清理
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
            
            # 清理临时文件
            try:
                if 'working_input_path' in locals() and working_input_path != input_path:
                    os.remove(working_input_path)
            except:
                pass
