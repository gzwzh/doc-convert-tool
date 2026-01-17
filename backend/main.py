# backend/main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from backend.api.routes import router
from backend.services.converter_service import DOWNLOAD_DIR

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

if __name__ == "__main__":
    for route in app.routes:
        if hasattr(route, "methods"):
            print(f"Route: {route.path} {route.methods}")
        else:
            print(f"Route: {route.path} (Mount)")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8002, reload=True)
