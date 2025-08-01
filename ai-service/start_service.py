#!/usr/bin/env python3
"""
Start Smart Cooking AI Service
Quick start script for development
"""

import uvicorn
import sys
import os

if __name__ == "__main__":
    # Add current directory to Python path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    
    print("🚀 Starting Smart Cooking AI Service Enhanced...")
    print("📍 Port: 8001")
    print("🔗 URL: http://localhost:8001")
    print("📊 Health check: http://localhost:8001/health")
    print("📖 API docs: http://localhost:8001/docs")
    print("🔧 Google Service Account: Integrated")
    
    # Start the server
    uvicorn.run(
        "app_simple:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
