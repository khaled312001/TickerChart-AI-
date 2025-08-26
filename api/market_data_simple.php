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

// Main response
try {
    $action = $_GET['action'] ?? 'all';
    
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
            
        case 'all':
        default:
            $response = [
                'success' => true,
                'data' => [
                    'market_data' => getMarketData(),
                    'indicators' => getMarketIndicators()
                ],
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
}
?> 