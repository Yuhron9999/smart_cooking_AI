import requests
import json

# Test Google Custom Search API endpoint
url = "http://localhost:8001/api/ai/search-food-images"
data = {
    "query": "Phở Bò", 
    "num_results": 2, 
    "language": "vi"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
except Exception as e:
    print(f"Error: {e}")
