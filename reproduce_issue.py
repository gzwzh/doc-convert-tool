import requests
import os

API_BASE_URL = "http://127.0.0.1:8002"

def test_html_to_txt():
    # Create a dummy HTML file
    with open("test.html", "w", encoding="utf-8") as f:
        f.write("<html><body><h1>Hello World</h1><p>This is a test.</p></body></html>")
    
    try:
        # 1. Convert
        with open("test.html", "rb") as f:
            files = {'file': ('test.html', f, 'text/html')}
            data = {
                'target_format': 'txt',
                'encoding': 'utf-8'
            }
            print("Sending convert request...")
            response = requests.post(f"{API_BASE_URL}/api/convert/general", files=files, data=data)
            
        print(f"Convert Status: {response.status_code}")
        if response.status_code != 200:
            print(f"Convert Error: {response.text}")
            return
            
        result = response.json()
        print(f"Convert Result: {result}")
        
        if not result.get('success'):
            print("Conversion reported failure.")
            return
            
        download_url = result.get('download_url')
        print(f"Download URL: {download_url}")
        
        # 2. Fetch/Download
        full_url = f"{API_BASE_URL}{download_url}"
        print(f"Fetching: {full_url}")
        
        dl_response = requests.get(full_url)
        print(f"Download Status: {dl_response.status_code}")
        
        if dl_response.status_code == 200:
            print("Download successful!")
            print(f"Content: {dl_response.text}")
        else:
            print("Download failed!")
            
    finally:
        if os.path.exists("test.html"):
            os.remove("test.html")

if __name__ == "__main__":
    test_html_to_txt()
