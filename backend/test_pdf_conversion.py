import unittest
import os
import shutil
import fitz
from converters.pdf_to_txt import PdfToTxtConverter
from converters.pdf_to_image import PdfToImageConverter
from converters.pdf_to_html import PdfToHtmlConverter

class TestPdfConversion(unittest.TestCase):
    def setUp(self):
        self.test_pdf = "test_input.pdf"
        self.doc = fitz.open()
        
        # Page 1
        page = self.doc.new_page()
        page.insert_text((50, 50), "Hello World")
        
        # Page 2
        page = self.doc.new_page()
        page.insert_text((50, 50), "Page Two Content")
        
        # Page 3
        page = self.doc.new_page()
        page.insert_text((50, 50), "Page Three: A + B = C")
        
        self.doc.save(self.test_pdf)
        self.doc.close()
        
        self.output_files = []

    def tearDown(self):
        if os.path.exists(self.test_pdf):
            os.remove(self.test_pdf)
        
        for f in self.output_files:
            if os.path.exists(f):
                if os.path.isdir(f):
                    shutil.rmtree(f)
                else:
                    try:
                        os.remove(f)
                    except Exception:
                        pass

    def test_pdf_to_txt(self):
        converter = PdfToTxtConverter()
        output_path = "test_output.txt"
        self.output_files.append(output_path)
        
        result = converter.convert(self.test_pdf, output_path)
        
        self.assertTrue(result['success'])
        self.assertTrue(os.path.exists(output_path))
        
        with open(output_path, 'r', encoding='utf-8') as f:
            content = f.read()
            self.assertIn("Hello World", content)
            self.assertIn("Page Two Content", content)
            self.assertIn("Page Three", content)

    def test_pdf_to_image_merge(self):
        converter = PdfToImageConverter()
        # Test merging to single long image
        output_path = "test_output_image_merged.png"
        self.output_files.append(output_path)
        
        result = converter.convert(self.test_pdf, output_path, merge=True)
        
        self.assertTrue(result['success'])
        self.assertTrue(os.path.exists(output_path))
        self.assertTrue(result['merged'])

    def test_pdf_to_image_folder(self):
        converter = PdfToImageConverter()
        # Test saving as folder
        output_path = "test_output_image_folder/output.png" 
        # Note: Code expects output_path to be a file path, but if merge=False it might use the directory or create one.
        # Let's check _save_to_folder signature/usage in pdf_to_image.py:
        # final_output = self._save_to_folder(images, output_path, target_ext, base_name, output_dir, quality)
        # It uses output_path's directory.
        
        # The converter creates a subfolder based on the filename (without extension)
        # output_path = "test_folder/image.png" -> folder_path = "test_folder/image"
        
        output_path = os.path.abspath("test_folder/image.png")
        output_dir = os.path.dirname(output_path)
        self.output_files.append(output_dir)
        
        result = converter.convert(self.test_pdf, output_path, merge=False)
        
        self.assertTrue(result['success'])
        self.assertFalse(result['merged'])
        
        # The converter zips the folder and deletes the original folder
        expected_zip = os.path.join(output_dir, "image.zip")
        self.assertTrue(os.path.exists(expected_zip), f"Zip not found: {expected_zip}")
        
        # Verify zip content
        import zipfile
        with zipfile.ZipFile(expected_zip, 'r') as zf:
            file_list = zf.namelist()
            self.assertTrue(len(file_list) >= 3, f"Expected 3+ files in zip, found {len(file_list)}")
            # Check if they are inside the subfolder "image/"
            # base_name is "image"
            self.assertTrue(any(f.startswith("image/") for f in file_list))

    def test_pdf_to_html(self):
        converter = PdfToHtmlConverter()
        output_path = "test_output.html"
        self.output_files.append(output_path)
        
        # Test text extraction mode (default)
        result = converter.convert(self.test_pdf, output_path, page_render=False)
        
        self.assertTrue(result['success'])
        self.assertTrue(os.path.exists(output_path))
        
        with open(output_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Basic check for content
            self.assertTrue(len(content) > 0)

    def test_pdf_page_selection(self):
        converter = PdfToTxtConverter()
        output_path = "test_output_selection.txt"
        self.output_files.append(output_path)
        
        # Test selecting only page 2 (index 1)
        # Page 1: "Hello World"
        # Page 2: "Page Two Content"
        # Page 3: "Page Three..."
        
        # Try both "2" and "2-2" formats
        options = {'page_range': '2'}
        result = converter.convert(self.test_pdf, output_path, **options)
        
        self.assertTrue(result['success'])
        with open(output_path, 'r', encoding='utf-8') as f:
            content = f.read()
            self.assertNotIn("Hello World", content)
            self.assertIn("Page Two Content", content)
            self.assertNotIn("Page Three", content)

    def test_pdf_to_image_selection_single(self):
        converter = PdfToImageConverter()
        output_path = "test_folder_sel_single/image.png"
        output_dir = "test_folder_sel_single"
        self.output_files.append(output_dir)
        
        # Select page 3 only. Since it's a single page result, it should be saved as a single image file.
        options = {'page_range': '3'}
        result = converter.convert(self.test_pdf, output_path, merge=False, **options)
        
        self.assertTrue(result['success'])
        
        # Check if the output file exists directly
        self.assertTrue(os.path.exists(output_path))
        self.assertFalse(os.path.isdir(output_path))
        
    def test_pdf_to_image_selection_multi_mapping(self):
        converter = PdfToImageConverter()
        output_path = "test_folder_sel_multi/image.png"
        output_dir = "test_folder_sel_multi"
        self.output_files.append(output_dir)
        
        # Select pages 3 and 1. (Indices 2 and 0). Sorted: [0, 2].
        # Expect output to be a zip containing "1.png" and "3.png" inside a folder "image/"
        options = {'page_range': '3, 1'}
        result = converter.convert(self.test_pdf, output_path, merge=False, **options)
        
        self.assertTrue(result['success'])
        
        expected_zip = os.path.join(output_dir, "image.zip")
        self.assertTrue(os.path.exists(expected_zip))
        
        import zipfile
        with zipfile.ZipFile(expected_zip, 'r') as zf:
            file_list = zf.namelist()
            # Should contain "image/1.png" and "image/3.png"
            self.assertIn("image/1.png", file_list)
            self.assertIn("image/3.png", file_list)
            # Should NOT contain "image/2.png" (since page 2 was not selected)
            self.assertNotIn("image/2.png", file_list)

if __name__ == '__main__':
    unittest.main()
