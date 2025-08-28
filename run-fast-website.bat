@echo off
chcp 65001 >nul
echo ========================================
echo   تشغيل الموقع السريع - TickerChart AI
echo ========================================
echo.

echo [1/4] إيقاف الخوادم الموجودة...
taskkill /f /im php.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
echo ✅ تم إيقاف الخوادم الموجودة

echo.
echo [2/4] تشغيل خادم Python AI...
start /min cmd /c "python ai/enhanced_ai_server.py"
timeout /t 2 /nobreak >nul
echo ✅ خادم Python AI يعمل

echo.
echo [3/4] تشغيل خادم PHP...
start /min cmd /c "php -S 127.0.0.1:8000"
timeout /t 3 /nobreak >nul
echo ✅ خادم PHP يعمل

echo.
echo [4/4] فتح الموقع...
echo جاري فتح المتصفح...
start http://127.0.0.1:8000/index-fast.php

echo.
echo ========================================
echo   تم تشغيل الموقع بنجاح!
echo ========================================
echo.
echo الروابط المتاحة:
echo   • الموقع السريع: http://127.0.0.1:8000/index-fast.php
echo   • صفحة الاختبار: http://127.0.0.1:8000/test-fast.html
echo   • الموقع الأصلي: http://127.0.0.1:8000/
echo   • فحص الحالة: http://127.0.0.1:8000/check-status.php
echo.
echo للتحقق من حالة الخوادم:
echo   http://127.0.0.1:8000/check-status.php
echo.
echo لإيقاف الخوادم: اضغط Ctrl+C في نوافذ الخوادم
echo.
pause 