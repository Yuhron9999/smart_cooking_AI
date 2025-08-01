"""
Smart Cooking AI Service - Enhanced with Google API Integration
FastAPI service for AI features integration
"""

import os
import json
import asyncio
import logging
import httpx
import base64
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Union
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image

# Google imports with error handling
try:
    import google.generativeai as genai
    gemini_available = True
except ImportError:
    genai = None
    gemini_available = False
    print("⚠️ Google Generative AI not available")

try:
    import openai
    openai_available = True
except ImportError:
    openai = None
    openai_available = False
    print("⚠️ OpenAI not available")

# Load environment variables first
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Smart Cooking AI Service",
    description="Enhanced AI Service with Google Service Account integration",
    version="2.1.0"
)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:8080").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS + ["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Keys Configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize API clients
if GEMINI_API_KEY and gemini_available:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("✅ Gemini API configured")
else:
    logger.warning("⚠️ Gemini API key not found or module not available")

if OPENAI_API_KEY and openai_available:
    openai.api_key = OPENAI_API_KEY
    logger.info("✅ OpenAI API configured")
else:
    logger.warning("⚠️ OpenAI API key not found or module not available")

if GOOGLE_API_KEY:
    logger.info("✅ Google API key configured")
else:
    logger.warning("⚠️ Google API key not found")

# Pydantic Models
class RecipeGenerationRequest(BaseModel):
    ingredients: List[str] = Field(..., description="List of available ingredients")
    dietary_restrictions: List[str] = Field(default_factory=list, description="Dietary restrictions")
    cooking_time: Optional[int] = Field(default=30, description="Max cooking time in minutes")
    difficulty: Optional[str] = Field(default="medium", description="Preferred difficulty level")
    cuisine_type: Optional[str] = Field(default="any", description="Preferred cuisine type")
    language: Optional[str] = Field(default="vi", description="Response language")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message")
    language: Optional[str] = Field(default="vi", description="Response language")
    context: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Conversation context")

class ImageAnalysisRequest(BaseModel):
    image_data: str = Field(..., description="Base64 encoded image data")
    analysis_type: Optional[str] = Field(default="food_recognition", description="Type of analysis")

class RegionalSuggestionRequest(BaseModel):
    latitude: float = Field(..., description="User latitude")
    longitude: float = Field(..., description="User longitude")
    language: Optional[str] = Field(default="vi", description="Response language")

class StoreFinderRequest(BaseModel):
    latitude: float = Field(..., description="User latitude")
    longitude: float = Field(..., description="User longitude")
    ingredients: List[str] = Field(..., description="Ingredients to find")
    radius: Optional[int] = Field(default=5000, description="Search radius in meters")

