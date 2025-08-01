"""
Smart Cooking AI Service - Working Version
Simple FastAPI service for AI features
"""

import os
import json
import logging
from datetime import datetime
from typing import List, Dict, Optional, Any

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Smart Cooking AI Service",
    description="AI Service for Smart Cooking App",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "your_google_api_key_here")

# Pydantic Models
class RecipeRequest(BaseModel):
    ingredients: List[str] = Field(..., description="List of ingredients")
    language: Optional[str] = Field(default="vi", description="Response language")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message")
    language: Optional[str] = Field(default="vi", description="Response language")

# Mock AI Service
class MockAIService:
    def generate_recipe(self, ingredients: List[str], language: str = "vi") -> Dict[str, Any]:
        ingredients_text = ", ".join(ingredients)
        
        if language == "vi":
            return {
                "success": True,
                "title": f"Món ăn từ {ingredients[0] if ingredients else 'nguyên liệu'}",
                "description": f"Món ăn ngon từ {ingredients_text}",
                "cooking_time": "30 phút",
                "difficulty": "Trung bình",
                "servings": 4,
                "ingredients": [f"• {ing}" for ing in ingredients],
                "instructions": [
                    "1. Chuẩn bị nguyên liệu",
                    "2. Sơ chế sạch sẽ", 
                    "3. Nấu theo công thức",
                    "4. Nêm nấp vừa ăn",
                    "5. Trang trí và thưởng thức"
                ],
                "tips": ["Chọn nguyên liệu tươi", "Nêm từ từ"],
                "nutrition": {"calories": 350, "protein": "25g"},
                "ai_model": "Mock AI",
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "success": True,
                "title": f"Dish with {ingredients[0] if ingredients else 'ingredients'}",
                "description": f"Delicious dish from {ingredients_text}",
                "cooking_time": "30 minutes",
                "difficulty": "Medium",
                "servings": 4,
                "ingredients": [f"• {ing}" for ing in ingredients],
                "instructions": [
                    "1. Prepare ingredients",
                    "2. Clean and prep",
                    "3. Cook following recipe", 
                    "4. Season to taste",
                    "5. Garnish and serve"
                ],
                "tips": ["Choose fresh ingredients", "Season gradually"],
                "nutrition": {"calories": 350, "protein": "25g"},
                "ai_model": "Mock AI",
                "timestamp": datetime.now().isoformat()
            }

    def chat_response(self, message: str, language: str = "vi") -> Dict[str, Any]:
        if language == "vi":
            response = f"Xin chào! Tôi là trợ lý AI nấu ăn. Bạn hỏi: '{message}'. Tôi có thể giúp bạn tạo công thức, tư vấn nấu ăn và nhiều thứ khác!"
        else:
            response = f"Hello! I'm your AI cooking assistant. You asked: '{message}'. I can help you create recipes, cooking advice and more!"
        
        return {
            "success": True,
            "response": response,
            "language": language,
            "timestamp": datetime.now().isoformat()
        }

# Initialize service
mock_service = MockAIService()

# API Endpoints
@app.get("/")
async def root():
    return {
        "service": "Smart Cooking AI Service",
        "version": "1.0.0",
        "status": "running",
        "google_api": "configured" if GOOGLE_API_KEY else "missing",
        "endpoints": [
            "/api/ai/generate-recipe",
            "/api/ai/chat",
            "/api/ai/vision", 
            "/health"
        ],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/ai/generate-recipe")
async def generate_recipe(request: RecipeRequest):
    try:
        result = mock_service.generate_recipe(request.ingredients, request.language or "vi")
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Recipe generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/chat")
async def chat(request: ChatRequest):
    try:
        result = mock_service.chat_response(request.message, request.language or "vi")
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/vision")
async def analyze_image(file: UploadFile = File(...)):
    try:
        return JSONResponse(content={
            "success": True,
            "detected_foods": [
                {"name": "Phở", "confidence": 0.95},
                {"name": "Bánh mì", "confidence": 0.87}
            ],
            "nutrition": {"calories": 450, "protein": "20g"},
            "suggestions": ["Phở bò Hà Nội", "Bánh mì pate"],
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Image analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/ingredient-suggestions")
async def ingredient_suggestions():
    return JSONResponse(content={
        "success": True,
        "suggestions": ["Tỏi", "Hành", "Ớt", "Rau thơm"],
        "timestamp": datetime.now().isoformat()
    })

@app.post("/api/ai/learning-path")  
async def learning_path():
    return JSONResponse(content={
        "success": True,
        "path": ["Kỹ thuật cắt", "Nấu cơm", "Món xào", "Món nướng"],
        "timestamp": datetime.now().isoformat()
    })

@app.post("/api/ai/nutrition-analysis")
async def nutrition_analysis():
    return JSONResponse(content={
        "success": True,
        "analysis": {"calories": 420, "protein": "28g", "fat": "15g"},  
        "score": "8.5/10",
        "timestamp": datetime.now().isoformat()
    })

@app.post("/api/ai/voice")
async def voice_processing():
    return JSONResponse(content={
        "success": True,
        "message": "Voice processing available",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    print(f"🚀 Starting Smart Cooking AI Service on port {port}")
    print(f"📱 Google API: {'✅' if GOOGLE_API_KEY else '❌'}")
    print(f"🔗 Docs: http://localhost:{port}/docs")
    uvicorn.run(app, host="0.0.0.0", port=port)
