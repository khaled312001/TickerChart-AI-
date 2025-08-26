<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Function to get real market data (simulated for demo)
function getMarketData() {
    $stocks = [
        'الراجحي' => ['base' => 45.67, 'volatility' => 2.5],
        'سابك' => ['base' => 89.45, 'volatility' => 3.2],
        'الاتصالات السعودية' => ['base' => 34.56, 'volatility' => 1.8],
        'البنك الأهلي' => ['base' => 23.45, 'volatility' => 2.1],
        'الرياض' => ['base' => 67.89, 'volatility' => 2.8],
        'الزيت العربية' => ['base' => 28.90, 'volatility' => 1.5],
        'كيمانول' => ['base' => 45.23, 'volatility' => 3.5],
        'الخزف السعودي' => ['base' => 12.34, 'volatility' => 1.2],
        'اللجين' => ['base' => 56.78, 'volatility' => 2.9],
        'الأنابيب' => ['base' => 78.90, 'volatility' => 2.3]
    ];
    
    $marketData = [];
    
    foreach ($stocks as $stock => $data) {
        // Generate realistic price movement
        $change = (rand(-100, 100) / 100) * $data['volatility'];
        $price = $data['base'] + $change;
        $price = round($price, 2);
        
        $changePercent = ($change / $data['base']) * 100;
        $volume = rand(100000, 2000000);
        $high = $price + rand(1, 5);
        $low = max(0, $price - rand(1, 5));
        
        $marketData[$stock] = [
            'price' => $price,
            'change' => round($change, 2),
            'changePercent' => round($changePercent, 2),
            'volume' => $volume,
            'high' => round($high, 2),
            'low' => round($low, 2),
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
    
    return $marketData;
}

// Function to get market indicators
function getMarketIndicators() {
    return [
        'tadawul' => [
            'value' => 11234.56 + (rand(-50, 50) / 10),
            'change' => rand(-100, 100) / 10,
            'changePercent' => rand(-2, 2) / 10
        ],
        'nomu' => [
            'value' => 2345.78 + (rand(-20, 20) / 10),
            'change' => rand(-50, 50) / 10,
            'changePercent' => rand(-3, 3) / 10
        ],
        'oil' => [
            'value' => 89.45 + (rand(-2, 2) / 10),
            'change' => rand(-5, 5) / 10,
            'changePercent' => rand(-3, 3) / 10
        ],
        'gold' => [
            'value' => 2156.78 + (rand(-10, 10) / 10),
            'change' => rand(-20, 20) / 10,
            'changePercent' => rand(-2, 2) / 10
        ],
        'usd' => [
            'value' => 3.75 + (rand(-5, 5) / 100),
            'change' => rand(-10, 10) / 100,
            'changePercent' => rand(-3, 3) / 10
        ]
    ];
}

// Function to get AI analysis from Python
function getAIAnalysis() {
    try {
        // Call Python AI analyzer
        $pythonCmd = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' ? 'python' : 'python3';
        $scriptPath = __DIR__ . "/../ai/api_bridge.py";
        $command = $pythonCmd . " " . escapeshellarg($scriptPath) . " analyze_all 2>&1";
        $output = shell_exec($command);
        
        if ($output) {
            $result = json_decode($output, true);
            if ($result && $result['success']) {
                return $result['data'];
            }
        }
    } catch (Exception $e) {
        error_log("AI Analysis Error: " . $e->getMessage());
    }
    
    // Fallback to basic analysis if Python fails
    $trends = ['صاعد', 'هابط', 'مستقر'];
    $recommendations = [
        'شراء الأسهم المصرفية',
        'الاحتفاظ بأسهم النفط',
        'الحذر من أسهم التجزئة',
        'شراء الأسهم التقنية',
        'بيع الأسهم العقارية'
    ];
    
    return [
        'trend' => $trends[array_rand($trends)],
        'confidence' => rand(70, 95),
        'support' => 11200 + rand(-100, 100),
        'resistance' => 11400 + rand(-100, 100),
        'recommendations' => array_rand(array_flip($recommendations), 3),
        'risk_level' => ['منخفض', 'متوسط', 'عالي'][array_rand([0, 1, 2])],
        'timestamp' => date('Y-m-d H:i:s')
    ];
}

// Function to get price predictions from Python
function getPricePredictions() {
    try {
        // Call Python AI analyzer for predictions
        $pythonCmd = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' ? 'python' : 'python3';
        $scriptPath = __DIR__ . "/../ai/api_bridge.py";
        $command = $pythonCmd . " " . escapeshellarg($scriptPath) . " get_predictions 2>&1";
        $output = shell_exec($command);
        
        if ($output) {
            $result = json_decode($output, true);
            if ($result && $result['success']) {
                return $result['data'];
            }
        }
    } catch (Exception $e) {
        error_log("Price Prediction Error: " . $e->getMessage());
    }
    
    // Fallback to basic predictions if Python fails
    $stocks = ['الراجحي', 'سابك', 'الاتصالات السعودية', 'البنك الأهلي', 'الرياض'];
    $predictions = [];
    
    foreach ($stocks as $stock) {
        $currentPrice = rand(20, 100);
        $predictedChange = (rand(-15, 15) / 100) * $currentPrice;
        $predictedPrice = $currentPrice + $predictedChange;
        
        $predictions[$stock] = [
            'current_price' => round($currentPrice, 2),
            'predicted_price' => round($predictedPrice, 2),
            'predicted_change' => round($predictedChange, 2),
            'predicted_change_percent' => round(($predictedChange / $currentPrice) * 100, 2),
            'confidence' => rand(75, 95),
            'timeframe' => 'أسبوع واحد'
        ];
    }
    
    return $predictions;
}

// Function to get live market data for dashboard
function getLiveMarketData() {
    $baseIndex = 10885;
    $indexChange = (rand(-200, 200) / 100);
    $indexValue = $baseIndex + $indexChange;
    
    return [
        'market_summary' => [
            'liquidity' => round(rand(30, 70), 2),
            'total_companies' => 148,
            'up_companies' => rand(5, 25),
            'down_companies' => rand(80, 120),
            'total_deals' => rand(400000, 500000),
            'trading_value' => rand(3000000000, 4000000000),
            'trading_volume' => rand(200000000, 300000000),
            'index_value' => round($indexValue, 2),
            'index_change' => round($indexChange, 2),
            'index_points' => round($indexChange * 100, 2),
            'market_status' => 'مغلق',
            'market_time' => date('H:i:s')
        ],
        'ohlc_data' => [
            'open' => round($baseIndex + rand(-50, 50), 3),
            'high' => round($baseIndex + rand(0, 100), 3),
            'low' => round($baseIndex - rand(0, 100), 3),
            'close' => round($indexValue, 3)
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ];
}

// Function to get stock data for charts
function getStockData() {
    $symbol = $_GET['symbol'] ?? 'TASI';
    $period = $_GET['period'] ?? '30d';
    
    $data = [];
    $basePrice = 10885;
    $days = ($period === '30d') ? 30 : (($period === '1y') ? 365 : 7);
    
    for ($i = 0; $i < $days; $i++) {
        $date = date('Y-m-d', strtotime("-$i days"));
        $open = $basePrice + (rand(-100, 100) / 10);
        $close = $open + (rand(-50, 50) / 10);
        $high = max($open, $close) + (rand(0, 30) / 10);
        $low = min($open, $close) - (rand(0, 30) / 10);
        $volume = rand(500000, 2000000);
        
        $data[] = [
            'date' => $date,
            'open' => round($open, 2),
            'high' => round($high, 2),
            'low' => round($low, 2),
            'close' => round($close, 2),
            'volume' => $volume
        ];
    }
    
    return array_reverse($data);
}

// Function to get market list
function getMarketList() {
    return [
        [
            'symbol' => 'TASI',
            'name' => 'مؤشر تداول',
            'icon' => 'fas fa-chart-line',
            'price' => 10885.58,
            'change' => -11.81,
            'change_percent' => -0.11
        ],
        [
            'symbol' => 'MT30',
            'name' => 'مؤشر السوق الموازي',
            'icon' => 'fas fa-chart-bar',
            'price' => 2345.78,
            'change' => 15.23,
            'change_percent' => 0.65
        ],
        [
            'symbol' => 'TENI',
            'name' => 'مؤشر النفط',
            'icon' => 'fas fa-oil-can',
            'price' => 89.45,
            'change' => -2.34,
            'change_percent' => -2.55
        ],
        [
            'symbol' => '2030',
            'name' => 'مؤشر 2030',
            'icon' => 'fas fa-target',
            'price' => 1567.89,
            'change' => 23.45,
            'change_percent' => 1.52
        ],
        [
            'symbol' => '2222',
            'name' => 'الزيت العربية',
            'icon' => 'fas fa-industry',
            'price' => 28.90,
            'change' => -0.45,
            'change_percent' => -1.53
        ],
        [
            'symbol' => 'TMTI',
            'name' => 'المواد الاساسية',
            'icon' => 'fas fa-cube',
            'price' => 3456.78,
            'change' => 67.89,
            'change_percent' => 2.01
        ],
        [
            'symbol' => '1120',
            'name' => 'الراجحي',
            'icon' => 'fas fa-university',
            'price' => 45.67,
            'change' => 1.23,
            'change_percent' => 2.77
        ],
        [
            'symbol' => '2010',
            'name' => 'سابك',
            'icon' => 'fas fa-flask',
            'price' => 89.45,
            'change' => -2.34,
            'change_percent' => -2.55
        ],
        [
            'symbol' => '7010',
            'name' => 'الاتصالات السعودية',
            'icon' => 'fas fa-phone',
            'price' => 34.56,
            'change' => 0.78,
            'change_percent' => 2.31
        ],
        [
            'symbol' => '1180',
            'name' => 'البنك الأهلي',
            'icon' => 'fas fa-university',
            'price' => 23.45,
            'change' => -0.67,
            'change_percent' => -2.78
        ]
    ];
}

// Main API logic
try {
    $action = $_GET['action'] ?? 'market_data';
    
    switch ($action) {
        case 'market_data':
            $response = [
                'success' => true,
                'data' => getMarketData(),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'indicators':
            $response = [
                'success' => true,
                'data' => getMarketIndicators(),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'ai_analysis':
            $response = [
                'success' => true,
                'data' => getAIAnalysis(),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'predictions':
            $response = [
                'success' => true,
                'data' => getPricePredictions(),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'live_market_data':
            $response = [
                'success' => true,
                'data' => getLiveMarketData(),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'stock_data':
            $response = [
                'success' => true,
                'data' => getStockData(),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'market_list':
            $response = [
                'success' => true,
                'data' => getMarketList(),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'all':
            $response = [
                'success' => true,
                'data' => [
                    'market_data' => getMarketData(),
                    'indicators' => getMarketIndicators(),
                    'ai_analysis' => getAIAnalysis(),
                    'predictions' => getPricePredictions(),
                    'live_market_data' => getLiveMarketData(),
                    'market_list' => getMarketList()
                ],
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        default:
            $response = [
                'success' => false,
                'error' => 'Invalid action parameter',
                'available_actions' => ['market_data', 'indicators', 'ai_analysis', 'predictions', 'all']
            ];
    }
    
} catch (Exception $e) {
    $response = [
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ];
}

// Return JSON response
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?> 