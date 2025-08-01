"""
Smart Cooking AI Service - Clean Test File
Test các endpoint một cách đơn giản không lỗi
"""

import os
import json
import asyncio
from datetime import datetime

# Test với requests library đơn giản
try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False
    print("❌ requests not available")

# Test configurations
BASE_URL = "http://localhost:8001"
API_URL = f"{BASE_URL}/api/ai"

def test_service_health():
    """Test service health check"""
    print("🏥 Testing service health...")
    
    if not REQUESTS_AVAILABLE:
        print("❌ Cannot test: requests library missing")
        return False
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Service healthy: {data.get('status', 'unknown')}")
            print(f"📊 Service info: {data.get('service', 'N/A')}")
            return True
        else:
            print(f"❌ Health check failed: HTTP {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to service. Is it running on port 8001?")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_root_endpoint():
    """Test root endpoint"""
    print("🏠 Testing root endpoint...")
    
    if not REQUESTS_AVAILABLE:
        print("❌ Cannot test: requests library missing")
        return False
    
    try:
        response = requests.get(BASE_URL, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Root endpoint OK")
            print(f"📝 Service: {data.get('service', 'N/A')}")
            print(f"🔢 Version: {data.get('version', 'N/A')}")
            print(f"🚀 Status: {data.get('status', 'N/A')}")
            
            features = data.get('features', {})
            print("🎯 Available features:")
            for feature, available in features.items():
                status = "✅" if available else "❌"
                print(f"  {status} {feature}")
            
            return True
        else:
            print(f"❌ Root endpoint failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
        return False

def test_recipe_generation():
    """Test recipe generation"""
    print("🍳 Testing recipe generation...")
    
    if not REQUESTS_AVAILABLE:
        print("❌ Cannot test: requests library missing")
        return False
    
    test_data = {
        "ingredients": ["thịt bò", "cà rôt", "khoai tây", "hành tây"],
        "language": "vi",
        "cooking_time": 45,
        "difficulty": "medium"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/generate-recipe",
            json=test_data,
            timeout=15,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Recipe generated successfully")
            print(f"📝 Title: {data.get('title', 'N/A')}")
            print(f"⏰ Cooking time: {data.get('cooking_time', 'N/A')}")
            print(f"📊 Difficulty: {data.get('difficulty', 'N/A')}")
            print(f"🍽️ Servings: {data.get('servings', 'N/A')}")
            
            ingredients = data.get('ingredients', [])
            if ingredients:
                print("🛒 Ingredients:")
                for ingredient in ingredients[:3]:  # Show first 3
                    print(f"  {ingredient}")
                if len(ingredients) > 3:
                    print(f"  ... and {len(ingredients) - 3} more")
            
            return True
        else:
            print(f"❌ Recipe generation failed: HTTP {response.status_code}")
            try:
                error_data = response.json()
                print(f"❌ Error details: {error_data}")
            except:
                print(f"❌ Error text: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Recipe generation error: {e}")
        return False

def test_chat_assistant():
    """Test chat with AI assistant"""
    print("💬 Testing chat assistant...")
    
    if not REQUESTS_AVAILABLE:
        print("❌ Cannot test: requests library missing")
        return False
    
    test_data = {
        "message": "Tôi muốn học nấu món phở",
        "language": "vi"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/chat",
            json=test_data,
            timeout=15,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Chat response received")
            print(f"🤖 Response preview: {data.get('response', 'N/A')[:100]}...")
            print(f"🌐 Language: {data.get('language', 'N/A')}")
            return True
        else:
            print(f"❌ Chat failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Chat error: {e}")
        return False

def test_regional_suggestions():
    """Test regional food suggestions"""
    print("🗺️ Testing regional suggestions...")
    
    if not REQUESTS_AVAILABLE:
        print("❌ Cannot test: requests library missing")
        return False
    
    # Test with Hanoi coordinates
    test_data = {
        "latitude": 21.0285,
        "longitude": 105.8542,
        "language": "vi"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/regional-suggestions",
            json=test_data,
            timeout=10,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Regional suggestions received")
            print(f"🌏 Region: {data.get('region', 'N/A')}")
            print(f"📍 Location: {data.get('location', {})}")
            
            suggestions = data.get('suggestions', [])
            if suggestions:
                print("🍜 Food suggestions:")
                for suggestion in suggestions[:3]:  # Show first 3
                    print(f"  {suggestion}")
                if len(suggestions) > 3:
                    print(f"  ... and {len(suggestions) - 3} more")
            
            return True
        else:
            print(f"❌ Regional suggestions failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Regional suggestions error: {e}")
        return False

def test_nutrition_analysis():
    """Test nutrition analysis"""
    print("📊 Testing nutrition analysis...")
    
    if not REQUESTS_AVAILABLE:
        print("❌ Cannot test: requests library missing")
        return False
    
    try:
        response = requests.post(
            f"{API_URL}/nutrition-analysis",
            json={},
            timeout=10,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Nutrition analysis received")
            analysis = data.get('analysis', {})
            print(f"🔥 Calories: {analysis.get('calories', 'N/A')}")
            print(f"💪 Protein: {analysis.get('protein', 'N/A')}")
            print(f"🍞 Carbs: {analysis.get('carbs', 'N/A')}")
            print(f"🥑 Fat: {analysis.get('fat', 'N/A')}")
            print(f"⭐ Health score: {data.get('health_score', 'N/A')}")
            return True
        else:
            print(f"❌ Nutrition analysis failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Nutrition analysis error: {e}")
        return False

def run_all_tests():
    """Run all test functions"""
    print("🧪 Starting Smart Cooking AI Service Tests")
    print("=" * 50)
    
    # List of test functions
    tests = [
        ("Service Health", test_service_health),
        ("Root Endpoint", test_root_endpoint),
        ("Recipe Generation", test_recipe_generation),
        ("Chat Assistant", test_chat_assistant),
        ("Regional Suggestions", test_regional_suggestions),
        ("Nutrition Analysis", test_nutrition_analysis)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🔍 Running: {test_name}")
        print("-" * 30)
        success = test_func()
        results.append((test_name, success))
        print("")
    
    # Print summary
    print("=" * 50)
    print("📋 Test Results Summary:")
    print("-" * 25)
    
    passed = 0
    failed = 0
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if success:
            passed += 1
        else:
            failed += 1
    
    print("-" * 25)
    print(f"📊 Total: {len(results)} tests")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📈 Success Rate: {(passed/len(results)*100):.1f}%")
    
    if failed == 0:
        print("\n🎉 All tests passed! Service is working correctly.")
    else:
        print(f"\n⚠️ {failed} test(s) failed. Check service status.")
        print("💡 Make sure the AI service is running on port 8001")
        print("   Start with: python app_clean.py")
    
    return passed, failed

if __name__ == "__main__":
    try:
        print("🚀 Smart Cooking AI Service - Test Suite")
        print(f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 Target URL: {BASE_URL}")
        print("")
        
        # Check if requests is available
        if not REQUESTS_AVAILABLE:
            print("❌ Critical Error: 'requests' library not found")
            print("💡 Install with: pip install requests")
            print("💡 Or run: pip install -r requirements_clean.txt")
            exit(1)
        
        # Run tests
        passed, failed = run_all_tests()
        
        # Exit with appropriate code
        exit_code = 0 if failed == 0 else 1
        print(f"\n🏁 Test suite completed with exit code: {exit_code}")
        exit(exit_code)
        
    except KeyboardInterrupt:
        print("\n⏹️ Tests interrupted by user")
        exit(130)
    except Exception as e:
        print(f"\n💥 Test suite crashed: {e}")
        exit(1)
