@echo off
chcp 65001 >nul
echo ========================================
echo   اختبار أوضاع الخادم - TickerChart AI
echo ========================================
echo.

echo اختر وضع التشغيل:
echo.
echo [1] الوضع السريع (افتراضي)
echo [2] الوضع العادي
echo [3] اختبار الوضع السريع
echo [4] فحص الحالة
echo [5] خروج
echo.

set /p choice="أدخل رقم الخيار (1-5): "

if "%choice%"=="1" (
    echo.
    echo 🚀 تشغيل الوضع السريع...
    call start_server.bat --fast
) else if "%choice%"=="2" (
    echo.
    echo 🌐 تشغيل الوضع العادي...
    call start_server.bat --normal
) else if "%choice%"=="3" (
    echo.
    echo 🧪 اختبار الوضع السريع...
    if exist "run-fast-website.bat" (
        call run-fast-website.bat
    ) else (
        echo ⚠️  ملف run-fast-website.bat غير موجود
        echo جاري فتح صفحة الاختبار مباشرة...
        start http://127.0.0.1:8000/test-fast.html
    )
) else if "%choice%"=="4" (
    echo.
    echo 📊 فحص حالة الخوادم...
    start http://127.0.0.1:8000/check-status.php
    echo تم فتح صفحة فحص الحالة
    pause
) else if "%choice%"=="5" (
    echo.
    echo 👋 شكراً لاستخدام TickerChart AI
    exit /b 0
) else (
    echo.
    echo ❌ خيار غير صحيح
    pause
    goto :main
)

echo.
echo تم تنفيذ الطلب بنجاح!
pause 