# Enhanced Google Services
class GoogleAPIService:
    def __init__(self):
        self.api_key = GOOGLE_API_KEY
        self.base_url = "https://maps.googleapis.com/maps/api"
        
    async def find_nearby_stores(self, lat: float, lng: float, ingredients: List[str], radius: int = 5000) -> Dict[str, Any]:
        """Find nearby stores using Google Places API"""
        if not self.api_key:
            return self._get_mock_stores(lat, lng)
            
        try:
            # Search for supermarkets and grocery stores
            search_types = ["supermarket", "grocery_or_supermarket", "food"]
            all_results = []
            
            async with httpx.AsyncClient() as client:
                for search_type in search_types:
                    url = f"{self.base_url}/place/nearbysearch/json"
                    params = {
                        "location": f"{lat},{lng}",
                        "radius": radius,
                        "type": search_type,
                        "key": self.api_key
                    }
                    
                    response = await client.get(url, params=params)
                    if response.status_code == 200:
                        data = response.json()
                        all_results.extend(data.get("results", []))
            
            # Remove duplicates and format results
            unique_stores = {}
            for store in all_results:
                place_id = store.get("place_id")
                if place_id not in unique_stores:
                    unique_stores[place_id] = {
                        "place_id": place_id,
                        "name": store.get("name"),
                        "vicinity": store.get("vicinity"),
                        "rating": store.get("rating"),
                        "types": store.get("types", []),
                        "location": store.get("geometry", {}).get("location", {}),
                        "photos": store.get("photos", [])[:1]  # First photo only
                    }
            
            return {
                "status": "OK",
                "results": list(unique_stores.values())[:10],  # Top 10 results
                "ingredients_searched": ingredients
            }
            
        except Exception as e:
            logger.error(f"Google Places API error: {e}")
            return self._get_mock_stores(lat, lng)
    
    async def get_regional_suggestions(self, lat: float, lng: float, language: str = "vi") -> Dict[str, Any]:
        """Get regional food suggestions based on location"""
        try:
            # Detect region based on coordinates (Vietnam specific)
            region = self._detect_vietnam_region(lat, lng)
            
            regional_specialties = {
                "mien_bac": {
                    "vi": ["Phở Hà Nội", "Bún chả", "Chả cá Lã Vọng", "Bánh cuốn", "Nem chua"],
                    "en": ["Hanoi Pho", "Bun Cha", "Cha Ca La Vong", "Banh Cuon", "Fermented Pork Roll"]
                },
                "mien_trung": {
                    "vi": ["Bún bò Huế", "Mì Quảng", "Cao lầu", "Bánh khoái", "Nem lụi"],
                    "en": ["Hue Beef Noodle Soup", "Mi Quang", "Cao Lau", "Banh Khoai", "Nem Lui"]
                },
                "mien_nam": {
                    "vi": ["Bún thịt nướng", "Bánh xèo", "Hủ tiếu", "Chè ba màu", "Bánh mì"],
                    "en": ["Grilled Pork Vermicelli", "Banh Xeo", "Hu Tieu", "Three-Color Dessert", "Banh Mi"]
                }
            }
            
            suggestions = regional_specialties.get(region, {}).get(language, [])
            
            return {
                "success": True,
                "region": region,
                "suggestions": suggestions,
                "location": {"lat": lat, "lng": lng},
                "message": f"Gợi ý món ăn {region}" if language == "vi" else f"Food suggestions for {region}"
            }
            
        except Exception as e:
            logger.error(f"Regional suggestions error: {e}")
            return {
                "success": False,
                "error": str(e),
                "suggestions": []
            }
    
    def _detect_vietnam_region(self, lat: float, lng: float) -> str:
        """Detect Vietnam region based on coordinates"""
        if lat > 20.0:  # North of Thanh Hoa
            return "mien_bac"
        elif lat > 16.0:  # Between Thanh Hoa and Da Nang
            return "mien_trung"
        else:  # South of Da Nang
            return "mien_nam"
    
    def _get_mock_stores(self, lat: float, lng: float) -> Dict[str, Any]:
        """Fallback mock data when Google API is not available"""
        return {
            "status": "OK",
            "results": [
                {
                    "place_id": "mock_001",
                    "name": "Siêu thị BigC",
                    "vicinity": "123 Nguyễn Văn Cừ, Quận 1",
                    "rating": 4.2,
                    "types": ["supermarket", "food", "establishment"],
                    "location": {"lat": lat + 0.001, "lng": lng + 0.001}
                },
                {
                    "place_id": "mock_002", 
                    "name": "Chợ Bến Thành",
                    "vicinity": "Lê Lợi, Quận 1",
                    "rating": 4.0,
                    "types": ["food", "market", "establishment"],
                    "location": {"lat": lat + 0.002, "lng": lng + 0.002}
                }
            ],
            "mock_data": True
        }

