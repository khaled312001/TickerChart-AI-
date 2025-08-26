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

// Mock AI analysis data
function getMockAIAnalysis() {
    return [
        'الراجحي' => [
            'trend_analysis' => [
                'trend' => 'صاعد',
                'trend_strength' => 'قوي',
                'rsi' => 62.33,
                'rsi_signal' => 'محايد',
                'current_price' => 95.3,
                'sma_20' => 94.75,
                'sma_50' => 94.42
            ],
            'price_prediction' => [
                'predicted_price' => 95.07,
                'confidence' => 65.0,
                'current_price' => 95.3,
                'predicted_change' => -0.23,
                'predicted_change_percent' => -0.24,
                'days_ahead' => 7,
                'method' => 'simple_trend'
            ],
            'risk_analysis' => [
                'risk_level' => 'متوسط',
                'volatility' => 21.69,
                'var_95' => -1.93,
                'support_level' => 92.8,
                'resistance_level' => 96.1,
                'current_price' => 95.3
            ]
        ],
        'سابك' => [
            'trend_analysis' => [
                'trend' => 'صاعد',
                'trend_strength' => 'قوي',
                'rsi' => 71.58,
                'rsi_signal' => 'مفرط في الشراء',
                'current_price' => 59.2,
                'sma_20' => 56.09,
                'sma_50' => 55.58
            ],
            'price_prediction' => [
                'predicted_price' => 60.92,
                'confidence' => 65.0,
                'current_price' => 59.2,
                'predicted_change' => 1.72,
                'predicted_change_percent' => 2.9,
                'days_ahead' => 7,
                'method' => 'simple_trend'
            ],
            'risk_analysis' => [
                'risk_level' => 'متوسط',
                'volatility' => 16.01,
                'var_95' => -1.8,
                'support_level' => 53.0,
                'resistance_level' => 59.3,
                'current_price' => 59.2
            ]
        ],
        'الاتصالات السعودية' => [
            'trend_analysis' => [
                'trend' => 'صاعد',
                'trend_strength' => 'قوي',
                'rsi' => 65.01,
                'rsi_signal' => 'محايد',
                'current_price' => 42.86,
                'sma_20' => 42.05,
                'sma_50' => 41.84
            ],
            'price_prediction' => [
                'predicted_price' => 43.39,
                'confidence' => 65.0,
                'current_price' => 42.86,
                'predicted_change' => 0.53,
                'predicted_change_percent' => 1.23,
                'days_ahead' => 7,
                'method' => 'simple_trend'
            ],
            'risk_analysis' => [
                'risk_level' => 'متوسط',
                'volatility' => 19.0,
                'var_95' => -1.5,
                'support_level' => 40.78,
                'resistance_level' => 43.22,
                'current_price' => 42.86
            ]
        ]
    ];
}

// Main response
try {
    $action = $_GET['action'] ?? 'trend_analysis';
    
    switch ($action) {
        case 'trend_analysis':
            $analysis = getMockAIAnalysis();
            $summary = [
                'total_stocks' => count($analysis),
                'bullish_stocks' => 3,
                'bearish_stocks' => 0,
                'neutral_stocks' => 0,
                'market_sentiment' => 'إيجابي',
                'average_confidence' => 65.0,
                'timestamp' => date('Y-m-d H:i:s')
            ];
            
            $recommendations = [
                'شراء الراجحي بحذر - اتجاه إيجابي مع مخاطر متوسطة',
                'شراء سابك بحذر - اتجاه إيجابي مع مخاطر متوسطة',
                'شراء الاتصالات السعودية بحذر - اتجاه إيجابي مع مخاطر متوسطة'
            ];
            
            $response = [
                'success' => true,
                'data' => [
                    'trend' => 'صاعد',
                    'confidence' => 65,
                    'support' => 92.8,
                    'resistance' => 96.1,
                    'recommendations' => $recommendations
                ],
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'analyze_stock':
            $stock = $_GET['stock'] ?? 'الراجحي';
            $analysis = getMockAIAnalysis();
            
            if (isset($analysis[$stock])) {
                $response = [
                    'success' => true,
                    'data' => $analysis[$stock],
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            } else {
                $response = [
                    'success' => false,
                    'error' => 'السهم غير موجود',
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            }
            break;
            
        default:
            $response = [
                'success' => false,
                'error' => 'إجراء غير معروف',
                'available_actions' => ['trend_analysis', 'analyze_stock'],
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