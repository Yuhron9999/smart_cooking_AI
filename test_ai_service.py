#!/usr/bin/env python3
"""
Test script for AI Service API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8001"

def test_health():
    """Test health endpoint"""
    print("🏥 Testing Health Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_chat():
    """Test AI chat endpoint"""
    print("\n💬 Testing AI Chat Endpoint...")
    try:
        data = {
            "message": "Tôi muốn nấu món phở bò. Bạn có thể hướng dẫn được không?",
            "language": "vi"
        }
        response = requests.post(f"{BASE_URL}/api/ai/chat", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"AI Response: {result.get('response', 'No response')}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Chat test failed: {e}")
        return False

def test_recipe_generation():
    """Test recipe generation endpoint"""
    print("\n🍳 Testing Recipe Generation Endpoint...")
    try:
        data = {
            "ingredients": ["thịt bò", "bánh phở", "hành tây", "gừng"],
            "cuisine_type": "vietnamese",
            "difficulty": "medium",
            "language": "vi"
        }
        response = requests.post(f"{BASE_URL}/api/ai/generate-recipe", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Generated Recipe: {result.get('recipe', {}).get('title', 'No title')}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Recipe generation test failed: {e}")
        return False

def test_image_analysis():
    """Test image analysis endpoint"""
    print("\n📸 Testing Image Analysis Endpoint...")
    try:
        # Test with a simple base64 encoded 1x1 pixel image
        test_image_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        
        data = {
            "image_data": test_image_b64,
            "language": "vi"
        }
        response = requests.post(f"{BASE_URL}/api/ai/analyze-image", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Image Analysis: {result.get('analysis', 'No analysis')}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Image analysis test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Smart Cooking AI Service - API Tests\n")
    
    tests = [
        ("Health Check", test_health),
        ("AI Chat", test_chat),
        ("Recipe Generation", test_recipe_generation),
        ("Image Analysis", test_image_analysis)
    ]
    
    results = []
    for test_name, test_func in tests:
        success = test_func()
        results.append((test_name, success))
        print("-" * 50)
    
    print("\n📊 Test Results Summary:")
    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    print(f"\n🎯 Overall: {passed}/{total} tests passed")

if __name__ == "__main__":
    main()
