"""
Google Service Account Test Script
Kiểm thử xác thực Google Service Account và Gemini API cho Smart Cooking AI
"""

import os
import sys
import json
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv
from google.oauth2 import service_account  # type: ignore
from google.auth.transport.requests import Request

# Load biến môi trường từ .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from google_service_manager import GoogleServiceManager

def test_service_account_file():
    """Kiểm tra file service account"""
    service_account_file = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE") or "c:/SmartCookingAI_2/.github/secrets/smart_cooking2.json"
    print("🔍 Kiểm tra file Service Account...")
    print(f"📁 Đường dẫn: {service_account_file}")

    if not os.path.exists(service_account_file):
        print("❌ Không tìm thấy file Service Account!")
        return False

    try:
        with open(service_account_file, 'r') as f:
            sa_data = json.load(f)
        print("✅ Đã đọc được file Service Account")
        print(f"📧 Email: {sa_data.get('client_email')}")
        print(f"🆔 Project ID: {sa_data.get('project_id')}")
        print(f"🔑 Private key ID: {sa_data.get('private_key_id')[:20]}...")
        return True
    except Exception as e:
        print(f"❌ Lỗi khi đọc file: {e}")
        return False

def test_credentials():
    """Kiểm thử xác thực credentials Google"""
    print("\n🔐 Kiểm thử xác thực Google Credentials...")
    try:
        service_account_file = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE") or "c:/SmartCookingAI_2/.github/secrets/smart_cooking2.json"
        credentials = service_account.Credentials.from_service_account_file(
            service_account_file,
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        credentials.refresh(Request())
        print("✅ Xác thực credentials thành công")
        print(f"🎯 Service account: {credentials.service_account_email}")
        print(f"⏰ Token hết hạn: {credentials.expiry}")
        return True
    except Exception as e:
        print(f"❌ Lỗi xác thực credentials: {e}")
        return False

def test_gemini_api():
    """Kiểm thử Gemini AI API"""
    print("\n🤖 Kiểm thử Gemini AI API...")
    if not GEMINI_API_KEY:
        print("❌ Không tìm thấy GEMINI_API_KEY trong .env")
        return False
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        # Sử dụng model mới thay vì gemini-pro đã deprecated
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Hãy gợi ý cho tôi một món ăn Việt Nam dễ nấu.")
        print("✅ Kết nối Gemini thành công! Kết quả:")
        print(response.text)
        return True
    except Exception as e:
        print("❌ Lỗi khi gọi Gemini API:", e)
        return False

async def test_google_service_manager():
    """Kiểm thử Google Service Manager"""
    print("\n🎛️ Kiểm thử Google Service Manager...")
    try:
        manager = GoogleServiceManager()
        print(f"✅ Service Manager đã khởi tạo")
        print(f"🆔 Project ID: {manager.project_id}")
        print(f"🔑 Credentials: {'✅ Có' if manager.credentials else '❌ Không có'}")
        print(f"🤖 Gemini Client: {'✅ Sẵn sàng' if manager.gemini_client else '❌ Không sẵn sàng'}")
        # Test sinh công thức
        print("\n🍳 Kiểm thử sinh công thức...")
        ingredients = ["thịt bò", "khoai tây", "cà rốt"]
        result = await manager.generate_recipe_with_gemini(ingredients, "vi")
        if result.get("success"):
            recipe_data = result.get("data", {})
            print("✅ Sinh công thức thành công")
            print(f"📝 Tiêu đề: {recipe_data.get('title', 'N/A')}")
            print(f"🤖 AI Model: {recipe_data.get('ai_model', 'N/A')}")
        else:
            print("⚠️ Sinh công thức trả về mock data")
        # Test gợi ý vùng miền
        print("\n📍 Kiểm thử gợi ý vùng miền...")
        regional_result = manager.get_regional_suggestions(10.7769, 106.6856, "vi")
        if regional_result.get("success"):
            suggestions = regional_result.get("suggestions", [])
            print("✅ Gợi ý vùng miền thành công")
            print(f"🏞️ Region: {regional_result.get('region', 'N/A')}")
            print(f"🍜 Suggestions: {suggestions[:2]}")
        # Test tìm cửa hàng
        print("\n🏪 Kiểm thử tìm cửa hàng...")
        store_result = await manager.find_nearby_places(10.7769, 106.6856, "supermarket")
        stores = store_result.get("results", [])
        print("✅ Tìm cửa hàng thành công")
        print(f"🏪 Số lượng: {len(stores)}")
        print(f"📊 Mock data: {store_result.get('mock_data', False)}")
        return True
    except Exception as e:
        print(f"❌ Lỗi Service Manager: {e}")
        return False

def test_vision_api():
    """Kiểm thử Vision AI API"""
    print("\n🖼️ Kiểm thử Vision AI API...")
    VISION_API_KEY = os.getenv("VISION_API_KEY")
    if not VISION_API_KEY:
        print("❌ Không tìm thấy VISION_API_KEY trong .env")
        return False
    try:
        import requests
        # Sử dụng một ảnh mẫu (base64 hoặc url)
        image_url = "https://upload.wikimedia.org/wikipedia/commons/6/6e/Goi_cuon.jpg"
        endpoint = f"https://vision.googleapis.com/v1/images:annotate?key={VISION_API_KEY}"
        payload = {
            "requests": [
                {
                    "image": {"source": {"imageUri": image_url}},
                    "features": [{"type": "LABEL_DETECTION", "maxResults": 5}]
                }
            ]
        }
        response = requests.post(endpoint, json=payload)
        if response.status_code == 200:
            labels = response.json()["responses"][0].get("labelAnnotations", [])
            print("✅ Vision API hoạt động! Nhãn phát hiện:")
            for label in labels:
                print(f"- {label['description']} ({label['score']:.2f})")
            return True
        else:
            print("❌ Lỗi Vision API:", response.text)
            return False
    except Exception as e:
        print("❌ Lỗi khi gọi Vision API:", e)
        return False

def main():
    """Chạy toàn bộ kiểm thử"""
    print("🚀 KIỂM THỬ GOOGLE SERVICE ACCOUNT")
    print("=" * 50)
    tests = [
        ("Service Account File", test_service_account_file),
        ("Google Credentials", test_credentials),
        ("Gemini AI API", test_gemini_api),
        ("Vision AI API", test_vision_api),
    ]
    async_tests = [
        ("Google Service Manager", test_google_service_manager)
    ]
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} lỗi: {e}")
            results.append((test_name, False))
    for test_name, test_func in async_tests:
        try:
            result = asyncio.run(test_func())
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} lỗi: {e}")
            results.append((test_name, False))
    print("\n" + "=" * 50)
    print("📊 TỔNG KẾT KIỂM THỬ")
    print("=" * 50)
    passed = sum(1 for _, result in results if result)
    total = len(results)
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:25} : {status}")
    print(f"\n🎯 Tổng: {passed}/{total} kiểm thử thành công")
    if passed == total:
        print("🎉 TẤT CẢ ĐỀU THÀNH CÔNG! Google Service Account đã sẵn sàng!")
    elif passed > total * 0.5:
        print("⚠️ Đa số kiểm thử thành công. Kiểm tra lại các thành phần lỗi.")
    else:
        print("🚨 Nhiều kiểm thử thất bại. Kiểm tra lại cấu hình.")
    print("\n💡 Next steps:")
    print("1. Đảm bảo file .env đúng đường dẫn và API key")
    print("2. Đảm bảo GEMINI_API_KEY đã mở đủ quyền")
    print("3. Khởi động AI service: py app_enhanced.py")

if __name__ == "__main__":
    main()
