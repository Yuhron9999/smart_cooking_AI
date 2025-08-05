# Google Custom Search API Setup Guide

## Hướng dẫn Thiết lập Google Custom Search API

### Bước 1: Tạo Google Custom Search Engine

1. **Truy cập Google Custom Search Console:**
   - Đi tới: https://cse.google.com/cse/
   - Đăng nhập bằng tài khoản Google của bạn

2. **Tạo Search Engine mới:**
   - Nhấp "Add" hoặc "Thêm"
   - **Sites to search**: Nhập `*` để tìm kiếm trên toàn web
   - **Name of the search engine**: `Smart Cooking AI Food Images`
   - **Language**: Vietnamese (hoặc English)
   - Nhấp "Create"

3. **Cấu hình Search Engine:**
   - Sau khi tạo, nhấp vào tên search engine
   - Trong tab "Setup":
     - **Sites to search**: Đảm bảo có `*` (search entire web)
     - Bật "Image search" trong Settings
     - **SafeSearch**: On (recommended)
   - Trong tab "Look and feel":
     - Chọn "Image search" layout
   - **Lưu lại Search Engine ID** (dạng: `1234567890abcdef:abcdefgh`)

### Bước 2: Lấy API Key

1. **Truy cập Google Cloud Console:**
   - Đi tới: https://console.cloud.google.com/
   - Chọn project `tactical-orbit-431412-v1`

2. **Enable Custom Search API:**
   - Vào "APIs & Services" > "Library"
   - Tìm "Custom Search API"
   - Nhấp "Enable"

3. **Tạo API Key (nếu chưa có):**
   - Vào "APIs & Services" > "Credentials"
   - Nhấp "Create Credentials" > "API Key"
   - Copy API key (có thể dùng chung với GOOGLE_API_KEY hiện tại)

### Bước 3: Cập nhật Environment Variables

Cập nhật file `.env` với thông tin vừa lấy:

```bash
# Google Custom Search Configuration
GOOGLE_API_KEY=AIzaSyClNKx2vTBYv6DXrCLV2lasmMqF3HRCM94
GOOGLE_CSE_ID=your_custom_search_engine_id_here
```

### Bước 4: Test API

Sau khi cập nhật `.env`, restart AI service và test:

```bash
# Test endpoint
curl -X POST http://localhost:8001/api/ai/search-food-images \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Phở Bò",
    "num_results": 3,
    "language": "vi"
  }'
```

### API Usage Limits

- **Free tier**: 100 queries/day
- **Paid tier**: $5 per 1000 queries
- Monitor usage tại: https://console.cloud.google.com/apis/api/customsearch.googleapis.com/quotas

### Troubleshooting

1. **"API key not valid"**: Kiểm tra API key và ensure Custom Search API đã enable
2. **"Invalid CSE ID"**: Đảm bảo format CSE ID đúng (có dấu `:`)
3. **"Quota exceeded"**: Đã hết quota miễn phí, cần upgrade hoặc đợi reset

### Sample Response

```json
{
  "success": true,
  "images": [
    {
      "url": "https://example.com/pho-bo.jpg",
      "title": "Phở Bò Hà Nội",
      "snippet": "Traditional Vietnamese Pho",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "width": 400,
      "height": 300
    }
  ],
  "query": "Phở Bò",
  "total_results": 1
}
```

### Notes

- Google Custom Search chỉ trả về hình ảnh công khai trên web
- Kết quả có thể khác nhau tùy theo thời gian và availability
- Nên có fallback strategy khi API fails
