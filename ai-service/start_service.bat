@echo off
echo 🚀 Smart Cooking AI Service - Startup Script
echo ================================================

echo 📁 Changing to AI service directory...
cd /d "c:\SmartCookingAI_2\ai-service"

echo 📦 Installing required packages...
pip install fastapi uvicorn pydantic python-dotenv requests python-multipart

echo 🏥 Checking if packages installed correctly...
python -c "import fastapi, uvicorn, pydantic; print('✅ All packages installed successfully')"

echo 🔧 Starting Smart Cooking AI Service...
echo 🌐 Service will be available at: http://localhost:8001
echo 📚 API Documentation: http://localhost:8001/docs  
echo 🏥 Health Check: http://localhost:8001/health
echo.
echo ⏹️  Press Ctrl+C to stop the service
echo.

python app_clean.py
