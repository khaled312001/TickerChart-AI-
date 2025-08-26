<?php
/**
 * Debug API Script
 * سكريبت تصحيح API
 */

header('Content-Type: text/html; charset=utf-8');
require_once 'api_keys.php';

echo "<!DOCTYPE html>
<html lang='ar' dir='rtl'>
<head>
    <meta charset='UTF-8'>
    <title>تصحيح API</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test { margin: 10px 0; padding: 10px; border: 1px solid #ccc; }
        .success { background: #d4edda; }
        .error { background: #f8d7da; }
        .warning { background: #fff3cd; }
        pre { background: #f8f9fa; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>تصحيح API - TickerChart AI</h1>";

// Test 1: Check API Keys
echo "<div class='test'>
    <h3>1. فحص مفاتيح API</h3>
    <p><strong>Twelve Data API Key:</strong> " . (defined('TWELVE_DATA_API_KEY') ? '✅ موجود' : '❌ غير موجود') . "</p>
    <p><strong>Alpha Vantage API Key:</strong> " . (defined('ALPHA_VANTAGE_API_KEY') ? '✅ موجود' : '❌ غير موجود') . "</p>
    <p><strong>Twelve Data Settings:</strong> " . (defined('TWELVE_DATA_SETTINGS') ? '✅ موجود' : '❌ غير موجود') . "</p>
</div>";

// Test 2: Test Enhanced Market API directly
echo "<div class='test'>
    <h3>2. اختبار Enhanced Market API مباشرة</h3>";

try {
    $apiUrl = 'http://localhost:8000/api/enhanced_market_api.php?action=market_overview';
    echo "<p>جاري اختبار: $apiUrl</p>";
    
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'method' => 'GET',
            'header' => 'User-Agent: Debug-Script/1.0'
        ]
    ]);
    
    $response = @file_get_contents($apiUrl, false, $context);
    
    if ($response === false) {
        $error = error_get_last();
        echo "<div class='error'>
            <p>❌ فشل في الاتصال</p>
            <p>الخطأ: " . ($error['message'] ?? 'خطأ غير محدد') . "</p>
        </div>";
    } else {
        echo "<div class='success'>
            <p>✅ تم الاتصال بنجاح</p>
            <p>طول الاستجابة: " . strlen($response) . " حرف</p>
        </div>";
        
        $data = json_decode($response, true);
        if ($data) {
            echo "<div class='success'>
                <p>✅ تم تحليل JSON بنجاح</p>
                <pre>" . json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "</pre>
            </div>";
        } else {
            echo "<div class='warning'>
                <p>⚠️ فشل في تحليل JSON</p>
                <p>الاستجابة الخام:</p>
                <pre>" . htmlspecialchars($response) . "</pre>
            </div>";
        }
    }
} catch (Exception $e) {
    echo "<div class='error'>
        <p>❌ خطأ في الاختبار</p>
        <p>" . $e->getMessage() . "</p>
    </div>";
}

echo "</div>";

// Test 3: Test AI Tools API
echo "<div class='test'>
    <h3>3. اختبار AI Tools API</h3>";

try {
    $apiUrl = 'http://localhost:8000/api/ai_tools.php?action=trend_analysis';
    echo "<p>جاري اختبار: $apiUrl</p>";
    
    $response = @file_get_contents($apiUrl);
    
    if ($response === false) {
        $error = error_get_last();
        echo "<div class='error'>
            <p>❌ فشل في الاتصال</p>
            <p>الخطأ: " . ($error['message'] ?? 'خطأ غير محدد') . "</p>
        </div>";
    } else {
        echo "<div class='success'>
            <p>✅ تم الاتصال بنجاح</p>
            <p>طول الاستجابة: " . strlen($response) . " حرف</p>
        </div>";
        
        $data = json_decode($response, true);
        if ($data) {
            echo "<div class='success'>
                <p>✅ تم تحليل JSON بنجاح</p>
                <pre>" . json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "</pre>
            </div>";
        } else {
            echo "<div class='warning'>
                <p>⚠️ فشل في تحليل JSON</p>
                <p>الاستجابة الخام:</p>
                <pre>" . htmlspecialchars($response) . "</pre>
            </div>";
        }
    }
} catch (Exception $e) {
    echo "<div class='error'>
        <p>❌ خطأ في الاختبار</p>
        <p>" . $e->getMessage() . "</p>
    </div>";
}

echo "</div>";

// Test 4: Check if files exist
echo "<div class='test'>
    <h3>4. فحص وجود الملفات</h3>
    <p><strong>enhanced_market_api.php:</strong> " . (file_exists('api/enhanced_market_api.php') ? '✅ موجود' : '❌ غير موجود') . "</p>
    <p><strong>ai_tools.php:</strong> " . (file_exists('api/ai_tools.php') ? '✅ موجود' : '❌ غير موجود') . "</p>
    <p><strong>api_keys.php:</strong> " . (file_exists('api_keys.php') ? '✅ موجود' : '❌ غير موجود') . "</p>
</div>";

echo "</body></html>";
?> 