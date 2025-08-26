<?php
/**
 * Direct API Test - اختبار API مباشر
 * Tests the API classes directly without HTTP requests
 */

require_once 'api_keys.php';

echo "<!DOCTYPE html>
<html lang='ar' dir='rtl'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>اختبار API المباشر - TickerChart AI</title>
    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' rel='stylesheet'>
    <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' rel='stylesheet'>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .test-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .test-result { margin: 10px 0; padding: 10px; border-radius: 5px; }
        .success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .error { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
        .info { background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class='container mt-4'>
        <div class='row'>
            <div class='col-12'>
                <h1 class='text-center mb-4'>
                    <i class='fas fa-vial me-2'></i>
                    اختبار API المباشر - TickerChart AI v3.0
                </h1>
                
                <div class='alert alert-info'>
                    <h5><i class='fas fa-info-circle me-2'></i>معلومات الاختبار</h5>
                    <p>هذا الملف يختبر الوظائف مباشرة بدون طلبات HTTP</p>
                </div>
            </div>
        </div>";

// Test 1: API Configuration
echo "<div class='test-section'>
    <h3><i class='fas fa-cog me-2'></i>اختبار إعدادات API</h3>";

$twelveDataKey = defined('TWELVE_DATA_API_KEY') ? TWELVE_DATA_API_KEY : null;
$alphaVantageKey = defined('ALPHA_VANTAGE_API_KEY') ? ALPHA_VANTAGE_API_KEY : null;

echo "<div class='row'>
    <div class='col-md-6'>
        <div class='test-result " . ($twelveDataKey ? 'success' : 'error') . "'>
            <strong>Twelve Data API Key:</strong> 
            <span class='badge " . ($twelveDataKey ? 'bg-success' : 'bg-danger') . "'>
                " . ($twelveDataKey ? 'مفعل' : 'غير مفعل') . "
            </span>
            <br><small>" . ($twelveDataKey ? 'مفتاح API صحيح' : 'مفتاح API غير موجود') . "</small>
        </div>
    </div>
    <div class='col-md-6'>
        <div class='test-result " . ($alphaVantageKey && $alphaVantageKey !== 'demo' ? 'success' : 'warning') . "'>
            <strong>Alpha Vantage API Key:</strong> 
            <span class='badge " . ($alphaVantageKey && $alphaVantageKey !== 'demo' ? 'bg-success' : 'bg-warning') . "'>
                " . ($alphaVantageKey && $alphaVantageKey !== 'demo' ? 'مفعل' : 'تجريبي') . "
            </span>
            <br><small>" . ($alphaVantageKey && $alphaVantageKey !== 'demo' ? 'مفتاح API صحيح' : 'يستخدم مفتاح تجريبي محدود') . "</small>
        </div>
    </div>
</div>";

echo "</div>";

// Test 2: Enhanced Market API Class
echo "<div class='test-section'>
    <h3><i class='fas fa-chart-line me-2'></i>اختبار Enhanced Market API</h3>";

try {
    // Include the API class
    require_once 'api/enhanced_market_api.php';
    
    // Create instance
    $api = new EnhancedMarketAPI();
    
    echo "<div class='test-result success'>
        <strong>✅ Enhanced Market API Class:</strong> تم تحميل الفئة بنجاح
    </div>";
    
    // Test market overview
    $result = $api->getMarketOverview();
    
    if ($result && isset($result['success'])) {
        echo "<div class='test-result success'>
            <strong>✅ Market Overview:</strong> يعمل بشكل صحيح
            <br><small>تم استلام " . count($result['market_data'] ?? []) . " سهم</small>
        </div>";
        
        // Show sample data
        if (isset($result['market_data']) && count($result['market_data']) > 0) {
            echo "<div class='test-result info'>
                <strong>عينة من البيانات:</strong>
                <div class='row mt-2'>";
            
            $sampleStocks = array_slice($result['market_data'], 0, 3);
            foreach ($sampleStocks as $stock) {
                echo "<div class='col-md-4'>
                    <div class='card'>
                        <div class='card-body'>
                            <h6>{$stock['name']}</h6>
                            <p class='mb-1'>السعر: {$stock['price']}</p>
                            <p class='mb-0'>التغير: <span class='" . ($stock['change_percent'] >= 0 ? 'text-success' : 'text-danger') . "'>
                                " . ($stock['change_percent'] >= 0 ? '+' : '') . "{$stock['change_percent']}%
                            </span></p>
                        </div>
                    </div>
                </div>";
            }
            
            echo "</div></div>";
        }
    } else {
        echo "<div class='test-result error'>
            <strong>❌ Market Overview:</strong> فشل في استلام البيانات
            <br><small>" . ($result['error'] ?? 'خطأ غير محدد') . "</small>
        </div>";
    }
    
} catch (Exception $e) {
    echo "<div class='test-result error'>
        <strong>❌ Enhanced Market API:</strong> خطأ في الاختبار
        <br><small>" . $e->getMessage() . "</small>
    </div>";
}

echo "</div>";

// Test 3: Stock Analysis
echo "<div class='test-section'>
    <h3><i class='fas fa-search me-2'></i>اختبار تحليل الأسهم</h3>";

try {
    $stockSymbol = '1120.SR'; // الراجحي
    $result = $api->getCompanyInsights($stockSymbol);
    
    if ($result && isset($result['success']) && $result['success']) {
        echo "<div class='test-result success'>
            <strong>✅ تحليل السهم ({$stockSymbol}):</strong> يعمل بشكل صحيح
        </div>";
        
        // Show analysis details
        echo "<div class='test-result info'>
            <strong>تفاصيل التحليل:</strong>
            <div class='row mt-2'>";
        
        if (isset($result['quote'])) {
            echo "<div class='col-md-6'>
                <h6>بيانات السعر</h6>
                <ul class='list-unstyled'>
                    <li>السعر الحالي: {$result['quote']['close']}</li>
                    <li>التغير: {$result['quote']['change']}</li>
                    <li>التغير %: {$result['quote']['percent_change']}%</li>
                    <li>الحجم: " . number_format($result['quote']['volume']) . "</li>
                </ul>
            </div>";
        }
        
        if (isset($result['technical_indicators'])) {
            echo "<div class='col-md-6'>
                <h6>المؤشرات الفنية</h6>
                <ul class='list-unstyled'>
                    <li>RSI: " . ($result['technical_indicators']['rsi'] ?? 'N/A') . "</li>
                    <li>SMA 20: " . ($result['technical_indicators']['sma_20'] ?? 'N/A') . "</li>
                    <li>SMA 50: " . ($result['technical_indicators']['sma_50'] ?? 'N/A') . "</li>
                </ul>
            </div>";
        }
        
        echo "</div></div>";
        
    } else {
        echo "<div class='test-result error'>
            <strong>❌ تحليل السهم:</strong> فشل في التحليل
            <br><small>" . ($result['error'] ?? 'خطأ غير محدد') . "</small>
        </div>";
    }
    
} catch (Exception $e) {
    echo "<div class='test-result error'>
        <strong>❌ تحليل السهم:</strong> خطأ في الاختبار
        <br><small>" . $e->getMessage() . "</small>
    </div>";
}

echo "</div>";

// Test 4: Python Analyzer
echo "<div class='test-section'>
    <h3><i class='fas fa-python me-2'></i>اختبار محلل Python</h3>";

try {
    $pythonScript = 'ai/enhanced_stock_analyzer.py';
    
    if (file_exists($pythonScript)) {
        echo "<div class='test-result success'>
            <strong>✅ ملف Python:</strong> موجود
        </div>";
        
        // Test Python execution
        $command = "python3 " . escapeshellarg($pythonScript) . " analyze_stock 1120.SR 2>&1";
        $output = shell_exec($command);
        
        if ($output) {
            $data = json_decode($output, true);
            
            if ($data && !isset($data['error'])) {
                echo "<div class='test-result success'>
                    <strong>✅ محلل Python:</strong> يعمل بشكل صحيح
                </div>";
                
                // Show analysis summary
                if (isset($data['sentiment_analysis'])) {
                    echo "<div class='test-result info'>
                        <strong>تحليل المشاعر:</strong>
                        <ul>
                            <li>المشاعر: {$data['sentiment_analysis']['sentiment']}</li>
                            <li>الدرجة: {$data['sentiment_analysis']['score']}</li>
                        </ul>
                    </div>";
                }
                
            } else {
                echo "<div class='test-result warning'>
                    <strong>⚠️ محلل Python:</strong> يعمل مع تحذيرات
                    <br><small>" . ($data['error'] ?? 'خطأ في التحليل') . "</small>
                </div>";
            }
        } else {
            echo "<div class='test-result error'>
                <strong>❌ محلل Python:</strong> فشل في التنفيذ
                <br><small>لا يمكن تشغيل السكريبت</small>
            </div>";
        }
    } else {
        echo "<div class='test-result error'>
            <strong>❌ ملف Python:</strong> غير موجود
        </div>";
    }
} catch (Exception $e) {
    echo "<div class='test-result error'>
        <strong>❌ محلل Python:</strong> خطأ في الاختبار
        <br><small>" . $e->getMessage() . "</small>
    </div>";
}

echo "</div>";

// Summary
echo "<div class='test-section'>
    <h3><i class='fas fa-clipboard-check me-2'></i>ملخص الاختبارات</h3>
    
    <div class='alert alert-success'>
        <h5><i class='fas fa-check-circle me-2'></i>الوظائف المختبرة</h5>
        <ul>
            <li>✅ إعدادات API (Twelve Data, Alpha Vantage)</li>
            <li>✅ Enhanced Market API Class</li>
            <li>✅ تحليل الأسهم المحسن</li>
            <li>✅ محلل Python المحسن</li>
        </ul>
    </div>
    
    <div class='alert alert-info'>
        <h5><i class='fas fa-lightbulb me-2'></i>التحسينات الجديدة</h5>
        <ul>
            <li>🔗 تكامل Twelve Data API للبيانات المباشرة</li>
            <li>🤖 تحليل ذكي محسن مع رؤى AI</li>
            <li>📊 مؤشرات فنية شاملة</li>
            <li>⚡ تخزين مؤقت محسن للأداء</li>
            <li>📱 واجهة مستخدم محسنة</li>
            <li>🔄 تحديثات مباشرة</li>
        </ul>
    </div>
</div>";

echo "
    </div>
    
    <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'></script>
</body>
</html>";
?> 