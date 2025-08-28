<?php
// Simple Status Checker
header('Content-Type: application/json; charset=utf-8');

$status = [
    'timestamp' => date('Y-m-d H:i:s'),
    'servers' => [
        'php_server' => [
            'port' => 8000,
            'status' => 'unknown',
            'url' => 'http://127.0.0.1:8000'
        ],
        'python_ai_server' => [
            'port' => 8001,
            'status' => 'unknown',
            'url' => 'http://127.0.0.1:8001'
        ]
    ],
    'api_endpoints' => [
        'market_api' => [
            'url' => '/api/real-time-market-api.php',
            'status' => 'unknown'
        ]
    ]
];

// Check PHP server
$phpContext = stream_context_create(['http' => ['timeout' => 2]]);
$phpResponse = @file_get_contents('http://127.0.0.1:8000', false, $phpContext);
if ($phpResponse !== false) {
    $status['servers']['php_server']['status'] = 'running';
} else {
    $status['servers']['php_server']['status'] = 'stopped';
}

// Check Python AI server
$pythonResponse = @file_get_contents('http://127.0.0.1:8001', false, $phpContext);
if ($pythonResponse !== false) {
    $status['servers']['python_ai_server']['status'] = 'running';
} else {
    $status['servers']['python_ai_server']['status'] = 'stopped';
}

// Check market API
$apiResponse = @file_get_contents('http://127.0.0.1:8000/api/real-time-market-api.php?action=market_overview', false, $phpContext);
if ($apiResponse !== false) {
    $apiData = json_decode($apiResponse, true);
    if ($apiData && isset($apiData['success'])) {
        $status['api_endpoints']['market_api']['status'] = 'working';
        $status['api_endpoints']['market_api']['data'] = $apiData;
    } else {
        $status['api_endpoints']['market_api']['status'] = 'error';
    }
} else {
    $status['api_endpoints']['market_api']['status'] = 'unreachable';
}

echo json_encode($status, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?> 