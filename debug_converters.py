
import sys
import os

# Add project root to path
sys.path.insert(0, os.getcwd())

from backend.services.converter_service import ConverterService

service = ConverterService()
pptx_targets = [tgt for src, tgt in service.converters.keys() if src == 'pptx']
print(f"PPTX targets: {pptx_targets}")

ppt_targets = [tgt for src, tgt in service.converters.keys() if src == 'ppt']
print(f"PPT targets: {ppt_targets}")

xlsx_targets = [tgt for src, tgt in service.converters.keys() if src == 'xlsx']
print(f"XLSX targets: {xlsx_targets}")
