"""
Smart Cooking AI Service - Main Application
FastAPI service for AI-powered cooking features with Google Gemini AI
"""

import json
import os
import base64
from datetime import datetime
from typing import List, Dict, Any, Optional
from io import BytesIO
from PIL import Image

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx

# Safe imports with fallbacks
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    genai = None

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    openai = None

# Environment variables - Ưu tiên Google APIs
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here")  # Replace with your API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "your_google_api_key_here")  # Replace with your API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "your_google_maps_api_key_here")  # Replace with your API key

# Initialize services - Ưu tiên Gemini
if GEMINI_AVAILABLE and GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        print("✅ Google Gemini API initialized successfully")
    except Exception as e:
        print(f"❌ Gemini configuration failed: {e}")
        GEMINI_AVAILABLE = False

if OPENAI_AVAILABLE and OPENAI_API_KEY:
    try:
        openai.api_key = OPENAI_API_KEY
        print("✅ OpenAI API initialized successfully")
    except Exception as e:
        print(f"❌ OpenAI configuration failed: {e}")
        OPENAI_AVAILABLE = False

# FastAPI app
app = FastAPI(
    title="Smart Cooking AI Service",
    description="AI-powered cooking assistant with voice and image recognition",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class RecipeRequest(BaseModel):
    ingredients: List[str] = Field(..., description="List of available ingredients")
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict, description="User preferences")
    language: str = Field(default="vi", description="Response language")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message")
    context: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Conversation context")
    language: str = Field(default="vi", description="Response language")

class LocationRequest(BaseModel):
    latitude: float = Field(..., description="User latitude")
    longitude: float = Field(..., description="User longitude")
    language: str = Field(default="vi", description="Response language")

class PlacesRequest(BaseModel):
    latitude: float = Field(..., description="User latitude")
    longitude: float = Field(..., description="User longitude")
    query: str = Field(..., description="Search query")
    radius: int = Field(default=2000, description="Search radius in meters")

