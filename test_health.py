import requests
try:
    response = requests.get("http://127.0.0.1:8000/api/health")
    print("Health Check:", response.status_code, response.text)
except Exception as e:
    print("Health check failed:", e)
