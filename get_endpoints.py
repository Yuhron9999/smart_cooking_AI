#!/usr/bin/env python3
"""
Get available AI Service endpoints
"""

import requests
import json

def get_available_endpoints():
    """Get all available endpoints from OpenAPI schema"""
    try:
        response = requests.get("http://localhost:8001/openapi.json")
        if response.status_code == 200:
            schema = response.json()
            paths = schema.get("paths", {})
            
            print("🔍 Available AI Service Endpoints:")
            print("=" * 50)
            
            for path, methods in paths.items():
                for method, details in methods.items():
                    summary = details.get("summary", "No description")
                    print(f"{method.upper()} {path} - {summary}")
            
            return paths
        else:
            print(f"Failed to get schema: {response.status_code}")
            return {}
    except Exception as e:
        print(f"Error getting endpoints: {e}")
        return {}

if __name__ == "__main__":
    get_available_endpoints()
