"""
Smart Cooking AI Service - Clean Version
FastAPI service hoạt động ổn định không lỗi
"""

import os
import logging
from datetime import datetime
from typing import List, Dict, Optional, Any

# Import với error handling
try:
    from fastapi import FastAPI, HTTPException, File, UploadFile
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import JSONResponse
    from pydantic import BaseModel, Field
    fastapi_available = True
except ImportError as e:
    print(f"❌ FastAPI import error: {e}")
    fastapi_available = False
    # Fallback types để tránh lỗi
    FastAPI = None
    HTTPException = None
    File = None
    UploadFile = None
    CORSMiddleware = None
    JSONResponse = None
    BaseModel = object
    Field = None

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("⚠️ python-dotenv not available")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if not fastapi_available:
    print("❌ Cannot start service: FastAPI dependencies missing")
    print("💡 Install: pip install fastapi uvicorn pydantic python-dotenv")
    exit(1)

# API Keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "your_google_api_key_here")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here")
print("GEMINI_API_KEY:", os.getenv("GEMINI_API_KEY"))

# Initialize FastAPI app
if fastapi_available:
    app: FastAPI = FastAPI(
        title="Smart Cooking AI Service",
        description="AI Service for Smart Cooking App - Clean Version",
        version="1.0.0"
    )
else:
    app: Optional[FastAPI] = None

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class RecipeRequest(BaseModel):
    ingredients: List[str] = Field(..., description="List of ingredients")
    language: Optional[str] = Field(default="vi", description="Response language")
    cooking_time: Optional[int] = Field(default=30, description="Cooking time in minutes")
    difficulty: Optional[str] = Field(default="medium", description="Difficulty level")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message")
    language: Optional[str] = Field(default="vi", description="Response language")

class LocationRequest(BaseModel):
    latitude: float = Field(..., description="User latitude")
    longitude: float = Field(..., description="User longitude")
    language: Optional[str] = Field(default="vi", description="Response language")

