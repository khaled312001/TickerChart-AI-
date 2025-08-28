@echo off
echo ========================================
echo  TickerChart AI Enhanced System Startup
echo ========================================
echo.

:: Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

:: Check if required Python packages are installed
echo [INFO] Checking Python dependencies...
python -c "import sklearn, pandas, numpy, flask, yfinance" >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Some Python packages are missing
    echo [INFO] Installing required packages...
    pip install scikit-learn pandas numpy flask flask-cors yfinance requests xgboost
)

:: Create logs directory
if not exist "logs" mkdir logs

:: Kill any existing processes on ports 8000 and 8001
echo [INFO] Stopping any existing servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001') do taskkill /f /pid %%a >nul 2>&1

:: Start Enhanced AI Server (Python) in background with proper logging
echo [INFO] Starting Enhanced AI Server (Python ML Backend)...
start /b cmd /c "python ai/enhanced_ai_server.py > logs\python_server.log 2>&1"

:: Wait a moment for Python server to start
echo [INFO] Waiting for AI server to start...
timeout /t 5 /nobreak >nul

:: Check if Python server started successfully
echo [INFO] Checking AI server status...
curl -s http://localhost:8001/health >nul 2>&1
if errorlevel 1 (
    echo [WARNING] AI server may not have started properly
    echo [INFO] Check logs\python_server.log for details
) else (
    echo [SUCCESS] AI server is running on port 8001
)

:: Start PHP Server
echo [INFO] Starting PHP Server (Frontend)...
echo [INFO] Opening browser to http://localhost:8000
start http://localhost:8000
php -S localhost:8000 -t .

echo.
echo [INFO] System startup complete!
echo [INFO] PHP Server: http://localhost:8000
echo [INFO] AI Server: http://localhost:8001
echo.
pause 