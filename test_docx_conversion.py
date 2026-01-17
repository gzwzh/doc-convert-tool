import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from backend.converters.docx_to_txt import DocxToTxtConverter

converter = DocxToTxtConverter()
try:
    result = converter.convert("test_input.docx", "test_output.txt")
    print("Conversion result:", result)
except Exception as e:
    print("Conversion failed:", e)
    import traceback
    traceback.print_exc()
