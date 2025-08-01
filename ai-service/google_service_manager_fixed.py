"""
Google Service Account Integration for Smart Cooking AI
Handles Google APIs authentication and services
"""

import os
import json
import logging
from typing import Dict, List, Any, Union

# Safe imports with error handling
try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    GOOGLE_AVAILABLE = True
except ImportError:
    GOOGLE_AVAILABLE = False
    service_account = None
    build = None
    print("⚠️ Google Cloud libraries not available")

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    genai = None
    print("⚠️ Google Generative AI not available")

logger = logging.getLogger(__name__)

class GoogleServiceManager:
    def __init__(self):
        self.service_account_file = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE")
        self.project_id = os.getenv("GOOGLE_PROJECT_ID", "tactical-orbit-431412-v1")
        self.credentials = None
        self.places_service = None
        self.gemini_client = None
        
        self._initialize_services()
    
    def _initialize_services(self):
        """Initialize Google services with service account"""
        try:
            if GOOGLE_AVAILABLE and self.service_account_file and os.path.exists(self.service_account_file):
                # Load service account credentials
                self.credentials = service_account.Credentials.from_service_account_file(
                    self.service_account_file,
                    scopes=[
                        'https://www.googleapis.com/auth/cloud-platform',
                        'https://www.googleapis.com/auth/places',
                        'https://www.googleapis.com/auth/maps-platform.places'
                    ]
                )
                
                # Initialize Places API
                self.places_service = build('places', 'v1', credentials=self.credentials)
                
                logger.info("✅ Google Service Account authenticated successfully")
                
                # Initialize Gemini AI
                gemini_key = os.getenv("GEMINI_API_KEY")
                if gemini_key and GEMINI_AVAILABLE:
                    genai.configure(api_key=gemini_key)
                    self.gemini_client = genai.GenerativeModel('gemini-pro')
                    logger.info("✅ Gemini AI configured with service account")
                
            else:
                logger.warning("⚠️ Google Service Account file not found, using mock services")
                
        except Exception as e:
            logger.error(f"❌ Failed to initialize Google services: {e}")
            logger.info("📱 Using mock services for development")
    
    async def find_nearby_places(self, latitude: float, longitude: float, 
                                place_type: str = "supermarket", radius: int = 5000) -> Dict[str, Any]:
        """Find nearby places using Google Places API"""
        try:
            if not self.credentials or not GOOGLE_AVAILABLE:
                return self._get_mock_places(latitude, longitude)
            
            # Note: This is a simplified implementation
            # In real implementation, you would use the Google Places API
            logger.info(f"Searching for {place_type} near {latitude}, {longitude}")
            
            # Mock implementation for now
            mock_results = self._get_mock_places(latitude, longitude)
            mock_results["service_account_configured"] = True
            mock_results["real_api_used"] = False
            mock_results["message"] = "Using mock data - implement real Google Places API call here"
            
            return mock_results
            
        except Exception as e:
            logger.error(f"Places API error: {e}")
            return self._get_mock_places(latitude, longitude)
    
    async def generate_recipe_with_gemini(self, ingredients: List[str], 
                                        language: str = "vi") -> Dict[str, Any]:
        """Generate recipe using Gemini AI"""
        try:
            if not self.gemini_client or not GEMINI_AVAILABLE:
                return self._get_mock_recipe(ingredients, language)
            
            ingredients_text = ", ".join(ingredients)
            
            if language == "vi":
                prompt = f"""
                Tạo một công thức nấu ăn chi tiết bằng tiếng Việt sử dụng các nguyên liệu: {ingredients_text}
                
                Trả về kết quả dưới dạng JSON với cấu trúc:
                {{
                    "title": "Tên món ăn",
                    "description": "Mô tả ngắn gọn",
                    "cooking_time": "thời gian nấu",
                    "difficulty": "độ khó",
                    "servings": "số khẩu phần",
                    "ingredients": ["danh sách nguyên liệu chi tiết"],
                    "instructions": ["các bước thực hiện"],
                    "tips": ["lời khuyên nấu ăn"]
                }}
                """
            else:
                prompt = f"""
                Create a detailed cooking recipe in English using ingredients: {ingredients_text}
                
                Return the result in JSON format:
                {{
                    "title": "Recipe name",
                    "description": "Brief description",
                    "cooking_time": "cooking time",
                    "difficulty": "difficulty level",
                    "servings": "number of servings",
                    "ingredients": ["detailed ingredient list"],
                    "instructions": ["step by step instructions"],
                    "tips": ["cooking tips"]
                }}
                """
            
            response = await self.gemini_client.generate_content_async(prompt)
            
            # Parse response
            recipe_data = self._parse_gemini_response(response.text, language)
            
            if recipe_data:
                return {
                    "success": True,
                    "data": recipe_data
                }
            else:
                return {
                    "success": True,
                    "data": {
                        "title": "Món ăn AI từ Gemini" if language == "vi" else "AI Recipe from Gemini",
                        "description": f"Món ăn từ {ingredients_text}" if language == "vi" else f"Dish with {ingredients_text}",
                        "cooking_time": "30 phút" if language == "vi" else "30 minutes",
                        "difficulty": "Trung bình" if language == "vi" else "Medium",
                        "servings": "4 người" if language == "vi" else "4 servings",
                        "ingredients": ingredients,
                        "instructions": ["Xử lý nguyên liệu", "Nấu theo hướng dẫn AI"],
                        "tips": ["Nêm nớp theo khẩu vị"]
                    }
                }
            
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return self._get_mock_recipe(ingredients, language)
    
    def get_regional_suggestions(self, latitude: float, longitude: float, 
                               language: str = "vi") -> Dict[str, Any]:
        """Get regional food suggestions based on location"""
        try:
            # Detect region based on coordinates (Vietnam specific)
            region = self._detect_vietnam_region(latitude, longitude)
            
            regional_specialties = {
                "mien_bac": {
                    "vi": ["Phở Hà Nội truyền thống", "Bún chả Hà Nội", "Chả cá Lã Vọng", "Bánh cuốn Thanh Trì"],
                    "en": ["Traditional Hanoi Pho", "Hanoi Bun Cha", "Cha Ca La Vong", "Thanh Tri Rice Rolls"]
                },
                "mien_trung": {
                    "vi": ["Bún bò Huế", "Mì Quảng", "Cao lầu Hội An", "Bánh khoái Huế"],
                    "en": ["Hue Beef Noodle Soup", "Mi Quang", "Hoi An Cao Lau", "Hue Banh Khoai"]
                },
                "mien_nam": {
                    "vi": ["Bánh xèo miền Tây", "Hủ tiếu Nam Vang", "Bánh mì Sài Gòn", "Chè ba màu"],
                    "en": ["Western Style Banh Xeo", "Nam Vang Noodle Soup", "Saigon Banh Mi", "Three Color Dessert"]
                }
            }
            
            suggestions = regional_specialties.get(region, {}).get(language, [])
            
            return {
                "success": True,
                "region": region,
                "suggestions": suggestions,
                "location": {"lat": latitude, "lng": longitude},
                "message": f"Gợi ý món ăn {region}" if language == "vi" else f"Food suggestions for {region}"
            }
            
        except Exception as e:
            logger.error(f"Regional suggestions error: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _detect_vietnam_region(self, lat: float, lng: float) -> str:
        """Detect Vietnam region based on coordinates"""
        if lat > 20.0:  # North of Thanh Hoa
            return "mien_bac"
        elif lat > 16.0:  # Between Thanh Hoa and Da Nang
            return "mien_trung"
        else:  # South of Da Nang
            return "mien_nam"
    
    def _get_mock_places(self, lat: float, lng: float) -> Dict[str, Any]:
        """Mock places data for testing"""
        return {
            "status": "OK",
            "results": [
                {
                    "place_id": "ChIJN1t_tDeuEmsRUsoyG83frY4",
                    "name": "Siêu thị BigC",
                    "vicinity": "123 Nguyễn Văn Cừ, Quận 1, TP.HCM",
                    "rating": 4.2,
                    "types": ["supermarket", "food", "establishment"],
                    "location": {"lat": lat + 0.001, "lng": lng + 0.001},
                    "opening_hours": {"open_now": True}
                },
                {
                    "place_id": "ChIJrTLr-GyuEmsRBfy61i59si0",
                    "name": "Chợ Bến Thành",
                    "vicinity": "Lê Lợi, Quận 1, TP.HCM",
                    "rating": 4.0,
                    "types": ["food", "market", "establishment"],
                    "location": {"lat": lat + 0.002, "lng": lng + 0.002},
                    "opening_hours": {"open_now": True}
                },
                {
                    "place_id": "ChIJN5X_gDeuEmsRUsoyG83frY5",
                    "name": "Lotte Mart",
                    "vicinity": "469 Nguyễn Hữu Thọ, Quận 7, TP.HCM",
                    "rating": 4.1,
                    "types": ["supermarket", "department_store"],
                    "location": {"lat": lat + 0.003, "lng": lng + 0.003},
                    "opening_hours": {"open_now": True}
                }
            ],
            "mock_data": True,
            "service_account_configured": bool(self.credentials)
        }
    
    def _get_mock_recipe(self, ingredients: List[str], language: str) -> Dict[str, Any]:
        """Mock recipe data"""
        ingredients_text = ", ".join(ingredients)
        
        if language == "vi":
            return {
                "success": True,
                "data": {
                    "title": f"Món ăn ngon từ {ingredients[0] if ingredients else 'nguyên liệu có sẵn'}",
                    "description": f"Một món ăn thơm ngon được chế biến từ {ingredients_text}",
                    "cooking_time": "30 phút",
                    "difficulty": "Trung bình",
                    "servings": "4 người",
                    "ingredients": [
                        f"200g {ingredients[0] if ingredients else 'nguyên liệu chính'}",
                        "Gia vị cơ bản (muối, tiêu, nước mắm)",
                        "Rau thơm (hành lá, ngò)"
                    ] + ingredients[1:],
                    "instructions": [
                        "Sơ chế nguyên liệu sạch",
                        "Ướp gia vị khoảng 15 phút",
                        "Chế biến theo phương pháp phù hợp",
                        "Nêm nớp và trình bày đẹp mắt"
                    ],
                    "tips": [
                        "Chọn nguyên liệu tươi ngon",
                        "Nêm nớp theo khẩu vị gia đình",
                        "Có thể thay đổi gia vị theo sở thích"
                    ],
                    "mock_data": True
                }
            }
        else:
            return {
                "success": True,
                "data": {
                    "title": f"Delicious dish with {ingredients[0] if ingredients else 'available ingredients'}",
                    "description": f"A tasty dish made with {ingredients_text}",
                    "cooking_time": "30 minutes",
                    "difficulty": "Medium",
                    "servings": "4 people",
                    "ingredients": [
                        f"200g {ingredients[0] if ingredients else 'main ingredient'}",
                        "Basic seasonings (salt, pepper, fish sauce)",
                        "Fresh herbs (green onions, cilantro)"
                    ] + ingredients[1:],
                    "instructions": [
                        "Clean and prepare ingredients",
                        "Marinate with seasonings for 15 minutes",
                        "Cook using appropriate method",
                        "Season to taste and present nicely"
                    ],
                    "tips": [
                        "Choose fresh quality ingredients",
                        "Adjust seasonings to family taste",
                        "Feel free to modify spices as preferred"
                    ],
                    "mock_data": True
                }
            }
    
    def _parse_gemini_response(self, response_text: str, language: str) -> Dict[str, Any]:
        """Parse Gemini AI response"""
        try:
            # Try to extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                recipe_data = json.loads(json_match.group())
                return recipe_data
            else:
                return None
        except Exception as e:
            logger.error(f"Error parsing Gemini response: {e}")
            return None

# Initialize global service manager
google_service_manager = GoogleServiceManager()