# Mock AI Service Class
class SmartCookingAI:
    def __init__(self):
        self.google_api_available = bool(GOOGLE_API_KEY)
        self.gemini_api_available = bool(GEMINI_API_KEY)
        logger.info(f"✅ SmartCookingAI initialized")
        if self.google_api_available:
            logger.info(f"✅ Google API configured")
        if self.gemini_api_available:
            logger.info(f"✅ Gemini API configured")

    def generate_recipe(self, ingredients: List[str], language: str = "vi", 
                       cooking_time: int = 30, difficulty: str = "medium") -> Dict[str, Any]:
        """Generate recipe from ingredients"""
        ingredients_text = ", ".join(ingredients)
        
        if language == "vi":
            return {
                "success": True,
                "title": f"Món ăn ngon từ {ingredients[0] if ingredients else 'nguyên liệu có sẵn'}",
                "description": f"Một món ăn tuyệt vời được chế biến từ {ingredients_text}",
                "cooking_time": f"{cooking_time} phút",
                "difficulty": difficulty,
                "servings": 4,
                "ingredients": [
                    f"• {ing} - theo khẩu phần" for ing in ingredients
                ],
                "instructions": [
                    "1. Chuẩn bị tất cả nguyên liệu cần thiết",
                    "2. Sơ chế nguyên liệu sạch sẽ, thái nhỏ vừa ăn",
                    "3. Ướp và tẩm gia vị theo công thức truyền thống",
                    "4. Nấu với lửa vừa trong thời gian quy định",
                    "5. Nêm nấp gia vị cho vừa khẩu vị",
                    "6. Trang trí đẹp mắt và thưởng thức khi còn nóng"
                ],
                "tips": [
                    "💡 Chọn nguyên liệu tươi ngon, không ôi thiu",
                    "💡 Nêm nấp từ từ để đạt được vị chuẩn",
                    "💡 Có thể thay đổi gia vị theo khẩu vị gia đình",
                    "💡 Kết hợp với rau sống để tăng vitamin"
                ],
                "nutrition": {
                    "calories": 380,
                    "protein": "28g",
                    "carbs": "45g",
                    "fat": "14g",
                    "fiber": "8g"
                },
                "category": "Món chính",
                "region": "Việt Nam",
                "language": "vi",
                "ai_model": "Smart Cooking AI Mock",
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "success": True,
                "title": f"Delicious dish with {ingredients[0] if ingredients else 'available ingredients'}",
                "description": f"A wonderful dish made from {ingredients_text}",
                "cooking_time": f"{cooking_time} minutes",
                "difficulty": difficulty,
                "servings": 4,
                "ingredients": [
                    f"• {ing} - as needed" for ing in ingredients
                ],
                "instructions": [
                    "1. Prepare all necessary ingredients",
                    "2. Clean and chop ingredients into suitable sizes",
                    "3. Marinate and season according to traditional recipes",
                    "4. Cook on medium heat for the specified time",
                    "5. Season to taste",
                    "6. Garnish beautifully and serve hot"
                ],
                "tips": [
                    "💡 Choose fresh, high-quality ingredients",
                    "💡 Season gradually for perfect taste",
                    "💡 Adjust spices according to family preference",
                    "💡 Combine with fresh vegetables for vitamins"
                ],
                "nutrition": {
                    "calories": 380,
                    "protein": "28g",
                    "carbs": "45g",
                    "fat": "14g",
                    "fiber": "8g"
                },
                "category": "Main Course",
                "region": "Vietnam",
                "language": "en",
                "ai_model": "Smart Cooking AI Mock",
                "timestamp": datetime.now().isoformat()
            }

    def chat_response(self, message: str, language: str = "vi") -> Dict[str, Any]:
        """Generate chat response"""
        if language == "vi":
            responses = [
                f"Xin chào! Tôi là trợ lý AI nấu ăn thông minh. Bạn vừa hỏi: '{message}'",
                "",
                "🍳 Tôi có thể giúp bạn:",
                "• Tạo công thức nấu ăn từ nguyên liệu có sẵn",
                "• Gợi ý món ăn theo vùng miền", 
                "• Phân tích dinh dưỡng món ăn",
                "• Tư vấn kỹ thuật nấu nướng",
                "• Lên lộ trình học nấu ăn cá nhân",
                "",
                "Bạn có câu hỏi gì khác về nấu ăn không? 😊"
            ]
            response_text = "\n".join(responses)
        else:
            responses = [
                f"Hello! I'm your Smart Cooking AI assistant. You asked: '{message}'",
                "",
                "🍳 I can help you with:",
                "• Create recipes from available ingredients",
                "• Suggest regional dishes",
                "• Analyze nutrition in meals",
                "• Provide cooking techniques advice", 
                "• Create personalized cooking learning paths",
                "",
                "Do you have any other cooking questions? 😊"
            ]
            response_text = "\n".join(responses)
        
        return {
            "success": True,
            "response": response_text,
            "language": language,
            "conversation_id": f"chat_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.now().isoformat()
        }

    def get_regional_suggestions(self, lat: float, lng: float, language: str = "vi") -> Dict[str, Any]:
        """Get regional food suggestions"""
        # Detect Vietnam region
        if lat > 20.0:  # North Vietnam
            region = "miền Bắc" if language == "vi" else "Northern Vietnam"
            region_code = "north"
        elif lat > 16.0:  # Central Vietnam  
            region = "miền Trung" if language == "vi" else "Central Vietnam"
            region_code = "central"
        else:  # South Vietnam
            region = "miền Nam" if language == "vi" else "Southern Vietnam"
            region_code = "south"
        
        regional_dishes = {
            "north": {
                "vi": [
                    "🍜 Phở Hà Nội - Món quốc hồn quốc túy",
                    "🥖 Bún chả - Đặc sản thủ đô",
                    "🐟 Chả cá Lã Vọng - Hương vị truyền thống",
                    "🥟 Bánh cuốn - Thanh đạm sáng mai",
                    "🥒 Nem chua - Chua ngọt đặc biệt"
                ],
                "en": [
                    "🍜 Hanoi Pho - National soul dish", 
                    "🥖 Bun Cha - Capital specialty",
                    "🐟 Cha Ca La Vong - Traditional flavor",
                    "🥟 Banh Cuon - Light morning meal",
                    "🥒 Nem Chua - Special sweet & sour"
                ]
            },
            "central": {
                "vi": [
                    "🍲 Bún bò Huế - Cay nồng miền Trung",
                    "🍜 Mì Quảng - Đậm đà Quảng Nam",
                    "🥘 Cao lầu - Đặc sản Hội An",
                    "🥞 Bánh khoái - Giòn tan Huế",
                    "🍡 Bánh bèo - Nhỏ nhắn tinh tế"
                ],
                "en": [
                    "🍲 Hue Beef Noodle Soup - Spicy Central flavor",
                    "🍜 Mi Quang - Rich Quang Nam dish", 
                    "🥘 Cao Lau - Hoi An specialty",
                    "🥞 Banh Khoai - Crispy Hue pancake",
                    "🍡 Banh Beo - Delicate small cakes"
                ]
            },
            "south": {
                "vi": [
                    "🥗 Bún thịt nướng - Tươi mát miền Nam",
                    "🥞 Bánh xèo - Giòn rụm vàng ươm",
                    "🍜 Hủ tiếu - Thanh ngọt Sài Gòn",
                    "🍮 Chè ba màu - Mát lạnh ngọt ngào",
                    "🥖 Bánh mì - Fusion đặc biệt"
                ],
                "en": [
                    "🥗 Grilled Pork Vermicelli - Fresh Southern style",
                    "🥞 Banh Xeo - Crispy golden pancake",
                    "🍜 Hu Tieu - Sweet Saigon noodles", 
                    "🍮 Three-Color Dessert - Cool sweet treat",
                    "🥖 Banh Mi - Special fusion sandwich"
                ]
            }
        }
        
        suggestions = regional_dishes.get(region_code, {}).get(language, [])
        
        return {
            "success": True,
            "region": region,
            "region_code": region_code,
            "location": {"latitude": lat, "longitude": lng},
            "suggestions": suggestions,
            "message": f"🍜 Gợi ý món ăn đặc trưng {region}" if language == "vi" else f"🍜 Food suggestions for {region}",
            "total_suggestions": len(suggestions),
            "timestamp": datetime.now().isoformat()
        }

    def analyze_image(self) -> Dict[str, Any]:
        """Mock image analysis"""
        return {
            "success": True,
            "detected_foods": [
                {
                    "name": "Phở bò",
                    "confidence": 0.95,
                    "category": "vietnamese_noodles",
                    "region": "Northern Vietnam"
                },
                {
                    "name": "Bánh mì",
                    "confidence": 0.87,
                    "category": "vietnamese_sandwich", 
                    "region": "Southern Vietnam"
                }
            ],
            "nutrition_estimate": {
                "calories": 450,
                "protein": "22g",
                "carbs": "58g",
                "fat": "16g",
                "fiber": "6g",
                "sodium": "980mg"
            },
            "recipe_suggestions": [
                "Phở bò Hà Nội truyền thống",
                "Bánh mì pate đặc biệt",
                "Phở gà thơm ngon"
            ],
            "cooking_tips": [
                "🍲 Nước dùng phở cần ninh xương từ 6-8 tiếng",
                "🥖 Bánh mì giòn tan cần nướng ở 180°C trong 5 phút",
                "🌿 Rau thơm ăn kèm nên ngâm nước đá cho tươi"
            ],
            "mock_data": True,
            "timestamp": datetime.now().isoformat()
        }

