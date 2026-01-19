# ConvertTool - 文件格式转换工具

简单、高效、安全的桌面端文件格式转换工具集。

## ✨ 功能特点

- 🚀 **61种转换功能** - 支持DOCX、HTML、JSON、PDF、TXT、XML等多种格式互转
- 💻 **跨平台支持** - 基于Electron，支持Windows、macOS、Linux
- 🎯 **批量转换** - 支持多文件同时转换，提高工作效率
- 🔒 **本地处理** - 所有转换在本地完成，保护隐私安全
- ⚡ **快速转换** - 优化的转换引擎，处理速度快
- 🎨 **现代界面** - 简洁美观的用户界面，操作简单

## 📦 技术栈

- **前端**: React + Vite
- **后端**: Python (FastAPI)
- **桌面**: Electron
- **转换引擎**: PyMuPDF, Pillow, python-docx, pdfplumber等

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

这将同时启动：
- React开发服务器 (http://localhost:5173)
- Electron窗口
- Python后端服务 (需单独启动)

### 启动后端服务

```bash
cd backend
pip install -r requirements.txt
python main.py
```

## 📝 支持的转换格式

### DOCX转换器 (5种)
- DOCX → PDF, PNG, JPG, TXT, EPUB

### HTML转换器 (9种)
- HTML → PDF, JPG, SVG, GIF, WORD, PNG, TEXT, MARKDOWN, JSON

### JSON转换器 (9种)
- JSON → PDF, PNG, JPG, SVG, CSV, HTML, YAML, XML, BASE64

### PDF转换器 (19种)
- PDF → DOC, PNG, DOCX, JPG, SVG, JSON, EPUB, TXT, BASE64, TIFF, BMP, MD, HTML, PPT, GIF, PSD, RTF, WEBP

### TXT转换器 (9种)
- TXT → PDF, SPEECH, JPG, PNG, ASCII, BINARY, CSV, HEX, HTML

### XML转换器 (10种)
- XML → JSON, YAML, CSV, HTML, TEXT, PDF, XLSX, PNG, JPG, SVG

## 🔧 打包发布

```bash
npm run build
```

打包产物将输出到 `release/<版本号>/` 目录。

## 📖 项目结构

```
.
├── frontend/          # React前端项目
├── backend/           # Python后端项目
│   ├── api/          # API路由
│   ├── converters/   # 转换器实现
│   ├── services/     # 业务服务
│   └── utils/        # 工具函数
├── electron/          # Electron主进程
└── release/           # 打包输出
```

## 📄 许可证

ISC License
