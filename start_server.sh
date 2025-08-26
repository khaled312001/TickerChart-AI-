#!/bin/bash

echo "========================================"
echo "   سوق الأسهم السعودي - الذكاء الاصطناعي"
echo "========================================"
echo

echo "[1/3] تثبيت مكتبات Python..."
pip3 install -r requirements.txt

echo
echo "[2/3] تشغيل خادم PHP..."
echo "الموقع سيكون متاح على: http://localhost:8000"
echo
php -S localhost:8000 