import os
import json
from backend.converters.json_to_yaml import JsonToYamlConverter
from backend.converters.json_to_xml import JsonToXmlConverter

def test_converters():
    # 1. 准备测试数据
    test_json = {
        "name": "Test Tool",
        "version": "1.0.0",
        "features": ["convert", "optimize", "decouple"],
        "nested": {
            "key": "value"
        }
    }
    
    input_path = "test_input.json"
    yaml_output = "test_output.yaml"
    xml_output = "test_output.xml"
    
    with open(input_path, 'w', encoding='utf-8') as f:
        json.dump(test_json, f)
    
    try:
        # 2. 测试 YAML 转换
        print("--- Testing YAML Converter ---")
        yaml_converter = JsonToYamlConverter()
        yaml_result = yaml_converter.convert(input_path, yaml_output)
        print(f"YAML Result: {yaml_result}")
        
        # 3. 测试 XML 转换
        print("\n--- Testing XML Converter ---")
        xml_converter = JsonToXmlConverter()
        xml_result = xml_converter.convert(input_path, xml_output)
        print(f"XML Result: {xml_result}")
        
        # 4. 验证内容
        if os.path.exists(xml_output):
            with open(xml_output, 'r', encoding='utf-8') as f:
                print("\nGenerated XML content:")
                print(f.read())
            print("SUCCESS: XML file generated.")
            
    except Exception as e:
        print(f"ERROR: {str(e)}")
    finally:
        # 清理
        for p in [input_path, yaml_output, xml_output]:
            if os.path.exists(p):
                os.remove(p)

if __name__ == "__main__":
    test_converters()
