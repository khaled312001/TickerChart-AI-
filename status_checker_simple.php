<?php
/**
 * Simple Website Status Checker
 * فاحص حالة الموقع المبسط
 */

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

function checkFile($path) {
    if (file_exists($path)) {
        $size = filesize($path);
        return [
            'status' => 'success',
            'message' => 'موجود - ' . number_format($size) . ' bytes'
        ];
    } else {
        return [
            'status' => 'error',
            'message' => 'غير موجود'
        ];
    }
}

function checkPython() {
    $pythonCmd = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' ? 'python' : 'python3';
    $output = @shell_exec($pythonCmd . ' --version 2>&1');
    
    if ($output && strpos($output, 'Python') !== false) {
        return [
            'status' => 'success',
            'message' => 'متاح - ' . trim($output)
        ];
    } else {
        return [
            'status' => 'error',
            'message' => 'غير متاح'
        ];
    }
}

function checkSimpleAPI($url, $name) {
    $context = stream_context_create([
        'http' => [
            'timeout' => 3,
            'user_agent' => 'SimpleStatusChecker/1.0'
        ]
    ]);
    
    $start = microtime(true);
    $response = @file_get_contents($url, false, $context);
    $end = microtime(true);
    $responseTime = round(($end - $start) * 1000, 2);
    
    if ($response === false) {
        return [
            'status' => 'error',
            'message' => 'فشل في الاتصال',
            'response_time' => $responseTime
        ];
    }
    
    return [
        'status' => 'success',
        'message' => 'يعمل - ' . $responseTime . 'ms',
        'response_time' => $responseTime
    ];
}

// Check all components
$checks = [
    'basic' => [
        'PHP Version' => ['status' => 'success', 'message' => 'PHP ' . PHP_VERSION],
        'Python' => checkPython(),
        'File Permissions' => [
            'status' => is_writable('api/cache') ? 'success' : 'warning',
            'message' => is_writable('api/cache') ? 'قابل للكتابة' : 'غير قابل للكتابة'
        ]
    ],
    'files' => [
        'Main Index' => checkFile('index.php'),
        'AI Bridge' => checkFile('ai/api_bridge.py'),
        'Stock Analyzer' => checkFile('ai/stock_analyzer.py'),
        'CSS Styles' => checkFile('assets/css/style.css'),
        'Main JavaScript' => checkFile('assets/js/main.js')
    ],
    'apis' => [
        'Market Data API (Simple)' => checkSimpleAPI('http://localhost:8000/api/market_data_simple.php', 'Market Data'),
        'AI Tools API (Simple)' => checkSimpleAPI('http://localhost:8000/api/ai_tools_simple.php?action=trend_analysis', 'AI Tools'),
        'Sector Indicators API (Simple)' => checkSimpleAPI('http://localhost:8000/api/sector_indicators_simple.php', 'Sector Indicators')
    ]
];

// Calculate overall status
$totalChecks = 0;
$successChecks = 0;
$warningChecks = 0;
$errorChecks = 0;

foreach ($checks as $category => $items) {
    foreach ($items as $name => $result) {
        $totalChecks++;
        switch ($result['status']) {
            case 'success':
                $successChecks++;
                break;
            case 'warning':
                $warningChecks++;
                break;
            case 'error':
                $errorChecks++;
                break;
        }
    }
}