# Initialize AI service
ai_service = SmartCookingAI()

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "Smart Cooking AI Service",
        "version": "1.0.0",
        "status": "running",
        "description": "AI-powered cooking assistant for Vietnamese cuisine",
        "features": {
            "google_api": ai_service.google_api_available,
            "gemini_ai": ai_service.gemini_api_available,
            "recipe_generation": True,
            "image_analysis": True,
            "regional_suggestions": True,
            "chat_assistant": True
        },
        "endpoints": [
            "GET /health - Health check",
            "POST /api/ai/generate-recipe - Generate recipes",
            "POST /api/ai/chat - Chat with AI",
            "POST /api/ai/vision - Analyze food images",
            "POST /api/ai/regional-suggestions - Get regional food suggestions",
            "POST /api/ai/ingredient-suggestions - Get ingredient suggestions",
            "POST /api/ai/learning-path - Get cooking learning path",
            "POST /api/ai/nutrition-analysis - Analyze nutrition"
        ],
        "supported_languages": ["vi", "en"],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Smart Cooking AI Service",
        "version": "1.0.0",
        "uptime": "running",
        "google_api": "configured" if ai_service.google_api_available else "missing",
        "gemini_api": "configured" if ai_service.gemini_api_available else "missing",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/ai/generate-recipe")
async def generate_recipe(request: RecipeRequest):
    """Generate cooking recipe from ingredients"""
    try:
        result = ai_service.generate_recipe(
            ingredients=request.ingredients,
            language=request.language or "vi",
            cooking_time=request.cooking_time or 30,
            difficulty=request.difficulty or "medium"
        )
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Recipe generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Recipe generation failed: {str(e)}")

