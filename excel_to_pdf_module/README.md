# Excel to PDF Conversion Module

This module provides a complete end-to-end solution for converting Excel files (.xlsx, .xls) to PDF format.

## Structure

### Backend (`/backend`)
- `converters/excel_to_pdf.py`: Core logic for conversion. It uses two strategies:
    1. **Microsoft Excel (COM)**: Requires MS Excel installed on the Windows host. Best fidelity.
    2. **LibreOffice (Headless)**: Fallback if Excel is not available. Requires LibreOffice installed.
- `services/converter_service.py`: Orchestrates different converters and handles file storage/naming.
- `api/routes.py`: FastAPI endpoints for handling file uploads and triggering conversions.
- `utils/`: Common utilities for file handling, parameter validation, and library loading.

### Frontend (`/frontend`)
- `tool-ui/doc/DocToolWrapper.jsx`: The main UI component for uploading files, setting options, and managing conversion tasks.
- `tool-ui/doc/api.js`: Frontend API wrapper for document conversion.
- `tool-ui/image/FileUpload.jsx`: Reusable file upload component.
- `modules/configs/docData.js`: Configuration for document conversion tools (icons, names, descriptions).
- `services/api.js`: Base API service for the application.

## Requirements

### Backend (Python)
- Python 3.8+
- FastAPI, Uvicorn
- `pywin32` (for Microsoft Excel COM)
- `pythoncom` (part of pywin32)
- LibreOffice (optional fallback, must be in PATH or configured in `excel_to_pdf.py`)
- `PyMuPDF` (fitz) for some PDF operations (if used)

### Frontend (React)
- React 18+
- Ant Design (for icons)
- `react-hot-toast` for notifications
- `jszip` and `file-saver` for downloading results

## How to Integrate

1. **Backend**:
    - Copy the `backend` folder into your project.
    - Install dependencies from `requirements.txt`.
    - Include the router in your main FastAPI app:
      ```python
      from backend.api.routes import router as api_router
      app.include_router(api_router, prefix="/api")
      ```

2. **Frontend**:
    - Copy the `frontend` components and services.
    - Ensure your React app has the necessary dependencies installed (`antd`, `react-hot-toast`, etc.).
    - Use `DocToolWrapper` in your routing:
      ```jsx
      <Route path="/tool/excel/pdf" element={<DocToolWrapper toolName="Excel To PDF" />} />
      ```
