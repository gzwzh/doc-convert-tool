"""
测试更新 API 是否正常工作
"""
import requests
import json

def test_update_api():
    """测试更新检查 API"""
    
    # API 配置
    server_url = "http://software.kunqiongai.com:8000"
    software_id = "10031"
    current_version = "1.0.0"
    
    # 构建 API URL
    api_url = f"{server_url}/api/v1/updates/check/?software={software_id}&version={current_version}"
    
    print("=" * 60)
    print("测试更新 API")
    print("=" * 60)
    print(f"服务器: {server_url}")
    print(f"软件编号: {software_id}")
    print(f"当前版本: {current_version}")
    print(f"API URL: {api_url}")
    print()
    
    try:
        print("🔍 发送请求...")
        response = requests.get(api_url, timeout=10)
        
        print(f"状态码: {response.status_code}")
        print()
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API 响应成功！")
            print()
            print("📋 返回数据:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            print()
            
            # 验证必需字段
            required_fields = ['has_update', 'version', 'download_url', 'package_hash']
            missing_fields = [f for f in required_fields if f not in data]
            
            if missing_fields:
                print(f"⚠️  警告: 缺少必需字段: {', '.join(missing_fields)}")
            else:
                print("✅ 所有必需字段都存在")
                
                if data.get('has_update'):
                    print()
                    print("🎉 发现新版本！")
                    print(f"  新版本: {data.get('version')}")
                    print(f"  下载地址: {data.get('download_url')}")
                    print(f"  SHA256: {data.get('package_hash')}")
                    print(f"  强制更新: {data.get('is_mandatory', False)}")
                    print(f"  更新说明: {data.get('update_log', '无')}")
                    
                    # 验证 SHA256
                    expected_hash = "860e018f6912e6a965dd9cf08d03a65917f6a0440ca12c3699de1422e0070c95"
                    actual_hash = data.get('package_hash', '')
                    
                    if actual_hash == expected_hash:
                        print()
                        print("✅ SHA256 哈希值正确！")
                    else:
                        print()
                        print("❌ SHA256 哈希值不匹配！")
                        print(f"  期望: {expected_hash}")
                        print(f"  实际: {actual_hash}")
                else:
                    print()
                    print("ℹ️  当前已是最新版本")
        else:
            print(f"❌ API 请求失败")
            print(f"响应内容: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ 连接失败: 无法连接到服务器")
        print("   请检查:")
        print("   1. 服务器是否运行")
        print("   2. 网络连接是否正常")
        print("   3. 服务器地址是否正确")
    except requests.exceptions.Timeout:
        print("❌ 请求超时")
    except Exception as e:
        print(f"❌ 发生错误: {e}")
    
    print()
    print("=" * 60)

if __name__ == "__main__":
    test_update_api()
