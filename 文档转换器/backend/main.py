# backend/main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import sys

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.api.routes import router
from backend.services.converter_service import DOWNLOAD_DIR
from backend.utils.logger import logger

app = FastAPI(title="Format Converter API")

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 开发环境下允许所有来源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载静态文件目录以供下载
app.mount("/downloads", StaticFiles(directory=DOWNLOAD_DIR), name="downloads")

# 注册路由
app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    logger.info("后端服务正在启动...")
    logger.info(f"Python 路径: {sys.path}")
    logger.info(f"下载目录: {DOWNLOAD_DIR}")

if __name__ == "__main__":
    for route in app.routes:
        if hasattr(route, "methods"):
            logger.debug(f"Route: {route.path} {route.methods}")
        else:
            logger.debug(f"Route: {route.path} (Mount)")
    is_frozen = getattr(sys, "frozen", False)
    port = int(os.environ.get("BACKEND_PORT", "8002"))
    logger.info(f"启动端口: {port}, 是否打包: {is_frozen}")
    if is_frozen:
        # 增加超时时间以支持长时间转换（如PPT转视频）
        uvicorn.run(app, host="0.0.0.0", port=port, reload=False, timeout_keep_alive=900)
    else:
        # 开发环境也增加超时
        uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True, timeout_keep_alive=900)
