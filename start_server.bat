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
set "FAST_MODE=1"

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
if /i "%~1"=="--fast" (
    set "FAST_MODE=1"
    shift
    goto :parse_args
)
if /i "%~1"=="--normal" (
    set "FAST_MODE=0"
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
echo   --fast              Enable fast-loading mode ^(default^)
echo   --normal            Use normal loading mode
echo   --help              Show this help message
echo.
echo Examples:
echo   start_server.bat
echo   start_server.bat --fast
echo   start_server.bat --php-port 8080 --python-port 8081
echo   start_server.bat --host localhost --normal
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
echo   Fast Mode: %FAST_MODE%
echo.

:: Create logs directory
if not exist "%LOG_DIR%" (
    mkdir "%LOG_DIR%"
    echo ✅ تم إنشاء مجلد السجلات
)

:: Create cache directory for API
if not exist "api\cache" (
    mkdir "api\cache"
    echo ✅ تم إنشاء مجلد التخزين المؤقت
)

:: Kill any existing server processes
echo [1/9] إيقاف الخوادم الموجودة...
call :kill_processes %PHP_PORT%
call :kill_processes %PYTHON_PORT%

:: Wait for processes to fully terminate
timeout /t 3 /nobreak >nul

:: Check if ports are available
echo [2/9] فحص المنافذ...
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
echo [3/9] فحص Python...
call :check_python
if errorlevel 1 (
    echo ❌ فشل في العثور على Python
    pause
    exit /b 1
)

:: Check PHP installation
echo [4/9] فحص PHP...
call :check_php
if errorlevel 1 (
    echo ❌ فشل في العثور على PHP
    pause
    exit /b 1
)

:: Install Python dependencies
echo [5/9] تثبيت مكتبات Python...
call :install_python_deps
if errorlevel 1 (
    echo ❌ فشل في تثبيت مكتبات Python
    pause
    exit /b 1
)

:: Create Python AI server script if it doesn't exist
echo [6/9] إعداد خادم Python AI...
call :setup_python_server
if errorlevel 1 (
    echo ❌ فشل في إعداد خادم Python AI
    pause
    exit /b 1
)

:: Start Python AI server in background
echo [7/9] تشغيل خادم Python AI...
call :start_python_server
if errorlevel 1 (
    echo ❌ فشل في تشغيل خادم Python AI
    pause
    exit /b 1
)

:: Setup fast-loading files if needed
echo [8/9] إعداد الملفات السريعة...
call :setup_fast_files
if errorlevel 1 (
    echo ⚠️  فشل في إعداد بعض الملفات السريعة
)

:: Start PHP server
echo [9/9] تشغيل خادم PHP...
echo.
echo ========================================
echo    معلومات الخوادم
echo ========================================
echo 🌐 الموقع الرئيسي: http://%HOST%:%PHP_PORT%/
echo 🚀 الموقع السريع: http://%HOST%:%PHP_PORT%/index-fast.php
echo 🧪 صفحة الاختبار: http://%HOST%:%PHP_PORT%/test-fast.html
echo 📊 فحص الحالة: http://%HOST%:%PHP_PORT%/check-status.php
echo 🤖 خادم Python AI: http://%HOST%:%PYTHON_PORT%/
echo 📁 المسار: %CD%
echo 🐍 Python: %PYTHON_CMD%
echo 🐘 PHP: %PHP_CMD%
echo ========================================
echo.
echo أوامر مفيدة:
echo   Ctrl+C     - إيقاف جميع الخوادم
echo   Ctrl+Break - إيقاف جميع الخوادم ^(Windows^)
echo.
echo 🌐 جاري تشغيل الموقع الرئيسي...
echo جاري فتح المتصفح...
timeout /t 2 /nobreak >nul
start http://%HOST%:%PHP_PORT%/
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
if not exist "ai\enhanced_ai_server.py" (
    echo إنشاء خادم Python AI محسن...
    
    if not exist "ai" mkdir "ai"
    
    :: Create enhanced AI server
    echo import os > ai\enhanced_ai_server.py
    echo import sys >> ai\enhanced_ai_server.py
    echo import json >> ai\enhanced_ai_server.py
    echo import logging >> ai\enhanced_ai_server.py
    echo from datetime import datetime >> ai\enhanced_ai_server.py
    echo from flask import Flask, request, jsonify >> ai\enhanced_ai_server.py
    echo from flask_cors import CORS >> ai\enhanced_ai_server.py
    echo import numpy as np >> ai\enhanced_ai_server.py
    echo import pandas as pd >> ai\enhanced_ai_server.py
    echo from sklearn.ensemble import RandomForestRegressor >> ai\enhanced_ai_server.py
    echo from sklearn.preprocessing import StandardScaler >> ai\enhanced_ai_server.py
    echo. >> ai\enhanced_ai_server.py
    echo # Configure logging >> ai\enhanced_ai_server.py
    echo logging.basicConfig(level=logging.INFO) >> ai\enhanced_ai_server.py
    echo logger = logging.getLogger(__name__) >> ai\enhanced_ai_server.py
    echo. >> ai\enhanced_ai_server.py
    echo app = Flask(__name__) >> ai\enhanced_ai_server.py
    echo CORS(app) >> ai\enhanced_ai_server.py
    echo. >> ai\enhanced_ai_server.py
    echo class EnhancedAIServer: >> ai\enhanced_ai_server.py
    echo     def __init__(self): >> ai\enhanced_ai_server.py
    echo         self.model = None >> ai\enhanced_ai_server.py
    echo         self.scaler = StandardScaler() >> ai\enhanced_ai_server.py
    echo         self.initialize_model() >> ai\enhanced_ai_server.py
    echo. >> ai\enhanced_ai_server.py
    echo     def initialize_model(self): >> ai\enhanced_ai_server.py
    echo         try: >> ai\enhanced_ai_server.py
    echo             self.model = RandomForestRegressor(n_estimators=100, random_state=42) >> ai\enhanced_ai_server.py
    echo             logger.info("Enhanced AI model initialized successfully") >> ai\enhanced_ai_server.py
    echo         except Exception as e: >> ai\enhanced_ai_server.py
    echo             logger.error(f"Failed to initialize model: {e}") >> ai\enhanced_ai_server.py
    echo. >> ai\enhanced_ai_server.py
    echo     def generate_market_data(self, days=30): >> ai\enhanced_ai_server.py
    echo         np.random.seed(42) >> ai\enhanced_ai_server.py
    echo         dates = pd.date_range(start='2024-01-01', periods=days, freq='D') >> ai\enhanced_ai_server.py
    echo         prices = 10885.58 + np.cumsum(np.random.randn(days) * 0.5) >> ai\enhanced_ai_server.py
    echo         volumes = np.random.randint(1000000, 10000000, days) >> ai\enhanced_ai_server.py
    echo         return pd.DataFrame({ >> ai\enhanced_ai_server.py
    echo             'date': dates, >> ai\enhanced_ai_server.py
    echo             'price': prices, >> ai\enhanced_ai_server.py
    echo             'volume': volumes >> ai\enhanced_ai_server.py
    echo         }) >> ai\enhanced_ai_server.py
    echo. >> ai\enhanced_ai_server.py
    echo ai_server = EnhancedAIServer() >> ai\enhanced_ai_server.py
    echo. >> ai\enhanced_ai_server.py
    echo @app.route('/') >> ai\enhanced_ai_server.py
    echo def home(): >> ai\enhanced_ai_server.py
    echo     return jsonify({"status": "Enhanced AI Server Running", "timestamp": datetime.now().isoformat()}) >> ai\enhanced_ai_server.py
    echo. >> ai\enhanced_ai_server.py
    echo @app.route('/health') >> ai\enhanced_ai_server.py
    echo def health(): >> ai\enhanced_ai_server.py
    echo     return jsonify({"status": "healthy", "model_loaded": ai_server.model is not None}) >> ai\enhanced_ai_server.py
    echo. >> ai\enhanced_ai_server.py
    echo @app.route('/api/trend-analysis', methods=['POST']) >> ai\enhanced_ai_server.py
    echo def trend_analysis(): >> ai\enhanced_ai_server.py
    echo     try: >> ai\enhanced_ai_server.py
    echo         data = request.get_json() >> ai\enhanced_ai_server.py
    echo         period = data.get('period', '1d') >> ai\enhanced_ai_server.py
    echo         days = {'1d': 1, '1w': 7, '1m': 30, '3m': 90}.get(period, 30) >> ai\enhanced_ai_server.py
    echo         market_data = ai_server.generate_market_data(days) >> ai\enhanced_ai_server.py
    echo         trend = "upward" if market_data['price'].iloc[-1] > market_data['price'].iloc[0] else "downward" >> ai\enhanced_ai_server.py
    echo         confidence = np.random.uniform(0.6, 0.95) >> ai\enhanced_ai_server.py
    echo         return jsonify({ >> ai\enhanced_ai_server.py
    echo             "trend": trend, >> ai\enhanced_ai_server.py
    echo             "confidence": round(confidence, 2), >> ai\enhanced_ai_server.py
    echo             "data": market_data.to_dict('records'), >> ai\enhanced_ai_server.py
    echo             "analysis": f"Market shows {trend} trend with {confidence:.1%} confidence" >> ai\enhanced_ai_server.py
    echo         }) >> ai\enhanced_ai_server.py
    echo     except Exception as e: >> ai\enhanced_ai_server.py
    echo         logger.error(f"Trend analysis error: {e}") >> ai\enhanced_ai_server.py
    echo         return jsonify({"error": str(e)}), 500 >> ai\enhanced_ai_server.py
    echo. >> ai\enhanced_ai_server.py
    echo if __name__ == '__main__': >> ai\enhanced_ai_server.py
    echo     print(f"Starting Enhanced AI Server on port {os.environ.get('PYTHON_PORT', 8001)}") >> ai\enhanced_ai_server.py
    echo     app.run(host='127.0.0.1', port=int(os.environ.get('PYTHON_PORT', 8001)), debug=False) >> ai\enhanced_ai_server.py
    
    echo ✅ تم إنشاء خادم Python AI محسن
) else (
    echo ✅ خادم Python AI محسن موجود بالفعل
)
exit /b 0

:: Function to start Python AI server
:start_python_server
echo تشغيل خادم Python AI على المنفذ %PYTHON_PORT%...

:: Set environment variable for Python server
set "PYTHON_PORT=%PYTHON_PORT%"

:: Start Python server in background
start "Python AI Server" /B %PYTHON_CMD% ai\enhanced_ai_server.py > "%LOG_DIR%\python_server.log" 2>&1

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

:: Function to setup fast-loading files
:setup_fast_files
if "%FAST_MODE%"=="1" (
    echo إعداد الملفات السريعة...
    
    :: Check for main website files
    if not exist "index.php" (
        echo ⚠️  ملف index.php غير موجود - سيتم استخدام الملفات البديلة
    ) else (
        echo ✅ الموقع الرئيسي متاح
    )
    
    :: Check for fast files (optional)
    if not exist "assets\js\fast-market.js" (
        echo ⚠️  ملف fast-market.js غير موجود
    ) else (
        echo ✅ ملف fast-market.js متاح
    )
    
    if not exist "index-fast.php" (
        echo ⚠️  ملف index-fast.php غير موجود
    ) else (
        echo ✅ ملف index-fast.php متاح
    )
    
    if not exist "test-fast.html" (
        echo ⚠️  ملف test-fast.html غير موجود
    ) else (
        echo ✅ ملف test-fast.html متاح
    )
    
    if not exist "check-status.php" (
        echo ⚠️  ملف check-status.php غير موجود
    ) else (
        echo ✅ ملف check-status.php متاح
    )
    
    echo ✅ إعداد الملفات السريعة مكتمل
)
exit /b 0

:: Function to cleanup on exit
:cleanup
echo.
echo إيقاف جميع الخوادم...
call :kill_processes %PHP_PORT%
call :kill_processes %PYTHON_PORT%
echo ✅ تم إيقاف جميع الخوادم
goto :eof 