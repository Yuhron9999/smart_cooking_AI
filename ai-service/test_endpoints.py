#!/usr/bin/env python3
"""
Test AI Service Endpoints
Verify AI service is working correctly
"""

import asyncio
import aiohttp
import json
from typing import Dict, Any

async def test_ai_service() -> None:
    """Test AI service endpoints"""
    base_url = "http://localhost:8001"
    
    print("🧪 Testing Smart Cooking AI Service")
    print("=" * 50)
    
    async with aiohttp.ClientSession() as session:
        # Test 1: Health Check
        print("1️⃣ Testing Health Check...")
        try:
            async with session.get(f"{base_url}/health") as response:
                if response.status == 200:
                    data: Dict[str, Any] = await response.json()
                    print(f"   ✅ Health Check: {data.get('status', 'N/A')}")
                    print(f"   📧 Service Account: {data.get('service_account', 'N/A')}")
                else:
                    print(f"   ❌ Health Check Failed: {response.status}")
        except Exception as e:
            print(f"   ❌ Health Check Error: {e}")
        
        # Test 2: Recipe Generation
        print("\n2️⃣ Testing Recipe Generation...")
        try:
            payload = {
                "ingredients": ["cà chua", "trứng", "hành tây"],
                "language": "vi"
            }
            async with session.post(f"{base_url}/api/ai/generate-recipe", 
                                  json=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✅ Recipe: {data.get('title', 'N/A')[:40]}...")
                    print(f"   🍳 Time: {data.get('cooking_time', 'N/A')}")
                else:
                    print(f"   ❌ Recipe Generation Failed: {response.status}")
                    error_text = await response.text()
                    print(f"   Error: {error_text[:100]}...")
        except Exception as e:
            print(f"   ❌ Recipe Generation Error: {e}")
        
        # Test 3: Regional Suggestions
        print("\n3️⃣ Testing Regional Suggestions...")
        try:
            payload = {
                "latitude": 21.0285,
                "longitude": 105.8542,
                "language": "vi"
            }
            async with session.post(f"{base_url}/api/ai/regional-suggestions", 
                                  json=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✅ Region: {data.get('region', 'N/A')}")
                    print(f"   🍜 Suggestions: {len(data.get('suggestions', []))} items")
                else:
                    print(f"   ❌ Regional Suggestions Failed: {response.status}")
        except Exception as e:
            print(f"   ❌ Regional Suggestions Error: {e}")
    
    print("\n🎉 AI Service test completed!")

if __name__ == "__main__":
    asyncio.run(test_ai_service())
