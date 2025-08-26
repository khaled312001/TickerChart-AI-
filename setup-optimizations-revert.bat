@echo off
echo ========================================
echo TickerChart AI Performance Optimization Revert
echo ========================================
echo.

echo Reverting to original files...

if exist "assets\js\main.js.backup" (
    copy "assets\js\main.js.backup" "assets\js\main.js"
    echo ✅ Restored original main.js
) else (
    echo ❌ main.js.backup not found!
)

if exist "assets\js\charts.js.backup" (
    copy "assets\js\charts.js.backup" "assets\js\charts.js"
    echo ✅ Restored original charts.js
) else (
    echo ❌ charts.js.backup not found!
)

if exist "assets\css\style.css.backup" (
    copy "assets\css\style.css.backup" "assets\css\style.css"
    echo ✅ Restored original style.css
) else (
    echo ❌ style.css.backup not found!
)

echo.
echo ========================================
echo Revert Complete!
echo ========================================
echo.
echo Original files have been restored
echo Performance optimizations have been removed
echo.
pause 