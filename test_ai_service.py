import requests
import json
import time

# Test configuration
BASE_URL = "http://localhost:8002"
TEST_DATA = {
    "recipe_generation": {
        "ingredients": ["thịt bò", "khoai tây", "cà rốt", "hành tây"],
        "dietary_restrictions": [],
        "cooking_time": 45,
        "difficulty": "medium",
        "cuisine_type": "vietnamese", 
        "language": "vi"
    },
    "regional_suggestions": {
        "latitude": 10.7769,  # Ho Chi Minh City
        "longitude": 106.6856,
        "language": "vi"
    },
    "store_finder": {
        "latitude": 10.7769,
        "longitude": 106.6856, 
        "ingredients": ["thịt bò", "cà rốt"],
        "radius": 5000
    },
    "chat": {
        "message": "Tôi muốn nấu một món ăn ngon cho 4 người, bạn có thể gợi ý không?",
        "language": "vi",
        "context": []
    }
}

def test_endpoint(endpoint, data=None, method="GET"):
    """Test an API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        start_time = time.time()
        
        if method == "GET":
            response = requests.get(url, timeout=10)
        else:
            response = requests.post(url, json=data, timeout=10)
        
        end_time = time.time()
        response_time = round((end_time - start_time) * 1000, 2)
        
        print(f"\n{'='*60}")
        print(f"🧪 TESTING: {method} {endpoint}")
        print(f"📊 Response Time: {response_time}ms")
        print(f"📋 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS")
            print(f"📄 Response Preview:")
            if isinstance(result, dict):
                for key, value in list(result.items())[:3]:  # Show first 3 keys
                    if isinstance(value, str) and len(value) > 100:
                        print(f"   {key}: {value[:100]}...")
                    else:
                        print(f"   {key}: {value}")
            return True, result
        else:
            print(f"❌ FAILED")
            print(f"📄 Error: {response.text}")
            return False, None
            
    except requests.exceptions.ConnectionError:
        print(f"\n{'='*60}")
        print(f"🧪 TESTING: {method} {endpoint}")
        print(f"❌ CONNECTION FAILED - Service not running?")
        return False, None
    except requests.exceptions.Timeout:
        print(f"\n{'='*60}")
        print(f"🧪 TESTING: {method} {endpoint}")
        print(f"⏰ TIMEOUT - Service too slow")
        return False, None
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"🧪 TESTING: {method} {endpoint}")
        print(f"💥 ERROR: {str(e)}")
        return False, None

def main():
    """Run all tests"""
    print("🚀 SMART COOKING AI SERVICE - API TESTING")
    print("=" * 60)
    
    test_results = {}
    
    # Test 1: Health Check
    success, _ = test_endpoint("/health")
    test_results["health"] = success
    
    # Test 2: Root endpoint
    success, _ = test_endpoint("/")
    test_results["root"] = success
    
    # Test 3: Recipe Generation
    success, result = test_endpoint(
        "/api/ai/generate-recipe", 
        TEST_DATA["recipe_generation"], 
        "POST"
    )
    test_results["recipe_generation"] = success
    if success and result:
        print(f"🍳 Generated Recipe: {result.get('title', 'N/A')}")
    
    # Test 4: Regional Suggestions  
    success, result = test_endpoint(
        "/api/google/regional-suggestions",
        TEST_DATA["regional_suggestions"],
        "POST"
    )
    test_results["regional_suggestions"] = success
    if success and result:
        suggestions = result.get('data', {}).get('suggestions', [])
        print(f"📍 Regional Suggestions: {suggestions[:2]}")
    
    # Test 5: Store Finder
    success, result = test_endpoint(
        "/api/google/find-stores",
        TEST_DATA["store_finder"], 
        "POST"
    )
    test_results["store_finder"] = success
    if success and result:
        stores = result.get('data', {}).get('results', [])
        print(f"🏪 Found Stores: {len(stores)} stores")
    
    # Test 6: AI Chat
    success, result = test_endpoint(
        "/api/ai/chat",
        TEST_DATA["chat"],
        "POST"
    )
    test_results["chat"] = success
    if success and result:
        response_text = result.get('data', {}).get('response', '')
        print(f"💬 AI Response: {response_text[:100]}...")
    
    # Summary
    print(f"\n{'='*60}")
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    total_tests = len(test_results)
    passed_tests = sum(test_results.values())
    
    for test_name, passed in test_results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name:20} : {status}")
    
    print(f"\n🎯 Overall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 ALL TESTS PASSED! Service is working perfectly!")
    elif passed_tests > total_tests * 0.5:
        print("⚠️  Most tests passed. Check failed endpoints.")
    else:
        print("🚨 Many tests failed. Check service configuration.")
    
    # Service status
    if test_results.get("health"):
        print("\n✅ AI Service Status: HEALTHY")
    else:
        print("\n❌ AI Service Status: UNHEALTHY")
        print("💡 Try starting the service with:")
        print("   cd c:\\SmartCookingAI_2\\ai-service")
        print("   py app_enhanced.py")

if __name__ == "__main__":
    main()
