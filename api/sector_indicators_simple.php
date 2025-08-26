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

// Mock sector data
function getMockSectorData() {
    $sectors = [
        'capitals' => [
            'name' => 'مؤشر رأس المال',
            'value' => 12567.89 + (rand(-100, 100) / 10),
            'change' => rand(-50, 50) / 10,
            'change_percent' => rand(-3, 3) / 10,
            'volume' => rand(1000000, 5000000)
        ],
        'banks' => [
            'name' => 'مؤشر البنوك',
            'value' => 9876.54 + (rand(-100, 100) / 10),
            'change' => rand(-50, 50) / 10,
            'change_percent' => rand(-3, 3) / 10,
            'volume' => rand(2000000, 8000000)
        ],
        'materials' => [
            'name' => 'مؤشر المواد الأساسية',
            'value' => 8765.43 + (rand(-100, 100) / 10),
            'change' => rand(-50, 50) / 10,
            'change_percent' => rand(-3, 3) / 10,
            'volume' => rand(800000, 3000000)
        ],
        'energy' => [
            'name' => 'مؤشر الطاقة',
            'value' => 11234.56 + (rand(-100, 100) / 10),
            'change' => rand(-50, 50) / 10,
            'change_percent' => rand(-3, 3) / 10,
            'volume' => rand(1500000, 6000000)
        ],
        'telecom' => [
            'name' => 'مؤشر الاتصالات',
            'value' => 7654.32 + (rand(-100, 100) / 10),
            'change' => rand(-50, 50) / 10,
            'change_percent' => rand(-3, 3) / 10,
            'volume' => rand(600000, 2500000)
        ],
        'real_estate' => [
            'name' => 'مؤشر العقارات',
            'value' => 6543.21 + (rand(-100, 100) / 10),
            'change' => rand(-50, 50) / 10,
            'change_percent' => rand(-3, 3) / 10,
            'volume' => rand(400000, 2000000)
        ],
        'transportation' => [
            'name' => 'مؤشر النقل',
            'value' => 5432.10 + (rand(-100, 100) / 10),
            'change' => rand(-50, 50) / 10,
            'change_percent' => rand(-3, 3) / 10,
            'volume' => rand(300000, 1500000)
        ],
        'utilities' => [
            'name' => 'مؤشر المرافق',
            'value' => 4321.09 + (rand(-100, 100) / 10),
            'change' => rand(-50, 50) / 10,
            'change_percent' => rand(-3, 3) / 10,
            'volume' => rand(200000, 1000000)
        ],
        'consumer_goods' => [
            'name' => 'مؤشر السلع الاستهلاكية',
            'value' => 3210.98 + (rand(-100, 100) / 10),
            'change' => rand(-50, 50) / 10,
            'change_percent' => rand(-3, 3) / 10,
            'volume' => rand(500000, 2000000)
        ],
        'healthcare' => [
            'name' => 'مؤشر الرعاية الصحية',
            'value' => 2109.87 + (rand(-100, 100) / 10),
            'change' => rand(-50, 50) / 10,
            'change_percent' => rand(-3, 3) / 10,
            'volume' => rand(300000, 1200000)
        ]
    ];
    
    return $sectors;
}

// Main response
try {
    $action = $_GET['action'] ?? 'all';
    
    switch ($action) {
        case 'sectors':
            $response = [
                'success' => true,
                'data' => getMockSectorData(),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'sector':
            $sector = $_GET['sector'] ?? 'capitals';
            $sectors = getMockSectorData();
            
            if (isset($sectors[$sector])) {
                $response = [
                    'success' => true,
                    'data' => $sectors[$sector],
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            } else {
                $response = [
                    'success' => false,
                    'error' => 'القطاع غير موجود',
                    'available_sectors' => array_keys($sectors),
                    'timestamp' => date('Y-m-d H:i:s')
                ];
            }
            break;
            
        case 'all':
        default:
            $response = [
                'success' => true,
                'data' => [
                    'sectors' => getMockSectorData(),
                    'summary' => [
                        'total_sectors' => 10,
                        'positive_sectors' => rand(5, 8),
                        'negative_sectors' => rand(2, 5),
                        'market_sentiment' => 'إيجابي'
                    ]
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