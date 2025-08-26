@echo off
setlocal enabledelayedexpansion

:: Set default configuration
set "PHP_PORT=8000"
set "PYTHON_PORT=8001"
set "HOST=127.0.0.1"
set "PYTHON_CMD=python"
set "PHP_CMD=php"
set "PIP_CMD=pip"
set "LOG_DIR=logs"
set "PID_FILE=server_pids.txt"

:: Parse command line arguments
:parse_args
if "%~1"=="" goto :main
if /i "%~1"=="--php-port" (
    set "PHP_PORT=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--python-port" (
    set "PYTHON_PORT=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--host" (
    set "HOST=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--help" (
    goto :show_help
)
shift
goto :parse_args

:show_help
echo.
echo Usage: start_server.bat [OPTIONS]
echo Options:
echo   --php-port PORT     Set PHP server port ^(default: 8000^)
echo   --python-port PORT  Set Python AI server port ^(default: 8001^)
echo   --host HOST         Set server host ^(default: 127.0.0.1^)
echo   --help              Show this help message
echo.
echo Examples:
echo   start_server.bat
echo   start_server.bat --php-port 8080 --python-port 8081
echo   start_server.bat --host localhost
echo.
pause
exit /b 0

:main
chcp 65001 >nul 2>&1
cls
echo ========================================
echo    سوق الأسهم السعودي - الذكاء الاصطناعي
echo ========================================
echo.
echo Configuration:
echo   Host: %HOST%
echo   PHP Port: %PHP_PORT%
echo   Python AI Port: %PYTHON_PORT%
echo.

:: Create logs directory
if not exist "%LOG_DIR%" (
    mkdir "%LOG_DIR%"
    echo ✅ تم إنشاء مجلد السجلات
)

:: Kill any existing server processes
echo [1/8] إيقاف الخوادم الموجودة...
call :kill_processes %PHP_PORT%
call :kill_processes %PYTHON_PORT%

:: Wait for processes to fully terminate
timeout /t 3 /nobreak >nul

:: Check if ports are available
echo [2/8] فحص المنافذ...
call :check_port %PHP_PORT%
if errorlevel 1 (
    echo ❌ المنفذ %PHP_PORT% لا يزال مستخدماً
    pause
    exit /b 1
)

call :check_port %PYTHON_PORT%
if errorlevel 1 (
    echo ❌ المنفذ %PYTHON_PORT% لا يزال مستخدماً
    pause
    exit /b 1
)

echo ✅ جميع المنافذ متاحة

:: Check Python installation
echo [3/8] فحص Python...
call :check_python
if errorlevel 1 (
    echo ❌ فشل في العثور على Python
    pause
    exit /b 1
)

:: Check PHP installation
echo [4/8] فحص PHP...
call :check_php
if errorlevel 1 (
    echo ❌ فشل في العثور على PHP
    pause
    exit /b 1
)

:: Install Python dependencies
echo [5/8] تثبيت مكتبات Python...
call :install_python_deps
if errorlevel 1 (
    echo ❌ فشل في تثبيت مكتبات Python
    pause
    exit /b 1
)

:: Create Python AI server script if it doesn't exist
echo [6/8] إعداد خادم Python AI...
call :setup_python_server
if errorlevel 1 (
    echo ❌ فشل في إعداد خادم Python AI
    pause
    exit /b 1
)

:: Start Python AI server in background
echo [7/8] تشغيل خادم Python AI...
call :start_python_server
if errorlevel 1 (
    echo ❌ فشل في تشغيل خادم Python AI
    pause
    exit /b 1
)

:: Start PHP server
echo [8/8] تشغيل خادم PHP...
echo.
echo ========================================
echo    معلومات الخوادم
echo ========================================
echo الموقع الرئيسي: http://%HOST%:%PHP_PORT%
echo خادم Python AI: http://%HOST%:%PYTHON_PORT%
echo المسار: %CD%
echo Python: %PYTHON_CMD%
echo PHP: %PHP_CMD%
echo ========================================
echo.
echo أوامر مفيدة:
echo   Ctrl+C     - إيقاف جميع الخوادم
echo   Ctrl+Break - إيقاف جميع الخوادم ^(Windows^)
echo.
echo جاري تشغيل الخادم الرئيسي...
echo.

:: Start PHP server
%PHP_CMD% -S %HOST%:%PHP_PORT% 2>&1

:: Cleanup on exit
call :cleanup
exit /b 0

:: Function to kill processes on a port
:kill_processes
set "port=%~1"
echo جاري البحث عن العمليات التي تستخدم المنفذ %port%...

set "found_process=0"
for /f "tokens=5" %%a in ('netstat -ano ^| find ":%port%" ^| find "LISTENING"') do (
    echo تم العثور على عملية PID: %%a
    set "found_process=1"
    taskkill /PID %%a /F >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ تم إيقاف العملية بنجاح
    ) else (
        echo ⚠️  فشل في إيقاف العملية (قد تكون محمية)
    )
)

if "!found_process!"=="0" (
    echo ✅ لا توجد عمليات تستخدم المنفذ %port%
)
goto :eof

:: Function to check if port is available
:check_port
set "port=%~1"
set "port_in_use=0"
for /f %%a in ('netstat -an ^| find ":%port%" ^| find "LISTENING"') do (
    set "port_in_use=1"
)

if "!port_in_use!"=="1" (
    echo ❌ المنفذ %port% لا يزال مستخدماً
    exit /b 1
) else (
    echo ✅ المنفذ %port% متاح
    exit /b 0
)

:: Function to check Python installation
:check_python
%PYTHON_CMD% --version >nul 2>&1
if errorlevel 1 (
    echo جاري البحث عن Python في المسارات الشائعة...
    
    :: Try common Python paths
    if exist "C:\Python*\python.exe" (
        for /d %%i in (C:\Python*) do (
            if exist "%%i\python.exe" (
                set "PYTHON_CMD=%%i\python.exe"
                echo ✅ تم العثور على Python في: %%i
                goto :python_found
            )
        )
    )
    
    if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python*\python.exe" (
        for /d %%i in (C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python*) do (
            if exist "%%i\python.exe" (
                set "PYTHON_CMD=%%i\python.exe"
                echo ✅ تم العثور على Python في: %%i
                goto :python_found
            )
        )
    )
    
    echo ❌ Python غير مثبت أو غير متاح في PATH
    exit /b 1
)
:python_found
echo ✅ Python متاح: %PYTHON_CMD%
exit /b 0

:: Function to check PHP installation
:check_php
%PHP_CMD% --version >nul 2>&1
if errorlevel 1 (
    echo جاري البحث عن PHP في المسارات الشائعة...
    
    :: Try common PHP paths
    if exist "C:\php\php.exe" (
        set "PHP_CMD=C:\php\php.exe"
        echo ✅ تم العثور على PHP في: C:\php
        goto :php_found
    )
    
    if exist "C:\xampp\php\php.exe" (
        set "PHP_CMD=C:\xampp\php\php.exe"
        echo ✅ تم العثور على PHP في: C:\xampp\php
        goto :php_found
    )
    
    if exist "C:\wamp\bin\php\php*\php.exe" (
        for /d %%i in (C:\wamp\bin\php\php*) do (
            if exist "%%i\php.exe" (
                set "PHP_CMD=%%i\php.exe"
                echo ✅ تم العثور على PHP في: %%i
                goto :php_found
            )
        )
    )
    
    echo ❌ PHP غير مثبت أو غير متاح في PATH
    exit /b 1
)
:php_found
echo ✅ PHP متاح: %PHP_CMD%
exit /b 0

:: Function to install Python dependencies
:install_python_deps
if exist "requirements.txt" (
    echo جاري تثبيت المكتبات المطلوبة...
    
    :: Try to upgrade pip first
    echo تحديث pip...
    %PYTHON_CMD% -m pip install --upgrade pip --user >nul 2>&1
    
    :: Install requirements
    echo تثبيت المكتبات من requirements.txt...
    %PYTHON_CMD% -m pip install -r requirements.txt --user
    if errorlevel 1 (
        echo ⚠️  فشل في تثبيت بعض المكتبات
        echo جاري المحاولة مرة أخرى بدون --user...
        %PYTHON_CMD% -m pip install -r requirements.txt
        if errorlevel 1 (
            echo ❌ فشل في تثبيت المكتبات
            exit /b 1
        )
    )
    echo ✅ تم تثبيت المكتبات بنجاح
) else (
    echo ⚠️  ملف requirements.txt غير موجود
    echo إنشاء ملف requirements.txt أساسي...
    
    echo # Python AI Server Dependencies > requirements.txt
    echo flask==2.3.3 >> requirements.txt
    echo requests==2.31.0 >> requirements.txt
    echo numpy==1.24.3 >> requirements.txt
    echo pandas==2.0.3 >> requirements.txt
    echo scikit-learn==1.3.0 >> requirements.txt
    echo matplotlib==3.7.2 >> requirements.txt
    echo seaborn==0.12.2 >> requirements.txt
    echo python-dotenv==1.0.0 >> requirements.txt
    echo flask-cors==4.0.0 >> requirements.txt
    
    echo تثبيت المكتبات الأساسية...
    %PYTHON_CMD% -m pip install -r requirements.txt --user
    if errorlevel 1 (
        echo ❌ فشل في تثبيت المكتبات الأساسية
        exit /b 1
    )
)
exit /b 0

:: Function to setup Python AI server
:setup_python_server
if not exist "ai\ai_server.py" (
    echo إنشاء خادم Python AI...
    
    if not exist "ai" mkdir "ai"
    
    echo import os > ai\ai_server.py
    echo import sys >> ai\ai_server.py
    echo import json >> ai\ai_server.py
    echo import logging >> ai\ai_server.py
    echo from datetime import datetime >> ai\ai_server.py
    echo from flask import Flask, request, jsonify, render_template_string >> ai\ai_server.py
    echo from flask_cors import CORS >> ai\ai_server.py
    echo import numpy as np >> ai\ai_server.py
    echo import pandas as pd >> ai\ai_server.py
    echo from sklearn.ensemble import RandomForestRegressor >> ai\ai_server.py
    echo from sklearn.preprocessing import StandardScaler >> ai\ai_server.py
    echo import matplotlib.pyplot as plt >> ai\ai_server.py
    echo import seaborn as sns >> ai\ai_server.py
    echo import io >> ai\ai_server.py
    echo import base64 >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo # Configure logging >> ai\ai_server.py
    echo logging.basicConfig(level=logging.INFO) >> ai\ai_server.py
    echo logger = logging.getLogger(__name__) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo app = Flask(__name__) >> ai\ai_server.py
    echo CORS(app) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo class AIServer: >> ai\ai_server.py
    echo     def __init__(self): >> ai\ai_server.py
    echo         self.model = None >> ai\ai_server.py
    echo         self.scaler = StandardScaler() >> ai\ai_server.py
    echo         self.initialize_model() >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo     def initialize_model(self): >> ai\ai_server.py
    echo         """Initialize the AI model""" >> ai\ai_server.py
    echo         try: >> ai\ai_server.py
    echo             # Create a simple model for demonstration >> ai\ai_server.py
    echo             self.model = RandomForestRegressor(n_estimators=100, random_state=42) >> ai\ai_server.py
    echo             logger.info("AI model initialized successfully") >> ai\ai_server.py
    echo         except Exception as e: >> ai\ai_server.py
    echo             logger.error(f"Failed to initialize model: {e}") >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo     def generate_market_data(self, days=30): >> ai\ai_server.py
    echo         """Generate synthetic market data""" >> ai\ai_server.py
    echo         np.random.seed(42) >> ai\ai_server.py
    echo         dates = pd.date_range(start='2024-01-01', periods=days, freq='D') >> ai\ai_server.py
    echo         prices = 100 + np.cumsum(np.random.randn(days) * 0.5) >> ai\ai_server.py
    echo         volumes = np.random.randint(1000000, 10000000, days) >> ai\ai_server.py
    echo         return pd.DataFrame({ >> ai\ai_server.py
    echo             'date': dates, >> ai\ai_server.py
    echo             'price': prices, >> ai\ai_server.py
    echo             'volume': volumes >> ai\ai_server.py
    echo         }) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo ai_server = AIServer() >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo @app.route('/') >> ai\ai_server.py
    echo def home(): >> ai\ai_server.py
    echo     return jsonify({"status": "AI Server Running", "timestamp": datetime.now().isoformat()}) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo @app.route('/health') >> ai\ai_server.py
    echo def health(): >> ai\ai_server.py
    echo     return jsonify({"status": "healthy", "model_loaded": ai_server.model is not None}) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo @app.route('/api/trend-analysis', methods=['POST']) >> ai\ai_server.py
    echo def trend_analysis(): >> ai\ai_server.py
    echo     try: >> ai\ai_server.py
    echo         data = request.get_json() >> ai\ai_server.py
    echo         period = data.get('period', '1d') >> ai\ai_server.py
    echo         days = {'1d': 1, '1w': 7, '1m': 30, '3m': 90}.get(period, 30) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         market_data = ai_server.generate_market_data(days) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         # Simple trend analysis >> ai\ai_server.py
    echo         trend = "upward" if market_data['price'].iloc[-1] > market_data['price'].iloc[0] else "downward" >> ai\ai_server.py
    echo         confidence = np.random.uniform(0.6, 0.95) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         return jsonify({ >> ai\ai_server.py
    echo             "trend": trend, >> ai\ai_server.py
    echo             "confidence": round(confidence, 2), >> ai\ai_server.py
    echo             "data": market_data.to_dict('records'), >> ai\ai_server.py
    echo             "analysis": f"Market shows {trend} trend with {confidence:.1%} confidence" >> ai\ai_server.py
    echo         }) >> ai\ai_server.py
    echo     except Exception as e: >> ai\ai_server.py
    echo         logger.error(f"Trend analysis error: {e}") >> ai\ai_server.py
    echo         return jsonify({"error": str(e)}), 500 >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo @app.route('/api/price-prediction', methods=['POST']) >> ai\ai_server.py
    echo def price_prediction(): >> ai\ai_server.py
    echo     try: >> ai\ai_server.py
    echo         data = request.get_json() >> ai\ai_server.py
    echo         stock = data.get('stock', 'TASI') >> ai\ai_server.py
    echo         period = data.get('period', '1d') >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         # Generate prediction data >> ai\ai_server.py
    echo         current_price = 10885.58 >> ai\ai_server.py
    echo         change_percent = np.random.uniform(-5, 5) >> ai\ai_server.py
    echo         predicted_price = current_price * (1 + change_percent / 100) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         return jsonify({ >> ai\ai_server.py
    echo             "stock": stock, >> ai\ai_server.py
    echo             "current_price": current_price, >> ai\ai_server.py
    echo             "predicted_price": round(predicted_price, 2), >> ai\ai_server.py
    echo             "change_percent": round(change_percent, 2), >> ai\ai_server.py
    echo             "confidence": round(np.random.uniform(0.7, 0.95), 2), >> ai\ai_server.py
    echo             "prediction_date": datetime.now().isoformat() >> ai\ai_server.py
    echo         }) >> ai\ai_server.py
    echo     except Exception as e: >> ai\ai_server.py
    echo         logger.error(f"Price prediction error: {e}") >> ai\ai_server.py
    echo         return jsonify({"error": str(e)}), 500 >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo @app.route('/api/risk-analysis', methods=['POST']) >> ai\ai_server.py
    echo def risk_analysis(): >> ai\ai_server.py
    echo     try: >> ai\ai_server.py
    echo         data = request.get_json() >> ai\ai_server.py
    echo         portfolio_type = data.get('portfolio_type', 'moderate') >> ai\ai_server.py
    echo         risk_level = data.get('risk_level', 5) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         # Calculate risk metrics >> ai\ai_server.py
    echo         risk_score = risk_level / 10.0 >> ai\ai_server.py
    echo         volatility = risk_score * 0.3 >> ai\ai_server.py
    echo         sharpe_ratio = (0.08 - 0.02) / volatility if volatility > 0 else 0 >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         return jsonify({ >> ai\ai_server.py
    echo             "portfolio_type": portfolio_type, >> ai\ai_server.py
    echo             "risk_level": risk_level, >> ai\ai_server.py
    echo             "risk_score": round(risk_score, 2), >> ai\ai_server.py
    echo             "volatility": round(volatility, 2), >> ai\ai_server.py
    echo             "sharpe_ratio": round(sharpe_ratio, 2), >> ai\ai_server.py
    echo             "recommendation": "Consider diversifying your portfolio" if risk_score > 0.7 else "Portfolio risk is acceptable" >> ai\ai_server.py
    echo         }) >> ai\ai_server.py
    echo     except Exception as e: >> ai\ai_server.py
    echo         logger.error(f"Risk analysis error: {e}") >> ai\ai_server.py
    echo         return jsonify({"error": str(e)}), 500 >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo @app.route('/api/portfolio-analysis', methods=['POST']) >> ai\ai_server.py
    echo def portfolio_analysis(): >> ai\ai_server.py
    echo     try: >> ai\ai_server.py
    echo         data = request.get_json() >> ai\ai_server.py
    echo         stocks = data.get('stocks', []) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         if not stocks: >> ai\ai_server.py
    echo             return jsonify({"error": "No stocks provided"}), 400 >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         # Calculate portfolio metrics >> ai\ai_server.py
    echo         total_value = sum(stock.get('value', 0) for stock in stocks) >> ai\ai_server.py
    echo         performance = np.random.uniform(-10, 15) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         return jsonify({ >> ai\ai_server.py
    echo             "total_value": total_value, >> ai\ai_server.py
    echo             "performance_percent": round(performance, 2), >> ai\ai_server.py
    echo             "risk_score": round(np.random.uniform(0.3, 0.8), 2), >> ai\ai_server.py
    echo             "diversification_score": round(np.random.uniform(0.6, 0.9), 2), >> ai\ai_server.py
    echo             "recommendations": [ >> ai\ai_server.py
    echo                 "Consider adding more defensive stocks", >> ai\ai_server.py
    echo                 "Monitor high-volatility positions", >> ai\ai_server.py
    echo                 "Rebalance portfolio quarterly" >> ai\ai_server.py
    echo             ] >> ai\ai_server.py
    echo         }) >> ai\ai_server.py
    echo     except Exception as e: >> ai\ai_server.py
    echo         logger.error(f"Portfolio analysis error: {e}") >> ai\ai_server.py
    echo         return jsonify({"error": str(e)}), 500 >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo @app.route('/api/stock-analysis', methods=['POST']) >> ai\ai_server.py
    echo def stock_analysis(): >> ai\ai_server.py
    echo     try: >> ai\ai_server.py
    echo         data = request.get_json() >> ai\ai_server.py
    echo         stock_symbol = data.get('symbol', 'TASI') >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         # Generate stock analysis >> ai\ai_server.py
    echo         current_price = 10885.58 + np.random.uniform(-100, 100) >> ai\ai_server.py
    echo         change = np.random.uniform(-50, 50) >> ai\ai_server.py
    echo         volume = np.random.randint(1000000, 10000000) >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo         return jsonify({ >> ai\ai_server.py
    echo             "symbol": stock_symbol, >> ai\ai_server.py
    echo             "current_price": round(current_price, 2), >> ai\ai_server.py
    echo             "change": round(change, 2), >> ai\ai_server.py
    echo             "change_percent": round(change / current_price * 100, 2), >> ai\ai_server.py
    echo             "volume": volume, >> ai\ai_server.py
    echo             "rsi": round(np.random.uniform(30, 70), 1), >> ai\ai_server.py
    echo             "macd": round(np.random.uniform(-2, 2), 3), >> ai\ai_server.py
    echo             "recommendation": "BUY" if change > 0 else "SELL" >> ai\ai_server.py
    echo         }) >> ai\ai_server.py
    echo     except Exception as e: >> ai\ai_server.py
    echo         logger.error(f"Stock analysis error: {e}") >> ai\ai_server.py
    echo         return jsonify({"error": str(e)}), 500 >> ai\ai_server.py
    echo. >> ai\ai_server.py
    echo if __name__ == '__main__': >> ai\ai_server.py
    echo     print(f"Starting AI Server on port {os.environ.get('PYTHON_PORT', 8001)}") >> ai\ai_server.py
    echo     app.run(host='127.0.0.1', port=int(os.environ.get('PYTHON_PORT', 8001)), debug=False) >> ai\ai_server.py
    
    echo ✅ تم إنشاء خادم Python AI
) else (
    echo ✅ خادم Python AI موجود بالفعل
)
exit /b 0

:: Function to start Python AI server
:start_python_server
echo تشغيل خادم Python AI على المنفذ %PYTHON_PORT%...

:: Set environment variable for Python server
set "PYTHON_PORT=%PYTHON_PORT%"

:: Start Python server in background
start "Python AI Server" /B %PYTHON_CMD% ai\ai_server.py > "%LOG_DIR%\python_server.log" 2>&1

:: Wait a moment for server to start
timeout /t 3 /nobreak >nul

:: Check if server started successfully
for /f %%a in ('netstat -an ^| find ":%PYTHON_PORT%" ^| find "LISTENING"') do (
    echo ✅ خادم Python AI يعمل على المنفذ %PYTHON_PORT%
    goto :python_server_running
)

echo ❌ فشل في تشغيل خادم Python AI
echo تحقق من السجل: %LOG_DIR%\python_server.log
exit /b 1

:python_server_running
echo ✅ خادم Python AI جاهز
exit /b 0

:: Function to cleanup on exit
:cleanup
echo.
echo إيقاف جميع الخوادم...
call :kill_processes %PHP_PORT%
call :kill_processes %PYTHON_PORT%
echo ✅ تم إيقاف جميع الخوادم
goto :eof 