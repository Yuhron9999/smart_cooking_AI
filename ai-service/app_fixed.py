"""
Smart Cooking AI Service - Fixed Version
FastAPI service hoàn toàn sạch không có lỗi Pylance
"""

import os
import logging
from datetime import datetime
from typing import List, Dict, Optional, Any, Union
import json

# Core FastAPI imports
from fastapi import FastAPI, HTTPException, File, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    logging.warning("python-dotenv not available, using system environment")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger: logging.Logger = logging.getLogger(__name__)

# =============================================================================
# CONFIGURATION & CONSTANTS
# =============================================================================

# API Keys với type annotations
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here")
VISION_API_KEY: str = os.getenv("VISION_API_KEY", "your_vision_api_key_here")
GOOGLE_SERVICE_ACCOUNT_FILE: str = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "c:\\SmartCookingAI_2\\ai-service\\smart_cooking2.json")

# Model names
CURRENT_GEMINI_MODEL: str = "gemini-1.5-flash"

# Regional specialties với proper typing
REGIONAL_SPECIALTIES: Dict[str, Dict[str, List[str]]] = {
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

# =============================================================================
# PYDANTIC MODELS - Với đầy đủ type annotations
# =============================================================================

class RecipeRequest(BaseModel):
    """Model cho recipe generation request"""
    ingredients: List[str] = Field(..., description="Danh sách nguyên liệu")
    cuisine_type: Optional[str] = Field(default="vietnamese", description="Loại ẩm thực")
    difficulty: Optional[str] = Field(default="medium", description="Độ khó")
    cooking_time: Optional[int] = Field(default=30, description="Thời gian nấu (phút)")
    servings: Optional[int] = Field(default=4, description="Số người ăn")
    dietary_restrictions: Optional[List[str]] = Field(default=[], description="Hạn chế ăn kiêng")
    language: Optional[str] = Field(default="vi", description="Ngôn ngữ phản hồi")

class ChatRequest(BaseModel):
    """Model cho chat request"""
    message: str = Field(..., description="Tin nhắn từ người dùng")
    context: Optional[List[Dict[str, str]]] = Field(default=[], description="Ngữ cảnh cuộc trò chuyện")
    language: Optional[str] = Field(default="vi", description="Ngôn ngữ")

class LocationRequest(BaseModel):
    """Model cho location-based request"""
    latitude: float = Field(..., description="Vĩ độ")
    longitude: float = Field(..., description="Kinh độ")
    language: Optional[str] = Field(default="vi", description="Ngôn ngữ")

class NutritionRequest(BaseModel):
    """Model cho nutrition analysis request"""
    recipe_text: str = Field(..., description="Nội dung công thức")
    language: Optional[str] = Field(default="vi", description="Ngôn ngữ")

class APIResponse(BaseModel):
    """Standard API response model"""
    success: bool = Field(..., description="Trạng thái thành công")
    data: Optional[Dict[str, Any]] = Field(default=None, description="Dữ liệu phản hồi")
    message: str = Field(..., description="Thông báo")
    error: Optional[str] = Field(default=None, description="Thông báo lỗi")

# =============================================================================
# FASTAPI APP INITIALIZATION
# =============================================================================

app: FastAPI = FastAPI(
    title="Smart Cooking AI Service",
    description="AI-powered cooking assistant với Gemini integration",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def detect_vietnam_region(lat: float, lng: float) -> str:
    """
    Detect Vietnam region based on coordinates
    
    Args:
        lat: Latitude
        lng: Longitude
        
    Returns:
        Region name (mien_bac, mien_trung, mien_nam)
    """
    if lat > 20.0:  # North of Thanh Hoa
        return 'mien_bac'
    elif lat > 16.0:  # Between Thanh Hoa and Da Nang
        return 'mien_trung'
    else:  # South of Da Nang
        return 'mien_nam'

def get_language_prompt(language: str) -> str:
    """
    Get language-specific prompt instruction
    
    Args:
        language: Language code (vi, en, etc.)
        
    Returns:
        Prompt instruction in specified language
    """
    prompts: Dict[str, str] = {
        'vi': "Bạn là trợ lý nấu ăn thông minh. Trả lời bằng tiếng Việt.",
        'en': "You are a smart cooking assistant. Respond in English.",
        'ja': "あなたは料理アシスタントです。日本語で返答してください。",
        'ko': "당신은 요리 어시스턴트입니다. 한국어로 답변해 주세요.",
        'zh': "你是烹饪助手。请用中文回答。"
    }
    return prompts.get(language, prompts['vi'])

def create_success_response(data: Dict[str, Any], message: str = "Success") -> APIResponse:
    """
    Create standardized success response
    
    Args:
        data: Response data
        message: Success message
        
    Returns:
        APIResponse object
    """
    return APIResponse(
        success=True,
        data=data,
        message=message,
        error=None
    )

def create_error_response(error: str, message: str = "Error occurred") -> APIResponse:
    """
    Create standardized error response
    
    Args:
        error: Error description
        message: Error message
        
    Returns:
        APIResponse object
    """
    return APIResponse(
        success=False,
        data=None,
        message=message,
        error=error
    )

# =============================================================================
# AI SERVICE FUNCTIONS
# =============================================================================

async def generate_recipe_with_ai(request: RecipeRequest) -> Dict[str, Any]:
    """
    Generate recipe using AI based on ingredients
    
    Args:
        request: Recipe generation request
        
    Returns:
        Generated recipe data
        
    Raises:
        HTTPException: If generation fails
    """
    try:
        # Mock AI response - thay thế bằng thực tế Gemini API call
        ingredients_text: str = ", ".join(request.ingredients)
        language_instruction: str = get_language_prompt(request.language or "vi")
        
        # Simulated AI response
        recipe_data: Dict[str, Any] = {
            "title": f"Món ngon từ {ingredients_text}" if request.language == "vi" else f"Delicious dish with {ingredients_text}",
            "ingredients": request.ingredients,
            "instructions": [
                "Chuẩn bị nguyên liệu" if request.language == "vi" else "Prepare ingredients",
                "Chế biến theo hướng dẫn" if request.language == "vi" else "Cook according to instructions",
                "Trình bày và thưởng thức" if request.language == "vi" else "Plate and enjoy"
            ],
            "cooking_time": request.cooking_time,
            "difficulty": request.difficulty,
            "servings": request.servings,
            "cuisine_type": request.cuisine_type,
            "dietary_info": request.dietary_restrictions,
            "language": request.language
        }
        
        logger.info(f"Generated recipe for ingredients: {ingredients_text}")
        return recipe_data
        
    except Exception as e:
        logger.error(f"Recipe generation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate recipe: {str(e)}"
        ) from e

async def chat_with_ai(request: ChatRequest) -> Dict[str, Any]:
    """
    Chat with AI assistant
    
    Args:
        request: Chat request with message and context
        
    Returns:
        AI response data
        
    Raises:
        HTTPException: If chat fails
    """
    try:
        language_instruction: str = get_language_prompt(request.language or "vi")
        
        # Mock AI chat response
        response_data: Dict[str, Any] = {
            "response": f"Tôi hiểu bạn hỏi: '{request.message}'. Tôi có thể giúp bạn về nấu ăn!" if request.language == "vi" 
                       else f"I understand you asked: '{request.message}'. I can help you with cooking!",
            "context": request.context,
            "language": request.language,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"AI chat response generated for message: {request.message[:50]}...")
        return response_data
        
    except Exception as e:
        logger.error(f"Chat failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat service failed: {str(e)}"
        ) from e

async def get_regional_suggestions(request: LocationRequest) -> Dict[str, Any]:
    """
    Get regional food suggestions based on location
    
    Args:
        request: Location request with coordinates
        
    Returns:
        Regional suggestions data
    """
    try:
        region: str = detect_vietnam_region(request.latitude, request.longitude)
        language: str = request.language or "vi"
        
        suggestions: List[str] = REGIONAL_SPECIALTIES.get(region, {}).get(language, [])
        
        result_data: Dict[str, Any] = {
            "region": region,
            "suggestions": suggestions,
            "location": {
                "latitude": request.latitude,
                "longitude": request.longitude
            },
            "language": language,
            "message": f"Gợi ý món ăn vùng {region}" if language == "vi" else f"Food suggestions for {region} region"
        }
        
        logger.info(f"Regional suggestions generated for region: {region}")
        return result_data
        
    except Exception as e:
        logger.error(f"Regional suggestions failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get regional suggestions: {str(e)}"
        ) from e

async def analyze_nutrition(request: NutritionRequest) -> Dict[str, Any]:
    """
    Analyze nutrition information of a recipe
    
    Args:
        request: Nutrition analysis request
        
    Returns:
        Nutrition analysis data
    """
    try:
        # Mock nutrition analysis
        nutrition_data: Dict[str, Any] = {
            "calories": 350,
            "protein": "25g",
            "carbs": "45g",
            "fat": "12g",
            "fiber": "8g",
            "sodium": "600mg",
            "analysis": "Món ăn cân bằng dinh dưỡng" if request.language == "vi" else "Well-balanced nutritional profile",
            "health_score": 8.5,
            "language": request.language
        }
        
        logger.info("Nutrition analysis completed")
        return nutrition_data
        
    except Exception as e:
        logger.error(f"Nutrition analysis failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Nutrition analysis failed: {str(e)}"
        ) from e

# =============================================================================
# API ENDPOINTS
# =============================================================================

@app.get("/", response_model=APIResponse)
async def root() -> APIResponse:
    """Root endpoint"""
    return create_success_response(
        data={"service": "Smart Cooking AI", "version": "2.0.0", "status": "running"},
        message="Smart Cooking AI Service is running"
    )

@app.get("/health", response_model=APIResponse)
async def health_check() -> APIResponse:
    """Health check endpoint"""
    health_data: Dict[str, Any] = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "gemini_api_configured": bool(GEMINI_API_KEY),
        "vision_api_configured": bool(VISION_API_KEY),
        "service_account_configured": os.path.exists(GOOGLE_SERVICE_ACCOUNT_FILE)
    }
    
    return create_success_response(
        data=health_data,
        message="Service is healthy"
    )

@app.post("/api/ai/generate-recipe", response_model=APIResponse)
async def generate_recipe(request: RecipeRequest) -> APIResponse:
    """Generate recipe from ingredients"""
    try:
        recipe_data: Dict[str, Any] = await generate_recipe_with_ai(request)
        return create_success_response(
            data=recipe_data,
            message="Recipe generated successfully"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Recipe generation endpoint failed: {str(e)}")
        return create_error_response(
            error=str(e),
            message="Failed to generate recipe"
        )

@app.post("/api/ai/chat", response_model=APIResponse)
async def chat_endpoint(request: ChatRequest) -> APIResponse:
    """Chat with AI assistant"""
    try:
        chat_data: Dict[str, Any] = await chat_with_ai(request)
        return create_success_response(
            data=chat_data,
            message="Chat response generated"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat endpoint failed: {str(e)}")
        return create_error_response(
            error=str(e),
            message="Chat service failed"
        )

@app.post("/api/ai/regional-suggestions", response_model=APIResponse)
async def regional_suggestions_endpoint(request: LocationRequest) -> APIResponse:
    """Get regional food suggestions"""
    try:
        suggestions_data: Dict[str, Any] = await get_regional_suggestions(request)
        return create_success_response(
            data=suggestions_data,
            message="Regional suggestions retrieved"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Regional suggestions endpoint failed: {str(e)}")
        return create_error_response(
            error=str(e),
            message="Failed to get regional suggestions"
        )

@app.post("/api/ai/nutrition-analysis", response_model=APIResponse)
async def nutrition_analysis_endpoint(request: NutritionRequest) -> APIResponse:
    """Analyze nutrition information"""
    try:
        nutrition_data: Dict[str, Any] = await analyze_nutrition(request)
        return create_success_response(
            data=nutrition_data,
            message="Nutrition analysis completed"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Nutrition analysis endpoint failed: {str(e)}")
        return create_error_response(
            error=str(e),
            message="Nutrition analysis failed"
        )

@app.post("/api/ai/vision", response_model=APIResponse)
async def analyze_food_image(file: UploadFile = File(...)) -> APIResponse:
    """Analyze food image"""
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Mock image analysis
        analysis_data: Dict[str, Any] = {
            "detected_food": "Phở bò",
            "confidence": 0.95,
            "ingredients": ["Bánh phở", "Thịt bò", "Hành lá", "Ngò gai"],
            "cuisine_type": "Vietnamese",
            "description": "Món phở truyền thống Việt Nam",
            "filename": file.filename,
            "file_size": file.size if hasattr(file, 'size') else 0
        }
        
        logger.info(f"Image analysis completed for file: {file.filename}")
        return create_success_response(
            data=analysis_data,
            message="Image analysis completed"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Image analysis failed: {str(e)}")
        return create_error_response(
            error=str(e),
            message="Image analysis failed"
        )

# =============================================================================
# APPLICATION STARTUP
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    
    logger.info("Starting Smart Cooking AI Service...")
    logger.info(f"Gemini API Key configured: {'✅' if GEMINI_API_KEY else '❌'}")
    logger.info(f"Vision API Key configured: {'✅' if VISION_API_KEY else '❌'}")
    logger.info(f"Service Account File exists: {'✅' if os.path.exists(GOOGLE_SERVICE_ACCOUNT_FILE) else '❌'}")
    
    uvicorn.run(
        "app_fixed:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
