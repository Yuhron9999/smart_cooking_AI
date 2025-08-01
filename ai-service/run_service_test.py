#!/usr/bin/env python3
"""
Complete AI Service Test Suite
Start service and run comprehensive tests
"""

import subprocess
import time
import asyncio
import sys
import os
from test_endpoints import test_ai_service

def start_service_background():
    """Start AI service in background"""
    print("🚀 Starting AI Service in background...")
    
    # Start uvicorn process
    process = subprocess.Popen([
        sys.executable, "-m", "uvicorn", 
        "app_enhanced:app", 
        "--host", "0.0.0.0", 
        "--port", "8001",
        "--reload"
    ], 
    stdout=subprocess.PIPE, 
    stderr=subprocess.PIPE
    )
    
    # Wait for service to start
    print("⏳ Waiting for service to start...")
    time.sleep(5)
    
    return process

async def run_complete_test():
    """Run complete test suite"""
    service_process = None
    
    try:
        # Start service
        service_process = start_service_background()
        
        print("✅ Service started, running tests...\n")
        
        # Run endpoint tests
        await test_ai_service()
        
        print("\n📊 Service is running at: http://localhost:8001")
        print("📖 API Documentation: http://localhost:8001/docs")
        print("🔍 Health Check: http://localhost:8001/health")
        
        # Keep service running
        print("\n🔄 Service running... Press Ctrl+C to stop")
        try:
            service_process.wait()
        except KeyboardInterrupt:
            print("\n🛑 Stopping service...")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    finally:
        # Clean up
        if service_process:
            service_process.terminate()
            try:
                service_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                service_process.kill()
        print("✅ Service stopped")

if __name__ == "__main__":
    try:
        asyncio.run(run_complete_test())
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)
