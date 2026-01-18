import requests
import json

API_URL = "http://127.0.0.1:8000/chat"

payload = {
    "message": "Hello, are you working?",
    "chat_history": []
}

try:
    response = requests.post(API_URL, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
