<?php
/**
 * Simple API Test
 * اختبار API بسيط
 */

header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>
<html lang='ar' dir='rtl'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>اختبار API بسيط - TickerChart AI</title>
    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' rel='stylesheet'>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .test-result { margin: 10px 0; padding: 10px; border-radius: 5px; }
        .success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .error { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class='container mt-4'>
        <h1>اختبار API بسيط - TickerChart AI</h1>
        
        <div class='row'>
            <div class='col-md-6'>
                <h3>اختبار Enhanced Market API</h3>";

// Test 1: Direct file inclusion
echo "<div class='test-result success'>
    <strong>✅ اختبار تضمين الملف:</strong>
    <br><small>جاري اختبار تضمين ملف enhanced_market_api.php</small>
</div>";

try {
    // Test if we can include the file
    ob_start();
    include __DIR__ . '/api/enhanced_market_api.php';
    $output = ob_get_clean();
    
    echo "<div class='test-result success'>
        <strong>✅ تضمين الملف ناجح:</strong>
        <br><small>تم تضمين الملف بنجاح</small>
    </div>";
    
} catch (Exception $e) {
    echo "<div class='test-result error'>
        <strong>❌ خطأ في تضمين الملف:</strong>
        <br><small>" . $e->getMessage() . "</small>
    </div>";
}

// Test 2: Check if constants are defined
echo "<div class='test-result success'>
    <strong>✅ اختبار الثوابت:</strong>
    <br><small>جاري اختبار تعريف الثوابت</small>
</div>";

if (defined('TWELVE_DATA_API_KEY')) {
    echo "<div class='test-result success'>
        <strong>✅ TWELVE_DATA_API_KEY معرف:</strong>
        <br><small>" . substr(TWELVE_DATA_API_KEY, 0, 10) . "...</small>
    </div>";
} else {
    echo "<div class='test-result error'>
        <strong>❌ TWELVE_DATA_API_KEY غير معرف</strong>
    </div>";
}

if (defined('SAUDI_STOCKS')) {
    echo "<div class='test-result success'>
        <strong>✅ SAUDI_STOCKS معرف:</strong>
        <br><small>" . count(SAUDI_STOCKS) . " سهم</small>
    </div>";
} else {
    echo "<div class='test-result error'>
        <strong>❌ SAUDI_STOCKS غير معرف</strong>
    </div>";
}

// Test 3: Test API endpoints
echo "<div class='test-result success'>
    <strong>✅ اختبار نقاط النهاية:</strong>
    <br><small>جاري اختبار نقاط النهاية</small>
</div>";

// Test market overview endpoint
$testUrl = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/api/enhanced_market_api.php?action=market_overview';
echo "<div class='test-result success'>
    <strong>URL الاختبار:</strong>
    <br><small><a href='$testUrl' target='_blank'>$testUrl</a></small>
</div>";

try {
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'method' => 'GET',
            'header' => 'User-Agent: TickerChart-AI-Test/1.0'
        ]
    ]);
    
    $response = file_get_contents($testUrl, false, $context);
    
    if ($response !== false) {
        $data = json_decode($response, true);
        
        if ($data && isset($data['success'])) {
            echo "<div class='test-result success'>
                <strong>✅ استجابة API ناجحة:</strong>
                <br><small>تم استلام البيانات بنجاح</small>
            </div>";
            
            echo "<div class='test-result success'>
                <strong>بيانات الاستجابة:</strong>
                <pre>" . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>
            </div>";
        } else {
            echo "<div class='test-result error'>
                <strong>❌ استجابة API غير صحيحة:</strong>
                <br><small>البيانات المستلمة ليست بتنسيق JSON صحيح</small>
            </div>";
            
            echo "<div class='test-result error'>
                <strong>الاستجابة الخام:</strong>
                <pre>" . htmlspecialchars(substr($response, 0, 500)) . "</pre>
            </div>";
        }
    } else {
        echo "<div class='test-result error'>
            <strong>❌ فشل في الاتصال بـ API:</strong>
            <br><small>لا يمكن الوصول إلى نقطة النهاية</small>
        </div>";
    }
    
} catch (Exception $e) {
    echo "<div class='test-result error'>
        <strong>❌ خطأ في اختبار API:</strong>
        <br><small>" . $e->getMessage() . "</small>
    </div>";
}

echo "
            </div>
            
            <div class='col-md-6'>
                <h3>معلومات النظام</h3>
                
                <div class='test-result success'>
                    <strong>إصدار PHP:</strong> " . PHP_VERSION . "
                </div>
                
                <div class='test-result success'>
                    <strong>المجلد الحالي:</strong> " . __DIR__ . "
                </div>
                
                <div class='test-result success'>
                    <strong>URL الحالي:</strong> " . $_SERVER['REQUEST_URI'] . "
                </div>
                
                <div class='test-result success'>
                    <strong>المضيف:</strong> " . $_SERVER['HTTP_HOST'] . "
                </div>
                
                <div class='test-result success'>
                    <strong>المجلد الأساسي:</strong> " . dirname($_SERVER['REQUEST_URI']) . "
                </div>
            </div>
        </div>
        
        <div class='row mt-4'>
            <div class='col-12'>
                <h3>روابط الاختبار</h3>
                
                <div class='list-group'>
                    <a href='$testUrl' target='_blank' class='list-group-item list-group-item-action'>
                        <strong>اختبار Enhanced Market API</strong>
                        <br><small>اختبار نقطة النهاية الرئيسية</small>
                    </a>
                    
                    <a href='" . dirname($testUrl) . "/ai_tools.php?action=trend_analysis' target='_blank' class='list-group-item list-group-item-action'>
                        <strong>اختبار AI Tools</strong>
                        <br><small>اختبار أدوات الذكاء الاصطناعي</strong>
                    </a>
                    
                    <a href='test_enhanced_api.php' class='list-group-item list-group-item-action'>
                        <strong>اختبار شامل</strong>
                        <br><small>الاختبار الشامل لجميع الميزات</small>
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'></script>
</body>
</html>";
?> 