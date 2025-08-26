@echo off
echo ========================================
echo TickerChart AI Performance Optimization Setup
echo ========================================
echo.

echo Checking current files...
if exist "assets\js\main.js" (
    echo Found main.js - backing up...
    copy "assets\js\main.js" "assets\js\main.js.backup"
) else (
    echo main.js not found!
)

if exist "assets\js\charts.js" (
    echo Found charts.js - backing up...
    copy "assets\js\charts.js" "assets\js\charts.js.backup"
) else (
    echo charts.js not found!
)

if exist "assets\css\style.css" (
    echo Found style.css - backing up...
    copy "assets\css\style.css" "assets\css\style.css.backup"
) else (
    echo style.css not found!
)

echo.
echo Applying optimizations...

if exist "assets\js\main-optimized.js" (
    copy "assets\js\main-optimized.js" "assets\js\main.js"
    echo ✅ Applied optimized main.js
) else (
    echo ❌ main-optimized.js not found!
)

if exist "assets\js\charts-optimized.js" (
    copy "assets\js\charts-optimized.js" "assets\js\charts.js"
    echo ✅ Applied optimized charts.js
) else (
    echo ❌ charts-optimized.js not found!
)

if exist "assets\css\style-optimized.css" (
    copy "assets\css\style-optimized.css" "assets\css\style.css"
    echo ✅ Applied optimized style.css
) else (
    echo ❌ style-optimized.css not found!
)

echo.
echo ========================================
echo Optimization Setup Complete!
echo ========================================
echo.
echo Files backed up with .backup extension
echo Original files replaced with optimized versions
echo.
echo To test performance, open test-performance.html
echo To revert changes, run: setup-optimizations-revert.bat
echo.
pause 