# Enhanced AI Services
class AIService:
    def __init__(self):
        self.openai_available = bool(OPENAI_API_KEY and openai_available)
        self.gemini_available = bool(GEMINI_API_KEY and gemini_available)
    
    async def generate_recipe(self, request: RecipeGenerationRequest) -> Dict[str, Any]:
        """Generate recipe using available AI services"""
        try:
            if self.gemini_available and gemini_available:
                return await self._generate_recipe_gemini(request)
            elif self.openai_available and openai_available:
                return await self._generate_recipe_openai(request)
            else:
                return self._generate_mock_recipe(request)
        except Exception as e:
            logger.error(f"Recipe generation error: {e}")
            return self._generate_mock_recipe(request)
    
    async def _generate_recipe_gemini(self, request: RecipeGenerationRequest) -> Dict[str, Any]:
        """Generate recipe using Gemini AI"""
        try:
            if not gemini_available:
                return self._generate_mock_recipe(request)
                
            model = genai.GenerativeModel('gemini-pro')
            
            prompt = self._build_recipe_prompt(request)
            response = await model.generate_content_async(prompt)
            
            # Parse response and structure data
            recipe_data = self._parse_recipe_response(response.text, request.language)
            recipe_data["ai_model"] = "Gemini Pro"
            
            return recipe_data
            
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return self._generate_mock_recipe(request)
    
    async def _generate_recipe_openai(self, request: RecipeGenerationRequest) -> Dict[str, Any]:
        """Generate recipe using OpenAI"""
        try:
            if not openai_available:
                return self._generate_mock_recipe(request)
                
            client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)
            
            prompt = self._build_recipe_prompt(request)
            
            response = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional chef and cooking assistant."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            recipe_text = response.choices[0].message.content
            recipe_data = self._parse_recipe_response(recipe_text, request.language)
            recipe_data["ai_model"] = "GPT-3.5-turbo"
            
            return recipe_data
            
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return self._generate_mock_recipe(request)
    
    def _build_recipe_prompt(self, request: RecipeGenerationRequest) -> str:
        """Build prompt for recipe generation"""
        ingredients_text = ", ".join(request.ingredients)
        dietary_text = ", ".join(request.dietary_restrictions) if request.dietary_restrictions else "None"
        
        if request.language == "vi":
            prompt = f"""
            Tạo một công thức nấu ăn chi tiết với các nguyên liệu sau: {ingredients_text}
            
            Yêu cầu:
            - Thời gian nấu: tối đa {request.cooking_time} phút
            - Độ khó: {request.difficulty}
            - Hạn chế ăn kiêng: {dietary_text}
            - Loại món ăn: {request.cuisine_type}
            
            Hãy trả về với định dạng JSON có cấu trúc như sau:
            {{
                "title": "Tên món ăn",
                "description": "Mô tả ngắn",
                "cooking_time": "thời gian nấu",
                "difficulty": "độ khó",
                "servings": số người ăn,
                "ingredients": ["danh sách nguyên liệu chi tiết"],
                "instructions": ["các bước nấu ăn chi tiết"],
                "tips": ["mẹo nấu ăn"],
                "nutrition": {{"calories": số calo, "protein": "g", "carbs": "g", "fat": "g"}}
            }}
            """
        else:
            prompt = f"""
            Create a detailed cooking recipe using these ingredients: {ingredients_text}
            
            Requirements:
            - Cooking time: maximum {request.cooking_time} minutes
            - Difficulty: {request.difficulty}
            - Dietary restrictions: {dietary_text}
            - Cuisine type: {request.cuisine_type}
            
            Return in JSON format with this structure:
            {{
                "title": "Recipe name",
                "description": "Brief description",
                "cooking_time": "cooking time",
                "difficulty": "difficulty level",
                "servings": number of servings,
                "ingredients": ["detailed ingredient list"],
                "instructions": ["detailed cooking steps"],
                "tips": ["cooking tips"],
                "nutrition": {{"calories": number, "protein": "g", "carbs": "g", "fat": "g"}}
            }}
            """
        
        return prompt
    
    def _parse_recipe_response(self, response_text: str, language: str) -> Dict[str, Any]:
        """Parse AI response and extract recipe data"""
        try:
            # Try to extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                recipe_data = json.loads(json_match.group())
                recipe_data["success"] = True
                recipe_data["language"] = language
                return recipe_data
        except:
            pass
        
        # Fallback: create structured data from text
        return {
            "success": True,
            "title": "Món ăn ngon từ AI" if language == "vi" else "AI Generated Recipe",
            "description": response_text[:200] + "..." if len(response_text) > 200 else response_text,
            "cooking_time": "30 phút" if language == "vi" else "30 minutes",
            "difficulty": "Trung bình" if language == "vi" else "Medium",
            "servings": 4,
            "ingredients": [],
            "instructions": [response_text],
            "tips": [],
            "nutrition": {"calories": 0, "protein": "0g", "carbs": "0g", "fat": "0g"},
            "language": language,
            "raw_response": response_text
        }
    
    def _generate_mock_recipe(self, request: RecipeGenerationRequest) -> Dict[str, Any]:
        """Generate mock recipe when AI services are unavailable"""
        ingredients_text = ", ".join(request.ingredients)
        
        if request.language == "vi":
            return {
                "success": True,
                "title": f"Món ăn ngon từ {request.ingredients[0] if request.ingredients else 'nguyên liệu'}",
                "description": f"Một món ăn tuyệt vời được tạo từ {ingredients_text}",
                "cooking_time": f"{request.cooking_time} phút",
                "difficulty": request.difficulty,
                "servings": 4,
                "ingredients": [f"• {ingredient}" for ingredient in request.ingredients],
                "instructions": [
                    "1. Chuẩn bị tất cả nguyên liệu",
                    "2. Sơ chế nguyên liệu sạch sẽ",
                    "3. Nấu theo phương pháp truyền thống",
                    "4. Nêm nấp gia vị vừa ăn",
                    "5. Trang trí và thưởng thức"
                ],
                "tips": [
                    "Chọn nguyên liệu tươi ngon",
                    "Nêm nấp từ từ để đạt vị chuẩn",
                    "Có thể thay đổi gia vị theo khẩu vị"
                ],
                "nutrition": {"calories": 350, "protein": "25g", "carbs": "40g", "fat": "12g"},
                "language": "vi",
                "ai_model": "Mock Service",
                "mock_data": True
            }
        else:
            return {
                "success": True,
                "title": f"Delicious dish with {request.ingredients[0] if request.ingredients else 'ingredients'}",
                "description": f"A wonderful dish made from {ingredients_text}",
                "cooking_time": f"{request.cooking_time} minutes",
                "difficulty": request.difficulty,
                "servings": 4,
                "ingredients": [f"• {ingredient}" for ingredient in request.ingredients],
                "instructions": [
                    "1. Prepare all ingredients",
                    "2. Clean and prep ingredients",
                    "3. Cook using traditional methods",
                    "4. Season to taste",
                    "5. Garnish and serve"
                ],
                "tips": [
                    "Choose fresh ingredients",
                    "Season gradually for best flavor",
                    "Adjust spices to preference"
                ],
                "nutrition": {"calories": 350, "protein": "25g", "carbs": "40g", "fat": "12g"},
                "language": "en",
                "ai_model": "Mock Service",
                "mock_data": True
            }

