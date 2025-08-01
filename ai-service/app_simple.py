"""
Smart Cooking AI Service - Main Application
FastAPI service for AI-powered cooking features
"""

import json
import os
from datetime import datetime

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

# Global variables instead of constants to avoid redefinition errors
_GEMINI_AVAILABLE = False
_OPENAI_AVAILABLE = False

# Safe imports with fallbacks
try:
    import google.generativeai as genai
    _GEMINI_AVAILABLE = True
except ImportError:
    genai = None

try:
    import openai
    _OPENAI_AVAILABLE = True
except ImportError:
    openai = None

# Environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# Initialize services if available
if _GEMINI_AVAILABLE and GEMINI_API_KEY and genai:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"Gemini configuration failed: {e}")
        _GEMINI_AVAILABLE = False

if _OPENAI_AVAILABLE and OPENAI_API_KEY and openai:
    try:
        openai.api_key = OPENAI_API_KEY
    except Exception as e:
        print(f"OpenAI configuration failed: {e}")
        _OPENAI_AVAILABLE = False

# FastAPI app
app = FastAPI(
    title="Smart Cooking AI Service",
    description="AI-powered cooking assistant",
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
    ingredients: list
    preferences: dict = {}
    language: str = "vi"

class ChatRequest(BaseModel):
    message: str
    context: list = []
    language: str = "vi"

class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    language: str = "vi"

class PlacesRequest(BaseModel):
    latitude: float
    longitude: float
    query: str
    radius: int = 2000

# Helper functions
def detect_vietnam_region(lat: float, lng: float) -> str:
    """Detect Vietnam region based on coordinates"""
    if lat > 20.0:
        return 'mien_bac'
    elif lat > 16.0:
        return 'mien_trung'
    else:
        return 'mien_nam'

def get_regional_suggestions(latitude: float, longitude: float, language: str = "vi"):
    """Get regional food suggestions based on location"""
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
    
    region = detect_vietnam_region(latitude, longitude)
    suggestions = regional_specialties.get(region, {}).get(language, [])
    
    return {
        "region": region,
        "suggestions": suggestions,
        "latitude": latitude,
        "longitude": longitude
    }

async def find_nearby_places(latitude: float, longitude: float, query: str, radius: int = 2000):
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
                for place in data.get("results", [])[:10]:
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

async def generate_recipe_with_gemini(ingredients: list, preferences: dict, language: str = "vi"):
    """Generate recipe using Gemini AI"""
    if not _GEMINI_AVAILABLE or not genai:
        return {
            "error": "Gemini AI not available",
            "recipe": None
        }

    try:
        ingredients_str = ", ".join(ingredients)
        preferences_str = json.dumps(preferences, ensure_ascii=False) if preferences else ""
        
        if language == "vi":
            prompt = f"Tạo công thức nấu ăn từ nguyên liệu: {ingredients_str}. Sở thích: {preferences_str}. Trả lời bằng tiếng Việt."
        else:
            prompt = f"Create a cooking recipe using ingredients: {ingredients_str}. Preferences: {preferences_str}. Respond in English."

        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
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

async def generate_recipe_with_openai(ingredients: list, preferences: dict, language: str = "vi"):
    """Generate recipe using OpenAI"""
    if not _OPENAI_AVAILABLE or not openai:
        return {
            "error": "OpenAI not available",
            "recipe": None
        }

    try:
        ingredients_str = ", ".join(ingredients)
        preferences_str = json.dumps(preferences, ensure_ascii=False) if preferences else ""
        
        if language == "vi":
            prompt = f"Tạo công thức nấu ăn từ nguyên liệu: {ingredients_str}. Sở thích: {preferences_str}. Trả lời bằng tiếng Việt."
        else:
            prompt = f"Create a cooking recipe using ingredients: {ingredients_str}. Preferences: {preferences_str}. Respond in English."

        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
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

async def chat_response(message: str, context: list, language: str = "vi"):
    """Generate chat response using available AI service"""
    try:
        # Try Gemini first, then OpenAI
        if _GEMINI_AVAILABLE and genai:
            model = genai.GenerativeModel('gemini-pro')
            
            # Build conversation context
            conversation = []
            for msg in context[-5:]:  # Last 5 messages
                conversation.append(f"User: {msg.get('user', '')}")
                conversation.append(f"Assistant: {msg.get('assistant', '')}")
            
            conversation.append(f"User: {message}")
            context_str = "\n".join(conversation)
            
            response = model.generate_content(context_str)
            
            return {
                "response": response.text,
                "model": "gemini-pro",
                "language": language
            }
            
        elif _OPENAI_AVAILABLE and openai:
            client = openai.OpenAI(api_key=OPENAI_API_KEY)
            
            # Build messages array
            messages = [{"role": "system", "content": "You are a helpful cooking assistant."}]
            for msg in context[-5:]:
                if msg.get('user'):
                    messages.append({"role": "user", "content": msg['user']})
                if msg.get('assistant'):
                    messages.append({"role": "assistant", "content": msg['assistant']})
            
            messages.append({"role": "user", "content": message})
            
            response = client.chat.completions.create(
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
                "response": "Xin lỗi, hiện tại dịch vụ AI không khả dụng." if language == "vi" else "Sorry, AI service is currently unavailable.",
                "model": "fallback",
                "language": language
            }
            
    except Exception as e:
        return {
            "response": f"Lỗi trong quá trình xử lý: {str(e)}" if language == "vi" else f"Error during processing: {str(e)}",
            "model": "error",
            "language": language
        }

# API Routes
@app.get("/")
def root():
    """Root endpoint with service information"""
    return {
        "service": "Smart Cooking AI Service",
        "version": "2.0.0",
        "status": "running",
        "features": {
            "gemini_ai": _GEMINI_AVAILABLE,
            "openai": _OPENAI_AVAILABLE,
            "google_maps": bool(GOOGLE_MAPS_API_KEY)
        }
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "gemini": _GEMINI_AVAILABLE,
            "openai": _OPENAI_AVAILABLE,
            "google_maps": bool(GOOGLE_MAPS_API_KEY)
        }
    }

@app.post("/api/ai/generate-recipe")
async def generate_recipe(request: RecipeRequest):
    """Generate recipe from ingredients"""
    try:
        # Try Gemini first, then OpenAI
        result = await generate_recipe_with_gemini(
            request.ingredients,
            request.preferences,
            request.language
        )
        
        if result.get("error") and _OPENAI_AVAILABLE:
            result = await generate_recipe_with_openai(
                request.ingredients,
                request.preferences,
                request.language
            )
        
        if result.get("error"):
            raise HTTPException(status_code=503, detail=result["error"])
        
        return {
            "success": True,
            "data": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recipe generation failed: {str(e)}")

@app.post("/api/ai/chat")
async def chat_with_ai(request: ChatRequest):
    """Chat with AI assistant"""
    try:
        result = await chat_response(
            request.message,
            request.context,
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
def get_location_suggestions(request: LocationRequest):
    """Get regional food suggestions based on location"""
    try:
        suggestions = get_regional_suggestions(
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
        places = await find_nearby_places(
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
def analyze_food_image(file: UploadFile = File(...)):
    """Analyze food image"""
    try:
        # Mock response for now
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
