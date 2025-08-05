# 🔑 Hướng dẫn Lấy Google Vision API Key

## **Bước 1: Truy cập Google Cloud Console**

1. Đi tới: https://console.cloud.google.com/
2. Đăng nhập bằng tài khoản Google của bạn
3. Chọn project **tactical-orbit-431412-v1** (hoặc tạo project mới)

## **Bước 2: Enable Google Vision API**

1. **Vào "APIs & Services" > "Library"**
2. **Tìm kiếm "Cloud Vision API"**
3. **Click "Enable"** để kích hoạt API

## **Bước 3: Tạo API Credentials**

### **Option 1: Sử dụng API Key (Đơn giản - Recommended)**

1. **Vào "APIs & Services" > "Credentials"**
2. **Click "Create Credentials" > "API Key"**
3. **Copy API Key** được tạo ra
4. **Click "Restrict Key"** để bảo mật:
   - **API restrictions**: Chọn "Cloud Vision API"
   - **Application restrictions**: Chọn "HTTP referrers" và thêm:
     - `http://localhost:*`
     - `https://yourdomain.com/*`

### **Option 2: Service Account (Bảo mật cao hơn)**

1. **Vào "APIs & Services" > "Credentials"**
2. **Click "Create Credentials" > "Service Account"**
3. **Điền thông tin:**
   - **Service account name**: `smart-cooking-vision`
   - **Description**: `Smart Cooking AI Vision Service`
4. **Grant permissions**: Chọn role "Cloud Vision User"
5. **Click "Done"**
6. **Click vào service account vừa tạo**
7. **Vào tab "Keys" > "Add Key" > "Create new key"**
8. **Chọn "JSON" và download file**

## **Bước 4: Cập nhật Environment Variables**

### **Nếu dùng API Key:**

```bash
# Thêm vào .env file
GOOGLE_VISION_API_KEY=your-api-key-here
```

### **Nếu dùng Service Account:**

```bash
# Thêm vào .env file
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
GOOGLE_PROJECT_ID=tactical-orbit-431412-v1
```

## **Bước 5: Test API**

Tạo file test đơn giản:

```python
import os
from google.cloud import vision

# Set credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'path/to/key.json'
# OR
os.environ['GOOGLE_VISION_API_KEY'] = 'your-api-key'

def test_vision_api():
    client = vision.ImageAnnotatorClient()

    # Test với image URL
    image = vision.Image()
    image.source.image_uri = 'https://images.unsplash.com/photo-1555126634-323283e090fa'

    response = client.label_detection(image=image)
    labels = response.annotations

    print('Labels:')
    for label in labels:
        print(f"- {label.description}: {label.score:.2f}")

if __name__ == '__main__':
    test_vision_api()
```

## **Bước 6: Cấu hình AI Service**

Cập nhật file `.env` trong thư mục `ai-service`:

```bash
# Google Vision API Configuration
GOOGLE_VISION_API_KEY=AIzaSyDjD7YqLBJLdlnD0AZyNqGdS5ynxkdXGQY
GOOGLE_PROJECT_ID=tactical-orbit-431412-v1
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```

## **Bước 7: Install Dependencies**

```bash
cd ai-service
pip install google-cloud-vision
```

## **Bước 8: Test Integration**

Restart AI service và test endpoint:

```bash
# Test image analysis
curl -X POST "http://localhost:8001/api/ai/analyze-food-image" \
  -F "file=@path/to/food-image.jpg"

# Test image search
curl -X POST "http://localhost:8001/api/ai/search-food-images" \
  -H "Content-Type: application/json" \
  -d '{"dish_name": "pho bo", "max_results": 5}'
```

## **🚨 Quan trọng - Bảo mật:**

1. **Không commit API keys vào Git**
2. **Sử dụng .env files cho local development**
3. **Sử dụng environment variables cho production**
4. **Enable API restrictions trong Google Cloud Console**
5. **Monitor usage để tránh vượt quota**

## **💰 Pricing Information:**

- **Free tier**: 1,000 requests/month
- **Paid tier**: $1.50 per 1,000 requests
- **Monitor usage**: https://console.cloud.google.com/billing

## **🔧 Troubleshooting:**

1. **"API not enabled"**: Enable Cloud Vision API
2. **"Invalid API key"**: Check key và restrictions
3. **"Quota exceeded"**: Upgrade plan hoặc đợi reset
4. **"Permission denied"**: Kiểm tra service account roles

## **📞 Support:**

- Google Cloud Documentation: https://cloud.google.com/vision/docs
- Stack Overflow: Tag `google-cloud-vision`
- GitHub Issues: Create issue in repository