$overallStatus = $errorChecks === 0 ? 'success' : ($warningChecks === 0 ? 'warning' : 'error');
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاحص حالة الموقع المبسط - TickerChart AI</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status-header { text-align: center; margin-bottom: 30px; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; color: white; font-weight: bold; }
        .status-success { background: #28a745; }
        .status-warning { background: #ffc107; color: #333; }
        .status-error { background: #dc3545; }
        .check-section { margin: 20px 0; }
        .check-section h3 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .check-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #ddd; }
        .check-item.success { border-left-color: #28a745; }
        .check-item.warning { border-left-color: #ffc107; }
        .check-item.error { border-left-color: #dc3545; }
        .check-name { font-weight: bold; }
        .check-result { text-align: left; }
        .check-message { color: #666; font-size: 0.9em; }
        .summary { background: #e9ecef; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .summary h4 { margin-top: 0; }
        .progress-bar { background: #ddd; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; transition: width 0.3s ease; }
        .progress-success { background: #28a745; }
        .progress-warning { background: #ffc107; }
        .progress-error { background: #dc3545; }
        .note { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .timestamp { text-align: center; color: #666; font-size: 0.9em; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="status-header">
            <h1>🔍 فاحص حالة الموقع المبسط - TickerChart AI</h1>
            <p>فحص سريع وموثوق لجميع مكونات الموقع</p>
            <div class="status-badge status-<?php echo $overallStatus; ?>">
                <?php
                switch ($overallStatus) {
                    case 'success':
                        echo '✅ جميع الأنظمة تعمل بشكل صحيح';
                        break;
                    case 'warning':
                        echo '⚠️ بعض الأنظمة تحتاج انتباه';
                        break;
                    case 'error':
                        echo '❌ هناك مشاكل تحتاج إصلاح';
                        break;
                }
                ?>
            </div>
        </div>

        <div class="timestamp">
            <strong>آخر تحديث:</strong> <?php echo date('Y-m-d H:i:s'); ?>
        </div>

        <div class="note">
            <h4>📝 ملاحظة مهمة:</h4>
            <p>هذا الفاحص المبسط يستخدم APIs مبسطة تعمل بسرعة عالية. جميع الفحوصات تتم في الوقت الفعلي بدون أي cache.</p>
        </div>

        <div class="summary">
            <h4>📊 ملخص الحالة</h4>
            <div style="display: flex; justify-content: space-around; text-align: center; margin: 20px 0;">
                <div>
                    <strong>إجمالي الفحوصات:</strong><br>
                    <span style="font-size: 1.5em; color: #333;"><?php echo $totalChecks; ?></span>
                </div>
                <div>
                    <strong>ناجحة:</strong><br>
                    <span style="font-size: 1.5em; color: #28a745;"><?php echo $successChecks; ?></span>
                </div>
                <div>
                    <strong>تحتاج انتباه:</strong><br>
                    <span style="font-size: 1.5em; color: #ffc107;"><?php echo $warningChecks; ?></span>
                </div>
                <div>
                    <strong>فاشلة:</strong><br>
                    <span style="font-size: 1.5em; color: #dc3545;"><?php echo $errorChecks; ?></span>
                </div>
            </div>
            
            <div class="progress-bar">
                <?php
                $successPercent = ($totalChecks > 0) ? ($successChecks / $totalChecks) * 100 : 0;
                $warningPercent = ($totalChecks > 0) ? ($warningChecks / $totalChecks) * 100 : 0;
                $errorPercent = ($totalChecks > 0) ? ($errorChecks / $totalChecks) * 100 : 0;
                ?>
                <div class="progress-fill progress-success" style="width: <?php echo $successPercent; ?>%"></div>
                <div class="progress-fill progress-warning" style="width: <?php echo $warningPercent; ?>%"></div>
                <div class="progress-fill progress-error" style="width: <?php echo $errorPercent; ?>%"></div>
            </div>
            
            <p style="text-align: center; margin-top: 15px;">
                <strong>نسبة النجاح:</strong> 
                <span style="font-size: 1.2em; color: <?php echo $successPercent >= 80 ? '#28a745' : ($successPercent >= 60 ? '#ffc107' : '#dc3545'); ?>">
                    <?php echo round($successPercent, 1); ?>%
                </span>
            </p>
        </div>

        <?php foreach ($checks as $category => $items): ?>
        <div class="check-section">
            <h3>
                <?php
                switch ($category) {
                    case 'basic':
                        echo '🔧 المتطلبات الأساسية';
                        break;
                    case 'files':
                        echo '📁 الملفات والمجلدات';
                        break;
                    case 'apis':
                        echo '🌐 واجهات API (مبسطة)';
                        break;
                }
                ?>
            </h3>
            
            <?php foreach ($items as $name => $result): ?>
            <div class="check-item <?php echo $result['status']; ?>">
                <div class="check-name"><?php echo $name; ?></div>
                <div class="check-result">
                    <div class="check-message">
                        <?php echo $result['message']; ?>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endforeach; ?>

        <div class="check-section">
            <h3>🚀 إجراءات سريعة</h3>
            <div style="text-align: center;">
                <a href="index.php" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">فتح الموقع الرئيسي</a>
                <a href="test_website.php" style="display: inline-block; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">اختبار شامل</a>
                <button onclick="location.reload()" style="display: inline-block; padding: 10px 20px; background: #ffc107; color: #333; text-decoration: none; border-radius: 5px; margin: 5px; border: none; cursor: pointer;">إعادة فحص</button>
            </div>
        </div>

        <div class="check-section">
            <h3>📝 ملاحظات</h3>
            <ul>
                <li>جميع الفحوصات تتم في الوقت الفعلي بدون cache</li>
                <li>الأوقات المستغرقة تشمل وقت الاستجابة الكامل</li>
                <li>يتم فحص الملفات والمجلدات والصلاحيات</li>
                <li>يتم اختبار جميع واجهات API المتاحة</li>
                <li>تم إنشاء نسخ مبسطة من APIs لضمان العمل</li>
                <li>هذا الفاحص مبسط ويعمل بسرعة عالية</li>
            </ul>
        </div>
    </div>
</body>
</html> 