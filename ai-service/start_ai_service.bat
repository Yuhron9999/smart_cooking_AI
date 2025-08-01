@echo off
echo Starting Smart Cooking AI Service...
echo Python Path: C:/Users/GIGABYTE/AppData/Local/Programs/Python/Python313/python.exe

C:/Users/GIGABYTE/AppData/Local/Programs/Python/Python313/python.exe --version
echo.

echo Testing imports...
C:/Users/GIGABYTE/AppData/Local/Programs/Python/Python313/python.exe -c "import fastapi; print('FastAPI: OK')"
C:/Users/GIGABYTE/AppData/Local/Programs/Python/Python313/python.exe -c "import uvicorn; print('Uvicorn: OK')" 
C:/Users/GIGABYTE/AppData/Local/Programs/Python/Python313/python.exe -c "import pydantic; print('Pydantic: OK')"
echo.

echo Starting AI Service...
C:/Users/GIGABYTE/AppData/Local/Programs/Python/Python313/python.exe app_working.py

pause
