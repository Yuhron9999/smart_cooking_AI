#!/usr/bin/env python3
"""
Test real AI Service endpoints
"""

import requests
import json
import base64

BASE_URL = "http://localhost:8001"

def test_vision():
    """Test vision endpoint"""
    print("👁️ Testing Vision Endpoint...")
    try:
        # Simple 1x1 pixel PNG image in base64
        test_image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        
        data = {
            "image_data": test_image,
            "language": "vi"
        }
        response = requests.post(f"{BASE_URL}/api/ai/vision", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Vision Response: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Vision test failed: {e}")
        return False

def test_chat():
    """Test chat endpoint"""
    print("\n💬 Testing Chat Endpoint...")
    try:
        data = {
            "message": "Tôi muốn nấu món phở bò. Bạn có thể hướng dẫn được không?",
            "language": "vi"
        }
        response = requests.post(f"{BASE_URL}/api/ai/chat", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Chat Response: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Chat test failed: {e}")
        return False

def test_ingredient_suggestions():
    """Test ingredient suggestions"""
    print("\n🥕 Testing Ingredient Suggestions...")
    try:
        data = {
            "dish_name": "phở bò",
            "language": "vi"
        }
        response = requests.post(f"{BASE_URL}/api/ai/ingredient-suggestions", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Ingredient Suggestions: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Ingredient suggestions test failed: {e}")
        return False

def test_nutrition_analysis():
    """Test nutrition analysis"""
    print("\n🥗 Testing Nutrition Analysis...")
    try:
        data = {
            "dish_name": "phở bò",
            "ingredients": ["thịt bò", "bánh phở", "hành tây", "gừng"],
            "language": "vi"
        }
        response = requests.post(f"{BASE_URL}/api/ai/nutrition-analysis", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Nutrition Analysis: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Nutrition analysis test failed: {e}")
        return False

def test_learning_path():
    """Test learning path creation"""
    print("\n📚 Testing Learning Path Creation...")
    try:
        data = {
            "user_level": "beginner",
            "cuisine_preference": "vietnamese",
            "language": "vi"
        }
        response = requests.post(f"{BASE_URL}/api/ai/learning-path", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Learning Path: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Learning path test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Smart Cooking AI Service - Real API Tests\n")
    
    tests = [
        ("Vision Analysis", test_vision),
        ("AI Chat", test_chat),
        ("Ingredient Suggestions", test_ingredient_suggestions),
        ("Nutrition Analysis", test_nutrition_analysis),
        ("Learning Path", test_learning_path)
    ]
    
    results = []
    for test_name, test_func in tests:
        success = test_func()
        results.append((test_name, success))
        print("-" * 60)
    
    print("\n📊 Test Results Summary:")
    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    print(f"\n🎯 Overall: {passed}/{total} tests passed")

if __name__ == "__main__":
    main()