@app.post("/api/ai/chat")
async def chat_with_ai(request: ChatRequest):
    """Chat with AI cooking assistant"""
    try:
        result = ai_service.chat_response(
            message=request.message,
            language=request.language or "vi"
        )
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@app.post("/api/ai/vision")
async def analyze_food_image(file: UploadFile = File(...)):
    """Analyze food image using AI"""
    try:
        # For now, return mock analysis
        result = ai_service.analyze_image()
        result["uploaded_file"] = {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": f"~{len(await file.read())} bytes"
        }
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Image analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")

@app.post("/api/ai/regional-suggestions")
async def get_regional_suggestions(request: LocationRequest):
    """Get regional food suggestions based on location"""
    try:
        result = ai_service.get_regional_suggestions(
            lat=request.latitude,
            lng=request.longitude,
            language=request.language or "vi"
        )
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Regional suggestions error: {e}")
        raise HTTPException(status_code=500, detail=f"Regional suggestions failed: {str(e)}")

@app.post("/api/ai/ingredient-suggestions")
async def get_ingredient_suggestions():
    """Get ingredient suggestions for cooking"""
    try:
        return JSONResponse(content={
            "success": True,
            "suggestions": [
                "🧄 Tỏi - Tăng hương vị",
                "🧅 Hành tím - Thêm độ ngọt tự nhiên",
                "🌶️ Ớt - Điều chỉnh độ cay",
                "🥒 Rau muống - Bổ sung vitamin",
                "🐟 Nước mắm - Gia vị đặc trưng Việt Nam",
                "🌿 Rau thơm - Tăng mùi vị tươi mát"
            ],
            "categories": ["Gia vị", "Rau củ", "Protein", "Gia vị"],
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Ingredient suggestions error: {e}")
        raise HTTPException(status_code=500, detail=f"Ingredient suggestions failed: {str(e)}")

@app.post("/api/ai/learning-path")
async def create_learning_path():
    """Create cooking learning path"""
    try:
        return JSONResponse(content={
            "success": True,
            "learning_path": [
                "📚 Tuần 1-2: Kỹ thuật cắt thái cơ bản",
                "🍳 Tuần 3-4: Nấu cơm và canh đơn giản",
                "🥘 Tuần 5-6: Các món xào cơ bản",
                "🍲 Tuần 7-8: Món nướng và kho"
            ],
            "duration": "8 tuần",
            "level": "Người mới bắt đầu",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Learning path error: {e}")
        raise HTTPException(status_code=500, detail=f"Learning path creation failed: {str(e)}")

@app.post("/api/ai/nutrition-analysis")
async def analyze_nutrition():
    """Analyze nutrition of recipes"""
    try:
        return JSONResponse(content={
            "success": True,
            "analysis": {
                "calories": 420,
                "protein": "28g",
                "carbs": "45g", 
                "fat": "18g",
                "fiber": "8g"
            },
            "health_score": "8.5/10 - Rất tốt cho sức khỏe",
            "recommendations": [
                "✅ Cân bằng dinh dưỡng tốt",
                "✅ Đủ protein cho cơ thể",
                "💡 Có thể thêm rau xanh"
            ],
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Nutrition analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Nutrition analysis failed: {str(e)}")

@app.post("/api/ai/voice")
async def process_voice():
    """Process voice requests"""
    try:
        return JSONResponse(content={
            "success": True,
            "message": "Voice processing feature đang được phát triển",
            "status": "under_development",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Voice processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {str(e)}")

# Main execution
if __name__ == "__main__":
    try:
        import uvicorn
        port = int(os.environ.get("PORT", 8001))
        logger.info(f"🚀 Starting Smart Cooking AI Service on port {port}")
        logger.info(f"📱 Google API: {'✅ Configured' if GOOGLE_API_KEY else '❌ Missing'}")
        logger.info(f"🤖 Gemini API: {'✅ Configured' if GEMINI_API_KEY else '❌ Missing'}")
        logger.info(f"🔗 API Documentation: http://localhost:{port}/docs")
        logger.info(f"🏥 Health Check: http://localhost:{port}/health")
        
        uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
    except ImportError:
        print("❌ Uvicorn not available. Install: pip install uvicorn")
    except Exception as e:
        logger.error(f"❌ Failed to start service: {e}")
        print(f"❌ Error: {e}")