# Initialize services
google_service = GoogleAPIService()
ai_service = AIService()

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint with service status"""
    return {
        "service": "Smart Cooking AI Service",
        "version": "2.1.0",
        "status": "running",
        "features": {
            "google_service_account": bool(google_service_manager.credentials if google_manager_available else False),
            "google_api": bool(GOOGLE_API_KEY),
            "gemini_ai": bool(GEMINI_API_KEY),
            "openai": bool(OPENAI_API_KEY),
            "project_id": google_service_manager.project_id if google_manager_available else "not_configured"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Smart Cooking AI Service",
        "version": "2.1.0",
        "google_service_account": "configured" if (google_manager_available and google_service_manager and google_service_manager.credentials) else "not_configured",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/ai/generate-recipe")
async def generate_recipe(request: RecipeGenerationRequest):
    """Generate cooking recipe from ingredients using Google Service Account"""
    try:
        # Use Google Service Manager for recipe generation if available
        if google_manager_available and google_service_manager:
            result = await google_service_manager.generate_recipe_with_gemini(
                ingredients=request.ingredients,
                language=request.language
            )
            
            if result.get("success"):
                # Add additional metadata
                result["data"]["request_info"] = {
                    "ingredients_count": len(request.ingredients),
                    "language": request.language,
                    "difficulty": request.difficulty,
                    "cooking_time_requested": request.cooking_time
                }
            
            return JSONResponse(content=result)
        else:
            # Fallback to AI service
            result = await ai_service.generate_recipe(request)
            return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Recipe generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/chat")
async def chat_with_ai(request: ChatRequest):
    """Chat with AI cooking assistant"""
    try:
        # Mock implementation for now
        if request.language == "vi":
            response = f"Xin chào! Tôi là trợ lý AI nấu ăn. Bạn hỏi: '{request.message}'. Tôi sẽ giúp bạn với những lời khuyên về nấu ăn tốt nhất!"
        else:
            response = f"Hello! I'm your AI cooking assistant. You asked: '{request.message}'. I'll help you with the best cooking advice!"
        
        return {
            "success": True,
            "response": response,
            "language": request.language,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/google/regional-suggestions")
async def get_regional_suggestions(request: RegionalSuggestionRequest):
    """Get regional food suggestions based on location using Google Service Account"""
    try:
        if google_manager_available and google_service_manager:
            result = google_service_manager.get_regional_suggestions(
                request.latitude, 
                request.longitude, 
                request.language or "vi"
            )
            return JSONResponse(content=result)
        else:
            # Fallback to Google service
            result = await google_service.get_regional_suggestions(
                request.latitude,
                request.longitude,
                request.language or "vi"
            )
            return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Regional suggestions error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/google/find-stores")
async def find_nearby_stores(request: StoreFinderRequest):
    """Find nearby stores for ingredients using Google Service Account"""
    try:
        result = await google_service_manager.find_nearby_places(
            request.latitude,
            request.longitude,
            "supermarket",
            request.radius
        )
        
        # Add ingredients info to result
        result["ingredients_searched"] = request.ingredients
        result["search_radius"] = request.radius
        
        return JSONResponse(content={"success": True, "data": result})
    except Exception as e:
        logger.error(f"Store finder error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/analyze-image")
async def analyze_food_image(file: UploadFile = File(...)):
    """Analyze food image using AI"""
    try:
        # Read image data
        image_data = await file.read()
        
        # Mock implementation - in production, use Gemini Vision API
        return {
            "success": True,
            "detected_foods": [
                {"name": "Phở", "confidence": 0.95, "category": "vietnamese"},
                {"name": "Bánh mì", "confidence": 0.87, "category": "vietnamese"}
            ],
            "nutrition_estimate": {
                "calories": 450,
                "protein": "20g",
                "carbs": "60g",
                "fat": "15g"
            },
            "recipe_suggestions": [
                "Phở bò Hà Nội",
                "Bánh mì pate"
            ],
            "mock_data": True
        }
    except Exception as e:
        logger.error(f"Image analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8002))
    uvicorn.run(app, host="0.0.0.0", port=port)
