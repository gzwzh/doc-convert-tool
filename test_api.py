import requests
import sys

url = "http://localhost:8002/api/convert/general"
files = {'file': open('test_input.docx', 'rb')}
data = {'target_format': 'txt'}

try:
    response = requests.post(url, files=files, data=data)
    print("Status Code:", response.status_code)
    print("Response Body:", response.text)
except Exception as e:
    print("Request failed:", e)
