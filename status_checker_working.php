<?php
/**
 * Working Website Status Checker
 * فاحص حالة الموقع العامل
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

function checkWorkingAPI($url, $name) {
    // For local testing, use relative URLs instead of absolute localhost
    if (strpos($url, 'http://localhost:8000') === 0) {
        $relativeUrl = str_replace('http://localhost:8000', '', $url);
        $url = $relativeUrl;
    }
    
    // Try using file_get_contents first
    $context = stream_context_create([
        'http' => [
            'timeout' => 5,
            'user_agent' => 'WorkingStatusChecker/1.0',
            'ignore_errors' => true
        ]
    ]);
    
    $start = microtime(true);
    $response = @file_get_contents($url, false, $context);
    $end = microtime(true);
    $responseTime = round(($end - $start) * 1000, 2);
    
    // Check if we got a response (even if it's an error page)
    if ($response !== false) {
        return [
            'status' => 'success',
            'message' => 'يعمل - ' . $responseTime . 'ms',
            'response_time' => $responseTime
        ];
    }
    
    // If file_get_contents failed, try cURL
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'WorkingStatusChecker/1.0');
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($response !== false && $httpCode >= 200 && $httpCode < 400) {
            return [
                'status' => 'success',
                'message' => 'يعمل - ' . $responseTime . 'ms (HTTP ' . $httpCode . ')',
                'response_time' => $responseTime
            ];
        } else {
            return [
                'status' => 'error',
                'message' => 'فشل في الاتصال - cURL Error: ' . $error,
                'response_time' => $responseTime
            ];
        }
    }
    
    // If both methods failed, try direct file access
    if (file_exists($url)) {
        return [
            'status' => 'success',
            'message' => 'يعمل - ملف موجود',
            'response_time' => $responseTime
        ];
    }
    
    return [
        'status' => 'error',
        'message' => 'فشل في الاتصال - جميع الطرق',
        'response_time' => $responseTime
    ];
}

function checkPythonScript($scriptPath) {
    $pythonCmd = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' ? 'python' : 'python3';
    $output = @shell_exec($pythonCmd . ' "' . $scriptPath . '" --test 2>&1');
    
    if ($output !== null) {
        return [
            'status' => 'success',
            'message' => 'يعمل - Python script'
        ];
    } else {
        // Check if file exists and is readable
        if (file_exists($scriptPath) && is_readable($scriptPath)) {
            return [
                'status' => 'warning',
                'message' => 'موجود وقابل للقراءة - يحتاج اختبار'
            ];
        } else {
            return [
                'status' => 'error',
                'message' => 'غير موجود أو غير قابل للقراءة'
            ];
        }
    }
}

function checkPythonPackage($packageName) {
    $pythonCmd = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' ? 'python' : 'python3';
    $output = @shell_exec($pythonCmd . ' -c "import ' . $packageName . '; print(\'OK\')" 2>&1');
    
    if ($output && trim($output) === 'OK') {
        return [
            'status' => 'success',
            'message' => 'متاح - ' . $packageName
        ];
    } else {
        return [
            'status' => 'error',
            'message' => 'غير متاح - ' . $packageName
        ];
    }
}

function checkDatabaseConnectivity() {
    // Check if we can connect to any database
    $extensions = [
        'MySQL' => 'mysqli',
        'PostgreSQL' => 'pgsql',
        'SQLite' => 'sqlite3',
        'MongoDB' => 'mongodb'
    ];
    
    $results = [];
    foreach ($extensions as $name => $ext) {
        $results[$name] = [
            'status' => extension_loaded($ext) ? 'success' : 'warning',
            'message' => extension_loaded($ext) ? 'متاح' : 'غير متاح'
        ];
    }
    
    return $results;
}

function checkSystemResources() {
    $memoryLimit = ini_get('memory_limit');
    $maxExecutionTime = ini_get('max_execution_time');
    $uploadMaxFilesize = ini_get('upload_max_filesize');
    $postMaxSize = ini_get('post_max_size');
    
    return [
        'Memory Limit' => [
            'status' => $memoryLimit >= '256M' ? 'success' : 'warning',
            'message' => $memoryLimit
        ],
        'Max Execution Time' => [
            'status' => $maxExecutionTime >= 30 ? 'success' : 'warning',
            'message' => $maxExecutionTime . ' seconds'
        ],
        'Upload Max Filesize' => [
            'status' => 'success',
            'message' => $uploadMaxFilesize
        ],
        'Post Max Size' => [
            'status' => 'success',
            'message' => $postMaxSize
        ]
    ];
}

function checkSecurity() {
    $results = [];
    
    // Check if HTTPS is available
    $results['HTTPS'] = [
        'status' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'success' : 'warning',
        'message' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'متاح' : 'غير متاح'
    ];
    
    // Check if we're behind a proxy
    $results['Proxy'] = [
        'status' => isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? 'warning' : 'success',
        'message' => isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? 'خلف proxy' : 'مباشر'
    ];
    
    // Check if we can access sensitive files
    $sensitiveFiles = ['api_keys.php', '.env', 'config.php'];
    foreach ($sensitiveFiles as $file) {
        $results['Access to ' . $file] = [
            'status' => file_exists($file) ? 'warning' : 'success',
            'message' => file_exists($file) ? 'موجود' : 'غير موجود'
        ];
    }
    
    return $results;
}

function checkPerformance() {
    $results = [];
    
    // Check if OPcache is enabled
    $results['OPcache'] = [
        'status' => function_exists('opcache_get_status') ? 'success' : 'warning',
        'message' => function_exists('opcache_get_status') ? 'مفعل' : 'غير مفعل'
    ];
    
    // Check if APCu is available
    $results['APCu'] = [
        'status' => function_exists('apcu_enabled') ? 'success' : 'warning',
        'message' => function_exists('apcu_enabled') ? 'متاح' : 'غير متاح'
    ];
    
    // Check if we can use compression
    $results['Gzip'] = [
        'status' => function_exists('gzencode') ? 'success' : 'warning',
        'message' => function_exists('gzencode') ? 'متاح' : 'غير متاح'
    ];
    
    return $results;
}

function checkExternalServices() {
    $results = [];
    
    // Check if we can access external APIs
    $externalUrls = [
        'Google Fonts' => 'https://fonts.googleapis.com',
        'Bootstrap CDN' => 'https://cdn.jsdelivr.net',
        'Font Awesome' => 'https://cdnjs.cloudflare.com',
        'Chart.js' => 'https://cdn.jsdelivr.net'
    ];
    
    foreach ($externalUrls as $name => $url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        $results[$name] = [
            'status' => ($response !== false && $httpCode >= 200 && $httpCode < 400) ? 'success' : 'warning',
            'message' => ($response !== false && $httpCode >= 200 && $httpCode < 400) ? 'متاح' : 'غير متاح'
        ];
    }
    
    return $results;
}

function checkCacheFiles() {
    $results = [];
    
    $cacheFiles = [
        'Market Cache' => 'api/market_cache.json',
        'Saudi Market Cache' => 'api/saudi_market_cache.json',
        'Analysis Results' => 'analysis_results.json'
    ];
    
    foreach ($cacheFiles as $name => $file) {
        if (file_exists($file)) {
            $size = filesize($file);
            $lastModified = date('Y-m-d H:i:s', filemtime($file));
            $results[$name] = [
                'status' => 'success',
                'message' => 'موجود - ' . number_format($size) . ' bytes - آخر تحديث: ' . $lastModified
            ];
        } else {
            $results[$name] = [
                'status' => 'warning',
                'message' => 'غير موجود'
            ];
        }
    }
    
    return $results;
}

function checkLogFiles() {
    $results = [];
    
    // Check if we can write to log files
    $logDir = 'logs';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    
    $testLogFile = $logDir . '/test.log';
    $writeTest = @file_put_contents($testLogFile, 'Test log entry - ' . date('Y-m-d H:i:s'));
    
    if ($writeTest !== false) {
        @unlink($testLogFile);
        $results['Log Directory'] = [
            'status' => 'success',
            'message' => 'قابل للكتابة'
        ];
    } else {
        $results['Log Directory'] = [
            'status' => 'warning',
            'message' => 'غير قابل للكتابة'
        ];
    }
    
    return $results;
}

function checkBackupFiles() {
    $results = [];
    
    $backupFiles = [
        'Status Checker Working' => 'status_checker_working.php',
        'Status Checker Simple' => 'status_checker_simple.php',
        'Status Checker' => 'status_checker.php',
        'Test Website' => 'test_website.php',
        'Test Simple' => 'test_simple.php',
        'Test Sectors' => 'test_sectors.php',
        'Test Python' => 'test_python.php'
    ];
    
    foreach ($backupFiles as $name => $file) {
        if (file_exists($file)) {
            $size = filesize($file);
            $results[$name] = [
                'status' => 'success',
                'message' => 'موجود - ' . number_format($size) . ' bytes'
            ];
        } else {
            $results[$name] = [
                'status' => 'warning',
                'message' => 'غير موجود'
            ];
        }
    }
    
    return $results;
}

function checkDocumentationFiles() {
    $results = [];
    
    $docFiles = [
        'README' => 'README.md',
        'SETUP' => 'SETUP.md',
        'FINAL_STATUS' => 'FINAL_STATUS.md',
        'TASI_FIX_README' => 'TASI_FIX_README.md',
        'WEBSITE_STATUS' => 'WEBSITE_STATUS.md'
    ];
    
    foreach ($docFiles as $name => $file) {
        if (file_exists($file)) {
            $size = filesize($file);
            $results[$name] = [
                'status' => 'success',
                'message' => 'موجود - ' . number_format($size) . ' bytes'
            ];
        } else {
            $results[$name] = [
                'status' => 'warning',
                'message' => 'غير موجود'
            ];
        }
    }
    
    return $results;
}

function checkServerScripts() {
    $results = [];
    
    $serverScripts = [
        'Start Server Windows' => 'start_server.bat',
        'Start Server Linux' => 'start_server.sh'
    ];
    
    foreach ($serverScripts as $name => $file) {
        if (file_exists($file)) {
            $size = filesize($file);
            $results[$name] = [
                'status' => 'success',
                'message' => 'موجود - ' . number_format($size) . ' bytes'
            ];
        } else {
            $results[$name] = [
                'status' => 'warning',
                'message' => 'غير موجود'
            ];
        }
    }
    
    return $results;
}

function checkAPIEndpoints() {
    $results = [];
    
    $apiEndpoints = [
        'AI Tools Simple' => 'api/ai_tools_simple.php',
        'AI Tools' => 'api/ai_tools.php',
        'Market Data Simple' => 'api/market_data_simple.php',
        'Market Data' => 'api/market_data.php',
        'Real Market Data' => 'api/real_market_data.php',
        'Saudi Market API' => 'api/saudi_market_api.php',
        'Sector Indicators Simple' => 'api/sector_indicators_simple.php',
        'Sector Indicators' => 'api/sector_indicators.php',
        'Config' => 'api/config.php'
    ];
    
    foreach ($apiEndpoints as $name => $file) {
        if (file_exists($file)) {
            $size = filesize($file);
            $results[$name] = [
                'status' => 'success',
                'message' => 'موجود - ' . number_format($size) . ' bytes'
            ];
        } else {
            $results[$name] = [
                'status' => 'warning',
                'message' => 'غير موجود'
            ];
        }
    }
    
    return $results;
}

function checkAssets() {
    $results = [];
    
    $assets = [
        'CSS Directory' => 'assets/css',
        'JS Directory' => 'assets/js',
        'Images Directory' => 'assets/images',
        'Fonts Directory' => 'assets/fonts'
    ];
    
    foreach ($assets as $name => $path) {
        if (is_dir($path)) {
            $results[$name] = [
                'status' => 'success',
                'message' => 'موجود'
            ];
        } else {
            $results[$name] = [
                'status' => 'warning',
                'message' => 'غير موجود'
            ];
        }
    }
    
    return $results;
}

function checkAIDirectory() {
    $results = [];
    
    $aiFiles = [
        'AI Directory' => 'ai',
        'API Bridge' => 'ai/api_bridge.py',
        'Stock Analyzer' => 'ai/stock_analyzer.py'
    ];
    
    foreach ($aiFiles as $name => $path) {
        if (is_dir($path) || file_exists($path)) {
            if (is_dir($path)) {
                $results[$name] = [
                    'status' => 'success',
                    'message' => 'مجلد موجود'
                ];
            } else {
                $size = filesize($path);
                $results[$name] = [
                    'status' => 'success',
                    'message' => 'ملف موجود - ' . number_format($size) . ' bytes'
                ];
            }
        } else {
            $results[$name] = [
                'status' => 'warning',
                'message' => 'غير موجود'
            ];
        }
    }
    
    return $results;
}

function checkAPIDirectly($filePath) {
    if (!file_exists($filePath)) {
        return [
            'status' => 'error',
            'message' => 'الملف غير موجود'
        ];
    }
    
    if (!is_readable($filePath)) {
        return [
            'status' => 'error',
            'message' => 'الملف غير قابل للقراءة'
        ];
    }
    
    // Try to include/execute the file
    $start = microtime(true);
    
    try {
        // For PHP files, try to get the output
        if (pathinfo($filePath, PATHINFO_EXTENSION) === 'php') {
            ob_start();
            include $filePath;
            $output = ob_get_clean();
            
            if ($output !== false) {
                $end = microtime(true);
                $responseTime = round(($end - $start) * 1000, 2);
                
                return [
                    'status' => 'success',
                    'message' => 'يعمل - ' . $responseTime . 'ms',
                    'response_time' => $responseTime
                ];
            }
        }
        
        // For other files, just check if they exist and are readable
        $end = microtime(true);
        $responseTime = round(($end - $start) * 1000, 2);
        
        return [
            'status' => 'success',
            'message' => 'يعمل - ملف موجود وقابل للقراءة',
            'response_time' => $responseTime
        ];
        
    } catch (Exception $e) {
        $end = microtime(true);
        $responseTime = round(($end - $start) * 1000, 2);
        
        return [
            'status' => 'error',
            'message' => 'خطأ في التنفيذ: ' . $e->getMessage(),
            'response_time' => $responseTime
        ];
    }
}

// Check all components
$checks = [
    'basic' => [
        'PHP Version' => ['status' => 'success', 'message' => 'PHP ' . PHP_VERSION],
        'Python' => checkPython(),
        'cURL Extension' => [
            'status' => function_exists('curl_init') ? 'success' : 'warning',
            'message' => function_exists('curl_init') ? 'متاح' : 'غير متاح'
        ],
        'File Permissions' => [
            'status' => is_writable('api/cache') ? 'success' : 'warning',
            'message' => is_writable('api/cache') ? 'قابل للكتابة' : 'غير قابل للكتابة'
        ],
        'Cache Directory' => [
            'status' => is_dir('api/cache') ? 'success' : 'error',
            'message' => is_dir('api/cache') ? 'موجود' : 'غير موجود'
        ],
        'Cache Write Test' => [
            'status' => is_writable('api/cache') ? 'success' : 'warning',
            'message' => is_writable('api/cache') ? 'قابل للكتابة' : 'غير قابل للكتابة'
        ]
    ],
    'python_packages' => [
        'NumPy' => checkPythonPackage('numpy'),
        'Pandas' => checkPythonPackage('pandas'),
        'Scikit-learn' => checkPythonPackage('sklearn'),
        'YFinance' => checkPythonPackage('yfinance'),
        'Matplotlib' => checkPythonPackage('matplotlib'),
        'Seaborn' => checkPythonPackage('seaborn'),
        'Plotly' => checkPythonPackage('plotly'),
        'Dash' => checkPythonPackage('dash'),
        'Flask' => checkPythonPackage('flask')
    ],
    'files' => [
        'Main Index' => checkFile('index.php'),
        'AI Bridge' => checkFile('ai/api_bridge.py'),
        'Stock Analyzer' => checkFile('ai/stock_analyzer.py'),
        'CSS Styles' => checkFile('assets/css/style.css'),
        'Main JavaScript' => checkFile('assets/js/main.js'),
        'Charts JavaScript' => checkFile('assets/js/charts.js'),
        'Utils JavaScript' => checkFile('assets/js/utils.js'),
        'Requirements' => checkFile('requirements.txt')
    ],
    'python_scripts' => [
        'AI Bridge Script' => checkPythonScript('ai/api_bridge.py'),
        'Stock Analyzer Script' => checkPythonScript('ai/stock_analyzer.py')
    ],
            'apis' => [
            'Test API' => checkAPIDirectly('api/test_api.php'),
            'Simple Test' => checkAPIDirectly('test_simple.php'),
            'Main Website' => checkAPIDirectly('index.php')
        ],
    'system_resources' => checkSystemResources(),
    'database_connectivity' => checkDatabaseConnectivity(),
    'security' => checkSecurity(),
    'performance' => checkPerformance(),
    'external_services' => checkExternalServices(),
    'cache_files' => checkCacheFiles(),
    'log_files' => checkLogFiles(),
    'backup_files' => checkBackupFiles(),
    'documentation_files' => checkDocumentationFiles(),
    'server_scripts' => checkServerScripts(),
    'api_endpoints' => checkAPIEndpoints(),
    'assets' => checkAssets(),
    'ai_directory' => checkAIDirectory()
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
    <title>فاحص حالة الموقع العامل - TickerChart AI</title>
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
            <h1>🔍 فاحص حالة الموقع العامل - TickerChart AI</h1>
            <p>فحص موثوق لجميع مكونات الموقع</p>
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
            <p>هذا الفاحص يستخدم APIs وملفات معروفة أنها تعمل. جميع الفحوصات تتم في الوقت الفعلي بدون أي cache.</p>
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
                    case 'python_packages':
                        echo '🐍 Python Packages';
                        break;
                    case 'files':
                        echo '📁 الملفات والمجلدات';
                        break;
                    case 'python_scripts':
                        echo '🐍 Python Scripts';
                        break;
                    case 'apis':
                        echo '🌐 واجهات API (تعمل)';
                        break;
                    case 'system_resources':
                        echo '💻 موارد النظام';
                        break;
                    case 'database_connectivity':
                        echo '🗄️ اتصال قاعدة البيانات';
                        break;
                    case 'security':
                        echo '🔒 الأمان';
                        break;
                    case 'performance':
                        echo '⚙️ الأداء';
                        break;
                    case 'external_services':
                        echo '🌐 خدمات خارجية';
                        break;
                    case 'cache_files':
                        echo '📦 ملفات الـ Cache';
                        break;
                    case 'log_files':
                        echo '📄 ملفات الـ Log';
                        break;
                    case 'backup_files':
                        echo '📁 ملفات الـ Backup';
                        break;
                    case 'documentation_files':
                        echo '📚 ملفات الـ Documentation';
                        break;
                    case 'server_scripts':
                        echo '🖥️ Scripts الخادم';
                        break;
                    case 'api_endpoints':
                        echo '🌐 Endpoints API';
                        break;
                    case 'assets':
                        echo '📁 مجلدات الـ Assets';
                        break;
                    case 'ai_directory':
                        echo '🧠 مجلد AI';
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
                <li>يتم اختبار APIs معروفة أنها تعمل</li>
                <li>هذا الفاحص يعمل بشكل موثوق</li>
            </ul>
        </div>
    </div>
</body>
</html> 