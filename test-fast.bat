@echo off
chcp 65001 >nul
echo ========================================
echo   اختبار النسخة السريعة - TickerChart AI
echo ========================================
echo.

echo [1/3] فحص الخوادم...
netstat -an | findstr ":8000" >nul
if %errorlevel% equ 0 (
    echo ✅ الخادم الرئيسي يعمل على المنفذ 8000
) else (
    echo ❌ الخادم الرئيسي غير متاح
    echo يرجى تشغيل start_server.bat أولاً
    pause
    exit /b 1
)

echo.
echo [2/3] فتح صفحة الاختبار...
echo جاري فتح المتصفح...
start http://127.0.0.1:8000/test-fast.html

echo.
echo [3/3] فتح النسخة السريعة...
echo جاري فتح النسخة السريعة...
start http://127.0.0.1:8000/index-fast.php

echo.
echo ========================================
echo   تم فتح صفحات الاختبار
echo ========================================
echo.
echo الصفحات المفتوحة:
echo   • test-fast.html - صفحة اختبار السرعة
echo   • index-fast.php - النسخة السريعة
echo.
echo للعودة للنسخة الأصلية:
echo   http://127.0.0.1:8000/
echo.
pause 