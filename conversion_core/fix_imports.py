#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
批量修正导入路径脚本
将 app.core 和 app.services 的导入改为 conversion_core
"""

import os
import re
from pathlib import Path


def fix_imports_in_file(file_path):
    """修正单个文件的导入路径"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 修正导入路径
        replacements = [
            (r'from app\.core\.converter import', 'from conversion_core.core.base import'),
            (r'from app\.core import', 'from conversion_core.core import'),
            (r'from app\.core\.', 'from conversion_core.core.'),
            (r'from app\.services\.', 'from conversion_core.services.'),
            (r'from app\.tools\.', 'from conversion_core.tools.'),
            (r'from \.\.core\.', 'from conversion_core.core.'),
            (r'from \.\.services\.', 'from conversion_core.services.'),
            (r'from \.\.tools\.', 'from conversion_core.tools.'),
        ]
        
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)
        
        # 如果内容有变化，写回文件
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ 修正: {file_path}")
            return True
        else:
            print(f"- 跳过: {file_path}")
            return False
            
    except Exception as e:
        print(f"✗ 错误 {file_path}: {e}")
        return False


def fix_all_imports(root_dir):
    """修正目录下所有Python文件的导入"""
    root_path = Path(root_dir)
    python_files = list(root_path.rglob('*.py'))
    
    print(f"\n开始修正导入路径，共 {len(python_files)} 个文件\n")
    print("=" * 60)
    
    fixed_count = 0
    for py_file in python_files:
        # 跳过__pycache__和虚拟环境
        if '__pycache__' in str(py_file) or 'venv' in str(py_file):
            continue
            
        if fix_imports_in_file(py_file):
            fixed_count += 1
    
    print("=" * 60)
    print(f"\n完成！共修正 {fixed_count} 个文件")


if __name__ == '__main__':
    # 使用当前目录（conversion_core）
    script_dir = Path(__file__).parent
    
    print(f"工作目录: {script_dir}")
    fix_all_imports(script_dir)
