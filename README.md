<<<<<<< HEAD
# Smart Cooking AI

## Mô tả dự án

Hệ thống AI thông minh hỗ trợ nấu ăn với khả năng nhận diện thực phẩm, gợi ý công thức, và hướng dẫn nấu ăn từng bước.

## Kiến trúc hệ thống

### Frontend (React.js)

- Giao diện người dùng hiện đại
- Chụp ảnh và nhận diện thực phẩm
- Hiển thị công thức và hướng dẫn nấu ăn
- Chat bot AI tương tác

### Backend (Node.js/Express)

- API RESTful
- Xử lý authentication và authorization
- Tích hợp với AI/ML models
- Quản lý database

### AI/ML Components

- TensorFlow.js cho nhận diện ảnh
- OpenAI GPT API cho gợi ý công thức
- Computer Vision cho phân tích thực phẩm

### Database

- MongoDB cho dữ liệu chính
- Redis cho caching

## Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js 18+
- MongoDB
- Redis
- Python 3.8+ (cho ML models)

### Cài đặt

1. Clone repository:

```bash
git clone https://github.com/yourusername/SmartCookingAI_2.git
cd SmartCookingAI_2
```

2. Cài đặt dependencies cho backend:

```bash
cd backend
npm install
```

3. Cài đặt dependencies cho frontend:

```bash
cd ../frontend
npm install
```

4. Cài đặt dependencies cho AI service:

```bash
cd ../ai-service
pip install -r requirements.txt
```

5. Cấu hình environment variables:

```bash
cp .env.example .env
# Chỉnh sửa file .env với thông tin cấu hình
```

6. Khởi chạy services:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start

# Terminal 3 - AI Service
cd ai-service && python app.py
```

## API Documentation

### Authentication

- POST /api/auth/register - Đăng ký tài khoản
- POST /api/auth/login - Đăng nhập
- POST /api/auth/logout - Đăng xuất

### Food Recognition

- POST /api/food/recognize - Nhận diện thực phẩm từ ảnh
- GET /api/food/ingredients - Lấy danh sách nguyên liệu

### Recipes

- GET /api/recipes - Lấy danh sách công thức
- GET /api/recipes/:id - Lấy chi tiết công thức
- POST /api/recipes/suggest - Gợi ý công thức từ nguyên liệu

### Chat

- POST /api/chat/message - Gửi tin nhắn đến AI bot

## Tính năng chính

1. **Nhận diện thực phẩm**: Chụp ảnh và AI sẽ nhận diện các loại thực phẩm
2. **Gợi ý công thức**: Dựa trên nguyên liệu có sẵn, AI gợi ý công thức phù hợp
3. **Hướng dẫn nấu ăn**: Từng bước chi tiết với hình ảnh minh họa
4. **Chat bot**: Tương tác với AI để hỏi đáp về nấu ăn
5. **Quản lý thực đơn**: Lập kế hoạch bữa ăn hàng tuần
6. **Cộng đồng**: Chia sẻ công thức và đánh giá

## Công nghệ sử dụng

- **Frontend**: React.js, Material-UI, Axios
- **Backend**: Node.js, Express.js, JWT, Bcrypt
- **Database**: MongoDB, Mongoose, Redis
- **AI/ML**: TensorFlow.js, OpenAI API, Computer Vision
- **DevOps**: Docker, GitHub Actions, AWS

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Liên hệ

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/SmartCookingAI_2](https://github.com/yourusername/SmartCookingAI_2)
=======
# smart_cooking_AI
>>>>>>> 2cb362a114f67e50dce8bb604963523625ccae61
