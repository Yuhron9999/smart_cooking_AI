"""
Test AI Service Endpoints
"""

import requests
import json

def test_service():
    base_url = "http://localhost:8001"
    
    print("🧪 Testing AI Service Endpoints")
    print("=" * 50)
    
    # Test 1: Health check
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"1️⃣ Health Check: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Status: {data.get('status')}")
            print(f"   🔧 Services: {data.get('services')}")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
    
    # Test 2: Root endpoint
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        print(f"2️⃣ Root Endpoint: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Service: {data.get('service')}")
            print(f"   📊 Version: {data.get('version')}")
            print(f"   🔧 Features: {data.get('features')}")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Root endpoint failed: {e}")
    
    # Test 3: Regional suggestions
    try:
        payload = {
            "latitude": 21.0285,
            "longitude": 105.8542,
            "language": "vi"
        }
        response = requests.post(f"{base_url}/api/location/suggestions", 
                               json=payload, timeout=5)
        print(f"3️⃣ Regional Suggestions: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            suggestions = data.get('data', {}).get('suggestions', [])
            print(f"   ✅ Region: {data.get('data', {}).get('region')}")
            print(f"   🍜 Suggestions: {suggestions[:2]}")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Regional suggestions failed: {e}")
    
    # Test 4: Recipe generation (mock)
    try:
        payload = {
            "ingredients": ["thịt heo", "rau muống", "gạo"],
            "preferences": {"dietary": "none"},
            "language": "vi"
        }
        response = requests.post(f"{base_url}/api/ai/generate-recipe", 
                               json=payload, timeout=10)
        print(f"4️⃣ Recipe Generation: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success: {data.get('success')}")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Recipe generation failed: {e}")
    
    print("\n🎉 Service test completed!")

if __name__ == "__main__":
    test_service()
