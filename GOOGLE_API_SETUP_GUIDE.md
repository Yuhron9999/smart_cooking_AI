# Hướng dẫn tạo Google API Key đúng cách cho Smart Cooking AI

## Bước 1: Truy cập Google Cloud Console

1. Vào: https://console.cloud.google.com/
2. Chọn project "smart_cooking2" (hoặc tạo mới)

## Bước 2: Enable APIs

1. Vào **APIs & Services** > **Library**
2. Tìm và enable các APIs sau:
   - ✅ **Maps JavaScript API**
   - ✅ **Geocoding API**
   - ✅ **Places API**
   - ✅ **Maps Static API**
   - ✅ **Directions API**
   - ✅ **Distance Matrix API**

## Bước 3: Tạo API Key (KHÔNG phải Service Account)

1. Vào **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **API key**
3. Copy API key mới tạo (ví dụ: AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)

## Bước 4: Restrict API Key (Optional nhưng recommended)

1. Click vào API key vừa tạo
2. Trong **API restrictions**, chọn **Restrict key**
3. Select APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
   - Directions API
4. Trong **Application restrictions** (optional):
   - HTTP referrers: localhost:3000, localhost:8080
   - IP addresses: your server IP

## Bước 5: Test API Key

```bash
# Test với API key mới
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Hanoi&key=YOUR_NEW_API_KEY"
```

## Lưu ý quan trọng:

- ❌ KHÔNG dùng Service Account Key cho Maps API
- ✅ Dùng API Key được tạo từ "CREATE CREDENTIALS" > "API key"
- ✅ Enable đầy đủ các APIs cần thiết
- ✅ Restrict API key để bảo mật
