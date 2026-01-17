import os
import json
import unittest
from backend.converters.json_to_html import JsonToHtmlConverter
from backend.converters.xml_to_html import XmlToHtmlConverter
# Skip PDF test for now as we don't have a PDF generator easily available without installing more libs or using existing one
# But we can test JSON and XML

class TestNewConverters(unittest.TestCase):
    def setUp(self):
        self.test_dir = "test_output"
        os.makedirs(self.test_dir, exist_ok=True)
        
        # Setup JSON file
        self.json_path = os.path.join(self.test_dir, "test.json")
        with open(self.json_path, "w") as f:
            json.dump({"name": "test", "value": 123}, f)
            
        # Setup XML file
        self.xml_path = os.path.join(self.test_dir, "test.xml")
        with open(self.xml_path, "w") as f:
            f.write("<root><name>test</name><value>123</value></root>")

    def test_json_to_html(self):
        converter = JsonToHtmlConverter()
        output_path = os.path.join(self.test_dir, "test_json.html")
        result = converter.convert(self.json_path, output_path)
        self.assertTrue(result['success'])
        self.assertTrue(os.path.exists(output_path))
        with open(output_path, "r") as f:
            content = f.read()
            self.assertIn("JSON Content", content)
            self.assertIn("test", content)

    def test_xml_to_html(self):
        converter = XmlToHtmlConverter()
        output_path = os.path.join(self.test_dir, "test_xml.html")
        result = converter.convert(self.xml_path, output_path)
        self.assertTrue(result['success'])
        self.assertTrue(os.path.exists(output_path))
        with open(output_path, "r") as f:
            content = f.read()
            self.assertIn("XML Content", content)
            self.assertIn("&lt;root&gt;", content)

if __name__ == '__main__':
    unittest.main()