# AI Service Class
class AIService:
    def __init__(self):
        self.gemini_available = GEMINI_AVAILABLE
        self.openai_available = OPENAI_AVAILABLE

    async def find_nearby_places(self, latitude: float, longitude: float, query: str, radius: int = 2000) -> Dict[str, Any]:
        """Find nearby places using Google Places API"""
        if not GOOGLE_MAPS_API_KEY:
            return {
                "error": "Google Maps API key not configured",
                "results": []
            }

        try:
            async with httpx.AsyncClient() as client:
                url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
                params = {
                    "location": f"{latitude},{longitude}",
                    "radius": radius,
                    "keyword": query,
                    "key": GOOGLE_MAPS_API_KEY
                }
                
                response = await client.get(url, params=params)
                data = response.json()
                
                if response.status_code == 200 and data.get("status") == "OK":
                    results = []
                    for place in data.get("results", [])[:10]:  # Top 10 results
                        results.append({
                            "name": place.get("name"),
                            "vicinity": place.get("vicinity"),
                            "rating": place.get("rating"),
                            "types": place.get("types", []),
                            "location": place.get("geometry", {}).get("location", {}),
                            "place_id": place.get("place_id")
                        })
                    
                    return {
                        "status": "success",
                        "results": results,
                        "total": len(results)
                    }
                else:
                    return {
                        "error": f"Places API error: {data.get('status', 'Unknown error')}",
                        "results": []
                    }
                    
        except Exception as e:
            return {
                "error": f"Places search failed: {str(e)}",
                "results": []
            }

    def get_regional_suggestions(self, latitude: float, longitude: float, language: str = "vi") -> Dict[str, Any]:
        """Get regional food suggestions based on location"""
        # Vietnam regional mapping
        regional_specialties = {
            'mien_bac': {
                'vi': ['Phở Hà Nội', 'Bún chả', 'Chả cá Lã Vọng', 'Bánh cuốn'],
                'en': ['Hanoi Pho', 'Bun Cha', 'Cha Ca La Vong', 'Banh Cuon']
            },
            'mien_trung': {
                'vi': ['Bún bò Huế', 'Mì Quảng', 'Cao lầu', 'Bánh khoái'],
                'en': ['Hue Beef Noodle Soup', 'Mi Quang', 'Cao Lau', 'Banh Khoai']
            },
            'mien_nam': {
                'vi': ['Bún thịt nướng', 'Bánh xèo', 'Hủ tiếu', 'Chè ba màu'],
                'en': ['Grilled Pork Vermicelli', 'Banh Xeo', 'Hu Tieu', 'Three-Color Dessert']
            }
        }
        
        # Detect region based on coordinates
        region = self._detect_vietnam_region(latitude, longitude)
        suggestions = regional_specialties.get(region, {}).get(language, [])
        
        return {
            "region": region,
            "suggestions": suggestions,
            "latitude": latitude,
            "longitude": longitude
        }

    def _detect_vietnam_region(self, lat: float, lng: float) -> str:
        """Detect Vietnam region based on coordinates"""
        if lat > 20.0:  # Roughly north of Thanh Hoa
            return 'mien_bac'
        elif lat > 16.0:  # Between Thanh Hoa and Da Nang
            return 'mien_trung'
        else:  # South of Da Nang
            return 'mien_nam'

    async def generate_recipe_with_gemini(self, ingredients: List[str], preferences: Dict[str, Any], language: str = "vi") -> Dict[str, Any]:
        """Generate recipe using Gemini AI"""
        if not self.gemini_available:
            return {
                "error": "Gemini AI not available",
                "recipe": None
            }

        try:
            # Create prompt
            ingredients_str = ", ".join(ingredients)
            preferences_str = json.dumps(preferences, ensure_ascii=False) if preferences else ""
            
            if language == "vi":
                prompt = f"Tạo công thức nấu ăn từ nguyên liệu: {ingredients_str}. Sở thích: {preferences_str}. Trả lời bằng tiếng Việt."
            else:
                prompt = f"Create a cooking recipe using ingredients: {ingredients_str}. Preferences: {preferences_str}. Respond in English."

            model = genai.GenerativeModel('gemini-pro')
            response = await model.generate_content_async(prompt)
            
            return {
                "recipe": response.text,
                "ingredients": ingredients,
                "language": language,
                "model": "gemini-pro"
            }
            
        except Exception as e:
            return {
                "error": f"Gemini recipe generation failed: {str(e)}",
                "recipe": None
            }

    async def generate_recipe_with_openai(self, ingredients: List[str], preferences: Dict[str, Any], language: str = "vi") -> Dict[str, Any]:
        """Generate recipe using OpenAI"""
        if not self.openai_available:
            return {
                "error": "OpenAI not available",
                "recipe": None
            }

        try:
            # Create prompt
            ingredients_str = ", ".join(ingredients)
            preferences_str = json.dumps(preferences, ensure_ascii=False) if preferences else ""
            
            if language == "vi":
                prompt = f"Tạo công thức nấu ăn từ nguyên liệu: {ingredients_str}. Sở thích: {preferences_str}. Trả lời bằng tiếng Việt với format JSON có các trường: title, ingredients, instructions, cooking_time, difficulty."
            else:
                prompt = f"Create a cooking recipe using ingredients: {ingredients_str}. Preferences: {preferences_str}. Respond in English with JSON format having fields: title, ingredients, instructions, cooking_time, difficulty."

            client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)
            response = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful cooking assistant."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            recipe_text = response.choices[0].message.content
            
            return {
                "recipe": recipe_text,
                "ingredients": ingredients,
                "language": language,
                "model": "gpt-3.5-turbo"
            }
            
        except Exception as e:
            return {
                "error": f"OpenAI recipe generation failed: {str(e)}",
                "recipe": None
            }

    async def chat_response(self, message: str, context: List[Dict[str, Any]], language: str = "vi") -> Dict[str, Any]:
        """Generate chat response using available AI service"""
        try:
            # Try Gemini first, then OpenAI
            if self.gemini_available:
                model = genai.GenerativeModel('gemini-pro')
                
                # Build conversation context
                conversation = []
                for msg in context[-5:]:  # Last 5 messages
                    conversation.append(f"User: {msg.get('user', '')}")
                    conversation.append(f"Assistant: {msg.get('assistant', '')}")
                
                conversation.append(f"User: {message}")
                context_str = "\n".join(conversation)
                
                response = await model.generate_content_async(context_str)
                
                return {
                    "response": response.text,
                    "model": "gemini-pro",
                    "language": language
                }
                
            elif self.openai_available:
                client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)
                
                # Build messages array
                messages = [{"role": "system", "content": "You are a helpful cooking assistant."}]
                for msg in context[-5:]:
                    if msg.get('user'):
                        messages.append({"role": "user", "content": msg['user']})
                    if msg.get('assistant'):
                        messages.append({"role": "assistant", "content": msg['assistant']})
                
                messages.append({"role": "user", "content": message})
                
                response = await client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages
                )
                
                return {
                    "response": response.choices[0].message.content,
                    "model": "gpt-3.5-turbo", 
                    "language": language
                }
            else:
                return {
                    "response": "Xin lỗi, hiện tại dịch vụ AI không khả dụng. Vui lòng thử lại sau." if language == "vi" else "Sorry, AI service is currently unavailable. Please try again later.",
                    "model": "fallback",
                    "language": language
                }
                
        except Exception as e:
            return {
                "response": f"Lỗi trong quá trình xử lý: {str(e)}" if language == "vi" else f"Error during processing: {str(e)}",
                "model": "error",
                "language": language
            }

