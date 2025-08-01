"""
Test Script đơn giản cho Google Service
Kiểm tra nhanh API keys và kết nối
"""

import os
import sys
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_env_vars():
    """Kiểm tra biến môi trường"""
    print("🔍 KIỂM TRA BIẾN MÔI TRƯỜNG")
    print("=" * 40)
    
    vars_to_check = [
        "GEMINI_API_KEY",
        "GOOGLE_API_KEY", 
        "VISION_API_KEY",
        "GOOGLE_SERVICE_ACCOUNT_FILE"
    ]
    
    for var in vars_to_check:
        value = os.getenv(var)
        if value:
            # Mask API keys for security
            if "KEY" in var:
                masked = value[:8] + "..." + value[-8:] if len(value) > 16 else value
                print(f"✅ {var}: {masked}")
            else:
                print(f"✅ {var}: {value}")
        else:
            print(f"❌ {var}: Không tìm thấy")

def test_service_account_file():
    """Kiểm tra file service account"""
    print("\n🔍 KIỂM TRA SERVICE ACCOUNT FILE")
    print("=" * 40)
    
    file_path = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE")
    if not file_path:
        print("❌ Không tìm thấy GOOGLE_SERVICE_ACCOUNT_FILE trong .env")
        return False
        
    print(f"📁 Đường dẫn: {file_path}")
    
    if os.path.exists(file_path):
        print("✅ File tồn tại")
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            print(f"📧 Client email: {data.get('client_email', 'N/A')}")
            print(f"🆔 Project ID: {data.get('project_id', 'N/A')}")
            return True
        except Exception as e:
            print(f"❌ Lỗi đọc file: {e}")
            return False
    else:
        print("❌ File không tồn tại")
        return False

def test_gemini_simple():
    """Test Gemini API đơn giản"""
    print("\n🤖 KIỂM TRA GEMINI API")
    print("=" * 40)
    
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("❌ Không tìm thấy GEMINI_API_KEY")
        return False
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=gemini_key)
        
        # List available models
        print("📋 Danh sách models có sẵn:")
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                print(f"  ✅ {model.name}")
        
        # Test với model mới
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Chào bạn!")
        
        print("✅ Gemini API hoạt động!")
        print(f"📝 Phản hồi: {response.text[:100]}...")
        return True
        
    except Exception as e:
        print(f"❌ Lỗi Gemini API: {e}")
        return False

def test_vision_simple():
    """Test Vision API đơn giản"""  
    print("\n🖼️ KIỂM TRA VISION API")
    print("=" * 40)
    
    vision_key = os.getenv("VISION_API_KEY")
    if not vision_key:
        print("❌ Không tìm thấy VISION_API_KEY")
        return False
    
    try:
        import requests
        
        # Test với ảnh mẫu đơn giản
        test_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Vd-orig.jpg/256px-Vd-orig.jpg"
        endpoint = f"https://vision.googleapis.com/v1/images:annotate?key={vision_key}"
        
        payload = {
            "requests": [{
                "image": {"source": {"imageUri": test_url}},
                "features": [{"type": "LABEL_DETECTION", "maxResults": 3}]
            }]
        }
        
        response = requests.post(endpoint, json=payload, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            labels = result["responses"][0].get("labelAnnotations", [])
            print("✅ Vision API hoạt động!")
            print("🏷️ Nhãn phát hiện:")
            for label in labels:
                print(f"  - {label['description']} ({label['score']:.2f})")
            return True
        else:
            print(f"❌ Vision API lỗi: {response.status_code}")
            print(f"📝 Chi tiết: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Lỗi Vision API: {e}")
        return False

def main():
    """Chạy tất cả test"""
    print("🚀 SMART COOKING AI - GOOGLE SERVICE TEST")
    print("=" * 50)
    
    # Test environment
    test_env_vars()
    
    # Test service account
    sa_result = test_service_account_file()
    
    # Test APIs
    gemini_result = test_gemini_simple()
    vision_result = test_vision_simple()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TỔNG KẾT")
    print("=" * 50)
    
    results = [
        ("Service Account File", sa_result),
        ("Gemini AI API", gemini_result), 
        ("Vision AI API", vision_result)
    ]
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{name:20} : {status}")
    
    print(f"\n🎯 Kết quả: {passed}/{total} test thành công")
    
    if passed == total:
        print("🎉 TẤT CẢ ĐỀU THÀNH CÔNG!")
        print("✅ Google Services đã sẵn sàng cho Smart Cooking AI")
    elif passed > 0:
        print("⚠️ Một số service hoạt động. Kiểm tra lại các lỗi.")
    else:
        print("🚨 Tất cả đều thất bại. Kiểm tra lại cấu hình .env")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
