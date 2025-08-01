#!/usr/bin/env python3
"""
Test AI Service Endpoints - Simple Version
Kiểm tra các endpoints AI service hoạt động đúng
"""

import asyncio
import json
import sys
import os

# Use httpx instead of aiohttp for better type support
try:
    import httpx
    HTTP_AVAILABLE = True
except ImportError:
    print("⚠️ httpx not available, using basic test")
    HTTP_AVAILABLE = False

async def test_ai_service():
    """Test AI service endpoints"""
    base_url = "http://localhost:8001"
    
    print("🧪 Testing Smart Cooking AI Service")
    print("=" * 50)
    
    if not HTTP_AVAILABLE:
        print("❌ httpx không có sẵn. Cài đặt: pip install httpx")
        return
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        # Test 1: Health Check
        print("1️⃣ Testing Health Check...")
        try:
            response = await client.get(f"{base_url}/health")
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Health Check: {data.get('status', 'N/A')}")
                print(f"   📊 Service: {data.get('service', 'N/A')}")
            else:
                print(f"   ❌ Health Check Failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Health Check Error: {e}")
        
        # Test 2: Recipe Generation
        print("\n2️⃣ Testing Recipe Generation...")
        try:
            payload = {
                "ingredients": ["cà chua", "trứng", "hành tây"],
                "language": "vi"
            }
            response = await client.post(f"{base_url}/api/ai/generate-recipe", 
                                       json=payload)
            if response.status_code == 200:
                data = response.json()
                title = data.get("title", "N/A")
                cooking_time = data.get("cooking_time", "N/A")
                print(f"   ✅ Recipe: {title[:40]}...")
                print(f"   🍳 Time: {cooking_time}")
            else:
                print(f"   ❌ Recipe Generation Failed: {response.status_code}")
                print(f"   📝 Error: {response.text[:100]}...")
        except Exception as e:
            print(f"   ❌ Recipe Generation Error: {e}")
        
        # Test 3: Chat Function
        print("\n3️⃣ Testing AI Chat...")
        try:
            payload = {
                "message": "Tôi muốn nấu món phở",
                "language": "vi"
            }
            response = await client.post(f"{base_url}/api/ai/chat", 
                                       json=payload)
            if response.status_code == 200:
                data = response.json()
                chat_response = data.get("response", "N/A")
                print(f"   ✅ Chat Response: {chat_response[:60]}...")
            else:
                print(f"   ❌ Chat Failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Chat Error: {e}")
        
        # Test 4: Root Endpoint
        print("\n4️⃣ Testing Root Endpoint...")
        try:
            response = await client.get(f"{base_url}/")
            if response.status_code == 200:
                data = response.json()
                service = data.get("service", "N/A")
                version = data.get("version", "N/A")
                print(f"   ✅ Service: {service} v{version}")
                features = data.get("features", {})
                print(f"   🔧 Google API: {features.get('google_api', False)}")
                print(f"   🤖 Gemini AI: {features.get('gemini_ai', False)}")
            else:
                print(f"   ❌ Root Endpoint Failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Root Endpoint Error: {e}")
        
        # Test 5: Vision Endpoint
        print("\n5️⃣ Testing Vision Analysis...")
        try:
            # Create a dummy file for testing
            dummy_file = b"dummy image data"
            files = {"file": ("test.jpg", dummy_file, "image/jpeg")}
            response = await client.post(f"{base_url}/api/ai/vision", files=files)
            if response.status_code == 200:
                data = response.json()
                detected_foods = data.get("detected_foods", [])
                print(f"   ✅ Vision Analysis: {len(detected_foods)} foods detected")
            else:
                print(f"   ❌ Vision Analysis Failed: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Vision Analysis Error: {e}")
    
    print("\n🎉 AI Service test completed!")
    print("💡 If tests failed, make sure AI service is running on port 8001")

def simple_test():
    """Simple synchronous test using requests"""
    try:
        import requests
        base_url = "http://localhost:8001"
        
        print("🧪 Simple HTTP Test")
        print("=" * 30)
        
        # Health check
        try:
            response = requests.get(f"{base_url}/health", timeout=5)
            print(f"Health Check: {response.status_code}")
            if response.status_code == 200:
                print(f"   Status: {response.json().get('status', 'N/A')}")
        except Exception as e:
            print(f"Health Check Error: {e}")
        
        # Root endpoint
        try:
            response = requests.get(f"{base_url}/", timeout=5)
            print(f"Root Endpoint: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Service: {data.get('service', 'N/A')}")
        except Exception as e:
            print(f"Root Endpoint Error: {e}")
            
    except ImportError:
        print("❌ Cả httpx và requests đều không có sẵn")
        print("💡 Cài đặt: pip install httpx requests")

if __name__ == "__main__":
    if HTTP_AVAILABLE:
        print("🚀 Running async test with httpx...")
        asyncio.run(test_ai_service())
    else:
        print("🔄 Falling back to simple test...")
        simple_test()
