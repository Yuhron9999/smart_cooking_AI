"""
Run AI Service and Test
"""

import subprocess
import time
import sys
import os

def run_service_and_test():
    print("🚀 Starting AI Service for testing...")
    
    # Start service in background
    service_process = subprocess.Popen([
        sys.executable, "-m", "uvicorn", 
        "app_simple:app", 
        "--host", "0.0.0.0", 
        "--port", "8001"
    ], cwd=os.getcwd())
    
    try:
        # Wait for service to start
        print("⏳ Waiting for service to start...")
        time.sleep(3)
        
        # Test if process is still running
        if service_process.poll() is None:
            print("✅ Service started successfully!")
            print("🔗 Service running at http://localhost:8001")
            print("📖 API docs at http://localhost:8001/docs")
            
            # Run tests
            print("\n🧪 Running tests...")
            test_process = subprocess.run([sys.executable, "test_service.py"], 
                                        cwd=os.getcwd())
            
            print(f"\n📊 Test completed with exit code: {test_process.returncode}")
            
        else:
            print("❌ Service failed to start")
            return_code = service_process.returncode
            print(f"Service exited with code: {return_code}")
        
    except KeyboardInterrupt:
        print("\n⏹️ Stopping service...")
    
    finally:
        # Cleanup
        if service_process.poll() is None:
            service_process.terminate()
            service_process.wait()
        print("🧹 Service stopped")

if __name__ == "__main__":
    run_service_and_test()