# Initialize AI service
ai_service = AIService()

# API Routes
@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "Smart Cooking AI Service",
        "version": "2.0.0",
        "status": "running",
        "features": {
            "gemini_ai": GEMINI_AVAILABLE,
            "openai": OPENAI_AVAILABLE,
            "google_maps": bool(GOOGLE_MAPS_API_KEY)
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "gemini": GEMINI_AVAILABLE,
            "openai": OPENAI_AVAILABLE,
            "google_maps": bool(GOOGLE_MAPS_API_KEY)
        }
    }

@app.post("/api/ai/vision")
async def analyze_food_image(file: UploadFile = File(...)):
    """Analyze food image using Gemini Vision"""
    try:
        if not GEMINI_AVAILABLE:
            raise HTTPException(status_code=503, detail="Gemini Vision service not available")
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        image_data = await file.read()
        
        # Convert to base64 for Gemini
        image_base64 = base64.b64encode(image_data).decode()
        
        # Create Gemini model for vision
        model = genai.GenerativeModel('gemini-pro-vision')
        
        # Prepare image data
        image_parts = [
            {
                "mime_type": file.content_type,
                "data": image_base64
            }
        ]
        
        # Vietnamese prompt for food analysis
        prompt = """
        Hãy phân tích hình ảnh món ăn này và cung cấp thông tin chi tiết:
        1. Tên món ăn (nếu nhận dạng được)
        2. Nguyên liệu chính có thể nhìn thấy
        3. Phương pháp chế biến có thể
        4. Xuất xứ (nếu biết)
        5. Dinh dưỡng ước tính
        6. Gợi ý cách cải thiện món ăn
        
        Trả lời bằng tiếng Việt một cách chi tiết và hữu ích.
        """
        
        # Generate response
        response = model.generate_content([prompt] + image_parts)
        
        return {
            "success": True,
            "analysis": response.text,
            "filename": file.filename,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Vision analysis error: {e}")
        return {
            "success": False,
            "error": f"Không thể phân tích hình ảnh: {str(e)}",
            "analysis": "Xin lỗi, tôi không thể phân tích hình ảnh này. Vui lòng thử lại với hình ảnh khác."
        }

@app.post("/api/ai/chat")
async def chat_with_ai(request: ChatRequest):
    """Enhanced chat with Gemini AI"""
    try:
        if not GEMINI_AVAILABLE:
            # Fallback response
            return {
                "success": True,
                "data": {
                    "response": "Xin lỗi, dịch vụ AI hiện không khả dụng. Vui lòng thử lại sau.",
                    "model": "fallback"
                }
            }
        
        # Create Gemini model
        model = genai.GenerativeModel('gemini-pro')
        
        # Enhanced Vietnamese cooking assistant prompt
        system_prompt = """
        Bạn là trợ lý AI chuyên về nấu ăn và ẩm thực Việt Nam. Hãy:
        - Trả lời bằng tiếng Việt thân thiện và chi tiết
        - Cung cấp công thức nấu ăn cụ thể khi được hỏi
        - Gợi ý món ăn phù hợp với nguyên liệu có sẵn
        - Chia sẻ kiến thức về dinh dưỡng và cách chế biến
        - Hướng dẫn kỹ thuật nấu ăn cơ bản đến nâng cao
        - Giải thích nguồn gốc và văn hóa ẩm thực khi phù hợp
        
        Luôn đưa ra lời khuyên thực tế và an toàn thực phẩm.
        """
        
        # Combine system prompt with user message
        full_prompt = f"{system_prompt}\n\nCâu hỏi của người dùng: {request.message}"
        
        # Generate response
        response = model.generate_content(full_prompt)
        
        # Check if response contains recipe information
        recipe_data = None
        response_text = response.text.lower()
        
        if any(keyword in response_text for keyword in ['công thức', 'nguyên liệu', 'cách làm', 'recipe']):
            # Try to extract recipe structure (simple version)
            recipe_data = {
                "title": "Công thức từ AI",
                "ingredients": ["Xem chi tiết trong phản hồi"],
                "instructions": ["Xem hướng dẫn trong phản hồi"],
                "cook_time": 30,
                "difficulty": "Trung bình"
            }
        
        return {
            "success": True,
            "data": {
                "response": response.text,
                "model": "gemini-pro",
                "language": request.language,
                "recipe_data": recipe_data
            }
        }
        
    except Exception as e:
        print(f"Chat error: {e}")
        
        # Intelligent fallback based on message content
        message_lower = request.message.lower()
        fallback_response = "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau."
        
        if "phở" in message_lower:
            fallback_response = """
            Phở bò là món ăn đặc trưng của Việt Nam! Cách làm cơ bản:
            
            Nguyên liệu chính:
            - Xương bò: 1kg
            - Thịt bò: 500g  
            - Bánh phở: 500g
            - Hành tây: 2 củ
            - Gừng: 100g
            - Gia vị: hạt nêm, nước mắm, đường phèn
            
            Cách làm:
            1. Ninh xương bò 2-3 tiếng để có nước dùng trong
            2. Nướng hành, gừng cho thơm
            3. Luộc bánh phở, thái thịt bò mỏng
            4. Trình bày và thưởng thức nóng
            """
        elif any(word in message_lower for word in ["bánh mì", "sandwich"]):
            fallback_response = """
            Bánh mì Việt Nam thơm ngon! Cách làm:
            
            Nguyên liệu:
            - Bánh mì giòn: 2 ổ
            - Thịt nướng hoặc chả: 200g
            - Đồ chua (cà rót, củ cải): 100g
            - Rau sống: xà lách, ngò gai, kinh giới
            - Nước mắm pha loãng
            
            Lắp bánh mì với thứ tự: bánh → nước mắm → thịt → đồ chua → rau sống
            """
        
        return {
            "success": True,
            "data": {
                "response": fallback_response,
                "model": "fallback"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recipe generation failed: {str(e)}")

@app.post("/api/ai/chat")
async def chat_with_ai(request: ChatRequest):
    """Chat with AI assistant"""
    try:
        result = await ai_service.chat_response(
            request.message,
            request.context or [],
            request.language
        )
        
        return {
            "success": True,
            "response": result["response"],
            "model": result["model"],
            "language": request.language,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@app.post("/api/location/suggestions")
async def get_regional_suggestions(request: LocationRequest):
    """Get regional food suggestions based on location"""
    try:
        suggestions = ai_service.get_regional_suggestions(
            request.latitude,
            request.longitude,
            request.language
        )
        
        return {
            "success": True,
            "data": suggestions,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Regional suggestions failed: {str(e)}")

@app.post("/api/places/nearby")
async def find_nearby_stores(request: PlacesRequest):
    """Find nearby stores and restaurants"""
    try:
        places = await ai_service.find_nearby_places(
            request.latitude,
            request.longitude,
            request.query,
            request.radius
        )
        
        return {
            "success": True,
            "data": places,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Places search failed: {str(e)}")

@app.post("/api/ai/vision")
async def analyze_food_image(file: UploadFile = File(...)):
    """Analyze food image"""
    try:
        # For now, return mock data
        return {
            "success": True,
            "detected_foods": [
                {"name": "Phở", "confidence": 0.95, "category": "vietnamese"},
                {"name": "Bánh mì", "confidence": 0.87, "category": "vietnamese"}
            ],
            "filename": file.filename,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")

@app.post("/api/ai/ingredient-suggestions")
async def suggest_ingredients(request: dict):
    """Suggest ingredients for a specific dish or cuisine"""
    try:
        dish_name = request.get("dish_name", "")
        cuisine_type = request.get("cuisine_type", "vietnamese")
        
        # Vietnamese dish suggestions
        vietnamese_suggestions = {
            "phở": {
                "main_ingredients": ["Xương bò", "Thịt bò", "Bánh phở"],
                "seasonings": ["Quế", "Hồi", "Đinh hương", "Nước mắm"],
                "vegetables": ["Hành tây", "Gừng", "Rau thơm"],
                "optional": ["Tủy xương", "Gân bò"],
                "cooking_tips": ["Ninh xương 3-4 tiếng", "Nướng hành gừng cho thơm"]
            },
            "bún bò huế": {
                "main_ingredients": ["Xương heo", "Thịt bò", "Bánh bún"],
                "seasonings": ["Mắm ruốc", "Ớt", "Sả", "Tôm khô"],
                "vegetables": ["Chuối xanh", "Giá đỗ", "Rau ram"],
                "optional": ["Chả", "Huyết heo"],
                "cooking_tips": ["Xào mắm ruốc với ớt", "Thái thịt bò mỏng"]
            },
            "bánh xèo": {
                "main_ingredients": ["Bột bánh xèo", "Tôm", "Thịt ba chỉ"],
                "seasonings": ["Nước mắm", "Đường", "Tiêu"],
                "vegetables": ["Giá đỗ", "Rau sống", "Dưa leo"],
                "optional": ["Nghệ tươi", "Nước cốt dừa"],
                "cooking_tips": ["Pha bột với nước cốt dừa", "Rắc đều nhân lên chảo"]
            }
        }
        
        # Get suggestions for the dish
        suggestions = vietnamese_suggestions.get(dish_name.lower(), {
            "main_ingredients": ["Nguyên liệu chính"],
            "seasonings": ["Gia vị cơ bản"],
            "vegetables": ["Rau củ tươi"],
            "optional": ["Nguyên liệu tùy chọn"],
            "cooking_tips": ["Mẹo chế biến"]
        })
        
        return {
            "success": True,
            "data": suggestions,
            "dish_name": dish_name,
            "cuisine_type": cuisine_type
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Không thể gợi ý nguyên liệu: {str(e)}"
        }

@app.post("/api/ai/learning-path")
async def create_learning_path(request: dict):
    """Create personalized cooking learning path"""
    try:
        skill_level = request.get("skill_level", "beginner")
        cuisine_preference = request.get("cuisine_preference", "vietnamese")
        available_time = request.get("available_time", 30)
        
        # Define learning paths based on skill level
        learning_paths = {
            "beginner": {
                "title": "Lộ trình nấu ăn cơ bản",
                "duration_weeks": 8,
                "total_dishes": 16,
                "weekly_plan": [
                    {
                        "week": 1,
                        "title": "Làm quen với bếp núc",
                        "skills": ["Cách cầm dao", "An toàn bếp núc", "Vệ sinh thực phẩm"],
                        "practice_dishes": ["Trứng chiên", "Canh rau"],
                        "estimated_time": "2-3 tiếng"
                    },
                    {
                        "week": 2,
                        "title": "Kỹ thuật luộc và xào cơ bản",
                        "skills": ["Luộc rau", "Xào đơn giản", "Nêm nếm"],
                        "practice_dishes": ["Rau luộc", "Thịt xào rau củ"],
                        "estimated_time": "3-4 tiếng"
                    },
                    {
                        "week": 3,
                        "title": "Nấu cơm và canh",
                        "skills": ["Nấu cơm ngon", "Nấu canh", "Pha nước mắm"],
                        "practice_dishes": ["Cơm trắng", "Canh chua"],
                        "estimated_time": "3-4 tiếng"
                    },
                    {
                        "week": 4,
                        "title": "Ướp và nướng",
                        "skills": ["Ướp thịt", "Nướng cơ bản", "Làm nước chấm"],
                        "practice_dishes": ["Thịt nướng", "Nước chấm chua ngọt"],
                        "estimated_time": "4-5 tiếng"
                    }
                ],
                "final_goals": [
                    "Tự tin nấu được 4-5 món cơ bản",
                    "Hiểu về an toàn thực phẩm",
                    "Biết cách nêm nếm"
                ]
            },
            "intermediate": {
                "title": "Nâng cao kỹ năng nấu ăn",
                "duration_weeks": 12,
                "total_dishes": 24,
                "weekly_plan": [
                    {
                        "week": 1,
                        "title": "Kỹ thuật thái chuyên nghiệp",
                        "skills": ["Thái julienne", "Thái brunoise", "Tốc độ và độ đều"],
                        "practice_dishes": ["Salad rau củ", "Canh bí đao"],
                        "estimated_time": "4-5 tiếng"
                    },
                    {
                        "week": 2,
                        "title": "Nấu nước dùng",
                        "skills": ["Ninh xương", "Nước dùng trong", "Cân bằng vị"],
                        "practice_dishes": ["Nước dùng phở", "Canh xương"],
                        "estimated_time": "6-8 tiếng"
                    }
                ],
                "final_goals": [
                    "Thành thạo 15-20 món Việt",
                    "Tự sáng tạo biến tấu món ăn",
                    "Hiểu về cân bằng dinh dưỡng"
                ]
            },
            "advanced": {
                "title": "Đầu bếp chuyên nghiệp",
                "duration_weeks": 16,
                "total_dishes": 32,
                "weekly_plan": [
                    {
                        "week": 1,
                        "title": "Nghệ thuật trình bày",
                        "skills": ["Plating techniques", "Color harmony", "Food styling"],
                        "practice_dishes": ["Fine dining presentation", "Fusion dishes"],
                        "estimated_time": "8-10 tiếng"
                    }
                ],
                "final_goals": [
                    "Nấu được món ăn chuyên nghiệp",
                    "Sáng tạo công thức riêng",
                    "Quản lý bếp hiệu quả"
                ]
            }
        }
        
        # Get the appropriate learning path
        learning_data = learning_paths.get(skill_level, learning_paths["beginner"])
        
        # Customize based on available time
        if available_time < 20:
            learning_data["note"] = "Lộ trình đã được điều chỉnh cho thời gian có hạn"
            learning_data["duration_weeks"] = int(learning_data["duration_weeks"] * 1.5)
        
        return {
            "success": True,
            "data": learning_data,
            "customized_for": {
                "skill_level": skill_level,
                "cuisine_preference": cuisine_preference,
                "available_time": available_time
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Không thể tạo lộ trình học: {str(e)}"
        }

@app.post("/api/ai/nutrition-analysis")
async def analyze_nutrition(request: dict):
    """Analyze nutrition information of a dish"""
    try:
        ingredients = request.get("ingredients", [])
        servings = request.get("servings", 4)
        
        # Basic nutrition data for common Vietnamese ingredients
        nutrition_db = {
            "thịt bò": {"calories": 250, "protein": 26, "fat": 15, "carbs": 0, "fiber": 0},
            "thịt heo": {"calories": 242, "protein": 27, "fat": 14, "carbs": 0, "fiber": 0},
            "gà": {"calories": 165, "protein": 31, "fat": 3.6, "carbs": 0, "fiber": 0},
            "tôm": {"calories": 85, "protein": 20, "fat": 0.3, "carbs": 0, "fiber": 0},
            "cá": {"calories": 206, "protein": 22, "fat": 12, "carbs": 0, "fiber": 0},
            "cơm": {"calories": 130, "protein": 2.7, "fat": 0.3, "carbs": 28, "fiber": 0.4},
            "bánh phở": {"calories": 109, "protein": 0.9, "fat": 0.2, "carbs": 25, "fiber": 0.9},
            "rau": {"calories": 25, "protein": 2, "fat": 0.2, "carbs": 5, "fiber": 2}
        }
        
        total_nutrition = {
            "calories": 0,
            "protein": 0,
            "fat": 0,
            "carbs": 0,
            "fiber": 0
        }
        
        detailed_ingredients = []
        
        # Calculate nutrition for each ingredient
        for ingredient in ingredients:
            ingredient_lower = ingredient.lower()
            found_nutrition = None
            
            # Find matching nutrition data
            for key, nutrition in nutrition_db.items():
                if key in ingredient_lower:
                    found_nutrition = nutrition
                    break
            
            if not found_nutrition:
                found_nutrition = {"calories": 50, "protein": 2, "fat": 1, "carbs": 8, "fiber": 1}
            
            # Add to totals (assuming 100g portions)
            for key, value in found_nutrition.items():
                total_nutrition[key] += value
            
            detailed_ingredients.append({
                "name": ingredient,
                "nutrition_per_100g": found_nutrition
            })
        
        # Calculate per serving
        per_serving = {key: round(value / servings, 1) for key, value in total_nutrition.items()}
        
        # Health assessment
        health_score = 0
        recommendations = []
        
        if per_serving["protein"] >= 20:
            health_score += 25
        else:
            recommendations.append("Tăng thêm protein từ thịt, cá hoặc đậu")
        
        if per_serving["fiber"] >= 5:
            health_score += 25
        else:
            recommendations.append("Thêm rau xanh và trái cây để tăng chất xơ")
        
        if per_serving["calories"] <= 600:
            health_score += 25
        else:
            recommendations.append("Giảm lượng dầu mỡ để kiểm soát calo")
        
        if per_serving["fat"] <= 20:
            health_score += 25
        else:
            recommendations.append("Hạn chế dầu mỡ, chọn phương pháp nấu ít dầu")
        
        return {
            "success": True,
            "data": {
                "per_serving": per_serving,
                "total_dish": total_nutrition,
                "servings": servings,
                "detailed_ingredients": detailed_ingredients,
                "health_assessment": {
                    "score": health_score,
                    "grade": "A" if health_score >= 80 else "B" if health_score >= 60 else "C",
                    "recommendations": recommendations
                }
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Không thể phân tích dinh dưỡng: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
