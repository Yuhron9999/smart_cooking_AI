#!/usr/bin/env python3
"""
Test Google Service Integration
Quick validation script
"""

import asyncio
import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from google_service_manager import google_service_manager

async def quick_test():
    """Quick test of Google Service integration"""
    print("🧪 Quick Google Service Test")
    print("=" * 50)
    
    # Test 1: Service Manager Info
    print("1️⃣ Testing Service Manager...")
    try:
        print(f"   ✅ Service Account File: {google_service_manager.service_account_file}")
        print(f"   🆔 Project ID: {google_service_manager.project_id}")
        print(f"   � Has Credentials: {google_service_manager.credentials is not None}")
        print(f"   🤖 Has Gemini Client: {google_service_manager.gemini_client is not None}")
    except Exception as e:
        print(f"   ❌ Service Manager Error: {e}")
    
    # Test 2: Recipe Generation
    print("\n2️⃣ Testing Recipe Generation...")
    try:
        recipe = await google_service_manager.generate_recipe_with_gemini(
            ingredients=["cà chua", "trứng", "hành"],
            language="vi"
        )
        if recipe:
            print(f"   ✅ Recipe Generated: {recipe.get('title', 'N/A')[:50]}...")
            print(f"   🍳 Cooking Time: {recipe.get('cooking_time', 'N/A')}")
        else:
            print("   ⚠️ Recipe generation returned None (using mock)")
    except Exception as e:
        print(f"   ❌ Recipe Generation Error: {e}")
    
    # Test 3: Regional Suggestions
    print("\n3️⃣ Testing Regional Suggestions...")
    try:
        suggestions = google_service_manager.get_regional_suggestions(
            latitude=21.0285,  # Hà Nội
            longitude=105.8542,
            language="vi"
        )
        print(f"   ✅ Region: {suggestions.get('region', 'N/A')}")
        print(f"   🍜 Suggestions: {suggestions.get('suggestions', [])[:3]}")
    except Exception as e:
        print(f"   ❌ Regional Suggestions Error: {e}")
    
    print("\n🎉 Quick test completed!")
    print("💡 Run 'py start_service.py' to start the full service")

if __name__ == "__main__":
    asyncio.run(quick_test())
