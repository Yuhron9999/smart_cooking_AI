"""
Test API endpoints cho Smart Cooking AI Service
"""
import requests
import json

BASE_URL = "http://localhost:8001"

def test_health_endpoint():
    """Test health check endpoint"""
    print("🔍 Testing /health endpoint...")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_recipe_generation():
    """Test recipe generation endpoint"""
    print("\n🍽️ Testing recipe generation...")
    
    payload = {
        "ingredients": ["thịt bò", "cà rót", "khoai tây"],
        "cuisine_type": "vietnamese",
        "difficulty": "medium",
        "language": "vi"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/ai/generate-recipe", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Recipe generation failed: {e}")
        return False

def test_chat_endpoint():
    """Test chat endpoint"""
    print("\n💬 Testing chat endpoint...")
    
    payload = {
        "message": "Làm thế nào để nấu phở ngon?",
        "language": "vi",
        "context": []
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/ai/chat", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Chat failed: {e}")
        return False

def test_regional_suggestions():
    """Test regional suggestions endpoint"""
    print("\n🗺️ Testing regional suggestions...")
    
    payload = {
        "latitude": 21.0285,  # Hanoi coordinates
        "longitude": 105.8542,
        "language": "vi"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/ai/regional-suggestions", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Regional suggestions failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Smart Cooking AI Service APIs...")
    print("=" * 50)
    
    # Test all endpoints
    results = []
    results.append(("Health Check", test_health_endpoint()))
    results.append(("Recipe Generation", test_recipe_generation()))
    results.append(("Chat AI", test_chat_endpoint()))
    results.append(("Regional Suggestions", test_regional_suggestions()))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY:")
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! API service is working perfectly.")
    else:
        print("⚠️ Some tests failed. Check the logs above.")
